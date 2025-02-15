const Auth = {
    token: null,
    user: null,

    init() {
        this.token = localStorage.getItem('token');
        try {
            this.user = JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            this.logout();
            return false;
        }

        if (this.token) {
            this.setupAxiosInterceptors();
            return true;
        }
        return false;
    },

    login(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.setupAxiosInterceptors();
        this.updateUI(true);
    },

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateUI(false);
    },

    updateUI(isLoggedIn) {
        if (isLoggedIn) {
            $('#loginForm').hide();
            $('#mainApp').show();
            this.mostrarUsuarioActual();
            Tables.initialize();       
        } else {
            $('#mainApp').hide();
            $('#loginForm').show();
            $('#loginEmail').val('');
            $('#loginPassword').val('');
        }
    },

    mostrarUsuarioActual() {
        if (this.user) {
            $('.navbar-right').html(`
                <li><p class="navbar-text">Bienvenido, ${this.user.Nombre}</p></li>
                <li><a href="#" id="logout">Cerrar Sesión</a></li>
            `);
        }
    },

    setupAxiosInterceptors() {
        $.ajaxSetup({
            beforeSend: (xhr) => {
                if (this.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
                }
            }
        });
    }
};

// Event Handlers
$('#loginForm').on('submit', function(e) {
    e.preventDefault();
    
    const loginData = {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
    };

    $.ajax({
        url: 'http://localhost:3000/api/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginData),
        success: function(response) {
            Auth.login(response.token, response.user);
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: xhr.responseJSON?.error || 'Error desconocido'
            });
        }
    });
});

$(document).on('click', '#logout', function() {
    Auth.logout();
});

// Initialize on page load
$(document).ready(function() {
    Auth.init();
});

// Global AJAX error handling
$(document).ajaxError(function(event, jqXHR) {
    if (jqXHR.status === 401) {
        Auth.logout();
        Swal.fire({
            icon: 'warning',
            title: 'Sesión Expirada',
            text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.'
        });
    }
});