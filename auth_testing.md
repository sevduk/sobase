# Auth Testing Playbook

Step 1: MongoDB Verification
```
mongosh
use <database_name>
db.projects.find().pretty()
db.login_attempts.find().pretty()
```
Verify: projects use string `id` (no raw ObjectId returned), login_attempts has identifier key.

Step 2: API Testing
```
TOKEN=$(curl -s -X POST http://localhost:8001/api/admin/login -H "Content-Type: application/json" -d '{"password":"<ADMIN_PASSWORD>"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
curl -s http://localhost:8001/api/projects
curl -s http://localhost:8001/api/admin/projects -H "Authorization: Bearer $TOKEN"
```
Login returns access_token. Admin projects requires Bearer token. Public projects returns only published items sorted by order.
