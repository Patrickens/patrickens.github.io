# Flows on Convex Polytopes *(full post coming soon)*

*Tomek Diederen & Nicola Zamboni · March 2025 · [arXiv:2503.10232](https://arxiv.org/abs/2503.10232)*

---

Bayesian inference over metabolic fluxes requires sampling from — and evaluating densities over — a convex polytope: the set of all flux distributions compatible with stoichiometry and capacity constraints. Standard machine learning tools for density estimation, including normalising flows and diffusion models, are designed for Euclidean space or simple manifolds like spheres. Applying them naively to a polytope either ignores the boundary constraints (generating invalid samples that violate stoichiometry) or requires expensive rejection steps. This paper introduces a principled framework for fitting flows directly on convex polytopes.

---

## The Central Insight: Polytopes Are Balls

The key mathematical observation is simple but consequential: **any full-dimensional convex polytope is homeomorphic to a unit ball of the same dimension**. There exists a continuous bijection — with a continuous inverse — between the two spaces. This means that any flow defined on the ball can be transferred to the polytope, and vice versa.

The homeomorphism works as follows. First, round the polytope to its John position by computing the maximum-volume ellipsoid (MVE) contained in it; the rounded polytope has the unit ball as its largest inscribed sphere. Then map each interior point of the polytope to the ball by: (1) computing the direction from the origin to the point, (2) finding how far along that direction one can travel before hitting the polytope boundary, and (3) scaling the radial distance by this maximum as a K-th root to spread probability mass smoothly across the ball. The inverse map is equally simple: scale a ball point's radius by the maximum feasible radius in its direction.

This is not just a change of variables — the K-th root scaling ensures that the mapping has bounded Jacobian almost everywhere, which is the property needed for tractable density evaluation.

---

## Two Flow Architectures

With the ball homeomorphism in hand, two flow architectures become available:

**Discrete spline flows on the ball.** We adapt the circular spline flows of Rezende et al. to the ball by decomposing ball coordinates into a polar angle, a radius, and remaining Cartesian coordinates. Circular splines model the angular component; regular splines model the radius. The Jacobian is triangular due to the autoregressive structure of spline flows, making density evaluation efficient. This approach is fast to train and achieves competitive density estimation on flux polytopes.

**Continuous normalising flows via Riemannian flow matching.** In the continuous limit, the discrete sequence of transformations is replaced by an ODE governing the evolution of a probability density across the manifold. The polytope is a Riemannian manifold with a boundary; we equip it with a Euclidean or Poincaré metric and train a neural velocity field to transport a base distribution (uniform over the ball) to the target. The geodesic conditional flow matching loss aligns the velocity field with the shortest-path transport between sample pairs, respecting the manifold geometry. At each integration step, a projection operator maps any point that escapes the polytope back to its boundary.

---

## When Only Vertices Are Known

Many polytopes arising in practice are naturally described by their vertices (the V-representation) rather than their inequality constraints (the H-representation). Converting between the two is computationally expensive in high dimensions. We introduce a flow strategy that operates directly in the V-representation using **maximum-entropy barycentric coordinates**: any interior point is written as a convex combination of vertices, and flows are defined over the weights of this combination using the Aitchison geometry of the simplex.

---

## Results

Experiments on *E. coli* central carbon metabolism flux polytopes show that polytope flows achieve:

- **Competitive density estimation** against MCMC baselines on held-out flux samples
- **Accurate sampling** from complex posterior distributions with multiple modes
- **Fast inference**: once trained, a single forward pass replaces hundreds of MCMC steps

The approach generalises beyond metabolic flux analysis to any inference problem where the parameter space is a convex polytope — including optimal transport, Dirichlet process mixtures, and constrained regression problems.

---

*Diederen, T. & Zamboni, N. (2025). Flows on Convex Polytopes. arXiv:2503.10232.*
