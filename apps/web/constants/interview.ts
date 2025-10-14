// Interview-related constants

export const INTERVIEW_TYPES = [
  'Phone Screening',
  'Technical Interview',
  'Behavioral Interview',
  'System Design',
  'Coding Challenge',
  'Panel Interview',
  'Final Interview',
  'HR Interview',
  'Other',
] as const;

export const INTERVIEW_STATUSES = [
  'Scheduled',
  'Completed',
  'Cancelled',
  'Rescheduled',
  'No Show',
  'Pending',
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

// Form messages
export const FORM_MESSAGES = {
  SUCCESS: {
    CREATE: 'Interview created successfully!',
    UPDATE: 'Interview updated successfully!',
    DELETE: 'Interview deleted successfully!',
  },
  ERROR: {
    CREATE: 'Failed to create interview',
    UPDATE: 'Failed to update interview',
    DELETE: 'Failed to delete interview',
    NETWORK: 'Network error. Please try again.',
    GENERIC: 'An unexpected error occurred',
  },
  CONFIRM: {
    DELETE: 'Are you sure you want to delete this interview? This action cannot be undone.',
  },
} as const;

// Timing constants
export const TIMING = {
  SUCCESS_MESSAGE_DELAY: 1000,
  AUTO_HIDE_MESSAGE: 3000,
} as const;
