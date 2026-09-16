import { describe, expect, it } from "vitest";
import { demoLesson, explanations, practiceForConcept, quizQuestions, sourceText } from "../client/src/lib/demoData";

describe("BridgeLearn demo lesson", () => {
  it("has enough content for the learning flow", () => {
    expect(demoLesson.title).toBe("How plants make food");
    expect(demoLesson.text.length).toBeGreaterThan(100);
    expect(sourceText.length).toBeGreaterThan(20);
  });

  it("has explanations for both languages and reading levels", () => {
    expect(explanations.english.beginner).toBeTruthy();
    expect(explanations.english.standard).toBeTruthy();
    expect(explanations.hindi.beginner).toBeTruthy();
    expect(explanations.hindi.standard).toBeTruthy();
  });

  it("keeps every quiz answer inside the available options", () => {
    expect(quizQuestions).toHaveLength(3);
    for (const question of quizQuestions) {
      expect(question.options[question.correctIndex]).toBeTruthy();
      expect(question.concept).toBeTruthy();
    }
  });

  it("suggests a focused activity for a weak concept", () => {
    expect(practiceForConcept("oxygen")).toContain("oxygen");
    expect(practiceForConcept("unknown")).toContain("Review the lesson");
  });
});
