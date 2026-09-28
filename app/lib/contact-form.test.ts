import { describe, expect, it } from "vitest";
import {
  EMPTY_FORM,
  OPEN_SERVICE,
  SERVICE_OPTIONS,
  isBudgetInput,
  validateForm,
  type FormState,
} from "./contact-form";

/**
 * A named service, as opposed to the open-ended one.
 *
 * Destructured with a default because `noUncheckedIndexedAccess` types an index
 * read as `string | undefined`. The array is a literal in the module under
 * test, so the first entry always exists — the default is here to satisfy the
 * type, not to paper over a real possibility.
 */
const [TYPED_SERVICE = ""] = SERVICE_OPTIONS;

/** A form that passes every rule, so each test can break exactly one thing. */
function validForm(overrides: Partial<FormState> = {}): FormState {
  return {
    name: "Aarav Shrestha",
    email: "aarav@example.com",
    service: TYPED_SERVICE,
    budget: "50000",
    idea: "An Odoo module for leave approvals.",
    ...overrides,
  };
}

describe("validateForm", () => {
  it("accepts a fully populated form", () => {
    expect(validateForm(validForm())).toEqual({});
  });

  it("rejects every required field when the form is empty", () => {
    // A visitor has to pick a service, but a "Others" enquiry legitimately
    // has no budget — so the empty form is not five errors.
    const errors = validateForm({ ...EMPTY_FORM, service: TYPED_SERVICE });

    expect(errors.name).toBe("This field is required.");
    expect(errors.email).toBe("This field is required.");
    expect(errors.idea).toBe("This field is required.");
    expect(errors.budget).toBe("Please give a rough budget.");
    expect(errors.service).toBeUndefined();
  });

  it("treats whitespace as empty", () => {
    // Without .trim() a field holding only spaces reads as filled and the form
    // submits with a blank name.
    const errors = validateForm(
      validForm({ name: "   ", idea: "\n\t ", email: "  " }),
    );

    expect(errors.name).toBe("This field is required.");
    expect(errors.idea).toBe("This field is required.");
    expect(errors.email).toBe("This field is required.");
  });

  describe("email", () => {
    it("rejects addresses with no @ or no dot", () => {
      expect(validateForm(validForm({ email: "aarav" })).email).toBe(
        "Enter a valid email address.",
      );
      expect(validateForm(validForm({ email: "aarav@example" })).email).toBe(
        "Enter a valid email address.",
      );
    });

    it("rejects an address with internal whitespace", () => {
      expect(validateForm(validForm({ email: "aarav @example.com" })).email).toBe(
        "Enter a valid email address.",
      );
    });

    it("accepts the shapes a stricter regex would wrongly reject", () => {
      // Single-letter local parts and two-letter TLDs are real. A tight
      // pattern would block these visitors and they would never hear back.
      const valid = ["a@b.co", "first.last+tag@sub.example.co.uk"];

      for (const email of valid) {
        expect(validateForm(validForm({ email })).email).toBeUndefined();
      }
    });

    it("reports 'required' rather than stacking both errors on a blank field", () => {
      const errors = validateForm(validForm({ email: "" }));

      expect(errors.email).toBe("This field is required.");
    });
  });

  describe("budget", () => {
    it("is required for a named service", () => {
      const errors = validateForm(validForm({ budget: "" }));

      expect(errors.budget).toBe("Please give a rough budget.");
    });

    it(`is not required for "${OPEN_SERVICE}"`, () => {
      // The whole point of the option: someone who does not yet know the cost
      // should still be able to get in touch.
      const errors = validateForm(
        validForm({ service: OPEN_SERVICE, budget: "" }),
      );

      expect(errors.budget).toBeUndefined();
      expect(errors).toEqual({});
    });
  });
});

describe("isBudgetInput", () => {
  it("accepts digits, decimals and a single decimal point", () => {
    const valid = ["", "0", "7", "100", "10.5", "5.", ".", "0.01"];

    for (const value of valid) {
      expect(isBudgetInput(value), value).toBe(true);
    }
  });

  it("rejects letters, symbols and a second decimal point", () => {
    // `.` and `5.` are accepted above so a half-typed number is not fought
    // mid-keystroke; `1.2.3` is genuinely nonsense.
    const invalid = ["a", "10k", "1.2.3", "10,000", "-5", "1 000", "NPR 5"];

    for (const value of invalid) {
      expect(isBudgetInput(value), value).toBe(false);
    }
  });
});

describe("SERVICE_OPTIONS", () => {
  it("includes the open-ended option", () => {
    // The budget exemption is keyed on this exact string, so if the option is
    // ever renamed the exemption has to fail loudly rather than silently start
    // demanding a budget from every "Others" enquiry.
    expect(SERVICE_OPTIONS).toContain(OPEN_SERVICE);
  });
});
