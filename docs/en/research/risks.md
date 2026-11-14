---
title: "Risks of learning to code with AI, and how to reduce them"
description: "Eighteen risks of practising with an agentic coding assistant, scored for likelihood and impact with an evidence grade, and a mitigation plan for students and teachers."
---
# Risk assessment and mitigation

<a id="3-risk-assessment"></a>

## 3. Risk assessment {#risks}

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
| R13 | **Privacy of the diary and skill data** | Reflections, research notes and transcripts are synced to cloud storage (such as OneDrive) or shared, or more goes online with a public dashboard than the learner meant. | — | 2 | 2 | **4** | Both |
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

<a id="4-how-to-apply-it-mitigation-plan"></a>

## 4. How to apply it: mitigation plan {#mitigation}

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
| R11 | Graded work (§10.8): name its paths with `setting graded`. There the hint ladder goes up to rung 4 for every skill, a worked solution is never available, and the guard blocks every write by Claude, also outside the project. The hooks keep an AI-use log in the repo: a row per answer, an export of each session (Claude Code has no share link), and an APA reference. You fill in what you did with the help and how you checked it (as CHE's OER art. 7.11 asks, for example). Ask your teacher which parts of your final assessment are level 0 and which are level 1 (§4.2). Always follow course and institution rules. | Hooks (guard, prompt-gate, Stop) + `ai-verantwoording/` | Low |
| R12 | Keep the harness small (~5 hooks, 1 skill) and review it monthly. Time-box harness work: at most one fix per session, and research only when it would change what you practise. Research about the harness counts as harness work too: stop it until after your exam, unless a hook misfires. | Diary (note minutes spent on the harness vs. practice) | Medium |
| R13 | Keep `.learning/`, `research_notes/` and transcripts out of shared repos (`.gitignore`), and store only what is needed. Publishing is the learner's choice, and then only a filtered selection goes online: the dashboard export takes listed fields only and filters the learner's private terms (`.learning/private.json`), a security check runs before every push, and the learner reads the diff first. The diary says that reflections appear on the public dashboard. The pilot student chose to publish such a selection. | `.gitignore`, `export.mjs`, `security-check.mjs` | Low |
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
