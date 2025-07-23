import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEvent } from '../api/api';
import EventForm from '../components/EventForm';
import { EventFormValues } from '../types/event';
import '../styles/global.css';
import '../styles/event.css';
import '../styles/form.css';

const CreateEventPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const initialValues: EventFormValues = {
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        totalGuests: undefined,
        category: '',
        images: [],
    };

    const handleSubmit = async (values: EventFormValues) => {
        try {
            setIsSubmitting(true);
            setError('');

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('startDate', values.startDate?.toISOString() || '');
            formData.append('endDate', values.endDate?.toISOString() || '');
            if (values.totalGuests) {
                const totalGuestsNumber = Number(values.totalGuests);
                if (!isNaN(totalGuestsNumber)) {
                    formData.append('totalGuests', totalGuestsNumber.toString());
                }
            }

            if (values.category) formData.append('category', values.category);
            if (values.images) {
                Array.from(values.images).forEach((file) => {
                    formData.append('images', file);
                });
            }

            await createEvent(formData);
            navigate('/');
        } catch (err) {
            setError('Failed to create event');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container section">
            <div className="form-navigation">
                <Link to="/" className="back-link">
                    &larr; Back to Events
                </Link>
            </div>

            <div className="form-header">
                <h1 className="form-title">Create New Event</h1>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="form-container">
                <EventForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default CreateEventPage;