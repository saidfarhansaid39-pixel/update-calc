import d_mean_calculator from './mean-calculator'
import d_median_calculator from './median-calculator'
import d_mode_calculator from './mode-calculator'
import d_range_calculator from './range-calculator'
import d_variance_calculator from './variance-calculator'
import d_standard_deviation_calculator from './standard-deviation-calculator'
import d_quartile_calculator from './quartile-calculator'
import d_percentile_calculator from './percentile-calculator'
import d_five_number_summary_calculator from './five-number-summary-calculator'
import d_box_plot_calculator from './box-plot-calculator'
import d_interquartile_range_calculator from './interquartile-range-calculator'
import d_coefficient_of_variation_calculator from './coefficient-of-variation-calculator'
import d_skewness_calculator from './skewness-calculator'
import d_kurtosis_calculator from './kurtosis-calculator'
import d_trimmed_mean_calculator from './trimmed-mean-calculator'
import d_weighted_mean_calculator from './weighted-mean-calculator'
import d_geometric_mean_calculator from './geometric-mean-calculator'
import d_harmonic_mean_calculator from './harmonic-mean-calculator'
import d_root_mean_square_calculator from './root-mean-square-calculator'
import d_midrange_calculator from './midrange-calculator'
import d_normal_distribution_calculator from './normal-distribution-calculator'
import d_binomial_distribution_calculator from './binomial-distribution-calculator'
import d_poisson_distribution_calculator from './poisson-distribution-calculator'
import d_exponential_distribution_calculator from './exponential-distribution-calculator'
import d_uniform_distribution_calculator from './uniform-distribution-calculator'
import d_t_distribution_calculator from './t-distribution-calculator'
import d_chi_square_distribution_calculator from './chi-square-distribution-calculator'
import d_f_distribution_calculator from './f-distribution-calculator'
import d_geometric_distribution_calculator from './geometric-distribution-calculator'
import d_hypergeometric_distribution_calculator from './hypergeometric-distribution-calculator'
import d_negative_binomial_distribution_calculator from './negative-binomial-distribution-calculator'
import d_beta_distribution_calculator from './beta-distribution-calculator'
import d_gamma_distribution_calculator from './gamma-distribution-calculator'
import d_weibull_distribution_calculator from './weibull-distribution-calculator'
import d_correlation_calculator from './correlation-calculator'
import d_linear_regression_calculator from './linear-regression-calculator'
import d_logistic_regression_calculator from './logistic-regression-calculator'
import d_polynomial_regression_calculator from './polynomial-regression-calculator'
import d_multiple_regression_calculator from './multiple-regression-calculator'
import d_z_test_calculator from './z-test-calculator'
import d_one_sample_t_test_calculator from './one-sample-t-test-calculator'
import d_two_sample_t_test_calculator from './two-sample-t-test-calculator'
import d_paired_t_test_calculator from './paired-t-test-calculator'
import d_chi_square_test_calculator from './chi-square-test-calculator'
import d_f_test_calculator from './f-test-calculator'
import d_one_way_anova_calculator from './one-way-anova-calculator'
import d_two_way_anova_calculator from './two-way-anova-calculator'
import d_sampling_size_calculator from './sampling-size-calculator'
import d_bayes_theorem_calculator from './bayes-theorem-calculator'
import d_bootstrap_calculator from './bootstrap-calculator'
import d_kruskal_wallis_test_calculator from './kruskal-wallis-test-calculator'
import d_monte_carlo_simulation_calculator from './monte-carlo-simulation-calculator'
import d_frequency_distribution from './frequency-distribution'
import d_grouped_frequency from './grouped-frequency'
import d_cumulative_frequency from './cumulative-frequency'
import d_relative_frequency from './relative-frequency'
import d_cross_tabulation from './cross-tabulation'
import d_contingency_table from './contingency-table'
import d_ordinal_measures from './ordinal-measures'
import d_nominal_measures from './nominal-measures'
import d_ratio_measures from './ratio-measures'
import d_interval_measures from './interval-measures'
import d_central_tendency from './central-tendency'
import d_dispersion from './dispersion'
import d_anova_repeated from './anova-repeated'
import d_manova from './manova'
import d_chi_square_homogeneity from './chi-square-homogeneity'
import d_cochran_q from './cochran-q'
import d_covariance_calculator from './covariance-calculator'
import d_correlation_spearman from './correlation-spearman'
import d_correlation_kendall from './correlation-kendall'
import d_regression_stepwise from './regression-stepwise'
import d_regression_ridge from './regression-ridge'
import d_regression_lasso from './regression-lasso'
import d_regression_elastic_net from './regression-elastic-net'
import d_partial_correlation from './partial-correlation'
import d_semi_partial from './semi-partial'
import d_canonical_correlation from './canonical-correlation'
import d_time_series_moving_average from './time-series-moving-average'
import d_time_series_exponential_smoothing from './time-series-exponential-smoothing'
import d_time_series_arima from './time-series-arima'
import d_time_series_decomposition from './time-series-decomposition'
import d_forecasting_linear from './forecasting-linear'
import d_forecasting_exponential from './forecasting-exponential'
import d_forecasting_seasonal from './forecasting-seasonal'
import d_holt_winters from './holt-winters'
import d_power_analysis from './power-analysis'
import d_effect_size_cohens_d from './effect-size-cohens-d'
import d_effect_size_etasq from './effect-size-etasq'
import d_bayes_factor from './bayes-factor'
import d_jackknife from './jackknife'
import d_permutation_test from './permutation-test'
import d_randomization_test from './randomization-test'
import d_roc_curve from './roc-curve'
import d_auc_calculator from './auc-calculator'
import d_z_test_one_sample from './z-test-one-sample'
import d_z_test_two_sample from './z-test-two-sample'
import d_t_test_paired from './t-test-paired'
import d_t_test_independent from './t-test-independent'
import d_welch_t_test from './welch-t-test'
import d_mann_whitney_u from './mann-whitney-u'
import d_wilcoxon_signed_rank_2 from './wilcoxon-signed-rank-2'
import d_friedman_test from './friedman-test'
import d_ancova from './ancova'
import d_post_hoc_tukey from './post-hoc-tukey'
import d_post_hoc_bonferroni from './post-hoc-bonferroni'
import d_post_hoc_scheffe from './post-hoc-scheffe'
import d_post_hoc_dunnett from './post-hoc-dunnett'
import d_point_biserial from './point-biserial'
import d_phi_coefficient from './phi-coefficient'
import d_cramers_v from './cramers-v'
import d_contingency_coefficient from './contingency-coefficient'
import d_kappa_cohen from './kappa-cohen'
import d_chi_square_independence from './chi-square-independence'
import d_fisher_exact from './fisher-exact'
import d_mcnemar_test from './mcnemar-test'
import d_multinomial_logistic from './multinomial-logistic'
import d_ordered_logistic from './ordered-logistic'
import d_poisson_regression from './poisson-regression'
import d_negative_binomial_regression from './negative-binomial-regression'
import d_principal_component from './principal-component'
import d_factor_analysis from './factor-analysis'
import d_cluster_kmeans from './cluster-kmeans'
import d_cluster_hierarchical from './cluster-hierarchical'
import d_dbscan_clustering from './dbscan-clustering'
import d_naive_bayes from './naive-bayes'
import d_knn_classifier from './knn-classifier'
import d_decision_tree from './decision-tree'
import d_random_forest from './random-forest'
import d_svm_classifier from './svm-classifier'
import d_crude_rate from './crude-rate'
import d_odds_ratio from './odds-ratio'
import d_risk_ratio from './risk-ratio'
import d_risk_difference from './risk-difference'
import d_number_needed_treat from './number-needed-treat'
import d_diagnostic_likelihood from './diagnostic-likelihood'
import d_diagnostic_odds from './diagnostic-odds'
import d_youden_index from './youden-index'
import d_hedges_g from './hedges-g'
import d_omegasquared from './omegasquared'
import d_partial_etasquared from './partial-etasquared'
import d_gini_coefficient from './gini-coefficient'
import d_herfindahl_index from './herfindahl-index'
import d_lorenz_curve from './lorenz-curve'
import d_theil_index from './theil-index'
import d_t_test_one_sample from './t-test-one-sample'
import d_simple_linear_regression from './simple-linear-regression'
import d_chi_square_goodness from './chi-square-goodness'
import d_correlation_pearson from './correlation-pearson'
import d_age_adjusted_rate from './age-adjusted-rate'
import d_indirect_standardization from './indirect-standardization'
import d_survival_kaplan_meier from './survival-kaplan-meier'
import d_cox_proportional from './cox-proportional'
import d_sample_size_mean from './sample-size-mean'
import d_sample_size_proportion from './sample-size-proportion'
import d_stratified_randomization from './stratified-randomization'
import d_equivalence_test from './equivalence-test'
import d_interim_monitoring from './interim-monitoring'
import d_bland_altman from './bland-altman'
import d_deming_regression from './deming-regression'
import d_passing_bablok from './passing-bablok'
import d_taylor_rule from './taylor-rule'
import d_moving_average_simple from './moving-average-simple'
import d_arima_forecast from './arima-forecast'
import d_monte_carlo_sim from './monte-carlo-sim'
import d_adaptive_design from './adaptive-design'
import d_allocation_ratio from './allocation-ratio'
import d_cochran_q_2 from './cochran-q-2'
import d_cohens_d from './cohens-d'
import d_correlation_kendall_2 from './correlation-kendall-2'
import d_correlation_spearman_2 from './correlation-spearman-2'
import d_direct_standardization from './direct-standardization'
import d_elastic_net from './elastic-net'
import d_etasquared from './etasquared'
import d_exponential_smoothing from './exponential-smoothing'
import d_kruskal_wallis from './kruskal-wallis'
import d_lasso_regression from './lasso-regression'
import d_life_expectancy_calc from './life-expectancy-calc'
import d_logistic_regression from './logistic-regression'
import d_manova_2 from './manova-2'
import d_multiple_regression from './multiple-regression'
import d_noninferiority_margin from './noninferiority-margin'
import d_one_way_anova from './one-way-anova'
import d_partial_correlation_2 from './partial-correlation-2'
import d_polynomial_regression from './polynomial-regression'
import d_power_anova from './power-anova'
import d_power_chi_square from './power-chi-square'
import d_power_t_test from './power-t-test'
import d_randomization_list from './randomization-list'
import d_repeated_measures_anova from './repeated-measures-anova'
import d_ridge_regression from './ridge-regression'
import d_roc_curve_2 from './roc-curve-2'
import d_sample_size_survival from './sample-size-survival'
import d_seasonal_decomposition from './seasonal-decomposition'
import d_stepwise_regression from './stepwise-regression'
import d_two_way_anova from './two-way-anova'

import type { CalcDef } from '../../../lib/generic-fallback'

export const calcDefs: Record<string, CalcDef> = {
  'mean-calculator': d_mean_calculator,
  'median-calculator': d_median_calculator,
  'mode-calculator': d_mode_calculator,
  'range-calculator': d_range_calculator,
  'variance-calculator': d_variance_calculator,
  'standard-deviation-calculator': d_standard_deviation_calculator,
  'quartile-calculator': d_quartile_calculator,
  'percentile-calculator': d_percentile_calculator,
  'five-number-summary-calculator': d_five_number_summary_calculator,
  'box-plot-calculator': d_box_plot_calculator,
  'interquartile-range-calculator': d_interquartile_range_calculator,
  'coefficient-of-variation-calculator': d_coefficient_of_variation_calculator,
  'skewness-calculator': d_skewness_calculator,
  'kurtosis-calculator': d_kurtosis_calculator,
  'trimmed-mean-calculator': d_trimmed_mean_calculator,
  'weighted-mean-calculator': d_weighted_mean_calculator,
  'geometric-mean-calculator': d_geometric_mean_calculator,
  'harmonic-mean-calculator': d_harmonic_mean_calculator,
  'root-mean-square-calculator': d_root_mean_square_calculator,
  'midrange-calculator': d_midrange_calculator,
  'normal-distribution-calculator': d_normal_distribution_calculator,
  'binomial-distribution-calculator': d_binomial_distribution_calculator,
  'poisson-distribution-calculator': d_poisson_distribution_calculator,
  'exponential-distribution-calculator': d_exponential_distribution_calculator,
  'uniform-distribution-calculator': d_uniform_distribution_calculator,
  't-distribution-calculator': d_t_distribution_calculator,
  'chi-square-distribution-calculator': d_chi_square_distribution_calculator,
  'f-distribution-calculator': d_f_distribution_calculator,
  'geometric-distribution-calculator': d_geometric_distribution_calculator,
  'hypergeometric-distribution-calculator': d_hypergeometric_distribution_calculator,
  'negative-binomial-distribution-calculator': d_negative_binomial_distribution_calculator,
  'beta-distribution-calculator': d_beta_distribution_calculator,
  'gamma-distribution-calculator': d_gamma_distribution_calculator,
  'weibull-distribution-calculator': d_weibull_distribution_calculator,
  'correlation-calculator': d_correlation_calculator,
  'linear-regression-calculator': d_linear_regression_calculator,
  'logistic-regression-calculator': d_logistic_regression_calculator,
  'polynomial-regression-calculator': d_polynomial_regression_calculator,
  'multiple-regression-calculator': d_multiple_regression_calculator,
  'z-test-calculator': d_z_test_calculator,
  'one-sample-t-test-calculator': d_one_sample_t_test_calculator,
  'two-sample-t-test-calculator': d_two_sample_t_test_calculator,
  'paired-t-test-calculator': d_paired_t_test_calculator,
  'chi-square-test-calculator': d_chi_square_test_calculator,
  'f-test-calculator': d_f_test_calculator,
  'one-way-anova-calculator': d_one_way_anova_calculator,
  'two-way-anova-calculator': d_two_way_anova_calculator,
  'sampling-size-calculator': d_sampling_size_calculator,
  'bayes-theorem-calculator': d_bayes_theorem_calculator,
  'bootstrap-calculator': d_bootstrap_calculator,
  'kruskal-wallis-test-calculator': d_kruskal_wallis_test_calculator,
  'monte-carlo-simulation-calculator': d_monte_carlo_simulation_calculator,
  'frequency-distribution': d_frequency_distribution,
  'grouped-frequency': d_grouped_frequency,
  'cumulative-frequency': d_cumulative_frequency,
  'relative-frequency': d_relative_frequency,
  'cross-tabulation': d_cross_tabulation,
  'contingency-table': d_contingency_table,
  'ordinal-measures': d_ordinal_measures,
  'nominal-measures': d_nominal_measures,
  'ratio-measures': d_ratio_measures,
  'interval-measures': d_interval_measures,
  'central-tendency': d_central_tendency,
  'dispersion': d_dispersion,
  'anova-repeated': d_anova_repeated,
  'manova': d_manova,
  'chi-square-homogeneity': d_chi_square_homogeneity,
  'cochran-q': d_cochran_q,
  'covariance-calculator': d_covariance_calculator,
  'correlation-spearman': d_correlation_spearman,
  'correlation-kendall': d_correlation_kendall,
  'regression-stepwise': d_regression_stepwise,
  'regression-ridge': d_regression_ridge,
  'regression-lasso': d_regression_lasso,
  'regression-elastic-net': d_regression_elastic_net,
  'partial-correlation': d_partial_correlation,
  'semi-partial': d_semi_partial,
  'canonical-correlation': d_canonical_correlation,
  'time-series-moving-average': d_time_series_moving_average,
  'time-series-exponential-smoothing': d_time_series_exponential_smoothing,
  'time-series-arima': d_time_series_arima,
  'time-series-decomposition': d_time_series_decomposition,
  'forecasting-linear': d_forecasting_linear,
  'forecasting-exponential': d_forecasting_exponential,
  'forecasting-seasonal': d_forecasting_seasonal,
  'holt-winters': d_holt_winters,
  'power-analysis': d_power_analysis,
  'effect-size-cohens-d': d_effect_size_cohens_d,
  'effect-size-etasq': d_effect_size_etasq,
  'bayes-factor': d_bayes_factor,
  'jackknife': d_jackknife,
  'permutation-test': d_permutation_test,
  'randomization-test': d_randomization_test,
  'roc-curve': d_roc_curve,
  'auc-calculator': d_auc_calculator,
  'z-test-one-sample': d_z_test_one_sample,
  'z-test-two-sample': d_z_test_two_sample,
  't-test-paired': d_t_test_paired,
  't-test-independent': d_t_test_independent,
  'welch-t-test': d_welch_t_test,
  'mann-whitney-u': d_mann_whitney_u,
  'wilcoxon-signed-rank-2': d_wilcoxon_signed_rank_2,
  'friedman-test': d_friedman_test,
  'ancova': d_ancova,
  'post-hoc-tukey': d_post_hoc_tukey,
  'post-hoc-bonferroni': d_post_hoc_bonferroni,
  'post-hoc-scheffe': d_post_hoc_scheffe,
  'post-hoc-dunnett': d_post_hoc_dunnett,
  'point-biserial': d_point_biserial,
  'phi-coefficient': d_phi_coefficient,
  'cramers-v': d_cramers_v,
  'contingency-coefficient': d_contingency_coefficient,
  'kappa-cohen': d_kappa_cohen,
  'chi-square-independence': d_chi_square_independence,
  'fisher-exact': d_fisher_exact,
  'mcnemar-test': d_mcnemar_test,
  'multinomial-logistic': d_multinomial_logistic,
  'ordered-logistic': d_ordered_logistic,
  'poisson-regression': d_poisson_regression,
  'negative-binomial-regression': d_negative_binomial_regression,
  'principal-component': d_principal_component,
  'factor-analysis': d_factor_analysis,
  'cluster-kmeans': d_cluster_kmeans,
  'cluster-hierarchical': d_cluster_hierarchical,
  'dbscan-clustering': d_dbscan_clustering,
  'naive-bayes': d_naive_bayes,
  'knn-classifier': d_knn_classifier,
  'decision-tree': d_decision_tree,
  'random-forest': d_random_forest,
  'svm-classifier': d_svm_classifier,
  'crude-rate': d_crude_rate,
  'odds-ratio': d_odds_ratio,
  'risk-ratio': d_risk_ratio,
  'risk-difference': d_risk_difference,
  'number-needed-treat': d_number_needed_treat,
  'diagnostic-likelihood': d_diagnostic_likelihood,
  'diagnostic-odds': d_diagnostic_odds,
  'youden-index': d_youden_index,
  'hedges-g': d_hedges_g,
  'omegasquared': d_omegasquared,
  'partial-etasquared': d_partial_etasquared,
  'gini-coefficient': d_gini_coefficient,
  'herfindahl-index': d_herfindahl_index,
  'lorenz-curve': d_lorenz_curve,
  'theil-index': d_theil_index,
  't-test-one-sample': d_t_test_one_sample,
  'simple-linear-regression': d_simple_linear_regression,
  'chi-square-goodness': d_chi_square_goodness,
  'correlation-pearson': d_correlation_pearson,
  'age-adjusted-rate': d_age_adjusted_rate,
  'indirect-standardization': d_indirect_standardization,
  'survival-kaplan-meier': d_survival_kaplan_meier,
  'cox-proportional': d_cox_proportional,
  'sample-size-mean': d_sample_size_mean,
  'sample-size-proportion': d_sample_size_proportion,
  'stratified-randomization': d_stratified_randomization,
  'equivalence-test': d_equivalence_test,
  'interim-monitoring': d_interim_monitoring,
  'bland-altman': d_bland_altman,
  'deming-regression': d_deming_regression,
  'passing-bablok': d_passing_bablok,
  'taylor-rule': d_taylor_rule,
  'moving-average-simple': d_moving_average_simple,
  'arima-forecast': d_arima_forecast,
  'monte-carlo-sim': d_monte_carlo_sim,
  'adaptive-design': d_adaptive_design,
  'allocation-ratio': d_allocation_ratio,
  'cochran-q-2': d_cochran_q_2,
  'cohens-d': d_cohens_d,
  'correlation-kendall-2': d_correlation_kendall_2,
  'correlation-spearman-2': d_correlation_spearman_2,
  'direct-standardization': d_direct_standardization,
  'elastic-net': d_elastic_net,
  'etasquared': d_etasquared,
  'exponential-smoothing': d_exponential_smoothing,
  'kruskal-wallis': d_kruskal_wallis,
  'lasso-regression': d_lasso_regression,
  'life-expectancy-calc': d_life_expectancy_calc,
  'logistic-regression': d_logistic_regression,
  'manova-2': d_manova_2,
  'multiple-regression': d_multiple_regression,
  'noninferiority-margin': d_noninferiority_margin,
  'one-way-anova': d_one_way_anova,
  'partial-correlation-2': d_partial_correlation_2,
  'polynomial-regression': d_polynomial_regression,
  'power-anova': d_power_anova,
  'power-chi-square': d_power_chi_square,
  'power-t-test': d_power_t_test,
  'randomization-list': d_randomization_list,
  'repeated-measures-anova': d_repeated_measures_anova,
  'ridge-regression': d_ridge_regression,
  'roc-curve-2': d_roc_curve_2,
  'sample-size-survival': d_sample_size_survival,
  'seasonal-decomposition': d_seasonal_decomposition,
  'stepwise-regression': d_stepwise_regression,
  'two-way-anova': d_two_way_anova,
}
