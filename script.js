
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Save expenses to localStorage
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update total expense display
function updateTotal() {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  document.getElementById("total").innerText = total.toFixed(2);
}

// Render expenses list with filters and categories
function renderExpenses(filteredExpenses) {
  const list = document.getElementById("expenses-list");
  list.innerHTML = "";
  (filteredExpenses || expenses).forEach((expense, index) => {
    const div = document.createElement("div");
    div.className = "expense-item";
    const formattedDate = new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    div.innerHTML = `
      <div class="info">
        <strong>${expense.title}</strong>
        <span class="category">${expense.category}</span>
        <div class="date">${formattedDate}</div>
      </div>
      <div>
        <span>₹${parseFloat(expense.amount).toFixed(2)}</span>
        <button data-index="${index}">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
  updateTotal();
  updateChart(filteredExpenses || expenses);
}

// Delete expense
document.getElementById("expenses-list").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const index = parseInt(e.target.getAttribute("data-index"));
    expenses.splice(index, 1);
    saveExpenses();
    renderExpenses();
  }
});

// Filter expenses
function filterExpenses() {
  const categoryFilter = document.getElementById("filter-category").value;
  const monthFilter = document.getElementById("filter-date").value;

  let filtered = [...expenses];

  if (categoryFilter !== "all") {
    filtered = filtered.filter(exp => exp.category === categoryFilter);
  }

  if (monthFilter) {
    filtered = filtered.filter(exp => exp.date.startsWith(monthFilter));
  }

  renderExpenses(filtered);
}

// Clear filters
document.getElementById("clear-filters").addEventListener("click", () => {
  document.getElementById("filter-category").value = "all";
  document.getElementById("filter-date").value = "";
  renderExpenses();
});

// Form submission
document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const amount = parseFloat(document.getElementById("amount").value.trim());
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  if (!title || isNaN(amount) || amount <= 0 || !date || !category) {
    alert("Please fill out all fields with valid values.");
    return;
  }

  expenses.push({ title, amount, date, category });
  saveExpenses();
  renderExpenses();
  this.reset();
});

// Chart.js integration
let expenseChart = null;

function updateChart(expensesToShow) {
  const ctx = document.getElementById('expense-chart').getContext('2d');

  // Aggregate expenses by category
  const categoryTotals = expensesToShow.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (expenseChart) {
    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
  } else {
    expenseChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#28a745',
            '#dc3545',
            '#ffc107',
            '#007bff',
            '#6f42c1',
            '#fd7e14'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}

// Initial render
renderExpenses();

// Filter listeners
document.getElementById('filter-category').addEventListener('change', filterExpenses);
document.getElementById('filter-date').addEventListener('change', filterExpenses);
