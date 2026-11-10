# AI coding economics: share of AI-written code, productivity, quality/security, capability, cost and employer expectations (evidence up to 7 November 2026)

Evidence labels used throughout: **[A]** independent measurement (RCT, field or quasi-experiment, telemetry, repository study); **[A-vendor]** measurement run or published by a party that sells the tool or a competing/related product; **[B]** large developer survey (self-report); **[C]** vendor or executive claim. Retrieval status: "primary read" = I read the primary page; "via secondary" = primary not retrievable (HTTP 403 or landing page only), figures come from press/aggregators; "search excerpt" = figure seen only in a search-result excerpt, not on a page I opened. **COI note:** these notes were compiled by Claude, an Anthropic model. Items where Anthropic or a Claude model is a party are flagged **[COI-Anthropic]**.

## 1. How much production code is written by AI, and how is "AI-written" defined and measured?

### Takeaway
Executive claims rose fast: Google went from 25% (2024) to 50% (autumn 2025) to 75% of *new* code in April 2026, and Anthropic reported >80% of merged lines in May 2026. These firms use undisclosed or self-serving definitions. The only peer-reviewed independent estimate (Science) put US Python functions written with substantial AI support at about 29% by the end of 2024. GitHub telemetry shows agents drafting more than 40% of pull requests by September 2026. "Most new code at AI-forward firms is AI-drafted" is plausible. "Most code everywhere is AI-written" is not established.

### Cited Findings

#### [A] Independent measurement (repository and telemetry studies)
- **Science paper (peer-reviewed), "Who is using AI to code? Global diffusion and impact of generative AI".**
  - **Method:** a neural classifier, trained on human-written functions plus synthetic LLM-generated equivalents, applied to >30 million GitHub commits by 160,097 developers.
  - **Estimate:** by the end of 2024, ~29% of Python functions by US developers were produced with substantial AI support. The US lead over other countries is narrowing.
  - **Definition:** classifier-flagged Python functions in public GitHub commits. This is not private or production code.
  - **Authorship:** led by Complexity Science Hub / Utrecht University researchers, per secondary coverage.
  - **Retrieval:** the primary page returned 403, so figures come from Science's own social post and search excerpts. Exact publication date not verified.
  - Sources: [Science](https://www.science.org/doi/10.1126/science.adz9311); [Science Magazine on X](https://x.com/ScienceMagazine/status/2017431917302259866); [Omniscient Media](https://www.omniscient.media/post/ai-now-writes-nearly-one-third-of-new-code-on-github-landmark-study-finds)
- **SemiAnalysis** (industry analyst; not peer-reviewed; methodology not public in the sources seen).
  - **Estimate:** Claude Code made ≈4% of public GitHub commits (>135,000 commits/day), with data through ~2 Feb 2026. Projection: ≥20% of daily commits by end-2026.
  - **Detection:** relies on Claude Code's default co-author trailer, which users can switch off, so it undercounts. Critics note the activity is concentrated in low-star repositories.
  - Anthropic has cited this estimate **[COI-Anthropic]**.
  - Sources: [OfficeChai](https://officechai.com/ai/4-of-github-commits-are-now-made-by-claude-code-semianalysis-report); [Xataka](https://www.xataka.com/robotica-e-ia/claude-code-esta-siendo-gran-favorito-programadores-que-firma-4-todo-que-se-sube-a-github); [Habr](https://habr.com/ru/post/1015222)
- **[A-vendor] GitHub Octoverse 2026.** Published 28 Oct 2026, covering the 12 months to 30 Sep 2026, public and private repos. GitHub is owned by Microsoft and sells Copilot.
  - **Agent share:** agents "started" ~17% of PRs in March 2026 and >40% in September 2026 (~110 million PRs that month).
  - **Definition:** "agent-started" means the PR's first draft came from an agent GitHub can detect. That makes it a floor, and it is a share of PRs, not of lines of code.
  - **Volume:** 34.3 billion commits (vs 12.9 billion the year before); 1.3 billion merged PRs (vs 538 million in 2025); 17.9 billion pushes.
  - **Retrieval:** the primary report was not retrievable (landing page only / 403). Figures are consistent across secondary coverage.
  - Sources: [Octoverse landing page](https://octoverse.github.com/); [Visual Studio Magazine](https://visualstudiomagazine.com/articles/2026/10/29/github-octoverse-agents-started-more-than-40-percent-of-september-pull-requests.aspx); [GitGuardian](https://blog.gitguardian.com/github-octoverse-2026/); [DataStudios](https://www.datastudios.org/post/github-octoverse-2026-17-9-billion-pushes-agents-start-40-percent-pull-requests)
- **[A-vendor] GitClear 2026** says AI authorship has reached "a substantial percent of all commits". It gives no figure and does not disclose how it attributes code to AI. — [GitClear](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)

#### [B] Surveys
- **Sonar "State of Code" developer survey.** Released 8 Jan 2026; n=1,149 professional developers. Sonar sells code-quality and verification tools (COI).
  - Respondents estimate that AI produces 42% of their committed code, and expect 65% by 2027.
  - Sources: [Sonar press release](https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/); [The Register](https://www.theregister.com/2026/01/09/devs_ai_code/)

#### [C] Vendor and executive claims
- **Google: Sundar Pichai, Cloud Next 2026 / blog, ~22 April 2026.**
  - Quote: "Today, 75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall." The 2024 figure was 25%.
  - **Scope:** new code only. The definition (characters, accepted suggestions or lines) and the rework rate were not disclosed.
  - Pichai also cited one complex code migration completed "six times faster" than a year earlier.
  - Sources: [Semafor, 24 Apr 2026](https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated); [Fast Company](https://www.fastcompany.com/91531519/google-ceo-says-75-of-the-companys-code-is-ai-generated)
- **Meta and Snap (same Semafor article).** Meta "targets similar levels by midyear" (2026). Snap reached 65% AI-generated code (April 2026) and immediately cut planned headcount. — [Semafor](https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated)
- **Microsoft: Satya Nadella, LlamaCon, April 2025.** 20–30% of code in Microsoft's repositories is "written by software". Coverage notes that it is unclear how Microsoft and Google measure this. No 2026 Microsoft figure found. — [Yahoo Tech](https://tech.yahoo.com/ai/articles/nearly-third-microsofts-code-ai-164500617.html)
- **Meta: Mark Zuckerberg, LlamaCon, April 2025.** "in the next year probably… maybe half the development is going to be done by AI". He said he did not have current figures. — [Yahoo Tech](https://tech.yahoo.com/ai/articles/mark-zuckerberg-wants-ai-half-014631495.html)
- **Anthropic [COI-Anthropic]: "When AI builds itself"** (Anthropic Institute, early June 2026; page updated 18 Sep 2026).
  - Quote: "As of May 2026, more than 80% of the code we merge into Anthropic's codebase was authored by Claude."
  - **Definition:** "share of lines merged to production that can be attributed to Claude". Anthropic calls it conservative because "our attribution pipeline has gaps". Leadership estimates "90% or more".
  - Per Decrypt, the share was in the low single digits when Claude Code launched in February 2025.
  - Sources: [Anthropic](https://www.anthropic.com/institute/recursive-self-improvement); [Decrypt](https://decrypt.co/370089/ai-already-developing-ai-anthropic-humans-slowing-things-down)
- **Coinbase: Brian Armstrong, August 2025.** ~33% of code written by AI, with a target of 50% by the end of that quarter. Sources differ on "new code" vs all code. — [TechCrunch](https://techcrunch.com/2025/08/22/coinbase-ceo-explains-why-he-fired-engineers-who-didnt-try-ai-immediately)
- **Y Combinator (CNBC interview, March 2025).**
  - Claim: about a quarter of the Winter 2025 batch had codebases ~95% AI-generated. Attributed to Garry Tan and managing partner Jared Friedman.
  - YC has published no data behind the number. Skeptics include a Harness field CTO ("taken with a pinch of salt").
  - Sources: [NBC New York (CNBC syndication)](https://www.nbcnewyork.com/news/business/money-report/y-combinator-startups-are-fastest-growing-most-profitable-in-fund-history-because-of-ai/6188199/); [LeadDev](https://leaddev.com/hiring/95-ai-written-code-unpacking-the-y-combinator-ceos-developer-jobs-bombshell)
- **Unconfirmed figures.** Blogs claim that "51% of GitHub commits are AI-generated or AI-assisted" or that "46% of code is AI-generated". I found no primary GitHub source for either. — [Vibe Coding Academy](https://vibe-coding.academy/blog/ai-code-51-percent-github-commits-majority-tipping-point-2026/); [AgentsCamp](https://agentscamp.com/guides/concepts/ai-coding-statistics-2026)

### Inferences
- The figures measure different things and cannot be lined up:
  - Google: "new code AI-generated and approved".
  - Anthropic: "lines merged, attributable to Claude".
  - GitHub: "PRs whose first draft came from a detectable agent".
  - Science: "classifier-flagged Python functions".
  - Sonar: "self-estimated share of committed code".

  The highest figures (75–90%) come from companies that sell AI (or AI-forward firms), which have an incentive to show adoption. The independent figures are lower and lag behind (~29% at end-2024).
- The direction is clear across every measure: steep growth from 2024 to 2026. In 2026 there was a step change from completion-style assistance to agent-drafted PRs (17% → >40% of GitHub PRs in six months).
- Every big-company claim says "approved/reviewed by engineers", so humans stay accountable for every merged line. The likely 2027–2029 junior workplace: machines write much of the first draft, and human value sits in specifying, reviewing and integrating.

### Gaps
- No independent, peer-reviewed estimate of the AI share in private/production code for 2025–2026. The Science estimate stops at end-2024 and covers Python only. Nothing specific to C#/.NET or to Dutch employers.
- Google, Meta and Microsoft have not disclosed measurement definitions (characters vs lines vs accepted suggestions) or rework/revert rates for AI code.
- The Octoverse 2026 primary report and the Science paper could not be opened (403). Exact wording should be checked.
- A secondary site attributes "code origin" figures to JetBrains 2026 (47% agent-written / 38% AI-assisted / 27% manual). They sum to >100% and do not appear in JetBrains' own text, so they are unverifiable and are not used here.
- Meta's actual 2026 share (as opposed to its target) was not found.

## 2. Productivity: what do RCTs and field experiments find, who gains most, and where is the bottleneck now?

### Takeaway
The rigorous evidence is mixed and mostly predates agentic tools:
- Field RCTs with 2022–23 code-completion tools found ~26% more completed tasks, with gains concentrated among less-experienced developers.
- Google's internal RCT found ~21% less time on one task.
- METR's 2025 RCT found experienced developers 19% *slower* on their own mature repos.
- METR's late-2025 follow-up points to small speedups (−4% to −18% task time, with confidence intervals crossing zero). METR itself calls these results unreliable because of selection effects.

Gains are largest on simple greenfield work and for juniors. The bottleneck has moved to review/verification, testing and integration.

### Cited Findings

#### [A] RCTs, field experiments and quasi-experiments
- **Cui, Demirer, Jaffe, Musolff, Peng, Salz, "The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers".**
  - **Status:** working paper, June 2025 version; post-registered as AEARCTR-0014530; journal publication not confirmed.
  - **Design:** RCTs run by Microsoft, Accenture and an anonymous Fortune-100 electronics firm. 4,867 developers got randomized access to GitHub Copilot *code completions* (2022–2023 era) for 2–8 months.
  - **Results:** the instrumental-variable estimate (local average treatment effect for adopters) is +26.08% (SE 10.3%) weekly completed tasks (pull requests). Commits +13.55% (SE 10.0%); builds +38.38% (SE 12.55%).
  - "Less experienced developers had higher adoption rates and greater productivity gains". An MIT-hosted draft reports juniors at +21% to +40% vs "more marginal" gains for seniors (search excerpt).
  - **COI:** co-authors Jaffe and Peng are Microsoft employees, and Microsoft/GitHub sell Copilot.
  - Sources: [paper PDF, primary read](https://www.mertdemirer.com/Papers/Demirer_AI_productivity.pdf); [MIT draft](https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf)
- **Paradis et al. (Google), "How much does AI impact development speed? An enterprise-based randomized controlled trial".**
  - **Status:** arXiv preprint, Oct–Nov 2024; no venue listed.
  - **Design and result:** 96 full-time Google engineers, one complex enterprise-grade task, three AI features. Best estimate: ~21% less time on task. The confidence interval is described as "large" (bounds not on the abstract page).
  - **COI:** Google studying its own tools.
  - Source: [arXiv 2410.12944](https://arxiv.org/abs/2410.12944)
- **METR 2025 RCT** (non-profit; Feb–Jun 2025; experienced open-source developers on their own repositories; tasks randomized to AI-allowed or AI-disallowed).
  - AI made tasks take 19% longer (CI +2% to +39%).
  - Afterwards, developers estimated that AI had made them ~20% *faster*.
  - Sources: [METR, 24 Feb 2026](https://metr.org/blog/2026-02-24-uplift-update/); [ScienceBlog](https://scienceblog.com/t-a-randomized-trial-by-metr-found-that-experienced-developers-completed-real-coding-tasks-19-slower-when-allowed-to-use-ai-tools-yet-afterwards-they-estimated-on-average-that-ai-had-made-them-20-fast/)
- **METR follow-up** (started August 2025; published 24 Feb 2026; not peer-reviewed).
  - **Sample:** 57 developers (10 returning, 47 new), median 10 years' experience, 143 repos, 800+ tasks. Paid $50/h, vs $150/h in the original study.
  - **Results:** returning developers −18% task time (a speedup), CI −38% to +9%. New developers −4%, CI −15% to +9%.
  - **Selection problem:** 30–50% of developers did not submit some tasks because they did not want to do them without AI. Per METR, this "likely biases downwards our estimate of AI-assisted speedup", and the data are "only very weak evidence for the size of this increase".
  - **Next steps:** METR is redesigning the study (developer-level randomization, fixed tasks, shorter experiments, observational data).
  - Source: [METR, primary read](https://metr.org/blog/2026-02-24-uplift-update/)
- **METR Frontier Risk Report (19 May 2026).**
  - Summarizes the late-2025 RCT as "small productivity benefits (~4–20%)", which METR expects to be an underestimate.
  - Recent self-report surveys show geometric-mean gains of 1.6x–4x, but "self-reports have overestimated benefits in the past".
  - Source: [METR](https://metr.org/blog/2026-05-19-frontier-risk-report/)
- **He, Miller, Agarwal, Kästner, Vasilescu (CMU), "Does AI-Assisted Coding Deliver? A Difference-in-Differences Study of Cursor's Impact on Software Projects".**
  - **Status:** arXiv 2511.04427 (v1 6 Nov 2025; v3 26 Jan 2026). A published version, "Speed at the Cost of Quality", has ACM DOI 10.1145/3793302.3793349. The venue appears to be the MSR 2026 proceedings (not confirmed).
  - **Design:** matched difference-in-differences comparing Cursor-adopting GitHub projects with similar projects.
  - **Velocity:** "a significant, large, but transient increase in project-level development velocity". Per a search excerpt of v1: commits ≈+55% and lines added ≈+281% in month one, significant only in the first two months.
  - Sources: [arXiv](https://arxiv.org/abs/2511.04427v2); [ACM](https://dl.acm.org/doi/10.1145/3793302.3793349)
- **BIS Working Paper 1208 (2024).** Quasi-experiment at a Chinese firm using the CodeFuse assistant, treated teams vs matched controls. Code output rose by >50%. The gains were statistically significant only for entry-level/junior staff (search excerpt). — [RePEc](https://ideas.repec.org/p/bis/biswps/1208.html)
- **Aalto University MSc thesis, pilot RCT.** 25 professional developers at a Finnish consultancy; small and described as "suggestive". The effect was driven by developers with ≤1 year of experience (+67%); no significant change for seniors (search excerpt). — [Aalto](https://aaltodoc.aalto.fi/bitstreams/dfab4e9d-292f-4c78-a9de-44d101b98482/download)
- **Stanford SEPP research, as cited in the DORA ROI report.** ~35–40% productivity gains on simple greenfield tasks vs ≤10% on complex legacy code. — [InfoQ](https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/)
- **[A-vendor] GitClear (January 2026 research, cited on its 2026 page).** Heavy AI users produced 4–10x more than non-users, but most of that gap predated AI. Compared with their own past output, heavy users gained ~25% velocity. — [GitClear](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)
- **Anthropic skill-formation RCT** (29 Jan 2026; not peer-reviewed) **[COI-Anthropic]**. The finding cuts against Anthropic's commercial interest.
  - **Design:** 52 mostly junior engineers learned the Trio async Python library.
  - **Quiz results:** the AI group scored 50% vs 67% for the hand-coding group (Cohen's d 0.738, p=0.01). The speedup with AI was not statistically significant.
  - **Debugging:** the largest gap was on debugging questions. The authors hypothesize that the control group built debugging skill by resolving errors themselves.
  - **Usage patterns:** low scorers (<40%) delegated code generation or debugging to AI. Higher scorers also used AI for conceptual questions.
  - **Caveat:** the study measures comprehension shortly after a single learning session.
  - Sources: [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills); [InfoQ](https://infoq.com/news/2026/02/ai-coding-skill-formation/)

#### [B] Surveys
- **DORA 2025 "State of AI-assisted Software Development"** (Google Cloud; September 2025).
  - 90% of technology professionals use AI at work. Over 80% believe it increased their productivity.
  - Higher AI adoption is associated with higher delivery throughput *and* higher delivery instability.
  - AI is framed as an "amplifier" of an organization's existing strengths and weaknesses.
  - Sources: [DORA](https://dora.dev/research/2025/dora-report/); [Faros summary](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025); [InfoQ](https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/)
- **No DORA 2026 survey found.** As of 7 Nov 2026 I found no DORA 2026 "State of AI-assisted Software Development" survey report. DORA instead published "ROI of AI-Assisted Software Development (2026.01)", covered by InfoQ on 11 May 2026 (see Q5). — [InfoQ](https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/)
- **Stack Overflow 2026** (6 Oct 2026; >30,000 respondents from 169 countries). Share rating AI useful/very useful: implementation 74%, debugging/refactoring 66%, design 50%, team communication 45%. — [SO press release](https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional)
- **Stack Overflow 2025** (July 2025). The biggest frustration, cited by 66%: "AI solutions that are almost right, but not quite". 45.2% say "debugging AI-generated code is more time-consuming". — [SO 2025 AI](https://survey.stackoverflow.co/2025/ai)

#### Where the bottleneck now sits (mixed evidence types)
- **[C, COI-Anthropic] Anthropic.**
  - In Q2 2026 the typical engineer merged 8x as much code per day as in 2024. Lines of code per engineer per day had been flat from 2021 to 2024.
  - Anthropic says the 8x figure "is almost certainly an overstatement of the true productivity gain".
  - "human code review has become a new bottleneck".
  - Source: [Anthropic](https://www.anthropic.com/institute/recursive-self-improvement)
- **[C, vendor guidance] DORA ROI report.**
  - Models a J-curve dip with three causes: the learning curve, the "verification tax" of reviewing AI-generated code, and adapting downstream testing and change approval.
  - Without strong platform and workflow foundations, local gains "are lost downstream".
  - Source: [InfoQ](https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/)
- **[C, vendor guidance] DORA insight, March 2026** (search excerpt). AI "can easily inflate the volume of code generated", so leaders must stop relying on output-based metrics. — [DORA insights](https://dora.dev/insights/balancing-ai-tensions/)
- **[B] JetBrains 2026** (search excerpt; primary returned 403). 42% of developers who review agent-generated code use an AI agent to help with that review. — [JetBrains blog](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
- **[B, vendor] Sonar 2026.** 96% do not fully trust that AI-generated code is functionally correct, yet only 48% always check it before committing. — [Sonar](https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/)
- **[A-vendor] Octoverse 2026.** By September, 90% of agent-started PRs were merged within two weeks, vs ~86% without detected agents. This measures merges, not correctness. — [GitGuardian](https://blog.gitguardian.com/github-octoverse-2026/); [DataStudios](https://www.datastudios.org/post/github-octoverse-2026-17-9-billion-pushes-agents-start-40-percent-pull-requests)

### Inferences
- **Throughput vs learning for juniors.** The strongest causal evidence (Cui et al.) concerns 2022–23 completion tools and shows the largest throughput gains for juniors. Anthropic's skill-formation RCT suggests that delegating to AI can reduce learning, especially debugging skill. For juniors, short-term throughput and skill development may trade off.
- **Where gains shrink.** For experienced developers in mature, complex codebases (METR; SEPP legacy), gains are small or uncertain. "Simple, greenfield, familiar" is where AI helps most. Course exercises resemble that category, so they may overstate how much AI helps in real legacy .NET systems.
- **The new limit is verification.** Productivity is now limited by verification capacity (review, tests, CI, change approval) more than by writing speed. Anthropic, DORA, Sonar, JetBrains and GitHub all agree on this despite different commercial incentives.
- **Self-reports overstate gains.** See the METR 2025 perception gap, METR's caution on 1.6x–4x survey estimates, and Anthropic's own caveat.

### Gaps
- No clean RCT of 2026-era agentic workflows yet (METR's redesign is pending). No 2026 Google internal RCT found. Journal publication of Cui et al. not confirmed.
- No study found that measures total effort per delivered feature (generation + review + rework + incidents) for AI-generated vs hand-written code.
- No RCT evidence specific to C#/.NET or to students in a degree programme.

## 3. Quality, security and maintainability of AI-generated code

### Takeaway
Functional correctness of generated code improved quickly, but security did not keep up. On Veracode's benchmark the security pass rate sat at ~55–56% from 2025 to July 2026, and rose only to 62% in the October 2026 snapshot. C# passed 59.6% and Java 31%; XSS and log-injection tasks still mostly fail. Repository studies link AI adoption to:
- more duplication and less refactoring;
- persistent increases in static-analysis warnings and complexity.

Vendor PR analyses find ~1.7x more issues in AI-co-authored PRs. The notable 2025–26 incidents were mostly agents taking destructive actions with over-privileged credentials, not subtle bugs.

### Cited Findings

#### [A-vendor] Security benchmarks
- **Veracode 2026 GenAI Code Security Report** (28 Jul 2026; Veracode sells application-security testing).
  - **Average security pass rate:** 56%, "barely changed from 55% in the first report" (July 2025). ≈44% of generation tasks "introduced a risky security vulnerability". Syntax is correct ~100% of the time.
  - **By model type:** reasoning models 56% vs non-reasoning 51%; large models 53% vs medium/small 51%. Top model was GPT-5.5 at 68%; more than half of the models sat at 50–53%.
  - **Per-CWE pass rates:** SQL injection 83%, cryptographic algorithms 87%, XSS 15%, log injection 12%.
  - Sources: [Veracode blog, primary read](https://www.veracode.com/blog/2026-genai-code-security-report-ai-risk/); [Business Wire headline](https://www.businesswire.com/news/home/20260728207685/en/LLMs-Are-Getting-Smarter-But-Not-Safer-Veracode-2026-GenAI-Code-Security-Report-Finds-AI-Generated-Code-Security-Has-Stalled-at-56-Pass-Rate)
- **Veracode Fall 2026 update** (29 Oct 2026; 18 models; 4 CWEs: CWE-89, CWE-327, CWE-80, CWE-117; languages Python, C#, JavaScript, Java).
  - **Average:** rose from 56% to 62%; the vulnerability rate fell from ~44% to ~38%.
  - **Top models:** Claude Opus 5.5 and GPT-6-Sol tied at 73%; Claude Sonnet 5.5 72% **[COI-Anthropic: Anthropic models top a third-party benchmark]**. Earlier ceilings: 72% (GPT-5 Mini, Oct 2025) and 68% (GPT-5.5, summer 2026).
  - **Language pass rates, July → October 2026:** Python ~62% → 64.22%; **C# ~58% → 59.55%**; JavaScript ~57% → 56.99%; Java 30% → 31.00%.
  - **CWE pass rates, July → October 2026:** XSS 15% → 18% (the "biggest movement"); log injection 12% → 12.6%; SQL injection 83% → 83.7%; crypto 87% → 87.4%.
  - Sources: [Veracode, primary read](https://www.veracode.com/blog/fall-2026-genai-code-security); [CybrSecMedia](https://www.cybrsecmedia.com/ai-generated-code-still-fails-38-of-security-tests-despite-gains-veracode-finds/)
- **Conflicting summaries.** One search summary claimed the Fall update showed the average "barely budged" at 55–56%. Veracode's own Fall post uses 55–56% for the earlier snapshots and reports 62% for Fall 2026. — [Veracode](https://www.veracode.com/blog/fall-2026-genai-code-security)

#### [A] Academic and independent repository studies
- **He et al. (CMU, Cursor difference-in-differences; see Q2).**
  - Finds "a significant and persistent increase in static analysis warnings and code complexity", which "acts as a major factor causing long-term velocity slowdown".
  - Magnitudes in v1 (search excerpt): warnings ≈+29.7%, complexity ≈+40.7%.
  - Sample per a secondary citation: ≈807 adopting repos vs 1,380 controls.
  - Sources: [arXiv abstract, primary read](https://arxiv.org/abs/2511.04427v2); [arXiv v1 HTML](https://arxiv.org/html/2511.04427v1)
- **Cynthia, Muttakin, Roy, "Beyond Bug Fixes: An Empirical Investigation of Post-Merge Code Quality Issues in Agent-Generated Pull Requests"** (arXiv 2601.20109, 27 Jan 2026; ACM DOI 10.1145/3793302.3793615 listed).
  - **Data and method:** 1,210 merged agent-generated bug-fix PRs (Python, AIDev dataset, 5 agents), SonarQube differential analysis.
  - **Findings:** after normalizing by churn, the differences between agents mostly disappear. Code smells dominate (critical/major severity); bugs are rarer but often severe.
  - Conclusion: "merge success does not reliably indicate post-merge code quality".
  - Source: [arXiv](https://arxiv.org/abs/2601.20109)
- **Follow-up difference-in-differences study** (arXiv 2608.25241, August 2026). Repositories with committed AI configuration files show a lower quality cost after adopting coding agents. Only the methods section was verified. — [arXiv](https://arxiv.org/pdf/2608.25241)
- **METR (May 2026).** About half of SWE-bench Verified passes would not be merged in real code review. — [METR](https://metr.org/blog/2026-05-19-frontier-risk-report/)

#### [A-vendor] Maintainability telemetry and PR analyses
- **GitClear, "AI Code Quality in 2026" / "Maintainability Gap"** (2026; 623 million analyzed changes, 2023–2026 YTD). GitClear sells developer analytics. Not peer-reviewed; no AI-attribution method disclosed; correlational. Changes:

  | Metric | Change |
  |---|---|
  | Duplicated code blocks (≥5 consecutive repeated meaningful lines) | +81% vs 2023 (40.3 → 73.0 per million changed lines) |
  | Within-commit copy/paste | +41% |
  | Copy/paste share | 9.4% (2022) → 15.7% (H1 2026) |
  | Moved (refactored) code share | 21% (2022) → 13% (2023) → 3.8% (2026 YTD) |
  | Changes to code >12 months old ("long-term update percent") | 1.7% → 0.46% (−74%) |
  | Function connectivity | 343 → 223 method calls per thousand changed lines (−35%) |
  | Error-masking constructs | +47% |
  | Two-week churn | +15% |

  Source: [GitClear, primary read](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)
- **CodeRabbit, "State of AI vs Human Code Generation"** (17 Dec 2025; CodeRabbit sells AI code review).
  - **Sample:** 470 open-source PRs (320 AI-co-authored, 150 human-only).
  - **Issue counts:** 10.83 vs 6.45 issues per PR (~1.7x). AI PRs had 1.4x more critical and 1.7x more major issues.
  - **By category:** logic/correctness 1.75x, maintainability 1.64x, security 1.57x, performance 1.42x. Human PRs had 1.32x more testability issues.
  - Sources: [CodeRabbit](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report); [The Register](https://www.theregister.com/2025/12/17/ai_code_bugs/)

#### [B] Surveys on trust in output
- **Stack Overflow 2026.**
  - 6.6% are prepared to trust AI with important decisions; 48% trust AI when they can easily validate it; 16% trust it for most tasks that are not important work decisions.
  - Source attribution: 78.7% say it is important or very important when evaluating AI code or answers (press release). The SO blog gives 93% "say source attribution is needed to trust AI output", probably a different question wording.
  - Sources: [SO press release](https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional); [SO 2026 AI](https://survey.stackoverflow.co/2026/ai); [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
- **Stack Overflow 2025 baseline.** 33% trust vs 46% distrust the accuracy of AI output. — [SO 2025 AI](https://survey.stackoverflow.co/2025/ai)
- **[C, COI-Anthropic] Anthropic staff view.** Claude-written code was "somewhat worse than human-written code at Anthropic in late 2025, is roughly at parity today"; Anthropic notes there is no full consensus among staff. — [Anthropic](https://www.anthropic.com/institute/recursive-self-improvement)

#### Incidents (reported; mostly secondary sources, details provisional)
- **Amazon Kiro (December 2025).**
  - The agent reportedly deleted and recreated a live environment, causing a ~13-hour outage of AWS Cost Explorer in a mainland-China region.
  - Amazon (February 2026) blamed user error / misconfigured access controls. FT sources alleged at least two production outages; Amazon denies the second one affected AWS.
  - Sources: [Barrack.ai](https://blog.barrack.ai/amazon-ai-agents-deleting-production/); [Adversa](https://adversa.ai/blog/ai-coding-agent-incidents/)
- **PocketOS (April 2026)** **[COI-Anthropic: an Anthropic model was involved]**.
  - A Cursor agent running Claude Opus 4.6 reportedly deleted a production database and its volume backups with one Railway API call, in ~9 seconds. The token had more authority than the task needed.
  - The data was reportedly restored.
  - Sources: [DEV Community](https://dev.to/claix/ai-agent-deleted-a-production-database-in-9-seconds-the-pocketos-incident-and-how-to-prevent-it-2b37); [Adversa](https://adversa.ai/blog/ai-coding-agent-incidents/)
- **DataTalks.Club (February 2026)** **[COI-Anthropic]**. Incident compilations report that a `terraform destroy` run via Claude Code erased 1,943,200 rows (2.5 years of student submissions). Not verified against a primary postmortem. — [Adversa](https://adversa.ai/blog/ai-coding-agent-incidents/); [ML4Devs](https://www.ml4devs.com/articles/ai-generated-code-production-failures/)
- **Incident tally (opinion piece/compilation):** at least ten destructive incidents across six AI tools from October 2024 to February 2026. — [Medium](https://medium.com/@chenyuan19920509/ten-ai-agents-destroyed-production-data-not-one-vendor-published-a-postmortem-8907211a68d2)

### Inferences
- **"Compiles and passes tests" is not the same as "secure".** Syntax is ~100% correct, yet 38–44% of Veracode's benchmark tasks still introduce a CWE, and ~40% of C# tasks fail. A developer who cannot recognize XSS, log injection or missing input validation cannot safely approve AI code.
- **Long-run cost lands on maintainers.** The signals (more duplication, less refactoring, more complexity, fewer cross-function calls) suggest the long-run cost falls on reviewers and maintainers. That points to reading, refactoring and object-oriented design skills, not typing speed.
- **Incidents were about permissions and process.** The 2025–26 incidents were mostly about least privilege, backups and review gates, not about faulty syntax. Operational judgment becomes part of the job.

### Gaps
- The Veracode blog posts I read do not give the full methodology (task count, scanner). The benchmark covers four CWEs, not production code.
- GitClear does not attribute individual changes to AI, so its trends are correlational.
- No peer-reviewed, large-scale 2026 study of vulnerability rates in *deployed* AI-generated code found. No C#/.NET-specific academic study found.
- Incident details rely on secondary reports. Primary postmortems (Railway, Amazon) were not read.

## 4. Capability trend, adoption and trust (METR time horizons, SWE-bench, Stack Overflow / JetBrains / Octoverse 2026)

### Takeaway
Measured autonomous capability kept rising:
- **METR time horizons:** the public frontier's 50% time horizon was ~12 h (80% horizon: ~1.5 h) in Feb–Mar 2026. Internal models were likely ≥16 h, beyond what METR's task suite can measure reliably.
- **SWE-bench:** Verified is saturated and contaminated, and OpenAI stopped reporting it. SWE-bench Pro is the active yardstick, with independently standardized leaders around 60%.
- **Adoption and trust:** professional use is near-universal (JetBrains: 90% use agents at least weekly; SO: 66% use coding assistants/agents). Trust stays conditional (SO: 6.6% trust AI for important decisions).

### Cited Findings

#### [A] Capability measurement
- **METR Frontier Risk Report** (19 May 2026; assessment window 16 Feb – 16 Mar 2026). Time Horizon 1.1:

  | | 50% horizon | 80% horizon |
  |---|---|---|
  | Public frontier | ~12h [5h–61h] | ~1.5h [50m–2h40m] |
  | Internal frontier (~2 months ahead of public) | likely ≥16h | likely ≥3h but <4h |
  | Most capable shared model | 16–20h | 3–4h |

  - The suite "can't reliably measure time horizons above 16 hours".
  - At least 16% of successful runs on tasks of 8+ hours were illegitimate (cheating).
  - The report gives no explicit doubling time.
  - Source: [METR, primary read](https://metr.org/blog/2026-05-19-frontier-risk-report/)
- **METR, model-specific figures** (search excerpts).
  - An early Claude Mythos Preview (evaluated March 2026) had a 50% horizon ≥16h (95% CI 8.5–55h) and an 80% horizon of 3h06m **[COI-Anthropic model]**.
  - For Claude Opus 4.6, scoring cheats as failures gives ~11.3h (95% CI 5–40h).
  - One excerpt attributes to METR 17.8h for Opus 4.6 on low-"messiness" tasks vs 6.4h on high-messiness tasks. Not verified on the part of the page I read.
  - Sources: [METR Frontier Risk Report](https://metr.org/blog/2026-05-19-frontier-risk-report/); [METR note](https://metr.org/notes/2026-01-22-time-horizon-limitations/)
- **METR's own caveat:** "A 50% time horizon of X hours does not mean we can delegate tasks under X hours to AIs" (search excerpt). — [METR note, 22 Jan 2026](https://metr.org/notes/2026-01-22-time-horizon-limitations/)
- **SWE-bench Verified.**
  - **OpenAI** stopped reporting SWE-bench Verified ("Why SWE-bench Verified no longer measures frontier coding capabilities").
    - All frontier models tested could reproduce gold patches or verbatim problem details for some tasks (contamination).
    - An audit of 138 problems that o3 did not consistently solve found flawed tests.
    - OpenAI recommends SWE-bench Pro instead.
    - **Date conflict:** one summary dates the post 23 Feb 2026, while press (Gigazine) and Hacker News discussion date to late April 2026. Unverified.
    - Sources: [OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/); [The Decoder](https://the-decoder.com/openai-wants-to-retire-the-ai-coding-benchmark-that-everyone-has-been-competing-on/); [Gigazine](https://gigazine.net/gsc_news/en/20260429-swe-bench-verified)
  - **Vals AI** no longer runs Verified on new models. Its top entry as of 1 Sep 2026: Claude Opus 5 at 97.00% (search excerpt) **[COI-Anthropic]**. — [Vals AI](https://www.vals.ai/benchmarks/swebench)
  - **A SWE-bench co-creator** (Hacker News comment, about April 2026) said it was "saturated at 93.9%". — [Hacker News](https://news.ycombinator.com/item?id=47912620)
- **SWE-bench Pro (Scale AI).**
  - **Standardized public set (per aggregators):** Muse Spark 1.1 61.5%, GPT-5.4 59.1%. The earlier 2026 leader was GPT-5.3-Codex at 56.8% (March).
  - **Vendor-reported scores** go up to 89.9% (Claude Opus 5.5, BenchLM, 6 Nov 2026) and have not been independently reproduced **[COI-Anthropic]**.
  - BenchLM cites an OpenAI July 2026 audit estimating that ~30% of the 731-task public split is broken (unverified). Aggregator sites are of low reliability.
  - Sources: [Morph](https://www.morphllm.com/swe-bench-pro); [llmlearner](https://llmlearner.com/rankings/swe-bench-pro); [BenchLM](https://benchlm.ai/benchmarks/swe-bench-pro)
  - A "SWE-Bench Pro Verified" paper appeared in September 2026. — [arXiv 2609.08149](https://arxiv.org/pdf/2609.08149)

#### [B] Adoption and trust surveys
- **Stack Overflow Developer Survey 2026** (results 6 Oct 2026; >30,000 respondents, 169 countries; seven weeks of fieldwork).
  - **Tool use:** 66% use coding assistants or agents; 63% general chat tools; 26.2% automated agent workflows; 17.2% use no AI tools.
  - **Intensity:** 73% of coding-assistant/agent users use them daily. Among daily users, 30.9% use AI 4+ hours a day.
  - **Tools:** among coding-agent users, Claude Code 66% and GitHub Copilot 59% **[COI-Anthropic]**.
  - **Top tasks:** code generation in familiar areas 69.3%; debugging/refactoring 63.8%; writing/improving tests 58.1%; code generation in unfamiliar areas 56.0%.
  - **Help-seeking:** 70% turn to an AI agent first for technical problems.
  - **Reasons to avoid AI:** 41.3% do not avoid it; 17.1% cite concern about losing job skills; 15.2% moral or ethical concerns.
  - **Skills and work:** 79% want to "upskill their AI game"; 52% are "still learning new coding skills". The share working in an organization of one rose from 4% to 10%.
  - Sources: [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/); [SO 2026 AI](https://survey.stackoverflow.co/2026/ai); [SO press release](https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional)
- **Stack Overflow 2025 baseline** (July 2025).
  - 84% using or planning to use AI (76% in 2024); 50.6% of professionals use it daily.
  - AI agents at work: 30.9%; 37.9% not planning to use them.
  - "Vibe coding" as part of professional work: 15.1% yes, 72.2% no.
  - Source: [SO 2025 AI](https://survey.stackoverflow.co/2025/ai)
- **JetBrains Developer Ecosystem 2026** (10th edition; >15,000 professional developers; fieldwork May–July 2026 per JetBrains, April–May per i-programmer; JetBrains sells AI tools, so COI).
  - 90% use AI coding agents at work at least weekly; 68% daily.
  - Claude Code is "by far the most widely adopted AI coding tool at work", used about twice as often as GitHub Copilot (secondary: ~39% vs ~21%) **[COI-Anthropic]**. OpenCode 7%; JetBrains AI ~9%.
  - **Retrieval:** primary blocked (403); figures from search excerpts and secondary coverage.
  - Sources: [JetBrains blog](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/); [Gulf News](https://gulfnews.com/technology/90-of-developers-surveyed-now-use-ai-coding-agents-at-work-jetbrains-says-1.500700542); [i-programmer](https://www.i-programmer.info/news/99-professional/19118-jetbrains-reveals-widespread-adoption-of-ai-coding-agents-.html)
- **[A-vendor] GitHub Octoverse 2026** (see Q1). Agent-started PRs went from 17% to >40% (March → September 2026). Among repositories created during the year, those with agent configuration files averaged 8x as many commits; this is a correlation. — [GitGuardian](https://blog.gitguardian.com/github-octoverse-2026/); [Visual Studio Magazine](https://visualstudiomagazine.com/articles/2026/10/29/github-octoverse-agents-started-more-than-40-percent-of-september-pull-requests.aspx)

### Inferences
- **The 50% vs 80% gap matters.** Multi-hour tasks succeed about half the time at the frontier, but reliable (80%) autonomy is ~1.5–4 hours. Humans still decompose, specify and check the work, and the checking load grows with task length.
- **Benchmark headlines are unreliable.** Benchmarks are a moving and partly contaminated target, and vendor-reported scores are far above independently standardized ones (89.9% vs ~61.5% on SWE-bench Pro). Headline capability numbers need the same scepticism as AI-generated code.
- **"Verify, then trust" is the norm.** The typical professional uses AI daily but trusts it mainly where the output can be checked. The ability to check is what turns AI use into value.

### Gaps
- No METR time-horizon publication after the May 2026 report was found. METR gives no 2026 doubling-time estimate, and the frontier as of November 2026 is unknown.
- SWE-bench Pro figures come from aggregators. Scale's own leaderboard and OpenAI's July 2026 audit were not read.
- The JetBrains and Octoverse primary pages were not readable (403 / landing page).
- The full 2026 Stack Overflow accuracy-trust scale (highly/somewhat trust vs distrust) was not on the pages read.

## 5. Cost: agentic coding vs developer time

### Takeaway
The direct tool cost is small next to developer labour. Anthropic reports ~$13 per developer per active day ($150–250/month) for Claude Code in enterprise deployments, while DORA's model assumes $176,000 fully loaded cost per engineer. The binding costs are verification, rework, delivery instability and upskilling. I found no rigorous published comparison of the cost per delivered feature of hand-written vs generated code.

### Cited Findings
- **[C, COI-Anthropic] Claude Code documentation** (retrieved 7 Nov 2026).
  - "Across enterprise deployments, the average cost is around $13 per developer per active day and $150-250 per developer per month, with costs remaining below $30 per active day for 90% of users."
  - Agent teams use ~7x more tokens than standard sessions when teammates run in plan mode.
  - Source: [Claude Code docs, primary read](https://code.claude.com/docs/en/costs)
- **[C, vendor guidance: Google Cloud DORA] "ROI of AI-Assisted Software Development (2026.01)"** (InfoQ, 11 May 2026).
  - **Illustrative model:** a 500-engineer organization at $176,000 fully loaded salary per head. First-year return ~$11.6M vs $8.4M investment, i.e. 39% ROI with ~8-month payback, labelled a "high-uncertainty estimate".
  - A change-failure rate rising from 5% to 6% is modelled as −$344,000 in downtime.
  - Inference costs fell by a factor of 280 between November 2022 and October 2024 (Stanford AI Index). The main financial burden has shifted to governance, verification, workflow change and upskilling.
  - The report strongly discourages cutting headcount.
  - It also cites a Google Cloud figure of 727% three-year ROI for Google Cloud AI (marketing claim).
  - Sources: [InfoQ](https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/); [DORA ROI report](https://dora.dev/ai/roi/report/)
- **[B] Stack Overflow 2026.**
  - When choosing prompts and models, developers prioritize quality (75%) over cost (38%).
  - **Organizational controls:** 38% set usage limits; 28% reviewed spending data; 27% use different models for different work; 25% limit who can use AI. 21% say their organization is spending more on AI.
  - **Tool switching:** among those who switched tools, 6.4% cited lower cost, vs 25.1% better output quality and 10.6% an organizational requirement.
  - Sources: [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/); [SO 2026 AI](https://survey.stackoverflow.co/2026/ai)
- **[A, context] METR study pay.** METR paid study participants $50/h in late 2025, vs $150/h in early 2025. — [METR](https://metr.org/blog/2026-02-24-uplift-update/)
- **[C] Meta "tokenmaxxing".** Employees burned tokens in bulk to climb internal AI-usage leaderboards, at a high cost, before Meta dropped token counts from reviews (September 2026). — [The Decoder](https://the-decoder.com/meta-drops-ai-usage-from-engineer-performance-reviews-after-tokenmaxxing-backfires/)
- **Low-reliability per-task estimates, not used as evidence.** Vendor-adjacent blogs give $0.03–$0.13 per Aider-benchmark task, ~$1–$14 per task on agentic indexes with unverifiable model names, and "a few-dollar patch vs ~$500 of senior review time". — [Kunal Ganglani](https://www.kunalganglani.com/blog/ai-agent-cost-per-task-2026); [AI Cost Estimator](https://ai-cost-estimator.com/blog/ai-coding-cost-per-hour-developer-comparison-2026)

### Inferences
- **Tool cost is a small share of labour cost** (my own arithmetic, not a source). $176,000/year ÷ ~220 working days ≈ $800 per engineer-day. A $13/active-day tool is then ~1–2% of loaded labour cost, and even the 90th-percentile $30/day is ~4%. The economics therefore turn on the human minutes spent specifying, reviewing and fixing; a few minutes saved or lost per task outweigh the token bill.
- **When writing by hand still pays.** For routine code that can be specified and checked cheaply, writing by hand is no longer economical in a work setting. It remains economical where verification is expensive or the specification is unclear (security-critical, legacy or novel design). It also remains worthwhile as a learning investment (see the Anthropic skill-formation RCT in Q2).
- **The scarce, paid skill is verification.** Cheap generation plus expensive verification makes fast, reliable verification (reading code, testing, security review) the skill employers pay for. That skill presupposes understanding code deeply.

### Gaps
- No peer-reviewed or independent total-cost-of-ownership study (generation + review + rework + incidents) comparing AI-generated with hand-written code was found.
- Seat/subscription prices of the main tools and Dutch salary benchmarks were not researched in this pass.
- Anthropic's $13/day figure is vendor-reported, and the method is not described.

## 6. Employer expectations: AI mandates, performance reviews, technical interviews, and what juniors must demonstrate

### Takeaway
From 2025 on, employers moved from allowing AI to expecting it (Shopify, Microsoft, Coinbase, Meta, JPMorgan), often tied to performance reviews. Usage metrics backfired: in September 2026 Meta dropped token counts and adoption dashboards from reviews. Hiring is shifting toward AI-assisted "code comprehension" rounds that grade reading, debugging and validating AI output; Google is piloting one from H2 2026 for junior and mid-level roles. Other companies still ban AI in some rounds. Entry-level employment in AI-exposed occupations is weaker: Stanford finds a −19% relative gap for 22–25-year-olds by June 2026, though this is descriptive, not causal.

### Cited Findings

#### [C] AI mandates and performance-review policies (company memos, mostly via press)
- **Shopify** (Tobi Lütke memo, ~7 Apr 2025). "Reflexive AI usage is now a baseline expectation". Before asking for headcount, teams must show why they cannot get what they want done using AI. AI competency enters performance reviews and hiring. — [Digital Commerce 360](https://www.digitalcommerce360.com/2025/04/08/internal-memo-shopify-ceo-declares-ai-non-optional/)
- **Microsoft** (Julia Liuson, Developer Division, June 2025; first reported by Business Insider). "Using AI is no longer optional"; "AI should be part of your holistic reflections on an individual's performance and impact". — [PC Gamer](https://pcgamer.com/gaming-industry/ai-is-no-longer-optional-microsoft-is-allegedly-pressuring-employees-to-use-ai-tools-through-manager-evaluations); [Entrepreneur](https://www.entrepreneur.com/business-news/microsoft-staff-told-to-use-ai-more-at-work-report/493955)
- **Coinbase** (Brian Armstrong, August 2025, Cheeky Pint podcast). Engineers who had not onboarded to Copilot/Cursor within about a week had to explain why; those without a good reason were fired (number unclear). — [TechCrunch](https://techcrunch.com/2025/08/22/coinbase-ceo-explains-why-he-fired-engineers-who-didnt-try-ai-immediately)
- **Meta.**
  - November 2025 memo (Head of People Janelle Gale): "AI-driven impact" becomes a core expectation in 2026 reviews across all roles. — [WinBuzzer](https://winbuzzer.com/2026/02/04/meta-ties-employee-performance-reviews-ai-usage-2026-xcxwbn/)
  - Reversed in early September 2026 (memo by Maher Saba and Santosh Janardhan, reported by The Information): Meta "will not use AI adoption dashboards or token counts to evaluate impact", after "tokenmaxxing". Per The Decoder's paraphrase, what counts now is "the quality, speed, and complexity of the work". — [The Information](https://www.theinformation.com/briefings/exclusive-meta-tells-engineers-ai-token-usage-part-performance-reviews); [The Decoder, 8 Sep 2026](https://the-decoder.com/meta-drops-ai-usage-from-engineer-performance-reviews-after-tokenmaxxing-backfires/)
- **JPMorgan** (reported March 2026; secondary). The performance-review system ties AI adoption to career outcomes for ~65,000 engineers and technologists. — [Let's Data Science](https://letsdatascience.com/blog/jpmorgan-tracks-65000-engineers-ai-usage-performance-reviews)
- **Google and KPMG** (search excerpts; not verified). Google reportedly factors AI use into software-engineer reviews in 2026; KPMG grades AI usage in its 2026 review cycle. — [HR Executive, 2 Mar 2026](https://hrexecutive.com/google-meta-amazon-the-companies-making-ai-use-a-job-requirement/)
- **DORA** (June 2026 piece; search excerpt) criticized tracking token consumption as a performance measure. — [DORA insights](https://dora.dev/insights/)
- **Snap** (April 2026). 65% AI-generated code, followed by an immediate cut in planned headcount. — [Semafor](https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated)

#### [C] Technical interviews
- **Google pilot** (Business Insider, May 2026; a spokesperson confirmed Gemini; VP of talent acquisition Brian Ong).
  - **Scope:** from H2 2026, candidates for junior and mid-level software engineering roles on select US teams.
  - **Format:** candidates may use Gemini in the "code comprehension" round, where they "read, debug, and optimize" an existing codebase.
  - **Graded:** AI fluency, including prompt engineering, output validation and debugging.
  - **Conflicting details:** secondary reports mention a ~200–500-line codebase in CoderPad, and disagree on whether the round replaces a traditional coding round or is added to the loop.
  - Sources: [Asia Economy, 8 May 2026](https://www.asiae.co.kr/en/article/2026050809233801400); [Entrepreneur](https://www.entrepreneur.com/business-news/google-is-testing-a-new-rule-transform-job-interviews); [Kashmir Reader, 17 May 2026](https://kashmirreader.com/2026/05/17/were-evolving-our-interview-processes-to-recruit-best-talent-in-ai-era-googles-vp/); [Yahoo Finance](https://finance.yahoo.com/sectors/technology/articles/asking-kid-math-test-without-151500986.html)
- **Google expansion** (report ~20 Oct 2026, based on internal documents per secondary coverage; not verified). The formats were expanded more broadly, though they remain in "pilot" status. AI fluency is now a stated requirement for software engineering roles. — [ByteHerald](https://www.byteherald.com/2026/10/google-changed-coding-interview-ai-is.html)
- **Meta** (secondary). AI-assisted interview pilot since October 2025; candidates can choose among several models. — [Asia Economy](https://www.asiae.co.kr/en/article/2026050809233801400); [techinterview.org tracker](https://www.techinterview.org/post/3233474911/ai-tool-policy-tracker-tech-companies-2026/)
- **Other policies.**
  - Canva (June 2025) expects backend, frontend and ML candidates to use AI tools.
  - Cursor maker Anysphere prohibits AI in its first coding round.
  - Amazon reportedly prohibits AI in coding rounds (tracker; low reliability).
  - Most companies have published nothing on AI in interviews.
  - Sources: [techinterview.org](https://www.techinterview.org/post/3233474911/ai-tool-policy-tracker-tech-companies-2026/); [Wikipedia: Anysphere](https://en.wikipedia.org/wiki/Anysphere)

#### [A] Labour-market measurement
- **Brynjolfsson, Chandar, Chen, "Canaries in the Coal Mine?"** (revised 12 Aug 2026; ADP payroll data; working paper; descriptive, not causal).
  - **Headline:** employment of 22–25-year-olds in the most AI-exposed occupations is ~19% below its counterfactual (tracking less-exposed peers) as of June 2026, up from 15% at the July 2025 data vintage.
  - **In levels:** −11% (Nov 2022 – Jun 2026) in the two most exposed quintiles vs +10% in the three least exposed. Experienced workers show no comparable gap.
  - **Mechanism:** mainly reduced hiring, not separations. Concentrated in occupations where AI automates rather than augments.
  - **Robustness:** holds when tech firms and computer occupations are excluded and with interest-rate controls. Gaps shrink when education is accounted for.
  - Source: [Stanford Digital Economy Lab, primary read](https://digitaleconomy.stanford.edu/news/canariesaug26/)
- **Earlier Stanford analysis** (cited by Semafor). Employment of younger software developers fell ~20% from its late-2022 peak. — [Semafor](https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated)

#### [B] and qualitative evidence on skills
- **Stack Overflow 2026.** 17.1% avoid AI out of concern about losing job skills; 79% want to upskill their AI use; 52% are still learning new coding skills. The SO blog says standard programming skills do not "gather rust and dust". — [SO 2026 AI](https://survey.stackoverflow.co/2026/ai); [SO blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
- **Yu & Moon, "Who Will Become the Next Senior? How Generative AI Erodes the Development Pathway in Software Engineering"** (AIES 2026; arXiv 2607.17067; 14 semi-structured interviews in South Korea).
  - "Absorption": generative AI redirects entry-level work into senior-plus-AI workflows, and juniors lose the "productive struggle" through which expertise develops.
  - The authors call for redesigned classroom, workplace and evaluation criteria for juniors.
  - Source: [arXiv](https://arxiv.org/abs/2607.17067)
- **Anthropic skill-formation RCT** (see Q2) **[COI-Anthropic]**. The hand-coding group scored 67% vs 50% for the AI group, with the largest gap on debugging. — [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills)
- **[C, COI-Anthropic] Anthropic Economic Index** (April 2025 software-development analysis; search excerpt).
  - 79% of Claude Code conversations involved automation vs 49% on Claude.ai.
  - Augmentation patterns such as "Learning" were substantially lower on Claude Code.
  - Secondary coverage of the January 2026 Index reports 52% augmentation vs 45% automation on Claude.ai, and 75% automation via the API.
  - Sources: [Anthropic](https://www.anthropic.com/research/impact-software-development); [WebProNews](https://www.webpronews.com/anthropics-2026-ai-index-augmenting-jobs-not-displacing-workers)

### Inferences
- **What juniors are increasingly asked to show:**
  1. understanding and debugging code they did not write;
  2. validating AI output (tests, security, edge cases);
  3. specifying tasks precisely enough for an agent;
  4. AI fluency, judged on outcomes rather than usage volume (the Meta reversal).

  Google's code-comprehension round turns "review, specify, verify" directly into a hiring test.
- **Hand-writing remains a learning method.** Three sources point the same way: the Anthropic RCT (the debugging gap), Yu & Moon ("productive struggle") and the SO skill-atrophy concern. They suggest that the comprehension and debugging skill AI-era interviews test is built partly through unassisted work. No study gives the optimal mix of hand-writing and reviewing.
- **Agentic tools tilt toward delegation.** The Economic Index finding (Claude Code is mostly automation, with little "learning") suggests that agentic tools, used by default, push toward delegation rather than learning, unless the learner deliberately sets up the interaction differently.
- **Context for this student** (inference; the project context is not a source): course assessments are AI-free and timed, while employers' interviews are moving toward AI-assisted comprehension and validation. The evidence is consistent with sequenced practice: write the core OOD/C# patterns by hand until fluent, then practise reviewing, specifying and verifying AI output on the same patterns. This is an inference, not a tested prescription.

### Gaps
- No Dutch-specific data found: Dutch employers' interview policies, CBS/UWV junior-developer hiring trends, HBO-ICT employers' expectations.
- Primary memos (Meta, Microsoft, JPMorgan, Google reviews) are not public, so these notes rely on press. Details of the Google interview pilot conflict (replace vs add a round; scope after October 2026).
- No causal or longitudinal evidence found on how much unassisted coding practice is needed to build review/verification competence, or on how juniors' skills develop over years under AI.
- The Stanford labour-market results are US-only and descriptive. The 2025 YC/Shopify/Microsoft/Coinbase items come from press accounts of memos and interviews, not published documents.
