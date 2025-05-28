import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import db
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

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
