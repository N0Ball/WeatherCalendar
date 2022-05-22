# WeatherCalendar
An extension for google calendar for a getting use of the weather forecast

# Running Setups

## Prerequirements

- [docker](https://docs.docker.com/get-docker/)

## Redis

```bash
cp redis.conf.example redis.conf
```

change the password, than
```bash
# For docker Desktop
docker compose up -d

# For docker 
docker-compose up -d
```