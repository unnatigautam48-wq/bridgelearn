import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("learning.explain", () => {
  it("rejects a question that is too short", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.learning.explain({
        lessonText: "Photosynthesis uses sunlight, water, and carbon dioxide to make glucose and oxygen.",
        question: "?",
        language: "english",
        level: "beginner",
      }),
    ).rejects.toThrow();
  });
});

describe("learning.generateQuiz", () => {
  it("rejects lesson text that is too short", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.learning.generateQuiz({
        lessonText: "Too short",
        language: "english",
        level: "beginner",
      }),
    ).rejects.toThrow();
  });
});
