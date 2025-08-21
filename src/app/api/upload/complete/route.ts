import { NextRequest, NextResponse } from 'next/server';

// POST /api/upload/complete - Opcional: Marcar upload como completo
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fileId, chunkCount, totalSize } = body;

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        // Simular validación de integridad del archivo
        await new Promise(resolve => setTimeout(resolve, 200));

        console.log(`✅ Upload completed: ${fileId} (${chunkCount} chunks, ${totalSize} bytes)`);

        return NextResponse.json({
            ok: true,
            fileId,
            status: 'completed',
            message: 'File upload completed successfully'
        });

    } catch (error) {
        console.error('Upload complete error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
