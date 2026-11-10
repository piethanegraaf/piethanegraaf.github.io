# Citation check: generative-AI studies cited in the literature review (checked 7 November 2026)

## 1. Bastani et al. (2025), PNAS 122(26), e2422633122: ~1,000 Turkish high-school students; GPT Base +48% practice / −17% exam; GPT Tutor +127% practice / no significant exam harm

### Takeaway
**Verdict: correct.** All four effect sizes match the published abstract and regression tables. The design is a classroom-randomized field experiment at one Turkish high school with "nearly a thousand" students in grades 9–11. One correction has been published, but it only fixes an author affiliation, not the results.

### Cited Findings
- Title "Generative AI without guardrails can harm learning: Evidence from high school mathematics". Authors: Hamsa Bastani, Osbert Bastani, Alp Sungu, Haosen Ge, Özge Kabakcı, Rei Mariman. PNAS vol. 122, issue 26, article e2422633122. Published online 25 June 2025; print issue July 2025. — [Crossref record](https://api.crossref.org/works/10.1073/pnas.2422633122); DOI https://doi.org/10.1073/pnas.2422633122
- Abstract (verbatim fragments): "a field experiment where we provide nearly a thousand high school math students with access to generative AI tutors"; "48% improvement in grades for GPT Base and 127% for GPT Tutor"; "when access is subsequently taken away, students actually perform worse than those who never had access (17% reduction in grades for GPT Base)"; "These negative learning effects are largely mitigated by the safeguards in GPT Tutor." — [Crossref abstract](https://api.crossref.org/works/10.1073/pnas.2422633122)
- Design:
    - One "large high school in Turkey", Fall term of the 2023–2024 school year, grades 9, 10 and 11, "about fifty" classes.
    - Randomization is at the classroom level. Honors classrooms are excluded from the main sample.
    - Four 90-minute sessions covering about 15% of each grade's curriculum, 57 practice problems in total.
    - Arms: Control (course books and notes), GPT Base (a ChatGPT-like interface on GPT-4), and GPT Tutor (GPT-4 with teacher-designed guardrails).
    - The main regression has 2,848 observations.
    - Source: [Europe PMC full text PMC12232635](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12232635/fullTextXML)
- Practice (assisted) performance vs. control (control mean 0.284): GPT Base +0.137 (SE 0.031, p<0.01) = 48%; GPT Tutor +0.361 (SE 0.032, p<0.01) = 127%. — [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12232635/fullTextXML)
- Unassisted exam vs. control (control mean 0.321): GPT Base −0.054 (SE 0.022, p<0.05), about −17%; GPT Tutor −0.004 (SE 0.013), not significant, described as "statistically indistinguishable" from control. — [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12232635/fullTextXML)
- Students' self-perceptions were "overly optimistic":
    - GPT Base students did not perceive that they had learned less.
    - GPT Tutor students perceived that they performed significantly better.
    - Source: [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12232635/fullTextXML)
- Author-stated limitations: one subject and one school; data from Fall 2023; only short-term outcomes (constraints set by the school); mechanisms inferred from observational analyses; five class sessions did not receive their assigned treatment (intention-to-treat analysis). — [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12232635/fullTextXML)
- Correction: PNAS 122(34), e2518204122, published 20 Aug 2025 (issue date 26 Aug 2025). It only corrects Osbert Bastani's affiliation, "due to a production error". — [Correction text, Europe PMC PMC12403119](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12403119/fullTextXML); [Crossref "updated-by"](https://api.crossref.org/works/10.1073/pnas.2422633122)
- An SSRN working-paper version (abstract 4895486) was first posted in July 2024 and last revised in April 2026, according to a search-result snippet. I did not open it. — [SSRN](https://papers.ssrn.com/abstract=4895486)

### Inferences
- "−17%" is relative to the control group's mean exam score (0.054/0.321), not percentage points. Phrase it as "17% lower exam grades than the control group".
- "No significant exam harm" for GPT Tutor is accurate, but the tutor also brought no exam benefit: its 127% practice gain did not transfer to the unassisted exam.
- "About 1,000" is fine; the paper says "nearly a thousand".

### Gaps
- The PNAS page returned HTTP 403. I used the Crossref abstract and the Europe PMC full text of the same article instead.
- I found no replication or formal published critique.

## 2. Shen & Tamkin (2026), arXiv:2601.20245, "How AI Impacts Skill Formation" (Anthropic Fellows)

### Takeaway
**Verdict: mostly correct, but needs precision.**

- Design: randomized between-subjects experiment, n = 52 analyzed (26 per arm), developers learning Python Trio.
- Quiz: AI group 50% vs. 67% without AI (Cohen's d = 0.738, p = 0.010). The largest gap was on debugging questions.
- Speed: the AI group was about 2 minutes faster, not statistically significant.
- The six interaction patterns were identified **post hoc** from screen recordings. They were not randomized, and each pattern has only n = 2–7 participants.
- Status: still an arXiv preprint (v2, 1 Feb 2026). I found no peer-reviewed version.

### Cited Findings
- arXiv v1 is dated 28 Jan 2026 and v2 is dated 1 Feb 2026 (comment: "V2: Fixed typos in Table 1 (Balance Table), corrected osf link"). No journal-ref. — [arXiv abstract page](https://arxiv.org/abs/2601.20245)
- Anthropic's write-up "How AI assistance impacts the formation of coding skills" was published on 29 Jan 2026. — [Anthropic research page](https://www.anthropic.com/research/AI-assistance-coding-skills)
- Affiliations: Shen did the work as part of the Anthropic Fellows Program; Tamkin is at Anthropic. The protocol was approved by internal reviewers at Anthropic. — [arXiv HTML v2](https://arxiv.org/html/2601.20245v2)
- Pre-registration: OSF record osf.io/w49e7 (dated 9 June 2025 in OpenAlex). No other published version is indexed. — [OpenAlex search](https://api.openalex.org/works?search=How%20AI%20Impacts%20Skill%20Formation); [OSF](https://osf.io/w49e7)
- Design (from the paper):
    - Between-subjects random assignment to an AI-assistant arm or a no-AI arm.
    - The assistant's "base model … is GPT-4o"; it could see the participant's code and produce the full correct solution.
    - Four pilot studies (A–D) came first. In one pilot about 25% of control participants still used AI, which led to stricter checks.
    - Main study: 58 contacted, 53 completed, 1 disqualified under preregistered criteria, leaving 52 analyzed (26 per condition).
    - Recruitment through an unnamed third-party crowdworker platform; flat payment of $150.
    - Inclusion: more than 1 year of Python, codes in Python at least weekly, has tried AI coding assistance, has never used Trio.
    - Source: [arXiv HTML v2](https://arxiv.org/html/2601.20245v2)
- Population: the blog says "52 (mostly junior) software engineers". The paper describes mostly professional or freelance developers, typically with a bachelor's degree, aged 25–35. — [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills); [arXiv HTML v2](https://arxiv.org/html/2601.20245v2)
- Task and test:
    - A warm-up, then two Trio tasks with a 35-minute limit.
    - Then a 14-question, 27-point quiz without AI. Per the blog, it "focused most heavily on debugging, code reading, and conceptual problems".
    - Source: [arXiv HTML v2](https://arxiv.org/html/2601.20245v2); [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills)
- Main result, quoted from the paper: "There is a 4.15 point difference between the means of the treatment and control groups. For a 27-point quiz, this translates into a 17% score difference or 2 grade points"; Cohen's d = 0.738, p = 0.01. With warm-up time as a covariate: d = 0.725, p = 0.016. — [arXiv HTML v2](https://arxiv.org/html/2601.20245v2)
- Blog wording:
    - "the AI group averaged 50% on the quiz, compared to 67% in the hand-coding group"
    - "The largest gap in scores between the two groups was on debugging questions"
    - "participants in the AI group finished about two minutes faster, although the difference was not statistically significant"
    - Source: [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills)
- Code reading showed the smallest gap of the sub-scores. — [arXiv HTML v2](https://arxiv.org/html/2601.20245v2) (as extracted by the fetch tool)
- Interaction patterns: "we manually annotated screen recordings of the 51 participants in the main study" (one AI-condition recording was unavailable).
    - Low-scoring (<40%): AI Delegation (n=4), Progressive AI Reliance (n=4), Iterative AI Debugging (n=4).
    - High-scoring (≥65%): Generation-Then-Comprehension (n=2), Hybrid Code-Explanation (n=3), Conceptual Inquiry (n=7).
    - Source: [arXiv HTML v2](https://arxiv.org/html/2601.20245v2)
- The abstract says: "We identify six distinct AI interaction patterns, three of which involve cognitive engagement…", and that these preserve learning outcomes. — [arXiv abstract](https://arxiv.org/abs/2601.20245)
- Stated limitations: a single task using a chat interface (no agentic tools); a one-hour window; no real job incentive to learn Trio; prompting skill self-reported; a single quiz; no human-assistance arm. — [arXiv HTML v2](https://arxiv.org/html/2601.20245v2)

### Inferences
- "~50% vs ~67%" is correct.
- "17% lower" means about 17 **percentage points**; in relative terms the drop is about 25%.
- The paper's own figure of 4.15 out of 27 points is 15.4 points, so "17%" is approximate.
- The six patterns are descriptive and post hoc, with very small cells. The review must not present them as randomized or causal evidence (for example, "conceptual inquiry protects learning").
- "Mostly junior" (blog) vs. "professional/freelance, 25–35" (paper): use the paper's description.

### Gaps
- I did not extract a numeric p-value for the completion-time comparison or effect sizes per sub-score.
- I found no peer-reviewed or conference version as of 7 Nov 2026.

## 3. Lehmann, Cornelius & Sting, arXiv:2409.09047, "AI meets the classroom: When do large language models harm learning?"

### Takeaway
**Verdict: the description "field study plus two pre-registered lab experiments" is correct, but the findings are easy to overstate.**

- Only **LLM access** was randomized, within each lab experiment.
- Copy-paste was disabled in experiment 1 and enabled in experiment 2. That is a difference between the studies, not a randomized factor.
- Neither lab experiment found a significant average effect on learning.
- The "widening gap" comes from an **exploratory** pooled interaction after a median split.
- Status: still a working paper (arXiv v2 of 8 Mar 2025, plus SSRN). I found no journal version.

### Cited Findings
- arXiv v1 is dated 29 Aug 2024 and v2 (current) 8 Mar 2025. Current title: "AI Meets the Classroom: When Do Large Language Models Harm Learning?" — [arXiv abstract page](https://arxiv.org/abs/2409.09047)
- An earlier SSRN version has the title "AI Meets the Classroom: When Does ChatGPT Harm Learning?" (posted content, 2024). No journal-article record appears in Crossref or OpenAlex. — [Crossref search](https://api.crossref.org/works?query.bibliographic=AI+Meets+the+Classroom+When+Do+Large+Language+Models+Harm+Learning+Lehmann); DOI https://doi.org/10.2139/ssrn.4941259
- Abstract, summarized:
    - The two pre-registered, incentivized lab experiments find no overall effect.
    - Exploratory analyses and the field study suggest that the effect depends on how students use LLMs. Substitution (for example, generating solutions) broadens the topics covered but reduces understanding. Complementing (asking for explanations) improves understanding.
    - "LLMs widen the gap between students with low and high prior knowledge."
    - Source: [arXiv](https://arxiv.org/abs/2409.09047); [arXiv HTML v2](https://arxiv.org/html/2409.09047v2)
- Field study (Study 1):
    - Setting: Spring 2023, two graduate Python courses at a public Dutch university, 56 IS + 57 BA = 113 students, N = 6,594 student-question observations.
    - LLM use was **not observed**. The proxy is "ChatGPT Similarity" to 50 ChatGPT outputs per question (Damerau–Levenshtein).
    - Two-way fixed effects: similarity +0.18 (p<0.01), cumulative similarity −0.02 (p<0.01).
    - IV estimate using ChatGPT outages: similarity −0.35 (SE 0.56, not significant), cumulative −0.06 (SE 0.02, p≈0.002).
    - Source: [arXiv HTML v2](https://arxiv.org/html/2409.09047v2)
- Lab experiment 1 (Study 2):
    - 108 recruited, 107 analyzed. LLM access was randomized for the 45-minute learning phase (24 practice parts). Copy-paste was disabled for everyone.
    - Pre-registered on AsPredicted. Pre- and post-tests of 20 questions each. Incentive: €10 plus €1 per solved post-test question.
    - Post-test 7.9 (control) vs. 9.0 (treatment), p = 0.206. Regression coefficient +0.396 (SE 0.713), p = 0.580.
    - Source: [arXiv HTML v2](https://arxiv.org/html/2409.09047v2)
- Lab experiment 2 (Study 3):
    - 72 enrolled, 69 analyzed. An "exact replication" of Study 2, except that copy-paste was enabled.
    - Learning-phase volume 14.3 vs. 18.0 (p = 0.003; regression +2.614, p = 0.013).
    - Post-test 6.8 vs. 8.8 (p = 0.092; regression +0.959, p = 0.298). Understanding −0.651 (p = 0.359).
    - Source: [arXiv HTML v2](https://arxiv.org/html/2409.09047v2)
- "Widening gap":
    - Exploratory (Section 9, "Exploratory Analyses"); Studies 2 and 3 pooled, N = 176, median split on the pre-test.
    - Treatment × high-prior interaction: on the post-test +2.528 (SE 1.142, p = 0.028); on understanding +1.613 (SE 0.754, p = 0.034).
    - Treated students with low prior knowledge understood less than the controls (−0.950, SE 0.466, p = 0.043).
    - Source: [arXiv HTML v2](https://arxiv.org/html/2409.09047v2)
- Usage types:
    - Pooled message coding: 54.1% requests for Solutions, 24.4% for Explanations.
    - Within the treated students (N = 94): Solutions are associated with lower understanding (−0.312, p<0.01) and Explanations with higher understanding (+0.249, p<0.05).
    - 42% of solution requests were sent without any attempt at the question.
    - Source: [arXiv HTML v2](https://arxiv.org/html/2409.09047v2)

### Inferences
- The usage-type effects are correlational, because students chose how to use the LLM. The field study is observational (with an IV).
- An accurate one-line summary: "no average effect on learning; potential harm when LLMs substitute for practice, and (exploratory) for low-prior-knowledge students".
- Watch the name clash: "The widening gap" is also the title of Prather et al. (2024), a different study (see item 8).

### Gaps
- I found no journal publication (searched Crossref, OpenAlex and the web); the paper may be under review.
- I did not read the last ~15% of the HTML (the end of the discussion).

## 4. Kestin et al. (2025), Scientific Reports 15, 17458: AI tutor vs. in-class active learning

### Takeaway
**Verdict: correct if described as a short, two-lesson crossover RCT with immediate post-tests (n = 194 analyzed).**

- There was no delayed retention test, so the study shows short-term learning only.
- Time on task: median 49 minutes with the AI tutor vs. about 60 minutes in class.
- The AI condition was done at home with a heavily scaffolded tutor (expert prompts, pre-written answers).

### Cited Findings
- Title "AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting". Authors: Kestin, Miller, Klales, Milbourne, Ponti. Sci Rep 15(1), article 17458, published 3 June 2025; PMID 40537565; PMCID PMC12179260. — [Europe PMC record](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1038/s41598-025-97652-6&format=json&resultType=core); DOI https://doi.org/10.1038/s41598-025-97652-6
- Preprint on Research Square: 10.21203/rs.3.rs-4243877/v1. — [Crossref record](https://api.crossref.org/works/10.1038/s41598-025-97652-6)
- Sample: 233 enrolled, 194 analyzed. 39 were excluded under the eligibility criteria: consent, participation in both conditions, and completion of all tests. Course: Harvard Physical Sciences 2 (introductory physics for life sciences), Fall 2023. — [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)
- Crossover design:
    - Two consecutive weeks (course weeks 9 and 10); topics surface tension and fluid flow.
    - Group 1 used the AI tutor **at home** in week 1 while Group 2 had the in-class active-learning lesson. The conditions were reversed in week 2.
    - Randomization was by intact peer-instruction groups of 2–3 students.
    - Source: [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)
- Outcome timing: a pre-class quiz before and a post-class quiz after each lesson. No delayed retention test is reported. — [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)
- Learning results:
    - Median post-test 4.5 (AI, N = 142) vs. 3.5 (in-class, N = 174); median pre-test 2.75. Mann–Whitney z = −5.6, p<10⁻⁸.
    - Regression effect size 0.63; quantile regression gives 0.73–1.3 SD. The authors describe the gains as "over double".
    - Source: [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)
- Time on task: AI median 49 minutes, and 70% of AI students spent less than 60 minutes. The in-class session was 75 minutes including 15 minutes of tests, so 60 minutes of learning is assumed. Time on task was not correlated with post-test scores. — [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)
- Affect: engagement 4.1 vs. 3.6 (p<0.0001), motivation 3.4 vs. 3.1 (p<0.001). 83% rated the AI tutor's explanations as good as or better than human instructors'. — [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)
- Limitations the authors state:
    - A ceiling effect.
    - "we do not presume that structured AI tutoring will always outperform in-class active learning in all contexts", especially for complex synthesis and higher-order thinking.
    - Results depend on context and on expert-crafted, question-specific prompts.
    - The tutor's accuracy relied on pre-written answers.
    - "significant overhead" to build the lessons.
    - The control introductions were live, while the AI introductions were pre-recorded video.
    - Source: [Europe PMC full text](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)

### Inferences
- The study supports a short-term claim (immediate post-test), not a claim about retention or durable learning.
- Delivery confounds between conditions: home vs. classroom, video vs. live introductions, and a tutor with pre-written answers.
- The reported post-test Ns (142 + 174 = 316) do not obviously reconcile with 194 students × 2 lessons. The paper as extracted does not explain this.

### Gaps
- The text I extracted does not specify the exact interval between the lesson and the post-test.
- I found no replication.

## 5. Fan et al. (2025), British Journal of Educational Technology 56(2), 489–530, "Beware of metacognitive laziness"

### Takeaway
**Verdict: the bibliographic details and n = 117 are correct.**

- Design: a randomized experiment with four support conditions on a writing task.
- ChatGPT produced the largest essay-score improvement, but knowledge gain and transfer did **not** differ between groups.
- "Metacognitive laziness" is the authors' interpretation, not a measured outcome.
- **I found no evidence of AI-written reflections**: they appear in neither the abstract nor the appendix tables. I could not read the full text to rule them out entirely.

### Cited Findings
- "Beware of metacognitive laziness: Effects of generative artificial intelligence on learning motivation, processes, and performance". Authors: Fan, Tang, Le, Shen, Tan, Zhao, Shen, Li, Gašević. BJET vol. 56, issue 2, pp. 489–530. Online 10 Dec 2024; issue March 2025. — [Crossref record](https://api.crossref.org/works/10.1111/bjet.13544); DOI https://doi.org/10.1111/bjet.13544
- Abstract:
    - "we conducted a randomised experimental study and compared learners' motivations, self-regulated learning processes and learning performances on a writing task".
    - Conditions: ChatGPT, "chat with a human expert, writing analytics tools, and no extra tool".
    - "A total of 117 university students were recruited".
    - Results: (1) no difference in post-task intrinsic motivation; (2) significant differences in the frequency and sequences of SRL processes; (3) "ChatGPT group outperformed in the essay score improvement but their knowledge gain and transfer were not significantly different".
    - "may promote learners' dependence on technology and potentially trigger 'metacognitive laziness'".
    - Source: [Crossref abstract](https://api.crossref.org/works/10.1111/bjet.13544)
- arXiv version: 2412.09315, v1 dated 12 Dec 2024. — [arXiv](https://arxiv.org/abs/2412.09315)
- Appendix tables of the arXiv version (descriptive means only):
    - Group sizes: CN 27, AI 35, HE 25, CL 30 (= 117).
    - Mean essay-score improvement: CN 1.630, AI 3.600, HE 1.480, CL 1.400.
    - Mean knowledge gain: CN 0.200, AI 0.193, HE 0.137, CL 0.161.
    - Mean transfer: CN 0.785, AI 0.782, HE 0.771, CL 0.777.
    - Source: [arXiv HTML v1](https://arxiv.org/html/2412.09315v1)
- Neither the abstract nor the appendix tables mention reflections, whether written by AI or by students. — [Crossref abstract](https://api.crossref.org/works/10.1111/bjet.13544); [arXiv HTML v1](https://arxiv.org/html/2412.09315v1)

### Inferences
- If the review says this study involved AI-written reflections, that is probably a mix-up with another study. In this study the AI group used ChatGPT as support while revising an essay.
- Present "metacognitive laziness" as a hypothesis the authors draw from the SRL process data. They did not measure it as a construct.
- Numerically, the AI group's knowledge gain (0.193) was about the same as the control group's (0.200).

### Gaps
- The Wiley full text returned 403, and the arXiv HTML rendered only the appendices. Not verified: the essay topic, the durations, how the SRL processes were captured, and the inferential statistics.
- The excerpt does not define "CL" (presumably the writing-analytics/checklist condition).

## 6. Kazemitabaar et al. (2023), CHI: 69 learners aged 10–17, Codex vs. none; retention after one week

### Takeaway
**Verdict: correct.** On the post-tests one week later, the Codex group did slightly better, but the difference was not significant. Learners with higher prior (Scratch) scores benefited significantly on retention if they had Codex.

### Cited Findings
- "Studying the effect of AI Code Generators on Supporting Novice Learners in Introductory Programming". CHI '23 proceedings, pp. 1–23, 19 Apr 2023. — [Crossref record](https://api.crossref.org/works/10.1145/3544548.3580919); DOI https://doi.org/10.1145/3544548.3580919
- Abstract:
    - "a controlled experiment with 69 novices (ages 10-17)". Learners worked on 45 Python code-authoring tasks, "for which half of the learners had access to Codex", each followed by a code-modification task.
    - Codex gave "1.15x increased completion rate and 1.8x higher scores" without lowering performance on the manual code-modification tasks.
    - "learners with access to Codex during the training phase performed slightly better on the evaluation post-tests conducted one week later, although this difference did not reach statistical significance."
    - Learners with higher Scratch pre-test scores performed significantly better on the retention post-tests if they had prior access to Codex.
    - Source: [OpenAlex abstract](https://api.openalex.org/works/doi:10.1145/3544548.3580919)
- The evaluation had an immediate post-test and a retention post-test one week later, each with 10 coding tasks and 40 MCQs (as described in the companion Koli paper). — [ar5iv, Koli paper](https://ar5iv.labs.arxiv.org/html/2309.14049)

### Inferences
- The accurate reading is "no retention penalty detected", not "a retention benefit". The sample was small, consisted of children and teenagers, and used a Codex-era tool.

### Gaps
- I did not extract the assignment and balancing procedure, or the exact statistics.

## 7. Kazemitabaar et al. (2023b), Koli Calling: usage patterns and retention

### Takeaway
**Verdict: observational, not randomized, and the links to retention were not significant.**

- Method: a thematic analysis of the log data from the 33 Codex-condition learners of the CHI study, which identified four coding approaches.
- Regressions between approach use and the immediate and retention post-tests found **no significant relationships**, only "trends".

### Cited Findings
- "How Novices Use LLM-based Code Generators to Solve CS1 Coding Tasks in a Self-Paced Learning Environment". Koli Calling '23 proceedings, pp. 1–12, 13 Nov 2023. — [Crossref record](https://api.crossref.org/works/10.1145/3631802.3631806); DOI https://doi.org/10.1145/3631802.3631806
- Abstract:
    - "thematic analysis on a data set from 33 learners, aged 10-17".
    - Four approaches: AI Single Prompt, AI Step-by-Step, Hybrid, Manual.
    - "consistently positive trends between learners' utilization of the Hybrid coding approach and their post-test evaluation scores, while showing consistent negative trends between the AI Single Prompt and the post-test evaluation scores".
    - Source: [OpenAlex abstract](https://api.openalex.org/works/doi:10.1145/3631802.3631806)
- Method:
    - The authors "only focus on the log data from the 33 learners in the Codex condition" of the earlier 69-participant study.
    - The linear regressions between approach use and the immediate and retention post-test scores "did not reveal any significant relationships".
    - Source: [ar5iv full text](https://ar5iv.labs.arxiv.org/html/2309.14049)

### Inferences
- The data are correlational, from one arm, with self-selected approaches and non-significant trends. They cannot support causal claims such as "single-prompt use reduces retention".

### Gaps
- The regression coefficients appear only in a figure and were not extracted.

## 8. Prather et al. (2024), ICER, "The Widening Gap": n = 21

### Takeaway
**Verdict: correct (n = 21).** This is a qualitative lab study with observation, interviews and eye tracking. It replicates and extends an earlier study on novice metacognition. There is no control group and no measured learning outcome.

### Cited Findings
- "The Widening Gap: The Benefits and Harms of Generative AI for Novice Programmers". Authors: Prather, Reeves, Leinonen, MacNeil, Randrianasolo, Becker, Kimmel, Wright, Briggs. ICER 2024 Vol. 1, pp. 469–486, 12 Aug 2024. — [Crossref record](https://api.crossref.org/works/10.1145/3632620.3671116); DOI https://doi.org/10.1145/3632620.3671116
- Abstract:
    - "we replicate a previous study that examined novice programming problem solving behavior and extend it by incorporating GenAI tools"
    - "Through 21 lab sessions consisting of participant observation, interview, and eye tracking"
    - "20 of 21 students completed the assigned programming problem"
    - There was a divide between students who struggled and those who did not. In struggling students, metacognitive difficulties persisted and GenAI could "compound them". Struggling students "finished with an illusion of competence".
    - Source: [OpenAlex abstract](https://api.openalex.org/works/doi:10.1145/3632620.3671116)
- The arXiv version (2405.17739) carries the comment "Accepted to ICER 2024". — [arXiv API record](https://export.arxiv.org/api/query?id_list=2302.07427,2309.14049,2405.17739,2404.13414&max_results=10)

### Inferences
- The "widening gap" is an interpretive qualitative pattern, not a statistically tested interaction. Don't confuse it with the exploratory interaction in Lehmann et al. (item 3).

### Gaps
- I did not extract the institution or course of the participants.

## 9. Kosmyna et al. (2025), arXiv:2506.08872, "Your brain on ChatGPT"

### Takeaway
**Verdict: the sample sizes are correct (54 in sessions 1–3; 18 in session 4).** The paper is still a non-peer-reviewed arXiv preprint: v2 of 31 Dec 2025 has no journal-ref. A formal methodological comment has been posted (arXiv:2601.00856).

### Cited Findings
- Title "Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task", 8 authors (Kosmyna … Maes). v1 is dated 10 Jun 2025 and v2 31 Dec 2025. Comment field: "216 pages, 102 figures, 4 tables and appendix". No journal-ref. — [arXiv abstract page](https://arxiv.org/abs/2506.08872)
- Design: three groups (LLM, search engine, brain-only). Measures: EEG, NLP analysis, teacher grading, and an AI judge. 54 participants took part in sessions 1–3 and 18 completed session 4. — [arXiv abstract page](https://arxiv.org/abs/2506.08872)
- Formal comment: Stanković, Hirche, Kollatzsch & Doetsch, "Comment on: Your Brain on ChatGPT…", arXiv:2601.00856, v1 dated 29 Dec 2025. It raises concerns about the study design and small sample, reproducibility, EEG methodology, inconsistent reporting, and transparency. Its stated aim is to help make the manuscript "publication-ready". — [arXiv:2601.00856](https://arxiv.org/abs/2601.00856)
- The comment reportedly points out that the original states 55 participants completed all experiments while 54 are reported. This comes from a search-result summary of the comment and was not verified in its full text. — [arXiv:2601.00856](https://arxiv.org/abs/2601.00856)
- Other indexed commentaries, whose content I did not read:
    - Armitage (2025), "Your brain on ChatGPT", *British Journal of General Practice*, DOI 10.3399/bjgp25x743181.
    - Campos & Koff (2026), "Your brain on ChatGPT, but whose brain? The missing adolescent in AI-cognition research", *Frontiers in Developmental Psychology*, DOI 10.3389/fdpys.2026.1885225.
    - Source: [OpenAlex search](https://api.openalex.org/works?search=Your%20Brain%20on%20ChatGPT%20cognitive%20debt)

### Inferences
- Cite it explicitly as a preprint. The session-4 "crossover" claims rest on n = 18, and the EEG findings come from a small sample.

### Gaps
- I could not determine whether a peer-reviewed version is in press, or whether the authors have replied to the comment.

## 10. Gerlich (2025), Societies 15(1), 6: design, n, corrections and critiques

### Takeaway
**Verdict: n = 666 is correct.** This is a cross-sectional, correlational mixed-methods study (survey plus interviews), so it supports no causal claims.

- A **correction** was published in Societies 15(9), 252 on 10 Sep 2025 ("Error in Table …"). Its content was not accessible.
- I found no formal published critique, only secondary commentary that points out the correlational design.

### Cited Findings
- "AI Tools in Society: Impacts on Cognitive Offloading and the Future of Critical Thinking". Societies vol. 15, issue 1, article 6, published 3 Jan 2025. — [Crossref record](https://api.crossref.org/works/10.3390/soc15010006); DOI https://doi.org/10.3390/soc15010006
- Abstract:
    - "Utilising a mixed-method approach, we conducted surveys and in-depth interviews with 666 participants".
    - Analysis: ANOVA, correlation analysis, and thematic analysis.
    - Finding: a "significant negative correlation between frequent AI tool usage and critical thinking abilities, mediated by increased cognitive offloading".
    - Younger participants showed higher dependence and lower scores; higher education was associated with better critical thinking.
    - Source: [Crossref abstract](https://api.crossref.org/works/10.3390/soc15010006)
- Correction: "Correction: Gerlich, M. AI Tools in Society: … Societies 2025, 15, 6", Societies 15(9), 252, published online 10 Sep 2025. Its abstract consists only of "Error in Table [...]". — [Crossref record](https://api.crossref.org/works/10.3390/soc15090252); [IDEAS/RePEc listing](https://ideas.repec.org/a/gam/jsoctx/v15y2025i9p252-d1746512.html)
- Secondary coverage:
    - Interviews were held with 50 participants; AI use was self-reported; critical thinking was assessed with the Halpern Critical Thinking Assessment.
    - Gerlich said the study shows correlations, not causation, and reverse causality is plausible.
    - Source: [PsyPost (search snippet, not opened)](https://psypost.org/2025/03/ai-tools-may-weaken-critical-thinking-skills-by-encouraging-cognitive-offloading-study-suggests-227092)

### Inferences
- Treat it as correlational evidence. People with weaker critical-thinking skills may simply rely more on AI.
- Cite it with "(corrected Sep 2025)".

### Gaps
- The content of the correction (which table, and whether the conclusions are affected) is unknown. The MDPI pages blocked automated access, and I did not try to work around that.
- I did not query PubPeer or Retraction Watch directly. The web searches surfaced no retraction or expression of concern, and OpenAlex reports is_retracted = false for related items.

## 11. Lee et al. (2025), CHI: knowledge workers and critical thinking

### Takeaway
**Verdict: correct as a self-report survey: n = 319 knowledge workers sharing 936 first-hand examples.** It measures *perceived* critical-thinking enactment and effort, not critical-thinking ability.

### Cited Findings
- "The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers". Authors: Lee, Sarkar, Tankelevitch, Drosos, Rintel, Banks, Wilson. CHI 2025 proceedings, pp. 1–22, 25 Apr 2025. — [Crossref record](https://api.crossref.org/works/10.1145/3706598.3713778); DOI https://doi.org/10.1145/3706598.3713778
- Abstract:
    - "We survey 319 knowledge workers"; "Participants shared 936 first-hand examples of using GenAI in work tasks".
    - "higher confidence in GenAI is associated with less critical thinking, while higher self-confidence is associated with more critical thinking".
    - Critical thinking shifts toward "information verification, response integration, and task stewardship".
    - Source: [Semantic Scholar record](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1145/3706598.3713778?fields=title,abstract,venue,year)

### Inferences
- Use it only for associations between confidence and perceived effort. It is cross-sectional and self-reported, as the title itself says.

### Gaps
- I did not verify the recruitment platform or the survey instrument.

## 12. Jošt, Taneski & Karakatič (2024), Applied Sciences 14(10), 4115

### Takeaway
**Verdict: n = 32 over 10 weeks, and correlational.** LLM use was unrestricted and not manipulated, there was no control group, and the outcome is final grades.

### Cited Findings
- "The Impact of Large Language Models on Programming Education and Student Learning Outcomes". Applied Sciences 14(10), 4115, published 13 May 2024. — [Crossref record](https://api.crossref.org/works/10.3390/app14104115); DOI https://doi.org/10.3390/app14104115
- Abstract:
    - Setting: undergraduate software development education with React.
    - "an experiment involving thirty-two participants over ten weeks where we examined unrestricted but not specifically encouraged LLM use and their correlation with student performance".
    - A "significant negative correlation" between LLM reliance for code generation and debugging and lower final grades, and a downward trend with average LLM use.
    - A weaker correlation for explanation-seeking use.
    - Source: [Crossref abstract](https://api.crossref.org/works/10.3390/app14104115)

### Inferences
- The paper calls it an "experiment", but the analysis is correlational. Report it that way.

### Gaps
- I did not verify how LLM use was measured (probably self-report); the MDPI page blocked automated access.

## 13. Lyu et al. (2024), L@S, CodeTutor

### Takeaway
**Verdict: n = 50, semester-long between-subjects field study, but not randomized.**

- Researchers allocated students in a stratified way, by prior LLM use and pre-test scores.
- The reported "significant improvement" rests on within-group pre-to-final tests. The paper reports no direct between-group test and no effect sizes.

### Cited Findings
- "Evaluating the Effectiveness of LLMs in Introductory Computer Science Education: A Semester-Long Field Study". L@S '24 proceedings, pp. 63–74. — [Crossref record](https://api.crossref.org/works/10.1145/3657604.3662036); DOI https://doi.org/10.1145/3657604.3662036
- Abstract:
    - "a semester-long, between-subjects study with 50 students using CodeTutor".
    - The CodeTutor group "achieved statistically significant improvements in their final scores compared to peers who did not use the tool".
    - Students without prior LLM experience gained more.
    - Concerns about developing critical thinking; agreement with CodeTutor's suggestions decreased over the semester.
    - Source: [OpenAlex abstract](https://api.openalex.org/works/doi:10.1145/3657604.3662036)
- Details from the paper:
    - Setting: introductory Python at a 4-year US university, 27 Sep–11 Dec 2023. CodeTutor is based on GPT-3.5. The control group had human TAs, and other LLM tools were prohibited.
    - Allocation: sorted by prior LLM use, then split by the pre-test distribution.
    - Measures: a 100-point, 22-question pre-test; outcome = final course grade.
    - Experimental group +12.50 (t = −2.847, p = 0.009) vs. control −3.17 (p = 0.394). Final exam only: +7.33 (p = 0.026).
    - No direct between-group test and no effect sizes reported. No prior LLM use: β = 18.877, p = 0.032.
    - Source: [arXiv HTML v3](https://arxiv.org/html/2404.13414v3)
- Stated limitations: a small single-site sample; a beginner course only; GPT-3.5 accuracy; the control group's environment was hard to control; final grades have many determinants; engagement was voluntary. — [arXiv HTML v3](https://arxiv.org/html/2404.13414v3)

### Inferences
- This is weak causal evidence. The review should call it a quasi-experimental field study, not an RCT.

### Gaps
- The per-arm n is not stated explicitly in the extracted text.

## 14. Stadler, Bannert & Sailer (2024), Computers in Human Behavior 160, 108386

### Takeaway
**Verdict: correct: n = 91 university students randomly assigned to ChatGPT-3.5 or Google search.** ChatGPT lowered cognitive load but also lowered the quality of reasoning and argumentation.

### Cited Findings
- "Cognitive ease at a cost: LLMs reduce mental effort but compromise depth in student scientific inquiry". CHB vol. 160, article 108386, November 2024. — [Crossref record](https://api.crossref.org/works/10.1016/j.chb.2024.108386); DOI https://doi.org/10.1016/j.chb.2024.108386
- Abstract:
    - "A total of 91 university students were randomly assigned to either use ChatGPT3.5 or Google to research the socio-scientific issue of nanoparticles in sunscreen".
    - LLM users had "significantly lower cognitive load" but "lower-quality reasoning and argumentation".
    - The homogeneity of recommendations did not differ between the groups.
    - Source: [OpenAlex abstract](https://api.openalex.org/works/doi:10.1016/j.chb.2024.108386)

### Inferences
- A single-session information-search task. It is not a test of long-term learning.

### Gaps
- I did not extract effect sizes.

## 15. Darvishi et al. (2024), Computers & Education 210, 104967

### Takeaway
**Verdict: correct: a randomized controlled experiment with 1,625 students across 10 courses** on peer-feedback writing. Four weeks of AI prompts were followed by four weeks in four arms. Students "tended to rely on rather than learn from AI assistance".

### Cited Findings
- "Impact of AI assistance on student agency". Authors: Darvishi, Khosravi, Sadiq, Gašević, Siemens. Computers & Education vol. 210, article 104967; issue March 2024, available online in 2023. — [Crossref record](https://api.crossref.org/works/10.1016/j.compedu.2023.104967); DOI https://doi.org/10.1016/j.compedu.2023.104967
- Abstract:
    - "we conducted a randomised controlled experiment … With 1625 students across 10 courses".
    - First four weeks: AI prompts. Next four weeks: arms AI (prompts), NR (no prompts), SR (self-monitoring checklists) and SAI (both).
    - "students tended to rely on rather than learn from AI assistance". When the AI was removed, self-regulation strategies partly filled the gap but were less effective. The hybrid SAI arm was not more effective than AI alone.
    - Source: [OpenAlex abstract](https://api.openalex.org/works/doi:10.1016/j.compedu.2023.104967)

### Inferences
- The outcome is the quality of peer-feedback behavior, not domain knowledge. Citing it as "2024" (issue year) is fine.

### Gaps
- I did not extract per-arm n or effect sizes.

## 16. Anthropic Education Report (8 April 2025): 574,740 conversations; 47% "direct"; computer science share

### Takeaway
**Verdict: correct, with one caveat.** The report itself gives the computer-science share as **36.8%** in the key findings but **38.6%** in the body, both compared with 5.4% of US bachelor's degrees. "Direct" (~47%) means minimal engagement and is not evidence of cheating.

### Cited Findings
- Published 8 April 2025. Data: about one million anonymized conversations, filtered to 574,740, from an 18-day window. Accounts: Claude.ai Free and Pro accounts tied to higher-education email addresses. — [Anthropic Education Report](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude)
- "nearly half (~47%) of student-AI conversations were Direct—that is, seeking answers or content with minimal engagement." The four styles (Direct/Collaborative × Problem Solving/Output Creation) each account for 23–29% of conversations. — [Anthropic Education Report](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude)
- Computer science figures: the key findings say "36.8% of students' conversations while comprising only 5.4% of U.S. degrees"; the disciplines section says "Computer Science accounted for 38.6% of conversations". — [Anthropic Education Report](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude)
- Stated caveats:
    - Cheating cannot be determined from the data.
    - The sample is early adopters on Claude.ai only.
    - The email filter may include staff or miss students using personal accounts.
    - A single 18-day window.
    - Classifier error.
    - Source: [Anthropic Education Report](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude)

### Inferences
- Cite whichever CS figure the review uses, and note the internal discrepancy. Do not describe "Direct" conversations as cheating.

### Gaps
- None for the cited numbers.

## 17. METR, Becker et al. (2025), arXiv:2507.09089, plus METR follow-up (2026)

### Takeaway
**Verdict: the 2025 numbers are correct, but the finding is now dated.**

- **February 2026 follow-up:** METR began a new experiment in August 2025 (57 developers, 800+ tasks). It produced point estimates of a **speedup** (−18% for returning developers, −4% for new ones, both CIs crossing zero). METR itself calls the data unreliable because of selection effects and is redesigning the study.
- **May 2026 survey:** a METR survey of 349 technical workers reports self-reported value uplift medians of 1.4x–2x.

### Cited Findings
- "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity". Authors: Becker, Rush, Barnes, Rein. v1 dated 12 Jul 2025, v2 25 Jul 2025. No journal-ref. — [arXiv abstract page](https://arxiv.org/abs/2507.09089)
- Abstract:
    - An RCT with 16 developers and 246 tasks, each task randomly assigned to allow or disallow AI (mainly Cursor Pro with Claude 3.5/3.7 Sonnet).
    - Developers forecast a 24% reduction in completion time and estimated a 20% reduction afterwards. Measured: AI **increased** completion time by 19%.
    - Experts predicted reductions of 39% (economics) and 38% (ML).
    - Source: [arXiv](https://arxiv.org/abs/2507.09089)
- METR later gave the original estimate's confidence interval as +2% to +39%. — [METR, 24 Feb 2026](https://metr.org/blog/2026-02-24-uplift-update/)
- Follow-up: "We are Changing our Developer Productivity Experiment Design" (24 Feb 2026; Becker, Rush, Cunningham, Rein, Mahamud).
    - A new study started in August 2025: 57 developers (10 returning, 47 new) from 143 repositories, 800+ tasks, paid $50/hour (down from $150), with randomization per task.
    - Returning developers: −18% (CI −38% to +9%). New developers: −4% (CI −15% to +9%). Negative means a speedup.
    - Reasons METR gives for unreliability: developers refused to do 50% of their work without AI; 30–50% withheld tasks they did not want to do without AI; selection from the lower pay; unreliable time tracking with concurrent agents.
    - METR says the new data is "very weak evidence" about the size of the increase, and lists redesign options: shorter intensive experiments, observational data, surveys, fixed-task experiments, and developer-level randomization.
    - Source: [METR blog](https://metr.org/blog/2026-02-24-uplift-update/)
- Survey: "Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity" (11 May 2026, Joel Becker).
    - Sample: 349 technical workers, surveyed February–April 2026.
    - Medians: value uplift 1.4x–2x; speed uplift 3x.
    - METR warns that self-reports are probably inflated, noting the roughly 40-percentage-point overestimate in the 2025 RCT.
    - Source: [METR blog](https://metr.org/blog/2026-05-11-ai-usage-survey/)

### Inferences
- Present the "19% slower" result as a finding about early 2025. The durable lesson is the perception gap (predicted and perceived speedups vs. a measured slowdown), which METR's 2026 survey work reaffirms as a caveat.

### Gaps
- Secondary sources claim the 2025 results page now carries an "out of date" banner. I did not verify this on METR's site.
- I found no completed redesigned METR RCT as of 7 Nov 2026. METR's 2026 blog listing shows no newer productivity RCT.

## 18. Peng et al. (2023), arXiv:2302.06590, GitHub Copilot: 55.8% faster, n = 95

### Takeaway
**Verdict: the 55.8% figure and the task are correct; "n = 95" is imprecise.**

- 95 developers were recruited and assigned (45 treatment, 50 control), but only **35 per group completed** the task.
- arXiv lists no journal reference, so the paper is still a preprint.

### Cited Findings
- "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot". Authors: Peng, Kalliamvakou, Cihon, Demirer. v1 dated 13 Feb 2023; no journal-ref. Abstract: "Recruited software developers were asked to implement an HTTP server in JavaScript as quickly as possible"; "The treatment group … completed the task 55.8% faster than the control group." — [arXiv abstract page](https://arxiv.org/abs/2302.06590)
- Recruitment and sample: 95 professional programmers via Upwork (166 offers, 95 accepted), 45 treatment and 50 control; 35 per group completed the task and the survey. — [ar5iv full text](https://ar5iv.labs.arxiv.org/html/2302.06590)
- Results:
    - 55.8% faster (95% CI 21–89%, p = 0.0017); average 71.17 minutes vs. 160.89 minutes.
    - Success rate +7 percentage points, not significant.
    - Larger benefits for less experienced developers, those coding more hours per day, and ages 25–44.
    - Both groups self-estimated about a 35% productivity gain.
    - Limitations: a standardized task, and code quality was not measured.
    - Source: [ar5iv full text](https://ar5iv.labs.arxiv.org/html/2302.06590)

### Inferences
- Write "95 recruited (70 completers)". The study measures speed on one greenfield task, not learning or code quality.

### Gaps
- I did not verify the authors' affiliations (GitHub/Microsoft) or any later peer-reviewed version.

## 19. Vendor learning modes (as of late 2026): Claude Code "Learning" output style with TODO(human); Claude learning mode; ChatGPT study mode; Google LearnLM

### Takeaway
**Verdict: mostly current, with one outdated name.**

- **Claude Code "Learning" output style:** current, and it still uses `TODO(human)` markers. The built-in styles now also include Proactive and Concise.
- **Claude.ai learning mode:** exists since April 2025 (Claude for Education) and August 2025 (all users). I found no official 2026 page confirming its current UI.
- **ChatGPT study mode:** launched 29 Jul 2025 and still documented in OpenAI's Help Center. The menu label may now read "Study and learn".
- **"LearnLM" as a separate model is outdated:** it is no longer listed separately in AI Studio, and its capabilities are integrated into Gemini 2.5+. The learner-facing mode is called **"Guided Learning"** (launched 6 Aug 2025).

### Cited Findings
- Claude Code docs: the built-in styles are Default plus Proactive, Concise, Explanatory and Learning. The Learning style adds "Insight" blocks and leaves a few lines for the user at real design decisions. "Claude marks the spot with a `TODO(human)` comment in the file" and sends a "Learn by Doing" request. The page references Claude Code versions v2.1.2xx. — [Claude Code docs: Output styles](https://code.claude.com/docs/en/output-styles)
- There is also an Anthropic-verified "Learning Output Style" plugin in the Claude plugin marketplace. It asks for 5–10 lines of code at decision points and activates at session start. — [Claude marketplace](https://claude.com/marketplace/plugins/learning-output-style)
- Claude for Education, 2 Apr 2025: learning mode "works within Projects" and guides students' reasoning with Socratic questioning (for example, "What evidence supports your conclusion?"). — [Anthropic news](https://www.anthropic.com/news/introducing-claude-for-education)
- In August 2025, learning mode was extended to all Claude.ai users via a "Learning" option in the style dropdown, and the Explanatory and Learning output styles were added to Claude Code. This comes from press coverage; the search did not return an anthropic.com primary page. — [Engadget](https://www.engadget.com/ai/anthropic-brings-claudes-learning-mode-to-regular-users-and-devs-170018471/)
- OpenAI launched study mode on 29 Jul 2025 for logged-in Free, Plus, Pro and Team users. — [TechCrunch (search result)](https://techcrunch.com/2025/07/29/openai-launches-study-mode-in-chatgpt)
- OpenAI Help Center article 11780217 (from search snippets; a direct fetch returned 403):
    - Study mode is available on all plans across web, iOS and Android, but not in GPTs or Projects.
    - Labels in different snapshots: "Study" or "Study and learn".
    - Some ChatGPT Edu admins can require study mode, and linked parents can set "Study hours" for teen accounts.
    - Source: [OpenAI Help Center](https://help.openai.com/en/articles/11780217-chatgpt-study-mode-faq)
- Google AI Studio docs: "LearnLM is no longer a separate listing in AI Studio" and "LearnLM capabilities have been integrated into Gemini starting with the 2.5 model series". — [AI Studio docs](https://aistudio.google.com/docs/learnlm)
- Google blog, 6 Aug 2025: "Guided Learning" in Gemini, built on LearnLM capabilities "infused in Gemini" (Gemini 2.5). It uses probing, open-ended questions and multimodal responses with images, diagrams, videos and quizzes. — [Google blog](https://blog.google/products-and-platforms/products/education/guided-learning/)

### Inferences
- Suggested wording for the review: "Claude Code's *Learning* output style (TODO(human) markers); Claude's learning style/mode; ChatGPT *study mode*; Google's *Guided Learning* in Gemini (built on LearnLM)".
- None of these modes has been independently evaluated in the studies above. Bastani's "GPT Tutor" is a research prototype, not a vendor mode.

### Gaps
- No official 2026 Anthropic help-center page confirming the current Claude.ai learning-style UI.
- The OpenAI Help Center could not be fetched directly (403); the details come from search snippets of different page versions, which conflict on minor points (for example, Temporary Chats).
