# Beginner's Guide: MATLAB + Fuzzy Logic + GA + PSO + Viva (Uber Tipper)

Written for someone using MATLAB for the first time. Read in order. Plain English first, jargon second.
Your project, in one sentence: **"A fuzzy controller decides an Uber driver's tip from service quality and punctuality, and a Genetic Algorithm and a PSO tune it to match a target tipping policy."**

---

## PART 1: MATLAB in 10 minutes

**What is MATLAB?** A programming environment for numbers, matrices and plots. You type commands or run a script; it calculates and draws graphs. Toolboxes add extra features. You use two: the *Fuzzy Logic Toolbox* and the *Global Optimization Toolbox*.

**The screen (MATLAB Online):**
- **Editor** (top): where your script (`.m` file) lives. Click **Run** to execute it.
- **Command Window** (bottom): where the output text appears (the RMSE numbers, the table, errors in red). You can also type quick commands there.
- **Figure windows:** pop up for each plot.
- **Workspace:** the variables currently in memory (like `pGA`, `JGA`).

**Script vs function**
- A *script* is a list of commands run top to bottom. Yours is a script.
- A *function* is a reusable block with inputs and outputs. Yours has two (`buildTipper`, `tipCost`) at the bottom of the file. Functions at the end of a script are allowed in modern MATLAB.

**Basics you will see in your code**
| Code | Meaning |
|---|---|
| `%` | Comment: ignored by MATLAB, notes for humans |
| `%%` | Starts a *section*, a block you can run alone |
| `x = 5;` | Store 5 in `x`. The `;` hides the output |
| `[1 2 3]` | A row vector (a list of numbers) |
| `0:10` | The numbers 0, 1, 2, ... 10 |
| `X(:,1)` | The first column of matrix `X` |
| `@(p) tipCost(p,X,target)` | A small unnamed function ("handle"); the optimisers call it |
| `fprintf(...)` | Print formatted text |
| `figure(...)` | Open a new plot window |
| `rng(1)` | Fix the random seed so the result is repeatable |
| `clear; clc; close all` | Wipe variables, clear the screen, close figures |
| `tic ... toc` | Stopwatch: measures the run time |

**Useful commands to type in the Command Window**
- `ver`: lists installed toolboxes.
- `pGA`: shows the GA's best answer.
- `evalfis(fisGA,[9 2])`: asks the tuned controller for a tip at service 9, punctuality 2.
- `ruleview(fisGA)`: opens an interactive viewer.
- `help ga` / `doc ga`: documentation.

---

## PART 2: The concepts from zero

### 2.1 Fuzzy logic: "the logic of 'a bit' and 'kind of'"
Normal (crisp) logic: a fact is true or false (1 or 0). Fuzzy logic allows **degrees**: "the driver is 0.7 good". People think this way ("service was pretty good, he was a little late"), so fuzzy logic lets a computer follow human-style rules.

**Fuzzy controller (FLC):** a system that takes numeric inputs, applies IF-THEN rules written in everyday language, and gives a numeric output.

**Analogy:** how you decide a tip. You don't compute a formula. You think "service was great and he was on time, so tip high".

### 2.2 The four steps inside an FLC (memorise these)
1. **Fuzzification:** turn a number into degrees. Service score 7 might be 0.6 "good" and 0.4 "excellent".
2. **Rule evaluation:** check the rules (IF service is good THEN tip is medium). AND uses the smaller degree (min), OR uses the larger (max).
3. **Aggregation:** combine the results of all rules into one shape.
4. **Defuzzification:** turn that shape back into one number. Yours uses the **centroid** (the balance point of the shape).

### 2.3 Key terms
- **Membership function (MF):** a curve that gives the degree (0 to 1) for each input value. Yours are *triangles* (`trimf`), written as `[left peak right]`, e.g. `[0 5 10]` rises from 0 at 0, peaks at 5, falls to 0 at 10.
- **Linguistic variable:** a variable described in words (service: poor / good / excellent).
- **Rule base:** the list of IF-THEN rules. Yours has 3.
- **Universe of discourse:** the range of a variable (service 0-10, tip 0-25).

### 2.4 Mamdani: what the word means
There are two common FLC styles:
- **Mamdani:** the rule outputs are *fuzzy sets* (low / medium / high tip), so a defuzzification step is needed. Easy to read and explain. **This is yours.**
- **Sugeno:** the rule outputs are *numbers or formulas*, so there is no defuzzification (just a weighted average). Faster, good for automatic tuning.

### 2.5 Optimisation: "finding the best settings"
You have settings (the 3 tip-level centres). Some settings give a good controller, some a bad one. **Optimisation** automatically searches for the best settings. "Best" is measured by a number called the **cost** (or **fitness**); lower is better.

**Your cost = RMSE (root mean square error):** the typical gap, in tip %, between your controller's tip and the target tip. RMSE = 1.35 means "off by about 1.35 percentage points on average".

### 2.6 Genetic Algorithm (GA): evolution as a search
**Analogy:** breeding better and better animals.
1. Start with a **population** of random settings (30 candidates). Each candidate is a **chromosome** = `[c1 c2 c3]`.
2. Score each one (**fitness** = RMSE).
3. **Selection:** better ones get picked as parents more often.
4. **Crossover:** two parents mix to make children.
5. **Mutation:** small random changes, so new ideas keep appearing.
6. **Elitism:** the best 2 are copied unchanged so progress is never lost.
7. Repeat for many **generations** (yours: 40).

### 2.7 Particle Swarm Optimisation (PSO): a flock searching for food
**Analogy:** birds searching for food. Each bird remembers the best spot it has found (**pbest**) and hears where the flock's best spot is (**gbest**). Each bird adjusts its flight toward both.
`new speed = inertia*old speed + pull to own best + pull to flock's best`, then move.
No breeding, no mutation: simpler, and usually fast.

### 2.8 GA vs PSO in one line
GA = evolution (crossover and mutation). PSO = flocking (memory and sharing). Both are population-based, derivative-free searchers.

---

## PART 3: Your project in plain English

| Part of the code | What it is | In plain words |
|---|---|---|
| Section 1, `target = ...` | Target policy | "The tips I wish the controller would give." Service counts 70%, punctuality 30%. |
| `buildTipper` | The FLC | 2 inputs x 3 MFs, 1 output with 3 MFs, 3 rules, centroid |
| `p0 = [5 12.5 20]` | Baseline | Hand-picked tip levels: the "before" |
| `tipCost` | Cost function | Build the FLC with these centres, score it against the target, return RMSE |
| `ga(...)` | Genetic Algorithm | Searches for the best 3 centres |
| `particleswarm(...)` | PSO | Does the same search a different way |
| `lb`, `ub` | Bounds | Each centre can only move within a sensible range |
| Section 5 | Comparison | Plots target vs baseline vs tuned, prints the table |

**The 3 rules:**
1. IF service is poor OR punctuality is late THEN tip is low.
2. IF service is good THEN tip is medium.
3. IF service is excellent OR punctuality is prompt THEN tip is high.

---

## PART 4: Reading your output (what each window means)

1. **MFs figure:** the triangles. Overlap means a value can belong partly to two sets.
2. **Control surface (3-D):** for every service/punctuality pair, the tip. It rises smoothly as either input rises. *This is your controller's whole behaviour in one picture.*
3. **GA plot:** blue = best fitness each generation, orange = average of the population. It drops fast then flattens, meaning the GA **converged**. Your best was about **1.347**.
4. **PSO plot:** the same idea for PSO.
5. **Comparison plot:** dashed line = target. Orange (baseline) is too high. The tuned lines hug the target. The GA line can hide under the PSO line if they found the same answer.
6. **Table in Command Window:** RMSE and time for baseline, GA and PSO. Lower RMSE is better.

---

## PART 5: Viva questions with simple answers

### Level 1: Basic (very likely)
1. **What is soft computing?** Techniques like fuzzy logic, neural networks and evolutionary algorithms that handle uncertain, imprecise problems and give good-enough answers, unlike exact (hard) computing.
2. **What is fuzzy logic?** Logic with degrees of truth between 0 and 1 instead of just true or false.
3. **What is an FLC?** A controller that takes inputs, applies IF-THEN fuzzy rules and produces an output.
4. **What is a membership function?** A curve giving the degree (0 to 1) to which a value belongs to a fuzzy set.
5. **Mamdani vs Sugeno?** Mamdani: fuzzy output sets, defuzzification, human-readable. Sugeno: crisp or linear outputs, faster, good for tuning.
6. **What is defuzzification, and which did you use?** Converting the final fuzzy shape into one crisp number. I used centroid, the balance point of the shape.
7. **What is a GA?** A search that evolves a population of candidate solutions using selection, crossover and mutation, guided by fitness.
8. **What is PSO?** A swarm search where each particle moves toward its own best and the swarm's best position.
9. **What is MATLAB?** A numerical computing environment for matrices, plotting and algorithm development.
10. **What toolboxes did you use?** Fuzzy Logic Toolbox and Global Optimization Toolbox.

### Level 2: About your project
11. **Explain your project.** Use the one-sentence summary at the top, then the 7-step story from the earlier explanation.
12. **Inputs and output?** Inputs: service quality and punctuality (0-10). Output: tip percentage (0-25).
13. **How many rules and why?** 3. It keeps the system simple and readable. More rules would give a finer surface.
14. **Why OR in rules 1 and 3?** One bad factor should drag the tip down, and one great factor should lift it.
15. **What did the GA optimise?** The three centres of the low, medium and high tip sets.
16. **What is your fitness function?** RMSE between the controller's tip and the target tip over an 11x11 grid.
17. **What are your GA settings?** Population 30, generations 40, crossover fraction 0.8, 2 elites.
18. **Did GA and PSO give the same answer? Why?** Yes or nearly. The problem has only 3 variables and a smooth cost, so both find the same best region. Agreement between two methods builds trust in the result.
19. **Why is the tuned curve not exactly on the target?** Overlapping triangles with centroid defuzzification can't reproduce every value; the ends get pulled to the middle. About 1.35 tip % is the best this 3-rule design can reach.
20. **What is the target?** A designed tipping policy: `2 + 1.5*(0.7*service + 0.3*punctuality)`. With real data I would use real tips.
21. **Why did you sort the centres?** So low < medium < high always holds.
22. **What is `rng(1)`?** It fixes the random seed so the run is repeatable.
23. **What is ITAE / RMSE?** RMSE is the square root of the average squared error, so large errors count more. (ITAE is from the control-system demo, not this one.)

### Level 3: Tricky
24. **Is a GA guaranteed to find the best answer?** No. It is stochastic and can get stuck in a local optimum, though it usually gets close.
25. **What if mutation is too high or too low?** Too high: random search that never settles. Too low: loses diversity and gets stuck early (premature convergence).
26. **What is premature convergence?** The population becomes too similar too soon, so the search stalls at a non-optimal point.
27. **Why use a GA at all?** Hand-tuning needs trial and error. A GA searches automatically and needs no gradient, so it works even when the cost isn't smooth.
28. **Limitations of your work?** The rules are hand-designed, the target is synthetic, and only the output centres were tuned.
29. **How would you improve it?** Add a third input (fare or trip length), tune the input sets too, use more rules, or try Sugeno.
30. **Real-life use?** Suggested-tip buttons in ride apps, driver rating and incentive systems.
31. **What is the curse of dimensionality in fuzzy systems?** The number of rules grows exponentially with the number of inputs and MFs per input.
32. **Why a second optimiser?** To check the GA result. If two different methods agree, the result is likely good.

---

## PART 6: One-page vocabulary sheet
**Crisp**: exact value. **Fuzzy**: degree 0-1. **MF**: membership curve. **Universe**: range. **Rule base**: IF-THEN list. **Fuzzification**: number to degree. **Inference**: apply rules. **Aggregation**: combine rule outputs. **Defuzzification**: shape to number. **Centroid**: balance point. **Chromosome**: one candidate solution. **Population**: all candidates. **Fitness / cost**: score to minimise. **Selection / crossover / mutation / elitism**: GA operators. **pbest / gbest**: particle's best and swarm's best. **Converge**: stop improving. **RMSE**: typical error size.

---

## PART 7: No-mishap guide

**Before the viva**
- Run the script once and confirm the table prints. Take screenshots as a backup.
- Do not clear the workspace afterwards: `fisGA`, `pGA` and `JGA` are useful for live queries.
- Know the three numbers: baseline RMSE, GA RMSE, PSO RMSE.

**If something fails live**
- Red error text: read it calmly. Missing comma, quote or bracket is the usual cause.
- `Undefined function`: a toolbox is missing; say so and show your screenshots.
- A figure doesn't appear: open the **View** tab or re-run the section (`Run Section`).

**What to say**
- Start with your one-sentence summary, then the detail.
- Use your own words. Faculty can tell memorised sentences from understanding.
- If you don't know: "I'm not sure, but my understanding is..." is far better than a confident wrong answer.
- Never claim something you did not do. Describe exactly what your code does.

**What to avoid**
- Don't say the GA "always finds the best solution".
- Don't say "I just ran the code". Always say what each step does.
- Don't change several things at once if asked for a live change; change one and run.

**Practice plan (about 2 hours)**
1. 20 min: read Parts 1-3 with the code open next to it.
2. 20 min: run the script, then click through each figure and say aloud what it shows.
3. 40 min: say Part 5 answers out loud without looking.
4. 20 min: try two live changes from the cheat sheet (defuzzification, population size).
5. 20 min: explain the whole project to a friend in 5 minutes.
