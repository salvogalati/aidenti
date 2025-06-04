import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import os
import pandas as pd
import db
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from config import (
    DASHBOARD_CSV,
)

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/get_userdata", methods=["POST"])
@jwt_required()
def get_userdata():
    data = request.get_json()
    user_id = data.get("id")
    keys = data.get("keys", [])

    if len(keys) == 0:
        return jsonify({"message": "Please specify the keys"}), 404

    if not db.user_exists(field="id", value=user_id):
        return jsonify({"message": "User not found"}), 404

    token_user_id = get_jwt_identity()
    if str(user_id) != str(token_user_id):
        return jsonify({"message": "Unauthorized: token does not match user ID"}), 403

    user_data, message = db.get_dashboard_user_data(user_id, keys)
    return jsonify({"message": message, "user_data": user_data}), 200

@dashboard_bp.route("/dashboard/change_username_avatar", methods=["PATCH"])
@jwt_required()
def change_username_avatar():
    # 1) Preleva i dati e verifica che siano presenti tutti i campi
    data = request.get_json() or {}
    user_id   = data.get("id")
    username  = data.get("username")
    avatar_src = data.get("avatar_src")

    if not all([user_id, username, avatar_src]):
        return jsonify({"message": "Missing required keys: id, username, avatar_id"}), 400

    # 2) Verifica che l'utente esista
    if not db.user_exists(field="id", value=user_id):
        return jsonify({"message": "User not found"}), 404

    # 3) Verifica che l'ID nel token corrisponda a user_id
    token_user_id = get_jwt_identity()
    if str(user_id) != str(token_user_id):
        return jsonify({"message": "Unauthorized: token does not match user ID"}), 403

    if os.path.exists(DASHBOARD_CSV):
        df = pd.read_csv(DASHBOARD_CSV)
        if not df[df["username"] == data.get("username")].empty:
            return jsonify({"message": "Username already exist"}), 500

    # 4) Prova a modificare username e avatar_id nel CSV
    success_usr = db.change_cell(user_id, DASHBOARD_CSV, "username", username)
    success_av  = db.change_cell(user_id, DASHBOARD_CSV, "avatar_id", os.path.basename(avatar_src))
    if not (success_usr and success_av):
        return jsonify({"message": "Failed to update database"}), 500

    return jsonify({"message": "Data correctly changed"}), 200
