import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["interns_job_application"]

jobs_collection = db["jobs"]
applications_collection = db["applications"]
users_collection = db["users"]