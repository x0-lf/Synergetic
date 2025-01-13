import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientListItem from './ClientListItem';
import axios from 'axios';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [totalClients, setTotalClients] = useState(0);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [clientsPerPage, setClientsPerPage] = useState(10);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const fetchRole = async () => {
        try {
            if (!token) {
                throw new Error('Token not found in localStorage.');
            }

            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
            console.log('Decoded token:', decodedToken);
            setRole(decodedToken.role);
            console.log('Decoded role:', decodedToken.role);
        } catch (error) {
            console.error('Error decoding token:', error);
            alert('Error: Unable to determine user role. Please log in again.');
            navigate('/login');
        }
    };

    const fetchClients = async () => {
        if (role === 'admin') {
            try {
                const response = await axios.get(`http://localhost:5000/api/clients`, {
                    headers: {Authorization: `Bearer ${token}`},
                    params: {page, limit: clientsPerPage},
                });
                setClients(response.data.clients);
                setTotalClients(response.data.total);
            } catch (error) {
                console.error('Error fetching clients:', error);
                if (error.response?.status === 403 || error.response?.status === 401) {
                    alert('Access denied.');
                    navigate('/login');
                }
            }
        }
    };

    const fetchClientData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/clients/self`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients([response.data]); // Only the current client's data
        } catch (error) {
            console.error('Error fetching client data:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied.');
                navigate('/login');
            }
        }
    };

    const showDetails = async (id) => {
        try {
            const endpoint = role === 'admin'
                ? `http://localhost:5000/api/clients/${id}`
                : `http://localhost:5000/api/clients/self`;

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.birthdate) {
                response.data.birthdate = response.data.birthdate.split('T')[0];
            }
            setSelectedClient(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching client details:', error);
            alert('Access denied.');
            navigate('/login');
        }
    };

    const deleteClient = async (id) => {
        try {
            if (role === 'admin') {
                await axios.delete(`http://localhost:5000/api/clients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchClients(); // Refresh the client list
            } else {
                alert('You do not have permission to delete clients.');
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Access denied.');
            navigate('/login');
        }
    };

    const handleAddClient = () => {
        navigate('/clients/add');
    };

    const handleClientsPerPageChange = (e) => {
        setClientsPerPage(Number(e.target.value));
        setPage(1);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClient(null);
    };

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to view this page.');
            navigate('/login');
            return;
        }

        fetchRole();
        if (role === 'admin') {
            fetchClients();
        } else if (role === 'client') {
            fetchClientData();
        }
    }, [location, page, clientsPerPage, role]);

    const totalPages = Math.ceil(totalClients / clientsPerPage);

    return (
        <div>
            <h2>{role === 'admin' ? 'Client List' : 'Your Data'}</h2>

            {role === 'admin' && (
                <button onClick={handleAddClient} className="button-add">Add Client</button>
            )}

            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <ClientListItem
                        key={client.id_client}
                        client={client}
                        onDelete={role === 'admin' ? deleteClient : null}
                        onDetails={showDetails}
                        isAdmin={role === 'admin'}
                    />
                ))}
                </tbody>
            </table>

            {showModal && selectedClient && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Client Details</h3>
                        <p><strong>Name:</strong> {selectedClient.name}</p>
                        <p><strong>Surname:</strong> {selectedClient.surname}</p>
                        <p><strong>Birthdate:</strong> {selectedClient.birthdate}</p>
                        <p><strong>Phone Number:</strong> {selectedClient.phone_number}</p>
                        <p><strong>Email:</strong> {selectedClient.email}</p>
                        <button onClick={closeModal} className="modal-close-button">Close</button>
                    </div>
                </div>
            )}

            {role === 'admin' && (
                <div className="pagination-controls">
                    <label htmlFor="clientsPerPage">Clients per page:</label>
                    <select id="clientsPerPage" value={clientsPerPage} onChange={handleClientsPerPageChange}>
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
            )}
        </div>
    );
};

export default ClientList;
