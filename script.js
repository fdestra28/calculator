// Selecting elements from the DOM
const display = document.getElementById('display'); // The main display area
const buttons = document.querySelectorAll('.btn'); // All calculator buttons
const darkModeToggle = document.getElementById('dark-mode-toggle'); // Dark mode toggle button
const typingElement = document.querySelector('.typing'); // Element for typing animation
const text = typingElement.textContent; // Text content for typing animation

// Initializing variables for calculator logic
let expression = ''; // Current expression being built
let isOpenParenthesisNext = true; // Tracks if the next parenthesis should be open
let resultDisplayed = false; // Tracks if a result is currently displayed
let index = 0; // Index for typing animation

// Event listeners for calculator buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // Determine action based on button value
    if (value === 'C') {
      clearDisplay();
    } else if (value === '=') {
      calculate();
    } else if (['+', '-', '*', '/'].includes(value)) {
      appendOperator(value);
    } else if (value === '()') {
      appendParenthesis();
    } else if (value === '←') {
      deleteLastCharacter();
    } else if (value === '±') {
      toggleSign();
    } else {
      appendNumber(value);
    }
  });
});

// Event listener for keyboard input
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (!isNaN(key) || '+-*/.'.includes(key)) {
    appendNumber(key);
  } else if (key === 'Enter') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    event.preventDefault();
    deleteLastCharacter();
  } else if (key === 'Escape') {
    clearDisplay();
  } else if (key === '(') {
    appendParenthesis('(');
  } else if (key === ')') {
    appendParenthesis(')');
  }
});

// Event listener for dark mode toggle button
darkModeToggle.addEventListener('click', () => {
  // Toggle dark mode class on body
  document.body.classList.toggle('dark-mode');
  // Change toggle button icon based on dark mode state
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  // Adjust text color in typing animation based on dark mode
  typingElement.style.color = document.body.classList.contains('dark-mode') ? '#f0f0f0' : '#666';
});

// Function to clear the display
function clearDisplay() {
  expression = '';
  isOpenParenthesisNext = true;
  resultDisplayed = false;
  updateDisplay('');
}

// Function to evaluate and display the result of the expression
function calculate() {
  try {
    const result = eval(expression.replace(/,/g, '')).toLocaleString();
    updateDisplay(`${expression} = ${result}`);
    expression = result; // Store result for potential further calculations
    resultDisplayed = true;
  } catch (error) {
    updateDisplay('Error'); // Display error if calculation fails
    expression = ''; // Clear expression on error
  }
}

// Function to append an operator (+, -, *, /) to the expression
function appendOperator(op) {
  if (resultDisplayed) {
    expression = ''; // Clear expression if result was just displayed
    resultDisplayed = false;
  }
  expression += ` ${op} `; // Append operator to expression
  updateDisplay(expression); // Update display with new expression
}

// Function to append a number or decimal to the expression
function appendNumber(num) {
  if (resultDisplayed) {
    expression = ''; // Clear expression if result was just displayed
    resultDisplayed = false;
  }
  if (num === '.' && expression.slice(-1) === '.') return; // Prevent consecutive decimals
  expression += num; // Append number or decimal to expression
  updateDisplay(formatExpression(expression)); // Update display with formatted expression
}

// Function to append parentheses () to the expression
function appendParenthesis() {
  if (resultDisplayed) {
    expression = ''; // Clear expression if result was just displayed
    resultDisplayed = false;
  }
  expression += isOpenParenthesisNext ? '(' : ')'; // Toggle open/close parentheses
  isOpenParenthesisNext = !isOpenParenthesisNext; // Invert flag for next parenthesis
  updateDisplay(expression); // Update display with new expression
}

// Function to delete the last character from the expression
function deleteLastCharacter() {
  expression = expression.slice(0, -1); // Remove last character from expression
  updateDisplay(expression); // Update display with new expression
}

// Function to toggle the sign of the last number in the expression
function toggleSign() {
  const parts = expression.split(' '); // Split expression into parts
  const lastPart = parts.pop(); // Remove and retrieve last part
  if (lastPart) {
    if (lastPart.startsWith('-')) {
      parts.push(lastPart.slice(1)); // Remove negative sign if already present
    } else {
      parts.push('-' + lastPart); // Add negative sign if not present
    }
    expression = parts.join(' '); // Reconstruct expression with toggled sign
    updateDisplay(expression); // Update display with new expression
  }
}

// Function to format the expression with commas for readability
function formatExpression(exp) {
  return exp.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Regex to add commas every 3 digits
}

// Function to update the display with the given value, handling multiline display
function updateDisplay(value) {
  const maxLength = 14; // Maximum characters per line
  const lines = [];
  let line = '';

  for (let i = 0; i < value.length; i++) {
    if (line.length >= maxLength && value[i] !== ' ') {
      lines.push(line.trim()); // Push current line to lines array
      line = ''; // Reset line for new line
    }
    line += value[i]; // Append character to current line
  }

  if (line.length > 0) {
    lines.push(line.trim()); // Push any remaining characters as last line
  }

  display.textContent = lines.join('\n'); // Update display with joined lines
}

// Typing animation for the "Made By Fajar Destrada" text
function type() {
  if (index >= text.length) {
    index = 0; // Reset index to loop animation
  }
  typingElement.textContent = text.substring(0, index + 1); // Update text content
  index++; // Increment index for next character
  setTimeout(type, 200); // Schedule next character after delay
}

// Start typing animation when page loads
type();

// Initialize dark mode based on user preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (prefersDarkScheme.matches) {
  document.body.classList.add('dark-mode'); // Apply dark mode class to body
  darkModeToggle.textContent = '☀️'; // Set sun icon for dark mode toggle
  typingElement.style.color = '#f0f0f0'; // Set light text color for typing animation
}
