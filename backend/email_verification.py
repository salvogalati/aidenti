from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from email.header import Header
import smtplib

def send_verification_email(to_email: str, verification_link: str):
    smtp_server = "smtp.libero.it"
    smtp_port = 465
    sender_email = "aidenti-beast@libero.it"
    sender_password ="SalvoNicola1!"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Verifica la registrazione del tuo account"
    message["From"] = formataddr((str(Header("AIDENTI", 'utf-8')), 'aidenti@noreply.it'))
    message["To"] = to_email

    # testo e HTML come prima
    text = f"..."
    html = f"..."

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, message.as_string())
