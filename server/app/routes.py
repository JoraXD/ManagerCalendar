from flask import Blueprint, request, jsonify
from .models import db, Guide, Customer, Tour
from .telegram_notify import notify_guides

bp = Blueprint('api', __name__)


@bp.route('/guides', methods=['GET', 'POST'])
def guides():
    if request.method == 'POST':
        data = request.json
        guide = Guide(name=data['name'], telegram_id=data.get('telegram_id'))
        db.session.add(guide)
        db.session.commit()
        return jsonify({'id': guide.id}), 201
    all_guides = Guide.query.all()
    return jsonify([{'id': g.id, 'name': g.name} for g in all_guides])


@bp.route('/customers', methods=['GET', 'POST'])
def customers():
    if request.method == 'POST':
        data = request.json
        customer = Customer(name=data['name'])
        db.session.add(customer)
        db.session.commit()
        return jsonify({'id': customer.id}), 201
    all_customers = Customer.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in all_customers])


@bp.route('/tours', methods=['GET', 'POST'])
def tours():
    if request.method == 'POST':
        data = request.json
        tour = Tour(
            date=data['date'],
            group_size=data.get('group_size'),
            venue=data.get('venue'),
            customer_id=data.get('customer_id'),
            guide_id=data.get('guide_id'),
        )
        db.session.add(tour)
        db.session.commit()
        # notify guides when new tour is created
        guides = Guide.query.all()
        notify_guides(
            f"Новая экскурсия {tour.date} в {tour.venue}",
            [g.telegram_id for g in guides if g.telegram_id],
        )
        return jsonify({'id': tour.id}), 201
    all_tours = Tour.query.order_by(Tour.date).all()
    return jsonify([
        {
            'id': t.id,
            'date': t.date.isoformat(),
            'group_size': t.group_size,
            'venue': t.venue,
            'customer_id': t.customer_id,
            'guide_id': t.guide_id,
        }
        for t in all_tours
    ])
