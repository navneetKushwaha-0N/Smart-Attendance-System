from flask import Blueprint, request, jsonify
import qrcode
import base64
from io import BytesIO

qr_bp = Blueprint("qr", __name__)


@qr_bp.route("/generate", methods=["POST"])
def generate_qr():
    """
    Generate QR image + encrypted payload
    """

    data = request.get_json() or {}
    student_id = data.get("studentId")
    qr_secret = data.get("qrSecret")

    if not student_id or not qr_secret:
        return jsonify({"message": "studentId and qrSecret are required"}), 400

    # 🔐 payload (same as before)
    payload = f"ENC::{student_id}::{qr_secret}"

    # ✅ Generate QR image
    qr = qrcode.make(payload)

    # Convert to base64
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()

    # ✅ Return BOTH (important)
    return jsonify({
        "payload": payload,  # for validation
        "qrImage": f"data:image/png;base64,{img_str}"  # for UI + download
    })


@qr_bp.route("/validate", methods=["POST"])
def validate_qr():
    """
    Validate scanned QR payload
    """

    data = request.get_json() or {}
    payload = data.get("payload")

    if not payload or not payload.startswith("ENC::"):
        return jsonify({"valid": False, "reason": "Invalid payload"}), 400

    try:
        _, student_id, qr_secret = payload.split("::", 2)
    except ValueError:
        return jsonify({"valid": False, "reason": "Malformed payload"}), 400

    return jsonify({
        "valid": True,
        "studentId": student_id,
        "qrSecret": qr_secret,
    })


@qr_bp.route("/reports/pdf", methods=["POST"])
def generate_pdf_report():
    return jsonify({"message": "PDF report generation not yet implemented"}), 501


@qr_bp.route("/reports/excel", methods=["POST"])
def generate_excel_report():
    return jsonify({"message": "Excel report generation not yet implemented"}), 501