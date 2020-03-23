"use strict";

const INPUT = document.getElementById('input');
const OUTPUT = document.getElementById('output');
const OPERATOR_BUTTONS = document.getElementsByClassName('operator');

const OPERATORS = {
  'Backspace': () => deleteLast(),
  'Clear': () => init(),
  '+': () => operatorsAction('+'),
  '-': () => operatorsAction('-'),
  '*': () => operatorsAction('*'),
  '/': () => operatorsAction('/'),
  '=': () => {
    setCurrentNumberAndOperator('=');
    calculate();
    resetCurrentNumberAndOperator();
  },
  'Enter': () => OPERATORS['=']()
};
const CALCULATIONS = {
  '+': (left, right, tenPower) => result = (left + right) / Math.pow(10, tenPower),
  '-': (left, right, tenPower) => result = (left - right) / Math.pow(10, tenPower),
  '*': (left, right, tenPower) => result = (left * right) / Math.pow(10, 2 * tenPower),
  '/': (left, right) => result = left / right
};
const DOT = '.';

let isFirstRun = true;
let isDisabled = false;
let currentNumber = '';
let currentOperator = '';
let result = 0;

document.addEventListener('keydown', () => {
  const key = event.key;
  classifyKey(key);
  event.preventDefault();
});

function classifyKey(key) {
  if (isNumberOrDot(key)) {
    setInput(key);
  } else if (OPERATORS[key] !== undefined) {
    OPERATORS[key]();
  }
}

function setCurrentNumberAndOperator(operator) {
  if (operator !== '=') {
    currentOperator = operator;
    if (!isInputEmpty()) {
      if (isKeyLastInInput(DOT)) {
        deleteLast();
      }
      currentNumber = INPUT.value;
      setFirstRunValues();
    } else if (currentNumber === '') {
      setInputToZero();
      setCurrentNumberAndOperator(operator);
    }
    setOutput(currentNumber, currentOperator, '');
  } else {
    if (isKeyLastInInput(DOT)) {
      deleteLast();
    }
    setOutput(currentNumber, currentOperator, INPUT.value);
  }
}

function isKeyLastInInput(key) {
  return getLastChar(INPUT.value) === key;
}

function getLastChar(INPUT) {
  return INPUT.substr(INPUT.length - 1, 1);
}

function setInput(num) {
  if (isDisabled) {
    init();
  }
  if (isFirstRun) {
    clearInput();
    isFirstRun = false;
  }

  insertToInput(num);
}

function insertToInput(num) {
  if (isValidInsert(num)) {
    INPUT.value += num;
  }
}

function isNumberOrDot(key) {
  return !isNaN(key) || (key === DOT);
}

function isValidInsert(num) {

  if (num === DOT) {
    if (isInputEmpty()) {
      insertToInput('0');
      return true;
    } else if (INPUT.value.includes(DOT)) {
      return false;
    }
    return true;
  } else if (num === '0' && INPUT.value === '0') {
    return false;
  } else {
    return true;
  }
}

function isInputEmpty() {
  return INPUT.value === '';
}

function setOutput(leftNumber, operator, rightNumber) {
  OUTPUT.textContent = leftNumber + ' ' + operator + ' ' + rightNumber;
}

function operatorsAction(operator) {
  if (!isValidOperation())
    setCurrentNumberAndOperator(operator)
  else {
    calculate();
    setCurrentNumberAndOperator(operator);
  }
}

function countDecimal(number) {
  return number.includes(DOT) ? number.split(DOT)[1].length : 0;
}

function calculate() {
  let leftCountDecimal = countDecimal(currentNumber);
  let rightCountDecimal = countDecimal(INPUT.value);
  let maxDecimal = Math.max(leftCountDecimal, rightCountDecimal);

  let leftNumber = currentNumber * Math.pow(10, maxDecimal);
  let rightNumber = INPUT.value * Math.pow(10, maxDecimal);
  if (currentOperator !== '') {
    CALCULATIONS[currentOperator](leftNumber, rightNumber, maxDecimal);
  }
  if (result != 'Infinity') {
    if (isCloseToOne()) {
      result = Math.round(result);
    }
    INPUT.value = result;
  } else {
    INPUT.value = 'Math Error';
    setOperatorsDisabled();
  }
  isFirstRun = true;
}

function isCloseToOne() {
  return result.toString().includes(DOT) && result.toString().split(DOT)[1].substr(0, 10) === '9999999999';
}

function deleteLast() {
  if (!isFirstRun) {
    INPUT.value = INPUT.value.slice(0, -1);
  }
}

function clearInput() {
  INPUT.value = '';
}

function setInputToZero() {
  INPUT.value = '0';
}

function init() {
  setFirstRunValues();
  resetCurrentNumberAndOperator();
  result = 0;
  OUTPUT.textContent = '';
  setOperatorsUnabled();
}

function toggleOperatorsDisabledState() {
  isDisabled = !isDisabled;
  for (var i = 0; i < OPERATOR_BUTTONS.length; i++) {
    OPERATOR_BUTTONS[i].disabled = isDisabled;
  }
}

function setOperatorsDisabled() {
  if (!isDisabled) {
    toggleOperatorsDisabledState();
  }
}

function setOperatorsUnabled() {
  if (isDisabled) {
    toggleOperatorsDisabledState();
  }
}

function resetCurrentNumberAndOperator() {
  currentNumber = '';
  currentOperator = '';
}

function setFirstRunValues() {
  isFirstRun = true;
  setInputToZero();
}

function isValidOperation() {
  return (currentNumber !== '') && (currentOperator !== '') && !isInputEmpty();
}
