# PRODUCT.md — Cambridge Maths Student App (apps/student-learn)

register: product

## What this is

A public web app where Cambridge maths students (IGCSE 0580 and A-Level 9709) learn topic-by-topic through narrated video lessons, worked examples, interactive practice, and mastery-based quizzes. Built on the content-engine generation pipeline; the app is the delivery surface.

## Users

- Ages 14–19, studying for high-stakes Cambridge exams (May/June and Oct/Nov sessions).
- Phone-heavy: assume a 375–430px screen first; laptop second.
- Exam-anxious. The product's emotional job is to *relieve* exam pressure through visible progress, not replicate it. Failure states must diagnose, never punish.
- Marketing-cynical teens: no inflated claims, no fake metrics, no dark patterns. Show only real numbers.

## Product principles

1. **Mastery, not pass/fail.** Per-skill mastery states ("unions secure, intersection needs one more pass") replace the binary 80% gate. Same question data, different emotional contract.
2. **Every failure has a next step.** A missed question always links back to the theory section or worked example that teaches it.
3. **Progress is the retention loop.** Mastery map on the syllabus → spaced-repetition 5-a-day from missed questions → streak fed by a daily short video drop.
4. **Narration is the spine.** Lessons are narration-synced video + text, never captions-over-visuals. Numeric values on screen appear when spoken.
5. **Honest surface.** If only one lesson exists, the home page says so proudly ("Start here") rather than padding with dead cards.

## Anti-references (what this must NOT look like)

- Generic AI-generated SaaS: indigo/purple gradients, glassmorphism, gradient text, hero-metric rows, identical icon-card grids.
- Gamification theatre (XP explosions, coins). Progress mechanics yes; casino aesthetics no.
- Corporate LMS density (Moodle/Blackboard). One clear action per screen.

## Competitors (for register, not imitation)

Save My Exams, Physics & Maths Tutor, Corbettmaths — all information-dense and utilitarian. Our differentiation: narrated video lessons with synced working, interactive practice, and a mastery loop — wrapped in a calmer, more confident visual identity.

## Strategic constraints

- Content plane: Firebase/Express (existing) publishes lesson JSON (canonical schema, see LESSON-SCHEMA.md) + MP4s. Student plane: Convex (auth, enrollment, mastery, quiz attempts, streaks, spaced-repetition queue).
- Lesson videos use the 9709 video track's dark-navy look (#070b16); the app chrome is exam-paper light. Videos read as "projector moments" inside a bright classroom — intentional contrast, do not theme-match them.
- Subjects at launch: 0580 + 9709 Maths only. Biology/Chemistry later; nothing in the app may hardcode maths-only assumptions into the data layer.
