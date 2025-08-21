'use client';

import React, { useEffect } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';

// Custom Hooks para el manejo de archivos
import { useFileUpload } from '@/hooks/useFileUpload';
import { useFormSubmit } from '@/hooks/useFormSubmit';

// Componentes simplificados
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import HelpSection from '@/components/HelpSection';

// Constantes
const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf'];

// Tipos del formulario
interface FormValues {
    title: string;
    description: string;
}

// Esquema de validación
const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'El título debe tener al menos 3 caracteres')
        .max(100, 'El título no puede tener más de 100 caracteres')
        .required('El título es requerido'),
    description: Yup.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede tener más de 500 caracteres')
        .required('La descripción es requerida'),
});

export default function UploadPage() {
    // Hook principal de file upload
    const {
        files,
        setFiles,
        isDragging,
        isUploading,
        addFiles,
        startUpload,
        cancelUpload,
        removeFile,
        retryUpload,
        handleDrop,
        handleDragOver,
        handleDragLeave
    } = useFileUpload({
        maxFiles: MAX_FILES,
        maxFileSize: MAX_FILE_SIZE,
        allowedTypes: ALLOWED_TYPES
    });

    // Hook de submit del formulario
    const { isSubmitting, submitForm } = useFormSubmit({
        files,
        setFiles
    });

    // Atajos de teclado globales
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Enter: Iniciar subida
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!isUploading && files.some(f => f.status === 'idle')) {
                    startUpload();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isUploading, files, startUpload]);

    // Handler para submit del formulario
    const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        const success = await submitForm(values);
        if (success) {
            resetForm();
        }
    };

    // Handler para selección de archivos
    const handleFileSelect = (fileList: FileList) => {
        addFiles(fileList);
    };

    // Verificar si el formulario puede ser enviado
    const canSubmit = files.length > 0 && files.every(f => f.status === 'done');

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Subir archivos para tu proyecto
                </h1>

                <Formik
                    initialValues={{ title: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isValid }) => (
                        <Form className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                            {/* Columna Principal (3/4) */}
                            <div className="sm:col-span-3 space-y-6">
                                {/* Formulario */}
                                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                                    <h2 className="text-lg font-semibold mb-4">Detalles del Proyecto</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                Título *
                                            </label>
                                            <Field
                                                type="text"
                                                id="title"
                                                name="title"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                aria-describedby={errors.title && touched.title ? "title-error" : undefined}
                                                aria-invalid={errors.title && touched.title ? "true" : "false"}
                                            />
                                            {errors.title && touched.title && (
                                                <p id="title-error" className="mt-2 text-sm text-red-600">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                Descripción *
                                            </label>
                                            <Field
                                                as="textarea"
                                                id="description"
                                                name="description"
                                                rows={4}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                aria-describedby={errors.description && touched.description ? "description-error" : undefined}
                                                aria-invalid={errors.description && touched.description ? "true" : "false"}
                                            />
                                            {errors.description && touched.description && (
                                                <p id="description-error" className="mt-2 text-sm text-red-600">
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Upload de Archivos */}
                                <FileUpload
                                    files={files}
                                    isDragging={isDragging}
                                    maxFiles={MAX_FILES}
                                    maxFileSize={MAX_FILE_SIZE}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onFileSelect={handleFileSelect}
                                />

                                {/* Lista de Archivos */}
                                <FileList
                                    files={files}
                                    isUploading={isUploading}
                                    onStartUpload={startUpload}
                                    onCancelUpload={cancelUpload}
                                    onRemoveFile={removeFile}
                                    onRetryUpload={retryUpload}
                                />

                                {/* Botón de Submit */}
                                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">Enviar Proyecto</h3>
                                            <p className="text-sm text-gray-600">
                                                {canSubmit
                                                    ? 'Todos los archivos están listos. Puedes enviar el formulario.'
                                                    : 'Completa la subida de archivos antes de enviar.'
                                                }
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!canSubmit || !isValid || isSubmitting}
                                            className={`px-6 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${canSubmit && isValid && !isSubmitting
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            {isSubmitting ? 'Enviando...' : 'Enviar Proyecto'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Lateral (1/4) */}
                            <div className="sm:col-span-1">
                                <HelpSection
                                    maxFiles={MAX_FILES}
                                    maxFileSize={MAX_FILE_SIZE}
                                    files={files}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}