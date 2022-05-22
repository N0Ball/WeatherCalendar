import requests

class RequestURL:

    def __init__(self):
        pass

    def get_url(url: str):

        # url = []
        headers = {
            "Accept": "application/json",
            "Accept-Econding": "gzip"
            }
        try:
            response = requests.get(url, headers=headers)
        except:
            response = None
            print("\nWarning: opendata.cwb.gov.tw conection fault!!!\n")
        return response