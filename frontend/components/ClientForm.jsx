import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ValidationInput from './ValidationInput';
import {
    isNameValid,
    isSurnameValid,
    isBirthdayValid,
    isEmailValid,
    isPhoneNumberValid,
} from './utils/validation.js';
import axios from 'axios';

const ClientForm = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [newClient, setNewClient] = useState({
        name: '',
        surname: '',
        birthdate: '',
        phone_number: '',
        email: '',
        login: '',
        password: '',
        role: 'client',
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to add a client.');
            navigate('/login');
        }
    }, [token, navigate]);

    const addClient = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/clients',
                newClient,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewClient({
                name: '',
                surname: '',
                birthdate: '',
                phone_number: '',
                email: '',
                login: '',
                password: '',
                role: 'client',
            });
            setMessage('Client added successfully! Redirecting...');
            setTimeout(() => navigate('/clients'), 1000);
        } catch (error) {
            console.error('Error adding client:', error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('Access denied: You do not have the necessary permissions.');
                navigate('/login');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !isNameValid(newClient.name) ||
            !isSurnameValid(newClient.surname) ||
            !isBirthdayValid(newClient.birthdate) ||
            !isEmailValid(newClient.email) ||
            !isPhoneNumberValid(newClient.phone_number) ||
            newClient.login.trim() === '' ||
            newClient.password.trim() === ''
        ) {
            alert('Please fill out all fields correctly.');
            return;
        }

        addClient();
    };

    const handleChange = (field, value) => {
        setNewClient({ ...newClient, [field]: value });
    };

    return (
        <div>
            <h1>Client Management</h1>
            {message && <div className="">{message}</div>}

            {navigator.userAgent.includes('Firefox') && (
                <small id="firefox">Note: Some input behavior may differ in Firefox.</small>
            )}

            <form id="clientForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <ValidationInput
                    id="name"
                    type="text"
                    value={newClient.name}
                    onChange={(value) => handleChange('name', value)}
                    validate={isNameValid}
                    errorMessage="Invalid name: Must start with a capital letter and be at least 3 characters long."
                />
                <br />

                <label htmlFor="surname">Surname:</label>
                <ValidationInput
                    id="surname"
                    type="text"
                    value={newClient.surname}
                    onChange={(value) => handleChange('surname', value)}
                    validate={isSurnameValid}
                    errorMessage="Invalid surname: Must start with a capital letter and be at least 3 characters long."
                />
                <br />

                <label htmlFor="birthdate">Birthdate:</label>
                <ValidationInput
                    id="birthdate"
                    type="date"
                    value={newClient.birthdate}
                    onChange={(value) => handleChange('birthdate', value)}
                    validate={isBirthdayValid}
                    errorMessage="Invalid birthdate: Must be at least 18 years old."
                />
                <br />

                <label htmlFor="email">Email:</label>
                <ValidationInput
                    id="email"
                    type="text"
                    value={newClient.email}
                    onChange={(value) => handleChange('email', value)}
                    validate={isEmailValid}
                    errorMessage="Invalid email: Must be a valid email address."
                />
                <br />

                <label htmlFor="phone">Phone Number:</label>
                <ValidationInput
                    id="phone"
                    type="text"
                    value={newClient.phone_number}
                    onChange={(value) => handleChange('phone_number', value)}
                    validate={isPhoneNumberValid}
                    errorMessage="Invalid phone number: Must be a valid phone number."
                />
                <br />

                <label htmlFor="login">Login:</label>
                <ValidationInput
                    id="login"
                    type="text"
                    value={newClient.login}
                    onChange={(value) => handleChange('login', value)}
                    validate={(login) => login.trim() !== ''}
                    errorMessage="Login is required."
                />
                <br />

                <label htmlFor="password">Password:</label>
                <ValidationInput
                    id="password"
                    type="password"
                    value={newClient.password}
                    onChange={(value) => handleChange('password', value)}
                    validate={(password) => password.trim() !== ''}
                    errorMessage="Password is required."
                />
                <br />

                <label htmlFor="role">Role:</label>
                <select
                    id="role"
                    value={newClient.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="form-select"
                >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                </select>
                <br />

                <button type="submit" className="form-button-submit">Add Client</button>
            </form>
        </div>
    );
};

export default ClientForm;
