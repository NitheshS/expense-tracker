let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateTotal() {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  document.getElementById("total").innerText = total.toFixed(2);
}

function renderExpenses() {
  const list = document.getElementById("expenses-list");
  list.innerHTML = "";
  expenses.forEach((expense, index) => {
    const div = document.createElement("div");
    div.className = "expense-item";
    div.innerHTML = `
      <strong>${expense.title}</strong> - ₹${expense.amount} <br>
      <small>${expense.date}</small>
      <button onclick="deleteExpense(${index})">X</button>
    `;
    list.appendChild(div);
  });
  updateTotal();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

document
  .getElementById("expense-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const date = document.getElementById("date").value;

    if (!title || !amount || !date) return;

    expenses.push({ title, amount, date });
    saveExpenses();
    renderExpenses();
    this.reset();
  });

renderExpenses();
