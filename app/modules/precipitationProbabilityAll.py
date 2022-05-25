import json

from .precipitationProbability import PrecipitationProbability

class PrecipitationProbabilityAll(PrecipitationProbability):

    def _data_processor(self, data):

        result = []
        # values = []
        display = []
        
        for idx in range(len(data)):
            values = data[idx]['elementValue'][0]['value']
            # if not values: values = 'NA'
            date = f"{data[idx]['startTime']}"
            if '06:00:00' in date:
                display = (f"降雨機率 {values}%")
                result.append({'datetime':date,'values':values,'display':display})
                print(f"{idx:02} -> {result[-1]}")
        return json.dumps(result,ensure_ascii=False)