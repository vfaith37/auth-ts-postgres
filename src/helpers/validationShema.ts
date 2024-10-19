import * as Yup from 'yup';

// Schema for user registration
export const authSchema = Yup.object({
  firstname: Yup.string()
    .required('First name is required')
    .min(3, 'First name must be at least 3 characters long'),
  lastname: Yup.string()
    .required('Last name is required')
    .min(3, 'Last name must be at least 3 characters long'),
  email: Yup.string()
    .required('Email is required')
    .email('Email is not valid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

// Schema for user login
export const signInSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Email is not valid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});
