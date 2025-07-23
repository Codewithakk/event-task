import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import './App.css'; // Assuming you have a global CSS file
import './index.css'; // Tailwind CSS styles
import './styles/event.css';
import './styles/user.css';
import './styles/form.css';
import './styles/pagination.css';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route
                path="/events/new"
                element={
                  <PrivateRoute>
                    <CreateEventPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/events/:id/edit"
                element={
                  <PrivateRoute>
                    <EditEventPage />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;