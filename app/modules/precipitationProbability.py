import json

from .temperature import Temperature

class PrecipitationProbability(Temperature):

    def __init__(self):

        super().__init__()
        self.elementName = "elementName=PoP12h"

    def _fake_value(self):
        return json.dumps({'datetime':'YYYY-MM-DD hh:mm:ss', 'values':'99', 'display':'降雨機率 99%'}, ensure_ascii=False)

    def _data_processor(self, data):

        result = []
        values = []
        display = []
        
        for idx in range(len(data)):
            values = data[idx]['elementValue'][0]['value']
            if not values: values = 'NA'
            date = f"{data[idx]['startTime']}"
            display = (f"降雨機率 {values}%")
            result.append({'datetime':date,'values':values,'display':display})
        return json.dumps(result,ensure_ascii=False)