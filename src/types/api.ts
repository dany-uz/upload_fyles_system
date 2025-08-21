// Tipos para respuestas de la API

// Respuesta del endpoint /api/upload
export interface UploadResponse {
    id: string;
    url: string;
    name: string;
    size: number;
    type: string;
}

// Respuesta del endpoint /api/upload/complete
export interface UploadCompleteResponse {
    ok: boolean;
    fileId: string;
    status: 'completed';
    message: string;
}

// Request para /api/submit
export interface SubmitRequest {
    title: string;
    description: string;
    files: Array<{
        id: string;
        name: string;
        size: number;
        type: string;
        url: string;
    }>;
}

// Respuesta del endpoint /api/submit
export interface SubmitResponse {
    ok: boolean;
    submissionId: string;
    message: string;
    data: {
        title: string;
        description: string;
        files: Array<{
            id: string;
            name: string;
            size: number;
            type: string;
            url: string;
        }>;
    };
    timestamp: string;
}

// Respuesta de error genérica
export interface ApiErrorResponse {
    error: string;
}

// Tipos de error específicos de la API upload
export type UploadErrorType = 
    | 'NO_FILE_PROVIDED'
    | 'INVALID_FILE_TYPE'
    | 'FILE_TOO_LARGE'
    | 'INTERNAL_ERROR'
    | 'SERVICE_UNAVAILABLE'
    | 'INSUFFICIENT_STORAGE'
    | 'REQUEST_TIMEOUT'
    | 'PAYLOAD_TOO_LARGE';

// Mapeo de códigos de error HTTP a tipos
export const HTTP_ERROR_MAP: Record<number, UploadErrorType> = {
    400: 'NO_FILE_PROVIDED',
    408: 'REQUEST_TIMEOUT',
    413: 'PAYLOAD_TOO_LARGE',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE',
    507: 'INSUFFICIENT_STORAGE'
};