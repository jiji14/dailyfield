// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
// We need to import firebase to mock it below.
// eslint-disable-next-line no-unused-vars
import firebase from "firebase";
import "react-router-dom";

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
}));
