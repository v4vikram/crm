import React from 'react';
import { useFormik } from 'formik';
import Modal from './Modal';
import { Input } from './Input';
import { Button } from './Button';

const DynamicFormModal = ({
    isOpen,
    onClose,
    title,
    initialValues,
    validationSchema,
    onSubmit,
    fields,
    isEdit = false,
}) => {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            await onSubmit(values, { setSubmitting, resetForm });
        },
        enableReinitialize: true,
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {fields.map((field) => (
                    <div key={field.name}>
                        {field.type === 'select' ? (
                            <div className="space-y-1">
                                {field.label && <label className="text-sm font-medium text-gray-700">{field.label}</label>}
                                <select
                                    name={field.name}
                                    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${formik.touched[field.name] && formik.errors[field.name] ? 'border-red-500' : ''
                                        }`}
                                    value={formik.values[field.name]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={field.disabled}
                                >
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched[field.name] && formik.errors[field.name] && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors[field.name]}</div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {field.label && <label className="text-sm font-medium text-gray-700">{field.label}</label>}
                                <Input
                                    name={field.name}
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values[field.name]}
                                    className={formik.touched[field.name] && formik.errors[field.name] ? 'border-red-500' : ''}
                                />
                                {formik.touched[field.name] && formik.errors[field.name] && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors[field.name]}</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                <div className="flex justify-end space-x-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={formik.isSubmitting}>
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default DynamicFormModal;
