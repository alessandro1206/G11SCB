# G11 SCB // Bunker Escape Room Control Panel

A 5-station digital bunker control panel built for the **G11 SCB** Escape Room, ready for instant deployment on **Vercel**.

## Station 01: Symbol Equation Blast Door Lock
- **Physical Room Clues (6 Equations scattered in the room):**
  1. `☢️ + ☢️ = 10`  *(☢️ = 5)*
  2. `☢️ + ⚙️ = 12`  *(⚙️ = 7)*
  3. `⚙️ + 🔺 = 15`  *(🔺 = 8)*
  4. `🔺 + ☣️ = 13`  *(☣️ = 5)*
  5. `☣️ + ❄️ = 11`  *(❄️ = 6)*
  6. `❄️ + ❄️ = 12`  *(❄️ = 6)*
- **Door Sequence on Terminal:** `☢️ ⚙️ 🔺 ☣️ ❄️ ☢️`
- **Unlock Code:** `578565`

## Stations 02 – 05: Multi-Station Placeholders
- Each station (`#station-1` through `#station-5`) can be opened on a dedicated laptop/tablet at that physical station.
- Use the **🔓 STATION UNLOCKED / 🔒 STATION LOCKED** button in the top-right header to lock a laptop to its assigned station so players cannot switch stations manually.
- Placeholder stations 2–5 include a live **Crew Configurator** and are ready to be replaced with custom mini-games as your team finalizes Challenges 2–5.

## Deploying to Vercel
1. Push the `d:\server\g11scb-bunker` folder to a GitHub repository, OR run:
   ```bash
   npx.cmd vercel
   ```
   inside `d:\server\g11scb-bunker`.
2. Vercel will automatically detect `index.html` and `vercel.json` and deploy instantly with zero build configuration required.
