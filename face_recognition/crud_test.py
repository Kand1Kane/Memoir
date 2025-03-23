from firebase_ops import *

def test_write_user():
    embedding = np.random.rand(512).astype(np.float32)

    dummy_face = np.zeros((224, 224, 3), dtype=np.uint8)
    cv2.circle(dummy_face, (112, 112), 50, (255, 255, 255), -1)

    _, buffer = cv2.imencode('.jpg', dummy_face)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    
    result = create_user(name="test_user2", embedding=embedding.tolist(), image_base64=image_base64)
    return result

def test_get_user():
    target_name = "test_user2"
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
    result = test_get_user()
    print(result['name'])