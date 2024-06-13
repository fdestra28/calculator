const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let expression = '';
let isOpenParenthesisNext = true;  // Track if the next parenthesis should be open
let resultDisplayed = false;

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
  display.textContent = value;
}
