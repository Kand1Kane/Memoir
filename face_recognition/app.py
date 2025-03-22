# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import tempfile
from measure import measure_sim , get_emb
from firebase_ops import *

app = Flask(__name__)
CORS(app)

def encode_image(image: np.ndarray) -> str:
    image = (image[0] * 255).astype(np.uint8)  # (1, H, W, C) -> (H, W, C)
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

@app.route("/verify_two", methods=["POST"])
def verify_two():
    try:
        if 'img1' not in request.files or 'img2' not in request.files:
            return jsonify({"error": "Both img1 and img2 must be provided"}), 400

        img1_file = request.files['img1']
        img2_file = request.files['img2']

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp1, \
             tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp2:
            img1_path = tmp1.name
            img2_path = tmp2.name
            img1_file.save(img1_path)
            img2_file.save(img2_path)

        is_same, distance, (face1, face2) = measure_sim(img1_path, img2_path, vervose=True)

        # face encoding to base64
        face1_encoded = encode_image(face1)
        face2_encoded = encode_image(face2)

        return jsonify({
            "is_same": bool(is_same),
            "distance": distance,
            "img1": face1_encoded,
            "img2": face2_encoded
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/register", methods=["POST"])
def register_user():
    try:
        if 'img' not in request.files or 'name' not in request.form:
            return jsonify({"error": "img and name are required"}), 400

        name = request.form["name"]
        file = request.files["img"]

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            img_path = tmp.name
            file.save(img_path)

        embedding, face_image = get_emb(img_path)
        embedding_list = embedding.flatten().tolist()
        image_base64 = encode_image(face_image)

        save_user(name, embedding_list, image_base64)

        return jsonify({"message": f"User '{name}' saved successfully."})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)