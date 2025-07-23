import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, updateEvent } from '../api/api';
import EventForm from '../components/EventForm';
import { EventFormValues } from '../types/event';
import { useAuth } from '../context/AuthContext';

const EditEventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [initialValues, setInitialValues] = useState<EventFormValues>({
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        totalGuests: undefined,
        category: '',
        images: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEvent(Number(id));
                const event = response.data;

                if (event.organizer.id !== user?.id) {
                    navigate('/');
                    return;
                }

                setInitialValues({
                    name: event.name,
                    description: event.description,
                    startDate: new Date(event.startDate),
                    endDate: new Date(event.endDate),
                    totalGuests: event.totalGuests || undefined,
                    category: event.category || '',
                    images: [],
                });
            } catch (err) {
                setError('Failed to fetch event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, user, navigate]);

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

            await updateEvent(Number(id), formData);
            navigate(`/events/${id}`);
        } catch (err) {
            setError('Failed to update event');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to={`/events/${id}`} className="text-blue-600 hover:text-blue-800">
                    &larr; Back to Event
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8">Edit Event</h1>

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

export default EditEventPage;