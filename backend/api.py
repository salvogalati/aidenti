from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Endpoint per ottenere tutti i messaggi
@app.route('/messaggi', methods=['GET'])
def get_messaggi():
    return jsonify("CIAOOO!")

# Endpoint base
@app.route('/')
def index():
    return "<h1>API CIAOC con Flask!</h1>"


if __name__ == '__main__':
    app.run(debug=True)



