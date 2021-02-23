import { render, screen } from "@testing-library/react";
import Signup from "./Signup";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { fireAntEvent } from "../setupTests";
import { CollectionName } from "../collections";

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
    await fireAntEvent.actAndInput("이름을 입력해주세요.", "지정");
    await fireAntEvent.actAndSetDate(screen.getByTestId("birthDate"), "Today");
    await fireAntEvent.actAndSelect(screen.getByTestId("signUpSelect"), "여성");
    const sporty = screen.getByDisplayValue("sporty");
    userEvent.click(sporty);
    await fireAntEvent.actAndClick("가입하기");

    const user = firebase
      .firestore()
      .collection(CollectionName.usersCollectionName)
      .doc("id").set.mock.calls[0][0];
    expect(user.name).toBe("지정"); // 이름이 "지정"이 맞는지 확인
    expect(user.gender).toBe("여성"); // 성별이 여성이 맞는지 확인
    expect(user.purpose).toStrictEqual(["sporty"]); // 선택한 테마가 스포티 맞는지 확인
    expect(user.matchesPlayed).toBe(0); // 지금까지한 매치가 0인지 확인
    expect(user.privacyPolicy).toBe(true); // 개인정보보호법에 동의했는지 확인
    expect(user.serviceTerm).toBe(true); // 서비스이용약관에 동의했는지 확인
    expect(useHistory().push.mock.calls[0][0]).toBe("/"); // 회원가입후 메인페이지 옮겼는지 확인
  });
});
