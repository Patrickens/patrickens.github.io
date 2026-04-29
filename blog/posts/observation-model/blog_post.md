# An Instrument-Faithful Observation Model for Mass Distribution Vectors *(full post coming soon)*

*Tomek Diederen · 2023 · PhD thesis chapter*

---

In ¹³C metabolic flux analysis, fluxes are inferred from isotopic labelling patterns measured by liquid-chromatography mass spectrometry (LC-MS). The instrument does not measure fluxes directly — it measures mass distribution vectors (MDVs): the relative abundances of metabolite fragments that differ only in the number of heavy carbon atoms they contain. Connecting the raw LC-MS output to the flux inference problem requires an observation model, and the choice of that model matters more than the field has historically appreciated.

---

## What an MDV Is

Feed a cell ¹³C-labelled glucose and the carbon atoms travel through the metabolic network, scrambling across dozens of reactions. Metabolites downstream end up as mixtures of isotopically distinct species — mass-isotopomers — that differ by one atomic mass unit each. LC-MS separates these by mass and measures their relative signal intensities, yielding an MDV: a probability vector over isotopomers for each measured metabolite fragment.

The MDV encodes which fraction of each metabolite was synthesised via which pathway. Glycolysis, the pentose phosphate pathway, and the TCA cycle produce characteristic scrambling signatures. Flux inference inverts this: given the observed MDVs, what flux distribution is most likely to have produced them?

---

## Why the Classical Model Is Wrong

The field standard, inherited from the early days of ¹³C-MFA, assumes observation errors are drawn from a multivariate Gaussian with constant covariance. This encodes three assumptions: errors are symmetric (positive and negative deviations are equally likely), their magnitude does not depend on the true signal intensity, and they are uncorrelated across mass-isotopomers of the same metabolite.

All three assumptions are violated in LC-MS data.

**Heteroskedasticity.** LC-MS signals are counts of ion events. At low abundance, shot noise dominates and the standard deviation scales with the square root of the mean. At high abundance, detector saturation and matrix effects introduce proportional errors. Neither regime is well described by a fixed noise level.

**Log-normality.** MDV elements are non-negative ratios that sum to one. Near-zero isotopomers, which are common in highly labelled experiments, have asymmetric uncertainty — they cannot be negative, and their distribution is better described by a log-normal than a Gaussian.

**Correlation.** All isotopomers of a metabolite are measured in the same chromatographic run, from the same sample preparation, at the same retention time. Systematic errors — pipetting volume, ionisation efficiency, baseline drift — affect all isotopomers simultaneously, inducing positive correlations that the classical diagonal covariance matrix ignores.

---

## The Instrument-Faithful Model

We calibrate an observation model on a ground-truth dataset of over 400 LC-MS measurements where the true MDV is known from external constraints. The model has three components:

- **Heteroskedastic log-normal noise**: the standard deviation of each isotopomer measurement scales with its expected value, and the noise is modelled in log-space to respect the non-negativity constraint.
- **Correlated residuals**: a structured covariance matrix captures the within-metabolite correlations arising from shared sample preparation and ionisation.
- **Observation bias**: a systematic shift parameter per metabolite fragment accounts for retention-time-dependent ion suppression effects that introduce a predictable offset.

The corrected model is calibrated using the `emzed3` data processing pipeline, which extracts peak areas and retention times from raw LC-MS files with isotopomer-aware peak picking.

---

## Consequences for Flux Inference

Swapping the classical model for the instrument-faithful one significantly changes posterior beliefs about fluxes — even when conditioning on identical data. The classical model over-weights high-abundance isotopomers (whose apparent precision is artificially high under homoskedastic assumptions) and under-weights rare isotopomers that carry disproportionate information about specific pathway branches.

In a held-out validation on *E. coli* central carbon metabolism, the instrument-faithful model produces posterior flux intervals that are better calibrated: they cover the true flux at the stated credible level, whereas the classical model systematically under-covers at the boundaries of the polytope where noise is largest.

The practical message is simple: the observation model is as much a modelling choice as the prior or the likelihood. Getting it wrong biases every downstream inference, and the bias is not visible from the data alone.

---

*This work is part of the PhD thesis "Simulation-based metabolic flux inference", ETH Zurich, 2023.*
