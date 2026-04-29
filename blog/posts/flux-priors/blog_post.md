# Biologically Inspired Priors over Metabolic Fluxes *(full post coming soon)*

*Tomek Diederen · 2023 · PhD thesis chapter*

---

Metabolic fluxes — the rates at which biochemical reactions proceed inside a living cell — are not free to take any value. They are tightly constrained by the cell's stoichiometry (carbon and nitrogen atoms must balance at each metabolite node) and by enzyme capacity limits. Together these constraints carve out a convex polytope: a high-dimensional geometric object whose interior represents every flux distribution that is simultaneously stoichiometrically balanced and capacity-feasible.

Bayesian inference over fluxes requires placing a prior distribution over this polytope. The choice of prior is not neutral — different priors encode different biological beliefs, and in a regime where data are sparse (a typical ¹³C metabolic flux analysis experiment covers only a handful of labelling measurements), the prior shapes the posterior substantially. This chapter introduces three distinct prior distributions, each capturing a different aspect of biological knowledge.

---

## The Flux Polytope

For a metabolic network with reactions **R** and metabolites **M**, the steady-state flux polytope **F** is defined by stoichiometric equality constraints (**S** · v = 0), non-negativity of forward and reverse fluxes, and upper and lower capacity bounds per reaction. The polytope is typically low-dimensional relative to the number of reactions — stoichiometry collapses many degrees of freedom — and is geometrically irregular, with elongated directions corresponding to exchange fluxes and compact directions reflecting tightly regulated pathways.

Sampling uniformly from **F** using the hit-and-run Markov Chain Monte Carlo algorithm gives a uniform prior, but uniform over the polytope is not biologically neutral: it concentrates mass in corners and along edges, far from the realistic operating range of a cell.

---

## Three Biologically Motivated Priors

**1. The projection prior.** When a reference fluxome is available — perhaps from a published study of the same organism under similar conditions — it is natural to ask that sampled flux vectors are consistent with this reference in a soft sense. The projection prior is constructed by sampling from the polytope and reweighting samples by how well they support the reference, effectively concentrating mass near known operating points while remaining valid over the full feasible space. This is useful when one has strong prior knowledge and wants inference to start close to the right answer.

**2. The flux ratio prior.** High-throughput screening experiments compare many strains or conditions simultaneously. For such comparisons, absolute flux magnitudes matter less than how the cell partitions carbon between competing pathways — for example, how much glucose is routed through glycolysis versus the pentose phosphate pathway. The flux ratio prior places probability mass according to ratios between fluxes rather than their absolute values, making it robust to differences in growth rate across conditions. Practically, this involves sampling flux ratios from a Dirichlet distribution and converting back to polytope coordinates.

**3. The thermodynamic prior.** Thermodynamics constrains the direction of net flux: a reaction can only proceed in the direction of negative Gibbs free energy change. Given metabolite concentration measurements, the sign of each net flux is determined by Δ_r G' = RT · ln(ρ_r), where ρ_r is the exchange flux fraction. Including these thermodynamic constraints as hard conditions on the prior dramatically reduces prior entropy — only the subset of flux distributions compatible with observed metabolite concentrations retains nonzero probability. This prior is most informative when metabolomics data are available alongside the labelling experiment.

---

## Sampling and Rounding

All three priors rely on efficient sampling from the flux polytope. We use a tunable variant of the hit-and-run algorithm operating in the Jones coordinate system — the polytope is first rounded to near-isotropic shape by computing its maximum-volume ellipsoid, which dramatically improves mixing. The rounding step is a one-time preprocessing cost; subsequent sampling is fast.

The three priors represent a spectrum from data-free (thermodynamic) to reference-informed (projection) to comparison-oriented (ratio). Choosing among them is a modelling decision that should be driven by the application: screening versus absolute quantification, data-rich versus data-sparse, single condition versus comparative study.

---

*This work is part of the PhD thesis "Simulation-based metabolic flux inference", ETH Zurich, 2023.*
