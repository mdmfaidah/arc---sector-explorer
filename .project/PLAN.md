# Plan — Arc Lab

Arc Lab turns arc length and sector area into a hands-on geometry game. Students learn the formulas, explore how radius and angle change a circle’s parts, then test their understanding in scored challenges.

## Learning path
- **Start screen** introduces the mission and offers Learn, Explore, and Play.
- **Learn** teaches degree and radian formulas with worked examples and clear diagrams.
- **Explore** lets students adjust radius and central angle to see arc length and sector area update.
- **Challenge** mixes multiple choice and numeric-entry questions, with explanations after each answer.

## Game experience
- **Playfield** centers on an interactive circle; each level asks students to solve for a missing measure.
- **Controls** support keyboard and large touch targets, sized for iPad play.
- **Scoring** rewards correct answers and streaks; hints are available with a small score tradeoff.
- **Progression** starts with direct formula use, then advances to mixed units and multi-step problems.
- **Feedback** shows the correct method after mistakes and lets students retry before moving on.

## Visual style
- **Landing page** feels like a welcoming math studio, with a prominent Play button and concise learning goals.
- **Circle diagrams** use distinct colors for radius, central angle, arc, and sector.
- **Game layout** keeps the diagram, question, answer controls, and live score visible together on iPad.
- **Progress indicators** show the current level, streak, and topic mastery without crowding the playfield.

## Technical notes
- Build with Next.js, React, and Tailwind; keep learning content server-rendered.
- Use a focused client-side game component for controls, answers, and score updates.
- Keep formulas and question generation in reusable, testable logic.
- Store best score and progress locally so students can return on the same device.
- Make layouts responsive for iPad portrait and landscape, plus desktop and phone screens.

## Out of scope
- Student accounts, teacher dashboards, and cloud-synced progress.
- Multiplayer, leaderboards, and classroom assignment tools.
- Audio narration and sound effects.
- Open-ended geometry drawing or graphing tools.
