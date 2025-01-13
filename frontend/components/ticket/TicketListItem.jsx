import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TicketListItem = ({ ticket, role, onDelete, onDetails }) => {
    return (
        <tr>
            <td>{ticket.event_name}</td>
            <td>{ticket.client_name} {ticket.client_surname}</td>
            <td>{ticket.price}</td>
            <td>
                <ul className="list-actions">
                    <li>
                        <button onClick={() => onDetails(ticket.id_ticket)} className="list-actions-button-details">
                            Details
                        </button>
                    </li>
                    {role === 'admin' && (
                        <>
                            <li>
                                <Link to={`/tickets/update/${ticket.id_ticket}`} className="list-actions-button-edit">
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <button onClick={() => onDelete(ticket.id_ticket)} className="list-actions-button-delete">
                                    Remove
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </td>
        </tr>
    );
};

TicketListItem.propTypes = {
    ticket: PropTypes.object.isRequired,
    role: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDetails: PropTypes.func.isRequired,
};

export default TicketListItem;
