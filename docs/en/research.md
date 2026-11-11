---
title: "Learning to code with AI: literature review (2026)"
description: "AI that does your thinking while you practise lowers what you can do without it; AI used as a tutor does not. A 2026 review with a Claude Code setup."
---
# Learning to Code (and OOD) with AI: Literature Review, Risk Assessment & a Learning-Preserving Claude Code Setup

*Prepared 7 November 2026 · revised 8 November 2026, rewritten for students and teachers on 10 November 2026 and updated with new literature the same day (see §11) · For students who learn programming and Object-Oriented Design (OOD) with AI, and for their teachers*

> **Published version.** This review was first written for one student. This version is written for students and teachers in general; that student's situation remains as examples in boxes. Files it refers to, such as the session logs, are not published.

---

## Contents

The table of contents is in the sidebar.

> **Status note.** Sections 1–9 are the original design. §1–4, §6–8 and §5.3/§5.7 were revised on 8 November 2026 with research from May–November 2026, the shift in skill needs, and a critical review of the original literature review; what changed and why is in the change log (§11). The harness as actually built differs in places: there are microskills, a test runner (`check.mjs`) instead of a PostToolUse evidence hook, a hard own-words explanation check, placement of a new skill by a first attempt, automatic demotion on evidence, Fibonacci reviews at L4 through real work, and a tooling zone. Those differences are summarized in §10, which reports what the first sessions showed; §10.4 covers the revision of 10 November 2026. If you use the harness, its `CLAUDE.md` is authoritative for day-to-day rules. A short literature update on 10 November 2026 added seven sources (change log, §11).

---

## 1. Executive summary

**The literature does not show that AI harms learning by itself. Letting AI do the thinking during practice lowers what you can do without it afterwards. AI that explains or tutors does no harm or helps a little.** The strongest evidence:

- **Performance with AI is not learning.**
    - **High-school maths:** unrestricted GPT-4 raised practice scores by 48% but lowered exam scores by **17%** once access was removed. A tutor that gave hints and no answers avoided the harm (Bastani et al., 2025).
    - **University course:** in a 2026 trial with 2,379 students, an AI tutor used mostly for direct answers lowered final grades by 0.37 SD within the same course (Liu et al., 2026, working paper).
    - **Programming:** in a small study, Copilot raised scores during the session, but students retained less a week later (Gardella et al., 2026). In a quasi-experiment with 152 students, the group that programmed and debugged without AI retained more after seven weeks (Albadarin, 2026, dissertation).
- **AI can also help.** In a proctored trial, ChatGPT access raised test scores without AI by 0.28 SD, mainly for students who used it like a tutor (Contractor & Reyes, 2026, working paper). What decides it is whether the AI replaces your thinking or supports it (Boolzen et al., 2026).
- **Developers learning a new library** with an AI assistant scored 50% vs. 67% on a follow-up quiz, with the largest gap on debugging, and were not significantly faster (Shen & Tamkin, 2026, preprint).
- **Enforced guardrails work better than requested ones.** Telling a tutor in its system prompt to scaffold changed nothing in a trial with 1,059 students (Barth et al., 2026). Gates built into the workflow did better: mastery rules, explanation gates, blocks outside the model. That is the case for hooks over a "learning mode" prompt.
- **Pooled positive effects are mostly publication bias.** The most rigorous 2026 meta-analysis shrinks g = 0.84 to 0.08 after correction, and the most-cited 2025 meta-analysis was retracted. An independent audit of 14 positive meta-analyses found impossible statistics and fabricated references (O'Neill, 2026, preprint).
- **Weaker than the first version claimed** (see the change log, §11):
    - that specific interaction patterns *cause* better learning: every study so far let students choose their own pattern;
    - that LLMs widen the gap between strong and weak students: this rests on an exploratory analysis;
    - that the "85% rule" applies to people: it was shown only in simulations;
    - that expanding review intervals beat equal ones: they do not, reliably;
    - the "Google effect": its first experiment failed to replicate, twice.

**The skill shift is real, but it is not a reason to stop writing code by hand while you are learning it (§2.9).**

- **For the shift:**
    - most new code at AI-forward companies is now drafted by AI;
    - the tool costs about 1–2% of a developer's labour cost;
    - US projections expect "programmer" jobs to shrink, and "developer" jobs to grow more slowly than forecast before.

    For routine, well-specified code at work, writing it by hand is no longer the cheapest way.

- **Against dropping hand practice:**
    - the bottleneck has moved to reviewing and testing, which a study of 655 firms has now measured independently (Chen & Stratton, 2026);
    - AI code still fails more than a third of security checks;
    - entry-level hiring has weakened in the US, but how much of that is due to AI is contested;
    - new interview formats test reading, debugging and checking AI output.

    Hand practice builds those supervision skills, and delegation erodes them most (§2.10).

So the evidence argues for **adding** deliberate practice of AI-era skills (review, testing, specification, verification) on top of hand-written fundamentals, not for replacing them. It also fits programmes that hold the final assessment at AI level 0/1. That matches the Dutch two-lane consensus (Npuls); it is not an outlier.

**Two horizons.** Until your exam, the target is competence without AI under the conditions of your exam. That means practising timed, without AI, in the environment of your exam (§2.6). After the exam, and for your work after your studies, the target follows the shift in skill needs: the supervision side of working with AI, such as specifying, testing and reviewing AI output (§2.9). The risk register (§3) covers both horizons, including the risks of investing too much and too little in writing code by hand.

!!! example "Example: one student's situation"
    This review was first written for a second-year HBO-ICT student. The student's OOD exam at CHE was timed, at AI level 0/1, and about ten weeks after the review was written. For that student, the first horizon ran until that exam date. After it, the focus could widen to the supervision skills of §2.9.

The learning-science foundations line up with this:

- **Effort:** learning depends on effortful generation and retrieval (Bjork, 1994; Roediger & Karpicke, 2006).
- **Expertise:** the right amount of help changes with your expertise (Kalyuga et al., 2003).
- **Fading:** scaffolds should be **faded** (Renkl & Atkinson, 2003; Wood, Bruner & Ross, 1976).
- **Difficulty:** practice should be hard enough that you sometimes fail.
- **Decay:** mastered skills **decay** unless they are reinforced at spaced intervals (Arthur et al., 1998; Cepeda et al., 2006).
- **Transfer:** practice transfers best when it matches the conditions of the test (Morris, Bransford & Franks, 1977).

**Proposal:** a Claude Code setup in which every skill moves up an **Autonomy Ladder**. The ladder goes from *AI demonstrates*, to *I complete*, to *I write with hints*, to *I write alone*, to *mastered → AI automates*, and ends with spaced "maintenance" checks that can demote the skill again. Three pieces of infrastructure enforce it:

1. A **skill record** (`skills.json`) that tracks the level, evidence and next review date for each skill.
2. An **AI diary**: one entry per session, with facts logged by the AI and reflection written by you.
3. **Hooks** (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`) that inject level-appropriate tutoring rules, block the AI from writing code you are still supposed to write, schedule reviews and prompt reflection.

The hooks are a **commitment device** you choose for yourself (Ariely & Wertenbroch, 2002), not a prison. You can step out deliberately, and stepping out gets logged.

**For teachers and programmes.** This review is written mainly for students. §4.2 is a separate part for teachers and programmes: it turns this evidence into points for the AI policy of a course or programme.

---

## 2. Literature review

### 2.0 Scope, method and evidence grades

This is a **narrative review**, not a systematic one. The first version (7 November 2026) had no search protocol, no inclusion criteria and no quality appraisal, and it mixed randomized trials, small interview studies and preprints in single tables. The revision of 8 November 2026 added:

- **Targeted searches.** Four searches covered May–November 2026: learning research, the labour market, the economics of AI coding, and skills and assessment policy. Two citation checks compared the original claims with their primary sources. The notes, with a link for every figure, are in the [research notes](notes/index.md); the synthesis is in `reports/` and is not published. A short follow-up search on 10 November 2026 covered 8–10 November and studies the first searches had missed (see the [notes of the update](notes/update_2026-11-10.md)).
- **Corrections** wherever a claim went further than its source (listed in the change log, §11).
- **An evidence grade** for each study:

| Grade | Meaning |
|---|---|
| **A** | Randomized trial with an outcome measured *without* AI or after a delay, or a meta-analysis corrected for publication bias |
| **B** | Randomized or quasi-experimental, but only short-term or with-AI outcomes |
| **C** | Observational, correlational, qualitative, small, or descriptive usage data |
| **D** | Claims by companies or executives, press reports, opinion |

**Conflicts of interest.** Several key sources come from AI vendors:

- **Anthropic:** Shen & Tamkin, the Education Report, and the study of its own engineers.
- **Microsoft and GitHub:** Peng et al., Cui et al., Lee et al.
- **Google:** DORA.

This document was written with Claude, Anthropic's model, and Claude agents did the research for the revision. A vendor study that reports *harm* from the vendor's own product, such as Shen & Tamkin, is more credible than a vendor claim about how much code AI already writes; such claims are graded D. Check important claims through the linked primary source.

**Two time horizons.** The review answers two different questions, and the evidence answers them differently:

- **Short term (§2.1–2.8):** what helps you pass an exam at AI level 0/1 on your exam date.
- **Long term (§2.9):** which skills will matter in the labour market after your studies.

### 2.1 How programming and OOD skills are learned

**Programming is hard to learn, and the difficulty lies in problem decomposition and mental models more than in syntax.** The multinational McCracken et al. (2001) study found that most first-year students could not solve a moderate programming problem. Robins, Rountree & Rountree (2003) reviewed the field and concluded that novices lack *schemas* (plans) and *mental models* of program execution. Novices have trouble combining known constructs into solutions. Knowing the constructs is not the bottleneck.

**Reading and tracing come before writing.** Lister et al. (2004) showed that many students cannot reliably *trace* code. Lopez et al. (2008) found a hierarchy in which tracing and explaining code predict writing ability. **This matters for AI use:** if AI writes the code, you get *reading* practice at best. Reading practice only pays off when you actually trace and explain the code. Passively accepting it does not count.

**OOD has its own misconceptions.** Holland, Griffiths & Woodman (1997) described common object misconceptions, for example confusing a class with an instance, or seeing objects as mere data records. Ragonis & Ben-Ari (2005) followed novices over a long period and found persistent difficulties with object state, constructors and the static/dynamic distinction. Eckerdal & Thuné (2005) showed that students' *conceptions* of object and class range from "a piece of code" to "a model of something in the problem domain". The last of these is the conception OOD needs. Sanders & Thomas (2007) built a checklist of OO concepts and misconceptions for assessment. Kölling (1999) argued that OOP needs an "objects first" approach with suitable tools. **What this means for you:** OOD skill is largely *design judgment*, which shows up as choosing responsibilities, abstractions and relationships. An AI that hands over finished, pattern-heavy designs lets you skip exactly that judgment.

**Instructional techniques with good evidence in computing education:**

- **Worked examples** cut cognitive load for novices (Sweller & Cooper, 1985; Sweller, 1988).
- **Subgoal labels** (named steps in a worked example) improve problem solving and transfer in programming (Margulieux, Catrambone & Guzdial, 2012; Morrison, Margulieux & Guzdial, 2015).
- **Parsons problems** (rearranging given code fragments) are an efficient bridge between reading and writing (Parsons & Haden, 2006; Ericson, Margulieux & Rick, 2017).
- **Self-explanation** of examples strongly predicts learning (Chi et al., 1989).
- **Generating answers yourself** improves memory compared with reading them: the *generation effect* (Slamecka & Graf, 1978; meta-analysis Bertsch et al., 2007).

### 2.2 Friction: desirable difficulties vs. getting stuck

**Desirable difficulties.** Bjork (1994) and Bjork & Bjork (2011) showed that conditions which slow down *apparent* progress during practice often *improve* long-term retention and transfer. Examples are spacing, interleaving, retrieval and generation. Fluent, easy practice gives an *illusion of competence*: students judge their learning by how easy practice felt, and that judgment is systematically wrong (Koriat & Bjork, 2005; Kornell & Bjork, 2008). AI assistance is close to the ultimate fluency machine.

**But difficulty has to be *desirable*, meaning you can overcome it:**

- **Minimal guidance fails novices.** Kirschner, Sweller & Clark (2006) reviewed the evidence that unguided discovery overloads working memory.
- **Productive failure.** Kapur (2008, 2016) showed that struggling with a problem *before* instruction can improve conceptual understanding and transfer, but only if the struggle is followed by consolidation. Kapur (2016) separates *productive failure* from *unproductive failure*, where a student flounders without support. A meta-analysis of 53 studies found a moderate advantage for problem solving before instruction (g = 0.36, 95% CI 0.20–0.51), and a larger one (0.37–0.58) when the design followed productive-failure principles. Instruction first was better for young learners and for domain-general skills (Sinha & Kapur, 2021). So the debate with Kirschner et al. is moderated, not settled. An attempt only counts as productive failure if an explanation follows that builds on it and compares it with a canonical solution. Without that, "attempt first" is the minimally guided case Kirschner et al. criticise.
- **Confusion can help.** D'Mello et al. (2014) found that confusion improves learning *when it is resolved*. Unresolved confusion turns into frustration and disengagement.
- **The 85% rule is a heuristic, not evidence.** Wilson et al. (2019) derived that learners trained by stochastic gradient descent on *binary classification* tasks learn fastest at a training error rate of about 15.87% (accuracy ≈ 85%).
    - **Simulations only:** they showed it in a perceptron, a two-layer network on MNIST digits and a model of monkey perceptual learning. They collected no human data and call a human test future work.
    - **Depends on noise:** with non-Gaussian noise the optimum moves to 82% or 75%.
    - **Difficulty, not mastery:** the number is a difficulty target *during* practice, not a mastery threshold.
    - **Not measurable here:** over 5 tasks a success rate can only be 80% or 100%.

    The harness therefore uses "about 85%" only as a rule of thumb: practice should be hard enough that you sometimes fail.

- **Zone of proximal development / region of proximal learning.** Vygotsky (1978) described the zone where you succeed *with* help but not yet alone. Metcalfe & Kornell (2005) showed that students gain most from studying items just beyond their current mastery.
- **Flow.** Csikszentmihalyi (1990) found that engagement peaks when challenge matches skill. Too easy leads to boredom and too hard to anxiety.

**Help-seeking itself can go wrong.** Aleven & Koedinger (2000) and Aleven et al. (2003) showed that students in tutoring systems often *misuse* help: they click through hints to reach the answer ("help abuse") or avoid help when they need it. Baker et al. (2004) documented "gaming the system" and its negative link with learning. **An AI coding assistant is a hint button with no limit.** Help-seeking behaviour therefore needs structure, such as hint ladders, time limits and attempt requirements.

**Bottom line for friction:** aim for *struggle with a safety net*. You try first, help escalates gradually and only after a real attempt, you are never left stuck and alone for too long, and every struggle ends with consolidation (an explanation, a reflection, or a worked solution *after* the attempt).

### 2.3 Scaffolding, fading and the expertise-reversal effect

- **Scaffolding** was defined by Wood, Bruner & Ross (1976) as tutor support that controls the parts of a task beyond the student's capacity. Pea (2004) and Puntambekar & Hübscher (2005) stressed that a scaffold only counts as one if it is **faded**. Permanent support is just a crutch.
- **Cognitive apprenticeship** (Collins, Brown & Newman, 1989) runs through *modelling → coaching → scaffolding → fading → articulation → reflection → exploration*. This sequence is practically the blueprint for the Autonomy Ladder in §5.
- **Faded worked examples.** Renkl & Atkinson (2003) and Atkinson, Renkl & Merrill (2003) showed that gradually removing solution steps from worked examples (*backward fading*) works better than jumping from examples to problems all at once.
- **Expertise-reversal effect.** Kalyuga et al. (2003) showed that guidance which helps novices becomes *redundant and harmful* for more advanced students. **Help level must therefore follow your expertise in each skill.** A fixed "tutor mode" is too much for some skills and too little for others.
- **Contingent tutoring.** Wood & Wood (1999) found the most effective tutors follow a rule: *give more help after failure, less after success*. That rule can be implemented directly (§5.3).

### 2.4 Mastery, skill acquisition stages and when to automate

- **Stages of skill acquisition.** Fitts & Posner (1967) proposed cognitive → associative → autonomous stages. Anderson (1982) formalized this as declarative knowledge compiled into procedures. Dreyfus & Dreyfus (1980) described novice → advanced beginner → competent → proficient → expert. Once a skill is *autonomous*, it no longer needs conscious attention. **That is the right moment to hand it to automation:** cognitive resources are then free for the next skill, and you still have the competence to *supervise* the automation.
- **Mastery learning.** Bloom (1968, 1984) proposed that students move on only after showing mastery (≈ 80–90% on a criterion test).
    - **Course exams:** a meta-analysis of 108 evaluations found positive effects, strongest for weaker students (Kulik, Kulik & Bangert-Drowns, 1990).
    - **Standardized tests:** effects are essentially zero, a point Kulik et al. accepted (Slavin, 1987, 1990).
    - **Cost:** mastery gates take time and reduce coverage.

    Both points matter here. The gains show up on narrow tests aligned with the course, which a course exam is. A strict gate, such as "no promotion while explanations are open", trades coverage for depth.

- **The "2 sigma" claim does not hold.** Bloom's (1984) two-standard-deviation effect of one-to-one tutoring rested on two three-week dissertation studies with narrow tests. About half of it came from the mastery tests and corrective feedback, not from tutoring itself (von Hippel, 2024). Better estimates:
    - human tutoring d ≈ 0.79 and intelligent tutoring systems d ≈ 0.76 (VanLehn, 2011);
    - tutoring programmes about 0.29 SD (Nickow, Oreopoulos & Quan, 2024);
    - tutoring systems a median 0.66 SD, much larger on locally made tests than on standardized ones (Kulik & Fletcher, 2016).

    A realistic expectation for an AI tutor is a fraction of a standard deviation, not two.

- **Knowledge tracing.** Corbett & Anderson (1994) modelled the probability that a skill is known, updating it after each attempt, and declared mastery at P(known) ≥ 0.95. This idea is behind the skill record in §5.5. Anderson et al. (1995) and VanLehn (2011) showed that step-based intelligent tutoring comes close to the effectiveness of human tutoring.
- **Deliberate practice.** Ericsson, Krampe & Tesch-Römer (1993) identified effortful practice on specific weaknesses, with immediate feedback, as the engine of expertise. Practice in easy "autopilot" mode does not have the same effect. Treat this as a principle of practice *quality*. It does not show that the amount of practice explains most differences between people:
    - **Variance explained:** deliberate practice explained 26% in games, 21% in music, 18% in sports, 4% in education and under 1% in professions (Macnamara, Hambrick & Oswald, 2014).
    - **Replication:** a direct replication of the original study failed (Macnamara & Maitra, 2019).
    - **Counter-claim:** Ericsson & Harwell (2019) report higher shares when they keep only studies that match the original definition.
- **Overlearning** (practice beyond first mastery) improves retention, but the benefit fades over time (Driskell, Willis & Copper, 1992). *Spacing* is a more efficient use of extra practice (Rohrer et al., 2005).

### 2.5 Retention after mastery: spacing, retrieval and skill decay

- **Forgetting** follows a steep curve that slows over time (Ebbinghaus, 1885).
- **Spacing effect.** Cepeda et al. (2006) reviewed 317 experiments: practice spread out over time beats massed practice. Cepeda et al. (2008) found that the optimal gap grows with the retention interval but shrinks as a share of it, from about **20–40% of a one-week** test delay to about **5–10% of a one-year** delay. If your exam is about ten weeks away, this points to gaps of one to two weeks between reviews of a learned skill. The study used trivia facts with a single review, so applying it to programming skill is an extrapolation. Kang (2016) reviewed spacing as a practical, efficient strategy.
- **Expanding intervals are not proven better.**
    - **Spaced vs. massed:** spaced retrieval beats massed retrieval (g = 0.74).
    - **Expanding vs. equal:** expanding schedules, like the harness's Fibonacci intervals, did not beat equal spacing (g = 0.034, not significant). They gain only when items are retrieved many times (Latimier, Peyre & Ramus, 2021).
    - **First retrieval:** what matters most is delaying the first retrieval (Karpicke & Roediger, 2007).
    - **During training:** expanding and equal spacing tie on a test eight weeks later, but expanding keeps recall much higher during the training period (Kang et al., 2014).

    So the Fibonacci schedule is defensible because it keeps early reviews successful and puts them before your exam. Growing intervals are not proven superior.

- **Retrieval practice (the testing effect).** Retrieving from memory beats re-studying (Roediger & Karpicke, 2006; Karpicke & Roediger, 2008). Meta-analyses: Adesope, Trevisan & Sundararajan (2017); for spaced retrieval specifically, Latimier, Peyre & Ramus (2021). Dunlosky et al. (2013) rated practice testing and distributed practice the two *highest-utility* learning techniques.
- **Interleaving** (mixing problem types) improves the ability to *choose* the right strategy (Rohrer & Taylor, 2007). A meta-analysis found g = 0.42, largest when the categories are similar (Brunmair & Richter, 2019). There is no randomized trial in programming yet. Choosing is crucial in OOD, where the hard part is knowing *which* pattern or principle applies. Students judge interleaving as harder and wrongly believe they learn less from it (Samani & Pan, 2021), so a review session that feels worse is not evidence that it works worse.
- **Skill decay.** Arthur et al. (1998) meta-analysed 53 articles.
    - **Over time:** skill loss grew from d ≈ −0.01 right after training to d ≈ −1.4 after more than a year of non-use.
    - **By task type:** **cognitive, artificial and accuracy-based tasks decay faster** than physical, natural and speed-based ones.
    - **Retrieval conditions:** retention tests under conditions similar to training showed less loss.
    - **Newer estimate:** a 2025 meta-analysis of procedural skills found half of the initial accuracy gains lost after about 6.5 months (Tatel & Ackerman, 2025).

    Writing correct code from memory, for example C#, falls in the fast-decaying class.

- **Adaptive scheduling.** The Leitner system (Leitner, 1972) and half-life regression (Settles & Meeder, 2016, from Duolingo) set review intervals adaptively from success history. This is the model behind §5.7.

### 2.6 Practice conditions and transfer to the test

How and where you practise affects how well your skill carries over to the exam. Two conditions matter here: whether you have practised timed and without help, and whether you have practised in the IDE that your exam uses. The literature supports paying attention to both, with one correction about what matters most.

!!! example "Example: one student's situation"
    A second-year HBO-ICT student practised OOD in Visual Studio, with AI available. A diagnostic test at CHE was in Rider, timed and without AI. The student's own analysis named the practice conditions as a main cause of the result: there had been no timed practice without help, and the test was in a different IDE.

- **Transfer-appropriate processing.** Performance depends on how well the processing during practice matches the processing at the test (Morris, Bransford & Franks, 1977; see also encoding specificity, Tulving & Thomson, 1973). Practice in the test's format transfers better:
    - **Classroom quizzing:** g ≈ 0.50, moderated by how consistent the practice format is with the test format (Yang et al., 2021).
    - **Test-enhanced learning:** it transfers with d ≈ 0.40, mostly across formats and to application questions. Once publication bias is corrected, there is hardly any transfer without those supporting conditions (Pan & Rickard, 2018).
- **The room matters less than the task.** Effects of the physical environment are reliable but modest (d ≈ 0.28; Smith & Vela, 2001, as summarised by Smith et al., 2014), and the classic underwater study failed to replicate (Murre, 2021). An IDE is not background context, though. Creating classes, running tests and reading compiler output in the IDE of your exam are part of the procedure being tested.
- **Stress and stakes.** Retrieval practice protected recall against acute stress in one study (Smith, Floerke & Thomas, 2016), with mixed follow-ups. High-stakes quizzes *during learning* removed the benefit of retrieval practice (Hinze & Rapp, 2014). Training under stress improves performance under stress and carries over to new stressors and tasks (Saunders et al., 1996; Driskell, Johnston & Salas, 2001).
- **What this means.** Learn at low stakes, with hints, first. In the last weeks before your exam, rehearse timed sessions without AI in the IDE of your exam, starting short and working up to full mock exams. No study has measured the cost of an unfamiliar IDE specifically, so this is an inference from the principles above.

### 2.7 Reflection, learning journals and self-regulation

- **Self-regulated learning (SRL).** Zimmerman (2002) described a cycle of *forethought → performance → self-reflection*. Students who plan, monitor and reflect learn more.
- **Writing learning protocols.** Nückles, Hübner & Renkl (2009) showed that journal writing with **cognitive and metacognitive prompts** improves learning outcomes. Nückles et al. (2020) refined this into a self-regulation account of writing-to-learn. Moon (2006) gives practical guidance on learning journals. Schön (1983) and Boud, Keogh & Walker (1985) laid the foundations of reflective practice.
- **Feedback** is among the stronger influences on learning, especially when it is rich in information and addresses the task, the process and self-regulation rather than the person (Hattie & Timperley, 2007; Shute, 2008).
    - **Average effect:** the newer meta-analytic estimate is d = 0.48 (95% CI 0.44–0.51) (Wisniewski, Zierer & Hattie, 2020).
    - **By feedback type:** high-information feedback reaches d ≈ 0.99, praise or rewards d ≈ 0.24 (same source).
    - **Harm:** over a third of feedback interventions made performance *worse* (Kluger & DeNisi, 1996).

    For the harness, positive signals should name the specific (micro)skill and strategy that worked, not praise the person. **Learning from errors** works best when the errors are corrected and reflected on (Metcalfe, 2017).

- **Self-determination theory.** Ryan & Deci (2000) showed that autonomy, competence and relatedness sustain motivation. A setup that *you* configure and that makes your progress visible supports autonomy and competence. One that nags and blocks you arbitrarily undermines them.

**Implication for an AI diary:** the *facts* can be logged automatically (skills touched, hints used, levels, test results). The *reflection* has to be **written by you**, prompted with specific questions. If the AI writes your reflection, you lose the generation effect (Slamecka & Graf, 1978; Bertsch et al., 2007) and the benefit of writing to learn (Nückles et al., 2009). Fan et al. (2025) are often cited here, but they did not study AI-written reflections. They found that ChatGPT support improved an essay without improving knowledge gain or transfer, and *interpreted* that as metacognitive laziness.

### 2.8 Generative AI and learning to program: the evidence so far

**Capabilities and early framing.** By 2022 LLMs could already solve typical CS1 exam problems (Finnie-Ansley et al., 2022). Becker et al. (2023) and Denny et al. (2024) argued that this changes what computing education must teach. The ITiCSE working group of Prather et al. (2023) surveyed students and instructors. Lau & Guo (2023) documented instructor attitudes ranging from "ban it" to "resistance is futile". Zastudil et al. (2023) found that students and instructors both worried about over-reliance.

By 2026, five current models scored above the average student on the tests and exam tasks of an introductory university OOP course: ChatGPT-5.2, DeepSeek-V3, Gemini 2.5 Flash, Claude Sonnet 4.5 and M365 Copilot. They often got full marks on the longer tasks. They still sometimes produced code that did not compile, and they **struggled with interfaces, abstract classes and some inheritance tasks** (Lepp & Kaimre, 2026, preprint). Those are core OOD constructs, so relying on AI there means relying on it where it is least reliable.

**Studies of AI and novice programmers** (grades as in §2.0):

| Study | Design | Key finding | Grade |
|---|---|---|---|
| Kazemitabaar et al. (2023), CHI | Randomized; 69 novices aged 10–17; Codex vs. none; retention test after a week | Better code authoring with Codex, less frustration. **No significant difference in one-week retention**; the Codex group did slightly better. Students with more prior experience benefited more. | A (small) |
| Kazemitabaar et al. (2023b), Koli Calling | Observational; only the 33 students who had Codex | Copy-pasting whole tasks went with worse retention, and writing code first and then asking AI went with better retention. **These were trends, not significant.** | C |
| Prather et al. (2024b), TOCHI | Qualitative; novices using Copilot | New metacognitive difficulties: being "drawn in" by suggestions, losing your own plan. | C |
| Prather et al. (2024), ICER "Widening Gap" | Qualitative lab study; 21 novices; observation, eye tracking, interviews | Strong students accelerated, weak students were derailed. **Illusion of competence.** | C |
| Margulieux et al. (2024), ITiCSE | Observational; novices with LLMs | Self-regulation, self-efficacy and fear of failure shaped *how* students used LLMs. | C |
| Kazemitabaar et al. (2024), CHI: CodeAid | Deployment; 700 students, 12 weeks; tool withholds full solutions | Educators valued the pedagogical design. Risks: occasional wrong feedback, and **students defaulting to ChatGPT** for direct answers. | C |
| Liffiton et al. (2023): CodeHelp | Deployment; guardrailed LLM help in classes | Guardrails (no code solutions) were feasible at scale and well received. | C |
| Liu et al. (2024): CS50 "duck" | Deployment; AI tutor in Harvard CS50 | A pedagogically constrained AI tutor ran at scale; students reported it as helpful. | C |
| Lyu et al. (2024): CodeTutor | Semester field study; 50 students; **not randomized** (researchers assigned the groups) | Scores rose within both groups, but there was no direct test between them. Critical thinking and prompt quality mattered. | C |
| Jošt, Taneski & Karakatič (2024) | Correlational; 32 students over 10 weeks; no control group | Heavier LLM reliance went with **lower** grades. | C |
| Hellas et al. (2023), ICER | Analysis of LLM answers to novice help requests | Often helpful, but **frequently included incorrect** content or full solutions. | C |
| Leinonen et al. (2023); Sarsa et al. (2022) | LLM error explanations and exercise generation | Useful as *generators* of explanations and exercises, a good role for AI. | C |
| Denny et al. (2024b): Prompt Problems | New exercise type | Students learn to specify problems precisely for AI, a new skill worth practising. | C |
| Kazemitabaar et al. (2025), IUI | Randomized; 82 between-subjects, then 42 within-subjects; seven ways to engage with AI-generated code | The best technique walks students through the problem step by step and asks what each stage needs *before* revealing the code. Engaging techniques beat passive viewing. | B |
| **New:** Gardella et al. (2026), ICER | Within-subjects; 22 CS2/CS3 students; Copilot vs. a human pair, 20 min each; solo retest without AI a week later | With Copilot, performance rose 14 points (g = 0.99) and workload fell. From the session to the retest, scores dropped 18.9 points more after the Copilot trial (g = −1.13, p_adj = .054). The absolute retest difference was not significant. | A (small) |
| **New:** Barth et al. (2026), ICER | Preregistered crossover; 1,059 CS1 students over six weeks | Steering the tutor's pedagogy through system prompts (self-regulation or ICAP scaffolds) made **no difference** on any preregistered outcome. The authors conclude that tutor pedagogy "may not be easily steered by system prompts alone". | A |
| **New:** Pădurean et al. (2026), ICER | Log study; 917 CS1 students, 2,636 sessions; realistic bugs injected into AI-generated solutions | Injected bugs made students edit and repair the code itself, with more success on the next attempt. Natural prompt failures made them reword the prompt instead. | C |
| **New:** Prather et al. (2026), ICER: "Scaffolding Autocomplete" | An exercise that trains telling good from bad AI suggestions | Students did better with one suggestion than with several. Sample and design not verified. | C |
| **New:** Ardic, Le Dilavrec & Zaidman (2026), *Empirical Software Engineering* | Observational; 12 students using ChatGPT (GPT-3.5) to write unit tests | Four strategies, depending on who had the test idea and who wrote the code. Students saved time but trusted the tests less and felt less ownership. | C |
| Sankaranarayanan (2026), preprint, February | 78 online learners; manual vs. unrestricted AI vs. AI behind an "explanation gate" (teach-back), in Cursor | Both AI arms produced more working code. On a later 30-minute maintenance task with AI blacked out, **77% failed after unrestricted AI vs. 39% after the explanation gate**. Randomization not stated. | C |
| **New (10 Nov):** Bergh, Tag, Vassar & Renzella (2026), preprint, September | Controlled between-subjects experiment; 55 CS undergraduates; three C tasks with ChatGPT vs. web search; recall quizzes right after and 48 hours later | With ChatGPT, coding scores were higher (89% vs. 69%), but **recall was lower** right away (41% vs. 53%) and after 48 hours (39% vs. 52%). Students credited themselves with 45% of their submitted code, against 81% without ChatGPT. Mental effort rose less across the tasks. Randomization not stated in the abstract. | B |
| **New (10 Nov):** Albadarin (2026), doctoral dissertation, University of Eastern Finland | Quasi-experimental; 152 university students; programming and debugging with Llama 3.1 vs. without AI; retention test seven weeks later | The AI group was better and faster on some debugging tasks, but **the group without AI retained more after seven weeks**. Figures from a university Q&A (10 Nov 2026); scores and effect sizes not yet seen. | B |
| **New (10 Nov):** Lepp (2026), FIE, preprint | Survey; 210 first-year students in an OOP course where AI was allowed for coursework and banned in assessments; cluster analysis | Five usage profiles, including a "smart" one (little code generation, much conceptual and debugging help). **No significant difference in assessment scores** between the profiles. | C |

**Studies of AI and learning in general:**

- **Bastani et al. (2025), PNAS.** *Grade A.* Randomized by classroom; about 1,000 students in grades 9–11 at one Turkish high school.
    - **GPT Base** (unrestricted): +48% in practice, but **−17% on the exam** after access was removed.
    - **GPT Tutor** (hints, guardrails): +127% in practice and no exam harm (−0.004, not significant).

    Students used the unrestricted tool "as a crutch".

- **Shen & Tamkin (2026), arXiv preprint (Anthropic Fellows).** *Grade A for the main effect, C for the patterns.*
    - **Design:** randomized; 52 mostly professional or freelance developers (aged about 25–35, recruited through a crowdworker platform) learned the asynchronous Python library Trio, with or without a GPT-4o-based assistant.
    - **Result:** the AI group scored **50% vs. 67%** on the follow-up quiz (d = 0.74, p = 0.01), with the largest gap on debugging. It was only about two minutes faster, which was not significant. The paper calls the gap "17%"; its own numbers give 15.4 points.
    - **Patterns:** the six interaction patterns with cognitive engagement (asking conceptual questions; generating code, then checking understanding) scored 65–86%, against 24–39% for delegation. **The patterns were identified afterwards from screen recordings, with 2–7 people each, so they are correlational.** Stronger or more motivated participants may simply choose them.
    - **Vendor:** a vendor study, but its result runs against the vendor's commercial interest.
- **Lehmann, Cornelius & Sting (2025), arXiv preprint, still unpublished.** *Grade A for the null effect, C for the rest.*
    - **Design:** a field study (observational) plus two preregistered lab experiments in which only LLM access was randomized.
    - **Average effect:** **neither lab experiment found an average effect on learning** (n = 107 and n = 69).
    - **Solutions vs. explanations:** the contrast between asking for solutions (breadth without depth) and asking for explanations (depth) comes from the observational data.
    - **"Widening gap":** the gap between students with low and high prior knowledge is an **exploratory** median split (pooled n = 176, interaction p = 0.028).
- **Fan et al. (2025), BJET, "metacognitive laziness".** *Grade B.* Lab experiment, 117 students in four conditions: ChatGPT, a human expert, writing analytics, nothing. ChatGPT improved the essay *product* most, but knowledge gain and transfer did not differ. "Metacognitive laziness" is the authors' interpretation, not a measured outcome.
- **Stadler, Bannert & Sailer (2024), Computers in Human Behavior.** *Grade B.* Randomized; 91 students; ChatGPT-3.5 vs. Google search. LLMs reduced mental effort during scientific inquiry, but the reasoning was less deep.
- **Darvishi et al. (2024), Computers & Education.** *Grade A.* Randomized; 1,625 students in 10 courses. Students leaned on AI assistance in peer feedback, and their own performance dropped when it was removed. Self-regulation strategies helped them keep agency.
- **Kestin et al. (2025), Scientific Reports.** *Grade B, short-term only.* Two-week crossover in a Harvard physics course; 194 of 233 students analysed. An AI tutor built on pedagogical best practice beat in-class active learning (0.73–1.3 SD) in less time (median 49 vs. about 60 minutes). Limits:
    - the post-test came **right after each lesson, with no retention test**;
    - the tutor was used at home;
    - it relied on pre-written answers.
- **Kosmyna et al. (2025), arXiv preprint, not peer reviewed.** *Grade C.* 54 participants, only 18 in the fourth session. In an essay task, the LLM group showed the lowest EEG connectivity, the lowest sense of ownership and poor recall of their own essays ("cognitive debt"). A formal methodological critique exists (Stanković et al., 2026).
- **Gerlich (2025), Societies; Lee et al. (2025), CHI.** *Grade C.* Both correlational:
    - Gerlich: a survey of 666 people, with a published correction to a table.
    - Lee et al.: a self-report survey of 319 knowledge workers (936 examples), by Microsoft authors.

    Heavier AI use and more trust in AI go with less critical-thinking effort. For knowledge workers, critical thinking shifts towards checking output.

- **Anthropic (2025a), Education Report.** *Grade C, vendor data.* 574,740 student conversations; **≈ 47% were "direct"**, meaning the student wanted the answer with minimal engagement. Students also delegated higher-order tasks such as creating and analysing. Computer science made up 36.8% of conversations (38.6% in the body of the report), against 5.4% of US degrees.
- **Productivity is not learning.**
    - **Peng et al. (2023):** developers were 55.8% faster with Copilot (95% CI 21–89%) on one well-specified greenfield task. 95 were recruited and 35 per group completed. Preprint, by GitHub and Microsoft authors.
    - **METR (Becker et al., 2025):** 16 experienced open-source developers, working on 246 of their own tasks, were **19% slower** with early-2025 tools (CI +2% to +39%). They had forecast a 24% speed-up and afterwards believed it had been 20%.
    - **METR follow-up (February 2026):** 57 developers and over 800 tasks gave estimated speed-ups of 18% and 4%, both with intervals that include zero. METR calls the data unreliable, because 30–50% of the developers held back tasks they did not want to do without AI, and is redesigning the study.

    Perceived and actual gains can diverge, even for experts.

- **Vendor "learning modes".** Several products build pedagogy into the model's behaviour:
    - Claude Code's *Learning* output style, with `TODO(human)` markers;
    - OpenAI's ChatGPT study mode (July 2025);
    - Google's Guided Learning in Gemini (August 2025); LearnLM is no longer a separate model.

    All are **opt-in and easy to switch off**, none tracks mastery per skill, and **no evaluation of their learning outcomes** was found.

**New evidence, May–November 2026:**

- **Maryland trial (Liu et al., 2026; working paper).** *Grade A, not peer reviewed.*
    - **Design:** randomized by instructor; 2,379 undergraduates and 30 instructors. A GPT-4o tutor was built into the course, mostly in direct-answer mode, and both arms also had ChatGPT and Gemini. Only about 15% of students used the tutor.
    - **Grades:** final grades fell by **0.37 SD** in comparisons within the same course. Across the full sample the drop was not significant.
    - **Engagement:** recorded participation fell by 0.90 SD.
    - **Equity:** first-generation students lost more (−0.50 vs. −0.22 SD).
    - **Use:** 73.8% of requests sought information, explanations or solutions; 0.7% asked for feedback on the student's own work.
- **Middlebury trial (Contractor & Reyes, 2026; working paper).** *Grade A, not peer reviewed; one short task.*
    - **Design:** randomized and proctored; 211 undergraduates had a 35-minute learning phase on an unfamiliar topic, and then took all tests without AI.
    - **Result:** ChatGPT access **raised** AI-free test scores by 0.28 SD, and by about 0.21 SD a week later (p = 0.068).
    - **Use type:** students who used it like a tutor gained, while students who let it write for them lost their essay advantage once AI was removed. That split is self-selected.
    - **Caveats:** not programming; figures from the arXiv HTML version.
- **Mastery-practice trial (Oreopoulos, Liut, Sungu & Low, 2026; working paper; middle school).** *Grade A, K-12.* Individually randomized; over 6,000 students. A guard-railed tutor improved a one-week test by only **3.1 percentage points (p = 0.065)**, and only inside a mastery workflow. Mastery alone did not improve delayed learning. One author is a co-author of Bastani et al.
- **MBA field experiment (Yang, Van Alstyne & Dellarocas, 2026; preprint).** *Grade B.* Preregistered; 86 students. A structured tutor grounded in the course beat freely available consumer AI by 6.63 points (p = .007).
- **"Generative AI learning penalty" (Strömberg, Lei & Wu, 2026; CEPR working paper).** *Grade B, quasi-experimental, not higher education.* Difference-in-differences on 26,811 secondary-school students in China. After AI adoption, homework scores rose 18% while closed-book exam scores fell about 20% within six months. About 80% of users showed signs of outsourcing their homework.
- **AI tutors over-help (Teo et al., 2026; preprint).** *Grade C.* In simulations, LLM "teachers" step in earlier and more often than human teachers, and hand out complete solutions instead of targeted hints.
- **Meta-analyses.** The most rigorous one (Boolzen et al., 2026, *Artificial Intelligence Review*, preregistered) pooled 49 studies of AI in STEM education:
    - the uncorrected g = 0.84 falls to **0.08 after correcting for publication bias**;
    - none of the 34 randomized trials had low risk of bias;
    - 33 studies showed large effects only because the two groups did different cognitive work;
    - AI helped when it augmented the student's activity and could harm when it replaced it.

    Two other 2026 meta-analyses report g = 0.50 and g = 1.10 without bias correction (Fan, Ke, Chen & Lv, 2026; Liu, Xie & Xu, 2026). The most-cited 2025 meta-analysis (Wang & Fan, g = 0.87) **was retracted in 2026** after a critique of its methods; it had been cited more than 500 times. *Uncorrected pooled effects should not be cited as evidence that AI improves learning.*

    An independent audit (O'Neill, 2026, EdArXiv preprint) of 14 of the 39 meta-analyses that reported positive effects found "impossible statistics", "hallucinated references", comparisons of AI-supported study with no study at all, and no correction for publication bias. Two-thirds of the calls for papers seemed to discourage null or negative results. His preliminary pooling of 44 well-designed experiments averaged out to roughly zero. *Preliminary; known from press coverage, the preprint itself was not read.*

- **Stanford SCALE evidence review (Walker, Fesler, Martinez Claeys, Agnew & Loeb, 10 November 2026).** *A screened synthesis, not a meta-analysis.* An LLM pre-screened 868 papers from October 2025 to June 2026 on What Works Clearinghouse criteria, and at least two researchers reviewed each causal paper. 52 papers now meet its bar for strong causal evidence, 32 of them new. Despite the "K-12" title, most new papers come from higher education, and most of the repository is unreviewed preprints. Its conclusions:
    - AI "appears to be better for learning when students use it for learning support than when they use it for producing work, although neither type of use consistently improves learning";
    - outsourcing work to AI can lower performance when students later work without it;
    - AI can improve the learning *experience* without improving learning outcomes;
    - the evidence "still does not show whether AI tools can produce long-term learning gains".
- **Assignments overstate mastery.**
    - **Đức Minh (2026):** *grade C, observational.* In 1,498 Vietnamese undergraduates, AI-assisted assignments averaged 7.62, while mastery checked at random without devices averaged 5.55.
    - **Eleftheriou, Pallis & Constantinides (2026):** *grade B; April, just before the window; n = 85.* A standard LLM gave the highest *perceived* understanding and the lowest *measured* learning, and guided hints gave the largest gains.
- **Agentic tools and OOD: an evidence vacuum.** No controlled study yet measures student learning with Claude Code, Cursor, Copilot agent mode or Codex. No study measures design skill without AI after AI-assisted practice; the one UML experiment (EDULEARN26) measured performance and perceptions only *with* ChatGPT. Everything this document says about agentic tools is extrapolated from chat and autocomplete studies.

**What the evidence supports, and how strongly:**

- **Strong (several grade-A studies agree): performance with AI is not learning.** When AI does the cognitive work during practice, performance without AI later is the same or lower (Bastani; Liu; Gardella; Strömberg; and at grade B, Bergh after 48 hours and Albadarin after seven weeks). When AI explains or tutors, results range from no harm to modest gains (Bastani's tutor; Contractor & Reyes; Kazemitabaar 2023). Boolzen's moderator, augment vs. substitute, says the same, and so does the Stanford SCALE review of 52 causal studies (November 2026).
- **Moderate: guardrails work when they are enforced in the workflow** (mastery gates, explanation gates, structured tutors, blocks outside the model), and much less when they are only asked for in a system prompt (Barth's null result; Teo's over-helping tutors). That supports the harness's hooks over relying on a "learning mode" prompt.
- **Weak, correlational only: that specific interaction patterns cause better learning.** This covers asking for explanations and attempting first. In every study so far the student chose the pattern (Shen & Tamkin; Contractor & Reyes; Kazemitabaar 2023b). No randomized trial has compared attempt-first with AI-first. The pattern idea is the best working hypothesis, not a finding. It fits the experimental result that only explanation *without* the answer produced learning (Gajos & Mamykina, 2022; §2.10). An observational OOP study adds a null: students with a "smart" usage profile did not score better on AI-free assessments than the other profiles (Lepp, 2026).
- **Equity: weaker and first-generation students are hurt more and use escape hatches more** (Liu; Kapoor et al., 2025; Lehmann, exploratory; Prather, qualitative). **Guardrails matter most for the students least likely to choose them.**
- **Unknown or thin:** retention beyond about a week in higher education (so far one quasi-experiment, on debugging, with a seven-week test: Albadarin, 2026), agentic tools, and design-level OOD skill.

### 2.9 The shift in skill needs: jobs, the economics of hand-written code, and what to practise

The first version of this review assumed that the goal is to write code without AI. That holds for an exam without AI, for example an assessment that allows AI only at level 0/1 and includes an oral defence. It was never argued for the career that follows. This section tests the claim that **writing code by hand is no longer economical**, and asks which skills employers now pay for.

Most of the evidence is from the US, and Dutch data are added where they exist. Most sources here are working papers, government statistics or industry reports rather than peer-reviewed studies. Grades follow §2.0.

**How much code does AI already write?** The figures measure different things and cannot be compared directly.

| Source | Claim | What is counted | Grade |
|---|---|---|---|
| Google (Pichai, April 2026) | 75% of new code, up from 50% in autumn 2025 and 25% in 2024 | "AI-generated and approved by engineers"; no definition given | D |
| Anthropic (May 2026) | More than 80% of merged code | Lines merged to production that can be attributed to Claude | D (vendor) |
| Snap (April 2026) | 65% | Not disclosed. Planned headcount was cut right after | D |
| GitHub Octoverse (October 2026) | Agents started 17% of pull requests in March 2026 and over 40% in September | Pull requests whose first draft came from an agent GitHub can detect. A floor, and pull requests, not lines | C (vendor telemetry) |
| Daniotti et al. (2026), *Science* | About 29% of Python functions by US developers, end of 2024 | A classifier on more than 30 million public GitHub commits | C (peer reviewed, independent) |
| Sonar survey (January 2026) | Developers estimate 42% of their committed code, and expect 65% by 2027 | Self-estimate | C (vendor) |

The direction is clear on every measure: steep growth from 2024 to 2026, with a step from autocomplete to agent-drafted pull requests in 2026. "Most new code at AI-forward companies is drafted by AI" is plausible. "Most code everywhere is written by AI" is not established. Every company claim adds that engineers approve the code, so a human is still accountable for every merged line.

**Productivity: who gains, and where the bottleneck went.**

- **Field experiments with 2022–23 code completion** (Cui et al., 2025): 4,867 developers at Microsoft, Accenture and a Fortune-100 firm completed about 26% more tasks (SE 10.3%). Less experienced developers adopted more and gained more. Two co-authors work at Microsoft. *Grade A, working paper.*
- **Google's internal trial** (Paradis et al., 2024): about 21% less time on one enterprise task, with 96 Google engineers. *Grade B, vendor.*
- **METR:** experienced developers were 19% *slower* on their own mature repositories, and the 2026 follow-up was unreliable (§2.8). *Grade A/B.*
- **Cursor adoption** (He et al., 2026; difference-in-differences on GitHub projects): a large but **transient** speed-up, significant only in the first two months. It came with a **persistent** rise in static-analysis warnings (about +30%) and code complexity (about +41%), which later slowed the projects down. *Grade B.*
- **Task type:** gains of about 35–40% on simple greenfield tasks and 10% or less on complex legacy code (Stanford research cited in DORA's ROI report). *Grade C.*
- **Firm telemetry on agents** (Chen & Stratton, 2026; Harvard working paper, version of 9 November 2026). *Grade B, quasi-experimental (timing of adoption).* Data from the engineering-analytics platform Jellyfish: 720,542 workers at 655 firms, January 2021 – August 2026. Twelve months after adopting AI agents, lines of code rose 44.0% and pull requests 35.7%, but resolved Jira issues rose only 13.7% (borderline significant). The time from review submission to approval rose **56.1%**. There was no detectable effect on employment. An August version with 718 firms reported different figures, so cite this one.
- **Writing code vs. shipping code** (Demirer, Musolff & Yang, 2026; NBER working paper, revised September 2026). *Grade B.* Over 500,000 GitHub developers with AI-usage telemetry: autonomous agents raised commits by 240%, but projects by only 80% and releases by 30%.
- **The bottleneck has moved to review, testing and change approval.** Chen & Stratton now measure this independently (above). The sources below have different commercial interests and still agree:
    - Anthropic: "human code review has become a new bottleneck".
    - DORA: models a "verification tax".
    - Sonar: 96% of developers do not fully trust AI-generated code, yet only 48% always check it before committing.

**Quality and security.**

- **Veracode's benchmark** (Veracode sells security testing): the average security pass rate for AI-generated code was 55–56% until July 2026 and 62% in October 2026. C# passed 59.6%; cross-site scripting (18%) and log injection (12.6%) still mostly fail. The syntax is almost always correct. *Grade C, vendor benchmark.*
- **GitClear** (sells developer analytics; correlational): duplicated code blocks rose 81% compared with 2023. Moved, meaning refactored, code fell from 21% of changes (2022) to 3.8% (2026). *Grade C.*
- **CodeRabbit** (sells AI code review): about 1.7 times as many issues in AI-co-authored pull requests (470 pull requests). *Grade C.*
- **Incidents in 2025–26:** these were mostly agents with too many permissions taking destructive actions, such as deleting a production database and its backups, rather than subtle bugs. *Grade D, secondary reports.*

**Cost.** The tool is cheap compared with labour.

- **Tool:** Anthropic reports about $13 per developer per active day ($150–250 a month) for Claude Code (vendor).
- **Labour:** DORA's ROI model assumes $176,000 fully loaded per engineer, roughly $800 per working day.

So the tool costs about 1–2% of labour (own arithmetic). The economics turn on the human minutes spent specifying, reviewing and fixing. **No study compares the total cost per delivered feature of generated vs. hand-written code**, counting generation, review, rework and incidents.

**Capability.**

- **METR (May 2026):** the public frontier completes tasks of about 12 hours half the time, but only about 1.5 hours reliably (80% of the time). METR warns that a 50% horizon of X hours "does not mean we can delegate tasks under X hours".
- **SWE-bench Verified:** saturated and contaminated.
- **SWE-bench Pro:** independently standardized top scores are around 60%; vendor-reported scores go up to 89.9%.

*Grade B/C.*

**Adoption and trust.**

- **Stack Overflow 2026** (over 30,000 respondents):
    - 66% use coding assistants or agents; the top use is generating code in familiar areas (69.3%).
    - 48% trust AI only when they can easily check its answers, and only 6.6% trust it with important decisions.
    - Design (49%) and communication (35%) are rated least useful for AI.
    - 17.1% avoid AI because they worry about losing job skills.
- **JetBrains 2026:** 90% use agents at least weekly (vendor).

*Grade C.*

**Jobs.**

- **Young workers in the US: evidence for an AI effect.** *Grade B, quasi-experimental working papers.*
    - **Stanford "Canaries"** (revised August 2026; ADP payroll data to June 2026): employment of 22–25-year-olds in the most AI-exposed occupations is 19% below where it would be had it kept pace with less-exposed peers, up from 15% a year earlier. The gap comes through less hiring, not layoffs, and older workers show none. The authors call the result descriptive.
    - **Fed Board** (Crane & Soto, March 2026): coder employment growth is about 3 percentage points a year lower since ChatGPT, after controlling for industry shocks.
    - **Census** (Tucker, April 2026): early-career employment in the most exposed industries fell 12% over 10 quarters, and monetary policy explains at most a quarter of that.
- **Evidence against an AI cause.** *Grade B/C.*
    - In the national ACS survey the Stanford gap shrinks to about −2%, with a confidence interval that includes zero, and controlling for education halves it.
    - The NY Fed attributes 64% of the rise in young-graduate unemployment to remote work (June 2026).
    - Fairlie & Wu (NBER, September 2026) find no spike in recent-graduate unemployment in summer 2026.
    - The Yale Budget Lab tracker finds no clear AI footprint (September 2026).
    - The Danish study rules out effects on earnings and hours larger than 2% (Humlum & Vestergaard, revised March 2026).
    - LinkedIn (owned by Microsoft) finds that real interest rates explain most of the variation in software-engineer hiring.
- **Job postings.** *Grade C.*
    - **US recovery:** US software-development postings recovered, up 23.8% on a year earlier by 30 October 2026, though still 18% below February 2020.
    - **Senior-heavy:** only 4.5% were entry-level in Q1 2026, 71% of the recent increase was senior, and 37% of the increase had "AI" in the job title (Indeed, a job platform).
    - **Europe weaker:** Germany (−14.6% on a year earlier, a new low in October 2026) and France (−7.3%).
    - **Netherlands:** no Dutch series exists.
- **Programmers vs. developers (US BLS, August 2026).** *Grade C, forecast.*
    - **"Computer programmers"** (110,800 jobs): projected −7% over 2025–35, with AI automating "repetitive programming tasks" named as a reason.
    - **"Software developers"** (1,717,800 jobs): +10%, down from +15.8% and +17% in the two previous projections.

    So writing code to a specification is the part expected to be automated. The surrounding work (requirements, design, integration, testing) is expected to grow, but less than forecast a year earlier.

- **Netherlands.** *Grade C.*
    - **UWV:** ICT employment is still rising (589,000 people). But ICT vacancies have been falling since 2023 (about 18,900 in Q2 2026), and ICT unemployment-benefit claims rose to nearly 6,400 in July 2026, partly from bank reorganisations.
    - **ROA** (November 2025): ICT job growth slows from 2.5% a year (2019–2024) to 0.3% (2025–2030), with "virtually no bottlenecks" for software developers by 2030 but "good" prospects for bachelor ICT graduates. ROA says its forecasts do not capture the effect of AI.
    - **Most direct evidence for HBO-ICT:** employment of hbo and wo ICT graduates was "barely" negative through the 2024 cohort (Cnossen, July 2026; CBS microdata; correlational).
    - **Disputed:** RaboResearch's −13% for young workers in AI-exposed jobs is contested by economists who point to monetary tightening (Salomons & van den Berge, 2026).
- **Wage premia.** *Grade C.*
    - **Sellers' figures:** PwC (2026) reports a 62% premium for AI skills and Lightcast 28%. Both sell AI or labour-market services, and both figures are correlational.
    - **Independent wage data:** they point to experience and judgement as what protects pay. AI exposure hurts wage growth only where the experience premium is low (Dallas Fed, 2026).
    - **PwC's own finding:** AI-exposed entry-level roles are seven times more likely to require senior "human-intensive" skills.

**What employers ask of juniors now.** *Grade D, press accounts of memos.*

- **Expectation:** employers moved from allowing AI to expecting it. Shopify, Microsoft and Coinbase did so in 2025, and Meta and JPMorgan tied it to performance reviews.
- **Usage counts mislead:** in September 2026 Meta dropped token counts from reviews after employees inflated their usage.
- **AI in interviews:** Google is piloting an interview round for junior and mid-level roles, from the second half of 2026. Candidates use Gemini to **read, debug and improve an existing codebase**, and are graded on validating output and debugging.
- **AI bans:** other firms still ban AI in some rounds; Anysphere, the maker of Cursor, does so in its first coding round.

**How curricula respond.**

- **UC San Diego's CS1-LLM** (556 students): it replaced writing code from scratch with prompting, tracing, explaining, testing and debugging, but kept most exams free of AI. Exam scores were comparable to an international benchmark and 11% higher on explaining code in plain English. There was no randomized control.
- **Npuls** (May 2025), the Dutch national guidance, adopts the **two-lane approach**:
    - "Lane 1" assures crucial learning outcomes in supervised moments without AI.
    - "Lane 2" allows or even requires AI, and asks students to show how they used it.
    - "Students must ultimately be able to practise their profession without AI where needed."
- **The University of Sydney's Green Paper** (August 2026) requires foundational skills before AI-supported tasks and "opportunities for performance independent of AI".
- **Institutional rules** turn this into AI levels. CHE's rules (OER 2026–27, ICT, art. 7.11) are an example, and this review uses their three levels:
    - **Level 0:** no AI, in a controlled setting.
    - **Level 1:** AI as an aid for ideas or structure.
    - **Level 2:** AI built into the task.

    At levels 1 and 2 students must account for their use, link their prompts, cite in APA and check the output for correctness and relevance.

**Verdict on "writing code by hand is no longer economical":**

| Claim | Evidence | Verdict |
|---|---|---|
| For routine, well-specified code at work, writing it by hand is no longer the cheapest way | Tool cost about 1–2% of labour; most new code at AI-forward firms is drafted by AI; gains largest on simple greenfield tasks; BLS expects programmer jobs to shrink | **Largely supported** (grades B–D, many vendor sources) |
| Writing code by hand has no economic value any more | Gains small or negative on complex legacy code; AI code has more security and maintainability problems; review is the bottleneck (now measured independently: Chen & Stratton); incidents need human judgement | **Not supported** |
| Juniors are hired less because of AI | US gap for young workers in exposed jobs (−19% in ADP data) vs. near zero in the ACS; remote work and interest rates explain much; Dutch data show cooling, not collapse | **Contested.** Direction plausible, size unknown |
| Employers pay for checking and judging AI output | Interview formats (Google); trust only when checkable (Stack Overflow); "approved by engineers" in every claim; PwC's entry-level finding; the Dallas Fed experience premium | **Consistent across sources**, but no study measures the return to specific review skills |
| Practising by hand is still how you build the skills to check AI | Shen & Tamkin (debugging gap); Gardella (retention); Yu & Moon (productive struggle); CS1-LLM keeps AI-free exams | **Supported for learning** (grades A–C). No study gives the best mix |

**What this means for what to practise.** The economic claim and the learning claim are about different things:

- **As a way to produce code**, writing by hand is becoming less economical.
- **As a way to build skill**, it is still the main route to the reading, debugging and design judgement that make AI output safe to accept. The 2026 interview formats test exactly those skills, and delegation erodes them most (§2.8, §2.10).

So the shift argues for **adding** deliberate practice of AI-era skills, not for dropping hand practice before a skill is learned:

1. **Keep, by hand, until L3:** core OOD and C# (classes and state, encapsulation, inheritance and interfaces, the patterns). They are what an exam without AI tests, and the base for judging AI code. AI is also weakest on interfaces, abstract classes and inheritance (Lepp & Kaimre, 2026).
2. **Add, as a new skill track:**
            - reading and reviewing AI-generated code;
            - finding a planted bug;
            - writing tests that would catch AI mistakes;
            - specifying a task precisely enough for an agent;
            - predicting what the AI will produce and comparing;
            - checking AI code for common security flaws such as missing input validation and injection.

   Do this on topics you can already write yourself, so you can judge the output.

3. **Delegate (already L4):** tooling, project setup, and boilerplate you have mastered.

### 2.10 Automation, offloading, over-reliance and deskilling

- **Cognitive offloading.** People offload cognition to external tools when that is cheaper (Risko & Gilbert, 2016). Offloading does not only cost memory:
    - **Freed capacity:** saving information can free capacity for new material ("saving-enhanced memory"; Storm & Stone, 2015, with later replications).
    - **Parallel tasks:** it improves performance on a concurrent task (Grinschgl et al., 2023).
    - **The cost:** it lowers memory for the offloaded content mainly when there is no explicit goal to learn it. An explicit goal almost cancels the cost (Grinschgl, Papenmeier & Meyerhoff, 2021).

    That is the line the harness draws. Offload tooling and boilerplate freely (L4), but not the skill you are learning, and make the learning goal explicit (attempt first, explain in your own words).

- **The "Google effect" is contested.** Sparrow, Liu & Wegner (2011) reported that people remember *where* information is rather than the information itself.
    - **Failed replications:** their first experiment failed to replicate (Camerer et al., 2018; Hesselmann, 2020).
    - **Never replicated:** the "where, not what" experiment has never been directly replicated.
    - **What did replicate:** saved information is remembered less, but only when the saving is experienced as reliable (Schooler & Storm, 2021).

    An always-available AI tutor is exactly that reliable condition, which argues for deliberate practice without AI.

- **Ironies of automation.** Bainbridge (1983) pointed out that automating the routine work removes the practice operators need to handle the rare hard cases. The more reliable the automation, the less able the human is to take over.
- **Complacency and automation bias.** Parasuraman & Manzey (2010) showed that humans over-trust and under-monitor reliable automation. Endsley & Kiris (1995) showed that *out-of-the-loop* operators lose situation awareness. Parasuraman, Sheridan & Wickens (2000) proposed choosing *levels of automation* for each function. This is precisely the idea of per-skill levels.
- **Forcing people to think first works, at a cost.**
    - **Deciding first:** designs that make people decide before they see the AI's answer, or that delay or hide the answer, reduce over-reliance compared with simply showing an explanation. Users rate them least favourably, and people high in need for cognition benefit most (Buçinca, Malaya & Gajos, 2021; n = 199).
    - **Explanations alone:** they *increase* acceptance of AI advice whether it is right or wrong (Bansal et al., 2021), unless they make checking cheaper than doing the task (Vasconcelos et al., 2023).
    - **Learning:** this is the most important result for a tutor. In Gajos & Mamykina (2022), deciding first and then seeing the AI's recommendation improved decisions but produced **no learning**. Only an explanation *without* the answer, so that people had to reach the answer themselves, produced learning gains.
    - **Escape hatches get used:** in one course, 50% of 885 students used an optional "See Solution" button at least once. Low performers used it more, and more often close to deadlines (Kapoor et al., 2025, preprint).
- **Deskilling in professional practice.** The first strong real-world signal comes from medicine. After routine use of AI-assisted colonoscopy, experienced endoscopists' adenoma detection rate *without* AI fell from 28.4% to 22.4% (Budzyń et al., 2025; observational, 19 endoscopists in four Polish centres).
    - **No longitudinal software study:** for software developers there is no longitudinal study of skill decay yet.
    - **Anthropic's study of its own engineers:** 132 surveyed and 53 interviewed; a vendor source, and not anonymous. It reports self-reported Claude use rising from 28% to 59% of their work, and worries about skill atrophy. It names the **"paradox of supervision"**: checking AI output needs the very skills that delegating to it erodes (Anthropic, 2025b).
    - **Juniors:** interviewees describe entry-level work being absorbed into seniors' AI workflows, so juniors lose the "productive struggle" through which expertise develops (Yu & Moon, 2026; 14 interviews).
    - **For a student it is sharper:** an engineer has to *keep* supervision skills, a student has to *acquire* them. Medical educators call this "never-skilling" (Abdulnour, Gin & Boscardin, 2025).

**Implication:** automating a mastered skill is fine, and it is the goal of the system. Three conditions apply:

- **(a) Supervise:** the human keeps a *supervisory* role, reviewing, predicting and spot-checking AI output.
- **(b) Maintain:** the skill gets *periodic maintenance practice*, so the ability to supervise and take over does not decay.
- **(c) Train supervision itself:** supervision is a skill that has to be practised deliberately (§2.9). It comes neither from writing code by hand nor from delegating.

### 2.11 Synthesis: design principles

| # | Principle | Evidence base | Strength |
|---|---|---|---|
| P1 | **Attempt first, then help.** You generate before the AI reveals. Attempting first is not enough on its own: the learning comes from what follows. | Generation effect; productive failure (Sinha & Kapur 2021); Bastani 2025; Gajos & Mamykina 2022 (attempting first, then seeing the answer, gave no learning) | Moderate |
| P2 | **Help follows expertise in each skill and fades.** | Expertise reversal; faded worked examples; cognitive apprenticeship | Strong |
| P3 | **Graduated, contingent hints** (more after failure, less after success). | Wood & Wood 1999; Aleven et al. 2003; Kestin 2025 (short-term) | Moderate |
| P4 | **Keep practice hard enough that you sometimes fail** (about 70–90% success as a rule of thumb), and time-box stuckness. | Desirable difficulties; Kapur 2016; D'Mello 2014. Wilson et al. 2019 only as computational inspiration | Heuristic |
| P5 | **Explanations without the answer, over solutions.** Self-explain AI output. | Gajos & Mamykina 2022; Bastani 2025 (tutor arm); Kazemitabaar 2025; Chi 1989 | Moderate |
| P6 | **Mastery gate with transfer and explanation**, not just "it works". | Mastery learning (gains on aligned tests; Kulik 1990, Slavin 1990); Corbett & Anderson; illusion of competence (Đức Minh 2026; Eleftheriou 2026) | Moderate |
| P7 | **Automate only after mastery; keep supervising.** | Fitts & Posner; Bainbridge; Parasuraman & Manzey; deskilling (Budzyń 2025) | Moderate |
| P8 | **Spaced, interleaved retrieval after mastery; demote on failure.** Spacing matters more than expanding intervals. | Cepeda 2008; Latimier 2021; Roediger & Karpicke; Arthur 1998; Tatel & Ackerman 2025 | Strong (spacing), weak (expanding) |
| P9 | **Reflection you write yourself, in a structured diary.** | Nückles 2009; Zimmerman 2002; generation effect | Moderate |
| P10 | **Autonomy-supportive, transparent enforcement** that you chose. | Ryan & Deci 2000; Ariely & Wertenbroch 2002; acceptance cost of forcing functions (Buçinca 2021) | Moderate |
| P11 | **Enforce guardrails in the workflow, not only in prompts.** | Barth 2026 (prompts alone: no effect); Oreopoulos 2026; Sankaranarayanan 2026; Teo 2026 (tutors over-help) | Moderate |
| P12 | **Practise under test conditions before the test**: timed, without AI, in the IDE of your exam, after low-stakes learning. | Transfer-appropriate processing (Morris 1977); Pan & Rickard 2018; Hinze & Rapp 2014; Driskell 2001 | Moderate (no IDE-specific study) |
| P13 | **Train supervision as its own skill**: read, test, debug and specify AI output, on topics you can already write yourself. | Paradox of supervision (Anthropic 2025b); employer interview formats; CS1-LLM; Pădurean 2026; §2.9 | Inference, consistent across sources |

---

## 3. Risk assessment

Likelihood (L) and Impact (I) are scored 1–5. Risk = L × I. Scores assume **no mitigation** for a student who practises with an agentic coding assistant such as Claude Code before an exam without AI.

- **Judgements, not measurements:** the scores are judgements. The evidence grade in brackets (A–D, §2.0) shows how well each mechanism is supported. A high score with weak evidence is a reason to watch closely, not a fact.
- **Horizon:** *Exam* means your exam without AI; *Career* means the labour market after you graduate.
- **New and changed:** R14–R18 are new in the revision of 8 November 2026, and R9 and R12 were re-scored.

| ID | Risk | Mechanism | Evidence [grade] | L | I | Score | Horizon |
|---|---|---|---|---|---|---|---|
| R1 | **Skills never form** | The AI writes the code and design, and you never generate solutions yourself. Agentic tools make full delegation the default. | Bastani 2025 [A]; Liu 2026 [A]; Shen & Tamkin 2026 [A]; Gardella 2026 [A, small]; Strömberg 2026 [B]; Bergh 2026 [B]; Albadarin 2026 [B, seven weeks] | 5 | 5 | **25** | Both |
| R2 | **Illusion of competence** | Working code and fluent explanations make you overestimate what you can do alone. | Koriat & Bjork 2005 [A]; METR 2025 [A]; Eleftheriou 2026 [B]; Prather 2024 [C]; Đức Minh 2026 [C] | 5 | 4 | **20** | Exam |
| R3 | **Metacognitive laziness** | Planning, monitoring and debugging are offloaded to the AI. | Darvishi 2024 [A]; Liu 2026 (0.7% of requests asked for feedback on own work) [A]; Stadler 2024 [B]; Fan 2025 [B, interpretation] | 4 | 4 | **16** | Both |
| R4 | **Design judgment does not develop (OOD-specific)** | The AI picks classes, responsibilities and patterns, so you never weigh trade-offs. | OOD misconceptions: Eckerdal & Thuné 2005, Ragonis & Ben-Ari 2005 [C, pre-AI]; AI weakest on interfaces, abstract classes and inheritance (Lepp & Kaimre 2026) [C]. No study of OOD skill with AI exists yet | 4 | 5 | **20** | Both |
| R5 | **Hint abuse / bypassing guardrails** | You switch to an unrestricted chat or reword the prompt to get answers, especially under time pressure. | Aleven 2003; Baker 2004 [A/B]; CodeAid 2024 [C]; Kapoor 2025: 50% of 885 students used "See Solution", more often near deadlines [C] | 4 | 4 | **16** | Exam |
| R6 | **Unproductive struggle → frustration → giving up** | Friction is set too high and no help arrives. | Kirschner 2006; Kapur 2016; Sinha & Kapur 2021 [A]; D'Mello 2014; Ryan & Deci 2000 | 3 | 4 | **12** | Exam |
| R7 | **Expertise reversal** | The same heavy scaffolding is used for skills you have already mastered, which wastes time and annoys you. | Kalyuga 2003 [A] | 3 | 3 | **9** | Exam |
| R8 | **Mastered skills decay after automation** | No practice after hand-off, so you can no longer review or take over. | Arthur 1998; Tatel & Ackerman 2025 [A, meta-analyses]; Budzyń 2025 [C]; Bainbridge 1983; Parasuraman & Manzey 2010 | 4 | 4 | **16** | Career |
| R9 | **Learning wrong things from wrong AI output** *(L raised 3 → 4)* | Hallucinated APIs, bad OO practice, insecure code or subtly wrong explanations get absorbed. | Hellas 2023 [C]; CodeAid 2024 [C]; Veracode 2026: 38% of tasks introduce a vulnerability [C]; Lepp & Kaimre 2026 [C] | 4 | 4 | **16** | Both |
| R10 | **Weaker ownership and memory of your own work** | You cannot explain or defend your project in an assessment. Offloaded content is remembered less when the store is reliable. | Schooler & Storm 2021; Grinschgl 2021 [A, lab]; Kosmyna 2025 [C, preprint, critiqued]; Bergh 2026 [B]: students credited themselves with 45% of their code with ChatGPT vs. 81% without | 4 | 4 | **16** | Exam |
| R11 | **Assessment and integrity problems** | Graded work isn't your own, or AI use isn't declared. Unauthorized AI use can count as fraud, and level-1 work can require prompt links, APA citation and a check of the output. CHE's rules are an example (OER art. 1.41 and art. 7.11). Detection is unreliable, so your own records are your protection. | CHE OER 2026–27 [policy]; Npuls 2025 [policy]; Scarfe 2024 (94% of AI answers undetected) [B]; Lau & Guo 2023 | 3 | 5 | **15** | Exam |
| R12 | **The harness becomes the goal** *(re-scored from 3 × 2)* | Time goes into tuning the setup, or into research about it (such as revising this review), instead of practice. Or the system gets abandoned. | A diagnostic test in the pilot (time went to a cheat sheet instead of practice); in the pilot, time also went to revising this review and fixing a hook; SDT | 4 | 3 | **12** | Exam |
| R13 | **Privacy of the diary and skill data** | Reflections, research notes and transcripts are synced to cloud storage (such as OneDrive) or shared. | — | 2 | 2 | **4** | Both |
| R14 | **Practice does not match the test** *(new)* | You practise with AI, untimed, in the IDE you are used to. The test is without AI, timed, and perhaps in another IDE. Skill practised in one mode transfers poorly to another. | A diagnostic test in the pilot; transfer-appropriate processing (Morris 1977); Pan & Rickard 2018 [A, meta]; Hinze & Rapp 2014 [A]; no IDE-specific study | 5 | 5 | **25** | Exam |
| R15 | **Investing too much in hand-writing production code** *(new)* | Practice time goes to writing routine code by hand beyond what learning requires (boilerplate, syntax drills, re-writing mastered code), while the market pays for specifying, reviewing and verifying. | Routine code is cheap to generate: tool about 1–2% of labour cost [C]; Google, Anthropic code-share claims [D]; Octoverse 2026 [C]; BLS: programmers −7% [C]. Low likelihood with the harness, because it already automates mastered skills (L4), and an exam without AI requires hand-writing | 2 | 3 | **6** | Career |
| R16 | **Supervision skills stay untrained** *(new)* | The harness blocks AI code at L1–L3 and automates at L4, but nothing trains specifying, testing, reviewing and debugging AI output. Employers now test these skills, and delegation erodes them ("paradox of supervision"). | Anthropic 2025b [C, vendor]; Google interview pilot 2026 [D]; Stack Overflow 2026 [C]; Veracode 2026 [C]; CS1-LLM [C]; Pădurean 2026 [C] | 4 | 4 | **16** | Career (testing may also count in your final assessment) |
| R17 | **Career-path uncertainty** *(new)* | The junior-developer squeeze: fewer entry-level openings and choosier employers. The evidence is descriptive and contested, so its effect on any one student is uncertain. | Junior squeeze: Canaries 2026 [B, descriptive, contested]; Crane & Soto 2026; Tucker 2026 [B]; Indeed (4.5% entry-level) [C]; UWV, ROA, Cnossen 2026 [C]; null results: Humlum & Vestergaard, Fairlie & Wu, NY Fed [B] | 3 | 4 | **12** | Career |
| R18 | **Decisions driven by vendor claims or hype** *(new)* | You change what you practise because of vendor numbers ("80–90% of code is AI-written"), inflated benchmarks or uncorrected meta-analyses. Or you trust this document too much: it was written by an Anthropic model and leans on Anthropic sources. | Vendor-reported vs. independent benchmark scores (89.9% vs. about 60%) [C]; retracted Wang & Fan 2025 meta-analysis; Boolzen 2026 (g 0.84 → 0.08) [A]; O'Neill 2026, audit of 14 meta-analyses [preprint]; METR on self-reports [A] | 3 | 3 | **9** | Both |

<div class="risk-matrix">
<table class="risk-grid">
<caption>Risks by likelihood and impact, before mitigation. Darker = higher score (likelihood × impact). Hover over a number for its name; the table above lists every risk.</caption>
<thead><tr><td></td><th scope="colgroup" colspan="5" class="axis">Likelihood →</th></tr>
<tr><th scope="col" class="axis">Impact ↓</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">4</th><th scope="col">5</th></tr></thead>
<tbody>
<tr><th scope="row">5</th><td class="s2"></td><td class="s3"></td><td class="s4"><span title="R11 Assessment and integrity problems">R11</span></td><td class="s5"><span title="R4 Design judgment does not develop (OOD-specific)">R4</span></td><td class="s5"><span title="R1 Skills never form">R1</span> <span title="R14 Practice does not match the test">R14</span></td></tr>
<tr><th scope="row">4</th><td class="s1"></td><td class="s2"></td><td class="s3"><span title="R6 Unproductive struggle → frustration → giving up">R6</span> <span title="R17 Career-path uncertainty">R17</span></td><td class="s4"><span title="R3 Metacognitive laziness">R3</span> <span title="R5 Hint abuse / bypassing guardrails">R5</span> <span title="R8 Mastered skills decay after automation">R8</span> <span title="R9 Learning wrong things from wrong AI output">R9</span> <span title="R10 Weaker ownership and memory of your own work">R10</span> <span title="R16 Supervision skills stay untrained">R16</span></td><td class="s5"><span title="R2 Illusion of competence">R2</span></td></tr>
<tr><th scope="row">3</th><td class="s1"></td><td class="s2"><span title="R15 Investing too much in hand-writing production code">R15</span></td><td class="s3"><span title="R7 Expertise reversal">R7</span> <span title="R18 Decisions driven by vendor claims or hype">R18</span></td><td class="s3"><span title="R12 The harness becomes the goal">R12</span></td><td class="s4"></td></tr>
<tr><th scope="row">2</th><td class="s1"></td><td class="s1"><span title="R13 Privacy of the diary and skill data">R13</span></td><td class="s2"></td><td class="s2"></td><td class="s3"></td></tr>
<tr><th scope="row">1</th><td class="s1"></td><td class="s1"></td><td class="s1"></td><td class="s1"></td><td class="s2"></td></tr>
</tbody>
</table>
<p class="risk-legend">Score: <span class="sw s1"></span>1–4 <span class="sw s2"></span>5–8 <span class="sw s3"></span>9–12 <span class="sw s4"></span>13–16 <span class="sw s5"></span>17–25</p>
</div>

**What changed in the picture.**

- **Top risks:** R1 (skills never form) and R14 (practice–test mismatch) are joint highest. R14 is not an AI risk as such, but in the pilot it is the one that actually happened (see the example below).
- **Asymmetric skill-shift risks:** too much hand-writing (R15) is a small risk if you use the harness, because the harness already hands mastered skills to the AI, and an exam without AI requires hand-writing. Too little supervision practice (R16) is a real one. Nothing in the harness trains it yet; §4.1 proposes how to add it.

!!! example "Example: one student's situation"
    A second-year HBO-ICT student at CHE practised for an OOD exam with AI at hand, untimed, in Visual Studio. A diagnostic test before the exam was timed, without AI and in Rider. Its analysis named the practice conditions as a main cause of the result, and debugging was where it went wrong. Time had also gone to a cheat sheet instead of practice (R12).

---

## 4. How to apply it: mitigation plan

This section turns the risks into a plan you can lay on your own exam date. The table gives one mitigation for each risk. The step plan after it says when to do what, counted from your exam.

| Risk | Mitigation | Implemented by | Residual risk |
|---|---|---|---|
| R1 | Autonomy Ladder: the AI may write code for a skill only at L0 (demonstration) and L4 (automated). At L1–L3 a `PreToolUse` hook blocks AI edits to code you own. | Skill record + `PreToolUse` hook + CLAUDE.md policy | Low |
| R2 | Mastery gate needs (a) independent success on a **novel transfer task**, (b) a correct **explanation** in your own words, (c) success spread over ≥ 2 separate days. The diary shows hints used vs. independent work. | `/mastery-check` skill; diary statistics | Low–medium |
| R3 | `SessionStart` asks for a plan ("what will you try today?"). The `Stop` hook triggers a reflection that *you* write. Hints are Socratic questions first. | Hooks + diary | Medium |
| R4 | OOD skills start at **"you propose, the AI critiques"**. You draw the class diagram or name the responsibilities *before* the AI comments. Trade-off questions are required ("why composition here?"). | `/learn` skill protocol for the design category | Medium |
| R5 | Hint ladder with time limits and an attempt requirement. **Escape hatch** `/override <reason>` is allowed, but it gets logged and the skill is flagged. Weekly diary review of overrides. Treat the system as a self-chosen commitment device. Students bypass guardrails most under deadline pressure (Kapoor et al., 2025), so plan practice so that the crunch before a test is not when you need hints most. | `UserPromptSubmit` hook; diary | Medium (cannot be eliminated) |
| R6 | Stuck timer: after about 10–15 minutes without progress, the next hint rung unlocks automatically. Consolidation (worked solution plus explanation) comes after a failed attempt. Target success rate is about 85%; the skill gets *easier* tasks if you fall below 70%. | `UserPromptSubmit` hook + session state | Low |
| R7 | Help level is set *per skill*, not globally. Promotion criteria move you up quickly when evidence is strong. | Skill record | Low |
| R8 | Spaced maintenance checks on expanding intervals (e.g. 3 → 7 → 21 → 60 → 120 days). A failed check demotes the skill to L3. At L4 you must predict or review the AI's approach on samples. | `SessionStart` hook + `/review-due` skill | Low |
| R9 | The AI must cite docs, and you run the tests yourself (`check.mjs`). Treat AI code and explanations as untrusted. Be especially careful with interfaces, abstract classes and inheritance, where AI is weakest, and with anything security-related: cross-check those with the course material or the C# docs. Explanation errors you find get logged as "AI errors". | CLAUDE.md, `check.mjs` | Medium |
| R10 | Diary records what *you* wrote. Before handing in, a "defend your design" rehearsal with `/mastery-check --defend`. | Diary + skill | Low |
| R11 | Graded work: treat every skill as L3 (CLAUDE.md), and keep an AI-use log for the AI-use statement: prompt links, what the AI did, and how you checked it (as CHE's OER art. 7.11 asks, for example). Ask your teacher which parts of your final assessment are level 0 and which are level 1 (§4.2). Always follow course and institution rules. | CLAUDE.md + diary | Low |
| R12 | Keep the harness small (~5 hooks, 1 skill) and review it monthly. Time-box harness work: at most one fix per session, and research only when it would change what you practise. Research about the harness counts as harness work too: stop it until after your exam, unless a hook misfires. | Diary (note minutes spent on the harness vs. practice) | Medium |
| R13 | Keep `.learning/`, `research_notes/` and transcripts out of shared repos and public pages (`.gitignore`). Store only what is needed. | `.gitignore` | Low |
| R14 | **Practise under test conditions.** From about two weeks before each test, do timed sessions without AI in the IDE of your exam. Start short, then do full mock exams (your course's practice tests). Learn at low stakes first. Review afterwards, and use `claude-study` only for what you found yourself. | Step plan below; diary | Medium |
| R15 | Don't drill what is already at L3/L4. The Fibonacci reviews keep it fresh, and boilerplate goes to the AI (L4). Hand practice goes to skills below L3. | Skill register; L4 policy | Low |
| R16 | **Add a supervision track (§4.1):** find planted bugs in code you did not write, write tests that catch mistakes, review AI code against OOD principles, predict and then compare. Only do this on topics at L3 or higher, so you can judge the output. Before your exam, limit it to the part that overlaps with the exam (debugging, testing). After your exam, extend it: acceptance criteria that become tests, domain models in UML, and judging AI-built work against them. | New microskills (you add them); exercise code from Claude in `voorbeelden/` or the chat | Medium |
| R17 | Build visible judgement that employers can see: tests and a test plan, design rationale in the report, explaining your code aloud (oral defence). | Final project; diary | Medium (outside your control) |
| R18 | Use the evidence grades (§2.0). Act on A/B evidence, treat C as a signal and D as a claim. Check important figures in the primary source, and keep in mind who wrote this document. Re-run this review only when it could change what you practise. | This document | Low–medium |

**Step plan, relative to your exam**

| Phase | When (relative to your exam) | What |
|---|---|---|
| Setup | At the start, ideally about ten weeks before your exam. Plan about nine days. | CLAUDE.md pedagogy policy and skill map; skill record and diary templates; hooks (`SessionStart`, `UserPromptSubmit`, `Stop`); `PreToolUse` ownership guard and `PostToolUse` tests |
| Learning | From the end of setup until your exam | Learn the OOD skills on the ladder. Review your diary once a week (15 minutes). |
| Month-1 check | About a month after you start, roughly five weeks before your exam | Check your success rate and your overrides (§6). |
| Exam conditions (R14) | The last two weeks before your exam | Timed mock exams without AI, in the IDE of your exam. Start short, then do full mock exams. |
| Transfer test | Just before your exam | An unassisted mini-exam or transfer test (§6). |
| Supervision track (R16) | From the day after your exam, for about a month | The full supervision track (§4.1). |

The timings come from one example semester of about ten weeks. If you start later, shorten setup and learning, not the two weeks under exam conditions.

### 4.1 Rebalancing practice: proposed register changes (you decide)

The harness already does two of the three things §2.9 recommends: it keeps hand practice for skills below mastery, and it hands mastered skills to the AI (L4). What's missing is supervision (R16). The changes below are proposals. You decide whether to make them.

| When | What | Why |
|---|---|---|
| Until your exam | Keep your exam plan. Close the gaps in your core OOD skills by hand, and from about two weeks before your exam do timed mocks without AI in the IDE of your exam (R14). Add only the overlap between supervision and the exam: **debugging code you did not write**, and **writing tests that catch mistakes**. | Check whether your exam grades them. In the example (§3), the assessment graded a test plan, and debugging was where the diagnostic test went wrong. AI-era interviews test both too. |
| After your exam | Add a top-level skill for supervising AI output. It covers:<br>• specifying a task or user story precisely enough for an agent or a team;<br>• writing acceptance criteria that become tests;<br>• reviewing AI-built work against them and against OOD principles;<br>• predicting what the AI will produce, then comparing. | The career horizon (§2.9). This is not material for an exam without AI, so it doesn't belong before your exam. |

**Example commands.** You run them yourself, because the guard does not let Claude change the register:

```
! node .claude/hooks/skill.mjs add-micro debug.zonder-foutmelding debug.code-van-ander L1 "bug vinden in code die je niet zelf schreef" "geplante bug, code van een ander, ai-code debuggen"
! node .claude/hooks/skill.mjs add-micro test.unit-tests test.fouten-vangen L1 "tests schrijven die fouten in andermans code vangen" "test die fout vangt, ai-code testen, grenswaarde vergeten"
```

Claude writes the exercise code, with a planted bug, in `voorbeelden/` or in the chat. You debug it in your own exercise folder, so `check.mjs` can log the result. Use only topics you already have at L3 or higher, so you can judge the code. A top-level skill such as `ai.supervisie` cannot be added with `add-micro`. You would add it to `skills.json` yourself after your exam.

### 4.2 For teachers and programmes

This part is for teachers, curriculum designers and exam committees. Each point gives the evidence and ends with what you can do. The research found that supporting AI-free assessment of core skills, and closing the gaps around it, is a stronger position than arguing against it.

1. **Assess core skills at AI level 0, under supervision.** This is the consensus, not an outlier.
            - **Matches the two-lane model:** it is "lane 1" in the Dutch national vision (Npuls, 2025) and in the University of Sydney's two-lane model. Sydney's Green Paper also requires foundational skills before AI-supported tasks and "opportunities for performance independent of AI" (University of Sydney, 2026).
            - **Why supervision is needed:** a ban on AI in unsupervised work cannot be verified. In one blind test, 94% of AI-written exam answers went undetected (Scarfe et al., 2024).
            - **Why AI-assisted work overstates mastery:** AI-assisted assignments averaged 7.62, while mastery checked at random without devices averaged 5.55 (Đức Minh, 2026; grade C).
            - *What you can do:* state for each part of the final assessment whether it is level 0 or level 1, and tell students before they start practising.
2. **AI-allowed work is only as strong as how it is checked.** Rules about permitted use are "discursive" changes that students can ignore (Corbin, Dawson & Liu, 2025). What makes them work is structure: prompt links and records of AI use (CHE's OER art. 7.11 requires them, for example), and an oral check.
            - **The oral defence:** it targets a risk from §3: students who cannot explain or defend their own work (R10). Tracing and explaining code predict writing ability (Lopez et al., 2008), so explaining is a fair test of skill. Requiring an explanation also helps during practice: on a later task with AI blacked out, 77% failed after unrestricted AI, against 39% after an "explanation gate" (Sankaranarayanan, 2026; grade C).
            - **A gap in the evidence:** none of the studies in this review tests the oral defence itself as an assessment format.
            - *What you can do:* say in every level-1 assignment how it is verified, for example prompt links, an AI-use log and a short oral defence.
3. **Give lane 2 a place in the programme, and grade supervision of AI output.** Npuls says the two lanes "complement each other", and employers now test reading, debugging and validating AI output (Google's 2026 interview pilot). Students have to *acquire* supervision skills, not just keep them ("never-skilling"; Abdulnour, Gin & Boscardin, 2025). A rule such as CHE's art. 7.11 already makes students responsible for checking AI output "op juistheid en relevantie" (for correctness and relevance). That could be assessed as a skill, not only as compliance.
            - **No cost to exam results:** CS1-LLM shows that AI-integrated practice can coexist with AI-free exams without worse exam results.
            - **Exercise formats with early evidence (grade C):** realistic bugs injected into AI-generated solutions made students repair the code itself, while natural prompt failures made them reword the prompt (Pădurean et al., 2026). "Prompt Problems" train precise specification (Denny et al., 2024b).
            - **Order matters:** foundations first, then supervision practice on topics students can already write themselves, so they can judge the output (P13).
            - *What you can do:* name at least one course or assignment at level 2 where checking AI output is graded, and place it after the core skills are in place.
4. **Let students practise under exam conditions.** Practice transfers best when it matches the test (§2.6). Keep it low-stakes, though: high-stakes quizzes during learning removed the benefit of retrieval practice (Hinze & Rapp, 2014). No study has measured the cost of an unfamiliar IDE, but creating classes, running tests and reading compiler output are part of the procedure being tested. The example in §3 shows the gap: practice with AI in one IDE, then a diagnostic test without AI, timed, in another.
            - *What you can do:* make practice tests available in the exam environment beforehand (same IDE, same time limit, no AI), and keep them low-stakes.
5. **Don't overclaim.**
            - **AI Act:** EU AI Act Article 4 (AI literacy) is about the staff of providers and deployers. Since 27 July 2026 it only requires that organisations *support* AI literacy. It does not require AI in student assessment.
            - **Labour market:** the evidence on junior jobs is contested.
            - **Code-share figures:** vendor figures about how much code AI writes are claims, not evidence.
            - **Learning gains:** after correcting for publication bias, the most rigorous 2026 meta-analysis shrinks g = 0.84 to 0.08 (Boolzen et al., 2026).
            - *What you can do:* base programme changes on grade A/B evidence (§2.0), and treat vendor figures as claims.
6. **Detection is not proof.** Npuls states that AI-detection scores are not watertight proof and that suspicions need human investigation, for example oral questioning. CHE is one institution that allows Turnitin in fraud investigations. Students' own prompt links and records protect them.
            - *What you can do:* treat a detection score as a reason for a conversation, not as evidence, and ask students to keep their prompt links and records.
7. **See a tool like this harness as an example** of transparent, self-limited AI use. It logs hints, overrides and explanations, which is the kind of AI-use statement level-1 work asks for. If your course offers its own AI tutor, the evidence favours guardrails built into the workflow over instructions in a prompt.
            - **Prompts alone:** steering a tutor through its system prompt made no difference for 1,059 CS1 students (Barth et al., 2026). A guard-railed tutor helped only inside a mastery workflow (Oreopoulos et al., 2026).
            - **Equity:** weaker and first-generation students are hurt more and use escape hatches more (Liu et al., 2026; Kapoor et al., 2025). Guardrails matter most for the students least likely to choose them.
            - *What you can do:* consider accepting logs like these as part of an AI-use statement. When you choose an AI tutor, ask where its guardrails are enforced.

---

## 5. Proposed Claude Code setup

This section describes what the harness does during a session, and why. If you install it, this is what you will work with. If you teach, it shows which rules the harness enforces and which are only advice to the AI.

### 5.1 Architecture

The harness is a small set of parts in your project: a `CLAUDE.md` with the teaching policy, an output style, a few skills, five hooks, and a local `.learning/` folder that holds your data.

```mermaid
flowchart LR
    subgraph Learner["👩‍💻 Learner"]
        P[Prompt / attempt]
        R[Reflection<br/>in own words]
    end

    subgraph CC["Claude Code"]
        direction TB
        CM["CLAUDE.md<br/>pedagogy policy"]
        OS["Output style:<br/>Learning variant"]
        SK["Skills:<br/>/learn /hint /review-due<br/>/mastery-check /diary"]
        AG["Claude agent"]
    end

    subgraph Hooks["Hooks (deterministic)"]
        H1[SessionStart<br/>load record, due reviews,<br/>ask for plan]
        H2[UserPromptSubmit<br/>detect skill, inject<br/>level policy, hint ladder]
        H3[PreToolUse<br/>ownership guard on<br/>Edit/Write]
        H4[PostToolUse<br/>log test results<br/>as evidence]
        H5[Stop<br/>diary + reflection<br/>prompt]
    end

    subgraph Store[".learning/ (local, git-ignored)"]
        SR[(skills.json<br/>skill record)]
        DI[(diary/YYYY-MM-DD.md)]
        ST[(session-state.json<br/>hint rung, timers)]
        MAP[(skill-map.yaml<br/>OOD curriculum)]
    end

    P --> H2 --> AG
    H1 --> AG
    AG -- tool call --> H3
    H3 -- allow/deny --> AG
    AG -- after tool --> H4
    AG -- finishing --> H5 --> R
    R --> DI
    CM & OS & SK --> AG
    H1 & H2 & H3 <--> SR
    H2 <--> ST
    H4 --> SR
    H5 --> DI
    MAP --> H2
```

**Design choices:**

- **Rules that must hold go in hooks.** Hooks are deterministic. Instructions in CLAUDE.md are *advisory*: the model usually follows them, but it can drift from them in long sessions. So the rule "do not write code that you own" has to be a hook.
- **Teaching behaviour goes in skills, CLAUDE.md and the output style.** This covers Socratic questions, explanations and the tone of feedback.
- **The harness keeps its state in plain files** that you can read and edit (JSON/Markdown). That keeps the system transparent, and transparency supports your autonomy (P10).

### 5.2 The Autonomy Ladder (per skill)

The harness gives each skill its own level. The five levels follow cognitive apprenticeship and worked examples that are faded step by step, with automation at the top.

| Level | Name | Who writes the code? | AI role | You must… | Grounding |
|---|---|---|---|---|---|
| **L0** | *Demonstrate* | AI | Writes a worked example with **subgoal labels** and explains it | Give text input (intent and requirements), then **self-explain** 2–3 key lines and predict outputs | Worked examples, subgoals, self-explanation |
| **L1** | *Complete* | AI writes the skeleton, you write the core | Writes scaffolding with `TODO(human)` gaps, or Parsons-style fragments | Fill in the gaps and run the tests | Completion/Parsons problems, backward fading |
| **L2** | *Guided* | You | Hint ladder only: question → concept → pseudocode → partial snippet (last resort, time-gated) | Write everything, ask for hints | Scaffolding, contingent tutoring, desirable difficulty |
| **L3** | *Independent* | You | Reviews **after** your attempt: code review, design critique, test ideas | Solve it alone, then defend your choices | Deliberate practice, feedback |
| **L4** | *Automated* | AI | Writes the code. You **review** the diff and predict the approach on samples | Supervise, plus periodic maintenance retrieval | Autonomous stage, levels of automation, ironies of automation |

**As built (10 November 2026, §10.4):** a new skill starts with your attempt, and its first task places it on a level. Going down is automatic when the evidence shows it. Going up stays your decision. Maintenance reviews exist at L4 only.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Placement : new skill - attempt first, L2 hint ladder, no unlock on time

    Placement --> L3_Independent : first task at rung 0
    Placement --> L2_Guided : first task at rung 1-2
    Placement --> L1_Complete : first task at rung 3-4
    Placement --> L0_Demonstrate : first task needed a worked solution (rung 5)

    L0_Demonstrate --> L1_Complete : 2 correct self-explanations + predicted output right
    L1_Complete --> L2_Guided : 3 gaps filled, tests pass, max 1 hint per gap
    L2_Guided --> L3_Independent : about 85% solved over 5+ tasks, at least half at rung 0-1 (learner confirms the proposal)
    L2_Guided --> L4_Automated : jump - the same tasks also meet the L4 criterion, plus the transfer task (learner confirms)
    L3_Independent --> MasteryCheck : 3x rung 0 on 2+ different days
    MasteryCheck --> L4_Automated : transfer task via /mastery-check, no hint + explanation (learner confirms)
    MasteryCheck --> L3_Independent : failed - targeted practice

    L1_Complete --> L0_Demonstrate : auto-demote
    L2_Guided --> L1_Complete : auto-demote
    L3_Independent --> L2_Guided : auto-demote

    L4_Automated --> Maintenance : Fibonacci date passed
    Maintenance --> L4_Automated : next time in real work, done by the learner - new date
    Maintenance --> L3_Independent : 2 failed reviews in a row - auto-demote

    L4_Automated --> [*] : skill retired - no longer relevant
```

- **Placement.** A skill below L4 with no history and no tasks of its own has an open placement. Until its first task it counts as L2, for the hint ladder and for the guard. So a new skill no longer starts at L0: L0 and L1 are forms of help that come *after* an attempt. The highest rung of the first task sets the level (§5.3).
- **Auto-demote** happens only when `settings.autoDemote` is on; it is off by default. The rule looks at the skill's own explained tasks since its last level change, at most the last 10. With at least 3 of them, it applies when under 70% were solved (at rung ≤ 2) or the last 2 were not solved. It also applies after 2 failed reviews in a row. A microskill then goes down one level. For a parent skill, the demotion analyst first decides whether a microskill or the parent goes down (§10.4.2).
- **Up** never happens automatically. You can undo any automatic change with `set`.

??? note "Earlier version (7–9 November 2026)"

    ```mermaid
    stateDiagram-v2
        direction LR
        [*] --> L0_Demonstrate : new skill encountered

        L0_Demonstrate --> L1_Complete : 2 correct self-explanations + predicted output right
        L1_Complete --> L2_Guided : 3 gaps filled, tests pass, ≤1 hint per gap
        L2_Guided --> L3_Independent : success rate ≥85% over ≥5 tasks, avg hint rung ≤1
        L3_Independent --> MasteryCheck : 3 independent successes on ≥2 different days
        MasteryCheck --> L4_Automated : novel transfer task passed + explanation correct
        MasteryCheck --> L3_Independent : failed → targeted practice

        L1_Complete --> L0_Demonstrate : stuck twice / under 50% success
        L2_Guided --> L1_Complete : success rate under 70%
        L3_Independent --> L2_Guided : 2 failures in a row

        L4_Automated --> Maintenance : spaced review due
        L3_Independent --> Maintenance : spaced review due (revised: reviews start at L3)
        Maintenance --> L4_Automated : retrieval passed → interval grows
        Maintenance --> L3_Independent : 2 failed reviews in a row → advice to demote (learner decides)

        L4_Automated --> [*] : skill retired - no longer relevant
    ```

> **"Just giving text input" at the start** is L0. You describe your intent and requirements in prose, and the AI writes a fully annotated example. Even here you are never fully passive: at L0 you give a short self-explanation or prediction before the session counts as progress (Chi et al., 1989; Kazemitabaar et al., 2025).

### 5.3 Friction calibration & the hint ladder

The hint ladder puts two ideas into practice: contingent tutoring (more help after failure, less after success; §2.3) and productive struggle (§2.2). You get the next rung only after **(a)** a visible attempt, such as code you changed or a hypothesis you stated, **or (b)** when the stuck timer runs out. This rule keeps the struggle productive, so that it does not turn into floundering.

```mermaid
flowchart TD
    A[Learner asks for help<br/>on skill S at level L2] --> B{Visible attempt<br/>since last hint?}
    B -- no --> C{Stuck timer<br/>> T minutes?}
    C -- no --> D["AI: 'Show me what you tried<br/>or state your hypothesis.'<br/>(no new info)"]
    C -- yes --> E[Unlock next rung]
    B -- yes --> E
    E --> F{Current rung}
    F -- 1 --> G["Rung 1 · Socratic question<br/>'What does the client need<br/>to know about this object?'"]
    F -- 2 --> H["Rung 2 · Concept pointer<br/>'Look at Dependency Inversion;<br/>what depends on what?'"]
    F -- 3 --> I["Rung 3 · Pseudocode /<br/>UML sketch of structure"]
    F -- 4 --> J["Rung 4 · Partial code snippet<br/>(≤5 lines, never the full solution)"]
    F -- 5 --> K["Rung 5 · Worked solution<br/>+ mandatory self-explanation<br/>→ task counts as FAILED,<br/>similar task scheduled"]
    G & H & I & J --> L[Learner continues]
    K --> M[Consolidation:<br/>explain it back in own words]
    L --> N{Solved?}
    N -- yes --> O[Log success + rung used<br/>→ update success rate]
    N -- no --> A
    M --> O
```

**Calibration rules** (contingent tutoring, with about 85% success as a rule of thumb; §2.2 explains why this is a heuristic and not evidence):

- The harness keeps a **rolling success rate** for each skill. It counts only successes at rung ≤ 2.
- **> 95%** → too easy. Make the tasks harder, or mix in other skills (interleaving). Check whether you meet the criteria for the next level.
- **70–95%** → in the zone. Keep going.
- **< 70%** → too hard. Shorten the stuck timer `T` (e.g. 15 → 8 min), choose easier tasks, or go down one level.
- For L2, `T` starts at **10–15 minutes**. That is within the time in which confusion can still be productive (D'Mello et al., 2014). You can change `T`.

**As built (10 November 2026, §10.4):** for a **new skill** whose placement is still open (§5.2), rungs do **not** unlock on time. A rung goes up only when:

- you say you are stuck;
- you share the same error or test outcome twice;
- you say you do not know the concept.

If you ask for more explanation after an attempt of your own, Claude may go straight up to rung 4. The rung Claude really gives is logged through its `[trede N]` marker, and it counts towards the placement. For normal L2 tasks the stuck timer `T` stays at 12 minutes, but it counts active time only: a break longer than `idleMinutes` (default 20) does not count.

### 5.4 Hook pipeline

The diagram follows one session and shows when each hook steps in.

```mermaid
sequenceDiagram
    autonumber
    actor U as Learner
    participant SS as SessionStart hook
    participant UP as UserPromptSubmit hook
    participant C as Claude
    participant PT as PreToolUse hook
    participant PO as PostToolUse hook
    participant SH as Stop hook
    participant FS as .learning/ files

    SS->>FS: read skills.json, compute due reviews
    SS-->>C: context: levels, due reviews,<br/>"ask learner for today's plan"
    C->>U: "2 reviews due (Strategy, SRP).<br/>What do you want to work on?"
    U->>UP: "help me make the payment<br/>types polymorphic"
    UP->>FS: map prompt → skill ood.polymorphism (L2),<br/>read hint rung + timer
    UP-->>C: context: "Skill at L2 → hints only,<br/>rung 1 unlocked, no code writing"
    C->>U: Socratic question (rung 1)
    U->>C: attempts, then "just write it for me"
    C->>PT: Edit(src/Payment.java)
    PT->>FS: file owned by ood.polymorphism @ L2
    PT-->>C: DENY: "learner-owned at L2#59;<br/>offer next hint instead"
    C->>U: rung 2 hint + "or /override #lt;reason#gt;"
    U->>C: writes code, runs tests
    C->>PO: Bash(mvn test)
    PO->>FS: log evidence: tests passed, rung=2
    C->>SH: about to finish
    SH->>FS: diary entry exists for session?
    SH-->>C: BLOCK once: "ask the 3 reflection<br/>questions, record answers verbatim"
    C->>U: reflection questions
    U->>C: answers in own words
    C->>FS: append diary entry, update skill record
```

| Hook | Event | Job | Can it block? |
|---|---|---|---|
| `session-start.mjs` | `SessionStart` | Gives Claude a summary of your skill record, the reviews due today, and the instruction to ask you for a plan (*forethought*) | No (context only) |
| `prompt-gate.mjs` | `UserPromptSubmit` | Matches your prompt to a skill using keywords from `skill-map.yaml`, adds the policy for that level and the current hint rung, starts or updates the stuck timer, and handles `/override`. *Revised (§10.2, item 10):* ignores agent reports, task notifications and system reminders, and logs `prompt-ignored` | Can add context. Can block only on abuse patterns (optional) |
| `ownership-guard.mjs` | `PreToolUse` (matcher `Edit\|Write\|MultiEdit\|NotebookEdit`) | Blocks AI edits to files, or parts of files, that belong to a skill at L1–L3. At L1 it allows a write only if it contains `TODO(human)` gaps | **Yes** (`permissionDecision: deny`) |
| ~~`evidence-log.mjs`~~ → `check.mjs` (built) | CLI, which you run yourself with `!` | *Revised (§10):* because you run the tests yourself, a PostToolUse hook never sees them. `check.mjs` runs `dotnet test` with a trx logger, prints a readable summary, remembers per test method whether it was green, and logs a red→green transition as a task with the current hint rung. It works for any .NET test project (practice exercises and project work) | No |
| `reflect-gate.mjs` | `Stop` | If you worked on a skill and there is no diary entry yet, it blocks **once** and tells Claude to run the reflection. It uses `stop_hook_active` to avoid loops. *Revised (§10):* it also reads Claude's last answer from the transcript and processes the `[trede N]` and `[uitleg-ok <tid>]` markers. That second marker is accepted only if your own message passes the deterministic explanation check | Yes, once |

!!! example "Example: one student's situation"
    The harness was first tried by a second-year HBO-ICT student who practised OOD in C#. The course exercises came with .NET unit tests, and the student ran them, not Claude. That is why `check.mjs` runs `dotnet test`. The diagrams and examples in this section still use Java from the original design (`mvn test`, `src/Payment.java`).

### 5.5 Skill record (data model)

The skill record is where the harness keeps track of your progress. It follows the idea of knowledge tracing (a probability of mastery for each skill, updated from evidence) and the scheduling of spaced repetition. The subject is OOD, so here it is as a class diagram:

```mermaid
classDiagram
    direction LR
    class SkillRecord {
        +String learnerId
        +Date updated
        +Settings settings
        +List~Skill~ skills
        +dueReviews(today) List~Skill~
    }
    class Settings {
        +int stuckTimerMinutes
        +float targetSuccess
        +bool assessmentMode
        +List~int~ reviewIntervalsDays
    }
    class Skill {
        +String id
        +String title
        +String category
        +Level level
        +float pKnown
        +float rollingSuccess
        +List~String~ prerequisites
        +List~String~ ownedPaths
        +Date lastPracticed
        +Date nextReview
        +int intervalIndex
        +List~Evidence~ evidence
        +promote()
        +demote(reason)
        +scheduleNextReview(passed)
    }
    class Level {
        <<enumeration>>
        L0_DEMONSTRATE
        L1_COMPLETE
        L2_GUIDED
        L3_INDEPENDENT
        L4_AUTOMATED
    }
    class Evidence {
        +DateTime at
        +String kind
        +bool success
        +int hintRung
        +int minutes
        +String note
        +String diaryRef
    }
    class DiaryEntry {
        +Date date
        +String sessionId
        +List~String~ skillsTouched
        +String plan
        +String whatIDid
        +String whatAIDid
        +int overrides
        +String reflectionLearned
        +String reflectionConfused "learner's words"
        +String nextStep           "learner's words"
    }
    SkillRecord "1" *-- "1" Settings
    SkillRecord "1" *-- "*" Skill
    Skill "1" *-- "*" Evidence
    Skill --> Level
    Evidence ..> DiaryEntry : diaryRef
```

**Example `skills.json` entry:**

```json
{
  "id": "ood.strategy-pattern",
  "title": "Strategy pattern",
  "category": "design",
  "level": "L3_INDEPENDENT",
  "pKnown": 0.82,
  "rollingSuccess": 0.86,
  "prerequisites": ["ood.polymorphism", "ood.interfaces"],
  "ownedPaths": ["src/main/java/shop/pricing/**"],
  "lastPracticed": "2026-11-05",
  "nextReview": "2026-11-12",
  "intervalIndex": 1,
  "evidence": [
    {"at": "2026-11-03T14:10", "kind": "task", "success": true, "hintRung": 1, "minutes": 22, "diaryRef": "2026-11-03#s2"},
    {"at": "2026-11-05T10:02", "kind": "task", "success": true, "hintRung": 0, "minutes": 14, "diaryRef": "2026-11-05#s1"}
  ]
}
```

**As built (after the first sessions, §10):** the record is flatter than the class diagram above. Each entry has `id`, `title`, `level`, `paths`, `nextReview`, `intervalIndex`, `failStreak` and `history`. The harness does not store evidence inside the skill. It writes it to a log that only grows (append-only), `.learning/state/events.jsonl`, with events such as `task`, `task-explained`, `test-green`, `hint-unlock` and `review`. **Microskills** are parts of a skill: entries with a `parent` and their own `keywords`:

```json
{ "id": "cs.basis.void-chaining", "parent": "cs.basis", "title": "void-methoden en chainen",
  "level": "L2", "keywords": ["reverse()", "chainen", "void"], "nextReview": null, "intervalIndex": 0 }
```

### 5.6 AI diary & reflection loop

The diary follows the cycle of self-regulated learning (Zimmerman, 2002) and uses **prompted learning protocols** (Nückles et al., 2009): you write in answer to a few set questions. The AI logs the facts. You write the reflection.

```mermaid
flowchart LR
    subgraph Forethought
        F1["SessionStart:<br/>'What's your goal today?<br/>Which skill? How confident (1–5)?'"]
    end
    subgraph Performance
        P1[Work on task at<br/>current ladder level]
        P2[Hints / attempts / tests<br/>auto-logged as evidence]
    end
    subgraph Self-reflection
        R1["Stop hook → 3 prompts:<br/>1. Explain what you learned<br/>   as if to a classmate<br/>2. What confused you / what<br/>   would you do differently?<br/>3. Confidence now (1–5)<br/>   + next step"]
        R2["Calibration check:<br/>confidence vs. actual<br/>hint rung / success"]
    end
    F1 --> P1 --> P2 --> R1 --> R2
    R2 -- informs --> F1
    R2 --> D[(diary/2026-11-07.md)]
    P2 --> S[(skills.json)]
```

**Diary entry template** (for example `.learning/diary/2026-11-07.md`):

```markdown
## Session 2 · 14:05–15:10 · skills: ood.polymorphism (L2), ood.srp (review)

**Plan (me):** Refactor PaymentProcessor so new payment types don't need if/else. Confidence: 2/5

**Facts (logged):**
- Hint rungs used: 1, 2 (no rung ≥3) · stuck timer fired: 0×
- Tests: 3 runs, last ✅ 12/12
- AI wrote: test skeleton only · I wrote: Payment interface, 3 implementations
- Overrides: 0 · Review SRP: passed → next review 2026-11-14

**Reflection (my words):**
1. *Learned:* The if/else on type was a smell; each payment class now owns its own `process()` behaviour...
2. *Confused / differently:* Not sure whether `validate()` belongs in the interface or a separate validator...
3. *Confidence now:* 4/5 · *Next:* try the same with discounts (Strategy?)

**Calibration:** predicted 2 → performed at rung ≤2 → under-confident ✅ (good sign)
```

**Weekly diary review** (15 minutes, `/diary --week`): Claude summarizes the trends of the week: the success rate per skill, the number of overrides, gaps in calibration, and the skills closest to the next level. *You* decide what to focus on next week. In this way the review helps you monitor your own learning, without doing the monitoring for you.

### 5.7 Spaced reinforcement after mastery

Once you have mastered a skill, the harness keeps checking it now and then. Reviews use **expanding intervals**, adjusted to your results in the style of Leitner and half-life regression. They also **interleave** skills, which trains you to choose the right principle. Expanding intervals are not proven better than equal ones (§2.5). Spacing and retrieval do the work. The schedule mainly makes sure that early reviews succeed and that reviews fall before your exam. Review tasks are *retrieval* tasks, not re-reading:

- *"Without looking: sketch the class diagram for a Strategy-based shipping cost calculator."*
- *"Here are 3 code snippets. Which violates LSP, and why?"* (interleaved discrimination)
- *"Predict what the AI's design for X will look like before it generates it, then compare."* This supervision check is for L4 skills.

```mermaid
flowchart TD
    M[Skill reaches L4<br/>mastery confirmed] --> I0[Interval 3 days]
    I0 --> Q{Review due:<br/>retrieval task<br/>~5 min, no AI help}
    Q -- pass, fluent --> UP[Next interval:<br/>3 → 7 → 21 → 60 → 120 days]
    Q -- pass, slow/shaky --> SAME[Repeat same interval]
    Q -- fail --> DEM[Demote to L3<br/>AI stops automating this skill<br/>targeted practice]
    UP --> Q
    SAME --> Q
    DEM --> RE[Re-earn mastery<br/>usually fast: relearning savings]
    RE --> I0
    UP -- 120d passed twice --> RET[Long-term maintenance:<br/>yearly spot check +<br/>continuous supervision<br/>of AI output]
```

```mermaid
timeline
    title Example life of the skill "Strategy pattern"
    Week 1 : L0 demonstrate - AI writes annotated example, you self-explain
           : L1 complete - fill TODO(human) gaps in the context classes
    Week 2 : L2 guided - write ShippingCost strategies with hints (rung ≤2)
    Week 3 : L3 independent - 3 solo tasks on 2 days, AI reviews afterwards
           : Mastery check - novel transfer task (discount rules) + explain
    Week 4 : L4 automated - AI writes Strategy boilerplate, you review the diff
           : Review at +3 days passed
    Week 5 : Review at +7 days passed
    Week 8 : Review at +21 days - shaky, interval repeated
    Week 11 : Review at +21 days passed
    Month 5 : Review at +60 days passed - long-term maintenance
```

At the start of each session, the **`SessionStart` hook** shows the reviews that are due. So reinforcement happens automatically, and you do not have to remember it. This is the "enforce learning as long as needed" part: a skill is *never permanently out of the loop*. It just gets checked less and less often.

**As built (10 November 2026, §10.4):** reviews now happen in your real work, and only at L4.

- **No separate review exercises.** A review is the **next time the skill comes up in your real work** after its date: through its folder, its keywords, or a `check.mjs` run that is mapped to it. The hook then says so once. This time you do that part yourself, not the AI: while the review is due, the guard treats the skill's paths as L3.
- **Fibonacci intervals:** 1, 2, 3, 5, 8, 13, 21, 34 … days, for **L4 skills and microskills only**. An L3 skill needs no schedule, because you do it yourself whenever it comes up.
- **The rung of that task sets the outcome:**
    - rung 0 → `pass`, one step up the sequence;
    - rung 1–2 → `shaky`, the interval repeats;
    - rung 3–5 or a failed task → `fail`, **two steps back**.
- **After two fails in a row:** the rule for automatic demotion applies (§5.2, §10.4.2). With `autoDemote` off, you get advice to go down one level.
- **If the skill does not come up:** nothing happens, and the review waits. Nothing appears at the start of a session. The dashboard shows no "overdue", only when you last saw the skill.
- **Before your exam:** with `settings.examDate` set, a review falls no later than 3 days before the exam. The safety net before the exam is your course's practice exams. They are deliberately outside the harness.

```mermaid
flowchart LR
    S[Skill or microskill reaches L4] --> I["Interval i = 0 → 1 day"]
    I --> D{Date passed and<br/>skill comes up<br/>in real work?}
    D -- not yet --> W["The review waits<br/>nothing shown, no 'overdue'"]
    D -- yes --> Q["Learner does it, AI does not<br/>(paths treated as L3)"]
    Q -- rung 0 --> UP["pass: i + 1<br/>1, 2, 3, 5, 8, 13, 21 …"]
    Q -- rung 1–2 --> SAME[shaky: same interval]
    Q -- rung 3–5 or failed --> BACK["fail: i − 2"]
    BACK --> F{2nd fail<br/>in a row?}
    F -- yes --> DEM["Automatic demotion rule, §10.4.2<br/>advice only if autoDemote is off"]
    UP & SAME & BACK --> C["clamp: ≤ examDate − 3 days"] --> D
```

??? note "Earlier version as built (§10, 7 November 2026)"

    The harness replaced the 3 → 7 → 21 → 60 → 120 schedule above.

    - **Fibonacci intervals:** 1, 2, 3, 5, 8, 13, 21, 34 … days.
    - **Starting point:** reviews start as soon as a skill or microskill reaches **L3**, not L4. That fits the goal "mastered → only occasional reinforcement".
    - **After a review:** `pass` moves one step up the sequence, `shaky` repeats the interval, and `fail` moves **two steps back**.
    - **After two fails in a row:** the harness *advises* you to go down one level. It never demotes a skill automatically.
    - **Before your exam:** if you set your exam date in `settings.examDate`, the harness shortens every interval so that the review falls no later than 3 days before the exam.

    ```mermaid
    flowchart LR
        S[Skill or microskill reaches L3] --> I["Interval i = 0 → 1 day"]
        I --> Q{Retrieval review<br/>~5 min, no help}
        Q -- pass --> UP["i + 1<br/>1, 2, 3, 5, 8, 13, 21 …"]
        Q -- shaky --> SAME[same interval]
        Q -- fail --> BACK["i − 2"]
        BACK --> F{2nd fail<br/>in a row?}
        F -- yes --> ADV[Advice: one level down<br/>learner decides]
        UP & SAME & BACK --> C["clamp: ≤ examDate − 3 days"] --> Q
    ```

### 5.8 OOD skill map

`skill-map.yaml` defines the curriculum as a graph: which skills unlock which, and which keywords the harness uses to detect skills in your prompts. A skill becomes available at L0 once its prerequisites are at L2 or higher. A skill can only be automated (L4) when its prerequisites are at L4 as well. That way the AI never automates something whose foundations you cannot supervise.

```mermaid
flowchart TD
    subgraph Foundations
        A1[Classes & objects<br/>state, identity, behaviour]
        A2[Encapsulation<br/>& access modifiers]
        A3[Constructors &<br/>object lifecycle]
    end
    subgraph Relationships
        B1[Association /<br/>aggregation / composition]
        B2[Inheritance]
        B3[Interfaces &<br/>abstract classes]
        B4[Polymorphism<br/>dynamic dispatch]
    end
    subgraph Modelling
        C1[UML class diagrams]
        C2[UML sequence diagrams]
        C3[Responsibility assignment<br/>GRASP / CRC]
    end
    subgraph Principles
        D1[SRP]
        D2[Open/Closed]
        D3[Liskov Substitution]
        D4[Interface Segregation]
        D5[Dependency Inversion]
        D6[Composition over<br/>inheritance]
    end
    subgraph Patterns
        E1[Strategy]
        E2[Observer]
        E3[Factory Method /<br/>Abstract Factory]
        E4[Decorator]
        E5[Adapter]
        E6[State]
    end
    subgraph Practice
        F1[Unit testing / TDD]
        F2[Code smells &<br/>refactoring]
        F3[Dependency injection]
    end
    A1 --> A2 --> A3
    A1 --> B1 & B2
    B2 --> B3 --> B4
    A1 --> C1
    B1 & B2 --> C1
    C1 --> C2
    C1 --> C3 --> D1
    B4 --> D2 & D3
    B3 --> D4 & D5
    B1 & B2 --> D6
    D2 & B4 --> E1
    D5 --> E2
    D5 --> E3
    D6 --> E4 & E5
    E1 --> E6
    D1 --> F2
    F1 --> F2
    D5 --> F3
```

---

## 6. Evaluation

How do you know whether the harness protects your learning and does not just add friction? Check these points:

1. **Unassisted transfer tests** at the start (baseline), after about a month, and shortly before your exam. Use small OOD tasks *without AI*: design a class diagram, refactor a smelly class, apply a pattern to a new domain. This is the measure that matters most. Bastani et al. (2025) showed that how well you do in practice with AI tells you little about how well you do without it.
2. **Success rate per skill** should stay around 70–95%. If it stays above 95%, the friction is too low. If it stays below 70%, the friction is too high.
3. **Override rate.** If it rises, that is a sign of frustration (R6) or of bypassing the rules (R5). Read the reasons in the diary.
4. **Calibration.** The gap between your predicted confidence and how independently you actually work should shrink over time (R2).
5. **Review pass rate** for L4 skills should be 80% or higher. If it is lower, shorten the intervals.
6. **Time to mastery per skill.** It should *decrease* for later skills that build on prerequisites you have already mastered. This is a transfer effect.
7. **Mock exam vs. practice (R14).** Do a timed mock exam without AI, in the same environment (IDE) as your exam. Compare your score with your success rate in practice. A big gap means that your practice conditions are too easy, or too different from the test.
8. **Supervision check (R16, after your exam).** Take a short class written by AI, with planted OOD and test flaws, and count how many flaws you find without help. Repeat this every month.

---

## 7. Limitations

- **The evidence base is young.** Most studies on generative AI date from 2023–2026. They often have small samples or short durations, or they are preprints and working papers (e.g. Kosmyna et al., 2025; Shen & Tamkin, 2026; Lehmann et al., 2025; most of the 2026 trials in §2.8). In higher education, only one study has measured retention beyond about a week: a quasi-experiment with a seven-week test (Albadarin, 2026). The Stanford SCALE review (November 2026) also finds long-term gains still unshown. Effects may change as the tools change.
- **A narrative review, corrected once.** There was no search protocol, and the first version overstated several findings (§11). The revision added evidence grades and targeted searches. It is still not systematic, so selection bias is possible.
- **Little OOD-specific AI research, and none on agentic tools.** Most studies of AI in computing education focus on programming tasks from CS1 (the first programming course). Applying them to design skills is an inference from research on OOD misconceptions plus general learning science. No controlled study yet exists of how students learn with agentic tools like Claude Code.
- **The evidence on the skill shift is mostly American, descriptive and commercial.** Causal labour-market studies disagree. Dutch data are thin and correlational. The figures on how much code AI writes come mainly from companies that sell AI. No study measures the best mix of practice by hand and practice in supervision, so §2.9 and §4.1 are inferences.
- **Conflict of interest.** This document was written by Claude, an Anthropic model, and it relies in places on Anthropic research. Check the important claims through the linked sources.
- **Hooks are a commitment device, not security.** You can always switch them off, and the AI can sometimes find routes around the rules (e.g. shell commands that write files). So the harness cannot prove to a teacher that a student worked without AI. It works because *you* chose it. The `PreToolUse` matcher can be extended to `Bash` for common file-writing commands, but this will never be airtight. Hooks can also misfire the other way. In the first sessions of the pilot, reports from background agents were treated as the student's own prompts and unlocked hint rungs, until this was fixed (§10.2, item 10).
- **Tried by one student so far.** The design was first tried in a pilot with one student. What §10 reports comes from those first sessions. It shows what went wrong and what was changed, not how well the harness works for students in general.
- **Mastery thresholds are heuristics.** The numbers (85%, 3 successes over 2 days, the intervals) come from the literature, but they have not been validated for this setup. Adjust them using your own evaluation data (§6).
- **Detecting skills from prompts is approximate.** Matching on keywords will sometimes pick the wrong skill. Let the AI propose a skill and confirm it, or name the skill yourself (`/learn ood.strategy`).

---

## 8. References

*Classic references are cited from established literature. Recent generative AI studies were checked against the publisher or arXiv records at the time of writing. Preprints (not peer reviewed) are marked.*

**How the sources were verified.** Two citation checks compared the claims in this review with their primary sources: one for the [generative AI studies](https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/research/citation-checks/citation_check_genai.md) and one for the [learning science](https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/research/citation-checks/citation_check_learning_science.md). The corrections that came out of them are in the [change log](#11-change-log).

**Learning to program & OOD**

- Becker, B. A., Denny, P., Finnie-Ansley, J., Luxton-Reilly, A., Prather, J., & Santos, E. A. (2023). Programming is hard – or at least it used to be: Educational opportunities and challenges of AI code generation. *Proc. SIGCSE 2023*, 500–506.
- Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. *Cognitive Science, 13*(2), 145–182.
- Eckerdal, A., & Thuné, M. (2005). Novice Java programmers' conceptions of "object" and "class", and variation theory. *Proc. ITiCSE 2005*, 89–93.
- Ericson, B. J., Margulieux, L. E., & Rick, J. (2017). Solving Parsons problems versus fixing and writing code. *Proc. Koli Calling 2017*, 20–29.
- Holland, S., Griffiths, R., & Woodman, M. (1997). Avoiding object misconceptions. *Proc. SIGCSE 1997*, 131–134.
- Kölling, M. (1999). The problem of teaching object-oriented programming, Part 1: Languages. *Journal of Object-Oriented Programming, 11*(8), 8–15.
- Lister, R., et al. (2004). A multi-national study of reading and tracing skills in novice programmers. *ACM SIGCSE Bulletin, 36*(4), 119–150.
- Lopez, M., Whalley, J., Robbins, P., & Lister, R. (2008). Relationships between reading, tracing and writing skills in introductory programming. *Proc. ICER 2008*, 101–112.
- Margulieux, L. E., Catrambone, R., & Guzdial, M. (2012). Subgoal-labeled instructional material improves performance and transfer in learning to develop mobile applications. *Proc. ICER 2012*, 71–78.
- McCracken, M., et al. (2001). A multi-national, multi-institutional study of assessment of programming skills of first-year CS students. *ACM SIGCSE Bulletin, 33*(4), 125–180.
- Morrison, B. B., Margulieux, L. E., & Guzdial, M. (2015). Subgoals, context, and worked examples in learning computing problem solving. *Proc. ICER 2015*, 21–29.
- Parsons, D., & Haden, P. (2006). Parson's programming puzzles: A fun and effective learning tool for first programming courses. *Proc. ACE 2006*, 157–163.
- Ragonis, N., & Ben-Ari, M. (2005). A long-term investigation of the comprehension of OOP concepts by novices. *Computer Science Education, 15*(3), 203–221.
- Robins, A., Rountree, J., & Rountree, N. (2003). Learning and teaching programming: A review and discussion. *Computer Science Education, 13*(2), 137–172.
- Sanders, K., & Thomas, L. (2007). Checklists for grading object-oriented CS1 programs: Concepts and misconceptions. *Proc. ITiCSE 2007*, 166–170.

**Learning science: friction, scaffolding, mastery, retention, reflection**

- Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research, 87*(3), 659–701.
- Aleven, V., & Koedinger, K. R. (2000). Limitations of student control: Do students know when they need help? *Proc. ITS 2000*, LNCS 1839, 292–303.
- Aleven, V., Stahl, E., Schworm, S., Fischer, F., & Wallace, R. (2003). Help seeking and help design in interactive learning environments. *Review of Educational Research, 73*(3), 277–320.
- Anderson, J. R. (1982). Acquisition of cognitive skill. *Psychological Review, 89*(4), 369–406.
- Anderson, J. R., Corbett, A. T., Koedinger, K. R., & Pelletier, R. (1995). Cognitive tutors: Lessons learned. *Journal of the Learning Sciences, 4*(2), 167–207.
- Ariely, D., & Wertenbroch, K. (2002). Procrastination, deadlines, and performance: Self-control by precommitment. *Psychological Science, 13*(3), 219–224.
- Arthur, W., Jr., Bennett, W., Jr., Stanush, P. L., & McNelly, T. L. (1998). Factors that influence skill decay and retention: A quantitative review and analysis. *Human Performance, 11*(1), 57–101.
- Atkinson, R. K., Renkl, A., & Merrill, M. M. (2003). Transitioning from studying examples to solving problems: Effects of self-explanation prompts and fading worked-out steps. *Journal of Educational Psychology, 95*(4), 774–783.
- Baker, R. S., Corbett, A. T., Koedinger, K. R., & Wagner, A. Z. (2004). Off-task behavior in the cognitive tutor classroom: When students "game the system". *Proc. CHI 2004*, 383–390.
- Bertsch, S., Pesta, B. J., Wiscott, R., & McDaniel, M. A. (2007). The generation effect: A meta-analytic review. *Memory & Cognition, 35*(2), 201–210.
- Bjork, R. A. (1994). Memory and metamemory considerations in the training of human beings. In J. Metcalfe & A. Shimamura (Eds.), *Metacognition: Knowing about knowing* (pp. 185–205). MIT Press.
- Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), *Psychology and the real world* (pp. 56–64). Worth.
- Bloom, B. S. (1968). Learning for mastery. *Evaluation Comment, 1*(2). UCLA-CSEIP.
- Bloom, B. S. (1984). The 2 sigma problem: The search for methods of group instruction as effective as one-to-one tutoring. *Educational Researcher, 13*(6), 4–16.
- Boud, D., Keogh, R., & Walker, D. (Eds.). (1985). *Reflection: Turning experience into learning*. Kogan Page.
- Brunmair, M., & Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. *Psychological Bulletin, 145*(11), 1029–1052.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin, 132*(3), 354–380.
- Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. *Psychological Science, 19*(11), 1095–1102.
- Collins, A., Brown, J. S., & Newman, S. E. (1989). Cognitive apprenticeship: Teaching the crafts of reading, writing, and mathematics. In L. B. Resnick (Ed.), *Knowing, learning, and instruction* (pp. 453–494). Erlbaum.
- Corbett, A. T., & Anderson, J. R. (1994). Knowledge tracing: Modeling the acquisition of procedural knowledge. *User Modeling and User-Adapted Interaction, 4*(4), 253–278.
- Csikszentmihalyi, M. (1990). *Flow: The psychology of optimal experience*. Harper & Row.
- D'Mello, S., Lehman, B., Pekrun, R., & Graesser, A. (2014). Confusion can be beneficial for learning. *Learning and Instruction, 29*, 153–170.
- Dreyfus, S. E., & Dreyfus, H. L. (1980). *A five-stage model of the mental activities involved in directed skill acquisition*. University of California, Berkeley (ORC 80-2).
- Driskell, J. E., Willis, R. P., & Copper, C. (1992). Effect of overlearning on retention. *Journal of Applied Psychology, 77*(5), 615–622.
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest, 14*(1), 4–58.
- Ebbinghaus, H. (1885/1913). *Memory: A contribution to experimental psychology*. Teachers College.
- Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. *Psychological Review, 100*(3), 363–406.
- Fitts, P. M., & Posner, M. I. (1967). *Human performance*. Brooks/Cole.
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research, 77*(1), 81–112.
- Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. *Educational Psychologist, 38*(1), 23–31.
- Kang, S. H. K. (2016). Spaced repetition promotes efficient and effective learning: Policy implications for instruction. *Policy Insights from the Behavioral and Brain Sciences, 3*(1), 12–19.
- Kapur, M. (2008). Productive failure. *Cognition and Instruction, 26*(3), 379–424.
- Kapur, M. (2016). Examining productive failure, productive success, unproductive failure, and unproductive success in learning. *Educational Psychologist, 51*(2), 289–299.
- Karpicke, J. D., & Roediger, H. L. (2008). The critical importance of retrieval for learning. *Science, 319*(5865), 966–968.
- Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). Why minimal guidance during instruction does not work. *Educational Psychologist, 41*(2), 75–86.
- Koriat, A., & Bjork, R. A. (2005). Illusions of competence in monitoring one's knowledge during study. *Journal of Experimental Psychology: Learning, Memory, and Cognition, 31*(2), 187–194.
- Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the "enemy of induction"? *Psychological Science, 19*(6), 585–592.
- Kulik, C.-L. C., Kulik, J. A., & Bangert-Drowns, R. L. (1990). Effectiveness of mastery learning programs: A meta-analysis. *Review of Educational Research, 60*(2), 265–299.
- Latimier, A., Peyre, H., & Ramus, F. (2021). A meta-analytic review of the benefit of spacing out retrieval practice episodes on retention. *Educational Psychology Review, 33*, 959–987.
- Leitner, S. (1972). *So lernt man lernen*. Herder.
- Metcalfe, J. (2017). Learning from errors. *Annual Review of Psychology, 68*, 465–489.
- Metcalfe, J., & Kornell, N. (2005). A region of proximal learning model of study time allocation. *Journal of Memory and Language, 52*(4), 463–477.
- Moon, J. A. (2006). *Learning journals: A handbook for reflective practice and professional development* (2nd ed.). Routledge.
- Nückles, M., Hübner, S., & Renkl, A. (2009). Enhancing self-regulated learning by writing learning protocols. *Learning and Instruction, 19*(3), 259–271.
- Nückles, M., Roelle, J., Glogger-Frey, I., Waldeyer, J., & Renkl, A. (2020). The self-regulation-view in writing-to-learn: Using journal writing to optimize cognitive load in self-regulated learning. *Educational Psychology Review, 32*, 1089–1126.
- Pea, R. D. (2004). The social and technological dimensions of scaffolding and related theoretical concepts. *Journal of the Learning Sciences, 13*(3), 423–451.
- Puntambekar, S., & Hübscher, R. (2005). Tools for scaffolding students in a complex learning environment: What have we gained and what have we missed? *Educational Psychologist, 40*(1), 1–12.
- Renkl, A., & Atkinson, R. K. (2003). Structuring the transition from example study to problem solving in cognitive skill acquisition. *Educational Psychologist, 38*(1), 15–22.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249–255.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science, 35*, 481–498.
- Rohrer, D., Taylor, K., Pashler, H., Wixted, J. T., & Cepeda, N. J. (2005). The effect of overlearning on long-term retention. *Applied Cognitive Psychology, 19*(3), 361–374.
- Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. *American Psychologist, 55*(1), 68–78.
- Schön, D. A. (1983). *The reflective practitioner*. Basic Books.
- Settles, B., & Meeder, B. (2016). A trainable spaced repetition model for language learning. *Proc. ACL 2016*, 1848–1858.
- Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research, 78*(1), 153–189.
- Slamecka, N. J., & Graf, P. (1978). The generation effect: Delineation of a phenomenon. *Journal of Experimental Psychology: Human Learning and Memory, 4*(6), 592–604.
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science, 12*(2), 257–285.
- Sweller, J., & Cooper, G. A. (1985). The use of worked examples as a substitute for problem solving in learning algebra. *Cognition and Instruction, 2*(1), 59–89.
- VanLehn, K. (2011). The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems. *Educational Psychologist, 46*(4), 197–221.
- Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.
- Wilson, R. C., Shenhav, A., Straccia, M., & Cohen, J. D. (2019). The eighty five percent rule for optimal learning. *Nature Communications, 10*, 4646.
- Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. *Journal of Child Psychology and Psychiatry, 17*(2), 89–100.
- Wood, H., & Wood, D. (1999). Help seeking, learning and contingent tutoring. *Computers & Education, 33*(2–3), 153–169.
- Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. *Theory Into Practice, 41*(2), 64–70.

**Automation & cognitive offloading**

- Bainbridge, L. (1983). Ironies of automation. *Automatica, 19*(6), 775–779.
- Endsley, M. R., & Kiris, E. O. (1995). The out-of-the-loop performance problem and level of control in automation. *Human Factors, 37*(2), 381–394.
- Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: An attentional integration. *Human Factors, 52*(3), 381–410.
- Parasuraman, R., Sheridan, T. B., & Wickens, C. D. (2000). A model for types and levels of human interaction with automation. *IEEE Transactions on Systems, Man, and Cybernetics – Part A, 30*(3), 286–297.
- Risko, E. F., & Gilbert, S. J. (2016). Cognitive offloading. *Trends in Cognitive Sciences, 20*(9), 676–688.
- Sparrow, B., Liu, J., & Wegner, D. M. (2011). Google effects on memory: Cognitive consequences of having information at our fingertips. *Science, 333*(6043), 776–778. [Contested: Experiment 1 failed to replicate (Camerer et al., 2018; Hesselmann, 2020).]

**Generative AI & learning (programming and general)**

- Anthropic. (2025a, April 8). *Anthropic Education Report: How university students use Claude* [vendor]. https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude
- Anthropic. (n.d.). *Output styles* (Claude Code documentation; *Learning* style with `TODO(human)`). https://code.claude.com/docs/en/output-styles
- Anthropic. (n.d.). *Hooks reference* (Claude Code documentation). https://code.claude.com/docs/en/hooks
- Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). Generative AI without guardrails can harm learning: Evidence from high school mathematics. *PNAS, 122*(26), e2422633122. https://doi.org/10.1073/pnas.2422633122
- Becker, J., Rush, N., Barnes, E., & Rein, D. (2025). *Measuring the impact of early-2025 AI on experienced open-source developer productivity*. METR. arXiv:2507.09089 [preprint].
- Darvishi, A., Khosravi, H., Sadiq, S., Gašević, D., & Siemens, G. (2024). Impact of AI assistance on student agency. *Computers & Education, 210*, 104967.
- Denny, P., Prather, J., Becker, B. A., et al. (2024). Computing education in the era of generative AI. *Communications of the ACM, 67*(2), 56–67.
- Denny, P., Leinonen, J., Prather, J., et al. (2024b). Prompt problems: A new programming exercise for the generative AI era. *Proc. SIGCSE 2024*, 296–302.
- Fan, Y., Tang, L., Le, H., et al. (2025). Beware of metacognitive laziness: Effects of generative artificial intelligence on learning motivation, processes, and performance. *British Journal of Educational Technology, 56*(2), 489–530. https://doi.org/10.1111/bjet.13544
- Finnie-Ansley, J., Denny, P., Becker, B. A., Luxton-Reilly, A., & Prather, J. (2022). The robots are coming: Exploring the implications of OpenAI Codex on introductory programming. *Proc. ACE 2022*, 10–19.
- Gerlich, M. (2025). AI tools in society: Impacts on cognitive offloading and the future of critical thinking. *Societies, 15*(1), 6. [A correction to a table appeared in *Societies, 15*(9), 252.]
- Hellas, A., Leinonen, J., Sarsa, S., Koutcheme, C., Kujanpää, L., & Sorva, J. (2023). Exploring the responses of large language models to beginner programmers' help requests. *Proc. ICER 2023*, 93–105.
- Jošt, G., Taneski, V., & Karakatič, S. (2024). The impact of large language models on programming education and student learning outcomes. *Applied Sciences, 14*(10), 4115.
- Karpathy, A. (2025, February 2). "There's a new kind of coding I call 'vibe coding'…" [Post on X].
- Kazemitabaar, M., Chow, J., Ma, C. K. T., Ericson, B. J., Weintrop, D., & Grossman, T. (2023). Studying the effect of AI code generators on supporting novice learners in introductory programming. *Proc. CHI 2023*. arXiv:2302.07427.
- Kazemitabaar, M., Hou, X., Henley, A., Ericson, B. J., Weintrop, D., & Grossman, T. (2023b). How novices use LLM-based code generators to solve CS1 coding tasks in a self-paced learning environment. *Proc. Koli Calling 2023*. arXiv:2309.14049.
- Kazemitabaar, M., Ye, R., Wang, X., Henley, A. Z., Denny, P., Craig, M., & Grossman, T. (2024). CodeAid: Evaluating a classroom deployment of an LLM-based programming assistant that balances student and educator needs. *Proc. CHI 2024*. arXiv:2401.11314.
- Kazemitabaar, M., Huang, O., Suh, S., Henley, A. Z., & Grossman, T. (2025). Exploring the design space of cognitive engagement techniques with AI-generated code for enhanced learning. *Proc. IUI 2025*.
- Kestin, G., Miller, K., Klales, A., Milbourne, T., & Ponti, G. (2025). AI tutoring outperforms in-class active learning: An RCT introducing a novel research-based design in an authentic educational setting. *Scientific Reports, 15*, 17458. https://doi.org/10.1038/s41598-025-97652-6
- Kosmyna, N., Hauptmann, E., Yuan, Y. T., et al. (2025). *Your brain on ChatGPT: Accumulation of cognitive debt when using an AI assistant for essay writing task*. arXiv:2506.08872 [preprint, not peer reviewed; v2, December 2025; critiqued by Stanković et al., 2026].
- Lau, S., & Guo, P. (2023). From "Ban it till we understand it" to "Resistance is futile": How university programming instructors plan to adapt as more students use AI code generation and explanation tools such as ChatGPT and GitHub Copilot. *Proc. ICER 2023*, 106–121.
- LearnLM Team, Google. (2024). *LearnLM: Improving Gemini for learning*. arXiv:2412.16429 [preprint]. [LearnLM is no longer a separate model. Its capabilities are part of Gemini 2.5 and later, and the student mode is called "Guided Learning" (August 2025).]
- Lee, H.-P., Sarkar, A., Tankelevitch, L., et al. (2025). The impact of generative AI on critical thinking: Self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers. *Proc. CHI 2025*.
- Lehmann, M., Cornelius, P. B., & Sting, F. J. (2025). *AI meets the classroom: When do large language models harm learning?* arXiv:2409.09047 [preprint; still unpublished as of November 2026].
- Leinonen, J., Hellas, A., Sarsa, S., et al. (2023). Using large language models to enhance programming error messages. *Proc. SIGCSE 2023*, 563–569.
- Liffiton, M., Sheese, B., Savelka, J., & Denny, P. (2023). CodeHelp: Using large language models with guardrails for scalable support in programming classes. *Proc. Koli Calling 2023*.
- Liu, R., Zenke, C., Liu, C., Holmes, A., Thornton, P., & Malan, D. J. (2024). Teaching CS50 with AI: Leveraging generative artificial intelligence in computer science education. *Proc. SIGCSE 2024*, 750–756.
- Lyu, W., Wang, Y., Chung, T., Sun, Y., & Zhang, Y. (2024). Evaluating the effectiveness of LLMs in introductory computer science education: A semester-long field study. *Proc. L@S 2024*, 63–74.
- Margulieux, L. E., Prather, J., Reeves, B. N., et al. (2024). Self-regulation, self-efficacy, and fear of failure interactions with how novices use LLMs to solve programming problems. *Proc. ITiCSE 2024*, 276–282.
- Peng, S., Kalliamvakou, E., Cihon, P., & Demirer, M. (2023). *The impact of AI on developer productivity: Evidence from GitHub Copilot*. arXiv:2302.06590 [preprint; 95 recruited, 35 per group completed].
- Prather, J., Denny, P., Leinonen, J., et al. (2023). The robots are here: Navigating the generative AI revolution in computing education. *Proc. ITiCSE-WGR 2023*, 108–159.
- Prather, J., Reeves, B. N., Leinonen, J., et al. (2024). The widening gap: The benefits and harms of generative AI for novice programmers. *Proc. ICER 2024*. arXiv:2405.17739.
- Prather, J., Reeves, B. N., Denny, P., et al. (2024b). "It's weird that it knows what I want": Usability and interactions with Copilot for novice programmers. *ACM Transactions on Computer-Human Interaction, 31*(1), 1–31.
- Sarsa, S., Denny, P., Hellas, A., & Leinonen, J. (2022). Automatic generation of programming exercises and code explanations using large language models. *Proc. ICER 2022*, 27–43.
- Shen, J. H., & Tamkin, A. (2026). *How AI impacts skill formation*. arXiv:2601.20245 [preprint, v2 1 February 2026; Anthropic Fellows Program, vendor]. https://arxiv.org/abs/2601.20245
- Stadler, M., Bannert, M., & Sailer, M. (2024). Cognitive ease at a cost: LLMs reduce mental effort but compromise depth in student scientific inquiry. *Computers in Human Behavior, 160*, 108386.
- Zastudil, C., Rogalska, M., Kapp, C., Vaughn, J., & MacNeil, S. (2023). Generative AI in computing education: Perspectives of students and instructors. *Proc. IEEE FIE 2023*.

**Added in the revision of 8 November 2026**

*Initials are omitted, and "[title not verified]" is shown, where those details could not be checked; the DOI or URL leads to the source. Preprints and working papers are not peer reviewed. Per-figure source links are in `research_notes/AI learning and skill shift 2026/`.*

*Learning science*

- Camerer, C. F., Dreber, A., Holzmeister, F., et al. (2018). Evaluating the replicability of social science experiments in Nature and Science between 2010 and 2015. *Nature Human Behaviour, 2*, 637–644. https://doi.org/10.1038/s41562-018-0399-z
- Driskell, J. E., Johnston, J. H., & Salas, E. (2001). Does stress training generalize to novel settings? *Human Factors, 43*(1), 99–110. https://doi.org/10.1518/001872001775992471
- Ericsson, K. A., & Harwell, K. W. (2019). Deliberate practice and proposed limits on the effects of practice on the acquisition of expert performance: Why the original definition matters and recommendations for future research. *Frontiers in Psychology, 10*, 2396. https://doi.org/10.3389/fpsyg.2019.02396
- Grinschgl, S., Papenmeier, F., & Meyerhoff, H. S. (2021). Consequences of cognitive offloading: Boosting performance but diminishing memory. *Quarterly Journal of Experimental Psychology, 74*(9), 1477–1496. https://doi.org/10.1177/17470218211008060
- Grinschgl et al. (2023). [Cognitive offloading and concurrent-task performance; title not verified]. *Psychonomic Bulletin & Review, 30*(6), 2250–2261. https://doi.org/10.3758/s13423-023-02312-3
- Hesselmann, G. (2020). No conclusive evidence that difficult general knowledge questions cause a "Google Stroop effect". A replication study. *PeerJ, 8*, e10325. https://doi.org/10.7717/peerj.10325
- Hinze, S. R., & Rapp, D. N. (2014). Retrieval (sometimes) enhances learning: Performance pressure reduces the benefits of retrieval practice. *Applied Cognitive Psychology, 28*(4), 597–606. https://doi.org/10.1002/acp.3032
- Kang, S. H. K., Lindsey, R. V., Mozer, M. C., & Pashler, H. (2014). Retrieval practice over the long term: Should spacing be expanding or equal-interval? *Psychonomic Bulletin & Review, 21*(6), 1544–1550. https://doi.org/10.3758/s13423-014-0636-z
- Karpicke, J. D., & Roediger, H. L. (2007). Expanding retrieval practice promotes short-term retention, but equally spaced retrieval enhances long-term retention. *Journal of Experimental Psychology: Learning, Memory, and Cognition, 33*(4), 704–719. https://doi.org/10.1037/0278-7393.33.4.704
- Kluger, A. N., & DeNisi, A. (1996). The effects of feedback interventions on performance: A historical review, a meta-analysis, and a preliminary feedback intervention theory. *Psychological Bulletin, 119*(2), 254–284. https://doi.org/10.1037/0033-2909.119.2.254
- Kulik, J. A., & Fletcher, J. D. (2016). Effectiveness of intelligent tutoring systems: A meta-analytic review. *Review of Educational Research, 86*(1), 42–78. https://doi.org/10.3102/0034654315581420
- Macnamara, B. N., Hambrick, D. Z., & Oswald, F. L. (2014). Deliberate practice and performance in music, games, sports, education, and professions: A meta-analysis. *Psychological Science, 25*(8), 1608–1618. https://doi.org/10.1177/0956797614535810
- Macnamara, B. N., & Maitra, M. (2019). The role of deliberate practice in expert performance: Revisiting Ericsson, Krampe & Tesch-Römer (1993). *Royal Society Open Science, 6*(8), 190327. https://doi.org/10.1098/rsos.190327
- Morris, C. D., Bransford, J. D., & Franks, J. J. (1977). Levels of processing versus transfer appropriate processing. *Journal of Verbal Learning and Verbal Behavior, 16*(5), 519–533. https://doi.org/10.1016/S0022-5371(77)80016-9
- Murre, J. M. J. (2021). The Godden and Baddeley (1975) experiment on context-dependent memory on land and underwater: A replication. *Royal Society Open Science, 8*(11), 200724. https://doi.org/10.1098/rsos.200724
- Nickow, A., Oreopoulos, P., & Quan, V. (2024). The promise of tutoring for PreK–12 learning: A systematic review and meta-analysis of the experimental evidence. *American Educational Research Journal, 61*(1), 74–107. https://doi.org/10.3102/00028312231208687
- Pan, S. C., & Rickard, T. C. (2018). Transfer of test-enhanced learning: Meta-analytic review and synthesis. *Psychological Bulletin, 144*(7), 710–756. https://doi.org/10.1037/bul0000151
- Samani, J., & Pan, S. C. (2021). Interleaved practice enhances memory and problem-solving ability in undergraduate physics. *npj Science of Learning, 6*, 32. https://doi.org/10.1038/s41539-021-00110-x
- Saunders, T., Driskell, J. E., Johnston, J. H., & Salas, E. (1996). The effect of stress inoculation training on anxiety and performance. *Journal of Occupational Health Psychology, 1*(2), 170–186. https://doi.org/10.1037/1076-8998.1.2.170
- Schooler & Storm (2021). Saved information is remembered less well than deleted information, if the saving process is perceived as reliable. *Memory, 29*(9), 1101–1110. https://doi.org/10.1080/09658211.2021.1962356
- Sinha, T., & Kapur, M. (2021). When problem solving followed by instruction works: Evidence for productive failure. *Review of Educational Research, 91*(5), 761–798. https://doi.org/10.3102/00346543211019105
- Slavin, R. E. (1987). Mastery learning reconsidered. *Review of Educational Research, 57*(2), 175–213. https://doi.org/10.3102/00346543057002175
- Slavin, R. E. (1990). Mastery learning re-reconsidered. *Review of Educational Research, 60*(2), 300ff. https://doi.org/10.2307/1170613
- Smith, A. M., Floerke, V. A., & Thomas, A. K. (2016). Retrieval practice protects memory against acute stress. *Science, 354*(6315), 1046–1048. https://doi.org/10.1126/science.aah5067
- Smith, S. M., Handy, J. D., Angello, G., & Manzano, I. (2014). Effects of similarity on environmental context cueing. *Memory, 22*(5), 493–508. https://doi.org/10.1080/09658211.2013.800553
- Smith, S. M., & Vela, E. (2001). Environmental context-dependent memory: A review and meta-analysis. *Psychonomic Bulletin & Review, 8*(2), 203–220. https://doi.org/10.3758/BF03196157
- Storm, B. C., & Stone, S. M. (2015). Saving-enhanced memory: The benefits of saving on the learning and remembering of new information. *Psychological Science, 26*(2), 182–188. https://doi.org/10.1177/0956797614559285
- Tatel & Ackerman (2025). [Meta-analysis of decay in procedural skills; title not verified]. *Psychological Bulletin, 151*(6), 696–736. https://doi.org/10.1037/bul0000481
- Tulving, E., & Thomson, D. M. (1973). Encoding specificity and retrieval processes in episodic memory. *Psychological Review, 80*(5), 352–373. https://doi.org/10.1037/h0020071
- von Hippel, P. T. (2024). Two-sigma tutoring: Separating science fiction from science fact. *Education Next, 24*(2), 22–31. https://www.educationnext.org/two-sigma-tutoring-separating-science-fiction-from-science-fact/
- Wisniewski, B., Zierer, K., & Hattie, J. (2020). The power of feedback revisited: A meta-analysis of educational feedback research. *Frontiers in Psychology, 10*, 3087. https://doi.org/10.3389/fpsyg.2019.03087
- Yang, C., Luo, L., Vadillo, M. A., Yu, R., & Shanks, D. R. (2021). Testing (quizzing) boosts classroom learning: A systematic and meta-analytic review. *Psychological Bulletin, 147*(4), 399–435. https://doi.org/10.1037/bul0000309

*Over-reliance, AI tutors and learning with AI (2021–2026)*

- Ardic, Le Dilavrec, & Zaidman (2026). How students use generative AI for software testing: An observational study. *Empirical Software Engineering*. https://doi.org/10.1007/s10664-026-10898-0
- Bansal, G., Wu, T., Zhou, J., Fok, R., Nushi, B., Kamar, E., Ribeiro, M. T., & Weld, D. (2021). Does the whole exceed its parts? The effect of AI explanations on complementary team performance. *Proc. CHI 2021*. https://doi.org/10.1145/3411764.3445717
- Barth, Thorgeirsson, Etemadi, Leinonen, Cotrini, & Su (2026). Steering AI tutors through system prompts: A crossover study on self-regulated learning and cognitive engagement scaffolds in CS1. *Proc. ICER 2026*. https://doi.org/10.1145/3765964.3811656
- Boolzen, C., Kuhn, J., Flegr, S., Rott, E.-M., Stausberg, N., …, & Küchemann, S. (2026). Evidence of impact and interpretational limits of generative AI in STEM education: A systematic review and meta-analysis on cognitive learning outcomes. *Artificial Intelligence Review, 59*, 223. https://doi.org/10.1007/s10462-026-11665-9
- Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction, 5*(CSCW1), 188. https://doi.org/10.1145/3449287
- Contractor, Z., & Reyes, G. (2026). *Experimental evidence on the learning impact of generative AI*. arXiv:2607.08849; IZA Discussion Paper 18792 [working paper]. https://arxiv.org/abs/2607.08849
- Đức Minh (2026). AI-assisted learning and the illusion of competence: Measuring the AI-learning gap through random knowledge verification. *Journal of Interdisciplinary Studies in Education, 15*(4), 45–82. https://doi.org/10.32674/nrmwyw65
- Eleftheriou, Pallis, & Constantinides (2026). Confidence without competence in AI-assisted knowledge work. *Proc. CHIWORK '26*. arXiv:2604.09444.
- Fan, C., Ke, L., Chen, Z., & Lv, P. (2026). Exploring the effect of GenAI on learning outcomes in higher education: A three-level meta-analysis. *Frontiers in Psychology, 17*, 1758670. https://doi.org/10.3389/fpsyg.2026.1758670
- Gajos, K. Z., & Mamykina, L. (2022). Do people engage cognitively with AI? Impact of AI assistance on incidental learning. *Proc. IUI 2022*. https://doi.org/10.1145/3490099.3511138
- Gardella, N., Prather, J., Leinonen, J., Denny, P., Pettit, R., & Riggs, S. L. (2026). Fast and forgettable: A controlled study of novices' performance, learning, workload, and emotion in AI-assisted and human pair programming paradigms. *Proc. ICER 2026*. arXiv:2604.18538.
- Kapoor, Diaz, MacNeil, Porter, & Denny (2025). [AI teaching assistant with an optional "See Solution" guardrail bypass; title not verified]. arXiv:2504.11146 [preprint].
- Lepp & Kaimre (2026). *Revisiting the performance of generative AI on introductory object-oriented programming assessments: Insights from 2026*. arXiv:2608.16318 [preprint].
- Liu, C., Xie, L., & Xu, G. (2026). Generative AI in higher education: A meta-analysis of intellectual and social–emotional outcomes. *Frontiers in Psychology, 17*, 1848745. https://doi.org/10.3389/fpsyg.2026.1848745
- Liu, J., Sweet, T., Chen, M. H., Engelberg, J., Masters, M. C., Clark, M., Persaud, A., Lancaster, A., Hollingsworth, J. K., & Rice, J. K. (2026). *The effects of course-integrated AI tutoring on student performance and engagement: A randomized university trial* (EdWorkingPaper 26-1598). Annenberg Institute at Brown University. https://doi.org/10.26300/y3f8-vh05
- Oreopoulos, Liut, Sungu, & Low (2026). *Making AI tutoring productive: Evidence from a mastery-based math practice experiment* (EdWorkingPaper 26-1552). https://doi.org/10.26300/01qv-6c22
- Pădurean, Riegel, Gotovos, Mahapatra, Ghosh, Denny, Leinonen, Prather, & Singla (2026). When AI is wrong on purpose: How students respond to buggy GenAI code. *Proc. ICER 2026*. arXiv:2607.05068.
- Prather, MacNeil, Luxton-Reilly, Margulieux, Reeves, Denny, Leinonen, Homer, Nabid, & Rossetti (2026). Scaffolding autocomplete: Improving guidance for learners using generative code suggestions. *Proc. ICER 2026*.
- Sankaranarayanan (2026). *Mitigating "epistemic debt" …* [full title not verified]. arXiv:2602.20206 [preprint].
- Stanković et al. (2026). [Methodological critique of Kosmyna et al., 2025; title not verified]. arXiv:2601.00856.
- Strömberg, Lei, & Wu (2026). *The generative AI learning penalty* (CEPR Discussion Paper 21577) [working paper].
- Teo, Jain, Gerstenberg, & Kleiman-Weiner (2026). *AI assistants overassist*. arXiv:2607.21306 [preprint].
- Vasconcelos, H., Jörke, M., Grunde-McLaughlin, M., Gerstenberg, T., Bernstein, M. S., & Krishna, R. (2023). Explanations can reduce overreliance on AI systems during decision-making. *Proceedings of the ACM on Human-Computer Interaction, 7*(CSCW1), 129. https://doi.org/10.1145/3579605
- Wang & Fan (2025). [Meta-analysis of ChatGPT and learning performance]. *Humanities and Social Sciences Communications*. **Retracted in 2026.** https://www.nature.com/articles/s41599-025-04787-y
- Yang, Van Alstyne, & Dellarocas (2026). *When AI tutors speak* [full title not verified]. arXiv:2609.23958 [preprint].

*Skill shift: industry, labour market, deskilling and assessment policy*

- Abdulnour, Gin, & Boscardin (2025). Educational strategies for clinical supervision of artificial intelligence use. *New England Journal of Medicine, 393*(8), 786–797. https://doi.org/10.1056/NEJMra2503232
- Anthropic. (2025b, December 2). *How AI is transforming work at Anthropic* [vendor]. https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic
- Anthropic. (2026). *When AI builds itself* [vendor; updated 18 September 2026]. https://www.anthropic.com/institute/recursive-self-improvement
- Brynjolfsson, E., Chandar, B., & Chen, R. (2026). *Canaries in the coal mine? Six facts about the recent employment effects of artificial intelligence* (revised August 2026) [working paper]. Stanford Digital Economy Lab. https://digitaleconomy.stanford.edu/news/canariesaug26/
- Budzyń, K., Romańczyk, M., Kitala, D., et al. (2025). Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: A multicentre, observational study. *The Lancet Gastroenterology & Hepatology, 10*(10), 896–903. https://doi.org/10.1016/S2468-1253(25)00133-5
- CHE (Christelijke Hogeschool Ede). (2026). *Onderwijs- en examenregeling 2026–2027*: Algemene bepalingen (art. 1.41) and Opleidingsdeel Bachelor ICT (art. 7.11). https://che.nl/algemeen/oer
- Cnossen, F. (2026, July 8). Voor de meeste starters verandert AI de arbeidsmarkt nog niet. *ESB*. https://esb.nu/voor-de-meeste-starters-verandert-ai-de-arbeidsmarkt-nog-niet/
- CodeRabbit. (2025, December 17). *State of AI vs. human code generation* [vendor]. https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report
- Corbin, T., Dawson, P., & Liu, D. (2025). Talk is cheap: Why structural assessment changes are needed for a time of GenAI. *Assessment & Evaluation in Higher Education*. https://doi.org/10.1080/02602938.2025.2503964
- Crane & Soto (2026). *AI and coder employment: Compiling the evidence* (FEDS 2026-018). Federal Reserve Board. https://www.federalreserve.gov/econres/feds/ai-and-coder-employment-compiling-the-evidence.htm
- Cui, K. Z., Demirer, M., Jaffe, S., Musolff, L., Peng, S., & Salz, T. (2025). *The effects of generative AI on high-skilled work: Evidence from three field experiments with software developers* [working paper; two authors at Microsoft]. https://www.mertdemirer.com/Papers/Demirer_AI_productivity.pdf
- Daniotti, S., Wachs, J., Feng, X., & Neffke, F. (2026). Who is using AI to code? Global diffusion and impact of generative AI. *Science*. https://doi.org/10.1126/science.adz9311 [authors as on the 2025 preprint; publication date not verified]
- Davis (2026, February 24). [AI exposure, experience premiums and wage growth; title not verified]. Federal Reserve Bank of Dallas. https://www.dallasfed.org/research/economics/2026/0224
- DORA. (2025). *State of AI-assisted software development* [Google Cloud]. https://dora.dev/research/2025/dora-report/
- DORA. (2026). *ROI of AI-assisted software development (2026.01)* [Google Cloud]. https://dora.dev/ai/roi/report/
- Emanuel, N., Harrington, E., & Pallais, A. (2026, June 1). Remote work leaves younger workers sidelined. *Liberty Street Economics*, Federal Reserve Bank of New York. https://libertystreeteconomics.newyorkfed.org/2026/06/remote-work-leaves-younger-workers-sidelined/
- European Union. (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), Article 4, as amended by the Digital Omnibus on AI (in force 27 July 2026). https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Eurostat. (2026). *ICT specialists in employment*. https://ec.europa.eu/eurostat/statistics-explained/index.php?title=ICT_specialists_in_employment
- Fairlie & Wu (2026). [Recent-graduate unemployment in summer 2026; title not verified] (NBER Working Paper 35796). https://www.nber.org/papers/w35796
- GitClear. (2026). *AI code quality in 2026: The maintainability gap* [vendor]. https://www.gitclear.com/the_ai_code_quality_maintainability_gap
- GitHub. (2026, October 28). *Octoverse 2026* [vendor]. https://octoverse.github.com/
- Groenewegen, Van Limbergen, & Vrieselaar (2026, January 22). Dalende werkgelegenheid onder Nederlandse jongeren die concurreren met GenAI. *ESB*. https://esb.nu/dalende-werkgelegenheid-onder-nederlandse-jongeren-die-concurreren-met-genai/
- He, Miller, Agarwal, Kästner, & Vasilescu (2026). Does AI-assisted coding deliver? A difference-in-differences study of Cursor's impact on software projects. arXiv:2511.04427; published as "Speed at the cost of quality". https://doi.org/10.1145/3793302.3793349
- Humlum, A., & Vestergaard, E. (2026). *Still waters, rapid currents: Early labor market transformation under generative AI* (NBER Working Paper 33777, revised March 2026; first circulated as "Large language models, small labor market effects"). https://www.nber.org/papers/w33777
- Indeed Hiring Lab (Aidala & Puri). (2026, July 23). *The labor market is tilting toward seniority*. https://hiringlab.indeed.com/2026/07/23/the-labor-market-is-tilting-toward-seniority/
- JetBrains. (2026). *AI coding agent adoption 2026* [vendor survey]. https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/
- Lightcast. (2025, July 23). *Beyond the buzz* [AI skills in job postings]. https://lightcast.io/resources/blog/beyond-the-buzz-press-release-2025-07-23
- LinkedIn Economic Graph. (2026, February). *U.S. software engineer talent landscape* [Microsoft-owned].
- Liu & Bridgeman (2023, December 8). [The two-lane approach to assessment; title not verified]. *Teaching@Sydney*. https://educational-innovation.sydney.edu.au/teaching@sydney/?p=19768
- METR. (2026a, February 24). *Uplift update* [follow-up of the developer-productivity study]. https://metr.org/blog/2026-02-24-uplift-update/
- METR. (2026b, May 19). *Frontier risk report*. https://metr.org/blog/2026-05-19-frontier-risk-report/
- Npuls. (2025). *Visie op toetsing en examinering: Naar een AI-bewuste toetspraktijk*. https://npuls.nl/kennisbank/visie-op-toetsing-examinering-en-ai-handreikingen
- NVAO. (2026). *Startverkenning generatieve artificiële intelligentie*. https://www.nvao.net/files/attachments/.13866/Startverkenning_Generatieve_Artificiele_Intelligentie.pdf
- Paradis et al. (2024). *How much does AI impact development speed? An enterprise-based randomized controlled trial*. arXiv:2410.12944 [preprint; Google].
- PwC. (2026, June 15). *2026 Global AI Jobs Barometer* [industry report].
- ROA. (2025). *De arbeidsmarkt naar opleiding en beroep tot 2030* (ROA-R-2025/8). Maastricht University. https://cris.maastrichtuniversity.nl/ws/portalfiles/portal/286490364/ROA_R_2025_8_anob_tot_2030.pdf
- Salomons, A., & van den Berge, W. (2026, February 6). Niet zeker dat werkgelegenheid onder Nederlandse jongeren daalt door GenAI. *ESB*. https://esb.nu/niet-zeker-dat-werkgelegenheid-onder-nederlandse-jongeren-daalt-door-genai/
- Scarfe et al. (2024). [Blind test of AI-written answers in university take-home exams; title not verified]. *PLOS ONE*.
- Semafor. (2026, April 24). *Google CEO says 75% of company's new code is AI-generated*. https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated
- Sonar. (2026, January 8). *State of Code developer survey* [vendor]. https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/
- Stack Overflow. (2026, October 6). *2026 Developer Survey*. https://survey.stackoverflow.co/2026/ai
- Tucker (2026). [Early-career employment and AI exposure; title not verified] (CES-WP-26-27). U.S. Census Bureau. https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-27.html
- U.S. Bureau of Labor Statistics. (2026, August 27). *Occupational Outlook Handbook*: Computer programmers; Software developers, quality assurance analysts, and testers (2025–35 projections). https://www.bls.gov/ooh/computer-and-information-technology/
- University of Sydney. (2026). *Education in the age of AI* [Green Paper]. https://educational-innovation.sydney.edu.au/teaching@sydney/wp-content/uploads/2026/08/AI-in-Education-at-The-University-of-Sydney-Green-Paper.pdf
- UWV. (2026). *ICT-beroepen* [labour-market information]. https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict
- Vadaparty et al. (2024). CS1-LLM: Integrating LLMs into CS1 instruction. *Proc. ITiCSE 2024*. arXiv:2406.15379. Outcomes paper: arXiv:2510.18806.
- Veracode. (2026). *2026 GenAI code security report* (28 July) and *Fall 2026 update* (29 October) [vendor]. https://www.veracode.com/blog/fall-2026-genai-code-security
- Yale Budget Lab. (2026). *Tracking the impact of AI on the labor market* (updated 15 September 2026). https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market
- Yu & Moon (2026). Who will become the next senior? How generative AI erodes the development pathway in software engineering. *Proc. AIES 2026*. arXiv:2607.17067.

**Added in the literature update of 10 November 2026**

*Per-figure source links are in the [notes of the update](notes/update_2026-11-10.md). Preprints, working papers and the dissertation are not peer reviewed.*

- Albadarin, Y. (2026). *Capturing the impact of generative AI on higher-order thinking, creativity, and cognitive dynamics during debugging* [doctoral dissertation, University of Eastern Finland; figures from the university Q&A of 10 November 2026, dissertation not read]. https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html
- Bergh, C., Tag, B., Vassar, A., & Renzella, J. (2026). *Your programming students' cognition with ChatGPT: Higher performance, lower retention, and reduced ownership*. arXiv:2609.21194 [preprint]. https://arxiv.org/abs/2609.21194
- Chen, F., & Stratton, J. (2026). *Artificial intelligence in the firm: Bottlenecks in software production* [working paper, Harvard University; version of 9 November 2026; data from Jellyfish]. https://fion.ac/jellyfish.pdf
- Demirer, M., Musolff, L., & Yang, L. (2026). *Writing code vs. shipping code: Productivity effects across generations of AI coding tools* (NBER Working Paper 35275; revised September 2026) [working paper]. https://doi.org/10.3386/w35275
- Lepp, M. (2026). Patterns of learner-AI interaction and academic performance in an object-oriented programming course. *Proc. IEEE FIE 2026*. arXiv:2607.24755 [preprint].
- O'Neill, P. (2026). [Audit of AI-in-education meta-analyses; title not verified]. EdArXiv preprint, https://osf.io/preprints/edarxiv/n29zd_v3. Reported by Barshay, J. (2026, October 26), *The Hechinger Report*, https://hechingerreport.org/proof-points-ai-education-meta-analysis/
- Walker, Fesler, Martinez Claeys, Agnew, & Loeb (2026). *The evidence base on AI in K-12: A November 2026 review*. SCALE Initiative, Stanford Graduate School of Education. https://doi.org/10.26300/80wn-ca81

---

## Appendix: implementation sketches

> These are **sketches** that show the design can be built. They are not part of your Claude Code configuration unless you add them yourself. Paths assume a project-level `.claude/` folder and a `.learning/` data folder. Node.js is used because Claude Code already requires it, so it works the same on Windows, macOS and Linux.

### A. Folder layout

**As built for the pilot:**

```text
ood/
├── CLAUDE.md                     # authoritative rules for Claude (Dutch)
├── .claude/
│   ├── settings.json             # SessionStart, UserPromptSubmit, PreToolUse, Stop
│   ├── hooks/
│   │   ├── lib.mjs               # record, microskills, Fibonacci, tasks, explanation check
│   │   ├── session-start.mjs     # record + due reviews + open explanations + wins/advice
│   │   ├── prompt-gate.mjs       # skill/microskill detection, hint ladder, task logging
│   │   ├── guard.mjs             # PreToolUse: blocks writing/building/testing at L1–L3
│   │   ├── reflect-gate.mjs      # Stop: [trede N] / [uitleg-ok] markers + diary gate
│   │   ├── skill.mjs             # learner CLI (list, status, set, review, add-micro, done, …)
│   │   └── check.mjs             # learner test runner: trx → red→green evidence
│   └── skills/diary/SKILL.md
└── .learning/
    ├── skills.json               # record incl. microskills and settings.examDate
    ├── keywords.json
    ├── diary/JJJJ-MM-DD.md
    └── state/                    # events.jsonl, tests.json, session-*.json, overrides.json
```

*Original sketch:*

```text
ood/
├── CLAUDE.md                     # pedagogy policy (below)
├── .claude/
│   ├── settings.json             # hook registration
│   ├── hooks/
│   │   ├── lib.mjs               # read/write skills.json, skill detection
│   │   ├── session-start.mjs
│   │   ├── prompt-gate.mjs
│   │   ├── ownership-guard.mjs
│   │   ├── evidence-log.mjs
│   │   └── reflect-gate.mjs
│   └── skills/
│       ├── learn/SKILL.md        # ladder-aware tutoring protocol
│       ├── review-due/SKILL.md   # spaced retrieval quiz
│       ├── mastery-check/SKILL.md
│       └── diary/SKILL.md
└── .learning/                    # git-ignored
    ├── skill-map.yaml
    ├── skills.json
    ├── session-state.json
    └── diary/2026-11-07.md
```

### B. `.claude/settings.json` (hook registration)

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.mjs\"" }] }
    ],
    "UserPromptSubmit": [
      { "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/prompt-gate.mjs\"" }] }
    ],
    "PreToolUse": [
      { "matcher": "Edit|Write|MultiEdit|NotebookEdit",
        "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/ownership-guard.mjs\"" }] }
    ],
    "PostToolUse": [
      { "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/evidence-log.mjs\"" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/reflect-gate.mjs\"" }] }
    ]
  }
}
```

### C. `ownership-guard.mjs` (the core enforcement)

```js
// PreToolUse: deny AI edits to learner-owned code for skills at L1–L3.
import { readStdin, loadSkills, skillForPath, isOverrideActive } from "./lib.mjs";

const input = JSON.parse(await readStdin());
const file = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
if (!file) process.exit(0);

const skills = loadSkills();
const skill = skillForPath(skills, file);           // matches ownedPaths globs
if (!skill || isOverrideActive(skill.id)) process.exit(0);

const newText = input.tool_input?.content ?? input.tool_input?.new_string ?? "";
const level = skill.level;

let deny = null;
if (level === "L1_COMPLETE" && !newText.includes("TODO(human)")) {
  deny = `Skill '${skill.title}' is at L1 (complete). You may write scaffolding only ` +
         `if the core logic is left as TODO(human) gaps for the learner.`;
}
if (level === "L2_GUIDED" || level === "L3_INDEPENDENT") {
  deny = `Skill '${skill.title}' is at ${level}. The learner writes this code. ` +
         (level === "L2_GUIDED" ? "Offer the next hint rung instead." :
                                  "Only review after the learner's attempt.") +
         ` The learner can type /override <reason> to bypass (logged).`;
}

if (deny) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: deny
    }
  }));
}
process.exit(0);
```

### D. `prompt-gate.mjs` (inject the level policy and hint ladder)

```js
// UserPromptSubmit: detect skill, inject ladder policy + hint rung as context.
import { readStdin, loadSkills, detectSkills, loadState, saveState, logOverride } from "./lib.mjs";

const { prompt, session_id } = JSON.parse(await readStdin());
const skills = loadSkills();
const state = loadState(session_id);

if (prompt.trim().startsWith("/override")) {
  logOverride(state.activeSkill, prompt);           // goes to diary + evidence
}

const hits = detectSkills(skills, prompt);          // keyword map from skill-map.yaml
const POLICY = {
  L0_DEMONSTRATE: "Write a worked example with subgoal labels. Then ask the learner to self-explain 2 lines and predict an output before moving on.",
  L1_COMPLETE:    "Write scaffolding only; leave the core logic as TODO(human). Wait for the learner, then give feedback.",
  L2_GUIDED:      "Do NOT write the solution. Use the hint ladder. Current unlocked rung: {rung}. Require a visible attempt before going higher.",
  L3_INDEPENDENT: "Do NOT write or hint unless asked for review AFTER an attempt. Then give a code/design review with questions.",
  L4_AUTOMATED:   "You may implement directly. Before generating, ask the learner to predict the approach in one sentence; show a reviewable diff."
};

const now = Date.now();
const minutesStuck = (now - (state.lastProgressAt ?? now)) / 60000;
const rung = Math.min(5, (state.rung ?? 0) + (minutesStuck >= skills.settings.stuckTimerMinutes ? 1 : 0));

const ctx = hits.map(s =>
  `[learning-harness] Skill ${s.id} is at ${s.level}. ${POLICY[s.level].replace("{rung}", rung)}`
).join("\n");

saveState(session_id, { ...state, activeSkill: hits[0]?.id ?? state.activeSkill, rung });
if (ctx) console.log(JSON.stringify({
  hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: ctx }
}));
```

### E. `reflect-gate.mjs` (Stop: make sure reflection happens once)

```js
import { readStdin, loadState, diaryHasEntry } from "./lib.mjs";
const input = JSON.parse(await readStdin());
if (input.stop_hook_active) process.exit(0);        // never loop
const state = loadState(input.session_id);
if (state.activeSkill && !diaryHasEntry(input.session_id)) {
  console.log(JSON.stringify({
    decision: "block",
    reason: "Before finishing: ask the learner the 3 reflection questions " +
            "(learned / confused / confidence+next). Record their answers VERBATIM " +
            "with the logged facts via the /diary skill. Do not write the reflection yourself."
  }));
}
```

### F. `CLAUDE.md` pedagogy policy (excerpt)

```markdown
# Learning policy (this project is for LEARNING OOD, not just shipping code)

- Treat `[learning-harness]` context as binding for the named skill.
- Never write the learner's reflection; record their words verbatim.
- Prefer explanations, questions and reviews over solutions unless the skill is L4.
- For design skills: ask the learner to propose classes/responsibilities/UML FIRST,
  then critique with trade-off questions (why this abstraction? what changes next?).
- When you are uncertain or the API might be wrong, say so and point to docs/tests.
- If the learner seems stuck >10–15 min or frustrated, offer the next hint rung —
  struggle should be productive, not punishing.
- Assessment mode (graded work): behave as L3 for every skill; log all AI help.
```

### G. `/mastery-check` skill protocol (summary)

1. Generate a **novel transfer task** for the skill in an unfamiliar domain (e.g. Strategy for tax rules instead of shipping).
2. The student solves it **with no hints**. The `prompt-gate` treats rung = 0 as locked.
3. Ask 3 explanation questions: *why this design?*, *what would break with alternative X?*, *when would you NOT use it?*
4. Score it against a rubric. Pass means a working solution, ≥ 2/3 explanation answers correct, and ≥ 2 independent successes in the skill record on different days.
5. On pass: `level = L4`, `nextReview = today + 3d`. On fail: stay at L3 and log the specific gaps as next-session focus.

---

## 10. What we learned from the first sessions

In the first sessions of the pilot, one student used the harness for three learning sessions: setting up the snek exercises, `02-namen` and `03-lijsten`. Afterwards, the transcripts and `events.jsonl` were analysed. This section reports what went wrong and what was changed as a result. The student's guiding requirement was: **recognize what is mastered as quickly as possible, then only reinforce it occasionally, so that most time goes to new material before the assessment.**

!!! example "Example: one student's situation"
    The pilot student was a second-year HBO-ICT student preparing for an OOD exam without AI (AI level 0/1). In the harness, `examDate` was set to the working date 2027-01-20, and the assessment assignment would be published in week 10. The three sessions took place on 7 November 2026. A check after the first month was planned for 15 December 2026.

### 10.1 What the data showed

| Observation | Evidence | Consequence |
|---|---|---|
| Independent successes were invisible | `02-namen`, `MetDonald`, `EersteDrie`, `ZonderGoofy` and `ZonderE` were solved with **no hints**, but none were logged. The only logged task was the one struggle (`LaatsteDrie`, rung 3) | The record showed the opposite of reality. Promotion criteria (≥ 5 tasks) could never be met |
| Keyword logging was too narrow and too loose | "er failt er een minder" and "ik heb een paar unit tests zelfstandig laten slagen" were missed. "dat werkt nu met snek" was logged as a test task | Wrong evidence in both directions |
| Skills were too coarse | `cs.basis` mixes list filtering (mastered), strings (mastered), `GetRange` (rung 2), void/chaining and reference-vs-copy (hard) | One hard sub-topic demoted the whole skill L3 → L2 after a single task, against the stated "< 70% or 2 failures" rule |
| Help at L3 was not measured | At L3, Claude gave analogies and concept explanations (effectively rung 2–3), but no rung was recorded | A task could have been logged as "independent" after substantial help |
| Reviews only existed at L4 | `nextReview` was set only when a skill was set to L4 | "Mastered → occasional reinforcement" was weeks away |
| Tooling ate learning time | About an hour went to snek, the `.vs` lock, the VS 2022 vs .NET 10 mismatch, and usings disappearing on save | Not exam material. The guard also blocked `dotnet --list-sdks` and read-only `find … 2>/dev/null` (false positives) |
| The consolidation explanation never came | It was asked for twice and not answered, yet the task still counted | No consolidation |
| Reading test output was only half mastered | Expected/But was was reasoned through correctly, but the summary was not readable. "Is it the test's fault?" showed a misconception about observable behaviour | This is real learning content for `test.*` microskills |

### 10.2 What was changed

1. **Objective evidence: `check.mjs`.** The student runs it. It works for any .NET test project, snek exercises or project work. A red→green transition is logged as a task with the rung that applied at that moment. The first run per folder is a baseline. Skill mapping, in order: the path of the solution folder, then keywords in test and class names, then the active session skill. Claude may not run it at L1–L3 (guard).
2. **Stricter keyword logging, plus the `done` command.** "het werkt" counts only with code or test context and never with tooling words. Claude proposes the `done` command for successes without tests, such as design or UML.
3. **Microskills.** Entries with a `parent`, their own level, keywords and reviews. They drive the hint ladder. The guard stays path-based on the parent's level. Claude proposes new ones (`add-micro`) and the student creates them. Parent statistics include microskill tasks. *Changed on 10 November 2026 (§10.4.2): with `autoDemote` on, the demotion analyst can also create one.*
4. **Hard own-words explanation check (two keys).** A task stays open, also across sessions, until it is explained. *Changed on 10 November 2026 (§10.4.1, D4): the explanation is asked right away, and an open task lapses when the session ends or the student starts another exercise.*
            - Key 1: Claude judges the content and writes `[uitleg-ok <tid>]`.
            - Key 2: `reflect-gate.mjs` checks the student's own message deterministically: at least 12 words outside code, a causal connective, and at most 40% of its 5-word sequences copied from Claude's earlier text.
            - There is no CLI command to mark a task explained. Promotion via `set` is refused while tasks of that skill are open. Claude cannot write `.learning/state/`.
            - *Rationale:* self-explanation and retrieval (Chi et al., 1989; Roediger & Karpicke, 2006), and avoiding the illusion of competence (Prather et al., 2024).
5. **Honest rung logging at every level.** Claude marks substantive help with `[trede N]`, and the Stop hook raises the task's maximum rung from it.
6. **Active positive signalling.** This happens right after a task at rung 0–2, at session start (recent rung-0 wins and promotion candidates with the exact command) and in the diary. Promotion criteria were *not* loosened. The student explicitly chose against a fast-track challenge route.
7. **Fibonacci reviews from L3,** clamped to the exam date (§5.7). *Changed on 10 November 2026 (§10.4.1, D3): reviews at L4 only, through real work.*
8. **Tooling as an L4 zone, plus guard fixes.**
            - Only `dotnet build|test|run|new|add|…` and `check.mjs` count as building or testing.
            - Redirects to `/dev/null` or `$null`, and `=>` / `->`, no longer count as writes.
            - A leading `cd <dir> &&` sets the effective working directory.
            - Paths inside `.claude/` and `.learning/` are not the student's code.
9. **Demotion discipline.** A single struggle leads to a microskill at a lower level or a short override, not a demotion of the parent skill.
10. **Agent messages are not the student's words (a later fix).**
                - **The problem:** in a session that used background research agents, every agent report and task notification reached `UserPromptSubmit` as if the student had typed it.
                        - `prompt-gate.mjs` detected skills in the report text and unlocked hint rungs as "attempt detected", because reports contain words like *error* and *I think*.
                        - A report saying "all tests passed" could have logged a fake task.
                        - The report also became `lastPrompt`, the text the explanation check reads.
                        - Five spurious `hint-unlock` events were logged within ten minutes in one session.
                - **The fix:** `learnerText()` and `isLearnerEntry()` in `lib.mjs`.
                        - A prompt that starts like an agent report or task notification is ignored as a whole.
                        - System-reminder blocks inside a real message are stripped.
                        - `prompt-gate` then logs one `prompt-ignored` event and stops.
                        - `reflect-gate` treats only the student's own messages as the start of "the last answer".
                - **Why text-based:** the real hook input has no origin field (`cwd, hook_event_name, permission_mode, prompt, prompt_id, scratchpad_dir, session_id, transcript_path`), so detection has to rely on the text.

### 10.3 Open points to evaluate after the first month

- **Threshold checks:**
    - Is 12 words / 40% overlap a good threshold, or does it reject honest short explanations? Check the `explain-rejected` events.
    - Does skill mapping by path or keyword in `check.mjs` work for the project structure of the assessment?
- **Behaviour checks:**
    - Does Claude really mark help at L3 with `[trede N]`? Compare `rung-mark` events with the transcripts.
    - Does the number of `untask` events stay low? A high number would mean the logging is still noisy.
- **Guard:** shell text that merely *mentions* a record command (e.g. in a heredoc) is blocked. This is a deliberate trade-off: the guard is a commitment device, so it errs on the strict side.
- **Agent traffic:**
    - Check that every agent report produces a `prompt-ignored` event and that no real message does.
    - Filter the five spurious `hint-unlock` events of that session out of any evaluation.

### 10.4 Revision of 10 November 2026: learning order, reviews and explanations

A later session of the pilot covered two more exercises, `05-de-auto` and `06-studenten`. Afterwards the setup was reviewed again: a fresh check of the literature, a diagnosis of the bugs with evidence from the code, and a build plan. That review is not published. The student made six decisions (D1–D6). Each was first checked against this literature review, and all of them are now built into the harness. Where the build differs in detail from the plan, this section describes the build.

**Process rule (new):** the student's ideas for the harness are first checked against this literature review (§2, P1–P13). Only then are they decided and built.

#### 10.4.1 Decisions

| # | Decision | Checked against | Verdict and condition |
|---|---|---|---|
| D1 | **Attempt first, also for a new skill.** A skill below L4 with no history and no tasks of its own has an open *placement*. Until its first task it counts as L2, for the hint ladder and the guard. The first task places it by its highest rung: 0 → L3, 1–2 → L2, 3–4 → L1, 5 → L0. The hint ladder stays, because it measures the level. With an open placement, a rung never unlocks on time. It goes up only on a stuck signal: the student says so, shares the same error or test outcome twice, or does not know the concept. After an own attempt, an explicit request for more explanation may go straight up to rung 4. The rung Claude really gives is logged. | P1, P2; generation effect; productive failure (Sinha & Kapur 2021); expertise reversal (Kalyuga et al. 2003); help abuse (Aleven et al. 2003) | **Supported.** The consolidation that productive failure needs comes from D4. Help abuse corrects itself, because a requested rung lowers the placement. A placement after one task is noisy: D2 catches a placement that is too high, and the student fixes one that is too low with `set`. |
| D2 | **Automatic demotion, manual promotion.** The rule: at least 3 explained tasks of the skill itself (the last 10 since its last level change), and under 70% solved (rung ≤ 2) or the last 2 not solved; or 2 failed reviews in a row. A microskill goes down one level right away. For a parent skill the **demotion analyst** decides first (§10.4.2). Backstop: if two different microskills of the same parent go down (or are created by the analyst) within 14 days, the parent goes down too. Up never happens automatically. | P2, P3 (contingent tutoring, Wood & Wood 1999); illusion of competence (Koriat & Bjork 2005); P10 (autonomy through a rule you chose yourself) | **Supported, but only on reliable data.** So it sits behind `settings.autoDemote`, which is off by default. The student turns it on once the fixed logging (§10.4.3) has given reliable data for a few sessions. It is an exception to "only the student changes the record", and the student chose it: whether a skill is mastered shows in practice, which is why there are tests at all. Every change is logged, and the student can undo it with `set`. |
| D3 | **Reviews only through real work, Fibonacci only at L4** (§5.7). No separate review exercises, nothing at the session start, no "overdue". When a due L4 skill comes up in real work, the student does it, not the AI: rung 0 pass, 1–2 shaky, 3–5 or failed fail. If the skill does not come up, the review waits. | P8 (spacing: strong); skill decay (Arthur et al. 1998; Tatel & Ackerman 2025); transfer-appropriate processing (P12); P7 (maintenance after automation) | **Partly supported. The one real tension:** "it happens to come up" does not guarantee spacing. Accepted because the snek exercises build on each other (natural interleaving), and because the safety net is the course's practice exams, **deliberately outside the harness**. The student's reason: a work context differs from a test context. Only rung 0 counts as a pass. |
| D4 | **Own-words explanation only right away.** A task is open from the moment it is logged. It lapses at the first of these: the session ends (after the diary, or at the next session start if the session was left open), or the student starts another exercise (`check.mjs` in another folder, or `done` for a skill of another family). A next task in the same folder does not lapse it, and one message may explain several tasks. A lapsed task does not count. The dashboard shows it as "skipped", apart from failed. The follow-up questions are as strict as before. | Self-explanation (Chi et al. 1989); consolidation after struggle (D'Mello et al. 2014); the cost of a strict gate (§2.4) | **Supported.** It removes the pile of stale explanations that blocked promotion. |
| D5 | Mastery gate unchanged (3× rung 0 on ≥ 2 days, plus a transfer task). Stuck timer for normal L2 tasks unchanged (12 min), but it now counts active time. A recap after a break only on request ("Where was I?"): the status, with no new information. | P6 | No change. |
| D6 | **Tooling:** Claude Code's prompt suggestions off (`"promptSuggestionEnabled": false`), because a suggested next prompt gave hints away. AI completion in the IDE off (for example Rider's Full Line Code Completion). | P11; Gajos & Mamykina 2022 | The installer sets the first. The install guide lists the second. |

#### 10.4.2 The demotion analyst

`check.mjs` almost always logs a task under the **parent** skill, so one weak sub-pattern could take the parent down. That would give the AI more freedom in *every* exercise of that skill. So for a parent skill, a read-only Claude agent, `demotie-analist`, first looks at the failed tasks:

- It reads the test output, the code and the hint exchange in the transcript.
- It links each failure to a sub-pattern: an existing microskill (matched on meaning, not on keywords), or a new one. A one-off slip or a tooling problem is left out.
- It returns a JSON verdict: `micro` when all failures share one sub-pattern, or `ouder` (parent) when there are two or more sub-patterns, or when a failure hits the core of the parent skill. In doubt, it chooses `micro` and says it is in doubt.

How a verdict is applied:

1. When the rule is met for a parent skill, the Stop hook sets a pending demotion.
2. With the next prompt, `prompt-gate` asks Claude to call the agent after the student's current point, not in the middle of a hint.
3. Claude puts the agent's JSON in its answer, in a `[demotie {...}]` marker.
4. The Stop hook applies the verdict only if:
    - the schema is valid;
    - the tasks it names are failed tasks of that family;
    - it goes down one level at most. A new microskill always gets the parent's level minus 1, set by the harness, not by the agent;
    - the agent really ran in that turn: the transcript shows a call to the subagent `demotie-analist`.

With `micro`, only that microskill goes down one level, or it is created, and the failed tasks are moved to it. With `ouder`, the parent goes down one level. A doubt is noted in the diary. As a backstop, the parent goes down too when two different microskills of it go down, or are created by the analyst, within 14 days. If the agent does not run in that session, nothing changes automatically; the rule is checked again after the next explained task.

```mermaid
flowchart TD
    T["Task explained (two keys),<br/>or a review failed"] --> K{"Rule met?<br/>3+ explained tasks of the last 10:<br/>under 70% solved or last 2 not,<br/>or 2 failed reviews in a row"}
    K -- no --> N[Nothing]
    K -->|"yes, microskill"| MD[Microskill one level down]
    K -->|"yes, parent skill"| P[Demotion pending]
    P --> A["After the learner's current point:<br/>Claude calls the agent<br/>demotie-analist (read-only)"]
    P -. agent not run this session .-> N2[Nothing changes<br/>automatically]
    A --> H{"Stop hook checks the JSON:<br/>schema, failed tasks of this family,<br/>one level down, agent call in this turn"}
    H -- invalid --> N2
    H -- valid --> V{Failures map to}
    V -->|"one sub-pattern"| M["Microskill: one level down,<br/>or new at parent level − 1"]
    V -- doubt --> M2["Microskill, and 'doubt'<br/>noted in the diary"]
    V -->|"2+ sub-patterns, or the core of the parent"| O[Parent: one level down]
    MD & M & M2 --> B{"2 microskills of this parent<br/>down or created in 14 days?"}
    B -- yes --> O2[Backstop: parent one level down]
    B -- no --> N3[Done]
```

#### 10.4.3 Bugs found in the same session (all fixed)

1. **The Stop hook missed 10 of 19 markers.** The cause was a race with Claude Code's buffered transcript writer: it flushes every 100 ms, and not before the hook runs. *Fixed:* the Stop hook also reads the `last_assistant_message` field of its input. Four approved explanations had been lost. The new `replay` command checks both keys again from the transcript and logs only what passes (source `replay`), also for a task that has lapsed in the meantime.
2. **A failed build was not stored as a starting point,** so the first green after fixing compile errors was never logged. *Fixed:* a compile error is now a starting point for `check.mjs`.
3. **A keyword beat the folder.** `prompt-gate` never looked at the folder, and rung marks went to the active skill instead of the task's skill. *Fixed:* the folder decides the skill family. A keyword can only pick a microskill within it; `#id` or the name of an exercise switches to another family.
4. **Guard false positives:** `msbuild` and `check.mjs` were matched anywhere in the command text. *Fixed:* the guard splits a shell command into simple commands and judges each one by its program. It refuses `eval` and `iex`, because it cannot see what they run.
5. **Session time was wall-clock time.** The one-hour nudge fired after about 8 minutes of real work, and a break of 12 minutes or more could unlock a rung without an attempt. *Fixed:* the session hour, the task minutes and the stuck timer count active time. A break longer than `idleMinutes` (default 20) does not count.
6. **Minor:** `!` commands bypass `prompt-gate`, and `check.mjs` attached itself to the most recently changed session file, which is wrong with two sessions open at once. *Fixed:* a `!` command now picks the session that is working on that skill family.

#### 10.4.4 Task lifecycle (D4)

A task waits for its explanation only as long as the student is still on that exercise.

```mermaid
stateDiagram-v2
    [*] --> Open : test red to green, done, or solved in chat
    Open --> Explained : uitleg-ok + own-words check (two keys)
    Open --> Open : uitleg-nee + follow-up, or next task in the same folder
    Open --> Lapsed : session ends, or the learner starts another exercise
    Lapsed --> Explained : replay finds both keys in the transcript
    Explained --> [*] : counts towards the success rate
    Lapsed --> [*] : does not count - shown as skipped
```

---

## 11. Change log

### 11 November 2026: learning order, reviews and explanations revised (decisions of 10 November)

The pilot student decided these changes after a later session, and each was first checked against §2. They are now built into the harness. Details and verdicts are in §10.4.

- **§5.2:** a new autonomy-ladder diagram: placement by a first attempt, automatic demotion, and maintenance at L4 only. The earlier diagram is in a collapsed block.
- **§5.3:** unlock rules for new skills: no unlock on time, only on stuck signals, or on an explicit request after a first attempt.
- **§5.7:** reviews through real work, at L4 only, with a new diagram. The earlier "as built" version is in a collapsed block.
- **§10.4:** new: decisions D1–D6, the demotion analyst, the bugs found in the same session (all fixed), and the task lifecycle.
- **Elsewhere:** the status note at the top, and short notes in §10.2, items 3, 4 and 7.

### 10 November 2026 (later): literature update, 8–10 November

A short search for studies that appeared after the notes of 7 November, and for studies those searches had missed. The notes, with a link for every figure, are in the [notes of the update](notes/update_2026-11-10.md).

- **New since 8 November:**
    - Albadarin (2026), dissertation: in a quasi-experiment, the group without AI retained more after seven weeks (§1, §2.8, §3 R1, §7);
    - the Stanford SCALE evidence review of 52 causal studies (§2.8, §7);
    - Chen & Stratton (2026), version of 9 November: the first independent measurement of the review bottleneck (§1, §2.9).
- **Missed by the searches of 7 November:**
    - Bergh et al. (2026): higher coding scores with ChatGPT, but lower recall and less ownership (§2.8; §3 R1 and R10);
    - Lepp (2026): in an OOP course, no difference in AI-free assessment scores between usage profiles (§2.8);
    - O'Neill (2026): an audit of 14 positive meta-analyses (§1, §2.8, §3 R18);
    - Demirer, Musolff & Yang (2026): writing code vs. shipping code (§2.9).
- **Changed:** "Unknown" in §2.8 now reads "Unknown or thin". §7 no longer says that no study in higher education measured retention beyond about a week.
- **Not changed:** the conclusions of §2.8–2.11 and the design (§5). The new studies support the existing conclusions.
- **Checked and not added:** Nathaniel et al. (2026, *Frontiers in Computer Science*; no outcome measured without AI), a narrative review on Zenodo (nothing new), and two vendor reports (OpenAI, Google). The OpenAI trial still has to be checked, because its page could not be opened.
- **How:** about twenty targeted web searches by Claude in one session, each finding checked against its primary source where that could be reached. The Albadarin figures come from a university Q&A; the dissertation itself was not read.

### 10 November 2026: rewritten for students and teachers

- **General main text.** The main text now addresses students who learn programming with AI. The situation of the student it was first written for remains as short, anonymised example boxes. Evidence, grades, citations and references are unchanged.
- **§4 as a step plan.** §4 is now a general step plan, timed relative to the reader's own exam date. The chart with fixed dates became a table.
- **§4.2 for teachers and programmes.** §4.2 is now a separate part for teachers and programmes.
- **§10 as an experience report.** §10 now reports, in the third person, what the first sessions of the pilot showed and what was changed as a result.

### 8 November 2026: research update and critical review of the literature review

**Why.** The first version (7 November) had three weaknesses:

- **No method:** it had no search method.
- **Mixed evidence:** it put evidence of very different strength side by side.
- **One-sided risks:** it looked only at the risks of *using* AI.

A critical read and two citation checks against primary sources found the problems below. Four targeted searches covered May–November 2026. The full citation checks are in the [repository](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/main/research/citation-checks).

**Claims corrected in place:**

| Where | Was | Now | Source of the correction |
|---|---|---|---|
| §1, §2.8 | "The interaction pattern decides the learning outcome" ("what the field agrees on") | The pattern effects are correlational; the best working hypothesis, not a finding | In every study students chose their own pattern. Shen & Tamkin's patterns were identified afterwards, with 2–7 people each |
| §1, §2.8 | Lehmann et al.: solutions vs. explanations; LLMs widen gaps | Neither lab experiment found an average effect; the contrast is observational; the "widening gap" is an exploratory median split | Citation check |
| §2.8 | Kazemitabaar 2023b: copy-paste "linked to worse retention" | Observational; trends, not significant | Citation check |
| §2.8 | Lyu 2024: "gains for AI users" | Not randomized; no direct test between groups | Citation check |
| §1, §2.8 | Kestin 2025: AI tutors "outperform" active learning | Short-term only; no retention test | Citation check |
| §2.7 | Fan 2025 cited for losing the benefit of reflection when AI writes it | Fan did not study reflections; "metacognitive laziness" is an interpretation | Citation check |
| §1, §2.2 | The 85% rule as a "useful quantitative target" | A heuristic: derived for gradient-descent learners, shown only in simulations | Wilson et al. 2019, full text |
| §2.4 | Bloom's 2 sigma without caveat | Contested; human tutoring ≈ 0.79 SD, tutoring programmes ≈ 0.29 SD | VanLehn 2011; von Hippel 2024; Nickow et al. 2024 |
| §2.4 | Mastery learning "confirmed" | Gains on aligned course tests, about zero on standardized tests | Slavin 1987, 1990 |
| §2.4 | Deliberate practice as "the engine of expertise" | A quality principle; 4% of variance explained in education | Macnamara et al. 2014 |
| §2.5 | Optimal spacing gap "10–20% of the retention interval" | 20–40% for a one-week delay, falling to 5–10% for a one-year delay | Cepeda et al. 2008 |
| §2.5, §5.7 | Expanding intervals implied to be better | Not better than equal spacing at a delayed test | Latimier et al. 2021; Karpicke & Roediger 2007; Kang et al. 2014 |
| §2.10 | Sparrow's "Google effect" as a finding | Contested: its first experiment failed to replicate | Camerer et al. 2018; Hesselmann 2020 |
| §2.10 | Offloading "reduces internal memory" | It can also free capacity; it costs memory mainly without a goal to learn | Storm & Stone 2015; Grinschgl et al. 2021 |
| §2.7 | Feedback d ≈ 0.79 (Hattie & Timperley) | d = 0.48; over a third of feedback interventions harm performance | Wisniewski et al. 2020; Kluger & DeNisi 1996 |
| §2.8 | Peng et al.: "n = 95" | 95 recruited, 35 per group completed | Citation check |
| §2.8 | METR "19% slower" as the current picture | The February 2026 follow-up was unreliable, and METR is redesigning the study | METR 2026a |
| §2.8 | LearnLM as a current product | No longer a separate model: "Guided Learning" in Gemini | Citation check |
| §2.8 | Anthropic Education Report: CS "heavily over-represented" | 36.8% (key findings) or 38.6% (body) of conversations vs. 5.4% of US degrees | Citation check |

**Added:**

- **§2.0:** method, evidence grades A–D, conflicts of interest (including this document's own), and the two time horizons.
- **§2.6:** practice conditions and transfer to the test.
- **§2.8:** evidence grades in the tables, the May–November 2026 studies, the retraction of Wang & Fan (2025), and graded conclusions.
- **§2.9:** the shift in skill needs: how much code AI writes, productivity, quality, cost, jobs (US, EU, Netherlands), employer expectations, curricula and an institution's own AI levels, and a graded verdict on "hand-written code is no longer economical".
- **§2.10:** cognitive forcing and over-reliance, plus deskilling and the "paradox of supervision".
- **§2.11:** principles P11–P13 and a strength column.
- **§3:** evidence grades and a horizon for every risk; R9 and R12 re-scored; new risks R14–R18.
- **§4:** mitigations for R14–R18, plus §4.1 (rebalancing practice) and §4.2 (talking points for the AI-policy conversation).
- **Elsewhere:**
    - §6 items 7–8 and the §7 limitations;
    - in §8, corrections to existing references and over 100 new ones;
    - §10.2 item 10 (the hook fix).

**Not changed:** the harness design (§5) and its rules (`CLAUDE.md`). The register changes in §4.1 are proposals; the student who uses the harness decides whether to make them.

**How this revision was made:**

- **Research:** six Claude research agents searched the web on 7–8 November 2026. Four covered new evidence and two checked the original citations.
- **Notes:** their notes, with a link for every figure, are in the [research notes](notes/index.md). Figures the agents saw only in search snippets or secondary coverage are marked as such there.
- **Synthesis:** a separate synthesis report was attempted, but the writing agent stalled twice, so the synthesis was written directly into this document from the notes.
