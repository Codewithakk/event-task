import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { RegisterFormValues } from '../types/user';
import '../styles/user.css';

const RegisterPage: React.FC = () => {
    const [error, setError] = useState('');
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();

    const initialValues: RegisterFormValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Please confirm your password'),
    });

    const handleSubmit = async (values: RegisterFormValues) => {
        try {
            setError('');
            await authRegister(values);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div>
                    <h2 className="auth-title">Create a new account</h2>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="auth-form">
                            <div className="auth-form-group">
                                <label htmlFor="name" className="auth-label">
                                    Full Name
                                </label>
                                <Field
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="auth-input"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="auth-error-message"
                                />
                            </div>

                            <div className="auth-form-group">
                                <label htmlFor="email" className="auth-label">
                                    Email address
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="auth-input"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="auth-error-message"
                                />
                            </div>

                            <div className="auth-form-group">
                                <label htmlFor="password" className="auth-label">
                                    Password
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="auth-input"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="auth-error-message"
                                />
                            </div>

                            <div className="auth-form-group">
                                <label htmlFor="confirmPassword" className="auth-label">
                                    Confirm Password
                                </label>
                                <Field
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className="auth-input"
                                />
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="auth-error-message"
                                />
                            </div>

                            <div className="auth-form-group">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="auth-button"
                                >
                                    Register
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className="auth-link-container">
                    <Link to="/login" className="auth-link">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;