import requests

API_KEY = "YOUR_NEWS_API_KEY"

def get_market_news():

    url = f"https://newsapi.org/v2/everything?q=technology&apiKey={API_KEY}"

    response = requests.get(url)

    data = response.json()

    headlines = []

    for article in data["articles"][:5]:
        headlines.append(article["title"])

    return headlines