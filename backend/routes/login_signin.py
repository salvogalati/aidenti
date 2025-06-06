import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import utils
from config import SUPABASE_URL, SUPABASE_KEY
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from supabase import create_client, Client, AuthApiError

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
login_signin_bp = Blueprint("login_signin", __name__)


@login_signin_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    try:
        result = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        user = result.user
        session = result.session
        access_token = session.access_token
        refresh_token = session.refresh_token

        response = ( supabase.table("Dashboard")
                    .select("id")
                    .eq("id", "1229d12c-9b22-4455-b849-7ee42c45489a")
                    .execute()
                    )
        
        first_access_flag = bool(response.data)

        return (
            jsonify({
                "message": "Login effettuato con successo.",
                "id": user["id"],
                "firstAccess": first_access_flag,
                "access_token": access_token,
                "refresh_token": refresh_token,
            }),
            200
        )

    except AuthApiError as e:
        return (
            jsonify({"message": e.message}),
            401
        )


@login_signin_bp.route("/fast_login", methods=["GET"])
@jwt_required()
def fast_login():
    # 1) Recupera l'header Authorization
    auth_header = request.headers.get("Authorization", None)
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing or invalid Authorization header"}), 401

    supabase_token = auth_header.split()[1]

    try:
        user_id = utils.decode_supabase_token(supabase_token)
    except ValueError as e:
        return jsonify({"message": str(e)}), 401

    response = (
        supabase
        .table("auth.users")
        .select("id", "raw_user_meta_data")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    if not response.data:
        return jsonify({"message": "Invalid User"}), 401

    first_access_flag = bool(response.data)

    return (
        jsonify({
            "message":     "Access allowed",
            "id":          user_id,
            "firstAccess": first_access_flag,
        }),
        200,
    )


@login_signin_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    try:
        supabase.auth.sign_up({
            "email":    email,
            "password": password
        })
        return (
            jsonify({"message": "Successful registration. Check your email for the verification link."}),
            201
        )

    except AuthApiError as e:
        return jsonify({"message": e.message}), 400


@login_signin_bp.route("/refresh_token", methods=["POST"])
def refresh_token():
    data = request.get_json()
    old_rt = data.get("refresh_token", "")
    if not old_rt:
        return jsonify({"message": "Refresh token missing"}), 400

    try:
        resp = supabase.auth.refresh_session({"refresh_token": old_rt})
    except AuthApiError:
        return jsonify({"message": "Refresh token non valid o expired"}), 401

    new_access_token  = resp.session.access_token
    new_refresh_token = resp.session.refresh_token

    return jsonify({
        "access_token":  new_access_token,
        "refresh_token": new_refresh_token
    }), 200


@login_signin_bp.route("/logout", methods=["GET"])
@jwt_required()
def logout():
    data = request.get_json()
    access_token  = data.get("access_token", "")
    refresh_token = data.get("refresh_token", "")


    try:
        supabase.auth.set_session({
        "access_token":  access_token,
        "refresh_token": refresh_token
    })
        supabase.auth.sign_out()
    except AuthApiError as e:
        return jsonify(message=e.message), 500


    return jsonify(message="Logout successful"), 200


@login_signin_bp.route("/verify-email")
def verify_email():
    data = request.get_json()
    email = data.get("email")
    email_token = data.get("token")

    if not email or not email_token:
        return jsonify({"message": "Missing email or token"}), 400

    try:
        # Use Supabase Auth to verify the email token
        supabase.auth.verify_otp({
            "email": email,
            "token": email_token,
            "type": "email",
        })
        # If no exception was raised, verification succeeded
        return jsonify({"message": "Email successfully verified."}), 200

    except AuthApiError as e:
        # Supabase will raise an error if the token is invalid or expired
        return jsonify({"message": e.message}), 401

@login_signin_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({"message": "Missing email"}), 400

    try:
        # Trigger Supabase to send a password reset email
        supabase.auth.reset_password_for_email(email)
        return jsonify({"message": "Password reset email sent"}), 200

    except AuthApiError as e:
        # Supabase will raise an error if the email is not found or another issue occurs
        # In practice, Supabase does not reveal whether the email exists; you can still return a generic message
        return jsonify({"message": e.message}), 404

@login_signin_bp.route("/reset-password")
def reset_password():

    data = request.get_json()
    email        = data.get("email")
    recovery_token = data.get("token")
    new_password = data.get("new_password")

    if not email or not recovery_token or not new_password:
        return jsonify({"message": "Missing email, token, or new_password"}), 400

    try:
        # Call Supabase to verify the recovery token and set the new password
        supabase.auth.verify_otp({
            "email":    email,
            "token":    recovery_token,
            "type":     "recovery",
            "password": new_password
        })
        # If no exception was raised, the password was reset successfully
        return jsonify({"message": "Password has been reset."}), 200

    except AuthApiError as e:
        # Supabase will raise an error if the token is invalid, expired, or other issues
        return jsonify({"message": e.message}), 401
