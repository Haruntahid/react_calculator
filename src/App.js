import React, { useReducer } from "react";
import "./style.css";
import Buttons from "./Buttons";
import OperationButtons from "./OperationButtons";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          current: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.current === "0") {
        return state;
      }
      if (payload.digit === "." && state.current.includes(".")) {
        return state;
      }
      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.current == null && state.previous == null) {
        return state;
      }
      if (state.current == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previous == null) {
        return {
          ...state,
          operation: payload.operation,
          previous: state.current,
          current: null,
        };
      }

      return {
        ...state,
        previous: evaluate(state),
        operation: payload.operation,
        current: null,
      };

    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          current: null,
        };
      }
      if (state.current == null) return state;
      if (state.current.lenth == 1) {
        return {
          ...state,
          current: null,
        };
      }
      return {
        ...state,
        current: state.current.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.current == null ||
        state.previous == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previous: null,
        operation: null,
        current: evaluate(state),
      };
  }
}

function evaluate({ current, previous, operation }) {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}

const IntFormator = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function FormateOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return IntFormator.format(integer);
  return `${IntFormator.format(integer)}.${decimal}`;
}

function App() {
  const [{ current, previous, operation }, dispatch] = useReducer(reducer, {});
  return (
    <>
      <div className="calculator">
        <div className="output">
          <div className="previous">
            {FormateOperand(previous)} {operation}
          </div>
          <div className="current">{FormateOperand(current)}</div>
        </div>
        <button
          onClick={() => {
            dispatch({ type: ACTIONS.CLEAR });
          }}
          className="span_two ac"
        >
          AC
        </button>
        <button
          className="del"
          onClick={() => {
            dispatch({ type: ACTIONS.DELETE_DIGIT });
          }}
        >
          DEL
        </button>
        {/* <button>/</button> */}
        <OperationButtons operation="/" dispatch={dispatch} />
        <Buttons digit="1" dispatch={dispatch} />
        <Buttons digit="2" dispatch={dispatch} />
        <Buttons digit="3" dispatch={dispatch} />
        <OperationButtons operation="*" dispatch={dispatch} />
        <Buttons digit="4" dispatch={dispatch} />
        <Buttons digit="5" dispatch={dispatch} />
        <Buttons digit="6" dispatch={dispatch} />
        <OperationButtons operation="+" dispatch={dispatch} />
        <Buttons digit="7" dispatch={dispatch} />
        <Buttons digit="8" dispatch={dispatch} />
        <Buttons digit="9" dispatch={dispatch} />
        <OperationButtons operation="-" dispatch={dispatch} />
        <Buttons digit="." dispatch={dispatch} />
        <Buttons digit="0" dispatch={dispatch} />
        <button
          onClick={() => {
            dispatch({ type: ACTIONS.EVALUATE });
          }}
          className="span_two equal"
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
