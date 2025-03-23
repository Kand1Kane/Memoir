from firebase_ops import *
from measure import *
from app import *
import uuid

def encode_image(image: np.ndarray) -> str:
    image = (image).astype(np.uint8)  # (1, H, W, C) -> (H, W, C)
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

def write_sample(img_path:str|np.ndarray, write_db=False):
    if isinstance(img_path, str):
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    else:
        img = img_path
    img = cv2.resize(img, (256, 256))
    emb, _ = get_emb(img)
    emb = emb.tolist()
    image_base64 = encode_image(img)
    create_user(embedding=emb, image_base64=image_base64) if write_db else None
    return {'embedding':emb, 'image':image_base64}
    
def test_write_user():
    embedding = np.random.rand(512).astype(np.float32)

    dummy_face = np.zeros((224, 224, 3), dtype=np.uint8)
    cv2.circle(dummy_face, (112, 112), 50, (255, 255, 255), -1)

    _, buffer = cv2.imencode('.jpg', dummy_face)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    
    result = create_user(embedding=embedding.tolist(), image_base64=image_base64)
    return result

def test_get_user(target_name="test_user2"):
    user_data = get_user(target_name)
    return user_data

def test_get_all_users():
    users = get_all_users()
    return users

def test_update_user():
    user_id = "test_user2"
    updates = {"name": "test_user3"}
    update_user(user_id, updates)

if __name__ =="__main__":
    from glob import glob
    img_paths = glob("dataset/*.jpg")
    for img_path in img_paths:
        field = img_path.split("/")[-1].split(".")[0]
        uid = str(uuid.uuid4())  # 예: "d9f2a23e-9be0-4a94-bae3-49de174d9c3d" uuid.uuid4()
        write_sample(img_path=img_path, write_db=True)
        
    # img_path = "/home/prj/Memoir/face_recognition/dataset/images_1.jpg"
    # entity = write_sample(field=None, img_path=img_path)
    # is_same, user = is_sim0(entity['embedding'])
    # print(is_same)
    # print(user)
    # result = test_get_user()
    # print(result['name'])