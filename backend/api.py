from flask import Flask, request, jsonify
from flask_cors import CORS
from db import user_exists, check_credentials, add_user, load_users

app = Flask(__name__)

CORS(app)
@app.route('/test_get', methods=['GET'])
def test_get():
    return jsonify("This is a Test GET API!"), 200

@app.route('/test_post', methods=['POST'])
def test_post():
    print("Headers:", dict(request.headers))
    print("Query Params:", request.args.to_dict())
    
    if request.is_json:
        print("JSON Body:", request.get_json())
    else:
        print("Form Data:", request.form.to_dict())

    return {"status": "received"}, 200

@app.route('/')
def index():
    return "<h1>Home page di Nicola-Salvatore API!</h1>"


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    email = data.get('email')
    password = data.get('password')
    check, message = check_credentials(email, password)
    if check:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'message': message}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if user_exists(email):
        return jsonify({'message': 'Email already exists'}), 409

    add_user(email, password)
    return jsonify({'message': 'User registered successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
