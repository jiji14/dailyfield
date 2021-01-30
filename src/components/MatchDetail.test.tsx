import { render, screen, waitFor } from "@testing-library/react";
import MatchDetail from "./MatchDetail";

describe("Test", () => {
  test("renders MatchDetail", async () => {
    render(<MatchDetail />);
    await waitFor(async () => {
      //더미데이터 제대로 나오는지 확인
      expect(screen.getByText(/초급레벨/i)).toBeInTheDocument();
      expect(screen.getByText(/풋살화 대여 불가능/i)).toBeInTheDocument();
      expect(screen.getByText(/주차 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/20,000원/i)).toBeInTheDocument();
    });
  });
});
