import React from 'react';
import { FileDescriptor } from '@/types/file';
import { formatFileSize } from '@/utils/fileFormatters';

interface HelpSectionProps {
    maxFiles: number;
    maxFileSize: number;
    files: FileDescriptor[];
}

const HelpSection: React.FC<HelpSectionProps> = ({
    maxFiles,
    maxFileSize,
    files
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Ayuda y Detalles</h3>

            <div className="space-y-4 text-sm text-gray-600">
                <div>
                    <h4 className="font-medium text-gray-900 mb-1">Archivos Permitidos</h4>
                    <p>Solo archivos PDF (*.pdf)</p>
                </div>

                <div>
                    <h4 className="font-medium text-gray-900 mb-1">Límites</h4>
                    <ul className="space-y-1">
                        <li>• Máximo {maxFiles} archivos</li>
                        <li>• {formatFileSize(maxFileSize)} por archivo</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium text-gray-900 mb-1">Estado Actual</h4>
                    <ul className="space-y-1">
                        <li>• Archivos: {files.length}/{maxFiles}</li>
                        <li>• Completados: {files.filter(f => f.status === 'done').length}</li>
                        <li>• En progreso: {files.filter(f => f.status === 'uploading').length}</li>
                        <li>• Con errores: {files.filter(f => f.status === 'error').length}</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium text-gray-900 mb-1">¿Cómo usar?</h4>
                    <ol className="space-y-1 list-decimal list-inside">
                        <li>Completa el formulario</li>
                        <li>Arrastra archivos PDF</li>
                        <li>Inicia la subida</li>
                        <li>Espera que terminen</li>
                        <li>Envía el formulario</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default HelpSection;
