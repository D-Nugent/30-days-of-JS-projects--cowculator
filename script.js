// Element Selectors
const allBtns = document.querySelectorAll('button');
const calcScreen = {
  all: document.querySelector('.calculator__screen'),
  calc: document.querySelector('.calculator__calculation'),
  sol: document.querySelector('.calculator__solution'),
}

// Event Listeners
allBtns.forEach(btn => btn.addEventListener('transitionend',function(){this.classList.remove('--active')}))
allBtns.forEach(btn => btn.addEventListener('click',function(){this.classList.add('--active')}))
allBtns.forEach(btn => btn.addEventListener('click',addEntry))

// Control Variables
let calcHistory = [];
let currentCalc = [];
let solution;
let nonOperators = [0,1,2,3,4,5,6,7,8,9,'.','(',')'];
let isError = false;
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
    if (currentCalc.includes('√')) {
      let indexOfSquareRoot = currentCalc.indexOf('√');
      let calcCopy = [...currentCalc]
      calcCopy[indexOfSquareRoot] = 'Math.sqrt(';
      calcCopy.push(')');
      solution = eval(calcCopy.join(''));
      currentCalc.push(' = ');
      return calcHistory.push(currentCalc)
    }
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
  }
}

// Functions

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