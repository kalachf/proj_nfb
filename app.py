from dotenv import load_dotenv
from flask import Flask, flash, render_template, request, url_for, redirect, jsonify, session
from models.models import Db, User, NFB
from forms.forms import SignupForm, LoginForm, DashboardForm, ForecastForm
from os import environ
from passlib.hash import sha256_crypt
from sqlalchemy import func, and_

load_dotenv('.env')

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/lab5'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://fadi:fadi123@localhost:5432/final_project'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = environ.get('SECRET_KEY')
Db.init_app(app)

# GET /
@app.route('/')
@app.route('/index')
def index():
    # Control by login status
    if 'username' in session:
        session_user = User.query.filter_by(username=session['username']).first()
#        posts = Post.query.filter_by(author=session_user.uid).all()
        return render_template('index.html', title='Home', session_username=session_user.username)
    else:
#        all_posts = Post.query.all()
        return render_template('index.html', title='Home')

# GET & POST /login
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Init form
    form = LoginForm()

    # If post
    if request.method == 'POST':

        # Init credentials from form request
        username = request.form['username']
        password = request.form['password']

        # Init user by Db query
        user = User.query.filter_by(username=username).first()
        # Control login validity
        if user is None or not sha256_crypt.verify(password, user.password):
            flash('Invalid username or password', 'error')
            return redirect(url_for('login'))
        else:
            session['username'] = username
            return redirect(url_for('index'))

    # If GET
    else:
        return render_template('login.html', title='Login', form=form)

@app.route('/load_data', methods=['GET', 'POST'])
def load_data():
    # nfbs = NFB.query.filter(NFB.value > 0)
    #   if filter is clear (not set)
    nfbs = NFB.query.filter(and_(NFB.value > 0, NFB.element.in_(['Export Quantity','Import Quantity','Domestic supply quantity','Production','Processing','Seed'])))
    #   else nfbs = above AND filter

    nfbs_json = {'nfbs': []}
    for aRec in nfbs:
        rec_info = aRec.__dict__
        del rec_info['_sa_instance_state']
        nfbs_json['nfbs'].append(rec_info)
    return jsonify(nfbs_json)

@app.route('/total_export', methods=['GET', 'POST'])
def total_export():
    total_export = NFB.query.with_entities(func.sum(NFB.value).label('total')).filter(NFB.element=='Export Quantity')
    print(total_export)

    tot_export_json = {'total_export': []}
    for aRec in total_export:
        rec_info = aRec.__dict__
        del rec_info['_sa_instance_state']
        tot_export_json['total_export'].append(rec_info)
    return jsonify(tot_export_json)


# POST /logout
@app.route('/logout', methods=['POST'])
def logout():
    # Logout
    session.clear()
    return redirect(url_for('index'))


# /dashboard
@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    return render_template('dashboard.html', title='Farmer Analyzer of Local Produce (FALP) Dashboard')


# GET & POST /forecast
@app.route('/forecast', methods=['GET', 'POST'])
def forecast():
    # Init form
    form = ForecastForm()

    # IF POST
    if request.method == 'POST':
        return render_template('forecast.html', title='Forecast', form=form)
    else:
        return render_template('forecast.html', title='Farmer Analyzer of Local Produce (FALP) Forecast', form=form)


# GET & POST /signup
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    # Init form
    form = SignupForm()

    # IF POST
    if request.method == 'POST':

        # Init credentials from form request
        username = request.form['username']
        password = request.form['password']

        # Init user from Db query
        existing_user = User.query.filter_by(username=username).first()

        # Control new credentials
        if existing_user:
            flash('The username already exists. Please pick another one.')
            return redirect(url_for('signup'))
        else:
            user = User(username=username, password=sha256_crypt.hash(password))
            Db.session.add(user)
            Db.session.commit()
            flash('Congratulations, you are now a registered user!')
            return redirect(url_for('login'))

    # IF POST
    else:
        return render_template('signup.html', title='Farmer Analyzer of Local Produce (FALP) Signup', form=form)

#
# No caching at all for API endpoints.
#
@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response