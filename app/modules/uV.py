import json

from .temperature import Temperature
from .request.cwb import CWB

class UV(Temperature):

    def __init__(self):

        super().__init__()
        self.elementName = "elementName=UVI"
    
    def _fake_value(self):
        return json.dumps({'datetime':'YYYY-MM-DD hh:mm:ss', 'UVindex':'3', 'UVdisplay':'中量級'}, ensure_ascii=False)

    def _get_target_url(self, city, town, start_time, end_time):

        T_diff = 100
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
        return data
    
    
    def _data_processor(self, data):

        result = []
        for idx in range(len(data)):
            UVindex = data[idx]['elementValue'][0]['value']
            if not UVindex: UVindex = 'NA' 
            Uvdisplay = data[idx]['elementValue'][1]['value']
            if not Uvdisplay: Uvdisplay = 'NA' 
            date = f"{data[idx]['startTime']}"
            result.append({'datetime':date,'UVindex':UVindex,'UVdisplay':Uvdisplay})
        # values = []
        return json.dumps(result,ensure_ascii=False)