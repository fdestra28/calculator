const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let expression = '';
let isOpenParenthesisNext = true;
let resultDisplayed = false;

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
    } else {
      appendNumber(value);
    }
  });
});

function clearDisplay() {
  expression = '';
  isOpenParenthesisNext = true;
  resultDisplayed = false;
  updateDisplay('');
}

function calculate() {
  try {
    // Evaluate the expression and format the result
    const result = eval(expression.replace(/,/g, '')).toLocaleString();
    updateDisplay(`${expression} = ${result}`);
    expression = result;  // Set result as new expression for further calculations
    resultDisplayed = true;
  } catch (error) {
    updateDisplay('Error');
    expression = '';
  }
}

function appendOperator(op) {
  if (resultDisplayed) {
    expression = '';  // Reset expression if a new calculation starts after result is displayed
    resultDisplayed = false;
  }
  expression += ` ${op} `;
  updateDisplay(expression);
}

function appendNumber(num) {
  if (resultDisplayed) {
    expression = '';  // Reset expression if a new calculation starts after result is displayed
    resultDisplayed = false;
  }
  if (num === '.' && expression.slice(-1) === '.') return;  // Prevent multiple decimals in a row
  expression += num;
  updateDisplay(formatExpression(expression));
}

function appendParenthesis() {
  if (resultDisplayed) {
    expression = '';  // Reset expression if a new calculation starts after result is displayed
    resultDisplayed = false;
  }
  expression += isOpenParenthesisNext ? '(' : ')';
  isOpenParenthesisNext = !isOpenParenthesisNext;
  updateDisplay(expression);
}

function deleteLastCharacter() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
}

function formatExpression(exp) {
  return exp.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function updateDisplay(value) {
  display.textContent = value;
}
