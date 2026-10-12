"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleDashed,
  Flame,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import CircleDiagram from "@/components/arc-lab/CircleDiagram";
import { calculatePoints, GAME_BALANCE } from "@/lib/game/balance";
import {
  CHALLENGE_QUESTIONS,
  isAnswerCorrect,
} from "@/lib/game/questions";
import {
  EMPTY_PROGRESS,
  readProgress,
  saveProgress,
  type ArcLabProgress,
} from "@/lib/game/progress";
import styles from "@/components/arc-lab/ArcLabExperience.module.css";

type Section = "home" | "learn" | "explore" | "play";
type AngleUnit = "degrees" | "radians";
type Feedback = { correct: boolean; earned?: number };

const LESSONS = [
  {
    id: "arc-length",
    number: "01 · Arc length",
    title: "A slice of the circumference",
    description:
      "An arc is part of a circle’s circumference. Its length is the same fraction of the full circumference as its central angle is of 360°.",
    formula: "s = (θ ÷ 360°) × 2πr",
    example:
      "For r = 12 cm and θ = 90°, s = ¼ × 24π = 6π cm.",
  },
  {
    id: "sector-area",
    number: "02 · Sector area",
    title: "A slice of the whole area",
    description:
      "A sector is the region enclosed by two radii and an arc. Its area is the matching fraction of the circle’s area.",
    formula: "A = (θ ÷ 360°) × πr²",
    example:
      "For r = 8 cm and θ = 135°, A = ⅜ × 64π = 24π cm².",
  },
] as const;

export default function ArcLabExperience() {
  const [section, setSection] = useState<Section>("home");
  const [progress, setProgress] = useState<ArcLabProgress>(EMPTY_PROGRESS);
  const [radius, setRadius] = useState(8);
  const [angle, setAngle] = useState(120);
  const [angleUnit, setAngleUnit] = useState<AngleUnit>("degrees");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [runFinished, setRunFinished] = useState(false);

  const question = CHALLENGE_QUESTIONS[questionIndex];
  const progressPercent = ((questionIndex + Number(Boolean(feedback?.correct))) / GAME_BALANCE.questionCount) * 100;
  const angleInRadians = angleUnit === "radians" ? angle : (angle * Math.PI) / 180;
  const angleInDegrees = angleUnit === "degrees" ? angle : (angle * 180) / Math.PI;
  const explorerAngleLabel =
    angleUnit === "degrees" ? `${Math.round(angle)}°` : `${angle.toFixed(1)} rad`;
  const arcLength = radius * angleInRadians;
  const sectorArea = 0.5 * radius ** 2 * angleInRadians;

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  function changeSection(value: string | number) {
    if (value === "home" || value === "learn" || value === "explore" || value === "play") {
      setSection(value);
    }
  }

  function markLessonComplete(lessonId: string) {
    setProgress((current) => {
      const next = current.completedLessons.includes(lessonId)
        ? current
        : { ...current, completedLessons: [...current.completedLessons, lessonId] };
      saveProgress(next);
      return next;
    });
  }

  function resetRun() {
    setQuestionIndex(0);
    setResponse("");
    setFeedback(null);
    setMistakes(0);
    setHintVisible(false);
    setHintUsed(false);
    setScore(0);
    setStreak(0);
    setRunFinished(false);
  }

  function startChallenge() {
    resetRun();
    setSection("play");
  }

  function submitAnswer() {
    if (!question || feedback?.correct || !response.trim()) return;

    if (!isAnswerCorrect(question, response)) {
      setMistakes((current) => current + 1);
      setStreak(0);
      setFeedback({ correct: false });
      return;
    }

    const earned = calculatePoints(mistakes, hintUsed, streak);
    const nextScore = score + earned;

    setScore(nextScore);
    setStreak((current) => current + 1);
    setFeedback({ correct: true, earned });
    setProgress((current) => {
      const next = {
        ...current,
        bestScore: Math.max(current.bestScore, nextScore),
        questionsCorrect: current.questionsCorrect + 1,
      };
      saveProgress(next);
      return next;
    });
  }

  function retryQuestion() {
    setResponse("");
    setFeedback(null);
  }

  function advanceQuestion() {
    if (!feedback?.correct) return;

    if (questionIndex + 1 >= CHALLENGE_QUESTIONS.length) {
      setRunFinished(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setResponse("");
    setFeedback(null);
    setMistakes(0);
    setHintVisible(false);
    setHintUsed(false);
  }

  function revealHint() {
    setHintVisible(true);
    setHintUsed(true);
  }

  function handleGameKey(event: KeyboardEvent) {
    if (section !== "play" || runFinished) return;
    const target = event.target;
    const isInteractiveTarget =
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        Boolean(target.closest("button, [role=tab], [role=slider]")));

    if (isInteractiveTarget) return;

    if (/^[1-4]$/.test(event.key) && question?.answerType === "choice" && !feedback) {
      const selected = question.choices?.[Number(event.key) - 1];
      if (selected) setResponse(selected);
    }

    if (event.key === "Enter" && !event.repeat) {
      event.preventDefault();
      if (feedback?.correct) advanceQuestion();
      else if (feedback?.correct === false) retryQuestion();
      else submitAnswer();
    }
  }

  useEffect(() => {
    if (section !== "play") return;
    window.addEventListener("keydown", handleGameKey);
    return () => window.removeEventListener("keydown", handleGameKey);
  }, [section, runFinished, question, response, feedback, mistakes, hintUsed, streak, score]);

  function changeAngleUnit(nextUnit: AngleUnit) {
    if (nextUnit === angleUnit) return;
    if (nextUnit === "radians") {
      setAngle(Math.round((angle * Math.PI) / 1800) / 10);
    } else {
      setAngle(Math.min(330, Math.max(30, Math.round((angle * 180) / Math.PI / 15) * 15)));
    }
    setAngleUnit(nextUnit);
  }

  return (
    <div className={styles.experience}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a
            className={styles.brand}
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              setSection("home");
            }}
            aria-label="Arc Lab home"
          >
            <span className={styles.brandMark} aria-hidden="true">
              <CircleDashed strokeWidth={2.4} />
            </span>
            <span>Arc Lab</span>
          </a>
          <Tabs
            className={styles.navigation}
            value={section}
            onValueChange={changeSection}
          >
            <TabsList aria-label="Arc Lab sections">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="play">Challenge</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <Tabs value={section} onValueChange={changeSection}>
        <main className={styles.pageContent} id="top">
          <TabsContent value="home" className="h-full">
            <section className={styles.homeHero} aria-labelledby="home-title">
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>
                  <span className={styles.eyebrowDot} />
                  Geometry, made visual
                </span>
                <h1 className={styles.heroTitle} id="home-title">
                  Make every part of the circle <span>make sense.</span>
                </h1>
                <p className={styles.heroDescription}>
                  Learn arc length and sector area by seeing how angles shape a circle—then put your understanding to the test.
                </p>
                <div className={styles.heroActions}>
                  <Button className={styles.primaryButton} onClick={startChallenge}>
                    Start challenge <ArrowRight aria-hidden="true" />
                  </Button>
                  <Button
                    className={styles.secondaryButton}
                    variant="outline"
                    onClick={() => setSection("learn")}
                  >
                    <BookOpen aria-hidden="true" /> Learn the formulas
                  </Button>
                </div>
                <p className={styles.heroFootnote}>
                  {progress.bestScore > 0
                    ? `Your best score: ${progress.bestScore} points · progress saved on this device`
                    : "A short visual lesson, a hands-on explorer, and a 10-question challenge."}
                </p>
              </div>
              <div className={styles.heroVisual} aria-label="Circle diagram preview">
                <div className={styles.visualGrid} aria-hidden="true" />
                <div className={styles.diagramCard}>
                  <div className={styles.diagramCardHeader}>
                    <span>One circle, two measures</span>
                    <span className={styles.diagramBadge}>r = 8 · θ = 120°</span>
                  </div>
                  <CircleDiagram
                    className={styles.diagram}
                    radius={8}
                    angleDegrees={120}
                    sector
                  />
                  <div className={styles.diagramCaption}>
                    <span>Arc length</span>
                    <strong>6π units</strong>
                    <span>Sector area</span>
                    <strong>64π/3 units²</strong>
                  </div>
                </div>
              </div>
            </section>

            <ol className={styles.learningStrip} aria-label="How Arc Lab works">
              <li className={styles.learningStep}>
                <span className={styles.stepNumber}>01</span>
                <span>
                  <strong className={styles.stepTitle}>Learn the relationship</strong>
                  <span className={styles.stepDescription}>Clear formulas with worked examples</span>
                </span>
              </li>
              <li className={styles.learningStep}>
                <span className={styles.stepNumber}>02</span>
                <span>
                  <strong className={styles.stepTitle}>Move the measures</strong>
                  <span className={styles.stepDescription}>See radius and angle change the result</span>
                </span>
              </li>
              <li className={styles.learningStep}>
                <span className={styles.stepNumber}>03</span>
                <span>
                  <strong className={styles.stepTitle}>Prove what you know</strong>
                  <span className={styles.stepDescription}>Practice, retry, and build a streak</span>
                </span>
              </li>
            </ol>
          </TabsContent>

          <TabsContent value="learn" className="h-full">
            <section aria-labelledby="learn-title">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>The essentials</span>
                  <h2 className={styles.sectionTitle} id="learn-title">Learn the circle formulas</h2>
                  <p className={styles.sectionDescription}>
                    Start with the fraction of the full circle. Then use radians to write each relationship in its shortest form.
                  </p>
                </div>
                <span className={styles.statPill}>
                  <Check aria-hidden="true" /> {progress.completedLessons.length} of 3 reviewed
                </span>
              </div>

              <div className={styles.lessonGrid}>
                {LESSONS.map((lesson) => {
                  const isComplete = progress.completedLessons.includes(lesson.id);
                  return (
                    <article className={styles.lessonCard} key={lesson.id}>
                      <span className={styles.lessonNumber}>{lesson.number}</span>
                      <h2 className={styles.lessonTitle}>{lesson.title}</h2>
                      <p className={styles.lessonText}>{lesson.description}</p>
                      <div className={styles.formula} aria-label={`Formula: ${lesson.formula}`}>
                        {lesson.formula}
                      </div>
                      <p className={styles.lessonExample}>
                        <strong>Worked example:</strong> {lesson.example}
                      </p>
                      <div className={styles.lessonFooter}>
                        <Button
                          className={styles.smallButton}
                          variant="outline"
                          aria-pressed={isComplete}
                          onClick={() => markLessonComplete(lesson.id)}
                        >
                          {isComplete ? <Check aria-hidden="true" /> : null}
                          {isComplete ? "Reviewed" : "Mark as understood"}
                        </Button>
                        {isComplete ? <span className={styles.masteredLabel}>Saved</span> : null}
                      </div>
                    </article>
                  );
                })}

                <article className={`${styles.lessonCard} ${styles.lessonCardWide}`}>
                  <div>
                    <span className={styles.lessonNumber}>03 · Radian measure</span>
                    <h2 className={styles.lessonTitle}>When the angle is in radians</h2>
                    <p className={styles.lessonText}>
                      One radian is the angle at the centre when the arc length equals the radius. Since a full turn is 2π radians, the degree formulas simplify.
                    </p>
                    <div className={styles.formula}>
                      s = rθ&nbsp;&nbsp; · &nbsp;&nbsp;A = ½r²θ
                    </div>
                    <p className={styles.lessonExample}>
                      <strong>Remember:</strong> π radians = 180°, so multiply by π/180 to convert degrees to radians.
                    </p>
                    <div className={styles.lessonFooter}>
                      <Button
                        className={styles.smallButton}
                        variant="outline"
                        aria-pressed={progress.completedLessons.includes("radians")}
                        onClick={() => markLessonComplete("radians")}
                      >
                        {progress.completedLessons.includes("radians") ? <Check aria-hidden="true" /> : null}
                        {progress.completedLessons.includes("radians") ? "Reviewed" : "Mark as understood"}
                      </Button>
                      {progress.completedLessons.includes("radians") ? (
                        <span className={styles.masteredLabel}>Saved</span>
                      ) : null}
                    </div>
                  </div>
                  <CircleDiagram
                    className={styles.diagram}
                    radius={5}
                    angleDegrees={57.3}
                    angleLabel="1 rad"
                    radiusLabel="r"
                    sector
                  />
                </article>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="explore" className="h-full">
            <section aria-labelledby="explore-title">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>Try it yourself</span>
                  <h2 className={styles.sectionTitle} id="explore-title">Explore the circle</h2>
                  <p className={styles.sectionDescription}>
                    Change the radius or angle. Watch the highlighted sector, arc length, and area update together.
                  </p>
                </div>
              </div>

              <div className={styles.exploreGrid}>
                <section className={styles.controlPanel} aria-label="Circle controls">
                  <h2 className={styles.controlTitle}>Adjust the measurements</h2>
                  <p className={styles.controlIntro}>
                    The angle can be measured in degrees or radians. The diagram and both formulas stay in sync.
                  </p>

                  <div className={styles.controlBlock}>
                    <div className={styles.controlLabelRow}>
                      <label className={styles.controlLabel} htmlFor="radius-slider">Radius</label>
                      <output className={styles.controlValue} htmlFor="radius-slider">{radius} units</output>
                    </div>
                    <Slider
                      id="radius-slider"
                      className={styles.slider}
                      min={2}
                      max={20}
                      step={1}
                      value={[radius]}
                      onValueChange={(values) => {
                        const nextValue = Array.isArray(values) ? values[0] : values;
                        if (typeof nextValue === "number") setRadius(nextValue);
                      }}
                      aria-label="Radius"
                    />
                  </div>

                  <div className={styles.controlBlock}>
                    <div className={styles.controlLabelRow}>
                      <span className={styles.controlLabel}>Angle unit</span>
                      <span className={styles.controlValue}>{explorerAngleLabel}</span>
                    </div>
                    <div className={styles.unitToggle} role="group" aria-label="Choose angle unit">
                      <Button
                        type="button"
                        variant="ghost"
                        className={`${styles.unitButton} ${angleUnit === "degrees" ? styles.unitButtonActive : ""}`}
                        aria-pressed={angleUnit === "degrees"}
                        onClick={() => changeAngleUnit("degrees")}
                      >
                        Degrees
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className={`${styles.unitButton} ${angleUnit === "radians" ? styles.unitButtonActive : ""}`}
                        aria-pressed={angleUnit === "radians"}
                        onClick={() => changeAngleUnit("radians")}
                      >
                        Radians
                      </Button>
                    </div>
                  </div>

                  <div className={styles.controlBlock}>
                    <div className={styles.controlLabelRow}>
                      <label className={styles.controlLabel} htmlFor="angle-slider">Central angle</label>
                      <output className={styles.controlValue} htmlFor="angle-slider">{explorerAngleLabel}</output>
                    </div>
                    <Slider
                      id="angle-slider"
                      className={styles.slider}
                      min={angleUnit === "degrees" ? 30 : 0.5}
                      max={angleUnit === "degrees" ? 330 : 5.5}
                      step={angleUnit === "degrees" ? 15 : 0.1}
                      value={[angle]}
                      onValueChange={(values) => {
                        const nextValue = Array.isArray(values) ? values[0] : values;
                        if (typeof nextValue === "number") setAngle(nextValue);
                      }}
                      aria-label="Central angle"
                    />
                  </div>
                </section>

                <section className={styles.explorePreview} aria-label="Live circle measurements">
                  <CircleDiagram
                    className={`${styles.diagram} ${styles.exploreDiagram}`}
                    radius={radius}
                    angleDegrees={angleInDegrees}
                    angleLabel={explorerAngleLabel}
                    sector
                  />
                  <div className={styles.measureList}>
                    <div className={styles.measureItem}>
                      <span className={styles.measureName}>Arc length</span>
                      <strong className={styles.measureValue}>{arcLength.toFixed(2)} units</strong>
                      <span className={styles.measureFormula}>
                        {angleUnit === "degrees" ? "s = (θ ÷ 360°) × 2πr" : "s = rθ"}
                      </span>
                    </div>
                    <div className={styles.measureItem}>
                      <span className={styles.measureName}>Sector area</span>
                      <strong className={styles.measureValue}>{sectorArea.toFixed(2)} units²</strong>
                      <span className={styles.measureFormula}>
                        {angleUnit === "degrees" ? "A = (θ ÷ 360°) × πr²" : "A = ½r²θ"}
                      </span>
                    </div>
                    <div className={styles.measureItem}>
                      <span className={styles.measureName}>Part of a full turn</span>
                      <strong className={styles.measureValue}>
                        {(angleInDegrees / 360).toFixed(3)}
                      </strong>
                      <span className={styles.measureFormula}>θ ÷ 360°</span>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="play" className="h-full">
            {!runFinished && question ? (
              <section aria-labelledby="challenge-title">
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.eyebrow}>Test your understanding</span>
                    <h2 className={styles.sectionTitle} id="challenge-title">Circle challenge</h2>
                    <p className={styles.sectionDescription}>
                      Solve ten questions, use a hint when you need it, and build your streak.
                    </p>
                  </div>
                </div>

                <div className={styles.challengeTopline}>
                  <div className={styles.challengeStats}>
                    <span className={styles.statPill}>
                      <Trophy aria-hidden="true" /> <strong>{score}</strong> points
                    </span>
                    <span className={styles.statPill}>
                      <Flame aria-hidden="true" /> <strong>{streak}</strong> streak
                    </span>
                    <span className={styles.statPill}>
                      Best <strong>{progress.bestScore}</strong>
                    </span>
                  </div>
                </div>

                <div className={styles.questionProgress}>
                  <span className={styles.questionProgressLabel}>
                    Question {questionIndex + 1} of {CHALLENGE_QUESTIONS.length}
                  </span>
                  <Progress value={progressPercent} aria-label="Challenge progress" />
                </div>

                <div className={styles.challengeGrid}>
                  <div className={styles.challengeDiagramPanel}>
                    <CircleDiagram
                      className={styles.diagram}
                      radius={question.diagram.radius}
                      angleDegrees={question.diagram.angleDegrees}
                      angleLabel={question.diagram.angleLabel}
                      radiusLabel={question.diagram.radiusLabel}
                      sector={question.diagram.sector}
                    />
                    <p className={styles.diagramNote}>Use the angle and radius shown to guide your calculation.</p>
                  </div>

                  <form
                    className={styles.challengePanel}
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitAnswer();
                    }}
                  >
                    <span className={styles.questionTag}>{question.topic}</span>
                    <h2 className={styles.questionPrompt}>{question.prompt}</h2>

                    {question.answerType === "choice" ? (
                      <div className={styles.answerList} role="group" aria-label="Choose an answer">
                        {question.choices?.map((choice, index) => (
                          <Button
                            type="button"
                            key={choice}
                            className={`${styles.answerButton} ${response === choice ? styles.answerSelected : ""}`}
                            variant="outline"
                            aria-pressed={response === choice}
                            onClick={() => {
                              if (!feedback) setResponse(choice);
                            }}
                            disabled={Boolean(feedback)}
                          >
                            <span className={styles.answerKey}>{index + 1}</span>
                            {choice}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.numericAnswer}>
                        <label className="sr-only" htmlFor="numeric-answer">Your answer</label>
                        <Input
                          id="numeric-answer"
                          className={styles.numericInput}
                          type="number"
                          inputMode="decimal"
                          step="any"
                          placeholder="Enter a number"
                          value={response}
                          onChange={(event) => setResponse(event.target.value)}
                          disabled={Boolean(feedback)}
                        />
                        {question.unit ? <span className={styles.inputUnit}>{question.unit}</span> : null}
                      </div>
                    )}

                    {hintVisible ? <p className={styles.hintBox}>{question.hint}</p> : null}

                    {feedback ? (
                      <div
                        className={styles.feedbackBox}
                        data-correct={feedback.correct}
                        role="status"
                        aria-live="polite"
                      >
                        <strong className={styles.feedbackTitle}>
                          {feedback.correct ? `Correct! +${feedback.earned} points` : "Not quite—here’s the method."}
                        </strong>
                        {question.explanation}
                        {feedback.correct ? (
                          <span className={styles.formulaHint}>{question.answerDisplay}</span>
                        ) : (
                          <span className={styles.formulaHint}>{question.formula}</span>
                        )}
                      </div>
                    ) : null}

                    <div className={styles.questionActions}>
                      {feedback?.correct ? (
                        <Button type="button" className={styles.primaryButton} onClick={advanceQuestion}>
                          {questionIndex + 1 === CHALLENGE_QUESTIONS.length ? "See results" : "Next question"}
                          <ArrowRight aria-hidden="true" />
                        </Button>
                      ) : feedback?.correct === false ? (
                        <Button type="button" className={styles.primaryButton} onClick={retryQuestion}>
                          Try again <RotateCcw aria-hidden="true" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className={styles.primaryButton}
                          disabled={!response.trim()}
                        >
                          Check answer <ArrowRight aria-hidden="true" />
                        </Button>
                      )}
                      {!feedback ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className={styles.utilityButton}
                          onClick={revealHint}
                          disabled={hintVisible}
                        >
                          <Lightbulb aria-hidden="true" /> {hintVisible ? "Hint shown" : "Show a hint"}
                        </Button>
                      ) : null}
                    </div>
                    <p className={styles.heroFootnote}>
                      {question.answerType === "choice"
                        ? "Keyboard: press 1–4 to choose, then Enter to check."
                        : "Keyboard: type your answer and press Enter to check."}
                    </p>
                  </form>
                </div>
              </section>
            ) : (
              <section className={styles.resultsLayout} aria-labelledby="results-title">
                <div className={styles.resultPanel}>
                  <span className={styles.resultIcon} aria-hidden="true"><Sparkles /></span>
                  <span className={styles.eyebrow}>Round complete</span>
                  <h2 className={styles.sectionTitle} id="results-title">You made the circle add up.</h2>
                  <p className={styles.resultScore}>{score}</p>
                  <p className={styles.resultSummary}>
                    Points earned across ten questions. Keep exploring the formulas, then take another round to beat your best.
                  </p>
                  <div className={styles.resultStats}>
                    <span className={styles.statPill}><Check aria-hidden="true" /> <strong>{CHALLENGE_QUESTIONS.length}</strong> solved</span>
                    <span className={styles.statPill}><Trophy aria-hidden="true" /> Best <strong>{progress.bestScore}</strong></span>
                  </div>
                  <Button className={styles.primaryButton} onClick={startChallenge}>
                    <RotateCcw aria-hidden="true" /> Play again
                  </Button>
                  <Button
                    className={styles.secondaryButton}
                    variant="outline"
                    onClick={() => setSection("learn")}
                  >
                    Review formulas
                  </Button>
                </div>
              </section>
            )}
          </TabsContent>

          <footer className={styles.footer}>
            <span><strong>Arc Lab</strong> · Arc length &amp; sector area</span>
            <span>{progress.questionsCorrect} correct answers saved on this device</span>
            <Button
              type="button"
              variant="ghost"
              className={styles.utilityButton}
              onClick={() => setSection("explore")}
            >
              Explore a circle <Target aria-hidden="true" />
            </Button>
          </footer>
        </main>
      </Tabs>
    </div>
  );
}
