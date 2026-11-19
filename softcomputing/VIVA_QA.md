# CA 3 Viva Set: Fuzzy Logic Controller + Genetic Algorithm + PSO (MATLAB)

How to use this: read Part A once, then Part B (the walkthrough of your own code), then drill Part C out loud.
Answers are written the way you would say them. Lines marked **Say it:** are one-breath answers.

---

## PART A: Concepts

### A1. Soft computing

**Q1. What is soft computing?**
A collection of techniques (fuzzy logic, neural networks, evolutionary computation, swarm methods) that tolerate imprecision, uncertainty and approximation to get low-cost, robust solutions. Hard computing needs exact models and exact inputs.
**Say it:** Soft computing gives good-enough answers to problems that are too complex or too vague for exact methods.

**Q2. Why use it instead of conventional control or optimisation?**
- No exact mathematical model is needed (fuzzy rules replace the equations).
- It handles nonlinearity and noise.
- GA and PSO need no gradient, so they work on non-differentiable, multimodal cost functions.
- Rules are human-readable.

**Q3. Name the main components.** Fuzzy logic (approximate reasoning), neural networks (learning), evolutionary algorithms (GA, DE), swarm intelligence (PSO, ACO), and hybrids such as neuro-fuzzy.

---

### A2. Fuzzy logic

**Q4. Crisp set vs fuzzy set?**
Crisp: membership is 0 or 1 (a temperature is "hot" or not). Fuzzy: membership is any value in [0,1] (30°C is 0.6 hot).

**Q5. What is a membership function (MF)? Which types exist?**
A curve mapping each input value to a degree of membership in [0,1]. Types: triangular (`trimf`), trapezoidal (`trapmf`), Gaussian (`gaussmf`), generalised bell (`gbellmf`), sigmoidal. I used triangular because it is simple, cheap to compute and easy to tune.

**Q6. Walk me through the stages of a fuzzy logic controller.**
1. **Fuzzification:** crisp input to membership degrees.
2. **Rule evaluation (inference):** IF-THEN rules; the AND of antecedents uses `min` (or product).
3. **Implication:** each rule's firing strength clips (min) or scales (prod) its output set.
4. **Aggregation:** all clipped output sets are combined with `max`.
5. **Defuzzification:** the aggregated fuzzy set is converted to one crisp output, via centroid in my project.

**Q7. Mamdani vs Sugeno?**

| | Mamdani | Sugeno (TSK) |
|---|---|---|
| Rule output | Fuzzy set | Constant or linear function of inputs |
| Defuzzification | Needed (centroid etc.) | Weighted average, no real defuzzification |
| Interpretability | High | Lower |
| Computation | Heavier | Lighter, faster |
| Best for | Human-knowledge systems, expert systems | Control, optimisation, neuro-fuzzy (ANFIS) |

**Say it:** Mamdani is more intuitive; Sugeno is more efficient and easier to tune with GA or ANFIS.
I chose Mamdani because the viva and demo reward interpretability and the plots (control surface, rule viewer).

**Q8. Defuzzification methods?**
Centroid (centre of area), bisector (splits area in half), MOM/SOM/LOM (mean, smallest, largest of maximum). Centroid is the most common because it gives a smooth output that uses all rules. MOM is faster but jumpy.

**Q9. What is a linguistic variable?** A variable whose values are words, such as error ∈ {Negative, Zero, Positive}, each word being a fuzzy set.

**Q10. What does the control surface show?**
The 3-D input-output map of the FLC (e, de to u). A smooth, monotone surface means well-designed rules; flat patches or ripples show gaps or too few MFs.

**Q11. How many rules do you have and why?**
9 = 3 MFs × 3 MFs (full rule base, every combination covered). Full coverage avoids "no rule fired" cases. With 5 MFs it would be 25 rules: finer control, but more complex.

**Q12. Explain one rule from your project.**
`IF e is Positive AND de is Positive THEN u is Positive`: the output is below the setpoint (error = setpoint − output) and the error is still growing, so the controller pushes up as hard as it can. The rule table is symmetric: error and trend in the same direction give full corrective action, and opposite signs cancel to a mild or zero action.

**Q13. Why normalise to [-1,1] and use scaling gains?**
So one FIS design works for any plant. The real error is multiplied by Ke, and the output by Ku. Changing these gains changes the controller's sensitivity without redesigning the MFs. They are also only 3 numbers, which makes the GA search small and fast.

**Q14. What are the drawbacks of fuzzy control?**
Rules and MFs are designed by trial and error, there is no formal stability proof, and the rule base explodes as inputs increase (curse of dimensionality). That is exactly why I used GA and PSO to tune it.

---

### A3. Genetic Algorithm

**Q15. What is a GA?**
A population-based search inspired by natural selection. It evolves candidate solutions over generations using selection, crossover and mutation, guided by a fitness function.

**Q16. Steps of a GA?**
1. Initialise a random population.
2. Evaluate fitness.
3. Select parents (better fitness, higher chance).
4. Crossover to produce children.
5. Mutate children.
6. Keep elites, form the new generation.
7. Repeat until max generations or a tolerance is reached.

**Q17. What is your chromosome and fitness function?**
- Chromosome: real-valued vector `[Ke Kde Ku]` (three gains).
- Fitness (cost): ITAE of the step response with the FLC in the loop. GA minimises it.

**Q18. What is ITAE and why use it?**
ITAE = ∫ t·|e(t)| dt. The time weighting punishes errors that persist late, so it gives fast settling with small overshoot and little steady-state error. IAE and ISE do not penalise late errors as heavily (ISE punishes big errors, so it tolerates long tails).

**Q19. Roles of selection, crossover, mutation, elitism?**
- **Selection:** pushes the population toward better solutions (exploitation).
- **Crossover:** mixes good parents' traits to create new combinations.
- **Mutation:** random small changes that restore diversity and explore new regions (exploration).
- **Elitism:** the best individuals pass unchanged, so the best fitness never worsens.

**Q20. Your GA settings and why?**
Population 30, 40 generations, crossover fraction 0.8, elite count 2. The search space is only 3-D, so a small population is enough, and it keeps the demo fast because each fitness evaluation runs a whole simulation.

**Q21. What is premature convergence?**
The population becomes too similar too early and gets stuck at a local optimum. Fixes: larger population, higher mutation, lower selection pressure, niching.

**Q22. Effect of changing parameters?**
- Population too small: poor coverage, may miss the optimum.
- Mutation too high: random search, no convergence. Too low: stagnation.
- More generations: better solution, more time.
- Crossover too low: slow progress.

**Q23. How do you know the GA has converged?**
The best-fitness plot (`gaplotbestf`) flattens. The mean fitness approaches the best.

**Q24. Is GA guaranteed to find the global optimum?**
No. It is a stochastic heuristic. It usually gives a near-optimal solution; run it several times (different seeds) and compare. I used `rng(1)` so my results are repeatable.

**Q25. Binary vs real-coded GA?**
Binary: bit strings, bit-flip mutation, needs encoding and decoding. Real-coded: the genes are the actual parameters, better precision and natural for continuous problems like gain tuning. MATLAB `ga` is real-coded by default.

---

### A4. PSO (second optimiser)

**Q26. Explain PSO.**
A swarm of particles flies through the search space. Each particle remembers its own best position (`pbest`) and knows the swarm's best (`gbest`). Its velocity is pulled toward both:

```
v = w*v + c1*r1*(pbest - x) + c2*r2*(gbest - x)
x = x + v
```

- `w`: inertia (exploration vs exploitation).
- `c1`: cognitive pull (own experience).
- `c2`: social pull (swarm experience).
- `r1, r2`: random numbers in [0,1].

**Q27. GA vs PSO?**

| | GA | PSO |
|---|---|---|
| Inspiration | Evolution | Bird flocking |
| Operators | Selection, crossover, mutation | Velocity and position update |
| Memory | None (population only) | pbest and gbest |
| Parameters | More (rates, selection type) | Fewer (w, c1, c2) |
| Speed | Slower | Usually faster on smooth problems |
| Robustness | Good on rugged landscapes | Can converge prematurely |

**Q28. Which one performed better in your run?**
Answer from your own printed table (ITAE and time). Whichever wins, explain it: PSO is often faster because of its shared memory; GA's mutation helps escape local minima. If they are nearly equal, say that the 3-D problem is simple enough that both reach the same basin.

**Q29. Name other optimisers.** Simulated annealing (accepts worse moves with probability e^(-ΔE/T), cooled over time), ACO, differential evolution, tabu search.

---

## PART B: Code walkthrough (explain your own files)

### Step 1: `buildFIS.m`: the controller
- `mamfis(...)` creates a Mamdani system with min for AND, min implication, max aggregation, centroid defuzzification.
- Two inputs `e` and `de` and one output `u`, all on [-1,1].
- Three triangular MFs per variable: N = `[-1 -1 0]`, Z = `[-1 0 1]`, P = `[0 1 1]`.
- `rules` is a matrix with rows `[e_MF de_MF u_MF weight AND]`. For example `3 3 3 1 1` means: IF e is P AND de is P THEN u is P, weight 1, AND-connected.
- **If asked about the rule logic:** error = setpoint − output. A positive error means the output is too low, so the controller must push up (u positive). A positive de means the error is growing, so push even harder. The opposite signs partly cancel and give a mild output.

### Step 2: `simulateFLC.m`: the plant and the cost
- Plant: `x'' + x' + 2x = 2u`, a second-order system with DC gain 1. It is written as two states `x1` (output) and `x2` (its derivative) and integrated with Euler, step 0.05 s over 10 s.
- Each step:
  1. `e = r - x1`, `de = (e - eprev)/dt`.
  2. Multiply by `Ke`, `Kde` and clip to [-1,1] so inputs stay in the FIS universe.
  3. `evalfis` gives the normalised output, then `Ku` scales it.
  4. Update the plant states and accumulate `J += t*|e|*dt`.
- A safeguard returns a huge cost (1e6) if the system blows up, so the optimiser avoids unstable gains.
- The function returns `J` (what GA and PSO minimise), and `t`, `x` for plotting.

### Step 3: `main_demo.m`: the experiment
1. **Show the FLC:** `plotmf` for the MFs, `gensurf` for the control surface (`ruleview` is optional and interactive).
2. **Baseline:** untuned gains `[1 0.1 1]` and its ITAE. This is your "before".
3. **GA:** `ga(cost, 3, ..., lb, ub, [], options)`: 3 variables, bounds `lb`/`ub`, options for population, generations, crossover, elite count and the best-fitness plot.
4. **PSO:** `particleswarm(cost, 3, lb, ub, options)`, same bounds, swarm size and iterations equal to the GA's for a fair comparison.
5. **Comparison:** overlaid step responses of untuned, GA and PSO, plus a table of ITAE and time.

### Demo script (what to say and do in order)
1. "This is a Mamdani FLC with 2 inputs, 9 rules." Show the MF plot and the control surface.
2. "The untuned controller gives this response and ITAE." Show the baseline figure.
3. "A GA tunes the three scaling gains by minimising ITAE." Run it, show the convergence plot.
4. "To check the result I solved the same problem with PSO." Show the PSO plot.
5. "Both beat the baseline; here is the comparison table and the overlaid responses." State which is better and why.
6. Close: "Possible extensions: tune the MF shapes and rules too, or use a Sugeno FIS."

---

## PART C: Rapid-fire practice (answer out loud, then check)

1. Range of membership values? **0 to 1.**
2. Which operator implements fuzzy AND in your project? **min.**
3. Which implements aggregation? **max.**
4. What does `evalfis` do? **Evaluates the FIS for given crisp inputs and returns the crisp output.**
5. What does `gensurf` do? **Plots the FIS input-output surface.**
6. Why clip inputs to [-1,1]? **They must stay inside the MF universe; outside it, no rule fires properly.**
7. Why elitism? **Guarantees the best solution is never lost.**
8. What are `lb` and `ub`? **Lower and upper bounds on each optimisation variable.**
9. What is `rng(1)` for? **Fixed random seed, so the results are reproducible.**
10. What happens if Ku is too large? **Over-aggressive control: oscillation or instability, so ITAE becomes large.**
11. What happens if Ku is too small? **Sluggish response and a long settling time.**
12. Why is the cost 1e6 on blow-up? **A penalty so the optimiser rejects unstable parameters.**
13. Can GA tune MF shapes? **Yes: put the MF parameters (centres and widths) in the chromosome, rebuild the FIS inside the cost function.**
14. How would you convert this to Sugeno? **Use `sugfis`, with constant or linear output MFs; no defuzzification, just a weighted average.**
15. Name two stopping criteria for GA. **Max generations; fitness tolerance or stall generations.**
16. Which is exploration and which is exploitation in GA? **Mutation explores; selection and crossover exploit.**
17. What does inertia `w` do in PSO? **Large w explores widely, small w refines locally.**
18. Is ITAE a good choice for every problem? **No. Choose the metric that matches the goal: ISE for large errors, IAE for equal weighting, ITAE for late errors.**

---

## PART D: Tough follow-ups (examiners love these)

- **"Your GA gave a different answer on a second run. Is it wrong?"** No. It is stochastic. Both runs should reach similar ITAE; compare the fitness, not the exact gains. Several gain combinations can produce a similar response.
- **"Why only tune gains, not the rules?"** Keeps the search space small (3 variables) so the demo is fast and the result is easy to explain. Tuning MFs or rules is the natural extension, at the cost of a bigger search space.
- **"How do you know your FLC is stable?"** Fuzzy control has no simple formal proof; I verified it by simulation (bounded response, settles to the setpoint) and the 1e6 penalty excludes divergent gains.
- **"What if the plant changes?"** Rerun the optimisation with the new plant in `simulateFLC`. The FLC structure stays the same.
- **"Can you use fewer evaluations?"** Yes: a smaller population or fewer generations, a bigger time step, or a surrogate model. The cost is accuracy.
- **"Why compare with PSO at all?"** To validate that the GA result is near the best reachable, and to show understanding of two different search strategies.

---

## Last-minute checklist
- [ ] `main_demo` runs end to end without errors (run it the night before).
- [ ] You can state your ITAE numbers for baseline, GA and PSO.
- [ ] You can sketch the MFs and the rule table from memory.
- [ ] You can write the PSO equation and the GA steps from memory.
- [ ] You know which parts you would change if the examiner changes the plant or the problem.

---

## PART E: Easy-topic version (Restaurant Tipper, `tipper_demo.m`)

If the examiner lets you choose, or you want the simplest story:

- **Problem:** decide the tip % from service quality and food quality (both 0-10).
- **FLC:** Mamdani, 2 inputs x 3 triangular MFs, output tip (0-25 %) with Low/Medium/High.
- **3 rules:** IF service poor OR food poor THEN tip low; IF service good THEN tip medium; IF service excellent OR food delicious THEN tip high.
- **Optimisation:** GA and PSO tune the 3 output MF centres so the FLC matches a target policy (tip = 2 + 1.5*(0.7*service + 0.3*food)). Cost = RMSE over an 11x11 grid.
- **Why this is easy to defend:** no plant simulation, no differential equations; cost is one `evalfis` call on a table, and everything maps to everyday intuition.

**Extra questions for this topic**
1. *Why OR in rules 1 and 3?* A single bad aspect should drag the tip down; a single great aspect should lift it. OR (max) gives that.
2. *Why is rule 2 only on service?* Service is the middle case, so food is "don't care" (0 in the rule matrix).
3. *What does RMSE measure?* The average gap, in tip %, between the FLC output and the target policy; lower is better.
4. *Why sort the centres inside `buildTipper`?* So Low < Medium < High always holds, even if the optimiser proposes an unordered vector.
5. *Why are some target tips unreachable exactly?* Centroid defuzzification of overlapping triangles cannot produce every value; GA/PSO find the closest achievable fit.
6. *How would you apply this to the BiteOrder project?* Use it to suggest a tip on the order summary from a rating form, or a fuzzy delivery-time/priority estimate.

---

## PART F: Announced topic: Uber Driver Tipper (`uber_tipper_demo.m`)

- **Problem:** a rider decides how much to tip an Uber driver (0-25 % of fare) from two inputs scored 0-10:
  1. **Service quality:** politeness, driving, cleanliness (Poor / Good / Excellent).
  2. **Punctuality:** pickup and arrival timing (Late / On-time / Prompt).
- **FLC:** Mamdani, 3 triangular MFs per input, output tip with Low / Medium / High, centroid defuzzification.
- **Rules:**
  1. IF service is poor OR punctuality is late THEN tip is low.
  2. IF service is good THEN tip is medium.
  3. IF service is excellent OR punctuality is prompt THEN tip is high.
- **Optimisation:** GA and PSO tune the 3 output MF centres so the FLC matches a target tipping policy (tip = 2 + 1.5*(0.7*service + 0.3*punctuality)). Cost = RMSE over an 11x11 grid of inputs.

**Questions for this topic**
1. *Why fuzzy for tipping?* Service quality is subjective ("good driver") and a tip is a smooth judgement, not a crisp threshold. Fuzzy rules capture that without a formula.
2. *Why two inputs only?* It keeps the rule base small (3 rules) and the surface easy to show. More inputs, such as fare, trip length or rider mood, would raise the rule count (curse of dimensionality).
3. *Why OR in rules 1 and 3?* One bad factor (rude driver or very late) should pull the tip down; one outstanding factor should lift it.
4. *Why does rule 2 ignore punctuality?* It is the "average" case; 0 in the rule matrix means "input not used".
5. *What do the GA and PSO optimise?* Only the centres of the Low/Medium/High tip MFs, so the tips the FLC produces match the target. Cost = RMSE in tip %.
6. *Why sort the centres?* So Low < Medium < High always holds, even if the optimiser proposes them out of order.
7. *How would you extend it?* Add a third input (fare or trip length), tune input MF shapes too, or switch to Sugeno.
8. *Real-world use?* Suggested-tip buttons in a ride app; driver rating and incentive systems.
9. *Mamdani or Sugeno here, and why?* Mamdani: a fuzzy tip level is natural to explain and the rules are human-readable. Sugeno would be the choice if speed or ANFIS training mattered.
