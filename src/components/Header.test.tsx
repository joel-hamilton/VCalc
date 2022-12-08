import * as React from 'react';

import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen } from '@testing-library/react-native';

import Header from './Header';
import WrapWithContext from './WrapWithContext';

describe("Header", () => {
  let props;

  beforeEach(() => {
    props = {
      back: undefined,
      navigation: {},
      options: { header: jest.fn() },
      route: {
        key: "Test-mYMQpow6h8PV6NIomDWTD",
        name: "Test",
        params: undefined,
      },
    } as unknown as NativeStackHeaderProps;

    render(
      <WrapWithContext>
        <Header {...props} />
      </WrapWithContext>
    );
  });

  it("shows the correct title", () => {
    screen.getByText("Test Title");
  });

  it("does not show the app menu by default", () => {
    expect(screen.queryByTestId("menu")).toBeNull();
  });

  it("shows the app menu when the toggle is pressed", () => {
    fireEvent.press(screen.getByTestId("menu-toggle"));
    const menu = screen.getByTestId("menu");
    expect(menu).not.toBeNull();
  });

  it("hides the app menu when the overlay is pressed", () => {
    fireEvent.press(screen.getByTestId("menu-toggle"));
    const menu = screen.getByTestId("menu");
    expect(menu).not.toBeNull();

    fireEvent.press(screen.getByTestId("modal-overlay"));
    expect(screen.queryByTestId("menu")).toBeNull();
  });
});
