# FitTrack API Documentation

**Base URL:** `http://localhost:3001`  
**Auth:** JWT stored as httpOnly cookie named `token`  
**Content-Type:** `application/json`

---

## Auth

### POST /auth/register
Register a new user.

**Access:** Public  
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@fittrack.com",
  "password": "password123",
  "role": "member"
}
```
**Roles:** `admin`, `member`, `trainer`

---

### POST /auth/login
Login and receive JWT cookie.

**Access:** Public  
**Body:**
```json
{
  "email": "john@fittrack.com",
  "password": "password123"
}
```
**Response:** Sets `token` httpOnly cookie

---

### POST /auth/logout
Clear the JWT cookie.

**Access:** Public

---

### GET /auth/me
Get the currently logged-in user.

**Access:** JWT required  
**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@fittrack.com",
  "role": "member",
  "created_at": "2026-09-13T00:00:00.000Z"
}
```

---

## Members

### GET /members
Get all members.

**Access:** JWT, Admin only  
**Response:** Array of member objects with user data

---

### GET /members/:id
Get a single member by ID.

**Access:** JWT required  
**Response:** Member object with user data and memberships

---

### PATCH /members/:id
Update a member profile.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "name": "John Updated",
  "phone": "01712345678",
  "date_of_birth": "1995-06-15"
}
```

---

### DELETE /members/:id
Delete a member and their user account.

**Access:** JWT, Admin only

---

## Trainers

### POST /trainers
Create a new trainer.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@fittrack.com",
  "password": "password123",
  "specialization": "Cardio",
  "bio": "10 years experience"
}
```

---

### GET /trainers
Get all trainers.

**Access:** JWT required  
**Response:** Array of trainer objects with user and classes data

---

### GET /trainers/:id
Get a single trainer by ID.

**Access:** JWT required  
**Response:** Trainer object with user and assigned classes

---

### PATCH /trainers/:id
Update trainer details.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "specialization": "Strength",
  "bio": "Updated bio"
}
```

---

### DELETE /trainers/:id
Delete a trainer and their user account.

**Access:** JWT, Admin only

---

## Memberships

### POST /memberships/plans
Create a new membership plan.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "name": "Basic",
  "duration_days": 30,
  "price": 29.99
}
```

---

### GET /memberships/plans
Get all membership plans.

**Access:** JWT required  
**Response:** Array of plan objects

---

### POST /memberships/assign
Assign a membership plan to a member.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "member_id": "uuid",
  "plan_id": "uuid",
  "start_date": "2026-09-13"
}
```

---

### GET /memberships/:memberId
Get all memberships for a specific member.

**Access:** JWT required  
**Response:** Array of membership objects with plan data

---

## Classes

### POST /classes
Create a new class.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "title": "Morning Yoga",
  "description": "A relaxing session",
  "trainer_id": "uuid",
  "schedule": "2026-09-20T08:00:00.000Z",
  "capacity": 20
}
```

---

### GET /classes
Get all classes.

**Access:** JWT required  
**Response:** Array of class objects with trainer info and enrollment count

---

### GET /classes/:id
Get a single class by ID.

**Access:** JWT required  
**Response:** Class object with trainer info, enrollment count, spots left, and enrolled members

---

### PATCH /classes/:id
Update a class.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "title": "Morning Yoga Advanced",
  "capacity": 25
}
```

---

### DELETE /classes/:id
Delete a class and its enrollments.

**Access:** JWT, Admin only

---

## Enrollments

### POST /classes/:classId/enroll
Enroll a member in a class.

**Access:** JWT required  
**Body:**
```json
{
  "member_id": "uuid"
}
```
**Notes:** Returns 400 if class is full or member already enrolled. Triggers Pusher event to trainer.

---

### DELETE /classes/:classId/enroll
Cancel a member enrollment.

**Access:** JWT required  
**Body:**
```json
{
  "member_id": "uuid"
}
```

---

### GET /classes/:classId/enrollments
Get all enrollments for a class.

**Access:** JWT, Admin only  
**Response:** Array of enrollment objects with member and user data

---

### GET /classes/member/:memberId
Get all classes a member is enrolled in.

**Access:** JWT required  
**Response:** Array of enrollment objects with class data

---

## Announcements

### POST /announcements
Create a new announcement.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "title": "Gym Closed Friday",
  "content": "The gym will be closed this Friday for maintenance."
}
```
**Notes:** Triggers Pusher event on `announcements` channel.

---

### GET /announcements
Get all announcements.

**Access:** JWT required  
**Response:** Array of announcement objects ordered by newest first

---

### GET /announcements/:id
Get a single announcement by ID.

**Access:** JWT required

---

### DELETE /announcements/:id
Delete an announcement.

**Access:** JWT, Admin only

---

## Notifications

### POST /notifications
Create a notification for a user.

**Access:** JWT, Admin only  
**Body:**
```json
{
  "user_id": "uuid",
  "message": "Your membership has been activated"
}
```

---

### GET /notifications
Get all notifications for the logged-in user.

**Access:** JWT required  
**Response:** Array of notification objects ordered by newest first

---

### GET /notifications/unread-count
Get the count of unread notifications for the logged-in user.

**Access:** JWT required  
**Response:**
```json
{
  "unread_count": 3
}
```

---

### PATCH /notifications/:id/read
Mark a single notification as read.

**Access:** JWT required

---

### PATCH /notifications/read-all
Mark all notifications as read for the logged-in user.

**Access:** JWT required

---

## Pusher Real-Time Events

| Channel | Event | Trigger | Payload |
|---------|-------|---------|---------|
| `trainer-{trainerId}` | `new-enrollment` | Member enrolls in a class | `{ className, memberName, enrolledAt }` |
| `announcements` | `new-announcement` | Admin posts an announcement | `{ title, content, createdAt }` |

---

## Member 1 Axios Calls Summary

| # | Method | Endpoint | Render |
|---|--------|----------|--------|
| 1 | POST | `/auth/register` | CSR |
| 2 | POST | `/auth/login` | CSR |
| 3 | GET | `/auth/me` | SSR |
| 4 | GET | `/members` | SSR |
| 5 | GET | `/members/:id` | SSR |
| 6 | PATCH | `/members/:id` | CSR |
| 7 | DELETE | `/members/:id` | CSR |
| 8 | GET | `/trainers` | SSR |
| 9 | GET | `/trainers/:id` | SSR |
| 10 | POST | `/trainers` | CSR |
| 11 | GET | `/memberships/plans` | SSR |
| 12 | POST | `/memberships/assign` | CSR |

---

## Member 2 Axios Calls Summary

| # | Method | Endpoint | Render |
|---|--------|----------|--------|
| 1 | GET | `/classes` | SSR |
| 2 | GET | `/classes/:id` | SSR |
| 3 | POST | `/classes` | CSR |
| 4 | PATCH | `/classes/:id` | CSR |
| 5 | DELETE | `/classes/:id` | CSR |
| 6 | POST | `/classes/:classId/enroll` | CSR |
| 7 | DELETE | `/classes/:classId/enroll` | CSR |
| 8 | GET | `/classes/:classId/enrollments` | SSR |
| 9 | GET | `/announcements` | SSR |
| 10 | POST | `/announcements` | CSR |
| 11 | GET | `/notifications` | CSR |
| 12 | PATCH | `/notifications/:id/read` | CSR |