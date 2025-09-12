import { isJobPage } from './sites/dataExtraction';

/**
 * Check if the current page is a job site we can handle
 */
export const isJobSite = (): boolean => {
  const url = window.location.href;
  
  // Log for debugging
  console.log("AppliStash: Checking if is job site:", url);
  
  // Use our new isJobPage function from the extractor system
  const result = isJobPage();
  
  console.log("AppliStash: Is job site result:", result);
  return result;
};
