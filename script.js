const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const typingElement = document.querySelector('.typing');
const text = typingElement.textContent;
let expression = '';
let isOpenParenthesisNext = true;  // Track if the next parenthesis should be open
let resultDisplayed = false;
let index = 0;

// Add event listeners to buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

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

// Add event listener for keyboard input
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

// Add event listener for dark mode toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Change the icon based on the mode
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

// Function to calculate the expression
function calculate() {
  try {
    const result = eval(expression.replace(/,/g, '')).toLocaleString();
    updateDisplay(`${expression} = ${result}`);
    expression = result;
    resultDisplayed = true;
  } catch (error) {
    updateDisplay('Error');
    expression = '';
  }
}

// Function to append an operator
function appendOperator(op) {
  if (resultDisplayed) {
    expression = '';
    resultDisplayed = false;
  }
  expression += ` ${op} `;
  updateDisplay(expression);
}

// Function to append a number or decimal
function appendNumber(num) {
  if (resultDisplayed) {
    expression = '';
    resultDisplayed = false;
  }
  if (num === '.' && expression.slice(-1) === '.') return;
  expression += num;
  updateDisplay(formatExpression(expression));
}

// Function to append parentheses
function appendParenthesis() {
  if (resultDisplayed) {
    expression = '';
    resultDisplayed = false;
  }
  expression += isOpenParenthesisNext ? '(' : ')';
  isOpenParenthesisNext = !isOpenParenthesisNext;
  updateDisplay(expression);
}

// Function to delete the last character
function deleteLastCharacter() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
}

// Function to toggle the sign of the last number
function toggleSign() {
  const parts = expression.split(' ');
  const lastPart = parts.pop();
  if (lastPart) {
    if (lastPart.startsWith('-')) {
      parts.push(lastPart.slice(1));
    } else {
      parts.push('-' + lastPart);
    }
    expression = parts.join(' ');
    updateDisplay(expression);
  }
}

// Function to format the expression with commas
function formatExpression(exp) {
  return exp.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Function to update the display
function updateDisplay(value) {
  // Split value into lines of at most 14 characters
  const maxLength = 14;
  const lines = [];
  let line = '';

  for (let i = 0; i < value.length; i++) {
    if (line.length >= maxLength && value[i] !== ' ') {
      lines.push(line.trim());
      line = '';
    }
    line += value[i];
  }

  if (line.length > 0) {
    lines.push(line.trim());
  }

  display.textContent = lines.join('\n');
}

// Typing animation for the "Made By Fajar Destrada" text
function type() {
  if (index >= text.length) {
    index = 0; // Reset index to loop animation
  }
  typingElement.textContent = text.substring(0, index + 1);
  index++;
  setTimeout(type, 200);
}

// Start typing animation
type();

// Initialize dark mode based on user preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (prefersDarkScheme.matches) {
  document.body.classList.add('dark-mode');
  darkModeToggle.textContent = '☀️';
  typingElement.style.color = '#f0f0f0';
}
