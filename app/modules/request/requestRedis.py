import redis
import os

class RequestRedis:

    def __init__(self):
        
        self.r = redis.StrictRedis(host=os.getenv('REDIS_HOST'), port=os.getenv('REDIS_PORT'), db=0)
        self.r.auth(os.getenv('REDIS_PASS'))

    def initial(self, url, result):

        self.r.set(f'url:{url}:data', result, ex=3600)
        self.r.incr(f'url:{url}:count')
        print('Add new data in redis')
        pass
    
    def update(self, url, result):

        self.r.set(f'url:{url}:data', result)
        self.r.incr(f'url:{url}:count')
        print('Update the data in redis')
    
    def get(self, url):

        response = self.r.get(f'url:{url}:data')
        self.r.incr(f'url:{url}:count')
        return response

    def count(self, url):

        return self.r.get(f'url:{url}:count')