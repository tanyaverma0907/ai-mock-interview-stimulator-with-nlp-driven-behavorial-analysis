import { useState } from "react";

export const useInterview = (questionList: string[]) => {
  const [index, setIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);

  // 👉 NEXT
  const next = (value: string) => {
    const updated = [...answers];
    updated[index] = value || "SKIPPED";

    setAnswers(updated);
    setAnswer("");

    const isLast = index + 1 >= questionList.length;

    if (!isLast) {
      setIndex((prev) => prev + 1);
    }

    return {
      isLast,
      updatedAnswers: updated,
    };
  };

  // 👉 PREVIOUS
  const previous = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setAnswer(answers[index - 1] || "");
    }
  };

  // 👉 SKIP
  const skip = () => {
    return next("SKIPPED");
  };

  return {
    index,
    answer,
    setAnswer,
    answers,
    next,
    previous,
    skip,
  };
};