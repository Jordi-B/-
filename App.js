const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const input = document.querySelector("input");
const output = document.querySelector("#output");

let firstRun = true;

let isInputed = true;
let optionalNumbers = "1234567890";
let signs = ["Backspace", "clear", "+", "-", "*", "/", "="];
let dot = ".";
let equalSign = "=";
let currentNumber = "";
let currentOperator = "";
let result = 0;

numbers.forEach(number => number.addEventListener("click", () => insertToInput(number.name)))
operators.forEach(operator => operator.addEventListener("click", () => act(operator.name)))

document.addEventListener("keydown", () => {
  var key = event.key;
  keyHandler(key);
});

function keyHandler(key) {
  if (isNumberOrDot(key)) {
    insertToInput(key);
  } else if (isValidSign(key)) {
    act(key);
  }
}

function setCurrents(operator) {
  if (operator !== equalSign) {
    currentOperator = operator;
    if (isInputed) {
      if (isKeyLastInInput(input.value, dot)) {
        deleteLast();
      }
      currentNumber = input.value;
      setDefault();
    } else if (currentNumber === "") {
      insert("0");
      setCurrents(operator);
    }
    setOutput();
  } else {
    if (isKeyLastInInput(input.value, dot)) {
      deleteLast();
    }
    setOutput(currentNumber, currentOperator, input.value);
  }
}

function isKeyLastInInput(input, key) {
  return getLastChar(input) === key;
}

function getLastChar(input) {
  return input.substr(input.length - 1, 1);
}

function insertToInput(num) {
  if (firstRun) {
    clear();
    firstRun = false;
    isInputed = true;
  }

  insert(num);
}

function insert(num) {
  if (validNumber(num)) {
    input.value += num;
    isInputed = true;
  }
}

function isNumberOrDot(key) {
  return optionalNumbers.includes(key) || (key === dot);
}

function isValidSign(key) {
  return signs.includes(key);
}

function validNumber(num) {
  if (optionalNumbers.includes(num))
    return true;
  if (num === dot) {
    if (isInputEmpty()) {
      insert("0");
      return true;
    } else if (input.value.includes(dot)) {
      return false;
    }
    return true;
  }
  return false;
}

function isInputEmpty() {
  return input.value === "";
}

function act(key) {
  switch (key) {
    case "+":
      addition();
      break;
    case "-":
      subtraction();
      break;
    case "/":
      division();
      break;
    case "*":
      multiplication();
      break;
    case "=":
      setCurrents(equalSign);
      calculate();
      resetCurrents();
      break;
    case "clear":
      init();
      break;
    case "Backspace":
      deleteLast();
      break;
    default:
      null;
      break;
  }

}

function setOutput(num1 = currentNumber, operator = currentOperator, num2 = "") {
  output.textContent = num1 + " " + operator + " " + num2;
}

function addition() {
  manipulate("+");
}

function subtraction() {
  manipulate("-");
}

function division() {
  manipulate("/");
}

function multiplication() {
  manipulate("*");
}

function manipulate(operator) {
  if (!isValidOperation())
    setCurrents(operator)
  else {
    calculate();
    setCurrents(operator);
  }
}

function calculate() {
  let number1 = Number(currentNumber);
  let number2 = Number(input.value);
  switch (currentOperator) {
    case "+":
      result = number1 + number2;
      break;
    case "-":
      result = number1 - number2;
      break;
    case "/":
      result = number1 / number2;
      break;
    case "*":
      result = number1 * number2;
      break;
    default:
      null;
      break;
  }

  input.value = result;
  firstRun = true;
}

function deleteLast() {
  input.value = input.value.slice(0, -1);
  isInputed = !isInputEmpty();
}

function clear() {
  input.value = "";
  isInputed = false;
}

function init() {
  firstRun = true;
  isInputed = true;
  equalSign = "=";
  currentNumber = "";
  currentOperator = "";
  result = 0;
  input.value = "0";
  output.textContent = "";
}

function resetCurrents() {
  currentNumber = "";
  currentOperator = "";
}

function setDefault() {
  firstRun = true;
  input.value = "";
  isInputed = false;
}

function isValidOperation() {
  return (currentNumber !== "") && (currentOperator !== "") && !isInputEmpty();
}
