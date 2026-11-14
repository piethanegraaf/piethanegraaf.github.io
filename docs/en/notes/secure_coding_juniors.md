---
title: "Secure code as a first niche for juniors: studies, frameworks and law"
description: "Is security a good first niche for the learning harness? Studies of AI-generated code and over-trust, training that works, EU and Dutch law, and junior security specialists."
---

# Secure code as a first niche for juniors: notes, 13 November 2026

Compiled 13 Nov 2026 for [§2.13 of the research](../research/literature.md#213-secure-code-as-a-first-niche-for-juniors). **Labels:** [PEER-REVIEWED] · [PREPRINT] · [VENDOR] (conflict of interest) · [INDUSTRY SURVEY] · [GOV REPORT] · [LAW] · [STANDARD]. **Grades** as in §2.0 of the research: A–C for studies, D for claims by companies or executives, press and opinion. Laws, standards and frameworks get no grade. **Retrieval status:** "checked in citation check H*n*" = checked against the primary source on 13 November 2026; the checked figures and wording are used; "primary read" = a search agent opened the primary page or PDF, but the source was not in the check; "abstract only" = only the abstract or publisher page; "not re-verified" = cited from memory and not checked. **COI note:** compiled by Claude, an Anthropic model. Shen & Tamkin is an Anthropic study. One Veracode figure concerns Claude Opus 5.5, and SusVibes tests Claude Code and Claude 4 Sonnet.

**Question.** Is building cybersecurity skills a good first niche for the learning harness? And which angle fits the project's current phase: **(A)** junior software developers who learn basic security on the job, or **(B)** junior cybersecurity specialists (SOC analyst, pentester, AppSec)?

**Method.** Four search agents (Claude) worked in one session: (1) the security of AI-generated code, over-trust and deskilling; (2) what junior developers lack in secure coding and which training works; (3) what employers, frameworks and law require of ordinary developers, Netherlands and EU first; (4) junior security specialists and AI. Two citation checks then covered 35 sources (H1–H35). Where a check corrected a note, the check is followed. Sources that the notes cited from memory and that the checks did not cover are left out, except NIS2 (marked "not re-verified").

## 1. AI-generated code and security

### Pearce et al. (2022), "Asleep at the Keyboard?", and Majdinasab et al. (2024), its replication. [PEER-REVIEWED], IEEE S&P 2022 and SANER 2024, grade C, checked in citation checks H1 and H2

- **Design:** benchmark; 89 scenarios built around high-risk CWEs, 1,689 programs from the 2021 Copilot. The replication reran the Python scenarios with a newer Copilot. — [Pearce, DOI](https://doi.org/10.1109/SP46214.2022.9833571); [arXiv:2108.09293](https://arxiv.org/abs/2108.09293); [Majdinasab, DOI](https://doi.org/10.1109/SANER60148.2024.00051); [arXiv:2311.11177](https://arxiv.org/abs/2311.11177)
- **Findings:** about 40% of the programs were vulnerable. In Python, vulnerable suggestions fell from 36.54% to 27.25%, yet "the model still suggests insecure code".
- **Limits:** rates for security-relevant prompts. Compare 36.54% with 27.25% (both Python), not 40% with 27%.

### Fu et al. (2025), "Security Weaknesses of Copilot-Generated Code in GitHub Projects". [PEER-REVIEWED], *ACM TOSEM* 34(8), grade C, checked in citation check H3

- **Design:** static analysis of 733 AI-generated snippets (mainly Copilot, also CodeWhisperer and Codeium) that developers committed to GitHub. — [DOI](https://doi.org/10.1145/3716848); [arXiv:2310.02059](https://arxiv.org/abs/2310.02059)
- **Findings:** weaknesses in 29.5% of Python and 24.2% of JavaScript snippets, across 43 CWE categories, among them weak randomness (CWE-330), code injection (CWE-94) and XSS (CWE-79). Given the static-analysis warnings, Copilot Chat fixed up to 55.5% of the issues.
- **Limits:** AI attribution rests on labels in the files.

### Vero et al. (2025), "BaxBench". [PEER-REVIEWED], ICML 2025, grade C, checked in citation check H4

- **Design:** 392 backend tasks (28 scenarios × 14 frameworks), functional tests plus real exploits. — [arXiv:2502.11844](https://arxiv.org/abs/2502.11844); [PMLR](https://proceedings.mlr.press/v267/vero25a.html)
- **Findings:** the best model (OpenAI o3-mini) produced backends that were both correct and secure in only 35% of tasks. Exploits succeeded on around half of the correct programs. A generic security reminder helped reasoning models only.
- **Limits:** 2025 models.

### Zhao et al. (2026), "Is Vibe Coding Safe?" (SusVibes). [PEER-REVIEWED], ICML 2026, grade C, checked in citation check H5

- **Design:** 186 real-world feature requests at repository level, 12 agent and model settings (SWE-Agent, OpenHands, Claude Code). — [arXiv:2512.03262](https://arxiv.org/abs/2512.03262)
- **Findings:** the best setup, SWE-Agent with Claude 4 Sonnet, produced functionally correct code for 57% of tasks, but only 11.8% of tasks were both correct and secure; 79.3% of its correct solutions were insecure. Adding the vulnerability type to the prompt raised that to at most 15.1%, while functional correctness dropped.
- **Limits:** 2025 agents. The often-quoted 61% and 10.5% belong to the superseded preprint.

### Spracklen et al. (2025), "We Have a Package for You!". [PEER-REVIEWED], USENIX Security 2025, grade C, checked in citation check H6

- **Design:** 16 LLMs, 576,000 code samples in Python and JavaScript. — [USENIX](https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen); [arXiv:2406.10279](https://arxiv.org/abs/2406.10279)
- **Findings:** on average at least 5.2% (commercial models) and 21.7% (open-source models) of suggested packages did not exist; 205,474 unique invented names, which attackers can register.
- **Limits:** 2023–2024 models.

### Veracode (2026), GenAI code security report and update. [VENDOR], grade C, October figures checked in citation check H15, July report primary read (press release)

- **Design:** raw models (not agents) get tasks without security guidance; the October update covers 18 models, 4 languages and 4 CWEs. The full method is not public. — [blog, 29 Oct](https://www.veracode.com/blog/fall-2026-genai-code-security/); [press release, 29 Oct](https://www.veracode.com/press-release/veracode-finds-first-meaningful-gain-in-ai-code-security-since-2025-as-average-pass-rate-hits-62/); [press release, 28 Jul](https://www.veracode.com/news/llms-are-getting-smarter-but-not-safer-veracode-2026-genai-code-security-report-finds-ai-generated-code-security-has-stalled-at-56%25-pass-rate/)
- **Findings:** the average security pass rate was "virtually unchanged" at 56% in July and rose to 62% in October, mostly through XSS (now 18%). Log injection stayed at 13%; SQL injection (84%) and cryptography (87%) were already high. Python 64%, C# 60%, JavaScript 57%, Java 31%. Claude Opus 5.5 and GPT-6-Sol tied at the top with 73%.
- **Limits:** the vendor sells scanning tools. **COI:** one of the two top models compiled these notes; the figure is quoted, not interpreted.

### What section 1 shows

- Per snippet, AI code became somewhat safer. Per delivered feature it is much worse: at most about a third of backends (BaxBench) and about one in eight agent features (SusVibes) are both correct and secure.
- The weak spots are output encoding (XSS, log injection), weak randomness and authorisation logic. SQL injection and cryptography are mostly handled.
- **C#/.NET:** no peer-reviewed study was found. Veracode puts C# at about 60%: roughly four in ten tasks fail without security guidance.

## 2. Over-trust and miscalibration

### Perry, Srivastava, Kumar & Boneh (2023), "Do Users Write More Insecure Code with AI Assistants?". [PEER-REVIEWED], ACM CCS 2023, grade B, checked in citation check H7

- **Design:** randomized user study; 47 analysed (33 with a codex-davinci-002 assistant, 14 without), from undergraduates to professionals; tasks such as encryption, signing and sandboxing. — [DOI](https://doi.org/10.1145/3576915.3623157); [arXiv:2211.03622](https://arxiv.org/abs/2211.03622)
- **Findings:** the AI group wrote significantly less secure code and was more likely to believe it was secure. Participants who trusted the AI less and engaged more with their prompts had fewer vulnerabilities (a correlation).
- **Limits:** small, unbalanced control group; an old model.

### Sandoval et al. (2023), "Lost at C". [PEER-REVIEWED], USENIX Security 2023, grade B, checked in citation check H8

- **Design:** 58 student programmers wrote a linked list in C, with or without an LLM assistant. — [USENIX](https://www.usenix.org/conference/usenixsecurity23/presentation/sandoval); [arXiv:2208.09727](https://arxiv.org/abs/2208.09727)
- **Findings:** critical security bugs were at most 10% more frequent with AI; the authors see no new security risk.
- **Limits:** one task. A small or null effect, unlike Perry et al.

### Mousavi et al. (2026), "Understanding the Impact of AI Code Assistants on Security API Usage". [PEER-REVIEWED], accepted at RAID 2026, grade B, checked in citation check H10

- **Design:** within-subject experiment; 44 professional developers did two Java security-API tasks (TLS, OAuth) with and without Copilot. — [arXiv:2607.11348](https://arxiv.org/abs/2607.11348)
- **Findings:** Copilot improved functional correctness but not secure API use. Developers rarely raised security concerns, and many did not see that their code was still insecure. "No participant produced a fully secure implementation, regardless of AI assistance or background."
- **Limits:** overconfidence was there without Copilot too.

### Jost et al. (2026), "The Impact of AI-Assisted Development on Software Security". [PREPRINT], grade B, checked in citation check H11

- **Design:** three arms (no AI, free Gemini, paid Gemini); 159 developers, mostly freelancers; one Python task. — [arXiv:2603.15298](https://arxiv.org/abs/2603.15298)
- **Findings:** no significant difference between arms. Programming experience significantly predicted security (odds ratio 1.43 per SD; predicted success 30% → 38%), and Gemini did not make up for it.
- **Limits:** a modest effect; not peer-reviewed.

### Khalid et al. (2026), "(Don't) Trust, but (Don't) Verify". [PEER-REVIEWED], to appear at IEEE S&P 2027, grade C, checked in citation check H12

- **Design:** observational; 100 participants chose among five fixed AI suggestions for four C tasks; 23 interviews. — [arXiv:2609.21020](https://arxiv.org/abs/2609.21020)
- **Findings:** they picked the most secure suggestion in 37.7% of cases and the least secure in 35.0%. Only 22% of submissions (88 of 400) were fully secure. The more lines they changed, the fewer vulnerabilities remained. 16 of 23 interviewees took no explicit security steps, although told that security would be evaluated.
- **Limits:** fixed suggestions. Confidence did correlate with actual security here.

### Klemmer et al. (2024), "Using AI Assistants in Software Development". [PEER-REVIEWED], ACM CCS 2024, grade C, checked in citation check H9

- **Design:** 27 interviews plus 190 Reddit posts and comments. — [DOI](https://doi.org/10.1145/3658644.3690283); [arXiv:2405.06371](https://arxiv.org/abs/2405.06371)
- **Findings:** professionals said they check AI suggestions like human code and rarely reported security issues. The authors note that this clashes with the problems found in experiments, and conclude that professionals overestimate their scrutiny.
- **Limits:** no behaviour observed.

### Bappy et al. (2026), "From Preventive to Reactive". [PEER-REVIEWED], SOUPS 2026, grade C, checked in citation check H13

- **Design:** 15 engineers interviewed, 14 observed coding with AI assistants. — [USENIX](https://www.usenix.org/conference/soups2026/presentation/bappy); [arXiv:2605.23130](https://arxiv.org/abs/2605.23130)
- **Findings:** none of the 14 put security requirements in their first prompt, even with the knowledge: a "decoupling of security awareness from security behavior". Only 2 caught unstated issues unprompted; neither experience cohort nor seniority aligned with who did. Security moves from preventive to reactive.
- **Limits:** qualitative, n = 14; one paragraph says 12 of 14.

### Kudriavtseva, Hotak & Gadyatskaya (2025), "My Code Is Less Secure with Gen AI". [PEER-REVIEWED], SAC 2025, grade C, checked in citation check H14

- **Design:** online survey, 105 valid respondents; "junior" = students and developers with 0–2 years. — [DOI](https://doi.org/10.1145/3672608.3707778); [Leiden repository](https://scholarlypublications.universiteitleiden.nl/handle/1887/4283611)
- **Findings:** only 1% were very confident in AI-generated code, and all of them were juniors. Mediors (14%) and seniors (15%) more often lacked confidence entirely than juniors (5%). Juniors perceived their secure-coding proficiency to rise with AI, seniors to fall.
- **Limits:** self-selected; the 1% is about one person.

### Two smaller sources on novices (not citation-checked)

- **Gardella, Bolton & Riggs (2026).** [PREPRINT], grade C, abstract only. 27 novices with Copilot: self-reported trust did not predict compliance; novices may treat suggestions like reliable compiler messages. No security measure. — [arXiv:2604.18948](https://arxiv.org/abs/2604.18948)
- **Bifröst (2025).** [PREPRINT], grade C, primary read. 61 undergraduates often accepted insecure LLM code despite earlier security coursework. — [arXiv:2511.20878](https://arxiv.org/abs/2511.20878)

### Shen & Tamkin (2026), "How AI Impacts Skill Formation" (not security-specific). [PREPRINT] [VENDOR], grade A for the main effect, C for the patterns (as in §2.8), checked in citation check H16

- **Design:** pre-registered randomized experiment; 52 developers (26 per arm) learned a Python library in about 35 minutes, then took a quiz. — [arXiv:2601.20245](https://arxiv.org/abs/2601.20245)
- **Findings:** AI use impaired conceptual understanding, code reading and debugging (17% lower score, d = 0.738), without a significant speed-up. Three of six interaction patterns, all with cognitive engagement, preserved learning.
- **Limits:** immediate quiz; patterns post hoc. Code reading and debugging are what security review needs.

### What section 2 shows

- The robust finding is **miscalibration and inattention**: developers seldom raise security unprompted, miss remaining flaws and pick secure and insecure suggestions at similar rates. A drop in code security with AI is not consistent across studies.
- **Juniors:** experience predicts security modestly and AI does not replace it; the only "very confident" respondents were juniors. A direct junior–senior comparison is missing, so "juniors are especially endangered" is not established.
- What protected was **editing and scrutinising** AI output (Khalid; Perry), not avoiding AI.

## 3. What junior developers lack and what training works

### Votipka et al. (2020), "Understanding security mistakes developers make". [PEER-REVIEWED], USENIX Security 2020, grade C, checked in citation check H17

- **Design:** 94 of 142 Build It, Break It, Fix It contest projects and 866 exploits. — [USENIX](https://www.usenix.org/conference/usenixsecurity20/presentation/votipka-understanding)
- **Findings:** 21% of projects introduced a simple mistake; 78% had vulnerabilities from misunderstanding security concepts. The authors call for training on less intuitive concepts such as integrity.
- **Limits:** participants averaged 8.9 years of experience, so this is not a junior figure.

### Naiakshina et al. (2017, 2019), password storage. [PEER-REVIEWED], CCS 2017 and CHI 2019, grade C, checked in citation check H18

- **Design:** 20 computer-science students, half asked for security; later, freelancers. — [DOI 2017](https://doi.org/10.1145/3133956.3134082); [arXiv:1708.08759](https://arxiv.org/abs/1708.08759); [DOI 2019](https://doi.org/10.1145/3290605.3300370)
- **Findings:** none of the 10 students who were not asked stored passwords securely; even when asked, only 4 of 10 did. Freelancers, like the students, do not store passwords securely unless prompted (2019 abstract).
- **Limits:** prompting is necessary but not sufficient. No freelancer counts (full text not read).

### Lam et al. (2022), "Identifying Gaps in the Secure Programming Knowledge and Skills of Students". [PEER-REVIEWED], SIGCSE 2022, grade C, checked in citation check H22

- **Design:** coding interviews with 21 students at two US universities. — [DOI](https://doi.org/10.1145/3478431.3499391)
- **Findings:** students lack the key fundamental skills to write secure programs; they rarely heed compiler warnings or read documentation with care.
- **Limits:** C and memory safety; partly general programming habits.

### Braz, Aeberhard, Çalikli & Bacchelli (2022), "Less is More". [PEER-REVIEWED], ICSE 2022, grade B, checked in citation check H19

- **Design:** randomized online experiment; 150 participants (71% with 3+ years of professional experience) reviewed one code change. — [DOI](https://doi.org/10.1145/3510003.3511560); [arXiv:2202.04586](https://arxiv.org/abs/2202.04586)
- **Findings:** asking reviewers to focus on security gave about eight times higher odds of finding the vulnerability. A 22-item checklist derived from OWASP's, or a tailored 7-item one, added no significant improvement.
- **Limits:** one change, short-term.

### Nguyen et al. (2017), "A Stitch in Time" (FixDroid). [PEER-REVIEWED], CCS 2017, grade B, checked in citation check H20

- **Design:** between-groups experiment, 39 Android developers and students; an IDE plugin that flags security problems while you write. — [DOI](https://doi.org/10.1145/3133956.3133977); [open PDF](https://acmccs.github.io/papers/p1065-nguyenA.pdf)
- **Findings:** significantly fewer security problems with the plugin; more than twice the proportion secure in the encryption and connection tasks, little difference for SQLite.
- **Limits:** Android only; no retention test.

### Weir et al. (2020), "Interventions for long-term software security". [PEER-REVIEWED], *Software: Practice and Experience* 50(3), grade C, checked in citation check H21

- **Design:** action research in three organisations; six hours of facilitated workshops over three months; interviews before, after and at twelve months. — [DOI](https://doi.org/10.1002/spe.2774)
- **Findings:** teams with little security experience became more motivated and more aware of assurance techniques, without security experts. At twelve months the change was still visible in the two teams that could be re-interviewed.
- **Limits:** no control group. The only long follow-up found for developers.

### Kharma et al. (2026), security training for LLM-assisted development. [PREPRINT], grade C, primary read

- **Design:** pre/post, 12 developers (6 juniors with up to five years); a Spring Boot backend built with a fixed LLM; instruction, a layered mental model and a security-prompting scaffold. — [arXiv:2604.17763](https://arxiv.org/abs/2604.17763)
- **Findings:** severity-weighted findings fell 38.2%, critical findings from 24 to 5 (juniors 13 to 4).
- **Limits:** fixed order, the authors were the reviewers, no follow-up.

### Two more (not citation-checked)

- **Security champions without support (EuroUSEC 2023).** [PEER-REVIEWED], grade C, primary read. In a five-team case study, champions without backing from security experts and management did not secure adoption. — [RUB CASA](https://casa.rub.de/forschung/publikationen/detail/security-champions-without-support-results-from-a-case-study-with-owasp-samm-in-a-large-scale-e-commerce-enterprise)
- **Secure Code Warrior.** [VENDOR], grade D, primary read. Claims 47–53% fewer vulnerabilities for its own customers; no independent replication found. — [SCW](https://securecodewarrior.com/article/3-steps-to-boost-developer-security-education-and-cut-vulnerabilities-by-53)

### What section 3 shows

- The problem is mostly **concepts and attention**, not slips (Votipka; Naiakshina; Bappy).
- What works in the short term is **a security question at the moment of decision**, while writing (FixDroid) and while reviewing (Braz). Short repeated sessions can change team habits (Weir).

## 4. What employers, frameworks and law require

### Labour market

- **Job ads.** No study codes security requirements in *developer* job ads (NL, EU or US); job-ad studies of security concern security roles. A study of 100 software-engineering postings reports no security findings in its abstract (Wyrich & Montgomery, ICSE 2026; [PEER-REVIEWED], grade C, abstract only — [arXiv:2511.13656](https://arxiv.org/abs/2511.13656)).
- **UWV.** [GOV REPORT], grade C, checked in citation check H34. Demand for software developers rose 270% and for security specialists 167% in the five years up to 2022. The market has cooled since: just over 18,900 ICT vacancies in Q2 2026 and almost 6,400 ICT workers on benefit in July 2026. Web developers show the largest drop in tightness, yet stay "zeer krap" (May 2025). — [UWV ICT](https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict); [factsheet, Aug 2023](https://www.uwv.nl/assets-kai/files/6e32b054-43eb-4133-95ae-affc3c234e4f/Factsheet_ict.pdf); [ICT-beroepen in beeld, May 2025](https://www.uwv.nl/assets-kai/files/7bb39f40-eed5-4c0f-a869-c417416f0bf4/ICT-beroepen-in-beeld.pdf)
- **Sonar, State of Code 2026.** [VENDOR] [INDUSTRY SURVEY], grade D, primary read (some figures via a secondary summary). Reviewing and validating AI code is named the most important skill (47%). — [Sonar PDF](https://www.sonarsource.com/state-of-code-developer-survey-report.pdf)
- No peer-reviewed or Dutch source shows that employers formally require juniors to security-review AI output.

### Frameworks

- **ENISA ECSF (2022).** [STANDARD], checked in citation check H32. Twelve role profiles, none "software developer". The Cybersecurity Implementer lists "Cybersecurity Developer" and "DevSecOps Engineer" as alternative titles, but covers building security solutions, not secure coding by ordinary developers. — [ECSF role profiles](https://www.enisa.europa.eu/sites/default/files/publications/European%20Cybersecurity%20Skills%20Framework%20Role%20Profiles.pdf)
- **NIST SP 800-218, SSDF v1.1 (2022).** [STANDARD], checked in citation check H30. Task PO.2.2: role-based training, reviewed periodically. Practices PW.5 (secure coding) and PW.7 (review or analyse code). SSDF v1.2 is an initial public draft (17 Dec 2025), not final as of November 2026. — [SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final); [draft v1.2](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd)
- **ISO/IEC 27001:2022, control 8.28 "Secure coding".** [STANDARD], checked in citation check H31 (via the ISO catalogue and a certification body). One of 11 new controls among 93. — [ISO](https://www.iso.org/standard/27001)
- **OWASP SAMM v2 and ASVS 5.0.0.** [STANDARD], checked in citation check H33. SAMM level 1: awareness training "for all personnel involved in software development"; level 2: technology- and role-specific guidance. ASVS Level 1 is the minimum and recommended baseline, about 20% of the requirements. — [SAMM](https://owaspsamm.org/model/governance/education-and-guidance/); [ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- **NCSC, "ICT-beveiligingsrichtlijnen voor webapplicaties" (May 2024).** [STANDARD], checked in citation check H35. Free Dutch guidance, not legally binding. — [NCSC](https://www.ncsc.nl/webapplicaties/ict-beveiligingsrichtlijnen-webapplicaties)

### Law

- **Cyber Resilience Act, Regulation (EU) 2024/2847.** [LAW], checked in citation check H29. Since 11 September 2026 (Art. 14), manufacturers must give an early warning of an actively exploited vulnerability within 24 hours and a notification within 72 hours; also for severe incidents, and also for products already on the market. The rest applies from 11 December 2027. Annex I: on the basis of the risk assessment and where applicable, products are made available on the market without known exploitable vulnerabilities and with a secure-by-default configuration; vulnerability handling includes an SBOM of at least the top-level dependencies. — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng); [Commission](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting)
- **Cyberbeveiligingswet.** [LAW], checked in citation check H28. The Act of 8 July 2026 (Stb. 2026, 187) implements NIS2 and entered into force on 15 August 2026 (Stb. 2026, 189, art. 35). It applies to more than 8,000 organisations. — [Stb. 2026, 187](https://zoek.officielebekendmakingen.nl/stb-2026-187.html); [Stb. 2026, 189](https://zoek.officielebekendmakingen.nl/stb-2026-189.html); [Rijksoverheid](https://www.rijksoverheid.nl/actueel/nieuws/2026/07/07/cyberbeveiligingswet-en-wet-weerbaarheid-kritieke-entiteiten-vanaf-15-augustus-2026-van-kracht)
- **NIS2, Directive (EU) 2022/2555.** [LAW], not re-verified. Article 21(2) covers supply-chain security, secure development and vulnerability handling, and training. Kept because the Cyberbeveiligingswet rests on it. — [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2022/2555/oj)
- **US: CISA Secure by Design Pledge (2024).** [STANDARD], primary read. Voluntary; CISA does not enforce or verify adherence. — [CISA](https://www.cisa.gov/securebydesign/pledge)

### What section 4 shows

- A stable entry-level core recurs across ASVS, SSDF, ISO 8.28, SAMM and the CRA: input validation and output encoding; authentication and access control; secrets and cryptography; dependencies and the SBOM; threat modelling; code review and testing; logging and vulnerability handling. AI moves the skill from writing secure code to judging code written by someone or something else.
- The obligations land on the **organisation**, which passes them to developers. Workforce frameworks describe specialists; secure coding by ordinary developers falls between frameworks.
- The CRA makes concrete junior tasks teachable: keep dependencies and the SBOM current, avoid known-vulnerable components, triage vulnerability reports on time. No source measures its effect on hiring.

## 5. Junior security specialists (angle B)

### Platform Talent voor Technologie & Dialogic (2024), "Onderzoeksrapportage Onderwijs en Arbeidsmarkt Cybersecurity". [GOV REPORT], for the Ministry of EZK, grade C, checked in citation check H27

- **Design:** vacancy analysis (Jobdigger, 2018–2022) and education data; research period September 2023 to February 2024. — [report](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file); [Kamerstuk 26643, nr. 1164](https://zoek.officielebekendmakingen.nl/kst-26643-1164.html)
- **Findings:** vacancies asking for cybersecurity expertise rose from about 8,000 to about 19,000 (2018–2022) on a broad definition; narrower definitions give about 4,000–4,200. About three quarters are medior or senior. About 3,000 students a year start hbo or wo programmes with a relevant cyber component. Specialist graduates are too few; graduates with a substantial cyber component match demand. Much technical knowledge is required, but the tasks are largely non-technical.
- **Limits:** data end in 2022. Not in the check: 15% of vacancies ask for a certificate (58% for pentesters), and AI is expected to affect the Penetration Tester, Threat Intelligence and Forensics profiles most.

### ISC2 (2025), "Cybersecurity Workforce Study", and ISC2 (2026), "Rethinking AI's Impact on Cybersecurity Roles". [INDUSTRY SURVEY], grade C, checked in citation checks H25 and H26

- **Design:** 16,029 respondents (July–August 2025); and 856 professionals who use AI in their roles (May 2026). Non-probability online surveys. — [ISC2 2025](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study); [ISC2 2026](https://www.isc2.org/Insights/2026/07/rethinking-ai-impact-on-cybersecurity-roles)
- **Findings (2025):** no workforce-gap estimate this year; 39% reported hiring freezes at their organisation; 5% of respondents were entry or junior level; 3% entered through an internship or apprenticeship.
- **Findings (2026):** 56% say AI reduced the need for entry-level positions in the past year; 53% say it creates new kinds of entry-level roles; 37% say it reduced hands-on learning and 36% that it did not. Alert triage, log analysis, report generation and basic threat hunting are named as junior tasks that AI now speeds up.
- **Limits:** perceptions, mostly of experienced staff.

### Alahmadi, Axon & Martinovic (2022), "99% False Positives". [PEER-REVIEWED], USENIX Security 2022, grade C, checked in citation check H24

- **Design:** survey (n = 20) and interviews (n = 21) with SOC practitioners. — [USENIX](https://www.usenix.org/conference/usenixsecurity22/presentation/alahmadi)
- **Findings:** analysts validate alarms by hand and perceive very high false-positive rates ("99%" is one analyst's quote); many are benign triggers, true alarms from legitimate activity.
- **Limits:** no measured rate.

### Tompkins et al. (2026), "Do Hackers Dream of Electric Teachers?". [PEER-REVIEWED], ACM CCS 2026, grade C, checked in citation check H23

- **Design:** semester-long observational study of 309 students on pwn.college with a GPT-4o tutor that sees the latest saved file and terminal history but not the solution. — [DOI](https://doi.org/10.1145/3830454.3846694); [arXiv:2602.17448](https://arxiv.org/abs/2602.17448)
- **Findings:** 3.5% of queries were direct solution requests. "Reactive" conversations (paste output, ask what is wrong) went with lower completion than short, focused ones in 8 of 9 modules; against proactive ones the difference was small and not significant per module. Of 293 survey respondents, 40.6% trusted the tutor and 57.3% stopped or reduced use.
- **Limits:** correlational; completion is a proxy.

### Other sources on angle B (not citation-checked)

- **Microsoft Copilot for Security RCT.** [VENDOR], grade B, primary read (infographic). 147 security professionals were 22% faster and 7% more accurate with Copilot; novice figures were not confirmed. — [infographic](https://www.microsoft.com/content/dam/microsoft/final/en-us/microsoft-brand/documents/EconStudy-Speed-accuracy-and-sentiment-Infographic-Final.pdf)
- **Švábenský et al. (2021), CTF write-ups.** [PEER-REVIEWED], grade C, abstract only. 15,963 write-ups: strong on cryptography and networks, weak on social engineering and awareness. — [arXiv:2101.01421](https://arxiv.org/abs/2101.01421)
- **Happe, Cito & Wachter (2026).** [PREPRINT], grade C, abstract only. "The operating skill floor for using or developing offensive capabilities has dropped sharply." — [arXiv:2607.20255](https://arxiv.org/abs/2607.20255)
- **Refusals in AI agents (2026).** [PREPRINT], grade C, primary read. Refusal training causes over-refusal on legitimate offensive-security work. — [arXiv:2606.02644](https://arxiv.org/abs/2606.02644)

### What section 5 shows

- The shortage is medior, senior and specialist; the junior entry route is narrow, and AI absorbs tier-1 work (grade C).
- Junior specialist work is mostly tools, triage, analysis and reporting; code is secondary, except in AppSec.
- AI raises performance *with* the tool (vendor trials). No study measures security skill *without* the tool after AI-assisted training.

## 6. How the harness would fit, and the comparison A vs B

The harness has a hint ladder, a guard that stops the AI from writing the learner's files at L1–L3, explanations in the learner's own words, spaced reviews after mastery, and a diary (§5 of the research). The comparison is an inference; none of it has been tested.

| | **A. Junior developers, secure coding on the job** | **B. Junior security specialists** |
|---|---|---|
| Group | All junior developers; secure coding is a baseline duty (SAMM L1, SSDF PO.2.2) | Smaller: about 3,000 Dutch hbo/wo entrants a year with a cyber component |
| Main artefact | Code in files | Commands, tool output, triage notes, reports |
| File guard | Fits as it is | Partial: the answer is often a command or verdict in chat; needs a guard on shell and tool use |
| Hint ladder | Fits; a security question at the moment of decision is the best-supported intervention | Fits; Tompkins's finding on reactive use points to "hypothesis first" |
| Own-words explanation | Fits; targets concepts and editing of AI output | Fits strongly; reports are the job's output |
| Spaced review | ASVS L1, CWE classes | Ports, ATT&CK techniques, log fields |
| New safety work | Little | A scope guard (lab targets only), rules of engagement, Dutch computer-intrusion law (art. 138ab Sr, not re-verified), expected over-refusal |
| Evidence | Several B and C studies | Mostly C surveys and one observational study |
| Legal pull (EU/NL) | Direct: CRA, Cyberbeveiligingswet, ISO 8.28 | Indirect |
| Fit with the current phase | High: the guard already covers C#/.NET code, and juniors at work are the second goal (§2.12) | Low: new guard and safety rules |

**Design implications for angle A** (untested):

- Ask a short security question at the moment of decision ("what does the attacker control here?"), not a long checklist (Braz; Naiakshina; FixDroid).
- Have the learner state the security requirement before the AI writes (Bappy).
- Count a task only after the learner explains or changes AI output against ASVS L1 (Khalid; Shen & Tamkin).
- Give static-analysis warnings to the learner to interpret, not to auto-apply (Fu).
- Check that suggested packages exist before installing (Spracklen); do not rely on a security hint in the prompt for agents (SusVibes).
- Content: ASVS L1, the NCSC guidelines and the CRA tasks.

**For §2.13.** The evidence favours angle A for the current phase: the file guard transfers unchanged, the EU and Dutch legal pull is direct, and the best-supported interventions are short prompts at the moment of decision. Angle B meets a real need (juniors lose the "easy reps"), but needs new safety design and rests on weaker evidence. AppSec code review, the part of B closest to A, could follow later.

## 7. Gaps

- No randomized trial of secure-coding training with juniors at work; no longitudinal study of security knowledge under sustained AI use.
- No controlled study with agentic tools (Claude Code, Cursor) measuring security and confidence together, and no direct junior–senior comparison with AI on a security outcome.
- No peer-reviewed C#/.NET security evaluation of AI code.
- No study of security requirements in developer job ads, and no source on how the CRA or the Cyberbeveiligingswet changes hiring.
- Not read: the security content of the HBO-i Domeinbeschrijving 2024, the ECSF task lists, the NICE role count (sources disagree), SAFECode and SANS guidance, the full Veracode method, and the freelancer counts in Naiakshina et al. (2019).
- No time-use study of junior SOC or pentest work, and no evaluation of a guarded AI tutor in SOC training.
- No secure-coding study of worked examples or spaced practice, and no data on how fast developers' security knowledge decays.
