import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const EventListItem = ({ event, onDelete, onDetails, isAdmin }) => {
    return (
        <tr>
            <td>{event.name}</td>
            <td>{event.description}</td>
            <td>{event.status}</td>
                <td>
                    <ul className="list-actions">
                        <li>
                            <button
                                onClick={() => onDetails(event.id_event)}
                                className="list-actions-button-details"
                            >
                                Details
                            </button>
                        </li>
                        {isAdmin && (
                            <>
                            <li>
                            <Link
                                to={`/events/update/${event.id_event}`}
                                className="list-actions-button-edit"
                            >
                                Edit
                            </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => onDelete(event.id_event)}
                                    className="list-actions-button-delete"
                                >
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

EventListItem.propTypes = {
    event: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onDetails: PropTypes.func,
    isAdmin: PropTypes.bool.isRequired,
};

EventListItem.defaultProps = {
    onDelete: null,
    onDetails: null,
};

export default EventListItem;
