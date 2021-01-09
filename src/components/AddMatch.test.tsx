import { act, fireEvent, render, screen } from "@testing-library/react";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import AddMatch from "./AddMatch";

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

  test("Add Match", async () => {
    render(<AddMatch />);

    await act(async () => {
      const gameDate = screen.getByTestId("gameDate");
      fireEvent.mouseDown(gameDate);
    });

    await act(async () => {
      const today = screen.getByText("Today");
      fireEvent.click(today);
    });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("timeSelect").firstElementChild);
    });
    await act(async () => {
      const time = screen.getByTitle("14시");
      fireEvent.click(time);
    });

    await act(async () => {
      const place = screen.getByPlaceholderText("경기장을 입력해주세요.");
      fireEvent.change(place, { target: { value: "용산 더베이스" } });
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen.getByTestId("memberCountSelect").firstElementChild
      );
    });
    await act(async () => {
      const memberCount = screen.getByTitle("20명");
      fireEvent.click(memberCount);
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen.getByTestId("teamCountSelect").firstElementChild
      );
    });
    await act(async () => {
      const memberCount = screen.getByTitle("3파전");
      fireEvent.click(memberCount);
    });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("genderSelect").firstElementChild);
    });
    await act(async () => {
      const gender = screen.getByTitle("혼성");
      fireEvent.click(gender);
    });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("levelSelect").firstElementChild);
    });
    await act(async () => {
      const levelSelect = screen.getByTitle("중급");
      fireEvent.click(levelSelect);
    });

    await act(async () => {
      const link = screen.getByPlaceholderText("링크를 입력해주세요.");
      fireEvent.change(link, { target: { value: "www.dailyfield.info" } });
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen.getByTestId("gameTypeSelect").firstElementChild
      );
    });
    await act(async () => {
      const gameType = screen.getByTitle("매치만");
      fireEvent.click(gameType);
    });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("feeSelect").firstElementChild);
    });
    await act(async () => {
      const fee = screen.getByTitle("4만원");
      fireEvent.click(fee);
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen.getByTestId("canParkSelect").firstElementChild
      );
    });
    await act(async () => {
      const canPark = screen.getByTitle("불가능");
      fireEvent.click(canPark);
    });

    await act(async () => {
      const manager = screen.getByPlaceholderText("매니저를 입력해주세요.");
      fireEvent.change(manager, {
        target: { value: "배성진" },
      });
    });

    await act(async () => {
      const addButton = screen.getByText(/등록하기/i);
      fireEvent.click(addButton);
    });

    const match = firebase.firestore().collection("matches").doc().set.mock
      .calls[0][0];
    console.log(match);
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
