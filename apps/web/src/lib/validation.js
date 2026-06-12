// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  return true;
};

export const validateMinLength = (value, min) => {
  if (!value) return false;
  return value.length >= min;
};

export const validateMaxLength = (value, max) => {
  if (!value) return true;
  return value.length <= max;
};

export const validateNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validateMin = (value, min) => {
  if (!validateNumber(value)) return false;
  return parseFloat(value) >= min;
};

export const validateMax = (value, max) => {
  if (!validateNumber(value)) return false;
  return parseFloat(value) <= max;
};

export const validateDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const validateFutureDate = (value) => {
  if (!validateDate(value)) return false;
  return new Date(value) > new Date();
};

export const validatePastDate = (value) => {
  if (!validateDate(value)) return false;
  return new Date(value) < new Date();
};

// Form validation schema builder
export const createValidationSchema = (schema) => {
  return (values) => {
    const errors = {};
    
    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = values[field];
      
      rules.forEach(rule => {
        if (errors[field]) return; // Skip if already has error
        
        let isValid = true;
        let errorMessage = '';
        
        if (rule.required && !validateRequired(value)) {
          isValid = false;
          errorMessage = rule.message || `${field} is required`;
        } else if (value && rule.email && !validateEmail(value)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be a valid email`;
        } else if (value && rule.phone && !validatePhone(value)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be a valid phone number`;
        } else if (value && rule.minLength && !validateMinLength(value, rule.minLength)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be at least ${rule.minLength} characters`;
        } else if (value && rule.maxLength && !validateMaxLength(value, rule.maxLength)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be at most ${rule.maxLength} characters`;
        } else if (value && rule.min && !validateMin(value, rule.min)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be at least ${rule.min}`;
        } else if (value && rule.max && !validateMax(value, rule.max)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be at most ${rule.max}`;
        } else if (value && rule.date && !validateDate(value)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be a valid date`;
        } else if (value && rule.futureDate && !validateFutureDate(value)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be a future date`;
        } else if (value && rule.pastDate && !validatePastDate(value)) {
          isValid = false;
          errorMessage = rule.message || `${field} must be a past date`;
        } else if (rule.custom && !rule.custom(value, values)) {
          isValid = false;
          errorMessage = rule.message || `${field} is invalid`;
        }
        
        if (!isValid) {
          errors[field] = errorMessage;
        }
      });
    });
    
    return errors;
  };
};

// Common validation schemas
export const employeeSchema = createValidationSchema({
  firstName: [
    { required: true, message: 'First name is required' },
    { minLength: 2, message: 'First name must be at least 2 characters' }
  ],
  lastName: [
    { required: true, message: 'Last name is required' },
    { minLength: 2, message: 'Last name must be at least 2 characters' }
  ],
  email: [
    { required: true, message: 'Email is required' },
    { email: true, message: 'Please enter a valid email address' }
  ],
  phone: [
    { phone: true, message: 'Please enter a valid phone number' }
  ],
  departmentId: [
    { required: true, message: 'Department is required' }
  ],
  positionId: [
    { required: true, message: 'Position is required' }
  ],
  hireDate: [
    { required: true, message: 'Hire date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  salary: [
    { min: 0, message: 'Salary must be a positive number' }
  ]
});

export const departmentSchema = createValidationSchema({
  name: [
    { required: true, message: 'Department name is required' },
    { minLength: 2, message: 'Department name must be at least 2 characters' }
  ],
  code: [
    { minLength: 2, message: 'Department code must be at least 2 characters' }
  ],
  budget: [
    { min: 0, message: 'Budget must be a positive number' }
  ]
});

export const leaveSchema = createValidationSchema({
  type: [
    { required: true, message: 'Leave type is required' }
  ],
  startDate: [
    { required: true, message: 'Start date is required' },
    { date: true, message: 'Please enter a valid date' },
    { futureDate: true, message: 'Start date must be in the future' }
  ],
  endDate: [
    { required: true, message: 'End date is required' },
    { date: true, message: 'Please enter a valid date' },
    { custom: (value, values) => {
      if (!values.startDate || !value) return true;
      return new Date(value) > new Date(values.startDate);
    }, message: 'End date must be after start date' }
  ],
  reason: [
    { required: true, message: 'Reason is required' },
    { minLength: 10, message: 'Reason must be at least 10 characters' }
  ]
});

// Employee 360 Profile Validation Schemas

export const employmentHistorySchema = createValidationSchema({
  company: [
    { required: true, message: 'Company name is required' },
    { minLength: 2, message: 'Company name must be at least 2 characters' }
  ],
  position: [
    { required: true, message: 'Position is required' }
  ],
  startDate: [
    { required: true, message: 'Start date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  endDate: [
    { date: true, message: 'Please enter a valid date' }
  ]
});

export const contractSchema = createValidationSchema({
  type: [
    { required: true, message: 'Contract type is required' }
  ],
  startDate: [
    { required: true, message: 'Start date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  endDate: [
    { date: true, message: 'Please enter a valid date' }
  ],
  salary: [
    { min: 0, message: 'Salary must be a positive number' }
  ]
});

export const certificationSchema = createValidationSchema({
  name: [
    { required: true, message: 'Certification name is required' },
    { minLength: 2, message: 'Name must be at least 2 characters' }
  ],
  issuingBody: [
    { required: true, message: 'Issuing body is required' }
  ],
  issueDate: [
    { required: true, message: 'Issue date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  expiryDate: [
    { date: true, message: 'Please enter a valid date' }
  ]
});

export const skillSchema = createValidationSchema({
  name: [
    { required: true, message: 'Skill name is required' },
    { minLength: 2, message: 'Skill name must be at least 2 characters' }
  ],
  level: [
    { required: true, message: 'Skill level is required' }
  ],
  yearsOfExperience: [
    { min: 0, message: 'Years of experience must be a positive number' }
  ]
});

export const trainingSchema = createValidationSchema({
  title: [
    { required: true, message: 'Training title is required' },
    { minLength: 2, message: 'Title must be at least 2 characters' }
  ],
  provider: [
    { required: true, message: 'Provider is required' }
  ],
  startDate: [
    { required: true, message: 'Start date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  cost: [
    { min: 0, message: 'Cost must be a positive number' }
  ]
});

export const assetSchema = createValidationSchema({
  name: [
    { required: true, message: 'Asset name is required' },
    { minLength: 2, message: 'Asset name must be at least 2 characters' }
  ],
  type: [
    { required: true, message: 'Asset type is required' }
  ],
  assignedDate: [
    { required: true, message: 'Assigned date is required' },
    { date: true, message: 'Please enter a valid date' }
  ]
});

export const disciplinarySchema = createValidationSchema({
  type: [
    { required: true, message: 'Disciplinary type is required' }
  ],
  date: [
    { required: true, message: 'Date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  description: [
    { required: true, message: 'Description is required' },
    { minLength: 10, message: 'Description must be at least 10 characters' }
  ],
  severity: [
    { required: true, message: 'Severity is required' }
  ]
});

export const promotionSchema = createValidationSchema({
  type: [
    { required: true, message: 'Promotion type is required' }
  ],
  fromDate: [
    { required: true, message: 'From date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  newPosition: [
    { required: true, message: 'New position is required' }
  ],
  reason: [
    { required: true, message: 'Reason is required' },
    { minLength: 10, message: 'Reason must be at least 10 characters' }
  ],
  newSalary: [
    { min: 0, message: 'New salary must be a positive number' }
  ]
});

export const salaryHistorySchema = createValidationSchema({
  amount: [
    { required: true, message: 'Amount is required' },
    { min: 0, message: 'Amount must be a positive number' }
  ],
  effectiveDate: [
    { required: true, message: 'Effective date is required' },
    { date: true, message: 'Please enter a valid date' }
  ],
  reason: [
    { required: true, message: 'Reason is required' },
    { minLength: 5, message: 'Reason must be at least 5 characters' }
  ]
});

export const dependantSchema = createValidationSchema({
  firstName: [
    { required: true, message: 'First name is required' },
    { minLength: 2, message: 'First name must be at least 2 characters' }
  ],
  lastName: [
    { required: true, message: 'Last name is required' },
    { minLength: 2, message: 'Last name must be at least 2 characters' }
  ],
  relationship: [
    { required: true, message: 'Relationship is required' }
  ]
});
