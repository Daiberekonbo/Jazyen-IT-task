from db import users_collection  # or import from jobs.db if you kept one shared file

import bcrypt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from db import users_collection

@api_view(['POST'])
def register(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    if users_collection.find_one({"email": email}):
        return Response({"error": "Email already registered"}, status=400)

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user = {
        "name": data.get("name"),
        "email": email,
        "password_hash": hashed_pw.decode('utf-8'),
        "role": data.get("role", "applicant")
    }
    result = users_collection.insert_one(user)
    return Response({"id": str(result.inserted_id)}, status=201)# Create your views here.
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})
    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return Response({"error": "Invalid credentials"}, status=401)

    token = RefreshToken()
    token['user_id'] = str(user['_id'])
    token['role'] = user['role']

    return Response({
        "access": str(token.access_token),
        "refresh": str(token)
    })