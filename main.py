"""Backend for Goones"""

from flask import Flask, request
from flask import render_template, send_from_directory

from werkzeug.middleware.proxy_fix import ProxyFix

import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=2, x_proto=1, x_host=1, x_port=1
)

@app.route("/healthz")
def healthz():
    return "OK", 200

@app.route('/')
def index():
    """
    Render the index page.
    :return: Rendered HTML page.
    """

    return render_template('index.html.j2')

@app.route('/articles')
def articles():
    """
    Render the articles page.
    :return: Rendered HTML page.
    """

    return render_template('articles.html.j2')

@app.route('/articles/<name>')
def article(name: str = ""):
    """
    Render a specific article page.
    :param name: The name of the article to render.
    :return: Rendered HTML page.
    """

    return render_template('article.html.j2', article=name)

@app.route('/games')
def games():
    """
    Render the games page.
    :return: Rendered HTML page.
    """

    return render_template('games.html.j2')

@app.route('/studytips')
def studytips():
    """
    Render the study tips page.
    :return: Rendered HTML page.
    """

    return render_template('studytips.html.j2')

@app.route('/lunch')
def lunch():
    """
    Render the lunch page.
    :return: Rendered HTML page.
    """

    lunch = requests.get("https://www.tabyenskilda.se/monitor-matsal/").text

    soup = BeautifulSoup(lunch, 'html.parser')
    lunch = soup.find_all(lambda e: "lunch" in e["class"] if e.has_attr("class") else False)[0].find_all("tr")[1:]
    lunch = [{"day": item.find_all("td")[0].text.strip(),
              "veg": item.find_all("td")[1].text.strip(),
              "meat": item.find_all("td")[2].text.strip()} for item in lunch]

    return render_template('lunch.html.j2', menu_items=lunch)

@app.route("/css/<path:path>")
def css(path: str = ""):
    """
    CSS files.
    :param path: Path to CSS file
    """

    return send_from_directory("docs/css", path=path)

@app.route("/js/<path:path>")
def js(path: str = ""):
    """
    JS files.
    :param path: Path to JS file
    """

    return send_from_directory("docs/js", path=path)

@app.route("/img/<path:path>")
def img(path: str = ""):
    """
    Images.
    :param path: Path to image
    """

    return send_from_directory("docs/img", path=path)

@app.route("/favicon.ico")
def favicon():
    """
    Favicon.
    :return: Favicon file.
    """

    return send_from_directory("docs/img", path="favicon.ico")

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
