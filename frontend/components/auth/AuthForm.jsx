import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        birthdate: '',
        phone_number: '',
        email: '',
        login: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    const toggleMode = () => {
        setIsRegister((prev) => !prev);
        setFormData({
            name: '',
            surname: '',
            birthdate: '',
            phone_number: '',
            email: '',
            login: '',
            password: '',
        });
        setMessage('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
            const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);

            if (isRegister) {
                setIsRegister(false);
                setMessage('Registration successful! Please log in.');
            } else if (data.token) {
                localStorage.setItem('token', data.token);
                setMessage('Login successful! Redirecting...');
                navigate('/');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h1>{isRegister ? 'Register' : 'Login'}</h1>
            <form id="clientForm" onSubmit={handleSubmit}>
                {isRegister && (
                    <>
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
                        <br/>
                        <label>Surname:</label>
                        <input type="text" name="surname" value={formData.surname} onChange={handleChange} required/>
                        <br/>

                        <label>Birthdate:</label>
                        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange}
                               required/>
                        <br/>

                        <label>Phone Number:</label>
                        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange}
                               required/>
                        <br/>

                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
                        <br/>

                    </>
                )}
                <label>Login:</label>
                <input type="text" name="login" value={formData.login} onChange={handleChange} required/>
                <br/>

                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                <br/>

                <button type="submit" className="form-button-submit">{isRegister ? 'Register' : 'Login'}</button>

                <br/>
                <button onClick={toggleMode} className="button-register">
                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
            </form>

        </div>
    );
};

export default AuthForm;
