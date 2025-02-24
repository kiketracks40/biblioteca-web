

    let authToken = localStorage.getItem('token');


    
    $('#tablaUsuarios').on('click', '.editar-usuario', function() {
        // Get DataTable instance properly
        const tabla = $('#tablaUsuarios').DataTable();
        const data = tabla.row($(this).parents('tr')).data();
        
        // Fill form with user data
        $('#usuarioId').val(data.UsuarioId);
        $('#nombreUsuario').val(data.Nombre);
        $('#apellidoUsuario').val(data.Apellido);
        $('#emailUsuario').val(data.Email);
        $('#departamentoUsuario').val(data.Departamento);
        $('#rolUsuario').val(data.Rol);
        
        // Set password as not required for editing
        $('#passwordUsuario').prop('required', false);
        
        // Show edit mode elements
        $('.edit-mode').show();
        $('.modal-title').text('Editar Usuario');
        $('#modalUsuario').modal('show');
    });


    $('#nuevoUsuario').click(function() {
        $('#formUsuario')[0].reset();
        $('#modalUsuario').modal('show');
    });
    
    
    // Guardar Usuario
    $('#guardarUsuario').click(function() {
        if (!$('#formUsuario')[0].checkValidity()) {
            $('#formUsuario')[0].reportValidity();
            return;
        }
    
        const userData = {
            nombre: $('#nombreUsuario').val(),
            apellido: $('#apellidoUsuario').val(),
            email: $('#emailUsuario').val(),
            password: $('#passwordUsuario').val(),
            departamento: $('#departamentoUsuario').val(),
            rol: $('#rolUsuario').val()
        };
    
        $.ajax({
            url: 'http://localhost:3000/api/usuarios',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Usuario creado exitosamente'
                });
                $('#modalUsuario').modal('hide');
                $('#tablaUsuarios').DataTable().ajax.reload();
            },
            error: function(xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: xhr.responseJSON?.error || 'Error al crear usuario'
                });
            }
        });
  }); //aqui termina esta funcion 
    
  $('#tablaUsuarios').on('click', '.eliminar-usuario', function() {
    if (!confirm('¿Está seguro de eliminar este usuario?')) {
        return;
    }
    console.log('Delete button clicked');
    const tabla = $('#tablaUsuarios').DataTable();
    const data = tabla.row($(this).parents('tr')).data();
    console.log('User data:', data); 
    
    $.ajax({
        url: `http://localhost:3000/api/usuarios/${data.UsuarioId}`,
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function() {
            tabla.ajax.reload();
            alert('Usuario eliminado exitosamente');
        },
        error: function(xhr) {
            alert('Error: ' + xhr.responseJSON.error);
        }
    });
});


   $('#modalUsuario').on('hidden.bs.modal', function() {
        $('#formUsuario')[0].reset();
        $('#usuarioId').val('');
    });

        // Event Handlers
        $('#nuevoPrestamo').click(function() {
            cargarSelectUsuarios();
            cargarSelectLibros();
            $('#modalPrestamo').modal('show');
        });
    
        function cargarSelectUsuarios() {
            $.get('http://localhost:3000/api/usuarios', function(data) {
                $('#usuarioSelect').empty();
                data.forEach(function(usuario) {
                    $('#usuarioSelect').append(
                        $('<option></option>')
                            .val(usuario.UsuarioId)
                            .text(usuario.Nombre + ' ' + usuario.Apellido)
                    );
                });
            });
        }
    
        function cargarSelectLibros() {
            $.get('http://localhost:3000/api/libros', function(data) {
                $('#libroSelect').empty();
                data.forEach(function(libro) {
                    $('#libroSelect').append(
                        $('<option></option>')
                            .val(libro.LibroId)
                            .text(libro.Titulo)
                    );
                });
            });
        }
    
        $('#guardarPrestamo').click(function() {
            const prestamo = {
                usuarioId: $('#usuarioSelect').val(),
                ejemplarId: $('#libroSelect').val(),
                fechaDevolucionEsperada: $('#fechaDevolucion').val()
            };
    
            $.ajax({
                url: 'http://localhost:3000/api/prestamos',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(prestamo),
                success: function(response) {
                    $('#modalPrestamo').modal('hide');
                    $('#tablaPrestamos').DataTable().ajax.reload();
                },
                error: function(xhr, status, error) {
                    alert('Error al crear el préstamo: ' + error);
                }
            });
        });
    
        // Devolver libro
        $('#tablaPrestamos').on('click', '.devolver', function() {
            const data = $('#tablaPrestamos').DataTable().row($(this).parents('tr')).data();
            
            $.ajax({
                url: `http://localhost:3000/api/prestamos/${data.PrestamoId}/devolucion`,
                method: 'PUT',
                success: function() {
                    $('#tablaPrestamos').DataTable().ajax.reload();
                },
                error: function(xhr, status, error) {
                    alert('Error al devolver el libro: ' + error);
                }
            });
        });
   
   // });


    
    // Load categorías and autores for libro form
    function cargarSelectCategorias() {
        $.get('http://localhost:3000/api/categorias', function(data) {
            $('#categoriaSelect').empty();
            data.forEach(function(categoria) {
                $('#categoriaSelect').append(
                    $('<option></option>')
                        .val(categoria.CategoriaId)
                        .text(categoria.Nombre)
                );
            });
        });
    }
    
    function cargarSelectAutores() {
        $.get('http://localhost:3000/api/autores', function(data) {
            $('#autorSelect').empty();
            data.forEach(function(autor) {
                $('#autorSelect').append(
                    $('<option></option>')
                        .val(autor.AutorId)
                        .text(autor.Nombre + ' ' + autor.Apellido)
                );
            });
        });
    }
    
    // Nuevo Libro
    $('#nuevoLibro').click(function() {
        cargarSelectCategorias();
        cargarSelectAutores();
        $('#modalLibro').modal('show');
    });
    
    $('#guardarLibro').click(function() {
        const libro = {
            titulo: $('#tituloLibro').val(),
            isbn: $('#isbnLibro').val(),
            categoriaId: $('#categoriaSelect').val(),
            anioPublicacion: $('#anioPublicacion').val(),
            editorial: $('#editorial').val(),
            autores: [$('#autorSelect').val()]
        };
    
        $.ajax({
            url: 'http://localhost:3000/api/libros',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(libro),
            success: function(response) {
                $('#modalLibro').modal('hide');
                $('#tablaLibros').DataTable().ajax.reload();
            },
            error: function(xhr, status, error) {
                alert('Error al crear el libro: ' + error);
            }
        });
    });
    
    // Agregar Ejemplar
    $('#tablaLibros').on('click', '.agregarEjemplar', function() {
        const data = $('#tablaLibros').DataTable().row($(this).parents('tr')).data();
        $('#libroIdEjemplar').val(data.LibroId);
        $('#modalEjemplar').modal('show');
    });
    
    $('#guardarEjemplar').click(function() {
        const ejemplar = {
            libroId: $('#libroIdEjemplar').val(),
            codigoEjemplar: $('#codigoEjemplar').val(),
            tipoPrestamo: $('#tipoPrestamo').val()
        };
    
        $.ajax({
            url: 'http://localhost:3000/api/ejemplares',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ejemplar),
            success: function(response) {
                $('#modalEjemplar').modal('hide');
                $('#tablaLibros').DataTable().ajax.reload();
            },
            error: function(xhr, status, error) {
                alert('Error al crear el ejemplar: ' + error);
            }
        });
    });
    

    
    // Clear forms when modals are closed
    $('.modal').on('hidden.bs.modal', function () {
        $(this).find('form')[0].reset();
    });
    
    
    // Reports handling
    let reportTable = null;
    
    $('#generarReporte').click(function() {
        const fechaInicio = $('#fechaInicioReporte').val();
        const fechaFin = $('#fechaFinReporte').val();
        const tipoReporte = $('#tipoReporte').val();
    
        // Validate dates
        if (tipoReporte !== 'inventario' && tipoReporte !== 'autores') {
            if (!fechaInicio || !fechaFin) {
                alert('Por favor seleccione un rango de fechas');
                return;
            }
            if (fechaInicio > fechaFin) {
                alert('La fecha de inicio debe ser menor que la fecha fin');
                return;
            }
        }
    
        // Destroy existing DataTable if exists
        if (reportTable) {
            reportTable.destroy();
            $('#tablaReporte thead').empty();
            $('#tablaReporte tbody').empty();
        }
    
        // Configure columns and data based on report type
        let columns = [];
        let ajaxUrl = '';
    
        switch(tipoReporte) {
            case 'prestamos':
                columns = [
                    { title: "Usuario", data: "Usuario" },
                    { title: "Libro", data: "Titulo" },
                    { title: "Fecha Préstamo", data: "FechaPrestamo" },
                    { title: "Fecha Devolución", data: "FechaDevolucionReal" }
                ];
                ajaxUrl = `http://localhost:3000/api/prestamos/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
                break;
    
                case 'usuarios':
                    columns = [
                        { 
                            title: "Usuario", 
                            data: "Usuario" 
                        },
                        { 
                            title: "Total Préstamos", 
                            data: "TotalPrestamos",
                            render: function(data) {
                                return data || 0;
                            }
                        },
                        { 
                            title: "Último Préstamo", 
                            data: "UltimoPrestamo",
                            render: function(data) {
                                return data ? new Date(data).toLocaleDateString() : 'Sin préstamos';
                            }
                        }
                    ];
                    ajaxUrl = `http://localhost:3000/api/usuarios/prestamos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
                    break;
            case 'inventario':
                columns = [
                    { title: "Libro", data: "Titulo" },
                    { title: "Total Ejemplares", data: "TotalEjemplares" },
                    { title: "Disponibles", data: "EjemplaresLibres" },
                    { title: "Prestados", data: "EjemplaresPrestados" },
                    { title: "En Reparación", data: "EjemplaresReparacion" }
                ];
                ajaxUrl = 'http://localhost:3000/api/libros/inventario';
                break;
    
            case 'autores':
                columns = [
                    { title: "Autor", data: "Autor" },
                    { title: "Libros", data: "Libros" }
                ];
                ajaxUrl = 'http://localhost:3000/api/autores/libros';
                break;
        }

        

       
    
        // Initialize DataTable with selected configuration
        reportTable = $('#tablaReporte').DataTable({
            ajax: {
                url: ajaxUrl,
                dataSrc: '',
                error: function(xhr, error, thrown) {
                    console.error('Error en la carga de datos:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al cargar los datos del reporte'
                    });
                }
            },
            columns: columns,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
            },
            buttons: [
                {
                    extend: 'collection',
                    text: 'Exportar',
                    buttons: [
                        'copy', 'csv', 'excel',
                        {
                            text: 'PDF',
                            action: function(e, dt, node, config) {
                                const data = dt.data().toArray();
                                ReportGenerator.generatePrestamosReport(data).download('reporte_prestamos.pdf');
                            }
                        }
                    ]
                }
            ]
        });
    });

   
      
    // Form validation
    function validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form.checkValidity()) {
            // Create temporary submit button to trigger HTML5 validation
            const tmpSubmit = document.createElement('button');
            form.appendChild(tmpSubmit);
            tmpSubmit.click();
            form.removeChild(tmpSubmit);
            return false;
        }
        return true;
    }
    
    // Add validation to all form submissions
    $('#guardarPrestamo').click(function() {
        if (!validateForm('formPrestamo')) return;
        // ... rest of the código
    });
    
    $('#guardarLibro').click(function() {
        if (!validateForm('formLibro')) return;
        // ... rest of the código
    });
    
    $('#guardarEjemplar').click(function() {
        if (!validateForm('formEjemplar')) return;
        // ... rest of the código
    });
    
   
    
    
    
    $('#cambiarPassword').click(function() {
        $('#cambiarPasswordModal').modal('show');
    });
    
    $('#guardarPassword').click(function() {
        const oldPassword = $('#oldPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();
    
        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
    
        $.ajax({
            url: 'http://localhost:3000/api/auth/cambiar-password',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ oldPassword, newPassword }),
            success: function(response) {
                alert('Contraseña actualizada exitosamente');
                $('#cambiarPasswordModal').modal('hide');
                $('#formCambiarPassword')[0].reset();
            },
            error: function(xhr) {
                alert('Error: ' + xhr.responseJSON.error);
            }
        });
    });
    
    
    function initializeActivityTable() {
        $('#tablaActividades').DataTable({
            ajax: {
                url: 'http://localhost:3000/api/actividad/log',
                dataSrc: ''
            },
            columns: [
                { 
                    data: 'FechaCreacion',
                    render: function(data) {
                        return new Date(data).toLocaleString();
                    }
                },
                { data: 'NombreUsuario' },
                { data: 'Accion' },
                { data: 'Tabla' },
                { 
                    data: null,
                    render: function(data) {
                        return `<button class="btn btn-sm btn-info ver-detalles" 
                                data-before='${data.DetalleAntes}' 
                                data-after='${data.DetalleDespues}'>
                                Ver Detalles
                                </button>`;
                    }
                }
            ],
            order: [[0, 'desc']],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
            }
        });
    }
    
    // Handle details view
    $('#tablaActividades').on('click', '.ver-detalles', function() {
        const before = $(this).data('before');
        const after = $(this).data('after');
        
        $('#detallesModal .modal-body').html(`
            <h4>Estado Anterior:</h4>
            <pre>${JSON.stringify(before, null, 2)}</pre>
            <h4>Estado Nuevo:</h4>
            <pre>${JSON.stringify(after, null, 2)}</pre>
        `);
        
        $('#detallesModal').modal('show');
    });
    
    function handleApiError(error) {
        let message = 'Error en la operación';
        
        if (error.responseJSON && error.responseJSON.error) {
            message = error.responseJSON.error.message;
        }
    
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
        });
    }
    
    // Update all AJAX calls to use error handling
    
    
    $.ajax({
        url: 'http://localhost:3000/api/prestamos',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(prestamo), //prestamo
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Préstamo creado exitosamente'
            });
            $('#modalPrestamo').modal('hide');
            $('#tablaPrestamos').DataTable().ajax.reload();
        },
        error: handleApiError
    });
    
    
    
    function validateForm(formId, schema) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const { error } = schema.validate(data);
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: error.details[0].message
            });
            return false;
        }
        return true;
    }
    
    // Update form submissions
    $('#formPrestamo').submit(function(e) {
        e.preventDefault();
        if (!validateForm('formPrestamo', schemas.prestamo)) return;
        // Rest of the code...
    });
    
    const ClientCache = {
        set(key, data, ttl) {
            const item = {
                data,
                timestamp: new Date().getTime(),
                ttl: ttl * 1000 // Convert to milliseconds
            };
            localStorage.setItem(key, JSON.stringify(item));
        },
    
        get(key) {
            const item = localStorage.getItem(key);
            if (!item) return null;
    
            const parsed = JSON.parse(item);
            const now = new Date().getTime();
    
            if (now - parsed.timestamp > parsed.ttl) {
                localStorage.removeItem(key);
                return null;
            }
    
            return parsed.data;
        }
    };
    
    // Use in DataTables
    function loadTableData(tableId, url, columns) {
        const cachedData = ClientCache.get(url);
        
        if (cachedData) {
            $(tableId).DataTable({
                data: cachedData,
                columns: columns
            });
            return;
        }
    
        $.ajax({
            url: url,
            success: function(data) {
                ClientCache.set(url, data, 300); // Cache for 5 minutes
                $(tableId).DataTable({
                    data: data,
                    columns: columns
                });
            }
        });
    }
    
    
   
    
    // Eliminar Usuario
   $('#tablaUsuarios').on('click', '.eliminar-usuario', function() {
        if (!confirm('¿Está seguro de eliminar este usuario?')) {
            return;
        }
    
        const data = tablaUsuarios.row($(this).parents('tr')).data();
        
        $.ajax({
            url: `http://localhost:3000/api/usuarios/${data.UsuarioId}`,
            method: 'DELETE',
            success: function() {
                tablaUsuarios.ajax.reload();
                alert('Usuario eliminado exitosamente');
            },
            error: function(xhr) {
                alert('Error: ' + xhr.responseJSON.error);
            }
        });
    });
    
    // Clear form on modal close
 
    

    
    // Notifications Module
    const Notifications = {
        // Store notifications
        list: [],
    
        // Add new notification
        add(notification) {
            this.list.unshift({
                id: Date.now(),
                ...notification,
                timestamp: new Date()
            });
            this.render();
            this.showToast(notification);
        },
    
        // Render notifications in panel
        render() {
            const notificationList = $('#notificationList');
            notificationList.empty();
    
            this.list.forEach(notification => {
                const html = `
                    <div class="list-group-item" data-id="${notification.id}">
                        <div class="d-flex justify-content-between">
                            <h4 class="list-group-item-heading">${notification.title}</h4>
                            <small>${this.formatDate(notification.timestamp)}</small>
                        </div>
                        <p class="list-group-item-text">${notification.message}</p>
                        <div class="mt-2">
                            <button class="btn btn-xs btn-danger delete-notification">
                                Eliminar
                            </button>
                        </div>
                    </div>
                `;
                notificationList.append(html);
            });
        },
    
        // Format date
        formatDate(date) {
            return new Date(date).toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
    
        // Show toast notification
        showToast(notification) {
            toastr[notification.type || 'info'](
                notification.message,
                notification.title
            );
        },
    
    };
    
    // Event handlers
    $(document).ready(function() {
        // Initialize notifications
        Notifications.initializeSocket();
    
        // Handle notification deletion
        $('#notificationList').on('click', '.delete-notification', function() {
            const id = $(this).closest('.list-group-item').data('id');
            Notifications.list = Notifications.list.filter(n => n.id !== id);
            Notifications.render();
        });
    
        // Example of manual notification
        $('.add-manual-notification').click(function() {
            Notifications.add({
                title: 'Notificación Manual',
                message: 'Esta es una notificación de prueba',
                type: 'info'
            });
        });
    });
    
    // Configure toastr
    toastr.options = {
        "closeButton": true,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "5000"
    };
    
    const socket = io('http://localhost:3000');
    
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    
    socket.on('nuevo_prestamo', (data) => {
        toastr.info(`Nuevo préstamo: ${data.libro} prestado a ${data.usuario}`);
    });
    
    socket.on('devolucion', (data) => {
        toastr.success(`Devolución: ${data.libro} devuelto por ${data.usuario}`);
    });
    
    socket.on('bajo_stock', (data) => {
        toastr.warning(`Stock bajo: ${data.Titulo} tiene solo ${data.Disponibles} ejemplares disponibles`);
    });
    
    socket.on('prestamos_vencidos', (prestamos) => {
        prestamos.forEach(prestamo => {
            toastr.error(`Préstamo vencido: ${prestamo.Titulo} - ${prestamo.Usuario}`);
        });
    });
    
    // Initialize toastr
    toastr.options = {
        "closeButton": true,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "5000"
    };
    
    
    $(document).ready(function() {
        const socket = socketConfig.init();
    });

//});

