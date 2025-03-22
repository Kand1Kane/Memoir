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

logger = Logger()

def measure_sim(img1_path:str, img2_path:str, model_name:str="Facenet512", vervose=False):
    img1_representation = get_emb(img1_path, model_name)
    img2_representation = get_emb(img2_path, model_name)
    # ----------------------------------------------
    # distance between two images - euclidean distance formula
    distance_vector = np.square(img1_representation - img2_representation)
    current_distance = np.sqrt(distance_vector.sum())
    logger.info(f"Euclidean distance: {current_distance}") if vervose else None

    threshold = verification.find_threshold(model_name=model_name, distance_metric="euclidean")
    logger.info(f"Threshold for {model_name}-euclidean pair is {threshold}") if vervose else None
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

def get_emb(img_path:str, model_name:str="Facenet512"):
    model: FacialRecognition = DeepFace.build_model(task="facial_recognition", model_name=model_name)
    target_size = model.input_shape
    img = DeepFace.extract_faces(img_path=img_path)[0]["face"]
    img = cv2.resize(img, target_size)
    img = np.expand_dims(img, axis=0)  # to (1, 224, 224, 3)
    img_representation = np.array(model.forward(img))

    return img_representation