import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ValidationInput from './../ValidationInput';
import axios from 'axios';
import {
    isEventStatusValid,
    isEventNameValid,
    isEventDescriptionValid,
    isEventSeatsValid,
} from './../utils/validation.js';
import ValidationSelect from './../../ValidationSelect.jsx';

const UpdateEventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [event, setEvent] = useState({
        name: '',
        description: '',
        seats: '',
        status: '',
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to view this page.');
            navigate('/login');
            return;
        }

        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const fetchedEvent = response.data;
                setEvent(fetchedEvent);
            } catch (error) {
                console.error('Error fetching event:', error);
                if (error.response?.status === 403 || error.response?.status === 401) {
                    alert('Access denied: You must be an admin to update events.');
                    navigate('/login');
                }
            }
        };

        fetchEvent();
    }, [id, token, navigate]);

    const updateEvent = async () => {
        try {
            await axios.put(`http://localhost:5000/api/events/${id}`, event, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage('Event updated successfully! Redirecting...');
            setTimeout(() => navigate('/events'), 1000);
        } catch (error) {
            console.error('Error updating event:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied: You must be an admin to update events.');
                navigate('/login');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !isEventNameValid(event.name) ||
            !isEventDescriptionValid(event.description) ||
            !isEventSeatsValid(event.seats) ||
            !isEventStatusValid(event.status)
        ) {
            alert('Please fill out all fields correctly.');
            return;
        }

        updateEvent();
    };

    return (
        <div>
            <h1>Update Event</h1>
            {message && <div>{message}</div>}
            {navigator.userAgent.includes('Firefox') && (
                <small id="firefox">Note: Some input behavior may differ in Firefox.</small>
            )}
            <form id="clientForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <ValidationInput
                    id="name"
                    type="text"
                    value={event.name}
                    onChange={(value) => setEvent({ ...event, name: value })}
                    validate={isEventNameValid}
                    errorMessage="Invalid name: Must be at least 3 characters long with a maximum of 64 characters."
                />
                <br />

                <label htmlFor="description">Description:</label>
                <ValidationInput
                    id="description"
                    type="text"
                    value={event.description}
                    onChange={(value) => setEvent({ ...event, description: value })}
                    validate={isEventDescriptionValid}
                    errorMessage="Invalid description: Must be at least 3 characters long with a maximum of 64 characters."
                />
                <br />

                <label htmlFor="seats">Seats:</label>
                <ValidationInput
                    id="seats"
                    type="number"
                    value={event.seats}
                    onChange={(value) => setEvent({ ...event, seats: value })}
                    validate={isEventSeatsValid}
                    errorMessage="Invalid seats: Must be a number between 1 and 1000."
                />
                <br />

                <label htmlFor="created_at">Created At:</label>
                <input
                    id="created_at"
                    type="datetime-local"
                    value={event.created_at}
                    readOnly
                />
                <br />

                <label htmlFor="status">Status:</label>
                <ValidationSelect
                    value={event.status}
                    onChange={(value) => setEvent({ ...event, status: value })}
                    validate={isEventStatusValid}
                    errorMessage="Invalid status: Must select 'Upcoming Event' or 'Past Event'."
                    options={[
                        { value: 'upcoming_event', label: 'Upcoming Event' },
                        { value: 'past_event', label: 'Past Event' },
                    ]}
                />
                <br />

                <button type="submit" className="form-button-submit">Update Event</button>
            </form>
        </div>
    );
};

export default UpdateEventForm;
