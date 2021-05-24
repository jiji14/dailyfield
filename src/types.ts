export type Gender = "남성" | "여성";
export type GameType = "gx" | "match" | "gx+match";
export type Status = "신청가능" | "예약신청" | "취소신청" | "확정" | "마감";

export interface Match {
  id?: string;
  dateTime: Date | null;
  title: string;
  place: string;
  memberCount: number;
  memberType: string;
  link: string;
  gameType: GameType;
  fee: number;
  canPark: boolean;
  isRecurringClass: boolean;
  manager: string;
  guideline: string;
}

export interface Player {
  name: string;
  gender: Gender;
  phoneNumber: string;
  birthDate?: Date;
  matchesPlayed: number;
  purpose?: string[];
  privacyPolicy?: boolean;
  termsOfService?: boolean;
  status?: Status;
}
