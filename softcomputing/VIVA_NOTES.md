# Viva Notes: FLC + GA + PSO

## What the demo does
Mamdani FLC (2 inputs: error, change of error; 1 output; 9 rules, triangular MFs, centroid) controls a
second-order plant. GA and PSO tune the 3 scaling gains [Ke Kde Ku] to minimise ITAE. Results are compared.

## Fuzzy logic
- Crisp set: membership 0/1. Fuzzy set: membership in [0,1].
- Steps: fuzzification -> rule evaluation (AND=min) -> implication (min) -> aggregation (max) -> defuzzification (centroid).
- Mamdani: fuzzy output sets, needs defuzzification, intuitive. Sugeno: constant/linear output, weighted average, faster, suits optimisation.
- Centroid = centre of area of aggregated set; alternatives: bisector, MOM, SOM, LOM.
- Why scaling gains: map real-world ranges to the normalised universe; tuning them changes sensitivity.

## Genetic Algorithm
- Chromosome = [Ke Kde Ku] (real-coded). Fitness = ITAE (minimise).
- Selection (picks fitter parents), crossover (mixes parents, exploitation), mutation (diversity, exploration), elitism (keeps best).
- Premature convergence: population loses diversity, stuck in local optimum. Fix: higher mutation, bigger population.

## PSO
- v = w*v + c1*r1*(pbest - x) + c2*r2*(gbest - x);  x = x + v.
- No crossover/mutation; particles share information via gbest. Fewer parameters, usually faster; GA is more robust on rugged landscapes.

## Metrics
ITAE = integral of t*|e| dt: penalises late errors, gives low overshoot and fast settling.

## Likely questions
1. Why soft computing over classical PID? (No exact model needed, handles nonlinearity, human-like rules.)
2. Why GA for FLC tuning? (Rule/MF design by hand is trial-and-error; GA searches automatically.)
3. What happens if population is too small / mutation too high?
4. How would you tune the MF shapes or the rule base instead of the gains?
5. GA vs PSO: which did better on your run and why?
