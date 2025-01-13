
//Client
export const isNameValid = (name) => /^[A-Z][a-zA-Z]{2,63}(-[A-Z][a-zA-Z]{2,63})?$/.test(name);
export const isSurnameValid = (surname) => /^[A-Z][a-zA-Z]{2,63}(-[A-Z][a-zA-Z]{2,63})?$/.test(surname);
export const isBirthdayValid = (birthday) => {
    if (!birthday) return false;
    const now = new Date();
    const birthdayDate = new Date(birthday);
    const age = now.getFullYear() - birthdayDate.getFullYear();
    const monthDiff = now.getMonth() - birthdayDate.getMonth();
    const dayDiff = now.getDate() - birthdayDate.getDate();
    return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
};
export const isEmailValid = (email) =>
    /^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/.test(email);
// export const isPhoneNumberValid = (phone) =>
//     /^\+?[1-9]\d{1,14}(\s|-)?(\(?\d{1,4}\)?)(\s|-)?\d{1,4}(\s|-)?\d{1,9}$/.test(phone);
export const isPhoneNumberValid = (phone) =>
    /^\+?[1-9]\d{8,14}(\s|-)?(\(?\d{1,4}\)?(\s|-)?\d{1,4}(\s|-)?\d{1,9})?$/.test(phone);



//Event
export const isEventNameValid = (eventName) => /^[\w\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{1,64}$/.test(eventName);
export const isEventDescriptionValid = (description) => /^[a-zA-Z0-9\s]{1,64}$/.test(description);
export const isEventSeatsValid = (seats) => {
    const numSeats = Number(seats); // Convert the input to a number
    return Number.isInteger(numSeats) && numSeats > 0 && numSeats <= 1000;
};
// export const isEventCreatedAtValid = (createdAt) => ;
export const isEventStatusValid = (status) => /^(upcoming_event|past_event)$/.test(status);
//export const isEventStatusValid = (status) => ['upcoming_event', 'past_event'].includes(status);
