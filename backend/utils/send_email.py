import smtplib
import sys
import traceback
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from config import EMAIL_SMTP


def send_verification_email(to_email: str, verification_link: str):
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = "Verifica la registrazione del tuo account"
        message["From"] = "AIdenti reset password"
        message["To"] = to_email

        text = f"""\
        Ciao,

        grazie per esserti registrato al nostro servizio!
        Per completare la verifica del tuo account, clicca sul seguente link:

        {verification_link}

        Se non hai richiesto questa registrazione, ignora pure questa email.

        Grazie,
        Il Team di Aidenti-Beast
        """

        # Parte HTML con stile inline
        html = f"""\
        <html>
        <head>
            <style>
            .container {{
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                padding: 20px;
            }}
            .content {{
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
            }}
            .button {{
                text-decoration: none !important;
                color: white !important;
                display: inline-block;
                padding: 12px 24px;
                margin-top: 20px;
                font-size: 16px;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 4px;
            }}
            .footer {{
                margin-top: 30px;
                font-size: 12px;
                color: #666666;
                text-align: center;
            }}
            </style>
        </head>
        <body>
            <div class="container">
            <div class="content">
                <h2>Benvenuto!</h2>
                <p>Grazie per aver creato un account con noi.</p>
                <p>Per favore, verifica il tuo indirizzo email cliccando sul pulsante qui sotto:</p>
                <a href="{verification_link}" class="button">Verifica il tuo account</a>
                <p style="margin-top:20px;font-size:14px; color:#333333;">
                Se il pulsante non funziona, copia e incolla questo link nel tuo browser:<br>
                <a href="{verification_link}">{verification_link}</a>
                </p>
            </div>
            <div class="footer">
                <p>Se non hai richiesto questa email, ignorala pure.</p>
                <p>© 2025 Aidenti-Beast. Tutti i diritti riservati.</p>
            </div>
            </div>
        </body>
        </html>
        """

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)

        with smtplib.SMTP_SSL(EMAIL_SMTP["host"], int(EMAIL_SMTP["port"])) as server:
            server.login(EMAIL_SMTP["username"], EMAIL_SMTP["password"])
            server.sendmail(EMAIL_SMTP["username"], to_email, message.as_string())

        return (
            True,
            "User registered successfully \n Check your email to validate your account",
        )

    except Exception:
        traceback.print_exc()
        return False, "Error during sending verification email"


def send_reset_password_email(to_email: str, reset_link: str):
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = "AIdenti reset password"
        message["From"] = "AIdenti reset password"
        message["To"] = to_email

        text = f"""\
        Ciao,

        Hai richiesto di resettare la password.
        Per completare clicca sul seguente link entro 15 minuti dalla ricezione della email:

        {reset_link}

        Se non hai richiesto effettuato questa richiesta, ignora pure questa email.

        Grazie,
        Il Team di Aidenti-Beast
        """

        # Parte HTML con stile inline
        html = f"""\
        <html>
        <head>
            <style>
            .container {{
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                padding: 20px;
            }}
            .content {{
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
            }}
            .button {{
                text-decoration: none !important;
                color: white !important;
                display: inline-block;
                padding: 12px 24px;
                margin-top: 20px;
                font-size: 16px;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 4px;
            }}
            .footer {{
                margin-top: 30px;
                font-size: 12px;
                color: #666666;
                text-align: center;
            }}
            </style>
        </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h2>Reset Password</h2>
                        <p>Hai richiesto di resettare la tua password.</p>
                        <p>Clicca sul pulsante qui sotto per impostare una nuova password:</p>
                        <a href="{reset_link}" class="button">Reimposta la password</a>
                        <p style="margin-top:20px;font-size:14px; color:#333333;">
                            Se il pulsante non funziona, copia e incolla questo link nel tuo browser:<br>
                            <a href="{reset_link}">{reset_link}</a>
                        </p>
                        <p style="margin-top:10px;font-size:12px; color:#666666;">
                            Il link scade tra {15} ore.
                        </p>
                    </div>
                    <div class="footer">
                        <p>Se non hai richiesto questa operazione, ignora pure questa email.</p>
                        <p>© 2025 AIdenti-Beast. Tutti i diritti riservati.</p>
                    </div>
                </div>
            </body>
        </html>
        """

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)

        with smtplib.SMTP_SSL(EMAIL_SMTP["host"], int(EMAIL_SMTP["port"])) as server:
            server.login(EMAIL_SMTP["username"], EMAIL_SMTP["password"])
            server.sendmail(EMAIL_SMTP["username"], to_email, message.as_string())

        return (
            True,
            "Check your email to reset your password",
        )

    except Exception:
        traceback.print_exc()
        return False, "Error during sending password reset email"
