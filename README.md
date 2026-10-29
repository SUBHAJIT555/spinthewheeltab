# Spin to Win — iPad tablet

FAB event wheel for iPad (Safari or Home Screen app). Next.js + TypeScript + Motion. Participant rows are stored in Supabase PostgreSQL.

Open [http://localhost:3000](http://localhost:3000) after setup — it lands on the game.

## Setup

```bash
yarn
yarn dev
```

For participant storage, copy `.env.example` to `.env.local` and set `DATABASE_URL`. See [docs/BACKEND.md](./docs/BACKEND.md).

## Game flow

1. Guest taps **SPIN**.
2. They enter **name** and a **UAE mobile number** on the on-screen keyboard (`05XXXXXXXX` or `+9715XXXXXXXX`).
3. The wheel spins (2.5s). The landed slice is locked on a game session.
4. Result:
   - **Prize or Better Luck Next Time** — tap Continue. The name, number, and server-side prize are saved, then the game resets for the next guest.
   - **Try Again** — tap Try Again. Name and number stay; they spin once more. That extra spin is not saved as a finished game.

Prize on the participant row always comes from `game_sessions.prize`. The client cannot choose it.

```text
SPIN
  → form (first spin only)
  → POST /api/game-sessions
  → wheel lands
  → POST /api/game-sessions/claim { gameSessionId, prize }
  → prize / better luck: POST /api/participants { name, contactNumber, gameSessionId }
  → try again: keep details, spin again
```

## Wheel slices (8)

| Slice | Stock |
| --- | --- |
| Water Bottle with Magnetic Phone Holder | 16 |
| Leather Magnetic Card Holder | 17 |
| Phone & Tablet Stand | 17 |
| Better Luck Next Time | 3 slices, unlimited |
| Try Again | 2 slices, unlimited |

## Prize stock

Each real prize is counted on **that iPad** in `localStorage`. The winning spin still awards the prize. When the count hits the limit, every matching slice becomes **Better Luck Next Time** and stays that way.

Counts are not shared between devices. Bump `PRIZE_CONFIG_VERSION` in `src/lib/prizes.ts` after changing prizes or limits so stored slices reset.

To reset prize counts on that iPad (including the fullscreen Home Screen app), tap the **Spin to Win** title 7 times, enter staff PIN `2580`, then tap **Reset all**. A guest tap or hold will not reset the wheel. In development, the **Reset** button on the bottom right skips the PIN.

This only clears data on that device. Rows already saved in Supabase stay. To wipe Safari/Home Screen website data as well: **Settings → Safari → Advanced → Website Data**, find the site, and remove it. Deleting the Home Screen icon does not always clear the counts.

## Screen

- Fills the live viewport (iPad 6th gen 4:3 and newer iPad mini).
- Portrait and landscape each use their own cinema background, FAB logo, and Spin to Win title.
- Safari on iPad cannot hide the address bar. Add the site to the **Home Screen** and open that icon for a fullscreen kiosk. A **Full screen** hint is shown when the page is still in the browser tab.
- On iPad the Share menu is a popover, not the iPhone sheet. Open the site in **Safari**, tap **Share**, **scroll the action list** under the app icons, then tap **Add to Home Screen**. If it is missing, tap **Edit Actions** and enable it.

## Backend

1. Run [`sql/schema.sql`](./sql/schema.sql) in the Supabase SQL Editor (`game_sessions`, `participants`).
2. Put the **Transaction pooler** URI in `DATABASE_URL`. Encode `@` in the password as `%40`.
3. Restart `yarn dev`. `DIRECT_URL` is optional.
4. On Vercel: **Settings → Environment Variables → Production** → add the same `DATABASE_URL` → **Redeploy**.

Do not commit `.env.local`.
