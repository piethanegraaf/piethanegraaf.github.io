---
title: "Literature review: what research says about learning to code with AI (2026)"
description: "Desirable difficulties, retention, AI and novice programmers, deskilling, the eternal-junior problem and secure code: the evidence, graded per study."
---
<a id="2-literature-review"></a>

# 2. Literature review {#literature-review}

## 2.0 Scope, method and evidence grades

**Three questions.** This page reports what research shows about learning to program with AI. It answers three different questions, and the evidence answers each one differently:

- **Short term (§2.1–2.8):** what helps students learn a skill they have to show without AI, for example in an exam at AI level 0/1. These sections cover how programming and OOD are learned, friction, scaffolding, mastery, retention, practice conditions, reflection, and the studies of generative AI so far.
- **Long term (§2.9):** which skills will matter in the labour market after their studies. That section has its own page: [the shift in skill needs](skill-shift.md).
- **After mastery and at work (§2.10, §2.12–2.13):** what happens to a skill once it is handed to automation (§2.10), how junior developers keep growing when an agent can do the work (§2.12), and whether secure code is a good first niche for juniors (§2.13).

The design principles drawn from this evidence (§2.11) are on the [design page](design.md#211-synthesis-design-principles). This page keeps to the evidence.

**Method.** This is a **narrative review**, not a systematic one, so selection bias is possible. It mixes randomized trials, small interview studies and preprints. The method has four parts:

- **Targeted searches.** Four searches covered May–November 2026: learning research, the labour market, the economics of AI coding, and skills and assessment policy. A follow-up search added studies they had missed ([notes of the update](../notes/update_2026-11-10.md)). The notes, with a link for every figure, are in the [research notes](../notes/index.md); the synthesis is in `reports/` and is not published.
- **Citation checks.** Two citation checks compared the claims with their primary sources.
- **Corrections** wherever a claim went further than its source. They are listed in the [change log](build-log.md#changelog).
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

This review was written with Claude, Anthropic's model, and Claude agents carried out the searches. A vendor study that reports *harm* from the vendor's own product, such as Shen & Tamkin, is more credible than a vendor claim about how much code AI already writes; such claims are graded D. Important claims should be checked through the linked primary source.

## 2.1 How programming and OOD skills are learned

**Programming is hard to learn, and the difficulty lies in problem decomposition and mental models more than in syntax.** The multinational [McCracken et al. (2001)](https://doi.org/10.1145/572139.572181) study found that most first-year students could not solve a moderate programming problem. [Robins, Rountree & Rountree (2003)](https://doi.org/10.1076/csed.13.2.137.14200) reviewed the field and concluded that novices lack *schemas* (plans) and *mental models* of program execution. Novices have trouble combining known constructs into solutions. Knowing the constructs is not the bottleneck.

**Reading and tracing come before writing.** [Lister et al. (2004)](https://doi.org/10.1145/1041624.1041673) showed that many students cannot reliably *trace* code. [Lopez et al. (2008)](https://doi.org/10.1145/1404520.1404531) found a hierarchy in which tracing and explaining code predict writing ability. **This matters for AI use:** when AI writes the code, the learner gets *reading* practice at best. That practice only pays off when the learner actually traces and explains the code. Accepting it passively does not count.

**OOD has its own misconceptions.** [Holland, Griffiths & Woodman (1997)](https://doi.org/10.1145/268085.268132) described common object misconceptions, for example confusing a class with an instance, or seeing objects as mere data records. [Ragonis & Ben-Ari (2005)](https://doi.org/10.1080/08993400500224310) followed novices over a long period and found persistent difficulties with object state, constructors and the static/dynamic distinction. [Eckerdal & Thuné (2005)](https://doi.org/10.1145/1151954.1067473) showed that students' *conceptions* of object and class range from "a piece of code" to "a model of something in the problem domain". The last of these is the conception OOD needs. [Sanders & Thomas (2007)](https://doi.org/10.1145/1269900.1268834) built a checklist of OO concepts and misconceptions for assessment. [Kölling (1999)](references.md#ref-kolling-1999) argued that OOP needs an "objects first" approach with suitable tools. **Implication:** OOD skill is largely *design judgement*, which shows up as choosing responsibilities, abstractions and relationships. An AI that hands over finished, pattern-heavy designs lets the learner skip exactly that judgement.

**Instructional techniques with good evidence in computing education:**

- **Worked examples** cut cognitive load for novices ([Sweller & Cooper, 1985](https://doi.org/10.1207/s1532690xci0201_3); [Sweller, 1988](https://doi.org/10.1207/s15516709cog1202_4)).
- **Subgoal labels** (named steps in a worked example) improve problem solving and transfer in programming ([Margulieux, Catrambone & Guzdial, 2012](https://doi.org/10.1145/2361276.2361291); [Morrison, Margulieux & Guzdial, 2015](https://doi.org/10.1145/2787622.2787733)).
- **Parsons problems** (rearranging given code fragments) are an efficient bridge between reading and writing ([Parsons & Haden, 2006](references.md#ref-parsons-2006); [Ericson, Margulieux & Rick, 2017](https://doi.org/10.1145/3141880.3141895)).
- **Self-explanation** of examples strongly predicts learning ([Chi et al., 1989](https://doi.org/10.1207/s15516709cog1302_1)).
- **Generating answers** improves memory compared with reading them: the *generation effect* ([Slamecka & Graf, 1978](https://doi.org/10.1037/0278-7393.4.6.592); meta-analysis [Bertsch et al., 2007](https://doi.org/10.3758/bf03193441)).

## 2.2 Friction: desirable difficulties vs. getting stuck

**Desirable difficulties.** [Bjork (1994)](https://doi.org/10.7551/mitpress/4561.003.0011) and [Bjork & Bjork (2011)](references.md#ref-bjork-2011) showed that conditions which slow down *apparent* progress during practice often *improve* long-term retention and transfer. Examples are spacing, interleaving, retrieval and generation. Fluent, easy practice gives an *illusion of competence*: students judge their learning by how easy practice felt, and that judgement is systematically wrong ([Koriat & Bjork, 2005](https://doi.org/10.1037/0278-7393.31.2.187); [Kornell & Bjork, 2008](https://doi.org/10.1111/j.1467-9280.2008.02127.x)). AI assistance is close to the ultimate fluency machine.

**But difficulty has to be *desirable*, meaning the learner can overcome it:**

- **Minimal guidance fails novices.** [Kirschner, Sweller & Clark (2006)](https://doi.org/10.1207/s15326985ep4102_1) reviewed the evidence that unguided discovery overloads working memory.
- **Productive failure.** [Kapur](https://doi.org/10.1080/07370000802212669) (2008, 2016) showed that struggling with a problem *before* instruction can improve conceptual understanding and transfer, but only if the struggle is followed by consolidation. [Kapur (2016)](https://doi.org/10.1080/00461520.2016.1155457) separates *productive failure* from *unproductive failure*, where a student flounders without support. A meta-analysis of 53 studies found a moderate advantage for problem solving before instruction (g = 0.36, 95% CI 0.20–0.51), and a larger one (0.37–0.58) when the design followed productive-failure principles. Instruction first was better for young learners and for domain-general skills ([Sinha & Kapur, 2021](https://doi.org/10.3102/00346543211019105)). So the debate with Kirschner et al. is moderated, not settled. An attempt only counts as productive failure if an explanation follows that builds on it and compares it with a canonical solution. Without that, "attempt first" is the minimally guided case Kirschner et al. criticise.
- **Confusion can help.** [D'Mello et al. (2014)](https://doi.org/10.1016/j.learninstruc.2012.05.003) found that confusion improves learning *when it is resolved*. Unresolved confusion turns into frustration and disengagement.
- **The 85% rule is a heuristic, not evidence.** [Wilson et al. (2019)](https://doi.org/10.1038/s41467-019-12552-4) derived that learners trained by stochastic gradient descent on *binary classification* tasks learn fastest at a training error rate of about 15.87% (accuracy ≈ 85%).
    - **Simulations only:** they showed it in a perceptron, a two-layer network on MNIST digits and a model of monkey perceptual learning. They collected no human data and call a human test future work.
    - **Depends on noise:** with non-Gaussian noise the optimum moves to 82% or 75%.
    - **Difficulty, not mastery:** the number is a difficulty target *during* practice, not a mastery threshold.
    - **Too fine for small samples:** over 5 tasks, a success rate near the target can only be 80% or 100%.

    So "about 85%" is a rule of thumb at most: practice should be hard enough that learners sometimes fail.

- **Zone of proximal development / region of proximal learning.** [Vygotsky (1978)](https://doi.org/10.2307/j.ctvjf9vz4) described the zone where a learner succeeds *with* help but not yet alone. [Metcalfe & Kornell (2005)](https://doi.org/10.1016/j.jml.2004.12.001) showed that students gain most from studying items just beyond their current mastery.
- **Flow.** [Csikszentmihalyi (1990)](references.md#ref-csikszentmihalyi-1990) found that engagement peaks when challenge matches skill. Too easy leads to boredom and too hard to anxiety.

**Help-seeking itself can go wrong.** [Aleven & Koedinger (2000)](https://doi.org/10.1007/3-540-45108-0_33) and [Aleven et al. (2003)](https://doi.org/10.3102/00346543073003277) showed that students in tutoring systems often *misuse* help: they click through hints to reach the answer ("help abuse") or avoid help when they need it. [Baker et al. (2004)](https://doi.org/10.1145/985692.985741) documented "gaming the system" and its negative link with learning. **An AI coding assistant is a hint button with no limit.** Help-seeking therefore needs structure, such as hints in steps, time limits and a required attempt before help.

**Bottom line for friction:** the evidence supports *struggle with a safety net*. Learners try first. Help escalates gradually, and only after a real attempt. Nobody is left stuck and alone for too long. Every struggle ends with consolidation: an explanation, a reflection, or a worked solution *after* the attempt. For what the harness does with this, see the [design principles](design.md#211-synthesis-design-principles).

## 2.3 Scaffolding, fading and the expertise-reversal effect

- **Scaffolding** was defined by [Wood, Bruner & Ross (1976)](https://doi.org/10.1111/j.1469-7610.1976.tb00381.x) as tutor support that controls the parts of a task beyond the student's capacity. [Pea (2004)](https://doi.org/10.1207/s15327809jls1303_6) and [Puntambekar & Hübscher (2005)](https://doi.org/10.1207/s15326985ep4001_1) stressed that a scaffold only counts as one if it is **faded**. Permanent support is just a crutch.
- **Cognitive apprenticeship** ([Collins, Brown & Newman, 1989](references.md#ref-collins-1989)) runs through *modelling → coaching → scaffolding → fading → articulation → reflection → exploration*.
- **Faded worked examples.** [Renkl & Atkinson (2003)](https://doi.org/10.1207/s15326985ep3801_3) and [Atkinson, Renkl & Merrill (2003)](https://doi.org/10.1037/0022-0663.95.4.774) showed that gradually removing solution steps from worked examples (*backward fading*) works better than jumping from examples to problems all at once.
- **Expertise-reversal effect.** [Kalyuga et al. (2003)](https://doi.org/10.1207/s15326985ep3801_4) showed that guidance which helps novices becomes *redundant and harmful* for more advanced students. **The level of help should therefore follow the learner's expertise in each skill.** A fixed "tutor mode" is too much for some skills and too little for others.
- **Contingent tutoring.** The rule *give more help after failure, less after success* goes back to observations of mothers helping their young children ([Wood & Middleton 1975](https://doi.org/10.1111/j.2044-8295.1975.tb01454.x)) and an experiment with four ways of teaching ([Wood, Wood & Middleton 1978](https://doi.org/10.1177/016502547800100203)). [Wood & Wood (1999)](https://doi.org/10.1016/s0360-1315%2899%2900030-5) built it into a computer tutor. The rule is simple to put into software, but the evidence that the contingency itself helps is weak:
    - a preregistered direct replication of the 1978 experiment, with 285 three-year-olds, did not find its effect on independent performance ([Smit et al. 2025](https://doi.org/10.1037/edu0000965));
    - in a meta-analysis of computer-based scaffolding in STEM, scaffolding helped (ḡ = 0.46 over 144 studies), but the effect did not depend on whether or how the scaffolding changed over time ([Belland et al. 2017](https://doi.org/10.3102/0034654316670999));
    - in a classroom experiment, contingent support only helped when students had first worked on their own for longer ([van de Pol et al. 2015](https://doi.org/10.1007/s11251-015-9351-z)).

    So help in steps is well supported; that it must follow every success and failure is not.

The harness's levels and hints per skill build on this section; see the [design principles](design.md#211-synthesis-design-principles).

## 2.4 Mastery, skill acquisition stages and when to automate

- **Stages of skill acquisition.** [Fitts & Posner (1967)](references.md#ref-fitts-1967) proposed cognitive → associative → autonomous stages. [Anderson (1982)](https://doi.org/10.1037/0033-295x.89.4.369) formalized this as declarative knowledge compiled into procedures. [Dreyfus & Dreyfus (1980)](https://doi.org/10.21236/ada084551) described novice → advanced beginner → competent → proficient → expert. Once a skill is *autonomous*, it no longer needs conscious attention. **That is the natural moment to hand it to automation:** cognitive resources are then free for the next skill, and the learner still has the competence to *supervise* the automation.
- **Mastery learning.** [Bloom](references.md#ref-bloom-1968) (1968, 1984) proposed that students move on only after showing mastery (≈ 80–90% on a criterion test).
    - **Course exams:** a meta-analysis of 108 evaluations found positive effects, strongest for weaker students ([Kulik, Kulik & Bangert-Drowns, 1990](https://doi.org/10.2307/1170612)).
    - **Standardized tests:** effects are essentially zero, a point Kulik et al. accepted ([Slavin, 1987](https://doi.org/10.3102/00346543057002175), 1990).
    - **Cost:** mastery gates take time and reduce coverage.

    Both points matter. The gains show up on narrow tests aligned with the course, which a course exam is. A strict mastery gate trades coverage for depth.

- **The "2 sigma" claim does not hold.** Bloom's (1984) two-standard-deviation effect of one-to-one tutoring rested on two three-week dissertation studies with narrow tests. About half of it came from the mastery tests and corrective feedback, not from tutoring itself ([von Hippel, 2024](https://www.educationnext.org/two-sigma-tutoring-separating-science-fiction-from-science-fact/)). Better estimates:
    - human tutoring d ≈ 0.79 and intelligent tutoring systems d ≈ 0.76 ([VanLehn, 2011](https://doi.org/10.1080/00461520.2011.611369));
    - tutoring programmes about 0.29 SD ([Nickow, Oreopoulos & Quan, 2024](https://doi.org/10.3102/00028312231208687));
    - tutoring systems a median 0.66 SD, much larger on locally made tests than on standardized ones ([Kulik & Fletcher, 2016](https://doi.org/10.3102/0034654315581420)).

    A realistic expectation for an AI tutor is a fraction of a standard deviation, not two.

- **Knowledge tracing.** [Corbett & Anderson (1994)](https://doi.org/10.1007/bf01099821) modelled the probability that a skill is known, updating it after each attempt, and declared mastery at P(known) ≥ 0.95. [Anderson et al. (1995)](https://doi.org/10.1207/s15327809jls0402_2) and [VanLehn (2011)](https://doi.org/10.1080/00461520.2011.611369) showed that step-based intelligent tutoring comes close to the effectiveness of human tutoring.
- **Deliberate practice.** [Ericsson, Krampe & Tesch-Römer (1993)](https://doi.org/10.1037/0033-295x.100.3.363) identified effortful practice on specific weaknesses, with immediate feedback, as the engine of expertise. Practice in easy "autopilot" mode does not have the same effect. The evidence supports this as a principle of practice *quality*. It does not show that the amount of practice explains most differences between people:
    - **Variance explained:** deliberate practice explained 26% in games, 21% in music, 18% in sports, 4% in education and under 1% in professions ([Macnamara, Hambrick & Oswald, 2014](https://doi.org/10.1177/0956797614535810)).
    - **Replication:** a direct replication of the original study failed ([Macnamara & Maitra, 2019](https://doi.org/10.1098/rsos.190327)).
    - **Counter-claim:** [Ericsson & Harwell (2019)](https://doi.org/10.3389/fpsyg.2019.02396) report higher shares when they keep only studies that match the original definition.
- **Overlearning** (practice beyond first mastery) improves retention, but the benefit fades over time ([Driskell, Willis & Copper, 1992](https://doi.org/10.1037/0021-9010.77.5.615)). *Spacing* is a more efficient use of extra practice ([Rohrer et al., 2005](https://doi.org/10.1002/acp.1083)).

## 2.5 Retention after mastery: spacing, retrieval and skill decay

- **Forgetting** follows a steep curve that slows over time (Ebbinghaus, 1885).
- **Spacing effect.** [Cepeda et al. (2006)](https://doi.org/10.1037/0033-2909.132.3.354) reviewed 317 experiments: practice spread out over time beats massed practice. [Cepeda et al. (2008)](https://doi.org/10.1111/j.1467-9280.2008.02209.x) found that the optimal gap grows with the retention interval but shrinks as a share of it, from about **20–40% of a one-week** test delay to about **5–10% of a one-year** delay. For an exam about ten weeks away, this points to gaps of one to two weeks between reviews of a learned skill. The study used trivia facts with a single review, so applying it to programming skill is an extrapolation. [Kang (2016)](https://doi.org/10.1177/2372732215624708) reviewed spacing as a practical, efficient strategy.
- **Expanding intervals are not proven better.**
    - **Spaced vs. massed:** spaced retrieval beats massed retrieval (g = 0.74).
    - **Expanding vs. equal:** expanding schedules did not beat equal spacing (g = 0.034, not significant). They gain only when items are retrieved many times ([Latimier, Peyre & Ramus, 2021](https://doi.org/10.1007/s10648-020-09572-8)).
    - **First retrieval:** what matters most is delaying the first retrieval ([Karpicke & Roediger, 2007](https://doi.org/10.1037/0278-7393.33.4.704)).
    - **During training:** expanding and equal spacing tie on a test eight weeks later, but expanding keeps recall much higher during the training period ([Kang et al., 2014](https://doi.org/10.3758/s13423-014-0636-z)).

    So an expanding schedule is defensible because it keeps early reviews successful, but growing intervals are not proven superior.

- **Retrieval practice (the testing effect).** Retrieving from memory beats re-studying ([Roediger & Karpicke, 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x); [Karpicke & Roediger, 2008](https://doi.org/10.1126/science.1152408)). Meta-analyses: [Adesope, Trevisan & Sundararajan (2017)](https://doi.org/10.3102/0034654316689306); for spaced retrieval specifically, [Latimier, Peyre & Ramus (2021)](https://doi.org/10.1007/s10648-020-09572-8). [Dunlosky et al. (2013)](https://doi.org/10.1177/1529100612453266) rated practice testing and distributed practice the two *highest-utility* learning techniques.
- **Interleaving** (mixing problem types) improves the ability to *choose* the right strategy ([Rohrer & Taylor, 2007](https://doi.org/10.1007/s11251-007-9015-8)). A meta-analysis found g = 0.42, largest when the categories are similar ([Brunmair & Richter, 2019](https://doi.org/10.1037/bul0000209)). There is no randomized trial in programming yet. Choosing is central to OOD, where the hard part is knowing *which* pattern or principle applies. Students judge interleaving as harder and wrongly believe they learn less from it ([Samani & Pan, 2021](https://doi.org/10.1038/s41539-021-00110-x)), so a review session that feels worse is not evidence that it works worse.
- **Skill decay.** [Arthur et al. (1998)](https://doi.org/10.1207/s15327043hup1101_3) meta-analysed 53 articles.
    - **Over time:** skill loss grew from d ≈ −0.01 right after training to d ≈ −1.4 after more than a year of non-use.
    - **By task type:** **cognitive, artificial and accuracy-based tasks decay faster** than physical, natural and speed-based ones.
    - **Retrieval conditions:** retention tests under conditions similar to training showed less loss.
    - **Newer estimate:** a 2025 meta-analysis of procedural skills found half of the initial accuracy gains lost after about 6.5 months ([Tatel & Ackerman, 2025](https://doi.org/10.1037/bul0000481)).

    Writing correct code from memory, for example in C#, falls in the fast-decaying class.

- **Adaptive scheduling.** The Leitner system ([Leitner, 1972](references.md#ref-leitner-1972)) and half-life regression ([Settles & Meeder, 2016](https://doi.org/10.18653/v1/p16-1174), from Duolingo) set review intervals adaptively from success history.

For the review schedule the harness uses, see [spaced reinforcement after mastery](design.md#57-spaced-reinforcement-after-mastery).

## 2.6 Practice conditions and transfer to the test

How and where students practise affects how well a skill carries over to the exam. This section looks at two conditions: timed practice without help, and practice in the IDE that the exam uses. The literature supports attention to both, with one correction about what matters most.

!!! example "Example: one student's situation"
    A second-year HBO-ICT student practised OOD in Visual Studio, with AI available. A diagnostic test at CHE was in Rider, timed and without AI. The student's own analysis named the practice conditions as a main cause of the result: there had been no timed practice without help, and the test was in a different IDE.

- **Transfer-appropriate processing.** Performance depends on how well the processing during practice matches the processing at the test ([Morris, Bransford & Franks, 1977](https://doi.org/10.1016/S0022-5371%2877%2980016-9); see also encoding specificity, [Tulving & Thomson, 1973](https://doi.org/10.1037/h0020071)). Practice in the test's format transfers better:
    - **Classroom quizzing:** g ≈ 0.50, moderated by how consistent the practice format is with the test format ([Yang et al., 2021](https://doi.org/10.1037/bul0000309)).
    - **Test-enhanced learning:** it transfers with d ≈ 0.40, mostly across formats and to application questions. Once publication bias is corrected, there is hardly any transfer without those supporting conditions ([Pan & Rickard, 2018](https://doi.org/10.1037/bul0000151)).
- **The room matters less than the task.** Effects of the physical environment are reliable but modest (d ≈ 0.28; [Smith & Vela, 2001](https://doi.org/10.3758/BF03196157), as summarised by [Smith et al., 2014](https://doi.org/10.1080/09658211.2013.800553)), and the classic underwater study failed to replicate ([Murre, 2021](https://doi.org/10.1098/rsos.200724)). An IDE is not background context, though. Creating classes, running tests and reading compiler output in the exam's IDE are part of the procedure being tested.
- **Stress and stakes.** Retrieval practice protected recall against acute stress in one study ([Smith, Floerke & Thomas, 2016](https://doi.org/10.1126/science.aah5067)), with mixed follow-ups. High-stakes quizzes *during learning* removed the benefit of retrieval practice ([Hinze & Rapp, 2014](https://doi.org/10.1002/acp.3032)). Training under stress improves performance under stress and carries over to new stressors and tasks ([Saunders et al., 1996](https://doi.org/10.1037/1076-8998.1.2.170); [Driskell, Johnston & Salas, 2001](https://doi.org/10.1518/001872001775992471)).
- **What follows.** Learning at low stakes, with hints, comes first. In the last weeks before an exam come timed sessions without AI in the exam's IDE, from short sessions up to full mock exams. No study has measured the cost of an unfamiliar IDE specifically, so this is an inference from the principles above.

## 2.7 Reflection, learning journals and self-regulation

- **Self-regulated learning (SRL).** [Zimmerman (2002)](https://doi.org/10.1207/s15430421tip4102_2) described a cycle of *forethought → performance → self-reflection*. Students who plan, monitor and reflect learn more.
- **Writing learning protocols.** [Nückles, Hübner & Renkl (2009)](https://doi.org/10.1016/j.learninstruc.2008.05.002) showed that journal writing with **cognitive and metacognitive prompts** improves learning outcomes. [Nückles et al. (2020)](https://doi.org/10.1007/s10648-020-09541-1) refined this into a self-regulation account of writing-to-learn. [Moon (2006)](references.md#ref-moon-2006) gives practical guidance on learning journals. [Schön (1983)](references.md#ref-schon-1983) and [Boud, Keogh & Walker (1985)](references.md#ref-boud-1985) laid the foundations of reflective practice.
- **Feedback** is among the stronger influences on learning, especially when it is rich in information and addresses the task, the process and self-regulation rather than the person ([Hattie & Timperley, 2007](https://doi.org/10.3102/003465430298487); [Shute, 2008](https://doi.org/10.3102/0034654307313795)).
    - **Average effect:** the newer meta-analytic estimate is d = 0.48 (95% CI 0.44–0.51) ([Wisniewski, Zierer & Hattie, 2020](https://doi.org/10.3389/fpsyg.2019.03087)).
    - **By feedback type:** high-information feedback reaches d ≈ 0.99, praise or rewards d ≈ 0.24 (same source).
    - **Harm:** over a third of feedback interventions made performance *worse* ([Kluger & DeNisi, 1996](https://doi.org/10.1037/0033-2909.119.2.254)).

    Positive feedback should therefore name the specific skill and strategy that worked, not praise the person. **Learning from errors** works best when the errors are corrected and reflected on ([Metcalfe, 2017](https://doi.org/10.1146/annurev-psych-010416-044022)).

- **Self-determination theory.** [Ryan & Deci (2000)](https://doi.org/10.1037/0003-066x.55.1.68) showed that autonomy, competence and relatedness sustain motivation. A learning tool that learners configure themselves, and that makes their progress visible, supports autonomy and competence. One that nags and blocks them arbitrarily undermines both.

**Implication for AI-supported learning journals:** the *facts* can be logged automatically (skills practised, hints used, test results). The *reflection* has to be **written by the learner**, prompted with specific questions. A reflection written by the AI loses the generation effect ([Slamecka & Graf, 1978](https://doi.org/10.1037/0278-7393.4.6.592); [Bertsch et al., 2007](https://doi.org/10.3758/bf03193441)) and the benefit of writing to learn ([Nückles et al., 2009](https://doi.org/10.1016/j.learninstruc.2008.05.002)). [Fan et al. (2025)](https://doi.org/10.1111/bjet.13544) are often cited here, but they did not study AI-written reflections. They found that ChatGPT support improved an essay without improving knowledge gain or transfer, and *interpreted* that as metacognitive laziness.

## 2.8 Generative AI and learning to program: the evidence so far

**Capabilities and early framing.** By 2022 LLMs could already solve typical CS1 exam problems ([Finnie-Ansley et al., 2022](https://doi.org/10.1145/3511861.3511863)). [Becker et al. (2023)](https://doi.org/10.1145/3545945.3569759) and [Denny et al. (2024)](https://doi.org/10.1145/3624720) argued that this changes what computing education must teach. The ITiCSE working group of [Prather et al. (2023)](https://doi.org/10.1145/3623762.3633499) surveyed students and instructors. [Lau & Guo (2023)](https://doi.org/10.1145/3568813.3600138) documented instructor attitudes ranging from "ban it" to "resistance is futile". [Zastudil et al. (2023)](https://doi.org/10.1109/fie58773.2023.10343467) found that students and instructors both worried about over-reliance.

By 2026, five current models scored above the average student on the tests and exam tasks of an introductory university OOP course: ChatGPT-5.2, DeepSeek-V3, Gemini 2.5 Flash, Claude Sonnet 4.5 and M365 Copilot. They often got full marks on the longer tasks. They still sometimes produced code that did not compile, and they **struggled with interfaces, abstract classes and some inheritance tasks** ([Lepp & Kaimre, 2026](https://arxiv.org/abs/2608.16318), preprint). Those are core OOD constructs, so relying on AI there means relying on it where it is least reliable.

**Studies of AI and novice programmers** (grades as in §2.0):

| Study | Design | Key finding | Grade |
|---|---|---|---|
| [Kazemitabaar et al. (2023)](https://arxiv.org/abs/2302.07427), CHI | Randomized; 69 novices aged 10–17; Codex vs. none; retention test after a week | Better code authoring with Codex, less frustration. **No significant difference in one-week retention**; the Codex group did slightly better. Students with more prior experience benefited more. | A (small) |
| [Kazemitabaar et al. (2023b)](https://arxiv.org/abs/2309.14049), Koli Calling | Observational; only the 33 students who had Codex | Copy-pasting whole tasks went with worse retention, and writing code first and then asking AI went with better retention. **These were trends, not significant.** | C |
| [Prather et al. (2024b)](https://doi.org/10.1145/3617367), TOCHI | Qualitative; novices using Copilot | New metacognitive difficulties: being "drawn in" by suggestions, losing their own plan. | C |
| [Prather et al. (2024)](https://arxiv.org/abs/2405.17739), ICER "Widening Gap" | Qualitative lab study; 21 novices; observation, eye tracking, interviews | Strong students accelerated, weak students were derailed. **Illusion of competence.** | C |
| [Margulieux et al. (2024)](https://doi.org/10.1145/3649217.3653621), ITiCSE | Observational; novices with LLMs | Self-regulation, self-efficacy and fear of failure shaped *how* students used LLMs. | C |
| [Kazemitabaar et al. (2024)](https://arxiv.org/abs/2401.11314), CHI: CodeAid | Deployment; 700 students, 12 weeks; tool withholds full solutions | Educators valued the pedagogical design. Risks: occasional wrong feedback, and **students defaulting to ChatGPT** for direct answers. | C |
| [Liffiton et al. (2023)](https://doi.org/10.1145/3631802.3631830): CodeHelp | Deployment; guardrailed LLM help in classes | Guardrails (no code solutions) were feasible at scale and well received. | C |
| [Liu et al. (2024)](https://doi.org/10.1145/3626253.3635427): CS50 "duck" | Deployment; AI tutor in Harvard CS50 | A pedagogically constrained AI tutor ran at scale; students reported it as helpful. | C |
| [Lyu et al. (2024)](https://doi.org/10.1145/3657604.3662036): CodeTutor | Semester field study; 50 students; **not randomized** (researchers assigned the groups) | Scores rose within both groups, but there was no direct test between them. Critical thinking and prompt quality mattered. | C |
| [Jošt, Taneski & Karakatič (2024)](https://doi.org/10.3390/app14104115) | Correlational; 32 students over 10 weeks; no control group | Heavier LLM reliance went with **lower** grades. | C |
| [Hellas et al. (2023)](https://doi.org/10.1145/3568813.3600139), ICER | Analysis of LLM answers to novice help requests | Often helpful, but **frequently included incorrect** content or full solutions. | C |
| [Leinonen et al. (2023)](https://doi.org/10.1145/3545945.3569770); [Sarsa et al. (2022)](https://doi.org/10.1145/3501385.3543957) | LLM error explanations and exercise generation | Useful as *generators* of explanations and exercises, a good role for AI. | C |
| [Denny et al. (2024b)](https://doi.org/10.1145/3626252.3630909): Prompt Problems | New exercise type | Students learn to specify problems precisely for AI, a new skill worth practising. | C |
| [Kazemitabaar et al. (2025)](https://doi.org/10.1145/3708359.3712104), IUI | Randomized; 82 between-subjects, then 42 within-subjects; seven ways to engage with AI-generated code | The best technique walks students through the problem step by step and asks what each stage needs *before* revealing the code. Engaging techniques beat passive viewing. | B |
| [Gardella et al. (2026)](https://arxiv.org/abs/2604.18538), ICER | Within-subjects; 22 CS2/CS3 students; Copilot vs. a human pair, 20 min each; solo retest without AI a week later | With Copilot, performance rose 14 points (g = 0.99) and workload fell. From the session to the retest, scores dropped 18.9 points more after the Copilot trial (g = −1.13, p_adj = .054). The absolute retest difference was not significant. | A (small) |
| [Barth et al. (2026)](https://doi.org/10.1145/3765964.3811656), ICER | Preregistered crossover; 1,059 CS1 students over six weeks | Steering the tutor's pedagogy through system prompts (self-regulation or ICAP scaffolds) made **no difference** on any preregistered outcome. The authors conclude that tutor pedagogy "may not be easily steered by system prompts alone". | A |
| [Pădurean et al. (2026)](https://arxiv.org/abs/2607.05068), ICER | Log study; 917 CS1 students, 2,636 sessions; realistic bugs injected into AI-generated solutions | Injected bugs made students edit and repair the code itself, with more success on the next attempt. Natural prompt failures made them reword the prompt instead. | C |
| [Prather et al. (2026)](https://doi.org/10.1145/3765964.3811654), ICER: "Scaffolding Autocomplete" | An exercise that trains telling good from bad AI suggestions | Students did better with one suggestion than with several. Sample and design not verified. | C |
| [Ardic, Le Dilavrec & Zaidman (2026)](https://doi.org/10.1007/s10664-026-10898-0), *Empirical Software Engineering* | Observational; 12 students using ChatGPT (GPT-3.5) to write unit tests | Four strategies, depending on who had the test idea and who wrote the code. Students saved time but trusted the tests less and felt less ownership. | C |
| [Sankaranarayanan (2026)](https://arxiv.org/abs/2602.20206), preprint, February | 78 online learners; manual vs. unrestricted AI vs. AI behind an "explanation gate" (teach-back), in Cursor | Both AI arms produced more working code. On a later 30-minute maintenance task with AI blacked out, **77% failed after unrestricted AI vs. 39% after the explanation gate**. Randomization not stated. | C |
| [Bergh, Tag, Vassar & Renzella (2026)](https://arxiv.org/abs/2609.21194), preprint, September | Controlled between-subjects experiment; 55 CS undergraduates; three C tasks with ChatGPT vs. web search; recall quizzes right after and 48 hours later | With ChatGPT, coding scores were higher (89% vs. 69%), but **recall was lower** right away (41% vs. 53%) and after 48 hours (39% vs. 52%). Students credited themselves with 45% of their submitted code, against 81% without ChatGPT. Mental effort rose less across the tasks. Randomization not stated in the abstract. | B |
| [Albadarin (2026)](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html), doctoral dissertation, University of Eastern Finland | Quasi-experimental; 152 university students; programming and debugging with Llama 3.1 vs. without AI; retention test seven weeks later | The AI group was better and faster on some debugging tasks, but **the group without AI retained more after seven weeks**. Figures from a university Q&A (10 Nov 2026); scores and effect sizes not yet seen. | B |
| [Lepp (2026)](https://arxiv.org/abs/2607.24755), FIE, preprint | Survey; 210 first-year students in an OOP course where AI was allowed for coursework and banned in assessments; cluster analysis | Five usage profiles, including a "smart" one (little code generation, much conceptual and debugging help). **No significant difference in assessment scores** between the profiles. | C |

**Studies of AI and learning in general**, strongest designs first:

- **[Bastani et al. (2025)](https://doi.org/10.1073/pnas.2422633122), PNAS.** *Grade A.* Randomized by classroom; about 1,000 students in grades 9–11 at one Turkish high school.
    - **GPT Base** (unrestricted): +48% in practice, but **−17% on the exam** after access was removed.
    - **GPT Tutor** (hints, guardrails): +127% in practice and no exam harm (−0.004, not significant).

    Students used the unrestricted tool "as a crutch".

- **Maryland trial ([Liu et al., 2026](https://doi.org/10.26300/y3f8-vh05); working paper).** *Grade A, not peer reviewed.*
    - **Design:** randomized by instructor; 2,379 undergraduates and 30 instructors. A GPT-4o tutor was built into the course, mostly in direct-answer mode, and both arms also had ChatGPT and Gemini. Only about 15% of students used the tutor.
    - **Grades:** final grades fell by **0.37 SD** in comparisons within the same course. Across the full sample the drop was not significant.
    - **Engagement:** recorded participation fell by 0.90 SD.
    - **Equity:** first-generation students lost more (−0.50 vs. −0.22 SD).
    - **Use:** 73.8% of requests sought information, explanations or solutions; 0.7% asked for feedback on the student's own work.
- **Middlebury trial ([Contractor & Reyes, 2026](https://arxiv.org/abs/2607.08849); working paper).** *Grade A, not peer reviewed; one short task.*
    - **Design:** randomized and proctored; 211 undergraduates had a 35-minute learning phase on an unfamiliar topic, and then took all tests without AI.
    - **Result:** ChatGPT access **raised** AI-free test scores by 0.28 SD, and by about 0.21 SD a week later (p = 0.068).
    - **Use type:** students who used it like a tutor gained, while students who let it write for them lost their essay advantage once AI was removed. That split is self-selected.
    - **Caveats:** not programming; figures from the arXiv HTML version.
- **Mastery-practice trial ([Oreopoulos, Liut, Sungu & Low, 2026](https://doi.org/10.26300/01qv-6c22); working paper; middle school).** *Grade A, K-12.* Individually randomized; over 6,000 students. A guard-railed tutor improved a one-week test by only **3.1 percentage points (p = 0.065)**, and only inside a mastery workflow. Mastery alone did not improve delayed learning. One author is a co-author of Bastani et al.
- **[Darvishi et al. (2024)](https://doi.org/10.1016/j.compedu.2023.104967), Computers & Education.** *Grade A.* Randomized; 1,625 students in 10 courses. Students leaned on AI assistance in peer feedback, and their own performance dropped when it was removed. Self-regulation strategies helped them keep agency.
- **[Shen & Tamkin (2026)](https://arxiv.org/abs/2601.20245), arXiv preprint (Anthropic Fellows).** *Grade A for the main effect, C for the patterns.*
    - **Design:** randomized; 52 mostly professional or freelance developers (aged about 25–35, recruited through a crowdworker platform) learned the asynchronous Python library Trio, with or without a GPT-4o-based assistant.
    - **Result:** the AI group scored **50% vs. 67%** on the follow-up quiz (d = 0.74, p = 0.01), with the largest gap on debugging. It was only about two minutes faster, which was not significant. The paper calls the gap "17%"; its own numbers give 15.4 points.
    - **Patterns:** the six interaction patterns with cognitive engagement (asking conceptual questions; generating code, then checking understanding) scored 65–86%, against 24–39% for delegation. **The patterns were identified afterwards from screen recordings, with 2–7 people each, so they are correlational.** Stronger or more motivated participants may simply choose them.
    - **Vendor:** a vendor study, but its result runs against the vendor's commercial interest.
- **[Lehmann, Cornelius & Sting (2025)](https://arxiv.org/abs/2409.09047), arXiv preprint, still unpublished.** *Grade A for the null effect, C for the rest.*
    - **Design:** a field study (observational) plus two preregistered lab experiments in which only LLM access was randomized.
    - **Average effect:** **neither lab experiment found an average effect on learning** (n = 107 and n = 69).
    - **Solutions vs. explanations:** the contrast between asking for solutions (breadth without depth) and asking for explanations (depth) comes from the observational data.
    - **"Widening gap":** the gap between students with low and high prior knowledge is an **exploratory** median split (pooled n = 176, interaction p = 0.028).
- **[Fan et al. (2025)](https://doi.org/10.1111/bjet.13544), BJET, "metacognitive laziness".** *Grade B.* Lab experiment, 117 students in four conditions: ChatGPT, a human expert, writing analytics, nothing. ChatGPT improved the essay *product* most, but knowledge gain and transfer did not differ. "Metacognitive laziness" is the authors' interpretation, not a measured outcome.
- **[Stadler, Bannert & Sailer (2024)](https://doi.org/10.1016/j.chb.2024.108386), Computers in Human Behavior.** *Grade B.* Randomized; 91 students; ChatGPT-3.5 vs. Google search. LLMs reduced mental effort during scientific inquiry, but the reasoning was less deep.
- **[Kestin et al. (2025)](https://doi.org/10.1038/s41598-025-97652-6), Scientific Reports.** *Grade B, short-term only.* Two-week crossover in a Harvard physics course; 194 of 233 students analysed. An AI tutor built on pedagogical best practice beat in-class active learning (0.73–1.3 SD) in less time (median 49 vs. about 60 minutes). Limits:
    - the post-test came **right after each lesson, with no retention test**;
    - the tutor was used at home;
    - it relied on pre-written answers.
- **MBA field experiment ([Yang, Van Alstyne & Dellarocas, 2026](https://arxiv.org/abs/2609.23958); preprint).** *Grade B.* Preregistered; 86 students. A structured tutor grounded in the course beat freely available consumer AI by 6.63 points (p = .007).
- **"Generative AI learning penalty" ([Strömberg, Lei & Wu, 2026](https://doi.org/10.2139/ssrn.6977138); CEPR working paper).** *Grade B, quasi-experimental, not higher education.* Difference-in-differences on 26,811 secondary-school students in China. After AI adoption, homework scores rose 18% while closed-book exam scores fell about 20% within six months. About 80% of users showed signs of outsourcing their homework.
- **AI tutors over-help ([Teo et al., 2026](https://arxiv.org/abs/2607.21306); preprint).** *Grade C.* In simulations, LLM "teachers" step in earlier and more often than human teachers, and hand out complete solutions instead of targeted hints.
- **[Kosmyna et al. (2025)](https://arxiv.org/abs/2506.08872), arXiv preprint, not peer reviewed.** *Grade C.* 54 participants, only 18 in the fourth session. In an essay task, the LLM group showed the lowest EEG connectivity, the lowest sense of ownership and poor recall of their own essays ("cognitive debt"). A formal methodological critique exists ([Stanković et al., 2026](https://arxiv.org/abs/2601.00856)).
- **[Gerlich (2025)](https://doi.org/10.3390/soc15010006), Societies; [Lee et al. (2025)](https://doi.org/10.1145/3706598.3713778), CHI.** *Grade C.* Both correlational:
    - Gerlich: a survey of 666 people, with a published correction to a table.
    - Lee et al.: a self-report survey of 319 knowledge workers (936 examples), by Microsoft authors.

    Heavier AI use and more trust in AI go with less critical-thinking effort. For knowledge workers, critical thinking shifts towards checking output.

- **[Anthropic (2025a)](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude), Education Report.** *Grade C, vendor data.* 574,740 student conversations; **≈ 47% were "direct"**, meaning the student wanted the answer with minimal engagement. Students also delegated higher-order tasks such as creating and analysing. Computer science made up 36.8% of conversations (38.6% in the body of the report), against 5.4% of US degrees.

**Productivity is not learning.**

- **[Peng et al. (2023)](https://arxiv.org/abs/2302.06590):** developers were 55.8% faster with Copilot (95% CI 21–89%) on one well-specified greenfield task. 95 were recruited and 35 per group completed. Preprint, by GitHub and Microsoft authors.
- **METR ([Becker et al., 2025](https://arxiv.org/abs/2507.09089)):** 16 experienced open-source developers, working on 246 of their own tasks, were **19% slower** with early-2025 tools (CI +2% to +39%). They had forecast a 24% speed-up and afterwards believed it had been 20%.
- **METR follow-up (February 2026):** 57 developers and over 800 tasks gave estimated speed-ups of 18% and 4%, both with intervals that include zero. METR calls the data unreliable, because 30–50% of the developers held back tasks they did not want to do without AI, and is redesigning the study.

Perceived and actual gains can diverge, even for experts.

**Meta-analyses and evidence reviews.**

- **The most rigorous meta-analysis** ([Boolzen et al., 2026](https://doi.org/10.1007/s10462-026-11665-9), *Artificial Intelligence Review*, preregistered) pooled 49 studies of AI in STEM education:
    - the uncorrected g = 0.84 falls to **0.08 after correcting for publication bias**;
    - none of the 34 randomized trials had low risk of bias;
    - 33 studies showed large effects only because the two groups did different cognitive work;
    - AI helped when it augmented the student's activity and could harm when it replaced it.
- **Uncorrected meta-analyses.** Two other 2026 meta-analyses report g = 0.50 and g = 1.10 without bias correction ([Fan, Ke, Chen & Lv, 2026](https://doi.org/10.3389/fpsyg.2026.1758670); [Liu, Xie & Xu, 2026](https://doi.org/10.3389/fpsyg.2026.1848745)). The most-cited 2025 meta-analysis (Wang & Fan, g = 0.87) **was retracted in 2026** after a critique of its methods; it had been cited more than 500 times. *Uncorrected pooled effects should not be cited as evidence that AI improves learning.*
- **An independent audit** ([O'Neill, 2026](https://hechingerreport.org/proof-points-ai-education-meta-analysis/), EdArXiv preprint) of 14 of the 39 meta-analyses that reported positive effects found "impossible statistics", "hallucinated references", comparisons of AI-supported study with no study at all, and no correction for publication bias. Two-thirds of the calls for papers seemed to discourage null or negative results. His preliminary pooling of 44 well-designed experiments averaged out to roughly zero. *Preliminary; known from press coverage, the preprint itself was not read.*
- **Stanford SCALE evidence review (Walker, Fesler, Martinez Claeys, Agnew & Loeb, 10 November 2026).** *A screened synthesis, not a meta-analysis.* An LLM pre-screened 868 papers from October 2025 to June 2026 on What Works Clearinghouse criteria, and at least two researchers reviewed each causal paper. 52 papers now meet its bar for strong causal evidence, 32 of them new. Despite the "K-12" title, most new papers come from higher education, and most of the repository is unreviewed preprints. Its conclusions:
    - AI "appears to be better for learning when students use it for learning support than when they use it for producing work, although neither type of use consistently improves learning";
    - outsourcing work to AI can lower performance when students later work without it;
    - AI can improve the learning *experience* without improving learning outcomes;
    - the evidence "still does not show whether AI tools can produce long-term learning gains".

**Assignments overstate mastery.**

- **[Đức Minh (2026)](https://doi.org/10.32674/nrmwyw65):** *grade C, observational.* In 1,498 Vietnamese undergraduates, AI-assisted assignments averaged 7.62, while mastery checked at random without devices averaged 5.55.
- **[Eleftheriou, Pallis & Constantinides (2026)](https://arxiv.org/abs/2604.09444):** *grade B; April 2026; n = 85.* A standard LLM gave the highest *perceived* understanding and the lowest *measured* learning, and guided hints gave the largest gains.

**Vendor "learning modes".** Several products build pedagogy into the model's behaviour:

- Claude Code's *Learning* output style, with `TODO(human)` markers;
- OpenAI's ChatGPT study mode (July 2025);
- Google's Guided Learning in Gemini (August 2025); LearnLM is no longer a separate model.

All are **opt-in and easy to switch off**, none tracks mastery per skill, and **no evaluation of their learning outcomes** was found.

**Agentic tools and OOD: an evidence vacuum.** No controlled study yet measures student learning with Claude Code, Cursor, Copilot agent mode or Codex. No study measures design skill without AI after AI-assisted practice; the one UML experiment (EDULEARN26) measured performance and perceptions only *with* ChatGPT. Everything this review says about agentic tools is extrapolated from chat and autocomplete studies.

**What the evidence supports, and how strongly:**

- **Strong (several grade-A studies agree): performance with AI is not learning.** When AI does the cognitive work during practice, performance without AI later is the same or lower (Bastani; Liu; Gardella; Strömberg; and at grade B, Bergh after 48 hours and Albadarin after seven weeks). When AI explains or tutors, results range from no harm to modest gains (Bastani's tutor; Contractor & Reyes; [Kazemitabaar 2023](https://arxiv.org/abs/2302.07427)). Boolzen's moderator, augment vs. substitute, says the same, and so does the Stanford SCALE review of 52 causal studies.
- **Moderate: guardrails work when they are enforced in the workflow** (mastery gates, explanation gates, structured tutors, blocks outside the model), and much less when they are only asked for in a system prompt (Barth's null result; Teo's over-helping tutors).
- **Weak, correlational only: that specific interaction patterns cause better learning.** This covers asking for explanations and attempting first. In every study so far the student chose the pattern (Shen & Tamkin; Contractor & Reyes; [Kazemitabaar 2023b](https://arxiv.org/abs/2309.14049)). No randomized trial has compared attempt-first with AI-first. The pattern idea is the best working hypothesis, not a finding. It fits the experimental result that only explanation *without* the answer produced learning ([Gajos & Mamykina, 2022](https://doi.org/10.1145/3490099.3511138); §2.10). An observational OOP study adds a null: students with a "smart" usage profile did not score better on AI-free assessments than the other profiles ([Lepp, 2026](https://arxiv.org/abs/2607.24755)).
- **Equity: weaker and first-generation students are hurt more and use escape hatches more** (Liu; [Kapoor et al., 2025](https://arxiv.org/abs/2504.11146); Lehmann, exploratory; Prather, qualitative). **Guardrails matter most for the students least likely to choose them.**
- **Unknown or thin:** retention beyond about a week in higher education (so far one quasi-experiment, on debugging, with a seven-week test: [Albadarin, 2026](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html)), agentic tools, and design-level OOD skill.

For why the harness enforces its rules with hooks rather than a prompt, see the [design principles](design.md#211-synthesis-design-principles).

## 2.10 Automation, offloading, over-reliance and deskilling

- **Cognitive offloading.** People offload cognition to external tools when that is cheaper ([Risko & Gilbert, 2016](https://doi.org/10.1016/j.tics.2016.07.002)). Offloading does not only cost memory:
    - **Freed capacity:** saving information can free capacity for new material ("saving-enhanced memory"; [Storm & Stone, 2015](https://doi.org/10.1177/0956797614559285), with later replications).
    - **Parallel tasks:** it improves performance on a concurrent task ([Grinschgl et al., 2023](https://doi.org/10.3758/s13423-023-02312-3)).
    - **The cost:** it lowers memory for the offloaded content mainly when there is no explicit goal to learn it. An explicit goal almost cancels the cost ([Grinschgl, Papenmeier & Meyerhoff, 2021](https://doi.org/10.1177/17470218211008060)).

    That suggests where the line lies. Offloading what the learner does not need to learn, such as tooling and boilerplate, loses little. Offloading the skill being learned costs memory, unless the learning goal is explicit (attempt first, explain in the learner's own words).

- **The "Google effect" is contested.** [Sparrow, Liu & Wegner (2011)](https://doi.org/10.1126/science.1207745) reported that people remember *where* information is rather than the information itself.
    - **Failed replications:** their first experiment failed to replicate ([Camerer et al., 2018](https://doi.org/10.1038/s41562-018-0399-z); [Hesselmann, 2020](https://doi.org/10.7717/peerj.10325)).
    - **Never replicated:** the "where, not what" experiment has never been directly replicated.
    - **What did replicate:** saved information is remembered less, but only when the saving is experienced as reliable ([Schooler & Storm, 2021](https://doi.org/10.1080/09658211.2021.1962356)).

    An always-available AI tutor is exactly that reliable condition, which argues for deliberate practice without AI.

- **Ironies of automation.** [Bainbridge (1983)](https://doi.org/10.1016/0005-1098%2883%2990046-8) pointed out that automating the routine work removes the practice operators need to handle the rare hard cases. The more reliable the automation, the less able the human is to take over.
- **Complacency and automation bias.** [Parasuraman & Manzey (2010)](https://doi.org/10.1177/0018720810376055) showed that humans over-trust and under-monitor reliable automation. [Endsley & Kiris (1995)](https://doi.org/10.1518/001872095779064555) showed that *out-of-the-loop* operators lose situation awareness. [Parasuraman, Sheridan & Wickens (2000)](https://doi.org/10.1109/3468.844354) proposed choosing *levels of automation* for each function.
- **Forcing people to think first works, at a cost.**
    - **Deciding first:** designs that make people decide before they see the AI's answer, or that delay or hide the answer, reduce over-reliance compared with simply showing an explanation. Users rate them least favourably, and people high in need for cognition benefit most ([Buçinca, Malaya & Gajos, 2021](https://doi.org/10.1145/3449287); n = 199).
    - **Explanations alone:** they *increase* acceptance of AI advice whether it is right or wrong ([Bansal et al., 2021](https://doi.org/10.1145/3411764.3445717)), unless they make checking cheaper than doing the task ([Vasconcelos et al., 2023](https://doi.org/10.1145/3579605)).
    - **Learning:** this is the most important result for a tutor. In [Gajos & Mamykina (2022)](https://doi.org/10.1145/3490099.3511138), deciding first and then seeing the AI's recommendation improved decisions but produced **no learning**. Only an explanation *without* the answer, so that people had to reach the answer themselves, produced learning gains.
    - **Escape hatches get used:** in one course, 50% of 885 students used an optional "See Solution" button at least once. Low performers used it more, and more often close to deadlines ([Kapoor et al., 2025](https://arxiv.org/abs/2504.11146), preprint).
- **Deskilling in professional practice.** The first strong real-world signal comes from medicine. After routine use of AI-assisted colonoscopy, experienced endoscopists' adenoma detection rate *without* AI fell from 28.4% to 22.4% ([Budzyń et al., 2025](https://doi.org/10.1016/S2468-1253%2825%2900133-5); observational, 19 endoscopists in four Polish centres).
    - **No longitudinal software study:** for software developers there is no longitudinal study of skill decay yet.
    - **Anthropic's study of its own engineers:** 132 surveyed and 53 interviewed; a vendor source, and not anonymous. It reports self-reported Claude use rising from 28% to 59% of their work, and worries about skill atrophy. It names the **"paradox of supervision"**: checking AI output needs the very skills that delegating to it erodes ([Anthropic, 2025b](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic)).
    - **Juniors:** interviewees describe entry-level work being absorbed into seniors' AI workflows, so juniors lose the "productive struggle" through which expertise develops ([Yu & Moon, 2026](https://arxiv.org/abs/2607.17067); 14 interviews). §2.12 works this out for junior developers at work.
    - **For a student it is sharper:** an engineer has to *keep* supervision skills, a student has to *acquire* them. Medical educators call this "never-skilling" ([Abdulnour, Gin & Boscardin, 2025](https://doi.org/10.1056/NEJMra2503232)).

**Implication:** the evidence does not argue against automating a mastered skill, provided three conditions hold:

- **(a) Supervise:** the human keeps a *supervisory* role, reviewing, predicting and spot-checking AI output.
- **(b) Maintain:** the skill gets *periodic maintenance practice*, so the ability to supervise and take over does not decay.
- **(c) Train supervision itself:** supervision is a skill that has to be practised deliberately ([§2.9](skill-shift.md)). It comes neither from writing code by hand nor from delegating.

For how the harness builds these conditions into levels per skill, see the [design principles](design.md#211-synthesis-design-principles).

## 2.12 The eternal-junior problem

**The problem.** A junior developer who hands work to an agent before they can do it themselves gets the work done, but does not build the skills that make a medior or senior: debugging, reading code, design judgement and checking AI output. The output looks productive, so the gap stays hidden. Medical educators call the version for trainees "never-skilling" ([Abdulnour, Gin & Boscardin, 2025](https://doi.org/10.1056/NEJMra2503232)). This review calls it the **eternal-junior problem**. It is a different question from the one in [§2.9](skill-shift.md). That one asks whether juniors still get hired; this one asks whether the juniors who are hired still grow.

**Evidence that the mechanism is real.**

- **Experiment.** In a randomized trial with 52 mostly junior engineers learning a new library, the AI group scored 50% vs. 67% on a quiz afterwards. Those who delegated code generation scored below 40%; those who asked the AI conceptual questions scored 65% or more. The AI group was not significantly faster ([Shen & Tamkin, 2026](https://arxiv.org/abs/2601.20245); grade A for the main effect and C for the patterns, as in §2.8; short-term, vendor).
- **Interviews in software teams:**
    - Entry-level work is absorbed into seniors' AI workflows. Juniors lose the productive struggle through which expertise develops, and seniors and juniors see the situation differently ([Yu & Moon, 2026](https://arxiv.org/abs/2607.17067); 14 interviews; grade C).
    - Juniors swing "between over-reliance and cautious avoidance". Seniors steer the AI with skills they built before AI existed. What juniors may do with AI is set mainly by the policy of their organization ([Feng, Yun & Wang, 2026](https://doi.org/10.1145/3772318.3791642); 10 juniors and 10 seniors; grade C).
    - Anthropic's own engineers worry about skill atrophy and describe the "paradox of supervision" ([Anthropic, 2025b](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic); grade C, vendor; §2.10).
- **Other professions:**
    - **Robotic surgery.** Trainees got far less hands-on practice than in open surgery. Those who still became skilled did so through "shadow learning" outside the approved paths, which led to hyperspecialization and fewer experts ([Beane, 2019](https://doi.org/10.1177/0001839217751692); a two-year ethnography at five sites plus interviews at 13 teaching hospitals; grade C). [Beane (2024)](references.md#ref-beane-2024) generalizes this to intelligent technology at work: skill grows through challenge, complexity and connection with experts, and technology that is used to make experts more productive cuts into all three.
    - **Medicine.** Experienced endoscopists found fewer adenomas without AI after routine use with AI ([Budzyń et al., 2025](https://doi.org/10.1016/S2468-1253%2825%2900133-5); §2.10).
    - **Aviation.** Airline pilots supervise the autopilot most of the time. In a simulator study with 16 airline pilots, the skills of flying by hand were mostly retained. The cognitive skills of manual flight, such as tracking the aircraft's position, deciding the next step and recognizing failures, showed more frequent and larger problems, and these went together with mind-wandering while the automation flew ([Casner et al., 2014](https://doi.org/10.1177/0018720814535628); grade C). The FAA encourages airlines to give pilots opportunities to fly by hand, and to include manual flight in training and checks ([FAA, 2013](https://www.faa.gov/sites/faa.gov/files/other_visit/aviation_industry/airline_operators/airline_safety/SAFO13002.pdf), 2017; policy, grade D). Aviation delegates, and still has pilots fly by hand now and then. For software, it is the cognitive side (design, debugging, reading code) that matters most.

**Practitioners describe the same pattern (grade D).** Since 2024, engineers, managers and executives have described it in talks, interviews, news articles and blog posts. The quotes and links are in the [notes](../notes/eternal_junior.md#3-practitioner-sources-talks-interviews-news-and-blogs-grade-d).

- **Juniors who do not grow.** "The output looked senior. The understanding was still junior" (Scalzo, LeadDev 2026). AI removed the learning experiences of each rung of the career ladder: "The result is juniors who ship like mids but can't debug like them" (Allan, QCon London 2026). Juniors who skip the "hard way" "may plateau early" (Osmani, 2025). In a survey of the Pragmatic Engineer (2026), juniors get fewer tasks they could grow from.
- **The pipeline.** It takes "seven-plus years" to forge a competent engineer, and not training juniors is "cannibalizing our own future" (Majors, 2024). The CEO of AWS called replacing juniors with AI "the dumbest thing I've ever heard" (Garman, 2025). Two Microsoft leaders describe an "AI drag" on early-career developers and propose a preceptor programme with senior mentors (Russinovich & Hanselman, CACM 2026).
- **The Netherlands.** In a YouGov survey for the recruiter SThree (793 Dutch STEM professionals, 2026), four in ten say seniors now do work that used to go to juniors. The work through which juniors learn the trade is done more and more by AI (AG Connect, 2026).
- **Proposed remedies.** Trying a task alone for 15–30 minutes before asking the AI, a day a week without AI, a learning journal, and explaining the AI's solution in their own words (Osmani, 2025); AI-off sessions and "Explain the Machine" (Scalzo, 2026); "manage juniors for learning, not production" (Beck, 2025). These are proposals, not tested remedies.
- **Counter-voices.** Beck (2025) and Willison (2025) see AI as a patient tutor that speeds up learning, on one condition: do not outsource "the bits you need to learn" (Willison). Juniors adopt AI faster than seniors (Yegge, 2025). Juniors will adapt, and seniors who never grew are the bigger risk (Danjou, 2026). A Randstad director calls the drop in junior IT hiring mainly cyclical (AG Connect, 2026). In a vendor survey, 85% of juniors say AI improved their understanding, while 16% of seniors think juniors fully understand the AI code they submit (BairesDev, 2026).
- **Interests.** Many of these voices have a stake: AI vendors (AWS, Microsoft, GitHub, Google, Sourcegraph) and recruiters or staffing firms (SThree, Randstad). The vendors themselves also warn.

**Counter-evidence.**

- **AI can also teach on the job.** At a call centre with 5,172 agents, an AI assistant helped novices most. During outages of the AI, agents with three months of AI exposure still handled chats faster than before, but only those who had followed the AI's suggestions closely ([Brynjolfsson, Li & Raymond, 2025](https://doi.org/10.1093/qje/qjae044); grade B; the authors call the outage estimates noisy). There, the agents still did the work themselves and saw how customers responded. An agent that writes the code takes that part away.
- **The cost is real.** Juniors gain the most productivity from AI tools ([Cui et al., 2025](https://www.mertdemirer.com/Papers/Demirer_AI_productivity.pdf)). Every hour of practice by hand is an hour of slower output. The cost may be smallest while a skill is new: in [Shen & Tamkin (2026)](https://arxiv.org/abs/2601.20245), the AI group was not significantly faster while learning a new library.

**What a tool cannot supply.** Contact with experts, Beane's third condition, has to come from a mentor or a review by a senior. Whether a junior gets time to practise by hand depends on the team and its policy ([Feng, Yun & Wang, 2026](https://doi.org/10.1145/3772318.3791642); [Yu & Moon, 2026](https://arxiv.org/abs/2607.17067)).

**What is missing.** No study has followed juniors at work over time. No study measures the best mix of practice by hand and delegation ([§2.9](skill-shift.md)). The evidence from the workplace is qualitative, small and recent. A narrative review cannot show which trade-off between practice and delegation is best; only a trial can. The sources, with a link for every claim, are in the [notes on the eternal-junior problem](../notes/eternal_junior.md).

For the trade-off the harness proposes (build, delegate, maintain) and the trial that could test it, see [For junior developers](../for-juniors.md#the-trade-off) and [§6.1](index.md#61-invitation-to-researchers-a-randomized-trial).

## 2.13 Secure code as a first niche for juniors

**The problem.** A junior asks Claude Code for a search page that shows the user's search term back. The code compiles, the tests pass and the page works. Whether the search term is encoded before it goes into the HTML, the junior does not see, and that is exactly where AI code fails most often. Security adds a second gap to the one in §2.12: code that works but is not safe. This section asks whether secure coding is a good first niche for juniors who work with AI, and compares two angles: (A) junior developers who learn basic security at work, and (B) junior security specialists in a SOC, as a pentester or as an AppSec engineer. All sources in this section were checked against their primary source ([citation check](https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/research/citation-checks/citation_check_learning_science.md), section H).

**AI code is often insecure, especially when an agent builds a whole feature.**

- **Single snippets.** In security scenarios about 40% of Copilot's programs were vulnerable ([Pearce et al., 2022](https://doi.org/10.1109/SP46214.2022.9833571); evidence grade C). A replication in Python saw that share fall from 36.5% to 27.3% ([Majdinasab et al., 2024](https://doi.org/10.1109/SANER60148.2024.00051); C). In real GitHub projects, 29.5% of the Python snippets and 24.2% of the JavaScript snippets from AI assistants had a weakness, spread over 43 CWE types ([Fu et al., 2025](https://doi.org/10.1145/3716848); C).
- **Whole features.** In BaxBench the best model was correct and secure on 35% of the backend tasks ([Vero et al., 2025](https://arxiv.org/abs/2502.11844); C). In SusVibes, with real feature requests for agents, the best setup (SWE-agent with Claude 4 Sonnet) was functionally correct on 57% of the tasks, but also secure on 11.8%. Naming the vulnerability type in the prompt barely helped ([Zhao et al., 2026](https://arxiv.org/abs/2512.03262); C).
- **By language and kind of flaw.** In Veracode's measurement of October 2026, C# scored 60%. Cross-site scripting was handled correctly in 18% of cases and log injection in 13%, while SQL injection (84%) and cryptography (87%) mostly go right. The best models, among them Claude Opus 5.5, reached 73% ([Veracode, 2026](https://www.veracode.com/blog/fall-2026-genai-code-security); C, vendor).
- **New kinds of flaws.** Code models invent package names: at least 5.2% for commercial and 21.7% for open-source models. An attacker can register such a name ([Spracklen et al., 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen); C).

**The most persistent effect is confidence that is not justified.** In a randomized study, participants with an AI assistant wrote less secure code and more often believed it was secure. Those who trusted the AI less did better ([Perry et al., 2023](https://doi.org/10.1145/3576915.3623157); B, n = 47). Other experiments found no difference, or only a small one, in the code itself ([Sandoval et al., 2023](https://www.usenix.org/conference/usenixsecurity23/presentation/sandoval); [Mousavi et al., 2026](https://arxiv.org/abs/2607.11348); [Jost et al., 2026](https://arxiv.org/abs/2603.15298), preprint; all B). What does keep coming back is that people do not notice that their code is insecure. Developers say they check AI code like a colleague's code, and rarely report security problems. The authors conclude that they overestimate their own checking ([Klemmer et al., 2024](https://doi.org/10.1145/3658644.3690283); C). Participants picked the most and the least secure AI suggestion about equally often (37.7% vs 35.0%), and those who edited suggestions more had fewer vulnerabilities ([Khalid et al., 2026](https://arxiv.org/abs/2609.21020); C, to appear at IEEE S&P 2027). Almost no one put security requirements in the first prompt ([Bappy et al., 2026](https://www.usenix.org/conference/soups2026/presentation/bappy); C).

Whether juniors are more vulnerable to this has not been shown. Experience predicted secure code significantly, but modestly ([Jost et al., 2026](https://arxiv.org/abs/2603.15298)), and a study that compares juniors and seniors with AI directly on security is missing. So the evidence supports "experience counts in security, and AI does not replace it". It does not yet show that AI puts juniors at extra risk.

**What juniors lack.** The problem is understanding, not carelessness. In a contest where teams built, attacked and fixed software, the mistakes in 78% of the 94 projects came from misunderstanding security concepts, and in 21% from a simple slip ([Votipka et al., 2020](https://www.usenix.org/conference/usenixsecurity20/presentation/votipka-understanding); C). Security also stays an afterthought as long as nobody asks for it. None of the ten students without an instruction stored passwords securely, and with the instruction four of ten did ([Naiakshina et al., 2017](https://doi.org/10.1145/3133956.3134082); C). Freelancers did not either, unless they were asked ([Naiakshina et al., 2019](https://doi.org/10.1145/3290605.3300370); C).

What helps is attention at the moment of the decision. Reviewers who were told to focus on security had about eight times higher odds of finding the vulnerability; a checklist added nothing significant ([Braz et al., 2022](https://doi.org/10.1145/3510003.3511560); B, n = 150, mostly professionals). A plug-in that flagged security problems in the IDE reduced the errors in the code being written ([Nguyen et al., 2017](https://doi.org/10.1145/3133956.3133977); B, n = 39). Six hours of workshops over three months changed the practice of teams, and after twelve months that was still visible in the two teams that could be interviewed again ([Weir et al., 2020](https://doi.org/10.1002/spe.2774); C). No training method has been tested in a randomized trial with juniors at work.

**What employers have to show.** Job ads say little: no study counts security requirements in ads for developers. The pressure comes from laws and standards, and reaches the developer through the employer.

- **The Dutch Cyberbeveiligingswet** (Stb. 2026, 187), the Dutch implementation of NIS2, has applied since 15 August 2026 to more than 8,000 organisations ([Rijksoverheid, 2026](https://zoek.officielebekendmakingen.nl/stb-2026-187.html); law).
- **The Cyber Resilience Act** has required manufacturers since 11 September 2026 to give an early warning of actively exploited vulnerabilities within 24 hours and a notification within 72 hours. From 11 December 2027, products with digital elements must, on the basis of the risk assessment, be made available without known exploitable vulnerabilities, and the manufacturer keeps an SBOM (Regulation (EU) 2024/2847; law).
- **Standards and guidelines** make it concrete. ISO/IEC 27001:2022 gained its own control for secure coding (A.8.28). NIST SSDF asks for role-based training (PO.2.2), secure coding practices (PW.5) and code review (PW.7). OWASP SAMM starts with awareness for everyone who builds software, and level 1 of OWASP ASVS 5.0 is the baseline. In Dutch there are the NCSC's ICT security guidelines for web applications (May 2024).
- **Not a job, but part of the job.** The European ECSF has twelve role profiles, and none of them is software developer ([ENISA, 2022](https://doi.org/10.2824/859537)). For a developer, security is not a role but a skill within their own work.

**Two angles.**

| | A: junior developer learns secure coding | B: junior security specialist |
|---|---|---|
| Where the work happens | in code files | in terminals, tools and reports |
| Risk of an AI agent in this work | small: defensive work | dual use: an agent with a shell can run scans or exploits |
| Audience | all junior developers | smaller, and the entry route is shrinking |

Angle B fits less well. The work is different in kind. SOC analysts check alarms by hand ([Alahmadi et al., 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/alahmadi); C). Security work needs much technical knowledge, but the tasks and skills asked for are largely non-technical ([PTvT & Dialogic, 2024](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file); C). The "answer" there is a command or a judgement, which an AI can give straight away in a chat. The entry route is also narrow. The shortages are mainly at medior and senior level; according to the same report, the supply of junior graduates matches demand, except for specialist profiles. Of 856 security professionals who use AI, 56% said AI has already reduced the need for entry-level roles (ISC2, 2026; C, industry association). One finding does carry over: withholding the solution works in security education. On pwn.college, 309 students asked a Socratic tutor that did not know the solutions directly for the solution in only 3.5% of their questions ([Tompkins et al., 2026](https://doi.org/10.1145/3830454.3846694); C).

**Conclusion.** Angle A is the better first niche. It fits what research finds most often, that people do not notice that AI code is insecure, and it concerns all junior developers.

**How strong is this?** The evidence that AI code is often insecure is broad, but comes mostly from benchmarks, and the figures per language come from a vendor. That juniors are more vulnerable has not been shown, and no training method has been tested in a randomized trial with juniors at work. A gap remains: no study measures, with an agentic tool, both whether code is secure and whether its author rightly thinks so. The sources are in the [notes on secure code for juniors](../notes/secure_coding_juniors.md).

For what the harness does with this, see [secure code next to an AI agent](../for-juniors.md#secure-code-next-to-an-ai-agent).
