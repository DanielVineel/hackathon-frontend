import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { Card, ChartCard } from '../../components/DashboardCard';
import '../../styles/CalendarPage.css';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const res = await API.get('/calendar', {
        params: {
          startDate: monthStart.toISOString(),
          endDate: monthEnd.toISOString()
        }
      });
      setEvents(res.data.events || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (day) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="calendar-page">
      <div className="calendar-page__header">
        <h1>Calendar</h1>
      </div>

      <div className="calendar-container">
        {/* Calendar */}
        <Card className="calendar-card">
          <div className="calendar-header">
            <button
              className="calendar-nav-btn"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              ←
            </button>
            <h2 className="calendar-month">{monthName}</h2>
            <button
              className="calendar-nav-btn"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              →
            </button>
          </div>

          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="calendar-day empty" />;
              }

              const dayEvents = getEventsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`calendar-day ${isToday ? 'is-today' : ''}`}
                  onClick={() => setSelectedDate({ day, month: currentDate.getMonth() + 1 })}
                >
                  <div className="calendar-day__number">{day}</div>
                  <div className="calendar-day__events">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event._id}
                        className="calendar-day__event"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="calendar-day__more">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="calendar-sidebar">
          {/* Upcoming Events */}
          <ChartCard title="Upcoming Events" subtitle={`${events.length} total`}>
            <div className="upcoming-events">
              {events
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .slice(0, 5)
                .map((event) => (
                  <div key={event._id} className="upcoming-event">
                    <div className="upcoming-event__color" style={{ backgroundColor: event.color }} />
                    <div className="upcoming-event__info">
                      <p className="upcoming-event__title">{event.title}</p>
                      <p className="upcoming-event__date">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="upcoming-event__type">{event.eventType}</span>
                  </div>
                ))}
              {events.length === 0 && (
                <p className="text-secondary text-center" style={{ padding: '1rem' }}>
                  No events scheduled
                </p>
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
