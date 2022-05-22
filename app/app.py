from flask import Flask
from flask_cors import CORS

import requests
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():

    r = requests.get(os.getenv('URL'))
    file = r.text.split('\r\n')

    results = []
    element = {}

    for line in file:

        if line == 'BEGIN:VEVENT':
            element = {}
            continue

        if line == 'END:VEVENT':
            results.append(element)
            continue

        field, *data = tuple(line.split(':'))
        element.update({
            field: data
        })

    return {
        'data': results
    }