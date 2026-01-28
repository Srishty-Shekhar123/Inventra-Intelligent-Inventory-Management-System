
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

  const user = JSON.parse(localStorage.getItem("currentUser")); // 🔑 role check

  fetch("http://localhost:8080/api/products/all")
    .then(res => res.json())
    .then(products => {
      table.innerHTML = "";

      products.forEach(p => {
 // <button onclick="stockOut('${p.sku}', ${p.quantity})">Stock Out</button>
        // ✅ Delete button only for admin
       let actions = `
  <button onclick="stockIn('${p.sku}')">Stock In</button>
 
`;

if (user?.role === "admin") {
  actions = `
    <button onclick="editProduct(this)">Edit</button>
    <button onclick="deleteProduct(${p.id})">Delete</button>
  ` + actions;
}

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
            <td>${p.expiryDate ? p.expiryDate : "-"}</td>

            <td>
             ${actions}
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
    quantity: pqty.value,
    expiryDate: pexpiry.value
  };

  let url = "http://localhost:8080/api/products/add";
  let method = "POST";

  //  EDIT MODE
  if (editingId !== null) {
    product.id = editingId;                 //
    url = "http://localhost:8080/api/products/update";
    method = "PUT";
  }

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(() => {
    pmsg.innerHTML =
      editingId ? "" : "";

    loadProducts();
    resetProductForm();   // ✅ VERY IMPORTANT
  })
  .catch(() => {
    pmsg.innerHTML = "❌ Failed to save product";
  });
});

function openAddModal() {
  document.getElementById("addModal").style.display = "block";
}

function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
}



// ================= DELETE =================
function deleteProduct(id) {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!confirm("Delete this product?")) return;

  fetch(`http://localhost:8080/api/products/delete/${id}?role=${user.role}`, {
    method: "DELETE"
  })
  .then(() => loadProducts())
  .catch(() => alert("Delete failed"));
}


// ================= EDIT =================
// function editProduct(btn) {

//   const row = btn.closest("tr");

//   const id = row.dataset.id;
//   const sku = row.dataset.sku;

//   const name = prompt("Product Name:", row.dataset.name);
//   if (name === null) return;

//   const supplier = prompt("Supplier:", row.dataset.supplier);
//   if (supplier === null) return;

//   const category = prompt("Category:", row.dataset.category);
//   if (category === null) return;

//   const price = prompt("Price:", row.dataset.price);
//   if (price === null) return;

//   const quantity = prompt("Quantity:", row.dataset.quantity);
//   if (quantity === null) return;

let editingId = null;

function editProduct(btn) {

  const row = btn.closest("tr");

  editingId = row.dataset.id;

  document.getElementById("psku").value     = row.dataset.sku;
  document.getElementById("psku").readOnly      = true;
  document.getElementById("pname").value     = row.dataset.name;
  document.getElementById("psupplier").value = row.dataset.supplier;
  document.getElementById("pcat").value      = row.dataset.category;
  document.getElementById("pprice").value    = row.dataset.price;
  document.getElementById("pqty").value      = row.dataset.quantity;
  document.getElementById("pexpiry").value   = row.dataset.expiry || "";

  document.getElementById("addBtn").innerText = "Update Product";
  document.getElementById("productForm").classList.remove("form-hide");
}

  fetch("http://localhost:8080/api/products/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id, sku, name, supplier, category, price, quantity
    })
  })
  .then(() => loadProducts())
  .catch(() => alert("❌ Update failed"));



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
//=================reset=============

function resetProductForm() {

  editingId = null;

  document.getElementById("psku").value = "";
  document.getElementById("pname").value = "";
  document.getElementById("psupplier").value = "";
  document.getElementById("pcat").value = "";
  document.getElementById("pprice").value = "";
  document.getElementById("pqty").value = "";
  document.getElementById("pexpiry").value = "";

  document.getElementById("psku").readOnly = false;
  document.getElementById("addBtn").innerText = "Add Product";

  // Hide form (if using toggle UI)
  const form = document.getElementById("productForm");
 form.classList.remove("form-show");
 form.classList.add("form-hide");
}

window.addEventListener("load", loadAlerts);

function loadAlerts() {

  const table = document.getElementById("stockAlertTable");
  if (!table) return;

  const user = JSON.parse(window.localStorage.getItem("currentUser"));

  fetch("http://localhost:8080/api/alerts")
    .then(res => res.json())
    .then(alerts => {

      table.innerHTML = "";

      alerts.forEach(a => {

        // employee restriction
        if (user.role === "emp" && a.type === "CRITICAL") return;

        const tr = document.createElement("tr");

        // color based on status
        tr.className = a.status === "Unread"
          ? "alert-unread"
          : "alert-read";

        tr.innerHTML = `
          <td>${a.type}</td>
          <td>${a.message}</td>
          <td class="status">${a.status}</td>
        `;

        const actionTd = document.createElement("td");

        if (user.role === "admin" && a.status === "Unread") {
          const btn = document.createElement("button");
          btn.innerText = "Mark Read";

          btn.onclick = () => markRead(a.id, tr, btn);

          actionTd.appendChild(btn);
        } else {
          actionTd.innerText = "-";
        }

        tr.appendChild(actionTd);
        table.appendChild(tr);
      });
    });
    // loadExpiryAlerts();
}

function markRead(id, row, btn) {

  fetch(`http://localhost:8080/api/alerts/read/${id}`, {
    method: "PUT"
  })
  .then(() => {

    // update UI immediately
    row.classList.remove("alert-unread");
    row.classList.add("alert-read");

    row.querySelector(".status").innerText = "Read";

    btn.classList.add("hidden");   // hide button
  })
  .catch(() => alert("Failed to update alert"));
}

// ================= USER MANAGEMENT (ADMIN) =================

// Add user
document.getElementById("addUserBtn")?.addEventListener("click", () => {

  const uname = document.getElementById("uname").value;
  const role  = document.getElementById("urole").value;
  const msg   = document.getElementById("umsg");

  if (!uname || !role) {
    msg.innerHTML = "❌ All fields required";
    return;
  }

  fetch("http://localhost:8080/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: uname,
      role: role
    })
  })
  .then(res => res.text())
  .then(t => {
    msg.innerHTML = "✅ " + t;
    loadUsers();
  })
  .catch(() => msg.innerHTML = "❌ Failed to add user");
});

// Load users
function loadUsers() {

  const table = document.getElementById("utable");
  if (!table) return;

  fetch("http://localhost:8080/api/admin/users")
    .then(res => res.json())
    .then(users => {

      table.innerHTML = "";

      users.forEach(u => {
        table.innerHTML += `
          <tr>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>${u.active ? "Active" : "Blocked"}</td>
            <td>
              <button onclick="toggleUser(${u.id})">
                ${u.active ? "Block" : "Unblock"}
              </button>
            </td>
          </tr>
        `;
      });
    });
}


function toggleProductForm() {

  const form = document.getElementById("productForm");

  // If form is OPEN → this is Cancel
  if (form.classList.contains("form-show")) {
    resetProductForm();      // ✅ full reset + hide
    return;
  }

  // If form is CLOSED → open it
  form.classList.remove("form-hide");
  form.classList.add("form-show");
}



function toggleUser(id) {
  fetch(`http://localhost:8080/api/admin/users/toggle/${id}`, {
    method: "PUT"
  })
  .then(() => loadUsers());
}

// auto load when admin page opens
window.addEventListener("load", loadUsers);

//==========add product

// ================= REPORTS & ANALYTICS (MODULE 4) =================


// function generateReport() {

//   const table = document.getElementById("rtable");
//   if (!table) return;

//   table.innerHTML = "";

//   let names = [];
//   let qtys = [];
//   let ok = 0, low = 0, critical = 0;

//   fetch("http://localhost:8080/api/reports")
//     .then(res => res.json())
//     .then(data => {

//       data.forEach(r => {

//         let color = "green";

//         if (r.status === "LOW") {
//           color = "orange";
//           low++;
//         }
//         else if (r.status === "CRITICAL") {
//           color = "red";
//           critical++;
//         }
//         else {
//           ok++;
//         }

//         // ===== TABLE =====
//         table.innerHTML += `
//           <tr>
//             <td>${r.name}</td>
//             <td>${r.qty}</td>
//             <td style="color:${color}; font-weight:bold;">
//               ${r.status}
//             </td>
//           </tr>
//         `;

//         // ===== GRAPH DATA =====
//         names.push(r.name);
//         qtys.push(r.qty);
//       });

//       // draw graphs AFTER data loaded
//       drawBarChart(names, qtys);
//       drawPieChart(ok, low, critical);
//     })
//     .catch(err => console.error("Report error:", err));
// }


function downloadPdf() {
  window.open("http://localhost:8080/api/reports/pdf", "_blank");
}

/* ===== DEMO REAL DATA (replace with API later) ===== */
const lowStock = 23;
const okStock = 187;
const total = lowStock + okStock;

/* TEXT */
document.getElementById("lowCount").innerText = lowStock;
document.getElementById("okCount").innerText = okStock;

/* CIRCLE ANGLES */
const okAngle = (okStock / total) * 360;
const warnAngle = okAngle + (lowStock / total) * 360;

document.querySelector(".status-circle").style.setProperty("--ok", okAngle + "deg");
document.querySelector(".status-circle").style.setProperty("--warn", warnAngle + "deg");


function loadExpiryAlerts() {

  fetch("http://localhost:8080/api/alerts/expiry")
    .then(res => res.json())
    .then(alerts => {

      const table = document.getElementById("expiryAlertTable");
      if (!table) return;

      table.innerHTML = "";

      alerts.forEach(msg => {

        let color = msg.includes("EXPIRED") ? "red" : "orange";

        table.innerHTML += `
          <tr>
            <td>EXPIRY</td>
            <td style="color:${color}; font-weight:bold;">
              ${msg}
            </td>
            <td>Unread</td>
            <td>-</td>
          </tr>
        `;
      });
    });
}

function loadExpirySummary() {

  fetch("http://localhost:8080/api/alerts/expiry/summary")
    .then(res => res.json())
    .then(data => {

      document.getElementById("expiringCount").innerText = data.expiring;
      document.getElementById("expiredCount").innerText = data.expired;

    })
    .catch(err => console.error("Expiry summary error", err));
}

window.addEventListener("load", () => {
  // loadDashboardSummary();   // existing
  loadExpirySummary();     // ✅ NEW
});

window.addEventListener("load", () => {
  loadDashboardSummary();   // existing
  loadExpirySummary();     // ✅ NEW
});

function loadExpiryAck() {

  fetch("http://localhost:8080/api/alerts/expiry/ack")
    .then(res => res.json())
    .then(data => {

      const msgEl = document.getElementById("expiryMsg");
      if (!msgEl) return;

      // reset text
      msgEl.className = "";

      if (data.expired > 0) {
        msgEl.innerText = `❌ ${data.expired} product(s) EXPIRED`;
        msgEl.classList.add("critical");
      }
      else if (data.expiring > 0) {
        msgEl.innerText = `⚠️ ${data.expiring} product(s) expiring soon`;
        msgEl.classList.add("warning");
      }
      else {
        msgEl.innerText = "✅ No expiry alerts";
        msgEl.classList.add("ok");
      }
    })
    .catch(() => {
      document.getElementById("expiryMsg").innerText =
        "⚠️ Unable to load expiry alerts";
    });
}

function loadTransactions() {

  console.log("🔥 loadTransactions() called");

  const table = document.getElementById("transactionTable");

  if (!table) {
    console.error("❌ transactionTable not found");
    return;
  }

  fetch("http://localhost:8080/api/transactions")
    .then(res => {
      if (!res.ok) {
        throw new Error("API error: " + res.status);
      }
      return res.json();
    })
    .then(data => {

      console.log("📦 Transactions data:", data);

      table.innerHTML = "";

      if (!data || data.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="6">No transaction history available</td>
          </tr>
        `;
        return;
      }

      data.forEach(t => {

        table.innerHTML += `
          <tr>
            <td>${t.createdAt || t.dateTime || "-"}</td>
            <td>${t.sku || "-"}</td>
            <td>${t.productName || "-"}</td>
            <td>${t.action || "-"}</td>
            <td>${t.quantity ?? "-"}</td>
            <td>${t.performedBy || "-"}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error("❌ Transaction load error:", err);
      table.innerHTML = `
        <tr>
          <td colspan="6">Failed to load transactions</td>
        </tr>
      `;
    });
}

function showSection(id, event) {

  document.querySelectorAll('.section')
    .forEach(s => s.classList.remove('active'));

  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.nav-btn')
    .forEach(b => b.classList.remove('active'));

  if (event) {
    event.target.classList.add('active');
  }

  // 🔹 Load users when user section opens
  if (id === "userSection" && typeof loadUsers === "function") {
    loadUsers();
  }

  // 🔹 Load transactions when transaction section opens
  if (id === "transactionSection" && typeof loadTransactions === "function") {
    loadTransactions();
  }

  if (id === "fifoSection") {
  loadFifoStock();
}

}

function loadFifoStock() {

  const table = document.getElementById("fifoTable");
  if (!table) return;

  fetch("http://localhost:8080/api/products/fifo")
    .then(res => res.json())
    .then(products => {

      table.innerHTML = "";

      if (products.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="6">No stock available</td>
          </tr>
        `;
        return;
      }

      // FIFO control per product name
      const firstSkuByProduct = {};

      products.forEach(p => {
        if (!firstSkuByProduct[p.name]) {
          firstSkuByProduct[p.name] = p.sku;
        }
      });

      products.forEach(p => {

        const daysLeft =
          p.expiryDate
            ? Math.ceil(
                (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
              )
            : "-";

        // 🔹 Expired check
        const isExpired = daysLeft !== "-" && daysLeft < 0;

        // 🔹 FIFO disable check
        const disabled =
          firstSkuByProduct[p.name] !== p.sku ? "disabled" : "";

        // 🔹 Action column logic
        let actionHtml = "";

        if (isExpired) {
          actionHtml = `<span class="expired-text">Expired</span>`;
        } else {
          actionHtml = `
            <button ${disabled}
              onclick="fifoStockOut('${p.sku}', ${p.quantity})">
              Stock Out
            </button>
          `;
        }

        table.innerHTML += `
          <tr>
            <td>${p.name}</td>
            <td>${p.sku}</td>
            <td>${p.expiryDate || "-"}</td>
            <td>${daysLeft}</td>
            <td>${p.quantity}</td>
            <td>${actionHtml}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error("FIFO load error:", err);
      table.innerHTML = `
        <tr>
          <td colspan="6">Failed to load FIFO stock</td>
        </tr>
      `;
    });
}
function fifoStockOut(sku, currentQty) {

  const qty = prompt("Enter quantity to remove:");
  if (!qty || qty <= 0) return;

  if (qty > currentQty) {
    alert("❌ Not enough stock");
    return;
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));

  fetch("http://localhost:8080/api/products/stock-out", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sku: sku,
      qty: qty,
      role: user.role
    })
  })
  .then(res => {
    if (!res.ok) throw new Error();
    loadFifoStock();     // refresh FIFO
    loadProducts();      // refresh product list
  })
  .catch(() => alert("❌ Stock out failed"));
}
// ================= SHOW LOGGED-IN USER EMAIL =================
// ================= SHOW LOGGED-IN USER EMAIL =================
// ===== SHOW LOGGED-IN USER EMAIL ON DASHBOARD =====


//===== DASHBOARD SUMMARY =====
// function loadHomeStats() {

//   fetch("http://localhost:8080/api/dashboard/summary")
//     .then(res => res.json())
//     .then(data => {
// console.log("Dashboard data:", data);

//       let total = data.total;
//       let available = data.available;
//       let low = data.low;
//       let critical = data.critical;

//       // 🔹 Update dashboard cards
//       document.getElementById("totalCount").innerText = total;
//       document.getElementById("availableCount").innerText = available;
//       document.getElementById("lowStockCount").innerText = low;
//       document.getElementById("criticalCount").innerText = critical;
//     })
//     .catch(err => console.error("Home stats error:", err));
// }

// window.addEventListener("load", loadHomeStats);
// document.addEventListener("DOMContentLoaded", () => {
//   loadHomeStats();
// });

// if (section === "home") {
//   document.getElementById("homeSection").style.display = "block";
//   loadHomeStats(); // 👈 REAL DATA LOAD
// }










