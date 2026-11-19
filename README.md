# gta6-trophy-guide
[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Arijit178/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Arijit178/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Offline GTA 6 trophy guide and tracker for all 55 PlayStation 5 trophies, with a roadmap to the platinum.

## What it is

An offline static web app for Grand Theft Auto VI on PlayStation 5: a guide and tracker for all 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden until earned), with a roadmap to the platinum and every missable trophy flagged.

- **Every trophy, with its official name, description and grade** as PlayStation publishes them, as listed by Exophase and PSNProfiles.
- **A guide for each trophy in our own words** — what to do, where and how, and when it can be missed — with its source named beside it, principally PowerPyx, with Push Square and KeenGamer. Sources are cited, never copied. Two trophies (Bad Luck, I Guess and Ten Pin) are marked unconfirmed, because PowerPyx lists no reliable method for them yet.
- **Tracker:** tick trophies off; progress is saved in localStorage, and can be exported to a file and imported back.
- **Filters:** by kind (story, missable, collectibles, activities, online), by grade, by earned / not yet earned, and by search.
- **Spoiler setting:** hides the names and descriptions of story trophies until they are earned.
- **Roadmap:** Stage 1 story (60–80 hours), Stage 2 the 100% checklist (about 100 hours), Stage 3 cleanup (about 10 hours). PowerPyx rates the platinum 4/10 and about 200 hours.
- **Missables:** 1 possibly missable — Positive Mental Attitude. Do the Chapter 1 balcony meditation with Lucia at Jason's house, after Down to Earth, before leaving Chapter 1. Every other trophy can be earned after the story in free-roam.

## Run it

```
node serve.ts then open http://localhost:8080
```

No build step, no network requests at run time: serve `app/` with any static server and open `app/index.html`.

## Files

- `app/index.html`, `app/app.js`, `app/style.css` — the guide and tracker.
- `app/data/trophies.json` — the 55 official trophies, each with its guide and cited sources.
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to `/output` and writes `out/dossier.json`. Run it with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.
- `screenshots/` — 3 screenshots of the app running in a browser.

## Referral

https://make.fun/r/v81rq9jc

## Sources

- Exophase and PSNProfiles — official trophy names, descriptions and grades.
- PowerPyx — https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- Push Square — https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
- KeenGamer — https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/

Fan-made guide. Not affiliated with Rockstar Games. No Rockstar logo or artwork is used.
