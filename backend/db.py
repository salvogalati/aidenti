import pandas as pd
import os

CSV_FILE = 'users.csv'

def load_users():
    if not os.path.exists(CSV_FILE):
        df = pd.DataFrame(columns=['email', 'password', "verified", "first-access"])
        df.to_csv(CSV_FILE, index=False)
    return pd.read_csv(CSV_FILE)

def save_users(df):
    df.to_csv(CSV_FILE, index=False)

def user_exists(email):
    df = load_users()
    return email in df['email'].values

def verify_user_by_token(token):
    df = load_users()
    user = df[df['verified'] == token]

    if user.empty:
        return False, "User not found"

    if user.iloc[0]['verified'] == True:
        return True, 'Already verified'

    df.loc[df['verified'] == token, 'verified'] = True
    save_users(df)
    return True, 'Email verified successfully'

def check_credentials(email, password):
    df = load_users()
    user_row = df[df['email'] == email]
    if user_row.empty:
        return False, "Invalid User"
    if user_row.iloc[0]['password'] != password:
        return  False , "Invalid Password"
    if user_row.iloc[0]['verified'] == False:
        return  False , "Email not verified"
    return True, "Login successful"

def add_user(email, password, token):
    df = load_users()
    new_user = pd.DataFrame([[email, password, token, False]], columns=['email', 'password', "verified", "first-access"])
    df = pd.concat([df, new_user], ignore_index=True)
    save_users(df)
