---
title: "The shift in skill needs: jobs, the economics of hand-written code, and what to practise"
description: "What AI changes in the labour market for junior developers and in the economics of hand-written code, and which skills are still worth practising by hand."
---
# 2.9 The shift in skill needs: jobs, the economics of hand-written code, and what to practise

The first version of this review assumed that the goal is to write code without AI. That holds for an exam without AI, for example an assessment that allows AI only at level 0/1 and includes an oral defence. It was never argued for the career that follows. This section tests the claim that **writing code by hand is no longer economical**, and asks which skills employers now pay for.

Most of the evidence is from the US, and Dutch data are added where they exist. Most sources here are working papers, government statistics or industry reports rather than peer-reviewed studies. Grades follow §2.0.

**How much code does AI already write?** The figures measure different things and cannot be compared directly.

| Source | Claim | What is counted | Grade |
|---|---|---|---|
| Google (Pichai, April 2026) | 75% of new code, up from 50% in autumn 2025 and 25% in 2024 | "AI-generated and approved by engineers"; no definition given | D |
| Anthropic (May 2026) | More than 80% of merged code | Lines merged to production that can be attributed to Claude | D (vendor) |
| Snap (April 2026) | 65% | Not disclosed. Planned headcount was cut right after | D |
| GitHub Octoverse (October 2026) | Agents started 17% of pull requests in March 2026 and over 40% in September | Pull requests whose first draft came from an agent GitHub can detect. A floor, and pull requests, not lines | C (vendor telemetry) |
| [Daniotti et al. (2026)](https://doi.org/10.1126/science.adz9311), *Science* | About 29% of Python functions by US developers, end of 2024 | A classifier on more than 30 million public GitHub commits | C (peer reviewed, independent) |
| Sonar survey (January 2026) | Developers estimate 42% of their committed code, and expect 65% by 2027 | Self-estimate | C (vendor) |

The direction is clear on every measure: steep growth from 2024 to 2026, with a step from autocomplete to agent-drafted pull requests in 2026. "Most new code at AI-forward companies is drafted by AI" is plausible. "Most code everywhere is written by AI" is not established. Every company claim adds that engineers approve the code, so a human is still accountable for every merged line.

**Productivity: who gains, and where the bottleneck went.**

- **Field experiments with 2022–23 code completion** ([Cui et al., 2025](https://www.mertdemirer.com/Papers/Demirer_AI_productivity.pdf)): 4,867 developers at Microsoft, Accenture and a Fortune-100 firm completed about 26% more tasks (SE 10.3%). Less experienced developers adopted more and gained more. Two co-authors work at Microsoft. *Grade A, working paper.*
- **Google's internal trial** ([Paradis et al., 2024](https://arxiv.org/abs/2410.12944)): about 21% less time on one enterprise task, with 96 Google engineers. *Grade B, vendor.*
- **METR:** experienced developers were 19% *slower* on their own mature repositories, and the 2026 follow-up was unreliable (§2.8). *Grade A/B.*
- **Cursor adoption** ([He et al., 2026](https://doi.org/10.1145/3793302.3793349); difference-in-differences on GitHub projects): a large but **transient** speed-up, significant only in the first two months. It came with a **persistent** rise in static-analysis warnings (about +30%) and code complexity (about +41%), which later slowed the projects down. *Grade B.*
- **Task type:** gains of about 35–40% on simple greenfield tasks and 10% or less on complex legacy code (Stanford research cited in DORA's ROI report). *Grade C.*
- **Firm telemetry on agents** ([Chen & Stratton, 2026](https://fion.ac/jellyfish.pdf); Harvard working paper, version of 9 November 2026). *Grade B, quasi-experimental (timing of adoption).* Data from the engineering-analytics platform Jellyfish: 720,542 workers at 655 firms, January 2021 – August 2026. Twelve months after adopting AI agents, lines of code rose 44.0% and pull requests 35.7%, but resolved Jira issues rose only 13.7% (borderline significant). The time from review submission to approval rose **56.1%**. There was no detectable effect on employment. An August version with 718 firms reported different figures, so cite this one.
- **Writing code vs. shipping code** ([Demirer, Musolff & Yang, 2026](https://doi.org/10.3386/w35275); NBER working paper, revised September 2026). *Grade B.* Over 500,000 GitHub developers with AI-usage telemetry: autonomous agents raised commits by 240%, but projects by only 80% and releases by 30%.
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

- **[Stack Overflow 2026](https://survey.stackoverflow.co/2026/ai)** (over 30,000 respondents):
    - 66% use coding assistants or agents; the top use is generating code in familiar areas (69.3%).
    - 48% trust AI only when they can easily check its answers, and only 6.6% trust it with important decisions.
    - Design (49%) and communication (35%) are rated least useful for AI.
    - 17.1% avoid AI because they worry about losing job skills.
- **[JetBrains 2026](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/):** 90% use agents at least weekly (vendor).

*Grade C.*

**Jobs.**

- **Young workers in the US: evidence for an AI effect.** *Grade B, quasi-experimental working papers.*
    - **Stanford "Canaries"** (revised August 2026; ADP payroll data to June 2026): employment of 22–25-year-olds in the most AI-exposed occupations is 19% below where it would be had it kept pace with less-exposed peers, up from 15% a year earlier. The gap comes through less hiring, not layoffs, and older workers show none. The authors call the result descriptive.
    - **Fed Board** (Crane & Soto, March 2026): coder employment growth is about 3 percentage points a year lower since ChatGPT, after controlling for industry shocks.
    - **Census** ([Tucker, April 2026](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-27.html)): early-career employment in the most exposed industries fell 12% over 10 quarters, and monetary policy explains at most a quarter of that.
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
    - **Most direct evidence for HBO-ICT:** employment of hbo and wo ICT graduates was "barely" negative through the 2024 cohort ([Cnossen, July 2026](https://esb.nu/voor-de-meeste-starters-verandert-ai-de-arbeidsmarkt-nog-niet/); CBS microdata; correlational).
    - **Disputed:** RaboResearch's −13% for young workers in AI-exposed jobs is contested by economists who point to monetary tightening ([Salomons & van den Berge, 2026](https://esb.nu/niet-zeker-dat-werkgelegenheid-onder-nederlandse-jongeren-daalt-door-genai/)).
- **Wage premia.** *Grade C.*
    - **Sellers' figures:** [PwC (2026)](references.md#ref-pwc-2026) reports a 62% premium for AI skills and Lightcast 28%. Both sell AI or labour-market services, and both figures are correlational.
    - **Independent wage data:** they point to experience and judgement as what protects pay. AI exposure hurts wage growth only where the experience premium is low ([Dallas Fed, 2026](https://www.dallasfed.org/research/economics/2026/0224)).
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
- **Institutional rules** turn this into AI levels. CHE's rules ([OER 2026](https://che.nl/algemeen/oer)–27, ICT, art. 7.11) are an example, and this review uses their three levels:
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

1. **Keep, by hand, until L3:** core OOD and C# (classes and state, encapsulation, inheritance and interfaces, the patterns). They are what an exam without AI tests, and the base for judging AI code. AI is also weakest on interfaces, abstract classes and inheritance ([Lepp & Kaimre, 2026](https://arxiv.org/abs/2608.16318)).
2. **Add, as a new skill track:**
            - reading and reviewing AI-generated code;
            - finding a planted bug;
            - writing tests that would catch AI mistakes;
            - specifying a task precisely enough for an agent;
            - predicting what the AI will produce and comparing;
            - checking AI code for common security flaws such as missing input validation and injection.

   Do this on topics you can already write yourself, so you can judge the output.

3. **Delegate (already L4):** tooling, project setup, and boilerplate you have mastered.
