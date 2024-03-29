// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
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
  useParams: jest.fn(),
  Link: ({ children }: { children: JSX.Element }) => children,
  NavLink: ({ children }: { children: JSX.Element }) => children,
}));

jest.mock("./globalFunction", () => ({
  // object를 type으로 쓰면 lint 오류나서 vscode가 추천한 Record<string, unknown>을 type으로 쓰기
  // https://github.com/microsoft/TypeScript/issues/21732
  ...(jest.requireActual("./globalFunction") as Record<string, unknown>),
  deleteReservationStatus: jest.fn(),
  updateReservationStatus: jest.fn(),
}));

export const fireAntEvent = {
  actAndSelect: async function (id: HTMLElement, type: string): void {
    await act(async () => {
      fireEvent.mouseDown(id.firstElementChild);
      // https://github.com/ant-design/ant-design/issues/22074#issuecomment-611352984
    });
    await act(async () => {
      const dropdownOption = screen.getByTitle(type);
      fireEvent.click(dropdownOption);
    });
  },
  actAndSetDate: async function (
    id: HTMLElement,
    date: string,
    order: number // DatePicker가 여러개 일때 getByText를 쓰면 중복되기 때문에 몇번째 datePicker인지 받아주기
  ): void {
    await act(async () => {
      fireEvent.mouseDown(id);
    });
    await act(async () => {
      fireEvent.click(screen.getAllByText(date)[order]);
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

export function mockWindowLocationReload(): void {
  //Error: Not implemented: navigation (except hash changes) 발생
  //현재 해결할 수 있는 방법은 delete 한 다음에 다시 reload 생성하는 것
  //https://remarkablemark.org/blog/2018/11/17/mock-window-location/ 참고
  delete window.location;
  window.location = { reload: jest.fn() };
}
