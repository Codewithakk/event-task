import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, deleteEvent } from '../api/api';
import { Event } from '../types/event';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import '../styles/global.css';
import '../styles/event.css';

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
            } catch (err: any) {
                if (err.response?.status === 403) {
                    setError('You are not authorized to delete this event.');
                } else {
                    setError('Failed to delete event.');
                }
            }
        }
    };


    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!event) return <div className="error">Event not found</div>;

    const isOrganizer = user?.id === event.organizer.id;

    return (
        <div className="container event-detail-page">
            <div className="form-navigation">
                <Link to="/" className="back-link">
                    &larr; Back to Events
                </Link>
            </div>

            <div className="event-detail-container">
                <div className="event-detail-media">
                    {event.images.length > 0 ? (
                        <img
                            src={`http://localhost:3000/uploads/${event.images[0]}`}
                            alt={event.name}
                            className="event-detail-image"
                        />
                    ) : (
                        <div className="event-detail-placeholder">
                            <span>No Image</span>
                        </div>
                    )}
                </div>
                <div className="event-detail-content">
                    <h1 className="event-detail-title">{event.name}</h1>
                    <p className="event-detail-description">{event.description}</p>

                    <div className="event-detail-grid">
                        <div>
                            <h3 className="event-detail-label">Start Date</h3>
                            <p className="event-detail-value">
                                {format(new Date(event.startDate), 'MMMM d, yyyy h:mm a')}
                            </p>
                        </div>
                        <div>
                            <h3 className="event-detail-label">End Date</h3>
                            <p className="event-detail-value">
                                {format(new Date(event.endDate), 'MMMM d, yyyy h:mm a')}
                            </p>
                        </div>
                        {event.totalGuests && (
                            <div>
                                <h3 className="event-detail-label">Total Guests</h3>
                                <p className="event-detail-value">{event.totalGuests}</p>
                            </div>
                        )}
                        {event.category && (
                            <div>
                                <h3 className="event-detail-label">Category</h3>
                                <p className="event-detail-value">{event.category}</p>
                            </div>
                        )}
                    </div>

                    <div className="event-detail-organizer">
                        <h3 className="event-detail-label">Organizer</h3>
                        <p className="event-detail-value">{event.organizer.name}</p>
                        <p className="event-detail-email">{event.organizer.email}</p>
                    </div>

                    {isOrganizer && (
                        <div className="event-detail-actions">
                            <Link
                                to={`/events/${event.id}/edit`}
                                className="btn btn-primary"
                            >
                                Edit Event
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="btn btn-danger"
                            >
                                Delete Event
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {event.images.length > 1 && (
                <div className="event-gallery">
                    <h2 className="event-gallery-title">More Images</h2>
                    <div className="event-gallery-grid">
                        {event.images.slice(1).map((image, index) => (
                            <img
                                key={index}
                                src={`http://localhost:3000/uploads/${image}`}
                                alt={`${event.name} ${index + 1}`}
                                className="event-gallery-image"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetailPage;