# CA 3 Step-by-Step Guide: Uber Driver Tipper (Mamdani FLC + GA + PSO)

Files: `uber_tipper_demo.m` (the whole demo), `VIVA_QA.md` (Part F + Parts A-D for answers).
The code was not run when written (no MATLAB on the build machine), so Step 1 is not optional.

---

## Step 0: One-night-before setup (15 min)
1. Open MATLAB. Type `ver` and confirm both are listed:
   - **Fuzzy Logic Toolbox**
   - **Global Optimization Toolbox** (provides `ga` and `particleswarm`)
2. `cd` to the `softcomputing` folder. Type `which mamfis ga particleswarm`; all three should print a path.
3. Needs MATLAB R2018b or newer (`mamfis`). If you only have an older version, tell me and I'll rewrite with `newfis`.

## Step 1: Run it and fix problems (20 min)
Run `uber_tipper_demo` in the Command Window. You should get 6 figures and this printout:
```
Baseline RMSE = ...
Example: service=8, punctuality=6 -> tip = ...
GA : centres=[...] RMSE=... time=...
PSO: centres=[...] RMSE=... time=...
  Method   RMSE   Time_s
```
Common problems:

| Symptom | Cause | Fix |
|---|---|---|
| `Undefined function 'ga'` / `particleswarm` | Optimization toolbox missing | Install via Add-Ons, or ask me for a no-toolbox version |
| `Undefined function 'mamfis'` | Old MATLAB or no Fuzzy toolbox | Install, or ask me for the `newfis` version |
| Error about local functions | Script must have functions at the end (R2016b+) | Update MATLAB, or split the 2 functions into their own files |
| Figures overlap | Normal | Use the figure window titles |
| Different numbers each run | Should not happen (`rng(1)` is set) | Check the line is still there |

**Write down your final numbers** (baseline / GA / PSO RMSE and times). The viva will ask for them.

## Step 2: Understand each section (30 min)
Open `uber_tipper_demo.m` and read it top to bottom.

| Section | What it does | Be ready to say |
|---|---|---|
| 1. Target policy | 11x11 grid of (service, punctuality) with a "desired" tip = 2 + 1.5*(0.7*service + 0.3*punctuality) | "This is the tipping behaviour I want the FLC to imitate; service matters more than punctuality." |
| 2. Baseline FLC | `buildTipper([5 12.5 20])`, MF and surface plots | "Hand-picked tip levels: my starting point." |
| 3. GA | `ga` over 3 variables (the output centres) with bounds | "Each chromosome is [c1 c2 c3]; fitness is RMSE vs target." |
| 4. PSO | `particleswarm`, same bounds and cost | "Second optimiser to verify and compare." |
| 5. Comparison | Tip vs service curves + results table | "Both optimisers reduce the error; here is by how much." |
| `buildTipper` | The FLC: 2 inputs x 3 MFs, 3 output MFs, 3 rules | Explain every MF and rule |
| `tipCost` | RMSE of FLC output vs target | "The objective both optimisers minimise." |

## Step 3: Learn the system design (the heart of the viva)
- **Inputs:** service quality 0-10 (poor, good, excellent), punctuality 0-10 (late, on-time, prompt).
- **Output:** tip 0-25 % (low, medium, high). The triangles have a half-width of 5 around the centres.
- **Rules (3):**
  1. service poor OR punctuality late then tip low
  2. service good then tip medium
  3. service excellent OR punctuality prompt then tip high
- **Engine:** Mamdani, AND = min, OR = max, implication = min, aggregation = max, defuzzification = centroid.
- **Why these choices:** see `VIVA_QA.md` Part F and Part A (Q4-Q14).

## Step 4: Rehearse the demo (follow this order, about 5-7 min)
1. **Introduce (30 s):** "Problem: a rider decides the tip for an Uber driver from service quality and punctuality. I built a Mamdani fuzzy controller and optimised it with a GA, then validated with PSO."
2. **Show the MFs (45 s):** run section 2; point at each input plot, then the output plot.
3. **Show the surface (30 s):** "Tip rises smoothly with both inputs; service has more influence because rules 1 and 2 hinge on it."
4. **Show one example (20 s):** read the printed example.
5. **Run the GA (60 s):** show the convergence plot: "best fitness falls and flattens, so the GA converged."
6. **Run PSO (45 s):** show its plot, compare the shapes.
7. **Show the comparison (60 s):** read the table, then the overlaid curves: "Both tuned controllers track the target more closely than the baseline."
8. **Conclude (30 s):** state which optimiser did better and give a reason. Mention an extension (third input, Sugeno, MF-shape tuning).

Tip: to avoid waiting for live runs, run the script once before the demo and keep the figures open. Rerun live only if asked.

## Step 5: Prepare your output evidence (10 min)
- Save screenshots of: MFs, control surface (baseline and GA), GA convergence, PSO convergence, comparison plot, results table.
- `ruleview(fis0)` (uncomment in section 2) is a good show-off for the viva: drag the inputs and watch the tip change.
- Optionally export the FIS: `writeFIS(fis0,'uber_tipper')` to keep a file copy.

## Step 6: Viva drilling (60 min)
1. Read `VIVA_QA.md` Part F (the topic) and Part A (concepts).
2. Do Part C (rapid-fire) out loud, twice.
3. Do Part D (tough follow-ups).
4. Be ready to hand-draw: the MF plots, the rule table, the GA flowchart, and the PSO equation.

Must-know one-liners:
- Mamdani: fuzzy output, centroid defuzzification, interpretable. Sugeno: crisp output, faster, good for tuning.
- GA = selection + crossover + mutation + elitism. PSO = velocity update toward `pbest` and `gbest`.
- RMSE = square root of the mean squared gap between FLC output and target tip.

## Step 7: Likely "change it live" requests and how to handle them

| Examiner asks | What to change | Where |
|---|---|---|
| "Use Sugeno" | Replace `mamfis` with `sugfis`; output MFs become constants (`'constant'`); no centroid | `buildTipper` |
| "Add one more input (fare)" | Add input + 3 MFs, extend rules to 3 columns before the output | `buildTipper`, target and `X` |
| "Change the MF shapes" | Replace `'trimf'` with `'gaussmf'` / `'trapmf'` and new parameters | `buildTipper` |
| "More rules" | Add rows to the `rules` matrix (service x punctuality, 9 rules) | `buildTipper` |
| "Change defuzzification" | `'DefuzzificationMethod','mom'` (or `bisector`) | `buildTipper` |
| "Other optimiser" | `simulannealbnd(cost,x0,lb,ub)` | section 4 |
| "Why not tune input MFs too?" | Put input MF breakpoints in the chromosome and rebuild the FIS in the cost function | explain, or ask me to code it |

If a live change is risky, say what you would change and why, then show the change if time allows.

## Step 8: Day-of checklist
- [ ] MATLAB open, folder set, toolboxes confirmed.
- [ ] Script run once, figures ready, numbers noted.
- [ ] Can explain every line of `buildTipper` and `tipCost`.
- [ ] Can compare GA vs PSO using your own numbers.
- [ ] Know two limitations (hand-designed rules, no formal stability or optimality guarantee) and two extensions.
