export interface ArcLabProgress {
  bestScore: number;
  questionsCorrect: number;
  completedLessons: string[];
}

const STORAGE_KEY = "arc-lab-progress-v1";

export const EMPTY_PROGRESS: ArcLabProgress = {
  bestScore: 0,
  questionsCorrect: 0,
  completedLessons: [],
};

export function readProgress(): ArcLabProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY_PROGRESS;

    const candidate = parsed as Partial<ArcLabProgress>;
    return {
      bestScore:
        typeof candidate.bestScore === "number" && Number.isFinite(candidate.bestScore)
          ? Math.max(0, candidate.bestScore)
          : 0,
      questionsCorrect:
        typeof candidate.questionsCorrect === "number" && Number.isFinite(candidate.questionsCorrect)
          ? Math.max(0, candidate.questionsCorrect)
          : 0,
      completedLessons: Array.isArray(candidate.completedLessons)
        ? candidate.completedLessons.filter((lesson): lesson is string => typeof lesson === "string")
        : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: ArcLabProgress) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    return;
  }
}
