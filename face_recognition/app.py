# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
from measure import retrieval, get_emb
from firebase_ops import *

app = Flask(__name__)
CORS(app)

def encode_image(image: np.ndarray) -> str:
    image = (image).astype(np.uint8)  # (1, H, W, C) -> (H, W, C)
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
            return jsonify(user)
            
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

# NOTE main retrival logic
@app.route("/is_sim", methods=["POST"]) # need current input's embedding
def is_sim():
    """
    expected request : encoded image
    """
    try:
        if 'embedding' not in request.files or 'name' not in request.form:
            return jsonify({"error": "Both img and name must be provided"}), 400
        data = request.get_json()
        img_encoded = data['image']
        emb = get_emb(encode_image(img_encoded))
        all_users = get_all_users()
        all_embs = [user["embedding"] for user in all_users]
        all_name = [user["name"] for user in all_users]
        assert len(all_embs) == len(all_name), "Length of embs and names are not same"
        is_same, nearest_idx = retrieval(emb, all_embs)
        
        # get retrived user
        if is_same:
            retrived_user = all_users[nearest_idx]
            return jsonify({
                "is_same": bool(is_same),
                "user": retrived_user['uid']
            })
            
        else:
            create_user(embedding=emb, image_base64=img_encoded)
            return jsonify({
                "is_same": bool(is_same),
                "user": None
            })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# test code
def is_sim0(emb):
    all_users = get_all_users()
    all_embs = [user["embedding"] for user in all_users]
    all_uid = [user["uid"] for user in all_users]
    
    assert len(all_embs) == len(all_uid), "Length of embs and names are not same"
    is_same, nearest_idx = retrieval(emb, all_embs)
    user = None
    if is_same:
        retrived_name = all_uid[nearest_idx]
        user = get_user(retrived_name)
        
    return is_same, user

if __name__ == "__main__":
    app.run(debug=True)