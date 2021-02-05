// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
// We need to import firebase to mock it below.
// eslint-disable-next-line no-unused-vars
import firebase from "firebase";
import "react-router-dom";
import { act, fireEvent, screen } from "@testing-library/react";

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

jest.mock("firebase");

const mockHistory = {
  push: jest.fn(),
};

jest.mock("react-router-dom", () => ({
  useHistory: () => mockHistory,
  useParams: () => jest.fn(),
  Link: () => jest.fn(),
}));

export const fireAntEvent = {
  actAndSelect: async function (id: HTMLElement, type: string): void {
    await act(async () => {
      fireEvent.mouseDown(id.firstElementChild);
      // https://github.com/ant-design/ant-design/issues/22074#issuecomment-611352984
    });
    await act(async () => {
      const gender = screen.getByTitle(type);
      fireEvent.click(gender);
    });
  },
  actAndSetDate: async function (id: HTMLElement, date: string): void {
    await act(async () => {
      fireEvent.mouseDown(id);
    });
    await act(async () => {
      fireEvent.click(screen.getByText(date));
    });
  },
  actAndInput: async function (placeholder: string, text: string): void {
    await act(async () => {
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.change(input, { target: { value: text } });
    });
  },
  actAndCheckbox: async function (id: string): void {
    await act(async () => {
      const checkbox = screen.getByTestId(id);
      fireEvent.click(checkbox);
    });
  },
  actAndClick: async function (text: string): void {
    await act(async () => {
      const button = screen.getByText(text);
      fireEvent.click(button);
    });
  },
};
