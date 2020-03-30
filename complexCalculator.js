"use strict";

let numberInsertField = document.getElementById('number_insert_field');
let calculateDisplay = document.getElementById('calculate_display');

const CALCULATOR_FUNCTIONS = {
  'Backspace': () => deleteLastInNumberInsertField(),
  'Clear': () => init(),
  '+': () => setCalculateArrays('+'),
  '-': () => setCalculateArrays('-'),
  '*': () => setCalculateArrays('*'),
  '/': () => setCalculateArrays('/'),
  '=': () => setNumberInsertFieldToCalculateSolution(),
  'Enter': () => CALCULATOR_FUNCTIONS[EQUAL_SIGN]()
};
const CALCULATIONS = {
  '+': ({
    leftNumber,
    rightNumber,
    tenPower
  }) => (leftNumber + rightNumber) / Math.pow(10, tenPower),
  '-': ({
    leftNumber,
    rightNumber,
    tenPower
  }) => (leftNumber - rightNumber) / Math.pow(10, tenPower),
  '*': ({
    leftNumber,
    rightNumber,
    tenPower
  }) => (leftNumber * rightNumber) / Math.pow(10, 2 * tenPower),
  '/': ({
    leftNumber,
    rightNumber
  }) => leftNumber / rightNumber
};

const DOT = '.';
const ZERO = '0';
const EMPTY_STRING = '';
const EQUAL_SIGN = '=';

let isNumberInsertFieldReseted = false;
let isEqualSignTriggered = false;
let numbersToCalculate = [];
let operatorsToCalculate = [];

document.addEventListener('keydown', function() {
  const KEYBOARD_KEY = event.key;
  if (isNumberOrDot(KEYBOARD_KEY)) {
    insertToNumberInsertField(KEYBOARD_KEY);
  } else if (CALCULATOR_FUNCTIONS[KEYBOARD_KEY]) {
    CALCULATOR_FUNCTIONS[KEYBOARD_KEY]();
  }
  event.preventDefault();
});

function isNumberOrDot(key) {
  return !isNaN(key) || (key === DOT);
}

function isValidInputToNumberInsertField(digitOrDot) {
  return !(numberInsertField.value.includes(DOT) && digitOrDot === DOT) && (numberInsertField.value.length < numberInsertField.max);
}

function clearNumberInsertFieldIfIsZero(digitOrDot) {
  digitOrDot !== DOT && numberInsertField.value === ZERO ? numberInsertField.value = EMPTY_STRING : null;
}

function insertToNumberInsertField(digitOrDot) {
  resetAfterEqualSignTriggered();
  if (isValidInputToNumberInsertField(digitOrDot)) {
    clearNumberInsertFieldIfIsZero(digitOrDot);
    isNumberInsertFieldReseted = false;
    numberInsertField.value += digitOrDot;
    setNumberInsertFieldFontSize();
  }
}

function pushToOperatorsToCalculate(operator) {
  operatorsToCalculate.push(operator);
}

function pushNumberInsertFieldToNumbersToCalculate() {
  numbersToCalculate.push(Number(numberInsertField.value));
}

function replaceLastOperatorToCalculate(operator) {
  operatorsToCalculate[operatorsToCalculate.length - 1] = operator;
}

function resetNumberInsertField() {
  numberInsertField.value = ZERO;
  isNumberInsertFieldReseted = true;
}

function setCalculateArrays(operator) {
  if (!isEqualSignTriggered) {
    if (isNumberInsertFieldReseted) {
      replaceLastOperatorToCalculate(operator);
      replaceLastInCalculateDisplay();
    } else {
      pushNumberInsertFieldToNumbersToCalculate();
      pushToOperatorsToCalculate(operator);
      resetNumberInsertField();
      addToCalculateDisplay();
      throwErrorIfMathError();
    }
  }
}

function addNumberToCalculateDisplay() {
  calculateDisplay.textContent += numbersToCalculate[numbersToCalculate.length - 1] + ' ';
}

function addOperatorToCalculateDisplay() {
  calculateDisplay.textContent += operatorsToCalculate[operatorsToCalculate.length - 1] + ' ';
}

function addToCalculateDisplay() {
  addNumberToCalculateDisplay();
  addOperatorToCalculateDisplay();
}

function replaceLastInCalculateDisplay() {
  calculateDisplay.textContent = calculateDisplay.textContent.slice(0, -2);
  addOperatorToCalculateDisplay();
}

function deleteLastInNumberInsertField() {
  if (!isEqualSignTriggered) {
    numberInsertField.value = numberInsertField.value.slice(0, -1);
    numberInsertField.value === EMPTY_STRING ? resetNumberInsertField() : null;
    setNumberInsertFieldFontSize();
  }
}

function setCalculateArraysAfterCalculatePart(numbersArray, operatorsArray, index) {
  numbersArray[index] = calculate(numbersArray[index], operatorsArray[index], numbersArray[index + 1]);
  numbersArray.splice(index + 1, 1);
  operatorsArray.splice(index, 1);
}

function isOperatorMultiplyOrDivision(operator) {
  return operator === '*' || operator === '/';
}

function calculateAllNumbers(numbersArray, operatorsArray) {
  if (operatorsArray.length === 1) {
    return calculate(numbersArray[0], operatorsArray[0], numbersArray[1]);
  }

  for (var i = 0; i < operatorsArray.length; i++) {
    if (isOperatorMultiplyOrDivision(operatorsToCalculate[i])) {
      setCalculateArraysAfterCalculatePart(numbersArray, operatorsArray, i);
      return calculateAllNumbers(numbersArray, operatorsArray);
    }
  }
  setCalculateArraysAfterCalculatePart(numbersArray, operatorsArray, 0);
  return calculateAllNumbers(numbersArray, operatorsArray);
}

function countDecimal(number) {
  return number.toString().includes(DOT) ? number.toString().split(DOT)[1].length : 0;
}

function isMathError(operator, number) {
  return operator === '/' && number === 0;
}

function throwErrorIfMathError() {
  if (isMathError(operatorsToCalculate[operatorsToCalculate.length - 2], numbersToCalculate[numbersToCalculate.length - 1])) {
    numberInsertField.value = 'Math Error!';
    isEqualSignTriggered = true;
  }
}

function getLeftRightInTenPowerAndThePower(leftNumber, rightNumber) {
  let maxDecimal = Math.max(countDecimal(leftNumber), countDecimal(rightNumber)) + 1;
  return {
    leftNumber: leftNumber * Math.pow(10, maxDecimal),
    rightNumber: rightNumber * Math.pow(10, maxDecimal),
    tenPower: maxDecimal
  };
}

function calculate(leftNumber, operator, rightNumber) {
  return CALCULATIONS[operator](getLeftRightInTenPowerAndThePower(leftNumber, rightNumber));
}

function resetCalculateArrays() {
  numbersToCalculate = [];
  operatorsToCalculate = [];
}

function init() {
  resetCalculateArrays();
  resetNumberInsertField();
  calculateDisplay.textContent = EMPTY_STRING;
  isEqualSignTriggered = false;
}

function resetAfterEqualSignTriggered() {
  if (isEqualSignTriggered) {
    init();
  }
}

function setNumberInsertFieldFontSize() {
  if (numberInsertField.value.length > 10) {
    let fontSize = 50 - 3.1 * (numberInsertField.value.length - 10);
    numberInsertField.style.fontSize = fontSize + 'px';
  } else {
    numberInsertField.style.fontSize = '50px';
  }
}

function isReadyToCalculate() {
  return operatorsToCalculate.length > 0 && !isEqualSignTriggered;
}

function setNumberInsertFieldToCalculateSolution() {
  if (isReadyToCalculate()) {
    pushNumberInsertFieldToNumbersToCalculate();
    addNumberToCalculateDisplay();
    if (isMathError(operatorsToCalculate[operatorsToCalculate.length - 1], numbersToCalculate[numbersToCalculate.length - 1])) {
      numberInsertField.value = 'Math Error!';
    } else {
      numberInsertField.value = calculateAllNumbers(numbersToCalculate, operatorsToCalculate);
    }
    setNumberInsertFieldFontSize();
    isEqualSignTriggered = true;
  }
}
