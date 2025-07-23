import React from 'react';
import { Event } from '../types/event';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {event.images.length > 0 && (
                <img
                    src={`http://localhost:3000/uploads/${event.images[0]}`}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                        {format(new Date(event.startDate), 'MMM dd, yyyy')} -{' '}
                        {format(new Date(event.endDate), 'MMM dd, yyyy')}
                    </span>
                    {event.totalGuests && (
                        <span className="text-sm text-gray-500">{event.totalGuests} guests</span>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                        Organized by: {event.organizer.name}
                    </span>
                    <Link
                        to={`/events/${event.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;