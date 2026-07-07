import d_pace_calculator from './pace-calculator'
import d_running_pace_calculator from './running-pace-calculator'
import d_race_time_calculator from './race-time-calculator'
import d_marathon_pace_calculator from './marathon-pace-calculator'
import d_half_marathon_pace_calculator from './half-marathon-pace-calculator'
import d_10k_pace_calculator from './10k-pace-calculator'
import d_5k_pace_calculator from './5k-pace-calculator'
import d_vo2max_calculator from './vo2max-calculator'
import d_calories_burned_calculator from './calories-burned-calculator'
import d_met_calculator from './met-calculator'
import d_exercise_calories_calculator from './exercise-calories-calculator'
import d_activity_calories_calculator from './activity-calories-calculator'
import d_running_calories_calculator from './running-calories-calculator'
import d_heart_rate_zones_calculator from './heart-rate-zones-calculator'
import d_max_heart_rate_calculator from './max-heart-rate-calculator'
import d_target_heart_rate_calculator from './target-heart-rate-calculator'
import d_recovery_heart_rate_calculator from './recovery-heart-rate-calculator'
import d_one_rep_max_calculator from './one-rep-max-calculator'
import d_max_lift_calculator from './max-lift-calculator'
import d_bench_press_calculator from './bench-press-calculator'
import d_squat_calculator from './squat-calculator'
import d_deadlift_calculator from './deadlift-calculator'
import d_wilks_coefficient_calculator from './wilks-coefficient-calculator'
import d_cycling_speed_calculator from './cycling-speed-calculator'
import d_cycling_power_calculator from './cycling-power-calculator'
import d_cycling_calories_calculator from './cycling-calories-calculator'
import d_cadence_calculator from './cadence-calculator'
import d_swim_pace_calculator from './swim-pace-calculator'
import d_swim_calories_calculator from './swim-calories-calculator'
import d_swim_stroke_calculator from './swim-stroke-calculator'
import d_pushup_test_calculator from './pushup-test-calculator'
import d_situp_test_calculator from './situp-test-calculator'
import d_cooper_test_calculator from './cooper-test-calculator'
import d_beep_test_calculator from './beep-test-calculator'
import d_vertical_jump_calculator from './vertical-jump-calculator'
import d_speed_calculator from './speed-calculator'
import d_agility_calculator from './agility-calculator'
import d_tdee_calculator from './tdee-calculator'
import d_fitness_age_calculator from './fitness-age-calculator'
import d_body_fat_calc from './body-fat-calc'
import d_sports_score_calc from './sports-score-calc'
import d_swim_fitness_calc from './swim-fitness-calc'
import d_running_goal_time from './running-goal-time'
import d_race_time_predictor from './race-time-predictor'
import d_vdot_calc from './vdot-calc'
import d_running_economy from './running-economy'
import d_weekly_mileage from './weekly-mileage'
import d_running_strides from './running-strides'
import d_interval_training from './interval-training'
import d_tempo_run from './tempo-run'
import d_fartlek_calc from './fartlek-calc'
import d_hill_repeats from './hill-repeats'
import d_long_run_pace from './long-run-pace'
import d_recovery_run from './recovery-run'
import d_power_to_weight from './power-to-weight'
import d_functional_threshold from './functional-threshold'
import d_critical_power from './critical-power'
import d_gear_inch from './gear-inch'
import d_development_meters from './development-meters'
import d_cycling_aerodynamics from './cycling-aerodynamics'
import d_rolling_resistance from './rolling-resistance'
import d_cycling_climb from './cycling-climb'
import d_gradient_calc from './gradient-calc'
import d_cycling_descent from './cycling-descent'
import d_triathlon_splits from './triathlon-splits'
import d_basketball_fg from './basketball-fg'
import d_basketball_3pt from './basketball-3pt'
import d_basketball_ft from './basketball-ft'
import d_baseball_batting from './baseball-batting'
import d_baseball_ops from './baseball-ops'
import d_baseball_whip from './baseball-whip'
import d_football_passer from './football-passer'
import d_football_completion from './football-completion'
import d_soccer_passing from './soccer-passing'
import d_soccer_possession from './soccer-possession'
import d_tennis_serving from './tennis-serving'
import d_golf_handicap from './golf-handicap'
import d_golf_driving from './golf-driving'
import d_resting_heart_rate from './resting-heart-rate'
import d_hrv_analysis from './hrv-analysis'
import d_training_load from './training-load'
import d_acute_chronic_ratio from './acute-chronic-ratio'
import d_situp_calc from './situp-calc'
import d_pushup_calc from './pushup-calc'
import d_plank_calc from './plank-calc'
import d_broad_jump_calc from './broad-jump-calc'
import d_medicine_ball_calc from './medicine-ball-calc'
import d_shuttle_run_calc from './shuttle-run-calc'
import d_cooper_test_calc from './cooper-test-calc'
import d_rockport_calc from './rockport-calc'
import d_queens_step_calc from './queens-step-calc'
import d_ymca_step_calc from './ymca-step-calc'
import d_cycling_fitness_calc from './cycling-fitness-calc'
import d_rowing_fitness_calc from './rowing-fitness-calc'
import d_triathlon_pace_calc from './triathlon-pace-calc'
import d_running_pace from './running-pace'
import d_half_marathon_pace from './half-marathon-pace'
import d_marathon_pace from './marathon-pace'
import d_5k_pace from './5k-pace'
import d_10k_pace from './10k-pace'
import d_vo2max_running from './vo2max-running'
import d_heart_rate_zones from './heart-rate-zones'
import d_max_heart_rate from './max-heart-rate'
import d_heart_rate_recovery from './heart-rate-recovery'
import d_cycling_speed from './cycling-speed'
import d_cycling_power from './cycling-power'
import d_cadence_calc from './cadence-calc'
import d_swimming_pace from './swimming-pace'
import d_swim_distance from './swim-distance'
import d_swim_stroke_rate from './swim-stroke-rate'
import d_swolf_score from './swolf-score'
import d_open_water_pacing from './open-water-pacing'
import d_triathlon_pace from './triathlon-pace'
import d_ironman_pace from './ironman-pace'
import d_half_ironman_pace from './half-ironman-pace'
import d_olympic_triathlon from './olympic-triathlon'
import d_brick_workout from './brick-workout'
import d_swim_bike_transition from './swim-bike-transition'
import d_bike_run_transition from './bike-run-transition'
import d_weightlifting_1rm from './weightlifting-1rm'
import d_weightlifting_max from './weightlifting-max'
import d_rep_max_percentage from './rep-max-percentage'
import d_volume_load from './volume-load'
import d_density_training from './density-training'
import d_rest_pause from './rest-pause'
import d_superset_calc from './superset-calc'
import d_periodization from './periodization'
import d_deload_week from './deload-week'
import d_progressive_overload from './progressive-overload'
import d_crossfit_workout from './crossfit-workout'
import d_amrap_calc from './amrap-calc'
import d_emom_calc from './emom-calc'
import d_tabata_timer from './tabata-timer'
import d_hiit_workout from './hiit-workout'
import d_yoga_session from './yoga-session'
import d_pilates_workout from './pilates-workout'
import d_flexibility_test from './flexibility-test'
import d_vertical_jump from './vertical-jump'
import d_standing_long_jump from './standing-long-jump'
import d_vertical_power from './vertical-power'
import d_broad_jump from './broad-jump'
import d_medicine_ball_throw from './medicine-ball-throw'
import d_reactive_strength from './reactive-strength'
import d_drop_jump from './drop-jump'
import d_agility_t_test from './agility-t-test'
import d_illinois_agility from './illinois-agility'
import d_pro_agility from './pro-agility'
import d_hexagon_agility from './hexagon-agility'
import d_wingate_test from './wingate-test'
import d_basketball_per from './basketball-per'
import d_basketball_true_shooting from './basketball-true-shooting'

import type { CalcDef } from '../../../lib/generic-fallback'

export const calcDefs: Record<string, CalcDef> = {
  'pace-calculator': d_pace_calculator,
  'running-pace-calculator': d_running_pace_calculator,
  'race-time-calculator': d_race_time_calculator,
  'marathon-pace-calculator': d_marathon_pace_calculator,
  'half-marathon-pace-calculator': d_half_marathon_pace_calculator,
  '10k-pace-calculator': d_10k_pace_calculator,
  '5k-pace-calculator': d_5k_pace_calculator,
  'vo2max-calculator': d_vo2max_calculator,
  'calories-burned-calculator': d_calories_burned_calculator,
  'met-calculator': d_met_calculator,
  'exercise-calories-calculator': d_exercise_calories_calculator,
  'activity-calories-calculator': d_activity_calories_calculator,
  'running-calories-calculator': d_running_calories_calculator,
  'heart-rate-zones-calculator': d_heart_rate_zones_calculator,
  'max-heart-rate-calculator': d_max_heart_rate_calculator,
  'target-heart-rate-calculator': d_target_heart_rate_calculator,
  'recovery-heart-rate-calculator': d_recovery_heart_rate_calculator,
  'one-rep-max-calculator': d_one_rep_max_calculator,
  'max-lift-calculator': d_max_lift_calculator,
  'bench-press-calculator': d_bench_press_calculator,
  'squat-calculator': d_squat_calculator,
  'deadlift-calculator': d_deadlift_calculator,
  'wilks-coefficient-calculator': d_wilks_coefficient_calculator,
  'cycling-speed-calculator': d_cycling_speed_calculator,
  'cycling-power-calculator': d_cycling_power_calculator,
  'cycling-calories-calculator': d_cycling_calories_calculator,
  'cadence-calculator': d_cadence_calculator,
  'swim-pace-calculator': d_swim_pace_calculator,
  'swim-calories-calculator': d_swim_calories_calculator,
  'swim-stroke-calculator': d_swim_stroke_calculator,
  'pushup-test-calculator': d_pushup_test_calculator,
  'situp-test-calculator': d_situp_test_calculator,
  'cooper-test-calculator': d_cooper_test_calculator,
  'beep-test-calculator': d_beep_test_calculator,
  'vertical-jump-calculator': d_vertical_jump_calculator,
  'speed-calculator': d_speed_calculator,
  'agility-calculator': d_agility_calculator,
  'tdee-calculator': d_tdee_calculator,
  'fitness-age-calculator': d_fitness_age_calculator,
  'body-fat-calc': d_body_fat_calc,
  'sports-score-calc': d_sports_score_calc,
  'swim-fitness-calc': d_swim_fitness_calc,
  'running-goal-time': d_running_goal_time,
  'race-time-predictor': d_race_time_predictor,
  'vdot-calc': d_vdot_calc,
  'running-economy': d_running_economy,
  'weekly-mileage': d_weekly_mileage,
  'running-strides': d_running_strides,
  'interval-training': d_interval_training,
  'tempo-run': d_tempo_run,
  'fartlek-calc': d_fartlek_calc,
  'hill-repeats': d_hill_repeats,
  'long-run-pace': d_long_run_pace,
  'recovery-run': d_recovery_run,
  'power-to-weight': d_power_to_weight,
  'functional-threshold': d_functional_threshold,
  'critical-power': d_critical_power,
  'gear-inch': d_gear_inch,
  'development-meters': d_development_meters,
  'cycling-aerodynamics': d_cycling_aerodynamics,
  'rolling-resistance': d_rolling_resistance,
  'cycling-climb': d_cycling_climb,
  'gradient-calc': d_gradient_calc,
  'cycling-descent': d_cycling_descent,
  'triathlon-splits': d_triathlon_splits,
  'basketball-fg': d_basketball_fg,
  'basketball-3pt': d_basketball_3pt,
  'basketball-ft': d_basketball_ft,
  'baseball-batting': d_baseball_batting,
  'baseball-ops': d_baseball_ops,
  'baseball-whip': d_baseball_whip,
  'football-passer': d_football_passer,
  'football-completion': d_football_completion,
  'soccer-passing': d_soccer_passing,
  'soccer-possession': d_soccer_possession,
  'tennis-serving': d_tennis_serving,
  'golf-handicap': d_golf_handicap,
  'golf-driving': d_golf_driving,
  'resting-heart-rate': d_resting_heart_rate,
  'hrv-analysis': d_hrv_analysis,
  'training-load': d_training_load,
  'acute-chronic-ratio': d_acute_chronic_ratio,
  'situp-calc': d_situp_calc,
  'pushup-calc': d_pushup_calc,
  'plank-calc': d_plank_calc,
  'broad-jump-calc': d_broad_jump_calc,
  'medicine-ball-calc': d_medicine_ball_calc,
  'shuttle-run-calc': d_shuttle_run_calc,
  'cooper-test-calc': d_cooper_test_calc,
  'rockport-calc': d_rockport_calc,
  'queens-step-calc': d_queens_step_calc,
  'ymca-step-calc': d_ymca_step_calc,
  'cycling-fitness-calc': d_cycling_fitness_calc,
  'rowing-fitness-calc': d_rowing_fitness_calc,
  'triathlon-pace-calc': d_triathlon_pace_calc,
  'running-pace': d_running_pace,
  'half-marathon-pace': d_half_marathon_pace,
  'marathon-pace': d_marathon_pace,
  '5k-pace': d_5k_pace,
  '10k-pace': d_10k_pace,
  'vo2max-running': d_vo2max_running,
  'heart-rate-zones': d_heart_rate_zones,
  'max-heart-rate': d_max_heart_rate,
  'heart-rate-recovery': d_heart_rate_recovery,
  'cycling-speed': d_cycling_speed,
  'cycling-power': d_cycling_power,
  'cadence-calc': d_cadence_calc,
  'swimming-pace': d_swimming_pace,
  'swim-distance': d_swim_distance,
  'swim-stroke-rate': d_swim_stroke_rate,
  'swolf-score': d_swolf_score,
  'open-water-pacing': d_open_water_pacing,
  'triathlon-pace': d_triathlon_pace,
  'ironman-pace': d_ironman_pace,
  'half-ironman-pace': d_half_ironman_pace,
  'olympic-triathlon': d_olympic_triathlon,
  'brick-workout': d_brick_workout,
  'swim-bike-transition': d_swim_bike_transition,
  'bike-run-transition': d_bike_run_transition,
  'weightlifting-1rm': d_weightlifting_1rm,
  'weightlifting-max': d_weightlifting_max,
  'rep-max-percentage': d_rep_max_percentage,
  'volume-load': d_volume_load,
  'density-training': d_density_training,
  'rest-pause': d_rest_pause,
  'superset-calc': d_superset_calc,
  'periodization': d_periodization,
  'deload-week': d_deload_week,
  'progressive-overload': d_progressive_overload,
  'crossfit-workout': d_crossfit_workout,
  'amrap-calc': d_amrap_calc,
  'emom-calc': d_emom_calc,
  'tabata-timer': d_tabata_timer,
  'hiit-workout': d_hiit_workout,
  'yoga-session': d_yoga_session,
  'pilates-workout': d_pilates_workout,
  'flexibility-test': d_flexibility_test,
  'vertical-jump': d_vertical_jump,
  'standing-long-jump': d_standing_long_jump,
  'vertical-power': d_vertical_power,
  'broad-jump': d_broad_jump,
  'medicine-ball-throw': d_medicine_ball_throw,
  'reactive-strength': d_reactive_strength,
  'drop-jump': d_drop_jump,
  'agility-t-test': d_agility_t_test,
  'illinois-agility': d_illinois_agility,
  'pro-agility': d_pro_agility,
  'hexagon-agility': d_hexagon_agility,
  'wingate-test': d_wingate_test,
  'basketball-per': d_basketball_per,
  'basketball-true-shooting': d_basketball_true_shooting,
}
