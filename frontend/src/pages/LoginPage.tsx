import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { LoginFormValues } from '../types/user';
import '../styles/user.css';

const LoginPage: React.FC = () => {
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            setError('');
            await authLogin(values);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div>
                    <h2 className="auth-title">Sign in to your account</h2>
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
                                <label htmlFor="email" className="auth-label">
                                    Email address
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
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
                                    autoComplete="current-password"
                                    className="auth-input"
                                />
                                <ErrorMessage
                                    name="password"
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
                                    Sign in
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className="auth-link-container">
                    <Link to="/register" className="auth-link">
                        Don't have an account? Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;