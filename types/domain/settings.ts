export interface DailySettings {
  dailySendMaxCount: number;
  dailyJoinGroupMaxCount: number;
  attachmentMaxSize: number;
  attachmentPerTimeLimit: number;
  sendMessageInterval: [number, number];
}

export interface DailyUsed {
  dailySentCount: number;
  dailyJoinGroupCount: number;
}
