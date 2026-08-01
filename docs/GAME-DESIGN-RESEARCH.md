# LinguaDrive — game-design research brief (2026-08-01)

> Commissioned answer to: "what separates *top games ever* — especially habit-forming learning
> games — from good ones, and which mechanics would raise LinguaDrive to that level?"
> Every claim carries a fetched source. Constraints respected throughout: static PWA on GitHub
> Pages, free Supabase (3 tables) only, vanilla JS, RTL Hebrew audience, no dark patterns.

## The one-sentence thesis

LinguaDrive already has the *content systems* of a top learning game; what separates it from
Duolingo-class habit formation is (1) a tended loss-aversion asset (streak insurance + milestones),
(2) a small pond to win in (micro-leagues), (3) a shareable daily artifact, and (4) multiplicative
feedback on its best moment (Turbo combos).

Key negative finding worth internalizing: Duolingo's CPO reports that copying mechanics *without
the underlying driver* fails — their Gardenscapes-style "moves counter" had zero retention impact
and referrals added only ~3%, while streak/notification/leaderboard work drove a 21% CURR gain and
4.5x DAU ([Lenny's Newsletter teardown](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)).

## Ranked mechanics (each with proof + LinguaDrive adaptation)

| # | Mechanic | Proven by | Source | LinguaDrive adaptation |
|---|----------|-----------|--------|------------------------|
| 1 | Streak freeze / forgiveness | Duolingo | [teardown](https://duolingo.deconstructoroffun.com/mechanics/streaks) | ✅ **SHIPPED v2.6.0** — 🛞 spare tire, earned via daily quests, auto-bridges missed days |
| 2 | Streak milestones w/ tangible rewards | Duolingo (+1.7% D7 from ONE animation) | [teardown](https://duolingo.deconstructoroffun.com/mechanics/streaks) | ✅ **SHIPPED v2.6.0** — milestone vehicles at 7/30/100 days |
| 3 | Micro-leagues (~25-person weekly cohorts) | Duolingo (+17% learning time, 3x highly-engaged) | [leagues](https://duolingo.deconstructoroffun.com/mechanics/leagues) | Deterministic weekly bucketing `hash(uid+week)%N` over the existing scores table — no server code |
| 4 | Weekly ceremony (league results reveal) | Duolingo | [leagues](https://duolingo.deconstructoroffun.com/mechanics/leagues) | Sunday "race results" podium screen |
| 5 | Shareable emoji result card | Wordle; Duolingo (5–10x sharing) | [uxmag](https://uxmag.com/articles/the-fascinating-psychology-tricks-that-make-wordle-so-addictive) | RTL emoji-road card for the daily via navigator.share — the app's only free growth channel |
| 6 | Daily scarcity (one shared puzzle) | Wordle | [uxmag](https://uxmag.com/articles/the-fascinating-psychology-tricks-that-make-wordle-so-addictive) | Already built; amplify with countdown + "N played today" |
| 7 | Layered "juice" on scoring | Balatro | [analysis](https://blakecrosley.com/guides/design/balatro) | ✅ **STARTED v2.6.0** (score pop + combo glow); next: rising-pitch tone ladder, digit roll-ups |
| 8 | Flow channel / wave difficulty | Schell/Csikszentmihalyi | [gamedeveloper.com](https://www.gamedeveloper.com/design/game-design-theory-applied-the-flow-channel) | ✅ tiers SHIPPED v2.6.0; next: in-session adaptive targeting ~80% success |
| 9 | Retrieval practice > recognition | Roediger & Karpicke 2006 | [SAGE](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x) | Item format graduates with Leitner box: MCQ → typed → voice |
| 10 | Spacing tuned to retention goal | Cepeda et al. 2008 | [ERIC](https://eric.ed.gov/?id=ED505660) | Recalibrate Leitner to ~1/3/7/21/60 days; show next-review dates |
| 11 | Per-item memory modeling (HLR) | Duolingo ACL'16 (~45% error reduction) | [github](https://github.com/duolingo/halflife-regression) | HLR-lite: per-word half-life in ~30 lines of vanilla JS |
| 12 | Interleaving over blocking | Rohrer RCTs | [source](https://researchingeducation.com/hartwig_rohrer/) | Mix lessons + modes inside review sessions |
| 13 | Comprehensible input (i+1) | Krashen | [wiki](https://en.wikipedia.org/wiki/Input_hypothesis) | Graded mini-sentences per tier — CONSTRAINED: one-time ElevenLabs batch |
| 14 | Endowed progress | Nunes & Drèze (34% vs 19% completion) | [coglode](https://www.coglode.com/nuggets/endowed-progress-effect) | Pre-stamp quest cards / achievements start >0% |
| 15 | Free season pass ("Road Trip" months) | genre-wide | [DoF](https://www.deconstructoroffun.com/blog/2022/6/4/battle-passes-analysis) | Monthly 20-tier JSON manifest fed by existing XP; no paid track ever |
| 16 | Run-based mode w/ build choices | Slay the Spire | [gamedeveloper.com](https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder) | 3-stage "Road Trip Run" with pick-one perks between stages |
| 17 | Metrics-driven balancing | Slay the Spire (90 dashboards) | ibid | Per-word success logging to one new Supabase table |
| 18 | Threshold framing (honest near-miss) | Duolingo promotion marker; near-miss lit is mixed | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7214505/) | Show "18 XP to promotion" style distances; never fake almost-wins |
| 19 | Bounded sessions (insight, not paywall) | Candy Crush lives | [psychologyofgames](https://www.psychologyofgames.com/2013/10/why-you-dont-burn-out-on-candy-crush-saga/) | Cap leaderboard-eligible Turbo at 3/day; positive stop ritual. Never gate learning |
| 20 | Streak-at-risk re-engagement | Duolingo 10pm saves | [Lenny](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) | CONSTRAINED: true push needs a server. Free now: Badging API + in-app banner |

## Deliberately rejected (dark patterns)

Energy/hearts gating of learning, fake urgency, engineered near-misses, pay-anything.
Balatro is the existence proof that zero dark patterns can still be the most habit-forming
game of its year.

## Remaining TOP picks (post-v2.6.0), in order

1. **Micro-leagues + weekly ceremony** (M) — biggest untapped retention lever; pure client math
   over the existing scores table.
2. **Daily share card, Wordle-style** (S) — the only free acquisition channel.
3. **Retrieval-graded item engine + HLR-lite scheduling** (M) — where LinguaDrive can beat
   Duolingo on actual learning.
4. **Turbo juice completion** (S) — tone ladder + digit roll-ups.
5. **Monthly "Road Trip" season track** (M) — connects XP/quests/vehicles into one arc.
6. **Adaptive in-session flow** (M) — 80% success targeting on top of the shipped tiers.
7. **Sentence-level listening (i+1)** (M, one-time audio cost) — the comprehension layer.
