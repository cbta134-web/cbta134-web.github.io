// Filtro opcional para errores de Facebook en consola durante desarrollo
// NOTA: Solo usar en desarrollo, no en producción

const filterFacebookErrors = () => {
    if (process.env.NODE_ENV === 'development') {
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.error = (...args) => {
            const message = args.join(' ');
            
            // Lista de patrones de errores de Facebook a filtrar
            const facebookErrorPatterns = [
                'Could not find element',
                'DataStore.get: namespace is required',
                'Permissions policy violation: unload',
                'fburl.com/debugjs',
                'ErrorUtils caught an error'
            ];
            
            // Si el mensaje contiene algún patrón de Facebook, no lo mostramos
            if (facebookErrorPatterns.some(pattern => message.includes(pattern))) {
                return;
            }
            
            // Mostrar otros errores normalmente
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            const message = args.join(' ');
            if (message.includes('facebook') || message.includes('fb-')) {
                return;
            }
            originalWarn.apply(console, args);
        };
        
        console.log('🔧 Filtro de errores de Facebook activado para desarrollo');
    }
};

export default filterFacebookErrors;