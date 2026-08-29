"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  startAttemptAction,
  submitAnswerAction,
  finishAttemptAction,
} from "@/app/actions/quiz";

type QuizQuestion = {
  id: string;
  question: string;
  question_type: "multiple_choice" | "true_false" | "short_answer" | "concept";
  answer_options: string[] | null;
};

type Feedback = {
  correct: boolean;
  correctAnswer: string;
  explanation: string | null;
};

export function QuizRunner({
  studySetId,
  questions,
}: {
  studySetId: string;
  questions: QuizQuestion[];
}) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const current = questions[index];

  useEffect(() => {
    startAttemptAction(studySetId, questions.length)
      .then(setAttemptId)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStartedAt(Date.now());
  }, [index]);

  async function handleSubmit() {
    if (!attemptId || !selected || feedback || submitting) return;
    setSubmitting(true);

    try {
      const result = await submitAnswerAction({
        attemptId,
        questionId: current.id,
        selectedAnswer: selected,
        responseTimeMs: Date.now() - startedAt,
      });
      setFeedback(result);
      if (result.correct) setCorrectCount((c) => c + 1);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    if (index + 1 >= questions.length) {
      if (attemptId) await finishAttemptAction(attemptId, correctCount);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected("");
    setFeedback(null);
  }

  if (loading) {
    return <p className="text-center text-navy/50">Laddar...</p>;
  }

  if (finished) {
    const percent = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="text-center">
        <p className="font-display text-5xl font-semibold text-navy">
          {correctCount} / {questions.length}
        </p>
        <p className="mt-2 font-mono text-2xl font-semibold text-ocean">
          {percent}%
        </p>
        <p className="mt-4 text-navy/70">
          {percent >= 70
            ? "Bra koll! Repetera det du missade när du vill. 🎉"
            : "Bra jobbat — fortsätt träna det svåra."}
        </p>
        <Link
          href={`/elev/plugga/${studySetId}`}
          className="btn-primary mt-6 inline-flex"
        >
          Klar
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center font-mono text-sm text-navy/50">
        {index + 1} / {questions.length}
      </p>

      <div className="notebook-card mt-4 p-6">
        <p className="text-lg font-medium text-navy">{current.question}</p>

        <div className="mt-6 space-y-2">
          {current.question_type === "multiple_choice" &&
            current.answer_options?.map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={!!feedback}
                onClick={() => setSelected(opt)}
                className={
                  "w-full rounded-xl border-2 px-4 py-3 text-left transition-colors " +
                  (feedback
                    ? opt === feedback.correctAnswer
                      ? "border-turquoise bg-seafoam"
                      : opt === selected
                        ? "border-coral bg-coral/10"
                        : "border-sand-deep opacity-60"
                    : opt === selected
                      ? "border-ocean bg-ocean/5"
                      : "border-sand-deep hover:border-ocean")
                }
              >
                {opt}
              </button>
            ))}

          {current.question_type === "true_false" &&
            ["Sant", "Falskt"].map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={!!feedback}
                onClick={() => setSelected(opt)}
                className={
                  "w-full rounded-xl border-2 px-4 py-3 text-left transition-colors " +
                  (feedback
                    ? opt === feedback.correctAnswer
                      ? "border-turquoise bg-seafoam"
                      : opt === selected
                        ? "border-coral bg-coral/10"
                        : "border-sand-deep opacity-60"
                    : opt === selected
                      ? "border-ocean bg-ocean/5"
                      : "border-sand-deep hover:border-ocean")
                }
              >
                {opt}
              </button>
            ))}

          {(current.question_type === "short_answer" ||
            current.question_type === "concept") && (
            <input
              type="text"
              value={selected}
              disabled={!!feedback}
              onChange={(e) => setSelected(e.target.value)}
              className="field-input"
              placeholder="Skriv ditt svar"
            />
          )}
        </div>

        {feedback && (
          <div
            className={
              "mt-4 rounded-xl p-3 text-sm " +
              (feedback.correct
                ? "bg-seafoam text-ocean-dark"
                : "bg-coral/10 text-coral-dark")
            }
          >
            <p className="font-semibold">
              {feedback.correct ? "Rätt ✓" : "Inte riktigt"}
            </p>
            {!feedback.correct && <p>Rätt svar: {feedback.correctAnswer}</p>}
            {feedback.explanation && (
              <p className="mt-1 text-navy/70">{feedback.explanation}</p>
            )}
          </div>
        )}

        <div className="mt-6">
          {!feedback ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selected || submitting}
              className="btn-primary w-full disabled:opacity-40"
            >
              Svara
            </button>
          ) : (
            <button type="button" onClick={handleNext} className="btn-primary w-full">
              {index + 1 >= questions.length ? "Se resultat" : "Nästa fråga"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
