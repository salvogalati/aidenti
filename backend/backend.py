import logging
import os
from logging.handlers import RotatingFileHandler

from config import AVATAR_FOLDER, AVATAR_URI, DEBUG, JWT_SECRET_KEY, PORT
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.dashboard import dashboard_bp
from routes.login_signin import login_signin_bp

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.register_blueprint(login_signin_bp)
app.register_blueprint(dashboard_bp)

JWTManager(app)
CORS(app)

# ==== LOGGING CONFIGURATION ====

# Determine log level based on DEBUG flag
log_level = logging.DEBUG if DEBUG else logging.INFO

# Create a dedicated logger for the application
logger = logging.getLogger("aidenti")
logger.setLevel(log_level)

# File handler with rotation: max 1MB per file, keep 3 backups
file_handler = RotatingFileHandler(
    filename="app.log", maxBytes=1_000_000, backupCount=3, encoding="utf-8"
)
file_handler.setLevel(log_level)

# Define log message format
formatter = logging.Formatter(
    "%(asctime)s %(levelname)s [%(name)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
)
file_handler.setFormatter(formatter)

# Console handler for stdout, useful in Docker or development
console_handler = logging.StreamHandler()
console_handler.setLevel(log_level)
console_handler.setFormatter(formatter)

# Attach handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Integrate Flask's logger with the configured handlers
app.logger.handlers = logger.handlers
app.logger.setLevel(logger.level)

# === END LOGGING CONFIGURATION ===


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
    if len(filenames) == 0:
        app.logger.warning("No PNG Avatar present in folder")
    avatars = []
    for idx, filename in filenames.items():
        data_uri = f"{AVATAR_URI}{idx}"
        avatars.append({"id": idx, "src": data_uri})
    return jsonify(avatars), 200


if __name__ == "__main__":
    app.run(debug=DEBUG, port=PORT)
