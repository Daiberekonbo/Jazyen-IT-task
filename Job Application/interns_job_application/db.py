import os
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client["interns_job_application"]

jobs_collection = db["jobs"]
applications_collection = db["applications"]
users_collection = db["users"]
conversations_collection = db["conversations"]


def ensure_seed_data():
    """Seed fake company jobs for the demo project while leaving individual job seeker records empty."""
    if jobs_collection.count_documents({}) == 0:
        fake_jobs = [
            {
                "title": "Frontend Developer",
                "company": "NovaWorks",
                "employer_id": "company-novaworks",
                "location": "Remote",
                "job_type": "Full Time",
                "salary": "$80k - $120k",
                "description": "Build responsive web experiences and collaborate closely with design and product teams.",
                "requirements": ["React", "TypeScript", "CSS", "REST APIs"],
                "created_at": datetime.utcnow()
            },
            {
                "title": "Backend Engineer",
                "company": "Skyline Labs",
                "employer_id": "company-skylinelabs",
                "location": "Lagos",
                "job_type": "Full Time",
                "salary": "$100k - $140k",
                "description": "Design and deliver APIs and platform services powering our customer workflows.",
                "requirements": ["Python", "Django", "PostgreSQL", "Docker"],
                "created_at": datetime.utcnow()
            },
            {
                "title": "Product Designer",
                "company": "Northstar Studio",
                "employer_id": "company-northstar",
                "location": "Hybrid",
                "job_type": "Contract",
                "salary": "$70k - $95k",
                "description": "Create clean UX flows and polished design systems for a growing B2B product line.",
                "requirements": ["Figma", "Design Systems", "Prototype Testing"],
                "created_at": datetime.utcnow()
            },
            {
                "title": "Data Analyst",
                "company": "Greenlane",
                "employer_id": "company-greenlane",
                "location": "Remote",
                "job_type": "Part Time",
                "salary": "$60k - $80k",
                "description": "Turn product and customer data into clear metrics, insights, and recommendations.",
                "requirements": ["SQL", "Excel", "Power BI", "Analytics"],
                "created_at": datetime.utcnow()
            },
            {
                "title": "DevOps Engineer",
                "company": "LaunchPeak",
                "employer_id": "company-launchpeak",
                "location": "Abuja",
                "job_type": "Full Time",
                "salary": "$110k - $150k",
                "description": "Own deployment automation, monitoring, and reliability practices for production services.",
                "requirements": ["CI/CD", "Docker", "Terraform", "AWS"],
                "created_at": datetime.utcnow()
            },
            {
                "title": "Mobile Developer",
                "company": "PixelForge",
                "employer_id": "company-pixelforge",
                "location": "Remote",
                "job_type": "Full Time",
                "salary": "$90k - $130k",
                "description": "Design and ship Android and iOS experiences with performance and accessibility in mind.",
                "requirements": ["Flutter", "React Native", "Mobile UI", "App Store"],
                "created_at": datetime.utcnow()
            }
        ]
        jobs_collection.insert_many(fake_jobs)

    # Keep job seeker-side data empty by default; only company jobs are seeded.
    users_collection.create_index("email", unique=False)


ensure_seed_data()