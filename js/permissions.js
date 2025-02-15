const Permissions = {
    hasPermission(permission) {
        const userRole = Auth.user?.rol;
        if (!userRole) return false;
        
        const roles = {
            Administrador: ['all'],
            Bibliotecario: ['read', 'create', 'update'],
            Usuario: ['read']
        };

        return userRole === 'Administrador' || 
               (roles[userRole] && roles[userRole].includes(permission));
    },

    updateUI() {
        // Hide/show elements based on permissions
        if (!this.hasPermission('create')) {
            $('.create-button').hide();
        }
        if (!this.hasPermission('update')) {
            $('.update-button').hide();
        }
        if (!this.hasPermission('delete')) {
            $('.delete-button').hide();
        }
    }
}