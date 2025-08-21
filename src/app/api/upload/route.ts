import { NextRequest, NextResponse } from 'next/server';

// POST /api/upload - Subir un archivo individual
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validar tipo de archivo
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Only PDF files are allowed' },
                { status: 400 }
            );
        }

        // Validar tamaño (5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB' },
                { status: 400 }
            );
        }

        // Simular delay de upload
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        // Simular fallos aleatorios (20% de probabilidad)
        const random = Math.random();
        if (random < 0.20) { // 20% chance de error
            const errorTypes = [
                { status: 500, message: 'Internal server error during upload' },
                { status: 503, message: 'Service temporarily unavailable' },
                { status: 507, message: 'Insufficient storage space' },
                { status: 408, message: 'Request timeout' },
                { status: 413, message: 'Payload too large' }
            ];
            
            const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
            console.log(`❌ Simulated upload error: ${file.name} - ${errorType.message}`);
            
            return NextResponse.json(
                { error: errorType.message },
                { status: errorType.status }
            );
        }

        // Generar ID y URL simulados
        const fileId = crypto.randomUUID();
        const mockUrl = `https://storage.example.com/uploads/${fileId}/${encodeURIComponent(file.name)}`;

        console.log(`📁 File uploaded successfully: ${file.name} (${file.size} bytes)`);

        return NextResponse.json({
            id: fileId,
            url: mockUrl,
            name: file.name,
            size: file.size,
            type: file.type
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
