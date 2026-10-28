const STORAGE_KEY = "personalExpenseTrackerTransactions";

const transactionForm = document.getElementById("transactionForm");
const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const clearButton = document.getElementById("clearButton");
const filterTypeInput = document.getElementById("filterType");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("transactionTableBody");
const formMessage = document.getElementById("formMessage");

let transactions = loadTransactions();

function getLocalDateString() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load saved transactions:", error);
    return [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Could not save transactions:", error);
    showMessage("Your browser could not save the data. Check browser storage settings.");
  }
}

function showMessage(message, isSuccess = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", isSuccess);
}

function clearForm() {
  transactionForm.reset();
  dateInput.value = getLocalDateString();
  showMessage("");
  descriptionInput.focus();
}

function updateSummary() {
  const totalIncome = transactions
    .filter(transaction => transaction.type === "Income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalExpenses = transactions
    .filter(transaction => transaction.type === "Expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const balance = totalIncome - totalExpenses;

  document.getElementById("totalIncome").textContent = formatMoney(totalIncome);
  document.getElementById("totalExpenses").textContent = formatMoney(totalExpenses);
  document.getElementById("currentBalance").textContent = formatMoney(balance);
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function renderTransactions() {
  const selectedType = filterTypeInput.value;
  const searchTerm = searchInput.value.trim().toLowerCase();

  const visibleTransactions = transactions.filter(transaction => {
    const matchesType = selectedType === "All" || transaction.type === selectedType;
    const searchableText = `${transaction.description} ${transaction.category} ${transaction.type} ${transaction.date}`.toLowerCase();
    return matchesType && searchableText.includes(searchTerm);
  });

  tableBody.replaceChildren();

  if (visibleTransactions.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = "empty-state";
    cell.textContent = transactions.length === 0
      ? "No transactions yet. Add your first transaction above."
      : "No transactions match your filter or search.";
    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    // Display newest dates first; keep the original transaction list unchanged.
    visibleTransactions
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach(transaction => {
        const row = document.createElement("tr");
        row.appendChild(createCell(formatDate(transaction.date)));
        row.appendChild(createCell(transaction.description));

        const typeCell = document.createElement("td");
        const typePill = document.createElement("span");
        typePill.className = `type-pill ${transaction.type.toLowerCase()}`;
        typePill.textContent = transaction.type;
        typeCell.appendChild(typePill);
        row.appendChild(typeCell);

        row.appendChild(createCell(transaction.category));
        const amountCell = createCell(formatMoney(Number(transaction.amount)),
          `amount-value ${transaction.type === "Income" ? "amount-income" : "amount-expense"}`);
        row.appendChild(amountCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${transaction.description}`);
        deleteButton.addEventListener("click", () => deleteTransaction(transaction.id));
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
      });
  }

  const count = visibleTransactions.length;
  document.getElementById("transactionCount").textContent =
    `${count} transaction${count === 1 ? "" : "s"} shown`;
}

function addTransaction(event) {
  event.preventDefault();

  const type = typeInput.value;
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!type || !description || !category || !date || amountInput.value.trim() === "") {
    showMessage("Please complete all fields.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showMessage("Amount must be a number greater than zero.");
    amountInput.focus();
    return;
  }

  const transaction = {
    id: (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    description,
    amount,
    category,
    date
  };

  transactions.push(transaction);
  saveTransactions();
  updateSummary();
  renderTransactions();
  clearForm();
  alert("Transaction added successfully!");
}

function deleteTransaction(id) {
  const transactionToDelete = transactions.find(transaction => transaction.id === id);
  if (!transactionToDelete) return;

  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
  updateSummary();
  renderTransactions();
  alert("Transaction deleted successfully!");
}

transactionForm.addEventListener("submit", addTransaction);
clearButton.addEventListener("click", clearForm);
filterTypeInput.addEventListener("change", renderTransactions);
searchInput.addEventListener("input", renderTransactions);

dateInput.value = getLocalDateString();
document.getElementById("todayLabel").textContent =
  new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

updateSummary();
renderTransactions();
