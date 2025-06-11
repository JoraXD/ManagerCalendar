from datetime import datetime
from .database import db


class Guide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    telegram_id = db.Column(db.String(50))


class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)


class Tour(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    group_size = db.Column(db.Integer)
    venue = db.Column(db.String(200))
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    customer = db.relationship('Customer')
    guide_id = db.Column(db.Integer, db.ForeignKey('guide.id'))
    guide = db.relationship('Guide')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
