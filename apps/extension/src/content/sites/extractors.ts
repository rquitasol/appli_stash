import { JobData } from "../overlay";

/**
 * Interface for job site data extractors
 */
export interface JobSiteExtractor {
  /**
   * Returns true if this extractor can handle the given URL
   */
  canHandle(url: string): boolean;
  
  /**
   * Extract job data from the current page
   */
  extractJobData(): JobData | null;
}
