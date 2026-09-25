import { describe, it, expect } from "vitest";
import { generateDemoTracking, DEMO_HINT_CODES } from "@/lib/demo-tracking";
import { trackingCodeSchema, contactSchema, parcelCreateSchema } from "@/lib/validations";
import { completedSteps, STATUS_ORDER } from "@/lib/status";

describe("generateDemoTracking", () => {
  it("is deterministic: same code → same timeline", () => {
    const a = generateDemoTracking("LMG-TEST123");
    const b = generateDemoTracking("LMG-TEST123");
    expect(a).toEqual(b);
  });

  it("always returns a found result with at least one event", () => {
    for (const code of ["LMG-AAAA", "LMG-BBBB", "LMG-CCCC", "LMG-DDDD"]) {
      const r = generateDemoTracking(code);
      expect(r.found).toBe(true);
      expect(r.source).toBe("demo");
      expect(r.events.length).toBeGreaterThanOrEqual(1);
      expect(r.events.length).toBeLessThanOrEqual(5);
    }
  });

  it("last event status matches result status", () => {
    const r = generateDemoTracking("LMG-XYZ789");
    expect(r.status).toBe(r.events[r.events.length - 1].status);
  });

  it("supports French labels", () => {
    const r = generateDemoTracking("LMG-DEMO001", "fr");
    expect(r.events.some((e) => /douane|livraison|transit/i.test(e.description ?? ""))).toBe(true);
  });

  it("hint codes all produce valid timelines", () => {
    for (const code of DEMO_HINT_CODES) {
      const r = generateDemoTracking(code);
      expect(r.found).toBe(true);
    }
  });
});

describe("trackingCodeSchema", () => {
  it("accepts standard codes", () => {
    expect(trackingCodeSchema.safeParse("LMG-AB12CD34").success).toBe(true);
    expect(trackingCodeSchema.safeParse("123456789").success).toBe(true);
  });
  it("rejects invalid codes", () => {
    expect(trackingCodeSchema.safeParse("AB").success).toBe(false);
    expect(trackingCodeSchema.safeParse("LMG ABC!").success).toBe(false);
    expect(trackingCodeSchema.safeParse("").success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    const res = contactSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      company: "",
      destination: "",
      message: "I need shipping to Europe please",
    });
    expect(res.success).toBe(true);
  });
  it("rejects invalid email", () => {
    const res = contactSchema.safeParse({
      name: "John Doe",
      email: "not-an-email",
      message: "Something long enough",
    });
    expect(res.success).toBe(false);
  });
});

describe("parcelCreateSchema", () => {
  it("defaults status to CREATED", () => {
    const res = parcelCreateSchema.safeParse({
      recipient: "Jane",
      destination: "Paris, France",
      service: "PARCEL",
    });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.status).toBe("CREATED");
  });
  it("rejects bad service", () => {
    const res = parcelCreateSchema.safeParse({
      recipient: "Jane",
      destination: "Paris, France",
      service: "UNKNOWN_SERVICE",
    });
    expect(res.success).toBe(false);
  });
});

describe("completedSteps", () => {
  it("maps statuses to timeline steps", () => {
    expect(completedSteps("CREATED")).toBe(1);
    expect(completedSteps("DELIVERED")).toBe(STATUS_ORDER.length);
    expect(completedSteps("EXCEPTION")).toBe(1);
  });
});
