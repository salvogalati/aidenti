import sys
from pathlib import Path

from utils import send_email

sys.path.append(str(Path(__file__).parent.parent))

import uuid
from datetime import datetime, timedelta

import db
from config import ACCESS_TOKEN_VALIDITY_MINUTES, BACKEND_URL, CSV_FILE
from flask import Blueprint, jsonify, render_template, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

login_signin_bp = Blueprint("login_signin", __name__)


@login_signin_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    check, message, user_row = db.check_credentials(email, password)

    if check:
        access_token = create_access_token(
            identity=user_row["id"],
            expires_delta=timedelta(minutes=ACCESS_TOKEN_VALIDITY_MINUTES),
        )
        refresh_token, refresh_token_expiry = db.creating_refresh_token(user_row["id"])
        return (
            jsonify(
                {
                    "message": message,
                    "id": user_row["id"],
                    "firstAccess": bool(user_row["first-access"]),
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                }
            ),
            200,
        )
    else:
        return (
            jsonify(
                {
                    "message": message,
                }
            ),
            401,
        )

@login_signin_bp.route("/fast_login", methods=["GET"])
@jwt_required()
def fast_login():

    token_user_id = get_jwt_identity()
    if db.user_exists(token_user_id, "id"):
        user_row = db.get_user_data_by_id(token_user_id)
        return jsonify(
                {
                    "message": "Access allowed",
                    "id": token_user_id,
                    "firstAccess": bool(user_row["first-access"]),
                }
            ), 200
    else:
        return jsonify({"message":"Invalid User"}), 401


@login_signin_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if db.user_exists(email):
        return jsonify({"message": "Email already exists"}), 409

    token = str(uuid.uuid4())
    result, message = db.add_user(email, password, token)
    if not result:
        return jsonify({"message": message}), 400
    verification_link = f"{BACKEND_URL}/verify-email?token={token}"
    res, message = send_email.send_verification_email(email, verification_link)
    if res:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"message": message}), 400


@login_signin_bp.route("/refresh_token", methods=["POST"])
def refresh_token():
    req = request.get_json()
    rt = req.get("refresh_token", "")

    df = db.load_users()
    user = df[df["refresh_token"] == rt]
    if user.empty:
        return jsonify(msg="Refresh token not valid"), 401

    expiry = datetime.fromisoformat(user.iloc[0]["refresh_token_expiry"])
    if datetime.now() > expiry:
        return jsonify(msg="Refresh token expired"), 401

    user_id = user.iloc[0]["id"]
    new_access = create_access_token(
        identity=user_id, expires_delta=timedelta(minutes=10)
    )

    refresh_token, refresh_token_expiry = db.creating_refresh_token(user.iloc[0]["id"])

    return jsonify(access_token=new_access, refresh_token=refresh_token), 200


@login_signin_bp.route("/logout", methods=["GET"])
@jwt_required()
def logout():
    user_id = get_jwt_identity()

    db.change_cell(user_id, CSV_FILE, "refresh_token", "")
    db.change_cell(user_id, CSV_FILE, "refresh_token_expiry", "")
    return jsonify(message="Logout effettuato"), 200


@login_signin_bp.route("/api/first-access", methods=["POST"])
@jwt_required()
def first_access():
    data = request.get_json()
    user_id = data.get("id")
    username = data.get("username")
    dob = data.get("date_of_birth")
    gender = data.get("gender")
    avatar_id = data.get("avatar_id")

    if user_id == "" or user_id is None:
        return jsonify({"message": "Internal Error, please retry"}), 400
    
    token_user_id = get_jwt_identity()
    if str(user_id) != str(token_user_id):
        return jsonify({"message": "Unauthorized: token does not match user ID"}), 403

    # validate required fields
    required = {
        "id": user_id,
        "username": username,
        "date_of_birth": dob,
        "gender": gender,
        "avatar_id": avatar_id,
    }
    missing_params = [field for field, value in required.items() if not value]
    if missing_params:
        return jsonify({"message": f"Missing required fields {missing_params}"}), 400

    if not db.user_exists(field="id", value=user_id):
        return jsonify({"message": "User not found"}), 404

    if not db.change_cell(
        file=CSV_FILE, user_id=user_id, field="first-access", value=True
    ):
        return jsonify({"message": "Failed to update internal database"}), 500

    res = db.update_dashboard_db(data)
    if res:
        return jsonify({"message": "dashboard entry created", "id": user_id}), 200
    else:
        return jsonify({"message": "Failed to update dashboard database"}), 500


@login_signin_bp.route("/verify-email")
def verify_email():
    email_token = request.args.get("token", None)
    if not email_token:
        message = "Missing token"
    else:
        result, message = db.verify_user_by_token(email_token)

    return render_template("verify_email.html", message=message)


@login_signin_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    ok, msg = db.generate_and_save_reset_token(email)
    status = 200 if ok else 404
    return jsonify(message=msg), status


@login_signin_bp.route("/reset-password")
def reset_password_route():
    token = request.args.get("token", None)
    valid, message = db.check_expiration_token(token)
    print(valid, message)
    return render_template(
        "reset_password.html",
        backend_url=BACKEND_URL,
        expired=not valid,
    )


@login_signin_bp.route("/reset-password-change", methods=["PATCH"])
def reset_password_change_route():
    data = request.get_json()
    token = data.get("token")
    new_pw = data.get("password")
    ok, msg = db.reset_password_with_token(token, new_pw)
    status = 200 if ok else 400
    return jsonify(message=msg), status
