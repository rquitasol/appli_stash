import { ApplicationStatus } from "./ApplicationStatus";
import { ApplicationPriority } from "./ApplicationPriority";

export interface Application {
  id?: string;
  user_id: string;
  company_name: string;
  url: string;
  status: ApplicationStatus;
  position: string;
  priority_level: ApplicationPriority;
  notes: string;
}
