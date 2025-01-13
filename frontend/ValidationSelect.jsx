import PropTypes from 'prop-types';

const ValidationSelect = ({ value, onChange, validate, errorMessage, options }) => {
    // Ensure value is always a string
    const normalizedValue = value ? value.toString() : '';

    // Validate the normalized value
    const isValid = validate(normalizedValue);

    // Debugging logs (optional, for development)
    console.log('ValidationSelect value:', normalizedValue);
    console.log('ValidationSelect options:', options);

    return (
        <div>
            <select
                value={normalizedValue}
                onChange={(e) => onChange(e.target.value)}
                className={isValid ? 'form-select' : 'form-select invalid-select'}
            >
                <option value="">Select Status</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {!isValid && <span id="errorName">{errorMessage}</span>}
        </div>
    );
};

ValidationSelect.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ValidationSelect;
