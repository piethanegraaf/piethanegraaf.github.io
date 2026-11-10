# New empirical evidence (1 May – 7 Nov 2026): generative AI and agentic coding assistants vs. learning to program, OOD, debugging/testing, and learning in higher education

Compiled 7 Nov 2026. **Labels:** [PEER-REVIEWED] · [PREPRINT] (arXiv/SSRN) · [WORKING PAPER] (IZA/CEPR/EdWorkingPapers/NBER, not peer-reviewed) · [VENDOR] (conflict of interest) · [PRESS]. **IN WINDOW** means first public appearance between 1 May and 7 Nov 2026. **PRE-WINDOW** means context only, with its date given. arXiv IDs encode the submission year and month (2607.xxxxx = July 2026). "(snippet-level)" means the figure comes only from a search-engine summary, not a fetched primary page. Earlier studies (Bastani 2025, Shen & Tamkin 2026, Lehmann 2025, Kestin 2025, Fan 2025, Kosmyna 2025, Prather 2024, Kazemitabaar 2023–25, METR 2025) are deliberately not re-described. **Coverage limit:** ACM DL full texts (ICER/ITiCSE/L@S 2026) and journals such as Computers & Education, BJET, JCAL, CSE and Learning and Instruction were not browsed issue by issue. Everything below comes from targeted searches plus fetches of primary pages and PDFs.

## Q1. Which new studies measure learning WITHOUT AI after AI-assisted practice (or retention/transfer) in programming/STEM higher education, and what did they find?

### Takeaway
The two largest new higher-education trials are both non-peer-reviewed RCTs, and they point in opposite directions:
- **Maryland, n=2,379:** a course-integrated GPT-4o tutor **lowered** final grades by 0.37 SD in same-course comparisons.
- **Middlebury, n=211:** ChatGPT access **raised** unaided test scores by 0.28 SD immediately and by about 0.21 SD (p=0.068) one week later. The gains came mostly from tutor-like ("augmentation") use, but that split was self-selected.

Programming-specific evidence is small. In the ICER 2026 study (n=22), Copilot raised in-session performance (g=0.99), but the drop to a one-week unaided retest was larger (g=−1.13, p_adj=.054). Every design repeats the same dissociation: performance with AI is not learning without it.

### Cited Findings

**1. Liu et al. (2026), University of Maryland, "course-integrated AI tutor". IN WINDOW, [WORKING PAPER]**
- **Citation:** Liu, J., Sweet, T., Chen, M. H., Engelberg, J., Masters, M. C., Clark, M., Persaud, A., Lancaster, A., Hollingsworth, J. K., & Rice, J. K. (2026). *The Effects of Course-Integrated AI Tutoring on Student Performance and Engagement: A Randomized University Trial.* EdWorkingPaper 26-1598, Annenberg Institute at Brown University. Version October 2026; the paper is dated 30 Sep 2026. DOI 10.26300/y3f8-vh05. Not peer-reviewed. — [EdWorkingPapers](https://edworkingpapers.com/ai26-1598); [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Design:** RCT in the fall semester of 2025–26.
  - Instructors were randomized within blocks of identical or similar courses: 9 "exact-match" blocks (sections of the same course) and 4 blocks containing 12 sections of different courses, 34 course-sections in all.
  - Estimates are ITT. The analysis plan was registered on OSF after data collection but before analysis.
  - SEs are clustered at the course-section level, with randomization inference as a check because there are only 34 clusters. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Population:** 2,379 undergraduates and 30 instructors across STEM, social sciences, humanities and education at the University of Maryland, College Park. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **AI tool and constraints:**
  - The tool is a GPT-4o "virtual study assistant" (VSA) that uses RAG over instructor-selected materials inside the LMS (ELMS).
  - Instructors chose the default "direct instruction" mode or a "tutor" mode that guides students toward the answer. Only two instructors ended the term in tutor mode.
  - **Students in both arms had free access to other university-supported AI, including ChatGPT and Gemini.**
  - About 15% of treated students used the VSA at least once, and users averaged about four sessions. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Effects on grades:**
  - Exact-match sample, with controls: final course grade −4.12 points (−0.37 SD); letter grade −0.11 GPA points (−0.13 SD); no effect on homework scores.
  - Full sample: no significant adverse achievement effects.
  - The authors summarize the range as −0.27 to −0.37 SD, "with the clearest evidence in the exact-match sample". — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Effects on engagement:**
  - Exact-match sample: LMS page views −720.96 (−0.37 SD), active days −7.19 (−0.51 SD), recorded participation −26.39 (−0.90 SD).
  - Full sample: −593.08 (−0.38 SD), −9.27 (−0.61 SD) and −22.51 (−0.89 SD). — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Heterogeneity:**
  - First-generation students: −5.10 points (−0.50 SD), against −2.23 points (−0.22 SD) for other students. The differential is −2.87 points (0.28 SD) in the full sample and −3.89 points (−0.35 SD) in the exact-match sample.
  - No gradient by high-school GPA. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Usage logs:** 73.8% of requests sought information, explanations or solutions; 11.3% were practice or test preparation; 0.7% asked for feedback on the student's own work. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Limitations (stated by the authors):**
  - The outcome is course grades, not an independent assessment.
  - LMS logs capture only part of learning.
  - Grading may differ across sections.
  - The effect probably reflects broader AI use triggered by introducing the VSA, not isolated VSA use.
  - The results concern the VSA as configured, mostly in direct-instruction mode, and not scaffolded tutoring. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)

**2. Contractor & Reyes (2026), Middlebury College. IN WINDOW, [PREPRINT / WORKING PAPER]**
- **Citation:** Contractor, Z., & Reyes, G. (2026). *Experimental Evidence on the Learning Impact of Generative AI.* arXiv:2607.08849 (v1 9 Jul 2026; v2 4 Oct 2026); IZA Discussion Paper No. 18792 (July 2026). Not peer-reviewed. — [arXiv](https://arxiv.org/abs/2607.08849); [IZA](https://www.iza.org/publications/dp/18792/experimental-evidence-on-the-learning-impact-of-generative-ai)
- **Design:** proctored, in-person RCT.
  - Eight time slots, each with two parallel labs. One lab per slot was randomly made AI-allowed, so randomization is effectively at the lab-by-slot level.
  - Registered as AEARCTR-0015806, with a pre-analysis plan. Data were collected in spring 2025. — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)
- **n:** 256 undergraduates signed up, 211 attended session 1, and 205 attended both sessions. Women and first-year students are over-represented. — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)
- **AI tool and task:**
  - The AI arm used a logged-in ChatGPT (GPT-4o) account; the control arm was forbidden from using AI.
  - Students had a 35-minute learning phase on an unfamiliar topic (blockchain, carbon capture or CRISPR) with a 1,250–1,400-word reading, then wrote a ~500-word analytical essay.
  - All tests and the session-2 essay were done **without AI in both arms**. — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)
- **Effects (ITT):**
  - Session-1 unaided test: +7.2 pp (0.28 SD, p=0.021; control mean 56.3%). TOT: 10.4 pp (0.41 SD).
  - **One week later, no AI:** +3.9 pp (about 0.21 SD, p=0.068; control mean 50.0%). Not statistically different from the immediate effect (p=0.321).
  - Essay quality: +0.45 points in session 1 (0.34 SD, p=0.024) and +0.33 in session 2 (0.24 SD, p=0.083).
  - AI-detected text: +22.2 pp in session 1, +0.7 pp in session 2 (p=0.494). — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)
- **Version note:** the July 2026 IZA abstract gives the immediate effect as 0.27 SD, against 0.28 SD in v2. — [IZA](https://www.iza.org/publications/dp/18792/experimental-evidence-on-the-learning-impact-of-generative-ai)
- **Use-type heterogeneity:** this is **descriptive, not randomized**. Use type was classified from ChatGPT logs; the shares are reported as augmentation 61%, automation 9%, mixed 27% and other 3%.
  - Session-2 test: augmentation +0.24 SD (p=0.095); automation −0.24 SD (p=0.538, imprecise).
  - Once AI was removed, the automation group's essay advantage fell by 1.64 SD. The difference in that change between automation and augmentation was 1.78 SD (p=0.014). — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)
- **Limitations:**
  - Rule violations account for an estimated 17–22% of the ITT; excluding violators gives about 0.15–0.27 SD.
  - Follow-up is one week only, at a single institution with a short timed task.
  - Essays are partly LLM-graded.
  - The task is not programming.
  - **Caveat:** the fetched HTML text was partly garbled. Check the figures against the PDF before quoting them. — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)

**3. Gardella et al. (2026), "Fast and Forgettable". PRE-WINDOW preprint (arXiv v1 20 Apr 2026); [PEER-REVIEWED] at ICER 2026 (Uppsala, 11–14 Aug 2026)**
- **Citation:** Gardella, N., Prather, J., Leinonen, J., Denny, P., Pettit, R., & Riggs, S. L. (2026). Fast and Forgettable: A Controlled Study of Novices' Performance, Learning, Workload, and Emotion in AI-Assisted and Human Pair Programming Paradigms. *ICER 2026.* arXiv:2604.18538. — [arXiv](https://arxiv.org/html/2604.18538); [ICER 2026 program](https://icer2026.acm.org/track/icer-2026-papers)
- **Design:** within-subjects, with order counterbalanced across 8 permutations.
  - Each participant did one 20-minute human-human pair-programming trial and one 20-minute solo trial with GitHub Copilot.
  - About one week later came a **solo retention test with no AI and no partner**. — [arXiv](https://arxiv.org/html/2604.18538)
- **n:** 22 CS2/CS3 students (11 pairs) at one selective US university. The IRB is the University of Virginia's (UVA IRB-SBS #7557). — [arXiv](https://arxiv.org/html/2604.18538)
- **AI:**
  - Copilot and Copilot Chat in VS Code, on GPT-4.1 (the educational free tier).
  - Copilot could not see the task PDF, and other AI was prohibited.
  - The tasks were 8 HumanEval problems, which Copilot Chat solves in one shot when given the task text. — [arXiv](https://arxiv.org/html/2604.18538)
- **Effects:**
  - Performance with AI: +14.09 of 100 points (95% CI [6.46, 22.89]), g=0.99, p<.001.
  - Self-graded performance: g=−0.13, p=.435 (n.s.).
  - **Retest minus session 1:** −18.88 points with AI (95% CI [−32.87, −5.01]), p=.015, p_adj=.054, g=−1.13. Absolute retest score: −4.79 (p=.397, g=−0.27, n.s.).
  - NASA-TLX was lower with AI: mental demand g=−1.22, temporal demand g=−1.21, effort g=−1.28 (all p_adj ≤ .003). Frustration was n.s.
  - Valence change g=−1.61 and arousal change g=−1.74: the human partner was more positive and more arousing. — [arXiv](https://arxiv.org/html/2604.18538)
- **Limitations:** small n and clustering, so Type II errors are possible. Other limits are the fixed 20-minute trials, simple HumanEval tasks and a convenience sample. — [arXiv](https://arxiv.org/html/2604.18538)
- **Press error:** one news write-up headlined that AI pairing "raises workload and stress", which contradicts the paper (AI *lowered* the NASA-TLX demands). — [Pulse (press)](https://www.pulse.bot/human-potential/news/aiassisted-pair-programming-boosts-novice-coders-performance-but-raises-workload-and-stress-d1e85b3f-a101-4174-a5c1-ed03f712fd28/); [arXiv](https://arxiv.org/html/2604.18538)

**4. Yang, Van Alstyne & Dellarocas (2026), "When AI Tutors Speak". IN WINDOW, [PREPRINT]**
- **Citation:** arXiv:2609.23958, submitted 21 Sep 2026.
- **Design:** preregistered randomized field experiment.
  - 86 online-MBA corporate-finance students were randomized to a structured tutor grounded in the course materials, or to a holdout where **consumer AI stayed freely available**.
  - Within the tutored arm, voice and text alternated weekly. — [arXiv](https://arxiv.org/abs/2609.23958)
- **Effects:**
  - Tutored students gained 6.63 points more than ability-matched peers (p=.007).
  - Share of answers with "relational-quality" reasoning: 8%→49% tutored vs 8%→27% holdout.
  - Instructor's final exam: +2.6 of 100 in the same direction, with no difference on the pre-treatment midterm. The abstract gives no p-value for this.
  - Modality had no effect on learning, and voice cost 2.8 times as much. — [arXiv](https://arxiv.org/abs/2609.23958)
- **Not reported on the abstract page:** per-arm n, registry ID, model name and whether the final exam was AI-free. A search-engine summary said the tutor "required an attempt before explaining", but the abstract page does **not** confirm this. — [arXiv](https://arxiv.org/abs/2609.23958)

**5. Jin, Peng, Han, Liao & Wang (2026), "HelpCoach". IN WINDOW, [PREPRINT]**
- **Citation:** arXiv:2609.28918 (24 Sep 2026).
- **Design:** a chat add-on that rates students' help-seeking questions and prompts them to revise. It was tested with 40 college students learning web programming, against pre-task help-seeking training alone.
- **Reported results:** more specific questions and "greater knowledge retention".
- **Not stated on the abstract page:** randomization, effect sizes and unaided measures. — [arXiv](https://arxiv.org/abs/2609.28918)

**6. Strömberg, Lei & Wu (2026), "The Generative AI Learning Penalty". IN WINDOW (June 2026), [WORKING PAPER], secondary school, NOT randomized**
- **Citation:** CEPR Discussion Paper 21577; SSRN 6868618 (the SSRN record was not fetched).
- **Design:** difference-in-differences with staggered AI adoption. The data are a 30-month panel of 26,811 students in grades 7–12, across nine subjects, in one county in central China.
- **Effects of AI adoption:**
  - Homework scores +18%, completion time −30%.
  - Monthly closed-book exam scores −20% within six months.
  - High-stakes entrance exams −18% and −24%. The full penalty appears only after about two years.
  - About 80% of AI users show signs of homework outsourcing, and these users drive most of the losses. Users with normal completion times show only small losses. — [IDEAS/RePEc](https://ideas.repec.org/p/cpr/ceprdp/21577.html)

**7. PRE-WINDOW context (dated)**
- **Sankaranarayanan, "Mitigating 'Epistemic Debt'…"** (arXiv:2602.20206; v1 22 Feb 2026, v2 31 Mar 2026).
  - 78 learners recruited online, in three conditions: manual; unrestricted AI; and scaffolded AI with an "Explanation Gate", a teach-back enforced by an LLM judge.
  - The tool was a custom Cursor plugin on Claude 3.5 Sonnet.
  - Both AI arms beat manual on functional output (p<.001) and did not differ from each other (p=.64).
  - **On a later 30-minute AI-blackout maintenance task, failure was 77% with unrestricted AI vs 39% with scaffolded AI.**
  - Randomization is not stated. The venue (L@S 2026, per a snippet) is unconfirmed. — [arXiv](https://arxiv.org/abs/2602.20206)
- **TUM three-arm RCT** in an intro programming course (N=275), *Computers and Education: AI*, 2025. AI groups scored higher on exercises but showed no greater pre–post knowledge gains or code-comprehension advantage. Snippet-level: the full text returned 403. — [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2666920X25001778); [TUM portal](https://portal.fis.tum.de/en/publications/less-stress-better-scores-same-learning-the-dissociation-of-perfo/)

### Inferences
- **Performance is not learning, in every design:**
  - Gardella: g≈+1 with AI, retest change g≈−1.1.
  - Strömberg: homework +18%, exams −20%.
  - TUM 2025: scores up, gains equal.
  - Liu: no homework gain, lower grades.
- **Effect sizes are modest:** where the new HE RCTs measure AI-free outcomes, the effects are about |0.2–0.4| SD. That is far below the uncorrected meta-analytic g's (see Q6).
- **Positive results share one feature:** in Contractor & Reyes, Yang et al. and HelpCoach, the AI teaches or explains rather than producing the graded artefact. But the clearest contrast (augmentation vs automation) is self-selected, so it is correlational.
- **For the student:** the AI-level-0/1 exam corresponds to the "unaided" outcomes measured here. The harness enforces attempts, hints and no code below mastery, with spaced unaided reviews. That matches the conditions associated with better unaided outcomes, but no study has tested such a harness in OOD/C#.

### Gaps
- No in-window, adequately powered RCT in HE programming with an unaided post-test or retention test was found. The best programming study (Gardella) has n=22, and its preprint is pre-window.
- **Forthcoming:** a registered RCT at four engineering colleges in India. Its primary outcome is programming fundamentals assessed without GenAI, with endline in Sept–Oct 2027 (snippet-level). — [AEA registry 19809](https://www.socialscienceregistry.org/trials/19809)
- **Forthcoming:** a pre-trial registration for about 120 econometrics students in Macau, with AI-prohibited exams as the outcome (snippet-level). — [AEA registry 19769](https://www.socialscienceregistry.org/trials/19769)
- ICER 2026, Yong, Nacenta & Estey, "Characterization and Effects of CS2 Learning with GenAI, Visualization, and Human Support": no abstract was accessible, so the results are unknown. — [ICER 2026 program](https://icer2026.acm.org/track/icer-2026-papers)
- No in-window HE trial measured retention beyond about one week (Liu used end-of-semester grades).
- No new replication or follow-up of Shen & Tamkin (2026) was found.

## Q2. What do new studies show about agentic coding tools (Claude Code, Cursor, Copilot agent mode, Codex) in education, as opposed to chat assistants?

### Takeaway
**No in-window controlled study of student learning with agentic coding tools was found.** What exists:
- small surveys and qualitative "vibe coding" studies;
- a position paper arguing that humans are missing from coding-agent research;
- a vendor usage report from Anthropic, not about students;
- a capability study showing current models outscore the average student on intro OOP assessments, while struggling with interfaces, abstract classes and inheritance.

### Cited Findings
- **Fawzy, Tahir & Blincoe**, "From Prompting to Verification: How Experience Shapes Vibe Coding Practices", arXiv:2605.24521 (23 May 2026). [PREPRINT]
  - Survey of 162 "vibe coders": non-coders, novices and professionals.
  - Main finding is a "perception–action gap": awareness of AI-code risks is widespread, but the ability to evaluate, debug and verify depends on experience. Novices are motivated mainly by learning and experimentation.
  - Tools are not named on the abstract page. — [arXiv](https://arxiv.org/abs/2605.24521)
- **"Vibe coding before the trend"**, arXiv:2605.07751 (May 2026). [PREPRINT] 107 student reflections across four course settings; students saw their role shifting from producing code to evaluating it (snippet-level; authors not verified). — [arXiv](https://arxiv.org/html/2605.07751v1)
- **Wang, Yang, Lieret, …, Neubig, Fried & Yang**, "Humans are Missing from AI Coding Agent Research", arXiv:2608.12355 (4 Jul 2026). [PREPRINT, position paper]
  - Argues that the bottleneck for coding agents is how users communicate with, supervise and trust them.
  - Proposes four interaction dimensions: task alignment, verifiability, steerability, adaptability.
  - Contains no empirical data. — [arXiv](https://arxiv.org/abs/2608.12355)
- **Lepp & Kaimre**, "Revisiting the Performance of Generative AI on Introductory Object-Oriented Programming Assessments: Insights from 2026", arXiv:2608.16318 (17 Aug 2026). [PREPRINT]
  - Models: ChatGPT-5.2, DeepSeek-V3, Gemini 2.5 Flash, Claude Sonnet 4.5 and M365 Copilot, on tests and exam tasks from an intro university OOP course, graded with the student criteria.
  - All models scored above the average student cohort and often got full marks on longer tasks.
  - They sometimes produced non-compiling code and **struggled with interfaces, abstract classes and certain inheritance tasks**, as well as image-based questions.
  - Most results improved on the previous year. The abstract gives no exact numbers. — [arXiv](https://arxiv.org/abs/2608.16318)
- **Anthropic, "How Claude Code is used in practice"** (June 2026). [VENDOR — COI: Anthropic makes Claude Code, which the student uses]
  - A usage analysis of about 400,000 Claude Code sessions from about 235,000 people (Oct 2025–Apr 2026).
  - Not an education study, and it does not address students (snippet-level; the page was not fetched). — [Anthropic](https://www.anthropic.com/research/claude-code-expertise)
- **No learning-outcome evidence:**
  - A syllabus analysis mapping the AI-assisted software engineering curriculum (arXiv:2608.05898, Aug 2026). — [arXiv](https://arxiv.org/pdf/2608.05898)
  - VibeJam (arXiv:2608.29889, Aug 2026), with a pilot of 13 junior students (snippet-level). — [arXiv](https://arxiv.org/abs/2608.29889v1)
- **Closest controlled evidence uses non-agentic or pre-window tools:**
  - Gardella et al.: Copilot and Copilot Chat on GPT-4.1 (Q1).
  - Sankaranarayanan: Cursor plugin on Claude 3.5 Sonnet, pre-window; unrestricted use gave 77% vs 39% failure on the AI-blackout task (Q1). — [arXiv](https://arxiv.org/html/2604.18538); [arXiv](https://arxiv.org/abs/2602.20206)
- **PRE-WINDOW:**
  - "Unpacking Vibe Coding" (arXiv:2604.27134, Apr 2026): 19,418 interaction turns from 110 undergraduates. Top performers used instrumental help-seeking (inquiry and exploration) that drew tutor-like responses (snippet-level). — [arXiv](https://arxiv.org/abs/2604.27134v1)
  - "Comprehension Debt in GenAI-Assisted Software Engineering Projects" (arXiv:2604.13277, Apr 2026): title only. — [arXiv](https://arxiv.org/pdf/2604.13277)

### Inferences
- **Agentic tools are an evidence vacuum.** Any claim about them extrapolates from chat or autocomplete studies, where the tool producing working code inflates in-session performance (Gardella) and unrestricted generation harmed later unaided maintenance (Sankaranarayanan, pre-window).
- **More delegation:** agents raise how much work can be handed off (multi-file edits, running tests). That plausibly makes the "automation" use type (Contractor & Reyes) and "outsourcing" (Strömberg) easier to slip into. This is an inference; nobody has measured it.
- **OOD-specific risk:** Lepp & Kaimre suggest that AI output in an intro OOP course is weakest on interfaces, abstract classes and inheritance, which are core OOD constructs. Relying on AI there means relying on it where it is least reliable (inference).

### Gaps
- No RCT or quasi-experiment of Claude Code, Cursor agent, Copilot agent mode or Codex on student learning outcomes.
- No vendor learning-outcome study (Anthropic, OpenAI, GitHub) of agentic tools for students.
- No evaluation of "learning" or "explanatory" output modes in coding agents.
- The MDPI scoping review "A Scoping Review of Vibe Coding and AI-Assisted Programming in University Computing Education" was not read, and its date was not verified. — [MDPI](https://www.mdpi.com/3042-8130/2/4/34)

## Q3. Is there new evidence comparing guardrailed/pedagogical AI tutors with unrestricted AI, including replications of Bastani et al. (2025) or Kestin et al. (2025)?

### Takeaway
**No direct replication, successful or failed, of Bastani 2025 or Kestin 2025 was found.** The new trials suggest guardrails are not a reliable active ingredient on their own:
- In an MBA RCT, a structured, course-grounded tutor beat freely available consumer AI.
- A guard-railed math tutor added only a marginal delayed gain (+3.1 pp, p=0.065), and only inside a mastery workflow. One co-author of that paper was also a co-author of Bastani et al.
- Changing the tutor's pedagogy through system prompts in CS1 (n=1,059) changed none of the preregistered outcomes.
- A course tutor used mostly in direct-answer mode lowered grades.

### Cited Findings
- **Barth, Thorgeirsson, Etemadi, Leinonen, Cotrini & Su (2026).** Steering AI Tutors Through System Prompts: A Crossover Study on Self-Regulated Learning and Cognitive Engagement Scaffolds in CS1. *ICER 2026*, DOI 10.1145/3765964.3811656. [PEER-REVIEWED; IN WINDOW, presented 12 Aug 2026]
  - Preregistered three-arm crossover with N=1,059 students over six weeks of real CS1 coursework. The authors are at ETH Zurich and Aalto; the page does not name the institution where the course ran.
  - Arms: a pedagogically constrained baseline tutor; an SRL tutor following Zimmerman (planning, monitoring, reflection); and an ICAP tutor (Chi).
  - Outcomes were conceptual MCQs, usability, cognitive load and engagement, analyzed with mixed-effects models.
  - **The four preregistered confirmatory measures showed "no statistically significant differences between conditions."**
  - In non-confirmatory analyses, SRL tutors produced more time on task, longer messages and more constructive contributions.
  - The authors conclude that tutor pedagogy "may not be easily steered by system prompts alone" and suggest giving students control over scaffolded vs direct help.
  - The page gives no effect sizes. Its URL carries an older title, "When More Engagement Doesn't Mean More Learning: LLM Tutors and Self-Regulated Learning in CS1". — [ICER details page](https://icer2026.acm.org/details/icer-2026-papers/18/When-More-Engagement-Doesn-t-Mean-More-Learning-LLM-Tutors-and-Self-Regulated-Learni)
- **Oreopoulos, Liut, Sungu & Low (2026).** *Making AI Tutoring Productive: Evidence from a Mastery-Based Math Practice Experiment.* EdWorkingPaper 26-1552 (August 2026; dated 17 Aug 2026), DOI 10.26300/01qv-6c22, AEA registry AEARCTR-0018678. [WORKING PAPER; IN WINDOW; K-12, not HE]
  - More than 6,000 middle-school students in Hamilton County Schools (Chattanooga, TN), in late March 2026.
  - Students were individually randomized at login on three factors: AI tutor vs CAL-only; mastery (watch ≥1 minute of video, then 3 correct in a row) vs non-mastery; and one of two topics.
  - The tutor is guard-railed: it is designed not to give direct answers. It offers a "Help me get started" first step and a step-by-step walkthrough after mistakes. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1552.pdf)
  - **Effects on practice:**
    - AI reduced Exercise-1 questions completed by about 1 and added about 1.64 minutes per question.
    - After mistakes, in the mastery arm, AI raised next-attempt correctness by 8.5 pp and cut attempts to the next correct answer by 0.96, but added 2.88 minutes.
    - Mastery raised 3-in-a-row attainment by 28.7 pp but did not on its own improve delayed learning.
  - **One-week delayed test** (mastery students, practiced Exercise 1): 40.2% with AI vs 37.0% CAL-only, **+3.1 pp, p=0.065**; the effect on unpracticed items was about zero. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1552.pdf)
  - **Limitations:** a single session, a 4-question delayed test, exposure confounds in Exercise 2, and a single specific platform. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1552.pdf)
  - **Link to Bastani:** Alp Sungu is a co-author of Bastani et al. (2025). The paper tests a guard-railed tutor's value added over the same platform without AI, not generic AI access. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1552.pdf); [Bastani author list as cited in arXiv:2606.26181](https://arxiv.org/pdf/2606.26181)
- **Yang, Van Alstyne & Dellarocas (2026)** (see Q1): structured tutor vs freely available consumer AI, +6.63 points (p=.007), in a preregistered RCT with n=86. — [arXiv](https://arxiv.org/abs/2609.23958)
- **Liu et al. (2026)** (see Q1): a GPT-4o course tutor, mostly in direct-instruction mode (only two instructors used tutor mode), vs control, with both arms having ChatGPT and Gemini. Result: −0.37 SD on final grades (exact-match). — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Khanmigo two-year school experiment** (EdWorkingPaper 26-1551) [WORKING PAPER; K-12]. Authorship as "Oreopoulos & Low" is inferred from Liu et al.'s citation and was not verified on the paper.
  - Cluster RCT in 18 Tennessee middle schools.
  - Tutor use was intermittent, and the gains resembled those from practising on the platform without AI (snippet-level; date not verified).
  - Liu et al. characterize it as "modest achievement gains… but limited sustained tutor use" and note that it does not isolate AI's incremental contribution. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1551.pdf); [Liu et al. PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Teo, Jain, Gerstenberg & Kleiman-Weiner**, "AI Assistants Overassist", arXiv:2607.21306 (23 Jul 2026). [PREPRINT]
  - Int-Bench is a simulation benchmark covering code debugging, math and brain teasers.
  - LLM "teachers" step in **more often and earlier than humans** and tend to give **complete solutions rather than targeted hints**.
  - The students are simulated, and the human sample is not described. — [arXiv](https://arxiv.org/abs/2607.21306)
- **Brcic & Frljic**, "The Effortless Trap", arXiv:2606.26181 (24 Jun 2026). [PREPRINT, position paper, no new data] Proposes the rule "if AI makes a task feel effortless, it is in the wrong place." — [arXiv](https://arxiv.org/abs/2606.26181)
- **PRE-WINDOW vendor:** Google/Eedi LearnLM exploratory RCT, arXiv:2512.23633 (Dec 2025). [VENDOR — COI: Google] 165 Year 9–10 students in five UK schools. Next-unit transfer question: 66.2% LearnLM (human-supervised), 60.7% human tutors, 56.2% static hints (snippet-level). — [arXiv](https://arxiv.org/pdf/2512.23633)

### Inferences
- **Enforcement seems to matter more than prompt wording.** Guardrails written into the prompt (Barth: null on preregistered outcomes) look less effective than guardrails enforced in the workflow: the mastery gate (Oreopoulos), the explanation gate (Sankaranarayanan, pre-window) and the structured tutor (Yang). This inference draws on heterogeneous studies.
- **Default assistants over-help.** Teo et al. show they hand out full solutions. That supports enforcing restrictions outside the model, as the student's hook-based guard does, over trusting a model to hold back.
- **The comparison arm decides the result.** In 2026 the realistic control is "students already have ChatGPT/Gemini" (Liu; Yang). A tutor that merely adds to that can lower engagement (Liu) unless it is structured (Yang).

### Gaps
- No direct or failed replication of Bastani 2025 or Kestin 2025 in the window. No Kestin-style physics follow-up was found.
- No in-window HE *programming* RCT comparing a hint-only tutor with unrestricted chat on unaided exams.
- No learning-outcome evaluation of OpenAI "study mode" or Anthropic "learning mode" was found.
- Google's LearnLM RCT in Sierra Leone (1,763 Grade 7–8 students): only Google's own summary was seen, and its date and paper are unverified.
- Not searched specifically: follow-ups or critiques of Kosmyna 2025, METR 2025, Lehmann 2025, Prather 2024 and Kazemitabaar.

## Q4. Did any new study randomize the interaction pattern itself (explanation-seeking vs solution-seeking; attempt-first vs AI-first), rather than identifying patterns post hoc?

### Takeaway
**No in-window trial randomized the student's own sequencing (attempt-first vs AI-first) or explanation-seeking vs solution-seeking.** The closest designs randomize features of the AI or the workflow: tutor pedagogy via system prompts (null), a mastery gate, single vs multiple code suggestions, injected bugs, and voice vs text. The widely quoted augmentation-vs-automation contrast is still post hoc.

### Cited Findings
- **Randomized tutor pedagogy:** Barth et al. (ICER 2026), a crossover of baseline vs SRL vs ICAP system prompts (N=1,059). No confirmatory differences. — [ICER](https://icer2026.acm.org/details/icer-2026-papers/18/When-More-Engagement-Doesn-t-Mean-More-Learning-LLM-Tutors-and-Self-Regulated-Learni)
- **Randomized workflow constraint:** Oreopoulos et al., a factorial design (AI × mastery × topic) with individual randomization. AI's delayed value added showed up only inside the mastery workflow (+3.1 pp, p=0.065). — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1552.pdf)
- **Randomized modality:** Yang et al., voice vs text alternated weekly within students. No learning difference. — [arXiv](https://arxiv.org/abs/2609.23958)
- **Manipulated AI output:** Pădurean, Riegel, Gotovos, Mahapatra, Ghosh, Denny, Leinonen, Prather & Singla, "When AI Is Wrong on Purpose: How Students Respond to Buggy GenAI Code", ICER 2026, arXiv:2607.05068 (6 Jul 2026). [PEER-REVIEWED; IN WINDOW]
  - Realistic, runnable bugs were injected into otherwise correct GenAI solutions in CS1 prompt-based exercises (2,636 sessions, 917 students).
  - Injected bugs led to more direct code edits and higher next-attempt success. Natural prompt failures led to prompt rewording instead.
  - Whether injection was randomized is not stated on the abstract page, and there are no numbers there. — [arXiv](https://arxiv.org/abs/2607.05068)
- **Suggestion presentation:** Prather, MacNeil, Luxton-Reilly, Margulieux, Reeves, Denny, Leinonen, Homer, Nabid & Rossetti, "Scaffolding Autocomplete: Improving Guidance for Learners using Generative Code Suggestions", ICER 2026. [PEER-REVIEWED]
  - A scaffolded exercise trains students to tell good from bad GenAI suggestions ("negative expertise").
  - Students did better with **one suggestion than with several** (n and randomization not verified; abstract via snippet). — [ICER details](https://icer2026.acm.org/details/icer-2026-papers/16/Scaffolding-Autocomplete-Improving-Guidance-for-Learners-using-Generative-Code-Sugge)
- **Help-seeking scaffold:** HelpCoach vs pre-task training (n=40). Randomization not stated. — [arXiv](https://arxiv.org/abs/2609.28918)
- **Post hoc only:**
  - Contractor & Reyes classify use as augmentation or automation, explicitly as descriptive. — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)
  - Strömberg et al. infer "outsourcing" from completion time and scores, observationally. — [IDEAS](https://ideas.repec.org/p/cpr/ceprdp/21577.html)
- **PRE-WINDOW:** Eleftheriou, Pallis & Constantinides, "Confidence Without Competence in AI-Assisted Knowledge Work" (arXiv:2604.09444, 10 Apr 2026; CHIWORK '26 per the ACM DL).
  - Deep3 modes (future-self explanations, contrastive learning, guided hints) against a standard LLM, with n=85.
  - **Guided hints gave the largest learning gains.** The standard LLM gave the highest perceived understanding but the lowest objective learning.
  - Randomization is not stated on the abstract page. — [arXiv](https://arxiv.org/abs/2604.09444); [ACM DL](https://dl.acm.org/doi/10.1145/3808045.3808055)
- **PRE-WINDOW:** an RCT of prompting instruction in CS1 (arXiv:2602.16033, Feb 2026). Only the title was seen. — [arXiv](https://arxiv.org/pdf/2602.16033)

### Inferences
- **The causal case is still indirect.** "How you use AI matters more than whether you use it" rests on correlational splits plus randomized design-feature studies, with no RCT of student sequencing in programming.
- **Enforced structures shift behaviour; personas do not.** Mastery gating, teach-back gates and bugs that force code reading shifted behaviour, and sometimes outcomes. Changing the persona in the system prompt did not.

### Gaps
- No RCT of attempt-first vs AI-first.
- No in-window HE programming RCT that randomizes explanation-seeking vs solution-seeking instructions to students.
- Not examined: arXiv:2606.26579, an exploratory behavioural and EEG study of "AI-assisted learning modes" in high-school students (June 2026); only the title was seen.

## Q5. Is there evidence specific to design-level skills (OOD, modelling, UML), debugging, code reading or test writing with AI?

### Takeaway
**OOD/UML evidence remains thin and weak.** The one in-window controlled experiment (EDULEARN26) measured performance and perceptions *with* ChatGPT, with no unaided or retention outcome. Debugging and code-reading evidence improved with the large ICER 2026 bug-injection log study. Test-writing evidence is one small observational study (n=12, GPT-3.5).

### Cited Findings
- **Barcelos Murad, Lemos, Prates, Garcia, Paschoal & Melo (2026)**, "Generative AI in UML modeling tasks: evidence on technology acceptance and cognitive load". *EDULEARN26* (Palma, 29 Jun–1 Jul 2026), DOI 10.21125/edulearn.2026.1876. [CONFERENCE PROCEEDINGS, review rigour unclear; IN WINDOW]
  - Controlled experiment: ChatGPT vs no ChatGPT, with undergraduates drawing UML class, use-case and activity diagrams.
  - Measures: efficacy and efficiency, TAM and NASA-TLX.
  - The ChatGPT group reported higher confidence (88.2%), lower perceived mental effort and less time pressure. The authors also report higher accuracy and better conceptual understanding, but the abstract gives no statistics.
  - **n and randomization are not stated, and there is no unaided post-test.** The authors themselves warn that the lower effort may harm long-term retention. — [IATED](https://library.iated.org/view/BARCELOSMURAD2026GEN)
- **Lepp & Kaimre (2026)** (see Q2): the AI models struggled with interfaces, abstract classes and inheritance on intro OOP assessments. — [arXiv](https://arxiv.org/abs/2608.16318)
- **Pădurean et al. (ICER 2026)** (see Q4): students' reflections reported gains in code understanding, code review, debugging and a verification mindset. This is self-report. — [arXiv](https://arxiv.org/abs/2607.05068)
- **Ardic, Le Dilavrec & Zaidman (2026)**, "How students use generative AI for software testing: An observational study", *Empirical Software Engineering*, DOI 10.1007/s10664-026-10898-0. [PEER-REVIEWED] A snippet gives June 2026 as the publication month; this was not verified because the PMC page was blocked by a CAPTCHA.
  - 12 undergraduates used ChatGPT (GPT-3.5) to write unit tests for untested methods, observed through screen recordings, think-aloud and interviews.
  - The study identifies four strategies along two dimensions: where the test idea came from, and who wrote the implementation.
  - Perceived benefits: time saving, lower cognitive load, help with test ideas. Perceived drawbacks: less trust, worries about test quality, lack of ownership. — [Springer](https://link.springer.com/article/10.1007/s10664-026-10898-0); [PubMed](https://pubmed.ncbi.nlm.nih.gov/42333310/)
- **"Using Generative AI in Higher Programming Education: An Empirical Evaluation"** (SciTePress 2026): 36 first-semester CS students, AI without guidance vs AI with a best-practice guideline. Test writing was 22.7% of the AI use cases (snippet-level; venue and date not verified). — [SciTePress](https://www.scitepress.org/Papers/2026/147267/147267.pdf)
- **ICER 2026, Pădurean et al.**, "Understanding Student Perceptions, Mistakes, and Debugging Approaches when Solving Natural Language Programming Tasks": title only. — [ICER](https://icer2026.acm.org/details/icer-2026-papers/1/Understanding-Student-Perceptions-Mistakes-and-Debugging-Approaches-when-Solving-Na)
- **Not verified:**
  - Systematic review "Large Language Models for Software Engineering Diagrams: A Systematic Review of UML and ER modelling" (arXiv:2607.26100, July 2026). — [arXiv](https://arxiv.org/pdf/2607.26100)
  - A SoSyM 2026 paper on a conversational AI-feedback tool for UML, validated with 94 students (feedback quality and perceptions; snippet-level; date not verified). — [Springer](https://link.springer.com/article/10.1007/s10270-026-01373-x)
  - Calamo, Mecella & Snoeck (SoSyM 2026) on LLM-generated UML class diagrams, a capability study (snippet-level). — [Springer](https://link.springer.com/article/10.1007/s10270-026-01427-0)

### Inferences
- **OOD has no unaided evidence.** No study measures unaided design skill after AI-assisted practice. The only in-window UML experiment found lower perceived effort *with* AI. In programming (Gardella) and knowledge work (Eleftheriou, pre-window), lower effort or high perceived understanding goes together with weaker retention or learning (inference across domains).
- **Debugging AI code is promising.** Reading and repairing deliberately buggy AI code is a practice format with evidence of more direct engagement with code. Learning transfer has not been shown.

### Gaps
- No in-window RCT on OOD/UML skill measured without AI.
- No study measured test-writing skill (for example coverage or mutation score) after AI-assisted practice.
- No in-window code-comprehension outcome beyond self-report (TUM 2025 is pre-window).

## Q6. New meta-analyses or systematic reviews of GenAI/ChatGPT effects on learning, and published critiques of their quality (e.g., Wang & Fan 2025)

### Takeaway
**The most rigorous new synthesis cuts the effect to near zero.** Boolzen et al. (*Artificial Intelligence Review*, 25 Aug 2026; preregistered) found an uncorrected pooled g=0.839 for STEM cognitive outcomes, which falls to μ=0.076 after Robust Bayesian publication-bias correction. None of the 34 randomized trials was rated low risk of bias.
- Two other 2026 meta-analyses in *Frontiers in Psychology* report g=0.499 and g=1.096, with no bias-corrected estimate.
- The most-cited 2025 meta-analysis (Wang & Fan, g=0.867) **was retracted**. The notice is dated 22 April 2026 per GovTech, just before the window; another outlet says May 2026.

### Cited Findings
- **Boolzen, C., Kuhn, J., Flegr, S., Rott, E.-M., Stausberg, N., …, Küchemann, S. (2026).** Evidence of impact and interpretational limits of generative AI in STEM education: a systematic review and meta-analysis on cognitive learning outcomes. *Artificial Intelligence Review*, 59, article 223. DOI 10.1007/s10462-026-11665-9. Published 25 Aug 2026, preregistered on AsPredicted (#176450). [PEER-REVIEWED; IN WINDOW] The author list was truncated on the fetched page. — [Springer](https://link.springer.com/article/10.1007/s10462-026-11665-9)
  - **Pooled effect:** 85 studies in the systematic review; 49 studies with 59 effect sizes in the meta-analysis.
    - Uncorrected g=0.839, 95% CI [0.53, 1.15]; I²=96.32%; prediction interval −1.52 to 3.20.
    - **RoBMA-corrected μ=0.076 ± 0.254.** The effect "can be largely attributed to publication bias"; τ=1.190 ± 0.166. — [Springer](https://link.springer.com/article/10.1007/s10462-026-11665-9)
  - **Risk of bias:**
    - 34 randomized or cluster trials: none low, 31 (91%) "some concerns", 3 high.
    - 51 non-randomized studies (ROBINS-I): 22 moderate, 26 serious, 3 critical, none low. — [Springer](https://link.springer.com/article/10.1007/s10462-026-11665-9)
  - **Moderators:** outcome type (knowledge vs skills) R²=12.5%; ISAR level R²=13.0%. Both are robust to RoBMA. — [Springer](https://link.springer.com/article/10.1007/s10462-026-11665-9)
  - **Conclusions:**
    - Most promising when knowledge gains are the outcome.
    - Helpful when AI *augments* rather than *substitutes* for learner activity; substitution can be harmful.
    - **33 studies reported large effects only because the cognitive activities in the two groups were not comparable.** — [Springer](https://link.springer.com/article/10.1007/s10462-026-11665-9)
- **Liu, C., Xie, L., & Xu, G. (2026).** Generative AI in higher education: a meta-analysis of intellectual and social–emotional outcomes. *Frontiers in Psychology*, 17, 1848745. DOI 10.3389/fpsyg.2026.1848745. Published online 8 Jun 2026. [PEER-REVIEWED; IN WINDOW]
  - 33 studies (only 7 randomized) with 3,394 participants.
  - Intellectual outcomes: g=1.096 (95% CI 0.087–2.104), I²=99.27%. Egger z=8.23, p<0.001, indicating small-study effects. The estimate stops being significant when Essel et al. (2022) is removed.
  - Social–emotional outcomes: g=0.301 (0.048–0.553).
  - No bias-corrected estimate is reported. — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13284697/)
- **Fan, C., Ke, L., Chen, Z., & Lv, P. (2026).** Exploring the effect of GenAI on learning outcomes in higher education: a three-level meta-analysis. *Frontiers in Psychology*, 17, 1758670. DOI 10.3389/fpsyg.2026.1758670. Published online 15 May 2026. [PEER-REVIEWED; IN WINDOW] Not the same Fan as in Wang & Fan (Wenxiang Fan).
  - 36 studies, 132 effect sizes, 7,229 participants. Overall g=0.499 (95% CI 0.372–0.627).
  - Egger's tests were n.s., and there is no bias-corrected estimate.
  - Only teaching method was a significant moderator (collaborative learning g=1.026). Discipline, platform, model version and duration were n.s., and programming was not analyzed as a moderator.
  - Excluding low-quality studies gives g=0.477. — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13219050/)
- **Wang & Fan (2025) retraction**, *Humanities and Social Sciences Communications* (51 studies; reported g=0.867 on learning performance).
  - **What the notice says:** it cites "discrepancies in the meta-analysis" that undermine the editor's confidence in the analysis and its conclusions.
  - **Date conflict:** GovTech (article dated 6 May 2026, fetched) gives the notice date as **22 April 2026**, and search snippets attribute the same date to other coverage. PlagiarismToday (15 Jul 2026) says May 2026, so the sources conflict. The notice itself could not be fetched because of an authentication redirect. — [GovTech (press)](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt); [AI Weekly (press)](https://aiweekly.co/alerts/springer-nature-pulls-cited-chatgpt-in-education-meta-analysis); [PlagiarismToday (press)](https://www.plagiarismtoday.com/2026/07/15/study-claiming-ai-helps-students-learn-retracted/); [Nature article page](https://www.nature.com/articles/s41599-025-04787-y)
  - **The main critique:** Ingebrigtsen & Lukic (UiT The Arctic University of Norway), June 2025, "Substantial Errors Invalidate The Conclusion From Wang And Fan (2025) About ChatGPT And Learning Outcomes".
    - Their objections: discrepancies in the number of included studies, inappropriate weighting, inclusion of a retracted study and mislabeled studies, and studies that were too small or implausibly large. They argued the paper's own forest plot implies about 0.5, not 0.867, and requested retraction.
    - According to PlagiarismToday, Springer Nature said the retraction was largely due to their efforts, the authors never responded to outreach, and the paper had been cited more than 500 times. — [PlagiarismToday (press)](https://www.plagiarismtoday.com/2026/07/15/study-claiming-ai-helps-students-learn-retracted/)
  - **Earlier critics:** Ilkka Tuomi (no quality assessment; small experimental groups) and Ben Williamson (May 2025 blog: "methodologically flawed, overhyped and misleading"). — [GovTech (press)](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt); [PlagiarismToday (press)](https://www.plagiarismtoday.com/2026/07/15/study-claiming-ai-helps-students-learn-retracted/)
- **Liu et al. (2026) still cite Wang & Fan (2025)** in the reference list of their October 2026 working paper. This shows how far the retracted estimate has travelled. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Reviews in the window, content not verified:**
  - an MDPI scoping review of vibe coding in university computing education;
  - the UML/ER LLM systematic review (arXiv:2607.26100);
  - an ICER 2026 scoping review on GenAI and higher-order thinking in programming education in Africa (Kadams, Oyelere & Omeh). — [MDPI](https://www.mdpi.com/3042-8130/2/4/34); [arXiv](https://arxiv.org/pdf/2607.26100); [ICER 2026 program](https://icer2026.acm.org/track/icer-2026-papers)

### Inferences
- **Uncorrected pooled effects should not be cited as evidence of learning.** Pooled g's of about 0.5–1.1 come with near-universal risk-of-bias concerns, and the best bias-corrected estimate is about zero.
- **The key distinction is missing.** None of the new meta-analyses separates outcomes measured with AI access from those measured without it, which is the distinction that matters for an AI-level-0/1 exam. Boolzen et al.'s finding that 33 studies compared non-equivalent cognitive activities is the closest they come.

### Gaps
- The retraction notice itself was not read, so the exact date (22 April vs May 2026) is unresolved.
- The publication venue of the Ingebrigtsen & Lukic critique was not verified.
- No in-window meta-analysis specific to programming education was found.

## Q7. New studies on students' self-assessment / illusion of competence, over-reliance, or "metacognitive laziness" with AI

### Takeaway
**In-window evidence on miscalibration is mostly observational or small:**
- A Vietnamese study of 1,498 undergraduates found a 2.07-point gap between AI-assisted assignment quality and mastery checked without devices.
- In the Maryland RCT, students mostly asked the tutor for information or solutions (0.7% asked for feedback on their own work).
- In the ICER Copilot study, students did not rate their AI-assisted work higher even though they scored 14 points more, and they later forgot more.

The cleanest experimental result on perceived vs actual understanding is pre-window (CHIWORK '26): a standard LLM gave the highest perceived understanding and the lowest objective learning.

### Cited Findings
- **Đức Minh (2026)**, "AI-assisted learning and the illusion of competence: Measuring the AI-learning gap through random knowledge verification", *Journal of Interdisciplinary Studies in Education* 15(4), 45–82. Published 15 Jun 2026, DOI 10.32674/nrmwyw65. [JOURNAL ARTICLE; peer-review rigour and standing not verified; IN WINDOW; single author; not labelled as an experiment]
  - 1,498 undergraduates in 38 classes at a Vietnamese public university.
  - Assignment quality averaged M=7.62, while mastery under device-restricted random oral and written verification averaged M=5.55. The "AI–Learning Gap" is 2.07.
  - The page gives no scale or reliability details. — [JISE](https://mail.ojed.org/jise/article/view/10832)
- **Gardella et al. (ICER 2026)** (see Q1): AI's effect on self-grades was g=−0.13 (n.s.), despite +14.09 points of actual performance. The authors suggest a loss of "perceived credit". — [arXiv](https://arxiv.org/html/2604.18538)
- **Contractor & Reyes** (see Q1): learning enjoyment +0.58 on a 0–10 scale (p=0.063); the effect on perceived skill was small and insignificant. — [arXiv v2 HTML](https://arxiv.org/html/2607.08849v2)
- **Liu et al.** (see Q1):
  - Requests: 73.8% information, explanations or solutions; 0.7% feedback on own work.
  - Tutor users reported asking instructors fewer content questions and sending fewer emails and LMS messages (descriptive).
  - Recorded LMS participation −0.90 SD. — [PDF](https://edworkingpapers.com/sites/default/files/ai26-1598.pdf)
- **Strömberg et al.:** about 80% of AI users showed homework-outsourcing signatures (secondary school; observational). — [IDEAS](https://ideas.repec.org/p/cpr/ceprdp/21577.html)
- **Fawzy et al.:** a perception–action gap; awareness of AI risks does not come with the ability to verify unless the user is experienced. — [arXiv](https://arxiv.org/abs/2605.24521)
- **ICER 2026:**
  - Tran, Harper & Price, "'Why Put In This Much Effort?': How AI Availability Shapes Students' Motivation in Introductory Programming": the abstract was not accessible.
  - Prather et al., "A Validated Scale Measuring Student Self-Efficacy for Programming with Generative AI": an instrument, not an outcome study. — [ICER 2026 program](https://icer2026.acm.org/track/icer-2026-papers)
- **Teo et al.:** LLM tutors over-assist, intervening early with complete solutions (simulation). — [arXiv](https://arxiv.org/abs/2607.21306)
- **PRE-WINDOW: Eleftheriou, Pallis & Constantinides** (arXiv:2604.09444, Apr 2026; CHIWORK '26), n=85. The standard LLM produced "high perceived understanding despite the lowest objective learning". Future-self explanations gave the closest alignment between perceived and actual understanding, and guided hints the largest learning gains. — [arXiv](https://arxiv.org/abs/2604.09444); [ACM DL](https://dl.acm.org/doi/10.1145/3808045.3808055)

### Inferences
- **The direction is clear, the measurement is not.** In-window data show that AI-assisted output overstates independent mastery (the 2.07 ALG; Gardella's retest drop). But no in-window study measured calibration directly in programming, as students' predicted unaided score against their actual unaided score.
- **Gardella cuts the other way in-session.** Students under-credited their AI-assisted work. So the risk may be less "I think I am great" and more "I do not notice what I failed to encode", which is consistent with the retest drop (inference).
- **For the student:** the harness's explanation-in-own-words check and unaided spaced reviews work like "random knowledge verification", the instrument the JISE study used to expose the gap (inference).

### Gaps
- No in-window RCT measuring metacognitive calibration (confidence vs unaided performance) in programming or OOD.
- No in-window replication or critique of Fan et al. (2025) on "metacognitive laziness" was found; only general searches were run.
- The results of the Tran, Harper & Price ICER paper are unknown.
- Not examined: arXiv:2606.08568, "Regulating the AI Tutor: Intentions, Help-Seeking, and Self-Regulated Learning in Adolescent GenAI Use" (June 2026, adolescents); only the title was seen.
