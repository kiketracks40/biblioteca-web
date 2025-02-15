// tables.js
const Tables = {
    initialize() {
        // Destroy existing tables if they exist
        if ($.fn.DataTable.isDataTable('#tablaLibros')) {
            $('#tablaLibros').DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable('#tablaPrestamos')) {
            $('#tablaPrestamos').DataTable().destroy();
        }

        if ($.fn.DataTable.isDataTable('#tablaUsuarios')) {
            $('#tablaUsuarios').DataTable().destroy();
        }

        this.initializeUsuarios();
        this.initializeLibros();
        this.initializePrestamos();
        
    },

    initializeLibros() {
        return $('#tablaLibros').DataTable({
            ajax: {
                url: 'http://localhost:3000/api/libros',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                dataSrc: ''
            },
            columns: [
                { data: 'Titulo' },
                { data: 'ISBN' },
                { data: 'Categoria' },
                { data: 'Editorial' },
               
                {
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-primary editar">Editar</button>
                            <button class="btn btn-sm btn-danger eliminar">Eliminar</button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
            },
       
        });
   
    },

    initializeUsuarios() {    
        return $('#tablaUsuarios').DataTable({
            ajax: {
                url: 'http://localhost:3000/api/usuarios',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                dataSrc: ''
            },
            columns: [
                { data: 'Nombre' },
                { data: 'Apellido' },
                { data: 'Email' },
                { data: 'Departamento' },
                { data: 'Rol' },
                {
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-info editar-usuario">Editar</button>
                            <button class="btn btn-sm btn-danger eliminar-usuario">Eliminar</button>
                        `;          
                    }
                }   
            ],  
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
            }   
        });
    },

    initializePrestamos() {
        $('#tablaPrestamos').DataTable({
            ajax: {
                url: 'http://localhost:3000/api/prestamos',
                dataSrc: ''
            },
            columns: [
               { data: 'UsuarioId' },
                { data: 'EjemplarId' },
               
                { data: 'FechaPrestamo' },
                { data: 'FechaDevolucionEsperada' },
                { data: 'Estado' },
                {
                    data: null,
                    render: function(data) {
                        return '<button class="btn btn-sm btn-success devolver">Devolver</button>';
                    }
                }
            ]
        });
    },  
};          
       












