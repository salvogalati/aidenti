from typing import Any, Dict, Optional, Tuple

import jwt
from flask import Request, Response, jsonify


def decode_supabase_token(token: str) -> Dict[str, Any]:

    try:
        payload = jwt.decode(token, options={"verify_signature": False})
    except jwt.PyJWTError as e:
        raise ValueError(f"Token non valido: {e}")

    return payload


def validate_user_token(
    request: Request, expected_user_id: str
) -> Tuple[Optional[Dict[str, Any]], Optional[Tuple[Response, int]]]:
    """
    Extracts and decodes the Supabase JWT from the Authorization header in `request`,
    verifies that the `sub` claim matches `expected_user_id`, and returns the payload.

    Returns:
      - payload (dict) if validation succeeds
      - (response, status_code) tuple if any check fails
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, (
            jsonify({"message": "Missing or invalid Authorization header"}),
            401,
        )

    supabase_token = auth_header.split(" ", 1)[1]
    try:
        payload = decode_supabase_token(supabase_token)
    except ValueError as e:
        return None, (jsonify({"message": str(e)}), 401)

    token_user_id = payload.get("sub")
    if not token_user_id:
        return None, (jsonify({"message": "Token payload missing 'sub' claim"}), 401)

    if str(expected_user_id) != str(token_user_id):
        return None, (
            jsonify({"message": "Unauthorized: token does not match user ID"}),
            403,
        )

    return payload, None
