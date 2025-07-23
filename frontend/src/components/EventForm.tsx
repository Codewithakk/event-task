import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { EventFormValues } from '../types/event';

interface EventFormProps {
    initialValues: EventFormValues;
    onSubmit: (values: EventFormValues) => void;
    isSubmitting: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ initialValues, onSubmit, isSubmitting }) => {
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        startDate: Yup.date().required('Start date is required'),
        endDate: Yup.date()
            .required('End date is required')
            .min(Yup.ref('startDate'), 'End date must be after start date'),
        totalGuests: Yup.number().positive('Must be positive').integer('Must be integer'),
        category: Yup.string(),
        images: Yup.mixed(),
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const files = event.currentTarget.files;
        if (files) {
            const fileArray = Array.from(files);
            setFieldValue('images', fileArray);

            const previews = fileArray.map(file => URL.createObjectURL(file));
            setPreviewImages(previews);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ setFieldValue, values }) => (
                <Form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Event Name
                        </label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <Field
                            as="textarea"
                            id="description"
                            name="description"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <Field name="startDate">
                                {({ field, form }: any) => (
                                    <DatePicker
                                        id="startDate"
                                        selected={field.value}
                                        onChange={(date) => form.setFieldValue('startDate', date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <Field name="endDate">
                                {({ field, form }: any) => (
                                    <DatePicker
                                        id="endDate"
                                        selected={field.value}
                                        onChange={(date) => form.setFieldValue('endDate', date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="totalGuests" className="block text-sm font-medium text-gray-700">
                                Total Guests (Optional)
                            </label>
                            <Field
                                type="number"
                                id="totalGuests"
                                name="totalGuests"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <ErrorMessage name="totalGuests" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category (Optional)
                            </label>
                            <Field
                                type="text"
                                id="category"
                                name="category"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                            Event Images
                        </label>
                        <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(event) => handleImageChange(event, setFieldValue)}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <ErrorMessage name="images" component="div" className="text-red-500 text-sm" />
                    </div>

                    {previewImages.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image Previews</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {previewImages.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="h-24 w-24 object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default EventForm;