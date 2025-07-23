import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEvent } from '../api/api';
import EventForm from '../components/EventForm';
import { EventFormValues } from '../types/event';

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
            if (values.totalGuests) formData.append('totalGuests', values.totalGuests.toString());
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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/" className="text-blue-600 hover:text-blue-800">
                    &larr; Back to Events
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="bg-white p-6 rounded-lg shadow-md">
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