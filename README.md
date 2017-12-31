# First Love Finder

## About

When I contacted YT and asked about bike availability I got very vague response. 
I checked if the bike was available every day for the past two months and I got tired of it. This piece of code will check availability automatically and notify when it's available via SMS. Due to the price an popularity it has become quite hard to order a new bike from YT. 
If the order is not placed soon enough after the bike becomes available, it will be months and months before the next window of opportunity presents itself. 

## How to run it
A pre-built docker image with the latest code is always available in the Docker hub. Running this is as simple as:

`docker run tadomavicius/first-love-finder`

If you want to get an sms message when the bike is found, the following env variables are required:
* `API_URL` - HTTP API URL to use when sending an SMS
* `SENDER` - sender
* `RECEIVER` - your MSISDN (phone number)
* `AUTH` - HTTP `Authorization` header value to be used for HTTP POST to the `API_URL`
* `SMS_ANYWAY` - if set, will send an sms on every run regardless with appropriate texts

SMS sending will only be attempted if all the env variables are populated.
