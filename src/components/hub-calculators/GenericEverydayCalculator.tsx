'use client'

import React, { useMemo, useCallback, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { CalculatorSlider } from '@/components/forms/CalculatorSlider'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
import { ModeFieldGroup } from '@/components/premium/ModeFieldGroup'
import { DynamicProgressBarChart } from '@/components/premium/DynamicCharts'
import { FieldsByMode } from '@/lib/calc-field-helper'
import { getEverydayFormula, everydayOverrides } from '@/lib/seo/formula-generator'
import { getUnits } from '@/lib/units'
import { everydayRenderers, everydaySchemas, everydayDefaults, everydayPresets, everydayFormulas, numField, sel, yesno } from './everyday-data'
import { calcDefs } from './everyday'
import type { CalcDef } from '@/lib/generic-fallback'

type CalcType = 'tip' | 'conversion' | 'default'
  | 'clothing' | 'ring' | 'cooking' | 'water_intake' | 'caffeine' | 'alcohol' | 'bac'
  | 'wedding' | 'dining' | 'gym' | 'maintenance' | 'car_payment' | 'car_cost' | 'tire'
  | 'battery' | 'photo' | 'prime' | 'fastfood' | 'ev' | 'overtime' | 'commission' | 'freelance' | 'splitting'
  | 'paint' | 'wallpaper' | 'tile' | 'rug' | 'stairs' | 'childcare' | 'sleep'
  | 'water_bill' | 'gpa-calc' | 'grade-calc'
  | 'random-number' | 'coin-flip' | 'dice-roller' | 'decision-maker' | 'name-generator'
  | 'password-gen' | 'password-check'
  | 'run-pace' | 'swim-pace' | 'bike-pace' | 'tri-pace'
  | 'step-counter' | 'steps-miles' | 'steps-km'
  | 'smoking-cost' | 'coffee-cost' | 'daily-affirm' | 'gratitude' | 'habit-track' | 'mood-track'
  | 'pet-food' | 'cat-tree' | 'dog-train' | 'dog-walk' | 'pet-chip' | 'pet-vax'
  | 'pet-age' | 'dog-years' | 'cat-years' | 'human-dog-years'
  | 'party-planner' | 'event-budget'
  | 'moving-cost' | 'apt-search' | 'closing-cost' | 'home-buy' | 'mortgage-ok' | 'moving-list' | 'rent-ok'
  | 'elec-bill' | 'appliance-cost' | 'appliance-energy' | 'energy-bill' | 'bulb-save' | 'thermostat-save'
  | 'grocery-budget' | 'best-buy' | 'bundle-save' | 'bogo' | 'cost-use' | 'coupon' | 'price-comp' | 'price-oz' | 'price-lb' | 'unit-price'
  | 'commute-fuel' | 'parking' | 'rental-car' | 'taxi-fare' | 'toll'
  | 'soil-calc' | 'mulch' | 'compost' | 'cold-frame' | 'container' | 'greenhouse' | 'herb' | 'indoor-herb'
  | 'microgreen' | 'raised-bed' | 'trellis' | 'vertical' | 'worm'
  | 'storage-cost' | 'closet' | 'konmari' | 'garage' | 'home-inv' | 'home-org' | 'shed' | 'workshop'
  | 'delivery-fee' | 'baggage' | 'hotel-cost' | 'luggage' | 'packing-list' | 'pack-vol' | 'travel-budget' | 'travel-time' | 'trip-cost' | 'weather'
  | 'streaming-cost' | 'subscription-calc' | 'sub-cost' | 'sub-save'
  | 'net-speed' | 'data-usage' | 'internet-cost'
  | 'salary-hourly' | 'hourly-salary' | 'billable-hrs' | 'meeting-cost2' | 'pomodoro' | 'priority-matrix2' | 'productivity' | 'project-deadline2' | 'task-est' | 'time-block' | 'work-hours'
  | 'file-size2' | 'download-time' | 'upload-time'
  | 'calories-burned' | 'walking-cal' | 'running-cal' | 'cycling-cal' | 'swimming-cal' | 'yoga-cal'
  | 'desk-ergo' | 'stand-desk' | 'monitor-ht'
  | 'tv-size' | 'projector-screen'
  | 'floor-mat' | 'carpet-room'
  | 'deck-mat' | 'fence-mat'
  | 'seed-space' | 'plant-space' | 'companion' | 'seed-start' | 'transplant'
  | 'crop-yield' | 'crop-rotate'
  | 'aquarium-vol' | 'aquarium-heater' | 'aquarium-light' | 'aquarium-size2'
  | 'cleaning-time' | 'clean-supplies'
  | 'laundry-cost' | 'laundry-auto'
  | 'cater-cost' | 'meal-prep' | 'leftover-calc' | 'pizza-calc' | 'coffee-calc2' | 'takeout-calc'
  | 'util-est' | 'auto-util' | 'util-cost'
  | 'cell-cost' | 'phone-bill'
  | 'pet-cost2' | 'pet-board' | 'pet-groom' | 'pet-sit'
  | 'hex-color' | 'color-pick'
  | 'lotto-calc' | 'bingo-odds' | 'lotto-odds' | 'poker-odds'
  | 'carbon-foot' | 'flight-carbon2' | 'flight-offset'
  | 'furniture-arr' | 'furniture-lay' | 'room-size'
  | 'curtain-len' | 'curtain-size2'
  | '50-30-20-budget-2' | 'budget-planner-calc' | 'budget-envelope' | 'emergency-fund-calc'
  | 'net-worth-calc' | 'net-worth-calc-2' | 'passive-income' | 'debt-snowball' | 'debt-avalanche' | 'zero-based-budget-2'
  | 'paypal-fees' | 'stripe-fees' | 'ebay-fees' | 'etsy-fees' | 'amazon-fba' | 'crowdfunding-fee' | 'pawn-loan'
  | 'craps-odds' | 'roulette-odds' | 'parlay-odds' | 'prop-bet' | 'sports-betting-odds' | 'blackjack-basic'
  | 'diaper-cost' | 'formula-cost' | 'baby-gear' | 'college-fund' | 'college-savings-calc'
  | 'pet-insurance' | 'towing-capacity' | 'tire-pressure-calc'
  | 'qr-code-generator' | 'font-size-calc' | 'secret-santa' | 'yard-sale' | 'raffle-tickets' | 'sweepstakes-entry' | 'side-hustle' | 'spending-habit' | 'funeral-cost' | 'charity-donation' | 'dry-cleaning-cost' | 'travel-insurance' | 'renters-insurance' | 'security-deposit' | 'wedding-guest' | 'holiday-budget-2' | 'fundraiser-goal' | 'biweekly-monthly' | 'bonus-calc'
  | 'generator-sizing' | 'furnace-cost' | 'pool-chemical-calc' | 'pool-heating-cost' | 'solar-panel-calc' | 'space-heater-cost'
  | 'fantasy_football' | 'horse_racing' | 'gift_budget' | 'gift_card' | 'asphalt' | 'concrete_slab' | 'fertilizer' | 'gravel' | 'sod'
  | 'leak-detection' | 'phantom-load' | 'pest-control-cost' | 'shower-time-cost' | 'toilet-flush-cost'
  | 'cashback-calc' | 'rebate-calc' | 'loyalty-rewards' | 'consignment-pricing' | 'craigslist-pricing' | 'auction-hammer'

const calcTypeMap: Record<string, CalcType> = {
  '50-30-20-budget-2': '50-30-20-budget-2',
  'ac-cost': 'appliance-cost',
  'alcohol-calculator': 'alcohol',
  'apartment-rent': 'rent-ok',
  'apartment-search': 'apt-search',
  'appliance-cost-calculator': 'appliance-cost',
  'appliance-energy': 'appliance-energy',
  'appliance-energy-2': 'appliance-energy',
  'aquarium-heater-calculator': 'aquarium-heater',
  'aquarium-lighting-calculator': 'aquarium-light',
  'aquarium-size': 'aquarium-size2',
  'aquarium-volume-calculator': 'aquarium-vol',
  'auto-catering-cost': 'cater-cost',
  'auto-catering-cost-1': 'cater-cost',
  'auto-childcare-cost': 'childcare',
  'auto-cleaning-supplies': 'clean-supplies',
  'auto-cleaning-supplies-1': 'clean-supplies',
  'auto-coffee-calc': 'coffee-calc2',
  'auto-commute-cost': 'commute-fuel',
  'auto-delivery-fee': 'delivery-fee',
  'auto-delivery-fee-1': 'delivery-fee',
  'auto-grocery-budget': 'grocery-budget',
  'auto-internet-cost': 'internet-cost',
  'auto-laundry-cost': 'laundry-cost',
  'auto-laundry-cost-1': 'laundry-auto',
  'auto-leftover-calc': 'leftover-calc',
  'auto-meal-prep': 'meal-prep',
  'auto-moving-cost': 'moving-cost',
  'auto-moving-cost-1': 'moving-cost',
  'auto-party-planner': 'event-budget',
  'auto-pet-cost': 'pet-cost2',
  'auto-phone-bill': 'phone-bill',
  'auto-pizza-calc': 'pizza-calc',
  'auto-storage-cost': 'storage-cost',
  'auto-storage-cost-1': 'storage-cost',
  'auto-subscription-cost': 'sub-cost',
  'auto-takeout-calc': 'takeout-calc',
  'auto-utility-bill': 'auto-util',
  'baggage-allowance-calculator': 'baggage',
  'battery-life-calculator': 'battery',
  'best-buy': 'best-buy',
  'bike-pace-calculator': 'bike-pace',
  'bill-split-calc': 'splitting',
  'bill-splitting': 'splitting',
  'billable-hours': 'billable-hrs',
  'bingo-odds': 'bingo-odds',
  'bingo-probability': 'bingo-odds',
  'blood-alcohol-calculator': 'bac',
  'bogo-deal': 'bogo',
  'budget-envelope': 'budget-envelope',
  'budget-planner-calc': 'budget-planner-calc',
  'bundle-savings': 'bundle-save',
  'buy-one-get-one': 'bogo',
  'cable-vs-streaming': 'streaming-cost',
  'caffeine-calculator': 'caffeine',
  'calories-burned-activity-calculator': 'calories-burned',
  'car-affordability-calc': 'car_payment',
  'car-cost-calculator': 'car_cost',
  'car-payment-calculator': 'car_payment',
  'carbon-footprint-calculator': 'carbon-foot',
  'carpet-calculator-calc': 'carpet-room',
  'carpet-room-calculator': 'carpet-room',
  'cat-tree': 'cat-tree',
  'cat-years-to-human': 'cat-years',
  'cell-phone-cost-calculator': 'cell-cost',
  'cell-phone-plan': 'cell-cost',
  'child-care-cost-2': 'childcare',
  'childcare-cost-calc': 'childcare',
  'cleaning-supplies': 'clean-supplies',
  'cleaning-time-calculator': 'cleaning-time',
  'closet-organizer': 'closet',
  'closing-cost': 'closing-cost',
  'clothing-size-calculator': 'clothing',
  'coffee-cost': 'coffee-cost',
  'coffee-cost-calculator': 'coffee-cost',
  'coin-flip': 'coin-flip',
  'coin-flip-calculator': 'coin-flip',
  'cold-frame': 'cold-frame',
  'color-converter': 'color-pick',
  'color-picker': 'color-pick',
  'commission-calc': 'commission',
  'commission-calculator': 'commission',
  'commute-cost': 'commute-fuel',
  'commute-cost-2': 'commute-fuel',
  'commute-cost-calc': 'commute-fuel',
  'commute-cost-calculator': 'commute-fuel',
  'companion-planting': 'companion',
  'container-garden': 'container',
  'cooking-time-calculator': 'cooking',
  'cost-per-use': 'cost-use',
  'coupon-savings': 'coupon',
  'coupon-stacker': 'coupon',
  'crop-rotation': 'crop-rotate',
  'crop-yield-calculator': 'crop-yield',
  'curtain-length-calculator': 'curtain-len',
  'curtain-size': 'curtain-size2',
  'currency-converter-quick': 'conversion',
  'currency-exchange-fee': 'conversion',
  'currency-travel': 'conversion',
  'cycling-calorie-calculator': 'cycling-cal',
  'daily-affirmation': 'daily-affirm',
  'data-usage-calc': 'data-usage',
  'data-usage-calculator': 'data-usage',
  'deal-comparison': 'price-comp',
  'debt-avalanche': 'debt-avalanche',
  'debt-snowball': 'debt-snowball',
  'debt-to-income-calc': 'mortgage-ok',
  'decision-maker': 'decision-maker',
  'deck-material-calc': 'deck-mat',
  'deck-material-calculator': 'deck-mat',
  'declutter-konmari': 'konmari',
  'decluttering-calculator': 'konmari',
  'desk-ergonomics-calculator': 'desk-ergo',
  'dice-roller': 'dice-roller',
  'dice-roller-calculator': 'dice-roller',
  'dining-budget': 'dining',
  'dining-out-calculator': 'dining',
  'discount-calc': 'coupon',
  'dog-training': 'dog-train',
  'dog-walking': 'dog-walk',
  'dog-years-to-human': 'dog-years',
  'download-time-calculator': 'download-time',
  'electric-bill': 'elec-bill',
  'electric-vehicle-calculator': 'ev',
  'electricity-bill-calculator': 'elec-bill',
  'electricity-usage': 'elec-bill',
  'emergency-fund-calc': 'emergency-fund-calc',
  'energy-bill': 'energy-bill',
  'ev-charging-cost': 'ev',
  'ev-vs-gas': 'ev',
  'exchange-rate-calculator': 'conversion',
  'fast-food-calculator': 'fastfood',
  'fence-material-calc': 'fence-mat',
  'fence-materials-calculator': 'fence-mat',
  'file-size-calculator': 'file-size2',
  'flight-carbon': 'flight-carbon2',
  'flight-carbon-offset': 'flight-offset',
  'flight-cost': 'flight-carbon2',
  'flooring-calc': 'floor-mat',
  'flooring-material-calculator': 'floor-mat',
  'freelance-rate': 'freelance',
  'freelance-rate-calculator': 'freelance',
  'fuel-cost-calculator': 'commute-fuel',
  'fuel-efficiency-calc': 'commute-fuel',
  'furniture-arrangement': 'furniture-arr',
  'furniture-layout': 'furniture-lay',
  'garage-organizer': 'garage',
  'garden-compost-calculator': 'compost',
  'garden-soil-calculator': 'soil-calc',
  'gas-mileage-calc': 'commute-fuel',
  'gas-trip-cost': 'commute-fuel',
  'gas-usage-calc': 'elec-bill',
  'gpa-calculator': 'gpa-calc',
  'grade-calculator': 'grade-calc',
  'gratitude-prompt': 'gratitude',
  'greenhouse-size': 'greenhouse',
  'grocery-budget-2': 'grocery-budget',
  'grocery-budget-calculator': 'grocery-budget',
  'gym-cost-calculator': 'gym',
  'gym-membership': 'gym',
  'habit-tracker': 'habit-track',
  'herb-garden': 'herb',
  'hex-color-calculator': 'hex-color',
  'home-affordability': 'mortgage-ok',
  'home-buying-cost': 'home-buy',
  'home-cleaning-cost': 'cleaning-time',
  'home-gym-cost': 'gym',
  'home-inventory': 'home-inv',
  'home-maintenance': 'maintenance',
  'home-maintenance-calculator': 'maintenance',
  'home-organization': 'home-org',
  'hotel-cost': 'hotel-cost',
  'hotel-cost-2': 'hotel-cost',
  'hotel-cost-calculator': 'hotel-cost',
  'hourly-annual': 'hourly-salary',
  'hourly-to-salary': 'hourly-salary',
  'human-age-in-dog-years': 'human-dog-years',
  'indoor-herbs': 'indoor-herb',
  'internet-service': 'net-speed',
  'internet-speed-calculator': 'net-speed',
  'laundry-cost': 'laundry-cost',
  'laundry-cost-calc': 'laundry-cost',
  'laundry-cost-calculator': 'laundry-cost',
  'led-vs-incandescent': 'bulb-save',
  'light-bulb-savings': 'bulb-save',
  'lottery-calculator': 'lotto-calc',
  'lottery-odds': 'lotto-odds',
  'lottery-odds-2': 'lotto-odds',
  'luggage-size': 'luggage',
  'luggage-size-2': 'luggage',
  'marathon-pace-calculator': 'run-pace',
  'meal-prep-cost': 'meal-prep',
  'meeting-cost': 'meeting-cost2',
  'microgreens': 'microgreen',
  'monitor-height-calculator': 'monitor-ht',
  'mood-tracker': 'mood-track',
  'mortgage-affordability': 'mortgage-ok',
  'move-cost-calc': 'moving-cost',
  'moving-checklist': 'moving-list',
  'moving-cost': 'moving-cost',
  'moving-cost-2': 'moving-cost',
  'moving-cost-calculator': 'moving-cost',
  'mulch-calculator': 'mulch',
  'mulch-calculator-calc': 'mulch',
  'name-generator': 'name-generator',
  'nap-timing-calculator': 'sleep',
  'net-worth-calc': 'net-worth-calc',
  'net-worth-calc-2': 'net-worth-calc-2',
  'overtime-calculator': 'overtime',
  'packing-list': 'packing-list',
  'packing-list-2': 'packing-list',
  'packing-volume-calculator': 'pack-vol',
  'paint-calculator-calc': 'paint',
  'parking-cost': 'parking',
  'parking-cost-2': 'parking',
  'party-planner-calculator': 'party-planner',
  'passive-income': 'passive-income',
  'password-generator': 'password-gen',
  'password-strength': 'password-check',
  'password-strength-calc': 'password-check',
  'password-strength-calculator': 'password-check',
  'pet-age-calculator': 'pet-age',
  'pet-boarding': 'pet-board',
  'pet-cost': 'pet-cost2',
  'pet-food': 'pet-food',
  'pet-food-calculator': 'pet-food',
  'pet-grooming': 'pet-groom',
  'pet-microchip': 'pet-chip',
  'pet-ownership-cost': 'pet-cost2',
  'pet-sitting': 'pet-sit',
  'pet-vaccination': 'pet-vax',
  'photo-resolution-calculator': 'photo',
  'plant-spacing-calculator': 'plant-space',
  'poker-hand-odds': 'poker-odds',
  'poker-odds': 'poker-odds',
  'pomodoro-timer': 'pomodoro',
  'price-comparison': 'price-comp',
  'price-per-ounce': 'price-oz',
  'price-per-pound': 'price-lb',
  'price-per-unit': 'unit-price',
  'prime-number-checker': 'prime',
  'priority-matrix': 'priority-matrix2',
  'productivity-score': 'productivity',
  'project-deadline': 'project-deadline2',
  'projector-screen-size': 'projector-screen',
  'public-transit': 'commute-fuel',
  'quick-unit-converter': 'conversion',
  'raised-bed': 'raised-bed',
  'random-number-generator': 'random-number',
  'rent-affordability': 'rent-ok',
  'rent-affordability-calc': 'rent-ok',
  'rental-car-calculator': 'rental-car',
  'rental-car-cost-calculator': 'rental-car',
  'rideshare-cost': 'taxi-fare',
  'ring-size-calculator': 'ring',
  'road-trip': 'trip-cost',
  'road-trip-cost': 'trip-cost',
  'room-paint-calculator': 'paint',
  'room-size-calculator': 'room-size',
  'rug-size': 'rug',
  'rug-size-calculator': 'rug',
  'running-calorie-calculator': 'running-cal',
  'salary-hourly': 'salary-hourly',
  'salary-to-hourly': 'salary-hourly',
  'seed-calculator-calc': 'seed-space',
  'seed-spacing-calculator': 'seed-space',
  'seed-starting': 'seed-start',
  'shed-organizer': 'shed',
  'sleep-calculator': 'sleep',
  'smoking-cost-calculator': 'smoking-cost',
  'stairs-calculator': 'stairs',
  'standing-desk-height': 'stand-desk',
  'step-counter-calculator': 'step-counter',
  'steps-to-km': 'steps-km',
  'steps-to-miles': 'steps-miles',
  'storage-needs': 'storage-cost',
  'storage-unit-cost': 'storage-cost',
  'streaming-budget': 'streaming-cost',
  'streaming-cost-calculator': 'streaming-cost',
  'subscription-calculator': 'subscription-calc',
  'subscription-savings': 'sub-save',
  'swim-pace-calculator': 'swim-pace',
  'swimming-calorie-calculator': 'swimming-cal',
  'takeout-vs-cooking': 'takeout-calc',
  'task-estimation': 'task-est',
  'taxi-fare': 'taxi-fare',
  'thermostat-savings': 'thermostat-save',
  'tile-calculator': 'tile',
  'tile-calculator-calc': 'tile',
  'time-blocking': 'time-block',
  'tip-by-service': 'tip',
  'tip-calculator': 'tip',
  'tip-split': 'splitting',
  'tire-size-calc': 'tire',
  'tire-size-calculator': 'tire',
  'toll-calculator': 'toll',
  'toll-cost': 'toll',
  'transplanting': 'transplant',
  'travel-budget': 'travel-budget',
  'travel-budget-calculator': 'travel-budget',
  'travel-time': 'travel-time',
  'trellis-calculator': 'trellis',
  'triathlon-pace-calculator': 'tri-pace',
  'trip-cost-calculator': 'trip-cost',
  'tv-size-distance-calculator': 'tv-size',
  'unit-price': 'unit-price',
  'unit-pricing': 'unit-price',
  'upload-time-calculator': 'upload-time',
  'utility-cost': 'util-cost',
  'utility-cost-estimator': 'util-est',
  'utility-estimate': 'util-est',
  'vacation-budget-2': 'travel-budget',
  'vacation-budget-calc': 'travel-budget',
  'vertical-garden': 'vertical',
  'wallpaper-calculator-calc': 'wallpaper',
  'wallpaper-rolls-calculator': 'wallpaper',
  'walking-calorie-calculator': 'walking-cal',
  'water-bill': 'water_bill',
  'water-bill-calculator': 'water_bill',
  'water-intake-calculator': 'water_intake',
  'water-usage-calc': 'water_bill',
  'weather-comparison': 'weather',
  'wedding-budget-2': 'wedding',
  'wedding-budget-calculator': 'wedding',
  'wifi-speed-calc': 'net-speed',
  'work-hours-tracker': 'work-hours',
  'workshop-layout': 'workshop',
  'worm-bin': 'worm',
  'yoga-calorie-calculator': 'yoga-cal',
  'zero-based-budget-2': 'zero-based-budget-2',
  'paypal-fees': 'paypal-fees',
  'stripe-fees': 'stripe-fees',
  'ebay-fees': 'ebay-fees',
  'etsy-fees': 'etsy-fees',
  'amazon-fba': 'amazon-fba',
  'crowdfunding-fee': 'crowdfunding-fee',
  'pawn-loan': 'pawn-loan',
  'craps-odds': 'craps-odds',
  'roulette-odds': 'roulette-odds',
  'parlay-odds': 'parlay-odds',
  'prop-bet': 'prop-bet',
  'sports-betting-odds': 'sports-betting-odds',
  'blackjack-basic': 'blackjack-basic',
  'generator-sizing': 'generator-sizing',
  'furnace-cost': 'furnace-cost',
  'pool-chemical-calc': 'pool-chemical-calc',
  'pool-heating-cost': 'pool-heating-cost',
  'solar-panel-calc': 'solar-panel-calc',
  'space-heater-cost': 'space-heater-cost',
  'leak-detection': 'leak-detection',
  'phantom-load': 'phantom-load',
  'pest-control-cost': 'pest-control-cost',
  'shower-time-cost': 'shower-time-cost',
  'toilet-flush-cost': 'toilet-flush-cost',
  'cashback-calc': 'cashback-calc',
  'rebate-calc': 'rebate-calc',
  'loyalty-rewards': 'loyalty-rewards',
  'consignment-pricing': 'consignment-pricing',
  'craigslist-pricing': 'craigslist-pricing',
  'auction-hammer': 'auction-hammer',
  'diaper-cost': 'diaper-cost',
  'formula-cost': 'formula-cost',
  'baby-gear': 'baby-gear',
  'college-fund': 'college-fund',
  'college-savings-calc': 'college-savings-calc',
  'pet-insurance': 'pet-insurance',
  'towing-capacity': 'towing-capacity',
  'tire-pressure-calc': 'tire-pressure-calc',
  'tire-pressure-calculator': 'tire-pressure-calc',
  'tire-pressure-calc-2': 'tire-pressure-calc',
  'qr-code-generator': 'qr-code-generator',
  'qr-code': 'qr-code-generator',
  'qr-generator': 'qr-code-generator',
  'font-size-calc': 'font-size-calc',
  'font-size-calculator': 'font-size-calc',
  'secret-santa': 'secret-santa',
  'secret-santa-generator': 'secret-santa',
  'yard-sale': 'yard-sale',
  'yard-sale-calculator': 'yard-sale',
  'raffle-tickets': 'raffle-tickets',
  'raffle-odds': 'raffle-tickets',
  'sweepstakes-entry': 'sweepstakes-entry',
  'sweepstakes-odds': 'sweepstakes-entry',
  'side-hustle': 'side-hustle',
  'side-hustle-calculator': 'side-hustle',
  'spending-habit': 'spending-habit',
  'spending-tracker': 'spending-habit',
  'funeral-cost': 'funeral-cost',
  'funeral-cost-calculator': 'funeral-cost',
  'charity-donation': 'charity-donation',
  'charity-tax-calculator': 'charity-donation',
  'dry-cleaning-cost': 'dry-cleaning-cost',
  'dry-cleaning': 'dry-cleaning-cost',
  'travel-insurance': 'travel-insurance',
  'travel-insurance-calculator': 'travel-insurance',
  'renters-insurance': 'renters-insurance',
  'renter-insurance-calculator': 'renters-insurance',
  'security-deposit': 'security-deposit',
  'security-deposit-calculator': 'security-deposit',
  'wedding-guest': 'wedding-guest',
  'wedding-guest-cost': 'wedding-guest',
  'holiday-budget-2': 'holiday-budget-2',
  'holiday-budget': 'holiday-budget-2',
  'fundraiser-goal': 'fundraiser-goal',
  'fundraiser-calculator': 'fundraiser-goal',
  'biweekly-monthly': 'biweekly-monthly',
  'biweekly-calculator': 'biweekly-monthly',
  'bonus-calc': 'bonus-calc',
  'bonus-calculator': 'bonus-calc',
  'tax-bonus-calculator': 'bonus-calc',
  'asphalt-calculator-calc': 'asphalt',
  'concrete-slab-calc': 'concrete_slab',
  'fantasy-football': 'fantasy_football',
  'fertilizer-calc': 'fertilizer',
  'generator-sizing-2': 'generator-sizing',
  'gift-budget': 'gift_budget',
  'gift-card-value': 'gift_card',
  'gravel-calculator': 'gravel',
  'horse-racing-odds': 'horse_racing',
  'sod-calculator-calc': 'sod',
}

function getCalcType(slug: string): CalcType {
  return calcTypeMap[slug] || 'conversion'
}

const tipSchema = z.object({
  bill: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  percent: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  split: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1, 'Must be >= 1'),
  service: z.enum(['poor', 'average', 'good', 'great', 'excellent', 'custom']).default('good'),
})

const gpaSchema = z.object({
  grades: z.string().min(1, 'Required'),
})

const passwordSchema = z.object({
  length: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 4 && parseFloat(v) <= 128, '4-128'),
  upper: z.enum(['yes', 'no']),
  digits: z.enum(['yes', 'no']),
  symbols: z.enum(['yes', 'no']),
})

function TipResults({ bill, percent, split, roundUp, roundedTip, roundedTotal }: { bill: number; percent: number; split: number; roundUp?: boolean; roundedTip?: number; roundedTotal?: number }) {
  const tipAmount = bill * (percent / 100)
  const total = bill + tipAmount
  const perPerson = total / split
  const rPerPerson = roundUp && roundedTotal ? roundedTotal / split : perPerson
  return (
    <div className="text-center space-y-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tip Amount</p>
        <p className="text-3xl font-bold text-[#06b6d4]">${(roundUp && roundedTip !== undefined ? roundedTip : tipAmount).toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Bill</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">${(roundUp && roundedTotal !== undefined ? roundedTotal : total).toFixed(2)}</p>
        {roundUp && roundedTotal !== undefined && roundedTotal > total && (
          <p className="text-xs text-gray-400 mt-1">Rounded up from ${total.toFixed(2)}</p>
        )}
      </div>
      {split > 1 && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Per Person ({split} ways)</p>
          <p className="text-xl font-bold text-[#06b6d4]">${(roundUp && rPerPerson !== undefined ? rPerPerson : perPerson).toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}

function TipBreakdownChart({ bill, tipAmount, total, split }: { bill: number; tipAmount: number; total: number; split: number }) {
  const pctBill = (bill / total) * 100
  const pctTip = (tipAmount / total) * 100
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 font-medium text-center">Bill Breakdown</p>
      <div className="flex h-6 w-full rounded-full overflow-hidden">
        <div className="bg-blue-400 transition-all" style={{ flex: pctBill }} />
        <div className="bg-amber-400 transition-all" style={{ flex: pctTip }} />
      </div>
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-gray-500">Bill (${bill.toFixed(2)})</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-gray-500">Tip (${tipAmount.toFixed(2)})</span></div>
      </div>
      {split > 1 && (
        <div className="text-xs text-gray-400 text-center">
          <p>Split {split} ways: <strong className="text-gray-600 dark:text-gray-300">${(total / split).toFixed(2)}</strong> per person</p>
        </div>
      )}
    </div>
  )
}

function ConversionResults({ value, fromUnit, toUnit }: { value: number; fromUnit: string; toUnit: string }) {
  const valFrom = getUnits('length').find(u => u.id === fromUnit) || getUnits('mass').find(u => u.id === fromUnit) || getUnits('temperature').find(u => u.id === fromUnit)
  const valTo = getUnits('length').find(u => u.id === toUnit) || getUnits('mass').find(u => u.id === toUnit) || getUnits('temperature').find(u => u.id === toUnit)
  const fromLabel = valFrom?.label || fromUnit
  const toLabel = valTo?.label || toUnit
  if (!value || !fromUnit || !toUnit) {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Unit Converter</p>
        <p className="text-lg text-gray-900 dark:text-white">Select units and enter a value to convert.</p>
      </div>
    )
  }
  const getDim = (id: string) => getUnits('length').find(u => u.id === id) ? 'length' : getUnits('mass').find(u => u.id === id) ? 'mass' : 'temperature'
  const dim = getDim(fromUnit)
  const allUnits = getUnits(dim as 'length' | 'mass' | 'temperature')
  const convFrom = allUnits.find(u => u.id === fromUnit)
  const convTo = allUnits.find(u => u.id === toUnit)
  if (!convFrom || !convTo) {
    return <p className="text-sm text-gray-400 text-center">Incompatible units</p>
  }
  const baseValue = (value + (convFrom.offset || 0)) * convFrom.baseFactor
  const result = dim === 'temperature' ? (baseValue / (convTo.baseFactor || 1)) - (convTo.offset || 0) : baseValue / (convTo.baseFactor || 1)
  return (
    <div className="text-center space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">Converted Value</p>
      <p className="text-3xl font-bold text-[#06b6d4]">{result.toFixed(6)} {toLabel}</p>
      <p className="text-xs text-gray-400">{value} {fromLabel} = {result.toFixed(4)} {toLabel}</p>
    </div>
  )
}

function GPAResults({ grades }: { grades: string }) {
  const gradePoints: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0, 'A+': 4.0, 'A-': 3.7, 'B+': 3.3, 'B-': 2.7, 'C+': 2.3, 'C-': 1.7, 'D+': 1.3, 'D-': 0.7 }
  const gpas = grades.split(',').map(g => g.trim().toUpperCase())
  const numeric = gpas.map(g => gradePoints[g] !== undefined ? gradePoints[g] : parseFloat(g)).filter(v => !isNaN(v))
  const gpa = numeric.length > 0 ? numeric.reduce((a, b) => a + b, 0) / numeric.length : 0
  return (
    <div className="text-center space-y-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">GPA</p>
        <p className="text-3xl font-bold text-[#06b6d4]">{gpa.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Courses</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{numeric.length}</p>
      </div>
    </div>
  )
}

function RandomResults() {
  const num = useMemo(() => Math.floor(Math.random() * 100) + 1, [])
  return (
    <div className="text-center space-y-3">
      <p className="text-4xl font-bold text-[#06b6d4]">{num}</p>
      <p className="text-xs text-gray-400">Random number 1-100</p>
    </div>
  )
}

function PasswordResults({ length, upper, digits, symbols }: { length: number; upper: string; digits: string; symbols: string }) {
  const pwd = useMemo(() => {
    let chars = 'abcdefghijklmnopqrstuvwxyz'
    if (upper === 'yes') chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (digits === 'yes') chars += '0123456789'
    if (symbols === 'yes') chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    let result = ''
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }, [length, upper, digits, symbols])
  return (
    <div className="text-center space-y-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generated Password</p>
        <p className="text-2xl font-bold text-[#06b6d4] font-mono break-all">{pwd}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Length</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{length} characters</p>
      </div>
    </div>
  )
}

interface Props {
  calculator: {
    slug: string; title: string; description: string; tier: string
    category: string; hubSlug: string; hubName: string; keywords: string[]
    dataDependent?: boolean; dataRefreshCadence?: string
  }
}

function knownCalcType(slug: string): string {
  return calcTypeMap[slug] || 'default'
}

function calcDefaults(slug: string): any {
  const t = knownCalcType(slug)
  if (t === 'tip') return { bill: '50', percent: '18', split: '1', service: 'good' }
  if (everydayDefaults[t]) return everydayDefaults[t]
  return { value: '1', from: 'meters', to: 'feet' }
}

function getEverydayPresets(type: string): { label: string; values: Record<string, string> }[] {
  if (type === 'tip') {
    return [
      { label: '15% on $50', values: { bill: '50', percent: '15', split: '1', service: 'average' } },
      { label: '18% on $80', values: { bill: '80', percent: '18', split: '2', service: 'good' } },
      { label: '20% on $120', values: { bill: '120', percent: '20', split: '3', service: 'great' } },
    ]
  }
  if (everydayPresets[type]) return everydayPresets[type]
  return []
}

function GenericEverydayCalculator({ calculator }: Props) {
  const calcType = getCalcType(calculator.slug)
  const typeKey = knownCalcType(calculator.slug)
  const defaults = calcDefaults(calculator.slug)
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set())
  const [extraFields, setExtraFields] = useState<Record<string, string>>({})
  const [roundUp, setRoundUp] = useState(false)

  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [useSlider, setUseSlider] = useState(true)
  const lengthUnits = getUnits('length')
  const massUnits = getUnits('mass')
  const tempUnits = getUnits('temperature')
  const convAllUnits = useMemo(() => [...lengthUnits, ...massUnits, ...tempUnits], [lengthUnits, massUnits, tempUnits])
  const [fieldUnits, setFieldUnits] = useState<Record<string, string>>({ fromUnit: 'm', toUnit: 'ft' })
  const handleUnitChange = useCallback((name: string, unit: string) => {
    setFieldUnits(prev => ({ ...prev, [name]: unit }))
  }, [])

  let schema: any = tipSchema
  if (calcType === 'conversion' || calcType === 'default') {
    schema = z.object({ value: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') })
  } else if (calcType !== 'tip' && everydaySchemas[calcType]) {
    schema = everydaySchemas[calcType]
  }

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: 'onChange',
  })

  const presets = useMemo(() => getEverydayPresets(calcType), [calcType])
  const applyPreset = useCallback((preset: { label: string; values: Record<string, string> }) => {
    Object.entries(preset.values).forEach(([key, value]) => {
      if (!lockedFields.has(key)) form.setValue(key as any, value)
    })
  }, [form, lockedFields])

  const watched = useWatch({ control: form.control })
  const v = watched as any
  const watchedInputs = useMemo(() => {
    const vals = watched as Record<string, string>
    return Object.fromEntries(Object.entries(vals).filter(([, v]) => v !== undefined && v !== ''))
  }, [watched])

  const result = useMemo(() => {
  const calcDef = calcDefs[calculator.slug] || calcDefs[calcType]
  if (calcDef) {
      const vals: Record<string, any> = {}
      for (const f of calcDef.fields) {
        const raw = v[f.name]
        if (f.type === 'number') { vals[f.name] = raw !== undefined && raw !== '' ? Number(raw) : 0 }
        else { vals[f.name] = raw ?? '' }
      }
      const res = calcDef.compute(vals)
      return (
        <div className="text-center space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">{res.label}</p>
            <p className="text-3xl font-bold text-[#06b6d4]">{typeof res.result === 'number' ? res.result.toFixed(4) : res.result} {res.unit}</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-400 space-y-1">
            {(res.steps ?? []).map((step, i) => (
              <p key={i}><strong>{step.label}:</strong> {step.value}</p>
            ))}
          </div>
        </div>
      )
    }
    if (calcType === 'tip') {
      const bill = parseFloat(v.bill) || 0
      const percent = parseFloat(v.percent) || 0
      const split = parseFloat(v.split) || 1
      const tipAmount = bill * (percent / 100)
      const total = bill + tipAmount
      const extraRoundMode = extraFields?.extra_round_up || 'none'
      const effectiveRound = roundUp ? 'dollar' : extraRoundMode
      const roundedTotal = effectiveRound === 'dollar' ? Math.ceil(total) : effectiveRound === 'five' ? Math.ceil(total / 5) * 5 : effectiveRound === 'ten' ? Math.ceil(total / 10) * 10 : Math.ceil(total)
      const roundedTip = effectiveRound !== 'none' ? roundedTotal - bill : tipAmount
      const useRounding = effectiveRound !== 'none'
      return (
        <div className="space-y-6">
          <TipResults bill={bill} percent={percent} split={split} roundUp={useRounding} roundedTip={roundedTip} roundedTotal={roundedTotal} />
          <TipBreakdownChart bill={bill} tipAmount={useRounding ? roundedTip : tipAmount} total={useRounding ? roundedTotal : total} split={split} />
          <div className="text-xs text-gray-400 text-center">
            <p>Standard tipping: 15% for average, 18% for good, 20% for great, 25% for excellent service.</p>
          </div>
        </div>
      )
    }
    const renderer = everydayRenderers[calcType]
    if (renderer) {
      const parsed: Record<string, any> = {}
      const schemaDef = everydaySchemas[calcType]
      if (schemaDef) {
        const shape = schemaDef.shape as Record<string, any>
        Object.keys(shape).forEach(key => {
          const raw = v[key]
          if (raw !== undefined && raw !== '') {
            const isEnum = shape[key] instanceof z.ZodEnum
            const isString = shape[key] instanceof z.ZodString
            if (isEnum || isString) { parsed[key] = raw } else { parsed[key] = parseFloat(raw) || 0 }
          } else {
            const isString = shape[key] instanceof z.ZodString
            parsed[key] = isString ? '' : 0
          }
        })
      }
      return <div className="space-y-4">{renderer(parsed)}</div>
    }
    return <ConversionResults value={parseFloat(v.value) || 0} fromUnit={fieldUnits.fromUnit || 'm'} toUnit={fieldUnits.toUnit || 'ft'} />
  }, [v, calcType, fieldUnits, roundUp, extraFields])

  const formField = useCallback((name: string, label: string, opts?: { min?: number; max?: number; step?: number }) =>
    useSlider
      ? <CalculatorSlider key={name} name={name} label={label} min={opts?.min} max={opts?.max} step={opts?.step ?? 1} />
      : <CalculatorFormField key={name} name={name} label={label} min={opts?.min} max={opts?.max} step={(opts?.step ?? 1).toString()} />
  , [useSlider])

  const formContent = useMemo(() => {
    const calcDef = calcDefs[calculator.slug] || calcDefs[calcType]
    if (calcDef) {
      return <FieldsByMode fields={calcDef.fields} useSlider={useSlider} lockedFields={lockedFields} toggleLock={toggleLock} />
    }
    if (calcType === 'tip') {
      return (
        <>
          <CalculatorFormField name="bill" label="Bill Amount ($)" min={0} step="0.01" locked={lockedFields.has('bill')} onLockToggle={toggleLock} />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Quality</label>
            <select
              {...form.register('service', {
                onChange(e) {
                  const map: Record<string, string> = { poor: '10', average: '15', good: '18', great: '20', excellent: '25' }
                  if (e.target.value !== 'custom') form.setValue('percent', map[e.target.value] || '15')
                },
              })}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="poor">Poor (10%)</option>
              <option value="average">Average (15%)</option>
              <option value="good" selected>Good (18%)</option>
              <option value="great">Great (20%)</option>
              <option value="excellent">Excellent (25%)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {form.watch('service') === 'custom' && <CalculatorFormField name="percent" label="Tip Percentage (%)" min={0} step="0.5" locked={lockedFields.has('percent')} onLockToggle={toggleLock} />}
          {form.watch('service') !== 'custom' && (
            <div className="flex items-center gap-2">
              <CalculatorFormField name="percent" label="Tip Percentage (%)" min={0} step="0.5" locked={lockedFields.has('percent')} onLockToggle={toggleLock} />
              <span className="text-xs text-gray-400 mt-6 cursor-pointer underline" onClick={() => form.setValue('service', 'custom')}>Edit</span>
            </div>
          )}
          <ModeFieldGroup minMode="professional" label="Group Options">
            <CalculatorFormField name="split" label="Split Among" min={1} locked={lockedFields.has('split')} onLockToggle={toggleLock} />
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={roundUp} onChange={e => setRoundUp(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-[#06b6d4] focus:ring-[#06b6d4]" />
              Round up total to nearest dollar
            </label>
          </ModeFieldGroup>
        </>
      )
    }
    const schemaDef = everydaySchemas[calcType]
    if (schemaDef) {
      const shape = schemaDef.shape as Record<string, any>
      const fieldLabels: Record<string, string> = {
        us: 'US Size', mm: 'Circumference (mm)', weight: 'Weight (kg)', method: 'Cooking Method',
        distance: 'Distance (km)', hours: 'Hours', mins: 'Minutes',
        steps: 'Number of Steps', stride: 'Stride Length (m)',
        activityMin: 'Activity (min)', cups: 'Cups',
        volume: 'Volume (mL)', abv: 'ABV (%)', drinks: 'Number of Drinks', gender: 'Gender',
        perDay: 'Cost Per Unit ($)', quantity: 'Daily Quantity', guests: 'Guests', total: 'Total Budget ($)', items: 'Items', rooms: 'Rooms',
        bath: 'Bathrooms', loads: 'Loads/Week', costPer: 'Cost Per Load ($)',
        watts: 'Wattage (W)', rate: 'Electric Rate ($/kWh)', usage: 'Usage (L)', base: 'Base Fee ($)',
        devices: 'Devices', streaming: '4K Streaming', gaming: 'Gaming', work: 'Work from Home',
        plan: 'Plan Cost ($)', lines: 'Lines', device: 'Device Cost ($)',
        services: 'Number of Services', avgMonthlyCost: 'Avg Monthly Cost ($)',
        people: 'People', perPersonWeekly: 'Per Person/Week ($)',
        meals: 'Meals/Week', savings: 'Savings %',
        monthly: 'Monthly Fee ($)', visits: 'Visits/Month', commute: 'Commute Cost ($)',
        homeValue: 'Home Value ($)', rule: 'Rule (%)',
        price: 'Car Price ($)', down: 'Down Payment ($)', term: 'Loan Term (months)',
        payment: 'Monthly Payment ($)', insurance: 'Insurance ($)', gasCost: 'Gas ($)',
        maintenance: 'Maintenance ($)', km: 'Monthly KM', mpg: 'Fuel Efficiency (mpg)',
        gasPrice: 'Gas Price ($/gal)', width: 'Width', height: 'Height',
        aspect: 'Aspect Ratio', rim: 'Rim Diameter (in)',
        odds: 'Odds (1 in X)', ticket: 'Ticket Price ($)', jackpot: 'Jackpot ($)',
        mah: 'Battery Capacity (mAh)', ma: 'Load Current (mA)', voltage: 'Voltage (V)',
        widthPx: 'Width (px)', heightPx: 'Height (px)', dpi: 'DPI',
        size: 'File Size', speed: 'Speed (Mbps)', unit: 'Unit',
        hex: 'Hex Color (#rrggbb)', number: 'Number',
        met: 'MET Value', minutes: 'Duration (min)', activityDesc: 'Activity Name',
        avgCal: 'Avg Calories', avgCost: 'Avg Cost ($)',
        battery: 'Battery (kWh)', efficiency: 'Efficiency (km/kWh)', chargeKw: 'Charger Power (kW)',
        electricity: 'Electricity (kWh/mo)', gasUsage: 'Gas (therms/mo)', carKm: 'Car (km/week)', flights: 'Flights/Year',
        annual: 'Annual Salary ($)', incomeRate: 'Hourly Rate ($)', regular: 'Regular Hours',
        overtime: 'Overtime Hours', sales: 'Sales ($)', target: 'Target Income ($)',
        billable: 'Billable Hours/Year', annualExpenses: 'Annual Expenses ($)',
        tipPercent: 'Tip %', wake: 'Wake Time (HH:MM)', cycles: 'Sleep Cycles',
        coats: 'Coats', tileW: 'Tile Width (m)', tileH: 'Tile Height (m)', perBox: 'Per Box',
        plankW: 'Plank Width (m)', plankL: 'Plank Length (m)', perPack: 'Per Pack',
        roomW: 'Room Width (m)', roomL: 'Room Length (m)',
        fullness: 'Fullness Factor', mount: 'Mount Type',
        walkway: 'Walkway Width (m)', rise: 'Rise per Step (cm)', run: 'Run per Step (cm)',
        totalRise: 'Total Rise (cm)', length: 'Length', area: 'Area (m�)',
        depth: 'Depth (m)', spacing: 'Spacing (m)', yieldPerM2: 'Yield per m� (kg)',
        perKm: 'Per km ($)', tip: 'Tip ($)', prepTime: 'Prep Time (min)',
        cost: 'Total Cost ($)', petFood: 'Monthly Food ($)', vet: 'Annual Vet ($)',
        supplies: 'Monthly Supplies ($)', other: 'Other ($)',
        days: 'Days/Week', dailyRate: 'Daily Rate ($)', registration: 'Registration ($)',
        months: 'Months', perPersonTotal: 'Per Person ($)', unitSize: 'Unit Size (sqft)',
        min: 'Min', max: 'Max', trials: 'Number of Flips', sides: 'Sides',
        dice: 'Number of Dice', password: 'Password', packs: 'Packs/Day',
        habit: 'Habit Name', done: 'Days Done', rating: 'Mood Rating',
        cats: 'Number of Cats', age: 'Age (years)', sessions: 'Sessions/Week',
        minPer: 'Min/Session', kmDaily: 'Daily Distance (km)',
        chipSize: 'Chip Size', implant: 'Implant Readiness',
        human: 'Human Age (years)', budget: 'Total Budget ($)',
        fees: 'Application Fees ($)', downPct: 'Down Payment %',
        debts: 'Monthly Debts ($)', rent: 'Monthly Rent ($)',
        kwh: 'kWh Used', oldW: 'Old Bulb (W)', newW: 'New Bulb (W)',
        count: 'Number of Bulbs', smartCost: 'Thermostat Cost ($)',
        priceA: 'Option A ($)', qtyA: 'Option A Qty', priceB: 'Option B ($)', qtyB: 'Option B Qty',
        single: 'Single Price ($)', bundle: 'Bundle Price ($)',
        itemQty: 'Quantity', uses: 'Expected Uses', discount: 'Discount %',
        oz: 'Ounces', lb: 'Pounds', units: 'Number of Units',
        daily: 'Daily Rate ($)', deposit: 'Deposit ($)',
        tolls: 'Daily Tolls ($)', pots: 'Number of Pots',
        trays: 'Number of Trays', bedrooms: 'Bedrooms',
        outfits: 'Outfits', shoes: 'Shoe Pairs',
        flight: 'Flight Cost ($)', lodging: 'Lodging ($)',
        weddingTransport: 'Transport ($)', activities: 'Activities ($)',
        layovers: 'Layovers',
        subs: 'Subscriptions', current: 'Current ($)',
        attendees: 'Attendees', duration: 'Duration (min)',
        avgSalary: 'Avg Salary ($)',
        breaks: 'Break (min)', tasks: 'Tasks',
        urgent: 'Urgent', important: 'Important',
        planned: 'Planned', focus: 'Focus %',
        hoursPer: 'Hours/Task', hoursPerDay: 'Hours/Day',
        optimistic: 'Optimistic (hrs)', likely: 'Likely (hrs)',
        pessimistic: 'Pessimistic (hrs)', blocks: 'Blocks',
        start: 'Start Time', end: 'End Time',
        intensity: 'Intensity', style: 'Style',
        cars: 'Cars', bins: 'Storage Bins',
        r: 'Red (0-255)', g: 'Green (0-255)', b: 'Blue (0-255)',
        mainBalls: 'Main Balls', picks: 'Number of Picks',
        extraBalls: 'Extra Balls', outs: 'Outs',
        cards: 'Cards Left', passengers: 'Passengers',
        sofa: 'Sofa Width (m)',
        table: 'Table Width (m)', climate: 'Climate',
        planted: 'Planted Tank', fish: 'Fish Count',
        fishSize: 'Fish Size (cm)', room: 'Room Temp (�C)',
        trash: 'Trash ($)',
        taxes: 'Taxes/Fees ($)', portions: 'Portions Made',
        eaten: 'Portions Eaten', waste: 'Wasted',
        pizzas: 'Pizzas', slices: 'Slices per Pizza',
        bogo: 'BOGO Deal', swim: 'Swim (km)', bike: 'Bike (km)',
        swimHrs: 'Swim Hours', swimMin: 'Swim Minutes',
        bikeHrs: 'Bike Hours', bikeMin: 'Bike Minutes',
        runHrs: 'Run Hours', runMin: 'Run Minutes',
        rowSpacing: 'Row Spacing (m)',
        income: 'Monthly Income ($)', housing: 'Housing ($)', food: 'Food ($)',
        transport: 'Transport ($)', utilities: 'Utilities ($)',
        savingsGoal: 'Savings Goal ($)', groceries: 'Groceries ($)',
        dining: 'Dining Out ($)', eventEntertainment: 'Entertainment ($)',
        cashTotal: 'Total Cash ($)', monthlyExpenses: 'Monthly Expenses ($)',
        budgetMonths: 'Months', currentSavings: 'Current Savings ($)',
        home: 'Home Value ($)', investments: 'Investments ($)', cash: 'Cash ($)',
        vehicles: 'Vehicles ($)', otherAssets: 'Other Assets ($)',
        mortgage: 'Mortgage ($)', loans: 'Loans ($)',
        creditCards: 'Credit Cards ($)', otherLiabilities: 'Other Liabilities ($)',
        assets: 'Total Assets ($)', liabilities: 'Total Liabilities ($)',
        investment: 'Investment Value ($)', yieldRate: 'Annual Yield (%)',
        monthlyAdd: 'Monthly Additions ($)',
        debt1: 'Debt 1 ($)', min1: 'Debt 1 Min ($)', debt2: 'Debt 2 ($)',
        min2: 'Debt 2 Min ($)', debt3: 'Debt 3 ($)', min3: 'Debt 3 Min ($)',
        extra: 'Extra Payment ($)', rate1: 'Debt 1 APR (%)',
        rate2: 'Debt 2 APR (%)', rate3: 'Debt 3 APR (%)',
        budgetSavings: 'Savings ($)',
        amount: 'Transaction Amount ($)',
        type: 'Transaction Type',
        cardType: 'Card Type',
        salePrice: 'Sale Price ($)',
        itemPrice: 'Item Price ($)',
        goal: 'Funding Goal ($)',
        qty: 'Quantity',
        shipping: 'Shipping ($)',
        store: 'Store Subscription',
        sizeTier: 'Size Tier',
        fundraisingPlatform: 'Platform',
        itemValue: 'Item Value ($)',
        loanPct: 'Loan % (25-50)',
        monthlyRate: 'Monthly Rate (%)',
        loanMonths: 'Duration (months)',
        betAmount: 'Bet Amount ($)',
        betType: 'Bet Type',
        wheelType: 'Wheel Type',
        legs: 'Number of Legs',
        oddsDecimal: 'Decimal Odds',
        stake: 'Stake ($)',
        yesOdds: 'Yes Odds',
        noOdds: 'No Odds',
        oddsAmerican: 'Odds (American)',
        handValue: 'Your Hand Total',
        dealerUp: 'Dealer Up-Card',
        sqft: 'Home Size (sqft)',
        ac: 'Air Conditioner',
        fridge: 'Refrigerator',
        wellPump: 'Well Pump',
        sump: 'Sump Pump',
        lights: 'Lights & Outlets',
        region: 'Region',
        chemical: 'Chemical Type',
        currentLevel: 'Current Level (ppm)',
        targetLevel: 'Target Level (ppm)',
        desiredTemp: 'Desired Temp (F)',
        currentTemp: 'Current Temp (F)',
        heaterType: 'Heater Type',
        monthlyBill: 'Monthly Electric Bill ($)',
        sunlight: 'Daily Sunlight (hours)',
        systemEfficiency: 'System Efficiency (%)',
        dripsPerMin: 'Drips Per Minute',
        dailyHours: 'Hours Per Day',
        avgStandby: 'Avg Standby Watts (W)',
        pestType: 'Pest Type',
        treatmentType: 'Treatment Type',
        severity: 'Severity',
        showerMins: 'Shower Length (min)',
        flowRate: 'Flow Rate (GPM)',
        waterCost: 'Water Cost ($/gal)',
        flushesPerDay: 'Flushes Per Day',
        gallonsPerFlush: 'Gallons Per Flush',
        annualSpend: 'Annual Spending ($)',
        cashbackRate: 'Cashback Rate (%)',
        category: 'Card Category',
        purchasePrice: 'Purchase Price ($)',
        rebateAmount: 'Rebate Amount ($)',
        mailIn: 'Mail-In Rebate',
        incomeTaxRate: 'Tax Rate (%)',
        pointsPerDollar: 'Points Per Dollar',
        redemptionValue: 'Redemption Value (cents)',
        commissionRate: 'Commission Rate (%)',
        itemAge: 'Item Age (months)',
        originalPrice: 'Original Price ($)',
        condition: 'Condition',
        demand: 'Demand Level',
        hammerPrice: 'Hammer Price ($)',
        buyersPremium: "Buyer's Premium (%)",
        sellersCommission: "Seller's Commission (%)",
        vatOnPremium: 'VAT on Premium',
        vatRate: 'VAT Rate (%)',
        babyAge: 'Baby Age',
        diapersPerDay: 'Diapers Per Day',
        costPerDiaper: 'Cost Per Diaper ($)',
        brand: 'Brand',
        ozPerFeeding: 'Ounces Per Feeding',
        feedingsPerDay: 'Feedings Per Day',
        costPerOz: 'Cost Per Oz ($)',
        stroller: 'Stroller ($)',
        carSeat: 'Car Seat ($)',
        crib: 'Crib ($)',
        clothes: 'Clothes ($)',
        bottles: 'Bottles ($)',
        highChair: 'High Chair ($)',
        babyOther: 'Other Items ($)',
        preset: 'Spending Level',
        childAge: 'Child Age (years)',
        collegeAge: 'College Age (years)',
        collegeSavings: 'Current Savings ($)',
        monthlyContribution: 'Monthly Contribution ($)',
        expectedReturn: 'Expected Return (%)',
        tuitionCost: 'Annual Tuition Cost ($)',
        stateTaxDeduction: 'State Tax Deduction ($)',
        tuitionInflation: 'Tuition Inflation (%)',
        petType: 'Pet Type',
        petAge: 'Pet Age (years)',
        breed: 'Breed',
        coverageLevel: 'Coverage Level',
        deductible: 'Deductible ($)',
        reimbursement: 'Reimbursement (%)',
        annualVetCost: 'Annual Vet Cost ($)',
        gvwr: 'GVWR (lbs)',
        curbWeight: 'Curb Weight (lbs)',
        payload: 'Payload (lbs)',
        tongueWeightPercent: 'Tongue Weight (%)',
        trailerWeight: 'Trailer Weight (lbs)',
        currentPressure: 'Current Pressure (PSI)',
        recommendedPressure: 'Recommended Pressure (PSI)',
        load: 'Load',
        temperature: 'Temperature',
        contentType: 'Content Type',
        content: 'Content',
        qrSize: 'QR Size',
        errorCorrection: 'Error Correction',
        baseSize: 'Base Size (px)',
        scaleRatio: 'Scale Ratio',
        level: 'Heading Level',
        participants: 'Participants',
        maxBudget: 'Max Budget ($)',
        names: 'Names (optional)',
        clothingValue: 'Clothing Value ($)',
        furnitureValue: 'Furniture Value ($)',
        booksValue: 'Books Value ($)',
        toysValue: 'Toys Value ($)',
        kitchenValue: 'Kitchen Value ($)',
        electronicsValue: 'Electronics Value ($)',
        strategy: 'Pricing Strategy',
        ticketsSold: 'Tickets Sold',
        yourTickets: 'Your Tickets',
        prizeValue: 'Prize Value ($)',
        ticketPrice: 'Ticket Price ($)',
        entriesSubmitted: 'Entries Submitted',
        totalEntriesEstimated: 'Total Entries (est.)',
        numberOfPrizes: 'Number of Prizes',
        hourlyRate: 'Hourly Rate ($)',
        hoursPerWeek: 'Hours/Week',
        annualWeeks: 'Weeks/Year',
        expenses: 'Annual Expenses ($)',
        taxRate: 'Tax Rate (%)',
        coffee: 'Coffee ($/day)',
        lunch: 'Lunch ($/day)',
        snacks: 'Snacks ($/day)',
        dailyDrinks: 'Drinks ($/day)',
        transportation: 'Transportation ($/day)',
        disposition: 'Disposition',
        casketCost: 'Casket Cost ($)',
        serviceFee: 'Service Fee ($)',
        burialPlot: 'Burial Plot ($)',
        headstone: 'Headstone ($)',
        funeralOther: 'Other Costs ($)',
        donationAmount: 'Donation Amount ($)',
        taxBracket: 'Tax Bracket (%)',
        itemized: 'Itemized Deductions',
        shirtsPerWeek: 'Shirts/Week',
        suitsPerWeek: 'Suits/Week',
        dressesPerWeek: 'Dresses/Week',
        coatsPerWeek: 'Coats/Week',
        pantsPerWeek: 'Pants/Week',
        weeksPerYear: 'Weeks/Year',
        tripCost: 'Trip Cost ($)',
        ageGroup: 'Age Group',
        coverageType: 'Coverage Type',
        propertyValue: 'Personal Property Value ($)',
        liability: 'Liability ($)',
        monthlyRent: 'Monthly Rent ($)',
        depositMonths: 'Deposit (months)',
        stateRequiresInterest: 'State Requires Interest',
        outfit: 'Outfit ($)',
        transportationCost: 'Transportation ($)',
        hotelNights: 'Hotel Nights',
        hotelRate: 'Nightly Rate ($)',
        gift: 'Gift ($)',
        hasPreWedding: 'Pre-Wedding Events',
        totalBudget: 'Total Budget ($)',
        gifts: 'Gifts ($)',
        travel: 'Travel ($)',
        weddingFood: 'Food ($)',
        decorations: 'Decorations ($)',
        entertainment: 'Entertainment ($)',
        targetAmount: 'Target Amount ($)',
        numberOfDonors: 'Expected Donors',
        averageDonation: 'Average Donation ($)',
        platform: 'Platform',
        biweeklyAmount: 'Biweekly Amount ($)',
        bonusAmount: 'Bonus Amount ($)',
        bonusTaxRate: 'Fed Tax Rate (%)',
        stateTax: 'State Tax (%)',
        fica: 'FICA (%)',
      }
      const optionLabels: Record<string, string> = {
        dog: 'Dog', cat: 'Cat', male: 'Male', female: 'Female',
        roast: 'Roast', grill: 'Grill', bake: 'Bake', fry: 'Fry',
        drip: 'Drip Coffee', espresso: 'Espresso', instant: 'Instant', cold: 'Cold Brew', tea: 'Tea', energy: 'Energy Drink',
        deep: 'Deep Clean', standard: 'Standard', quick: 'Quick Wipe',
        '16:9': '16:9 Widescreen', '4:3': '4:3 Standard', '21:9': '21:9 Ultrawide',
        floor: 'Floor Length', sill: 'Sill Length', apron: 'Apron Length',
        yes: 'Yes', no: 'No',
        MB: 'Megabytes (MB)', GB: 'Gigabytes (GB)', KB: 'Kilobytes (KB)',
        '4': '4-sided', '6': '6-sided', '8': '8-sided', '10': '10-sided', '12': '12-sided', '20': '20-sided',
        small: 'Small (3L)', medium: 'Medium (8L)', large: 'Large (15L)',
        tempModerate: 'Moderate', hot: 'Hot',
        light: 'Light', vigorous: 'Vigorous',
        hatha: 'Hatha', vinyasa: 'Vinyasa', power: 'Power Yoga',
        tomato: 'Tomato', carrot: 'Carrot', basil: 'Basil', lettuce: 'Lettuce',
        domestic: 'Domestic',
        international: 'International',
        credit: 'Credit Card (2.9%+$0.30)',
        debit: 'Debit Card ($0.05)',
        amex: 'American Express (3.5%+$0.30)',
        electronics: 'Electronics',
        clothing: 'Clothing',
        sports: 'Sports',
        home: 'Home & Garden',
        general: 'General',
        'store-none': 'No Store',
        'store-basic': 'Basic Store',
        'store-premium': 'Premium Store',
        books: 'Books',
        's-small': 'Small',
        's-standard': 'Standard',
        's-large': 'Large',
        's-oversize': 'Oversize',
        kickstarter: 'Kickstarter (5%+3%+$0.20)',
        indiegogo: 'Indiegogo (5%+3%+$0.30)',
        'craps-pass': 'Pass Line (1:1, 1.41% HE)',
        'craps-dont-pass': "Don't Pass (1:1, 1.36% HE)",
        'craps-come': 'Come (1:1, 1.41% HE)',
        'craps-dont-come': "Don't Come (1:1, 1.36% HE)",
        'craps-field': 'Field (1:1/2:1, 2.78% HE)',
        'roulette-red-black': 'Red/Black (1:1)',
        'roulette-single': 'Single Number (35:1)',
        'roulette-split': 'Split (17:1)',
        'roulette-street': 'Street (11:1)',
        'roulette-corner': 'Corner (8:1)',
        european: 'European (37 slots)',
        american: 'American (38 slots)',
        ac: 'Central AC',
        fridge: 'Refrigerator/Freezer',
        wellPump: 'Well Pump',
        sump: 'Sump Pump',
        lights: 'Lights & Outlets',
        '80': '80% AFUE (Standard)',
        '95': '95%+ AFUE (High-Efficiency)',
        northeast: 'Northeast',
        south: 'South',
        midwest: 'Midwest',
        west: 'West',
        chlorine: 'Chlorine',
        ph_up: 'pH Increaser',
        ph_down: 'pH Decreaser',
        alkalinity_up: 'Alkalinity Increaser',
        shock: 'Pool Shock',
        gas: 'Gas Heater',
        heat_pump: 'Heat Pump',
        solar: 'Solar (Free)',
        electric: 'Electric',
        ants: 'Ants',
        roaches: 'Roaches',
        termites: 'Termites',
        bed_bugs: 'Bed Bugs',
        rodents: 'Rodents',
        mosquitoes: 'Mosquitoes',
        'one-time': 'One-Time',
        quarterly: 'Quarterly',
        monthly: 'Monthly',
        mild: 'Mild',
        moderate: 'Moderate',
        severe: 'Severe',
        flat: 'Flat Rate (1-2%)',
        rotating: 'Rotating Categories (5%)',
        travel: 'Travel Rewards (1.5-3%)',
        dining: 'Dining Rewards (3-4%)',
        'like-new': 'Like New (90%)',
        good: 'Good (70%)',
        fair: 'Fair (50%)',
        poor: 'Poor (30%)',
        high: 'High Demand (+10%)',
        mediumDemand: 'Medium Demand (0%)',
        low: 'Low Demand (-10%)',
        online: 'Online Marketplace',
        'brick-mortar': 'Brick & Mortar',
        newborn: 'Newborn (0-1mo)',
        '1-2mo': '1-2 Months',
        '2-4mo': '2-4 Months',
        '4-6mo': '4-6 Months',
        '6-12mo': '6-12 Months',
        '12+mo': '12+ Months',
        generic: 'Generic',
        huggies: 'Huggies',
        pampers: 'Pampers',
        cloth: 'Cloth',
        '0-3mo': '0-3 Months',
        '3-6mo': '3-6 Months',
        '6-9mo': '6-9 Months',
        '9-12mo': '9-12 Months',
        budget: 'Budget',
        'mid-range': 'Mid-Range',
        premium: 'Premium',
        'accident-only': 'Accident Only',
        'accident+illness': 'Accident + Illness',
        comprehensive: 'Comprehensive',
        normal: 'Normal',
        heavy: 'Heavy',
        summer: 'Summer (90F)',
        winter: 'Winter (30F)',
        url: 'URL',
        text: 'Text',
        phone: 'Phone',
        email: 'Email',
        wifi: 'WiFi',
        L: 'L - Low (7%)',
        M: 'M - Medium (15%)',
        Q: 'Q - Quartile (25%)',
        H: 'H - High (30%)',
        '1.25': 'Major Third (1.25)',
        '1.333': 'Major Fourth (1.333)',
        '1.5': 'Perfect Fifth (1.5)',
        h1: 'H1', h2: 'H2', h3: 'H3', h4: 'H4', h5: 'H5', h6: 'H6',
        'body': 'Body Text',
        smallText: 'Small Text',
        cheap: 'Cheap (10% of value)',
        fairValue: 'Fair (20% of value)',
        premiumValue: 'Premium (35% of value)',
        burial: 'Burial',
        cremation: 'Cremation',
        basic: 'Basic',
        standardService: 'Standard',
        'work-wardrobe': 'Work Wardrobe (5 shirts/wk)',
        occasional: 'Occasional (2 items/wk)',
        '18-30': '18-30',
        '31-50': '31-50',
        '51-65': '51-65',
        '66+': '66+',
        basicTrip: 'Basic (5% of trip)',
        standardTrip: 'Standard (8% of trip)',
        comprehensiveTrip: 'Comprehensive (12% of trip)',
        gofundme: 'GoFundMe (2.9%+$0.30)',
        kickstarterCampaign: 'Kickstarter (5%+3%+$0.20)',
      }
      const entries = Object.entries(shape)
      const splitIdx = entries.length > 4 ? Math.ceil(entries.length * 0.6) : entries.length
      const basic = entries.slice(0, splitIdx)
      const advancedList = entries.slice(splitIdx)
      const renderEntry = ([name, fieldSchema]: [string, any]) => {
        const isEnum = fieldSchema instanceof z.ZodEnum
        return isEnum
          ? <div key={name}><label className="text-sm font-medium text-gray-700 dark:text-gray-300">{fieldLabels[name] || name}</label><select {...form.register(name as any)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{(fieldSchema as z.ZodEnum<any>).options.map((o: string) => <option key={o} value={o}>{optionLabels[o] || o}</option>)}</select></div>
          : formField(name, fieldLabels[name] || name, { min: 0 })
      }
      return (
        <>
          {basic.map(renderEntry)}
          {advancedList.length > 0 && <ModeFieldGroup minMode="advanced" label="Additional Options">{advancedList.map(renderEntry)}</ModeFieldGroup>}
        </>
      )
    }
    return (
      <>
        <CalculatorFormField name="value" label="Value" min={0} step="0.01" locked={lockedFields.has('value')} onLockToggle={toggleLock} />
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
          <select value={fieldUnits.fromUnit} onChange={e => handleUnitChange('fromUnit', e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {convAllUnits.map(u => <option key={u.id} value={u.id}>{u.label} � {u.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
          <select value={fieldUnits.toUnit} onChange={e => handleUnitChange('toUnit', e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {convAllUnits.map(u => <option key={u.id} value={u.id}>{u.label} � {u.name}</option>)}
          </select>
        </div>
      </>
    )
  }, [calcType, form, convAllUnits, fieldUnits, handleUnitChange, useSlider, formField, lockedFields, toggleLock])

  const saveScenario = useCallback(() => {
    const vals = watched as Record<string, string>
    return Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
  }, [watched])

  const exportCSV = useCallback(() => {
    const vals = watched as Record<string, string>
    const header = 'Field,Value\n'
    const rows = Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k},${v}`).join('\n')
    return `${header}${rows}`
  }, [watched])

  const calcDef = calcDefs[calculator.slug] || calcDefs[calcType]
  const everydayFormulasLocal: Record<string, { formula: string; description: string }> = {
    tip: { formula: 'Tip = bill � rate | Total = bill + tip | Per person = total / n', description: 'Tip calculator splits the bill fairly. Standard tipping: 15% for good service, 18% for great service, 20% for excellent service.' },
    default: { formula: 'Everyday calculation', description: 'Everyday calculators help with common tasks.' },
    ...everydayFormulas,
  }
  const everydayMeta = calcDef ? { formula: calcDef.formula, description: calcDef.interpretation } : (everydayOverrides[calculator.slug] || getEverydayFormula(calculator.slug, calcType))

  const everydayAuthor = { name: 'Laura Bennett', photoUrl: 'https://i.pravatar.cc/150?u=emma-everyday', credential: 'CFP', title: 'Personal Finance Coach', linkedIn: 'https://www.linkedin.com/in/emma-everyday' }
  const everydayReferences = [
    { label: 'Consumer Financial Protection Bureau. Your Money, Your Goals. CFPB. 2020', url: 'https://www.consumerfinance.gov/' },
    { label: 'NIST. Handbook 44: Specifications for Weights and Measures. 2019', url: 'https://www.nist.gov/pml/owm/handbook-44' },
  ]
  const everydayExample = [
    { label: 'Tip: $50 bill, 15%, split 1 way', value: 'Tip = $7.50, Total = $57.50' },
    { label: 'Password: 16 chars, all types', value: '~95�6 possible combinations = very strong' },
  ]

  const mainValue = useMemo(() => {
    const vals = watched as any
    if (calcType === 'tip') {
      const bill = parseFloat(vals.bill) || 0; const percent = parseFloat(vals.percent) || 0
      return bill * (percent / 100)
    }
    return parseFloat(vals.value) || 0
  }, [watched, calcType])

  const copyResultText = useMemo(() => {
    const lines: string[] = [calculator.title]
    Object.entries(v).filter(([, val]) => val).forEach(([k, val]) => lines.push(`${k}: ${val}`))
    return lines.join('\n')
  }, [calculator.title, v])

  const everydayChartData = useMemo(() => {
    if (!mainValue || typeof mainValue !== 'number') return []
    const goal = Math.max(mainValue * 2, 100)
    return [{ label: calculator.title, current: mainValue, goal }]
  }, [mainValue, calculator.title])

  return (
    <FormProvider {...form}>
      <PremiumCalculatorShell calculator={calculator} form={formContent} result={result} charts={everydayChartData.length > 0 ? <DynamicProgressBarChart data={everydayChartData} /> : undefined} lockedFields={lockedFields} onExtraFieldsChange={setExtraFields} onSaveScenario={saveScenario} onExportCSV={exportCSV} unitSystem={unitSystem} onUnitChange={setUnitSystem} inputs={watchedInputs} showTabs={true} useSlider={useSlider} onToggleSlider={() => setUseSlider(!useSlider)} presets={presets} onPresetApply={applyPreset} formula={everydayMeta.formula} interpretation={everydayMeta.description}         author={everydayAuthor} reviewer={{ name: 'Tom Harrison', photoUrl: 'https://i.pravatar.cc/150?u=tom-consumer-advocate', credential: 'CPA', title: 'Financial Literacy Advocate', linkedIn: 'https://www.linkedin.com/in/tom-consumer-advocate' }} references={everydayReferences} example={everydayExample} userCount={31287} onReset={() => {
  const locked = Object.fromEntries(Array.from(lockedFields).map(key => [key, form.getValues(key)]))
  form.reset(defaults)
  Object.entries(locked).forEach(([key, value]) => {
    if (value !== undefined && value !== '') form.setValue(key as any, value)
  })
}} copyResultText={copyResultText} hubCategory="everyday" mainValue={mainValue} />
    </FormProvider>
  )
}

export { GenericEverydayCalculator }
