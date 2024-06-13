const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';
let expression = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === 'C') {
      clearDisplay();
    } else if (value === '=') {
      calculate();
    } else if (['+', '-', '*', '/'].includes(value)) {
      appendOperator(value);
    } else {
      appendNumber(value);
    }
  });
});

function clearDisplay() {
  currentInput = '';
  expression = '';
  updateDisplay('');
}

function calculate() {
  if (expression !== '' && currentInput !== '') {
    expression += currentInput;
    try {
      const result = eval(expression).toLocaleString();
      updateDisplay(`${expression} = ${result}`);
      currentInput = '';
      expression = '';
    } catch (error) {
      updateDisplay('Error');
      currentInput = '';
      expression = '';
    }
  }
}

function appendOperator(op) {
  if (currentInput !== '') {
    expression += currentInput + ` ${op} `;
    currentInput = '';
  } else if (expression !== '' && ['+', '-', '*', '/'].includes(expression.slice(-2, -1))) {
    expression = expression.slice(0, -3) + ` ${op} `;
  }
  updateDisplay(expression);
}

function appendNumber(num) {
  if (num === '.' && currentInput.includes('.')) return; // Prevent multiple decimals in one number
  currentInput += num;
  updateDisplay(expression + formatNumber(currentInput));
}

function formatNumber(num) {
  if (num.includes('.')) {
    let [integer, decimal] = num.split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return integer + '.' + decimal;
  } else {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

function updateDisplay(value) {
  display.textContent = value;
}
