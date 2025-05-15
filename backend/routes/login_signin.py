import sys
from pathlib import Path
import email_verification

sys.path.append(str(Path(__file__).parent.parent))

import uuid

import db
from flask import Blueprint, jsonify, request, render_template

from config import BACKEND_URL

login_signin_bp = Blueprint("login_signin", __name__)


@login_signin_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    check, message, row = db.check_credentials(email, password)

    if check:
        return (
            jsonify(
                {
                    "message": message,
                    "id": row["id"],
                    "firstAccess": bool(row["first-access"]),
                }
            ),
            200,
        )
    else:
        return jsonify({"message": message}), 401


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
    res, message = email_verification.send_verification_email(email, verification_link)
    if res:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"message": message}), 400


# @login_signin_bp.route("/verify", methods=["PATCH"])
# def verify_email():
#     data = request.get_json()
#     token = data.get("token")
#     if not token:
#         return jsonify({"status": "error", "message": "Missing token"}), 400

#     result, message = db.verify_user_by_token(token)

#     if not result:
#         return jsonify({"status": "error", "message": message}), 404
#     else:
#         return jsonify({"status": "success", "message": message}), 200


@login_signin_bp.route("/api/first-access", methods=["POST"])
def first_access():
    data = request.get_json()
    user_id = data.get("id")
    username = data.get("username")
    dob = data.get("date_of_birth")
    gender = data.get("gender")
    avatar_id = data.get("avatar_id")

    if user_id == "" or user_id is None:
        return jsonify({"message": "Internal Error, please retry"}), 400

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
        file="users.csv", user_id=user_id, field="first-access", value=True
    ):
        return jsonify({"message": "Failed to update internal database"}), 500

    res = db.update_dashboard_db(data)
    if res:
        return jsonify({"message": "dashboard entry created", "id": user_id}), 200
    else:
        return jsonify({"message": "Failed to update dashboard database"}), 500

@login_signin_bp.route("/verify-email")
def verify_email():
    email_token = request.args.get('token', None)
    if not email_token:
        message = "Missing token"
    else:
        result, message = db.verify_user_by_token(email_token)

    return render_template("verify_email.html", message=message)