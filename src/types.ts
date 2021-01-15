export type Gender = "남성" | "여성" | "혼성";
export type Level = "초급" | "중급" | "고급";
export type GameType = "gx" | "match" | "gx+match";
export type Status = "예약신청" | "취소신청" | "확정";

export interface Match {
  dateTime: Date | null;
  place: string;
  memberCount: number;
  teamCount: number;
  gender: Gender;
  level: Level;
  link: string;
  gameType: GameType;
  fee: number;
  canPark: boolean;
  canRentShoes: boolean;
  manager: string;
}

export interface Player {
  name: string;
  gender: Gender;
  phoneNumber: string;
  birthDate?: Date;
  matchesPlayed: number;
  purpose?: string[];
  status?: Status;
}
