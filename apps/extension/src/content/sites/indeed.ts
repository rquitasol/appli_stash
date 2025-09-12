import { JobSiteExtractor } from './extractors';
import { JobData } from '../overlay';

/**
 * Indeed-specific job data extractor
 */
class IndeedExtractor implements JobSiteExtractor {
  /**
   * Returns true if this is an Indeed job page
   */
  canHandle(url: string): boolean {
    return url.includes('indeed.com/job') || 
           url.includes('indeed.com/viewjob') || 
           url.includes('indeed.com/jobs');
  }

  /**
   * Extract job data from Indeed page
   */
  extractJobData(): JobData | null {
    console.log("AppliStash: Extracting Indeed job data");
    
    try {
      // Indeed specific selectors
      // Try several selectors as Indeed's structure changes frequently
      const titleElement = document.querySelector(
        "h1.jobsearch-JobInfoHeader-title, .jobsearch-DesktopStickyContainer-title h1, .jobsearch-JobComponent-embeddedHeader h1, .icl-u-xs-mb--xs"
      );
      const companyElement = document.querySelector(
        ".jobsearch-InlineCompanyRating-companyHeader, .jobsearch-DesktopStickyContainer-companyrating .jobsearch-InlineCompanyRating div:first-child, .jobsearch-JobInfoHeader-subtitle .jobsearch-InlineCompanyRating div:first-child"
      );
      const locationElement = document.querySelector(
        ".jobsearch-JobInfoHeader-subtitle .jobsearch-JobInfoHeader-locationText, .jobsearch-DesktopStickyContainer-companyrating .jobsearch-JobInfoHeader-locationText, [data-testid='job-location']"
      );
      const descriptionElement = document.querySelector(
        "#jobDescriptionText, .jobsearch-jobDescriptionText, [data-testid='jobDescriptionText']"
      );
      
      console.log("AppliStash: Found Indeed job elements", {
        title: titleElement?.textContent,
        company: companyElement?.textContent,
        location: locationElement?.textContent,
        description: descriptionElement ? "Yes" : "No"
      });

      // Extract the text content and clean it up
      const title = titleElement?.textContent?.trim() || "";
      const company = companyElement?.textContent?.trim() || "";
      const location = locationElement?.textContent?.trim() || "";
      const description = descriptionElement?.textContent?.trim() || "";
      const url = window.location.href;
      
      // Try to extract from title if other elements failed
      if (!title || !company) {
        console.log("AppliStash: Missing title or company, trying alternative extraction");
        
        // Try to get job title from document title
        const pageTitle = document.title;
        const parts = pageTitle.split(" - ");
        
        if (parts.length >= 2) {
          const extractedTitle = parts[0].trim();
          const extractedCompany = parts[1].trim().replace(" Careers", "").replace(" Jobs", "");
          
          console.log("AppliStash: Using extracted data from page title:", {
            title: extractedTitle,
            company: extractedCompany
          });
          
          return {
            title: extractedTitle || title,
            company: extractedCompany || company || "Indeed",
            location: location || "Unknown location",
            description: description || "No description available",
            url,
            source: "Indeed"
          };
        }
        
        if (title && !company) {
          return {
            title,
            company: "Unknown Company",
            location: location || "Unknown location",
            description: description || "No description available",
            url,
            source: "Indeed"
          };
        }
        
        return null;
      }
      
      return {
        title,
        company,
        location,
        description,
        url,
        source: "Indeed",
      };
    } catch (error) {
      console.error("AppliStash: Error extracting Indeed job data", error);
      return null;
    }
  }
}

export default new IndeedExtractor();
