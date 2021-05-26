import { render, screen, fireEvent, act } from "@testing-library/react";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import AddMatch from "./AddMatch";
import { fireAntEvent } from "../setupTests";
import { CollectionName } from "../collections";

describe("Test", () => {
  beforeEach(() => {
    (firebase.auth as unknown as jest.Mock).mockReturnValue({
      currentUser: {},
    });
    window.alert = () => "";
  });

  test("Add Match", async () => {
    (firebase.firestore as unknown as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        add: jest.fn().mockResolvedValue({}),
      }),
    });

    render(<AddMatch />);

    await fireAntEvent.actAndSetDate(screen.getByTestId("gameDate"), "Now");
    await fireAntEvent.actAndInput("제목을 입력해주세요.", "1자리 남음");
    await fireAntEvent.actAndInput("경기장을 입력해주세요.", "용산 더베이스");
    await fireAntEvent.actAndInput("멤버수를 입력해주세요.", "20");
    await fireAntEvent.actAndSelect(screen.getByTestId("genderSelect"), "혼성");
    await fireAntEvent.actAndInput(
      "링크를 입력해주세요.",
      "www.dailyfield.info"
    );
    await fireAntEvent.actAndSelect(
      screen.getByTestId("gameTypeSelect"),
      "매치만"
    );
    await fireAntEvent.actAndInput("금액을 입력해주세요.", "40000");
    await fireAntEvent.actAndCheckbox("canPark");
    await fireAntEvent.actAndCheckbox("isRecurringClass");
    await fireAntEvent.actAndInput("매니저를 입력해주세요.", "배성진");
    await act(async () => {
      const input = screen.getByTestId("guideline");
      fireEvent.change(input, { target: { value: "# 매치안내" } });
    });
    await fireAntEvent.actAndClick("등록하기");

    const match = firebase
      .firestore()
      .collection(CollectionName.matchesCollectionName).add.mock.calls[0][0];
    expect(match.title).toBe("1자리 남음"); // 장소가 "1자리 남음"이 맞는지 확인
    expect(match.place).toBe("용산 더베이스"); // 장소가 "용산 더베이스"이 맞는지 확인
    expect(match.memberCount).toBe(20); // 인원수가 20이 맞는지 확인
    expect(match.gender).toBe("혼성"); // 성별이 혼성이 맞는지 확인
    expect(match.link).toBe("www.dailyfield.info"); // 링크가 "www.dailyfield.info" 맞는지 확인
    expect(match.gameType).toBe("match"); // 게임타입이 match가 맞는지 확인
    expect(match.fee).toBe(40000); // 참가비가 4만원인지 확인
    expect(match.canPark).toBe(false); // 주차 불가능이 맞는지 확인
    expect(match.isRecurringClass).toBe(true); // 기획반이 맞는지 확인
    expect(match.manager).toBe("배성진"); // 매니저가 "배성진"이 맞는지 확인
    expect(match.guideline).toBe("# 매치안내"); // 매치 내용 잘 나오는지 확인
    expect(useHistory().push.mock.calls[0][0]).toBe("/"); // 등록후 메인페이지 옮겼는지 확인
  });

  test("Update Match", async () => {
    (firebase.firestore as unknown as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockImplementation(() => {
              return {
                dateTime: {
                  toDate: jest.fn().mockReturnValue(new Date("2021-01-01")),
                },
                title: "1자리 남음",
                place: "용산 더베이스",
                memberCount: 15,
                gender: "여성",
                link: "www.naver.com",
                gameType: "match",
                fee: 20000,
                canPark: true,
                isRecurringClass: false,
                manager: "배성진",
              };
            }),
          }),
          set: jest.fn().mockResolvedValue(null),
        }),
      }),
    });

    render(<AddMatch id="match123" />);
    await fireAntEvent.actAndSelect(
      screen.getByTestId("gameTypeSelect"),
      "GX만"
    );
    const input = screen.getByTestId("feeInput");
    await fireEvent.change(input, { target: { value: "10000" } });
    await fireAntEvent.actAndCheckbox("isRecurringClass");
    await fireAntEvent.actAndClick("수정하기");
    const match = firebase
      .firestore()
      .collection(CollectionName.matchesCollectionName)
      .doc("id").set.mock.calls[0][0];
    expect(match.fee).toBe(10000); // 참가비가 1만원인지 확인
    expect(match.gameType).toBe("gx"); // 게임타입이 gx가 맞는지 확인
    expect(match.isRecurringClass).toBe(true); // 게임타입이 gx가 맞는지 확인
    expect(useHistory().push.mock.calls[0][0]).toBe("/"); // 등록후 메인페이지 옮겼는지 확인
  });

  test("Delete Match", async () => {
    (firebase.firestore as unknown as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockImplementation(() => {
              return {
                dateTime: {
                  toDate: jest.fn().mockReturnValue(new Date("2021-01-01")),
                },
                title: "1자리 남음",
                place: "용산 더베이스",
                memberCount: 15,
                gender: "여성",
                link: "www.naver.com",
                gameType: "match",
                fee: 20000,
                canPark: true,
                isRecurringClass: false,
                manager: "배성진",
              };
            }),
          }),
          delete: jest.fn(),
        }),
      }),
    });
    window.confirm = () => true;

    render(<AddMatch id="match123" />);
    await fireAntEvent.actAndClick("삭제하기");
    expect(firebase.firestore().collection().doc).toHaveBeenCalledWith(
      "match123"
    );
    expect(firebase.firestore().collection().doc().delete).toHaveBeenCalled();
  });
});
