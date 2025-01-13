import { Link } from 'react-router-dom';
import '../../public/stylesheets/index.css'; // Ensure you include your custom styles

const Navbar = () => {
    return (
        <div className="navbar-div-tables">
            <nav className="navbar-tables">
                <ul id="navlist-tables">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login/Register</Link>
                    </li>
                    <li>
                        <Link to="/events">Event</Link>
                    </li>
                    <li>
                        <Link to="/tickets">Ticket</Link>
                    </li>
                    <li>
                        <Link to="/clients">Client</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;