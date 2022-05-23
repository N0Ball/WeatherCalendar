import json

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

from .modules.temperature import Temperature
@app.route('/Temperature/<city>/<town>/<start_time>/<end_time>')
def temperature(city, town, start_time, end_time):

    field = Temperature()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }

from .modules.preciptitationProbability import PrecipitationProbability
@app.route('/PreciptitationProbability/<city>/<town>/<start_time>/<end_time>')
def precipitationProbability(city, town, start_time, end_time):

    field = PrecipitationProbability()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }

from .modules.weatherDescription import WeatherDescription
@app.route('/WeatherDescription/<city>/<town>/<start_time>/<end_time>')
def weatherDescription(city, town, start_time, end_time):

    field = WeatherDescription()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }

from .modules.weatherIcon import WeatherIcon
@app.route('/WeatherIcon/<city>/<town>/<start_time>/<end_time>')
def weatherIcon(city, town, start_time, end_time):

    field = WeatherIcon()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }

from .modules.uV import UV
@app.route('/UV/<city>/<town>/<start_time>/<end_time>')
def uV(city, town, start_time, end_time):

    field = UV()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }

from .modules.sunriseSunsetTime import SunriseSunsetTime
@app.route('/SunriseSunsetTime/<city>/<town>/<start_time>/<end_time>')
def sunriseSunsetTime(city, town, start_time, end_time):

    field = SunriseSunsetTime()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }

from .modules.moonRiseMoonsetTime import MoonriseMoonsetTime
@app.route('/MoonRiseMoonsetTime/<city>/<town>/<start_time>/<end_time>')
def moonriseMoonsetTime(city, town, start_time, end_time):

    field = MoonriseMoonsetTime()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }