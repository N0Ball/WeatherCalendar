import requests
import json
from .requestRedis import RequestRedis

class RequestURL:

    def __init__(self):
        self.Redis = RequestRedis()

    def get_url(self, url: str):

        response = self.Redis.get(url)
        
        if response is not None:
            return json.loads(response)

        # url = []
        headers = {
            "Accept": "application/json",
            "Accept-Econding": "gzip"
            }
        try:
            response = requests.get(url, headers=headers)
            response = response.json()
            self.Redis.initial(url, json.dumps(response))
        except Exception as e:
            response = None
            print(e)
            print("\nWarning: opendata.cwb.gov.tw conection fault!!!\n")

        return response