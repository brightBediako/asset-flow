import { describe, expect, it } from "vitest";
import { getPostLoginPath } from "./auth";

describe("getPostLoginPath", () => {
  it("redirects normal users to profile", () => {
    expect(getPostLoginPath("USER")).toBe("/app/profile");
  });

  it("redirects admins to dashboard", () => {
    expect(getPostLoginPath("ORG_ADMIN")).toBe("/app");
    expect(getPostLoginPath("SUPER_ADMIN")).toBe("/app");
  });
});
