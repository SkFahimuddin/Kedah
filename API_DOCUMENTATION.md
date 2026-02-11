# Water Utility MIS - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@waterutility.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@waterutility.com",
      "role": "admin"
    }
  }
}
```

### Register User (Admin Only)
**POST** `/auth/register`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@waterutility.com",
  "password": "password123",
  "role": "technician",
  "phoneNumber": "+1234567890",
  "employeeId": "EMP006",
  "department": "Operations"
}
```

### Get Current User
**GET** `/auth/me`

### Update Password
**PUT** `/auth/update-password`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## Complaint Endpoints

### Get All Complaints
**GET** `/complaints`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `complaintType` (string): Filter by type
- `zone` (string): Filter by zone
- `startDate` (date): Filter from date
- `endDate` (date): Filter to date

**Example:**
```
GET /complaints?status=Pending&priority=High&page=1&limit=10
```

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "complaints": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalComplaints": 50
    }
  }
}
```

### Get Single Complaint
**GET** `/complaints/:id`

### Create Complaint
**POST** `/complaints`

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@email.com",
  "accountNumber": "ACC123",
  "address": {
    "street": "123 Main St",
    "area": "Downtown",
    "zone": "Zone A",
    "city": "Metro City"
  },
  "complaintType": "Water Leak",
  "priority": "High",
  "description": "Water leak in the basement",
  "location": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  }
}
```

### Update Complaint
**PUT** `/complaints/:id`

### Assign Complaint
**PUT** `/complaints/:id/assign`

**Request Body:**
```json
{
  "assignedTo": "507f1f77bcf86cd799439011"
}
```

### Resolve Complaint
**PUT** `/complaints/:id/resolve`

**Request Body:**
```json
{
  "resolutionNotes": "Fixed the leak by replacing the valve"
}
```

### Get Complaint Statistics
**GET** `/complaints/stats`

**Response:**
```json
{
  "status": "success",
  "data": {
    "stats": {
      "statusStats": [
        { "_id": "Pending", "count": 15 },
        { "_id": "Resolved", "count": 45 }
      ],
      "priorityStats": [...],
      "typeStats": [...],
      "avgResponseTime": [{ "_id": null, "avg": 12.5 }],
      "avgResolutionTime": [{ "_id": null, "avg": 48.3 }]
    }
  }
}
```

### Delete Complaint (Admin Only)
**DELETE** `/complaints/:id`

---

## Dashboard Endpoints

### Get Dashboard Overview
**GET** `/dashboard/overview`

**Query Parameters:**
- `startDate` (date): Optional start date
- `endDate` (date): Optional end date

**Response:**
```json
{
  "status": "success",
  "data": {
    "complaints": {
      "total": 100,
      "pending": 25,
      "resolved": 65,
      "resolutionRate": 65.00,
      "avgResponseTime": 12.5
    },
    "assets": {
      "total": 150,
      "operational": 140,
      "underMaintenance": 10,
      "operationalPercentage": 93.33
    },
    "tasks": {
      "total": 50,
      "pending": 15,
      "overdue": 5,
      "completionRate": 70.00
    },
    "waterProduction": {
      "totalLast7Days": 50000,
      "recentRecords": [...]
    }
  }
}
```

### Get Complaint Analytics
**GET** `/dashboard/complaint-analytics?period=30`

### Get Production Analytics
**GET** `/dashboard/production-analytics?period=30`

### Get Maintenance Analytics
**GET** `/dashboard/maintenance-analytics?period=30`

### Get KPIs
**GET** `/dashboard/kpis`

---

## Meter Reading Endpoints

### Get All Meter Readings
**GET** `/meter-readings`

**Query Parameters:**
- `page`, `limit`: Pagination
- `meterNumber`: Filter by meter
- `billingPeriod.month`: Filter by month
- `billingPeriod.year`: Filter by year

### Create Meter Reading
**POST** `/meter-readings`

**Request Body:**
```json
{
  "meterNumber": "MTR12345",
  "accountNumber": "ACC123",
  "customerName": "John Doe",
  "address": {
    "street": "123 Main St",
    "area": "Downtown",
    "zone": "Zone A"
  },
  "previousReading": 1000,
  "currentReading": 1150,
  "readingDate": "2024-02-01",
  "billingPeriod": {
    "month": 2,
    "year": 2024
  },
  "meterType": "Residential",
  "gpsLocation": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  }
}
```

---

## Asset Endpoints

### Get All Assets
**GET** `/assets`

**Query Parameters:**
- `page`, `limit`: Pagination
- `assetType`: Filter by type
- `status`: Filter by status
- `category`: Filter by category

### Get Single Asset
**GET** `/assets/:id`

### Create Asset
**POST** `/assets`

**Request Body:**
```json
{
  "assetName": "Water Pump #5",
  "assetType": "Pump",
  "category": "Production",
  "manufacturer": "HydroTech",
  "model": "HT-5000",
  "serialNumber": "HT5000-005",
  "purchaseDate": "2024-01-15",
  "status": "Operational",
  "condition": "Good",
  "location": {
    "facility": "Main Plant",
    "area": "Pump Station"
  }
}
```

### Update Asset
**PUT** `/assets/:id`

---

## Task Endpoints

### Get All Tasks
**GET** `/tasks`

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `assignedTo`: Filter by assigned user
- `priority`: Filter by priority

### Get Single Task
**GET** `/tasks/:id`

### Create Task
**POST** `/tasks`

**Request Body:**
```json
{
  "title": "Repair Water Leak",
  "description": "Fix leak at 123 Main Street",
  "taskType": "Repair",
  "priority": "High",
  "assignedTo": ["507f1f77bcf86cd799439011"],
  "dueDate": "2024-02-15",
  "location": {
    "address": "123 Main Street",
    "area": "Downtown"
  }
}
```

### Update Task
**PUT** `/tasks/:id`

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "status": "error",
  "message": "Not authorized to access this route"
}
```

**403 Forbidden**
```json
{
  "status": "error",
  "message": "User role 'technician' is not authorized"
}
```

**404 Not Found**
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Server error message"
}
```

---

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## Pagination

List endpoints support pagination with `page` and `limit` query parameters.

Default: `page=1`, `limit=10`

---

For additional information or support, please contact the development team.
