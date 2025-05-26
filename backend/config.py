import os

from dotenv import find_dotenv, load_dotenv

config = find_dotenv(".env")
load_dotenv()

CSV_FILE = os.getenv("CSV_FILE")
DASHBOARD_CSV = os.getenv("DASHBOARD_CSV")
AVATAR_FOLDER = os.getenv("AVATAR_FOLDER")
AVATAR_URI = os.getenv("AVATAR_URI")
BACKEND_URL = os.getenv("BACKEND_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
REFRESH_TOKEN_VALIDITY_DAYS = int(os.getenv("REFRESH_TOKEN_VALIDITY_DAYS"))
ACCESS_TOKEN_VALIDITY_MINUTES = int(os.getenv("ACCESS_TOKEN_VALIDITY_MINUTES"))
