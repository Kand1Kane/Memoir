# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import tempfile
from measure import measure_sim , get_emb, retrieval
from firebase_ops import *

app = Flask(__name__)
CORS(app)

def encode_image(image: np.ndarray) -> str:
    image = (image[0] * 255).astype(np.uint8)  # (1, H, W, C) -> (H, W, C)
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

@app.route("/get_user_face_info", methods=["POST"])
def get_user_face_info():
    try:
        if "name" not in request.form:
            return jsonify({"error": "name is required"}), 400

        name = request.form["name"]
        user = get_user(name)
        
        if user:
            return jsonify({
                "name": user["name"],
                "embedding": user["embedding"] if user["embedding"] else None,
                "image": user["image"]
            })
            
        else:
            return jsonify({"error": f"User '{name}' not found."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_all_face_info", methods=["GET"])
def get_all_face_info():
    try:
        user_list = get_all_users() 
        return jsonify({"users": user_list})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# NOTE most important api in this module
@app.route("/is_sim", methods=["POST"]) # need current input's embedding
def is_sim():
    try:
        if 'embedding' not in request.files or 'name' not in request.form:
            return jsonify({"error": "Both img and name must be provided"}), 400
        data = request.get_json()
        emb = data['embedding']
        name = data['name']
        all_users = get_all_users()
        all_embs = [user["embedding"] for user in all_users]
        all_name = [user["name"] for user in all_users]
        assert len(all_embs) == len(all_name), "Length of embs and names are not same"
        is_same, nearest_idx = retrieval(emb, all_embs)
        
        # get retrived user
        if is_same:
            retrived_name = all_name[nearest_idx]
            user = get_user(retrived_name) # TODO name 한번 더 체크 확인
            
            return jsonify({
                "is_same": bool(is_same),
                # "img": face1_encoded,
                # "user_img": face2_encoded
            })
            
        else:
            user = None
        # face encoding to base64
        # face1_encoded = encode_image(face1)
        # face2_encoded = encode_image(face2)
            return jsonify({
                "is_same": bool(is_same),
                # "distance": distance,
                # "img": face1_encoded,
                # "user_img": face2_encoded
            })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# NOTE test code
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


if __name__ == "__main__":
    app.run(debug=True)