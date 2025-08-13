// clients.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const form = document.getElementById('clientForm');
    const messageDiv = document.getElementById('message');
    const clientsTableBody = document.getElementById('clients-table-body');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const clientIdInput = document.getElementById('clientId');
    
    // Referencias para el Modal de Eliminación (componente de Bootstrap)
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // --- Funciones para manejar la UI ---
    const showMessage = (text, type = 'success') => {
        // Validación para evitar el TypeError si el elemento no existe en el HTML
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
        } else {
            console.error('Error: El elemento con ID "message" no se encuentra en el DOM.');
        }
    };

    const resetForm = () => {
        if (form) form.reset();
        if (clientIdInput) clientIdInput.value = '';
        if (formTitle) formTitle.textContent = 'Registrar Nuevo Cliente';
        if (submitBtn) submitBtn.textContent = 'Registrar Cliente';
        if (cancelBtn) cancelBtn.classList.add('d-none');
        showMessage(''); // Limpiar el mensaje
    };

    // --- Lógica de la API ---
    // Cargar y renderizar todos los clientes
    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/clients');
            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error('Error al cargar la lista de clientes. El servidor no devolvió una respuesta válida.');
                }
                throw new Error(errorData.message || 'Error al cargar la lista de clientes.');
            }
            const clients = await response.json();
            renderClients(clients);
        } catch (error) {
            showMessage(error.message || 'Error de conexión con el servidor.', 'danger');
            console.error('Error fetching clients:', error);
        }
    };

    // Obtener un cliente para editar y llenar el formulario
    const fetchClientForEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/clients/${id}`);
            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error('Error al obtener el cliente. El servidor no devolvió una respuesta válida.');
                }
                throw new Error(errorData.message || 'Cliente no encontrado.');
            }
            const client = await response.json();
            
            // Llenar el formulario
            formTitle.textContent = `Editar Cliente: ${client.name}`;
            submitBtn.textContent = 'Actualizar Cliente';
            cancelBtn.classList.remove('d-none');
            
            clientIdInput.value = client.id;
            form.name.value = client.name;
            form.identification.value = client.identification;
            form.address.value = client.address;
            form.phone_number.value = client.phone_number;
            form.email.value = client.email;
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            showMessage(error.message, 'danger');
            console.error('Error fetching client for edit:', error);
        }
    };

    // Crear o actualizar un cliente
    const saveClient = async (id, formData) => {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:3000/api/v1/clients/${id}` : 'http://localhost:3000/api/v1/clients';
        const successMessage = id ? 'Cliente actualizado exitosamente.' : 'Cliente registrado exitosamente.';
        const errorMessage = id ? 'Error al actualizar el cliente.' : 'Error al registrar el cliente.';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                let result = {};
                try {
                    result = await response.json();
                } catch (e) {
                    throw new Error('Error de servidor. El servidor no devolvió una respuesta válida.');
                }
                throw new Error(result.message || errorMessage);
            }

            showMessage(successMessage, 'success');
            resetForm();
            fetchClients();
        } catch (error) {
            showMessage(error.message, 'danger');
            console.error('Error saving client:', error);
        }
    };

    // Eliminar un cliente
    const deleteClient = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/clients/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                let result = {};
                try {
                    result = await response.json();
                } catch (e) {
                    throw new Error('Error al eliminar. El servidor no devolvió una respuesta válida.');
                }
                throw new Error(result.message || 'Error al eliminar el cliente.');
            }
            showMessage('Cliente eliminado exitosamente.', 'success');
            fetchClients();
        } catch (error) {
            showMessage(error.message, 'danger');
            console.error('Error deleting client:', error);
        }
    };

    // --- Renderizado de la Tabla ---
    const renderClients = (clients) => {
        clientsTableBody.innerHTML = '';
        if (clients && clients.length > 0) {
            clients.forEach(client => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${client.name}</td>
                    <td>${client.identification}</td>
                    <td>${client.email}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-warning me-2 edit-btn" data-id="${client.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${client.id}">Eliminar</button>
                    </td>
                `;
                clientsTableBody.appendChild(row);
            });
        } else {
            clientsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No hay clientes registrados.</td>
                </tr>
            `;
        }
    };

    // --- Manejadores de Eventos ---
    clientsTableBody.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            if (id) {
                fetchClientForEdit(id);
            } else {
                console.error('Error: ID del cliente no encontrado en el botón de edición. Operación cancelada.');
                showMessage('Error: No se puede realizar la operación. ID del cliente no válido.', 'danger');
            }
        } else if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            if (id) {
                confirmDeleteBtn.dataset.id = id;
                deleteModal.show();
            } else {
                console.error('Error: ID del cliente no encontrado en el botón de eliminar. Operación cancelada.');
                showMessage('Error: No se puede realizar la operación. ID del cliente no válido.', 'danger');
            }
        }
    });
    
    // El evento 'submit' debe ser manejado por el formulario
    if (form) {
      form.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = {
              name: form.name.value,
              identification: form.identification.value,
              address: form.address.value,
              phone_number: form.phone_number.value,
              email: form.email.value,
          };
  
          const clientId = clientIdInput.value || null;
          saveClient(clientId, formData);
      });
    }

    if (cancelBtn) cancelBtn.addEventListener('click', resetForm);
    
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
          const idToDelete = confirmDeleteBtn.dataset.id;
          if (idToDelete) {
              deleteClient(idToDelete);
              deleteModal.hide();
          }
      });
    }

    // Cargar los clientes al iniciar la vista
    fetchClients();
});
