"""Backend for Goones"""

from flask import Flask
from flask import render_template, send_from_directory

from werkzeug.middleware.proxy_fix import ProxyFix

BASE_URL = "https://goones.se"
app = Flask(__name__)

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

@app.route('/health')
def health():
    """
    Health check endpoint.
    :return: A simple message indicating the service is running.
    """

    # No cache
    headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    }
    return "Application is healthy", 200, headers

@app.route('/')
@app.route('/index.html')
def index():
    """
    Render the index page.
    :return: Rendered HTML page.
    """

    return render_template('index.html.j2', url=f"{BASE_URL}")

@app.route('/articles')
def articles():
    """
    Render the articles page.
    :return: Rendered HTML page.
    """

    return render_template('articles.html.j2', url=f"{BASE_URL}/articles")

@app.route('/articles/<name>')
def article(name: str = ""):
    """
    Render a specific article page.
    :param name: The name of the article to render.
    :return: Rendered HTML page.
    """

    return render_template('article.html.j2', article=name, url=f"{BASE_URL}/articles/{name}")

@app.route('/games')
def games():
    """
    Render the games page.
    :return: Rendered HTML page.
    """

    return render_template('games.html.j2', url=f"{BASE_URL}/games")

@app.route('/studytips')
def studytips():
    """
    Render the study tips page.
    :return: Rendered HTML page.
    """

    return render_template('studytips.html.j2', url=f"{BASE_URL}/studytips")

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
