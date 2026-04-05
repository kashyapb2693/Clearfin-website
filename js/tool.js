/**
 * ClearFin Rewards Optimizer Tool Logic
 */

let selectedCategories = [];
let categorySpend = {};

// Default estimate mapping for categories
const defaultSpends = {
  'Groceries': 600,
  'Gas': 200,
  'Travel': 300,
  'Dining': 400,
  'Subscriptions': 50,
  'Shopping': 300
};

// Toggle Category in Step 1
function toggleCategory(element, categoryName) {
  element.classList.toggle('selected');
  
  if (selectedCategories.includes(categoryName)) {
    selectedCategories = selectedCategories.filter(c => c !== categoryName);
  } else {
    selectedCategories.push(categoryName);
  }
}

// Multi-step Navigation
function nextStep(stepNumber) {
  if (stepNumber === 2) {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category to continue.");
      return;
    }
    populateStep2();
  }
  
  if (stepNumber === 3) {
    calculateResults();
  }
  
  showStep(stepNumber);
}

function prevStep(stepNumber) {
  showStep(stepNumber);
}

function showStep(stepNumber) {
  // Hide all
  document.querySelectorAll('.tool-step').forEach(el => el.classList.remove('active'));
  
  // Show target
  document.getElementById(`step-${stepNumber}`).classList.add('active');
  
  // Update indicator dots
  document.querySelectorAll('.step-dot').forEach((dot, index) => {
    if (index + 1 <= stepNumber) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Populate Step 2 Inputs Dynamically
function populateStep2() {
  const container = document.getElementById('spendInputsContainer');
  container.innerHTML = ''; // clear 
  
  selectedCategories.forEach(cat => {
    // Initial assignment
    if (!categorySpend[cat]) {
      categorySpend[cat] = defaultSpends[cat] || 200;
    }
    
    // Create DOM row
    const row = document.createElement('div');
    row.className = 'spend-row fade-up visible'; // visible avoids stagger delay inside local flow
    
    row.innerHTML = `
      <div class="spend-label">${cat}</div>
      <input type="range" class="spend-slider" min="0" max="3000" step="50" value="${categorySpend[cat]}" 
             oninput="updateSpend('${cat}', this.value)">
      <div class="spend-amount">$<span id="val-${cat}">${categorySpend[cat]}</span></div>
    `;
    
    container.appendChild(row);
  });
  
  updateTotal();
}

// Update specific spend handler
function updateSpend(category, value) {
  categorySpend[category] = parseInt(value, 10);
  document.getElementById(`val-${category}`).innerText = value;
  updateTotal();
}

// Update Total Counter
function updateTotal() {
  const total = Object.values(categorySpend).reduce((acc, curr) => acc + curr, 0);
  document.getElementById('totalSpendCounter').innerText = total.toLocaleString();
}

// Calculate logic for Final Result (Step 3)
function calculateResults() {
  const headline = document.getElementById('resultHeadline');
  const resultCard = document.getElementById('resultCard');
  resultCard.style.display = 'none';
  
  // Reset texts
  headline.innerText = "Analyzing Canadian card landscape...";
  headline.style.opacity = '1';
  
  // Fake "thinking" delay for premium UX
  setTimeout(() => {
    headline.innerText = "Mapping your spending vector...";
  }, 800);
  
  setTimeout(() => {
    headline.innerText = "Finding your wallet winner.";
  }, 1600);
  
  setTimeout(() => {
    // Show results
    headline.innerText = "Here is your maximum potential.";
    resultCard.style.display = 'block';
    
    // Total yearly estimate simple math (e.g., avg 3% across selected)
    const monthlyTotal = Object.values(categorySpend).reduce((acc, curr) => acc + curr, 0);
    const yearlyTotal = monthlyTotal * 12;
    const estimatedCashback = Math.floor(yearlyTotal * 0.035); // 3.5% avg optimized return
    
    animateValue('finalValue', 0, estimatedCashback, 1500);
  }, 2400);
}

// Smooth Number Counter Animation
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // ease out quad
    const easeOutStr = progress * (2 - progress);
    
    obj.innerHTML = Math.floor(easeOutStr * (end - start) + start).toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
