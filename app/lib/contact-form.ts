/**
 * Contact form types, constants and validation, with no React in it.
 *
 * This exists so the rules can be tested without a DOM. `Contact.tsx` used to
 * declare its own `FormState` and `validateForm` inline, which meant the only
 * way to check a rule change was to submit the form by hand — and the email
 * regex and the budget requirement are exactly the kind of thing that gets
 * "tidied up" without anyone noticing it stopped accepting valid input.
 */

export type FormState = {
  name: string;
  email: string;
  service: string;
  budget: string;
  idea: string;
};

export type FormErrors = Partial<Record<keyof FormState, string>>;

/** Submit state of the form itself. `""` is idle. */
export type Status = "" | "sending" | "success" | "error";

export const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  service: "",
  budget: "",
  idea: "",
};

/**
 * The one option that skips the budget question. A visitor who picks "Others"
 * may not know what their project costs yet, and blocking the form on it would
 * lose exactly the enquiries that need a conversation first.
 */
export const OPEN_SERVICE = "Others";

export const SERVICE_OPTIONS = [
  "Odoo / ERP Development",
  "Web Development",
  "Mobile Application",
  OPEN_SERVICE,
];

/**
 * Deliberately permissive: this is a shape check, not delivery.
 *
 * The strict grammar (`user@sub.domain.tld`) rejects real, valid addresses —
 * `a@b.co`, addresses with `+` or apostrophes, and anything at an internal
 * domain. A stricter pattern would only ever reject a visitor who then never
 * hears back, so the looser one is the safer failure.
 */
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

/**
 * Whether a typed value is acceptable as a budget, or should be ignored.
 *
 * Digits with at most one decimal point, so the field can hold a real range
 * like `10.5` while staying a number. `.` and `5.` are allowed mid-entry on
 * purpose: rejecting the keystroke that types them would make the field feel
 * broken, and a half-typed value is corrected by the next keystroke anyway.
 */
export function isBudgetInput(value: string): boolean {
  if (value === "") return true;
  return /^\d*\.?\d*$/.test(value);
}

export function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};
  const required: (keyof FormState)[] = ["name", "email", "service", "idea"];

  for (const field of required) {
    if (!data[field].trim()) {
      errors[field] = "This field is required.";
    }
  }

  // Guarded on the trimmed value so a blank field reports "required" rather
  // than two errors stacked on one input. The guard has to trim: `"  "` is
  // truthy, so testing the raw value let a whitespace-only email fall through
  // to the pattern check and overwrite "required" with a second complaint
  // about the same field.
  if (data.email.trim() && !EMAIL_PATTERN.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.service !== OPEN_SERVICE && !data.budget.trim()) {
    errors.budget = "Please give a rough budget.";
  }

  return errors;
}
