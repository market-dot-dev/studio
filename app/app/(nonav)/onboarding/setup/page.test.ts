import { describe, expect, test } from "vitest";
import { getOnboardingPageConfig } from "./page";

const mockOrganization = {
  id: "org-1",
  name: "Test Org",
  description: null,
  businessType: null,
  businessLocation: "US",
  subdomain: "test-org"
};

describe("getOnboardingPageConfig", () => {
  test("creation mode: returns create action", () => {
    const result = getOnboardingPageConfig("create", null);

    expect(result.shouldRedirect).toBe(false);
    expect(result.actionType).toBe("create");
    expect(result.isCreationMode).toBe(true);
  });

  test("creation mode: allows creating secondary org when user has existing org", () => {
    const result = getOnboardingPageConfig("create", mockOrganization);

    expect(result.shouldRedirect).toBe(false);
    expect(result.actionType).toBe("create");
    expect(result.organization).toBe(mockOrganization);
    expect(result.isCreationMode).toBe(true);
  });

  test("update mode: returns update action when org exists", () => {
    const result = getOnboardingPageConfig(undefined, mockOrganization);

    expect(result.shouldRedirect).toBe(false);
    expect(result.actionType).toBe("update");
    expect(result.organization).toBe(mockOrganization);
    expect(result.isCreationMode).toBe(false);
  });

  test("update mode: redirects when no org exists", () => {
    const result = getOnboardingPageConfig(undefined, null);

    expect(result.shouldRedirect).toBe(true);
    expect(result.redirectTo).toBe("/organizations");
  });

  test("handles various falsy mode values", () => {
    // Test empty string
    expect(getOnboardingPageConfig("", mockOrganization).actionType).toBe("update");

    // Test null
    expect(getOnboardingPageConfig(null as any, mockOrganization).actionType).toBe("update");

    // Test other string
    expect(getOnboardingPageConfig("edit", mockOrganization).actionType).toBe("update");
  });
});
