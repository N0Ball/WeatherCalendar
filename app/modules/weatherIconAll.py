import json

from .weatherIcon import WeatherIcon

class WeatherIconAll(WeatherIcon):

    def _data_processor(self, data):

        base_icon_url = "https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/"
        result = []
        for idx in range(len(data)):
            code = data[idx]['elementValue'][1]['value']
            if not code: code = 'NA'
            date = f"{data[idx]['startTime']}"
            # print(date)
            # print('06:00:00' in date)
            if '06:00:00' in date:
                urls = (f"{base_icon_url}{code}.svg")
                result.append({'datetime':date,'urls':urls})
                print(f"{idx:02} -> {result[-1]}")
        return json.dumps(result,ensure_ascii=False)