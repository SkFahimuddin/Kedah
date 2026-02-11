# Water Utility Management System (MIS)

A comprehensive web-based Management Information System designed to digitize and streamline operations for water utility organizations. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌟 Features

### Core Modules

1. **Customer Complaint Management**
   - Digital complaint registration and tracking
   - Priority-based assignment to technicians
   - Real-time status updates
   - Response and resolution time tracking
   - Customer feedback system
   - GPS location tracking

2. **Digital Meter Reading Capture**
   - Mobile-friendly meter reading entry
   - Photo capture and verification
   - Anomaly detection (high/zero consumption, reversed meters)
   - Billing period management
   - GPS location validation

3. **Asset Management**
   - Complete asset registry (pumps, valves, pipes, tanks, etc.)
   - Maintenance schedule tracking
   - Asset condition monitoring
   - Document and photo management
   - Location mapping

4. **Maintenance Tracking**
   - Preventive and corrective maintenance scheduling
   - Work order management
   - Parts and labor cost tracking
   - Downtime monitoring
   - Before/after condition assessment

5. **Water Production Data Logging**
   - Daily production recording by facility
   - Water quality parameters tracking
   - Chemical usage monitoring
   - Energy consumption tracking
   - Non-revenue water calculation

6. **Staff Task Assignment**
   - Task creation and assignment
   - Priority and deadline management
   - Progress tracking with checklists
   - GPS location for field tasks
   - Task completion documentation

7. **Performance Benchmarking**
   - Real-time dashboard with KPIs
   - Analytics and trend analysis
   - Complaint resolution metrics
   - Asset utilization rates
   - Production efficiency tracking
   - Custom report generation

### Role-Based Access Control

- **Admin**: Full system access, user management, system configuration
- **Supervisor**: Dashboard access, task assignment, approval workflows
- **Technician**: Field operations, complaint resolution, task completion
- **Meter Reader**: Meter reading entry and verification
- **Customer Service**: Complaint registration and customer interaction
- **Viewer**: Read-only access to reports and dashboards

## 🏗️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Multer & Cloudinary** - File upload handling

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Zustand** - State management
- **React Query** - Server state management
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd water-utility-mis
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# MongoDB URI, JWT secret, Cloudinary credentials, etc.
```

**Environment Variables (.env):**

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/water_utility_db

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. Database Setup

Start MongoDB service:

```bash
# On Linux/Mac
sudo service mongod start

# On Windows
net start MongoDB
```

Optional: Seed database with sample data:

```bash
cd backend
node scripts/seedDatabase.js
```

### 5. Run the Application

**Start Backend Server:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Start Frontend Development Server:**

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 👤 Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@waterutility.com / admin123
- **Supervisor**: supervisor@waterutility.com / super123
- **Technician**: tech@waterutility.com / tech123

## 📁 Project Structure

```
water-utility-mis/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   ├── scripts/         # Database scripts
│   ├── server.js        # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── store/       # State management
    │   ├── utils/       # Utility functions
    │   ├── App.jsx      # Root component
    │   └── main.jsx     # Entry point
    ├── index.html
    └── package.json
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password

### Complaints
- `GET /api/complaints` - Get all complaints (with filters)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id` - Update complaint
- `PUT /api/complaints/:id/assign` - Assign complaint
- `PUT /api/complaints/:id/resolve` - Resolve complaint
- `GET /api/complaints/stats` - Get statistics

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/complaint-analytics` - Complaint analytics
- `GET /api/dashboard/production-analytics` - Production analytics
- `GET /api/dashboard/maintenance-analytics` - Maintenance analytics
- `GET /api/dashboard/kpis` - Performance KPIs

### Meter Readings
- `GET /api/meter-readings` - Get all readings
- `POST /api/meter-readings` - Create reading
- `GET /api/meter-readings/:id` - Get reading details

### Assets
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create asset
- `GET /api/assets/:id` - Get asset details
- `PUT /api/assets/:id` - Update asset

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## 📊 Database Models

1. **User** - System users with role-based access
2. **Complaint** - Customer complaints and service requests
3. **MeterReading** - Water meter readings
4. **Asset** - Utility assets and equipment
5. **Maintenance** - Maintenance records and schedules
6. **WaterProduction** - Daily water production logs
7. **Task** - Staff task assignments

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Interactive dashboards with charts
- Real-time data updates
- Advanced filtering and search
- Pagination for large datasets
- Toast notifications
- Loading states
- Error handling

## 🧪 Testing

```bash
# Backend tests (to be implemented)
cd backend
npm test

# Frontend tests (to be implemented)
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment (e.g., Heroku, Railway)

1. Set environment variables
2. Ensure MongoDB is accessible
3. Build and deploy

### Frontend Deployment (e.g., Vercel, Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, email support@waterutility.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Advanced reporting module
- [ ] Integration with billing systems
- [ ] GIS mapping integration
- [ ] Predictive maintenance using ML
- [ ] Customer self-service portal

## 📝 Notes

- Ensure MongoDB is running before starting the backend
- Update environment variables for production deployment
- Cloudinary setup is optional for image uploads
- Email configuration is optional for notifications

---

Built with ❤️ for efficient water utility management
