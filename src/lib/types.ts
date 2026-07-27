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

export interface ConsultationRecord extends ConsultationPayload {
  id: string;
  created_at: string;
  base_fee: number;
  growth_fund: number;
  travel_surcharge: number;
  total_price: number;
  status: string;
}
