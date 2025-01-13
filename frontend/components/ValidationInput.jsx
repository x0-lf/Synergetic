import PropTypes from 'prop-types';

const ValidationInput = ({type, value, onChange, validate, errorMessage }) => {
    const isValid = validate(value);

    return (
        <div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? e.target.value.replace(/[^0-9]/g, '') : e.target.value)}
                className={isValid ? '' : 'invalid-input'}
            />
            {!isValid && <span id="errorName">{errorMessage}</span>}
        </div>
    );
};

ValidationInput.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
};

export default ValidationInput;