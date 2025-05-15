import os

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from routes.login_signin import login_signin_bp
from routes.dashboard import dashboard_bp

from config import AVATAR_FOLDER, AVATAR_URI

app = Flask(__name__)
app.register_blueprint(login_signin_bp)
app.register_blueprint(dashboard_bp)

CORS(app)

@app.route("/test_get", methods=["GET"])
def test_get():
    return jsonify("This is a Test GET API!"), 200


@app.route("/test_post", methods=["POST"])
def test_post():
    print("Headers:", dict(request.headers))
    print("Query Params:", request.args.to_dict())

    if request.is_json:
        print("JSON Body:", request.get_json())
    else:
        print("Form Data:", request.form.to_dict())

    return {"status": "received"}, 200


@app.route("/")
def index():
    return render_template("home.html")


@app.route("/api/avatar_images", methods=["GET"])
def get_images():
    filenames = {
        f.name: f
        for f in os.scandir(AVATAR_FOLDER)
        if os.path.isfile(f.path)
        and f.name.lower().endswith(".png")
        and "Avatar" in f.name
    }
    avatars = []
    for idx, filename in filenames.items():
        data_uri = f"{AVATAR_URI}{idx}"
        avatars.append({"id": idx, "src": data_uri})
    return jsonify(avatars), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)
