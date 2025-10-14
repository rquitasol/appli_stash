import { Interview } from '../components/forms/InterviewForm';

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export function validateInterview(interview: Partial<Interview>): Record<string, string> {
  const errors: Record<string, string> = {};

  // Type validation
  if (!interview.type || interview.type.trim() === '') {
    errors.type = 'Interview type is required';
  }

  // Schedule validation
  if (!interview.schedule || interview.schedule.trim() === '') {
    errors.schedule = 'Interview schedule is required';
  } else {
    const scheduleDate = new Date(interview.schedule);
    if (isNaN(scheduleDate.getTime())) {
      errors.schedule = 'Please enter a valid date and time';
    }
  }

  // Interviewer validation
  if (!interview.interviewer || interview.interviewer.trim() === '') {
    errors.interviewer = 'Interviewer name is required';
  } else if (interview.interviewer.trim().length < 2) {
    errors.interviewer = 'Interviewer name must be at least 2 characters';
  }

  // Status validation
  if (!interview.status || interview.status.trim() === '') {
    errors.status = 'Interview status is required';
  }

  // Notes validation (optional but with length limit)
  if (interview.notes && interview.notes.length > 1000) {
    errors.notes = 'Notes must be less than 1000 characters';
  }

  return errors;
}

export function validateField(
  fieldName: string,
  value: any,
  interview: Partial<Interview>
): string | undefined {
  const allErrors = validateInterview({ ...interview, [fieldName]: value });
  return allErrors[fieldName];
}
