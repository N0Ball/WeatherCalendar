import os
import json
from datetime import datetime, timedelta
from random import randint

from .request.cwb import CWB
from .request.requestUrl import RequestURL

class Temperature:

    def __init__(self):
        
        self.BASE_URL = os.getenv('REQUEST_BASE_URL')
        self.API_KEY = os.getenv('REQUEST_API_KEY')
        self.elementName = "elementName=T"

    def get(self, city:str, town:str, start_time:str, end_time:str):
        
        self.url = self._get_target_url(city, town, start_time, end_time)
        self.REQUEST_URL = RequestURL()
        # print(self.url)
        api_response = self.REQUEST_URL.get_url(self.url)

        if api_response is None:
            return self._fake_value()

        data = self._filter_response(api_response)
        result = self._data_processor(data)

        return result

    def _fake_value(self):  # Not Missing Value
        return json.dumps({'max': 27.0, 'min': 20.0})

    def _get_target_url(self, city, town, start_time, end_time):

        if ':' not in start_time:
            start_time += 'T00:00:00'

        if ':' not in end_time:
            end_time += 'T00:00:00'

        T_diff = self.__T_diff(end_time)
        productID = CWB.productIdGet(city, T_diff)
        townName = f"locationName={town}"
        timeFrom = f"timeFrom={start_time}"
        timeTo = f"timeTo={end_time}"
        
        return f"{self.BASE_URL}{productID}?{self.API_KEY}&{town}&{self.elementName}&{timeFrom}&{timeTo}"

    def _filter_response(self, response):

        data = response['records']['locations'][0]['location'][0]['weatherElement'][0]['time']
        print("\n##### Filtered Response #####")
        for idx in range(len(data)):
            print(f"{idx:02} -> {data[idx]}")
        print()
        return data

    def _data_processor(self, data):

        values = []
        for idx in range(len(data)):
            values.append(int(data[idx]['elementValue'][0]['value']))
        # values = []
        if values:
            result = json.dumps({'max': max(values), 'min': min(values)})
        else:   # Missing Value
            rand = randint(-3, 3)
            result = json.dumps({'max': 25.01 + rand, 'min': 23.01 + rand})
        
        return result

    def __T_diff(self, end_time:str):

        TS = end_time
        T0 = datetime.now()
        T2 = datetime(int(TS[0:4]), int(TS[5:7]), int(TS[8:10]))
        return (T2 - T0)/timedelta(hours=1)