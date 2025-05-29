import os

from dotenv import find_dotenv, load_dotenv

# Load environment variables from .env file
config = find_dotenv(".env")
load_dotenv()

# Required environment variables (raise KeyError if missing)
CSV_FILE: str = os.environ["CSV_FILE"]
DASHBOARD_CSV: str = os.environ["DASHBOARD_CSV"]
AVATAR_FOLDER: str = os.environ["AVATAR_FOLDER"]
AVATAR_URI: str = os.environ["AVATAR_URI"]
BACKEND_URL: str = os.environ["BACKEND_URL"]
JWT_SECRET_KEY: str = os.environ["JWT_SECRET_KEY"]

# Integer environment variables (must be convertible to int)
REFRESH_TOKEN_VALIDITY_DAYS: int = int(os.environ["REFRESH_TOKEN_VALIDITY_DAYS"])
ACCESS_TOKEN_VALIDITY_MINUTES: int = int(os.environ["ACCESS_TOKEN_VALIDITY_MINUTES"])

# Email SMTP configuration (must be present and valid)
EMAIL_APP_SMTP: str = os.environ["EMAIL_APP_SMTP"]
EMAIL_APP_SMTP_PORT: int = int(os.environ["EMAIL_APP_SMTP_PORT"])
EMAIL_APP: str = os.environ["EMAIL_APP"]
EMAIL_APP_PASSWORD: str = os.environ["EMAIL_APP_PASSWORD"]
