import create from "zustand";
import { devtools } from "zustand/middleware";

// allows us to calculate number of
const countDecimals = (number) => {
  console.log("number: ");
  console.log(number);
  console.log(typeof number);
  if (!number.toString().includes(".")) return 0;
  return Number(number.toString().split(".")[1].length);
};

// handle what happens when a number is input
const handleInputNum = ({ num, inputNum, lastInput }) => {
  const inputNumNumber = Number(inputNum);
  console.log("inputNumNumber: " + inputNumNumber);
  if (inputNumNumber === 0) return num.toString();
  if (inputNum[inputNum.length-1] === ".") return inputNum + num;
  if (inputNum.includes(".")) {
    return countDecimals(inputNumNumber) < 4 ? inputNum + num : inputNum;
  }

  return inputNum + num;
};

const decideWhetherOrNotToAddDecimal = (num) => {
  console.log(typeof num);
  return num.toString().includes(".") ? num : num + ".";
};

let useStore = (set) => ({
  /*
   * LOGIC
   */
  currentCalc: 0,
  inputNum: "0",
  currentDecimalPlaces: 0,
  inDecimalCalculation: false,
  calcError: false,
  lastInput: "",
  setLastInput: (input) => set({ lastInput: input }),

  /*
   * POWER FUNCTIONS
   */
  power: true,
  powerOn: () => {
    set({
      power: true,
      display: "0",
      displayLeftSide: "",
      currentCalc: 0,
      inputNum: 0,
    });
  },
  powerOff: () => {
    set({
      power: false,
    });
    setTimeout(
      () =>
        set({
          currentCalculation: 0,
          inputNum: 0,
          displayLeftSide: "",
        }),
      200
    );
  },

  /*
   * DISPLAY FUNCTIONS
   * Maybe we can get rid of these and instead just have a function in
   * Display.jsx that uses the other values to decide what to display?
   */
  // display: "0",
  // setDisplay: (display) => set((state) => ({ display: display })),
  displayLeftSide: "",
  setdisplayLeftSide: (displayLeftSide) =>
    set((state) => ({ displayLeftSide: displayLeftSide })),

  /*
   * SCIENTIFIC MODE
   */
  sciMode: false,
  sciModeOn: () => {
    set({
      currentCalc: 0,
      inputNum: 0,
      displayLeftSide: "",
      sciMode: true,
      sciModeEvalString: "",
    });
  },
  sciModeOff: () => {
    set({
      currentCalc: 0,
      inputNum: 0,
      displayLeftSide: "",
      sciMode: false,
      sciModeEvalString: "",
    });
  },

  sciModeEvalString: "",

  /*
   * CE/C BUTTON
   */
  inputClear: () => {
    set((state) => ({
      displayLeftSide: "",
      currentCalculation:
        state.lastInput === "clear" ? "0" : state.currentCalculation,
      inputNum: "0",
      lastInput: "clear",
    }));
  },

  /*
   * NUMBER INPUT
   */
  inputNumber: (number) => {
    console.log("inputNumber " + number);
    set((state) => ({
      inputNum: handleInputNum({
        num: number,
        inputNum: state.inputNum,
        lastInput: state.lastInput,
      }),
      lastInput: "num",
    }));
  },

  /*
   * DECIMAL POINT INPUT
   */
  inputDecimal: () => {
    set((state) => ({
      inputNum: decideWhetherOrNotToAddDecimal(state.inputNum),
      lastInput: "decimal",
    }));
  },

  /*
   * ARITHMETIC
   */
  inputPlus: () => {
    set({ displayLeftSide: "+", lastInput: "plus" });
  },
  inputMinus: () => {
    set({ displayLeftSide: "-", lastInput: "minus" });
  },
  inputTimes: () => {
    set({ displayLeftSide: "x", lastInput: "times" });
  },
  inputDivideBy: () => {
    set((state) =>
      state.sciMode
        ? {
            sciModeEvalString: state.sciModeEvalString + "/",
            lastInput: "divideBy",
          }
        : {
            displayLeftSide: "/",
            lastInput: "divideBy",
          }
    );
  },

  /*
   * IN PLACE CALCULATIONS
   */
  inputSqrt: (state) => {
    state.inputNum != null
      ? set({ inputNum: Math.sqrt(state.inputNum), lastInput: "sqrt" })
      : set({ currentCalc: Math.sqrt(state.currentCalc), lastInput: "sqrt" });
  },
  inputPercent: (state) => {
    state.inputNum != null
      ? set({ inputNum: state.inputNum / 100, lastInput: "percent" })
      : set({ currentCalc: state.currentCalc / 100, lastInput: "percent" });
  },
  inputInverse: (state) => {
    state.inputNum != null
      ? set({ inputNum: 1 / state.inputNum, lastInput: "inverse" })
      : set({ currentCalc: 1 / state.currentCalc, lastInput: "inverse" });
  },
  inputNegative: (state) => {
    set({ lastInput: "negative" });
  },

  /*
   * EQUALS
   */
  inputEquals: () => {
    set({
      displayLeftSide: "",
      lastInput: "equals",
    });
  },

  /*
   * MEMORY FUNCTIONS
   */
  memory: 0,
  inputMPlus: (state) =>
    set({ memory: state.memory + state.inputNum, lastInput: "mplus" }),
  inputMMinus: (state) =>
    set({ memory: state.memory - state.inputNum, lastInput: "mminus" }),
  inputMRecall: (state) =>
    set({
      inputNum: state.memory,
      display: state.memory,
      lastInput: "mrecall",
    }),
  inputMClear: () => set({ memory: 0, lastInput: "mclear" }),
});

useStore = devtools(useStore); // TEMP - remove in prod
useStore = create(useStore);
export default useStore;
