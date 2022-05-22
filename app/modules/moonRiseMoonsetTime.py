import os
import json

from .sunriseSunsetTime import SunriseSunsetTime

class MoonriseMoonsetTime(SunriseSunsetTime):
    
    def __init__(self):

        super().__init__()
        self.BASE_URL = os.getenv('REQUEST_MOON_URL')
    
    def _fake_value(self):
        return json.dumps({'datetime':'YYYY-MM-DD', 'rise_time':'18:12', 'set_time':'12:45'}, ensure_ascii=False)

    def _data_processor(self, data):

        result = []
        for idx in range(len(data)):
            datetime = data[idx]['dataTime']
            rise_time = data[idx]['parameter'][0]['parameterValue']
            # rise_time = []
            if not rise_time: rise_time = 'NA'
            set_time = data[idx]['parameter'][4]['parameterValue']
            # set_time = []
            if not set_time: set_time = 'NA'
            result.append({'datetime':datetime, 'rise_time':rise_time, 'set_time':set_time})
        return json.dumps(result,ensure_ascii=False)