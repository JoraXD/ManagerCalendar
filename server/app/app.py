from flask import Flask
from flask_cors import CORS
from .database import init_db
from .routes import bp


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(DATABASE_URI='postgresql://user:password@localhost:5432/manager')
    CORS(app)
    init_db(app)
    app.register_blueprint(bp, url_prefix='/api')
    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
