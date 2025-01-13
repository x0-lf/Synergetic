import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ValidationInput from './ValidationInput';
import ValidationSelect from './../ValidationSelect';
import axios from 'axios';

const TicketForm = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Get token from localStorage
    const [newTicket, setNewTicket] = useState({
        price: '',
        start_of_event: '',
        events_id_event: '',
        clients_id_client: '',
    });

    const [events, setEvents] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEventsAndClients = async () => {
        if (!token) {
            alert('You must be logged in to add a ticket.');
            navigate('/login');
            return;
        }

        try {
            const [eventsResponse, clientsResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/events', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://localhost:5000/api/clients', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setEvents(eventsResponse.data.events || []);
            setClients(clientsResponse.data.clients || []);
        } catch (error) {
            console.error('Error fetching events or clients:', error);
            alert('Failed to load events or clients. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEventsAndClients();
    }, []);

    const addTicket = async () => {
        if (
            !newTicket.price ||
            !newTicket.start_of_event ||
            !newTicket.events_id_event ||
            !newTicket.clients_id_client
        ) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/tickets', newTicket, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewTicket({
                price: '',
                start_of_event: '',
                events_id_event: '',
                clients_id_client: '',
            });
            setMessage('Ticket added successfully! Redirecting...');
            setTimeout(() => navigate('/tickets'), 1000);
        } catch (error) {
            console.error('Error adding ticket:', error);
            alert('Failed to add the ticket. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addTicket();
    };

    return (
        <div>
            <h1>Add Ticket</h1>
            {message && <div className="alert">{message}</div>}

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <form id="clientForm" onSubmit={handleSubmit}>
                    <label htmlFor="price">Price:</label>
                    <ValidationInput
                        id="price"
                        type="number"
                        value={newTicket.price}
                        onChange={(value) => setNewTicket({ ...newTicket, price: value })}
                        validate={(price) => Number(price) > 0}
                        errorMessage="Invalid price: Must be greater than 0."
                    />
                    <br />

                    <label htmlFor="start_of_event">Start of Event:</label>
                    <ValidationInput
                        id="start_of_event"
                        type="datetime-local"
                        value={newTicket.start_of_event}
                        onChange={(value) => setNewTicket({ ...newTicket, start_of_event: value })}
                        validate={(date) => !!date}
                        errorMessage="Invalid date: Must be a valid date and time."
                    />
                    <br />

                    <label htmlFor="event">Event:</label>
                    <ValidationSelect
                        value={newTicket.events_id_event}
                        onChange={(value) => setNewTicket({ ...newTicket, events_id_event: value })}
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
                        value={newTicket.clients_id_client}
                        onChange={(value) => setNewTicket({ ...newTicket, clients_id_client: value })}
                        validate={(id) => !!id}
                        errorMessage="Invalid client: Must select a client."
                        options={clients.map((client) => ({
                            value: client.id_client.toString(),
                            label: `${client.name} ${client.surname}`,
                        }))}
                    />
                    <br />

                    <button type="submit" className="form-button-submit">Add Ticket</button>
                </form>
            )}
        </div>
    );
};

export default TicketForm;
