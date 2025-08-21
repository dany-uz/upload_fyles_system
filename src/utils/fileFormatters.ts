/**
 * Formatea el tamaño de un archivo en bytes a una representación legible
 * @param bytes - Tamaño del archivo en bytes
 * @returns String formateado (ej: "1.5 MB", "500 KB")
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Convierte bytes a una unidad específica
 * @param bytes - Tamaño en bytes
 * @param unit - Unidad de destino ('KB', 'MB', 'GB')
 * @returns Número convertido a la unidad especificada
 */
export const convertBytesToUnit = (bytes: number, unit: 'KB' | 'MB' | 'GB'): number => {
    const k = 1024;
    const units = { KB: 1, MB: 2, GB: 3 };
    const power = units[unit];
    
    return bytes / Math.pow(k, power);
};

/**
 * Verifica si un archivo excede un tamaño máximo
 * @param fileSize - Tamaño del archivo en bytes
 * @param maxSize - Tamaño máximo permitido en bytes
 * @returns true si el archivo es válido (no excede el límite)
 */
export const isFileSizeValid = (fileSize: number, maxSize: number): boolean => {
    return fileSize <= maxSize;
};
