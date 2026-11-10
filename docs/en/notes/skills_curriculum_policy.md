# AI-era developer skills, computing-education and assessment responses (NL/EU), and deskilling evidence — research notes as of 7 November 2026

Labels used: **[RCT]**, **[Observational]**, **[Survey]**, **[Job-posting analysis]**, **[Payroll-data analysis]**, **[Qualitative]**, **[Policy document]**, **[Framework / expert opinion]**, **[Secondary report]** (journalism or aggregator summarizing a primary source). **COI** marks a conflict of interest. "Window" means 1 May – 7 Nov 2026. "Search-snippet level" means I saw the claim in a search result or summary but could not open the primary text. Treat those claims as weaker.

## 1. Which developer skills are gaining and losing value? (WEF, PwC, Lightcast, LinkedIn, OECD, Stack Overflow, DORA, METR, early-career data)

### Takeaway
The 2025–2026 data reward **AI fluency combined with human judgement**, not AI fluency alone. Examples:

- PwC 2026: the AI-skill wage premium is 62%, and "professionalised" roles where judgement matters grow faster.
- Lightcast: AI skills are valued "alongside" other skills.

Routine and entry-level coding work is being absorbed:

- Stanford, August 2026: 22–25-year-olds in AI-exposed occupations are 19% below their counterfactual employment.
- Stack Overflow 2026: the top AI use is generating code in familiar areas.

Developers trust AI **conditionally on being able to verify it**. Design and communication are the tasks least delegated to AI.

No job-posting source I found directly measures declining value of "syntax/boilerplate" skills or rising value of "code review/testing/specification". Those mappings are inferences from usage and curriculum data.

### Cited Findings

#### Employer surveys and job-posting analyses
- **[Survey] WEF Future of Jobs Report 2025 (January 2025, background).**
    - Sample: over 1,000 employers representing more than 14 million workers, across 22 industry clusters and 55 economies — [EU Digital Skills & Jobs Platform summary](https://digital-skills-jobs.europa.eu/en/latest/news/great-skills-reset-wefs-future-jobs-report-2025-catch-22-future-work)
    - On average, workers can expect "two-fifths (39%) of their existing skill sets [to] be transformed or become outdated over the 2025-2030 period" — [WEF digest (search-snippet level)](https://www.weforum.org/reports/the-future-of-jobs-report-2025/digest); also reported by [Business Today](https://www.businesstoday.in/amp/wef-2025/story/39-of-skills-outdated-by-2030-wef-warns-of-ais-impact-on-jobs-460306-2025-01-10). Earlier-year comparison figures appeared only in unattributed search summaries, so I left them out.
    - Job churn: 170 million new jobs (14% of current employment) against 92 million lost (8%), so a net +78 million. Structural churn is 22% of today's jobs. 63% of employers name skill gaps as the main barrier to transformation — [WEF digest (search-snippet level)](https://www.weforum.org/reports/the-future-of-jobs-report-2025/digest)
    - Fastest-growing skills: AI and big data, networks and cybersecurity, technological literacy. Analytical thinking is the most-sought core skill (7 in 10 companies). "Software and Application Developers" are among the fastest-growing jobs in percentage terms; the exact % was not verified — [EU DSJP](https://digital-skills-jobs.europa.eu/en/latest/news/great-skills-reset-wefs-future-jobs-report-2025-catch-22-future-work)
- **[Job-posting analysis] PwC 2026 Global AI Jobs Barometer (released 15 June 2026, in the window).** COI: PwC sells AI consulting. Source: [PwC press release via PR Newswire/Kyodo](https://kyodonewsprwire.jp/release/202606150856); the [primary PwC page](https://pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html) returned 403 to my fetch.
    - Scope: more than one billion job ads in 27 countries/territories, plus 2.4 million US entry-level jobs.
    - AI-skill wage premium: **62%**, up from "57% last year". Up to 118% in consumer markets; 16% in government/public sector.
    - Jobs requiring AI skills grew 69%, against 9% for all jobs ("roughly eight times" faster).
    - "Two-track" labour market:
        - "Professionalised" roles (examples given: radiologists, recruiters) show "twice the growth in available jobs" and "42% faster salary growth".
        - "Democratised" roles: the named examples are IT service managers and medical secretaries. The release does not mention software developers.
    - Entry level: the most AI-exposed entry-level roles are "seven times more likely" to require traditionally senior, "human-intensive" skills. Openings for these roles grew 35% since 2019, while other entry-level roles shrank 10%. AI is "removing some of the routine work" that once served as an apprenticeship.
    - Skills named as rising: judgement, creativity, leadership, face-to-face interaction, adaptability, and AI-specific skills (prompt engineering, ML). No skills are listed as declining.
    - Conflict: secondary coverage says an earlier edition reported a 56% premium for 2024 data — [letsdatascience](https://letsdatascience.com/news/ai-skilled-workers-command-56-wage-premium-95ad08bf). PwC 2026 says "57% last year". Probably a re-based figure; unresolved.
- **[Job-posting analysis] Lightcast, "Beyond the Buzz" (23 July 2025, background).** COI: Lightcast sells labour-market data — [Lightcast press release](https://lightcast.io/resources/blog/beyond-the-buzz-press-release-2025-07-23)
    - More than 1.3 billion postings analysed.
    - Postings that list AI skills offer a 28% (~$18,000/yr) salary premium.
    - 51% of AI-skill postings (2024) are outside IT/computer-science occupations.
    - 800% growth in GenAI roles in non-tech industries since 2022.
    - Quote from Cole Napper: AI skills should be added "alongside" other skills, "not in place of other skills".
- **[Platform data, secondary only] LinkedIn Economic Graph (January 2026).** COI: LinkedIn/Microsoft sells hiring and AI products.
    - About 1.3 million AI-related roles (e.g., AI engineers, forward-deployed engineers) added over two years — [allwork.space](https://allwork.space/2026/01/linkedin-finds-ai-has-created-1-3-million-jobs-despite-a-hiring-slowdown/)
    - "AI engineering" is the fastest-growing skill category in Skills on the Rise 2026 — [Interview Query](https://interviewquery.com/p/linkedin-ai-engineering-fastest-growing-skills-2026)
    - Overall hiring is ~20% below 2022, attributed mainly to interest rates rather than AI — [pulse.bot aggregator](https://www.pulse.bot/human-resources/news/linkedin-data-shows-ai-isnt-to-blame-for-hiring-decline-yet-1bcd6329-50e0-43fe-b59e-7291061f5411/). Low-quality secondary source.
    - I did not open LinkedIn's own report.

#### Developer surveys and productivity measurements
- **[Survey] Stack Overflow Developer Survey 2026 (published 6 Oct 2026, in the window).**
    - Sample: 16th edition; more than 30,000 respondents over seven weeks — [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/). IT Brief adds that respondents came from 169 countries.
    - Usage: coding assistants/agents 66%, chatbots 63%. 73% of coding-assistant users use them daily. Claude Code (66%) and GitHub Copilot (59%) are the most-used agents — [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
    - Daily AI time (n=10,926): 4+ h 30.9%, 2–4 h 24.1%, 1–2 h 25.3%, <1 h every day 12.2% — [SO 2026 AI section](https://survey.stackoverflow.co/2026/ai)
    - Tasks done with AI (n=12,547) — [SO 2026 AI section](https://survey.stackoverflow.co/2026/ai):

        | Task | Share |
        |---|---|
        | Generating code in a familiar area | 69.3% |
        | Debugging/troubleshooting/refactoring | 63.8% |
        | Straightforward technical questions | 59.4% |
        | Writing or improving tests | 58.1% |
        | Generating code in an unfamiliar area | 56.0% |

    - Usefulness: implementation and debugging are rated useful by over 70%, but **design 49% and communication 35%** — [SO 2026 AI section](https://survey.stackoverflow.co/2026/ai)
    - Trust:
        - **48% trust AI "when they can easily validate its answers"**; 16% extend trust to most non-critical tasks; human-in-the-loop is "the dominant mode" — [SO 2026 AI section](https://survey.stackoverflow.co/2026/ai)
        - 93% say source attribution is needed to trust AI output. The most-trusted context sources for AI are project goals and requirements (85%) and code and docs (73%) — [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
    - Skills:
        - Avoidance (n=13,857): 41.3% do not avoid AI. **17.1% avoid AI out of concern about losing job skills**. 15.2% avoid it for ethical reasons, 13.0% for privacy — [SO 2026 AI section](https://survey.stackoverflow.co/2026/ai)
        - 79% want to build AI skills; 52% are still learning new coding skills. Only 20% use AI to deploy, operate or troubleshoot production systems — [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
    - Secondary extras: only 6.6% would trust AI with an important decision; 24% say their employer has approved tools or an official AI policy; 29.7% say AI use is optional — [IT Brief](https://itbrief.co.uk/story/stack-overflow-survey-shows-developers-trust-ai-with-caveats)
    - **Conflicts**, probably from different questions or denominators:
        - IT Brief reports 78.7% saying source attribution "matters", against the blog's 93% saying it is "needed".
        - IT Brief says "about a third" find AI useful for design; the survey page says 49%.
        - The blog reports 67% for code generation and 61% for debugging; the survey page reports 69.3% and 63.8%.
- **[Survey] Stack Overflow 2025 (background).**
    - 84% use or plan to use AI (76% in 2024). 46% distrust AI accuracy (31% the year before) — [InfoWorld](https://infoworld.com/article/4031673/ai-use-among-software-developers-grows-but-trust-remains-an-issue-stack-overflow-survey.html)
    - Top frustration (66%): AI answers that are "almost right, but not quite". 45% say debugging AI-generated code takes more time — [VentureBeat](https://venturebeat.com/ai/stack-overflow-data-reveals-the-hidden-productivity-tax-of-almost-right-ai-code)
    - I could not find the "almost right" item on the 2026 pages.
- **[Survey] Google DORA 2025.** COI: Google sells AI developer tools.
    - Nearly 5,000 technology professionals. AI adoption 90% (+14%). Median ~2 h/day with AI. AI acts as an "amplifier" of existing strengths and weaknesses. The report describes a "trust and productivity paradox" — [Google blog](https://blog.google/technology/developers/dora-report-2025/)
    - I did not verify the trust percentage.
- **[RCT + methods updates] METR.**
    - July 2025 RCT: 16 experienced open-source developers took **19% longer** with AI tools, while believing they were 20% faster — [METR 2025](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
    - 24 Feb 2026: METR judged its follow-up experiment unreliable. Reasons: developers refused to work without AI (selection bias), pay was cut from $150/h to $50/h, and time-tracking broke with concurrent agents. METR believes the speedup in early 2026 is larger than in early 2025, but calls this "very weak evidence" — [METR 2026 update (search-snippet level)](https://metr.org/blog/2026-02-24-uplift-update/)
    - The latest RCT, on late-2025 agents, found "small (~4–20%)" benefits, which METR expects to be an underestimate — [METR Frontier Risk Report, May 2026 (search-snippet level)](https://metr.org/blog/2026-05-19-frontier-risk-report/)
    - 11 May 2026 survey: the median self-reported speed-up is 3x, which the authors expect overstates the true change in value — [METR survey (search-snippet level)](https://metr.org/blog/2026-05-11-ai-usage-survey/)

#### Early-career labour market
- **[Payroll-data analysis] Brynjolfsson, Chandar & Chen, "Canaries in the Coal Mine?" (revised 12 Aug 2026, in the window).** Source: [Stanford Digital Economy Lab](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recen)
    - Data: ADP payroll records through June 2026.
    - Employment of 22–25-year-olds in AI-exposed occupations is **19% below** where it would be had it kept pace with less-exposed peers. Experienced workers show no comparable gap.
    - The gap has widened since August 2025. It works mainly through **reduced hiring**, not more separations.
    - Declines are concentrated where AI **substitutes** for tasks. Where AI **complements** workers, employment is flat or rising.
    - The authors call these "early, descriptive indicators … rather than causal estimates". The effect weakens when controlling for education, and some trends predate GenAI.
    - Earlier-version figure: software developers aged 22–25 down nearly 20% from the late-2022 peak. Seen only in search summaries of secondary coverage, e.g. [SoftwareSeni](https://www.softwareseni.com/what-the-data-actually-shows-about-ai-and-junior-developer-employment-decline/). The Stanford page gives no developer-specific figure, so this is unverified.
- **[Vendor analysis] Anthropic Economic Index (January 2026).** COI: maker of Claude. The report reportedly says the "net first-order impact is to deskill jobs", because AI removes tasks that require relatively higher education. It frames this as a possibility, not a prediction — [Anthropic (search-snippet level)](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report)

### Inferences
- **Rising (inferred, in order of evidence strength):**
        1. **AI-tool fluency.** Supported by the PwC 62% and Lightcast 28% premiums, and by 79% of developers wanting AI skills.
        2. **Verification and review of AI output.** Supported by:
                    - trust that depends on easy validation (48%);
                    - Anthropic engineers shifting to "70%+ code reviewer/reviser" (see Q4);
                    - Lee et al. finding that critical thinking shifts toward verification (see Q4).
        3. **Specification/requirements.** Developers rank "project goals and requirements" (85%) as the most trusted context for AI. That suggests stating intent precisely is what makes AI output usable.
        4. **Design and communication.** These are the least AI-useful categories (49%, 35%), so they stay human-differentiating.
        5. **Debugging.** It is heavily AI-assisted (63.8%) yet the skill most eroded by delegation (Anthropic RCT, Q4). That makes unassisted debugging a scarce supervisory skill.
- **Losing value (inferred):**
        - Generating routine code in familiar areas: the most-delegated task.
        - Routine entry-level work: the "apprenticeship" tasks PwC says AI is removing.
        - "Syntax/boilerplate" is inferred from usage patterns and from CS1-LLM de-emphasising writing code from scratch (Q2). No job-posting source measures it directly.
- **Junior squeeze.** The squeeze is at entry level: Stanford's hiring channel, and PwC's finding that entry-level roles demand senior "human-intensive" skills. For a year-2 HBO-ICT student, the differentiator is visible judgement (design rationale, tests, reviews) on top of AI fluency, not raw code output.
- **Caveats for the report writer:**
        - The premiums are associations from postings, not causal returns.
        - Almost all labour data are US-centric or global; none are Dutch.
        - Most sources have commercial interests in AI.
        - METR shows self-reports of productivity are unreliable, which also weakens self-reported "skills" claims.

### Gaps
- **OECD Skills Outlook 2025:** I could not find or verify developer-relevant findings. Secondary items about OECD "Skills in the AI age" (e.g., "advanced AI skills ~1% of workforce") are unverified.
- **LinkedIn:** I did not open LinkedIn's primary January 2026 report; all LinkedIn figures above are secondary.
- **Missing figures:**
    - WEF's exact growth % for software developers.
    - The PwC 2026 skills-change rate (not in the release).
    - DORA 2025 trust percentages.
- **No Dutch or EU posting-level analysis of developer skills.**
- **Unverified dashboard:** a search summary cited a Bipartisan Policy Center/Lightcast dashboard (AI-skill postings 368,605 in September 2026). No URL was available, so I omitted it.

## 2. How is computing education responding? (CS2023, ITiCSE working groups, CS1-LLM, and what must still be learned by hand)

### Takeaway
Curricula are adding GenAI **without dropping hand-skills assessment**:

- CS2023 (final report January 2024) added a deliberately speculative GenAI chapter. A version of that chapter says GenAI tools are rendering existing assessment methods ineffective (paraphrase, search-snippet level).
- The best-documented "AI from day one" CS1, UC San Diego's CS1-LLM, made three changes:
    - It replaced writing code from scratch with prompting, tracing, explaining, decomposition, testing and debugging.
    - It **kept most exams AI-free**.
    - It reported exam performance "largely comparable" to historical benchmarks, and 11% higher on explain-in-plain-English.

Experimental studies converge (Anthropic RCT 2026, a vendor study; Bastani et al. PNAS 2025; Prather et al. ICER 2024):

- Unguided or delegating use raises task performance but impairs learning, especially **debugging and conceptual understanding**.
- "Ask-why" interaction patterns, or guardrailed tutors, largely preserve learning.

### Cited Findings

#### Curriculum guidelines and working groups
- **[Curriculum guideline] CS2023 (ACM/IEEE-CS/AAAI).**
    - The final report (January 2024) includes a chapter on how GenAI "could propel further innovation" — [CS2023 final report, ACM DL](https://dl.acm.org/doi/pdf/10.1145/3664191)
    - A later version calls that chapter a list of "educated guesses". It states that GenAI tools are rendering existing assessment methods ineffective and that detection tools are still evolving — [CS2023 GenAI chapter (Nov 2023 version)](https://csed.acm.org/wp-content/uploads/2023/12/Generative-AI-Nov-2023-Version.pdf); [CS2023 report page (Nov 2025 upload)](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm). Search-snippet level.
    - A companion Curricular Practices article covers GenAI in introductory programming (same sources).
    - No official post-2024 GenAI revision of CS2023 was found.
- **[Expert working-group report] ITiCSE 2023 WG, "The Robots are Here: Navigating the Generative AI Revolution in Computing Education"** (Prather, Denny, Leinonen, Becker et al.). It sets a research agenda and collects early practices — [ar5iv](https://ar5iv.labs.arxiv.org/html/2310.00658)
- **[Systematic review + instructor survey] ITiCSE 2025 WG, "The Rest of the Robots: Generative AI in Post-introductory Computing Education"** — [Macquarie listing](https://researchers.mq.edu.au/en/publications/the-rest-of-the-robots-generative-ai-in-post-introductory-computi/). Also listed on the Open Universiteit (NL) portal: [OU](https://research.ou.nl/en/publications/genai-integration-in-upper-level-computing-courses/).
    - Bibliographic details: Bouvier et al., 15 authors including Vadaparty. ITiCSE-WGR 2025, held in **Nijmegen, NL**, 27 Jun–2 Jul 2025. pp. 61–107. DOI 10.1145/3760545.3783970.
    - It states that most GenAI research has focused on CS0/CS1, while upper-level courses (software engineering, HCI, algorithms, OS, theory) have been "largely overlooked". The aim is to inform curriculum design.
    - I could not retrieve its detailed findings.
- **[Expert working-group report] ITiCSE 2025 WG on ethical and societal impacts of GenAI in higher computing education** (Mak et al.): equity, integrity, bias, data provenance — [arXiv 2511.15768](https://www.arxiv.org/pdf/2511.15768)

#### "AI from day one": CS1-LLM, UC San Diego
- **[Course design paper] Vadaparty et al., ITiCSE 2024.** The course was "intentionally altered to reduce emphasis on syntax and writing code from scratch". Students practise explaining code, testing it, and decomposing problems into pieces an LLM can solve — [arXiv 2406.15379](https://arxiv.org/abs/2406.15379)
- **[Course evaluation, no randomized control] Outcomes paper** — [arXiv 2510.18806 (21 Oct 2025)](https://arxiv.org/html/2510.18806v1); published 2026 per [VTechWorks](https://vtechworks.lib.vt.edu/items/a6e65ea6-7432-495e-99ff-196929609abb/full).
    - **Setup:** 556 students. Tool: GitHub Copilot in VS Code.
    - **New learning goals:**
        - LLMs, prompts, nondeterminism and prompt engineering;
        - **tracing, explaining and decomposing programs**;
        - open- and closed-box **testing**;
        - **debugging**;
        - **judging correctness from test evidence**.
    - "Writing code from scratch" was given "diminished importance".
    - **AI-free assessment was kept:**
        - Students were encouraged to work without Copilot on most formative problems.
        - 3 of 4 midterms excluded Copilot.
        - Final exam: 70% multiple choice without Copilot, 15% non-Copilot coding, 15% Copilot-assisted coding.
        - Grade weights: summative 65%, formative 35%.
    - **Exam outcomes:** Q1–Q6 (535 responses) were "largely comparable" to the international benchmark (Simon et al. 2016). On the **Explain-in-Plain-English question, students scored 11% higher** than the international average (n=250). No effect sizes are reported.
    - **Equity:** in an OLS model (n=207), Black, Latine/x, Native American or Pacific Islander students scored about 8.4 exam points lower (p<0.001). Prior experience added about +3.2 points (p=0.049).
    - **Surveys:**
        - Copilot described as "helpful": 69.2% at mid-quarter (n=400), 42.2% at end of quarter (n=315).
        - Over-reliance concern: 23.9% (mid) and 25.4% (end).
        - 14–15% said it hindered learning the fundamentals; 4.1% cut back their use.
    - **Limitations:** single course, single institution, incomplete response rates.

#### Experimental evidence on learning with AI
- **[RCT] Shen & Tamkin, "How AI Impacts Skill Formation".** COI: Anthropic (maker of Claude). Sources: [arXiv 2601.20245 v2](https://arxiv.org/html/2601.20245v2) (v1 28 Jan 2026, v2 1 Feb 2026); [Anthropic post (29 Jan 2026)](https://www.anthropic.com/research/AI-assistance-coding-skills)
    - **Participants:** 52 analysed (26 AI, 26 control). Crowd workers with more than 1 year of Python and prior use of AI assistants; mostly freelance or professional developers aged 25–35.
    - **Task:** learn the Trio async library, with a 35-minute limit.
    - **Quiz:** 14 questions (27 points) of three types: conceptual, code-reading and debugging. Code writing was not tested.
    - **Mastery result:** the AI group scored 4.15 points lower. **Cohen's d = 0.738, p = 0.010.** Anthropic reports 50% vs 67%, a "17%" gap; 4.15/27 is about 15 points, so the figures are slightly inconsistent.
    - **By question type:** the **largest gap was on debugging**, the smallest on code reading.
    - **Speed:** no statistically significant speed gain. Participants who fully delegated to AI finished in 19.5 vs 23 minutes.
    - **Interaction patterns (AI group):**
        - Low scorers (<40%; range 24–39%): "AI Delegation", "Progressive AI Reliance", "Iterative AI Debugging".
        - High scorers (≥65%; range 65–86%): "Generation-Then-Comprehension", "Hybrid Code-Explanation", "Conceptual Inquiry" (n=7).
    - **Limitations:** a one-hour task, a chat interface, and an assistant based on GPT-4o. Ethics review was internal to Anthropic. There is no formal COI statement.
    - The abstract's conclusion: "AI-enhanced productivity is not a shortcut to competence."
- **[RCT, field] Bastani et al., PNAS 122 (2025), "Generative AI without guardrails can harm learning".** About 1,000 Turkish high-school mathematics students — [IDEAS/RePEc](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html); [Wharton summary](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)
    - **Practice-session scores:** +48% for GPT Base, +127% for GPT Tutor.
    - **Unassisted exam:** **GPT Base students scored 17% lower than controls who never had AI.** GPT Tutor students scored about the same as controls.
    - GPT Tutor was a GPT-4 prompt containing the solutions and common mistakes, giving incremental hints rather than answers.
- **[Policy report] OECD Digital Education Outlook 2026 (January 2026).** It uses this evidence to argue that general-purpose GenAI improves task performance without necessarily producing learning gains, and that purpose-built, pedagogically guided tools are needed — [OECD publication page (fetch blocked; search-snippet level)](https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html); [Hürriyet Daily News (secondary)](https://www.hurriyetdailynews.com/oecd-warns-ai-boosts-grades-but-not-lasting-learning-218598)
- **[Qualitative lab study] Prather et al., "The Widening Gap", ICER 2024.** Methods: 21 lab sessions with observation, interviews and eye tracking. Findings: a "clear divide" between novices whom GenAI accelerated and novices it hindered. Struggling students often "finished with an illusion of competence". The authors recommend teaching metacognitive skills explicitly — [arXiv 2405.17739](https://arxiv.org/abs/2405.17739)

#### What must still be learned by hand (arguments and evidence)
- **[Course design]** CS1-LLM keeps tracing, explaining, testing, debugging and judging correctness as explicit goals, and assesses most of them without AI — [arXiv 2510.18806](https://arxiv.org/html/2510.18806v1)
- **[Policy document] University of Sydney "Education in the age of AI" Green Paper** (uploaded August 2026 per URL path; undated in the text) — [Sydney Green Paper PDF](https://educational-innovation.sydney.edu.au/teaching@sydney/wp-content/uploads/2026/08/AI-in-Education-at-The-University-of-Sydney-Green-Paper.pdf)
    - It warns AI can "Create overconfidence in the absence of underlying capability" and "Introduce errors, bias and misinterpretation that students do not have the knowledge to detect".
    - It requires:
        - "Scaffolding of foundational knowledge and skills prior to AI-supported tasks";
        - "Tasks that require explanation and justification";
        - "Opportunities for performance independent of AI".
    - Equity: students without support "are more likely to use AI to reduce cognitive effort", so "disparities in capability will widen over time".
- **[Policy document] Npuls national vision (NL)** — [Npuls PDF](https://www.npuls.nl/_assets/3cff3f77-9fb0-4226-adb0-66d44de18c85/Visie-op-toetsing-en-examinering-Npuls.pdf)
    - It lists a "Robuuste kennisbasis: Een goed ontwikkelde voorkennis/ basiskennis is noodzakelijk" (a robust knowledge base: well-developed prior/basic knowledge is necessary).
    - It states "studenten moeten uiteindelijk zonder AI hun beroep kunnen uitoefenen waar dat nodig is" (students must ultimately be able to practise their profession without AI where needed).

### Inferences
- **Closest model.** CS1-LLM is the closest documented model of a "rebalanced" programme. AI sits in the workflow, while comprehension skills (trace, explain, test, debug) are taught explicitly and certified AI-free. This supports keeping hand practice for core OOD, and also adding explicit practice in reading, reviewing and testing AI-generated code.
- **Interaction mode matters more than AI on/off.** The Anthropic RCT's high-scoring patterns (conceptual inquiry, generation-then-comprehension) suggest how a student should use AI while learning: ask why, then explain the code back. Low-scoring patterns (delegation, iterative AI debugging) are what to avoid. The project's own L0–L4 harness with a hint ladder resembles Bastani's guardrailed "GPT Tutor" condition, which avoided exam harm. This is an analogy, not tested.
- **Explaining is trainable and assessable.** CS1-LLM's +11% on explain-in-plain-English suggests explaining code is a skill that can be trained with AI in the loop and assessed. It is also a natural rehearsal for oral defences (Q3).
- **Limits of the evidence:**
    - CS1-LLM has no randomized control.
    - The Anthropic RCT is short-term, uses crowd workers and is vendor-run.
    - Bastani studies school mathematics.
    - None of the studies is about object-oriented design courses specifically.

### Gaps
- Detailed findings of the ITiCSE 2025 "Rest of the Robots" WG (number of papers, survey size, recommendations) were not retrieved. ITiCSE 2026 WG outputs (in the window) were not searched.
- No multi-year outcome data on AI-first CS curricula. No studies specific to OOD or software-design courses with GenAI.
- No post-2024 official CS2023 GenAI revision found.
- Unreviewed lead: "Reshaping Undergraduate Computer Science Education in the Generative AI Era" ([arXiv 2606.07545](https://arxiv.org/pdf/2606.07545), June 2026).

## 3. Assessment policy: AIAS, two-lane, orals/vivas, validity of unsupervised assessment; Dutch context (Npuls, NVAO, HBO-i, CHE) and EU AI Act Article 4

### Takeaway
International and Dutch guidance converge on a **two-lane logic**:

- **secure, supervised assessment** (exams, orals, practical demonstrations) to certify capability without AI at key points;
- **open assessment** where AI is permitted and taught.

Permission scales such as the AIAS are **communication tools, not security**. Their authors say security is "only possible at Level 1" (No AI). Unsupervised "no-AI" tasks cannot be verified:

- Sydney: no reliable way to prevent or detect AI use in unsupervised work.
- Scarfe et al. 2024: 94% of AI-written exam answers went undetected.

**CHE's 2026–27 ICT regulation (Art. 7.11) defines AI levels 0–2:**

- level 0: no GenAI, taken in a controlled setting;
- level 1: GenAI as an aid for ideas or structure, with an obligation to account for use, link prompts and cite in APA;
- level 2: GenAI integrated into the task.

Npuls (May 2025) explicitly adopts the two-lane approach. NVAO (January 2026) finds Dutch programmes focus on fraud and validity, and asks for institution-wide guidelines. EU AI Act Article 4 has applied since 2 Feb 2025. The Digital Omnibus (in force 27 July 2026) softened it to a duty to **support** AI literacy among staff.

### Cited Findings

#### Frameworks and critiques
- **[Framework / expert opinion] AI Assessment Scale (AIAS).**
    - Version 1: Perkins, Furze, Roe & MacVaugh (JUTLP 2024), using traffic-light colours — [Furze, AIAS v1](https://leonfurze.com/?p=7030)
    - Revised version: "The AI Assessment Scale Revisited" (Perkins, Roe, Furze + 5 others). arXiv 12 Dec 2024; **published in JUTLP 22(7) (2025), DOI 10.53761/rrm4y757**. Five levels from "No AI" (1) to "AI Exploration" (5). A neutral palette "avoids implied hierarchies" — [arXiv 2412.09029](https://arxiv.org/abs/2412.09029)
- **[Expert opinion] Furze (28 Aug 2024).**
    - "assessment security, in the traditional sense, is only possible at Level 1". Validity, however, is possible at every level.
    - Permitting any AI use effectively permits all use.
    - The colours were dropped partly after criticism from Danny Liu (Sydney) of traffic-light approaches.
    - Level 2 covers planning and research. Level 3 covers feedback/evaluation and drafting "with a critical eye".
    - Source: [Furze blog](https://leonfurze.com/2024/09/updating-the-ai-assessment-scale/). The exact names of levels 2–4 were not verified in this session.
- **[Conceptual paper] Corbin, Dawson & Liu (2025), "Talk is cheap: why structural assessment changes are needed for a time of GenAI"**, *Assessment & Evaluation in Higher Education*, DOI 10.1080/02602938.2025.2503964 — [abstract via Rowe bibliography](https://michael-rowe.github.io/home-michael/Bibliography/Corbin-et-al-2025-talk-is-cheap-why-structural-assessment-changes-are-needed)
    - Traffic-light and scale systems "focus primarily on communicating rules rather than redesigning assessment mechanics".
    - It distinguishes "discursive" changes (instructions students "remain free to ignore") from "structural" changes that reshape the task's mechanics.
- **[Policy] University of Sydney "two-lane" approach.**
    - Liu & Bridgeman (8 Dec 2023) — [Teaching@Sydney](https://educational-innovation.sydney.edu.au/teaching@sydney/?p=19768):
        - Lane 1 ("secure", assessment *of* learning, supervised; e.g., exams, vivas, interactive orals) "should be used sparingly and strategically".
        - Most assessments should be Lane 2 ("open", where AI is used responsibly).
        - **Unsupervised assessment that bans AI is invalid, because there is no reliable way to prevent or detect AI use.**
    - Rollout:
        - From Semester 1 2025 the default allows AI, except in exams and in-semester tests — [Sydney news, 27 Nov 2024](https://www.sydney.edu.au/news-opinion/news/2024/11/27/university-of-sydney-ai-assessment-policy.html)
        - Formal two-lane approach from Semester 2 2025 (search-snippet level, from Sydney guidance).
        - "in 2026, we are transitioning to this model for secure assessments in online units" — [Sydney student assessments page (search-snippet level)](https://www.sydney.edu.au/students/assessments.html)
    - Green Paper (August 2026, in the window) — [Green Paper PDF](https://educational-innovation.sydney.edu.au/teaching@sydney/wp-content/uploads/2026/08/AI-in-Education-at-The-University-of-Sydney-Green-Paper.pdf):
        - The two-lane model is the "institutional architecture" separating development from "trusted assurance".
        - Secure assessment "should be used deliberately and only where necessary", concentrated at progression points and graduation.
        - It calls for more oral, practical and workplace assessment.

#### Validity of unsupervised assessment
- **[Field experiment, blind] Scarfe et al. (PLOS ONE, 26 Jun 2024), University of Reading** — [EurekAlert](https://www.eurekalert.org/news-releases/1048877); [Phys.org](https://phys.org/news/2024-06-ai-generated-exam-submissions-evade.html)
    - Method: GPT-4 answers were submitted for 33 fictitious students in unsupervised take-home psychology exams.
    - Result: **94% went undetected**. In **83.4%** of cases the AI submissions outscored a randomly selected group of real students.
- **[Policy document] Npuls on detection** — [Npuls vision PDF](https://www.npuls.nl/_assets/3cff3f77-9fb0-4226-adb0-66d44de18c85/Visie-op-toetsing-en-examinering-Npuls.pdf)
    - "nieuwe AI-detectietools zijn vooralsnog niet volledig betrouwbaar" (new AI detectors are not yet fully reliable).
    - A Turnitin "AI-generated" score "vormt op zichzelf geen waterdicht bewijs" (is not, on its own, watertight proof).
    - Rule of thumb: "AI-vermoedens vergen menselijk onderzoek en controle" (AI suspicions require human investigation), e.g., "door de student mondeling te bevragen over het werk" (by questioning the student orally about the work).

#### Oral exams and vivas (2025–2026 evidence; mostly small, single-site)
- **[Empirical, course study]** Davey et al. (2025, AEHE), one-to-one interactive oral assessment in bioscience. Initial anxiety declined with experience and did not hurt performance. The format showed "resilience to academic misconduct, including inappropriate use of Generative AI" — [Adelaide repository](https://digital.library.adelaide.edu.au/items/d630c8c4-ff11-43de-a8a2-810dbf59a4b8)
- **[Empirical pilot]** Voice-AI oral exams at NYU Stern (Ipeirotis & Rizakos; cohorts of 36 and 37). 70% agreed the format tested genuine understanding; 83% found it more stressful than written exams — [arXiv 2603.18221](https://arxiv.org/html/2603.18221). Author–URL mapping comes from search results; verify.
- **[Empirical pilot]** "Conversational exam" with live coding plus explanation (Barba & Stegner, January 2026; 58 students) — [arXiv 2601.10691](https://arxiv.org/abs/2601.10691). Mapping inferred from search results.
- **[Empirical pilot]** Adaptive viva after written work (Hutson et al. 2026): 52 vivas in Spring 2026, but only 7 survey respondents, of whom 14.3% agreed the viva deepened their thinking — [Lindenwood](https://digitalcommons.lindenwood.edu/faculty-research-papers/814). Author–URL mapping comes from search results; verify.

#### Dutch national context
- **[Policy document] Npuls, "Visie op toetsing en examinering: Naar een AI-bewuste toetspraktijk"** — [Npuls knowledge base](https://npuls.nl/kennisbank/visie-op-toetsing-examinering-en-ai-handreikingen); [PDF](https://www.npuls.nl/_assets/3cff3f77-9fb0-4226-adb0-66d44de18c85/Visie-op-toetsing-en-examinering-Npuls.pdf)
    - **Date and scope:** published 27 May 2025; the PDF file is marked "aangepast 202509" (revised September 2025). National vision for mbo/hbo/wo, with four handreikingen (practical guides). Partners in the page footer: SURF, Vereniging Hogescholen, UNL, MBO Raad.
    - **Key statements:**
        - "Het doel is níet om toetsing volledig 'AI-proof' te maken" (the goal is not to make assessment fully AI-proof).
        - Take-home and other unsupervised forms "zijn kwetsbaar geworden voor oneigenlijk AI-gebruik" (have become vulnerable to improper AI use).
        - A test programme "moet betrouwbare momenten bevatten waarop dat [beroep zonder AI] aangetoond wordt" (must contain reliable moments where that [practising the profession without AI] is demonstrated). This "vergt soms strengere condities (bijvoorbeeld surveilleren bij tentamens of extra mondelinge checks)" (sometimes requires stricter conditions, e.g., invigilated exams or extra oral checks).
    - **It explicitly adopts the "Two-Lane Approach"** (citing Liu & Bridgeman 2023):
        - **Baan 1** (assessment *of* learning): "onder gecontroleerde omstandigheden en toezicht, en AI-gebruik is hierbij niet of in beperkte mate toegestaan" (under controlled conditions and supervision; AI not allowed, or only to a limited extent). Examples: invigilated exams, orals, practical skills tests.
        - **Baan 2** (assessment *for/as* learning): AI "geoorloofd, gewenst, of zelfs verplicht" (permitted, desired or even required). Students "moeten … aantonen wanneer en hoe ze AI hebben ingezet" (must show when and how they used AI).
        - "Cruciale leerdoelen worden geborgd in het eerste spoor" (crucial learning outcomes are assured in the first lane).
    - **Handreiking 4 (examination committees):** in hbo/wo, AI use should be explicitly included in the OER — [Npuls Handreiking 4 (search-snippet level)](https://www.npuls.nl/_assets/c46a36b7-2ec5-4fe1-a7c1-7d50b43edb94/Npuls-Handreiking-4-AI-B5.pdf)
- **[Policy analysis] NVAO, "Startverkenning Generatieve Artificiële Intelligentie" (January 2026)** — [NVAO PDF](https://www.nvao.net/files/attachments/.13866/Startverkenning_Generatieve_Artificiele_Intelligentie.pdf)
    - **Scale:** GenAI terms appear in "ruim de helft (310) van de 509 opleidingsbeoordelingen" (just over half, 310 of 509, programme assessments) decided between 1 Nov 2024 and 14 Aug 2025. That is 194 unique reports.
    - **Focus on assessment** (standard 3): programmes focus "primair op de risico's … zoals fraude en problemen met de validiteit van schriftelijke eindproducten" (primarily on the risks, such as fraud and the validity of written end products). Panels advise "alternatieve en aanvullende toetsvormen" (alternative and supplementary assessment forms). There is "nauwelijks aandacht" (hardly any attention) for constructive alignment.
    - **Recommendations:**
        1. concrete institution-wide guidelines;
        2. an explicit, integral approach covering learning outcomes, curriculum, teachers' AI literacy, assessment and realised outcomes;
        3. making GenAI explicit in quality-assurance procedures.
- **[Framework] HBO-i Domeinbeschrijving 2024** (fifth edition; national learning-outcome framework for hbo-ICT) — [Vereniging Hogescholen PDF](https://www.vereniginghogescholen.nl/system/profiles/documents/000/000/323/original/HBO-i_Domeinbeschrijving_2024.pdf?1714053328). I found no HBO-i statement specific to GenAI.
- **[Policy, comparators; search-summary level]**
    - Leiden University uses a four-level, non-cumulative GenAI scale. Without a chosen level, use may be treated as fraud — [Leiden, Sept 2025](https://www.student.universiteitleiden.nl/mededelingen/2025/09/richtlijnen-voor-gebruik-van-genai-bij-toetsing_studenten?cf=iclon)
    - Utrecht University uses a five-level "AI-index" — [UU](https://students.uu.nl/rebo/ai-beleid)
    - SURF/Npuls are piloting "EduGenAI", a safe AI platform — [RUG](https://www.rug.nl/society-business/center-for-information-technology/news/0512-edugenai-pilot?lang=nl)

#### CHE (Christelijke Hogeschool Ede): the student's institution
- **[Policy document] OER 2026–2027, Hogeschooldeel Algemene Bepalingen.** Approved by the student council (HR) 22 Jan 2026, adopted by the Executive Board (CvB) 24 Apr 2026, in force 1 Sep 2026 — [CHE OER ch. 1](https://che.nl/media/s2ljuswc/oer-onderwijs-en-examenregeling-che-2026-2027-01-algemene-bepalingen.pdf)
    - Art. 1.41(3) lists as fraud:
        - (a) "Gebruik van niet-toegestane (digitale) hulpmiddelen tijdens toetsen" (use of non-permitted (digital) aids during tests);
        - (c) "Gebruik van generatieve AI of andere AI-systemen waarbij nieuwe content gecreëerd kan worden, zoals tekst, afbeeldingen, code, video's of audio op ongeoorloofde wijze" (unauthorized use of generative AI or other AI systems that can create new content, such as text, images, code, video or audio);
        - (d) plagiarism of "tekst, code of ontwerp" (text, code or design).
    - Art. 1.41(4): "plagiaat opsporingssystemen als Turnitin" (plagiarism-detection systems such as Turnitin) may be used to investigate. A student who refuses cannot have their work assessed.
    - Art. 1.16 regulates oral tests. Programme chapters cannot deviate from chapter 1 unless chapter 1 allows it.
- **[Policy document] OER 2026–2027, Opleidingsdeel ICT, Art. 7.11 "Gebruik van generatieve AI"** (Use of generative AI) — [CHE OER ch. 7 ICT](https://che.nl/media/uqab4gfi/oer-onderwijs-en-examenregeling-che-2026-2027-07-bachelor-ict.pdf); index at [che.nl/algemeen/oer](https://che.nl/algemeen/oer)
    - "Per onderwijseenheid staat in de beoordelingsformulieren vermeld of en hoe generatieve AI gebruikt mag worden" (for each course unit, the assessment forms state whether and how generative AI may be used).
    - **Niveau 0:** "Toets die zonder gebruik van GenAI gemaakt moet worden. De toets wordt in een gecontroleerde setting (toetsmoment of lesmoment) afgenomen." (A test that must be taken without GenAI, in a controlled setting: a test session or a class session.)
    - **Niveau 1:** "Toets waarbij GenAI als hulpmiddel mag worden gebruikt, bijvoorbeeld om ideeën te genereren of structuur aan te brengen." (GenAI may be used as an aid, e.g., to generate ideas or add structure.)
    - **Niveau 2:** "GenAI-gebruik [is] in de toetsopdracht geïntegreerd. Studenten wordt expliciet gevraagd om GenAI te gebruiken en de output te verwerken." (GenAI use is integrated into the task; students are explicitly asked to use GenAI and process its output.)
    - **At levels 1 and 2 the student must:**
        - account for how GenAI was used;
        - add the prompts "d.m.v. een directe link naar de sessie" (via a direct link to the session);
        - cite according to APA;
        - remain "ten allen tijde verantwoordelijk … om de output te controleren op juistheid en relevantie" (at all times responsible for checking the output for correctness and relevance);
        - keep prompts until assessment and provide them on request.
    - The OOD course's own assessment form (which parts are level 0 or 1) is not public.

#### EU AI Act Article 4 (AI literacy)
- **[Law]** Under Regulation (EU) 2024/1689, Article 4 applies from **2 February 2025**. Original duty: providers and deployers must "take measures to ensure, to their best extent, a sufficient level of AI literacy" of staff — [EUR-Lex (canonical ELI link; not fetched this session)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj). The original wording comes from search-result summaries of legal commentary, e.g. [IAPP](https://iapp.org/news/a/eu-ai-act-literacy-changes-may-complicate-more-than-simplify-compliance) (not opened). It was not verified against EUR-Lex text in this session.
- **[Law, in the window] Digital Omnibus on AI** — [Lewis Silkin, 27 Jul 2026](https://www.lewissilkin.com/insights/2026/07/27/the-digital-omnibus-on-ai-enters-into-force-today-102nedo)
    - Published in the Official Journal on **24 July 2026**; **in force 27 July 2026**. The OJ identifier L_202601744 implies Regulation (EU) 2026/1744 (number from search summaries; the OJ text was not opened).
    - Article 4 now requires providers and deployers to take measures that **support** AI literacy among "staff and others who operate AI systems on their behalf". There is no required "sufficient level" per individual; documenting training is the expected practice. The Commission and Member States must support these efforts.
    - Deployers of high-risk systems keep the competence duties of Art. 26(2).
    - **Annex III high-risk deadlines** (education is an Annex III area) moved from 2 Aug 2026 to **2 Dec 2027**. Annex I systems: 2 Aug 2028.
    - Same view of the obligation: "AI literacy remains mandatory" in softened form — [ki-campus, 28 Jul 2026](https://ki-campus.org/en/blog/eu-ai-act-ai-omnibus-recalibrates-article-4-ai-literacy-remains-mandatory)
    - **Conflict on the adoption date:** search summaries give either 8 July 2026 (adoption by Parliament and Council) or a 16 June 2026 Parliament final vote — [MLGTS](https://www.mlgts.pt/en/knowledge/legal-alerts/Legal-Alert-European-Parliament-approves-Digital-Omnibus-package-on-AI/26967/) (not opened).

### Inferences
These are talking points for the teacher conversation, all inferred:

1. **CHE's "level 0/1" for the final OOD assessment matches the evidence-based consensus for assurance.** Level 0 is effectively Npuls Baan 1 and Sydney Lane 1. Scarfe et al. and Liu & Bridgeman show that no-AI claims cannot be certified without supervision. Supporting the policy, rather than arguing against it, is the evidence-based position.
2. **Level 1 in an unsupervised task is a "discursive" control** in Corbin et al.'s terms. Furze: security is only possible at No-AI, and allowing some AI effectively allows all. Its integrity rests on Art. 7.11 accountability (prompt links, retention) and on any human or oral follow-up (Npuls).
            - Question for the teacher: which parts of the final assessment are level 0 (controlled) and which are level 1, and how is level-1 work verified, e.g., by an oral defence?
3. **Ask where Baan 2 / level 2 happens in the programme.** That means AI-integrated design, review and testing work where the student is assessed on *verifying* AI output.
            - Npuls: the lanes "vullen elkaar aan" (complement each other). Sydney: most assessment should be open.
            - CS1-LLM shows AI integration can coexist with AI-free exams without lower exam outcomes.
            - Art. 7.11 already makes students responsible for checking output "op juistheid en relevantie" (for correctness and relevance). That could be assessed as a skill, not only as compliance.
4. **Do not overclaim the AI Act.** Article 4 targets providers' and deployers' staff, and since 27 July 2026 it requires only "support". It does not mandate AI in student assessment. Stronger arguments for Lane-2 practice are the Npuls/NVAO guidance and the labour-market evidence (Q1).
5. **Fairness nuance.** CHE allows Turnitin in AI-fraud investigations; Npuls says AI scores are not proof and need "horen en wederhoren" (hearing both sides) and oral questioning.
6. **For the student's own preparation.** Orals are AI-resilient but stressful (83% in the NYU pilot), and anxiety fell with practice (Davey). Rehearsing aloud explanations of OOD design choices is useful for both lanes.

### Gaps
- **CHE:** the OOD course's assessment form and the per-part levels are not public. I found no separate institution-wide AI policy beyond the OER. Whether CHE-ICT uses oral verification for level-1 work is unknown. A search snippet suggested the CHE Social Work OER 2025–26 allows oral defence ([CHE Social Work OER](https://www.che.nl/media/5oqlohid/hoofdstuk-08-bacheloropleiding-social-work-2025-2026.pdf)); not verified, and not ICT. Not checked: the CHE HBO-ICT accreditation report (2025, published on DEQAR February 2026), for panel remarks on GenAI.
- **Other Dutch bodies:** no GenAI-specific position found from HBO-i or Vereniging Hogescholen, and no separate SURF assessment guidance beyond the joint Npuls work. Npuls handreikingen 1–3 were not read in full.
- **Not read:** Leiden "FAIR-ASSESS" advisory report (April 2026) ([Leiden](https://www.universiteitleiden.nl/fair-assess/activiteiten)) and Hogeschool Leiden "Leidraad AI en onderwijs – docenten 2026" ([HSL](https://www.hsleiden.nl/sites/default/files/2026-06/Leidraad%20AI%20en%20onderwijs%20-%20docenten%202026.pdf)).
- **AIAS:** the exact names of levels 2–4 in the 2025 published version were not verified in-session.
- **Sydney:** the Semester-2-2025 start of the formal two-lane approach is search-snippet level.
- **Digital Omnibus:** the exact amended Article 4 text, the regulation number and the adoption date were not verified on EUR-Lex.
- **Oral assessment:** no rigorous validity study of oral assessment of programming or design under GenAI conditions was found.

## 4. Evidence on deskilling from AI assistance in professional work, and the "paradox of supervision"

### Takeaway
The clearest professional deskilling signal is medical. Budzyń et al. 2025 found that experienced endoscopists' adenoma detection *without* AI fell from **28.4% to 22.4%** after routine AI use. The study is observational, with 19 endoscopists.

In software, the evidence is short-term, self-reported or qualitative:

- Anthropic's RCT (January 2026; vendor): AI-assisted learners scored lower on mastery (d≈0.74), worst on **debugging**.
- Anthropic's internal study (December 2025; vendor) names the **"paradox of supervision"**: supervising AI requires the very coding skills that heavy AI use may erode.
- Lee et al. (CHI 2025): higher confidence in GenAI goes with less critical thinking, and critical thinking shifts toward verification.

Across studies, AI-boosted performance can mask missing skills (novices: "never-skilling", illusion of competence) or decaying skills (experts).

### Cited Findings

#### Medicine
- **[Observational, multicentre] Budzyń et al., *Lancet Gastroenterology & Hepatology*** (online 12 Aug 2025; Oct 2025 issue, vol. 10, pp. 896–903; DOI 10.1016/S2468-1253(25)00133-5) — [EurekAlert](https://www.eurekalert.org/news-releases/1094223); [Warwick WRAP](https://wrap.warwick.ac.uk/id/eprint/191005)
    - Setting: four Polish centres, Sept 2021–Mar 2022, with AI introduced at the end of 2021. 19 experienced endoscopists, each with more than 2,000 prior colonoscopies.
    - Adenoma detection in non-AI colonoscopies: **28.4% (226/795) before vs 22.4% (145/648) after** AI introduction. That is −6.0 percentage points, about 21% relative; the release rounds it to 20%. AI-assisted colonoscopies: 25.3% (186/734).
    - Limitations: observational design, and experienced endoscopists only.
    - Linked comment (Omer Ahmad): "we must also safeguard against the quiet erosion of fundamental skills".
    - Critique: the analysis drew on only 19 endoscopists — [ACG Evidence-Based GI](https://gi.org/journals-publications/ebgi/zhou_sep2025/)
- **[Review / framework] Abdulnour, Gin & Boscardin, "Educational Strategies for Clinical Supervision of Artificial Intelligence Use"**, *NEJM* 393(8):786–797 (2025), DOI 10.1056/NEJMra2503232 — [News-Medical](https://www.news-medical.net/news/20250828/How-can-medical-trainees-use-AI-without-losing-critical-thinking-skills.aspx); [OnlineMedEd](https://www.onlinemeded.com/blog/deskilling-never-skilling-mis-skilling-ai-medical-education) (secondary)
    - It frames three risks:
        - **deskilling** (erosion through over-reliance);
        - **mis-skilling** (adopting AI errors);
        - **never-skilling** (foundational skills never acquired because AI did the task first).
    - It proposes the DEFT-AI supervision framework.
    - Conflict: some sources credit the term "never-skilling" to a 2026 *Nature Medicine* perspective (Ke, Car, Liu et al.). Not verified.

#### Software engineering
- **[Survey + interviews + usage logs] Anthropic, "How AI is transforming work at Anthropic"** (2 Dec 2025). COI: vendor studying its own employees — [Anthropic](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic)
    - **Method:** August 2025. 132 engineers and researchers surveyed (31% response rate on direct outreach). 53 interviews. 200,000 internal Claude Code transcripts (Feb and Aug 2025).
    - **Use and productivity:** self-reported Claude use rose from 28% to 59% of daily work. Self-reported productivity rose from about +20% to about +50%. 27% of Claude-assisted work would not otherwise have been done. **More than half can "fully delegate" only 0–20% of their work.**
    - **The paradox:** engineers worry about "skills atrophying as [they] delegate more". The report names a **"paradox of supervision"**: using Claude well requires supervision, and supervising it requires coding skills that AI overuse may erode.
    - **Learning:** "When producing output is so easy and fast, it gets harder and harder to actually take the time to learn something."
    - **Role shift:** one engineer moved "70%+ to being a code reviewer/reviser rather than a net-new code writer".
    - **Mentorship:** juniors ask seniors fewer questions; some report fewer mentorship opportunities, while about half report unchanged collaboration.
    - **Stated limitations:** convenience sampling, non-anonymous responses (social-desirability bias), recall bias, self-reported productivity, and Anthropic-specific models and context.
- **[RCT] Shen & Tamkin (Anthropic, January 2026).** See Q2 for details. AI impaired "conceptual understanding, code reading, and debugging abilities" without significant efficiency gains, with **the largest gap on debugging**. Delegation patterns scored 24–39%; conceptual-inquiry patterns scored 65–86% — [arXiv 2601.20245](https://arxiv.org/html/2601.20245v2)
- **[Vendor telemetry; search-snippet level] Anthropic oversight research.** As users gain experience with Claude Code, they "stop reviewing each action" and intervene only when needed. A later post reports that users approved about 93% of permission prompts, and treats per-action approval as fallible — [Measuring agent autonomy](https://www.anthropic.com/research/measuring-agent-autonomy); [How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude). Dates and wording not verified.
- **[RCT] METR (July 2025):** developers were 19% slower with AI but *believed* they were 20% faster. This is a calibration gap relevant to self-supervision — [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- **[Survey] Stack Overflow 2026:** 17.1% of respondents avoid AI at work or school out of concern about losing job skills — [SO 2026 AI](https://survey.stackoverflow.co/2026/ai)
- **[Qualitative, in the window] Yu & Moon, "Who Will Become the Next Senior? How Generative AI Erodes the Development Pathway in Software Engineering"** (arXiv v1 19 Jul 2026, v3 25 Aug 2026; accepted to AIES 2026) — [arXiv 2607.17067](https://arxiv.org/abs/2607.17067)
    - Method: 14 interviews with juniors and seniors in South Korea, using reflexive thematic analysis.
    - Core pattern, "Absorption": entry-level work is absorbed into seniors' AI workflows. Consequences:
        - juniors lose "productive struggle";
        - university classes normalising GenAI reproduce this loss;
        - seniors and juniors perceive the situation differently.

#### Knowledge workers and learners
- **[Survey] Lee et al., CHI 2025** (Microsoft Research + CMU). COI: Microsoft sells Copilot. Source: [paper PDF](https://advait.org/files/lee_2025_ai_critical_thinking_survey.pdf)
    - Sample: 319 knowledge workers, 936 examples of GenAI use.
    - "higher confidence in GenAI is associated with less critical thinking, while higher self-confidence is associated with more critical thinking".
    - GenAI shifts critical thinking "toward information verification, response integration, and task stewardship".
- **[RCT] Bastani et al. (PNAS 2025):** unguarded GPT-4 practice gave −17% on later unassisted exams; the guardrailed tutor gave no harm — [IDEAS](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html)
- **[Qualitative] Prather et al. (ICER 2024):** struggling novices finished "with an illusion of competence" — [arXiv 2405.17739](https://arxiv.org/abs/2405.17739)

#### The paradox stated in policy texts
- **Sydney Green Paper (August 2026):** AI may "Introduce errors, bias and misinterpretation that students do not have the knowledge to detect", and students "may perform well in AI-supported tasks while failing to develop underlying capability" — [Sydney](https://educational-innovation.sydney.edu.au/teaching@sydney/wp-content/uploads/2026/08/AI-in-Education-at-The-University-of-Sydney-Green-Paper.pdf)
- **Npuls:** a student may submit a "perfect verslag" (perfect report) with AI, but that does not guarantee they "de beoogde competenties daadwerkelijk bezit" (actually possess the intended competences) — [Npuls](https://www.npuls.nl/_assets/3cff3f77-9fb0-4226-adb0-66d44de18c85/Visie-op-toetsing-en-examinering-Npuls.pdf)

### Inferences
- **The paradox is sharper for students than for professionals.** The Anthropic engineers must *maintain* supervisory skills they already have. A year-2 student must *acquire* them, which is the "never-skilling" risk. The skills that supervision needs (debugging, code reading, conceptual models) are the same ones the Anthropic RCT found most damaged by delegation. This argues for:
    - protected AI-free practice and assessment of core OOD and debugging skills;
    - plus deliberate practice in reviewing AI output (Q2/Q3).
- **How AI is used matters as much as whether.** Delegation-type patterns hurt; explanation-seeking or guardrailed patterns largely did not (Anthropic RCT, Bastani). A binary AI level is therefore a blunt instrument for *learning*, though it is the right instrument for *assurance*.
- **Calibration is itself a supervisory skill to train.** METR's perception gap, Prather's illusion of competence, and Lee's "confidence in AI reduces critical thinking" all point the same way. A practical habit: predict output or test results before running, then compare.
- **Maintenance.** The medical finding suggests skills can decay after only months of routine AI use, even in experts. Periodic unassisted retrieval practice, such as the project's Fibonacci reviews, is a plausible countermeasure. There is **no direct software-engineering evidence** that it prevents decay.
- **COI weighting.** Two of the three software sources are by Anthropic, the maker of Claude (the tool this student uses). They report risks to Anthropic's own value proposition, which adds some credibility. Still, they are not independently replicated, and the RCT used a GPT-4o-based assistant with crowd workers on a single one-hour task.

### Gaps
- No longitudinal study measuring skill decay in working software developers over months or years was found. The evidence is short-term RCTs, self-reports and interviews.
- Budzyń et al.: the odds ratio and CI were not retrieved; the press release gives proportions only.
- The origin of the term "never-skilling" (NEJM 2025 vs *Nature Medicine* 2026) is unresolved. The *Nature Medicine* perspective was not verified.
- Classic background not retrieved this session: Bainbridge (1983), "Ironies of Automation", makes the same supervision argument. Verify before citing.
- Not verified: MIT Media Lab's "Your Brain on ChatGPT" (2025, EEG preprint).
- Unreviewed in-window leads on software engineering:
    - "The Impact of AI Coding Assistants on Software Engineering: A Longitudinal Study" ([arXiv 2605.23135](https://arxiv.org/pdf/2605.23135), May 2026);
    - "The Productivity-Reliability Paradox: Specification-Driven Governance for AI-Augmented Software Development" ([arXiv 2605.01160](https://arxiv.org/pdf/2605.01160), May 2026).
- The Anthropic oversight-telemetry claims (93% prompt approval; reduced per-action review) are search-snippet level only.
