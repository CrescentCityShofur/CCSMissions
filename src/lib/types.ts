export type MeetingType = "virtual" | "onsite";

export interface ConsultationPayload {
  stakeholderName: string;
  stakeholderEmail: string;
  stakeholderPhone: string;
  meetingType: MeetingType;
  siteAddress: string;
  preferredDate: string;
  preferredTime: string;
}
