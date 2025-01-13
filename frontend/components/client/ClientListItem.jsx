import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

const ClientListItem = ({ client, onDelete, onDetails, isAdmin }) => {
    return (
        <tr>
            <td>{client.name}</td>
            <td>{client.surname}</td>
            <td>{client.email}</td>
            <td>
                <ul className="list-actions">
                    <li>
                        <button onClick={() => onDetails(client.id_client)} className="list-actions-button-details">
                            Details
                        </button>
                    </li>
                    <li>
                        <Link to={`/clients/update/${client.id_client}`} className="list-actions-button-edit">
                            Edit
                        </Link>
                    </li>
                    {isAdmin && (
                        <li>
                            <button onClick={() => onDelete(client.id_client)} className="list-actions-button-delete">
                                Remove
                            </button>
                        </li>
                    )}
                </ul>
            </td>
        </tr>
    );
};

ClientListItem.propTypes = {
    client: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onDetails: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
};

export default ClientListItem;
