# Citation check: learning-science claims in the AI-assisted learning review, plus missing literature

Scope: (A) checks 15 claims against primary sources where they could be reached; (B) covers 4 topics the review is missing. The application context is a student preparing for a timed programming exam without AI, in an IDE they have practised little in, while using an AI tutor with an "attempt first" hint ladder.

Method note: abstracts came from Crossref, OpenAlex, PubMed and arXiv records. Full texts were read for Wilson et al. (2019), Buçinca et al. (2021), Wood & Wood (1999), Bisra et al. (2018), Smith et al. (2014), Hesselmann (2020; via PMC) and Shen & Tamkin (2026; arXiv HTML). Where only secondary records were available, this is stated. Nature and Springer pages redirected to login; ScienceDirect, SSRN, ACU and CORE pages returned 403.

## A1. Wilson, Shenhav, Straccia & Cohen (2019), "The Eighty Five Percent Rule for optimal learning"

### Takeaway
**Verdict: the citation is correct; the claim is imprecise, and wrong if presented as an established human learning rule.** The ~85% figure is a mathematical result. It applies to *binary classification* learned by *stochastic-gradient-descent-type* rules, with difficulty adjusted continuously and Gaussian decision noise. It was demonstrated only in simulations (a perceptron, a two-layer MNIST network, and a model of monkey perceptual learning), never in humans. Using it as a "task success rate" target or a mastery threshold for programming practice extrapolates well beyond the paper.

### Cited Findings
- Abstract (verbatim): "We derive conditions for this sweet spot for a broad class of learning algorithms in the context of binary classification tasks. For all of these stochastic gradient-descent based learning algorithms, we find that the optimal error rate for training is around 15.87% or, conversely, that the optimal training accuracy is about 85%. We demonstrate the efficacy of this 'Eighty Five Percent Rule' for artificial neural networks used in AI and biologically plausible neural networks thought to describe animal learning." Citation: Nature Communications 10, 4646. — [Wilson et al. 2019 (DOI)](https://doi.org/10.1038/s41467-019-12552-4); full text read via [eScholarship PDF](https://escholarship.org/content/qt0v22s4g4/qt0v22s4g4.pdf)
- Exact value: for Gaussian noise, ER* = ½(1 − erf(1/√2)) ≈ 0.1587. The paper states: "We showed that training at the optimal accuracy proceeds exponentially faster than training at a fixed difficulty." This is a theoretical result, confirmed in the simulations. — [Wilson et al. 2019, full text](https://escholarship.org/content/qt0v22s4g4/qt0v22s4g4.pdf)
- The learners it was demonstrated on:
    - a Perceptron with artificial stimuli;
    - a two-layer network (50 hidden units, trained by backpropagation) on binary splits of MNIST digits (parity and magnitude);
    - the Law & Gold model of monkeys learning the random-dot-motion task, which uses a reinforcement-learning rule.

    No human data were collected. — [Wilson et al. 2019, full text](https://escholarship.org/content/qt0v22s4g4/qt0v22s4g4.pdf)

- Dependence on noise: "relaxing the assumption that the noise is Gaussian leads to changes in the optimal training accuracy: from 85% for Gaussian, to 82% for Laplacian noise, to 75% for Cauchy noise." In the Methods, ER*(Laplace) ≈ 0.1839 and ER*(Cauchy) = 0.25. — [Wilson et al. 2019, full text](https://escholarship.org/content/qt0v22s4g4/qt0v22s4g4.pdf)
- Scope statements by the authors themselves (verbatim):
    - The work offers a way of deriving the desired difficulty "in the special case of binary classification tasks for which stochastic gradient-descent learning rules apply. As such our work represents the first step towards a more mathematical instantiation of these theories, although it remains to be generalized to a broader class of circumstances, such as multi-choice tasks and different learning algorithms."
    - "it is important to note that not all models will exhibit a sweet spot of difficulty for learning." Their example is a Bayesian learner with perfect memory, which is insensitive to the order of items.
    - A key assumption "likely holds in the relatively simple cases we consider here, although whether it holds in more complex cases will be an important question for future work."

    — [Wilson et al. 2019, full text](https://escholarship.org/content/qt0v22s4g4/qt0v22s4g4.pdf)

- On humans, the paper offers only practice and intuition. Staircase procedures "are commonly designed to produce about 80–85% accuracy". It then states: "to the best of our knowledge no formal theoretical work has addressed the effect of training accuracy on learning, a test of which is an important direction for future work." — [Wilson et al. 2019, full text](https://escholarship.org/content/qt0v22s4g4/qt0v22s4g4.pdf)
- University press coverage likewise frames the rule as applying to binary right/wrong tasks and perceptual learning, and calls for further research before applying it to humans. — [University of Arizona News](https://news.arizona.edu/news/learning-optimized-when-we-fail-15-time)
- Web searches and a PubMed title search found no published human experiment that tests the 85% rule. Popular extensions to education (e.g., [Scott H. Young blog](https://www.scotthyoung.com/blog/2022/07/05/85-percent-rule/)) are commentary, not tests.

### Inferences
- Applying the rule to "task success rate" in programming practice is not justified as evidence. It is defensible only as a heuristic ("keep practice hard enough that you sometimes fail"). The paper itself links the rule to the Desirable Difficulties and Region of Proximal Learning frameworks, so the review should cite it as *computational inspiration* for a difficulty target, not as an empirical threshold.
- There is a conceptual mismatch. Wilson's 85% is an *optimal training accuracy while learning*: difficulty is titrated continuously so that the error rate stays near 15%. A promotion criterion such as "≈85% success over ≥5 tasks" (the harness's L2→L3 rule) uses the number as a *mastery threshold*. The paper supports neither the threshold use nor transfer to multi-step tasks like programming.
- Practical point: with only 5 tasks, success can only be measured in steps of 20 points (80% or 100%), and binomial uncertainty is large. "85%" is therefore not operationally distinguishable from 80–100% at that sample size.

### Gaps
- I cannot rule out unpublished or preprint human tests of the 85% rule; none surfaced in web or PubMed searches.

## A2. Bloom (1984) "2 sigma" vs. VanLehn (2011); critiques and re-analyses

### Takeaway
**Verdict: the VanLehn numbers are correct (human tutoring d = 0.79; ITS d = 0.76 per the abstract). The "step-based" label for the 0.76 comes from the article body, which I did not re-check here. Bloom's 2σ as an expected effect is contested and outdated.** The 2σ rested on two small, 3-week dissertations with narrow, aligned tests, and the tutoring condition was bundled with mastery-learning testing and feedback. Modern meta-analyses put tutoring programmes at ≈0.29–0.37 SD.

### Cited Findings
- Bloom (1984), Educational Researcher 13(6), 4–16. The claim rests on dissertations by Anania (1982, 1983) and Burke (1984), which compared three conditions:
    - Conventional: ~30 students per teacher, periodic tests.
    - Mastery Learning: formative tests "followed by corrective procedures and parallel formative tests".
    - Tutoring: a tutor per 1–3 students, "followed periodically by formative tests, feedback-corrective procedures, and parallel formative tests as in the mastery learning classes."

    — [Bloom 1984](https://doi.org/10.3102/0013189X013006004)

- VanLehn (2011) abstract (verbatim): "when compared to No tutoring, the effect sizes of answer-based tutoring systems, intelligent tutoring systems, and adult human tutors are believed to be d = 0.3, 1.0, and 2.0 respectively. This review did not confirm these beliefs. Instead, it found that the effect size of human tutoring was much lower: d = 0.79. Moreover, the effect size of intelligent tutoring systems was 0.76, so they are nearly as effective as human tutoring." Educational Psychologist 46(4), 197–221. — [VanLehn 2011](https://doi.org/10.1080/00461520.2011.611369)
- von Hippel (2024), "Two-Sigma Tutoring: Separating Science Fiction from Science Fact", Education Next 24(2), pp. 22–31:
    - The 2σ evidence came essentially from the Anania and Burke dissertations: 4th, 5th and 8th graders learning probability and cartography over three weeks, with narrow tests aligned to unfamiliar material.
    - Mastery-learning students (testing and feedback without tutoring) scored ~1.1 SD above whole-class students. That is about half of the 2σ, leaving ~0.9 SD for tutoring itself. Tutored students also got about an hour more instruction per week.
    - Cohen, Kulik & Kulik (1982) reviewed 65 tutoring studies. Only one (a 1972 dissertation, 32 students) showed 2σ. The average was ~0.33 SD: 0.84 SD on narrow tests vs 0.27 SD on broad standardized tests.
    - A realistic target for AI tutoring is ≈⅓ SD on a broad test. "It seems rash, though, to promise two-sigma effects from AI when human tutoring has rarely produced such large effects."

    — [von Hippel 2024](https://www.educationnext.org/two-sigma-tutoring-separating-science-fiction-from-science-fact/)

- Nickow, Oreopoulos & Quan:
    - The NBER working paper (2020) reported a pooled tutoring effect of 0.37 SD.
    - The peer-reviewed version (AERJ 61(1), 74–107, 2024) reports a pooled ES of 0.288 SD (SE = 0.029). Effects are largest for teacher or paraprofessional tutors, in earlier grades, at ≥3 days per week, and during school.

    — [NBER 2020](https://doi.org/10.3386/w27476); [AERJ 2024](https://doi.org/10.3102/00028312231208687)

- Kulik & Fletcher (2016), 50 ITS evaluations: median effect 0.66 SD. The size "depended to a great extent on whether improvement was measured on locally developed or standardized tests". — [RER 86(1), 42–78](https://doi.org/10.3102/0034654315581420)
- Ma, Adesope, Nesbit & Liu (2014), 107 ES and 14,321 participants. ITS compared with:
    - teacher-led large-group instruction: g = .42;
    - non-ITS computer-based instruction: g = .57;
    - textbooks: g = .35;
    - individualized human tutoring: g = −.11 (n.s.);
    - small-group instruction: g = .05.

    — [J Educ Psychol 106(4), 901–918](https://doi.org/10.1037/a0037123)

### Inferences
- Cite VanLehn for "step-level tutoring ≈ human tutoring (~0.8 SD vs. no tutoring)". Do not cite Bloom's 2σ as an expected effect of an AI tutor.
- Test alignment matters a lot: effects on narrow, aligned tests are roughly 2–3× those on broad tests (Cohen et al. via von Hippel; Kulik & Fletcher). A course exam is narrow and aligned, so practice matched to the exam format should show larger gains than general programming practice.
- Part of the "tutoring" effect is really the testing-and-feedback-correction loop. A hint ladder plus testing captures some of it even without human-like tutoring.

### Gaps
- VanLehn's body-text values for substep-based and answer-based systems were not checked; only the abstract was accessed. The values I recall, d ≈ 0.40 and 0.31, are unverified here.
- Sample sizes of the Anania and Burke studies are not given in von Hippel's article.

## A3. Kulik, Kulik & Bangert-Drowns (1990) mastery-learning meta-analysis; Slavin's critiques

### Takeaway
**Verdict: citation correct; the headline effect size is contested and only verified secondarily.** The abstract (108 evaluations; stronger effects for weaker students) is verified. I could not confirm the commonly quoted overall ES of ≈0.52 SD from the primary text. Slavin (1987; 1990) showed effects on standardized tests are essentially zero, and Kulik et al. (1990) themselves agreed with this, per Slavin's reply.

### Cited Findings
- Kulik et al. (1990) abstract:
    - 108 controlled evaluations showing "positive effects on the examination performance of students in colleges, high schools, and the upper grades in elementary schools".
    - Effects "appear to be stronger on the weaker students" and "vary as a function of mastery procedures used, experimental designs of studies, and course content".
    - Mastery programmes "may increase student time on instructional tasks", and "self-paced mastery programs often reduce the completion rates in college classes."
    - Published in Review of Educational Research 60(2), 265–299.

    — [Kulik, Kulik & Bangert-Drowns 1990](https://doi.org/10.3102/00346543060002265)

- The 0.52 SD figure (50th → ~70th percentile) appears only in secondary summaries, e.g., an AI-generated summary on the [Academia.edu record](https://www.academia.edu/81783373/Effectiveness_of_Mastery_Learning_Programs_A_Meta_Analysis). Slavin (1987) reports that an *earlier* analysis, Kulik, Kulik & Bangert-Drowns (1986), found mean ES 0.52 for pre-college and 0.54 for college studies, and that Guskey & Gates reported 0.94 (elementary), 0.72 (high school) and 0.65 (college). — [Slavin 1987 PDF (gwern mirror; via search snippet)](https://www.gwern.net/doc/psychology/1987-slavin.pdf)
- Slavin (1987) abstract, a best-evidence synthesis of group-based mastery learning in elementary and secondary schools, ≥4 weeks: "The review found essentially no evidence to support the effectiveness of group-based mastery learning on standardized achievement measures. On experimenter-made measures, effects were generally positive but moderate in magnitude, with little evidence that effects maintained over time." It also raises the "coverage versus mastery dilemma". — [Slavin 1987, RER 57(2), 175–213](https://doi.org/10.3102/00346543057002175)
- Slavin (1990), "Mastery Learning Re-Reconsidered":
    - "Kulik et al. (1990) agree with what was to me the key finding of my review, that the effects of mastery learning on standardized measures are effectively zero."
    - Because most studies used experimenter-made tests, "the overall effect size estimates derived by Kulik et al. are heavily influenced by these tests". He argues these tests may be biased toward the mastery-learning treatment.

    — [Slavin 1990, RER 60(2), 300ff.](https://doi.org/10.2307/1170613)

### Inferences
- Mastery gating is supported mainly on narrow, curriculum-aligned tests, which an exam is. But it costs time and can reduce coverage (Kulik 1990; Slavin 1987). For a time-boxed exam preparation, strict gates (e.g., "no promotion while explanations are pending") trade coverage for depth, and the review should say so explicitly.

### Gaps
- The full text of Kulik et al. (1990) was not accessed: overall ES, ES by test type, and ES by mastery criterion are unverified.

## A4. Cepeda, Vul, Rohrer, Wixted & Pashler (2008), optimal gap vs. retention interval

### Takeaway
**Verdict: correct, if stated as "≈20–40% of a 1-week retention interval, falling to ≈5–10% of a 1-year interval".** The optimal gap grows in absolute terms as the test delay grows, but shrinks as a proportion of it.

### Cited Findings
- Design: "more than 1,350 individuals were taught a set of facts and—after a gap of up to 3.5 months—given a review. A final test was administered at a further delay of up to 1 year." — [Cepeda et al. 2008, Psych Sci 19(11), 1095–1102](https://doi.org/10.1111/j.1467-9280.2008.02209.x)
- Results (verbatim): "At any given test delay, an increase in the interstudy gap at first increased, and then gradually reduced, final test performance. The optimal gap increased as test delay increased. However, when measured as a proportion of test delay, the optimal gap declined from about 20 to 40% of a 1-week test delay to about 5 to 10% of a 1-year test delay." — [Cepeda et al. 2008](https://doi.org/10.1111/j.1467-9280.2008.02209.x)

### Inferences
- With an exam about 1–2 weeks away, the optimal spacing between study and review is roughly 1.5–4 days for a 1-week horizon, by the 20–40% rule. Gaps that are too short are costlier than gaps that are somewhat too long, because performance "gradually" declines past the optimum. Fibonacci intervals capped 3 days before the exam are broadly compatible.
- Caveat: Cepeda used trivia facts with a single review. Transfer to procedural programming skill is an extrapolation.

### Gaps
- No equivalent "ridgeline" study for procedural or programming skills was found.

## A5. Latimier, Peyre & Ramus (2021); Karpicke & Roediger (2007); Kang, Lindsey, Mozer & Pashler (2014)

### Takeaway
**Verdict: correct.** Latimier et al. report spaced vs massed retrieval g = 0.74 and expanding vs uniform g = 0.034 (n.s.). The moderator is the *number of exposures*: more retrieval exposures favour expanding schedules. Karpicke & Roediger (2007) found equal spacing better at 2 days, because what matters is delaying the first retrieval. Kang et al. (2014) found expanding equal to uniform at 8 weeks, but expanding gave much higher recall during the training period.

### Cited Findings
- Latimier et al. (abstract):
    - "We carried out meta-analyses on 29 studies".
    - "Using meta-regression with robust variance estimation, 39 effect sizes were aggregated in subset 1 and 54 in subset 2".
    - Subset 1 showed "a strong benefit of spaced retrieval practice in comparison with massed retrieval practice" (g = 0.74).
    - Subset 2 showed "no significant difference between expanding and uniform spacing schedules" (g = 0.034).
    - "Moderator analyses on this subset showed that the number of exposures of an item during retrieval practice" explains the inconsistencies: "the more learners are tested, the more beneficial the expanding schedule is compared with the uniform one."
    - The results do not support "the widely held belief that inter-retrieval intervals should be progressively increased".
    - Published in Educational Psychology Review 33(3), 959–987. It was online first in Oct 2020, so both 2020 and 2021 appear in citations.

    — [Latimier et al. 2021 (DOI)](https://doi.org/10.1007/s10648-020-09572-8); abstract text via [IFP NYU repost](https://ifp.nyu.edu/?p=1511228)

- Karpicke & Roediger (2007), JEP:LMC 33(4), 704–719:
    - Expanding retrieval "produced short-term benefits 10 min after learning", but "equally spaced retrieval produced superior retention 2 days later". This held with and without feedback.
    - "Delaying the first test improved long-term retention, regardless of how the repeated tests were spaced… Expanding the interval between repeated tests had little effect on long-term retention in 3 experiments."

    — [Karpicke & Roediger 2007](https://doi.org/10.1037/0278-7393.33.4.704)

- Kang et al. (2014), Psychonomic Bulletin & Review 21(6), 1544–1550:
    - Prior studies "generally compared expanding versus equal-interval training within a single session, and have assessed effects only upon a single final test".
    - "For the learning of foreign vocabulary spread over four weeks, we found that expanding retrieval practice (i.e., sessions separated by increasing numbers of days) produced recall equivalent to that from equal-interval practice on a final test given eight weeks after training. However, the expanding schedule yielded much higher average recallability over the whole training period."

    — [Kang et al. 2014](https://doi.org/10.3758/s13423-014-0636-z); [PubMed 24744260](https://pubmed.ncbi.nlm.nih.gov/24744260/)

### Inferences
- A Fibonacci (expanding) schedule is not worse than uniform at the final test. It keeps performance higher during training (Kang), and may help when items are retrieved many times (Latimier). The active ingredients are spacing itself, retrieval, and a sufficiently delayed, effortful first retrieval (Karpicke & Roediger).
- The harness's "fail → two steps back" rule resembles successive relearning, but it is not directly tested in these studies.

### Gaps
- The Latimier abstract reports no CIs. Full-text moderator details (retention interval, feedback) were not accessed.

## A6. Arthur, Bennett, Stanush & McNelly (1998), task characteristics and skill decay

### Takeaway
**Verdict: correct.** Cognitive, artificial and accuracy-based tasks decay faster than physical, natural and speed-based tasks. Loss grows with nonuse, from d ≈ −0.01 immediately after training to −1.4 after more than 365 days. A larger 2025 meta-analysis (Tatel & Ackerman) updates the time course.

### Cited Findings
- Arthur et al. (1998), Human Performance 11(1), 57–101:
    - "189 independent data points extracted from 53 articles".
    - Skill loss ranged "from an effect size (d) of -0.01 immediately after training to a d of -1.4 after more than 365 days of nonuse".
    - "Physical, natural, and speed-based tasks were less susceptible to skill loss than cognitive, artificial, and accuracy-based tasks."
    - "using recognition tests, using similar conditions of retrieval at retention, and using behavioral evaluation criteria, resulted in less skill loss over time."

    — [Arthur et al. 1998](https://doi.org/10.1207/s15327043hup1101_3)

- Tatel & Ackerman (2025), Psychological Bulletin 151(6), 696–736, on procedural skills with motor components:
    - 1,344 effect sizes from 457 reports.
    - Decay grew by 0.08 SD per month for accuracy measures and 0.06 SD per month for speed and mixed measures.
    - "half of initial skill acquisition performance gains were lost after approximately 6.5 months for accuracy, 13 months for speed, and 11 months for mixed performance".
    - Moderators: task type, task complexity, intermittent performance opportunities, and task instructions.

    — [Tatel & Ackerman 2025](https://doi.org/10.1037/bul0000481); [PubMed 40455501](https://pubmed.ncbi.nlm.nih.gov/40455501/)

### Inferences
- Writing correct C#/OOD code from memory is cognitive, artificial and accuracy-based: the fastest-decaying class. This supports scheduled maintenance reviews.
- "Similar conditions of retrieval" reduced measured loss, which links to transfer-appropriate processing (B1): practise in exam-like conditions.

### Gaps
- Arthur's full moderator table (effect sizes per task type) was not extracted. Tatel & Ackerman cover motor-component procedural skills, so their applicability to programming is partial.

## A7. Sparrow, Liu & Wegner (2011) "Google effects on memory": replication status

### Takeaway
**Verdict: contested, and should be softened in the review.** The SSRP (Camerer et al. 2018) replicated **Experiment 1**, the "Google Stroop" reaction-time task, and it failed (pooled N = 338). Hesselmann (2020) ran a closer replication and also failed (BF01 = 5.07). I found **no direct replication of the folder ("where vs. what") experiment**. The broader "saved information is remembered less" effect did replicate, but only when saving is perceived as reliable (Schooler & Storm 2021). "People remember where information is, not the information" is therefore an over-statement. Better supported: expecting reliable external access reduces memory for the offloaded content.

### Cited Findings
- Sparrow et al. (2011), Science 333(6043), 776–778. Editor's summary: "Owing to Internet search, we are more likely to encode 'where' aspects of memory rather than 'what.'" — [Sparrow et al. 2011](https://doi.org/10.1126/science.1207745)
- Camerer et al. (2018): 21 Nature/Science experiments; "a significant effect in the same direction as the original study for 13 (62%) studies"; replication effect sizes were on average about 50% of the originals. — [Camerer et al. 2018, Nat Hum Behav 2, 637–644](https://doi.org/10.1038/s41562-018-0399-z)
- Hesselmann (2020) on the SSRP replication: it covered Sparrow's Exp. 1 (modified Stroop task), with stage 1 N = 104 and stage 2 N = 234 pooled, and "did not show a significant effect despite adequate statistical power". — [Hesselmann 2020, PeerJ 8:e10325](https://doi.org/10.7717/peerj.10325); [PMC7651475](https://pmc.ncbi.nlm.nih.gov/articles/PMC7651475/)
- Hesselmann's own replication, designed closer to the original after Sparrow's objections:
    - 117 tested, N = 89 analysed.
    - Preregistered interaction t(88) = −1.04, p = .301; sequential BF01 = 5.07 favouring the null.
    - Conclusion: "no conclusive evidence in favor of the notion that the concept of the Internet… is automatically activated when participants are faced with hard trivia questions"; the effect "might be much smaller than previously thought, and less robust".

    — [Hesselmann 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7651475/)

- Schooler & Storm (2021), Memory 29(9), 1101–1110: "we replicated the Google Effect, but only when participants experienced a practice phase demonstrating the reliability of the saving process. No evidence of a Google Effect was observed when participants experienced a practice phase demonstrating the saving process to be unreliable." Experiment 2 showed robustness across 10 trivia topics. — [Schooler & Storm 2021](https://doi.org/10.1080/09658211.2021.1962356)
- Related newer evidence: photographing or screenshotting art images impaired memory for them, with screenshotting particularly detrimental. — [Lurie, Fabrizio & Westerman 2025, Mem Cognit 53(7)](https://doi.org/10.3758/s13421-025-01711-2)
- A 2024 meta-analysis (Gong & Yang, Frontiers in Public Health) links "Google effects" to cognitive load and other factors. I could not verify its pooled effect size or methods, and its quality is unclear. — [Gong & Yang 2024](https://doi.org/10.3389/fpubh.2024.1332030)

### Inferences
- If the review uses Sparrow to argue that "knowing the AI is there makes students encode less", it should cite the conditional offloading literature instead (Schooler & Storm 2021; Grinschgl et al. 2021; see A8). It should drop the Stroop "automatic activation" claim and not present "where-not-what" as established.
- For the student, the relevant mechanism is that *reliable* access (an always-available AI tutor) is precisely the condition under which offloading lowers memory. That argues for deliberate AI-free retrieval sessions.

### Gaps
- No replication of the folder/"where vs what" experiment was found. I did not query the FORRT replication database directly.
- The Gong & Yang (2024) pooled estimate was not verified.

## A8. Risko & Gilbert (2016) cognitive offloading; does offloading only reduce memory? (Storm & Stone 2015)

### Takeaway
**Verdict: a claim that offloading "only reduces memory" is wrong or imprecise.** Offloading reliably boosts immediate performance and can free capacity:

- saving one set of items improves memory for new items ("saving-enhanced memory");
- offloading improves a concurrent secondary task.

It reduces memory for the *offloaded* content mainly when there is no explicit goal to learn that content.

### Cited Findings
- Risko & Gilbert (2016), Trends in Cognitive Sciences 20(9), 676–688. It offers a metacognitive framework for what triggers cognitive offloading and what its cognitive consequences are. I only accessed metadata and the Semantic Scholar TLDR. — [Risko & Gilbert 2016](https://doi.org/10.1016/j.tics.2016.07.002)
- Storm & Stone (2015), Psych Sci 26(2), 182–188:
    - "Results from three experiments showed that saving one file before studying a new file significantly improved memory for the contents of the new file."
    - The effect "was not observed when the saving process was deemed unreliable or when the contents of the to-be-saved file were not substantial enough to interfere with memory for the new file."

    — [Storm & Stone 2015](https://doi.org/10.1177/0956797614559285)

- Replications and extensions of saving-enhanced memory:
    - Partial saving within a single list also produces the effect, whether by button or by hand. — [Fellers & Storm 2024, Mem Cognit 52(6)](https://doi.org/10.3758/s13421-024-01545-4)
    - Three experiments found that higher working-memory capacity gives a larger effect. — [Buchli & Storm 2025, Memory 33(8)](https://doi.org/10.1080/09658211.2025.2551230)
- Grinschgl, Papenmeier & Meyerhoff (2021), QJEP 74(9), 1477–1496:
    - Exp. 1 (N = 172): making offloading costlier reduced offloading, which brought "lower immediate task performance but more accurate memory".
    - Exp. 2: offloading "remained detrimental for subsequent memory performance when participants were aware of the upcoming memory test".
    - Exp. 3: participants "forced to offload maximally but were aware of the memory test could almost completely counteract the negative impact of offloading on memory."

    — [Grinschgl et al. 2021](https://doi.org/10.1177/17470218211008060)

- Grinschgl et al. (2023), preregistered, N = 172: more offloading was "accompanied by a more accurate performance in the N-back task", i.e., offloading "releases internal resources that can then be devoted to improving performance in other, concurrent tasks." — [Psychon Bull Rev 30(6), 2250–2261](https://doi.org/10.3758/s13423-023-02312-3)

### Inferences
- For the harness, offloading *non-target* load (tooling, SDK setup, boilerplate; the L4 `tool.omgeving` category) is consistent with the capacity-freeing evidence. Offloading the *target* skill lowers memory for it unless the learner explicitly intends to learn it.
- "Explain it in your own words" gates and attempt-first rules work like Grinschgl's Exp. 3 "explicit goal" condition.

### Gaps
- The Risko & Gilbert full text was not accessed, so I cannot quote its exact cost/benefit statements.

## A9. Kirschner, Sweller & Clark (2006) vs. productive failure; Sinha & Kapur (2021)

### Takeaway
**Verdict: both citations correct; the debate is contested and moderated, not settled.** Sinha & Kapur found g = 0.36 [0.20, 0.51] for problem-solving-then-instruction (PS-I) across 53 studies (166 comparisons). Effects were larger (0.37–0.58) with high fidelity to productive-failure (PF) design. Instruction-first was favoured for grades 2–5 and for domain-general skills. A bias-corrected estimate of g = 0.87 is reported. Kirschner et al. hold that guidance is superior until learners have enough prior knowledge.

### Cited Findings
- Kirschner et al. (2006), Educational Psychologist 41(2), 75–86: minimally guided instruction is "less effective and less efficient than instructional approaches that place a strong emphasis on guidance"; "The advantage of guidance begins to recede only when learners have sufficiently high prior knowledge to provide 'internal' guidance." — [Kirschner, Sweller & Clark 2006](https://doi.org/10.1207/s15326985ep4102_1)
- Sinha & Kapur (2021), Review of Educational Research 91(5), 761–798 (abstract):
    - 53 studies, 166 comparisons; "significant, moderate effect in favor of PS-I (Hedge's g 0.36 [95% confidence interval 0.20; 0.51])".
    - "even stronger (Hedge's g ranging between 0.37 and 0.58) when PS-I was implemented with high fidelity to the principles of Productive Failure".
    - "Students' grade level, intervention time span, and its (quasi-)experimental nature contributed to the efficacy of PS-I over I-PS designs."
    - "Contrasting trends were, however, observed for younger age learners (second to fifth graders) and for the learning of domain-general skills, for which effect sizes favored I-PS."
    - "an estimation of true effect sizes after accounting for publication bias suggested a strong effect size favoring PS-I (Hedge's g 0.87)."

    — [Sinha & Kapur 2021](https://doi.org/10.3102/00346543211019105)

- Kapur (2016) frames the design space as productive and unproductive success and failure. Direct instruction "may well be an unproductive success compared with examples of productive failure and productive success." — [Educational Psychologist 51(2), 289–299](https://doi.org/10.1080/00461520.2016.1155457)
- Counter-evidence exists: Ashman, Kalyuga & Sweller (2020), "Problem-solving or Explicit Instruction: Which Should Go First When Element Interactivity Is High?" Only metadata was retrieved; the abstract was not. — [Educ Psychol Rev 32(1), 229–247](https://doi.org/10.1007/s10648-019-09500-5)
- Theory of when and how PS-I works: [Loibl, Roll & Rummel 2017, Educ Psychol Rev 29(4), 693–715](https://doi.org/10.1007/s10648-016-9379-x) (metadata only).

### Inferences
- Productive failure is not "unguided struggle". Its benefit depends on designed problem tasks followed by instruction that builds on and contrasts with the student's attempts.
- An "attempt first" ladder only approximates PS-I if the attempt is followed by consolidating explanation that compares the attempt with a canonical solution. Without that it is the minimally guided case Kirschner et al. criticise.
- For novices on high-element-interactivity material (e.g., first encounters with OOD patterns), worked examples first (the harness's L0/L1) remains the safer choice.

### Gaps
- The often-cited outcome moderator (PS-I helps conceptual knowledge and transfer but not procedural knowledge) is not in the abstract and was not verified.
- The abstract does not explain why the bias-corrected estimate (0.87) is *larger* than the uncorrected one (0.36). This is unusual and should be checked in the full text before citing.

## A10. Ericsson, Krampe & Tesch-Römer (1993) vs. Macnamara, Hambrick & Oswald (2014)

### Takeaway
**Verdict: the Macnamara numbers are correct; the field is contested.** Deliberate practice explained 26% of performance variance in games, 21% in music, 18% in sports, 4% in education and under 1% in professions. Overall it was ≈12% (r ≈ .35), a figure verified only via secondary reports. Ericsson & Harwell (2019) claim 29% (61% after correction for attenuation) when only studies matching the original definition are used. A direct replication (Macnamara & Maitra 2019) did not reproduce Ericsson's core finding.

### Cited Findings
- Ericsson et al. (1993), Psych Rev 100(3), 363–406: "Individual differences, even among elite performers, are closely related to assessed amounts of deliberate practice. Many characteristics once believed to reflect innate talent are actually the result of intense practice extended for a minimum of 10 years." — [Ericsson et al. 1993](https://doi.org/10.1037/0033-295X.100.3.363)
- Macnamara et al. (2014), Psych Sci 25(8), 1608–1618 (abstract): "deliberate practice explained 26% of the variance in performance for games, 21% for music, 18% for sports, 4% for education, and less than 1% for professions. We conclude that deliberate practice is important, but not as important as has been argued." — [Macnamara et al. 2014](https://doi.org/10.1177/0956797614535810)
- Overall effect: a meta-analytic average r = .35, 95% CI [.30, .39], i.e. ≈12% of variance. Effects were weaker when practice and performance were measured more precisely (logs, standardized measures). These figures come from press releases and secondary quotes, not the paper itself. — [Princeton news 2014](https://www.princeton.edu/news/2014/07/03/becoming-expert-takes-more-practice); [APS press release](https://www.psychologicalscience.org/news/releases/becoming-an-expert-takes-more-than-practice.html)
- Macnamara & Maitra (2019), a double-blind replication of Ericsson et al. (1993): "We did not replicate the core finding that accumulated amounts of deliberate practice corresponded to each skill level… the size of the effect was substantial, but considerably smaller than the original study's effect size." Teacher-designed practice did not explain more variance than practice alone. — [R Soc Open Sci 6(8), 190327](https://doi.org/10.1098/rsos.190327)
- Ericsson & Harwell (2019): "When we analyzed only studies matching the criteria for the original definitions of deliberate or purposeful practice, we found that practice explained considerably more variance in performance (29% and 61% after attenuation) than had been previously reported (14%) by Macnamara, Hambrick, & Oswald (2014, 2018)." — [Front Psychol 10, 2396](https://doi.org/10.3389/fpsyg.2019.02396)
- Hambrick, Macnamara & Oswald (2020) document "critical inconsistencies in the definition of deliberate practice" and shifting standards of evidence. — [Front Psychol 11, 1134](https://doi.org/10.3389/fpsyg.2020.01134)

### Inferences
- Use deliberate practice as a *quality* principle: focused, feedback-rich, just beyond current ability. Do not use it as a claim that the *amount* of practice dominates individual differences; in education the explained variance is only ≈4%.
- Note the 12% (2014 abstract era) vs 14% (as cited by Ericsson & Harwell, covering 2014 and 2018) discrepancy. The report should cite category-level numbers from the 2014 abstract.

### Gaps
- Macnamara 2014 full text not accessed: the overall 12%, the 88-study count, and the 2018 reanalysis (14%) are unverified from the primary source.

## A11. Dunlosky, Rawson, Marsh, Nathan & Willingham (2013): utility ratings

### Takeaway
**Verdict: correct.** Practice testing and distributed practice received the only "high utility" ratings. Elaborative interrogation, self-explanation and interleaving were "moderate". Summarization, highlighting, keyword mnemonic, imagery for text and rereading were "low".

### Cited Findings
- Abstract: "Practice testing and distributed practice received high utility assessments because they benefit learners of different ages and abilities and have been shown to boost students' performance across many criterion tasks and even in educational contexts. Elaborative interrogation, self-explanation, and interleaved practice received moderate utility assessments… Five techniques received a low utility assessment: summarization, highlighting, the keyword mnemonic, imagery use for text learning, and rereading." Published in PSPI 14(1), 4–58. — [Dunlosky et al. 2013](https://doi.org/10.1177/1529100612453266)
- Later classroom meta-analysis: overall testing (quizzing) g = 0.499 across 222 studies and 48,478 students. Moderators include test-format consistency, material matching, corrective feedback and number of repetitions. — [Yang et al. 2021, Psych Bull 147(4), 399–435](https://doi.org/10.1037/bul0000309)
- Practice tests "are more beneficial for learning than restudying and all other comparison conditions". — [Adesope, Trevisan & Sundararajan 2017, RER 87(3), 659–701](https://doi.org/10.3102/0034654316689306)

### Inferences
- The harness's emphasis on retrieval (AI-free recall tasks) and spacing (Fibonacci reviews) rests on the two highest-rated techniques. Self-explanation ("explain in your own words") rests on a moderate-utility technique; see B3 for its meta-analytic effect.

### Gaps
- None.

## A12. Hattie & Timperley (2007); Wisniewski, Zierer & Hattie (2020) feedback effect sizes

### Takeaway
**Verdict: correct if attributed precisely; use the newer estimate.** Hattie & Timperley report an average d = 0.79 from 12 meta-analyses (196 studies, 6,972 effect sizes). Wisniewski et al. re-estimated d = 0.48 [0.44, 0.51], with very high heterogeneity. High-information feedback gave d = 0.99; reinforcement and punishment gave d = 0.24. Kluger & DeNisi (1996) showed that over a third of feedback interventions *reduced* performance.

### Cited Findings
- Hattie & Timperley (2007), RER 77(1), 81–112:
    - At least 12 meta-analyses with specific classroom feedback information (196 studies, 6,972 effect sizes) gave an average effect size of 0.79, about twice the 0.40 average effect of schooling.
    - Lower effects were associated with praise, rewards and punishment.
    - The abstract notes the impact "can be either positive or negative".

    — [Hattie & Timperley 2007 (DOI)](https://doi.org/10.3102/003465430298487); numbers via [uky.edu PDF copy (search-confirmed)](https://www.uky.edu/~gmswan3/575/Hattie_Timperly_2007.pdf)

- Wisniewski et al. (2020), Frontiers in Psychology 10:3087:
    - 435 studies, k = 994 effect sizes, N > 61,000.
    - Initial random-effects d = 0.55 [0.48, 0.62]; after removing 35 extreme values, d = 0.48 [0.44, 0.51]; I² ≈ 83–86%; 17% of effects negative.
    - By outcome: cognitive d = 0.51, motivational d = 0.33, physical d = 0.63, behavioural d = 0.48 (the behavioural CI includes 0).
    - By feedback type: reinforcement/punishment d = 0.24, corrective d = 0.46, high-information d = 0.99.
    - Funnel asymmetry (Egger z = 9.52) came from journal articles.
    - The authors cite 0.79 for Hattie & Timperley (2007) and 0.70 for Hattie (2009).

    — [Wisniewski, Zierer & Hattie 2020](https://doi.org/10.3389/fpsyg.2019.03087)

- Kluger & DeNisi (1996), 607 effect sizes and 23,663 observations: feedback interventions "improved performance on average (d =.41) but… over 1/3 of the FIs decreased performance". Effectiveness "decreases as attention moves up the hierarchy closer to the self and away from the task." — [Psych Bull 119(2), 254–284](https://doi.org/10.1037/0033-2909.119.2.254)

### Inferences
- A hint ladder is a form of graded, task- and process-level feedback. The evidence favours information-rich feedback about the task or strategy (d ≈ 1.0), and is against praise or "self"-level feedback. Signalling what went well should therefore name the specific (micro)skill and strategy, not the person.

### Gaps
- The Hattie & Timperley numbers were confirmed via a search-indexed copy of the PDF, not a fresh read of the full text.

## A13. Wood & Wood (1999) contingent tutoring; Aleven et al. (2003) help seeking; Baker et al. (2004) gaming the system

### Takeaway
**Verdict: all three citations and their core claims are correct.** Two findings from the Wood & Wood full text are directly relevant to "attempt first":

- with prior knowledge controlled, *slower pace and longer time before seeking help* predicted better learning;
- for low-knowledge learners, help seeking was beneficial and errors were harmful.

Baker et al. found that gaming the system predicts post-test scores as strongly as prior knowledge does.

### Cited Findings
- Wood & Wood (1999), Computers & Education 33(2–3), 153–169, using the QUADRATIC algebra tutor with 42 pupils aged 14–15 (two sessions of 30–50 min). The contingency rules:
    - When the learner is "in trouble" the tutor offers help, and gives more explicit help if the learner remains in trouble. "After about three cues of increasing levels of explicitness… the tutor will provide the answer or physically demonstrate the next step."
    - "Whenever the learner succeeds, the level of help is decreased" (fading).
    - QUADRATIC offers help on request at five levels of hint specificity.

    — [Wood & Wood 1999 (DOI)](https://doi.org/10.1016/S0360-1315(99)00030-5); full text via [tlu.ee PDF](https://www.tlu.ee/~kpata/haridustehnoloogiaTLU/tutoring.pdf)

- Wood & Wood (1999), findings (verbatim):
    - "learners with less prior knowledge sought help more often, and were provided with more specific help".
    - "With variance due to prior knowledge partialled out, error frequency (but not help seeking) remained a significant, negative correlate of outcomes… positive learning outcomes were associated with a slower rate of operation… time spent before seeking help. Here too, slower times were associated with better learning outcomes."
    - "For the Low but not the High knowledge group, errors had a significant and negative effect, whereas help seeking was associated with significantly more positive learning outcomes."
    - They also describe one case of apparent "help abuse" (a learner who "sought help continually") who nonetheless achieved one of the largest gains.

    — [Wood & Wood 1999, full text](https://www.tlu.ee/~kpata/haridustehnoloogiaTLU/tutoring.pdf)

- Aleven, Stahl, Schworm, Fischer & Wallace (2003), RER 73(3), 277–320: "although effective help-seeking behavior in ILEs is related to better learning outcomes, learners are not using help facilities effectively". The review covers system-related and student-related factors, and the interaction of metacognitive and cognitive factors. — [Aleven et al. 2003](https://doi.org/10.3102/00346543073003277)
- Baker, Corbett, Koedinger & Wagner (2004), CHI 2004, pp. 383–390:
    - "no other type of off-task behavior is associated nearly so strongly with reduced learning as 'gaming the system'". Gaming frequency "correlates as strongly to post-test score as the student's prior domain knowledge and general academic achievement".
    - Controlling for prior knowledge, frequent gamers "score substantially lower on a post-test".
    - "learned helplessness or performance orientation might be better accounts… than lack of interest."

    — [Baker et al. 2004](https://doi.org/10.1145/985692.985741)

### Inferences
- Wood & Wood empirically support attempt-first with timed escalation. Latency before help-seeking predicted learning independent of prior knowledge, and fading on success is the "contingent shift" the ladder implements.
- Their "help abuse" case warns that heavy help-seeking is not always shallow. Diagnose from outcomes (the post-attempt explanation), not request counts.

### Gaps
- Aleven et al.'s and Baker et al.'s full texts were not accessed for numerical results (e.g., the size of Baker's gaming–post-test correlation).

## A14. Kalyuga, Ayres, Chandler & Sweller (2003) expertise reversal; Renkl & Atkinson (2003) faded worked examples

### Takeaway
**Verdict: both correct**, as published in the same issue of Educational Psychologist 38(1).

### Cited Findings
- Kalyuga et al. (2003), Educational Psychologist 38(1), 23–31: "Instructional techniques that are highly effective with inexperienced learners can lose their effectiveness and even have negative consequences when used with more experienced learners. We call this phenomenon the expertise reversal effect." — [Kalyuga et al. 2003](https://doi.org/10.1207/S15326985EP3801_4)
- Renkl & Atkinson (2003), Educational Psychologist 38(1), 15–22: worked examples are "very effective during the initial stages of cognitive skill acquisition. In later stages, however, solving problems is superior." They propose "a fading procedure in which problem-solving elements are successively integrated into example study until the learners are expected to solve problems on their own." — [Renkl & Atkinson 2003](https://doi.org/10.1207/S15326985EP3801_3)

### Inferences
- The harness's L0→L1→L2 sequence (worked example → completion with TODO gaps → independent work with hints) is a direct implementation of fading. Expertise reversal justifies withdrawing examples and hints at L3/L4.

### Gaps
- None.

## A15. D'Mello, Lehman, Pekrun & Graesser (2014), "Confusion can be beneficial for learning"

### Takeaway
**Verdict: citation correct; design partially verified; the outcome conditions are not verified from the primary source.** Learners held trialogues on scientific reasoning with an animated tutor agent and an animated peer agent. Confusion was induced by agents voicing incorrect or contradictory opinions, after which learners had to decide which opinion had more scientific merit. Self-reported confusion was insensitive to the manipulation, but objective response-based measures detected it. The paper's thesis is that confusion helps "if appropriately induced, regulated, and resolved". I could not access the results section. The commonly reported result, that learning gains appear only for learners actually confused by the contradictions, is unverified here.

### Cited Findings
- Learning and Instruction 29, 153–170 (published online 2012; issue 2014). — [D'Mello et al. 2014 (DOI)](https://doi.org/10.1016/j.learninstruc.2012.05.003)
- Design, from the abstract as excerpted in search results for the ACU research bank record:
    - "Confusion was experimentally induced via a contradictory-information manipulation involving the animated agents expressing incorrect and/or contradictory opinions and asking the (human) learners to decide which opinion had more scientific merit."
    - Self-reports were "largely insensitive to the manipulations", but confusion was "manifested by more objective measures" based on responses immediately after contradictions.

    The page itself returned 403. — [ACU Research Bank record](https://acuresearchbank.acu.edu.au/item/8v7v6/confusion-can-be-beneficial-for-learning)

- The Notre Dame press release on this research lists conditions for productive confusion: "the source of the confusion is closely linked to the content of the learning session, the student attempts to resolve their confusion, and the learning environment provides help when the student struggles." This is secondary. — [EurekAlert release](https://www.eurekalert.org/news-releases/609504); [ScienceDaily](https://sciencedaily.com/releases/2012/06/120620103233.htm)
- A related, earlier contradiction study (Lehman et al., AIED proceedings) reportedly found that contradictions induced confusion "but the contradictions alone did not result in enhanced learning gains". This is from a search-snippet summary only. — [Unpaywall record 10.1007/978-3-642-21869-9_24](https://unpaywall.org/10.1007%2F978-3-642-21869-9_24)

### Inferences
- The defensible claim for the review: confusion is beneficial only when it is task-relevant, the learner works to resolve it, and resolution is supported (scaffolded help). That is compatible with a stuck-timer plus hint-ladder design.
- Avoid citing D'Mello as "confusion helps" without those conditions.

### Gaps
- Results (which tests, effect sizes, and whether gains were limited to confused learners or to resolved confusion) were not verified. The Learning and Instruction full text was not accessible.

## B1. Transfer-appropriate processing, encoding specificity, context-dependent memory, practising under test conditions, and retrieval under stress

### Takeaway
The best-supported principle is **transfer-appropriate processing (TAP)**: memory and skill are best when the processing at practice matches the processing at test. Evidence includes format-matched testing effects and Arthur et al.'s "similar retrieval conditions" moderator. Pure *environmental* context effects are reliable but modest (d ≈ 0.28), are reduced by other cues, and the classic underwater study failed a 2021 replication.

Retrieval practice appears to protect memory against acute stress, though follow-ups are mixed for cued recall and item difficulty. *High-stakes pressure during learning* reduces the benefit of retrieval practice. Stress-exposure training improves later performance under stress and generalises to novel stressors and tasks.

For an AI-free, timed exam in an unfamiliar IDE: practise **retrieval without AI, in the exam IDE, under time limits**, introduced gradually after low-stakes learning.

### Cited Findings
- **TAP.** Morris, Bransford & Franks (1977), JVLVB 16(5), 519–533. Levels of processing were manipulated by acquisition task (semantic vs. rhyme) and type of recognition test. Semantic acquisition beat rhyme acquisition on a standard recognition test. In the standard account of this classic result, rhyme acquisition is *superior* on a rhyming recognition test, i.e., the "depth" advantage depends on the encoding–test match. — [Morris et al. 1977](https://doi.org/10.1016/S0022-5371(77)80016-9). Caveat: the abstract and full text were not retrieved, and the Semantic Scholar machine summary garbles the second half (it says rhyme was "inferior… given a rhyming recognition test"). Verify against the paper before quoting.
- **Encoding specificity.** Tulving & Thomson (1973), Psych Rev 80(5), 352–373. — [Tulving & Thomson 1973](https://doi.org/10.1037/h0020071) (metadata verified)
- **Godden & Baddeley (1975).** Divers learnt word lists on land or underwater: "Lists learnt underwater were best recalled underwater, and vice versa." — [Br J Psychol 66(3), 325–331](https://doi.org/10.1111/j.2044-8295.1975.tb01468.x)
- **Failed replication.** Murre (2021): 16 divers in all four combinations; "Contrary to the original study, we did not find that recall in the same context where the words had been learned was better than recall in the other context." — [Murre 2021, R Soc Open Sci 8(11), 200724](https://doi.org/10.1098/rsos.200724); [PubMed 34760281](https://pubmed.ncbi.nlm.nih.gov/34760281/)
- **Smith & Vela (2001) meta-analysis.**
    - Environmental context effects "were reliable", and noncontextual cues during learning (overshadowing) and at test (outshining), "as well as mental reinstatement of appropriate context cues at test, all reduce the effect".
    - Context-dependent memory "effects are less likely to occur under conditions in which the immediate environment is likely to be suppressed."

    — [Smith & Vela 2001, PBR 8(2), 203–220](https://doi.org/10.3758/BF03196157); [PubMed 11495110](https://pubmed.ncbi.nlm.nih.gov/11495110/)

- **Effect size of Smith & Vela.** Smith et al. (2014) describe it as "overall, reliable, but the effect sizes reported were modest, with a mean effect size of d 0.28". — [Smith, Handy, Angello & Manzano 2014, Memory 22(5), 493–508](https://doi.org/10.1080/09658211.2013.800553); [author PDF](https://people.tamu.edu/~stevesmith/Smithetal2014.pdf)
- **TAP in classroom testing.** Yang et al. (2021): testing g = 0.499, moderated by "test format consistency, material matching"; the authors list transfer-appropriate processing among the supported accounts. — [Psych Bull 147(4)](https://doi.org/10.1037/bul0000309)
- **Transfer of test-enhanced learning.** Pan & Rickard (2018):
    - 192 transfer effect sizes, 122 experiments, N = 10,382; d = 0.40 [0.31, 0.50].
    - Transfer was greatest across test formats and to application/inference questions, and weakest "to problems involving worked examples".
    - After publication-bias correction, the intercepts often indicated "no positive transfer when none of the aforementioned moderators are present". Those moderators are response congruency, elaborated retrieval and initial test performance.

    — [Psych Bull 144(7), 710–756](https://doi.org/10.1037/bul0000151)

- **Similar retrieval conditions.** Using "similar conditions of retrieval at retention" reduced measured skill loss. — [Arthur et al. 1998](https://doi.org/10.1207/s15327043hup1101_3)
- **Retrieval practice and stress.** Smith, Floerke & Thomas (2016): 24 h after learning, stress was induced in half the participants. "Participants who learned by restudying demonstrated the typical stress-related memory impairment, whereas those who learned by retrieval practice were immune to the deleterious effects of stress." — [Science 354(6315), 1046–1048](https://doi.org/10.1126/science.aah5067); [PubMed 27885031](https://pubmed.ncbi.nlm.nih.gov/27885031/)
- **Commentary.** The retrieval-practice group also had better memory overall, so it remains open whether the absent stress effect reflects stronger traces. Stress-retrieval impairments themselves have non-replications. — [Wolf & Kluge 2017, Front Behav Neurosci 11:48](https://doi.org/10.3389/fnbeh.2017.00048)
- **Follow-ups, mixed:**
    - Retrieval practice improved item memory but "did not improve source memory on the post-stress test". — [Smith, Race, Davis & Thomas 2019, Brain Cogn 133](https://doi.org/10.1016/j.bandc.2018.12.005)
    - In cued recall, "stress decreased recall for easy items, but increased recall for difficult items". — [Klier & Buratto 2023, Neurosci Lett 797](https://doi.org/10.1016/j.neulet.2023.137066)
    - The Stress × Difficulty interaction "was not replicated"; stress did not impair retrieval when traces were strengthened by repeated retrieval. — [Klier & Buratto 2026, Front Cognit 5](https://doi.org/10.3389/fcogn.2026.1838176)
    - The forward testing effect was "robust under acute psychosocial encoding/retrieval stress". — [Pastötter et al. 2020, Exp Psychol 67(2)](https://doi.org/10.1027/1618-3169/a000472)
- **Pressure during practice.** Hinze & Rapp (2014): quiz performance was equivalent under high and low stakes, "However, final test performance was better after low-stakes versus high-stakes quizzes, and only low-stakes quizzes led to a performance advantage over a rereading control group." — [Appl Cogn Psychol 28(4), 597–606](https://doi.org/10.1002/acp.3032)
- **Stress training.**
    - Saunders et al. (1996) meta-analysis (37 studies, 70 hypothesis tests, N = 1,837): stress inoculation training was "an effective means for reducing performance anxiety, reducing state anxiety, and enhancing performance under stress". — [J Occup Health Psychol 1(2), 170–186](https://doi.org/10.1037/1076-8998.1.2.170); [PubMed 9547044](https://pubmed.ncbi.nlm.nih.gov/9547044/)
    - Driskell et al. (2001): "the beneficial effects of stress training were retained when participants performed under a novel stressor and performed a novel task." — [Human Factors 43(1), 99–110](https://doi.org/10.1518/001872001775992471)
    - Also relevant, sport psychology (metadata only): [Oudejans & Pijpers 2010, "Training with mild anxiety may prevent choking under higher levels of anxiety", Psychol Sport Exerc 11(1), 44–50](https://doi.org/10.1016/j.psychsport.2009.05.002)
- **Test anxiety (self-report).** Agarwal et al. (2014) surveyed 1,408 students: 92% said retrieval practice helped them learn, and 72% said it made them less nervous for tests and exams. — [JARMAC 3(3), 131–139](https://doi.org/10.1016/j.jarmac.2014.07.002)

### Inferences
- For the student, the gap between practice (AI available, familiar setup) and test (no AI, unfamiliar IDE, time limit) is a TAP mismatch more than a "room context" issue. The IDE is part of the procedural task (creating classes, running tests, navigation, shortcuts), not just background context.
- Recommended sequence:
    1. Learn under low stakes with hints (Hinze & Rapp).
    2. In the final 1–2 weeks, run regular AI-free, timed retrieval sessions in the exam IDE (TAP; Arthur's similar-retrieval moderator). These start mild and work up to full mocks (stress-training evidence).
    3. Use repeated retrieval to make traces stress-robust (Smith et al. 2016; Klier & Buratto 2026).
- Environmental context (room, time of day) is a weak lever: d ≈ 0.28, reduced by other cues, and the classic study did not replicate. It should not be over-weighted in the review.

### Gaps
- I found no study on the cost of exam-IDE unfamiliarity or on practising programming specifically under time pressure. The recommendation is an inference from TAP, skill-decay and stress-training literature.
- The Morris et al. (1977) and Oudejans & Pijpers (2010) abstracts were not retrieved.

## B2. Cognitive forcing functions and over-reliance on AI: implications for "attempt first" and the user-acceptance cost

### Takeaway
Cognitive forcing (deciding before seeing the AI, on-demand AI, or delayed AI) reduces over-reliance compared with simply showing AI explanations. Its costs are lower user ratings and higher perceived complexity, and its benefits go mostly to high-Need-for-Cognition users (Buçinca et al. 2021).

Explanations alone tend to *increase* acceptance of AI advice, right or wrong (Bansal et al. 2021). They reduce over-reliance only when they make verification cheaper than the task itself (Vasconcelos et al. 2023).

Most important for learning: in Gajos & Mamykina (2022), "decide first, then see the AI's answer" improved decisions but produced **no learning**. Only "explanation without the answer, so the learner must reach the answer" produced learning.

Implication: an attempt-first ladder should, as long as possible, deliver *explanations or hints without the answer* and keep the learner responsible for the solution. Expect resistance; students bypass guardrails when given the option.

### Cited Findings
- **Buçinca, Malaya & Gajos (2021), PACM HCI 5(CSCW1), Art. 188.**
    - N = 199. Three cognitive-forcing designs were compared with two simple explainable-AI designs and a no-AI baseline.
    - "Cognitive forcing significantly reduced overreliance compared to the simple explainable AI approaches. However, there was a trade-off: people assigned the least favorable subjective ratings to the designs that reduced the overreliance the most."
    - The interventions "benefited participants higher in Need for Cognition more".

    — [Buçinca et al. 2021](https://doi.org/10.1145/3449287); [arXiv 2102.09692](https://arxiv.org/abs/2102.09692)

- **Buçinca et al. (2021), full-text details.**
    - The three designs:
        - "on demand": the AI suggestion is shown only after clicking.
        - "update": the participant makes "the initial decision without the help of an AI", then sees the AI and can revise.
        - "wait": the AI suggestion is shown after a 30 s "AI is processing" delay.
    - Correct decisions on trials where the AI was wrong:
        - overall: .09 (cognitive forcing) vs .03 (simple explainable AI);
        - carb-source detection: .27 vs .08.
    - Over-reliance:
        - carb-source detection: .48 vs .64 (significant);
        - overall: .26 vs .30 (n.s.).

        The "overall" over-reliance values are read from a pdftotext table and could be confused with the human-error row (.65 vs .68). .26/.30 is the only reading consistent with overall over-reliance being ≤ carb-source over-reliance.

    - On wrong-AI trials the no-AI group did better than both AI groups.
    - Cognitive-forcing systems were rated more complex (2.95 vs 2.64), and trust was lower but not significantly.

    — [arXiv full text](https://arxiv.org/abs/2102.09692)

- **Bansal et al. (2021), CHI.** "While we observed complementary improvements from AI augmentation, they were not increased by explanations. Rather, explanations increased the chance that humans will accept the AI's recommendation, regardless of its correctness." — [Bansal et al. 2021](https://doi.org/10.1145/3411764.3445717)
- **Vasconcelos et al. (2023), PACM HCI 7(CSCW1), Art. 129.**
    - Five studies, N = 731, maze task.
    - People "strategically choose whether or not to engage with an AI explanation". Costs such as task difficulty and explanation difficulty, and benefits such as monetary compensation, "affect overreliance".
    - Null effects of explanations may be "due in part to the explanation not sufficiently reducing the costs of verifying the AI's prediction".

    — [Vasconcelos et al. 2023](https://doi.org/10.1145/3579605)

- **Gajos & Mamykina (2022), IUI.** Three experiments on nutrition decisions:
    - Exp. 1: recommendation plus explanation shown before choosing gave better decisions "but they did not learn".
    - Exp. 2: "participants first made their own choice, and only then saw a recommendation and an explanation from AI; this condition also resulted in improved decisions, but no learning."
    - Exp. 3: "just an AI explanation but no recommendation and had to arrive at their own decision… led to both more accurate decisions and learning gains."

    — [Gajos & Mamykina 2022](https://doi.org/10.1145/3490099.3511138)

- **Bastani et al. (2025), PNAS 122(26), e2422633122.** Field experiment, nearly 1,000 high-school maths students:
    - GPT-4 access improved practice grades by 48% (GPT Base) and 127% (GPT Tutor, prompted with learning safeguards).
    - When access was removed, GPT Base students performed 17% worse than students who never had access.
    - "These negative learning effects are largely mitigated by the safeguards in GPT Tutor. Without guardrails, students attempt to use GPT-4 as a 'crutch'."
    - An erratum was published in PNAS 122(34), e2518204122; its content was not checked.

    — [Bastani et al. 2025](https://doi.org/10.1073/pnas.2422633122); [PubMed 40560616](https://pubmed.ncbi.nlm.nih.gov/40560616/)

- **Kumar, Rothschild, Goldstein & Hofman (2023), preregistered (SSRN preprint).**
    - LLM explanations "positively impacted learning relative to seeing only correct answers, and… benefits were largest for those who attempted problems on their own first before consulting LLM explanations".
    - Incorrect LLM explanations gave gains between the answer-only and correct-explanation conditions.

    — [Kumar et al. 2023](https://doi.org/10.2139/ssrn.4641653)

- **Kazemitabaar et al. (2025), IUI.** Seven "cognitive engagement techniques" for AI-generated code (N = 82 between-subjects; then N = 42 within-subjects). The most effective technique: "guiding learners through the step-by-step problem-solving process, where they engage in an interactive dialog with the AI, prompting what needs to be done at each stage before the corresponding code is revealed." The study also measured each technique's friction and the alignment between perceived and actual ability. — [Kazemitabaar et al. 2025](https://doi.org/10.1145/3708359.3712104)
- **User-acceptance cost, observed in programming.** Kapoor et al. (2025), arXiv preprint; an AI TA with an optional "See Solution" button that disables guardrails:
    - "50% of the 885 students used the 'See Solution' feature for at least one problem and 14% used it for all three problems."
    - "low-performing students were more likely to use this feature and use it close to the deadline."
    - Motives: "assistance in solving problems, time pressure, lack of self-regulation, and curiosity."
    - Overly restrictive guardrails "may lead students to bypass these tools and use unconstrained AI models".

    — [Kapoor et al. 2025, arXiv 2504.11146](https://arxiv.org/abs/2504.11146)

- **Metacognitive-illusion cost.** Students "tended to rate the technique [interleaving] as more difficult and incorrectly believed that they learned less from it". — [Samani & Pan 2021, npj Sci Learn 6:32](https://doi.org/10.1038/s41539-021-00110-x). More generally, performance during training is "often an unreliable index" of learning. — [Soderstrom & Bjork 2015, Perspect Psychol Sci 10(2)](https://doi.org/10.1177/1745691615569000)

### Inferences
- "Attempt first" corresponds to Buçinca's *update* condition. It reduces over-reliance but, per Gajos & Mamykina Exp. 2, is **not sufficient for learning** if the AI then reveals the answer.
- The learning-producing element is withholding the answer while giving explanation, so the learner completes the reasoning (Gajos & Mamykina Exp. 3; Kazemitabaar 2025; Bastani's GPT Tutor). Rungs 1–4 of the hint ladder (Socratic question → concept → pseudocode → analogous small example) fit this. Rung 5 (full solution) is where the learning loss concentrates; logging it as "not succeeded" plus a mandatory explain-back is consistent with the evidence.
- Expected costs and how the design can mitigate them:
    - Lower satisfaction and perceived complexity (Buçinca).
    - Bypassing under time pressure, especially by weaker students near deadlines (Kapoor). This matters for exam crunch time.
    - Benefits concentrated in high-Need-for-Cognition students (Buçinca).
    - Mitigations: explain why the friction exists, keep a logged, time-limited override (the harness already does), scale friction to the skill level, and use the stuck-timer so friction never becomes pure blockage.

### Gaps
- None of these forcing-function studies measured delayed, AI-free exam performance in programming. Bastani (maths) and Shen & Tamkin (see B3) come closest.
- Kapoor (2025) and Kumar (2023) are preprints.

## B3. Interleaved practice and worked examples in programming; predict-then-compare and self-explanation of AI-generated code

### Takeaway
- **Interleaving** has a moderate general effect (g = 0.42), largest when categories are *similar to each other*. I found no randomized interleaved-vs-blocked trial in programming; the best classroom RCT evidence is in physics and maths.
- **Worked examples in programming:** a 2023 review finds established support for subgoal-labelled examples and Parsons puzzles. A semester-long subgoal study improved quizzes, not exams, but reduced drop and fail rates.
- **Self-explanation prompts** give g = .55.
- **Prediction before feedback** improves learning via surprise (Brod et al. 2018), and failed retrieval attempts still help (Kornell et al. 2009).
- **AI-generated code:** in a 2026 RCT, AI users scored 17% lower on a quiz (d = 0.74). However, the "generation-then-comprehension", "hybrid code-explanation" and "conceptual inquiry" usage patterns kept learning high, while delegation patterns did not.

### Cited Findings
- **Interleaving meta-analysis.** Brunmair & Richter (2019): 59 studies, 238 effect sizes, 158 samples.
    - Overall interleaving effect g = 0.42.
    - Paintings g = 0.67; mathematical tasks g = 0.34; expository texts and tastes ambiguous (n.s.); blocking favoured for words, g = −0.39.
    - Stronger effects "for learning material more similar between categories, for learning material less similar within categories, and for more complex learning material."

    — [Psych Bull 145(11), 1029–1052](https://doi.org/10.1037/bul0000209); [PubMed 31556629](https://pubmed.ncbi.nlm.nih.gov/31556629/)

- **Classroom RCT, physics.** Samani & Pan (2021), 8 weeks of interleaved vs. blocked homework in introductory physics: "observed median improvements of 50% on test 1 and 125% on test 2" on surprise tests with novel problems. Students nonetheless believed they learned less. — [npj Sci Learn 6:32](https://doi.org/10.1038/s41539-021-00110-x)
- **Maths.** Rohrer & Taylor (2007), Instructional Science 35(6), 481–498: shuffled (mixed) practice outperformed blocked practice. Details are from the Semantic Scholar summary only. — [Rohrer & Taylor 2007](https://doi.org/10.1007/s11251-007-9015-8)
- **Programming-specific interleaving.** A search found only observational or course-level reports, e.g., a CS1 case study using spaced, interleaved low-stakes quizzes and a correlational Python practice-tool study, with no randomized trial. — [search result: npj/PMC physics study and CS1 reports](https://pmc.ncbi.nlm.nih.gov/articles/PMC8589969/) (programming items not individually verified)
- **Worked examples in programming (review).** Muldner, Jennings & Chiarelli (2023): there is "established work in some areas (e.g., dynamic code-tracing examples in the form of program visualization tools, utility of subgoals in code-generation examples, and incomplete examples in the form of Parsons puzzles)", but "there are also gaps". — [ACM TOCE 23(1), 1–35](https://doi.org/10.1145/3560266)
- **Subgoal labels, semester-long.** Margulieux, Morrison & Decker (2020), 265 students: "Learning subgoals consistently improved performance on quizzes… but not on exams"; the subgoal group had "lower variance in exam scores and fewer students dropped or failed". — [Int J STEM Educ 7:19](https://doi.org/10.1186/s40594-020-00222-7)
- **Mixed subgoal result.** Morrison, Margulieux & Guzdial (2015): "student performance gains did not replicate as expected in the introductory CS task for those who were given subgoal labels." — [ICER 2015](https://doi.org/10.1145/2787622.2787733)
- **Parsons problems.** Ericson, Margulieux & Rick (2017): Parsons problems with distractors "took significantly less time than fixing code with errors or than writing the equivalent code", with "no statistically significant difference in the learning performance, or in student retention of the knowledge one week later." — [Koli Calling 2017](https://doi.org/10.1145/3141880.3141895)
- **Self-explanation (origin).** Chi et al. (1989): "Good" students generate many self-explanations "guided by accurate monitoring", and as a result rely less on examples. — [Cogn Sci 13(2), 145–182](https://doi.org/10.1207/s15516709cog1302_1)
- **Self-explanation meta-analysis.** Bisra et al. (2018): "69 effect sizes (from 64 research reports)… overall weighted mean effect size… g = .55", 95% CI .45–.65, 5,917 participants. Conceptual self-explanation prompts beat metacognitive ones. — [Educ Psychol Rev 30(3), 703–725](https://doi.org/10.1007/s10648-018-9434-x); full text via [gwern mirror](https://www.gwern.net/doc/psychology/spaced-repetition/2018-bisra.pdf)
- **PRIMM (Predict–Run–Investigate–Modify–Make).** Sentance, Waite & Kallia (2019), 13 schools, 493 students aged 11–14, 8–12 weeks: "Learners performed better in the post test than the control group." — [Comput Sci Educ 29(2–3), 136–176](https://doi.org/10.1080/08993408.2019.1608781)
- **Predicting.** Brod, Hasselhorn & Bunge (2018): generating predictions, compared with post-hoc evaluations, "facilitated acquisition"; expectancy-violating outcomes produced surprise "only when a prediction was made beforehand", and the strength of that surprise was related to learning. — [Learn Instr 55, 22–31](https://doi.org/10.1016/j.learninstruc.2018.01.013)
- **Failed attempts.** Kornell, Hays & Bjork (2009): "Unsuccessful retrieval attempts enhanced learning", suggesting "taking challenging tests-instead of avoiding errors-may be one key to effective learning." — [JEP:LMC 35(4), 989–998](https://doi.org/10.1037/a0015729)
- **AI-assisted learning of a new library.** Shen & Tamkin (2026), arXiv preprint; Anthropic research per a blog citing it:
    - Design: 52 developers (26 with AI, 26 without), learning the Python Trio async library in a 35-minute window, with a GPT-4o chat assistant.
    - Quiz result: AI users scored 4.15 points lower on a 27-point quiz ("17% score difference"), Cohen's d = 0.738, p = .010, with no significant speed-up. The largest gap was in debugging questions.
    - Low-scoring patterns (<40%): AI Delegation (n = 4), Progressive AI Reliance (n = 4), Iterative AI Debugging (n = 4).
    - High-scoring patterns (≥65%): Generation-Then-Comprehension (n = 2), Hybrid Code-Explanation (n = 3), Conceptual Inquiry (n = 7).
    - Limitations: about one hour, a single task, chat-based assistant only.

    — [Shen & Tamkin 2026, arXiv 2601.20245](https://arxiv.org/abs/2601.20245); [HTML v2](https://arxiv.org/html/2601.20245v2); [blog noting Anthropic publication](https://doi.org/10.59350/2r50v-yyx82)

- **Novices with code generators (ages 10–17).**
    - Kazemitabaar et al. (2023, Koli Calling), 33 learners: "consistently positive trends between learners' utilization of the Hybrid coding approach and their post-test evaluation scores, while showing consistent negative trends between the AI Single Prompt and the post-test evaluation scores." — [Kazemitabaar et al. 2023](https://doi.org/10.1145/3631802.3631806)
    - Kazemitabaar et al. (2023, CHI), 69 learners: Codex access gave 1.15× completion and 1.8× scores without lowering manual-modification performance, and retention a week later was slightly (n.s.) better. — [CHI 2023](https://doi.org/10.1145/3544548.3580919)
- **Shift toward reading and evaluating LLM code.** "there is now a shift in importance towards reading, comprehending and evaluating LLM-generated code" ("Prompt Problems"). — [Denny et al. 2024, SIGCSE](https://doi.org/10.1145/3626252.3630909)

### Inferences
- For OOD exam preparation, interleave *confusable* categories. Examples: Strategy vs State vs Template Method; composition vs inheritance; interface vs abstract class; which SOLID principle a smell violates. Brunmair & Richter predict the largest gains when between-category similarity is high. Expect the student to feel it is harder and less effective (Samani & Pan).
- For AI-generated code, a "predict-then-compare" routine is well grounded:
    1. Predict the output or behaviour, or write one's own version, before seeing the AI's code (Brod; Kornell; PRIMM).
    2. Self-explain why the AI's code works or differs (Bisra g = .55).
    3. Re-implement from memory later, without AI (testing effect).

    This mirrors the high-scoring "generation-then-comprehension" and "hybrid" patterns, and avoids delegation and iterative AI debugging (Shen & Tamkin; Kazemitabaar).

- Programming-specific caution: subgoal and worked-example gains appeared on near-term quizzes, not exams (Margulieux 2020). Pan & Rickard found the weakest transfer of testing "to problems involving worked examples". Mock exams with novel problems are needed in addition to example study.

### Gaps
- No randomized interleaving trial in programming was found.
- Shen & Tamkin's pattern subgroups are tiny (n = 2–7 per pattern), the study is a preprint, and the outcome was an immediate quiz.
- Several programming-AI studies used children aged 10–17, so generalisation to HBO students is uncertain.

## B4. Help abuse and gaming with LLM tutors (2024–2026)

### Takeaway
The LLM-era analogue of "gaming the system" (Baker et al. 2004) is now documented:

- using the AI as a crutch during practice, which then hurts unassisted performance (Bastani et al. 2025);
- switching off guardrails to get the solution: half of 885 CS1 students did so at least once, especially low performers near deadlines (Kapoor et al. 2025);
- delegation or iterative-AI-debugging patterns that predict low learning (Shen & Tamkin 2026);
- terse "fix my assignment" queries (Sheese et al. 2024).

Guardrailed tutors that withhold code (CodeHelp, CodeAid, GPT Tutor) mitigate the harm, but students value them mainly for quick debugging help. Substitution-style use widens topic coverage but lowers understanding, and LLMs widen the gap between low- and high-prior-knowledge students.

### Cited Findings
- Bastani et al. (2025): "Without guardrails, students attempt to use GPT-4 as a 'crutch' during practice problem sessions, and subsequently perform worse on their own" (−17% for GPT Base once access was removed; largely mitigated by GPT Tutor). — [PNAS 122(26)](https://doi.org/10.1073/pnas.2422633122)
- Kapoor, Diaz, MacNeil, Porter & Denny (2025), arXiv: 50% of 885 students used "See Solution" at least once and 14% on all three problems. Usage was higher among low performers and close to deadlines. Motives were problem-solving help, time pressure, lack of self-regulation and curiosity. — [arXiv 2504.11146](https://arxiv.org/abs/2504.11146)
- Sheese, Liffiton, Savelka & Denny (2024), ACE 2024, n = 52 students, >2,500 queries:
    - "most queries requested immediate help with programming assignments, whereas fewer requests asked for help on related concepts"; students "often provided minimal information".
    - More successful students used the tool more.

    — [Sheese et al. 2024](https://doi.org/10.1145/3636243.3636249)

- Liffiton et al. (2023), CodeHelp: an LLM tool "with guardrails to provide on-demand assistance… without directly revealing solutions". Students in a 12-week deployment (52 students) "especially value its availability and help with resolving errors". — [Koli Calling 2023](https://doi.org/10.1145/3631802.3631830)
- Kazemitabaar et al. (2024), CodeAid: 700 students, 12 weeks, 8,000 usages. Design considerations include "D2) simplifying query formulation while promoting cognitive engagement; D3) avoiding direct responses while encouraging motivated learning". — [CHI 2024](https://doi.org/10.1145/3613904.3642773)
- Prather et al. (2024), "The Widening Gap", 21 lab sessions: for struggling students, GenAI "can compound [metacognitive difficulties] and even introduce new metacognitive difficulties"; they "thought they performed better than they did, and finished with an illusion of competence." — [ICER 2024](https://doi.org/10.1145/3632620.3671116)
- Lehmann, Cornelius & Sting (arXiv v2, 2025): "In two pre-registered and incentivized laboratory experiments, we find no effect of LLMs on overall learning outcomes."
    - Students who substitute (e.g., generating solutions) "increase the volume of topics… but decrease their understanding of each topic".
    - Students who complement (e.g., asking for explanations) "do not increase topic volume but do increase their understanding".
    - "LLMs widen the gap between students with low and high prior knowledge."

    — [arXiv 2409.09047](https://arxiv.org/abs/2409.09047); SSRN version [10.2139/ssrn.4941259](https://doi.org/10.2139/ssrn.4941259)

- Darvishi et al. (2024), RCT with 1,625 students in 10 courses (AI prompts for peer feedback): "students tended to rely on rather than learn from AI assistance". When the AI was removed, self-regulation checklists only partly filled the gap. — [Comput Educ 210, 104967](https://doi.org/10.1016/j.compedu.2023.104967)
- Fan et al. (2025), RCT with 117 university students on a writing task: the ChatGPT group improved essay scores most, "but their knowledge gain and transfer were not significantly different". The authors warn of "metacognitive laziness". — [BJET 56(2), 489–530](https://doi.org/10.1111/bjet.13544)
- Nie et al. (2024), RCT with 5,831 students in an online coding course: positive exam effects for adopters, but "the advertisement of GPT-4 led to a significant average decrease in exam participation", varying by country. — [arXiv 2407.09975](https://arxiv.org/abs/2407.09975)
- Shen & Tamkin (2026): delegation-type patterns scored 24–39%; engaged patterns scored 65–86%. — [arXiv 2601.20245](https://arxiv.org/html/2601.20245v2)
- Classic baseline: gaming the system is as predictive of post-test scores as prior knowledge, and is linked to performance orientation and learned helplessness. — [Baker et al. 2004](https://doi.org/10.1145/985692.985741)

### Inferences
- For this student, the highest-risk moments are time pressure close to the exam and low confidence. Kapoor found both drive guardrail bypass, and Baker links gaming to performance orientation and learned helplessness. A logged override is better than a hard block, because hard blocks push use to unconstrained chatbots where nothing is visible (Kapoor).
- Detection should focus on usage patterns that predict low learning, not raw help counts:
    - repeated requests for code or solutions;
    - AI-iterated debugging without the student's own hypotheses;
    - minimal-information queries.

    Wood & Wood show that high help-seeking can still be productive.

- A "complement, don't substitute" rule (ask for explanations, not solutions) has direct support from Lehmann et al., Kumar et al., Bastani et al. and Gajos & Mamykina.

### Gaps
- No peer-reviewed study was found on automatically *detecting* gaming or jailbreaking in LLM tutors.
- Evidence on long-term (months) learning outcomes is lacking.
- Several key 2025–2026 items (Kapoor; Lehmann; Shen & Tamkin; Nie) are preprints.

## C. Sources checked on 11 November 2026 (explanations and reviews)

Scope: six sources the harness wants to cite for the own-words explanation check, the hint ladder and the fading of prompts. Each subsection tests the one claim the harness wants to make with that source.

Method note: bibliographic data came from Crossref for every DOI. Abstracts came from Crossref, OpenAlex and ERIC records. Full texts were read for:

- Rozenblit & Keil (2002), via the PMC author manuscript;
- Graesser et al. (2004), via the free Springer PDF;
- Nückles et al. (2010) and Koedinger et al. (2015), via copies on university course sites;
- Nye, Graesser & Hu (2014) and Graesser (2016), both open on Springer.

For Koedinger & Aleven (2007) I read the authors' manuscript of February 2007 on a CMU server. Its abstract matches the published abstract (ERIC), but the body text of the final version may differ. For Renkl (1997) only the abstract was available: the Wiley PDF returned 403. Springer article pages redirected to login.

### C1. Rozenblit & Keil (2002), "The misunderstood limits of folk science: An illusion of explanatory depth"

#### Takeaway
**Verdict: correct, with two limits.** People rated their understanding of devices and natural phenomena much lower after they tried to write a step-by-step explanation. Independent raters confirmed that the lower ratings were the accurate ones. Limit 1: the paper has 12 studies, but not all 12 show the effect. Studies 1–6 and 10 show it. Studies 7–9 are comparisons: facts showed a small drop, procedures and narratives none. Studies 11–12 look at causes. Write "in a series of 12 studies", not "in 12 studies". Limit 2: the paper measures self-rated understanding, not learning. It supports "explaining exposes the gap". It does not test whether more follow-up questions lead to more learning.

#### Cited Findings
- Bibliographic data match Crossref: Cognitive Science 26(5), 521–562, September 2002. — [Rozenblit & Keil 2002 (DOI)](https://doi.org/10.1207/s15516709cog2605_1); full text via [PMC author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/)
- Abstract: people "feel they understand complex phenomena with far greater precision, coherence, and depth than they really do". The illusion "is far stronger for explanatory knowledge than many other kinds of knowledge, such as that for facts, procedures or narratives." — [Rozenblit & Keil 2002](https://doi.org/10.1207/s15516709cog2605_1)
- Procedure in Studies 1–4:
    - rate 48 items for understanding (T1);
    - write "a detailed, step-by-step causal explanation" of four of them, then re-rate (T2);
    - answer a "diagnostic" question, such as how to pick a cylinder lock, then re-rate (T3);
    - read an expert explanation, then re-rate the earlier knowledge (T4).

    — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/)

- Results: "Attempts to explain the various phenomena led to a decrease in self-rated understanding. Attempts to answer the diagnostic questions led to a further (non-significant) decrease." Ratings did not rise again after the expert explanation, so participants did not see the diagnostic questions as unfair. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/)
- Study 5: independent raters scored the written explanations. Their scores matched the later self-ratings (T3, T4), not the first one. The authors read the drop as "accurate recalibration of one's knowledge as a result of an effort to explain". — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/)
- Study 6: a warning in advance made the drop smaller, but it stayed significant. In this study the drop after the explanation (T1 to T2) was not significant; the drop after the diagnostic question (T1 to T3) was. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/)
- Study 8 (procedures, such as baking cookies): "there was no drop in the self-ratings across time". Study 9 (movie plots) showed no drop either. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/)
- One proposed cause: "people may confuse knowing labels for parts of a system with a full understanding of how the parts interact." — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/)

#### Inferences
- Supports the explanation check itself. A student's feeling of "I get it" is not reliable for how something works, and a step-by-step explanation shows the gap.
- Follow-up questions get partial support. A targeted diagnostic question exposed gaps that the first explanation did not (Study 6). But the paper does not test "keep asking until the explanation reaches the principle", and it measures no learning. Cite it for why the check exists, not for how many follow-ups to ask.
- The label-versus-mechanism confusion fits programming well. Naming "polymorphism" is not explaining which method runs and why. The check should ask for the mechanism, not the term.
- Procedures showed no illusion. Rote steps, such as IDE shortcuts, may not need an explanation check. How the code works does.

#### Gaps
- Participants were university students. Items were everyday devices and natural phenomena, not programming.
- Studies 11–12 were not checked in detail.

### C2. Renkl (1997), "Learning from worked-out examples: A study on individual differences"

#### Takeaway
**Verdict: supported by the abstract, with care on two points. The DOI is 10.1207/s15516709cog2101_1.** The abstract says that "even when controlling for time-on-task", the quality of self-explanations predicted learning gains. That backs "quality matters, not just time". Point 1: principle-based explanations were one of three helpful features. "Principle-based explainers" were one of two types of successful learners; the other type, "anticipative reasoners", predicted the next step. Point 2: it is a correlational study of 36 students, not an experiment. Safe wording: "the quality of self-explanations, such as naming the underlying principle, predicted learning beyond time on task". Whether time was fixed by design or controlled in the analysis, I could not check.

#### Cited Findings
- Bibliographic: Cognitive Science 21(1), 1–29, January 1997. — [Renkl 1997 (DOI)](https://doi.org/10.1207/s15516709cog2101_1). Crossref also lists an older Elsevier DOI for the same article, 10.1016/S0364-0213(99)80017-2. Use the Wiley DOI above.
- Design (abstract): "36 university freshmen students of education working in individual sessions"; the domain was "probability calculation"; self-explanations were taken from thinking-aloud protocols; a post-test measured learning gains. The study avoided restrictions of former studies, "(e.g., lacking control of time-on-task)". — [Renkl 1997](https://doi.org/10.1207/s15516709cog2101_1)
- Results (abstract): "even when controlling for time-on-task (quantitative aspect), learning gains could be substantially predicted by qualitative differences of self-explanation characteristics." Successful learners "tended to employ more principle-based explanations, more explication of operator-goal combinations, and more anticipative reasoning." There were "two types of effective learners, labeled anticipative reasoners and principle-based explainers." — [Renkl 1997](https://doi.org/10.1207/s15516709cog2101_1)
- Search-result summaries of Renkl's later review say the learning time was fixed for each learner. That review is Renkl (1999), European Journal of Psychology of Education 14(4), 477–488 ([DOI](https://doi.org/10.1007/BF03172974)). I could not open it, so this detail is unverified.

#### Inferences
- Supports judging an explanation on its content (does it name the principle?), not on its length or the time spent.
- There were two routes to success. Predicting the next step before looking is a second, equally supported form of good self-explanation. A check that accepts only principle statements would miss it.
- Correlational, small sample, one domain: treat it as moderate evidence.

#### Gaps
- Full text not read: the coding scheme, the effect sizes and how time was controlled are unverified.

### C3. Nückles, Hübner, Dümer & Renkl (2010), "Expertise reversal effects in writing-to-learn"

#### Takeaway
**Verdict: correct, and the caveat holds.** In Experiment 1, students with prompts wrote better journals and scored higher at mid-term, but lost that lead by the end of the term. In Experiment 2, fading the prompts per student kept cognitive strategies and test scores up. With permanent prompts, scores fell back to the level of a baseline group. The caveat is right: the authors assumed the prompted strategies were already in the students' repertoire. The prompts were meant to trigger strategies students knew but did not use on their own. Two further limits: fading only partly worked, and the samples were small.

#### Cited Findings
- Bibliographic: Instructional Science 38(3), 237–258. Published online 27 August 2009; issue May 2010. — [Nückles et al. 2010 (DOI)](https://doi.org/10.1007/s11251-009-9106-9); full text via a [copy on a university course site](https://www.jsums.edu/english/files/2014/03/nuckles.pdf); abstract also in [ERIC EJ880291](https://eric.ed.gov/?id=EJ880291)
- Experiment 1: 50 first-semester psychology students in two parallel courses wrote 12 weekly journal entries over a 4-month term. One group got six prompts (three cognitive, three metacognitive); the other got none.
    - At mid-term, "the students in the prompting condition achieved clearly higher test scores than the students in the control condition."
    - At the end of the term, "the prompting condition group did not perform any better than the control group without prompts."
    - The control group's use of cognitive strategies rose over the term.

    — [full text](https://www.jsums.edu/english/files/2014/03/nuckles.pdf)

- Experiment 2: 62 students in three courses: faded prompts (n = 20), permanent prompts (n = 25) and a baseline group (n = 17) taught by a different lecturer who did not ask for journals.
    - Fading started at entry 5. A prompt was removed once a student's mean rating for that strategy over the previous two entries reached 4.5 on a 6-point scale. The threshold was set "on practical grounds".
    - Only 13, 20 and 17 students took the final test.
    - The permanent group lost its lead over the baseline group; the faded group kept its level.

    — [full text](https://www.jsums.edu/english/files/2014/03/nuckles.pdf)

- Fading only partly worked. Metacognitive strategies fell "regardless of whether the prompts were adaptively faded-out or presented permanently", and motivation for journal writing fell in both groups. — [full text](https://www.jsums.edu/english/files/2014/03/nuckles.pdf)
- The caveat, in the authors' words: "we assumed that strategies, such as organization and elaboration strategies, would already be part of the students' strategic repertoire." Their explanation of the reversal: "the more the students became skilled in journal writing and knew themselves how to apply the prompted strategies, the more the external guidance by prompts turned into a redundant stimulus". — [full text](https://www.jsums.edu/english/files/2014/03/nuckles.pdf)

#### Inferences
- The diary uses prompted learning protocols (Nückles et al., 2009). This paper says not to show the same prompts all term. Remove a prompt per student once two entries in a row show the strategy, as the paper did.
- The caveat matters for the harness. The paper is about prompts for strategies students already know. For a skill the student does not have yet, such as a new programming concept, the point where help starts to hurt may come later. The paper does not test that.
- Do not claim that fading keeps reflection or motivation up. In this study it did not.

#### Gaps
- Small samples, and whole courses were assigned to conditions. The baseline group had another lecturer.
- The mid-term and end-of-term tests covered different topics, so changes over time within a group cannot be read directly.

### C4. Koedinger, Kim, Jia, McLaughlin & Bier (2015), "Learning is not a spectator sport"

#### Takeaway
**Verdict: correct as stated: correlational, with a causal-model estimate.** In a psychology MOOC, students who did more interactive activities scored higher. A causal search with Tetrad estimated that 1 SD more doing raised quiz scores by 0.44 SD, more than six times the effect of watching or reading (about 0.065 each). Limits: the data are observational and students chose how much to do. "Doing" means activities with feedback and hints, not unsupported practice. Use was counted as activities started, not time. The main outcome was quizzes from the same item banks as the activities; the effect on the final exam runs through the quizzes.

#### Cited Findings
- Bibliographic: Proceedings of the Second (2015) ACM Conference on Learning @ Scale, 111–120. The author order matches Crossref. Crossref lists only the main title; the subtitle "Doing is Better than Watching for Learning from a MOOC" is on the paper itself. — [Koedinger et al. 2015 (DOI)](https://doi.org/10.1145/2724660.2724681); full text via a [copy on a course site](https://davis68.github.io/2016-12-12-ttt-uiuc/files/papers/koedinger-doing-watching-2015.pdf)
- Abstract: "We estimate the learning benefit from extra doing (1 SD increase) to be more than six times that of extra watching or reading. Our data, from a psychology MOOC, is correlational in character, however we employ causal inference mechanisms to lend support for the claim that the associations we find are causal." — [Koedinger et al. 2015](https://doi.org/10.1145/2724660.2724681)
- Sample: 27,720 registered; 9,075 registered for the OLI materials; 939 of those took the final exam. — [full text](https://davis68.github.io/2016-12-12-ttt-uiuc/files/papers/koedinger-doing-watching-2015.pdf)
- Causal model: "a 1 standard deviation increase in doing activities produces 0.44 sd increase in quiz score". Watching and reading had coefficients "of about .065". The model adjusts for pretest score (0.25 to quiz). Quiz score predicts the final exam strongly (0.65). — [full text](https://davis68.github.io/2016-12-12-ttt-uiuc/files/papers/koedinger-doing-watching-2015.pdf)
- Time: students did more activities than they read pages (387 vs. 297) but spent less time on them in total (21.6 vs. 25.0 hours). — [full text](https://davis68.github.io/2016-12-12-ttt-uiuc/files/papers/koedinger-doing-watching-2015.pdf)
- The authors' own caution: data from natural use "adds uncertainty in making inferences about causal relationships as compared to using data from experimental designs." — [full text](https://davis68.github.io/2016-12-12-ttt-uiuc/files/papers/koedinger-doing-watching-2015.pdf)

#### Inferences
- Supports the harness's rule that the student does the work and the AI does not show it. The "doing" in this study was practice with feedback and hints, which is close to the hint ladder.
- Cite it as a large observational study with a causal-model estimate, not as an experiment.

#### Gaps
- Psychology content, not programming. Unmeasured motivation could drive both doing and scores.

### C5. Graesser, Lu, Jackson, Mitchell, Ventura, Olney & Louwerse (2004), "AutoTutor: A tutor with dialogue in natural language"

#### Takeaway
**Verdict: mostly correct. The 2004 paper has the parts; later papers name the full cycle.** The 2004 paper lists all four moves: pump, hint, prompt and assertion. It describes "two cycles of hint→prompt→assertion" that stop as soon as the student states the expected answer. It also describes a pump on the student's first turn when that answer matches poorly. But it presents the fixed cycle as "an alternative algorithm", next to earlier rules that chose a hint or a prompt from the student's ability. The single named "pump → hint → prompt → assertion cycle" appears in Nye, Graesser & Hu (2014) and in Graesser (2016). Cite the 2004 paper for the system and its moves, and Nye et al. (2014) for the cycle.

#### Cited Findings
- Bibliographic: Behavior Research Methods, Instruments, & Computers 36(2), 180–192, May 2004. — [Graesser et al. 2004 (DOI)](https://doi.org/10.3758/BF03195563); full text via the [Springer PDF](https://link.springer.com/content/pdf/10.3758/BF03195563.pdf)
- Moves (abstract): AutoTutor "pumps the student for more information, prompts the student to fill in missing words, gives hints, fills in missing information with assertions". — [Graesser et al. 2004](https://doi.org/10.3758/BF03195563)
- Pump: "a pump arc is traversed when it is the student's first turn and the student's assertion has a low LSA match value." — [full text](https://link.springer.com/content/pdf/10.3758/BF03195563.pdf)
- Cycle: "An alternative algorithm to fleshing out E uses two cycles of hint→prompt→assertion. ... first hint, then prompt, then assert, then hint, then prompt, then assert. AutoTutor exits the two cycles as soon as the student articulates E to satisfaction". The earlier algorithm used fuzzy rules: a prompt when the student lacked one key word, a hint when a high-ability student had missed most of the answer. — [full text](https://link.springer.com/content/pdf/10.3758/BF03195563.pdf)
- Learning gains: about .70 SD on deep comprehension against reading nothing, the pretest or the textbook. Against texts written to match the tutor's content, the effect was only .22. Against human tutors in typed conversation it was .08. — [full text](https://link.springer.com/content/pdf/10.3758/BF03195563.pdf)
- Nye, Graesser & Hu (2014), International Journal of Artificial Intelligence in Education 24(4), 427–469:
    - "AutoTutor attempted to get the student to articulate each expectation by expressing pumps (e.g., 'what else?'), then a hint, then a prompt, and then simply asserting the answer (a bottom out response); this pump → hint → prompt → assertion cycle stopped as soon as the expectation was covered."
    - Good students needed only a pump or hint; lower-ability students needed prompts or the assertion.
    - AutoTutor 2.0 made students restate even a bottom-out assertion before moving on. It "performed comparably" to version 1.1, which simply moved on.

    — [Nye et al. 2014 (DOI)](https://doi.org/10.1007/s40593-014-0029-5), open access

- Graesser (2016), International Journal of Artificial Intelligence in Education 26(1), 124–132: "The pump-hint-prompt-assertion cycles are implemented in AutoTutor (and are frequent in human tutoring...)". — [Graesser 2016 (DOI)](https://doi.org/10.1007/s40593-015-0086-4), open access

#### Inferences
- The harness ladder (question → concept → pseudocode → partial snippet) follows the same logic: start with the move that tells the least, and stop as soon as the student produces the answer.
- "When the student cannot produce it, the tutor states it" is accurate for AutoTutor. But making students restate the answer after that step did not change learning gains in the comparison Nye et al. report. That comparison neither supports nor rules out a "restate after the last rung" rule.
- The 2004 effect sizes are for the whole system. They do not show that the order of the moves is what helps.

#### Gaps
- No study was found that isolates the cycle order as the active part.
- The AutoTutor 1.1 vs. 2.0 comparison comes from Person et al. (2003), which I did not read.

### C6. Koedinger & Aleven (2007), "Exploring the assistance dilemma in experiments with Cognitive Tutors"

#### Takeaway
**Verdict: correct.** The paper names the assistance dilemma: how to balance giving and withholding information or help. It calls this a fundamental open problem and asks for research on when to switch. The studies it reviews give partial answers. Hints that explain the principle seem to help, in one study by making learning faster rather than better. Students are poor at asking for help at the right moment.

#### Cited Findings
- Bibliographic: Educational Psychology Review 19(3), 239–264; online 21 July 2007, issue September 2007. — [Koedinger & Aleven 2007 (DOI)](https://doi.org/10.1007/s10648-007-9049-0)
- Abstract: "How best to achieve this balance remains a fundamental open problem in instructional science. We call this problem the 'assistance dilemma'". The authors stress the need for "specific conditions and parameters that indicate when and to what extent to use information giving versus information withholding". — [ERIC EJ785065](https://eric.ed.gov/?id=EJ785065)
- From the February 2007 manuscript:
    - "The crux of the assistance dilemma is prescribing decision criteria (e.g., conditions and cut-off parameters) for when it is best to switch between information giving (more assistance) and information withholding (less assistance)." Also: "there is not going to be one solution".
    - Anderson, Conrad & Corbett (1989) found that explanatory hint and feedback messages "help students learn faster, but not better".
    - Students "frequently use bottom-out hints to obtain answers, without reading prior hints that explain why", and "even after multiple errors on a step, students often do not request help."
    - Some gaming may be sensible: some students may use bottom-out hints "to create worked-examples for themselves".

    — [manuscript on a CMU server](https://pslcdatashop.web.cmu.edu/KDDCup/FAQ/Koedinger-Aleven-EPR-07.pdf)

#### Inferences
- Supports presenting the ladder's settings (stuck timer, attempt requirement, number of rungs) as choices in an open trade-off, not as proven values. Log them and tune them.
- Students often do not ask for help when they need it. That supports a stuck timer that offers the next rung, instead of waiting for a request.
- Bottom-out use can be productive. That fits logging an override rather than blocking it.

#### Gaps
- I read the manuscript, not the published text. Quotes from the body may differ slightly in the final version. The abstract matches the published one (ERIC).

## D. Sources checked on 11 November 2026, afternoon (help per concept, the open learner model, impasses)

Scope: the sources of the third setup review of 11 November 2026. The harness wants to cite them for logging help per concept, for a proposal for a microskill that the learner confirms, and for asking the explanation about the concept of the highest hint. Two of them (D4, D5) support a point the student did not choose, "stuck without saying so". They are checked anyway, so they are ready if that point comes back.

Method note: bibliographic data came from Crossref and OpenAlex for every DOI. Full texts were read for Bull & Kay (2016, open on Springer), Corbett & Anderson (1992, the companion paper on eScholarship) and Wood & Wood (1999). For the other sources only the abstract was available: Springer, Wiley and Taylor & Francis pages were behind a login. The abstract of Wood & Middleton (1975) and the record of Smit et al. (2025) were checked a second time, separately.

### D1. Corbett & Anderson (1994), "Knowledge tracing: Modeling the acquisition of procedural knowledge"

#### Takeaway
**Verdict: partly correct.** The tutor keeps an estimate per production rule and updates it at each chance to apply that rule. That supports logging evidence per concept. That a *help request* counts as evidence is our own design choice: the texts I read update on the accuracy of the action.

#### Cited Findings
- Bibliographic: User Modeling and User-Adapted Interaction 4(4), 253–278, DOI 10.1007/BF01099821. The publisher dates the issue December 1994. Crossref, OpenAlex and DBLP give 1995, and the paper was revised in March 1995. This review keeps 1994, the publisher's year. — [Crossref](https://api.crossref.org/works/10.1007/BF01099821)
- Abstract: "As the student works, the tutor also maintains an estimate of the probability that the student has learned each of the rules in the ideal model, in a process called knowledge tracing." — [Springer](https://link.springer.com/article/10.1007/BF01099821)
- Companion paper on the same tutor (Corbett & Anderson, 1992): "At each opportunity to apply a rule, the probability that the student knows the rule is updated contingent on the accuracy of the student's action." — [eScholarship](https://escholarship.org/uc/item/0873k1nz)

#### Inferences
- Help about one concept belongs to that concept's rule, not to the skill of the exercise folder. That supports `[rung N #id]` and the event `concept-help`.
- Counting `concept-help` in a success rate would go beyond the paper. The decision to only log and show it for now fits that.

#### Gaps
- I could not read the full 1994 text, so I could not check how help requests enter the update.

### D2. Bull & Kay (2016), "SMILI☺: A framework for interfaces to learning data in open learner models, learning analytics and related fields"

#### Takeaway
**Verdict: partly correct.** The volume is 26, not 29. Open learner models let the learner see the model and sometimes negotiate it, and the paper names reflection and self-regulation as purposes. It is a framework and review: it names these purposes and cites other work, it does not test them.

#### Cited Findings
- Bibliographic: International Journal of Artificial Intelligence in Education 26(1), 293–331, published online 12 January 2016, DOI 10.1007/s40593-015-0090-8. — [Springer PDF](https://link.springer.com/content/pdf/10.1007/s40593-015-0090-8.pdf)
- p. 294: open learner models "allow the user … to view the content of the learner model … in a human-understandable form."
- p. 303, on negotiation: it "has two primary aims: to increase the accuracy of the learner model content through discussion with the user; to promote reflection during the negotiation process."
- p. 308: the open learner model became "an important source of information to prompt self-regulated learning and metacognitive skills".

#### Inferences
- A proposal that the learner accepts or declines ("ja, toevoegen" / "nee") is a negotiated open learner model in the terms of this framework. A text from Claude is not part of the model.
- For an *effect* on self-regulation, cite the empirical work the framework cites, not the framework.

#### Gaps
- None for the record. The paper shows no effect itself.

### D3. VanLehn, Siler, Murray, Yamauchi & Baggett (2003), "Why do only some events cause learning during human tutoring?"

#### Takeaway
**Verdict: correct.** About 125 hours of physics tutoring were analysed. Learning was associated with impasses: outside an impasse, explanations rarely went with learning; at an impasse they sometimes did. It is an association, not an experiment.

#### Cited Findings
- Bibliographic: Cognition and Instruction 21(3), 209–249, DOI 10.1207/S1532690XCI2103_01. — [Crossref](https://api.crossref.org/works/10.1207/S1532690XCI2103_01)
- Abstract: "Successful learning appears to require that the student reach an impasse." "When students were not at an impasse, learning was uncommon regardless of the tutorial explanations employed." "On the other hand, once students were at an impasse, tutorial explanations were sometimes associated with learning." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1207/S1532690XCI2103_01)

#### Inferences
- Asking the explanation about the concept of the highest hint aims it at the point of the impasse.
- A review question about an imagined alternative, without an own attempt or feedback, is not an impasse. Running the alternative (an experiment with `check.mjs`) can make one.
- That the highest hint marks the impasse is our own inference.

#### Gaps
- Full text not reachable, so the coding of impasses and the effect sizes were not checked.

### D4. Beck & Gong (2013), "Wheel-spinning: Students who fail to master a skill"

#### Takeaway
**Verdict: partly correct.** A student who does not master a skill quickly in ASSISTments or the Cognitive Tutor will probably struggle and never master it. That this calls for a different intervention fits the abstract, which discusses changes to tutor design, but I did not read it stated as such.

#### Cited Findings
- Bibliographic: AIED 2013, LNCS 7926, 431–440, DOI 10.1007/978-3-642-39112-5_44. — [Crossref](https://api.crossref.org/works/10.1007/978-3-642-39112-5_44)
- Abstract: "We show that if a student does not master a skill in ASSISTments or the Cognitive Tutor quickly, the student is likely to struggle and will probably never master the skill." — [Springer](https://link.springer.com/chapter/10.1007/978-3-642-39112-5_44)

#### Inferences
- Supports a signal for repeated runs without progress. The student did not choose that point (#24); this is kept for when it comes back.

#### Gaps
- Full text not reachable: the definition of mastery and the prevalence were not checked.

### D5. Wood & Middleton (1975), "A study of assisted problem-solving"; Wood, Wood & Middleton (1978); Smit et al. (2025)

#### Takeaway
**Verdict: partly correct.** The 1975 study observed 12 mothers helping their child assemble a construction toy. Mothers who changed their instructions according to the child's response to earlier help were most likely to see their child do it alone afterwards. That is an observation, not a test of the rule. The rule "more help at once after a failure, less after a success" was used in 1975 to score the mothers (secondary source), and tested in an experiment in 1978. A preregistered direct replication of that experiment did **not** find the effect on the children's independent performance (Smit et al., 2025). The explicit one-level-up, one-level-down rule is in Wood & Wood (1999), which this review already cites.

#### Cited Findings
- Bibliographic: British Journal of Psychology 66(2), 181–191, May 1975, DOI 10.1111/j.2044-8295.1975.tb01454.x. — [Crossref](https://api.crossref.org/works/10.1111/j.2044-8295.1975.tb01454.x)
- Abstract: "Those mothers who systematically changed their instructions on the basis of the child's response to earlier interventions … were most likely to see their child perform effectively after instruction." — [Crossref](https://api.crossref.org/works/10.1111/j.2044-8295.1975.tb01454.x)
- The rule as used in 1975, quoted in a 1991 McGill thesis: "any failure by a child to bring off an action after a given level of help should be met by an immediate increase in help or control, and … after success, the tutor (mother) should offer less help than that which preceded success". — [McGill thesis](https://mcgill.scholaris.ca/server/api/core/bitstreams/a5077c85-730b-47e4-8a2f-3767eb392c6b/content)
- Wood, Wood & Middleton (1978), International Journal of Behavioral Development 1(2), 131–147, DOI 10.1177/016502547800100203: the "contingent approach" was one of four strategies; "The present study largely confirms these predictions." — [Crossref](https://api.crossref.org/works/10.1177/016502547800100203)
- Smit, de Kleijn, Wicherts & van de Pol (2025), Journal of Educational Psychology 117(8), 1313–1329, DOI 10.1037/edu0000965: 285 three-year-olds in four conditions. The authors replicated the tutor accuracy "(68.9% vs. 70% in D. Wood et al., 1978) but failed to replicate the effect of contingent instruction on children's independent performance". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/edu0000965)
- Wood & Wood (1999): "if the system had provided a level 3 hint which the learner followed with a successful move, it would next offer a level 2 hint. If, instead, the learner had requested further help, the system would offer level 4". — [PDF](https://www.tlu.ee/~kpata/haridustehnoloogiaTLU/tutoring.pdf)

#### Inferences
- Do not cite Wood & Middleton (1975) as showing that the rule works. Cite it as the observational origin.
- The failed replication matters beyond #24: the hint ladder (P3) leans on contingent tutoring. That is a question for the next review round, not for this build.

#### Gaps
- No primary text of the 1975 paper (Wiley 403). The coding of help and the rule wording attributed to 1975 come from a secondary source. The 1978 full text was not read.

## E. Sources checked on 11 November 2026, night (scaffolding and contingency)

Scope: after the failed replication in D5, two sources that test whether help should *follow* the learner's successes and failures (contingency), as the hint ladder does (P3). The claim to check: scaffolding helps, but is the contingency itself what helps?

Method note: bibliographic data and abstracts came from OpenAlex and from the research portals of the universities (Penn State for Belland et al.). The full texts were not read: Springer asked for a login, and PMC for a captcha.

### E1. Belland, Walker, Kim & Lefler (2017), "Synthesizing results from empirical research on computer-based scaffolding in STEM education: A meta-analysis"

#### Takeaway
**Verdict: correct, from the abstract.** Computer-based scaffolding had a consistently positive effect on cognitive outcomes (ḡ = 0.46) over 144 experimental studies (333 outcomes). The effect did not vary with whether the scaffolding changed over time (fading or adding), or with the logic of that change.

#### Cited Findings
- Bibliographic: Review of Educational Research 87(2), 309–344, DOI 10.3102/0034654316670999 (online 2016, print 2017). — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.3102/0034654316670999)
- Abstract: "synthesizing the results of 144 experimental studies (333 outcomes)"; a "consistently positive (ḡ = 0.46) effect on cognitive outcomes". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.3102/0034654316670999)
- Abstract: the influence did not vary on the basis of context-specificity, "presence or absence of scaffolding change, and logic by which scaffolding change is implemented". — [Penn State](https://pure.psu.edu/en/publications/synthesizing-results-from-empirical-research-on-computer-based-sc/)

#### Inferences
- Support in steps is well supported. That the support has to change with the learner's performance is not: in this meta-analysis it made no difference.
- A preliminary version (a 2014 poster) did find an advantage for performance-adapted fading/adding. The final analysis did not keep it.

#### Gaps
- Full text not read: the effect sizes per kind of customization were not checked.

### E2. van de Pol, Volman, Oort & Beishuizen (2015), "The effects of scaffolding in the classroom: support contingency and student independent working time in relation to student achievement, task effort and appreciation of support"

#### Takeaway
**Verdict: correct, from the abstract.** A classroom experiment with teachers trained in contingent support. Whether contingent support helped depended on how long the students worked on their own. With little independent working time (frequent help), low-contingent support was better for achievement and task effort. With much independent working time (less frequent help), high-contingent support was better for achievement.

#### Cited Findings
- Bibliographic: Instructional Science 43(5), 615–641, DOI 10.1007/s11251-015-9351-z. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1007/s11251-015-9351-z)
- Abstract: "Low contingent support was more effective in promoting students' achievement and task effort than high contingent support" where independent working time was low; where it was high, high contingent support was more effective for achievement. The effectiveness of scaffolding "depends, among other things, on the independent working time of the groups". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1007/s11251-015-9351-z)
- Design, only from a search summary, not read in the record itself: 30 social studies teachers and 768 students aged 12–15 in pre-vocational education. The open-access record is on the [VU research portal](https://research.vu.nl/en/publications/the-effects-of-scaffolding-in-the-classroom-support-contingency-a/).

#### Inferences
- Contingent help only paid off after a longer period of working alone. That fits "attempt first" and the stuck timer better than help at every step.
- Group work in social studies is far from one learner with a programming exercise. Read it as a direction, not as a parameter.

#### Gaps
- Full text not read: the size of the effects and how contingency was measured were not checked.

## F. Sources checked on 12 November 2026 (positive feedback, demotions, gamification and the phase history)

Scope: the sources behind the setup review of 12 November 2026. They cover positive feedback after a solved task, how a demotion is framed ("extra support"), the progress dashboard with its learning-phases card and level history, and whether to use game elements such as levels, badges and streaks. For each source, the claim as used in the review was checked against the abstract, and against the full text where it could be reached.

Method note: bibliographic data for all 31 DOIs came from Crossref and OpenAlex. Abstracts came from OpenAlex or Crossref for 25 sources, from PubMed for Kirk-Johnson et al., and from ERIC for Mitrovic et al. Long & Aleven came from the Springer page, read in fragments through a fetch tool. For Mekler et al., the abstract was read in the full text. Two abstracts were only reached through secondary copies. For Bai et al., Semantic Scholar has the first half, and a University of Zurich course wiki has the full text. For Hanus & Fox, only search-engine snippets of a library catalogue record were available. Full texts were read for:
- Mitrovic et al.: the accepted manuscript in the University of Canterbury repository;
- Deci et al.: a copy on a University of Washington site;
- Person et al.: a JSTOR scan on TalkBank;
- Chi et al.: a copy on an ASU site;
- Mekler et al.: a copy on a Harvard lab site.

The other full texts were not read. ScienceDirect, ResearchGate and a library catalogue returned 403. The ACM Digital Library and the Coventry repository showed a bot check, and Springer redirected to a login. For Eskreis-Winkler & Fishbach, a search for replications found three later papers. Their abstracts were read on OpenAlex and PubMed.

### F1. Baumeister, Bratslavsky, Finkenauer & Vohs (2001), "Bad is stronger than good"

#### Takeaway
**Verdict: correct, from the abstract.** The abstract says that bad feedback has more impact than good feedback and that bad information is processed more thoroughly. The paper is a broad narrative review across many areas of psychology, and learning processes are one of them.

#### Cited Findings
- Bibliographic: Review of General Psychology 5(4), 323–370, December 2001, DOI 10.1037/1089-2680.5.4.323. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/1089-2680.5.4.323)
- Abstract: "Bad emotions, bad parents, and bad feedback have more impact than good ones, and bad information is processed more thoroughly than good." — [Crossref](https://api.crossref.org/works/10.1037/1089-2680.5.4.323)
- Abstract: the greater power of bad events is found in "everyday events, major life events (e.g., trauma), close relationship outcomes, social network patterns, interpersonal interactions, and learning processes." Also: "Hardly any exceptions (indicating greater power of good) can be found." — [Crossref](https://api.crossref.org/works/10.1037/1089-2680.5.4.323)

#### Inferences
- A demotion will probably weigh more than a promotion of the same size. That supports framing it carefully (one quiet line, "extra support") and making it easy to revert.
- It also supports giving positive feedback more often than negative feedback. The paper gives no ratio, though, and does not test feedback in learning software.

#### Gaps
- Full text not read. Which learning studies it reviews, and how strong the effects are there, was not checked.

### F2. Rewley, Guszcza, Dierst-Davies, Steier, Szwartz & Patel (2021), "Loss Aversion Explains Physical Activity Changes in a Behavioral Gamification Trial"

#### Takeaway
**Verdict: correct, from the abstract. Correct the title.** The reference gives a description, not the title. In a step-count trial with levels that went up and down each week, participants "generally" showed loss aversion when the level at stake had been earned, not when it had been given at the start (endowed).

#### Cited Findings
- Bibliographic: Games for Health Journal 10(6), 430–436, December 2021, DOI 10.1089/g4h.2021.0130. Title as above. — [Crossref](https://api.crossref.org/works/10.1089/g4h.2021.0130)
- Abstract: "We enrolled 602 participants across four arms who were given pedometers. In the three experimental arms, participants began at the medium level and were allocated 70 points each week, losing 10 points each day they did not meet their step goal. Having at least 40 points at the end of the week resulted in a level increase, otherwise they lost a level." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1089/g4h.2021.0130)
- Abstract: "We find that participants in this trial generally exhibit loss aversion so long as the loss relates to something that was earned rather than endowed. This knowledge can be incorporated in future interventions using gamification by requiring participants to earn all levels as they progress." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1089/g4h.2021.0130)

#### Inferences
- In the harness, levels after a promotion are earned, while the first level comes from a placement. If loss aversion attaches to earned levels, losing an earned level will feel like a loss. That can drive effort, and it can also hurt. Both support careful framing of a demotion.
- This is physical activity with weekly points, not learning. It does not test what a demotion does to learning.

#### Gaps
- Full text not read. The comparison on day 7 is within the trial arms. A participant's position before day 7 follows from their own behaviour, so this comparison is not randomized.
- The first reported interval, "18.40% (confidence interval [95% CI]: 18.26–19.90)", is not centred on the estimate. This could not be checked.

### F3. Usher & Pajares (2008), "Sources of Self-Efficacy in School: Critical Review of the Literature and Future Directions"

#### Takeaway
**Verdict: correct, from the abstract, with "typically".** Mastery experience is "typically" the most influential source of self-efficacy. How strong each source is differs by gender, ethnicity, academic ability and academic domain.

#### Cited Findings
- Bibliographic: Review of Educational Research 78(4), 751–796, December 2008, DOI 10.3102/0034654308321456. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.3102/0034654308321456)
- Abstract: "Although mastery experience is typically the most influential source of self-efficacy, the strength and influence of the sources differ as a function of contextual factors such as gender, ethnicity, academic ability, and academic domain." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.3102/0034654308321456)

#### Inferences
- This supports making the learner's own successes visible, for example tasks solved without help and the phase history.
- It is a critical review of mostly correlational, self-report studies. It does not show that showing successes raises self-efficacy.

#### Gaps
- Full text not read. The number of studies reviewed was not checked.

### F4. Byars-Winston, Diestelmann, Savoy & Hoyt (2017), "Unique effects and moderators of effects of sources on self-efficacy: A model-based meta-analysis"

#### Takeaway
**Verdict: correct, from the abstract.** Performance accomplishments (mastery experience) had "by far the strongest unique association" with academic self-efficacy across 61 studies. These are associations between self-reported sources and self-efficacy, not experimental effects.

#### Cited Findings
- Bibliographic: Journal of Counseling Psychology 64(6), 645–658, November 2017, DOI 10.1037/cou0000219. — [Crossref](https://api.crossref.org/works/10.1037/cou0000219)
- Abstract: "In this meta-analysis (k = 61 studies of academic self-efficacy; N = 8,965)"; "PA showed by far the strongest unique association with self-efficacy beliefs." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/cou0000219)
- Abstract: "Subject area was a significant moderator, with sources collectively predicting self-efficacy more strongly in non-STEM (k = 14) compared with STEM (k = 47) subjects (R2 = .37 and .22, respectively)." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/cou0000219)

#### Inferences
- Together with F3, this backs mastery experience as the main source. In STEM, the sources together explained less (R² = .22).

#### Gaps
- Full text not read. The path coefficients per source were not checked.

### F5. Kivetz, Urminsky & Zheng (2006), "The Goal-Gradient Hypothesis Resurrected: Purchase Acceleration, Illusionary Goal Progress, and Customer Retention"

#### Takeaway
**Verdict: correct, from the abstract.** People in a café reward programme and on a song-rating site put in more effort as they got closer to the reward. An illusion of progress (two "bonus" stamps) also sped them up.

#### Cited Findings
- Bibliographic: Journal of Marketing Research 43(1), 39–58, February 2006, DOI 10.1509/jmkr.43.1.39. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1509/jmkr.43.1.39)
- Abstract: "participants in a real café reward program purchase coffee more frequently the closer they are to earning a free coffee". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1509/jmkr.43.1.39)
- Abstract: "the illusion of progress toward the goal induces purchase acceleration (e.g., customers who receive a 12-stamp coffee card with 2 preexisting “bonus” stamps complete the 10 required purchases faster than customers who receive a “regular” 10-stamp card)". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1509/jmkr.43.1.39)
- Abstract: "effort investment is a function of the proportion of original distance remaining to the goal." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1509/jmkr.43.1.39)

#### Inferences
- This supports showing the distance to the next level. The bonus-stamp result shows that the display itself changes behaviour, which is a reason to keep it honest.
- The studies measured purchases and ratings, not learning. More effort near a goal is not the same as more learning.

#### Gaps
- Full text not read.

### F6. Koo & Fishbach (2012), "The Small-Area Hypothesis: Effects of Progress Monitoring on Goal Adherence"

#### Takeaway
**Verdict: correct, from the abstract.** Early in a goal, pointing attention at what is done motivates more than pointing at what remains. Near the goal, it is the other way around. The proposed mechanism is an illusion of fast progress.

#### Cited Findings
- Bibliographic: Journal of Consumer Research 39(3), 493–509, October 2012 (online January 2012), DOI 10.1086/663827. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1086/663827)
- Abstract: "at the beginning of goal pursuit, directing attention to accumulated progress increases goal adherence relative to directing attention to remaining progress (e.g., 20% completed is more impactful than 80% remaining)". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1086/663827)
- Abstract: "with closeness to the goal, directing attention to accumulated progress lessens goal adherence relative to directing attention to remaining progress (e.g., 20% remaining is more impactful than 80% completed; studies 1–2)". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1086/663827)
- Abstract: "The focus on small areas increases motivation by creating an illusion of fast progress (study 3)." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1086/663827)

#### Inferences
- For the progress text towards a level, show what is done when little is done and what remains when little remains, for example "1 of 3 done" early and "1 more" late.
- The studies are consumer and goal-adherence studies, not learning tasks.

#### Gaps
- Full text not read. The samples and settings of the four studies were not checked.

### F7. Harkin, Webb, Chang, Prestwich, Conner, Kellar, Benn & Sheeran (2016), "Does monitoring goal progress promote goal attainment? A meta-analysis of the experimental evidence"

#### Takeaway
**Verdict: correct, from the abstract.** Across 138 randomized studies, interventions that promoted progress monitoring increased goal attainment (d+ = 0.40). Effects were larger when the outcomes were reported or made public, and when the information was physically recorded.

#### Cited Findings
- Bibliographic: Psychological Bulletin 142(2), 198–229, February 2016 (online October 2015), DOI 10.1037/bul0000025. — [Crossref](https://api.crossref.org/works/10.1037/bul0000025)
- Abstract: "A systematic literature search identified 138 studies (N = 19,951) that randomly allocated participants to an intervention designed to promote monitoring of goal progress versus a control condition." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/bul0000025)
- Abstract: the interventions "promoted goal attainment (d+ = 0.40, 95% CI [0.32, 0.48])", and "changes in the frequency of progress monitoring mediated the effect of the interventions on goal attainment." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/bul0000025)
- Abstract: "progress monitoring had larger effects on goal attainment when the outcomes were reported or made public, and when the information was physically recorded." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/bul0000025)

#### Inferences
- This supports the diary and the dashboard as a record of progress.
- "Reported or made public" is not a reason to publish a learner's data. Making data public has privacy costs, and the abstract does not say which kind of reporting drives the effect.

#### Gaps
- Full text not read. How many of the 138 studies concerned learning goals was not checked.

### F8. Villar, Callegaro & Yang (2013), "Where Am I? A Meta-Analysis of Experiments on the Effects of Progress Indicators for Web Surveys"

#### Takeaway
**Verdict: correct, from the abstract.** Across 32 randomized experiments, progress indicators that ran slow at first and fast later (slow-to-fast) increased drop-off. Fast-to-slow indicators reduced it, and a constant indicator did not help significantly.

#### Cited Findings
- Bibliographic: Social Science Computer Review 31(6), 744–762, December 2013 (online August 2013), DOI 10.1177/0894439313497468. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/0894439313497468)
- Abstract: "we analyzed 32 randomized experiments comparing drop-off rates of an experimental group who completed an online survey in which a progress indicator was shown to drop-off rates of a control group to whom the progress indicator was not shown." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/0894439313497468)
- Abstract: "using a constant progress indicator does not significantly help reduce drop-offs"; "Fast-to-slow indicators reduced drop-offs, whereas slow-to-fast indicators increased drop-offs." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/0894439313497468)
- Abstract: "among the studies in which a small incentive was promised, showing a constant progress indicator increased the drop-off rate." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/0894439313497468)

#### Inferences
- A display that shows little progress early, such as one long bar from L0 to L4, may discourage. Progress per level or per skill makes early steps visible.
- Breaking off a survey is not quitting a course, so this is a direction, not a parameter.

#### Gaps
- Full text not read. The effect sizes are not in the abstract.

### F9. Rawson & Dunlosky (2011), "Optimizing schedules of retrieval practice for durable and efficient learning: How much is enough?"

#### Takeaway
**Verdict: the claim is correct, from the abstract. Its use for L4 is only partly supported.** Across 3 experiments (N = 533), relearning sessions reduced the effect of the initial criterion. The authors recommend 3 correct recalls first, then 3 relearning sessions "at widely spaced intervals". The study did not compare more tasks in one session with the same tasks across sessions directly. It did show that after relearning, extra correct recalls in the first session added little.

#### Cited Findings
- Bibliographic: Journal of Experimental Psychology: General 140(3), 283–302, 2011, DOI 10.1037/a0023956. — [Crossref](https://api.crossref.org/works/10.1037/a0023956)
- Abstract: "Across 3 experiments, 533 students learned conceptual material via retrieval practice with restudy. Items were practiced until they were correctly recalled from 1 to 4 times during an initial learning session and were then practiced again to 1 correct recall in 1-5 subsequent relearning sessions". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/a0023956)
- Abstract: "Durability was measured by cued recall and rate of relearning 1-4 months after practice". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/a0023956)
- Abstract: "the effects of initial learning criterion were strong prior to relearning but then diminished as relearning increased. Relearning had pronounced effects on long-term retention with a relatively minimal cost in terms of additional practice trials." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/a0023956)
- Abstract: "our prescriptive conclusion for students is to practice recalling concepts to an initial criterion of 3 correct recalls and then to relearn them 3 times at widely spaced intervals." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/a0023956)

#### Inferences
- The study supports spreading the L4 evidence over separate sessions rather than adding tasks to one session.
- The study used "widely spaced" relearning and tested 1–4 months later. The harness uses about 3 sessions on 2 days, which is much tighter. The material was conceptual and tested by cued recall, not programming.

#### Gaps
- Full text not read. The intervals between relearning sessions were not checked.

### F10. Deci, Koestner & Ryan (1999), "A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation"

#### Takeaway
**Verdict: correct, from the abstract and the full text, with two refinements.**
1. Positive feedback raised free-choice intrinsic motivation for college students (d = 0.43, 14 studies) but not for children (d = 0.11, not significant, 7 studies). "More for college students than children" is therefore an understatement: for children there was no effect on free choice. The overall self-reported d = 0.31 is after removing 3 outliers; with all 24 studies it was 0.36.
2. "Performance-contingent" is a subcategory of expected tangible rewards. It undermined free-choice motivation (d = −0.28) but did not affect self-reported interest.

#### Cited Findings
- Bibliographic: Psychological Bulletin 125(6), 627–668, 1999, DOI 10.1037/0033-2909.125.6.627. — [Crossref](https://api.crossref.org/works/10.1037/0033-2909.125.6.627)
- Abstract: "engagement-contingent, completion-contingent, and performance-contingent rewards significantly undermined free-choice intrinsic motivation (d = -0.40, -0.36, and -0.28, respectively)". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/0033-2909.125.6.627)
- Abstract: "Positive feedback enhanced both free-choice behavior (d = 0.33) and self-reported interest (d = 0.31)." Also: "verbal rewards tended to be less enhancing for children than college students." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/0033-2909.125.6.627)
- Full text: "The 7 studies of verbal-reward effects for children yielded a nonsignificant composite effect size of d = 0.11 (CI = -0.11, 0.34)"; for the 14 college-student effects, "d = 0.43 (CI = 0.27, 0.58)". — [full text, University of Washington copy](https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf)
- Full text: "Symbolic rewards such as "good-player certificates" were considered tangible even though positive feedback was typically implicit in them." Expected tangible rewards "were further coded as task-noncontingent, engagement-contingent, completion-contingent, or performance-contingent". — [full text](https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf)
- Full text: "Performance-contingent rewards did not affect self-reported interest". Self-report: "The composite d = 0.36" for all 24 studies; "d = 0.31" after excluding 3 outliers. — [full text](https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf)

#### Inferences
- Verbal, informational positive feedback fits students in higher education, the age group where it helped.
- Badges and certificates count as tangible (symbolic) rewards in this coding. A badge given for good performance therefore belongs on the undermining side, not on the positive-feedback side.
- These are mostly lab experiments with interesting tasks. The outcome is intrinsic motivation, not learning.

#### Gaps
- The later debate (re-analyses by Cameron and colleagues) was not checked. The full text was a copy of the database HTML on a university site, not the publisher's PDF.

### F11. Henderlong & Lepper (2002), "The effects of praise on children's intrinsic motivation: A review and synthesis"

#### Takeaway
**Verdict: correct, from the abstract. Correct the author name.** The article was published under "Jennifer Henderlong" (Crossref). "Henderlong Corpus" is her later name, as OpenAlex shows, so cite it as Henderlong & Lepper (2002). One nuance: the abstract says competence "without an overreliance on social comparisons", not without any social comparison.

#### Cited Findings
- Bibliographic: Psychological Bulletin 128(5), 774–795, 2002, DOI 10.1037/0033-2909.128.5.774. Authors per Crossref: Jennifer Henderlong, Mark R. Lepper. — [Crossref](https://api.crossref.org/works/10.1037/0033-2909.128.5.774)
- Abstract: "Provided that praise is perceived as sincere, it is particularly beneficial to motivation when it encourages performance attributions to controllable causes, promotes autonomy, enhances competence without an overreliance on social comparisons, and conveys attainable standards and expectations." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/0033-2909.128.5.774)
- Abstract: "The motivational consequences of praise also can be moderated by characteristics of the recipient, such as age, gender, and culture." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/0033-2909.128.5.774)

#### Inferences
- This supports praise that names the strategy or (micro)skill that worked (a controllable cause), never compares with others, and points to an attainable next step.
- The review is about children. Applying it to adult students is an extrapolation, and F10 shows that age matters.

#### Gaps
- Full text not read.

### F12. Mitrovic, Ohlsson & Barrow (2013), "The effect of positive feedback in a constraint-based intelligent tutoring system"

#### Takeaway
**Verdict: correct as a summary, but the evidence is thin (full text read).**
- In SQL-Tutor, students who also got positive feedback reached about the same knowledge (about 10 constraints) in about half the time.
- Only 41 students were analysed. Time on the system was not controlled: students chose how long to use it.
- There was no difference on the course exam.

#### Cited Findings
- Bibliographic: Computers & Education 60(1), 264–272, January 2013 (online July 2012), DOI 10.1016/j.compedu.2012.07.002. — [Crossref](https://api.crossref.org/works/10.1016/j.compedu.2012.07.002)
- Abstract: "Empirical evaluation shows that students who were interacting with the augmented version of SQL-Tutor learned at twice the speed as the students who interacted with the standard, error feedback only, version." — [ERIC](https://eric.ed.gov/?id=EJ1006964)
- Abstract: "We hypothesize that positive feedback works by reducing student uncertainty about tentative but correct problem solving steps." Positive feedback should communicate "(a) those features of the situation that made the action the correct one", "(b) the description of the action at a conceptual level and (c) the important aspect of the change in the problem state brought about by the action." — [ERIC](https://eric.ed.gov/?id=EJ1006964)
- Full text: "Of the remaining 41 students, 18 were assigned to the experimental group, all males, and 23 to the control group, 21 males and 2 females." — [accepted manuscript, University of Canterbury](https://ir.canterbury.ac.nz/handle/10092/7398)
- Full text: "we did not have control over how much time the students spent interacting with the tutoring system"; "the experimental group spent half as much time as the control group, 92.3 minutes as compared to 193.8 minutes"; "the two groups acquired approximately the same amount of knowledge." — [accepted manuscript](https://ir.canterbury.ac.nz/handle/10092/7398)
- Full text: "There is no significant difference in the examination scores." Also: "Our results should not be interpreted as saying that positive feedback is more effective than negative feedback". — [accepted manuscript](https://ir.canterbury.ac.nz/handle/10092/7398)

#### Inferences
- This source is closest to the harness: a tutor for a programming-like language, with error feedback as the baseline.
- It supports adding positive feedback on correct steps when that feedback explains what made the step correct. It does not support generic praise.
- It does not show better learning, only the same learning in less time, in a small sample where students chose how long to practise.

#### Gaps
- The published version was not read. The accepted manuscript says "Mastery was reached in 60% of the time" in one place and "approximately half" in another.
- An earlier conference paper (Barrow et al., ITS 2008) reports a similar result. Whether it uses the same sample was not checked.

### F13. Finkelstein & Fishbach (2012), "Tell Me What I Did Wrong: Experts Seek and Respond to Negative Feedback"

#### Takeaway
**Verdict: correct, from the abstract.** Novices sought and responded to positive feedback, and experts to negative feedback. Positive feedback raised novices' commitment. Negative feedback raised experts' sense that they were not making enough progress.

#### Cited Findings
- Bibliographic: Journal of Consumer Research 39(1), 22–38, June 2012, DOI 10.1086/661934. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1086/661934)
- Abstract: the shift was documented "in a variety of domains, including feedback on language acquisition, pursuit of environmental causes, and use of consumer products." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1086/661934)
- Abstract: "Across these domains, novices sought and responded to positive feedback, and experts sought and responded to negative feedback." Also: "positive feedback increased novices’ commitment, and negative feedback increased experts’ sense that they were making insufficient progress." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1086/661934)

#### Inferences
- This supports more positive feedback at the low levels, and more direct corrective feedback at L3 and L4.
- "Expert" here means more experienced in a domain, such as advanced language students. It was not tested in programming.

#### Gaps
- Full text not read. The number of studies and N are not in the abstract.

### F14. Eskreis-Winkler & Fishbach (2019), "Not Learning From Failure—the Greatest Failure of All"

#### Takeaway
**Verdict: correct as a summary of the paper; contested as a general rule.** In five studies, people learned less from failure feedback than from success feedback that carried the same information, and the authors explain this by ego threat and tuning out. Later work limits the claim:
- Close replications found the effect (Keith et al., 2022; Gok & Fyfe, 2024).
- The effect disappeared when corrective feedback or brief instruction followed the failure.
- A 2025 commentary argues that the core task is confounded with answering consistently (Spiller, 2025).

#### Cited Findings
- Bibliographic: Psychological Science 30(12), 1733–1744, December 2019 (online November 2019), DOI 10.1177/0956797619881133. — [Crossref](https://api.crossref.org/works/10.1177/0956797619881133)
- Abstract: "Yet in five studies (total N = 1,674), failure did the opposite: It undermined learning." Participants "answered binary-choice questions, following which they were told they answered correctly (success feedback) or incorrectly (failure feedback). Both types of feedback conveyed the correct answer, because there were only two answer choices." — [Crossref](https://api.crossref.org/works/10.1177/0956797619881133)
- Abstract: "Failure is ego threatening, which causes people to tune out." Participants "learned just as much from other people’s failure as from others’ success." — [Crossref](https://api.crossref.org/works/10.1177/0956797619881133)
- Keith, Horvath, Klamar & Frese (2022), Journal of Experimental Psychology: General 151(8), e19–e25, DOI 10.1037/xge0001170, two preregistered experiments, N = 520:
    - "The tune-out effect fully replicated in those experimental conditions that represented close replications of the original study".
    - "The effect also disappeared when additional corrective feedback was given (Experiment 2)."

    — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/xge0001170)
- Gok & Fyfe (2024), Journal of Experimental Psychology: General 153(9), 2328–2344, DOI 10.1037/xge0001632, six preregistered experiments, N = 1,306:
    - "When it was a rule-based task and brief instructions on the rule were provided after feedback, there was no evidence of a detrimental effect of failure".
    - "the tune-out reactions to failure during feedback disappear and may even be reversed when subsequent learning opportunities are provided."

    — [PubMed](https://pubmed.ncbi.nlm.nih.gov/39235891/)
- Spiller (2025), Psychological Science 36(11), 874–881, DOI 10.1177/09567976251333666, a commentary: "Because the effect of failure on performance is confounded with consistency, the Script Task is not diagnostic regarding whether people learn less from failure unless consistency is ruled out." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/09567976251333666)

#### Inferences
- The harness follows a failed test with information: the test output and the hint ladder. That is the condition in which the tune-out effect disappeared.
- So this source does not argue against honest failure feedback. It argues for following a failure with a next step, and for framing a demotion as support rather than a verdict on the person.

#### Gaps
- The full texts were not read. Whether the original authors replied to Spiller was not checked.

### F15. Person, Kreuz, Zwaan & Graesser (1995), "Pragmatics and Pedagogy: Conversational Rules and Politeness Strategies May Inhibit Effective Tutoring"

#### Takeaway
**Verdict: correct, from the full text, and hedged ("may").** The authors analyse examples from two tutoring corpora (research methods and algebra). They argue that tutors avoid negative feedback because it threatens the student's face, which "may inhibit" effective tutoring. It is an analysis of examples, not a test of learning.

#### Cited Findings
- Bibliographic: Cognition and Instruction 13(2), 161–188, June 1995, DOI 10.1207/s1532690xci1302_1. Crossref and OpenAlex list the first author as "Natalie K. Pearson", but the article itself has "Natalie K. Person". The reference is right and the metadata has a typo. — [Crossref](https://api.crossref.org/works/10.1207/s1532690xci1302_1)
- Abstract: "We examined two cross-aged tutoring corpora from research methods and algebra tutoring sessions to show how these rules and strategies can potentially enhance and inhibit effective tutoring." Also: "We suggest that politeness strategies are more prevalent in less constrained domains, even though their use may inhibit effective tutoring." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1207/s1532690xci1302_1)
- Full text: "Vague answers on the part of the student are normally met with positive feedback from the tutor rather than negative feedback (Graesser, 1993b)." — [full text, JSTOR scan on TalkBank](https://talkbank.org/class/access/0docs/person1995.pdf)
- Full text: "It seems likely that tutors avoid negative feedback as much as possible, because it is very face threatening for the student. Consequently, this convention of normal conversation may inhibit the effectiveness of the tutoring process." — [full text](https://talkbank.org/class/access/0docs/person1995.pdf)
- Full text, on errors: "Because, by definition, this is a face-threatening act, it seems likely that the politeness strategies will be employed to make the feedback less aversive." — [full text](https://talkbank.org/class/access/0docs/person1995.pdf)

#### Inferences
- A polite AI tutor carries the same risk: positive feedback on vague or wrong answers.
- That supports tying positive feedback to an objective signal, such as green tests in `check.mjs`, rather than to the tutor's judgement in conversation.
- It does not show how much learning the softening costs.

#### Gaps
- The figure that tutors give positive and negative feedback to wrong answers "with roughly equal likelihood" is cited from Graesser (1993b). That source was not checked.

### F16. Chi, Siler, Jeong, Yamauchi & Hausmann (2001), "Learning from human tutoring"

#### Takeaway
**Verdict: correct, from the abstract and the full text, with two limits.**
- The comparison runs across two small studies of 11 students each. The same 11 tutors returned a week later with new students, so this was not a randomized comparison.
- Tutors were told to hold back both explanations and feedback. Their explanations nearly stopped, and their feedback halved.

#### Cited Findings
- Bibliographic: Cognitive Science 25(4), 471–533, July 2001, DOI 10.1207/s15516709cog2504_1. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1207/s15516709cog2504_1)
- Abstract: "tutors were suppressed from giving explanations and feedback. Instead, tutors were encouraged to prompt the students. Surprisingly, students learned just as effectively even when tutors were suppressed from giving explanations and feedback." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1207/s15516709cog2504_1)
- Full text: "Tutors were 11 college students … who had expertise in the domain of the human circulatory system, although they were unskilled tutors." Also: "The students were 11 eighth-graders". — [full text, ASU copy](https://education.asu.edu/sites/default/files/lcl/image3_2.pdf)
- Full text: "The same 11 tutors were asked to return a week later for a second session of tutoring. Each of them tutored a different student". — [full text](https://education.asu.edu/sites/default/files/lcl/image3_2.pdf)
- Full text: "tutors' explanations dropped from 327 in tutoring (Fig. 2) to 7 in prompting (Fig. 7); similarly, tutors' feedback dropped from 94 in tutoring to 44 in prompting." — [full text](https://education.asu.edu/sites/default/files/lcl/image3_2.pdf)

#### Inferences
- This supports content-free prompts ("what do you think?") as a real rung on the hint ladder. Feedback and explanation are not the only active ingredients.
- "Just as effectively" with 11 students per study is weak evidence of equivalence.

#### Gaps
- No formal equivalence test was looked for.

### F17. Soderstrom & Bjork (2015), "Learning Versus Performance: An Integrative Review"

#### Takeaway
**Verdict: correct, from the abstract.** Performance during practice is "often" an unreliable index of learning, and people often misread it as a guide to long-term learning. This source is also cited in B2.

#### Cited Findings
- Bibliographic: Perspectives on Psychological Science 10(2), 176–199, March 2015, DOI 10.1177/1745691615569000. — [Crossref](https://api.crossref.org/works/10.1177/1745691615569000)
- Abstract: "what we can observe and measure is performance, which is often an unreliable index of whether the relatively long-term changes that constitute learning have taken place." Also: "certain manipulations can have opposite effects on learning and performance". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/1745691615569000)
- Abstract: "people often mistakenly interpret their performance during acquisition as a reliable guide to long-term learning." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/1745691615569000)

#### Inferences
- This supports not demoting on one bad session, and asking for evidence on at least 2 days before mastery.
- It also supports telling learners that a hard session is not evidence that they learned less.

#### Gaps
- Full text not read.

### F18. Kirk-Johnson, Galla & Fraundorf (2019), "Perceiving effort as poor learning: The misinterpreted-effort hypothesis of how experienced effort and perceived learning relate to study strategy choice"

#### Takeaway
**Verdict: partly correct.** The first half holds in all three studies: learners who found a strategy more effortful rated it as less effective and chose it less often. "Although it helped memory more" was shown only in Study 3. There it was an association between choosing the more effortful strategy and better long-term retention. The paper also has a fourth study, on whether giving ratings drove the results.

#### Cited Findings
- Bibliographic: Cognitive Psychology 115, article 101237, December 2019 (online August 2019), DOI 10.1016/j.cogpsych.2019.101237. — [Crossref](https://api.crossref.org/works/10.1016/j.cogpsych.2019.101237)
- Abstract: "In three studies, learners experienced a pair of contrasting study strategies (Study 1: interleaved vs. blocked schedule; Studies 2 & 3: retrieval practice vs. restudy) and rated their perceptions of each strategy before choosing one for future use." — [PubMed](https://pubmed.ncbi.nlm.nih.gov/31470194/)
- Abstract: "In all three studies, mediation analysis revealed that participants who perceived a strategy as more effortful rated it as less effective for learning and, in turn, were less likely to choose it for future study." — [PubMed](https://pubmed.ncbi.nlm.nih.gov/31470194/)
- Abstract: "Further, choosing the more effortful strategy was associated with better long-term retention (Study 3), contrary to participants' judgments. A final fourth study suggested that these relationships were not driven by the mere act of providing ratings." — [PubMed](https://pubmed.ncbi.nlm.nih.gov/31470194/)

#### Inferences
- This supports the one-time message at the session start that effort is the goal, not failure.
- It is about how learners judge study strategies, not about feedback or demotions.

#### Gaps
- Full text not read. N per study is not in the abstract.

### F19. de Bruin, Biwer, Hui, Onan, David & Wiradhany (2023), "Worth the Effort: the Start and Stick to Desirable Difficulties (S2D2) Framework"

#### Takeaway
**Verdict: correct, from the abstract. Correct the author list.** The paper has six authors, not four: add Louise David and Wisnu Wiradhany. Learners experience desirable difficulties as high effort and low learning, and resist them. The framework describes how to support them to start and to persist, and it reviews evidence and sets a research agenda.

#### Cited Findings
- Bibliographic: Educational Psychology Review 35(2), article 41, 2023 (online 27 March 2023), DOI 10.1007/s10648-023-09766-w. — [Crossref](https://api.crossref.org/works/10.1007/s10648-023-09766-w)
- Abstract: "Learners often do not appreciate the beneficial effects of desirable difficulties, and the negative experiences of high effort and perceived low learning make them resistant to engage in desirable difficulties (Biwer et al., 2020a)." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1007/s10648-023-09766-w)
- Abstract: the aim is "(1) to describe evidence for the central role of perceived effort and perceived learning in (dis)engagement in desirable difficulties, and (2) to review evidence on, and provide an agenda for research to improve learners’ self-regulated use of desirable difficulties to help them start and persist when learning feels tough, but is actually effective." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1007/s10648-023-09766-w)

#### Inferences
- This supports the effort message and gives it a framework. It does not say which wording works, and part of the proposed support is still a research agenda.

#### Gaps
- The open-access full text was not read (Springer redirected).

### F20. Zepeda, Martin & Butler (2020), "Motivational strategies to engage learners in desirable difficulties"

#### Takeaway
**Verdict: correct, from the abstract.** The paper reviews five levers: finding value, reducing cost, reframing appraisals and attributions, creating appropriate challenges, and providing choice. "Little empirical work yet" is our reading of the authors' "clear need for empirical work". The abstract does not say how much work exists.

#### Cited Findings
- Bibliographic: Journal of Applied Research in Memory and Cognition 9(4), 468–474, December 2020, DOI 10.1016/j.jarmac.2020.08.007. — [Crossref](https://api.crossref.org/works/10.1016/j.jarmac.2020.08.007)
- Abstract: "many learners choose not to use the learning strategies and/or disengage when they are implemented by a teacher." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1016/j.jarmac.2020.08.007)
- Abstract: "five areas of psychological research on motivation that provide strategies for increasing engagement and persistence: finding value, reducing cost, reframing appraisals and attributions, creating appropriate challenges, and providing choice." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1016/j.jarmac.2020.08.007)
- Abstract: "there is a clear need for empirical work to investigate and theoretical frameworks to explain the interplay between motivation and learning strategies that create desirable difficulties." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1016/j.jarmac.2020.08.007)

#### Inferences
- This gives a checklist. The harness already uses some levers: reframing (the effort message, "extra support"), choice (only the learner's "yes, promote" raises a level) and fitting challenge (levels).
- The evidence for each lever comes from general motivation research, not from tests with desirable difficulties.

#### Gaps
- Full text not read.

### F21. Shih & Alexander (2000), "Interacting effects of goal setting and self- or other-referenced feedback on children's development of self-efficacy and cognitive skill within the Taiwanese classroom"

#### Takeaway
**Verdict: correct, from the abstract.** In a randomized study of 84 fourth-graders, self-referenced feedback led to higher fraction skill and self-efficacy than social-referenced feedback, and goal setting had no effect. The social-referenced group became less willing over the sessions and set lower goals over time. The paper uses "social-referenced", not "other-referenced".

#### Cited Findings
- Bibliographic: Journal of Educational Psychology 92(3), 536–543, 2000, DOI 10.1037/0022-0663.92.3.536. — [Crossref](https://api.crossref.org/works/10.1037/0022-0663.92.3.536)
- Abstract: "Eighty-four fourth-grade Taiwanese children were randomly assigned to 1 of 4 treatment groups: goal setting with self-referenced feedback, goal setting with social-referenced feedback, self-referenced feedback only, and social-referenced feedback only." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/0022-0663.92.3.536)
- Abstract: "Children in the self-referenced groups demonstrated significantly higher fraction skill and self-efficacy than did children in the social-referenced groups; goal setting had no effect." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/0022-0663.92.3.536)
- Abstract: "There was a deterioration of social-referenced students' willingness to perform the task over multiple sessions, with this group setting significantly lower goals over time." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1037/0022-0663.92.3.536)

#### Inferences
- This supports the dashboard rule "compare you only with yourself, never with others".
- The participants were children (about 21 per group) learning fractions in Taiwan, so the result reaches students in higher education only by extension.

#### Gaps
- Full text not read. From the abstract alone, it is not clear which groups set goals in each session.

### F22. Aguilar (2018), "Examining the Relationship Between Comparative and Self-Focused Academic Data Visualizations in At-Risk College Students' Academic Motivation"

#### Takeaway
**Verdict: correct, from the abstract, with one addition.** In interviews with 60 at-risk college students, self-focused visualisations drew statements about mastering material. Visualisations with a class average disheartened students "and/or" made them feel accountable to do better. So comparison was not only negative.

#### Cited Findings
- Bibliographic: Journal of Research on Technology in Education 50(1), 84–103, January 2018 (online December 2017), DOI 10.1080/15391523.2017.1401498. — [Crossref](https://api.crossref.org/works/10.1080/15391523.2017.1401498)
- Abstract: the study "utilizes interviews (n = 60) to investigate how students at risk of college failure interpret visualizations of their potential academic achievement." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1080/15391523.2017.1401498)
- Abstract: "visualizations only containing information about students themselves (i.e., self-focused affordances) evoked statements centered on mastering material." Also: "Visualizations containing information about students and a class average (i.e., comparative information), on the other hand, evoked responses that disheartened students and/or made them feel accountable to do better." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1080/15391523.2017.1401498)
- Abstract, design guidelines: "(1) Never assume that more information is better; (2) anticipate and mitigate against potential misinterpretations—or harmful alternative interpretations—of visualizations; and (3) always suggest a way for students to improve." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1080/15391523.2017.1401498)

#### Inferences
- This supports a dashboard that shows only the learner's own data. Guideline 3 (always suggest a way to improve) fits the phase card.
- It is qualitative. It shows how students talk about the graphs, not what the graphs do to their behaviour or learning.

#### Gaps
- Full text not read.

### F23. Long & Aleven (2017), "Enhancing learning outcomes through self-regulated learning support with an Open Learner Model"

#### Takeaway
**Verdict: correct, from the publisher's abstract.** There were two classroom experiments with 302 students in grades 7 and 8. In the first, smaller experiment, the open learner model (OLM) had a main effect on learning. In the second, larger one there was no main effect, but an interaction: students with the OLM learned better when shared control over problem selection was offered.

#### Cited Findings
- Bibliographic: User Modeling and User-Adapted Interaction 27(1), 55–88, March 2017 (online 31 December 2016), DOI 10.1007/s11257-016-9186-6. — [Crossref](https://api.crossref.org/works/10.1007/s11257-016-9186-6)
- Abstract, read in fragments through a fetch tool: "In two classroom experiments with a total of 302 7th- and 8th-grade students, we investigated the effect of (a) an OLM that supports students' self-assessment of their equation-solving skills and (b) shared control over problem selection, on students’ equation-solving abilities, enjoyment of learning with the tutor, …". — [Springer](https://link.springer.com/article/10.1007/s11257-016-9186-6)
- Abstract: "In the first, smaller experiment, the hypothesized main effect of the OLM on students’ learning outcomes was confirmed; we found no main effect of shared control of problem selection, nor an interaction." — [Springer](https://link.springer.com/article/10.1007/s11257-016-9186-6)
- Abstract: "In the second, larger experiment, the hypothesized main effects were not confirmed, but we found an interaction such that the students who had access to the OLM learned significantly better equation-solving skills than their counterparts when shared control over problem selection was offered in the system." — [Springer](https://link.springer.com/article/10.1007/s11257-016-9186-6)
- Abstract: "They suggest that an OLM is especially effective if it is designed to support multiple SRL processes." — [Springer](https://link.springer.com/article/10.1007/s11257-016-9186-6)

#### Inferences
- This supports showing learners their own skill model, with the caveat that the effect did not hold on its own in the larger experiment.
- The harness's form of shared control (the learner confirms a promotion) differs from choosing the difficulty of the next problem.

#### Gaps
- Full text not read. The N per experiment, the effect sizes and exactly what the OLM showed were not checked.

### F24. Kay & Kummerfeld (2012), "Creating personalized systems that people can scrutinize and control: Drivers, principles and experience"

#### Takeaway
**Verdict: correct, from the abstract.** The paper offers design principles for scrutable user models, drawn from twenty years of work on one framework (Personis). It gives principles, not effect sizes. "See why the model believes something" captures the idea; the abstract's words are "understanding and controlling".

#### Cited Findings
- Bibliographic: ACM Transactions on Interactive Intelligent Systems 2(4), 1–42 (pages per Crossref), December 2012, DOI 10.1145/2395123.2395129. — [Crossref](https://api.crossref.org/works/10.1145/2395123.2395129)
- Abstract: "We offer scrutable user models as a foundation for tackling these problems." It presents "design principles and showing how they were established over our twenty years of work on the Personis software framework." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1145/2395123.2395129)
- Abstract: "Our contributions are the set of principles for scrutable personalization linked to our experience from creating and evaluating frameworks and associated applications built upon them." The approach works "by enabling users to scrutinize their user models as a basis for understanding and controlling personalization." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1145/2395123.2395129)

#### Inferences
- This supports showing how each level change was decided in the level history (placement, proposal, by hand, analyst), and letting the learner revert it.
- It is not evidence that scrutability improves learning.

#### Gaps
- Full text not read. The principles themselves were not listed or checked.

### F25. Kaliisa, Misiejuk, López-Pernas, Khalil & Saqr (2024), "Have Learning Analytics Dashboards Lived Up to the Hype? A Systematic Review of Impact on Students' Achievement, Motivation, Participation and Attitude"

#### Takeaway
**Verdict: correct, but incomplete.** Across 38 studies there was no evidence that dashboards improve achievement, and the effects on motivation and attitudes were modest. The claim leaves out the one positive finding: a relatively substantial effect on participation, with medium to large effects in several studies. The authors also note serious design weaknesses in many of the studies.

#### Cited Findings
- Bibliographic: LAK '24, Proceedings of the 14th Learning Analytics and Knowledge Conference, 295–304, March 2024, DOI 10.1145/3636555.3636884. — [Crossref](https://api.crossref.org/works/10.1145/3636555.3636884)
- Abstract: "This systematic review synthesizes the findings of 38 research studies". Also: "there is no evidence to support the conclusion that LADs have lived up to the promise of improving academic achievement. Most studies reported negligible or small effects, with limited evidence from well-powered controlled experiments." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1145/3636555.3636884)
- Abstract: "the impact of LADs on motivation and attitudes appeared modest, with only a few exceptions demonstrating significant effects." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1145/3636555.3636884)
- Abstract: "Notably, LADs showed a relatively substantial impact on student participation. Several studies reported medium to large effect sizes". Also: "Many studies merely compared users and non-users of LADs, confounding the dashboard effect with student engagement levels." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1145/3636555.3636884)

#### Inferences
- Do not present the dashboard as a way to better grades. If it helps, the most likely route is engagement, such as coming back to practise.
- Most dashboards in the review serve whole courses. A personal dashboard for one learner is a different setting.

#### Gaps
- Full text not read. Which kinds of dashboards drove the participation effects was not checked.

### F26. Sailer & Homner (2020), "The Gamification of Learning: a Meta-analysis"

#### Takeaway
**Verdict: correct, from the abstract.** Gamification had small positive effects on cognitive (g = .49), motivational (g = .36) and behavioural (g = .25) learning outcomes. Only the cognitive effect was stable among high-rigour studies. The authors call the other two "less stable", which is softer than "unstable".

#### Cited Findings
- Bibliographic: Educational Psychology Review 32(1), 77–112, March 2020 (online August 2019), DOI 10.1007/s10648-019-09498-w. — [Crossref](https://api.crossref.org/works/10.1007/s10648-019-09498-w)
- Abstract: cognitive "g = .49, 95% CI [0.30, 0.69], k = 19, N = 1686"; motivational "g = .36, 95% CI [0.18, 0.54], k = 16, N = 2246"; behavioural "g = .25, 95% CI [0.04, 0.46], k = 9, N = 951". — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1007/s10648-019-09498-w)
- Abstract: "Whereas the effect of gamification on cognitive learning outcomes was stable in a subsplit analysis of studies employing high methodological rigor, effects on motivational and behavioral outcomes were less stable." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1007/s10648-019-09498-w)
- Abstract: "Inclusion of game fiction and social interaction were significant moderators of the effect of gamification on behavioral learning outcomes." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1007/s10648-019-09498-w)

#### Inferences
- These are average effects over very different gamified designs. They say little about levels alone, or about a single learner without social interaction.

#### Gaps
- Full text not read. The effects per game element were not checked.

### F27. Mekler, Brühlmann, Tuch & Opwis (2017), "Towards understanding the effects of individual gamification elements on intrinsic motivation and performance"

#### Takeaway
**Verdict: correct, from the full text.** With 273 participants, points, levels and leaderboards increased the number of tags produced but not their quality. They had no effect on intrinsic motivation or competence. The task was a single online image-tagging session of about 22 minutes, not a learning task.

#### Cited Findings
- Bibliographic: Computers in Human Behavior 71, 525–534, June 2017 (online September 2015), DOI 10.1016/j.chb.2015.08.048. — [Crossref](https://api.crossref.org/works/10.1016/j.chb.2015.08.048)
- Abstract: "Compared to a control condition, game elements did not significantly affect competence or intrinsic motivation, irrespective of participants' causality orientation." — [full text, copy on a Harvard lab site](https://glassmanlab.seas.harvard.edu/annotated_works/mekler17.pdf)
- Abstract: "points, and especially levels and leaderboard led to a significantly higher amount of tags generated compared to the control group." Also: "points, levels and leaderboards functioned as extrinsic incentives, effective only for promoting performance quantity." — [full text](https://glassmanlab.seas.harvard.edu/annotated_works/mekler17.pdf)
- Full text: "A total of 273 participants"; "participants in the game element conditions did not generate tags of significantly higher quality". Also: "participants took on average around 22 min to complete the study." — [full text](https://glassmanlab.seas.harvard.edu/annotated_works/mekler17.pdf)

#### Inferences
- Levels can push the number of tasks without better work or more intrinsic motivation.
- The harness gates levels on quality evidence (solved without help, own-words explanation), which guards against this.

#### Gaps
- None for the claim. The leaderboard used fictitious participants, which limits what it says about real comparison.

### F28. Landers (2014), "Developing a Theory of Gamified Learning: Linking Serious Games and Gamification of Learning"

#### Takeaway
**Verdict: correct for the mechanism; the second half is our reading.** In this theory, gamification changes learning-related behaviours or attitudes. These then affect learning either by strengthening the link between the quality of the instruction and the outcomes, or directly. "It enhances instruction, it does not replace it" is a fair reading of the moderating path, but these words are not in the abstract. It is a theory paper without data.

#### Cited Findings
- Bibliographic: Simulation & Gaming 45(6), 752–768, December 2014, DOI 10.1177/1046878114563660. — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/1046878114563660)
- Abstract: "gamification is defined as the use of game attributes, as defined by the Bedwell taxonomy, outside the context of a game with the purpose of affecting learning-related behaviors or attitudes." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/1046878114563660)
- Abstract: "These behaviors/attitudes, in turn, influence learning by one or two processes: by strengthening the relationship between instructional design quality and outcomes (a moderating process) and/or by influencing learning directly (a mediating process)." — [OpenAlex](https://api.openalex.org/works/https://doi.org/10.1177/1046878114563660)

#### Inferences
- A game element in the harness should aim at a behaviour that matters, such as returning for a spaced session or explaining in one's own words. It can only help if the instruction behind it is sound.

#### Gaps
- Full text not read.

### F29. Silverman & Barasch (2023), "On or Off Track: How (Broken) Streaks Affect Consumer Decisions"

#### Takeaway
**Verdict: correct, from the abstract, including both extra parts.** Across seven studies, an intact streak led to more later engagement than a broken one. The effect was stronger when people blamed the break on themselves, and weaker when they could "repair" the streak. Note that the comparison is an intact against a broken streak, not a streak against no streak.

#### Cited Findings
- Bibliographic: Journal of Consumer Research 49(6), 1095–1117, issue of 2023 (online 30 June 2022), DOI 10.1093/jcr/ucac029. OpenAlex gives the year as 2022. — [Crossref](https://api.crossref.org/works/10.1093/jcr/ucac029)
- Abstract: streaks are "behaviors performed consecutively three or more times". Also: "In seven studies, we find that intact streaks highlighted via behavioral logs increase consumers’ subsequent engagement in that behavior, relative to when broken streaks are highlighted." — [Crossref](https://api.crossref.org/works/10.1093/jcr/ucac029)
- Abstract: "this effect is independent of actual past behavior and depends solely on how that behavior is represented within the log." — [Crossref](https://api.crossref.org/works/10.1093/jcr/ucac029)
- Abstract: "the effect of intact (vs. broken) logged streaks is amplified when consumers attribute a break in the streak to themselves rather than to external factors, and attenuated when consumers can “repair” a broken streak." — [Crossref](https://api.crossref.org/works/10.1093/jcr/ucac029)

#### Inferences
- If the harness ever shows a streak (for example, days in a row), a broken one may lower engagement, and a repair option softens that.
- Because the effect depends only on how behaviour is shown, the choice of display is itself an intervention.
- The outcomes are consumer behaviours, not learning.

#### Gaps
- Full text not read. Effect sizes were not checked.

### F30. Bai, Hew & Huang (2020), "Does gamification improve student learning outcome? Evidence from a meta-analysis and synthesis of qualitative data in educational contexts"

#### Takeaway
**Verdict: correct, partly from a secondary copy of the abstract.** Thirty interventions from 24 quantitative studies gave an overall g = 0.504 on academic performance. Students liked gamification for enthusiasm, feedback, recognition and goal setting. They disliked it because it adds no utility and can cause anxiety or jealousy. The effect size is from Semantic Scholar's copy of the abstract, which stops right after it. The qualitative part is from a University of Zurich course wiki.

#### Cited Findings
- Bibliographic: Educational Research Review 30, article 100322, June 2020, DOI 10.1016/j.edurev.2020.100322. A secondary page gives volume 33; Crossref says 30. — [Crossref](https://api.crossref.org/works/10.1016/j.edurev.2020.100322)
- Abstract: "This study is a meta-analysis of 30 independent interventions (3,202 participants) drawn from 24 quantitative studies". Also: "The results show an overall significant medium effect size in favor of gamification over learning without gamification (Hedges' g = 0.504, 95% CI [0.284–0.723]". — [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1016/j.edurev.2020.100322?fields=abstract)
- Abstract, secondary copy: "four reasons for learners’ enjoyment of gamification: (a) gamification can foster enthusiasm; (b) gamification can provide feedback on performance; (c) gamification can fulfill learners’ needs for recognition; and (d) gamification can promote goal setting, and two reasons for their dislike of gamification: (a) gamification does not bring additional utility and (b) gamification can cause anxiety or jealousy." — [UZH course wiki](https://www.gbl.uzh.ch/quartz/references/Bai-et-al.-%282020%29)

#### Inferences
- The anxiety and jealousy findings fit the choice of no leaderboard and no comparison with others.
- g ≈ 0.50 is an average over varied designs and is close to Sailer & Homner's cognitive estimate (F26).

#### Gaps
- The publisher's abstract was not reached (ScienceDirect returned 403). The number of qualitative studies (32, per the secondary page) was not seen in the abstract. Full text not read.

### F31. Hanus & Fox (2015), "Assessing the effects of gamification in the classroom: A longitudinal study on intrinsic motivation, social comparison, satisfaction, effort, and academic performance"

#### Takeaway
**Verdict: correct, from a secondary copy of the abstract.** A course with badges and a leaderboard was compared with the same course without them over a 16-week semester. Students in the gamified course showed less motivation, satisfaction and empowerment over time. Their final exam scores were lower, an effect mediated by intrinsic motivation. Two cautions:
- This compares two courses, not randomly assigned students.
- A corrigendum was published in 2018, and I could not read what it corrects.

#### Cited Findings
- Bibliographic: Computers & Education 80, 152–161, January 2015 (online September 2014), DOI 10.1016/j.compedu.2014.08.019. — [Crossref](https://api.crossref.org/works/10.1016/j.compedu.2014.08.019)
- Corrigendum: Computers & Education 127, 298 (December 2018), DOI 10.1016/j.compedu.2018.09.019. It is registered in Crossref as an erratum to this article. — [Crossref](https://api.crossref.org/works/10.1016/j.compedu.2018.09.019)
- Abstract, seen only in search-engine snippets of a library catalogue record (the page itself returned 403):
    - "One course received a gamified curriculum, featuring a leaderboard and badges, whereas the other course received the same curriculum without the gamified elements."
    - "Students were measured at four points during a 16-week semester."
    - "The effect of course type on students' final exam scores was mediated by students' levels of intrinsic motivation, with students in the gamified course showing less motivation and lower final exam scores than the non-gamified class."

    — [catalogue record](https://ersearch2.cvtisr.sk/vufind/SummonRecord/FETCH-LOGICAL-c408t-d82df39d2133f93d47d3d98f9c9aadee3039f9f89021367e6820fad79509cf9e3/Details?lng=en)
- Summary line on a paper-index page (not the abstract): "It was found that students in the gamified course showed less motivation, satisfaction, and empowerment over time than those in the non-gamified class". — [ai.updf.com](https://ai.updf.com/paper-detail/assessing-the-effects-of-gamification-in-the-classroom-a-longitudinal-hanus-fox-dff76a9862467d426113ec530f83942016ae3a97)

#### Inferences
- Badges and a leaderboard over a whole course lowered intrinsic motivation, and through it exam scores. This supports leaving out a leaderboard and being careful with badges (see also F10 on symbolic rewards).
- It is one study of two classes.

#### Gaps
- The publisher's abstract and the full text were not reached: ScienceDirect returned 403, and the ACM Digital Library showed a bot check. The sample of 71 students was seen only in search summaries.
- The content of the 2018 corrigendum is unknown, so whether it changes the results was not checked.

## G. Sources checked on 13 November 2026 (rung 4 in graded work)

Scope: This check tests one decision. In graded work (OER art. 7.11, AI level 1), the hint ladder goes up to rung 4. Rung 4 is a mini code example of at most 5 lines on a different topic, so an analogous problem and not the student's own product. It unlocks only after a visible own attempt or a stuck timer (12 active minutes). After the task, the student explains the principle in their own words (the explanation gate). The AI-use log names the help as "code example (rung 4)". We test rung 4 against Gajos & Mamykina (2022), against the literature on worked examples and hints after an attempt, against two LLM programming assistants that withhold solutions (CodeAid, CodeHelp), and against risk R10 (weaker ownership and memory, Bergh et al. 2026). Nine sources are covered, plus one supporting study inside G2.

Method note: Bibliographic data came from the Crossref API for all DOIs (Gajos & Mamykina, van Gog et al., Coppens et al., Loibl et al., Sinha & Kapur, Koedinger & Aleven, CodeAid, CodeHelp). Bergh et al. has no DOI; its data came from the arXiv API. Shih et al. (EDM 2008) has no DOI; the title and abstract came from the authors' PDF on cmu.edu, and the page range (117-126) came from a search listing, because dblp blocked automated access. Abstracts were taken verbatim from arXiv (Gajos & Mamykina, CodeAid, CodeHelp, Bergh et al.), from Crossref (Sinha & Kapur), from Springer article pages (Loibl et al., Koedinger & Aleven), from the Erasmus University repository record (van Gog et al.) and from the open PDF (Coppens et al., Shih et al.). Full texts read: Gajos & Mamykina (arXiv version), CodeAid (arXiv v2), CodeHelp (arXiv v1), Bergh et al. (arXiv), Shih et al. (author PDF), Coppens et al. (first pages). Not read in full: van Gog et al. (the open-access PDF at research.ou.nl returned an HTML page), Loibl et al., Sinha & Kapur and Koedinger & Aleven (paywalled; abstracts only). Optional question 5 (whether AI-made code examples count as AI-generated content under AI-use declaration policies) was not checked.

### G1. Gajos & Mamykina (2022), "Do People Engage Cognitively with AI? Impact of AI Assistance on Incidental Learning"

#### Takeaway
**Verdict: does not speak against rung 4, but sets a condition.** Learning only happened when people got an explanation and still had to make the decision themselves. Making your own choice first and then seeing the AI answer (the "Update" design) did not produce learning. So "a visible own attempt first" is not enough on its own. A rung-4 example fits the "explanation only" side only if the student still has to do a real transfer step to their own problem.

#### Cited Findings
- Bibliographic: Proceedings of the 27th International Conference on Intelligent User Interfaces (IUI '22), pp. 794-806, DOI 10.1145/3490099.3511138. Evidence grade B (three online experiments plus one replication; n = 251, 268, 221 and 300). — [Crossref](https://api.crossref.org/works/10.1145/3490099.3511138)
- Abstract: "In the first experiment, we found that when people were presented with both a recommendation and an explanation before making their choice, they made better decisions than they did when they received no such help, but they did not learn. In the second experiment, participants first made their own choice, and only then saw a recommendation and an explanation from AI; this condition also resulted in improved decisions, but no learning. However, in our third experiment, participants were presented with just an AI explanation but no recommendation and had to arrive at their own decision. This condition led to both more accurate decisions and learning gains. We hypothesize that learning gains in this condition were due to deeper engagement with explanations needed to arrive at the decisions." — [arXiv](https://arxiv.org/abs/2202.05402)
- Full text, Experiment 2: "Contrary to our expectations, participants did not learn more in the Update condition (M=0.121) than in the Minimal feedback condition (M=0.157, Z=0.71, n.s., r=0.04)." — [arXiv](https://arxiv.org/abs/2202.05402)
- Full text, discussion of the explanation-only condition: "if they wanted to benefit from it, they had to process it carefully enough to infer which decision the explanation supported." — [arXiv](https://arxiv.org/abs/2202.05402)
- Conditions in detail: the task was to choose which of two meals has more of a macronutrient. The "explanation" was one short fact, for example "Avocados are a significant source of fat". Participants came from LabintheWild and Amazon Mechanical Turk. — [arXiv](https://arxiv.org/abs/2202.05402)

#### Inferences
- The paper has no condition with an analogous example on a different problem. So it cannot say directly whether rung 4 is "the answer" or "an explanation without the answer".
- The mechanism the authors propose is that the person must still infer the decision. An analogous example on a different topic keeps that inference step: the student must map the example to their own classes. In that sense rung 4 sits closer to "explanation only" than to "recommendation".
- This holds only if the mapping step is real. If the example has the same structure as the student's own step and only the names differ, the student just renames. Then it works like the "recommendation" condition, and Experiment 2 shows that an earlier own attempt does not rescue learning in that case.
- The explanation gate pushes toward the deeper processing that the authors link to learning. That is in favour of rung 4 as designed.

#### Gaps
- Nutrition decisions by lay adults are far from object-oriented design in C#. The explanations were single facts, not procedures or code.
- Only immediate learning was measured; the authors write "we only measured immediate learning".
- The visual design in Experiment 3 also differed (arrows pointed to the explanation). The authors judge this effect small.

### G2. van Gog, Kester & Paas (2011), "Effects of worked examples, example-problem, and problem-example pairs on novices' learning"

#### Takeaway
**Verdict: supports examples for novices, but warns about "problem first, then example".** Worked examples and example-problem pairs beat problem solving alone. Problem-example pairs (try first, then see the example) did not beat problem solving alone. A later study (Coppens et al. 2019) found the same order effect. This is about planned first-time instruction for novices, not about help after being stuck.

#### Cited Findings
- Bibliographic: Contemporary Educational Psychology, 36(3), 212-218, DOI 10.1016/j.cedpsych.2010.10.004. Evidence grade B (single experiment). — [Crossref](https://api.crossref.org/works/10.1016/j.cedpsych.2010.10.004)
- Abstract: "Based on prior research, it was hypothesized and confirmed that WE and WE-PS would lead to lower cognitive load during learning and higher learning outcomes than PS. In addition, the open questions of whether there would be any differences between WE and WE-PS, and whether there would be any differences between PS-WE and PS were explored. Results showed no differences between WE and WE-PS or between PS-WE and PS. This study can inform instructional designers on which example-based learning strategies to implement: it does not seem necessary to alternate example study and problem solving, but when doing so, example-problem pairs should be used rather than problem-example pairs." — [EUR repository](https://repub.eur.nl/pub/26205)
- Supporting study: Coppens, Hoogerheide, Snippe, Flunger & van Gog (2019), Instructional Science, 47(3), 279-297, DOI 10.1007/s11251-019-09484-3. Abstract: "Studying example–problem pairs was more efficient than studying problem–example pairs, both for gifted and nongifted primary school students." Evidence grade B. — [Crossref](https://api.crossref.org/works/10.1007/s11251-019-09484-3), [open PDF](https://dspace.library.uu.nl/bitstream/handle/1874/384159/Coppens2019_Article_EffectsOfProblemExampleAndExam.pdf?sequence=1)

#### Inferences
- An example is a strong learning tool for novices. That speaks for having a code-example rung at all.
- "Attempt first, then example" was not better than practice alone in this study. The attempt-before-help gate is therefore justified by other reasons (ownership, honesty of the AI-use statement, desirable difficulty), not by this study.
- The 12-minute stuck timer is a sensible exit: the study does not support long struggle before an example.

#### Gaps
- Full text not read (the open PDF link returned HTML). I could not check whether the examples in the pairs were the same task or an isomorphic task.
- Secondary school students and electrical-circuit troubleshooting, not second-year programming students.

### G3. Loibl, Roll & Rummel (2017), "Towards a Theory of When and How Problem Solving Followed by Instruction Supports Learning"

#### Takeaway
**Verdict: supports instruction after an attempt, with a design condition.** Problem solving followed by instruction helps only when the instruction uses contrasting cases or builds on the student's own solution. A generic example given after an attempt is not enough by itself.

#### Cited Findings
- Bibliographic: Educational Psychology Review, 29(4), 693-715, DOI 10.1007/s10648-016-9379-x (online 2016). Evidence grade B (narrative review of experiments, not a meta-analysis). — [Crossref](https://api.crossref.org/works/10.1007/s10648-016-9379-x)
- Abstract: "The review shows that PS-I fosters learning only if specific design features (namely contrasting cases or building instruction on student solutions) are implemented." — [Springer](https://link.springer.com/article/10.1007/s10648-016-9379-x)

#### Inferences
- A rung-4 example works best when the tutor ties it to the student's own attempt. For example: "Here is the pattern in another domain. What is different in your attempt?" That makes the example a contrasting case.
- The explanation gate can ask the student to name the difference between the example and their own code.

#### Gaps
- Full text not read (paywall). The reviewed studies are mostly maths and science concepts, not code.

### G4. Sinha & Kapur (2021), "When Problem Solving Followed by Instruction Works: Evidence for Productive Failure"

#### Takeaway
**Verdict: supports "attempt first, then instruction" in general.** A meta-analysis of 53 studies found a moderate effect in favour of problem solving before instruction. This balances G2. It concerns instruction phases, not 5-line hints.

#### Cited Findings
- Bibliographic: Review of Educational Research, 91(5), 761-798, DOI 10.3102/00346543211019105. Evidence grade A (meta-analysis). — [Crossref](https://api.crossref.org/works/10.3102/00346543211019105)
- Abstract: "we report evidence from a meta-analysis of 53 studies with 166 comparisons that compared PS-I with I-PS design. Our results showed a significant, moderate effect in favor of PS-I (Hedge's g 0.36 [95% confidence interval 0.20; 0.51]). The effects were even stronger (Hedge's g ranging between 0.37 and 0.58) when PS-I was implemented with high fidelity to the principles of Productive Failure (PF), a subset variant of PS-I design." — [Crossref](https://api.crossref.org/works/10.3102/00346543211019105)
- Abstract, limit: "Contrasting trends were, however, observed for younger age learners (second to fifth graders) and for the learning of domain-general skills, for which effect sizes favored I-PS." — [Crossref](https://api.crossref.org/works/10.3102/00346543211019105)

#### Inferences
- The rule "an own attempt before more help" has meta-analytic support for adult learners. Rung 4 after an attempt fits this order.
- Productive Failure means instruction that builds on what students tried. Again this points to tying the example to the student's attempt.

#### Gaps
- Full text not read. Only the Crossref abstract. No data on short code examples or AI tutors.

### G5. Koedinger & Aleven (2007), "Exploring the Assistance Dilemma in Experiments with Cognitive Tutors"

#### Takeaway
**Verdict: unclear by design.** The authors call the balance between giving and withholding help an open problem. The paper gives no rule that would forbid or require a rung-4 example.

#### Cited Findings
- Bibliographic: Educational Psychology Review, 19(3), 239-264, DOI 10.1007/s10648-007-9049-0. Evidence grade B (review of experiments). — [Crossref](https://api.crossref.org/works/10.1007/s10648-007-9049-0)
- Abstract: "How should learning environments balance information or assistance giving and withholding to achieve optimal student learning? How best to achieve this balance remains a fundamental open problem in instructional science. We call this problem the “assistance dilemma” and emphasize the need for further science to yield specific conditions and parameters that indicate when and to what extent to use information giving versus information withholding forms of interaction." — [Springer](https://link.springer.com/article/10.1007/s10648-007-9049-0)

#### Inferences
- The ladder with gates is one concrete answer to this dilemma. The literature does not decide where the top rung should be for graded work. That makes it a value choice for the student, within the exam rules.

#### Gaps
- Full text not read (paywall).

### G6. Shih, Koedinger & Scheines (2008), "A Response Time Model for Bottom-Out Hints as Worked Examples"

#### Takeaway
**Verdict: supports a top rung if the student pauses and thinks about it.** The most concrete hint (one step short of the answer) can work as a worked example. It predicted learning when students spent time thinking about it. Fast clicking through hints did not.

#### Cited Findings
- Bibliographic: Proceedings of the 1st International Conference on Educational Data Mining (EDM 2008), pp. 117-126, no DOI. Evidence grade C (correlational log analysis, 39 students in a geometry tutor). — [author PDF](https://www.cmu.edu/dietrich/philosophy/docs/scheines/Shih_Koedinger_Scheines_2008_EDM.pdf)
- Abstract: "We propose that some examples of this behavior are not abusive and that bottom-out hints can act as worked examples. We create a model for distinguishing good student use of bottom-out hints from bad student use of bottom-out hints by means of logged response times. We show that this model not only predicts learning, but captures behaviors related to self-explanation." — [author PDF](https://www.cmu.edu/dietrich/philosophy/docs/scheines/Shih_Koedinger_Scheines_2008_EDM.pdf)
- Full text: "the bottom-out hint does everything shy of entering the answer." and "Both sets of results show that thinking about bottom-out hints predicts learning." — [author PDF](https://www.cmu.edu/dietrich/philosophy/docs/scheines/Shih_Koedinger_Scheines_2008_EDM.pdf)

#### Inferences
- The bottom-out hint here is the answer for the same step. That is closer to rung 5 than to rung 4. Rung 4 (other topic) gives away less.
- What matters is thinking time and self-explanation after the concrete help. The explanation gate supports this. A short pause or a question about the example before the student goes back to coding fits the finding.

#### Gaps
- Correlation, not experiment. Small sample. Geometry, not programming. Page range from a search listing, because dblp blocked the check.

### G7. Kazemitabaar et al. (2024), "CodeAid: Evaluating a Classroom Deployment of an LLM-based Programming Assistant that Balances Student and Educator Needs"

#### Takeaway
**Verdict: partly supports rung 4.** CodeAid withheld solution code but showed pseudo-code and, in its first version, generic example code. The authors treat generic example code as different from a direct solution. But they suggest showing example code mainly for questions not directly tied to assessments. So rung 4 in graded work goes a bit further than their advice.

#### Cited Findings
- Bibliographic: Proceedings of the CHI Conference on Human Factors in Computing Systems (CHI '24), pp. 1-20, DOI 10.1145/3613904.3642773. Evidence grade C (deployment with 700 students, thematic analysis, interviews). — [Crossref](https://api.crossref.org/works/10.1145/3613904.3642773)
- Abstract: "We developed CodeAid, an LLM-powered programming assistant delivering helpful, technically correct responses, without revealing code solutions. CodeAid answers conceptual questions, generates pseudo-code with line-by-line explanations, and annotates student's incorrect code with fix suggestions. We deployed CodeAid in a programming class of 700 students for a 12-week semester." — [arXiv](https://arxiv.org/abs/2401.11314)
- Full text: "For 24% of queries, it produced pseudo-code, of which 16% were high-level and generic example codes, while 6% were the pseudo-code that implemented a specific behavior. These specific pseudo-codes, although indirect, might have revealed the high-level ideas about implementing a particular behavior that was required in an assignment." — [arXiv](https://arxiv.org/abs/2401.11314)
- Full text: "Furthermore, since code examples are a crucial learning resource [38], future AI assistants can differentiate between example code and direct solutions. [...] Consequently, future tools could be designed to display example code in response to queries not directly related to course assessments." — [arXiv](https://arxiv.org/abs/2401.11314)

#### Inferences
- The line CodeAid draws matches the line between rung 4 (generic example) and rung 5 (solution). It also shows the risk: a specific sketch "might have revealed" the idea that the assignment required.
- The test for a rung-4 example should be: is it generic, or does it implement a behaviour the assignment asks for? Only the first is rung 4.

#### Gaps
- No learning outcome was measured, so we do not know if generic examples helped learning more than pseudo-code alone. The course was C, not C#.

### G8. Liffiton, Sheese, Savelka & Denny (2023), "CodeHelp: Using Large Language Models with Guardrails for Scalable Support in Programming Classes"

#### Takeaway
**Verdict: a stricter line than rung 4.** CodeHelp removes every example code block from its answers. The designers argue that any example code can hand over an assignment's answer. This is a design choice, not a measured result.

#### Cited Findings
- Bibliographic: Proceedings of the 23rd Koli Calling International Conference on Computing Education Research, pp. 1-11, DOI 10.1145/3631802.3631830. Evidence grade C (deployment with 52 students over 12 weeks). — [Crossref](https://api.crossref.org/works/10.1145/3631802.3631830)
- Abstract: "In this paper, we introduce CodeHelp, a novel LLM-powered tool designed with guardrails to provide on-demand assistance to programming students without directly revealing solutions." — [arXiv](https://arxiv.org/abs/2308.06921)
- Full text, a design goal: "Never include complete solutions that the student can copy without thinking or learning." — [arXiv](https://arxiv.org/abs/2308.06921)
- Full text, code-removal prompt: "any example code [...] can give the student an assignment's answer rather than help them figure it out themselves." — [arXiv](https://arxiv.org/abs/2308.06921)

#### Inferences
- A careful tool for graded first-year work sits at rung 3. Rung 4 is a step beyond that.
- The fear in CodeHelp is "example = answer". The rung-4 rules (other topic, at most 5 lines) target exactly that fear. They only work if the "other topic" rule is real and checked.

#### Gaps
- First-year students, Python and data science. No comparison with and without example code, so no evidence that removing code helps learning.

### G9. Bergh, Tag, Vassar & Renzella (2026), "Your Programming Students' Cognition with ChatGPT: Higher Performance, Lower Retention, and Reduced Ownership"

#### Takeaway
**Verdict: confirms R10 for open ChatGPT use; says nothing direct about small examples.** With unrestricted ChatGPT, students scored higher but recalled less and claimed far less of their own code (45% vs 81%). Students could paste the full task into ChatGPT. The authors ask for tools that require active contribution. Rung 4 with an explanation gate is an attempt at that, but it was not tested.

#### Cited Findings
- Bibliographic: arXiv preprint 2609.21194 (submitted 18 September 2026), 17 pages, no DOI, not yet peer reviewed. Evidence grade B (single controlled experiment, 55 students analysed). — [arXiv](https://arxiv.org/abs/2609.21194)
- Abstract: "ChatGPT-assisted students achieved higher coding scores (89% vs. 69%) but lower recall scores immediately (41% vs. 53%) and after 48 hours (39% vs. 52%). There was no significant difference in the loss of recall information over 48 hours between the groups. Self-reported mental effort increased less across tasks in the ChatGPT condition (Holm-adjusted p = .047), and students attributed less of the submitted code to themselves (45% vs. 81%)." — [arXiv](https://arxiv.org/abs/2609.21194)
- Abstract, conclusion: "They motivate the need for assessment practices and AI learning tools that require students to explain, retrieve, and contribute to the work they submit as active participants in their education." — [arXiv](https://arxiv.org/abs/2609.21194)
- Full text, method: "Participants in both conditions were told they could copy and paste any material from the assessment, including the full instructions and the scaffold code, into the application in the assistance panel (ChatGPT/Google)." — [arXiv](https://arxiv.org/abs/2609.21194)
- Full text, design implication: "Systems must support active contribution to preserve ownership." — [arXiv](https://arxiv.org/abs/2609.21194)

#### Inferences
- The ownership loss was measured with full, unrestricted ChatGPT help. A 5-line example on another topic, after an attempt, is a much smaller dose. It is plausible but not shown that ownership stays closer to the no-AI level.
- The explanation gate matches the authors' call to make students "explain, retrieve, and contribute". Retrieval (recalling the principle later without the example) is not in the ladder yet.
- If the student pastes the example and edits it, the code partly stops being their own. If the student types their own version after closing the example, ownership is more likely to stay.

#### Gaps
- Preprint. C programming, short lab tasks, one session. No condition with limited or example-only AI help. I found no study that compares ownership between small examples and full solutions. Schooler & Storm (2021) and Grinschgl (2021) from R10 were not re-checked here.

### G-summary. What the check means for rung 4 in graded work

Rung 4 is supported with conditions. No source tested exactly this case (an analogous example of at most 5 lines after an attempt, with an explanation gate, in graded work), so the evidence is indirect. Gajos & Mamykina (G1) do not speak against rung 4. They speak against help that hands over the decision. They also show that an own attempt first does not save learning if the answer follows. Rung 4 is on the safe side of that line only while the student still has to transfer the example to their own design. Work on examples and on "attempt first, then instruction" (G2 to G6) supports a concrete example after effort, best when it is tied to the student's own attempt and followed by thinking time and self-explanation. LLM tools draw the line at different points: CodeAid allows generic example code (G7), and CodeHelp removes all example code (G8). So rung 4 is a defensible middle choice, not the most careful one. R10 (G9) is real for unrestricted ChatGPT, but there is no evidence that a small, different-topic example causes the same loss of ownership. The explanation gate fits what those authors ask for. Recommendation: keep rung 4, with three small conditions. (1) Isomorphism check: the example must not become part of the student's code by renaming alone. It uses a different domain and must not implement a behaviour the assignment asks for. (2) The student types their own code after reading the example and never pastes it. (3) The explanation gate also asks how the example differs from the student's own attempt (a contrasting case). An optional fourth condition: when rung 4 opens via the stuck timer alone, the tutor first asks for a short written try based on the rung-3 sketch. This advice does not differ from the student's decision to keep rung 4. It only adds safeguards, and the decision stays with the student. Open point: whether a rung-4 code example still counts as "generating ideas or bringing structure" under OER art. 7.11 level 1 is a question for the institution. It was not checked here, and logging it as "code example (rung 4)" is the right transparent step.

## H. Sources checked on 13 November 2026 (secure code as a first niche for juniors)

This check covers the sources of §2.13 of the research and of the section "Secure code next to an AI agent" on the page for junior developers. It has two parts: H1–H16 on the security of AI-generated code and how developers handle it, and H17–H35 on secure coding by developers, junior security roles and the regulatory frame. Each part ends with the corrections it asked for. All of them were applied before publication. Three sources were checked but are not cited in the review: Kudriavtseva et al. (H14), Lam et al. (H22) and ISC2 2025 (H25). The UWV figures (H34) were left out, because the cited page did not contain them. Shen & Tamkin (H16) was already in the references.

Disclosure: the check was done by Claude agents (Claude Opus 5.5, an Anthropic model). One Veracode figure (H15) concerns that model, and Shen & Tamkin (H16) is by Anthropic.

**Part 1 (H1–H16): the security of AI-generated code and AI-assisted developers**

Scope: This check covers the sixteen sources we plan to cite in the literature review section on the security of AI-generated code, how developers (and juniors in particular) handle that code, and what AI help does to skill formation. For each source we checked the authors, year, title, venue and peer-review status, DOI or URL, and every specific claim or number we plan to use. Sixteen sources are covered: five benchmark or code-analysis studies (H1-H6), eight user studies, interview studies or surveys (H7-H14), one vendor report (H15) and one learning experiment (H16).

Method note: Bibliographic data came from the Crossref API for all DOIs: Pearce et al. (10.1109/SP46214.2022.9833571), Majdinasab et al. (10.1109/SANER60148.2024.00051, found through a Crossref bibliographic query), Fu et al. (10.1145/3716848, found the same way), Perry et al. (10.1145/3576915.3623157), Klemmer et al. (10.1145/3658644.3690283, the DOI given on the arXiv record) and Kudriavtseva et al. (10.1145/3672608.3707778). Metadata and abstracts for all arXiv IDs came from the arXiv API (export.arxiv.org), including the earlier versions of 2512.03262 (v1-v3) and 2502.11844 (v1-v2), so we could see how the numbers changed between versions. Venue data for the USENIX papers (Spracklen et al., Sandoval et al., Bappy et al.) came from the USENIX presentation pages and their BibTeX. Venue status for BaxBench and SusVibes came from the PMLR header on the first page of the arXiv PDF. Full texts read and searched: BaxBench (arXiv v3), SusVibes (arXiv v4), Perry et al. (arXiv v3), Sandoval et al. (arXiv v4), Klemmer et al. (arXiv v2), Fu et al. (arXiv v4, searched only), Mousavi et al. (arXiv v1), Jost et al. (arXiv v2), Khalid et al. (arXiv v1), Bappy et al. (arXiv v2), Shen & Tamkin (arXiv v2), and Kudriavtseva et al. (the open-access PDF in the Leiden University repository, CC BY-SA 4.0). The Veracode figures came from Veracode's own blog post and press release, both dated 29 October 2026. Pearce et al., Majdinasab et al. and Spracklen et al. were checked against the abstract only, because the claims are stated there word for word. Note: the arXiv API abstract for Khalid et al. (2609.21020) stops after the first paragraph. The results paragraph appears only in the PDF.

### H1. Pearce, Ahmad, Tan, Dolan-Gavitt & Karri (2022), "Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions"

#### Takeaway
**Verdict: confirmed.** All five authors, the year, the title, the venue, the DOI and the arXiv ID match. The abstract states the ~40% figure for 1,689 programs across 89 scenarios word for word.

#### Cited Findings
- Bibliographic: 2022 IEEE Symposium on Security and Privacy (SP), pp. 754-768, May 2022, DOI 10.1109/SP46214.2022.9833571; arXiv 2108.09293 (v3). Peer-reviewed conference paper. Evidence grade B (systematic benchmark of one tool, with the vulnerability check done by CodeQL plus manual review). — [Crossref](https://api.crossref.org/works/10.1109/SP46214.2022.9833571), [arXiv](https://arxiv.org/abs/2108.09293)
- Abstract: "In total, we produce 89 different scenarios for Copilot to complete, producing 1,689 programs. Of these, we found approximately 40% to be vulnerable." — [arXiv](https://arxiv.org/abs/2108.09293)

#### Inferences
- The scenarios were deliberately built around high-risk CWEs (MITRE "Top 25"). So "40%" is a rate for security-relevant prompts, not for code in general.

#### Gaps
- This was the 2021 Copilot (Codex). Later versions do better (see H2).

### H2. Majdinasab, Bishop, Rasheed, Moradidakhel, Tahir & Khomh (2024), "Assessing the Security of GitHub Copilot's Generated Code - A Targeted Replication Study"

#### Takeaway
**Verdict: confirmed.** The numbers are 36.54% → 27.25%. The 36.54% baseline is the Python part of Pearce et al., not the overall ~40%.

#### Cited Findings
- Bibliographic: 2024 IEEE International Conference on Software Analysis, Evolution and Reengineering (SANER), pp. 435-444, DOI 10.1109/SANER60148.2024.00051; arXiv 2311.11177 (v1 only). Peer-reviewed conference paper. Evidence grade B (replication with newer Copilot and CodeQL versions). — [Crossref](https://api.crossref.org/works/10.1109/SANER60148.2024.00051), [arXiv](https://arxiv.org/abs/2311.11177)
- Abstract: "The replication focused on the presence of security vulnerabilities in Python code. Our results indicate that, even with the improvements in newer versions of Copilot, the percentage of vulnerable code suggestions has reduced from 36.54% to 27.25%." — [arXiv](https://arxiv.org/abs/2311.11177)
- Abstract: "Nonetheless, it remains evident that the model still suggests insecure code." — [arXiv](https://arxiv.org/abs/2311.11177)

#### Inferences
- If the review places this next to H1, it should say that both numbers are for Python only. Otherwise the reader compares 40% (all languages) with 27% (Python).

#### Gaps
- Python only. The C and Verilog scenarios of the original were not replicated.

### H3. Fu, Liang, Tahir, Li, Shahin, Yu & Chen (2025), "Security Weaknesses of Copilot-Generated Code in GitHub Projects: An Empirical Study"

#### Takeaway
**Verdict: confirmed.** 29.5% (Python), 24.2% (JavaScript), 43 CWE categories and "up to 55.5%" fixed by Copilot Chat are all stated in the abstract. One nuance: the 733 snippets also include code from CodeWhisperer and Codeium, not only Copilot.

#### Cited Findings
- Bibliographic: ACM Transactions on Software Engineering and Methodology 34(8), article pp. 1-34, published online 6 October 2025, DOI 10.1145/3716848; arXiv 2310.02059 (v4, "Preprint accepted for publication in ACM Transactions on Software Engineering and Methodology (TOSEM), 2025"). Peer-reviewed journal. Evidence grade B (static analysis of code found in the wild). — [Crossref](https://api.crossref.org/works/10.1145/3716848), [arXiv](https://arxiv.org/abs/2310.02059)
- Abstract: "Our analysis identified 733 snippets, revealing a high likelihood of security weaknesses, with 29.5% of Python and 24.2% of JavaScript snippets affected. These issues span 43 Common Weakness Enumeration (CWE) categories, including significant ones like CWE-330: Use of Insufficiently Random Values, CWE-94: Improper Control of Generation of Code, and CWE-79: Cross-site Scripting." — [arXiv](https://arxiv.org/abs/2310.02059)
- Abstract: "We further examined using Copilot Chat to fix security issues in Copilot-generated code by providing Copilot Chat with warning messages from the static analysis tools, and up to 55.5% of the security issues can be fixed." — [arXiv](https://arxiv.org/abs/2310.02059)
- Abstract, data set: "analyzing code snippets generated by GitHub Copilot and two other AI code generation tools (i.e., CodeWhisperer and Codeium) from GitHub projects." — [arXiv](https://arxiv.org/abs/2310.02059)

#### Inferences
- This is real-world code that developers kept and committed, so it complements the prompt benchmarks (H1, H2).
- The fix result supports pairing AI code with static analysis. It does not show that AI fixes issues without the warnings.

#### Gaps
- Snippets were found by keyword search for self-declared AI-generated code. The authors note that the label "GitHub Copilot" in a file did not always mean the code was generated by it, so attribution is not certain.
- The full text is inconsistent: the introduction says "43 different CWEs" in one place and "among the 38 CWEs identified" a few lines later. Cite 43 as the abstract does.

### H4. Vero, Mündler, Chibotaru, Raychev, Baader, Jovanović, He & Vechev (2025), "BaxBench: Can LLMs Generate Correct and Secure Backends?"

#### Takeaway
**Verdict: confirmed (~35%, not 38%).** In the main results, the best model for correct-and-secure code is OpenAI o3-mini at 35% (sec_pass@1). The introduction rounds the ceiling to 37%. No 38% figure appears. The abstract itself gives a different headline: o1 reaches 62% correctness, and about half of the correct programs could be exploited.

#### Cited Findings
- Bibliographic: Proceedings of the 42nd International Conference on Machine Learning (ICML 2025), Vancouver, PMLR 267; arXiv 2502.11844 (v3, 30 May 2025). No DOI. Peer-reviewed conference paper (ICML). Evidence grade B (benchmark: 392 tasks, 28 scenarios × 14 frameworks, 11 LLMs, exploits actually run). — [arXiv](https://arxiv.org/abs/2502.11844)
- Figure 3 caption (v3): "While sec_pass@1 is significantly higher for models with a higher pass@1 score, even for the best model, OPENAI O3-MINI, it only reaches 35%. As such, even flagship LLMs are not yet ready for automated development in production." — [arXiv](https://arxiv.org/abs/2502.11844)
- Introduction (v3): "As shown in Fig. 1, even flagship LLMs struggle to generate deployment-ready backends, not surpassing a mere 37% correct and secure generation rate on BAXBENCH." — [arXiv](https://arxiv.org/abs/2502.11844)
- Abstract (v3): "(i) even the best model, OpenAI o1, achieves a mere 62% on code correctness; (ii) on average, we could successfully execute security exploits on around half of the correct programs generated by each LLM". Versions v1 and v2 said "60%" and "more than half". — [arXiv](https://arxiv.org/abs/2502.11844)

#### Inferences
- "At most about a third of backends are both correct and secure" is a safe paraphrase.
- The paper also finds that a generic security reminder in the prompt helps the reasoning models (o1, o3-mini, DeepSeek-R1) but not the non-reasoning models. This could be useful where the review discusses prompting for security.

#### Gaps
- The 2025 model generation only (o1, o3-mini, Claude 3.5 Sonnet, DeepSeek-R1, among others). Newer models were not tested in this paper.
- The 35% and 37% figures appear to come from different settings (Fig. 3 versus Fig. 1). I did not trace which prompt setting gives the 37%.

### H5. Zhao, Wang, Zhang, Luo, Li & Li (2026), "Is Vibe Coding Safe? Benchmarking Vulnerability of Agent-Generated Code in Real-World Tasks" (SusVibes)

#### Takeaway
**Verdict: corrected.** The authors and the venue are confirmed (Zhao et al., accepted at ICML 2026). But 61% / 10.5% are the numbers from the earlier preprint versions (v1-v2, 200 tasks). The final version (v3-v4, the ICML paper, 186 tasks) reports **57% functionally correct and 11.8% secure** for SWE-Agent with Claude 4 Sonnet. The claim that hints barely helped is confirmed: correct-and-secure rose from 11.8% to at most 15.1%, while functional correctness fell.

#### Cited Findings
- Bibliographic: Songwen Zhao, Danqing Wang, Kexun Zhang, Jiaxuan Luo, Zhuo Li, Lei Li. Proceedings of the 43rd International Conference on Machine Learning (ICML 2026), Seoul, PMLR 306; arXiv 2512.03262 (v4, 21 September 2026; comment "Accepted in ICML 2026"). No DOI. Peer-reviewed conference paper. Evidence grade B (benchmark: 186 real-world feature-request tasks, 12 agent/model settings). — [arXiv](https://arxiv.org/abs/2512.03262)
- Abstract (v4): "Although 57% of the solutions from SWE-Agent with Claude 4 Sonnet are functionally correct, only 11.8% are secure. Further experiments demonstrate that preliminary security strategies, such as augmenting the feature request with vulnerability hints, cannot mitigate these security issues." — [arXiv](https://arxiv.org/abs/2512.03262v4)
- Abstract (v1, 2 December 2025, superseded): "Although 61% of the solutions from SWE-Agent with Claude 4 Sonnet are functionally correct, only 10.5% are secure." — [arXiv v1](https://arxiv.org/abs/2512.03262v1)
- Full text, Section 4.2: "The best functionally performing approach, SWE-AGENT integrated with Claude 4 Sonnet resolved 57% of the tasks, yet 79.3% of these functionally correct solutions are insecure." — [arXiv](https://arxiv.org/abs/2512.03262v4)
- Full text, Table 5 (SWE-Agent + Claude 4 Sonnet): FuncPass 57.0 (generic) / 50.0 (self-selection) / 55.4 (oracle CWE hint); SecPass 11.8 / 14.5 / 15.1. Caption: "Both degrade functional performance while slightly increasing the number of correct-and-secure solutions." — [arXiv](https://arxiv.org/abs/2512.03262v4)

#### Inferences
- "Secure" here means SecPass: correct AND secure, as a share of all tasks. So "secure on 11.8% of tasks" is accurate. "11.8% of its correct solutions were secure" would be wrong; that share is about 21% (100% - 79.3%).
- SWE-Agent + Claude 4 Sonnet is the best configuration for functional correctness. It is not the most secure: by the paper's subset measure, Gemini 2.5 Pro is the most secure LLM.

#### Gaps
- The frameworks and models are from 2025 (Claude 4 Sonnet, Kimi K2, Gemini 2.5 Pro, Gemini 3 Pro). Results may not carry over to newer agents.

### H6. Spracklen, Wijewickrama, Sakib, Maiti, Viswanath & Jadliwala (2025), "We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs"

#### Takeaway
**Verdict: confirmed.** 5.2% (commercial), 21.7% (open-source) and 205,474 unique hallucinated names are stated in the abstract. These are average rates per model group ("at least").

#### Cited Findings
- Bibliographic: 34th USENIX Security Symposium (USENIX Security 25), pp. 3687-3706, ISBN 978-1-939133-52-6; arXiv 2406.10279 (v3). No DOI. Peer-reviewed conference paper; Distinguished Paper Award. Evidence grade B (16 LLMs, 576,000 code samples in Python and JavaScript). — [USENIX](https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen), [arXiv](https://arxiv.org/abs/2406.10279)
- Abstract: "Our findings reveal that that the average percentage of hallucinated packages is at least 5.2% for commercial models and 21.7% for open-source models, including a staggering 205,474 unique examples of hallucinated package names, further underscoring the severity and pervasiveness of this threat." — [USENIX](https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen)

#### Inferences
- This supports a rule such as "check that every suggested package exists and is the intended one before installing it". It is a supply-chain risk, separate from vulnerabilities inside the generated code.

#### Gaps
- The models tested date from 2023-2024. Full text not read; the abstract states the claims exactly.

### H7. Perry, Srivastava, Kumar & Boneh (2023), "Do Users Write More Insecure Code with AI Assistants?"

#### Takeaway
**Verdict: confirmed.** n = 47 (54 recruited, 47 analysed: 33 with the assistant, 14 without). All three findings are stated in the abstract.

#### Cited Findings
- Bibliographic: Proceedings of the 2023 ACM SIGSAC Conference on Computer and Communications Security (CCS '23), pp. 2785-2799, DOI 10.1145/3576915.3623157; arXiv 2211.03622 (v3, full version). Peer-reviewed conference paper. Evidence grade B (randomised user study with a small, unbalanced control group). — [Crossref](https://api.crossref.org/works/10.1145/3576915.3623157), [arXiv](https://arxiv.org/abs/2211.03622)
- Abstract: "Overall, we find that participants who had access to an AI assistant based on OpenAI's codex-davinci-002 model wrote significantly less secure code than those without access. Additionally, participants with access to an AI assistant were more likely to believe they wrote secure code than those without access to the AI assistant." — [arXiv](https://arxiv.org/abs/2211.03622)
- Abstract: "Furthermore, we find that participants who trusted the AI less and engaged more with the language and format of their prompts (e.g. re-phrasing, adjusting temperature) provided code with fewer security vulnerabilities." — [arXiv](https://arxiv.org/abs/2211.03622)
- Full text, Section 3: "After excluding data points of participants who failed the prescreening or quit the study, we were left with 47 participants-- 33 in the experiment group and 14 in the control group." — [arXiv](https://arxiv.org/abs/2211.03622)

#### Inferences
- The finding that "trusting less and engaging more" goes with fewer vulnerabilities is correlational, not an experimental effect.

#### Gaps
- Codex-davinci-002 is an old model. Participants ranged from undergraduates to professionals.

### H8. Sandoval, Pearce, Nys, Karri, Garg & Dolan-Gavitt (2023), "Lost at C: A User Study on the Security Implications of Large Language Model Code Assistants"

#### Takeaway
**Verdict: confirmed.** N = 58 student programmers. "No greater than 10% more than the control" is word for word. The authors read this as *no* new security risk, which is the opposite direction from H7.

#### Cited Findings
- Bibliographic: 32nd USENIX Security Symposium (USENIX Security 23), Anaheim, pp. 2205-2222, ISBN 978-1-939133-37-3; arXiv 2208.09727 (v4). No DOI. Peer-reviewed conference paper. Evidence grade B (controlled user study). — [USENIX](https://www.usenix.org/conference/usenixsecurity23/presentation/sandoval), [arXiv](https://arxiv.org/abs/2208.09727)
- Abstract: "We conduct a security-driven user study (N=58) to assess code written by student programmers when assisted by LLMs." — [arXiv](https://arxiv.org/abs/2208.09727)
- Abstract: "Our results indicate that the security impact in this setting (low-level C with pointer and array manipulations) is small: AI-assisted users produce critical security bugs at a rate no greater than 10% more than the control, indicating the use of LLMs does not introduce new security risks." — [arXiv](https://arxiv.org/abs/2208.09727)

#### Inferences
- The review should present this as a null or small-effect result that contrasts with Perry et al., not as evidence of harm.

#### Gaps
- One task (a linked list in C) and students only.

### H9. Klemmer, Horstmann, Patnaik, Ludden, Burton, Powers, Massacci, Rahman, Votipka, Lipford, Rashid, Naiakshina & Fahl (2024), "Using AI Assistants in Software Development: A Qualitative Study on Security Practices and Concerns"

#### Takeaway
**Verdict: corrected.** The paper does not compare what participants say with what they do; it observed no behaviour. What it reports is (a) participants say they scrutinise AI output like human code, and rarely report having met security issues; (b) the authors find a "mismatch" between this reported scrutiny and the negative security effects found *in earlier experiments* (Pearce, Perry and others). From that they conclude that professionals overestimate how well they can scrutinise AI output.

#### Cited Findings
- Bibliographic: Proceedings of the 2024 ACM SIGSAC Conference on Computer and Communications Security (CCS '24), pp. 2726-2740, DOI 10.1145/3658644.3690283; arXiv 2405.06371 (v2, extended version). Peer-reviewed conference paper. Evidence grade C (qualitative: 27 semi-structured interviews plus 190 Reddit posts and comments). — [Crossref](https://api.crossref.org/works/10.1145/3658644.3690283), [arXiv](https://arxiv.org/abs/2405.06371)
- Abstract: "Their overall mistrust leads to checking AI suggestions in similar ways to human code, although they expect improvements and, therefore, a heavier use for security tasks in the future." — [arXiv](https://arxiv.org/abs/2405.06371)
- Full text, Section 4: "Despite the widespread security and quality concerns, participants rarely reported facing security issues using AI assistants." — [arXiv](https://arxiv.org/abs/2405.06371)
- Full text, Section 5.2.1: "While our participants reported to critically scrutinize AI suggestions (Section 4.2.3) due to general mistrust and did not perceive negative security impact from AI usage, a negative security impact is evident in practice [56, 66, 68, 71, 76]. This mismatch reveals a skewed self-perception, so that software professionals overestimate their capabilities in scrutinizing AI suggestion for security." — [arXiv](https://arxiv.org/abs/2405.06371)

#### Inferences
- The "mismatch" is an inference across studies by the authors, not a measured within-person gap. Bappy et al. (H13) and Mousavi et al. (H10) observe a stated-versus-actual gap directly; they are better sources for that point.

#### Gaps
- Interviews took place before agentic tools became common. The sample is professionals, not juniors.

### H10. Mousavi, Islam, Babar, Abuadbba & Moore (2026), "Understanding the Impact of AI Code Assistants on Security API Usage: An Empirical Study"

#### Takeaway
**Verdict: confirmed.** 44 professional developers did tasks with and without Copilot (a within-subject design). Copilot improved functional correctness but had no significant effect on secure API use, and many participants did not recognise that their code was insecure. In fact no implementation was fully secure in either condition.

#### Cited Findings
- Bibliographic: Zahra Mousavi, Chadni Islam, M. Ali Babar, Alsharif Abuadbba, Kristen Moore. arXiv 2607.11348 (v1, 13 July 2026), "Accepted for publication at the 29th International Symposium on Research in Attacks, Intrusions and Defenses (RAID 2026)". Accepted peer-reviewed paper; no proceedings DOI found. Evidence grade B (within-subject experiment, n = 44, two security-API tasks: JSSE/TLS and OAuth). — [arXiv](https://arxiv.org/abs/2607.11348)
- Abstract: "We conducted a study with 44 developers who completed security API programming tasks with and without GitHub Copilot assistance. Our findings show that, while Copilot improves functional correctness and marginally reduces certain insecure patterns, it does not significantly improve secure API usage." — [arXiv](https://arxiv.org/abs/2607.11348)
- Abstract: "We also found that developers rarely raised security concerns when engaging with Copilot, and many did not recognize that their final implementations remained insecure." — [arXiv](https://arxiv.org/abs/2607.11348)
- Conclusion: "No participant produced a fully secure implementation, regardless of AI assistance or background, highlighting the ongoing challenges of secure software development." — [arXiv](https://arxiv.org/abs/2607.11348)

#### Inferences
- The overconfidence was present without Copilot as well. The paper found "no statistically significant effect of Copilot on these self-assessments". So overconfidence is a general developer problem here, not one specific to AI.

#### Gaps
- Two tasks in one domain (security APIs in Java). Only two participants raised security in their prompts.

### H11. Jost, Berens, Karl, Horstmann, Johns & Naiakshina (2026), "The Impact of AI-Assisted Development on Software Security: A Study of Gemini and Developer Experience"

#### Takeaway
**Verdict: corrected (wording).** n = 159 and the null result for Gemini are confirmed. But programming experience "significantly" improved security with a modest effect size. "Strongly predicts" overstates it.

#### Cited Findings
- Bibliographic: Nadine Jost, Benjamin Berens, Manuel Karl, Stefan Albert Horstmann, Martin Johns, Alena Naiakshina. arXiv 2603.15298 (v2, 17 March 2026). No venue or journal reference on the arXiv record. Preprint, not peer-reviewed. Evidence grade B (between-group experiment with three arms: no AI, free Gemini, paid Gemini). — [arXiv](https://arxiv.org/abs/2603.15298)
- Abstract: "Therefore, we conducted a quantitative programming study with software developers (n=159) exploring the impact of Google's AI tool Gemini on code security. [...] While we did not observe significant differences between using Gemini in terms of secure software development, programming experience significantly improved code security and cannot be fully substituted by Gemini." — [arXiv](https://arxiv.org/abs/2603.15298)
- Full text, RQ1 results: "A one-standard-deviation increase in overall programming experience raised the odds of a higher security score by a factor of 1.43 (95 % CI [1.14, 1.81], p=0.002). In probability terms, the predicted security success rate increased from 30% (mean experience) to 38% at +1 SD." The raw correlation was r = 0.2 (p = 0.018). — [arXiv](https://arxiv.org/abs/2603.15298)

#### Inferences
- This is relevant to juniors: experience mattered and Gemini did not make up for a lack of it. The size of the effect, however, is modest.
- Security *experience* did not help (OR 0.75, p = 0.058, trend in the opposite direction).

#### Gaps
- Mostly freelancers recruited online (91 of 159). One Python task scored on 5 security items.

### H12. Khalid, Thompson, Sabater, Mussiba, Fulton & Votipka (2026), "(Don't) Trust, but (Don't) Verify: Developers' Attention to Security in AI-Generated Code"

#### Takeaway
**Verdict: corrected (venue only).** All the numbers are confirmed: 100 participants, 37.7% vs 35.0%, 22% fully secure, more edits linked to fewer vulnerabilities, 16 of 23 interviewees. But the paper is not just a preprint: the arXiv record says "To appear at IEEE Security and Privacy (S&P) '27".

#### Cited Findings
- Bibliographic: Hamza Khalid, Ronald E. Thompson, Alejandra Sabater, Perucy Mussiba, Kelsey R. Fulton, Daniel Votipka. arXiv 2609.21020 (v1, 17 September 2026), "To appear at IEEE Security and Privacy (S&P) '27". Accepted peer-reviewed paper, not yet in the proceedings; no DOI. Evidence grade B (remote observational study, n = 100, four C linked-list tasks, five fixed AI suggestions per task; 23 interviews). — [arXiv](https://arxiv.org/abs/2609.21020)
- Full text, Section 4.1: "we found they selected the most secure suggestions in 37.7% of cases, suggestions with some vulnerabilities in 27.3% of cases, and the least secure suggestions in 35.0% of cases." — [arXiv](https://arxiv.org/abs/2609.21020)
- Full text: "Security analysis revealed only 88 (22%) submissions were fully secure, i.e. free of vulnerabilities. While 42% of participants submitted at least one secure solution, only 5% submitted secure code for all four tasks." — [arXiv](https://arxiv.org/abs/2609.21020)
- Full text: "Our Poisson regression (Table 2) showed participants produced final submissions with statistically significantly fewer vulnerabilities the more lines they changed (β = -0.5, p < 0.001)." — [arXiv](https://arxiv.org/abs/2609.21020)
- Full text, Section 4.2.1: "Although participants were informed their solutions would be evaluated for security, 16 of 23 interviewees said they did not take any explicit steps to address security in their solutions, citing several reasons." — [arXiv](https://arxiv.org/abs/2609.21020)

#### Inferences
- The 22% is per submission (88 of 400), not per participant.
- The authors also report that participants' confidence in their code's security correlated with its actual security. This nuances the overconfidence story from H7 and H10.

#### Gaps
- Fixed suggestions, not live prompting. 25 participants used an outside AI assistant through the built-in browser.

### H13. Bappy, Hossain, Meheraj, Akhand, Tabassum, Zaman, Hasan & Islam (2026), "From Preventive to Reactive: How AI Coding Assistants Transform Developers' Security Awareness"

#### Takeaway
**Verdict: corrected (details).** The SOUPS 2026 venue is confirmed. 15 engineers were *interviewed*, but 14 took part in the observed coding sessions. The predictor that was tested is the "experience cohort" (when the developer entered the profession relative to AI tools), not seniority as such. The text does add that neither cohort nor seniority aligned with who caught issues. This is qualitative; no statistical test was done.

#### Cited Findings
- Bibliographic: Twenty-Second Symposium on Usable Privacy and Security (SOUPS 2026), pp. 257-274, ISBN 978-1-939133-59-5; arXiv 2605.23130 (v2). No DOI. Peer-reviewed conference paper. Evidence grade C (qualitative: 15 interviews, 14 observed coding sessions). — [USENIX](https://www.usenix.org/conference/soups2026/presentation/bappy), [arXiv](https://arxiv.org/abs/2605.23130)
- Abstract: "Notably, none of our coding session participants specified security requirements in their initial prompts, even when they possessed the relevant knowledge, revealing a decoupling of security awareness from security behavior." — [USENIX](https://www.usenix.org/conference/soups2026/presentation/bappy)
- Full text, Section 5: "Crucially, the coding sessions revealed a sharper picture: none of the 14 participants mentioned security in their initial prompts, and only 2 caught unstated security issues unprompted, a divergence between stated concern and observed behavior that held across experience levels." — [arXiv](https://arxiv.org/abs/2605.23130)
- Full text, Section 5.2.2: "The 2 participants who caught unstated security issues (P10 and P12) represent different cohorts (AI-era and Pre-AI, respectively) and different levels of seniority." — [arXiv](https://arxiv.org/abs/2605.23130)
- Full text, Section 5: "P10, despite having approximately 1.5 years of professional experience, caught a critical authorization flaw that more senior participants missed." — [arXiv](https://arxiv.org/abs/2605.23130)

#### Inferences
- This is direct observational evidence for the gap between what developers say and what they do. It is a better source for that point than H9.

#### Gaps
- The paper contradicts itself in one place: one paragraph says "12 of the 14 participants included no security considerations in their initial prompts", while the abstract and the other sections say none did. Cite "none" with the abstract, or say "none (or nearly none)".
- n = 14, so "did not predict" means "no visible pattern", not a tested null result.

### H14. Kudriavtseva, Hotak & Gadyatskaya (2025), "My Code Is Less Secure with Gen AI: Surveying Developers' Perceptions of the Impact of Code Generation Tools on Security"

#### Takeaway
**Verdict: confirmed, but add the size caveat.** The authors are Arina Kudriavtseva, Nisar Ahmad Hotak and Olga Gadyatskaya (Leiden University). The survey had 105 valid respondents. The only respondents who were "very confident" were juniors. But that group was **1%** of respondents (about one person), and "junior" includes students and learners with 0-2 years' experience.

#### Cited Findings
- Bibliographic: Proceedings of the 40th ACM/SIGAPP Symposium on Applied Computing (SAC '25), pp. 1637-1646, 31 March 2025, DOI 10.1145/3672608.3707778. Peer-reviewed conference paper. Evidence grade C (self-report survey; 196 responses, 105 valid). — [Crossref](https://api.crossref.org/works/10.1145/3672608.3707778), [Leiden repository PDF](https://scholarlypublications.universiteitleiden.nl/handle/1887/4283611)
- Section 3.4: "A quarter (25%) reported feeling somewhat or very confident in the security of AI-generated code. Notably, a larger percentage (11%) lacked confidence entirely, compared to the small group (1%) who were very confident." — [Leiden PDF](https://scholarlypublications.universiteitleiden.nl/handle/1887/4283611)
- Section 3.4: "When examining the confidence levels based on experience, it is interesting to note that the small group of developers who were very confident in AI-generated code were only juniors. On the other hand, medior (14%) and senior (15%) developers were more likely to express a complete lack of confidence compared to juniors (5%)." — [Leiden PDF](https://scholarlypublications.universiteitleiden.nl/handle/1887/4283611)
- Section 2: "we group the participants into junior (student/learning, 0-2 years of experience), medior (3-5 years), and senior (more than 6 years) groups based on their years of experience." — [Leiden PDF](https://scholarlypublications.universiteitleiden.nl/handle/1887/4283611)

#### Inferences
- The more robust junior finding is a different one: juniors perceived their secure-coding proficiency to *rise* with AI, while seniors perceived it to fall. The authors suggest a Dunning-Kruger explanation, but only as a hypothesis.

#### Gaps
- Self-selected online sample; about half are not professional developers. The authors themselves say the results may not generalise.

### H15. Veracode (29 October 2026), "Fall 2026 GenAI Code Security Update" (blog, by Natalie Tischler) and press release "Veracode Finds First Meaningful Gain in AI Code Security Since 2025 as Average Pass Rate Hits 62%"

#### Takeaway
**Verdict: confirmed.** Every number matches the press release, which rounds them. The blog gives more decimals: SQL injection 83.7%, log injection 12.6%, C# 59.55%, Python 64.22%, JavaScript 56.99%, Java 31.00%. The 73% best score is shared by two models.

#### Cited Findings
- Bibliographic: Veracode blog, 29 October 2026, https://www.veracode.com/blog/fall-2026-genai-code-security/ (also reached via https://www.veracode.com/?p=33093); press release, 29 October 2026, https://www.veracode.com/press-release/veracode-finds-first-meaningful-gain-in-ai-code-security-since-2025-as-average-pass-rate-hits-62/ (reached via https://www.veracode.com/?p=33104). Vendor publication, not peer-reviewed. Evidence grade C (18 models, 4 languages, 4 CWEs, prompts without security guidance; the full method is in a separate report that was not read). — [blog](https://www.veracode.com/blog/fall-2026-genai-code-security/), [press release](https://www.veracode.com/press-release/veracode-finds-first-meaningful-gain-in-ai-code-security-since-2025-as-average-pass-rate-hits-62/)
- Blog: "The average security pass rate jumped from 56% to 62% . This is the first meaningful movement in the series. The vulnerability rate dropped from roughly 44% to ~38% ." — [blog](https://www.veracode.com/blog/fall-2026-genai-code-security/)
- Press release: "Java remains the dramatic outlier at 31 percent, barely up from 30 percent in July. The gap between Java and the other three languages (Python at 64 percent, C# at 60 percent, and JavaScript at 57 percent) is still 26–33 percentage points." — [press release](https://www.veracode.com/press-release/veracode-finds-first-meaningful-gain-in-ai-code-security-since-2025-as-average-pass-rate-hits-62/)
- Press release: "Despite being one of the weaker categories, XSS rose to 18 percent [...]. Meanwhile, crypto (CWE-327) held at 87 percent, Structured Query Language (SQL) injection (CWE-89) held at 84 percent, and log injection (CWE-117) remained flat at 13 percent." — [press release](https://www.veracode.com/press-release/veracode-finds-first-meaningful-gain-in-ai-code-security-since-2025-as-average-pass-rate-hits-62/)
- Press release: "Claude Opus 5.5 and GPT-6-Sol tied at 73 percent, dethroning GPT-5.5, which led the summer 2026 snapshot at 68 percent." — [press release](https://www.veracode.com/press-release/veracode-finds-first-meaningful-gain-in-ai-code-security-since-2025-as-average-pass-rate-hits-62/)

#### Inferences
- Veracode itself says the gain comes mostly from XSS, while log injection and Java are unchanged. If the review cites "56% → 62%", it should say that.
- For a C# course: C# is at about 60%, so roughly four in ten tasks still fail the security check without security guidance in the prompt.

#### Gaps
- Vendor research, and the vendor sells scanning tools ("a mid-tier model at a 60 percent pass rate plus Veracode scanning is more accurate…"). The full report and its method were not read.
- Disclosure: one of the two top models (Claude Opus 5.5) is the model that ran this check. The figures are quoted from Veracode and not interpreted further.

### H16. Shen & Tamkin (2026), "How AI Impacts Skill Formation"

#### Takeaway
**Verdict: confirmed.** The study was randomised. AI help made conceptual understanding, code reading and debugging worse, with no significant average speed-up. Three of the six interaction patterns involved cognitive engagement and preserved learning. All of this is in the abstract. Sample: 52 participants (26 per arm), learning the Python Trio library.

#### Cited Findings
- Bibliographic: Judy Hanwen Shen, Alex Tamkin. arXiv 2601.20245 (v2, 1 February 2026). Preprint, not peer-reviewed. Work done in the Anthropic Fellows Program. Evidence grade B (pre-registered, between-subjects randomised experiment; n = 52 in the main study). — [arXiv](https://arxiv.org/abs/2601.20245)
- Abstract: "We find that AI use impairs conceptual understanding, code reading, and debugging abilities, without delivering significant efficiency gains on average. Participants who fully delegated coding tasks showed some productivity improvements, but at the cost of learning the library." — [arXiv](https://arxiv.org/abs/2601.20245)
- Abstract: "We identify six distinct AI interaction patterns, three of which involve cognitive engagement and preserve learning outcomes even when participants receive AI assistance." — [arXiv](https://arxiv.org/abs/2601.20245)
- Full text, Introduction: "using AI assistance to complete tasks that involve this new library resulted in a reduction in the evaluation score by 17% or two grade points (Cohen's d = 0.738, p = 0.010)." — [arXiv](https://arxiv.org/abs/2601.20245)

#### Inferences
- The finding that the "engaged patterns preserved learning" comes from a post-hoc grouping of the 26 treatment participants. It is a hypothesis-generating result, not a randomised comparison.

#### Gaps
- One short session (35 minutes), an immediate quiz only, and participants with at least one year of Python. Not reviewed by peers yet. The authors were at Anthropic.

### Corrections for the review (part 1)

1. **H5 (SusVibes) - numbers and version.** Replace "functionally correct on ~61% of tasks, secure on ~10.5%" with: "In the ICML 2026 version of SusVibes (186 real-world tasks), the best-performing setup, SWE-Agent with Claude 4 Sonnet, produced functionally correct code for 57% of tasks, but only 11.8% of tasks were both correct and secure; 79.3% of its correct solutions were insecure (Zhao et al., 2026)." The 61%/10.5% figures belong to the superseded preprint v1-v2 (200 tasks). Authors: Zhao, Wang, Zhang, Luo, Li & Li; venue ICML 2026 (PMLR 306). For the hints: "adding the vulnerability type to the prompt raised correct-and-secure solutions only from 11.8% to at most 15.1%, while functional correctness dropped".
2. **H4 (BaxBench) - figure.** Use "35%", not 38%: "even the best model (OpenAI o3-mini) produced backends that were both correct and secure in only 35% of tasks (Vero et al., 2025)". If the review wants the introduction's ceiling, say "at most 37%". Do not use 38%.
3. **H9 (Klemmer et al.) - claim reframed.** Replace "this does not match their reported behaviour" with: "Professionals said they check AI suggestions as they would human code and rarely reported running into security issues; the authors note that this reported scrutiny clashes with the security problems found in experimental studies, and conclude that professionals overestimate how well they can scrutinise AI output (Klemmer et al., 2024)." The paper observed no behaviour.
4. **H11 (Jost et al.) - wording.** Replace "programming experience strongly predicts code security" with "programming experience significantly predicted code security (odds ratio 1.43 per SD of experience; predicted success 30% → 38%), and Gemini did not make up for it". Label it as a preprint.
5. **H12 (Khalid et al.) - venue.** Replace "preprint" with "to appear at IEEE S&P 2027 (arXiv 2609.21020)". Optionally add that 22% is per submission (88 of 400).
6. **H13 (Bappy et al.) - details.** "15 engineers interviewed, 14 observed in coding sessions; none of the 14 put security requirements in their initial prompt" (note that one paragraph of the paper says 12 of 14). Replace "seniority did not predict security performance" with "neither experience cohort nor seniority aligned with who caught security issues (a qualitative observation, n = 14)".
7. **H14 (Kudriavtseva et al.) - authors and size caveat.** Authors: Kudriavtseva, Hotak & Gadyatskaya (2025), "My Code Is Less Secure with Gen AI: Surveying Developers' Perceptions of the Impact of Code Generation Tools on Security", SAC '25. Add the caveat: "only 1% of the 105 respondents were very confident in AI-generated code, and all of them were juniors (students and developers with 0-2 years' experience)".
8. **H2 (Majdinasab et al.) - precision.** Write the numbers as 36.54% → 27.25% and say they are for Python, so they are not compared with Pearce et al.'s overall 40%.
9. **H3 (Fu et al.) - precision.** The 733 snippets include code from CodeWhisperer and Codeium as well as Copilot. Write "AI-generated (mainly Copilot) snippets in GitHub projects".
10. **H15 (Veracode) - precision.** The numbers stand, but cite them as vendor research (grade C). Say that the gain comes mostly from XSS, and that two models share the best score of 73%.

No source was missing, and no ID pointed to a different paper.

**Part 2 (H17–H35): secure coding, junior roles and the regulatory frame**

Scope: This part checks 19 sources (H17 to H35) that the literature review section plans to cite. Together they support four lines of argument. (1) Developers' security mistakes come mostly from conceptual gaps and missing prompts, not from slips: Votipka et al., Naiakshina et al. (2017, 2019), Lam et al. (2) Light interventions that work: a security focus prompt in code review, an in-IDE plugin, and short workshops: Braz et al., Nguyen et al., Weir et al. (3) The AI and labour-market context for juniors: Tompkins et al., Alahmadi et al., ISC2 (2025, 2026), the Dialogic/PTvT report for EZK, UWV. (4) The normative frame: the Dutch Cyberbeveiligingswet, the EU Cyber Resilience Act, NIST SSDF, ISO/IEC 27001:2022 control 8.28, ENISA ECSF, OWASP SAMM and ASVS, and the NCSC web application guidelines. For each source we checked authors, year, title, venue and review status (or document type), DOI or URL, and each planned claim.

Method note: Bibliographic data came from the Crossref API for every DOI (Braz et al., both Naiakshina papers, Nguyen et al., Weir et al., Lam et al., Tompkins et al.). The two USENIX Security papers (Votipka et al., Alahmadi et al.) have no DOI; their data came from the USENIX proceedings PDFs. arXiv records came from the arXiv API (1708.08759, 2202.04586, 2602.17448). Full texts read with pdftotext: Votipka et al. (USENIX PDF), Naiakshina et al. 2017 (arXiv), Braz et al. (arXiv), Nguyen et al. (open CCS PDF at acmccs.github.io), Weir et al. (UCL author PDF), Lam et al. (author PDF at wisc.edu), Tompkins et al. (arXiv v3), Alahmadi et al. (USENIX PDF), the Dialogic/PTvT report (open.overheid.nl), NIST SP 800-218 (nvlpubs PDF), the ENISA ECSF role profiles PDF, the NCSC guideline PDF and two UWV PDFs. Naiakshina et al. 2019 was not read in full: the authors' PDF on net.cs.uni-bonn.de could not be reached (connection refused); the abstract was taken from the passwordresearch.com mirror. EUR-Lex itself could not be reached (certificate error); the CRA text was taken from the same Official Journal document in the EU Publications Office (CELEX 32024R2847, cellar). The ISC2 pages, the Rijksoverheid news item, the Staatsblad pages, OWASP SAMM, the OWASP ASVS project page and GitHub release list, CSRC (NIST) pages and the UWV web pages were read as HTML. Older versions of the UWV ICT page were read through the Internet Archive (snapshot of 14 July 2026). ISO/IEC 27001:2022 is paywalled; control 8.28 was confirmed through the ISO catalogue page (edition and date) plus a certification body (DQS). Quotes are verbatim from these sources; Dutch quotes are left in Dutch.

### H17. Votipka, Fulton, Parker, Hou, Mazurek & Hicks (2020), "Understanding security mistakes developers make: Qualitative analysis from Build It, Break It, Fix It"

#### Takeaway
**Verdict: confirmed.** All three numbers match the abstract: 94 projects, 78% with misunderstanding-type vulnerabilities, 21% with simple mistakes. One detail matters for how we use it: the participants were not novices. Most were post-degree professionals in a MOOC capstone, with an average of 8.9 years of development experience.

#### Cited Findings
- Bibliographic: Proceedings of the 29th USENIX Security Symposium (USENIX Security 20), August 12-14, 2020, pp. 109-126; peer-reviewed (Distinguished Paper Award); no DOI. Evidence grade B (systematic qualitative coding of 94 contest projects and 866 exploits). — [USENIX](https://www.usenix.org/conference/usenixsecurity20/presentation/votipka-understanding)
- Abstract: "For example, simple mistakes were least common: only 21% of projects introduced such an error. Conversely, vulnerabilities arising from a misunderstanding of security concepts were significantly more common, appearing in 78% of projects." — [USENIX PDF](https://www.usenix.org/system/files/sec20-votipka-understanding.pdf)
- Abstract: "we conducted an in-depth analysis of 94 submissions to a secure-programming contest designed to mimic real-world constraints: correctness, performance, and security." — [USENIX PDF](https://www.usenix.org/system/files/sec20-votipka-understanding.pdf)
- Sample: "we decided to consider a sample of 94 projects--just under 67% of the total." (out of 142). — [USENIX PDF](https://www.usenix.org/system/files/sec20-votipka-understanding.pdf)
- Participants: "Although these participants were students, most were also post-degree professionals; overall, participants had a average of 8.9 years software development experience." — [USENIX PDF](https://www.usenix.org/system/files/sec20-votipka-understanding.pdf)

#### Inferences
- The finding supports teaching security concepts (for example integrity next to confidentiality), not only checklists against slips. The authors call for "better security training that focuses on less-intuitive concepts like integrity".
- Because participants were experienced, the 78% is not a "junior" figure. It shows that experience alone does not remove conceptual errors.

#### Gaps
- Contest setting (three problem types, teams of 1 to 7). The 94 projects were sampled on purpose, not at random.
- Teams were primed for security by the contest; the authors note this may make them more careful than typical developers.

### H18. Naiakshina, Danilova, Tiefenau, Herzog, Dechand & Smith (2017), "Why Do Developers Get Password Storage Wrong? A Qualitative Usability Study"; and Naiakshina, Danilova, Gerlitz, von Zezschwitz & Smith (2019), "If you want, I can store the encrypted password."

#### Takeaway
**Verdict: confirmed, with a sample-size detail.** In the 2017 study, none of the 10 students who were not asked for security stored passwords securely. The 2019 abstract states that freelancers, like the students, "do not store passwords securely unless prompted". Note: even with prompting, only 4 of 10 students reached a secure solution in 2017, so prompting is necessary but not sufficient.

#### Cited Findings
- Bibliographic (2017): Proceedings of the 2017 ACM SIGSAC Conference on Computer and Communications Security (CCS '17), pp. 311-328, DOI 10.1145/3133956.3134082; arXiv 1708.08759. Peer-reviewed. Evidence grade C (qualitative lab study, n = 20 CS students, 2 x 2 design). — [Crossref](https://api.crossref.org/works/10.1145/3133956.3134082), [arXiv](https://arxiv.org/abs/1708.08759)
- 2017, results: "Not a single participant from the non-primed groups, either working with JSF or Spring, stored the end-user passwords securely in the database." — [arXiv](https://arxiv.org/abs/1708.08759)
- 2017, section 4.6: "None of the 10 non-primed participants implemented a secure solution." — [arXiv](https://arxiv.org/abs/1708.08759)
- 2017, primed group: "From the primed groups, SP1, SP3, SP4, and JP4 were able to store the password securely with a security score of 6." — [arXiv](https://arxiv.org/abs/1708.08759)
- Bibliographic (2019): Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (CHI '19), paper pp. 1-12, DOI 10.1145/3290605.3300370. Peer-reviewed. Evidence grade C (mixed-methods field study with hired freelancers). — [Crossref](https://api.crossref.org/works/10.1145/3290605.3300370)
- 2019, abstract: "The authors' results showed that, without explicit prompting, none of the students implemented secure password storage." and "we reveal that, similar to the students, freelancers do not store passwords securely unless prompted, they have misconceptions about secure password storage, and they use outdated methods." — [abstract mirror, passwordresearch.com](https://passwordresearch.com/papers/paper807.html)

#### Inferences
- The "prompt" effect links to H19 (Braz et al.): telling people to look at security changes behaviour in both writing and reviewing code. A harness that asks the security question explicitly is in line with both.
- "Unless prompted" in the freelancer abstract is a group-level statement; it does not say that all non-prompted freelancers failed.

#### Gaps
- 2019 full text not read (authors' server unreachable). The number of freelancers and the per-group secure rates were not checked. Do not cite a "none" or a percentage for freelancers without the full text.
- 2017: 20 students, lab setting, Java web frameworks only; the authors note participants knew they were in a study.

### H19. Braz, Aeberhard, Çalikli & Bacchelli (2022), "Less is More: Supporting Developers in Vulnerability Detection during Code Review"

#### Takeaway
**Verdict: confirmed, two wording fixes.** n = 150 and "eight times" are correct, but "eight times" is an odds ratio, not a probability ratio (the abstract says "probability"; the results section says "expressed in odds ratio"). The checklist was not the OWASP checklist itself but a 22-item checklist derived from it (and a 7-item tailored one); neither improved detection significantly.

#### Cited Findings
- Bibliographic: Proceedings of the 44th International Conference on Software Engineering (ICSE '22), pp. 1317-1329, DOI 10.1145/3510003.3511560; arXiv 2202.04586 (title changed to match ICSE). Peer-reviewed. Evidence grade B (randomised online experiment, n = 150). — [Crossref](https://api.crossref.org/works/10.1145/3510003.3511560), [arXiv](https://arxiv.org/abs/2202.04586)
- Abstract: "we conduct an online experiment with 150 participants, of which 71% report to have three or more years of professional development experience. Our results show that simply asking reviewers to focus on security during the code review increases eight times the probability of vulnerability detection." — [arXiv](https://arxiv.org/abs/2202.04586)
- Results: "expressed in odds ratio, these results show that participants assigned to any of SI, SC, and TC are eight times more likely to find a vulnerability than those assigned to NI" — [arXiv](https://arxiv.org/abs/2202.04586)
- Abstract: "The presence of a security checklist does not significantly improve the outcome further, even when the checklist is tailored to the change under review and the existing vulnerabilities in the change." — [arXiv](https://arxiv.org/abs/2202.04586)
- Method: "we designed the checklist available to participants of SC by reducing the OWASP checklist to 22 security items structured in 3 categories and 7 subcategories." — [arXiv](https://arxiv.org/abs/2202.04586)

#### Inferences
- A security focus instruction is cheap and effective; adding a long checklist on top of it is not. This supports a short, explicit "look at security now" step over a long checklist.

#### Gaps
- Mostly experienced developers, not students. One code change with two vulnerabilities (both in the Sensitive Data Exposure group). The checklist comparison (RQ2) used 117 participants.

### H20. Nguyen, Wermke, Acar, Backes, Weir & Fahl (2017), "A Stitch in Time: Supporting Android Developers in Writing Secure Code"

#### Takeaway
**Verdict: confirmed, with nuance.** n = 39 (developers and students) and "significantly less security problems" with the FixDroid IDE plugin are in the paper. The effect was large for the encryption and connection tasks and small for the SQLite task.

#### Cited Findings
- Bibliographic: Proceedings of the 2017 ACM SIGSAC Conference on Computer and Communications Security (CCS '17), pp. 1065-1077, DOI 10.1145/3133956.3133977. Peer-reviewed. Evidence grade B (between-groups remote experiment, n = 39, plus a pilot with 9). — [Crossref](https://api.crossref.org/works/10.1145/3133956.3133977), [open PDF](https://acmccs.github.io/papers/p1065-nguyenA.pdf)
- Abstract: "we identify key UI requirements and demonstrate that code delivered with such a tool by developers previously inexperienced in security contains significantly less security problems." — [open PDF](https://acmccs.github.io/papers/p1065-nguyenA.pdf)
- Introduction: "we improved FixDroid and performed a remote user study with Android developers and students (n=39) to evaluate the security benefits of FixDroid." — [open PDF](https://acmccs.github.io/papers/p1065-nguyenA.pdf)
- Results: "We were pleased to see a dramatic difference in security success, with more than twice the proportion achieving a secure solution in the Encryption and Connection tasks. Interestingly there was little difference in security success for the SQLite task." — [open PDF](https://acmccs.github.io/papers/p1065-nguyenA.pdf)

#### Inferences
- In-the-moment feedback while writing code helps. This fits an AI or linter step that flags a security issue during the task rather than after it.

#### Gaps
- Android-specific APIs (crypto, TLS, SQL). Functional correctness did not differ between groups. No retention or learning test after the task.

### H21. Weir, Becker, Noble, Blair, Sasse & Rashid (2020), "Interventions for long-term software security: Creating a lightweight program of assurance techniques for developers"

#### Takeaway
**Verdict: corrected (title and authors).** The PDF at the UCL URL is not "A passion for security". It is the Software: Practice and Experience paper "Interventions for long-term software security", with six authors. The claims hold: six hours of facilitated workshops over three months, in three organisations, with interviews after twelve months. But the 12-month follow-up only worked for two of the three teams: in Team C only one interviewee was still at the company and there was no response.

#### Cited Findings
- Bibliographic: Software: Practice and Experience, 50(3), 275-298, DOI 10.1002/spe.2774 (online 12 November 2019; issue 2020). Peer-reviewed journal. Evidence grade C (participatory action research with three teams; interviews). — [Crossref](https://api.crossref.org/works/10.1002/spe.2774), [author PDF](https://sec.cs.ucl.ac.uk/fileadmin/sec/publications/WeirSPEJournalPaper.pdf)
- Note: "A Passion for Security: Intervening to Help Software Developers" is a different paper by Weir, Becker & Blair, ICSE-SEIP 2021, pp. 21-30, DOI 10.1109/ICSE-SEIP52600.2021.00011. — [Crossref](https://api.crossref.org/works/10.1109/icse-seip52600.2021.00011)
- Abstract: "We propose that a series of lightweight interventions, six hours of facilitated workshops delivered over three months, can improve a team's motivation to consider security and awareness of assurance techniques, changing its security culture even when no security experts are involved." — [author PDF](https://sec.cs.ucl.ac.uk/fileadmin/sec/publications/WeirSPEJournalPaper.pdf)
- Abstract: "we delivered the workshops to three software development organizations, and evaluated their effectiveness through interviews beforehand, immediately afterwards, and after twelve months. We found that the interventions can be effective with teams with limited or no security experience, and that improvement is long lasting." — [author PDF](https://sec.cs.ucl.ac.uk/fileadmin/sec/publications/WeirSPEJournalPaper.pdf)
- Team C: "After one year, only one of the initial interviewees was still with the company and we received no response to our interview requests." — [author PDF](https://sec.cs.ucl.ac.uk/fileadmin/sec/publications/WeirSPEJournalPaper.pdf)

#### Inferences
- Short, repeated, facilitated sessions can shift team habits. This supports "small doses over time" rather than one long training.

#### Gaps
- Three teams, interview data, no control group. "Long lasting" rests on two teams. The paper extends the authors' ICSE-SEIP 2019 paper (DOI 10.1109/ICSE-SEIP.2019.00013).

### H22. Lam, Fang, Almansoori, Chatterjee & Soosai Raj (2022), "Identifying Gaps in the Secure Programming Knowledge and Skills of Students"

#### Takeaway
**Verdict: confirmed.** 21 students from two US R1 universities, coding interviews; the authors conclude that students "lack the key fundamental skills to write secure programs". The context is C and memory safety after a Computer Systems course.

#### Cited Findings
- Bibliographic: Proceedings of the 53rd ACM Technical Symposium on Computer Science Education V. 1 (SIGCSE 2022), pp. 703-709, DOI 10.1145/3478431.3499391. Peer-reviewed. Evidence grade C (qualitative think-aloud coding interviews, n = 21). — [Crossref](https://api.crossref.org/works/10.1145/3478431.3499391), [author PDF](https://pages.cs.wisc.edu/~chatterjee/papers/sigcse22-gapsinsecprog.pdf)
- Abstract: "we conducted a coding interview with 21 students from two R1 universities in the United States." — [author PDF](https://pages.cs.wisc.edu/~chatterjee/papers/sigcse22-gapsinsecprog.pdf)
- Abstract: "Our results suggest that students lack the key fundamental skills to write secure programs. For example, students rarely pay attention to details, such as compiler warnings, and often do not read programming language documentation with care." — [author PDF](https://pages.cs.wisc.edu/~chatterjee/papers/sigcse22-gapsinsecprog.pdf)

#### Inferences
- The gaps are partly general programming habits (reading warnings and documentation), not only security knowledge. That supports teaching security inside normal programming work.

#### Gaps
- C/C++ (gets, strcpy, buffer overflows), not managed languages such as C#. US students only; small sample.

### H23. Tompkins, Agarwal, Soneji, Wasinger, Nelson, Leach, Hasan, Doupé, Votipka, Shoshitaishvili & Mink (2026), "Do Hackers Dream of Electric Teachers?: A Large-Scale, In-Situ Measurement of Cybersecurity Student Behaviors and Educational Performance with AI Tutors"

#### Takeaway
**Verdict: confirmed, venue now final, three wording fixes.** Published in the CCS 2026 proceedings (Crossref record, pp. 1820-1834). 309 students, terminal and last saved file as context, no access to solutions, 3.5% solution requests: all confirmed. Fix 1: Reactive conversations had lower completion than Short conversations (in 8 of 9 modules); against Proactive no single module was significant (only the module-averaged contrast was). Fix 2: 40.6% and 57.3% are shares of the 293 survey respondents, not of 309. Fix 3: the finding is correlational.

#### Cited Findings
- Bibliographic: Proceedings of the 2026 ACM SIGSAC Conference on Computer and Communications Security (CCS '26, The Hague), pp. 1820-1834, DOI 10.1145/3830454.3846694; arXiv 2602.17448 (v3, 12 Oct 2026, comment "Published at ACM CCS 2026"). Peer-reviewed. Evidence grade C (large observational study; correlational). — [Crossref](https://api.crossref.org/works/10.1145/3830454.3846694), [arXiv](https://arxiv.org/abs/2602.17448)
- Abstract: "we conducted a semester-long observational study of an embedded AI tutor with 309 students in an upper-division introductory cybersecurity course." — [arXiv](https://arxiv.org/abs/2602.17448)
- Tutor context: "(d) the current Linux system context, composed of the latest saved file and active terminal history to capture command usage and outputs" and "the system does not have access to a solution, discouraging extraction and encouraging students to build one cooperatively." (model: GPT-4o; course on pwn.college) — [arXiv](https://arxiv.org/abs/2602.17448)
- Solution requests: "only a small minority of queries (3.5%) are direct solution requests." — [arXiv](https://arxiv.org/abs/2602.17448)
- Completion: "in eight of nine modules, Reactive conversations are associated with significantly lower completion rates than Short conversations (Table 8)." — [arXiv](https://arxiv.org/abs/2602.17448)
- Proactive vs Reactive: "Although Proactive conversations showed equal or higher raw completion rates than Reactive in all nine modules, no per-module contrast achieved statistical significance." The module-averaged contrast was OR = 1.27 (95% CI [1.06, 1.51]). — [arXiv](https://arxiv.org/abs/2602.17448)
- Trust: "only 40.6% (=119) agreed they could trust the tutor's information." (survey n = 293) — [arXiv](https://arxiv.org/abs/2602.17448)
- Use: "In Q13, 168 (57.3%) participants reported stopping or reducing their use of the tutor during the semester" — [arXiv](https://arxiv.org/abs/2602.17448)

#### Inferences
- A Socratic tutor that sees the student's terminal and file but not the answer is a workable design: few students asked straight for the answer.
- "Reactive" use (pasting errors and asking the tutor to find the problem) goes together with lower completion. This supports asking students to state their own hypothesis before they ask the AI.

#### Gaps
- Observational; the authors say the association has both a between-student and a within-student part, so it is not a causal effect of style.
- One US course (720 enrolled, 309 consented). The tutor became less useful on harder modules, which also drove the 57.3%.

### H24. Alahmadi, Axon & Martinovic (2022), "99% False Positives: A Qualitative Study of SOC Analysts' Perspectives on Security Alarms"

#### Takeaway
**Verdict: partly supported; needs rewording.** Analysts do validate alarms manually, and they perceive high false-positive rates. But "99%" is one analyst's quote, and the paper's main finding is that most of what analysts call false positives are in fact "benign triggers": true alarms caused by legitimate behaviour. So "most alarms are false positives" overstates the paper.

#### Cited Findings
- Bibliographic: Proceedings of the 31st USENIX Security Symposium (USENIX Security 22), August 10-12, 2022, pp. 2783-2800; peer-reviewed; no DOI. Evidence grade C (survey n = 20, interviews n = 21). — [USENIX](https://www.usenix.org/conference/usenixsecurity22/presentation/alahmadi), [USENIX PDF](https://www.usenix.org/system/files/sec22-alahmadi.pdf)
- Abstract: "In an online survey we conducted with security practitioners (n = 20) working in SOCs, practitioners confirmed the high FP rates of the tools used, requiring manual validation." — [USENIX PDF](https://www.usenix.org/system/files/sec22-alahmadi.pdf)
- Abstract: "Our results highlight that, despite the perceived volume of FPs, most are attributed to benign triggers--true alarms, explained by legitimate behavior in the organization's environment, which analysts may choose to ignore." — [USENIX PDF](https://www.usenix.org/system/files/sec22-alahmadi.pdf)
- Source of the title: "B3 quantified it as 99%, stating: "We know 99% of the alarms we generate are false positives, but we still have to look at them."" — [USENIX PDF](https://www.usenix.org/system/files/sec22-alahmadi.pdf)

#### Inferences
- The paper supports "alarm validation is manual and tedious, and needs knowledge of the environment". That is the kind of judgement work that AI can speed up but that juniors used to learn by doing.

#### Gaps
- Small qualitative sample from seven SOCs. No measured false-positive rate.

### H25. ISC2 (2025), "2025 ISC2 Cybersecurity Workforce Study"

#### Takeaway
**Verdict: confirmed, with a wording note.** 16,029 respondents; no workforce-gap estimate this year; 5% entry/junior-level respondents; 3% entered through internships or apprenticeships. "39% hiring freeze" means 39% of respondents reported hiring freezes at their organisation. Note: the same page later says "overall average of 34%" for hiring freezes, which looks like an internal inconsistency (34% is the promotion-freeze figure). Cite 39% with the exact wording.

#### Cited Findings
- Bibliographic: ISC2 Insights web report, 4 December 2025; industry survey report (not peer-reviewed). Evidence grade C (large non-probability online survey, July-August 2025). — [ISC2](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study)
- "A record 16,029 cybersecurity practitioners and decision-makers participated in the 2025 study" — [ISC2](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study)
- "Hiring freezes also remained broadly flat, increasing by 1% from 2024 to 39%." — [ISC2](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study)
- Same page, later: "Nearly half (49%) of enterprise organizations are still implementing cybersecurity hiring freezes, significantly higher than the overall average of 34%" — [ISC2](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study)
- "Therefore, ISC2 has not included an estimate of the cybersecurity workforce gap this year." — [ISC2](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study)
- Appendix, Respondent Level: "Entry/junior-level staff 5%" — [ISC2](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study)
- "those who secured a cybersecurity role via an internship or apprenticeship (which only 3% of participants experienced) had the highest rate (69%) of recommending that pathway to others." — [ISC2](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study)

#### Inferences
- With only 5% junior respondents, the study mostly reflects the view of experienced staff on junior pathways.
- Among those aged 21-29, internship or apprenticeship entry is higher (8% within the 38% non-IT, non-cyber-education group), so "3%" describes the whole sample, not young entrants.

#### Gaps
- Only the web version was read, not the PDF report. The 39% vs 34% inconsistency was not resolved.

### H26. ISC2 (2026), "ISC2 Research: Rethinking AI's Impact on Cybersecurity Roles"

#### Takeaway
**Verdict: confirmed.** 856 cybersecurity professionals who use AI in their roles, surveyed in May 2026. 56% say AI reduced the need for entry-level positions; 53% say AI creates new types of entry-level roles; 37% say AI reduced hands-on learning opportunities (36% say it has not).

#### Cited Findings
- Bibliographic: ISC2 Insights web report, 14 July 2026; industry survey report (not peer-reviewed). Evidence grade C (non-probability survey of AI users). — [ISC2](https://www.isc2.org/Insights/2026/07/rethinking-ai-impact-on-cybersecurity-roles)
- "in May 2026 ISC2 conducted a survey of 856 cybersecurity professionals who use AI in their roles." — [ISC2](https://www.isc2.org/Insights/2026/07/rethinking-ai-impact-on-cybersecurity-roles)
- "The majority of participants (56%) said that AI has somewhat or significantly reduced the need for entry-level positions over the past year." — [ISC2](https://www.isc2.org/Insights/2026/07/rethinking-ai-impact-on-cybersecurity-roles)
- "Over half of participants (53%) believe that AI is creating new types of entry-level roles" — [ISC2](https://www.isc2.org/Insights/2026/07/rethinking-ai-impact-on-cybersecurity-roles)
- "Participants were nearly evenly split on whether they believe AI has reduced hands-on learning opportunities in their workplace, with 37% saying it has and 36% saying it has not." — [ISC2](https://www.isc2.org/Insights/2026/07/rethinking-ai-impact-on-cybersecurity-roles)

#### Inferences
- "56% reduced" and "53% new roles" can both be true: the page frames it as roles "evolving" rather than narrowing.
- The 37% must be cited with its 36% counterpart; it is a split, not a majority.

#### Gaps
- Perceptions of AI users only; no data on actual hiring. Only the web version was read.

### H27. Platform Talent voor Technologie & Dialogic (2024), "Onderzoeksrapportage Onderwijs en Arbeidsmarkt Cybersecurity" (with the "Adviesrapport Onderwijs en Arbeidsmarkt Cybersecurity" in the same PDF)

#### Takeaway
**Verdict: confirmed, with an important definitional caveat.** The figures are in the report. But the 19,000 vacancies for 2022 use a broad definition that includes a "Cybersecurity – laag" category, which the authors themselves advise not to count as cybersecurity professionals. With narrower definitions the report gives 4,200 to 18,900, and CBS / pr-eDICT come to about 4,000. The ~3,000 per year is the inflow into higher education (hbo and wo) programmes with a "relevant" cyber component.

#### Cited Findings
- Bibliographic: Platform Talent voor Technologie (PTvT) & Dialogic, "Onderzoeksrapportage Onderwijs en Arbeidsmarkt Cybersecurity", commissioned by the Ministry of Economic Affairs and Climate (EZK); research period September 2023 to February 2024. The report carries no date in its text. It was sent to the House as annex (bijlage 1142874) to the Kamerbrief of 15 March 2024 (Kamerstuk 26643, nr. 1164; published 16 May 2024). Government-commissioned report (grey literature, not peer-reviewed). Evidence grade B for the vacancy counts (Jobdigger vacancy data, 2018-2022), C for the qualitative parts. — [open.overheid.nl PDF](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file), [Kamerstuk 26643-1164](https://zoek.officielebekendmakingen.nl/kst-26643-1164.html), [Dialogic](https://dialogic.nl/en/projecten/onderwijs-en-arbeidsmarkt-cybersecurity)
- Summary: "In de vacatureanalyse is een groeiende vraag naar cybersecurity expertise te zien op de arbeidsmarkt: van circa 8.000 in 2018 tot circa 19.000 in 2022, voor zowel de specialistische cybersecurityprofielen als de bredere functieprofielen waar cybersecurity een onderdeel van uitmaakt." — [PDF](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file)
- Definitions (p. 36): "Binnen dit onderzoek is er een bredere operationalisering van cybersecurity gebruikt, en komen we tot 4.200 – 18.900 vacatures afhankelijk van de gekozen benadering. Wij zouden niet aanraden om de categorie `Cybersecurity – laag' mee te tellen als cybersecurity professionals" — [PDF](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file)
- Seniority: "Hieruit blijkt dat, voor zover bekend, circa driekwart van de vacatures betrekking heeft op medior- en seniorfuncties." — [PDF](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file)
- Inflow: "De instroom van studenten met een relevant onderdeel cybersecurity in hun studie blijft de laatste drie jaren redelijk gelijk; rond de 3000 studenten jaarlijks." (section on hbo and wo) — [PDF](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file)
- Junior match: "Bij het hoger onderwijs zien we relatief te weinig hbo en wo-gediplomeerden met een specialistisch cybersecurity profiel afstuderen ten opzichte van de vraag op de arbeidsmarkt. Het aantal ho-gediplomeerden dat een `substantiële' component cybersecurity in de opleiding heeft gehad is echter op peil met de vraag." — [PDF](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file)
- Skills: "Over de hele linie is er relatief veel technische kennis vereist om actief te zijn binnen de cybersecurity, maar de benodigde vaardigheden en uit te voeren taken zijn daarentegen voor een groot deel niet-technisch van aard." — [PDF](https://open.overheid.nl/documenten/c0ac3595-28e3-43df-aa85-7d9e8a426c25/file)

#### Inferences
- The shortage is at medior and senior level; the report puts the main task in lifelong learning (LLO), not in more junior graduates.
- "Largely non-technical" must keep its first half: technical knowledge is still required.

#### Gaps
- Vacancies are a proxy for demand (the report says so). Data end in 2022, before the generative-AI wave.

### H28. Cyberbeveiligingswet (Netherlands, 2026): Act of 8 July 2026, Stb. 2026, 187; entry into force set by the Cyberbeveiligingsbesluit, Stb. 2026, 189

#### Takeaway
**Verdict: corrected (citation) and partly unconfirmed (numbers).** In force on 15 August 2026: confirmed. But Staatsblad 2026, 189 is the Cyberbeveiligingsbesluit (the implementing decree that also sets the date). The Act itself is Staatsblad 2026, 187. "Ruim 8000 organisaties" is confirmed by the Rijksoverheid news item of 7 July 2026. The "~1,000 organisations" under the old Wbni is not in either source; we could not confirm it.

#### Cited Findings
- Type: Dutch Act (wet) implementing Directive (EU) 2022/2555 (NIS2), replacing the Wbni. Normative. — [Stb. 2026, 187](https://zoek.officielebekendmakingen.nl/stb-2026-187.html)
- Stb. 2026, 187: "Wet van 8 juli 2026, houdende regels ter implementatie van Richtlijn (EU) 2022/2555"; published 10-07-2026. Art. 107: "Deze wet treedt in werking op een bij koninklijk besluit te bepalen tijdstip" — [Stb. 2026, 187](https://zoek.officielebekendmakingen.nl/stb-2026-187.html)
- Stb. 2026, 189: "Besluit van 8 juli 2026, houdende regels ter uitvoering van de Cyberbeveiligingswet en tot vaststelling van het tijdstip van inwerkingtreding van de Cyberbeveiligingswet (Cyberbeveiligingsbesluit)". Art. 35: "De Cyberbeveiligingswet en dit besluit treden in werking met ingang van 15 augustus 2026." — [Stb. 2026, 189](https://zoek.officielebekendmakingen.nl/stb-2026-189.html)
- Rijksoverheid, 7 July 2026: "De wetten treden op 15 augustus 2026 in werking. Vanaf dat moment gelden nieuwe verplichtingen voor ruim 8000 organisaties in Nederland op het gebied van cyberbeveiliging." — [Rijksoverheid](https://www.rijksoverheid.nl/actueel/nieuws/2026/07/07/cyberbeveiligingswet-en-wet-weerbaarheid-kritieke-entiteiten-vanaf-15-augustus-2026-van-kracht)

#### Inferences
- More organisations under a duty of care and board responsibility means more demand for people who can do secure development and incident work, also in non-IT sectors.

#### Gaps
- The Wbni baseline ("~1,000") needs its own source (for example the explanatory memorandum to the Cbw or an NCSC/NCTV page). Until then, write "from a much smaller group under the Wbni to more than 8,000".

### H29. Regulation (EU) 2024/2847 (Cyber Resilience Act)

#### Takeaway
**Verdict: confirmed, two precision fixes.** Article 14 applies from 11 September 2026; the rest from 11 December 2027 (Chapter IV from 11 June 2026). 24 h early warning and 72 h notification: confirmed for actively exploited vulnerabilities (and severe incidents). Annex I wording: products must be "made available on the market" (not "placed") without known exploitable vulnerabilities and with a secure by default configuration, "on the basis of the cybersecurity risk assessment ... and where applicable". The SBOM duty is in Annex I Part II point (1).

#### Cited Findings
- Bibliographic: Regulation (EU) 2024/2847 of the European Parliament and of the Council of 23 October 2024 on horizontal cybersecurity requirements for products with digital elements (Cyber Resilience Act), OJ L, 2024/2847, 20.11.2024. Normative. — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng) (text read via the Publications Office copy of the same OJ document: [cellar](https://publications.europa.eu/resource/celex/32024R2847))
- Art. 14(2)(a): "an early warning notification of an actively exploited vulnerability, without undue delay and in any event within 24 hours of the manufacturer becoming aware of it" — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng)
- Art. 14(2)(b): "unless the relevant information has already been provided, a vulnerability notification, without undue delay and in any event within 72 hours of the manufacturer becoming aware of the actively exploited vulnerability" — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng)
- Art. 71(2): "This Regulation shall apply from 11 December 2027. However, Article 14 shall apply from 11 September 2026 and Chapter IV (Articles 35 to 51) shall apply from 11 June 2026." — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng)
- Annex I, Part I(2): "On the basis of the cybersecurity risk assessment referred to in Article 13(2) and where applicable, products with digital elements shall: (a) be made available on the market without known exploitable vulnerabilities; (b) be made available on the market with a secure by default configuration" — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng)
- Annex I, Part II(1): "identify and document vulnerabilities and components contained in products with digital elements, including by drawing up a software bill of materials in a commonly used and machine-readable format covering at the very least the top-level dependencies of the products" — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng)
- Commission CRA reporting page: "As of 11 September 2026, manufacturers are required to report actively exploited vulnerabilities and severe incidents impacting the security of products with digital elements." and "They need to submit an early warning within 24 hours of becoming aware, and a full notification within 72 hours." — [European Commission](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting)

#### Inferences
- Art. 69(3) (transitional) makes Article 14 apply also to products placed on the market before 11 December 2027. So reporting already applies to software that juniors work on today.

#### Gaps
- None for the claims checked.

### H30. Souppaya, Scarfone & Dodson (2022), NIST SP 800-218, "Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities"

#### Takeaway
**Verdict: confirmed.** PO.2.2 (task: role-based training), PW.5 (practice: secure coding) and PW.7 (practice: review and/or analyse human-readable code) exist with the stated content. SP 800-218 Rev. 1 (SSDF v1.2) is still an initial public draft as of 13 November 2026 (published 17 December 2025, comments closed 30 January 2026; no later draft or final on CSRC).

#### Cited Findings
- Bibliographic: NIST Special Publication 800-218, February 2022, DOI 10.6028/NIST.SP.800-218. Government standard/guidance. Normative (voluntary framework). — [CSRC](https://csrc.nist.gov/pubs/sp/800/218/final)
- PO.2.2: "Provide role-based training for all personnel with responsibilities that contribute to secure development. Periodically review personnel proficiency and role-based training, and update the training as needed." — [NIST PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf)
- PW.5: "Create Source Code by Adhering to Secure Coding Practices (PW.5)"; PW.5.1: "Follow all secure coding practices that are appropriate to the development languages and environment to meet the organization's requirements." — [NIST PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf)
- PW.7: "Review and/or Analyze Human-Readable Code to Identify Vulnerabilities and Verify Compliance with Security Requirements (PW.7)" — [NIST PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf)
- Rev. 1: "NIST SP 800-218 Rev. 1 (Initial Public Draft) Secure Software Development Framework (SSDF) Version 1.2"; "Date Published: December 17, 2025"; "Comments Due: January 30, 2026 (public comment period is CLOSED)"; DOI 10.6028/NIST.SP.800-218r1.ipd. — [CSRC](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd)

#### Inferences
- PO.2.2 makes training role-based and recurring, which matches the SAMM level-2 idea (H33).

#### Gaps
- None for the claims checked. Call it "practice PW.5/PW.7" and "task PO.2.2".

### H31. ISO/IEC 27001:2022, Annex A control 8.28 "Secure coding"

#### Takeaway
**Verdict: confirmed (secondary source).** ISO/IEC 27001:2022 (edition 3, 2022-10) has 93 Annex A controls, of which 11 are new; 8.28 Secure coding is one of them.

#### Cited Findings
- Bibliographic: ISO/IEC 27001:2022, Information security, cybersecurity and privacy protection — Information security management systems — Requirements, edition 3, October 2022. International standard. Normative. — [ISO](https://www.iso.org/standard/27001)
- DQS (certification body): "Annex A of the new ISO/IEC 27001:2022 version now includes a total of 93 controls, of which the following 11 controls are new:" (list includes "A.8.28 Secure coding"). — [DQS](https://www.dqsglobal.com/gb-en/blog/new-iso-27001-2022-key-changes)
- DQS: "ISO ... has included "Secure Coding" as a new control 8.28 in the new ISO/IEC 27002 and ISO/IEC 27001:2022 , Annex A standards." — [DQS](https://www.dqsglobal.com/en/explore/blog/secure-coding-challenge-in-information-security)

#### Inferences
- The guidance text for 8.28 is in ISO/IEC 27002:2022; Annex A only names the control.

#### Gaps
- The standard text itself was not read (paywall).

### H32. ENISA (2022), "European Cybersecurity Skills Framework (ECSF)"

#### Takeaway
**Verdict: confirmed, with a nuance.** 12 profiles, none called "software developer". The closest is Cybersecurity Implementer, whose alternative titles include "Cybersecurity Developer" and "DevSecOps Engineer". That profile develops cybersecurity solutions; it is not a general secure-coding developer role.

#### Cited Findings
- Bibliographic: ENISA, European Cybersecurity Skills Framework (ECSF) Role Profiles, September 2022, ISBN 978-92-9204-584-5, DOI 10.2824/859537. EU agency framework. Normative (voluntary). — [ENISA PDF](https://www.enisa.europa.eu/sites/default/files/publications/European%20Cybersecurity%20Skills%20Framework%20Role%20Profiles.pdf)
- ENISA page: "The ECSF summarises the cybersecurity-related roles into 12 profiles" — [ENISA](https://www.enisa.europa.eu/topics/skills-and-competences/skills-development/european-cybersecurity-skills-framework-ecsf)
- The 12 profiles (overview, verbatim): Chief Information Security Officer (CISO); Cyber Incident Responder; Cyber Legal, Policy and Compliance Officer; Cyber Threat Intelligence Specialist; Cybersecurity Architect; Cybersecurity Auditor; Cybersecurity Educator; Cybersecurity Implementer; Cybersecurity Researcher; Cybersecurity Risk Manager; Digital Forensics Investigator; Penetration Tester. — [ENISA PDF](https://www.enisa.europa.eu/sites/default/files/publications/European%20Cybersecurity%20Skills%20Framework%20Role%20Profiles.pdf)
- Implementer: "Alternative Title(s) Information Security Implementer Cybersecurity Solutions Expert Cybersecurity Developer Cybersecurity Engineer Development, Security & Operations (DevSecOps) Engineer"; summary: "Develop, deploy and operate cybersecurity solutions (systems, assets, software, controls and services) on infrastructures and products." — [ENISA PDF](https://www.enisa.europa.eu/sites/default/files/publications/European%20Cybersecurity%20Skills%20Framework%20Role%20Profiles.pdf)

#### Inferences
- The ECSF describes security specialists. Secure coding by ordinary developers falls between frameworks, which is a point the review can make.

#### Gaps
- None for the claims checked.

### H33. OWASP SAMM v2, Governance — Education & Guidance; and OWASP ASVS 5.0.0 (2025)

#### Takeaway
**Verdict: confirmed, small wording fix.** SAMM Training and Awareness level 1 is awareness training "for all personnel involved in software development" (not literally "all"); level 2 is "technology and role-specific guidance". ASVS 5.0.0 was published on 30 May 2025; Level 1 is described as the minimum and the baseline to start from.

#### Cited Findings
- Bibliographic: OWASP Software Assurance Maturity Model (SAMM), Education & Guidance practice, web model page. Community standard. Normative (voluntary). — [OWASP SAMM](https://owaspsamm.org/model/governance/education-and-guidance/)
- SAMM, stream A (Training and Awareness): "Provide security awareness training for all personnel involved in software development." (maturity 1); "Offer technology and role-specific guidance, including security nuances of each language and platform." (maturity 2) — [OWASP SAMM](https://owaspsamm.org/model/governance/education-and-guidance/)
- Bibliographic: OWASP Application Security Verification Standard 5.0.0, released 30 May 2025 (GitHub tag v5.0.0_release). Community standard. Normative (voluntary). — [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/), [GitHub release](https://github.com/OWASP/ASVS/releases/tag/v5.0.0_release)
- ASVS 5.0.0, "What is the ASVS": "This level contains the minimum requirements to consider when securing an application and represents a critical starting point. This level contains around 20% of the ASVS requirements." and "Forking should start with ASVS Level 1 as a baseline, advancing to Levels 2 or 3 based on the application's risk." — [GitHub source](https://github.com/OWASP/ASVS/blob/v5.0.0_release/5.0/en/0x03-What-is-the-ASVS.md)

#### Inferences
- ASVS L1 is small (about 20% of requirements), which makes it a realistic target for student or junior work.

#### Gaps
- SAMM version on the web page is not stated on the practice page itself (the model is SAMM v2).

### H34. UWV, ICT labour-market pages (2023-2026)

#### Takeaway
**Verdict: corrected (source and numbers).** The cited article "Arbeidskrapte ICT'ers neemt af, maar is nog altijd groot" contains none of the four figures. It gives "ruim 5.300" WW benefits in April 2025. The 18,800 (Q4 2025) and 6,200 (February 2026) come from the UWV ICT sector page as it stood in July 2026 (Internet Archive, 14 July 2026). That page now (November 2026) says "iets meer dan 18.900" vacancies in Q2 2026 and "bijna 6.400" WW benefits in July 2026. The +270% for software developers comes from the UWV factsheet "ICT in beeld" of August 2023 and covers the five years up to 2022. "Developers wat makkelijker te vinden" was not found in any UWV source we read; the closest is that webdevelopers show the largest drop in tightness, while still "zeer krap" (UWV, 27 May 2025).

#### Cited Findings
- Type: UWV labour-market information pages and factsheets (Dutch public employment service). Official statistics-based grey literature. Evidence grade B.
- Article as cited: "Toch zijn er relatief weinig ICT'ers met een WW-uitkering. In april 2025 gaat het om ruim 5.300 personen. In totaal werken bijna 560.000 mensen in een ICT-beroep." — [UWV article](https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict/arbeidskrapte-icters-neemt-af-maar-altijd-groot)
- UWV ICT sector page, snapshot 14 July 2026: "In het vierde kwartaal van 2025 stonden er bijna 18.800 ICT-vacatures open." and "In februari 2026 waren het er bijna 6.200." (WW benefits) — [Internet Archive](https://web.archive.org/web/20260714184438/https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict)
- UWV ICT sector page, current (read 13 November 2026): "In het tweede kwartaal van 2026 waren er iets meer dan 18.900 ICT-vacatures." and "In juli 2026 waren het er bijna 6.400." — [UWV](https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict)
- UWV factsheet "ICT in beeld" (August 2023): "Met name de vraag naar softwareontwikkelaars (+270%) en securityspecialisten (+167%) is in de afgelopen 5 jaar sterk toegenomen." — [UWV PDF](https://www.uwv.nl/assets-kai/files/6e32b054-43eb-4133-95ae-affc3c234e4f/Factsheet_ict.pdf)
- UWV "ICT-beroepen in beeld" (27 May 2025): "Webdevelopers laten de grootste daling van de krapte zien. Overigens blijft de typering van de spanning voor vrijwel alle ICT-beroepen, ook voor de webdevelopers, na deze daling nog altijd `zeer krap'." — [UWV PDF](https://www.uwv.nl/assets-kai/files/7bb39f40-eed5-4c0f-a869-c417416f0bf4/ICT-beroepen-in-beeld.pdf)
- Article, entry for starters: "Ook worden minder vaak zij-instromers aangenomen. Hierdoor is het voor werkzoekenden moeilijker om in de branche te starten." — [UWV article](https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict/arbeidskrapte-icters-neemt-af-maar-altijd-groot)

#### Inferences
- The trend is stable across versions: fewer vacancies, more WW benefits since 2023, still "zeer krap". Use the current numbers with their dates.
- The +270% describes 2017-2022 demand, before the drop. Using it next to 2026 figures without a date would mislead.

#### Gaps
- "Wat makkelijker te vinden" not found. If it comes from a UWV podcast or another page, add that source; otherwise drop the quote.

### H35. NCSC (2024), "ICT-beveiligingsrichtlijnen voor webapplicaties"

#### Takeaway
**Verdict: confirmed, date nuance.** Title confirmed. The colophon says "mei 2024"; the file name says "07-24". Cite as May 2024 (the colophon is the document's own date).

#### Cited Findings
- Bibliographic: Nationaal Cyber Security Centrum (NCSC), "ICT-beveiligingsrichtlijnen voor webapplicaties", Den Haag, mei 2024. Government guideline (not legally binding: "Deze informatie is niet juridisch bindend."). Normative (guidance). — [NCSC PDF](https://www.ncsc.nl/api/media/sites/default/files/Richtlijn%20ICT%20beveiligingsrichtlijnen%20webapplicaties%2007-24_0.pdf), [NCSC page](https://www.ncsc.nl/webapplicaties/ict-beveiligingsrichtlijnen-webapplicaties)
- Colophon: "Publicatie Nationaal Cyber Security Centrum (NCSC) ... mei 2024 Deze informatie is niet juridisch bindend." — [NCSC PDF](https://www.ncsc.nl/api/media/sites/default/files/Richtlijn%20ICT%20beveiligingsrichtlijnen%20webapplicaties%2007-24_0.pdf)
- NCSC page: "Sinds 2012 publiceert het NCSC ICT-beveiligingsrichtlijnen voor webapplicaties. Deze richtlijnen zijn nu bijgewerkt naar de huidige tijd." — [NCSC page](https://www.ncsc.nl/webapplicaties/ict-beveiligingsrichtlijnen-webapplicaties)

#### Inferences
- A Dutch, free reference for web application security that maps to the SIVA framework; usable next to ASVS.

#### Gaps
- The NCSC landing page shows the file with date 17-4-2026 (upload date on the new site), not a new edition. We found no edition after May 2024.

### Corrections for the review (part 2)

1. **H19 Braz et al.:** "~8 times more likely" → "about eight times higher odds of finding the vulnerability (odds ratio)". "An OWASP checklist" → "a security checklist derived from the OWASP code review checklist (22 items), or a tailored 7-item version, added no significant improvement". Add: most participants were professionals (71% with 3+ years).
2. **H18 Naiakshina 2017:** keep "none of the 10 non-primed students", and add "even when asked, only 4 of 10 stored passwords securely". **Naiakshina 2019:** cite only the abstract wording ("freelancers do not store passwords securely unless prompted"); no counts until the full text is checked.
3. **H21 Weir et al.:** replace title and authors with: Weir, C., Becker, I., Noble, J., Blair, L., Sasse, M. A., & Rashid, A. (2020). Interventions for long-term software security: Creating a lightweight program of assurance techniques for developers. Software: Practice and Experience, 50(3), 275-298. https://doi.org/10.1002/spe.2774. Rephrase: "six hours of workshops over three months in three organisations; at twelve months the change was still visible in the two teams that could be re-interviewed".
4. **H23 Tompkins et al.:** venue → "ACM CCS 2026, pp. 1820-1834, DOI 10.1145/3830454.3846694". "Reactive conversations were associated with lower completion" → "...with lower completion than short, focused conversations (8 of 9 modules); the difference with proactive conversations was small and not significant per module (correlational)". "40.6% trusted" and "57.3% reduced or stopped" → "of the 293 survey respondents".
5. **H24 Alahmadi et al.:** "most alarms are false positives" → "SOC analysts validate alarms manually and perceive very high false-positive rates (one analyst: '99%'); the authors find that many of these 'false positives' are benign triggers, true alarms caused by legitimate activity".
6. **H25 ISC2 2025:** "39% hiring freeze" → "39% of respondents reported hiring freezes at their organisation". Optionally note the page also says "overall average of 34%". The other figures stand.
7. **H26 ISC2 2026:** add the respondent frame: "a May 2026 survey of 856 cybersecurity professionals who use AI in their roles". Cite 37% together with "36% said it has not".
8. **H27 Dialogic/PTvT:** title "Onderzoeksrapportage Onderwijs en Arbeidsmarkt Cybersecurity" (PTvT & Dialogic, for EZK; sent to the House with the Kamerbrief of 15 March 2024, Kamerstuk 26643, nr. 1164). Add to the vacancy claim: "using a broad definition; narrower definitions give about 4,000-4,200 in 2022". "~3,000 students/year start programmes with a substantial cyber component" → "about 3,000 students a year start hbo/wo programmes with a relevant cybersecurity component". "Tasks/skills largely non-technical" → keep "although much technical knowledge is required".
9. **H28 Cyberbeveiligingswet:** cite the Act as Stb. 2026, 187 (Wet van 8 juli 2026) and the entry into force as Cyberbeveiligingsbesluit, Stb. 2026, 189, art. 35. Drop "~1,000" or find a source; write "applies to more than 8,000 organisations (Rijksoverheid, 7 July 2026)".
10. **H29 CRA:** "placed on the market" → "made available on the market"; add "on the basis of the risk assessment and where applicable". Make clear the 24 h / 72 h deadlines concern actively exploited vulnerabilities (and severe incidents). Chapter IV applies from 11 June 2026 if mentioned.
11. **H30 NIST SSDF:** "PO.2.2" is a task, PW.5 and PW.7 are practices. SP 800-218r1 (v1.2): "initial public draft of 17 December 2025; comment period closed 30 January 2026; not final as of November 2026".
12. **H32 ECSF:** add "the Implementer profile lists 'Cybersecurity Developer' and 'DevSecOps Engineer' as alternative titles, but it covers building security solutions, not secure coding by general developers".
13. **H33 OWASP:** SAMM level 1 → "awareness training for all personnel involved in software development". ASVS → "ASVS 5.0.0 (30 May 2025); Level 1 is the minimum and the recommended baseline".
14. **H34 UWV:** replace the source and the numbers. Either "about 18,800 ICT vacancies in Q4 2025 and about 6,200 WW benefits in February 2026 (UWV ICT sector page, July 2026 version)" or, preferably, the current figures: "just over 18,900 ICT vacancies in Q2 2026 and almost 6,400 WW benefits in July 2026 (UWV, read 13 November 2026)". Cite +270% as "demand for software developers rose 270% in the five years up to 2022 (UWV, ICT in beeld, August 2023)". Drop "developers wat makkelijker te vinden" unless a source is found; the closest supported statement is "webdevelopers show the largest drop in labour-market tightness, but it remains 'zeer krap' (UWV, May 2025)".
15. **H35 NCSC:** date → "mei 2024" (colophon).
16. **No change needed:** H17 Votipka et al., H20 Nguyen et al., H22 Lam et al., H31 ISO/IEC 27001:2022 control 8.28.
