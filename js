const inps = document.querySelectorAll('#inputs input');
const circles = document.querySelectorAll(".circle");
const errorElement = document.querySelector("#error");
const progressBar = document.querySelector("#progress");
const messageParagraph = document.querySelector('#message');

function saveState() {
  inps.forEach((inp, index) => localStorage.setItem(`input_${index}`, inp.value.trim()));
  circles.forEach((circle, index) => localStorage.setItem(`circle_${index}`, circle.classList.contains('active')));
}

function loadState() {
  inps.forEach((inp, index) => {
    const savedValue = localStorage.getItem(`input_${index}`);
    if (savedValue) inp.value = savedValue;
  });
  circles.forEach((circle, index) => {
    if (localStorage.getItem(`circle_${index}`) === 'true') {
      activateCircle(circle, index);
    }
  });
}

function updateProgressBar() {
  const completedGoals = [...circles].filter(circle => circle.classList.contains('active')).length;
  const totalGoals = circles.length;
  progressBar.style.width = `${(completedGoals / totalGoals) * 100}%`;
  progressBar.textContent = completedGoals > 0 ? `${completedGoals}/${totalGoals} completed` : '';
  updateMessage(completedGoals);
}

function updateMessage(completedGoals) {
  const messages = {
    0: "Raise the bar by completing your goals!",
    1: "Well begun is half done!",
    2: "Just a step away, keep going!",
    3: "Whoa! You just completed all the goals, time for chill :D"
  };
  messageParagraph.textContent = messages[completedGoals] || messages[0];
}

function activateCircle(circle, index) {
  circle.classList.add('active');
  circle.querySelector("i").style.visibility = 'visible';
  inps[index].style.color = '#48A300';
  inps[index].style.textDecoration = 'line-through';
}

function deactivateCircle(circle, index) {
  circle.classList.remove('active');
  circle.querySelector("i").style.visibility = 'hidden';
  inps[index].style.color = '';
  inps[index].style.textDecoration = '';
}

function handleCircleClick(circle, index) {
  if (areAllInputsFilled()) {
    circle.classList.contains('active') ? deactivateCircle(circle, index) : activateCircle(circle, index);
    updateProgressBar();
    saveState();
    clearError();
  } else {
    showError("Please set all 3 goals before clicking on a circle.");
  }
}

function areAllInputsFilled() {
  return [...inps].every(inp => inp.value.trim() !== '');
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.style.color = '#FFA07A';
}

function clearError() {
  errorElement.textContent = "";
}

function handleInput() {
  if (areAllInputsFilled()) {
    clearError();
    saveState();
  }
}

function initializeEventListeners() {
  circles.forEach((circle, index) => circle.addEventListener("click", () => handleCircleClick(circle, index)));
  inps.forEach(input => input.addEventListener("input", handleInput));
}

function initialize() {
  loadState();
  updateProgressBar();
  initializeEventListeners();
}

window.onload = initialize;
