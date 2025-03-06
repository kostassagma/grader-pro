from flask import Flask, request, jsonify
import requests
from urllib.parse import urlparse, parse_qs
from flask_cors import CORS
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import base64
import os
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY").encode("utf-8").ljust(32, b'\0')[:32]

app = Flask(__name__)
CORS(app)  # Allow all origins

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/login", methods=['POST'])
def login_route():
    request_data = request.get_json()

    username = request_data['username']
    password = request_data['password']

    try:
        cookie = login_cookie(username, password)
        f = Fernet(base64.urlsafe_b64encode(SECRET_KEY))
        encrypted_username = f.encrypt(username.encode('utf-8'))
        encrypted_password = f.encrypt(password.encode('utf-8'))
        return jsonify({"encrypted_username": encrypted_username.decode('utf-8'), "encrypted_password": encrypted_password.decode('utf-8'), "cookie": cookie}), 200
    except:
        return jsonify({"error": "wrong credentials"}), 401
    
    

def login_cookie(username:str, password:str)->str:
    home_endpoint = "http://grader.softlab.ntua.gr/"
    req = requests.get(home_endpoint)
    login_endpoint = "http://grader.softlab.ntua.gr/login.php"
    cookie = req.cookies.get("PHPSESSID")
    parameters = {
        "username": username,
        "password": password
    }
    req = requests.post(login_endpoint, data=parameters, cookies=req.cookies)
    query_params = parse_qs(req.url)
    if "error" in query_params:
        raise Exception("Incorrect Credentials!")
    return cookie



if __name__ == "__main__":
    app.run(debug=True)
