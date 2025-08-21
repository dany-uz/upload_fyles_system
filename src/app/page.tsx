import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Prueba Técnica</h1>
                <p className="text-gray-600 mb-8">Sistema de Upload de Archivos PDF</p>
                
                <Link 
                    href="/upload"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                    </svg>
                    Ir a Upload
                </Link>
                
                <div className="mt-6 text-sm text-gray-500">
                    <p>✅ Subida múltiple de archivos PDF</p>
                    <p>✅ Drag & Drop interactivo</p>
                    <p>✅ Progreso en tiempo real</p>
                </div>
            </div>
        </main>
    )
}