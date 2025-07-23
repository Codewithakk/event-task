# Event Management System

A full-stack event management application built with NestJS (backend) and React (frontend).

## Features

- User authentication (register, login)
- CRUD operations for events
- Event listing with pagination, sorting, and filtering
- Multiple image upload for events
- Event search functionality
- Responsive design

## Technologies

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Multer for file uploads

### Frontend
- React
- TypeScript
- React Router
- Formik for forms
- Yup for validation
- Axios for API calls
- Tailwind CSS for styling

## Setup

### Backend

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL database and update `.env` file
4. Run migrations: `npm run typeorm migration:run`
5. Start the server: `npm run start:dev`

### Frontend

1. Navigate to the frontend directory: `cd event-management-frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Environment Variables

### Backend

Create a `.env` file in the backend root directory with the following variables:
