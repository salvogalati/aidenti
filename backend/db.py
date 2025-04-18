import pandas as pd
import os

CSV_FILE = 'users.csv'

def load_users():
    if not os.path.exists(CSV_FILE):
        df = pd.DataFrame(columns=['username', 'password'])
        df.to_csv(CSV_FILE, index=False)
    return pd.read_csv(CSV_FILE)

def save_users(df):
    df.to_csv(CSV_FILE, index=False)

def user_exists(username):
    df = load_users()
    return username in df['username'].values

def check_credentials(username, password):
    df = load_users()
    user_row = df[df['username'] == username]
    if not user_row.empty and user_row.iloc[0]['password'] == password:
        return True
    return False

def add_user(username, password):
    df = load_users()
    new_user = pd.DataFrame([[username, password]], columns=['username', 'password'])
    df = pd.concat([df, new_user], ignore_index=True)
    save_users(df)
