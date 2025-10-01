import { JobSiteExtractor } from './extractors';
import { JobData } from '../overlay';

/**
 * Glassdoor-specific job data extractor
 */
class GlassdoorExtractor implements JobSiteExtractor {
  /**
   * Returns true if this is a Glassdoor job page
   */
  canHandle(url: string): boolean {
    return url.includes('glassdoor.com/job') || url.includes('glassdoor.com/Job');
  }

  /**
   * Extract job data from Glassdoor page
   */
  extractJobData(): JobData | null {
    console.log('AppliStash: Extracting Glassdoor job data');

    try {
      // Glassdoor specific selectors
      const titleElement = document.querySelector(
        "[data-test='job-title'], .JobDetails_jobTitle__Rw_gn, .css-1vg6q84, .e11nt52q1"
      );
      const companyElement = document.querySelector(
        "[data-test='employer-name'], .JobDetails_employerName__Taztg, .css-16nw49e, .e11nt52q4"
      );
      const locationElement = document.querySelector(
        "[data-test='location'], .JobDetails_location__N_iYE, .css-56kyx5, .e11nt52q5"
      );
      const descriptionElement = document.querySelector(
        ".JobDetails_jobDescriptionWrapper__BTDTA, [data-test='jobDesc'], .desc"
      );

      console.log('AppliStash: Found Glassdoor job elements', {
        title: titleElement?.textContent,
        company: companyElement?.textContent,
        location: locationElement?.textContent,
        description: descriptionElement ? 'Yes' : 'No',
      });

      // Extract the text content and clean it up
      const title = titleElement?.textContent?.trim() || '';
      const company = companyElement?.textContent?.trim() || '';
      const location = locationElement?.textContent?.trim() || '';
      const description = descriptionElement?.textContent?.trim() || '';
      const url = window.location.href;

      // If title or company is missing, try alternative extraction
      if (!title || !company) {
        console.log('AppliStash: Missing title or company, trying alternative extraction');

        // Try to get job title from document title
        const pageTitle = document.title;
        const parts = pageTitle.split(' at ');

        if (parts.length >= 2) {
          const extractedTitle = parts[0].trim().replace(' Job', '');
          let extractedCompany = parts[1].trim();

          // If company has location, remove it
          if (extractedCompany.includes(' in ')) {
            extractedCompany = extractedCompany.split(' in ')[0].trim();
          }

          console.log('AppliStash: Using extracted data from page title:', {
            title: extractedTitle,
            company: extractedCompany,
          });

          return {
            title: extractedTitle || title,
            company: extractedCompany || company || 'Glassdoor',
            location: location || 'Unknown location',
            description: description || 'No description available',
            url,
            source: 'Glassdoor',
          };
        }

        if (!title && !company) {
          console.log('AppliStash: Could not extract job data from Glassdoor');
          return null;
        }
      }

      return {
        title,
        company,
        location,
        description,
        url,
        source: 'Glassdoor',
      };
    } catch (error) {
      console.error('AppliStash: Error extracting Glassdoor job data', error);
      return null;
    }
  }
}

export default new GlassdoorExtractor();
