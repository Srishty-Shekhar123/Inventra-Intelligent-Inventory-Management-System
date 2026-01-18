
// ================= LOGIN =================
document.getElementById("loginBtn")?.addEventListener("click", () => {

  const user = document.getElementById("user");
  const pass = document.getElementById("pass");
  const role = document.getElementById("role");
  const msg  = document.getElementById("msg");

  if (!user.value || !pass.value || !role.value) {
    msg.innerHTML = "❌ All fields are required";
    return;
  }

  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.value,
      password: pass.value,
      role: role.value
    })
  })
  .then(async res => {
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    return res.json();
  })
  .then(data => {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ email: data.username, role: data.role })
    );

    window.location =
      data.role === "admin" ? "admin.html" : "employee.html";
  })
  .catch(err => {
    msg.innerHTML = "❌ " + err.message;
  });
});


// ================= REGISTER =================
document.getElementById("regBtn")?.addEventListener("click", () => {

  const ruser = document.getElementById("ruser");
  const rpass = document.getElementById("rpass");
  const rrole = document.getElementById("rrole");
  const rmsg  = document.getElementById("rmsg");

  if (!ruser.value || !rpass.value || !rrole.value) {
    rmsg.innerHTML = "❌ All fields are required";
    return;
  }

  fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ruser.value,
      password: rpass.value,
      role: rrole.value
    })
  })
  .then(async res => {
    const msg = await res.text();
    if (!res.ok) throw new Error(msg);
    rmsg.innerHTML = "✅ " + msg;
  })
  .catch(err => {
    rmsg.innerHTML = "❌ " + err.message;
  });
});


// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("currentUser");
  window.location = "login.html";
}
// ================= FORGOT PASSWORD =================

// SEND OTP
document.getElementById("otpBtn")?.addEventListener("click", () => {

  const email = document.getElementById("fuser").value;
  const info  = document.getElementById("info");

  if (!email) {
    info.innerHTML = "❌ Please enter email";
    return;
  }

  fetch("http://localhost:8080/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email })
  })
  .then(async res => {
    const msg = await res.text();
    if (!res.ok) throw new Error(msg);

    info.innerHTML = "📩 OTP sent (check backend console)";
    document.getElementById("otpBox").style.display = "block";
  })
  .catch(err => {
    info.innerHTML = "❌ " + err.message;
  });
});


// RESET PASSWORD
document.getElementById("verifyBtn")?.addEventListener("click", () => {

  const email    = document.getElementById("fuser").value;
  const otp      = document.getElementById("otp").value;
  const newPass  = document.getElementById("newpass").value;
  const confPass = document.getElementById("confpass").value;
  const fmsg     = document.getElementById("fmsg");

  if (!otp || !newPass || !confPass) {
    fmsg.innerHTML = "❌ All fields are required";
    return;
  }

  if (newPass !== confPass) {
    fmsg.innerHTML = "❌ Passwords do not match";
    return;
  }

  fetch("http://localhost:8080/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      otp: otp,
      newPassword: newPass
    })
  })
  .then(async res => {
    const msg = await res.text();
    if (!res.ok) throw new Error(msg);

    fmsg.innerHTML = "✅ Password reset successful";
  })
  .catch(err => {
    fmsg.innerHTML = "❌ " + err.message;
  });
});



// ================= PRODUCT MODULE =================
window.addEventListener("load", loadProducts);

function loadProducts() {

  const table = document.getElementById("ptable");
  if (!table) return;

  fetch("http://localhost:8080/api/products/all")
    .then(res => res.json())
    .then(products => {
      table.innerHTML = "";

      products.forEach(p => {
        table.innerHTML += `
          <tr
            data-id="${p.id}"
            data-sku="${p.sku}"
            data-name="${p.name}"
            data-supplier="${p.supplier}"
            data-category="${p.category}"
            data-price="${p.price}"
            data-quantity="${p.quantity}"
          >
            <td>${p.sku}</td>
            <td>${p.name}</td>
            <td>${p.supplier}</td>
            <td>${p.category}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            <td>
              <button onclick="editProduct(this)">Edit</button>
              <button onclick="deleteProduct(${p.id})">Delete</button>
              <button onclick="stockIn('${p.sku}')">Stock In</button>
              <button onclick="stockOut('${p.sku}', ${p.quantity})">Stock Out</button>
            </td>
          </tr>
        `;
      });
    });
}


// ================= ADD PRODUCT =================
document.getElementById("addBtn")?.addEventListener("click", () => {

  const pmsg = document.getElementById("pmsg");

  const product = {
    sku: psku.value,
    name: pname.value,
    supplier: psupplier.value,
    category: pcat.value,
    price: pprice.value,
    quantity: pqty.value
  };

  fetch("http://localhost:8080/api/products/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(() => {
    pmsg.innerHTML = "✅ Product added successfully";
    loadProducts();
  })
  .catch(() => {
    pmsg.innerHTML = "❌ Failed to add product";
  });
});


// ================= DELETE =================
function deleteProduct(id) {

  if (!confirm("Delete this product?")) return;

  fetch(`http://localhost:8080/api/products/delete/${id}`, {
    method: "DELETE"
  })
  .then(() => loadProducts())
  .catch(() => alert("Delete failed"));
}


// ================= EDIT =================
function editProduct(btn) {

  const row = btn.closest("tr");

  const id = row.dataset.id;
  const sku = row.dataset.sku;

  const name = prompt("Product Name:", row.dataset.name);
  if (name === null) return;

  const supplier = prompt("Supplier:", row.dataset.supplier);
  if (supplier === null) return;

  const category = prompt("Category:", row.dataset.category);
  if (category === null) return;

  const price = prompt("Price:", row.dataset.price);
  if (price === null) return;

  const quantity = prompt("Quantity:", row.dataset.quantity);
  if (quantity === null) return;

  fetch("http://localhost:8080/api/products/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id, sku, name, supplier, category, price, quantity
    })
  })
  .then(() => loadProducts())
  .catch(() => alert("❌ Update failed"));
}


// ================= STOCK =================
function stockIn(sku) {

  const qty = prompt("Enter quantity to ADD:");
  if (!qty || qty <= 0) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));

  fetch("http://localhost:8080/api/products/stock-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sku, qty, role: user.role })
  })
  .then(() => loadProducts())
  .catch(() => alert("❌ Stock-In failed"));
}

function stockOut(sku, currentQty) {

  const qty = prompt("Enter quantity to REMOVE:");
  if (!qty || qty <= 0) return;

  if (qty > currentQty) {
    alert("❌ Not enough stock");
    return;
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));

  fetch("http://localhost:8080/api/products/stock-out", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sku, qty, role: user.role })
  })
  .then(() => loadProducts())
  .catch(() => alert("❌ Stock-Out failed"));
}


