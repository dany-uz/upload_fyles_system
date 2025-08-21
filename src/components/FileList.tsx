import React from 'react';
import { FileDescriptor } from '@/types/file';
import { formatFileSize } from '@/utils/fileFormatters';

interface FileListProps {
    files: FileDescriptor[];
    isUploading: boolean;
    onStartUpload: () => void;
    onCancelUpload: (fileId: string) => void;
    onRemoveFile: (fileId: string) => void;
    onRetryUpload: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({
    files,
    isUploading,
    onStartUpload,
    onCancelUpload,
    onRemoveFile,
    onRetryUpload
}) => {
    // Función para obtener el texto del estado del archivo
    const getStatusText = (status: string) => {
        switch (status) {
            case 'idle': return 'En espera';
            case 'uploading': return 'Subiendo';
            case 'done': return 'Completado';
            case 'error': return 'Error';
            case 'canceled': return 'Cancelado';
            default: return status;
        }
    };

    // Función para obtener el color del estado del archivo
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'idle': return 'text-gray-600';
            case 'uploading': return 'text-blue-600';
            case 'done': return 'text-green-600';
            case 'error': return 'text-red-600';
            case 'canceled': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    // Función para formatear el progreso con máximo 1 decimal
    const formatProgress = (progress: number) => {
        // Asegurar que sea un número entero si no tiene decimales
        return progress % 1 === 0 ? progress.toString() : progress.toFixed(1);
    };

    // Función para renderizar el progreso de subida del archivo
    const renderProgressBar = (file: FileDescriptor) => {
        if (file.status !== 'uploading') return null;

        return (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                    aria-label={`Progreso de subida: ${formatProgress(file.progress)}%`}
                />
            </div>
        );
    };

    // Función para renderizar las acciones del archivo
    const renderFileActions = (file: FileDescriptor) => {
        return (
            <div className="flex items-center gap-2 mt-2">
                {file.status === 'uploading' && (
                    <button
                        onClick={() => onCancelUpload(file.id)}
                        className="cursor-pointer px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Cancelar subida de ${file.name}`}
                    >
                        Cancelar
                    </button>
                )}
                
                {(file.status === 'error' || file.status === 'canceled') && (
                    <button
                        onClick={() => onRetryUpload(file.id)}
                        className="cursor-pointer px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Reintentar subida de ${file.name}`}
                    >
                        Reintentar
                    </button>
                )}
                
                {(file.status === 'idle' || file.status === 'error' || file.status === 'canceled' || file.status === 'done') && (
                    <button
                        onClick={() => onRemoveFile(file.id)}
                        className="cursor-pointer px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        aria-label={`Eliminar ${file.name}`}
                    >
                        Eliminar
                    </button>
                )}
            </div>
        );
    };

    const pendingFiles = files.filter(f => f.status === 'idle');

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 id="uploaded-files-heading" className="text-lg font-semibold">
                    Archivos ({files.length})
                </h2>
                
                {pendingFiles.length > 0 && (
                    <button
                        type="button"
                        onClick={onStartUpload}
                        disabled={isUploading}
                        className={`px-4 py-2 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            isUploading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                        aria-describedby="upload-button-status"
                    >
                        {isUploading ? 'Subiendo…' : `Iniciar Subida (${pendingFiles.length})`}
                    </button>
                )}
            </div>

            <div className="p-4 sm:p-6">
                {files.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <svg 
                            className="w-12 h-12 mx-auto mb-4 text-gray-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                        </svg>
                        <p>No hay archivos agregados</p>
                        <p className="text-sm">Arrastra archivos o usa el botón de selección</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Vista móvil: Cards */}
                        <div className="block sm:hidden space-y-3">
                            {files.map((file) => (
                                <div key={file.id} className="border rounded-lg p-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(file.size)} • {file.type}
                                            </p>
                                        </div>
                                        <span className={`ml-2 text-xs font-medium ${getStatusColor(file.status)}`}>
                                            {getStatusText(file.status)}
                                            {file.status === 'uploading' && ` (${formatProgress(file.progress)}%)`}
                                        </span>
                                    </div>
                                    
                                    {renderProgressBar(file)}
                                    
                                    {file.status === 'error' && file.errors && (
                                        <div className="mt-2 text-xs text-red-600">
                                            {file.errors.join(', ')}
                                        </div>
                                    )}
                                    
                                    {renderFileActions(file)}
                                </div>
                            ))}
                        </div>

                        {/* Vista desktop: Tabla mejorada */}
                        <div className="hidden sm:block">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-2/5">
                                            Archivo
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-24">
                                            Tamaño
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-32">
                                            Estado
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-48">
                                            Progreso
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-32">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {files.map((file) => (
                                        <tr key={file.id} className="hover:bg-gray-50">
                                            <td className="py-4 pr-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{file.type}</p>
                                                    {file.status === 'error' && file.errors && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            {file.errors.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm text-gray-500">
                                                {formatFileSize(file.size)}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${getStatusColor(file.status)}`}>
                                                        {getStatusText(file.status)}
                                                    </span>
                                                    {file.status === 'uploading' && (
                                                        <span className="text-xs text-gray-600 mt-1">
                                                            {formatProgress(file.progress)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                {file.status === 'uploading' ? (
                                                    <div className="w-full max-w-40">
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${file.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-1">
                                                    {file.status === 'uploading' && (
                                                        <button
                                                            onClick={() => onCancelUpload(file.id)}
                                                            className="cursor-pointer px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                                                            title={`Cancelar subida de ${file.name}`}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}
                                                    
                                                    {(file.status === 'error' || file.status === 'canceled') && (
                                                        <button
                                                            onClick={() => onRetryUpload(file.id)}
                                                            className="cursor-pointer px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            title={`Reintentar subida de ${file.name}`}
                                                        >
                                                            Reintentar
                                                        </button>
                                                    )}
                                                    
                                                    {(file.status === 'idle' || file.status === 'error' || file.status === 'canceled' || file.status === 'done') && (
                                                        <button
                                                            onClick={() => onRemoveFile(file.id)}
                                                            className="cursor-pointer px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                                            title={`Eliminar ${file.name}`}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileList;