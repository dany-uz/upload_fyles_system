// Acá creamos la estructura base que tendrá nuestro FileDescriptor
interface BaseFileDescriptor {
    id: string;
    name: string;
    size: number;
    type: string; // Tipo MIME
    errors?: string[]; // Los errores serán opcionales
    file?: File; // Referencia al archivo original para upload
}

// Acá creamos la estructura que tendrá nuestro FileDescriptor según el status
export type FileDescriptor =
    | (BaseFileDescriptor & { status: 'idle' })
    | (BaseFileDescriptor & { status: 'uploading'; progress: number })
    | (BaseFileDescriptor & { status: 'done' })
    | (BaseFileDescriptor & { status: 'error'; errors: string[] })
    | (BaseFileDescriptor & { status: 'canceled' })

// Actualizador de progreso de forma typesafe
export function updateProgrees(file: FileDescriptor, progress: number): FileDescriptor {
    if (file.status === 'uploading') {
        return { ...file, progress: Math.max(0, Math.min(100, progress)) };
    }

    return file;
}

// Función para generar UUID compatible con navegadores antiguos
function generateUUID(): string {
    // Crear un UUID (No funciona en todos los navegadores)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    
    // Opción alternativa para navegadores antiguos para generar un UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function mapFilesToDescriptors<T extends FileList | File[]>(files: T): FileDescriptor[] {
    // Convertir FileList o File[] a un array de archivos estándar para un manejo uniforme.
    const fileArray = Array.from(files);

    // Set para rastrear duplicados por name+size
    const seenFiles = new Set<string>();
    const uniqueFiles: File[] = [];

    for (const file of fileArray) {
        const key = `${file.name}-${file.size}`;
        if (!seenFiles.has(key)) {
            seenFiles.add(key);
            uniqueFiles.push(file);
        }
    }

    // Mapeamos los archivos únicos a nuestro tipo FileDescriptor
    return uniqueFiles.map((file): FileDescriptor => ({
        id: generateUUID(),
        name: file.name,
        size: file.size,
        type: file.type, // Tipo MIME
        status: 'idle', // Estado inicial de un archivo nuevo
        file: file // Guardar referencia al archivo original
    }));
}

export async function limitConcurrency<T>(
    pool: number,
    tasks: (() => Promise<T>)[]
): Promise<(T | Error)[]> {
    const results: (T | Error)[] = new Array(tasks.length);
    let currentIndex = 0;

    async function worker() {
        while (currentIndex < tasks.length) {
            const idx = currentIndex++;
            try {
                results[idx] = await tasks[idx]();
            } catch (err) {
                results[idx] = err instanceof Error ? err : new Error(String(err));
            }
        }
    }

    // Lanzar hasta pool workers
    const workers = Array.from({ length: Math.min(pool, tasks.length) }, () => worker());

    await Promise.all(workers);

    return results;
}