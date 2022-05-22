import os
import json

from .weatherDescription import WeatherDescription

class WeatherIcon(WeatherDescription):

    def _fake_value(self):
        return json.dumps({'datetime':'YYYY-MM-DD hh:mm:ss', 'url':'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/00.svg'})

    def _data_processor(self, data):

        base_icon_url = os.getenv('REQUEST_ICON_URL')
        result = []
        for idx in range(len(data)):
            code = data[idx]['elementValue'][1]['value']
            if not code: code = 'NA'
            date = f"{data[idx]['startTime']}"
            urls = (f"{base_icon_url}{code}.svg")
            result.append({'datetime':date,'urls':urls})
            # print(f"{idx:02} -> {urls}")
        return json.dumps(result,ensure_ascii=False)