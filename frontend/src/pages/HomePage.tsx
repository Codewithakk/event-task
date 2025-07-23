import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api/api';
import { EventCard } from '../components/EventCard';
import { Pagination } from '../components/Pagination';
import { Event as BaseEvent, EventFilters } from '../types/event';
import '../styles/global.css';
import '../styles/event.css';

interface EventWithOwnership extends BaseEvent {
    isOwner?: boolean;
}

const HomePage: React.FC = () => {
    const [allEvents, setAllEvents] = useState<EventWithOwnership[]>([]);
    const [events, setEvents] = useState<EventWithOwnership[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState<EventFilters>({
        page: 1,
        limit: 6,
        sortBy: 'startDate',
        sortOrder: 'asc',
    });

    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId')
        ? parseInt(localStorage.getItem('userId')!)
        : null;

    const isAuthenticated = !!token;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await getEvents({ page: 1, limit: 9999 });
                const [events, total] = response.data;

                const eventsWithOwnership = events.map((event: BaseEvent) => ({
                    ...event,
                    isOwner: currentUserId ? event.organizer.id === currentUserId : false,
                }));

                setAllEvents(eventsWithOwnership);
            } catch (err) {
                setError('Failed to fetch events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentUserId]);

    useEffect(() => {
        let filtered = [...allEvents];

        // Search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                (event) =>
                    event.name.toLowerCase().includes(searchLower) ||
                    event.description.toLowerCase().includes(searchLower)
            );
        }

        // Category
        if (filters.category) {
            filtered = filtered.filter((event) => event.category === filters.category);
        }

        // Date range
        if (filters.startDate) {
            filtered = filtered.filter(
                (event) => new Date(event.startDate) >= new Date(filters.startDate!)
            );
        }
        if (filters.endDate) {
            filtered = filtered.filter(
                (event) => new Date(event.startDate) <= new Date(filters.endDate!)
            );
        }

        // Sort
        if (filters.sortBy) {
            filtered.sort((a, b) => {
                const sortBy = filters.sortBy!;

                const fieldA = sortBy === 'startDate' || sortBy === 'endDate'
                    ? new Date(a[sortBy])
                    : a[sortBy];

                const fieldB = sortBy === 'startDate' || sortBy === 'endDate'
                    ? new Date(b[sortBy])
                    : b[sortBy];

                if (fieldA < fieldB) return filters.sortOrder === 'asc' ? -1 : 1;
                if (fieldA > fieldB) return filters.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }


        // Pagination
        const startIndex = ((filters.page || 1) - 1) * (filters.limit || 6);
        const endIndex = startIndex + (filters.limit || 6);

        setEvents(filtered.slice(startIndex, endIndex));
        setTotal(filtered.length);
    }, [allEvents, filters]);

    const categories = Array.from(new Set(allEvents.map((e) => e.category))).filter(Boolean);

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters((prev) => ({ ...prev, page: 1 }));
    };

    const handleSort = (field: 'name' | 'startDate' | 'endDate') => {
        setFilters((prev) => ({
            ...prev,
            page: 1,
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleDateFilter = (start: string, end: string) => {
        setFilters((prev) => ({
            ...prev,
            page: 1,
            startDate: start || undefined,
            endDate: end || undefined,
        }));
    };

    const handleCategoryFilter = (category: string) => {
        setFilters((prev) => ({
            ...prev,
            page: 1,
            category: category || undefined,
        }));
    };

    const clearFilters = () => {
        setFilters({
            page: 1,
            limit: 6,
            sortBy: 'startDate',
            sortOrder: 'asc',
        });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container home-page">
            <div className="page-header">
                <h1 className="page-title">Upcoming Events</h1>
                {isAuthenticated && (
                    <Link to="/events/new" className="btn btn-primary">
                        Create Event
                    </Link>
                )}
            </div>

            <div className="filters-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={filters.search || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, search: e.target.value }))
                        }
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-secondary">
                        Search
                    </button>
                </form>

                <div className="filter-controls">
                    <div className="sort-controls">
                        <span>Sort by:</span>
                        <button
                            onClick={() => handleSort('name')}
                            className={`sort-btn ${filters.sortBy === 'name' ? 'active' : ''}`}
                        >
                            Name {filters.sortBy === 'name' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSort('startDate')}
                            className={`sort-btn ${filters.sortBy === 'startDate' ? 'active' : ''}`}
                        >
                            Date {filters.sortBy === 'startDate' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>

                    <div className="date-filter">
                        <label>Date Range:</label>
                        <input
                            type="date"
                            value={filters.startDate || ''}
                            onChange={(e) => handleDateFilter(e.target.value, filters.endDate || '')}
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={filters.endDate || ''}
                            onChange={(e) => handleDateFilter(filters.startDate || '', e.target.value)}
                        />
                    </div>

                    {categories.length > 0 && (
                        <div className="category-filter">
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button onClick={clearFilters} className="btn btn-clear">
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="event-list">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard key={event.id} event={event} showActions={event.isOwner} />
                    ))
                ) : (
                    <div className="no-events">No events found. Try adjusting your filters.</div>
                )}
            </div>

            {total > (filters.limit || 6) && (
                <Pagination
                    currentPage={filters.page || 1}
                    totalPages={Math.ceil(total / (filters.limit || 6))}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default HomePage;
