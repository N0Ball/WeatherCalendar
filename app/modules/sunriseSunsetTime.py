import os
import json

from .temperature import Temperature

class SunriseSunsetTime(Temperature):

    def __init__(self):
        
        super().__init__()
        self.BASE_URL = os.getenv('REQUEST_SUN_URL')

    def _fake_value(self):
        return json.dumps({'datetime':'YYYY-MM-DD', 'rise_time':'06:12', 'set_time':'17:45'}, ensure_ascii=False)

    def _get_target_url(self, city, town, start_time, end_time):
        
        locationName = f"locationName={city}"
        timeFrom = f"timeFrom={start_time[0:10]}"
        timeTo = f"timeTo={end_time[0:10]}"
        url = f"{self.BASE_URL}?{self.API_KEY}&{city}&{timeFrom}&{timeTo}"
        return url

    def _filter_response(self, response):

        data = response['records']['locations']['location'][0]['time']
        print("##### Filtered Response #####")
        for idx, item in enumerate(data):
            print(f"{idx:02} -> {item}")
        print()
        
        return data

    def _data_processor(self, data):

        result = []
        for idx in range(len(data)):
            datetime = data[idx]['dataTime']
            rise_time = data[idx]['parameter'][1]['parameterValue']
            # rise_time = []
            if not rise_time: rise_time = 'NA'
            set_time = data[idx]['parameter'][5]['parameterValue']
            # set_time = []
            if not set_time: set_time = 'NA'
            result.append({'datetime':datetime, 'rise_time':rise_time, 'set_time':set_time})
        
        return json.dumps(result,ensure_ascii=False)