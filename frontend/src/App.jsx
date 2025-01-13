import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

import ClientForm from '../components/ClientForm';
import ClientList from '../components/client/ClientList';
import UpdateClientForm from './../components/client/UpdateClientForm';

import EventForm from '../components/EventForm';
import EventList from '../components/event/EventList';
import UpdateEventForm from '../components/event/UpdateEventForm';

import TicketForm from '../components/TicketForm';
import TicketList from '../components/ticket/TicketList';
import UpdateTicketForm from "../components/ticket/UpdateTicketForm.jsx";
import HomePage from '../components/HomePage';
import AuthForm from "../components/auth/AuthForm.jsx";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>

                {/*Home*/}
                <Route path="/" element={<HomePage />} />
                {/*Register & Login Routes*/}

                <Route path="/login" element={<AuthForm />} />

                {/* Client Routes */}
                <Route path="/clients/add" element={<ClientForm />} />
                <Route path="/clients" element={<ClientList />} />
                <Route path="/clients/self" element={<ClientList />} />
                <Route path="/clients/update/:id" element={<UpdateClientForm />} />

                {/* Event Routes */}
                <Route path="/events/add" element={<EventForm />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/events/update/:id" element={<UpdateEventForm />} />

                {/* Ticket Routes */}
                <Route path="/tickets/add" element={<TicketForm />} />
                <Route path="/tickets" element={<TicketList />} />
                <Route path="/tickets/update/:id" element={<UpdateTicketForm />} />

            </Routes>
        </Router>
    );
};

export default App;
