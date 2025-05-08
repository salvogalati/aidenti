from flask import Flask, request, jsonify
from flask_cors import CORS
import db
from email_verification import send_verification_email
import uuid
import os
import base64

app = Flask(__name__)

CORS(app)
AVATAR_FOLDER = "./avatars"

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
    check, message, row = db.check_credentials(email, password)
    
    if check:
        return jsonify({'message': message, "id":row['id'], "firstAccess": bool(row['first-access'])}), 200
    else:
        return jsonify({'message': message}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if db.user_exists(email):
        return jsonify({'message': 'Email already exists'}), 409

    token = str(uuid.uuid4())
    db.add_user(email, password, token)
    verification_link = f"http://localhost:8081/verify?token={token}"
    send_verification_email(email, verification_link)
    return jsonify({'message': 'User registered successfully \n Check your email to validate your account'}), 201

@app.route('/verify', methods=['PATCH'])
def verify_email():
    data = request.get_json()
    token = data.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Missing token'}), 400

    result, message = db.verify_user_by_token(token)

    if not result:
        return jsonify({'status': 'error', 'message': message}), 404
    else:
        return jsonify({'status': 'success', 'message': message}), 200

@app.route('/api/avatar_images', methods=['GET'])
def get_images():
    filenames = {
        f.name: f for f in os.scandir(AVATAR_FOLDER)
        if os.path.isfile(f.path) and f.name.lower().endswith('.png') and "Avatar" in f.name
    }
    avatars = []
    for idx, filename in filenames.items():
        data_uri = f"https://raw.githubusercontent.com/nmarmugi/nicola-salvatore/main/backend/avatars/{idx}" 
        avatars.append({
            "id": idx,
            "src": data_uri
        })
    return jsonify(avatars), 200

@app.route('/api/first-access', methods=['POST'])
def first_access():
    data = request.get_json()
    user_id       = data.get('id')
    username      = data.get('username')
    dob           = data.get('date_of_birth')
    gender        = data.get('gender')
    avatar_id     = data.get('avatar_id')

    # validate required fields
    required = {
        'id': user_id,
        'username': username,
        'date_of_birth': dob,
        'gender': gender,
        'avatar_id': avatar_id
    }
    missing_params = [field for field, value in required.items() if not value]
    if missing_params:
        return jsonify({
            'message': 'Missing required fields',
            'missing_fields': missing_params
        }), 400
    if not all([user_id, username, dob, gender, avatar_id]):
        return jsonify({'message': 'Missing one or more required fields'}), 400
    
    res = db.update_dashboard_db(data)
    if res:
        return jsonify({'message': 'dashboard entry created', 'id': user_id}), 200
    else:
        return jsonify({'message': 'Failed to update dashboard database'}), 500


if __name__ == '__main__':
    app.run(debug=True)
