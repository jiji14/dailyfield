import { render, screen, waitFor } from "@testing-library/react";
import Admin from "./Admin";
import firebase from "firebase";

describe("Test", () => {
  beforeEach(() => {
    const fakeUser = {} as firebase.User;
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      onAuthStateChanged: (callback: (user: firebase.User) => void) => {
        callback(fakeUser);
      },
    });

    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockReturnValue({
              isAdmin: true,
              birthDate: {
                toDate: jest.fn().mockReturnValue(new Date("2021-01-01")),
              },
              name: "이지정",
              gender: "여성",
              phoneNumber: "+821090143492",
              matchesPlayed: 0,
              purpose: [],
            }),
            id: "test12345",
          }),
          collection: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              docs: [
                {
                  data: jest.fn().mockReturnValue({
                    status: "예약신청",
                  }),
                  id: "test12345",
                },
              ],
            }),
          }),
        }),
      }),
    });
  });

  test("Admin Page", async () => {
    render(<Admin />);
    await waitFor(async () => {
      expect(screen.getByText("01090143492")).toBeInTheDocument(); //전화번호 양식 제대로 나오는지 확인
      expect(screen.getByText("신청승인")).toBeInTheDocument(); //예약신청일때 신청승인 버튼 나오는지 확인
    });
  });
});
