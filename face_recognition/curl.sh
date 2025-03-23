#curl -X GET http://localhost:5000/get_all_face_info
# curl -X POST http://localhost:5000/get_user_face_info \
#   -F "name=test_user"

curl -X POST http://localhost:5000/is_sim \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test_user",
    "embedding": [0.123, 0.456, 0.789, 0.321, 0.654, 0.987]
  }'