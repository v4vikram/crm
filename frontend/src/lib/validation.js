import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

export const LeadSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    status: Yup.string().oneOf(['New', 'Contacted', 'Qualified', 'Lost', 'Closed']).required(),
    assignedTo: Yup.string().nullable()
});

export const StaffSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').when('isEditing', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Password is required'),
    }),
});
