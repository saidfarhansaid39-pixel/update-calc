import type { CalcDef } from './types'

import { calcDefsGroup0 } from './group0'
import { calcDefsGroup1 } from './group1'
import { calcDefsGroup2 } from './group2'
import { calcDefsGroup3 } from './group3'
import { calcDefsGroup4 } from './group4'
import { calcDefsGroup5 } from './group5'
import { calcDefsGroup6 } from './group6'

export const calcDefs: Record<string, CalcDef> = {
  ...calcDefsGroup0,
  ...calcDefsGroup1,
  ...calcDefsGroup2,
  ...calcDefsGroup3,
  ...calcDefsGroup4,
  ...calcDefsGroup5,
  ...calcDefsGroup6
}
