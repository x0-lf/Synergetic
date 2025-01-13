import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ValidationInput from './../ValidationInput';
import { isNameValid, isSurnameValid, isBirthdayValid, isEmailValid, isPhoneNumberValid } from './../utils/validation.js';
import axios from 'axios';

const UpdateClientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [client, setClient] = useState({
        name: '',
        surname: '',
        birthdate: '',
        phone_number: '',
        email: '',
        login: '',
        password: '',
        role: 'client',
    });

    const [role, setRole] = useState('');
    const token = localStorage.getItem('token');

    const fetchRole = async () => {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
            setRole(decodedToken.role);
        } catch (error) {
            console.error('Error decoding token:', error);
            alert('Error: Unable to determine user role. Please log in again.');
            navigate('/login');
        }
    };

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to view this page.');
            navigate('/login');
            return;
        }

        fetchRole();

        const fetchClient = async () => {
            try {
                const endpoint =
                    role === 'admin'
                        ? `http://localhost:5000/api/clients/${id}`
                        : `http://localhost:5000/api/clients/self`;

                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fetchedClient = response.data;
                if (fetchedClient.birthdate) {
                    fetchedClient.birthdate = fetchedClient.birthdate.split('T')[0];
                }

                if(role === 'admin') {
                    setClient({ ...fetchedClient});
                }
                setClient({ ...fetchedClient, password: '' });
            } catch (error) {
                console.error('Error fetching client:', error);
                alert('Access denied.');
                navigate('/login');
            }
        };



        if (role) fetchClient();
    }, [id, token, role, navigate]);

    const updateClient = async () => {
        try {
            const endpoint =
                role === 'admin'
                    ? `http://localhost:5000/api/clients/${id}`
                    : `http://localhost:5000/api/clients/self`;

            await axios.put(endpoint, client, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage('Client updated successfully! Redirecting...');
            setTimeout(() => navigate('/clients'), 1000);
        } catch (error) {
            console.error('Error updating client:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied.');
                navigate('/login');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !isNameValid(client.name) ||
            !isSurnameValid(client.surname) ||
            !isBirthdayValid(client.birthdate) ||
            !isEmailValid(client.email) ||
            !isPhoneNumberValid(client.phone_number) ||
            client.login.trim() === '' ||
            (role === 'admin' && client.password && client.password.length < 6)
        ) {
            alert('Please fill out all fields correctly.');
            return;
        }

        updateClient();
    };


    return (
        <div>
            <h1>{role === 'admin' ? 'Update Client' : 'Update Your Data'}</h1>
            {message && <div>{message}</div>}

            <form id="clientForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <ValidationInput
                    id="name"
                    type="text"
                    value={client.name}
                    onChange={(value) => setClient({...client, name: value})}
                    validate={isNameValid}
                    errorMessage="Invalid name: Must start with a capital letter and be at least 3 characters long."
                />
                <br/>

                <label htmlFor="surname">Surname:</label>
                <ValidationInput
                    id="surname"
                    type="text"
                    value={client.surname}
                    onChange={(value) => setClient({...client, surname: value})}
                    validate={isSurnameValid}
                    errorMessage="Invalid surname: Must start with a capital letter and be at least 3 characters long."
                />
                <br/>

                <label htmlFor="birthdate">Birthdate:</label>
                <ValidationInput
                    id="birthdate"
                    type="date"
                    value={client.birthdate}
                    onChange={(value) => setClient({...client, birthdate: value})}
                    validate={isBirthdayValid}
                    errorMessage="Invalid birthdate: Must be at least 18 years old."
                />
                <br/>

                <label htmlFor="email">Email:</label>
                <ValidationInput
                    id="email"
                    type="text"
                    value={client.email}
                    onChange={(value) => setClient({...client, email: value})}
                    validate={isEmailValid}
                    errorMessage="Invalid email: Must be a valid email address."
                />
                <br/>

                <label htmlFor="phone">Phone Number:</label>
                <ValidationInput
                    id="phone"
                    type="text"
                    value={client.phone_number}
                    onChange={(value) => setClient({...client, phone_number: value})}
                    validate={isPhoneNumberValid}
                    errorMessage="Invalid phone number: Must be a valid phone number."
                />
                <br/>

                <label htmlFor="login">Login:</label>
                <ValidationInput
                    id="login"
                    type="text"
                    value={client.login}
                    onChange={(value) => setClient({...client, login: value})}
                    validate={(login) => login.trim() !== ''}
                    errorMessage="Login is required."
                />
                <br/>

                <label htmlFor="password">Password:</label>
                <ValidationInput
                    id="password"
                    type="password"
                    value={client.password}
                    onChange={(value) => setClient({...client, password: value})}
                    validate={(password) => password.trim() === '' || password.length >= 6}
                    errorMessage="Password must be at least 8 characters long."
                />
                {role === 'admin' && (
                    <>


                        <br/>

                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            value={client.role}
                            onChange={(e) => setClient({...client, role: e.target.value})}
                            className="form-select"
                        >
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                        </select>
                        <br/>
                    </>
                )}

                <button type="submit" className="form-button-submit">
                    {role === 'admin' ? 'Update Client' : 'Update'}
                </button>
            </form>
        </div>
    );
};

export default UpdateClientForm;
