from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from db import jobs_collection, applications_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime


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

        query = {}
        if job_id:
            query['job_id'] = job_id
        if applicant_id:
            query['applicant_id'] = applicant_id

        applications = list(applications_collection.find(query))
        for app in applications:
            app['_id'] = str(app['_id'])
        return Response(applications)

    # POST
    data = request.data
    application = {
        "job_id": data.get("job_id"),
        "applicant_id": data.get("applicant_id"),
        "resume_url": data.get("resume_url"),
        "status": "pending",
        "applied_at": datetime.utcnow()
    }
    result = applications_collection.insert_one(application)
    return Response({"id": str(result.inserted_id)}, status=201)


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
