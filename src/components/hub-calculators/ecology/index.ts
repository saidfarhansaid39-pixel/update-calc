import d_biodiversity_index_calculator from './biodiversity-index-calculator'
import d_shannon_index_calculator from './shannon-index-calculator'
import d_simpson_index_calculator from './simpson-index-calculator'
import d_species_richness_calculator from './species-richness-calculator'
import d_species_evenness_calculator from './species-evenness-calculator'
import d_carbon_footprint_calculator from './carbon-footprint-calculator'
import d_co2_emissions_calculator from './co2-emissions-calculator'
import d_carbon_sequestration_calculator from './carbon-sequestration-calculator'
import d_tree_carbon_calculator from './tree-carbon-calculator'
import d_water_footprint_calculator from './water-footprint-calculator'
import d_ecological_footprint_calculator from './ecological-footprint-calculator'
import d_biocapacity_calculator from './biocapacity-calculator'
import d_overshoot_day_calculator from './overshoot-day-calculator'
import d_waste_calculator from './waste-calculator'
import d_recycling_calculator from './recycling-calculator'
import d_population_ecology_calculator from './population-ecology-calculator'
import d_mortality_rate_calculator from './mortality-rate-calculator'
import d_birth_rate_calculator from './birth-rate-calculator'
import d_migration_rate_calculator from './migration-rate-calculator'
import d_population_viability_calculator from './population-viability-calculator'
import d_extinction_risk_calculator from './extinction-risk-calculator'
import d_trophic_level_calculator from './trophic-level-calculator'
import d_biomass_pyramid_calculator from './biomass-pyramid-calculator'
import d_energy_transfer_calculator from './energy-transfer-calculator'
import d_productivity_calculator from './productivity-calculator'
import d_habitat_size_calculator from './habitat-size-calculator'
import d_corridor_width_calculator from './corridor-width-calculator'
import d_habitat_fragmentation_calculator from './habitat-fragmentation-calculator'
import d_invasive_species_calculator from './invasive-species-calculator'
import d_nesting_success_calculator from './nesting-success-calculator'
import d_carbon_footprint_tool from './carbon-footprint-tool'
import d_water_footprint from './water-footprint'
import d_waste_diversion from './waste-diversion'
import d_recycling_savings from './recycling-savings'
import d_compost_calc from './compost-calc'
import d_rainwater_calc from './rainwater-calc'
import d_tree_carbon_calc from './tree-carbon-calc'
import d_ecological_footprint from './ecological-footprint'
import d_species_richness from './species-richness'
import d_shannon_index from './shannon-index'
import d_simpson_index from './simpson-index'
import d_pielou_evenness from './pielou-evenness'
import d_bray_curtis from './bray-curtis'
import d_jaccard_index from './jaccard-index'
import d_sorensen_index from './sorensen-index'
import d_ace_index from './ace-index'
import d_rarefaction_curve from './rarefaction-curve'
import d_species_accumulation from './species-accumulation'
import d_rank_abundance from './rank-abundance'
import d_dominance_calc from './dominance-calc'
import d_similarity_percentage from './similarity-percentage'
import d_nmds from './nmds'
import d_pca_ecology from './pca-ecology'
import d_cca_analysis from './cca-analysis'
import d_biodiversity_beta from './biodiversity-beta'
import d_species_area_curve from './species-area-curve'
import d_carrying_capacity from './carrying-capacity'
import d_population_growth_lotka from './population-growth-lotka'
import d_predator_prey from './predator-prey'
import d_chao1 from './chao1'
import d_r_k_selection from './r-k-selection'
import d_life_table from './life-table'
import d_survivorship_curve from './survivorship-curve'
import d_age_structure from './age-structure'
import d_population_doubling from './population-doubling'
import d_discrete_growth from './discrete-growth'
import d_matrix_projection from './matrix-projection'
import d_metapopulation from './metapopulation'
import d_minimum_viable from './minimum-viable'
import d_population_viability from './population-viability'
import d_mark_recapture from './mark-recapture'
import d_schnabel_method from './schnabel-method'
import d_removal_method from './removal-method'
import d_distance_sampling from './distance-sampling'
import d_quadrat_sampling from './quadrat-sampling'
import d_point_intercept from './point-intercept'
import d_line_intercept from './line-intercept'
import d_canopy_cover from './canopy-cover'
import d_basal_area from './basal-area'
import d_stem_density from './stem-density'
import d_tree_volume from './tree-volume'
import d_biomass_estimation from './biomass-estimation'
import d_forest_carbon from './forest-carbon'
import d_biomass_expansion from './biomass-expansion'
import d_per_capita_footprint from './per-capita-footprint'
import d_ecosystem_services from './ecosystem-services'
import d_habitat_suitability from './habitat-suitability'
import d_edge_effect from './edge-effect'
import d_patch_metrics from './patch-metrics'
import d_connectivity_index from './connectivity-index'
import d_least_cost_path from './least-cost-path'
import d_circuit_connectivity from './circuit-connectivity'
import d_gap_analysis from './gap-analysis'
import d_reserve_design from './reserve-design'
import d_climate_envelope from './climate-envelope'
import d_species_distribution from './species-distribution'
import d_bioclim from './bioclim'
import d_range_shift from './range-shift'

import type { CalcDef } from '../../../lib/generic-fallback'

export const calcDefs: Record<string, CalcDef> = {
  'biodiversity-index-calculator': d_biodiversity_index_calculator,
  'shannon-index-calculator': d_shannon_index_calculator,
  'simpson-index-calculator': d_simpson_index_calculator,
  'species-richness-calculator': d_species_richness_calculator,
  'species-evenness-calculator': d_species_evenness_calculator,
  'carbon-footprint-calculator': d_carbon_footprint_calculator,
  'co2-emissions-calculator': d_co2_emissions_calculator,
  'carbon-sequestration-calculator': d_carbon_sequestration_calculator,
  'tree-carbon-calculator': d_tree_carbon_calculator,
  'water-footprint-calculator': d_water_footprint_calculator,
  'ecological-footprint-calculator': d_ecological_footprint_calculator,
  'biocapacity-calculator': d_biocapacity_calculator,
  'overshoot-day-calculator': d_overshoot_day_calculator,
  'waste-calculator': d_waste_calculator,
  'recycling-calculator': d_recycling_calculator,
  'population-ecology-calculator': d_population_ecology_calculator,
  'mortality-rate-calculator': d_mortality_rate_calculator,
  'birth-rate-calculator': d_birth_rate_calculator,
  'migration-rate-calculator': d_migration_rate_calculator,
  'population-viability-calculator': d_population_viability_calculator,
  'extinction-risk-calculator': d_extinction_risk_calculator,
  'trophic-level-calculator': d_trophic_level_calculator,
  'biomass-pyramid-calculator': d_biomass_pyramid_calculator,
  'energy-transfer-calculator': d_energy_transfer_calculator,
  'productivity-calculator': d_productivity_calculator,
  'habitat-size-calculator': d_habitat_size_calculator,
  'corridor-width-calculator': d_corridor_width_calculator,
  'habitat-fragmentation-calculator': d_habitat_fragmentation_calculator,
  'invasive-species-calculator': d_invasive_species_calculator,
  'nesting-success-calculator': d_nesting_success_calculator,
  'carbon-footprint-tool': d_carbon_footprint_tool,
  'water-footprint': d_water_footprint,
  'waste-diversion': d_waste_diversion,
  'recycling-savings': d_recycling_savings,
  'compost-calc': d_compost_calc,
  'rainwater-calc': d_rainwater_calc,
  'tree-carbon-calc': d_tree_carbon_calc,
  'ecological-footprint': d_ecological_footprint,
  'species-richness': d_species_richness,
  'shannon-index': d_shannon_index,
  'simpson-index': d_simpson_index,
  'pielou-evenness': d_pielou_evenness,
  'bray-curtis': d_bray_curtis,
  'jaccard-index': d_jaccard_index,
  'sorensen-index': d_sorensen_index,
  'ace-index': d_ace_index,
  'rarefaction-curve': d_rarefaction_curve,
  'species-accumulation': d_species_accumulation,
  'rank-abundance': d_rank_abundance,
  'dominance-calc': d_dominance_calc,
  'similarity-percentage': d_similarity_percentage,
  'nmds': d_nmds,
  'pca-ecology': d_pca_ecology,
  'cca-analysis': d_cca_analysis,
  'biodiversity-beta': d_biodiversity_beta,
  'species-area-curve': d_species_area_curve,
  'carrying-capacity': d_carrying_capacity,
  'population-growth-lotka': d_population_growth_lotka,
  'predator-prey': d_predator_prey,
  'chao1': d_chao1,
  'r-k-selection': d_r_k_selection,
  'life-table': d_life_table,
  'survivorship-curve': d_survivorship_curve,
  'age-structure': d_age_structure,
  'population-doubling': d_population_doubling,
  'discrete-growth': d_discrete_growth,
  'matrix-projection': d_matrix_projection,
  'metapopulation': d_metapopulation,
  'minimum-viable': d_minimum_viable,
  'population-viability': d_population_viability,
  'mark-recapture': d_mark_recapture,
  'schnabel-method': d_schnabel_method,
  'removal-method': d_removal_method,
  'distance-sampling': d_distance_sampling,
  'quadrat-sampling': d_quadrat_sampling,
  'point-intercept': d_point_intercept,
  'line-intercept': d_line_intercept,
  'canopy-cover': d_canopy_cover,
  'basal-area': d_basal_area,
  'stem-density': d_stem_density,
  'tree-volume': d_tree_volume,
  'biomass-estimation': d_biomass_estimation,
  'forest-carbon': d_forest_carbon,
  'biomass-expansion': d_biomass_expansion,
  'per-capita-footprint': d_per_capita_footprint,
  'ecosystem-services': d_ecosystem_services,
  'habitat-suitability': d_habitat_suitability,
  'edge-effect': d_edge_effect,
  'patch-metrics': d_patch_metrics,
  'connectivity-index': d_connectivity_index,
  'least-cost-path': d_least_cost_path,
  'circuit-connectivity': d_circuit_connectivity,
  'gap-analysis': d_gap_analysis,
  'reserve-design': d_reserve_design,
  'climate-envelope': d_climate_envelope,
  'species-distribution': d_species_distribution,
  'bioclim': d_bioclim,
  'range-shift': d_range_shift,
}
