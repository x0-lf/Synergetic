import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EventListItem from './EventListItem';
import axios from 'axios';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');

    const fetchRole = () => {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setRole(decodedToken.role);
        } catch (error) {
            console.error('Error decoding token:', error);
            alert('Error: Unable to determine user role. Please log in again.');
            navigate('/login');
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/events?page=${page}&limit=${eventsPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEvents(response.data.events);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching events:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied: You must be logged in with appropriate permissions.');
                navigate('/login');
            }
        }
    };

    const showDetails = async (id) => {
        // if (role !== 'admin') return;
        try {
            const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedEvent(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching event details:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied: You do not have the necessary permissions.');
                navigate('/login');
            }
        }
    };

    const deleteEvent = async (id) => {
        if (role !== 'admin') return;
        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied: You do not have the necessary permissions.');
                navigate('/login');
            }
        }
    };

    const handleAddEvent = () => {
        if (role !== 'admin') return;
        navigate('/events/add');
    };

    const handleEventsPerPageChange = (e) => {
        setEventsPerPage(Number(e.target.value));
        setPage(1);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to view this page.');
            navigate('/login');
            return;
        }
        fetchRole();
        fetchEvents();
    }, [location, token, page, eventsPerPage]);

    return (
        <div>
            <h2>Event List</h2>

            {role === 'admin' && (
                <button onClick={handleAddEvent} className="button-add">
                    Add Event
                </button>
            )}

            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <EventListItem
                        key={event.id_event}
                        event={event}
                        onDelete={role === 'admin' ? deleteEvent : null}
                        // onDetails={role === 'admin' ? showDetails : null}
                        onDetails={showDetails}
                        isAdmin={role === 'admin'}
                    />
                ))}
                </tbody>
            </table>

            {showModal && selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Event Details</h3>
                        <p><strong>Name:</strong> {selectedEvent.name}</p>
                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                        <p><strong>Status:</strong> {selectedEvent.status}</p>
                        <p><strong>Seats:</strong> {selectedEvent.seats}</p>
                        {role === 'admin' && (
                            <p><strong>Created At:</strong> {selectedEvent.created_at}</p>
                        )}
                        <button onClick={closeModal} className="modal-close-button">Close</button>
                    </div>
                </div>
            )}

            <div className="pagination-controls">
                <label htmlFor="eventsPerPage">Events per page:</label>
                <select id="eventsPerPage" value={eventsPerPage} onChange={handleEventsPerPageChange}>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <div className="pagination-buttons">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventList;
