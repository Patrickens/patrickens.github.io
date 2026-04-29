# Simulation-Based Metabolic Flux Inference *(full post coming soon)*

*Tomek Diederen · 2023 · PhD thesis chapter · [ETH Research Collection](https://www.research-collection.ethz.ch/entities/publication/3f28a9cc-00e3-452d-b2dc-0d77acde6f7c)*

---

Metabolic flux inference connects isotopic labelling measurements to the rates of biochemical reactions inside a cell. The Bayesian formulation is conceptually clean: place a prior over the flux polytope, define a likelihood via an observation model for the labelling data, and update. In practice, computing this posterior is hard — the likelihood involves a non-linear isotopomer simulation, the parameter space is a constrained polytope, and the goal is high-throughput inference across many experiments simultaneously. This chapter develops the algorithmic machinery to make it work.

---

## The Inference Problem

The data in ¹³C metabolic flux analysis consist of mass distribution vectors (MDVs): relative isotopomer abundances measured by LC-MS across a panel of metabolites. Given a flux vector **v** and a substrate labelling pattern, the expected MDV for each metabolite can be simulated by tracing how ¹³C atoms propagate through the network — a process encoded in the Elementary Metabolic Unit (EMU) framework. The likelihood p(data | **v**) requires running this simulation for every proposed flux vector.

Posterior inference via standard MCMC — Hamiltonian Monte Carlo or Metropolis-Hastings — works for a single experiment with a moderate number of parameters, but fails at scale for two reasons. First, the EMU simulation is expensive enough that drawing millions of MCMC samples is prohibitive. Second, fitting many experiments simultaneously requires amortised inference: the posterior should update immediately for any new experiment without rerunning the full sampler.

---

## Algorithms for Sampling Posteriors over Fluxes

**Tunable hit-and-run.** For exact posterior sampling in small problems, we introduce a tunable variant of the hit-and-run Markov chain Monte Carlo algorithm. The standard hit-and-run samples uniformly along chords through the polytope; our tunable version modulates the step-size distribution to concentrate proposals near high-posterior regions, dramatically improving mixing when the posterior is concentrated near a boundary or corner of the polytope. The algorithm adapts to both the likelihood geometry and the polytope shape.

**Sequential Monte Carlo (SMC).** When the likelihood is expensive to evaluate or the posterior is strongly multimodal, sequential Monte Carlo provides an alternative: a population of particles is progressively reweighted through a sequence of intermediate distributions, with resampling and MCMC rejuvenation steps to prevent collapse. SMC is more robust to multimodality than single-chain MCMC and naturally produces marginal likelihood estimates useful for model comparison.

---

## The Bleeding Posterior Problem

A subtle but important failure mode arises in polytope posteriors: **posterior bleeding**. When the maximum a posteriori estimate lies near a boundary of the polytope — which is common when certain fluxes are inferred to be near zero — standard MCMC chains have difficulty mixing across the boundary. The chain concentrates near the boundary but cannot cross it (the boundary is a hard constraint), leading to poor exploration and biased marginals.

We address this through barycentric coordinates: representing flux vectors as convex combinations of polytope vertices rather than Cartesian coordinates places the boundary at the edges of a simplex, where standard reparameterisation tricks apply naturally. Combined with a log-ratio transformation of barycentric weights (Aitchison geometry), this yields an unconstrained representation in which MCMC and gradient-based inference proceed without boundary artefacts.

---

## Normalising Flows for Amortised Inference

The central contribution is a machine learning approach that replaces per-experiment MCMC with a single trained normalising flow. The flow is a neural network that maps a simple base distribution (Gaussian or uniform) to the posterior over fluxes, conditioned on the observed MDV data. Once trained on a dataset of experiments, it produces posterior samples for any new experiment in milliseconds — a speedup of several orders of magnitude over MCMC.

Two architectural innovations make this possible:

**Cylinder embedding.** Fluxes in the thermodynamic coordinate system lie in a polytope with one hyper-rectangular dimension (exchange fluxes) and one polytope dimension (net fluxes). We introduce a cylinder embedding that maps this mixed geometry to a product space — a cylinder — on which standard flow architectures operate without modification. The embedding is a homeomorphism, preserving all topological properties.

**Log-ratio transformation for MDVs.** MDVs are probability vectors (they sum to one). Applying a centred log-ratio (CLR) or isometric log-ratio (ILR) transformation maps them to unconstrained Euclidean space, where the flow's conditioning network processes them as ordinary continuous inputs. This avoids the compositional data problem that arises when treating probability vectors as Euclidean vectors.

The resulting system — neural spline flows conditioned on CLR-transformed MDVs — achieves posteriors competitive with long MCMC runs in a single forward pass, enabling high-throughput flux inference across large experimental panels.

---

*This work is part of the PhD thesis "Simulation-based metabolic flux inference", ETH Zurich, 2023. Code available at [github.com/Patrickens/sbmfi_public](https://github.com/Patrickens/sbmfi_public).*
