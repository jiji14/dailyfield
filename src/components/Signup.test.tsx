import { act, fireEvent, render, screen } from "@testing-library/react";
import Signup from "./Signup";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
    });

    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest
          .fn()
          .mockReturnValue({ set: jest.fn().mockResolvedValue(null) }),
      }),
    });
    window.alert = () => "";
  });

  test("Signup", async () => {
    render(<Signup />);
    const name = screen.getByPlaceholderText("이름을 입력해주세요.");
    fireEvent.change(name, { target: { value: "지정" } });

    await act(async () => {
      const birthDate = screen.getByTestId("birthDate");
      fireEvent.mouseDown(birthDate);
      fireEvent.change(birthDate, { target: { value: "10-25-2020" } });
      console.log(birthDate);
    });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("signUpSelect").firstElementChild);
      // https://github.com/ant-design/ant-design/issues/22074#issuecomment-611352984
    });

    await act(async () => {
      const women = screen.getByTitle("여성");
      fireEvent.click(women);
    });

    const sporty = screen.getByDisplayValue("sporty");
    fireEvent.click(sporty);

    await act(async () => {
      const signupButton = screen.getByText(/가입하기/i);
      fireEvent.click(signupButton);
    });
    const user = firebase.firestore().collection("user").doc("id").set.mock
      .calls[0][0];
    expect(user.name).toBe("지정"); // 이름이 "지정"이 맞는지 확인
    expect(user.gender).toBe("여성"); // 성별이 여성이 맞는지 확인
    expect(user.purpose).toStrictEqual(["sporty"]); // 선택한 테마가 스포티 맞는지 확인
    expect(user.matchesPlayed).toBe(0); // 지금까지한 매치가 0인지 확인
    expect(useHistory().push.mock.calls[0][0]).toBe("/"); // 회원가입후 메인페이지 옮겼는지 확인
  });
});
