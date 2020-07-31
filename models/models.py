from flask_sqlalchemy import SQLAlchemy
import datetime

Db = SQLAlchemy()


class User(Db.Model):
    __tablename__ = 'users'
    uid = Db.Column(Db.Integer, primary_key=True, autoincrement=True)
    username = Db.Column(Db.String(64), unique=True, nullable=False)
    password = Db.Column(Db.String(128), nullable=False)
    created = Db.Column(Db.Date, default=Db.func.current_timestamp())

class NFB(Db.Model):
    __tablename__ = 'nfb'
    nfb_id = Db.Column(Db.Integer, primary_key=True, autoincrement=True)
    domain_code = Db.Column(Db.String(20), nullable=False)
    domain = Db.Column(Db.String(255), nullable=False)
    area_code = Db.Column(Db.String(20), nullable=False)
    area = Db.Column(Db.String(255), nullable=False)
    element_code = Db.Column(Db.String(20), nullable=False)
    element = Db.Column(Db.String(255), nullable=False)
    item_code = Db.Column(Db.String(20), nullable=False)
    item = Db.Column(Db.String(255), nullable=False)
    year_code = Db.Column(Db.String(20), nullable=False)
    year = Db.Column(Db.String(20), nullable=False)
    unit = Db.Column(Db.String(20), nullable=False)
    value = Db.Column(Db.Float, nullable=False)
    flag = Db.Column(Db.String(10), nullable=False)
    flag_description = Db.Column(Db.String(255), nullable=False)
    note  = Db.Column(Db.String(1000))
    created = Db.Column(Db.Date, default=Db.func.current_timestamp())