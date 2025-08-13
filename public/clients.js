const API_URL = "http://localhost:3000/api/v1/clients";
const tableBody = document.getElementById("clientTable");
const form = document.getElementById("clientForm");

// Cargar todos los clientes
async function loadClients() {
  try {
    const res = await fetch(API_URL);
    const clients = await res.json();

    if (!Array.isArray(clients)) {
      console.error("Unexpected API response:", clients);
      tableBody.innerHTML = '<tr><td colspan="6">Error loading clients</td></tr>';
      return;
    }

    tableBody.innerHTML = clients.map(c => `
      <tr>
        <td>${c.id_client}</td>
        <td>${c.name}</td>
        <td>${c.identification}</td>
        <td>${c.address}</td>
        <td>${c.phone_number}</td>
        <td>${c.email}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editClient(${c.id_client})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteClient(${c.id_client})">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
}

// Edit cliente
async function editClient(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const c = await res.json();
  document.getElementById("client_id").value = c.id_client;
  document.getElementById("name").value = c.name;
  document.getElementById("identification").value = c.identification;
  document.getElementById("address").value = c.address;
  document.getElementById("phone_number").value = c.phone_number;
  document.getElementById("email").value = c.email;
}

// client delete
async function deleteClient(id) {
  if (!confirm("Are you sure you want to delete this client?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadClients();
}

// Submit form (create/update)
form.addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("client_id").value;

  const client = {
    name: document.getElementById("name").value.trim(),
    identification: document.getElementById("identification").value.trim(),
    address: document.getElementById("address").value.trim(),
    phone: document.getElementById("phone_number").value.trim(),
    email: document.getElementById("email").value.trim()
  };

  // Validar campos requeridos
  if (!client.name || !client.identification || !client.address || !client.phone_number || !client.email) {
    alert("All fields are required");
    return;
  }

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client)
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client)
      });
    }
    form.reset();
    loadClients();
  } catch (error) {
    console.error("Error saving client:", error);
  }
});

loadClients();