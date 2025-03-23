# 3rd party dependencies
import matplotlib.pyplot as plt
import numpy as np
import cv2
import sys
import os
sys.path.append(os.path.abspath("."))
# project dependencies
from deepface_ import DeepFace
from deepface_.modules import verification
from deepface_.models.FacialRecognition import FacialRecognition
from deepface_.commons.logger import Logger
import faiss


logger = Logger()
MODEL_NAME = "Facenet512"
# TODO we have to load on server once and do not load it again !!
MODEL: FacialRecognition = DeepFace.build_model(task="facial_recognition", model_name=MODEL_NAME)

def retrieval(emb_q:list|np.ndarray, img_embs :list|np.ndarray):
    """
    img = given image
    img_faces = all faces emb in db
    """
    img_embs = np.array(img_embs) if not isinstance(img_embs, np.ndarray) else img_embs
    emb_q = np.array(emb_q) if not isinstance(emb_q, np.ndarray) else emb_q
    print(img_embs.shape)
    print(emb_q.shape)
    index = faiss.IndexFlatL2(img_embs.shape[1])
    index.add(img_embs)
    D, I = index.search(emb_q[np.newaxis, ...], 1)
    nearest_distance = np.sqrt(D.flatten()[0])
    # diff = img_embs - emb_q  # (N, 512)
    # distance_vector = np.square(diff)  # (N, 512)
    # distance_sum = np.sqrt(np.sum(distance_vector, axis=1))  # (N,) 각 유저별 거리
    # nearest_idx = np.argmin(distance_sum)
    # nearest_distance = distance_sum[nearest_idx]
    threshold = verification.find_threshold(model_name=MODEL_NAME, distance_metric="euclidean")
    is_same = nearest_distance < threshold - 3
    logger.info("persion exist") if is_same else logger.info("diff person")
    logger.info(f"{nearest_distance, threshold}")
    return is_same,I.flatten()[0]  #nearest_idx #I.flatten()[0]


def get_emb(img:str|np.ndarray):
    model = MODEL
    target_size = model.input_shape
    try:
        img = DeepFace.extract_faces(img_path=img)[0]["face"]
        img = cv2.resize(img, target_size)
        img = np.expand_dims(img, axis=0)  # to (1, 224, 224, 3)
        img_representation = np.array(model.forward(img))

        return img_representation, img
    except:
        print("no face detected")
        return None, None