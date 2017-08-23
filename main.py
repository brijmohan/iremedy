from flask import Flask
from flask import render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return render_template('single_line.html')

if __name__ == "__main__":
    app.run(debug=True)
