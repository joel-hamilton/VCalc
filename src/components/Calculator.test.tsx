import * as React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";
import Calculator from "../components/Calculator";
import WrapWithContext from "./WrapWithContext";
import Display from "./Display";

jest.useFakeTimers();

describe("Calculator", () => {
  beforeEach(() => {
    render(
      <WrapWithContext>
        <Calculator />
      </WrapWithContext>
    );
  });

  describe("main display", () => {
    let zero, one, two, three, four, five, six, seven, eight, nine, dot;
    let delClr, timesPower, minusFactorial, plusBrackets, dividedRoot, equals;
    let display, preview, interpolationPreview;
    let getDisplayChildren, getAddVariable;

    beforeEach(() => {
      zero = screen.getByText("0");
      one = screen.getByText("1");
      two = screen.getByText("2");
      three = screen.getByText("3");
      four = screen.getByText("4");
      five = screen.getByText("5");
      six = screen.getByText("6");
      seven = screen.getByText("7");
      eight = screen.getByText("8");
      nine = screen.getByText("9");
      dot = screen.getByText(".");

      delClr = screen.getByText("DEL");
      timesPower = screen.getByText("^");
      minusFactorial = screen.getByText("-");
      dividedRoot = screen.getByText("÷");
      plusBrackets = screen.getByText("+");
      equals = screen.getByText("=");

      interpolationPreview = screen.getByTestId("interpolation-preview");
      preview = screen.getByTestId("preview");
      display = screen.getByTestId("display");

      getAddVariable = () => screen.getByTestId("add-variable");
      getDisplayChildren = () => display.props.children[0];
    });

    it("adds numbers from keyboard", async () => {
      fireEvent.press(one);
      fireEvent.press(two);
      fireEvent.press(three);
      fireEvent.press(four);
      fireEvent.press(five);
      fireEvent.press(six);
      fireEvent.press(seven);
      fireEvent.press(eight);
      fireEvent.press(nine);
      fireEvent.press(dot);
      fireEvent.press(zero);

      expect(preview.props.children).toBe("123456789");
      expect(interpolationPreview.props.children).toBe("123456789.0");

      expect(getDisplayChildren().length).toBe(11);
    });

    it("does math correctly", async () => {
      fireEvent.press(one);
      fireEvent.press(plusBrackets);
      fireEvent.press(two);
      fireEvent(minusFactorial, "onLongPress");
      fireEvent.press(dividedRoot);
      fireEvent.press(two);
      fireEvent.press(minusFactorial);
      fireEvent.press(four);
      fireEvent(plusBrackets, "onLongPress");
      fireEvent.press(nine);
      fireEvent(timesPower, "onLongPress");
      fireEvent.press(two);
      fireEvent.press(delClr);
      fireEvent.press(four);
      expect(interpolationPreview.props.children).toBe("1+2!/2-4(9^4)");
      expect(preview.props.children).toBe("-26242");
      expect(getDisplayChildren().length).toBe(13);
      expect(screen.getByAccessibilityHint("1+2!/2-4(9^4)")).toBe(display);

      fireEvent.press(equals);
      expect(screen.getByAccessibilityHint("-26242")).toBe(display);
    });

    it("adds a variable", () => {
      fireEvent.press(one);
      fireEvent.press(plusBrackets);
      fireEvent.press(four);

      expect(screen.queryAllByText("var1").length).toBe(0);

      fireEvent.press(getAddVariable());
      expect(screen.queryAllByText("var1").length).toBe(1);
    });
  });

  describe("edit view", () => {
    let exitEditMode;

    beforeEach(() => {
      exitEditMode = screen.getByTestId("exit-edit-mode");
      fireEvent.press(screen.getByText("1"));
      fireEvent.press(screen.getByText("+"));
      fireEvent.press(screen.getByText("2"));
      fireEvent.press(screen.getByTestId("add-variable"));

      const varPressable = screen.queryAllByText("var1")[0];
      fireEvent(varPressable, "onLongPress");
    });

    it("opens and closes", () => {
      expect(screen.UNSAFE_queryAllByType(Display).length).toBe(3);
      fireEvent.press(exitEditMode);
      expect(screen.UNSAFE_queryAllByType(Display).length).toBe(1);
    });

    it("saves changes to the variable name", () => {
      fireEvent.press(screen.getByText("-"));
      fireEvent.press(exitEditMode);
      const varPressables = screen.queryAllByText("var1-");
      expect(varPressables.length).toBe(1);
    });

    it.skip("saves changes to the variable value", () => {
      // TODO focus the value display before typing
      fireEvent.press(screen.UNSAFE_queryAllByType(Display)[2]);
      fireEvent.press(screen.getByText("-"));
      const previewDisplay = screen.getByTestId("preview");
      expect(previewDisplay.props.children).toBe('-1+2');
    });
  });
});
