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
@app.route('/temperature/<city>/<town>/<start_time>/<end_time>')
def temperature(city, town, start_time, end_time):

    field = Temperature()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}

from .modules.apparentTemperature import ApparentTemperature
@app.route('/apparentTemperature/<city>/<town>/<start_time>/<end_time>')
def apparentTemperature(city, town, start_time, end_time):

    field = ApparentTemperature()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}

from .modules.preciptitationProbability import PrecipitationProbability
@app.route('/preciptitationProbability/<city>/<town>/<start_time>/<end_time>')
def precipitationProbability(city, town, start_time, end_time):

    field = PrecipitationProbability()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}

from .modules.weatherDescription import WeatherDescription
@app.route('/weatherDescription/<city>/<town>/<start_time>/<end_time>')
def weatherDescription(city, town, start_time, end_time):

    field = WeatherDescription()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}

from .modules.weatherIcon import WeatherIcon
@app.route('/weatherIcon/<city>/<town>/<start_time>/<end_time>')
def weatherIcon(city, town, start_time, end_time):

    field = WeatherIcon()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}

from .modules.uV import UV
@app.route('/UV/<city>/<town>/<start_time>/<end_time>')
def uV(city, town, start_time, end_time):

    field = UV()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}

from .modules.sunriseSunsetTime import SunriseSunsetTime
@app.route('/sunriseSunsetTime/<city>/<town>/<start_time>/<end_time>')
def sunriseSunsetTime(city, town, start_time, end_time):

    field = SunriseSunsetTime()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}

from .modules.moonRiseMoonsetTime import MoonriseMoonsetTime
@app.route('/moonRiseMoonsetTime/<city>/<town>/<start_time>/<end_time>')
def moonriseMoonsetTime(city, town, start_time, end_time):

    field = MoonriseMoonsetTime()
    return {'data': json.loads(field.get(city, town, start_time, end_time))}