---
title: "The eternal-junior problem: studies and practitioner sources"
description: "Do juniors stay junior when an AI agent does the work? Studies, lessons from surgery and aviation, and graded talks, interviews, news and blog posts."
---

# The eternal-junior problem: notes, 11 November 2026

Compiled 11 Nov 2026 for §2.12 of the [research](../research/index.md). **Labels:** [PEER-REVIEWED] · [PREPRINT] · [BOOK] · [POLICY] · [VENDOR] (conflict of interest) · [TALK] · [PODCAST/INTERVIEW] · [NEWS] · [BLOG] · [SURVEY]. **Grades** as in §2.0 of the research: A–C for studies, D for claims by companies or executives, press reports and opinion. Retrieval status: "primary read" = the primary page or PDF was opened; "abstract only" = only the abstract or publisher page; "via secondary" = details come from a summary. **COI note:** compiled by Claude, an Anthropic model; one key study (Shen & Tamkin) is by Anthropic.

**Question.** Do junior developers who let AI agents do the work stay junior, because they skip the practice through which expertise develops? And what supports a trade-off of building a skill by hand first, delegating it once mastered, and maintaining it with occasional practice by hand?

**Method.** Targeted web searches in one session: skill formation with AI among junior developers, deskilling and "never-skilling", apprenticeship and intelligent technology, skill retention under automation in aviation, and learning on the job with AI. Each scientific source was checked against its primary text or publisher page. Practitioner sources (talks, interviews, news, blogs) were searched separately and each was checked against its own page.

## 1. Studies of junior developers and AI

### Shen & Tamkin (2026), "How AI impacts skill formation". [PREPRINT] [VENDOR], grade B, primary read in the earlier notes

- **Design:** randomized trial; 52 mostly junior software engineers learned a new library, with or without an AI assistant. — [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills); [arXiv:2601.20245](https://arxiv.org/abs/2601.20245)
- **Findings:** quiz afterwards 50% (AI) vs. 67% (by hand), the largest gap on debugging. Participants who delegated code generation scored below 40%; those who asked conceptual questions scored 65% or more. The AI group was not significantly faster.
- **Limits:** comprehension measured right after the task, not long-term skill. Vendor study that reports harm from its own product.

### Yu & Moon (2026), "Who will become the next senior?". [PREPRINT], accepted at AIES 2026, grade C, abstract only

- **Design:** 14 semi-structured interviews with junior and senior software engineers in South Korea, reflexive thematic analysis. — [arXiv:2607.17067](https://arxiv.org/abs/2607.17067)
- **Findings:** "Absorption": GenAI "redirects entry-level work into senior-AI workflows". Juniors lose the productive struggle through which expertise developed; classrooms that normalize AI use reproduce that loss; seniors and juniors see the situation differently.
- **Authors' conclusion:** preserving the pathway "will require deliberate institutional design" across classrooms, workplaces and the criteria used to evaluate juniors. They call for longitudinal work.

### Feng, Yun & Wang (2026), "From junior to senior". [PEER-REVIEWED], CHI 2026, grade C, abstract only

- **Design:** three phases: a cognitive task analysis with a Delphi process among 5 senior developers; an AI-assisted debugging task with 10 junior developers; blind reviews of the juniors' prompt histories by 5 other seniors. — [arXiv:2602.00496](https://arxiv.org/abs/2602.00496); [ACM DL](https://dl.acm.org/doi/10.1145/3772318.3791642)
- **Findings:** agency in software engineering is "primarily constrained by organizational policies rather than individual preferences". Seniors keep control by delegating in detail, using skills built before AI tools. Novices "struggle between over-reliance and cautious avoidance".
- **Proposal:** practices for preserving agency in coding, learning and mentorship.

### Not found

- **No longitudinal study** of skill development among junior developers at work.
- **No field experiment** at a company that measures the learning of juniors, as opposed to their output. The field experiments at Microsoft, Accenture and a Fortune 100 company measured completed tasks: less experienced developers adopted the tool more and gained more output (Cui et al., [Management Science](https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535); in the research since 8 November).

## 2. Analogies from other professions, and counter-evidence

### Beane (2019), "Shadow learning". [PEER-REVIEWED], *Administrative Science Quarterly* 64(1), 87–123, grade C, abstract only

- **Design:** a two-year comparative ethnography of learning in robotic and open surgery at five sites, plus a blinded interview study at 13 top teaching hospitals. — [Stanford Digital Economy Lab](https://digitaleconomy.stanford.edu/publication/shadow-learning-building-robotic-surgical-skill-when-approved-means-fail); [UCSB](https://www.engineering.ucsb.edu/news/shining-light-shadow-learning)
- **Findings:** the approved way of learning worked for open surgery but not for robotic surgery, where trainees had a much smaller role in the work. Trainees who still became skilled did it through "shadow learning" that bent norms: early specialization, rehearsal on their own, and struggle with too little supervision. This was tolerated, and led to hyperspecialization and fewer experts than needed.

### Beane (2024), *The skill code*. [BOOK], grade C/D, via secondary

- **Argument:** skill grows through challenge, complexity and connection between novices and experts. Using intelligent technology to make experts more productive cuts into all three. — [Thinkers50](https://thinkers50.com/?p=76765); [UCSB](https://www.engineering.ucsb.edu/news/code-building-skills-our-modern-workplace); [i4cp](https://i4cp.com/productivity-blog/how-ai-adoption-can-hinder-skill-development)
- **Not verified:** the book's full text was not read; details come from summaries and interviews.

### Casner, Geven, Recker & Schooler (2014), "The retention of manual flying skills in the automated cockpit". [PEER-REVIEWED], *Human Factors* 56(8), 1506–1516, grade C, primary read

- **Design:** 16 airline pilots flew routine and non-routine scenarios in a Boeing 747-400 simulator, with the level of automation varied; performance graded and thoughts probed. — [Human Factors](https://journals.sagepub.com/doi/10.1177/0018720814535628); [PDF](https://gwern.net/doc/technology/2014-casner.pdf)
- **Findings:** instrument scanning and manual control were "mostly intact", even when rarely practised. The cognitive tasks of manual flight (tracking position without a map display, deciding the next navigation step, recognizing instrument failures) showed "more frequent and significant problems", linked to how often pilots had task-unrelated thoughts while the automation flew.
- **Conclusion of the authors:** retention of the cognitive skills "may depend on the degree to which pilots remain actively engaged in supervising the automation".

### FAA, SAFO 13002 (2013) and SAFO 17007 (2017). [POLICY], grade D, primary read

- **SAFO 13002, *Manual Flight Operations* (4 Jan 2013):** "encourages operators to promote manual flight operations when appropriate". It notes that "continuous use of those systems does not reinforce a pilot's knowledge and skills in manual flight operations". — [FAA PDF](https://www.faa.gov/sites/faa.gov/files/other_visit/aviation_industry/airline_operators/airline_safety/SAFO13002.pdf)
- **SAFO 17007, *Manual Flight Operations Proficiency* (4 May 2017):** encourages training and line-operations policies so that proficiency in manual flight "is developed and maintained". The FAA added manual manoeuvres to the Part 121 training requirements. — [FAA PDF](https://www.faa.gov/sites/faa.gov/files/2022-11/SAFO17007.pdf)
- **Use in the research:** the analogy for maintenance at L4: delegate, but keep doing it yourself now and then. SAFOs are advisory, not regulation.

### Counter-evidence: Brynjolfsson, Li & Raymond (2025), "Generative AI at work". [PEER-REVIEWED], *QJE* 140(2), 889–942, grade B, primary read

- **Design:** staggered introduction of an AI assistant for 5,172 customer-support agents. — [QJE](https://academic.oup.com/qje/article/140/2/889/7990658); [arXiv PDF](https://arxiv.org/pdf/2304.11771)
- **Findings:** the AI raised productivity most for less experienced and lower-skilled agents. During outages of the AI, agents still handled chats faster than before adoption ("equivalent to 15% to 25% declines in chat duration"). An outage one month after adoption showed little gain; one after three months a larger gain. Only agents with "high initial adherence" to the AI's suggestions improved during outages; those who often deviated did not.
- **Caveats of the authors:** outages are rare and "not necessarily random", so the estimates are noisy.
- **Why it matters:** AI can teach on the job. The agents still did the work and saw how customers responded; an agent that writes the code takes that part away. The research treats this as counter-evidence, not as a contradiction.

## 3. Practitioner sources: talks, interviews, news and blogs (grade D)

**How these were found.** A search agent (Claude) looked for talks, podcasts and interviews, news articles and blog posts from 2024–2026, in English and Dutch, and opened each page. It was asked for counter-voices too. The quotes of nine key sources were then checked again on their pages ("Re-checked: yes"). All were there, two on a different page than first reported (noted below). The other items were checked once, by the search agent. These sources show that the concern is widespread. They do not show that it is true.

### 3.1 The mechanism: hired juniors who do not grow

- **Giordano Scalzo** (Engineering Lead, NewDay), "Tackling the junior developer crisis in the age of AI". [TALK], LeadDev LDX3 New York 2026, page of 29 Sep 2026. — [LeadDev](https://leaddev.com/management/tackling-the-junior-developer-crisis-in-the-age-of-ai)
    - AI creates a confidence gap: polished pull requests hide shallow understanding. Do not ban AI; change the mentoring, with AI-off sessions, "Explain the Machine" and "Break It" challenges.
    - Quote: "The output looked senior. The understanding was still junior."
    - COI: commercial conference. Re-checked: yes (abstract page; the video needs registration).
- **Alasdair Allan** (CTO), "The ladder is missing rungs: Engineering progression when AI ate the middle". [TALK], QCon London, 17 Mar 2026. — [QCon](https://qconlondon.com/presentation/mar2026/ladder-missing-rungs-engineering-progression-when-ai-ate-middle); interview: [InfoQ, 13 Aug 2026](https://www.infoq.com/news/2026/08/ai-disrupts-engineering-progress/)
    - AI removed the learning experiences that defined each rung of the career ladder, while letting people perform beyond their experience.
    - Quote (talk abstract): "The result is juniors who ship like mids but can't debug like them." In the InfoQ interview: "measure understanding, not velocity", and "We're at the diagnosis stage, not the solution stage."
    - COI: none apparent. Re-checked: yes; the first quote is in the QCon abstract, not in the InfoQ article.
- **Addy Osmani** (engineering leader at Google), "Avoiding skill atrophy in the age of AI". [BLOG], 25 Apr 2025. Also "The 70% problem" (4 Dec 2024). — [Substack](https://addyo.substack.com/p/avoiding-skill-atrophy-in-the-age); [The 70% problem](https://addyo.substack.com/p/the-70-problem-hard-truths-about)
    - Juniors accept AI output too readily. Remedies: try a bug yourself for 15–30 minutes first, a day a week without AI, a learning journal of what you ask the AI, explaining the AI's solution in plain English, and human review.
    - Quote: "Today's junior devs who skip the "hard way" may plateau early, lacking the depth to grow into senior engineers tomorrow."
    - COI: Google sells AI coding tools. Re-checked: yes.
- **Namanyay Goel**, "New junior developers can't actually code". [BLOG], 14 Feb 2025. — [nmn.gl](https://nmn.gl/blog/ai-and-learning)
    - Juniors ship working AI code but cannot explain why it works or handle edge cases.
    - Quote: "The foundational knowledge that used to come from struggling through problems is just… missing."
    - COI: the page promotes the author's own AI developer tool. Verified by the search agent.
- **Gergely Orosz & Elin Nilsson**, "AI's impact on software engineers in 2026, part 2". [SURVEY], The Pragmatic Engineer, 19 May 2026, 900+ readers. — [Newsletter](https://newsletter.pragmaticengineer.com/p/ai-impact-on-software-engineers-part-2)
    - AI helps less experienced engineers less, and seniors now give the AI tasks they used to give juniors.
    - Quote: "Junior folks seem to be delegated fewer opportunities that could help them grow."
    - COI: paid newsletter with sponsors. Verified by the search agent (free section).
- **David Lozzi** (BCG), "Why today's junior engineers may never grow up". [BLOG], HackerNoon, 26 Aug 2025. — [HackerNoon](https://hackernoon.com/why-todays-junior-engineers-may-never-grow-up)
    - Quote: "Early-career engineers need intentional friction without AI."
    - COI: consultancy. Verified by the search agent.

### 3.2 The pipeline: no juniors today, no seniors tomorrow

- **Charity Majors** (CTO, Honeycomb), "Generative AI is not going to build your engineering team for you". [BLOG], Stack Overflow blog, 31 Dec 2024. — [Stack Overflow](https://stackoverflow.blog/2024/12/31/generative-ai-is-not-going-to-build-your-engineering-team-for-you/)
    - "It takes a solid seven-plus years to forge a competent software engineer."
    - Quote: "By not hiring and training up junior engineers, we are cannibalizing our own future."
    - COI: observability vendor, not an AI coding vendor. Re-checked: yes.
- **Matt Garman** (CEO, AWS), in a YouTube interview with Matthew Berman. [PODCAST/INTERVIEW], reported by The Register, 21 Aug 2025. — [The Register](https://www.theregister.com/2025/08/21/aws_ceo_entry_level_jobs_opinion/)
    - Replacing junior staff with AI is "the dumbest thing I've ever heard".
    - Quote: "How's that going to work when ten years in the future you have no one that has learned anything"
    - COI: AWS sells AI coding agents. Re-checked: yes (the news report, not the video).
- **Mark Russinovich** (CTO, Azure) **& Scott Hanselman** (Microsoft), "Redefining the software engineering profession for AI". [OPINION], *Communications of the ACM*, republished by ACM on 8 Apr 2026. — [ACM](https://theofficialacm.substack.com/p/redefining-the-software-engineering); [The Register, 23 Feb 2026](https://www.theregister.com/2026/02/23/microsoft_ai_entry_level_russinovich_hanselman/); [InfoQ, 27 Apr 2026](https://infoq.com/news/2026/04/junior-developer-pipeline-crisis)
    - Agentic tools boost seniors "while imposing an AI drag on early-in-career (EiC) developers who lack the judgment and context to steer, verify, and integrate AI output".
    - Quote: "we propose a preceptor program that pairs EiC developers directly with experienced mentors in real product teams."
    - COI: Microsoft and GitHub sell Copilot; presented as opinion. Re-checked: yes.
- **Ethan Mollick** (Wharton), interview with Peter Kafka, Business Insider *Channels* podcast. [PODCAST/INTERVIEW], republished 2 Nov 2026. — [DNYUZ](https://dnyuz.com/?p=318896)
    - Apprenticeship "broke because the incentives are no longer aligned"; if firms hire only seniors, "the talent pipeline ends".
    - COI: advises companies on AI. Verified by the search agent, via the republication.
- **Patrick T. Harker** (Wharton), "Entry-level jobs were actually secret apprenticeships all along, and AI just cut the subsidy". [NEWS, op-ed], Fortune, 25 Sep 2026. — [Fortune](https://fortune.com/2026/09/25/ai-junior-jobs-apprenticeship-talent-pipeline/)
    - Quote: "Forming judgment requires friction, dealing with tough problems, failing, and then doing it again."
    - Verified by the search agent.
- **Steve Yegge**, "The death of the junior developer". [BLOG], Sourcegraph, 24 Jun 2024. — [Sourcegraph](https://sourcegraph.com/blog/the-death-of-the-junior-developer)
    - Quote: "Why hire a junior developer to write mediocre code, when the LLM will do that for you ten times faster?"
    - COI: AI coding vendor. Verified by the search agent. See 3.5 for his 2025 follow-up.
- **Dave Griffith**, "The apprentice problem". [BLOG], 6 Nov 2025. — [Substack](https://davegriffith.substack.com/p/the-apprentice-problem)
    - Quote: "No juniors today means no seniors tomorrow."
    - Verified by the search agent.

### 3.3 Dutch sources

- **AG Connect** (23 Oct 2026) and **MSP Business** (19 Oct 2026), on the SThree/YouGov STEM Workforce Report 2026. [NEWS] on a recruiter survey. — [AG Connect](https://www.agconnect.nl/carriere/arbeidsmarkt/tech-professionals-zien-dat-senioren-juniorwerk-doen-door-ai); [MSP Business](https://mspbusiness.com/operatie-en-organisatie/veertig-procent-technici-ziet-senioren-juniorwerk-overnemen-door-ai/)
    - 793 Dutch STEM professionals (4,126 in five countries). Four in ten say seniors now do work that used to go to juniors, because AI replaces those entry-level tasks. AG Connect: the work through which juniors normally learn the trade is increasingly done by AI.
    - MSP Business, attributed to Margot van Soest (SThree): if checking AI output falls to the same seniors, they have less time to coach juniors.
    - COI: commissioned by a recruiter. Re-checked: yes; the Van Soest point is in MSP Business, not in AG Connect.
- **Emerce**, "Randstad: 29% minder startersvacatures door AI" (Erwin Boogert). [NEWS] on a staffing-firm report, 30 Sep 2025. — [Emerce](https://www.emerce.nl/nieuws/randstad-29-minder-startersvacatures-door-ai)
    - The learning period of a first job gets shorter because its tasks are automated. Quote: "Er is een nieuwe leerschool nodig." (A new school of learning is needed.)
    - COI: staffing firm. Verified by the search agent.
- **Dev Talents** (House of Talents), "We hebben voorlopig geen juniors meer nodig, daar hebben we nu AI voor." [BLOG], 8 Sep 2026. — [Dev Talents](https://www.houseoftalents.nl/devtalents/nieuws/we-hebben-voorlopig-geen-juniors-meer-nodig-daar-hebben-we-nu-ai-voor)
    - Seniority comes from incidents, refactoring and legacy work. Quote: "Niemand wordt geboren als senior." (Nobody is born a senior.)
    - COI: places developers with clients. Verified by the search agent.
- **AG Connect**, interview with Bart van Krimpen (Randstad), 8 Oct 2026. [NEWS]. — [AG Connect](https://www.agconnect.nl/carriere/arbeidsmarkt/vraag-naar-junior-iters-daalt-niet-alleen-door-komst-ai)
    - The drop in demand for junior IT staff is mainly cyclical; AI plays a role but is not the only cause. Nuances the hiring side, not the learning side.
    - COI: staffing firm. Verified by the search agent.
- **Computable.be** (William Visterin), "Ai biedt junior softwareontwikkelaar kansen", 28 Jun 2024. [NEWS]. — [Computable](https://computable.be/?p=54111)
    - Ron Tolido (Capgemini): juniors learn faster and move to senior faster. Marc Schijvaerts (PeopleWare): juniors cannot judge whether AI answers are right.
    - COI: both work for IT consultancies. Verified by the search agent.

### 3.4 Remedies practitioners propose

Most remedies match parts of the harness. That is a match in direction, not evidence that the harness works.

| Remedy | Source | In the harness |
|---|---|---|
| Try it yourself for 15–30 minutes before asking the AI | Osmani 2025 | Attempt first; the next rung only after a visible attempt (L2) |
| "Intentional friction without AI" | Lozzi 2025 | The guard at L1–L3 |
| Explain the AI's solution in plain English; "Explain the Machine" | Osmani 2025; Scalzo 2026 | A task counts only after an explanation in your own words |
| A day a week without AI; AI-off sessions; build from scratch now and then | Osmani 2025; Scalzo 2026; Goel 2025 | Reviews at L4 through real work |
| A learning journal of what you ask the AI | Osmani 2025 | The diary |
| "Measure understanding, not velocity" | Allan 2026 | Success rate on explained tasks, not output |
| Preceptor programmes; seniors mentor juniors; "manage juniors for learning, not production" | Russinovich & Hanselman 2026; Beck 2025; Majors 2024 | **Not covered**: a tool does not supply mentoring |

### 3.5 Counter-voices and nuance

- **Kent Beck**, "The bet on juniors just got better". [BLOG], 12 Dec 2025. — [Tidy First?](https://newsletter.kentbeck.com/p/the-bet-on-juniors-just-got-better)
    - Used well ("Not vibe coding—augmented coding"), AI speeds up learning, so hiring juniors is a better bet. Condition: "manage juniors for learning, not production."
    - Quote: "The genie is an endlessly patient tutor, but unlikely to volunteer learning opportunities."
    - COI: the post is sponsored by CodeRabbit (AI code review). Re-checked: yes.
- **Simon Willison**, Half Stack Data Science podcast, excerpt of 1 Apr 2025. [PODCAST/INTERVIEW]. — [simonwillison.net](https://simonwillison.net/2025/Apr/1/half-stack-data-science/)
    - LLMs shave down the learning curve, with a condition: "you've got to be disciplined enough to make sure you're not outsourcing the bits you need to learn".
    - COI: builds open-source LLM tools. Verified by the search agent.
- **Steve Yegge**, "Revenge of the junior developer". [BLOG], Sourcegraph, 22 Mar 2025. — [Sourcegraph](https://sourcegraph.com/blog/revenge-of-the-junior-developer)
    - Quote: "junior developers have actually been far more eager to adopt AI than senior devs."
    - COI: AI coding vendor. Verified by the search agent.
- **Julien Danjou**, "AI won't kill juniors. It will expose seniors." [BLOG], 21 Jan 2026. — [Blog](https://julien.danjou.info/blog/ai-wont-kill-juniors-it-will-expose)
    - Juniors will adapt; the real risk is seniors who never grew beyond writing code. Quote: "They might struggle for a year or two, but they'll figure it out."
    - Verified by the search agent.
- **Gwen Davis**, "Junior developers aren't obsolete". [BLOG], GitHub, 7 Aug 2025. — [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/junior-developers-arent-obsolete-heres-how-to-thrive-in-the-age-of-ai/)
    - Use Copilot as a tutor; also suggests turning off inline completions while learning.
    - COI: strong; GitHub sells Copilot. Verified by the search agent.
- **BairesDev Dev Barometer Q2 2026**, 11 Jun 2026, 1,569 developers. [SURVEY] [VENDOR]. — [BairesDev](https://www.bairesdev.com/press/16-percent-of-juniors-fully-understand-ai-code/)
    - 85% of juniors say AI improved their understanding; 16% of seniors think juniors fully understand the AI code they submit. Self-reported perceptions only.
    - COI: outsourcing vendor. Verified by the search agent.

### 3.6 Not verified or dropped

- FD opinion pieces on investing in junior programmers and a "juniorenquotum": paywalled.
- The podcast episode of Russinovich & Hanselman ("Senior boost, junior drag"), and Charity Majors on The Pragmatic Engineer podcast (12 Aug 2026): pages not reachable or no transcript.
- Tweakers: blocked for the crawler. No GOTO or NDC talk specifically on juniors and AI was found.
- **Pattern across sources.** Two threats are often mixed up: juniors not being hired (Majors, Garman, Yegge 2024, Mollick, Harker) and hired juniors not growing (Scalzo, Allan, Osmani, Goel, Orosz). §2.12 is about the second. Many voices have a stake: AI vendors (AWS, Microsoft, GitHub, Google, Sourcegraph) and recruiters or staffing firms (SThree, Randstad, Dev Talents, BairesDev). The vendors themselves also warn.

## 4. What this means for §2.12

- **The mechanism is supported:** short-term experiments (Shen & Tamkin) and qualitative studies (Yu & Moon; Feng et al.) point the same way, and practitioners describe the same pattern.
- **The long-term outcome is not shown:** no longitudinal study follows juniors at work.
- **AI can also teach:** Brynjolfsson et al. found learning on the job, but with the human still doing the work.
- **The trade-off has analogues, not proof:** aviation delegates to automation and maintains manual skills on purpose (Casner et al.; FAA). Beane points to the missing piece no tool supplies: connection with experts.

## 5. Gaps

- The full texts of Yu & Moon, Feng et al. and Beane (2024) were not read; their details come from abstracts and summaries.
- No Dutch study of junior developers and AI was found.
