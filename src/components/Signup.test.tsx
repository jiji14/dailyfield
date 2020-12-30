import { act, fireEvent, render, screen } from "@testing-library/react";
import Signup from "./Signup";
import firebase from "firebase";
import userEvent from "@testing-library/user-event";
import { useHistory } from "react-router-dom";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
    });

    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest
        .fn()
        .mockReturnValue({ add: jest.fn().mockResolvedValue(null) }),
    });
    window.alert = () => "";
  });

  test("Signup", async () => {
    render(<Signup />);
    const name = screen.getByPlaceholderText("이름을 입력해주세요.");
    fireEvent.change(name, { target: { value: "TEST" } });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("signUpSelect").firstElementChild);
    });

    await act(async () => {
      const women = await screen.findByTitle("여성");
      fireEvent.click(women);
    });

    const sporty = screen.getByDisplayValue("sporty");
    userEvent.click(sporty);

    const signupButton = screen.getByText(/가입하기/i);
    await act(async () => {
      fireEvent.click(signupButton);
    });
    const user = firebase.firestore().collection("user").add.mock.calls[0][0];
    expect(user.name).toBe("TEST");
    expect(user.gender).toBe("여성");
    expect(user.theme).toStrictEqual(["sporty"]);
    expect(user.matchesPlayed).toBe(0);
    expect(useHistory().push.mock.calls[0][0]).toBe("/");
  });
});
