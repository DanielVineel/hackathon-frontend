import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import '../styles/public/Events.css';
import PublicLayout from '../../layouts/PublicLayout';

export default function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'newest'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/events?limit=100');
      setEvents(res.data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          e.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    // Sorting
    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.sortBy === 'upcoming') {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    setFilteredEvents(filtered);
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: 'badge--success',
      upcoming: 'badge--info',
      completed: 'badge--default',
      cancelled: 'badge--error'
    };
    return statusMap[status] || 'badge--default';
  };

  return (
    <PublicLayout>
      <div className="public-events">
        <div className="public-events__header">
          <h1>Explore Events</h1>
          <p>Browse and participate in exciting events</p>
        </div>

        {/* Filters */}
        <div className="public-events__filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="upcoming">Starting Soon</option>
            </select>
          </div>
        </div>

        {/* Events List */}
        <div className="public-events__content">
          {loading ? (
            <p className="text-center">Loading events...</p>
          ) : filteredEvents.length > 0 ? (
            <div className="events-list">
              {filteredEvents.map((event) => (
                <div key={event._id} className="event-item">
                  <div className="event-item__body">
                    <div className="event-item__header">
                      <h3 className="event-item__title">{event.title}</h3>
                      <span className={`badge ${getStatusBadge(event.status)}`}>
                        {event.status}
                      </span>
                    </div>

                    <p className="event-item__description">
                      {event.description}
                    </p>

                    <div className="event-item__meta">
                      <span className="event-meta__item">
                        📅{' '}
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                      <span className="event-meta__item">
                        👥 {event.registrations || 0} registered
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No events found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
