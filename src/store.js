import create from "zustand";
import { devtools } from "zustand/middleware";

import {
  decideWhetherOrNotToAddDecimal,
  handleInputNum,
  performArithmeticOperationRegularMode,
  processNumberForDisplay,
  safeEval,
  squareRootCalculation,
  toggleNegative,
} from "./utils";

let useStore = (set) => ({
  /*
   * LOGIC
   */
  inputNum: "0",
  evalString: "",
  currentCalc: "",
  result: "0",
  lastInput: "",

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
          currentCalc: 0,
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
  displayLeftSide: "",
  setdisplayLeftSide: (displayLeftSide) =>
    set({ displayLeftSide: displayLeftSide }),

  /*
   * SCIENTIFIC MODE
   */
  sciMode: false,
  sciModeOn: () => {
    set({
      currentCalc: "0",
      inputNum: "0",
      displayLeftSide: "",
      sciMode: true,
      evalString: "",
    });
  },
  sciModeOff: () => {
    set({
      currentCalc: "0",
      inputNum: "0",
      displayLeftSide: "",
      sciMode: false,
      evalString: "",
    });
  },

  /*
   * CE/C Button
   */
  inputClear: () => {
    set((state) => ({
      displayLeftSide: "",
      currentCalc:
        state.lastInput === "clear" ? "0" : state.currentCal,
      evalString:
        state.lastInput === ("clear" && "equals") ? "0" : state.evalString,
      inputNum: "0",
      lastInput: "clear",
    }));
  },

  /*
   * Number Input
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
   * Plus Minus Times DivideBy Equals - Regular Mode
   */
  inputPlus: () => {
    set((state) => ({
      ...performArithmeticOperationRegularMode({
        inputNum: state.inputNum,
        evalString: state.evalString,
        operationToPerform: "plus",
        lastInput: state.lastInput,
      }),
    }));
  },
  inputMinus: () => {
    set((state) => ({
      ...performArithmeticOperationRegularMode({
        inputNum: state.inputNum,
        evalString: state.evalString,
        operationToPerform: "minus",
        lastInput: state.lastInput,
      }),
    }));
  },
  inputTimes: () => {
    set((state) => ({
      ...performArithmeticOperationRegularMode({
        inputNum: state.inputNum,
        evalString: state.evalString,
        operationToPerform: "times",
        lastInput: state.lastInput,
      }),
    }));
  },
  inputDivideBy: () => {
    set((state) => ({
      ...performArithmeticOperationRegularMode({
        inputNum: state.inputNum,
        evalString: state.evalString,
        operationToPerform: "divideby",
        lastInput: state.lastInput,
      }),
    }));
  },
    inputEquals: () => {
      set({
        displayLeftSide: "",
        lastInput: "equals",
      });
    },

  /*
   *
   * Plus Minus Times DivideBy Equals - SCIENTIFIC MODE
   *
   */
  sciInputPlus: () =>
    set((state) => ({
      evalString:
        (state.evalString !== "0" ? state.evalString : "") +
        state.inputNum +
        "+",
      inputNum: "",
      lastInput: "plus",
      displayLeftSide: "+",
    })),
  sciInputMinus: () =>
    set((state) => ({
      evalString: state.evalString + state.inputNum + "-",
      inputNum: "",
      lastInput: "minus",
      displayLeftSide: "-",
    })),
  sciInputTimes: () =>
    set((state) => ({
      evalString: state.evalString + state.inputNum + "*",
      inputNum: "",
      lastInput: "times",
      displayLeftSide: "*",
    })),
  sciInputDivideBy: () =>
    set((state) => ({
      evalString:
        (state.evalString !== "0" ? state.evalString : "") +
        state.inputNum +
        "/",
      inputNum: "",
      lastInput: "divideby",
      displayLeftSide: "/",
    })),
  sciInputEquals: () =>
    set((state) => ({
      result: safeEval(state.evalString + state.inputNum),
      evalString: "0",
      inputNum: "",
      lastInput: "equals",
      displayLeftSide: "",
    })),

  /*
   * In Place Calculations
   */
  inputSqrt: () => {
    set((state) => ({
      inputNum:
        state.inputNum !== ("" && "0")
          ? squareRootCalculation(state.inputNum)
          : state.inputNum,
      currentCalc:
        state.inputNum === ("" && "0")
          ? squareRootCalculation(state.inputNum)
          : state.inputNum,
      lastInput: "sqrt", // maybe do this only if it was successful?
    }));
  },
  // !!! this use of state is wrong
  inputPercent: (state) => {
    state.inputNum !== ("" && "0")
      ? set({ inputNum: state.inputNum / 100, lastInput: "percent" })
      : set({ currentCalc: state.currentCalc / 100, lastInput: "percent" });
  },
  inputInverse: () => {
    set((state) =>
      state.inputNum !== ("" && "0")
        ? {
            inputNum: processNumberForDisplay(1 / state.inputNum),
            lastInput: "inverse",
          }
        : {
            currentCalc: processNumberForDisplay(1 / state.currentCalc),
            lastInput: "inverse",
          }
    );
  },
  inputNegative: () => {
    set(
      (state) =>
        state.inputNum !== ("" && "0") && {
          inputNum: processNumberForDisplay(toggleNegative(state.inputNum)),
        }
    );
  },

  /*
   * Memory Functions
   */
  memory: 0,
  inputMPlus: () =>
    set((state) => ({
      memory: state.memory + Number(state.inputNum),
      lastInput: "mplus",
    })),
  inputMMinus: () =>
    set((state) => ({
      memory: state.memory - Number(state.inputNum),
      lastInput: "mminus",
    })),
  inputMRecall: () =>
    set((state) => ({
      inputNum: state.memory,
      lastInput: "mrecall",
    })),
  inputMClear: () => set({ memory: 0, lastInput: "mclear" }),
});

useStore = devtools(useStore); // TEMP - remove in prod
useStore = create(useStore);
export default useStore;
