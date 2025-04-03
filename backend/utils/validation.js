const validateRegisterInput = (username, email, password) => {
    const errors = {};
    const isValid = true;

    // username validation
    if (!username || username.trim() === '') {
        errors.username = 'Username is required';
        isValid = false;
    } else if (username < 3) {
        errors.username = 'Username must be at least 3 characters';
        isValid = false;
    } else if (username > 20) {
        errors.username = 'Username must be at most 20 characters';
        isValid = false;
    }

    // Email validation
    if (!email.trim()) {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Please provide a valid email address';
        }
    }

    // Password validation
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};


const validateLoginInput = (email, password) => {
    const errors = {};

    // Email validation
    if (!email.trim()) {
        errors.email = 'Email is required';
    }

    // Password validation
    if (!password) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

module.exports = {
    validateRegisterInput,
    validateLoginInput
};