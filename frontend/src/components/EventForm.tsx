import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { EventFormValues } from '../types/event';
import '../styles/event-form.css';

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
                <Form className="event-form">
                    <div className="event-form-group">
                        <label htmlFor="name" className="event-form-label">
                            Event Name
                        </label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            className="event-form-input"
                        />
                        <ErrorMessage name="name" component="div" className="event-form-error" />
                    </div>

                    <div className="event-form-group">
                        <label htmlFor="description" className="event-form-label">
                            Description
                        </label>
                        <Field
                            as="textarea"
                            id="description"
                            name="description"
                            rows={4}
                            className="event-form-input event-form-textarea"
                        />
                        <ErrorMessage name="description" component="div" className="event-form-error" />
                    </div>

                    <div className="event-form-grid">
                        <div className="event-form-group">
                            <label htmlFor="startDate" className="event-form-label">
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
                                        className="event-form-input"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="startDate" component="div" className="event-form-error" />
                        </div>

                        <div className="event-form-group">
                            <label htmlFor="endDate" className="event-form-label">
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
                                        className="event-form-input"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="endDate" component="div" className="event-form-error" />
                        </div>
                    </div>

                    <div className="event-form-grid">
                        <div className="event-form-group">
                            <label htmlFor="totalGuests" className="event-form-label">
                                Total Guests (Optional)
                            </label>
                            <Field
                                type="number"
                                id="totalGuests"
                                name="totalGuests"
                                className="event-form-input"
                            />
                            <ErrorMessage name="totalGuests" component="div" className="event-form-error" />
                        </div>

                        <div className="event-form-group">
                            <label htmlFor="category" className="event-form-label">
                                Category
                            </label>
                            <Field
                                as="select"
                                id="category"
                                name="category"
                                className="event-form-input"
                            >
                                <option value="">Select a category</option>
                                <option value="Technology">Technology</option>
                                <option value="Music">Music</option>
                                <option value="Education">Education</option>
                                <option value="Sports">Sports</option>
                                <option value="Health">Health</option>
                                <option value="Business">Business</option>
                                <option value="Other">Other</option>
                            </Field>
                            <ErrorMessage name="category" component="div" className="event-form-error" />
                        </div>

                    </div>

                    <div className="event-form-group">
                        <label htmlFor="images" className="event-form-label">
                            Event Images
                        </label>
                        <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(event) => handleImageChange(event, setFieldValue)}
                            className="event-form-file-input"
                        />
                        <ErrorMessage name="images" component="div" className="event-form-error" />
                    </div>

                    {previewImages.length > 0 && (
                        <div className="event-form-group">
                            <label className="event-form-label">Image Previews</label>
                            <div className="event-form-preview-container">
                                {previewImages.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="event-form-preview-image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="event-form-button"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default EventForm;