export interface Match {
  dateTime: Date;
  place: string;
  memberCount: number;
  teamCount: number;
  gender: "남성" | "여성" | "혼성";
  level: "초급" | "중급" | "고급";
  link: string;
  gameType: "gx" | "match" | "gx+match";
  fee: number;
  canPark: boolean;
  canRentShoes: boolean;
  manager: string;
}

export interface Player {
  name: string;
  gender: "남성" | "여성";
  phoneNumber: string;
  birthDate: Date;
  matchesPlayed: number;
  status?: "예약신청" | "취소신청" | "확정";
}
