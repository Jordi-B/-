"use strict";

let numberInsertField = document.getElementById('number_insert_field');
let calculateDisplay = document.getElementById('calculate_display');
let functionalityButtons = document.getElementsByClassName('operator');

const CALCULATOR_FUNCTIONS = {
  'Backspace': () => deleteLast(),
  'Clear': () => init(),
  '+': () => operatorsAction('+'),
  '-': () => operatorsAction('-'),
  '*': () => operatorsAction('*'),
  '/': () => operatorsAction('/'),
  '=': () => {
    if (currentNumber) {
      setCurrentNumberAndOperator('=');
      calculate();
      resetCurrentNumberAndOperator();
    }
  },
  'Enter': () => CALCULATOR_FUNCTIONS['=']()
};
const CALCULATIONS = {
  '+': (leftNumber, rightNumber, tenPower) => (leftNumber + rightNumber) / Math.pow(10, tenPower),
  '-': (leftNumber, rightNumber, tenPower) => (leftNumber - rightNumber) / Math.pow(10, tenPower),
  '*': (leftNumber, rightNumber, tenPower) => (leftNumber * rightNumber) / Math.pow(10, 2 * tenPower),
  '/': (leftNumber, rightNumber) => leftNumber / rightNumber
};
const DOT = '.';
const EQUAL_SIGN = '=';

let isInsertedToNumberInsertField = true;
let isFunctionalityButtonsDisabled = false;
let currentNumber;
let currentOperator = '';
let result;

document.addEventListener('keydown', function() {
  const KEYBOARD_KEY = event.key;
  if (isNumberOrDot(KEYBOARD_KEY)) {
    setNumberInsertField(KEYBOARD_KEY);
  } else if (CALCULATOR_FUNCTIONS[KEYBOARD_KEY]) {
    CALCULATOR_FUNCTIONS[KEYBOARD_KEY]();
  }
  event.preventDefault();
});

function setCurrentNumberAndOperator(operator) {
  numberInsertField.style.fontSize = '50px';
  if (operator !== EQUAL_SIGN) {
    currentOperator = operator;
    if (isInsertedToNumberInsertField || numberInsertField.value == result) {
      currentNumber = numberInsertField.value;
      setInsertedToNumberInsertFieldValues();
    }
    setCalculateDisplay(currentNumber, currentOperator);
  } else {
    setCalculateDisplay(currentNumber, currentOperator, numberInsertField.value);
  }
}

function setNumberInsertField(num) {
  if (isValidInsert(num)) {
    if (isFunctionalityButtonsDisabled) {
      init();
    }
    if (!isInsertedToNumberInsertField || numberInsertField.value == result) {
      result = 0;
      numberInsertField.value = '';
      isInsertedToNumberInsertField = true;
    }

    insertToNumberInsertField(num);
  }
}

function insertToNumberInsertField(num) {
  numberInsertField.value += num;
  setNumberInsertFieldFontSize();
}

function setNumberInsertFieldFontSize() {
  if (numberInsertField.value.length > 10) {
    let fontSize = 50 - 3.1 * (numberInsertField.value.length - 10);
    numberInsertField.style.fontSize = fontSize + 'px';
  }
}

function isNumberOrDot(key) {
  return !isNaN(key) || (key === DOT);
}

function isValidInsert(num) {
  if (numberInsertField.value.length >= numberInsertField.max) {
    return false;
  } else if (num === DOT) {
    if (numberInsertField.value === '') {
      numberInsertField.value = '0';
      return true;
    } else if (numberInsertField.value.includes(DOT)) {
      return false;
    }
    return true;
  } else if (numberInsertField.value === '0') {
    numberInsertField.value = '';
    return true;
  } else {
    return true;
  }
}

function setCalculateDisplay(leftNumber, operator, rightNumber = '') {
  let left = Number(leftNumber);
  let right = rightNumber === '' ? rightNumber : Number(rightNumber);
  calculateDisplay.textContent = left + ' ' + operator + ' ' + right;
}

function operatorsAction(operator) {
  if (isReadyToCalculate()) {
    calculate();
  }
  setCurrentNumberAndOperator(operator);
}

function countDecimal(number) {
  return number.includes(DOT) ? number.split(DOT)[1].length : 0;
}

function calculate() {
  if (CALCULATIONS[currentOperator]) {
    if (isMathError()) {
      numberInsertField.value = 'Math Error';
      setOperatorsDisabled();
    } else {
      let leftCountDecimal = countDecimal(currentNumber);
      let rightCountDecimal = countDecimal(numberInsertField.value);
      let maxDecimal = Math.max(leftCountDecimal, rightCountDecimal);
      let leftNumber = currentNumber * Math.pow(10, maxDecimal);
      let rightNumber = numberInsertField.value * Math.pow(10, maxDecimal);
      result = CALCULATIONS[currentOperator](leftNumber, rightNumber, maxDecimal);
      numberInsertField.value = result;
      setNumberInsertFieldFontSize();
    }
    isInsertedToNumberInsertField = false;
  }
}

function isMathError() {
  return currentOperator === '/' && numberInsertField.value == 0;
}

function deleteLast() {
  if (isInsertedToNumberInsertField) {
    numberInsertField.value = numberInsertField.value.slice(0, -1);
    if (numberInsertField.value === '') {
      numberInsertField.value = '0';
    }
    setNumberInsertFieldFontSize();
  }
}

function init() {
  setInsertedToNumberInsertFieldValues();
  resetCurrentNumberAndOperator();
  result = 0;
  calculateDisplay.textContent = '';
  setOperatorsUnabled();
}

function toggleOperatorsDisabledState() {
  isFunctionalityButtonsDisabled = !isFunctionalityButtonsDisabled;
  for (var i = 0; i < functionalityButtons.length; i++) {
    functionalityButtons[i].disabled = isFunctionalityButtonsDisabled;
  }
}

function setOperatorsDisabled() {
  if (!isFunctionalityButtonsDisabled) {
    toggleOperatorsDisabledState();
  }
}

function setOperatorsUnabled() {
  if (isFunctionalityButtonsDisabled) {
    toggleOperatorsDisabledState();
  }
}

function resetCurrentNumberAndOperator() {
  currentNumber = undefined;
  currentOperator = '';
}

function setInsertedToNumberInsertFieldValues() {
  isInsertedToNumberInsertField = false;
  numberInsertField.value = '0';
}

function isReadyToCalculate() {
  return currentNumber && isInsertedToNumberInsertField;
}
