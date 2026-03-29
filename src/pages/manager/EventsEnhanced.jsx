/**
 * Enhanced Manager Events Page (CRUD Example)
 * Demonstrates:
 * - Data table with CRUD operations
 * - Modal forms for create/edit
 * - Confirmation dialogs
 * - Advanced filtering
 */

import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextArea from '../../components/forms/FormTextArea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useFilter, usePagination, useApi, useFormValidation } from '../../hooks';
import { eventsApi } from '../../api/api-service';
import '../../styles/ManagerEventsEnhanced.css';

const ManagerEvents = () => {
  // State management
  const { filters, updateFilter, clearFilters, getActiveFiltersCount } = useFilter({
    status: 'all'
  });
  const { page, limit, total, setTotal, totalPages, goToPage } = usePagination(10);
  const { loading, error, data: events, execute } = useApi();

  // Local states
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form validation
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setValues } =
    useFormValidation(
      {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'upcoming'
      },
      onSubmitForm
    );

  // Effects
  useEffect(() => {
    fetchEvents();
  }, [page, filters, limit]);

  // API calls
  const fetchEvents = async () => {
    try {
      const response = await execute(() =>
        eventsApi.getManagerEvents({
          page,
          limit,
          ...filters
        })
      );
      setTotal(response.total);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  async function onSubmitForm(formData) {
    try {
      if (editingEvent) {
        await execute(() => eventsApi.updateEvent(editingEvent._id, formData));
        alert('Event updated successfully!');
      } else {
        await execute(() => eventsApi.createEvent(formData));
        alert('Event created successfully!');
      }
      setShowEventForm(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      alert('Error saving event: ' + err.message);
    }
  }

  const handleDelete = async () => {
    try {
      await execute(() => eventsApi.deleteEvent(selectedEvent._id));
      alert('Event deleted successfully!');
      setShowDeleteConfirm(false);
      fetchEvents();
    } catch (err) {
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleOpenForm = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setValues({
        name: event.name,
        description: event.description,
        startDate: event.startDate?.split('T')[0],
        endDate: event.endDate?.split('T')[0],
        status: event.status
      });
    } else {
      resetForm();
      setEditingEvent(null);
    }
    setShowEventForm(true);
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Event Name',
      sortable: true
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'endDate',
      label: 'End Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'participantCount',
      label: 'Participants',
      sortable: true,
      render: (value) => <span className="count-badge">{value}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Manage Events</h1>
          <p className="subtitle">Create and manage your events</p>
        </div>

        <button className="btn btn-primary btn-lg" onClick={() => handleOpenForm()}>
          + Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <FormSelect
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'ongoing', label: 'Ongoing' },
            { value: 'completed', label: 'Completed' }
          ]}
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
        />

        {getActiveFiltersCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Content */}
      <div className="manager-content">
        {loading ? (
          <LoadingSpinner text="Loading events..." />
        ) : error ? (
          <div className="alert alert-danger">
            <span>Error: {error}</span>
            <button className="btn btn-sm btn-primary" onClick={fetchEvents}>
              Retry
            </button>
          </div>
        ) : events?.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No Events Found"
            description="Create your first event to get started"
            action={{ label: 'Create Event', onClick: () => handleOpenForm() }}
          />
        ) : (
          <>
            <div className="table-wrapper">
              <DataTable
                columns={columns}
                data={events || []}
                loading={loading}
                actions={[
                  {
                    label: '✏ Edit',
                    onClick: (event) => handleOpenForm(event),
                    className: 'btn-secondary'
                  },
                  {
                    label: '🗑 Delete',
                    onClick: (event) => {
                      setSelectedEvent(event);
                      setShowDeleteConfirm(true);
                    },
                    className: 'btn-danger'
                  }
                ]}
              />
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="btn btn-sm"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  className="btn btn-sm"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <Modal
          isOpen={showEventForm}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
            resetForm();
          }}
          title={editingEvent ? 'Edit Event' : 'Create New Event'}
          size="lg"
          actions={[
            {
              label: 'Cancel',
              className: 'btn-secondary',
              onClick: () => {
                setShowEventForm(false);
                resetForm();
              }
            },
            {
              label: editingEvent ? 'Update Event' : 'Create Event',
              className: 'btn-primary',
              onClick: handleSubmit
            }
          ]}
        >
          <form className="event-form">
            <FormInput
              label="Event Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter event name"
              error={touched.name && errors.name}
              required
            />

            <FormTextArea
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe your event"
              error={touched.description && errors.description}
              maxLength={500}
              rows={4}
            />

            <div className="form-grid-2">
              <FormInput
                label="Start Date"
                name="startDate"
                type="date"
                value={values.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.startDate && errors.startDate}
                required
              />

              <FormInput
                label="End Date"
                name="endDate"
                type="date"
                value={values.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.endDate && errors.endDate}
                required
              />
            </div>

            <FormSelect
              label="Status"
              name="status"
              value={values.status}
              onChange={handleChange}
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' }
              ]}
              required
            />
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Event"
          message={`Are you sure you want to delete "${selectedEvent?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setSelectedEvent(null);
          }}
          isDestructive
        />
      )}
    </div>
  );
};

export default ManagerEvents;
