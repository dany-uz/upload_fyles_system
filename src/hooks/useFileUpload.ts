import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { FileDescriptor, mapFilesToDescriptors, limitConcurrency } from '@/types/file';
import { UploadResponse, ApiErrorResponse } from '@/types/api';
import { formatFileSize } from '@/utils/fileFormatters';

interface UseFileUploadOptions {
    maxFiles: number;
    maxFileSize: number;
    allowedTypes: string[];
}

export const useFileUpload = ({ maxFiles, maxFileSize, allowedTypes }: UseFileUploadOptions) => {
    const [files, setFiles] = useState<FileDescriptor[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const abortControllers = useRef<Map<string, AbortController>>(new Map());

    // Validar archivo individual
    const validateFile = useCallback((file: File): string[] => {
        const errors: string[] = [];

        if (!allowedTypes.includes(file.type)) {
            errors.push(`Tipo de archivo no permitido. Solo se aceptan: ${allowedTypes.join(', ')}`);
        }

        if (file.size > maxFileSize) {
            errors.push(`Archivo demasiado grande. Máximo ${formatFileSize(maxFileSize)}`);
        }

        return errors;
    }, [allowedTypes, maxFileSize]);

    // Agregar archivos con validación
    const addFiles = useCallback((newFiles: FileList | File[]) => {
        // Convertir FileList o File[] a un array de archivos estándar para un manejo uniforme
        const fileArray = Array.from(newFiles);

        // Validar límite de archivos
        if (files.length + fileArray.length > maxFiles) {
            toast.warning('Límite de archivos excedido', {
                description: `No puedes agregar más de ${maxFiles} archivos. Actualmente tienes ${files.length} archivos.`
            });
            return;
        }

        // Validar cada archivo
        const validFiles: File[] = [];
        const invalidFiles: { file: File; errors: string[] }[] = [];

        fileArray.forEach(file => {
            const errors = validateFile(file);
            if (errors.length > 0) {
                invalidFiles.push({ file, errors });
            } else {
                validFiles.push(file);
            }
        });

        // Mostrar errores de archivos inválidos
        if (invalidFiles.length > 0) {
            const errorList = invalidFiles.map(({ file, errors }) =>
                `• ${file.name}: ${errors.join(', ')}`
            ).join('\n');
            toast.error('Archivos no válidos', {
                description: `Se encontraron ${invalidFiles.length} archivo(s) con errores:\n${errorList}`,
                duration: 8000
            });
        }

        // Procesar archivos válidos
        if (validFiles.length > 0) {
            const newDescriptors = mapFilesToDescriptors(validFiles);

            // Evitar duplicados con archivos ya existentes usando name+size
            const existingKeys = new Set(files.map(f => `${f.name}-${f.size}`));
            const uniqueNewFiles = newDescriptors.filter(
                file => !existingKeys.has(`${file.name}-${file.size}`)
            );

            // Solo agregar archivos realmente únicos
            if (uniqueNewFiles.length > 0) {
                setFiles(prev => [...prev, ...uniqueNewFiles]);
                toast.success('Archivos agregados', {
                    description: `Se agregaron ${uniqueNewFiles.length} archivo(s) correctamente`,
                    duration: 3000
                });
            } else {
                toast.warning('Archivos duplicados', {
                    description: 'Los archivos seleccionados ya han sido agregados anteriormente'
                });
            }
        }
    }, [files, maxFiles, validateFile]);

    // Simular upload de un archivo
    const uploadFile = useCallback(async (fileId: string): Promise<void> => {
        const file = files.find(f => f.id === fileId);
        if (!file || file.status === 'uploading') return;

        const controller = new AbortController();
        abortControllers.current.set(fileId, controller);

        // Actualizar a estado uploading
        setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, status: 'uploading', progress: 0 } as FileDescriptor : f
        ));

        try {
            // Simular progreso más realista
            let currentProgress = 0;
            while (currentProgress < 100) {
                if (controller.signal.aborted) throw new Error('Upload cancelled');
                
                // Incremento aleatorio entre 2 y 15, con máximo 1 decimal
                const increment = Math.round((2 + Math.random() * 13) * 10) / 10;
                currentProgress = Math.min(100, currentProgress + increment);
                
                // Redondear a máximo 1 decimal
                const roundedProgress = Math.round(currentProgress * 10) / 10;
                
                setFiles(prev => prev.map(f =>
                    f.id === fileId && f.status === 'uploading' 
                        ? { ...f, progress: roundedProgress } 
                        : f
                ));
                
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Asegurar que llegue a 100%
            setFiles(prev => prev.map(f =>
                f.id === fileId && f.status === 'uploading' 
                    ? { ...f, progress: 100 } 
                    : f
            ));

            // Llamar API de upload
            if (file.file) {
                const formData = new FormData();
                formData.append('file', file.file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                if (!response.ok) {
                    const errorData: ApiErrorResponse = await response.json();
                    throw new Error(errorData.error || 'Upload failed');
                }

                await response.json() as UploadResponse;
                
                // Actualizar archivo como completado
                setFiles(prev => prev.map(f =>
                    f.id === fileId ? { ...f, status: 'done' } as FileDescriptor : f
                ));
            }

            abortControllers.current.delete(fileId);
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            
            if (error instanceof Error && (error.name === 'AbortError' || controller.signal.aborted)) {
                setFiles(prev => prev.map(f =>
                    f.id === fileId ? { ...f, status: 'canceled' } as FileDescriptor : f
                ));
            } else {
                setFiles(prev => prev.map(f =>
                    f.id === fileId ? {
                        ...f,
                        status: 'error',
                        errors: [errorMessage]
                    } as FileDescriptor : f
                ));
            }
            abortControllers.current.delete(fileId);
        }
    }, [files]);

    // Iniciar upload de todos los archivos pendientes
    const startUpload = useCallback(async () => {
        if (isUploading) return;
        
        const pendingFiles = files.filter(f => f.status === 'idle');
        if (pendingFiles.length === 0) return;

        setIsUploading(true);
        
        try {
            const tasks = pendingFiles.map(f => () => uploadFile(f.id));
            await limitConcurrency(3, tasks);
        } finally {
            setIsUploading(false);
        }
    }, [files, isUploading, uploadFile]);

    // Cancelar upload
    const cancelUpload = useCallback((fileId: string) => {
        const controller = abortControllers.current.get(fileId);
        if (controller) {
            controller.abort();
        }
    }, []);

    // Eliminar archivo
    const removeFile = useCallback((fileId: string) => {
        const file = files.find(f => f.id === fileId);
        if (file?.status === 'uploading') {
            cancelUpload(fileId);
        }
        setFiles(prev => prev.filter(f => f.id !== fileId));
    }, [files, cancelUpload]);

    // Reintentar upload
    const retryUpload = useCallback((fileId: string) => {
        setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, status: 'idle', errors: [] } as FileDescriptor : f
        ));
    }, []);

    // Handlers para drag & drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    }, [addFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    return {
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
    };
};