import { render, screen } from "@testing-library/react";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import AddMatch from "./AddMatch";
import { fireAntEvent } from "../setupTests";
import { CollectionName } from "../collections";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
    });

    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        add: jest.fn().mockResolvedValue({}),
      }),
    });
    window.alert = () => "";
  });

  test("Add Match", async () => {
    render(<AddMatch />);

    await fireAntEvent.actAndSetDate(screen.getByTestId("gameDate"), "Now");
    await fireAntEvent.actAndInput("경기장을 입력해주세요.", "용산 더베이스");
    await fireAntEvent.actAndInput("멤버수를 입력해주세요.", "20");
    await fireAntEvent.actAndSelect(
      screen.getByTestId("teamCountSelect"),
      "3파전"
    );
    await fireAntEvent.actAndSelect(screen.getByTestId("genderSelect"), "혼성");
    await fireAntEvent.actAndSelect(screen.getByTestId("levelSelect"), "중급");
    await fireAntEvent.actAndInput(
      "링크를 입력해주세요.",
      "www.dailyfield.info"
    );
    await fireAntEvent.actAndSelect(
      screen.getByTestId("gameTypeSelect"),
      "매치만"
    );
    await fireAntEvent.actAndSelect(screen.getByTestId("feeSelect"), "4만원");
    await fireAntEvent.actAndCheckbox("canPark");
    await fireAntEvent.actAndCheckbox("canRentShoes");
    await fireAntEvent.actAndInput("매니저를 입력해주세요.", "배성진");
    await fireAntEvent.actAndClick("등록하기");

    const match = firebase
      .firestore()
      .collection(CollectionName.matchesCollectionName).add.mock.calls[0][0];
    expect(match.place).toBe("용산 더베이스"); // 장소가 "용산 더베이스"이 맞는지 확인
    expect(match.memberCount).toBe(20); // 인원수가 20이 맞는지 확인
    expect(match.teamCount).toBe(3); // 팀형태가 3파전이 맞는지 확인
    expect(match.gender).toBe("혼성"); // 성별이 혼성이 맞는지 확인
    expect(match.level).toBe("중급"); // 레벨이 중급이 맞는지 확인
    expect(match.link).toBe("www.dailyfield.info"); // 링크가 "www.dailyfield.info" 맞는지 확인
    expect(match.gameType).toBe("match"); // 게입타입이 match가 맞는지 확인
    expect(match.fee).toBe(40000); // 참가비가 4만원인지 확인
    expect(match.canPark).toBe(false); // 주차 불가능이 맞는지 확인
    expect(match.canRentShoes).toBe(true); // 풋살화 대여 가능이 맞는지 확인
    expect(match.manager).toBe("배성진"); // 매니저가 "배성진"이 맞는지 확인
    expect(useHistory().push.mock.calls[0][0]).toBe("/"); // 등록후 메인페이지 옮겼는지 확인
  });
});
