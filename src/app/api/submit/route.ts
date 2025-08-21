import { NextRequest, NextResponse } from 'next/server';

interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
}

// POST /api/submit - Enviar formulario completo
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, files } = body;

        // Validar datos requeridos
        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        if (!files || !Array.isArray(files) || files.length === 0) {
            return NextResponse.json(
                { error: 'At least one file is required' },
                { status: 400 }
            );
        }

        // Validar estructura de archivos
        for (const file of files) {
            if (!file.id || !file.name || !file.size || !file.type || !file.url) {
                return NextResponse.json(
                    { error: 'Invalid file structure' },
                    { status: 400 }
                );
            }
        }

        // Simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Generar ID de submission
        const submissionId = crypto.randomUUID();

        // Log para debugging
        console.log('📝 Form submitted:', {
            submissionId,
            title,
            description,
            fileCount: files.length,
            totalSize: files.reduce((sum: number, file: FileData) => sum + (file.size || 0), 0)
        });

        // Simular diferentes respuestas ocasionalmente
        const random = Math.random();
        if (random < 0.2) { // 20% chance de error simulado
            return NextResponse.json(
                { error: 'Simulated server error for testing' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ok: true,
            submissionId,
            message: 'Form submitted successfully',
            data: {
                title,
                description,
                files: files.map((file: FileData) => ({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: file.url
                }))
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Submit error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}