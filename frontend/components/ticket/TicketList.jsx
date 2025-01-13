import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketListItem from './TicketListItem';
import axios from 'axios';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [ticketsPerPage, setTicketsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [role, setRole] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to view this page.');
            navigate('/login');
            return;
        }

        const fetchRoleAndTickets = async () => {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
                setRole(decodedToken.role);

                const response = await axios.get('http://localhost:5000/api/tickets', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, limit: ticketsPerPage },
                });

                setTickets(response.data.tickets);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                alert('Failed to fetch tickets. Please try again.');
            }
        };

        fetchRoleAndTickets();
    }, [page, ticketsPerPage, token, navigate]);

    const handleDelete = async (id) => {
        if (role !== 'admin') return;

        try {
            await axios.delete(`http://localhost:5000/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTickets((prev) => prev.filter((ticket) => ticket.id_ticket !== id));
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Failed to delete the ticket.');
        }
    };

    const showDetails = async (id) => {
        try {
            const endpoint = `http://localhost:5000/api/tickets/${id}/details`;

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedTicket(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
            alert('Access denied.');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTicket(null);
    };

    const handleTicketsPerPageChange = (e) => {
        setTicketsPerPage(Number(e.target.value));
        setPage(1);
    };

    const handleAddTicket = () => {
        if (role === 'admin') {
            navigate('/tickets/add');
        }
    };

    return (
        <div>
            <h2>{role === 'admin' ? 'All Tickets' : 'Your Tickets'}</h2>
            {role === 'admin' && (
                <button onClick={handleAddTicket} className="button-add">Add Ticket</button>
            )}

            <table>
                <thead>
                <tr>
                    <th>Event</th>
                    <th>Client</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map((ticket) => (
                    <TicketListItem
                        key={ticket.id_ticket}
                        ticket={ticket}
                        role={role}
                        onDelete={handleDelete}
                        onDetails={showDetails}
                    />
                ))}
                </tbody>
            </table>

            {showModal && selectedTicket && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Ticket Details</h3>

                        <h4>Event:</h4>
                        <p><strong>Event Name:</strong> {selectedTicket.event_name || 'N/A'}</p>
                        <p><strong>Description:</strong> {selectedTicket.event_description || 'N/A'}</p>
                        <p><strong>Seats:</strong> {selectedTicket.event_seats || 'N/A'}</p>
                        <p><strong>Created At:</strong> {selectedTicket.event_created_at || 'N/A'}</p>
                        <p><strong>Status:</strong> {selectedTicket.event_status || 'N/A'}</p>

                        <h4>Ticket:</h4>
                        <p><strong>Price:</strong> ${selectedTicket.price || 'N/A'}</p>
                        <p><strong>Start of Event:</strong> {selectedTicket.start_of_event || 'N/A'}</p>

                        <h4>Client:</h4>
                        <p><strong>Name:</strong> {selectedTicket.client_name || 'N/A'} {selectedTicket.client_surname || 'N/A'}</p>
                        <p><strong>Birthdate:</strong> {selectedTicket.client_birthdate || 'N/A'}</p>
                        <p><strong>Phone Number:</strong> {selectedTicket.client_phone_number || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedTicket.client_email || 'N/A'}</p>

                        <button onClick={closeModal} className="modal-close-button">Close</button>
                    </div>
                </div>
            )}

            <div className="pagination-controls">
                <label htmlFor="ticketsPerPage">Tickets per page:</label>
                <select id="ticketsPerPage" value={ticketsPerPage} onChange={handleTicketsPerPageChange}>
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

export default TicketList;
