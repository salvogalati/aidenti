import os

from dotenv import find_dotenv, load_dotenv

config = find_dotenv(".env")
load_dotenv()

CSV_FILE = os.getenv("CSV_FILE")
DASHBOARD_CSV = os.getenv("DASHBOARD_CSV")
AVATAR_FOLDER = os.getenv("AVATAR_FOLDER")
AVATAR_URI = os.getenv("AVATAR_URI")
BACKEND_URL = os.getenv("BACKEND_URL")
