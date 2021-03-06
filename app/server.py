import json
from ics import Calendar

from flask import Flask
from flask_cors import CORS

import requests
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/cal')
def index():

    r = requests.get(os.getenv('URL'))
    c = Calendar(r.text)

    results = []

    for event in c.events:

        if event.all_day:
            begin = str(event.begin)[:10]
            end = str(event.end)[:10]

        else:
            begin = str(event.begin)
            end = str(event.end)

        results.append({
            'DTSTART': begin,
            'DTEND': end,
            'SUMMARY': event.name,
            'LOCATION': event.location,
            'DESCRIPTION': event.description
        })

    return {
        'data': results
    }

@app.route('/city')
def getTown():

    with open('towns.json', 'r') as data:
        result = json.loads(data.read())

    return {'data': result}

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

from .modules.precipitationProbability import PrecipitationProbability
@app.route('/PrecipitationProbability/<city>/<town>/<start_time>/<end_time>')
def precipitationProbability(city, town, start_time, end_time):

    field = PrecipitationProbability()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }

from .modules.precipitationProbabilityAll import PrecipitationProbabilityAll
@app.route('/PrecipitationProbabilityAll/<city>/<town>/<start_time>/<end_time>')
def precipitationProbabilityAll(city, town, start_time, end_time):

    field = PrecipitationProbabilityAll()
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

from .modules.weatherIconAll import WeatherIconAll
@app.route('/WeatherIconAll/<city>/<town>/<start_time>/<end_time>')
def weatherIconAll(city, town, start_time, end_time):

    field = WeatherIconAll()
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
@app.route('/MoonriseMoonsetTime/<city>/<town>/<start_time>/<end_time>')
def moonriseMoonsetTime(city, town, start_time, end_time):

    field = MoonriseMoonsetTime()
    try:
        return {'data': json.loads(field.get(city, town, start_time, end_time))}
    except ValueError as e:
        return {
            'error': str(e)
        }
