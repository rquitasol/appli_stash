export interface JobSite {
  name: string;
  hostname: string;
  pattern: RegExp;
  selectors: {
    jobTitle?: string;
    company?: string;
    location?: string;
    description?: string;
    applyButton?: string;
    container?: string;
  };
}

// Define the job sites we support
export const jobSites: JobSite[] = [
  {
    name: "LinkedIn",
    hostname: "linkedin.com",
    pattern:
      /linkedin\.com\/jobs\/(view|collections|search|currentJob)/,
    selectors: {
      jobTitle:
        ".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title-heading",
      company:
        ".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .jobs-unified-top-card__subtitle-primary-grouping .app-aware-link",
      location:
        ".job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .jobs-unified-top-card__subtitle-primary-grouping .job-card-container__metadata-item",
      description:
        ".jobs-description__content, .jobs-description, .jobs-box__html-content",
      applyButton: ".jobs-apply-button",
      container: "body",
    },
  },
  {
    name: "Indeed",
    hostname: "indeed.com",
    pattern: /indeed\.com\/viewjob|indeed\.com\/job\//,
    selectors: {
      jobTitle: ".jobsearch-JobInfoHeader-title",
      company:
        ".jobsearch-CompanyInfoContainer .jobsearch-InlineCompanyRating div:first-child",
      location:
        ".jobsearch-JobInfoHeader-subtitle .jobsearch-JobInfoHeader-locationText",
      description: "#jobDescriptionText",
      applyButton: ".jobsearch-IndeedApplyButton-newDesign",
      container: ".jobsearch-ViewJobLayout-innerContent",
    },
  },
];

/**
 * Detects which job site we're currently on
 */
export function detectSite(url: string): JobSite | null {
  for (const site of jobSites) {
    if (site.pattern.test(url)) {
      return site;
    }
  }
  return null;
}
