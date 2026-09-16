import { COOKIE_NAME } from "@shared/const";
import { invokeLLM } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  learning: router({
    explain: publicProcedure
      .input(
        z.object({
          lessonText: z.string().min(20).max(8000),
          question: z.string().min(3).max(500),
          language: z.enum(["english", "hindi"]),
          level: z.enum(["beginner", "standard"]),
        }),
      )
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are BridgeLearn, a careful learning assistant. Use only the lesson text. If the lesson does not support an answer, say so clearly. Explain one idea at the requested reading level and language.",
            },
            {
              role: "user",
              content: `Language: ${input.language}\nReading level: ${input.level}\nLesson:\n${input.lessonText}\nStudent question:\n${input.question}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "bridgelearn_explanation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  answer: { type: "string" },
                  sourceText: { type: "string" },
                  confidence: { type: "string", enum: ["high", "medium", "low"] },
                },
                required: ["answer", "sourceText", "confidence"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices?.[0]?.message?.content;
        if (typeof content !== "string") {
          throw new Error("The learning assistant returned an empty response");
        }

        const result = JSON.parse(content) as {
          answer: string;
          sourceText: string;
          confidence: "high" | "medium" | "low";
        };

        if (!result.answer || !result.sourceText || !result.confidence) {
          throw new Error("The learning assistant returned an incomplete response");
        }

        return result;
      }),
    generateQuiz: publicProcedure
      .input(
        z.object({
          lessonText: z.string().min(20).max(8000),
          language: z.enum(["english", "hindi"]),
          level: z.enum(["beginner", "standard"]),
        }),
      )
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You create short, fair learning checks. Use only the lesson text. Write three multiple-choice questions in the requested language and level. Each question must have exactly three options and one correct answer index.",
            },
            {
              role: "user",
              content: `Language: ${input.language}\nLevel: ${input.level}\nLesson:\n${input.lessonText}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "bridgelearn_quiz",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
                        correctIndex: { type: "integer", minimum: 0, maximum: 2 },
                        concept: { type: "string" },
                      },
                      required: ["question", "options", "correctIndex", "concept"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices?.[0]?.message?.content;
        if (typeof content !== "string") throw new Error("The quiz assistant returned an empty response");

        const result = JSON.parse(content) as {
          questions: Array<{ question: string; options: string[]; correctIndex: number; concept: string }>;
        };
        if (
          result.questions.length !== 3 ||
          result.questions.some(
            (item) =>
              !item.question ||
              item.options.length !== 3 ||
              item.options.some((option) => !option) ||
              item.correctIndex < 0 ||
              item.correctIndex > 2 ||
              !item.concept,
          )
        ) {
          throw new Error("The quiz assistant returned invalid questions");
        }
        return result.questions;
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
