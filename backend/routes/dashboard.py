import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from utils import utils
from config import SUPABASE_KEY, SUPABASE_URL, AVATAR_URI
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from supabase import AuthApiError, Client, create_client

dashboard_bp = Blueprint("dashboard", __name__)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
login_signin_bp = Blueprint("login_signin", __name__)


@dashboard_bp.route("/api/first-access", methods=["POST"])
@jwt_required()
def first_access():

    data = request.get_json() or {}
    user_id = data.get("id")
    username = data.get("username")
    dob = data.get("date_of_birth")
    gender = data.get("gender")
    avatar_id = data.get("avatar_id")

    if not user_id:
        return jsonify({"message": "Internal error: missing user ID"}), 400

    payload, error = utils.validate_user_token(request, user_id)
    if error:
        return error

    # 4) Validate required fields
    required_fields = {
        "id": user_id,
        "username": username,
        "date_of_birth": dob,
        "gender": gender,
        "avatar_src": avatar_id,
    }
    missing = [field for field, value in required_fields.items() if not value]
    if missing:
        return jsonify({"message": f"Missing required fields: {missing}"}), 400

    # 6) Insert into Dashboard table
    try:
        insert_data = {
            "id": user_id,
            "username": username,
            "date_of_birth": dob,
            "gender": gender,
            "avatar_src": f"{AVATAR_URI}{avatar_id}",
        }
        supabase.table("Dashboard").insert(insert_data).execute()

        return jsonify({"message": "Dashboard entry created", "id": user_id}), 200

    except AuthApiError as e:
        return jsonify({"message": f"Supabase error: {e.message}"}), 500


@dashboard_bp.route("/api/get_userdata", methods=["POST"])
@jwt_required()
def get_userdata():

    data = request.get_json() or {}
    user_id = data.get("id")
    keys = data.get("keys", [])

    if not isinstance(keys, list) or len(keys) == 0:
        return jsonify({"message": "Please specify the keys"}), 404

    payload, error = utils.validate_user_token(request, user_id)
    if error:
        return error

    try:
        dashboard_resp = (
            supabase.table("Dashboard").select("*").eq("id", user_id).single().execute()
        )
    except AuthApiError as e:
        return jsonify({"message": f"Supabase error: {e.message}"}), 500

    user_data = dashboard_resp.data or {}
    return jsonify({"message": "User data retrieved", "user_data": user_data}), 200

@dashboard_bp.route("/dashboard/change_username_avatar", methods=["PATCH"])
@jwt_required()
def change_username_avatar():
    data = request.get_json() or {}
    user_id   = data.get("id")
    username  = data.get("username")
    avatar_src = data.get("avatar_src") 

    if not all([user_id, username, avatar_src]):
        return jsonify({"message": "Missing required keys: id, username, avatar_src"}), 400

    payload, error = utils.validate_user_token(request, user_id)
    if error:
        return error

    try:
        dup = (
            supabase
            .table("Dashboard")
            .select("id")
            .eq("username", username)
            .neq("id", user_id)
            .limit(1)
            .execute()
        )
        if dup.error:
            raise dup.error
        if dup.data:
            return jsonify({"message": "Username already exists"}), 409
    except AuthApiError as e:
        return jsonify({"message": f"Supabase error checking username: {e.message}"}), 500

    # 4) Esegui l’update su Supabase
    try:
        res = (
            supabase
            .table("Dashboard")
            .update({
                "username": username,
                "avatar_src": avatar_src
            })
            .eq("id", user_id)
            .execute()
        )
        if res.error:
            raise res.error
    except AuthApiError as e:
        return jsonify({"message": f"Supabase error updating record: {e.message}"}), 500

    return jsonify({"message": "Data correctly changed"}), 200