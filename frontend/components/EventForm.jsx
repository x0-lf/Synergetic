import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ValidationInput from './ValidationInput';
import {
    isEventStatusValid,
    isEventNameValid,
    isEventDescriptionValid,
    isEventSeatsValid
} from './utils/validation.js';
import axios from 'axios';
import ValidationSelect from '../ValidationSelect.jsx';

const EventForm = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        seats: '',
        created_at: new Date().toISOString().slice(0, 16) || '',
        status: '',
    });

    const token = localStorage.getItem('token');

    const addEvent = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/events',
                newEvent,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewEvent({
                name: '',
                description: '',
                seats: '',
                created_at: new Date().toISOString().slice(0, 16) || '',
                status: '',
            });
            setMessage('Event added successfully! Redirecting...');
            setTimeout(() => navigate('/events'), 1000);
        } catch (error) {
            console.error('Error adding event:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied: You must be logged in with appropriate permissions.');
                navigate('/login');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !isEventNameValid(newEvent.name) ||
            !isEventDescriptionValid(newEvent.description) ||
            !isEventSeatsValid(newEvent.seats) ||
            !isEventStatusValid(newEvent.status)
        ) {
            alert('Please fill out all fields correctly.');
            return;
        }

        addEvent();
    };

    return (
        <div>
            <h1>Add Event</h1>
            {message && <div>{message}</div>}
            {navigator.userAgent.includes('Firefox') && (
                <small id="firefox">Note: Some input behavior may differ in Firefox.</small>
            )}
            <form id="clientForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <ValidationInput
                    id="name"
                    type="text"
                    value={newEvent.name}
                    onChange={(value) => setNewEvent({ ...newEvent, name: value })}
                    validate={isEventNameValid}
                    errorMessage="Invalid name: Must be at least 3 characters long with Maximum of 64 characters."
                />
                <br />

                <label htmlFor="description">Description:</label>
                <ValidationInput
                    id="description"
                    type="text"
                    value={newEvent.description}
                    onChange={(value) => setNewEvent({ ...newEvent, description: value })}
                    validate={isEventDescriptionValid}
                    errorMessage="Invalid description: Must be at least 3 characters long Maximum of 64 characters."
                />
                <br />

                <label htmlFor="seats">Seats:</label>
                <ValidationInput
                    id="seats"
                    type="number"
                    value={newEvent.seats}
                    onChange={(value) => setNewEvent({ ...newEvent, seats: value })}
                    validate={isEventSeatsValid}
                    errorMessage="Invalid seats: Must be a number between 1 and 1000."
                />
                <br />

                <label htmlFor="created_at">Created At:</label>
                <input
                    id="created_at"
                    type="datetime-local"
                    value={newEvent.created_at}
                    readOnly
                />
                <br />

                <label htmlFor="status">Status:</label>
                <ValidationSelect
                    value={newEvent.status}
                    onChange={(value) => setNewEvent({ ...newEvent, status: value })}
                    validate={isEventStatusValid}
                    errorMessage="Invalid status: Must select 'Upcoming Event' or 'Past Event'."
                    options={[
                        { value: 'upcoming_event', label: 'Upcoming Event' },
                        { value: 'past_event', label: 'Past Event' },
                    ]}
                />
                <br />

                <button type="submit" className="form-button-submit">Add Event</button>
            </form>
        </div>
    );
};

export default EventForm;
