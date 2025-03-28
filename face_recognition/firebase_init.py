import firebase_admin
from firebase_admin import credentials, firestore

def get_db(json_path:str):
    cred = credentials.Certificate(json_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    
    return db