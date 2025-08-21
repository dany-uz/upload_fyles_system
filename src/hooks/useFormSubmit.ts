import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FileDescriptor } from '@/types/file';
import { SubmitRequest, SubmitResponse, ApiErrorResponse } from '@/types/api';

interface UseFormSubmitOptions {
    files: FileDescriptor[];
    setFiles: (files: FileDescriptor[]) => void;
}

export const useFormSubmit = ({ files, setFiles }: UseFormSubmitOptions) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handler para el submit del formulario
    const submitForm = useCallback(async (values: { title: string; description: string }) => { // Usamos useCallback para evitar recargar el componente
        // Verificar que todos los archivos estén 'done'
        const notDoneFiles = files.filter(f => f.status !== 'done');
        if (notDoneFiles.length > 0) {
            toast.warning('Archivos pendientes', {
                description: `Todos los archivos deben estar completados antes de enviar. ${notDoneFiles.length} archivo(s) pendiente(s).`
            });
            return;
        }

        if (files.length === 0) {
            toast.warning('Sin archivos', {
                description: 'Debes agregar al menos un archivo antes de enviar el formulario.'
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Preparar payload con archivos completados
            const filesPayload = files
                .filter(f => f.status === 'done')
                .map(file => ({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: `https://storage.example.com/uploads/${file.id}/${encodeURIComponent(file.name)}`
                }));

            const payload: SubmitRequest = {
                title: values.title,
                description: values.description,
                files: filesPayload
            };

            // Enviar a la API
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result: SubmitResponse = await response.json();
                toast.success('¡Formulario enviado exitosamente!', {
                    description: `Tu proyecto ha sido enviado correctamente. ID de referencia: ${result.submissionId}`,
                    duration: 5000
                });

                // Limpiar archivos
                setFiles([]);
                
                return true; // Indica éxito para resetear formulario
            } else {
                const errorData: ApiErrorResponse = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Error al enviar:', error);
            toast.error('Error al enviar formulario', {
                description: `No se pudo enviar el formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                duration: 10000
            });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [files, setFiles]);

    return {
        isSubmitting,
        submitForm
    };
};
