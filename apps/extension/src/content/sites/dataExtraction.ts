import { JobData } from "../overlay";
import linkedinExtractor from "./linkedin";
import indeedExtractor from "./indeed";
import glassdoorExtractor from "./glassdoor";

// Array of all registered extractors
const extractors = [
  linkedinExtractor,
  indeedExtractor,
  glassdoorExtractor,
];

/**
 * Get job data from the current page.
 * This function will determine the job site and use the appropriate extractor.
 */
export const getJobData = (): JobData | null => {
  const url = window.location.href;
  console.log("AppliStash: Getting job data for URL", url);

  // Find the first extractor that can handle this URL
  for (const extractor of extractors) {
    if (extractor.canHandle(url)) {
      console.log(
        "AppliStash: Found matching extractor for URL"
      );
      return extractor.extractJobData();
    }
  }

  console.log("AppliStash: No extractor found for URL");
  return null;
};

/**
 * Determines if the current page is a job page by checking if any extractor can handle it.
 */
export const isJobPage = (): boolean => {
  const url = window.location.href;
  return extractors.some((extractor) =>
    extractor.canHandle(url)
  );
};
