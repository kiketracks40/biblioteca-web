// js/socket.js
const socketConfig = {
    init() {
        const socket = io('http://localhost:3000', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
            transports: ['websocket', 'polling']
        });

        // Connection event handlers
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        // Notification events
        socket.on('nuevo_prestamo', (data) => {
            toastr.info(`Nuevo préstamo: ${data.libro} prestado a ${data.usuario}`);
        });

        socket.on('devolucion', (data) => {
            toastr.success(`Devolución: ${data.libro} devuelto por ${data.usuario}`);
        });

        socket.on('bajo_stock', (data) => {
            toastr.warning(`Stock bajo: ${data.Titulo} tiene solo ${data.Disponibles} ejemplares disponibles`);
        });

        return socket;
    }
};