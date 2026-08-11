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
from rest_framework_simplejwt.tokens import AccessToken
from bson import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
    token['role'] = user.get('role', 'applicant')

    user_info = {
        "id": str(user['_id']),
        "email": user.get('email'),
        "name": user.get('name', ''),
        "role": user.get('role', 'applicant')
    }

    return Response({
        "access": str(token.access_token),
        "refresh": str(token),
        "user": user_info
    })


@api_view(['GET', 'PATCH'])
def me(request):
    auth = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth.startswith('Bearer '):
        return Response({"detail": "Authentication credentials were not provided."}, status=401)

    token = auth.split()[1]
    try:
        at = AccessToken(token)
        user_id = at.get('user_id')
        if not user_id:
            return Response({"detail": "Invalid token."}, status=401)
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({"detail": "User not found."}, status=404)

        if request.method == 'GET':
            return Response({"id": str(user['_id']), "email": user.get('email'), "name": user.get('name', ''), "role": user.get('role', 'applicant'), "phone": user.get('phone', ''), "bio": user.get('bio', ''), "skills": user.get('skills', []), "experience": user.get('experience', ''), "education": user.get('education', '')})

        # PATCH: update allowed profile fields
        data = request.data
        update_fields = {}
        for f in ['name', 'phone', 'bio', 'skills', 'experience', 'education', 'email']:
            if f in data:
                update_fields[f] = data.get(f)

        if update_fields:
            users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
            user = users_collection.find_one({"_id": ObjectId(user_id)})

        return Response({"id": str(user['_id']), "email": user.get('email'), "name": user.get('name', ''), "role": user.get('role', 'applicant'), "phone": user.get('phone', ''), "bio": user.get('bio', ''), "skills": user.get('skills', []), "experience": user.get('experience', ''), "education": user.get('education', '')})
    except Exception:
        return Response({"detail": "Invalid or expired token."}, status=401)