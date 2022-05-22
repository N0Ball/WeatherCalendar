import json

from .temperature import Temperature

class WeatherDescription(Temperature):

    def __init__(self):

        super().__init__()
        self.elementName = "elementName=Wx"

    def _fake_value(self):
        return json.dumps({'datetime': 'YYYY-MM-DD hh:mm:dd', 'values':'晴時多雲偶陣雨', 'display':'天氣描述 -> 晴時多雲偶陣雨'}, ensure_ascii=False)

    def _data_processor(self, data):

        result = []
        for idx in range(len(data)):
            values = (data[idx]['elementValue'][0]['value'])
            if not values: values = 'NA'
            date = f"{data[idx]['startTime']}"
            display = (f"天氣描述 -> {values}")
            #print(f"{idx:02} -> {display[idx]}")
            result.append({'datetime':date,'values':values,'display':display})
        return json.dumps(result,ensure_ascii=False)