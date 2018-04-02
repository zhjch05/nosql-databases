# Require the httparty gem
require 'httparty'

# Set up the url and send a GET request to it. The base url is:
# "https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo"
response = HTTParty.get('https://api.nasa.gov/planetary/apod?api_key=IJRWOz0xpNNtJT40JUKsoCq9wtcbyhIRhzMpzo0M')

# Make the request and print out the "url" key in the response, which is the image url
print(response["url"])