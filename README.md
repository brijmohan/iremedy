# iremedy

Tested on Ubuntu 16.04 (Firefox and Chrome)

## Live demo
Check the URL: https://brijmohan.github.io/iremedy/single_line.html

Open the javascript console and check the request for processing the audio samples into pronunciation features and then POST-ing these features to https://tools.wmflabs.org/proneval-gsoc17/ for intelligibility scores.

## Setup
Install Python2, pip and virtualenv

```
sudo apt install python2.7 python2.7-dev python-pip
sudo pip install virtualenv
```

Clone the repo
```
git clone https://github.com/brijmohan/iremedy.git
```

Create a virtualenv
```
cd iremedy
virtualenv venv
. venv/bin/activate
```

Install dependencies
```
pip install -r requirements.txt
```

## Run the project

```
python main.py
```

* Open `http://localhost:5000` on Firefox or Chrome.
* Wait for recognizer to be ready
* Select a grammar from dropdown (align, words, neighbors)
* Press 'Start' and utter "What's your name", then press 'Stop'
* Results (detected symbols, normalized acoustic scores, duration) will be displayed under the heading "Recognition Output".
