document.addEventListener('DOMContentLoaded', () => {
    const changeRoleButtons = document.querySelectorAll('.changeRoleButton');
    const deleteUserButtons = document.querySelectorAll('.deleteUserButton');

    changeRoleButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-userid');
            const roleInput = button.previousElementSibling; 
            const newRole = roleInput.value.trim(); 

            if (newRole) {
                try {
                    const response = await fetch(`/api/sessions/premium/${userId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ role: newRole })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        Swal.fire('Éxito', data.message, 'success').then(() => location.reload());
                    } else {
                        const data = await response.json();
                        Swal.fire('Error', data.message || 'Error al cambiar el rol', 'error');
                    }
                } catch (error) {
                    console.error('Error al cambiar el rol:', error);
                    Swal.fire('Error', 'Error al cambiar el rol', 'error');
                }
            } else {
                Swal.fire('Advertencia', 'Por favor, ingresa un nuevo rol', 'warning');
            }
        });
    });

    deleteUserButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-userid');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`/api/sessions/${userId}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success').then(() => location.reload());
                        } else {
                            const data = await response.json();
                            Swal.fire('Error', data.message || 'Error al eliminar el usuario', 'error');
                        }
                    } catch (error) {
                        console.error('Error al eliminar el usuario:', error);
                        Swal.fire('Error', 'Error al eliminar el usuario', 'error');
                    }
                }
            });
        });
    });
});
