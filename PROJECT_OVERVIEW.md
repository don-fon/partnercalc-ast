# Project Overview

This repository is a TypeScript/React single-page app for analyzing Final Fantasy XIV FFLogs reports.

The original upstream project was `partnercalc`, a Dancer dance-partner contribution calculator. This fork is being converted into an Astrologian card contribution calculator. Some Dancer-oriented names still exist in older files and component names, but the active result flow is now Astrologian-focused.

## Development Environment

- Primary OS: Windows
- Default shell: PowerShell
- Dev server: `npm run serve`
- Production build: `npm run build`
- Lint: `npm run lint`
- Default local URL: `http://localhost:7000/`

The app uses:

- React 18
- TypeScript
- Webpack
- Material UI
- Recharts
- FFLogs v1 API for live report data

Environment variables are loaded from `.env` by `webpack.config.ts`.

## Current Product Goal

The app analyzes Astrologian card usage in one FFLogs fight.

Currently supported cards:

- `太阳神之衡` / `The Balance`
- `战争神之枪` / `The Spear`

Current card potency model:

- Correct target: `1.06`
- Wrong target: `1.03`
- Balance is treated as the correct card for tanks and melee jobs.
- Spear is treated as the correct card for healers, physical ranged, and casters.

The overall summary does not recommend one global target. Astrologian can choose a different target every card, so the summary compares:

- actual card damage from the logged targets
- theoretical per-card optimal target damage
- the difference between them

## Important Routes

- `/`  
  Home page. Paste an FFLogs report URL.

- `/:reportID/:fightID`  
  Live FFLogs result page.

- `/stats/:reportID/:fightID`  
  Optional exact crit/direct-hit stat input page.

- `/test`  
  Local test page using a cached fixture from this report:
  `https://cn.fflogs.com/reports/3HrfkahzqWRvmwYg?fight=9&type=damage-done`

The test page reads:

```text
public/fixtures/fflogs-test-fixture.json
```

This avoids repeatedly waiting on FFLogs requests while iterating UI or calculation logic. The fixture is copied as a static asset and is intentionally not bundled into the main JS.

## Main Data Flow

Live FFLogs flow:

1. `src/components/Home/Home.tsx` parses an FFLogs URL.
2. `src/components/Result/Result.tsx` creates `FFLogsParser`.
3. `src/api/fflogs/api.ts` fetches fight metadata and summary events.
4. `src/api/fflogs/parser.ts` normalizes FFLogs API events into internal `FFLogsEvent` values.
5. `src/simulator/simulator.ts` processes all events.
6. `src/simulator/modules/entities/astrologian.ts` opens/closes card windows from Balance/Spear buff events.
7. `src/simulator/cardWindow/cardWindow.ts` collects damage snapshots inside each card window and calculates contribution for every possible target.
8. Result components render actual vs optimal card value.

Test fixture flow:

1. `src/components/Result/TestResult.tsx` creates `FixtureFFLogsParser`.
2. `src/api/fflogs/fixtureParser.ts` loads `public/fixtures/fflogs-test-fixture.json`.
3. The same `Simulator` and result components are used as the live flow.

## Key Files

- `src/api/fflogs/api.ts`  
  FFLogs v1 HTTP calls.

- `src/api/fflogs/parser.ts`  
  Converts raw FFLogs responses to internal event types.

- `src/api/fflogs/fixtureParser.ts`  
  Loads normalized local test data for `/test`.

- `src/simulator/simulator.ts`  
  Main orchestration: event processing, stat overrides, card-window aggregation, overall summary.

- `src/simulator/modules/entities/astrologian.ts`  
  AST-specific event hooks. Only Balance and Spear are currently tracked.

- `src/simulator/cardWindow/cardWindow.ts`  
  Card window contribution calculation. This is where correct/wrong target potency is applied.

- `src/math/rdps.ts`  
  rDPS-style contribution math helpers. `simulatePotencyBuff` handles pure potency buffs.

- `src/types/damage.ts`  
  Result data structures used by simulator and UI.

- `src/components/Result/Result.tsx`  
  Live result page.

- `src/components/Result/TestResult.tsx`  
  Fixture-backed test result page.

- `src/components/Result/StandardWindow/OverallDisplay.tsx`  
  Top-level summary: actual vs per-card optimal.

- `src/components/Result/StandardWindow/StandardWindow.tsx`  
  Per-card-window display. The name is legacy from the Dancer version.

- `src/components/Result/StandardWindow/DamageGraph/DamageGraph.tsx`  
  Chart for card contribution by player.

- `src/components/Result/StandardWindow/DamageTable/DamageTable.tsx`  
  Table for card contribution by player.

## Legacy Naming Notes

Several names still come from the Dancer version:

- `StandardWindow`
- `DanceLog`
- `actualPartner`
- `bestPartner`
- `standard`
- `devilment`
- `esprit`
- `src/simulator/buffWindow/*`
- `src/simulator/modules/entities/dancer.ts`

Do not assume those names imply active Dancer behavior. The active Astrologian flow uses:

- `Astrologian`
- `CardWindow`
- `balance`
- `spear`

The legacy Dancer files are still present to keep old code compile-safe and because the conversion has not fully renamed every type/component yet.

## Calculation Model

Each card application creates one `CardWindow`.

For each card window:

1. The actual target is the player that received the card in the log.
2. The window collects all party member damage snapshots during the card duration.
3. Every player gets a simulated contribution value for that card.
4. `actualPartner` is the logged card target.
5. `bestPartner` is the best target for that specific card window.

Overall summary is computed by summing:

- actual logged target value for each card window
- best target value for each card window

This avoids the Dancer assumption that one selected target is globally bound for the entire fight.

## Known Limitations

- Some type and component names still use Dancer terminology.
- The test fixture is static; refresh it manually if the source report or parsing logic needs updated data.
- The fixture is large enough to trigger a webpack asset size warning.
- Existing lint warnings remain in older files such as `ErrorBoundary.tsx` and `math/functions.ts`.
- The potency model is hardcoded to `1.06` / `1.03` in `CardWindow`.

## Fast Start For Future Agents

1. Run `npm run build` first to verify baseline.
2. Use `http://localhost:7000/test` for UI/calculation iteration without waiting on FFLogs.
3. For card math, start in `src/simulator/cardWindow/cardWindow.ts`.
4. For overall actual-vs-optimal logic, start in `src/simulator/simulator.ts`.
5. For summary UI, start in `src/components/Result/StandardWindow/OverallDisplay.tsx`.
6. Avoid broad renames unless explicitly requested; this repo is mid-migration from Dancer to Astrologian.
