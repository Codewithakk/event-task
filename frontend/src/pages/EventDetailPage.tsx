import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, deleteEvent } from '../api/api';
import { Event } from '../types/event';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await getEvent(Number(id));
                setEvent(response.data);
            } catch (err) {
                setError('Failed to fetch event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(Number(id));
                navigate('/');
            } catch (err) {
                setError('Failed to delete event');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!event) return <div>Event not found</div>;

    const isOrganizer = user?.id === event.organizer.id;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/" className="text-blue-600 hover:text-blue-800">
                    &larr; Back to Events
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        {event.images.length > 0 ? (
                            <img
                                src={`http://localhost:3000/uploads/${event.images[0]}`}
                                alt={event.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                    </div>
                    <div className="p-8 md:w-1/2">
                        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
                        <p className="text-gray-600 mb-6">{event.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                                <p className="text-lg">
                                    {format(new Date(event.startDate), 'MMMM d, yyyy h:mm a')}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                                <p className="text-lg">
                                    {format(new Date(event.endDate), 'MMMM d, yyyy h:mm a')}
                                </p>
                            </div>
                            {event.totalGuests && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Total Guests</h3>
                                    <p className="text-lg">{event.totalGuests}</p>
                                </div>
                            )}
                            {event.category && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                                    <p className="text-lg">{event.category}</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
                            <p className="text-lg">{event.organizer.name}</p>
                            <p className="text-gray-600">{event.organizer.email}</p>
                        </div>

                        {isOrganizer && (
                            <div className="flex space-x-4">
                                <Link
                                    to={`/events/${event.id}/edit`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                >
                                    Edit Event
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                >
                                    Delete Event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {event.images.length > 1 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">More Images</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {event.images.slice(1).map((image, index) => (
                            <img
                                key={index}
                                src={`http://localhost:3000/uploads/${image}`}
                                alt={`${event.name} ${index + 1}`}
                                className="w-full h-48 object-cover rounded-md"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetailPage;