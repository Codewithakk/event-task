import React from 'react';
import { Event } from '../types/event';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import '../styles/event-card.css';

// ✅ Correct props type
export interface EventCardProps {
    event: Event & { isOwner?: boolean };
    showActions?: boolean; // declared
}

export const EventCard: React.FC<EventCardProps> = ({ event, showActions }) => {
    return (
        <div className="event-card">
            {event.images.length > 0 && (
                <img
                    src={`http://localhost:3000/uploads/${event.images[0]}`}
                    alt={event.name}
                    className="event-card-image"
                />
            )}

            <div className="event-card-content">
                <h3 className="event-card-title">{event.name}</h3>
                <p className="event-card-description">{event.description}</p>

                <div className="event-card-meta">
                    <span>
                        {format(new Date(event.startDate), 'MMM dd, yyyy')} -{' '}
                        {format(new Date(event.endDate), 'MMM dd, yyyy')}
                    </span>
                    {event.totalGuests && <span>{event.totalGuests} guests</span>}
                </div>

                <div className="event-card-organizer">
                    <span className="event-card-organizer-name">
                        Organized by: {event.organizer.name}
                    </span>
                </div>

                <Link to={`/events/${event.id}`} className="event-card-link">
                    View Details
                </Link>

                {/* ✅ Conditionally render owner actions */}
                {showActions && (
                    <div className="event-card-actions">
                        <Link
                            to={`/events/${event.id}/edit`}
                            className="btn btn-small btn-edit"
                        >
                            Edit
                        </Link>
                        <button
                            className="btn btn-small btn-delete"
                            onClick={() => {
                                // TODO: hook up delete logic
                                alert(`Delete event #${event.id}`);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
