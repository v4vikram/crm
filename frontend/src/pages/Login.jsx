import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import useAuthStore from '../features/auth/authStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';
import { LoginSchema } from '../lib/validation';

const Login = () => {
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                await login(values.email, values.password);
                toast.success('Logged in successfully');
                navigate('/');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Login failed');
            }
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome back! Please enter your details.
                    </p>
                </div>
                <form className="mt-8 space-y-6 bg-white rounded-xl shadow-lg p-8" onSubmit={formik.handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className={`transition-all duration-200 ${formik.touched.email && formik.errors.email
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                                    <span>⚠</span>
                                    <span>{formik.errors.email}</span>
                                </div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className={`transition-all duration-200 ${formik.touched.password && formik.errors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                                    <span>⚠</span>
                                    <span>{formik.errors.password}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <Button
                            className="w-full"
                            type="submit"
                            isLoading={isLoading || formik.isSubmitting}
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
