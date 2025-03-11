// validation.js
const validateEmail = (email) => {
    // Only accept gmail.com addresses
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone) => {
    // This regex validates country code followed by phone number
    // Accepts formats like +91 9999999999 or +1 9999999999
    const phoneRegex = /^\+\d{1,4}\s\d{10}$/;
    return phoneRegex.test(phone);
  };
  
  const validatePassword = (password) => {
    // Password must be at least 8 characters, and contain at least one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const validateFirstName = (name) => {
    // First name should be at least 3 characters and contain only letters
    const nameRegex = /^[a-zA-Z]{3,50}$/;
    return nameRegex.test(name);
  };
  
  const validateLastName = (name) => {
    // Last name should contain only letters (any length is fine)
    const nameRegex = /^[a-zA-Z]{1,50}$/;
    return nameRegex.test(name);
  };
  
  const validateCompanyName = (name) => {
    // Company name should be at least 3 characters and contain only letters and spaces
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(name);
  };
  
  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };
  
  const validateForm = (data) => {
    const errors = {};
  
    // Validate first name
    if (!validateFirstName(data.fname)) {
      errors.fname = "First name must be at least 3 characters and contain only letters";
    }
  
    // Validate last name
    if (!validateLastName(data.lname)) {
      errors.lname = "Last name must contain only letters, no numbers or special characters";
    }
  
    // Validate email
    if (!validateEmail(data.email)) {
      errors.email = "Please enter a valid email address with @gmail.com domain";
    }
  
    // Validate phone
    if (!validatePhone(data.phone)) {
      errors.phone = "Please enter a valid phone number with country code (e.g., +91 9999999999)";
    }
  
    // Validate password
    if (!validatePassword(data.password)) {
      errors.password = "Password must be at least 8 characters and include uppercase, lowercase, and numbers";
    }
  
    // Validate password match
    if (!validatePasswordMatch(data.password, data.cpassword)) {
      errors.cpassword = "Passwords do not match";
    }
  
    // Validate company name for sellers
    if (data.accountType === "seller") {
      if (!validateCompanyName(data.companyName)) {
        errors.companyName = "Company name must be at least 3 characters and contain only letters";
      }
      
      // Company proof is mandatory for sellers
      if (!data.companyProof) {
        errors.companyProof = "Company proof document is required";
      }
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export {
    validateEmail,
    validatePhone,
    validatePassword,
    validateFirstName,
    validateLastName,
    validateCompanyName,
    validatePasswordMatch,
    validateForm
  };