# Event Management System - Documentation

# When creating the event, please leave the Total Guests blank, as they are causing an error.

<img width="1877" height="970" alt="image" src="https://github.com/user-attachments/assets/c4401a98-927b-44a1-960a-f28f3cdbb279" />
<img width="1862" height="952" alt="image" src="https://github.com/user-attachments/assets/64d75ac4-e0bd-43be-bc6f-ef619596254c" />
<img width="1915" height="951" alt="image" src="https://github.com/user-attachments/assets/038fd49b-dc61-4d01-af22-bc3a10026375" />
<img width="1870" height="971" alt="image" src="https://github.com/user-attachments/assets/067066e3-9427-4249-82c9-d3934ef17254" />
<img width="1879" height="983" alt="image" src="https://github.com/user-attachments/assets/598d4a5e-af83-4bf0-ab43-65f9eb9c6b98" />
<img width="1899" height="957" alt="image" src="https://github.com/user-attachments/assets/619c000c-77e2-4cbe-9120-cc7b63cda7c8" />
<img width="1902" height="958" alt="image" src="https://github.com/user-attachments/assets/12d29933-e26c-4a32-9f2f-e296898541f3" />

# if user has created the event the edit and delete only user can do
<img width="1919" height="960" alt="image" src="https://github.com/user-attachments/assets/ca3bf5a9-3065-4296-b999-77142b8022a8" />
<img width="1906" height="973" alt="image" src="https://github.com/user-attachments/assets/7d74221c-c621-4d22-ba6e-4c21768f513a" />
<img width="1904" height="961" alt="image" src="https://github.com/user-attachments/assets/5f243148-aeb1-4902-b563-afc1293158f2" />



## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Setup Instructions](#setup-instructions)
5. [API Documentation](#api-documentation)
6. [Assumptions](#assumptions)

## System Overview

This is a full-stack event management system with:
- **Frontend**: React with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL (with Neon for cloud hosting)
- **Authentication**: JWT-based

## Architecture

### Frontend Structure
```
src/
├── api/               # API service layer
├── components/        # Reusable UI components
├── pages/             # Application pages
├── styles/            # CSS stylesheets
├── types/             # TypeScript interfaces
├── utils/             # Utility functions
├── App.tsx            # Main application component
└── index.tsx          # Entry point
```

### Backend Structure
```
src/
├── auth/              # Authentication module
├── config/            # Configuration files
├── database/          # Database entities and migrations
├── events/            # Event management module
├── users/             # User management module
├── shared/            # Common utilities
├── app.module.ts      # Root module
└── main.ts            # Application entry point
```

## Features

### Core Functionality
- User authentication (register/login)
- Event CRUD operations
- Event image uploads
- Pagination and sorting
- Advanced filtering
- Search functionality

### User Association
- Events are tied to their creator
- Only owners can edit/delete events
- Proper authorization checks on all endpoints

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (or Neon account)
- npm or yarn

### Backend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create `.env` file:
   ```env
   DATABASE_URL=postgres://user:password@host:port/dbname
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=3600s
   ```
4. Run migrations:
   ```bash
   npm run typeorm migration:run
   ```
5. Start the server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication
| Endpoint       | Method | Description                |
|----------------|--------|----------------------------|
| `/auth/login`  | POST   | User login                 |
| `/users/register` | POST | User registration       |

### Events
| Endpoint       | Method | Description                |
|----------------|--------|----------------------------|
| `/events`      | GET    | Get paginated events       |
| `/events`      | POST   | Create new event           |
| `/events/:id`  | GET    | Get single event           |
| `/events/:id`  | PATCH  | Update event               |
| `/events/:id`  | DELETE | Delete event               |

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `sortBy`: Field to sort by (name/startDate)
- `sortOrder`: asc/desc
- `category`: Filter by category
- `startDate/endDate`: Date range filter

## Assumptions

1. **User Authentication**:
   - Users must be logged in to create events
   - Only event owners can modify their events

2. **Data Handling**:
   - Events must have a name, description, and dates
   - Images are optional but limited to 10 per event

3. **Performance**:
   - Pagination is implemented for large datasets
   - Database indexes are assumed for frequently queried fields

4. **Security**:
   - JWT tokens expire after 1 hour
   - Passwords are hashed before storage
----------|
| "Database connection failed" | Check database credentials and connection |
| "Invalid or expired token" | Re-login to get new token |
| "Only event owner can perform this action" | Verify user permissions |
