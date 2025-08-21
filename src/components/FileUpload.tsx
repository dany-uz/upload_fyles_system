import React, { useRef } from 'react';
import { FileDescriptor } from '@/types/file';
import { formatFileSize } from '@/utils/fileFormatters';

interface FileUploadProps {
    files: FileDescriptor[];
    isDragging: boolean;
    maxFiles: number;
    maxFileSize: number;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onFileSelect: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
    files,
    isDragging,
    maxFiles,
    maxFileSize,
    onDrop,
    onDragOver,
    onDragLeave,
    onFileSelect
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handler para el click del input file
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // Handler para el keydown del input file
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    // Handler para el cambio del input file
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            onFileSelect(files);
        }
        // Reset input para permitir seleccionar el mismo archivo de nuevo
        e.target.value = '';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h2 id="file-upload-heading" className="text-lg font-semibold mb-4">Subir Archivos</h2>
            
            <div
                className={`border-2 border-dashed rounded-lg p-6 sm:p-12 text-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDragging
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-labelledby="file-upload-heading"
                aria-describedby="dropzone-instructions"
            >
                {/* Ícono responsive */}
                <div className="mb-4">
                    <svg 
                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        aria-hidden="true"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                    </svg>
                </div>

                <p className="text-base sm:text-lg text-gray-600 mb-2">
                    Arrastra y suelta tus archivos aquí o haz clic para seleccionarlos
                </p>

                <div id="dropzone-instructions" className="text-xs sm:text-sm text-gray-500 space-y-1">
                    <p>Archivos aceptados: Solo PDF</p>
                    <p>Máximo {maxFiles} archivos • Máximo {formatFileSize(maxFileSize)} cada uno</p>
                    <p>Archivos actuales: {files.length}/{maxFiles}</p>
                </div>

                {/* Ocultamos el input file */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFileInput}
                    accept=".pdf,application/pdf"
                    aria-label="Seleccionar archivos PDF para subir"
                />
            </div>
        </div>
    );
};

export default FileUpload;
