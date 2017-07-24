from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('single_line.html')

if __name__ == "__main__":
    app.run(debug=True)
