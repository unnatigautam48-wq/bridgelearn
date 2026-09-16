import { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Lightbulb, RotateCcw, Sparkles, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  demoAnswer,
  demoLesson,
  explanations,
  quizQuestions,
  practiceForConcept,
  sourceText,
  type Language,
  type Level,
} from "@/lib/demoData";

export default function Home() {
  const [language, setLanguage] = useState<Language>("english");
  const [level, setLevel] = useState<Level>("beginner");
  const [activeLesson, setActiveLesson] = useState(demoLesson);
  const [lessonName, setLessonName] = useState("How plants make food");
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [questions, setQuestions] = useState(quizQuestions);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [weakConcept, setWeakConcept] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const explain = trpc.learning.explain.useMutation();
  const generateQuiz = trpc.learning.generateQuiz.useMutation();

  const currentQuiz = questions[quizIndex];
  const progressValue = finished ? 100 : started ? 38 : 0;

  function startLesson() {
    setStarted(true);
    setAnswer(activeLesson.id === demoLesson.id ? explanations[language][level] : "This lesson is ready. Ask a question below and BridgeLearn will explain it using your uploaded text.");
  }

  function startDemo() {
    setActiveLesson(demoLesson);
    setLessonName("How plants make food");
    setLanguage("english");
    setLevel("beginner");
    setStarted(true);
    setAnswer(explanations.english.beginner);
    setQuizIndex(0);
    setQuestions(quizQuestions);
    setSelectedOption(null);
    setScore(0);
    setWeakConcept(null);
    setFinished(false);
  }

  function handleLessonUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "").trim();
      if (text.length < 20) return;
      setActiveLesson({ id: "uploaded", title: file.name.replace(/\.(txt|md)$/i, ""), subject: "Your uploaded lesson", text });
      setLessonName(file.name);
      setStarted(false);
      setAnswer("");
      setQuestions(quizQuestions);
    };
    reader.readAsText(file);
  }

  function askQuestion() {
    if (!question.trim()) return;
    explain.mutate(
      {
        lessonText: activeLesson.text,
        question,
        language,
        level,
      },
      {
        onSuccess: (result) => setAnswer(result.answer),
        onError: () => setAnswer(demoAnswer[language]),
      },
    );
  }

  function createAdaptiveQuiz() {
    generateQuiz.mutate(
      { lessonText: activeLesson.text, language, level },
      {
        onSuccess: (result) => {
          setQuestions(result);
          setQuizIndex(0);
          setSelectedOption(null);
          setScore(0);
          setFinished(false);
        },
        onError: () => setQuestions(quizQuestions),
      },
    );
  }

  function chooseOption(index: number) {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === currentQuiz.correctIndex) {
      setScore((current) => current + 1);
    } else {
      setWeakConcept(currentQuiz.concept);
    }
  }

  function nextQuestion() {
    if (quizIndex === questions.length - 1) {
      setFinished(true);
      return;
    }
    setQuizIndex((current) => current + 1);
    setSelectedOption(null);
  }

  function resetLesson() {
    setStarted(false);
    setQuestion("");
    setAnswer("");
    setActiveLesson(demoLesson);
    setLessonName("How plants make food");
    setQuizIndex(0);
    setQuestions(quizQuestions);
    setSelectedOption(null);
    setScore(0);
    setWeakConcept(null);
    setFinished(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#18231d]">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173f35] text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">BridgeLearn</p>
              <p className="text-xs text-[#64736b]">Learn at your level</p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-full border-[#cbd8ce] bg-white px-3 py-1 text-[#416352]">
            Student workspace
          </Badge>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <Badge className="rounded-full bg-[#dceee2] px-3 py-1 text-[#286044] hover:bg-[#dceee2]">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              A calmer way to understand lessons
            </Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
              Don&apos;t just find an answer. Make it click.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#64736b] md:text-lg">
              BridgeLearn explains a lesson in your language, checks what you understood, and gives you one clear next step.
            </p>
          </div>

          <Card className="border-[#dfe8e1] bg-white/80 shadow-[0_20px_60px_-35px_rgba(23,63,53,0.45)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#789084]">Today&apos;s lesson</p>
                  <CardTitle className="mt-2 text-2xl">{activeLesson.title}</CardTitle>
                </div>
                <div className="rounded-2xl bg-[#edf5ee] p-3 text-[#3b7453]">
                  <Lightbulb className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[#64736b]">{activeLesson.subject}</p>
              <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#b9d0bd] bg-[#f7fbf7] px-4 py-3 text-sm text-[#416352] hover:bg-[#eef7ef]">
                <span className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload .txt or .md lesson</span>
                <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={handleLessonUpload} className="sr-only" />
              </label>
              {lessonName !== "How plants make food" && <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5e7d67]"><FileText className="h-3.5 w-3.5" /> Using {lessonName}</p>}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Language
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as Language)}
                    className="mt-2 h-11 w-full rounded-xl border border-[#d7e2d9] bg-[#fbfcfa] px-3 text-sm outline-none focus:border-[#4d8b65] focus:ring-2 focus:ring-[#bfe0c6]"
                  >
                    <option value="english">English</option>
                    <option value="hindi">हिंदी</option>
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Reading level
                  <select
                    value={level}
                    onChange={(event) => setLevel(event.target.value as Level)}
                    className="mt-2 h-11 w-full rounded-xl border border-[#d7e2d9] bg-[#fbfcfa] px-3 text-sm outline-none focus:border-[#4d8b65] focus:ring-2 focus:ring-[#bfe0c6]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="standard">Standard</option>
                  </select>
                </label>
              </div>
              <Button onClick={startLesson} className="mt-5 h-11 w-full rounded-xl bg-[#173f35] text-white hover:bg-[#245747]">
                {started ? "Refresh explanation" : "Start learning"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button type="button" onClick={startDemo} className="mt-3 flex w-full items-center justify-center text-xs font-medium text-[#5e7d67] underline underline-offset-4 hover:text-[#286044]">
                Start 60-second demo
              </button>
            </CardContent>
          </Card>
        </section>

        <div className="mt-10 flex items-center gap-4">
          <Progress value={progressValue} className="h-2 bg-[#dce6dd] [&>div]:bg-[#4c8b63]" />
          <span className="min-w-fit text-xs font-medium text-[#64736b]">{finished ? "Complete" : started ? "Step 1 of 3" : "Ready when you are"}</span>
        </div>

        {started && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-[#dfe8e1] bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#789084]">Understand</p>
                    <CardTitle className="mt-2 text-2xl">Here&apos;s the idea</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-[#cbd8ce] text-[#416352]">Based on your lesson</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-8 text-[#263a2f]">{answer}</p>
                <div className="mt-6 rounded-2xl border border-[#dbe8dd] bg-[#f3f8f3] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5e7d67]">Source passage</p>
                  <p className="mt-2 text-sm leading-6 text-[#4d6254]">“{sourceText}”</p>
                </div>
                <div className="mt-6 border-t border-[#e5ece6] pt-5">
                  <label className="text-sm font-medium" htmlFor="question">Still unsure? Ask in your own words.</label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Why do plants need sunlight?"
                    className="mt-2 min-h-24 resize-none rounded-xl border-[#d7e2d9] bg-[#fbfcfa] focus-visible:ring-[#bfe0c6]"
                  />
                  <Button onClick={askQuestion} disabled={explain.isPending} variant="outline" className="mt-3 rounded-xl border-[#b9d0bd] text-[#286044] hover:bg-[#eef7ef]">
                    {explain.isPending ? "Thinking..." : "Explain this to me"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#dfe8e1] bg-[#173f35] text-white shadow-sm">
              <CardHeader>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#a8cbb1]">Check your understanding</p>
                <CardTitle className="mt-2 text-2xl">One small check</CardTitle>
              </CardHeader>
              <CardContent>
                {!finished ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-[#c7dfcc]">Question {quizIndex + 1} of {questions.length}</p>
                      <button type="button" onClick={createAdaptiveQuiz} disabled={generateQuiz.isPending} className="text-xs text-[#c7dfcc] underline underline-offset-4 hover:text-white">
                        {generateQuiz.isPending ? "Creating..." : "New quiz"}
                      </button>
                    </div>
                    <p className="mt-5 text-xl font-medium leading-8">{currentQuiz.question}</p>
                    <div className="mt-5 space-y-3">
                      {currentQuiz.options.map((option, index) => {
                        const isSelected = selectedOption === index;
                        const isCorrect = index === currentQuiz.correctIndex;
                        const showCorrect = selectedOption !== null && isCorrect;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => chooseOption(index)}
                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                              showCorrect
                                ? "border-[#a9d6ad] bg-[#d9f0dc] text-[#173f35]"
                                : isSelected
                                  ? "border-[#f1c28d] bg-[#fff0dc] text-[#51371d]"
                                  : "border-[#47745f] bg-[#245747] text-white hover:bg-[#2b6653]"
                            }`}
                          >
                            <span>{option}</span>
                            {showCorrect && <CheckCircle2 className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                    {selectedOption !== null && (
                      <Button onClick={nextQuestion} className="mt-6 w-full rounded-xl bg-white text-[#173f35] hover:bg-[#edf5ee]">
                        {quizIndex === questions.length - 1 ? "See my progress" : "Next question"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9f0dc] text-[#286044]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <p className="mt-5 text-3xl font-semibold">{score}/{questions.length} correct</p>
                    <p className="mt-3 leading-7 text-[#c7dfcc]">You have a good start. Review the concept once more, then try the lesson again.</p>
                    <div className="mt-6 rounded-2xl bg-[#245747] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a8cbb1]">Next step</p>
                      <p className="mt-2 text-sm leading-6">{weakConcept ? practiceForConcept(weakConcept) : "Draw the photosynthesis cycle using sunlight, water, carbon dioxide, glucose, and oxygen."}</p>
                    </div>
                    <Button onClick={resetLesson} variant="outline" className="mt-6 w-full rounded-xl border-[#6c9a7e] bg-transparent text-white hover:bg-[#245747]">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        <footer className="mt-10 flex flex-col gap-2 border-t border-[#dfe8e1] pt-5 text-xs text-[#789084] sm:flex-row sm:items-center sm:justify-between">
          <span>BridgeLearn is a learning aid, not a replacement for a teacher.</span>
          <span>Built for thoughtful practice.</span>
        </footer>
      </div>
    </main>
  );
}
