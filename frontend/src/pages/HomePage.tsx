import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api/api';
import EventCard from '../components/EventCard';
import { Event, EventsResponse } from '../types/event';
import Pagination from '../components/Pagination';

const HomePage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const limit = 6;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await getEvents({ page, limit });
                const data = response.data as [Event[], number];
                setEvents(data[0]);
                setTotal(data[1]);
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [page]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Upcoming Events</h1>
                <Link
                    to="/events/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Create Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            <Pagination
                currentPage={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
            />
        </div>
    );
};

export default HomePage;