/**
 * Calculator maths, kept pure so the totals can be tested.
 * Every figure is rounded to whole dollars before it is added, so on screen
 * "What you spend today" − "With Bricks" = "You save" exactly, and the
 * "Where it comes from" lines add up to the same number.
 */
export type PlanRow = { visits: number; price: number }
export type SiteRates = { setup: number; visualPerVisit: number; mappedPerVisit: number; visualPlans: readonly PlanRow[]; mappedPlans: readonly PlanRow[] }

const $ = (n: number) => Math.round(Number.isFinite(n) ? n : 0)
const pct = (n: number) => Math.min(Math.max(n, 0), 100) / 100

export type Savings = {
  today: { cash: number; time: number; total: number }
  bricks: { price: number; time: number; total: number }
  save: number
  lines: { cash: number; time: number }
  hoursNow: number
  hoursWith: number
}

function close(todayCash: number, bricksPrice: number, hoursNow: number, hoursWith: number, rate: number): Savings {
  const cash = $(todayCash)
  const price = $(bricksPrice)
  const timeNow = $(hoursNow * rate)
  const timeWith = $(hoursWith * rate)
  const today = { cash, time: timeNow, total: cash + timeNow }
  const bricks = { price, time: timeWith, total: price + timeWith }
  return { today, bricks, save: today.total - bricks.total, lines: { cash: cash - price, time: timeNow - timeWith }, hoursNow, hoursWith }
}

export function agentSavings(i: { listings: number; coordHours: number; subs: number; rate: number; share: number; planPrice: number }): Savings {
  const hoursNow = i.listings * i.coordHours
  const hoursWith = hoursNow * (1 - pct(i.share))
  return close(i.subs, i.planPrice, hoursNow, hoursWith, i.rate)
}

export function siteCost(visits: number, perVisit: number, plans: readonly PlanRow[]) {
  const plan = plans.find((p) => p.visits === visits)
  return plan ? { cost: plan.price, onPlan: true } : { cost: visits * perVisit, onPlan: false }
}

export function builderSavings(i: { sites: number; visits: number; mapped: boolean; payNow: number; reports: number; reportHours: number; rate: number; share: number }, site: SiteRates) {
  const per = siteCost(i.visits, i.mapped ? site.mappedPerVisit : site.visualPerVisit, i.mapped ? site.mappedPlans : site.visualPlans)
  const hoursNow = i.sites * i.reports * i.reportHours
  const hoursWith = hoursNow * (1 - pct(i.share))
  const s = close(i.payNow * i.visits * i.sites, per.cost * i.sites, hoursNow, hoursWith, i.rate)
  return { ...s, per, perVisit: i.visits ? per.cost / i.visits : 0, setupOnce: i.mapped ? $(site.setup * i.sites) : 0 }
}
