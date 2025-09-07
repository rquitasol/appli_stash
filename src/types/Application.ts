import { ApplicationStatus } from "./ApplicationStatus";

export interface Application {
  id?: string;
  user_id: string;
  company_name: string;
  url: string;
  status: ApplicationStatus;
  position: string;
  priority_level: string;
  notes: string;
}
