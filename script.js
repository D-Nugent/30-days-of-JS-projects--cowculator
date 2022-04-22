// Element Selectors
const allBtns = document.querySelectorAll('button');
const toggle = document.querySelectorAll('input[type="radio"]');
const calcScreen = {
  all: document.querySelector('.calculator__screen'),
  calc: document.querySelector('.calculator__calculation'),
  sol: document.querySelector('.calculator__solution'),
}
const calcHistoryWindow = document.querySelector('.calc-history');
const calcHistoryList = document.querySelector('.calc-history__list');
const showMeCowsBtn = document.querySelector('.btn-show-me-cows')
const calcInCows = {
  window: document.querySelector('.calc-in-cows'),
  result: document.querySelector('.calc-in-cows__result'),
  cows: document.querySelector('.calc-in-cows__cows'),
  close: document.querySelector('.calc-in-cows__close'),
}

// Event Listeners
allBtns.forEach(btn => btn.addEventListener('transitionend',function(){this.classList.remove('--active')}));
allBtns.forEach(btn => btn.addEventListener('click',function(){this.classList.add('--active')}));
allBtns.forEach(btn => btn.addEventListener('click',addEntry));
showMeCowsBtn.addEventListener('click',showMeCows);
calcInCows.close.addEventListener('click',function(){calcInCows.window.classList.remove('--active')});
toggle.forEach(radio => radio.addEventListener('click', toggleRadians))

// Control Variables
let calcHistory = [];
let currentCalc = [];
let solution;
let nonOperators = [0,1,2,3,4,5,6,7,8,9,'.','(',')'];
let trigonometryOperators = ['sin(','cos(','tan('];
let isError = false;
let isRadians = true;
const calcMapping = {
  ac:()=>{
    currentCalc.length = 0;
    solution = null;
    isError = false;
    calcScreen.calc.classList.remove();
    showMeCowsBtn.classList.remove('--visible');
  },
  back:() => {
    currentCalc.pop();
  },
  '=':()=>{
    const isTrigonometry = currentCalc.some((calcEntry) => trigonometryOperators.indexOf(calcEntry) >= 0);
    const isLogarithm = currentCalc.some((calcEntry) => (`${calcEntry}`).includes('log'));
    if (currentCalc.includes('√')) {
      let indexOfSquareRoot = currentCalc.indexOf('√');
      let calcCopy = [...currentCalc]
      calcCopy[indexOfSquareRoot] = 'Math.sqrt(';
      calcCopy.push(')');
      solution = eval(calcCopy.join(''));
      currentCalc.push(' = ');
      return updateCalcHistory(currentCalc,solution)
    } else if (isTrigonometry) {
      let calcCopy = [...currentCalc];
      let trigType = calcCopy.includes('sin(') ? 'sin(' : calcCopy.includes('cos(') ? 'cos(' : 'tan(';
      let trigIndex = calcCopy.indexOf(trigType);
      calcCopy.splice(trigIndex,1,`Math.${trigType}`);
      if (!isRadians) {
        let trigEndIndex = calcCopy.indexOf(')',trigIndex);
        calcCopy.splice(trigEndIndex,1,`* (Math.PI/180))`);
      }
      solution = eval(calcCopy.join(''));
      currentCalc.push(' = ');
      return updateCalcHistory(currentCalc,solution)
    } else if (isLogarithm) {
      let calcCopy = [...currentCalc];
      let logType = calcCopy.includes('log(') ? 'log(' : 'log10('
      let logIndex = calcCopy.indexOf(logType);
      calcCopy.splice(logIndex,1,`Math.${logType}`);
      solution = eval(calcCopy.join(''));
      currentCalc.push(' = ');
      return updateCalcHistory(currentCalc,solution)
    } else {
    let calc = eval(currentCalc.join(''));
    solution = calc;
    if (!solution) {
      return isError = true;
    }
    currentCalc.push(' = ');
    return updateCalcHistory(currentCalc,solution)
    }
  },
  pi:()=> {
    nonOperators.includes(parseFloat(currentCalc[currentCalc.length-1])) && currentCalc.push('*')
    currentCalc.push(Math.PI);
  },
  powerOf:()=> {
    if (currentCalc.length===0) {
      currentCalc.push('Error, enter a number first followed by power of operator')
      calcScreen.calc.classList.add('--error')
      return isError = true;
    }
    currentCalc.push('**')
  },
  squareRoot:() => {
    nonOperators.includes(parseFloat(currentCalc[currentCalc.length-1])) && currentCalc.push('*')
    currentCalc.push(`√`);
  },
}

// Functions

function toggleRadians(){
  this.value === 'degrees' ? isRadians = false : isRadians = true;
}

function addEntry(){
  if (isError) calcMapping.ac();

  const newEntry = this.dataset.type;

  if (!this.dataset.type) {
    return
  }
  // If there is currently a solution, use the value of the previous calculation as
  // the starting value for the new calculation. i.e. ['3','+','1','='] -> ['4']
  if (solution) {
      currentCalc.splice(0,currentCalc.length,solution);
      solution = null;
  }

  if(calcMapping[newEntry] !== undefined) {
    calcMapping[newEntry]();
  } else {
    currentCalc.push(newEntry);
  }

  calcScreen.calc.textContent = [...currentCalc].join('');
  calcScreen.sol.textContent = solution;
}

function loadCalculation(){
  currentCalc = this.dataset.calc.split(',');
  solution = this.dataset.solution;
  calcScreen.calc.textContent = [...currentCalc].join('');
  calcScreen.sol.textContent = solution;
}

function updateCalcHistory(newCalc,newSolution) {
  calcHistory.push([...newCalc]);
  calcHistoryWindow.classList.add('--active');
    const newCalcElement = document.createElement('button');
    newCalcElement.classList.add('calc-history__entry');
    newCalcElement.textContent = `${newCalc.join('')} ${newSolution}`;
    newCalcElement.dataset.calc = newCalc;
    newCalcElement.dataset.solution = newSolution;
    newCalcElement.addEventListener('click',loadCalculation);
    calcHistoryList.appendChild(newCalcElement); 
    if (!showMeCowsBtn.classList.contains('--visible')) {
      showMeCowsBtn.classList.add('--visible');
    }
}

function randomJumpTime(max,min){
  const randomTime = Math.floor(Math.random() * (max - min + 1) - min) + 's';
  return randomTime;
}

function pickJumpAnimation(){
  const randomJump = Math.floor(Math.random() * (4 - 1 + 1) - 1) + 1;
  return `cowjump${randomJump}`;
}

function showMeCows(){
  calcInCows.cows.innerHTML = "";
  calcInCows.result.innerHTML = `${solution} cows!`;
  calcInCows.window.classList.add('--active');
  const cowCount = Math.floor(solution);
  const partialCow = solution % 1;
  for (let i = 0; i < cowCount; i++) {
    const lilCow = (document.createElement('p'));
    lilCow.classList.add('calc-in-cows__lil-cow');
    lilCow.textContent = '🐄';
    if (cowCount < 600) {
      lilCow.classList.add('--jumping');
      lilCow.style.animationDelay = randomJumpTime(5,1);
      lilCow.style.animationName = pickJumpAnimation();
    }
    calcInCows.cows.appendChild(lilCow);
  }
  if (partialCow) {
    const partialCowElement = document.createElement('p');
    partialCowElement.classList.add('calc-in-cows__partial-cow');
    partialCowElement.textContent = `🐄`;
    partialCowElement.style.width = `${partialCow+.2}em`;
    console.log(partialCow)
    calcInCows.cows.appendChild(partialCowElement);
  }
}