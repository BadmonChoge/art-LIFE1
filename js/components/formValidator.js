// js/components/formValidator.js
class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = Array.from(form.querySelectorAll('[data-validate]'));
        this.init();
    }

    init() {
        this.form.setAttribute('novalidate', '');
        this.fields.forEach(field => {
            field.addEventListener('blur', this.validateField.bind(this));
            field.addEventListener('input', this.clearError.bind(this));
        });
        this.form.addEventListener('submit', this.validateAll.bind(this));
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const type = field.type || field.dataset.validate;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearError(field);

        // Validation rules
        if (field.required && !value) {
            isValid = false;
            errorMessage = field.dataset.requiredMessage || 'This field is required';
        } else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = field.dataset.emailMessage || 'Please enter a valid email address';
            }
        } else if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = field.dataset.phoneMessage || 'Please enter a valid phone number';
            }
        }

        // Show error if invalid
        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    validateAll(e) {
        let allValid = true;
        
        this.fields.forEach(field => {
            if (!this.validateField({ target: field })) {
                allValid = false;
            }
        });

        if (!allValid && e) {
            e.preventDefault();
            // Focus on first invalid field
            const firstInvalid = this.form.querySelector('.error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }

        return allValid;
    }

    showError(field, message) {
        // Remove existing error
        this.clearError(field);

        // Create error element
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = 'color: #ff4444; font-size: 0.8rem; margin-top: 0.25rem;';

        // Add error class to field
        field.classList.add('error');

        // Insert error message
        field.parentNode.appendChild(error);
    }

    clearError(e) {
        const field = e.target || e;
        field.classList.remove('error');
        
        const error = field.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }
}