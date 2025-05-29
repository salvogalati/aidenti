import os
from typing import TypedDict

from dotenv import find_dotenv, load_dotenv


class SMTPConfig(TypedDict):
    host: str
    port: int
    username: str
    password: str


# Load environment variables from .env file
config = find_dotenv(".env")
load_dotenv()

# Flask
DEBUG = os.getenv("DEBUG", "True") == "True"
PORT = int(os.getenv("PORT", 5001))

# Required environment variables (raise KeyError if missing)
CSV_FILE: str = os.environ["CSV_FILE"]
DASHBOARD_CSV: str = os.environ["DASHBOARD_CSV"]
AVATAR_FOLDER: str = os.environ["AVATAR_FOLDER"]
AVATAR_URI: str = os.environ["AVATAR_URI"]
BACKEND_URL: str = os.environ["BACKEND_URL"]


# JWT
JWT_SECRET_KEY: str = os.environ["JWT_SECRET_KEY"]
REFRESH_TOKEN_VALIDITY_DAYS: int = int(os.environ["REFRESH_TOKEN_VALIDITY_DAYS"])
ACCESS_TOKEN_VALIDITY_MINUTES: int = int(os.environ["ACCESS_TOKEN_VALIDITY_MINUTES"])


# Email SMTP configuration (must be present and valid)
EMAIL_SMTP: SMTPConfig = {
    "host": os.environ["EMAIL_APP_SMTP"],
    "port": int(os.environ["EMAIL_APP_SMTP_PORT"]),
    "username": os.environ["EMAIL_APP"],
    "password": os.environ["EMAIL_APP_PASSWORD"],
}
