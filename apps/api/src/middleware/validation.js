const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }
    
    next();
  };
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  employee: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    departmentId: Joi.string().required(),
    positionId: Joi.string().required(),
    managerId: Joi.string().optional(),
    salary: Joi.number().optional(),
    hireDate: Joi.date().required(),
    emergencyContactName: Joi.string().optional(),
    emergencyContactPhone: Joi.string().optional(),
    emergencyContactRelation: Joi.string().optional(),
  }),

  department: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    location: Joi.string().optional(),
    budget: Joi.number().optional(),
  }),

  position: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    departmentId: Joi.string().required(),
    baseSalary: Joi.number().optional(),
    requirements: Joi.string().optional(),
  }),

  attendance: Joi.object({
    employeeId: Joi.string().required(),
    date: Joi.date().required(),
    checkIn: Joi.date().optional(),
    checkOut: Joi.date().optional(),
    breakStart: Joi.date().optional(),
    breakEnd: Joi.date().optional(),
    notes: Joi.string().optional(),
    location: Joi.string().optional(),
  }),

  leave: Joi.object({
    employeeId: Joi.string().required(),
    type: Joi.string().valid('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID', 'COMPASSIONATE').required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    reason: Joi.string().required(),
  }),

  performanceReview: Joi.object({
    employeeId: Joi.string().required(),
    reviewerId: Joi.string().required(),
    period: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    strengths: Joi.string().optional(),
    weaknesses: Joi.string().optional(),
    goals: Joi.string().optional(),
    comments: Joi.string().optional(),
  }),
};

module.exports = { validate, schemas };
