from firebase_init import get_db
import numpy as np
import base64
import cv2
from pprint import pprint
import os
import sys
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..")) 

if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)
if CURRENT_DIR not in sys.path:
    sys.path.append(CURRENT_DIR)
    
JSON = os.path.join(CURRENT_DIR, "genai-ml-test-firebase-adminsdk-fbsvc-7cfb209fe3.json")

def create_user(uid: str, embedding: np.ndarray, image_base64: str):
    """
    - name: user name
    - embedding: face embedding from Deepface (list of float)
    - image_base64: image array
    """
    db = get_db(JSON)
    doc_ref = db.collection("user_info").document(uid)
    doc_ref.set({
        "uid": uid,
        "name": None,
        "embedding": embedding,
        "image": image_base64,
        "relationship": None,
        "when": None,
        "summary": None
    })
    print(f"[+] Saved user '{uid}' to Firestore.")
    
    
def get_user(uid: str)->dict: 
    """
    - name: entity name
    """
    db = get_db(JSON)
    doc_ref = db.collection("user_info").document(uid)
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        return data
    else:
        return None
    
def delete_user(uid: str):
    """
    - name: entity name
    """
    db = get_db(JSON)
    doc_ref = db.collection("user_info").document(uid)
    doc_ref.delete()
    print(f"[+] Deleted user id'{uid}' from Firestore.")

def get_all_users():
    db = get_db(JSON)
    users_ref = db.collection("user_info").stream()
    user_list = []

    for doc in users_ref:
        data = doc.to_dict()
        if not data:
            continue
        
        name = data.get("name")
        embedding = data.get("embedding")
        image = data.get("image")

        user_list.append({
            "uid": doc.id if doc.id else None,
            "name": name if isinstance(name, str) and len(name)>0 else None,
            "embedding": embedding if isinstance(embedding, list) else None,
            "image": image if isinstance(image, str) else None,
            "relationship": None,
            "when": None,
            "summary": None
            })

    return user_list

def update_user(user_id: str, updates: dict):
    """
    user_id (str): doc ID (firebase doc.id)
    updates (dict):  key and value want to update {"name": "New Name"}
    """
    db = get_db(JSON)
    doc_ref = db.collection("user_info").document(user_id)

    try:
        doc_ref.update(updates)
        print(f"[+] 사용자 '{user_id}'의 필드를 업데이트했습니다: {list(updates.keys())}")
    except Exception as e:
        print(f"[!] 업데이트 실패: {e}")

if __name__ == "__main__":
    target_name = "jiwon"
    user_data = get_user(target_name)

    if user_data:
        print(f"[+] 사용자 '{target_name}' 정보:")
        pprint({
            "name": user_data.get("name"),
            "embedding_shape": len(user_data.get("embedding", [])),
            "image_preview": user_data.get("image", "")[:30] + "..."
        })
    else:
        print(f"[-] 사용자 '{target_name}' 를 찾을 수 없습니다.")
    
