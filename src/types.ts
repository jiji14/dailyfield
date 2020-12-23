export interface Match {
    id: number,
    date: Date,
    time: string,
    place: string,
    memberCount: number,
    teamCount: number,
    gender: 'male'|'female'|'both',
    level: 'easy'|'medium',
    link: string,
    gameType: 'gx'|'match'|'both',
    fee: number,
    canPark: boolean,
    canRentShoes: boolean,
    manager: string
}