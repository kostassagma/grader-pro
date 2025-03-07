from flask import Flask, request, jsonify
import requests
from urllib.parse import urlparse, parse_qs
from flask_cors import CORS
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import base64
import os
from bs4 import BeautifulSoup
load_dotenv()
from ssh import submit_file

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

@app.route("/get-competitions", methods=['POST'])
def comps_route():
    request_data = request.get_json()
    
    cookie = request_data['cookie']
    
    comps = get_competitions(cookie)
    return jsonify({"series": comps}), 200


@app.route("/submit", methods=['POST'])
def submit_route():
    request_data = request.get_json()
    
    cookie = request_data['cookie']
    encrypted_password = request_data['encryptedPassword']
    encrypted_username = request_data['encryptedUsername']
    task_id = request_data['taskId']
    file = request_data['file']
    
    f = Fernet(base64.urlsafe_b64encode(SECRET_KEY))

    username = f.decrypt(encrypted_username).decode('utf-8')
    password = f.decrypt(encrypted_password).decode('utf-8')
    
    submit_file(cookie, task_id, username, password, file)

    return jsonify({"success": "ok"}), 200
    
    
def get_competitions(cookie:str):
    comps_endpoint = "http://grader.softlab.ntua.gr/index.php?page=competitions"
    req = requests.get(comps_endpoint, cookies={"PHPSESSID": cookie})
    query_params = parse_qs(req.url)
    if "error" in query_params:
        raise Exception("Invalid Cookie!")
    
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')
    right_element = soup.find(id='right')
    ul = right_element.find('ul')
    lists = ul.find_all('li')
    series = []
    for li in lists:
        a = li.find('a')
        series_label = a.text
        series_href = a.get('href')
        comps = get_comps_in_series(cookie, series_href)
        series.append({"label": series_label, "comps": comps})
    return series


def get_comps_in_series(cookie:str, series_href:str):
    series_endpoint = f"http://grader.softlab.ntua.gr/index.php{series_href}"
    req = requests.get(series_endpoint, cookies={"PHPSESSID": cookie})
    query_params = parse_qs(req.url)
    if "error" in query_params:
        raise Exception("Invalid Cookie!")
    
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')
    thirds_elements = soup.find_all(class_="thirds")
    comps = []
    for div in thirds_elements:
        a = div.find('h2').find('a')
        comp_label = a.text
        comp_href = a.get('href')
        id_part = comp_href.split('id=')[1]
        id_number = id_part.split('&')[0]
        comps.append({"label": comp_label, "id": id_number})
    return comps


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
