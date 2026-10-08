export const BETTER_LUCK = "Better Luck<br>Next Time";
export const TRY_AGAIN = "Try<br>Again";

export const DEFAULT_PRIZES = [
  "Better Luck<br>Next Time",
  "Water<br>Bottle",
  "Leather MAG<br>Card Holder",
  "Better Luck<br>Next Time",
  "Phone Stand<br>UGREEN",
  "Laptop Stand<br>UGREEN",
  "Better Luck<br>Next Time",
  TRY_AGAIN,
] as const;

export function isWinPrize(prizeHtml: string): boolean {
  return prizeHtml !== BETTER_LUCK && prizeHtml !== TRY_AGAIN;
}

export function isTryAgainPrize(prizeHtml: string): boolean {
  return prizeHtml === TRY_AGAIN;
}

export type PrizeText = string;

export const SLICE_COUNT = 8;
export const SLICE_DEG = 360 / SLICE_COUNT;
export const SPIN_DURATION_MS = 2500;
