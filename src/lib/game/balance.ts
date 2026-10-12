export const GAME_BALANCE = {
  pointsPerCorrectAnswer: 100,
  pointsPerMistake: 25,
  hintPenalty: 20,
  streakBonus: 10,
  maxStreakBonus: 30,
  questionCount: 10,
} as const;

export function calculatePoints(mistakes: number, hintUsed: boolean, streak: number) {
  const earnedBeforeStreak = Math.max(
    20,
    GAME_BALANCE.pointsPerCorrectAnswer -
      Math.max(0, mistakes) * GAME_BALANCE.pointsPerMistake -
      (hintUsed ? GAME_BALANCE.hintPenalty : 0),
  );
  const streakPoints = Math.min(
    Math.max(0, streak) * GAME_BALANCE.streakBonus,
    GAME_BALANCE.maxStreakBonus,
  );

  return earnedBeforeStreak + streakPoints;
}
