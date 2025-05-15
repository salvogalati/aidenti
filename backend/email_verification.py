import smtplib
import traceback
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr


def send_verification_email(to_email: str, verification_link: str):
    try:
        smtp_server = "smtp.libero.it"
        smtp_port = 465
        sender_email = "aidenti-beast@libero.it"
        sender_password = "SalvoNicola1!"

        message = MIMEMultipart("alternative")
        message["Subject"] = "Verifica la registrazione del tuo account"
        message["From"] = formataddr(
            (str(Header("AIDENTI", "utf-8")), "aidenti@noreply.it")
        )
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

        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, message.as_string())

        return (
            True,
            "User registered successfully \n Check your email to validate your account",
        )

    except Exception:
        traceback.print_exc()
        return False, "Error during sending verification email"
