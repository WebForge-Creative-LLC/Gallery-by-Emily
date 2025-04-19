// Contact/Commission Form Functionality
document.addEventListener('DOMContentLoaded', () => {
    const commissionForm = document.getElementById('commission-form');
    const formSuccess = document.getElementById('form-success');
    
    if (commissionForm) {
        commissionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = commissionForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Remove error message if it exists
                    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                        field.parentNode.removeChild(field.nextElementSibling);
                    }
                }
            });
            
            // If email field exists, validate email format
            const emailField = commissionForm.querySelector('#email');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'Please enter a valid email address';
                        emailField.parentNode.insertBefore(errorMessage, emailField.nextSibling);
                    }
                }
            }
            
            // If form is valid, submit it
            if (isValid) {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    description: document.getElementById('description').value
                };
                
                // Add loading state
                const submitButton = commissionForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                try {
                    // Send data to Netlify function
                    const response = await fetch('/.netlify/functions/send-email', {
                        method: 'POST',
                        body: JSON.stringify(formData)
                    });
                    
                    if (!response.ok) throw new Error('Network response was not ok');
                    
                    // Hide form and show success message
                    commissionForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({ behavior: 'smooth' });
                    
                    // Reset form for future use
                    commissionForm.reset();
                } catch (error) {
                    console.error('Error:', error);
                    alert('There was a problem sending your message. Please try again.');
                } finally {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
        
        // Remove error styling when user starts typing
        commissionForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                field.classList.remove('error');
                
                // Remove error message if it exists
                if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                    field.parentNode.removeChild(field.nextElementSibling);
                }
            });
        });
    }
    
    // Enhance file upload experience
    const fileUpload = document.querySelector('.file-upload input[type="file"]');
    if (fileUpload) {
        fileUpload.addEventListener('change', function() {
            const fileUploadContainer = this.closest('.file-upload');
            const fileCount = this.files.length;
            
            if (fileCount > 0) {
                // Create or update file count display
                let fileCountDisplay = fileUploadContainer.querySelector('.file-count');
                if (!fileCountDisplay) {
                    fileCountDisplay = document.createElement('p');
                    fileCountDisplay.classList.add('file-count');
                    fileUploadContainer.appendChild(fileCountDisplay);
                }
                
                // Update text based on file count
                if (fileCount === 1) {
                    fileCountDisplay.textContent = `1 file selected: ${this.files[0].name}`;
                } else {
                    fileCountDisplay.textContent = `${fileCount} files selected`;
                }
                
                // Add selected class to container
                fileUploadContainer.classList.add('files-selected');
            } else {
                // Remove file count display if it exists
                const fileCountDisplay = fileUploadContainer.querySelector('.file-count');
                if (fileCountDisplay) {
                    fileUploadContainer.removeChild(fileCountDisplay);
                }
                
                // Remove selected class from container
                fileUploadContainer.classList.remove('files-selected');
            }
        });
    }
    
    // Make the artwork type field show an additional text field when "Other" is selected
    const artworkTypeSelect = document.getElementById('artwork-type');
    if (artworkTypeSelect) {
        artworkTypeSelect.addEventListener('change', function() {
            const otherSpecifyField = document.getElementById('other-specify-container');
            
            if (this.value === 'other') {
                // Create "Other - please specify" field if it doesn't exist
                if (!otherSpecifyField) {
                    const container = document.createElement('div');
                    container.id = 'other-specify-container';
                    container.classList.add('form-group');
                    
                    const label = document.createElement('label');
                    label.htmlFor = 'other-specify';
                    label.textContent = 'Please specify';
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = 'other-specify';
                    input.name = 'other-specify';
                    input.required = true;
                    
                    container.appendChild(label);
                    container.appendChild(input);
                    
                    // Insert after the artwork type field
                    this.closest('.form-group').insertAdjacentElement('afterend', container);
                }
            } else {
                // Remove "Other - please specify" field if it exists
                if (otherSpecifyField) {
                    otherSpecifyField.remove();
                }
            }
        });
    }
}); 