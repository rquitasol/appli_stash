import { JobSiteExtractor } from "./extractors";
import { JobData } from "../overlay";

/**
 * LinkedIn-specific job data extractor
 */
class LinkedInExtractor implements JobSiteExtractor {
  /**
   * Returns true if this is a LinkedIn job page
   */
  canHandle(url: string): boolean {
    return url.includes("linkedin.com/jobs");
  }

  /**
   * Extract job data from LinkedIn page
   */
  extractJobData(): JobData | null {
    console.log("AppliStash: Extracting LinkedIn job data");

    // Check if we're on a job collections/search page or individual job view
    if (
      window.location.href.includes("/jobs/collections/") ||
      window.location.href.includes("/jobs/search/")
    ) {
      return this.extractFromJobCard();
    } else {
      return this.extractFromJobView();
    }
  }

  /**
   * Extract from LinkedIn job view page
   */
  private extractFromJobView(): JobData | null {
    try {
      // LinkedIn specific selectors for job view pages
      const titleElement = document.querySelector(
        ".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title-heading"
      );
      const companyElement = document.querySelector(
        ".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .jobs-unified-top-card__subtitle-primary-grouping .app-aware-link"
      );
      const locationElement = document.querySelector(
        ".job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .jobs-unified-top-card__subtitle-primary-grouping .job-card-container__metadata-item"
      );
      const descriptionElement = document.querySelector(
        ".jobs-description__content, .jobs-description, .jobs-box__html-content"
      );

      console.log(
        "AppliStash: Found LinkedIn job view elements",
        {
          title: titleElement?.textContent,
          company: companyElement?.textContent,
          location: locationElement?.textContent,
          description: descriptionElement ? "Yes" : "No",
        }
      );

      const title = titleElement?.textContent?.trim() || "";
      const company =
        companyElement?.textContent?.trim() || "";
      const location =
        locationElement?.textContent?.trim() || "";
      const description =
        descriptionElement?.textContent?.trim() || "";
      const url = window.location.href;

      // If title or company is missing, try alternative extraction
      if (!title || !company) {
        console.log(
          "AppliStash: Missing title or company, trying alternative extraction"
        );

        // Try to get job title from document title
        const pageTitle = document.title;
        const extractedTitle = pageTitle
          .split(" | ")[0]
          .trim();

        if (extractedTitle) {
          console.log(
            "AppliStash: Using extracted title from page title:",
            extractedTitle
          );
          return {
            title: extractedTitle,
            company: company || "LinkedIn",
            location: location || "Unknown location",
            description:
              description || "No description available",
            url,
            source: "LinkedIn",
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
        source: "LinkedIn",
      };
    } catch (error) {
      console.error(
        "AppliStash: Error extracting LinkedIn job view data",
        error
      );
      return null;
    }
  }

  /**
   * Extract from LinkedIn job card (on collections/search pages)
   */
  private extractFromJobCard(): JobData | null {
    try {
      console.log(
        "AppliStash: Attempting to extract job card data"
      );

      // Look for the selected job card (the one that's highlighted)
      const selectedCard = document.querySelector(
        ".job-card-container--selected"
      );

      if (!selectedCard) {
        console.log(
          "AppliStash: No selected job card found"
        );
        // Find the first job card as fallback
        const firstCard = document.querySelector(
          ".job-card-container"
        );

        if (!firstCard) {
          console.log(
            "AppliStash: No job cards found at all"
          );
          return null;
        }

        console.log(
          "AppliStash: Using first job card instead"
        );
        return this.extractDataFromJobCard(
          firstCard as HTMLElement
        );
      }

      return this.extractDataFromJobCard(
        selectedCard as HTMLElement
      );
    } catch (error) {
      console.error(
        "AppliStash: Error extracting LinkedIn job card data",
        error
      );
      return null;
    }
  }

  /**
   * Extract data from a specific LinkedIn job card element
   */
  private extractDataFromJobCard(
    card: HTMLElement
  ): JobData | null {
    const titleElement = card.querySelector(
      ".job-card-list__title"
    );
    const companyElement = card.querySelector(
      ".job-card-container__company-name"
    );
    const locationElement = card.querySelector(
      ".job-card-container__metadata-item"
    );

    // For description, we might not have it in the card
    // Try to get it from the job details panel if it exists
    const descriptionElement = document.querySelector(
      ".jobs-description"
    );

    const title = titleElement?.textContent?.trim() || "";
    const company =
      companyElement?.textContent?.trim() || "";
    const location =
      locationElement?.textContent?.trim() || "";
    const description =
      descriptionElement?.textContent?.trim() ||
      "No description available";

    // Get URL - if it's a job card, try to get the actual job link
    let url = window.location.href;
    const linkElement = card.querySelector(
      "a.job-card-container__link"
    );
    if (linkElement && linkElement.getAttribute("href")) {
      url = new URL(
        linkElement.getAttribute("href") as string,
        window.location.origin
      ).href;
    }

    if (!title || !company) {
      console.log(
        "AppliStash: Missing required job data from card",
        { title, company }
      );
      return null;
    }

    return {
      title,
      company,
      location,
      description,
      url,
      source: "LinkedIn",
    };
  }
}

export default new LinkedInExtractor();
