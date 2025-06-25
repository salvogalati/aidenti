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
# SUPABASE_URL: str = os.environ["SUPABASE_URL"]
# SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]
SUPABASE_URL = "https://opivnvnltxqdhfelvhch.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waXZudm5sdHhxZGhmZWx2aGNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTExMjQ0OCwiZXhwIjoyMDY0Njg4NDQ4fQ.6PDXaPWsvIrVQnf16qv0e73OBW2ma7cQ_N_iQCxZ-70"

AVATAR_FOLDER: str = os.environ["AVATAR_FOLDER"]
AVATAR_URI: str = os.environ["AVATAR_URI"]
BACKEND_URL: str = os.environ["BACKEND_URL"]


# JWT
JWT_SECRET_KEY: str = os.environ["JWT_SECRET_KEY"]
JWT_SECRET_KEY = "jOiuo0AKX4I8m2h6Pdut/mVKlPAwV7lQCjDV75aN66EVNukqn9GDGHxdK+q2wbEPvUDyxAe2DMhsJXCCSZi7og=="

# Email SMTP configuration (must be present and valid)
EMAIL_SMTP: SMTPConfig = {
    "host": os.environ["EMAIL_APP_SMTP"],
    "port": int(os.environ["EMAIL_APP_SMTP_PORT"]),
    "username": os.environ["EMAIL_APP"],
    "password": os.environ["EMAIL_APP_PASSWORD"],
}
