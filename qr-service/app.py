import os
from flask import Flask, jsonify
from app.routes.qr_routes import qr_bp


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev_qr_secret")

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "qr-service"})

    # Register blueprints
    app.register_blueprint(qr_bp, url_prefix="/api/qr")

    return app


# ✅ REQUIRED for gunicorn
app = create_app()


# ✅ Local run only
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7001))
    app.run(host="0.0.0.0", port=port)