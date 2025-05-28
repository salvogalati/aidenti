import os
import secrets
import traceback
import uuid
from datetime import datetime, timedelta

import pandas as pd
from config import (
    AVATAR_URI,
    BACKEND_URL,
    CSV_FILE,
    DASHBOARD_CSV,
    REFRESH_TOKEN_VALIDITY_DAYS,
)
from utils import send_email


def load_users():
    if not os.path.exists(CSV_FILE):
        df = pd.DataFrame(
            columns=[
                "id",
                "email",
                "password",
                "verified",
                "token-verification",
                "first-access",
                "registration-date",
                "reset_token",
                "reset_token_expiry",
                "refresh_token",
                "refresh_token_expiry",
            ]
        )
        df.to_csv(CSV_FILE, index=False)
    return pd.read_csv(CSV_FILE)


def save_users(df):
    df.to_csv(CSV_FILE, index=False)


def user_exists(value, field="email"):
    df = load_users()
    return value in df[field].values

def get_user_data_by_id(id_):
    df = load_users()
    user_row = df[df["id"] == id_]
    if user_row.empty: return {}
    else: return user_row.iloc[0]


def change_cell(user_id, file, field, value):
    try:
        df = pd.read_csv(file)
        mask = df["id"] == user_id
        df.loc[mask, field] = value
        df.to_csv(file, index=False)
        return True
    except Exception:
        traceback.print_exc()
        return False


def verify_user_by_token(token):
    df = load_users()
    user = df[df["token-verification"] == token]

    if user.empty:
        return False, "User not found 😠"

    if user.iloc[0]["verified"]:
        return True, "Already verified 🤨"

    df.loc[df["token-verification"] == token, "verified"] = True
    save_users(df)
    return True, "Email verified successfully 🥳"


def check_credentials(email, password):
    df = load_users()
    user_row = df[df["email"] == email]
    if user_row.empty:
        return False, "Invalid User", user_row
    if user_row.iloc[0]["password"] != password:
        return False, "Invalid Password", None
    if not user_row.iloc[0]["verified"]:
        return False, "Email not verified", None
    return True, "Login successful", user_row.iloc[0]


def add_user(email, password, token):
    df = load_users()
    new_id = str(uuid.uuid4())
    registration_date = datetime.now().isoformat()
    new_user = pd.DataFrame(
        [[new_id, email, password, False, token, False, registration_date, None, None, None, None]],
        columns=[
            "id",
            "email",
            "password",
            "verified",
            "token-verification",
            "first-access",
            "registration-date",
            "reset_token",
            "reset_token_expiry",
            "refresh_token",
            "refresh_token_expiry",
        ],
    )
    df = pd.concat([df, new_user], ignore_index=True)
    save_users(df)
    return True, "User correctly created"


def generate_and_save_reset_token(email):
    df = load_users()
    user = df[df["email"] == email]
    if user.empty:
        return False, "Email not found"
    if not pd.isna(user.iloc[0]["reset_token"]):
        expiry = datetime.fromisoformat(user.iloc[0]["reset_token_expiry"])
        if datetime.now() < expiry:
            return (
                False,
                "You have already request for a token. Such token is valid for 15 minutes",
            )
    token = secrets.token_urlsafe(32)
    expiry = (datetime.now() + timedelta(minutes=15)).isoformat()
    df.loc[df["email"] == email, "reset_token"] = token
    df.loc[df["email"] == email, "reset_token_expiry"] = expiry
    save_users(df)
    reset_link = f"{BACKEND_URL}/reset-password?token={token}"
    res, message = send_email.send_reset_password_email(
        to_email=email, reset_link=reset_link
    )
    return res, message


def reset_password_with_token(token, new_password):
    res, message = check_expiration_token(token)
    if not res:
        return res, message
    df = load_users()
    df.loc[df["reset_token"] == token, "password"] = new_password
    df.loc[df["reset_token"] == token, "reset_token_expiry"] = ""
    df.loc[df["reset_token"] == token, "reset_token"] = ""
    save_users(df)
    return True, "Password successfully updated"


def creating_refresh_token(user_id, save=True):

    refresh = secrets.token_urlsafe(32)
    refresh_expiry = (
        datetime.now() + timedelta(days=REFRESH_TOKEN_VALIDITY_DAYS)
    ).isoformat()

    change_cell(user_id, CSV_FILE, "refresh_token", refresh)
    change_cell(user_id, CSV_FILE, "refresh_token_expiry", refresh_expiry)
    return refresh, refresh_expiry


def check_expiration_token(token):
    df = load_users()
    user = df[df["reset_token"] == token]
    if user.empty:
        return False, "Token non valido"
    expiry = datetime.fromisoformat(user.iloc[0]["reset_token_expiry"])
    if datetime.now() > expiry:
        return False, "Link expired"

    return True, "OK"


def update_dashboard_db(data):
    try:
        # load or initialize dashboard CSV
        if os.path.exists(DASHBOARD_CSV):
            df = pd.read_csv(DASHBOARD_CSV)
        else:
            df = pd.DataFrame(
                columns=["id", "username", "date_of_birth", "gender", "avatar_id"]
            )

        user_row = df[df["id"] == data.get("id")]
        if not user_row.empty:
            return False
        # append new record
        new_record = pd.DataFrame(
            [
                {
                    "id": data.get("id"),
                    "username": data.get("username"),
                    "date_of_birth": data.get("date_of_birth"),
                    "gender": data.get("gender"),
                    "avatar_id": data.get("avatar_id"),
                }
            ]
        )
        df = pd.concat([df, new_record], ignore_index=True)

        # save back to CSV
        df.to_csv(DASHBOARD_CSV, index=False)
        return True
    except Exception:
        return False


def get_dashboard_user_data(user_id, keys):
    message = "Success"
    df = pd.read_csv(DASHBOARD_CSV)
    user_row = df[df["id"] == user_id].iloc[0]
    valid_keys = [k for k in keys if k in user_row.index]
    unknown = set(keys) - set(valid_keys)
    if len(unknown) > 0:
        message += "fKeys not found and ignored: {unknown}"
    if len(valid_keys) == 0:
        return False, "No requested keys found "
    user_row_dict = user_row[valid_keys].to_dict()

    if "avatar_src" in keys:
        user_row_dict["avatar_src"] = f"{AVATAR_URI}{user_row['avatar_id']}"
    return user_row_dict, message
