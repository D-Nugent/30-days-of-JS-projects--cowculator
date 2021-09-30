// Element Selectors
const allBtns = document.querySelectorAll('button');
const toggle = document.querySelectorAll('input[type="radio"]');
const calcScreen = {
  all: document.querySelector('.calculator__screen'),
  calc: document.querySelector('.calculator__calculation'),
  sol: document.querySelector('.calculator__solution'),
}

// Event Listeners
allBtns.forEach(btn => btn.addEventListener('transitionend',function(){this.classList.remove('--active')}));
allBtns.forEach(btn => btn.addEventListener('click',function(){this.classList.add('--active')}));
allBtns.forEach(btn => btn.addEventListener('click',addEntry));
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
  },
  back:() => {
    currentCalc.pop();
  },
  '=':()=>{
    const isTrigonometry = currentCalc.some((calcEntry) => trigonometryOperators.indexOf(calcEntry) >= 0);
    const isLogarithm = currentCalc.some((calcEntry) => calcEntry.includes('log'));
    if (currentCalc.includes('√')) {
      let indexOfSquareRoot = currentCalc.indexOf('√');
      let calcCopy = [...currentCalc]
      calcCopy[indexOfSquareRoot] = 'Math.sqrt(';
      calcCopy.push(')');
      solution = eval(calcCopy.join(''));
      currentCalc.push(' = ');
      return calcHistory.push(currentCalc);
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
      return calcHistory.push(currentCalc);
    } else if (isLogarithm) {
      let calcCopy = [...currentCalc];
      let logType = calcCopy.includes('log(') ? 'log(' : 'log10('
      let logIndex = calcCopy.indexOf(logType);
      calcCopy.splice(logIndex,1,`Math.${logType}`);
      solution = eval(calcCopy.join(''));
      currentCalc.push(' = ');
      return calcHistory.push(currentCalc);
    };
    let calc = eval(currentCalc.join(''));
    console.log(calc);
    solution = calc;
    currentCalc.push(' = ');
    calcHistory.push(currentCalc)
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
  let newEntry = this.dataset.type;
  if (solution) {
    currentCalc.splice(0,currentCalc.length,solution);
    solution = null;
  }
  if(calcMapping[newEntry] !== undefined) {
    calcMapping[newEntry]();
  } else {
    currentCalc.push(newEntry);
  }
  calcScreen.calc.textContent = currentCalc.join('');
  calcScreen.sol.textContent = solution;
  console.log(`currentCalc`, currentCalc)
  console.log(`solution`, solution)
}