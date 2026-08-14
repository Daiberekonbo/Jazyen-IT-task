from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from db import jobs_collection, applications_collection, conversations_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from rest_framework_simplejwt.tokens import AccessToken


@api_view(['GET', 'POST'])
def job_list_create(request):
    if request.method == 'GET':
        jobs = list(jobs_collection.find())
        for job in jobs:
            job['_id'] = str(job['_id'])  # ObjectId isn't JSON-serializable
        return Response(jobs)

    # POST
    data = request.data
    job = {
        "title": data.get("title"),
        "description": data.get("description"),
        "employer_id": data.get("employer_id"),
        "location": data.get("location"),
        "created_at": datetime.utcnow()
    }
    result = jobs_collection.insert_one(job)
    return Response({"id": str(result.inserted_id)}, status=201)


@api_view(['GET', 'POST'])
def application_list_create(request):
    if request.method == 'GET':
        job_id = request.query_params.get('job_id')
        applicant_id = request.query_params.get('applicant_id')
        company_id = request.query_params.get('company_id')

        query = {}
        if job_id:
            query['job_id'] = job_id
        if applicant_id:
            query['applicant_id'] = applicant_id
        if company_id:
            query['company_id'] = company_id

        applications = list(applications_collection.find(query))
        for app in applications:
            app['_id'] = str(app['_id'])
        return Response(applications)

    data = request.data
    job_id = data.get("job_id")
    applicant_id = data.get("applicant_id")
    company_id = data.get("company_id") or data.get("employer_id")

    if not job_id or not applicant_id:
        return Response({"error": "job_id and applicant_id are required"}, status=400)

    existing = applications_collection.find_one({"job_id": str(job_id), "applicant_id": str(applicant_id)})
    if existing:
        return Response({"error": "You have already applied for this job"}, status=400)

    application = {
        "job_id": str(job_id),
        "company_id": str(company_id) if company_id else None,
        "applicant_id": str(applicant_id),
        "applicant_name": data.get("applicant_name") or "",
        "applicant_email": data.get("applicant_email") or "",
        "phone": data.get("phone") or "",
        "cv_url": data.get("cv_url") or data.get("resume_url"),
        "passport_url": data.get("passport_url"),
        "cover_letter": data.get("cover_letter") or "",
        "status": "pending",
        "applied_at": datetime.utcnow()
    }

    result = applications_collection.insert_one(application)
    return Response({"id": str(result.inserted_id), "application": application}, status=201)


@api_view(['GET'])
def company_applications(request):
    company_id = request.query_params.get('company_id') or request.query_params.get('employer_id')
    if not company_id:
        return Response({"error": "company_id is required"}, status=400)

    records = list(applications_collection.find({"company_id": str(company_id)}))
    for item in records:
        item['_id'] = str(item['_id'])
    return Response(records)


@api_view(['PATCH'])
def application_update_status(request, application_id):
    new_status = request.data.get('status')

    if new_status not in ['pending', 'reviewed', 'rejected']:
        return Response({"error": "Invalid status value"}, status=400)

    try:
        obj_id = ObjectId(application_id)
    except InvalidId:
        return Response({"error": "Invalid application ID"}, status=400)

    result = applications_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": new_status}}
    )

    if result.matched_count == 0:
        return Response({"error": "Application not found"}, status=404)

    return Response({"message": "Status updated"})


@api_view(['GET', 'POST'])
def conversations_list_create(request):
    if request.method == 'GET':
        convs = list(conversations_collection.find())
        for c in convs:
            c['_id'] = str(c['_id'])
        return Response(convs)

    # POST - create a new conversation
    data = request.data
    conv = {
        'name': data.get('name'),
        'avatar': data.get('avatar', ''),
        'online': data.get('online', False),
        'unread': int(data.get('unread', 0)),
        'messages': data.get('messages', []),
        'created_at': datetime.utcnow()
    }
    result = conversations_collection.insert_one(conv)
    return Response({'id': str(result.inserted_id)}, status=201)


@api_view(['GET'])
def conversation_detail(request, conv_id):
    # try ObjectId first
    try:
        obj_id = ObjectId(conv_id)
        conv = conversations_collection.find_one({'_id': obj_id})
    except Exception:
        conv = conversations_collection.find_one({'_id': conv_id})

    if not conv:
        return Response({'error': 'Conversation not found'}, status=404)

    conv['_id'] = str(conv['_id'])
    return Response(conv)


@api_view(['POST'])
def conversation_post_message(request, conv_id):
    # Authenticate sender via token if provided
    sender = None
    auth = request.META.get('HTTP_AUTHORIZATION', '')
    if auth.startswith('Bearer '):
        token = auth.split()[1]
        try:
            at = AccessToken(token)
            sender = at.get('user_id')
        except Exception:
            sender = None

    text = request.data.get('text')
    if not text:
        return Response({'error': 'Message text required'}, status=400)

    # find conversation
    try:
        obj_id = ObjectId(conv_id)
        conv = conversations_collection.find_one({'_id': obj_id})
    except Exception:
        conv = conversations_collection.find_one({'_id': conv_id})

    if not conv:
        return Response({'error': 'Conversation not found'}, status=404)

    msg = {
        'text': text,
        'sent_by': sender or request.data.get('sent_by', 'anonymous'),
        'time': datetime.utcnow().isoformat()
    }

    conversations_collection.update_one({'_id': conv['_id']}, {'$push': {'messages': msg}, '$inc': {'unread': 1}})

    return Response({'message': 'sent'}, status=201)
