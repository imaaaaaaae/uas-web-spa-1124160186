// ========== Element Referensi ==========
const els = {
  toggleBtn: document.getElementById("darkModeToggle"),
  html: document.documentElement,
  form: document.getElementById("paymentForm"),
  productSelect: document.getElementById("productSelect"),
  quantity: document.getElementById("quantity"),
  promoInput: document.getElementById("promoCode"),
  applyPromoBtn: document.getElementById("applyPromoBtn"),
  promoMessage: document.getElementById("promoMessage"),
  subtotal: document.getElementById("subtotal"),
  discountRow: document.getElementById("discountRow"),
  discount: document.getElementById("discount"),
  totalAmount: document.getElementById("totalAmount"),
  transactionList: document.getElementById("transactionList"),
  emptyState: document.getElementById("emptyState"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  totalTransactions: document.getElementById("totalTransactions"),
  totalRevenue: document.getElementById("totalRevenue"),
  avgTransaction: document.getElementById("avgTransaction"),
  transactionTemplate: document.getElementById("transactionTemplate"),
  submitBtn: document.getElementById("submitBtn"),
  successModal: document.getElementById("successModal"),
  closeSuccessModal: document.getElementById("closeSuccessModal"),
  progressBar: document.getElementById("progressBar"),
  printInvoiceBtn: document.getElementById("printInvoiceBtn"),
  detail: {
    name: document.getElementById("detailName"),
    product: document.getElementById("detailProduct"),
    qty: document.getElementById("detailQty"),
    method: document.getElementById("detailMethod"),
    total: document.getElementById("detailTotal"),
    time: document.getElementById("detailTime")
  }
};

// ========== Audio Notifikasi ==========
const audioSuccess = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_9ff8b75a89.mp3");

// ========== Promo Code ==========
let promoDiscount = 0;
const PROMO_CODES = {
  "Poduk": 0.1,
  "Skincare Kecantikan": 0.2
};

// ========== Utilitas ==========
function formatRupiah(number) {
  return `Rp ${number.toLocaleString("id-ID")}`;
}

// ========== Toggle Dark Mode ==========
els.toggleBtn?.addEventListener("click", () => {
  els.html.classList.toggle("dark");
});

// ========== Hitung Total ==========
function updateTotal() {
  const selected = els.productSelect.options[els.productSelect.selectedIndex];
  const price = parseInt(selected.dataset.price || 0);
  const qty = parseInt(els.quantity.value || 1);
  const subtotal = price * qty;
  const discount = subtotal * promoDiscount;
  const total = subtotal - discount;

  els.subtotal.textContent = formatRupiah(subtotal);
  els.discount.textContent = formatRupiah(discount);
  els.totalAmount.textContent = formatRupiah(total);
  els.discountRow.classList.toggle("hidden", promoDiscount === 0);

  return { subtotal, discount, total };
}

// ========== Validasi Form ==========
function validateFormFields() {
  const name = els.form.customerName.value.trim();
  const email = els.form.customerEmail.value.trim();
  const product = els.productSelect.value;
  const qty = parseInt(els.quantity.value || 0);
  const method = els.form.paymentMethod.value;
  const isValid = name && email.includes("@") && product && qty > 0 && method;

  if (els.submitBtn) {
    els.submitBtn.disabled = !isValid;
    els.submitBtn.classList.toggle("opacity-50", !isValid);
    els.submitBtn.classList.toggle("cursor-not-allowed", !isValid);
  }
}

// ========== Event Listener ==========
function setupEventListeners() {
  els.productSelect.addEventListener("change", () => {
    updateTotal();
    validateFormFields();
  });

  els.quantity.addEventListener("input", () => {
    updateTotal();
    validateFormFields();
  });

  els.form.customerName.addEventListener("input", validateFormFields);
  els.form.customerEmail.addEventListener("input", validateFormFields);

  document.querySelectorAll('input[name="paymentMethod"]').forEach(el =>
    el.addEventListener("change", validateFormFields)
  );

  els.applyPromoBtn.addEventListener("click", () => {
    const code = els.promoInput.value.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      promoDiscount = PROMO_CODES[code];
      els.promoMessage.className = "mt-2 text-sm text-green-600";
      els.promoMessage.textContent = `Kode promo berhasil! (-${promoDiscount * 100}%)`;
    } else {
      promoDiscount = 0;
      els.promoMessage.className = "mt-2 text-sm text-red-600";
      els.promoMessage.textContent = "Kode promo tidak valid.";
    }
    els.promoMessage.classList.remove("hidden");
    updateTotal();
    validateFormFields();
  });

  els.form.addEventListener("submit", handleSubmit);

  els.closeSuccessModal?.addEventListener("click", () => {
    els.successModal.classList.add("hidden");
  });

  els.clearHistoryBtn?.addEventListener("click", () => {
    localStorage.removeItem("transactions");
    renderTransactions();
  });

  els.printInvoiceBtn?.addEventListener("click", () => {
    window.print();
  });
}

// ========== Submit Form ==========
function handleSubmit(e) {
  e.preventDefault();

  const name = els.form.customerName.value.trim();
  const email = els.form.customerEmail.value.trim();
  const qty = parseInt(els.quantity.value);
  const productText = els.productSelect.options[els.productSelect.selectedIndex].text;
  const paymentMethod = els.form.paymentMethod.value;
  const { total } = updateTotal();
  const timestamp = new Date().toLocaleString("id-ID");

  const transaction = { name, email, productText, qty, paymentMethod, total, timestamp };
  saveTransaction(transaction);
  renderTransactions();

  showProgress(() => {
    showSuccessModal(transaction);
    audioSuccess.play();
  });

  els.form.reset();
  promoDiscount = 0;
  els.promoMessage.classList.add("hidden");
  updateTotal();
  validateFormFields();
}

// ========== Simpan & Tampilkan Transaksi ==========
function saveTransaction(data) {
  const list = JSON.parse(localStorage.getItem("transactions") || "[]");
  list.push(data);
  localStorage.setItem("transactions", JSON.stringify(list));
}

function renderTransactions() {
  const list = JSON.parse(localStorage.getItem("transactions") || "[]");
  els.transactionList.innerHTML = "";

  if (list.length === 0) {
    els.emptyState.classList.remove("hidden");
    els.clearHistoryBtn?.classList.add("hidden");
    els.totalTransactions.textContent = 0;
    els.totalRevenue.textContent = "Rp 0";
    els.avgTransaction.textContent = "Rp 0";
    return;
  }

  els.emptyState.classList.add("hidden");
  els.clearHistoryBtn?.classList.remove("hidden");

  let totalRevenue = 0;

  list.slice().reverse().forEach(t => {
    const clone = els.transactionTemplate.content.cloneNode(true);
    clone.querySelector(".transaction-customer").textContent = t.name;
    clone.querySelector(".transaction-product").textContent = `${t.productText} x ${t.qty}`;
    clone.querySelector(".transaction-amount").textContent = formatRupiah(t.total);
    clone.querySelector(".transaction-time").textContent = t.timestamp;
    clone.querySelector(".transaction-method").textContent = t.paymentMethod;
    els.transactionList.appendChild(clone);
    totalRevenue += t.total;
  });

  els.totalTransactions.textContent = list.length;
  els.totalRevenue.textContent = formatRupiah(totalRevenue);
  els.avgTransaction.textContent = formatRupiah(Math.round(totalRevenue / list.length));
}

// ========== Modal Sukses ==========
function showSuccessModal(t) {
  els.detail.name.textContent = t.name;
  els.detail.product.textContent = t.productText;
  els.detail.qty.textContent = t.qty;
  els.detail.method.textContent = t.paymentMethod;
  els.detail.total.textContent = formatRupiah(t.total);
  els.detail.time.textContent = t.timestamp;
  els.successModal.classList.remove("hidden");
}

// ========== Simulasi Progress ==========
function showProgress(callback) {
  if (!els.progressBar) return callback();

  els.progressBar.classList.remove("hidden");
  els.progressBar.value = 0;

  let val = 0;
  const interval = setInterval(() => {
    val += 10;
    els.progressBar.value = val;
    if (val >= 100) {
      clearInterval(interval);
      els.progressBar.classList.add("hidden");
      callback();
    }
  }, 50);
}

// ========== Init ==========
function init() {
  setupEventListeners();
  renderTransactions();
  updateTotal();
  validateFormFields();
}

init();