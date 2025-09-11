import { JobSite } from "../siteDetection";
import { JobData } from "../overlay";

/**
 * Extracts job data from a job listing page based on the site selectors
 */
export function extractJobData(
  site: JobSite
): JobData | null {
  try {
    // Special handling for LinkedIn collections/search pages
    if (
      site.name === "LinkedIn" &&
      window.location.href.includes("/jobs/collections/")
    ) {
      return extractLinkedInJobCardData();
    }

    // Get the job title
    const titleElement = document.querySelector(
      site.selectors.jobTitle || ""
    );
    const title = titleElement
      ? titleElement.textContent?.trim() || ""
      : "";

    // Get the company name
    const companyElement = document.querySelector(
      site.selectors.company || ""
    );
    const company = companyElement
      ? companyElement.textContent?.trim() || ""
      : "";

    // Get the location
    const locationElement = document.querySelector(
      site.selectors.location || ""
    );
    const location = locationElement
      ? locationElement.textContent?.trim() || ""
      : "";

    // Get the job description
    const descriptionElement = document.querySelector(
      site.selectors.description || ""
    );
    const description = descriptionElement
      ? descriptionElement.textContent?.trim() || ""
      : "";

    // Get the current URL
    const url = window.location.href;

    if (!title || !company) {
      console.error(
        "AppliStash: Could not extract required job data (title or company)"
      );
      return null;
    }

    return {
      title,
      company,
      location,
      description,
      url,
      source: site.name,
    };
  } catch (error) {
    console.error(
      "AppliStash: Error extracting job data",
      error
    );
    return null;
  }
}

/**
 * Function to extract LinkedIn job data with specific handling
 */
/**
 * Extract data from LinkedIn job cards on search/collection pages
 */
export function extractLinkedInJobCardData(): JobData | null {
  try {
    console.log(
      "AppliStash: Attempting to extract job card data"
    );

    // Look for the selected job card (the one that's highlighted)
    const selectedCard = document.querySelector(
      ".job-card-container--selected"
    );

    if (!selectedCard) {
      console.log("AppliStash: No selected job card found");
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
      return extractDataFromJobCard(
        firstCard as HTMLElement
      );
    }

    return extractDataFromJobCard(
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
function extractDataFromJobCard(
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

  const title = titleElement
    ? titleElement.textContent?.trim() || ""
    : "";
  const company = companyElement
    ? companyElement.textContent?.trim() || ""
    : "";
  const location = locationElement
    ? locationElement.textContent?.trim() || ""
    : "";
  const description = descriptionElement
    ? descriptionElement.textContent?.trim() || ""
    : "No description available";

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

export function extractLinkedInJobData(): JobData | null {
  try {
    console.log("AppliStash: Extracting LinkedIn job data");

    // LinkedIn specific selectors - try multiple variations for different page layouts
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

    console.log("AppliStash: Found elements", {
      title: titleElement?.textContent,
      company: companyElement?.textContent,
      location: locationElement?.textContent,
      description: descriptionElement ? "Yes" : "No",
    });

    const title = titleElement
      ? titleElement.textContent?.trim() || ""
      : "";
    const company = companyElement
      ? companyElement.textContent?.trim() || ""
      : "";
    const location = locationElement
      ? locationElement.textContent?.trim() || ""
      : "";
    const description = descriptionElement
      ? descriptionElement.textContent?.trim() || ""
      : "";
    const url = window.location.href;

    console.log("AppliStash: Extracted job data", {
      title,
      company,
      location,
      descriptionLength: description.length,
    });

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

      // Try to get company from meta tags or other elements
      const metaCompany = document
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute("content");

      if (extractedTitle) {
        console.log(
          "AppliStash: Using extracted title from page title:",
          extractedTitle
        );
        return {
          title: extractedTitle,
          company: company || metaCompany || "LinkedIn",
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
      "AppliStash: Error extracting LinkedIn job data",
      error
    );
    return null;
  }
}

/**
 * Function to extract Indeed job data with specific handling
 */
export function extractIndeedJobData(): JobData | null {
  try {
    // Indeed specific selectors
    const titleElement = document.querySelector(
      ".jobsearch-JobInfoHeader-title"
    );
    const companyElement = document.querySelector(
      ".jobsearch-CompanyInfoContainer .jobsearch-InlineCompanyRating div:first-child"
    );
    const locationElement = document.querySelector(
      ".jobsearch-JobInfoHeader-subtitle .jobsearch-JobInfoHeader-locationText"
    );
    const descriptionElement = document.querySelector(
      "#jobDescriptionText"
    );

    const title = titleElement
      ? titleElement.textContent?.trim() || ""
      : "";
    const company = companyElement
      ? companyElement.textContent?.trim() || ""
      : "";
    const location = locationElement
      ? locationElement.textContent?.trim() || ""
      : "";
    const description = descriptionElement
      ? descriptionElement.textContent?.trim() || ""
      : "";
    const url = window.location.href;

    if (!title || !company) {
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
    console.error(
      "AppliStash: Error extracting Indeed job data",
      error
    );
    return null;
  }
}
