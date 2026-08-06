export interface EventInput {
  title: string;
  description: string;
  category: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  expectedAttendees: number;
  ticketPrice: number;
}