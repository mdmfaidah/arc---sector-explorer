export interface ChallengeQuestion {
  id: string;
  topic: string;
  prompt: string;
  answerType: "choice" | "number";
  choices?: string[];
  answer: string;
  tolerance?: number;
  unit?: string;
  hint: string;
  explanation: string;
  answerDisplay: string;
  formula: string;
  diagram: {
    radius: number;
    angleDegrees: number;
    sector: boolean;
    radiusLabel?: string;
    angleLabel?: string;
  };
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: "arc-degree",
    topic: "Arc length · degrees",
    prompt: "A circle has radius 9 cm and a central angle of 120°. Find the arc length. Round to 2 decimal places.",
    answerType: "number",
    answer: "18.85",
    tolerance: 0.03,
    unit: "cm",
    hint: "120° is one third of a full turn. Find one third of the circle’s circumference.",
    explanation: "The arc is 120 ÷ 360 = 1/3 of the circumference. So s = 1/3 × 2π × 9 = 6π ≈ 18.85 cm.",
    answerDisplay: "18.85 cm (exactly 6π cm)",
    formula: "s = (θ ÷ 360°) × 2πr",
    diagram: { radius: 9, angleDegrees: 120, sector: false },
  },
  {
    id: "sector-degree",
    topic: "Sector area · degrees",
    prompt: "A sector has radius 8 cm and central angle 90°. What is its area?",
    answerType: "choice",
    choices: ["16π cm²", "32π cm²", "64π cm²", "4π cm²"],
    answer: "16π cm²",
    hint: "A 90° sector is one quarter of the full circle. The area of a circle is πr².",
    explanation: "The sector is 90 ÷ 360 = 1/4 of the circle. Its area is 1/4 × π × 8² = 16π cm².",
    answerDisplay: "16π cm² (about 50.27 cm²)",
    formula: "A = (θ ÷ 360°) × πr²",
    diagram: { radius: 8, angleDegrees: 90, sector: true },
  },
  {
    id: "arc-radians",
    topic: "Arc length · radians",
    prompt: "A circle has radius 6 cm and a central angle of 2.4 radians. Find the arc length.",
    answerType: "number",
    answer: "14.4",
    tolerance: 0.02,
    unit: "cm",
    hint: "When the angle is in radians, multiply the radius by the angle.",
    explanation: "Use s = rθ because the angle is in radians. So s = 6 × 2.4 = 14.4 cm.",
    answerDisplay: "14.4 cm",
    formula: "s = rθ",
    diagram: { radius: 6, angleDegrees: 137.5, sector: false, angleLabel: "2.4 rad" },
  },
  {
    id: "sector-radians",
    topic: "Sector area · radians",
    prompt: "A sector has radius 5 cm and angle 1.2 radians. Find its area.",
    answerType: "number",
    answer: "15",
    tolerance: 0.02,
    unit: "cm²",
    hint: "For an angle in radians, sector area is half the radius squared times the angle.",
    explanation: "Use A = ½r²θ. So A = ½ × 5² × 1.2 = 15 cm².",
    answerDisplay: "15 cm²",
    formula: "A = ½r²θ",
    diagram: { radius: 5, angleDegrees: 68.8, sector: true, angleLabel: "1.2 rad" },
  },
  {
    id: "convert-degrees",
    topic: "Convert · degrees to radians",
    prompt: "Convert 150° to radians. Leave your answer in terms of π.",
    answerType: "choice",
    choices: ["5π/6", "3π/5", "6π/5", "5π/3"],
    answer: "5π/6",
    hint: "Multiply the angle in degrees by π/180°, then simplify the fraction.",
    explanation: "150° × π/180° = 150π/180 = 5π/6 radians.",
    answerDisplay: "5π/6 radians",
    formula: "radians = degrees × π ÷ 180°",
    diagram: { radius: 7, angleDegrees: 150, sector: false },
  },
  {
    id: "convert-radians",
    topic: "Convert · radians to degrees",
    prompt: "Convert 7π/6 radians to degrees.",
    answerType: "choice",
    choices: ["150°", "180°", "210°", "240°"],
    answer: "210°",
    hint: "Multiply the angle in radians by 180°/π; the π terms cancel.",
    explanation: "(7π/6) × (180°/π) = 7 × 30° = 210°.",
    answerDisplay: "210°",
    formula: "degrees = radians × 180° ÷ π",
    diagram: { radius: 7, angleDegrees: 210, sector: false },
  },
  {
    id: "major-arc",
    topic: "Major arc · degrees",
    prompt: "A major arc subtends 270° in a circle of radius 4 cm. Find its length. Round to 2 decimal places.",
    answerType: "number",
    answer: "18.85",
    tolerance: 0.03,
    unit: "cm",
    hint: "Use 270° as the fraction of a full 360° turn, then multiply by 2πr.",
    explanation: "The arc is 270 ÷ 360 = 3/4 of the circumference. So s = 3/4 × 2π × 4 = 6π ≈ 18.85 cm.",
    answerDisplay: "18.85 cm (exactly 6π cm)",
    formula: "s = (θ ÷ 360°) × 2πr",
    diagram: { radius: 4, angleDegrees: 270, sector: false },
  },
  {
    id: "find-radius",
    topic: "Find the radius · degrees",
    prompt: "An arc is 6π cm long and subtends 90°. Find the circle’s radius in cm.",
    answerType: "number",
    answer: "12",
    tolerance: 0.02,
    unit: "cm",
    hint: "A 90° arc is one quarter of the circumference. Set 6π equal to one quarter of 2πr.",
    explanation: "6π = (90 ÷ 360) × 2πr = ½πr. Divide by ½π to get r = 12 cm.",
    answerDisplay: "12 cm",
    formula: "s = (θ ÷ 360°) × 2πr",
    diagram: { radius: 12, angleDegrees: 90, sector: false, radiusLabel: "r = ?" },
  },
  {
    id: "convert-decimal-radians",
    topic: "Convert · decimal radians",
    prompt: "Convert 1.75 radians to degrees. Round to 2 decimal places.",
    answerType: "number",
    answer: "100.27",
    tolerance: 0.05,
    unit: "°",
    hint: "Multiply 1.75 by 180°/π, then round to 2 decimal places.",
    explanation: "1.75 × 180° ÷ π ≈ 100.27°.",
    answerDisplay: "100.27°",
    formula: "degrees = radians × 180° ÷ π",
    diagram: { radius: 7, angleDegrees: 100.3, sector: false, angleLabel: "1.75 rad" },
  },
  {
    id: "find-angle",
    topic: "Find the angle · radians",
    prompt: "A sector has radius 10 cm and area 25 cm². Find its angle in radians.",
    answerType: "number",
    answer: "0.5",
    tolerance: 0.02,
    unit: "rad",
    hint: "Rearrange A = ½r²θ to make θ the subject.",
    explanation: "25 = ½ × 10² × θ = 50θ. Divide by 50 to get θ = 0.5 radians.",
    answerDisplay: "0.5 radians",
    formula: "A = ½r²θ",
    diagram: { radius: 10, angleDegrees: 28.6, sector: true, angleLabel: "θ = ?" },
  },
];

export function isAnswerCorrect(question: ChallengeQuestion, response: string) {
  if (question.answerType === "choice") {
    return response.trim().toLowerCase() === question.answer.trim().toLowerCase();
  }

  const value = Number(response.trim().replaceAll(",", ""));
  if (!Number.isFinite(value)) return false;

  return Math.abs(value - Number(question.answer)) <= (question.tolerance ?? 0.02);
}
