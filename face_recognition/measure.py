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
    nearest_distance = D.flatten()[0]
    threshold = verification.find_threshold(model_name=MODEL_NAME, distance_metric="euclidean_l2")
    is_same = nearest_distance < threshold 
    logger.info("persion exist") if is_same else logger.info("diff person")
    
    return is_same, I.flatten()[0]

# NOTE test code
def measure_sim(emb1, emb2, vervose=False):
    # emb1, face1 = get_emb(emb1, MODEL_NAME)
    # emb2, face2 = get_emb(emb2, MODEL_NAME)
    # ----------------------------------------------
    # distance between two images - euclidean distance formula
    distance_vector = np.square(emb1-emb2)
    current_distance = np.sqrt(distance_vector.sum())
    logger.info(f"Euclidean distance: {current_distance}") if vervose else None

    threshold = verification.find_threshold(model_name=MODEL_NAME, distance_metric="euclidean")
    logger.info(f"Threshold for {MODEL_NAME}-euclidean pair is {threshold}") if vervose else None
    is_same = current_distance < threshold 
    if vervose:
        if is_same:
            logger.info(
                f"This pair is same person because its distance {current_distance}"
                f" is less than threshold {threshold}"
            )
        else:
            logger.info(
                f"This pair is different persons because its distance {current_distance}"
                f" is greater than threshold {threshold}"
            )

    return is_same, current_distance

def get_emb(img:str|np.ndarray):
    model = MODEL
    target_size = model.input_shape
    img = DeepFace.extract_faces(img_path=img)[0]["face"]
    img = cv2.resize(img, target_size)
    img = np.expand_dims(img, axis=0)  # to (1, 224, 224, 3)
    img_representation = np.array(model.forward(img))

    return img_representation, img

# NOTE test code
if __name__ == '__main__':
    img1_path = "dataset/jiwon.jpg"
    img2_path = "dataset/jiwon2.jpg"
    is_same, distance,faces = measure_sim(img1_path, img2_path, vervose=True)
    #print(faces[0].shape)
    for i, face in enumerate(faces):
        print(is_same)
        cv2.imwrite(f"dataset/jiwon_face_{i}.jpg", (face[0]*255).astype(np.uint8))
