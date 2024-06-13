// Select elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clearButton = document.getElementById('clear');
const equalsButton = document.getElementById('equals');
const toggleSignButton = document.getElementById('toggle-sign');
const backspaceButton = document.getElementById('backspace');

// Event listeners for button clicks
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === '=') {
      calculate();
    } else if (value === 'C') {
      clearDisplay();
    } else if (value === '±') {
      toggleSign();
    } else if (value === '←') {
      backspace();
    } else {
      addToDisplay(value);
    }
  });
});

// Event listener for keyboard input
document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Handle numeric and operator keys
  if (!isNaN(key) || '+-*/.'.includes(key)) {
    addToDisplay(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});

// Function to add content to display
function addToDisplay(value) {
  display.textContent += value;
}

// Function to clear the display
function clearDisplay() {
  display.textContent = '';
}

// Function to toggle sign of displayed number
function toggleSign() {
  const currentValue = parseFloat(display.textContent);
  if (!isNaN(currentValue)) {
    display.textContent = currentValue * -1;
  }
}

// Function to perform backspace
function backspace() {
  display.textContent = display.textContent.slice(0, -1);
}

// Function to perform calculation
function calculate() {
  try {
    const result = eval(display.textContent);
    display.textContent = result;
  } catch (error) {
    display.textContent = 'Error';
  }
}
