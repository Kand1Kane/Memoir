import cv2
from app import *
from crud_test import *
from  firebase_ops import *


cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("카메라를 열 수 없습니다.")
    exit()

img = None 

while emb is not None:
    ret, frame = cap.read()
    if not ret:
        print("frame error")
        break
    
    cv2.imshow("Webcam Live Feed", frame)
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    emb, img = get_emb(frame)
    if emb is None:
        continue
    else:
        all_users = get_all_users()
        all_embs = [user["embedding"] for user in all_users]
        all_name = [user["name"] for user in all_users]
        assert len(all_embs) == len(all_name), "Length of embs and names are not same"
        is_same, nearest_idx = retrieval(emb, all_embs)
        img_encoded = encode_image(frame)
        # get retrived user
        if is_same:
            retrived_user = all_users[nearest_idx]
            
        else:
            create_user(embedding=emb, image_base64=img_encoded)

    
# 자원 해제
cap.release()
cv2.destroyAllWindows()