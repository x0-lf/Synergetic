import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ValidationInput from './../ValidationInput';
import ValidationSelect from './../../ValidationSelect';
import axios from 'axios';

const UpdateTicketForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [ticket, setTicket] = useState({
        price: '',
        start_of_event: '',
        events_id_event: '',
        clients_id_client: '',
    });

    const [events, setEvents] = useState([]);
    const [clients, setClients] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to view this page.');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [eventsResponse, clientsResponse, ticketResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/events', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:5000/api/clients', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`http://localhost:5000/api/tickets/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setEvents(eventsResponse.data.events || []);
                setClients(clientsResponse.data.clients || []);

                setTicket({
                    ...ticketResponse.data,
                    events_id_event: ticketResponse.data.events_id_event?.toString() || '',
                    clients_id_client: ticketResponse.data.clients_id_client?.toString() || '',
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load ticket data. Please try again.');
            }
        };

        fetchData();
    }, [id, token, navigate]);

    const updateTicket = async () => {
        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}`, ticket, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Ticket updated successfully! Redirecting...');
            setTimeout(() => navigate('/tickets'), 1000);
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('Failed to update the ticket. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!ticket.price || !ticket.start_of_event || !ticket.events_id_event || !ticket.clients_id_client) {
            alert('Please fill out all fields.');
            return;
        }

        updateTicket();
    };

    return (
        <div>
            <h1>Update Ticket</h1>

            {navigator.userAgent.includes('Firefox') && (
                <small id="firefox">Note: Some input behavior may differ in Firefox.</small>
            )}

            {message && <div className="alert">{message}</div>}

            <form id="clientForm" onSubmit={handleSubmit}>
                <label htmlFor="price">Price:</label>
                <ValidationInput
                    id="price"
                    type="number"
                    value={ticket.price}
                    onChange={(value) => setTicket({ ...ticket, price: value })}
                    validate={(price) => Number(price) > 0}
                    errorMessage="Invalid price: Must be greater than 0."
                />
                <br />

                <label htmlFor="start_of_event">Start of Event:</label>
                <ValidationInput
                    id="start_of_event"
                    type="datetime-local"
                    value={ticket.start_of_event}
                    onChange={(value) => setTicket({ ...ticket, start_of_event: value })}
                    validate={(date) => !!date}
                    errorMessage="Invalid date: Must be a valid date and time."
                />
                <br />

                <label htmlFor="event">Event:</label>
                <ValidationSelect
                    value={ticket.events_id_event}
                    onChange={(value) => setTicket({ ...ticket, events_id_event: value })}
                    validate={(id) => !!id}
                    errorMessage="Invalid event: Must select an event."
                    options={events.map((event) => ({
                        value: event.id_event.toString(),
                        label: event.name,
                    }))}
                />
                <br />

                <label htmlFor="client">Client:</label>
                <ValidationSelect
                    value={ticket.clients_id_client}
                    onChange={(value) => setTicket({ ...ticket, clients_id_client: value })}
                    validate={(id) => !!id}
                    errorMessage="Invalid client: Must select a client."
                    options={clients.map((client) => ({
                        value: client.id_client.toString(),
                        label: `${client.name} ${client.surname}`,
                    }))}
                />
                <br />

                <button type="submit" className="form-button-submit">Update Ticket</button>
            </form>
        </div>
    );
};

export default UpdateTicketForm;
