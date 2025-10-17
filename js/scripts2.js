// ============================================
// PORTFOLIO CONTACT FORM VALIDATION
// ============================================
// How to use: Copy this entire code and paste it in your HTML file
// Put it right before the closing </body> tag, wrapped in <script> tags:
// <script> ... paste code here ... </script>

// Wait for the page to load completely
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the form
    let contactForm = document.getElementById('contactForm');
    
    // When someone clicks "Send Message" button
    contactForm.addEventListener('submit', function(event) {
        // Stop the form from submitting right away
        event.preventDefault();
        
        // Get all the values user typed
        let name = document.getElementById('name').value.trim();
        let email = document.getElementById('email').value.trim();
        let phone = document.getElementById('phone').value.trim();
        let message = document.getElementById('message').value.trim();
        
        // Clear any old error messages
        hideAllErrors();
        
        // Track if everything is okay
        let isFormValid = true;
        
        // ============================================
        // VALIDATE NAME
        // ============================================
        if (name === '') {
            showError('name', 'Please enter your name');
            isFormValid = false;
        }
        else if (isOnlySpaces(name)) {
            showError('name', 'Name cannot contain only spaces');
            isFormValid = false;
        }
        else if (containsNumbers(name)) {
            showError('name', 'Name cannot contain numbers');
            isFormValid = false;
        }
        else if (containsSpecialChars(name)) {
            showError('name', 'Name can only contain letters and spaces');
            isFormValid = false;
        }
        else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isFormValid = false;
        }
        
        // ============================================
        // VALIDATE EMAIL
        // ============================================
        if (email === '' && isFormValid) {
            showError('email', 'Please enter your email');
            isFormValid = false;
        }
        else if (!isEmailValid(email) && isFormValid) {
            showError('email', 'Please enter a valid email (example: john@gmail.com)');
            isFormValid = false;
        }
        
        // ============================================
        // VALIDATE PHONE
        // ============================================
        if (phone === '' && isFormValid) {
            showError('phone', 'Please enter your phone number');
            isFormValid = false;
        }
        else if (containsLetters(phone) && isFormValid) {
            showError('phone', 'Phone number cannot contain letters');
            isFormValid = false;
        }
        else if (getOnlyNumbers(phone).length < 10 && isFormValid) {
            showError('phone', 'Phone number must be at least 10 digits');
            isFormValid = false;
        }
        
        // ============================================
        // VALIDATE MESSAGE
        // ============================================
        if (message === '' && isFormValid) {
            showError('message', 'Please enter your message');
            isFormValid = false;
        }
        else if (message.length < 10 && isFormValid) {
            showError('message', 'Message must be at least 10 characters');
            isFormValid = false;
        }
        
        // ============================================
        // IF EVERYTHING IS VALID, SUBMIT THE FORM
        // ============================================
        if (isFormValid) {
            // Show success message
            document.getElementById('submitSuccessMessage').classList.remove('d-none');
            
            // Change button text
            let button = document.getElementById('submitButton');
            button.textContent = 'Sending...';
            button.disabled = true;
            
            // Submit the form to Google Sheets
            contactForm.submit();
        } else {
            // Scroll to first error
            let firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
    
    // ============================================
    // REAL-TIME VALIDATION (as user types)
    // ============================================
    
    // Check name while typing
    document.getElementById('name').addEventListener('input', function() {
        let value = this.value;
        if (value && isOnlySpaces(value)) {
            showError('name', 'Name cannot contain only spaces');
        }
        else if (value && (containsNumbers(value) || containsSpecialChars(value))) {
            showError('name', 'Only letters and spaces allowed');
        } else {
            hideError('name');
        }
    });
    
    // Check email when user leaves the field
    document.getElementById('email').addEventListener('blur', function() {
        let value = this.value.trim();
        if (value && !isEmailValid(value)) {
            showError('email', 'Please enter a valid email');
        } else if (value) {
            hideError('email');
        }
    });
    
    // Check phone while typing
    document.getElementById('phone').addEventListener('input', function() {
        let value = this.value;
        if (value && containsLetters(value)) {
            showError('phone', 'Only numbers and +, -, ( ) allowed');
        } else {
            hideError('phone');
        }
    });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

// Check if text contains only spaces
function isOnlySpaces(text) {
    for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ') {
            return false;
        }
    }
    return true;
}

// Check if text contains numbers (0-9)
function containsNumbers(text) {
    for (let i = 0; i < text.length; i++) {
        if (text[i] >= '0' && text[i] <= '9') {
            return true;
        }
    }
    return false;
}

// Check if text contains special characters
function containsSpecialChars(text) {
    let allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    for (let i = 0; i < text.length; i++) {
        if (!allowed.includes(text[i])) {
            return true;
        }
    }
    return false;
}

// Check if text contains letters (a-z, A-Z)
function containsLetters(text) {
    let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < text.length; i++) {
        if (letters.includes(text[i])) {
            return true;
        }
    }
    return false;
}

// Extract only numbers from phone
function getOnlyNumbers(text) {
    let numbers = '';
    for (let i = 0; i < text.length; i++) {
        if (text[i] >= '0' && text[i] <= '9') {
            numbers += text[i];
        }
    }
    return numbers;
}

// Check if email is valid
function isEmailValid(email) {
    // Must have exactly one @
    let atCount = 0;
    let atPosition = -1;
    for (let i = 0; i < email.length; i++) {
        if (email[i] === '@') {
            atCount++;
            atPosition = i;
        }
    }
    if (atCount !== 1 || atPosition === 0 || atPosition === email.length - 1) {
        return false;
    }
    
    // Must have at least one dot after @
    let dotAfterAt = false;
    for (let i = atPosition + 1; i < email.length; i++) {
        if (email[i] === '.') {
            dotAfterAt = true;
            // Make sure there's text after the dot
            if (i === email.length - 1 || i === atPosition + 1) {
                return false;
            }
        }
    }
    
    return dotAfterAt;
}

// Show error message under a field
function showError(fieldId, errorMessage) {
    let field = document.getElementById(fieldId);
    let parent = field.closest('.form-group');
    
    // Add red border to field
    field.classList.add('is-invalid');
    
    // Find or create error message element
    let errorElement = parent.querySelector('.invalid-feedback');
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }
}

// Hide error message for a field
function hideError(fieldId) {
    let field = document.getElementById(fieldId);
    let parent = field.closest('.form-group');
    
    // Remove red border
    field.classList.remove('is-invalid');
    
    // Hide error message
    let errorElement = parent.querySelector('.invalid-feedback');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Hide all error messages
function hideAllErrors() {
    let fields = ['name', 'email', 'phone', 'message'];
    fields.forEach(function(fieldId) {
        hideError(fieldId);
    });
    
    // Hide success and error messages
    document.getElementById('submitSuccessMessage').classList.add('d-none');
    document.getElementById('submitErrorMessage').classList.add('d-none');
}