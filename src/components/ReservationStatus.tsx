import { Status } from "../types";
import Label from "./Label";

const ReservationStatus = (props: {
  reservationStatus: Status;
}): JSX.Element => {
  const { reservationStatus } = props;

  const renderReservationStatus = () => {
    switch (reservationStatus) {
      case "신청가능":
        return <Label type="primary">신청가능</Label>;
      case "예약신청":
        return <Label type="progress">신청중</Label>;
      case "마감":
        return <Label type="secondary">마감</Label>;
      case "확정":
        return <Label type="success">예약확정</Label>;
      case "취소신청":
        return <Label type="progress">취소중</Label>;
      default:
        return null;
    }
  };

  return <>{renderReservationStatus()}</>;
};

export default ReservationStatus;
