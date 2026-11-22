import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AR_RUM_21 } from "@/lib/verse";

describe("Secret Garden invitation rules", () => {
  it("shows the complete Arabic text of QS. Ar-Rum 21", () => {
    expect(AR_RUM_21.arabic).toBe(
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ",
    );
    expect(AR_RUM_21.reference).toBe("QS. Ar-Rum : 21");
  });

  it("has no Reguler / Premium (VIP) choice on the door cover", () => {
    const cover = readFileSync("src/components/invite/Cover.tsx", "utf8");
    expect(cover).not.toMatch(/reguler|premium|vip/i);
  });
});

describe("3D wish ring", () => {
  it("places neighbours on both sides of the active card, wrapping round the ring", async () => {
    const { ringOffset } = await import("@/lib/wish-rules");
    expect(ringOffset(0, 0, 10)).toBe(0);
    expect(ringOffset(1, 0, 10)).toBe(1);
    expect(ringOffset(9, 0, 10)).toBe(-1);
    expect(ringOffset(2, 8, 10)).toBe(4);
    expect(ringOffset(0, 0, 0)).toBe(0);
  });

  it("keeps the Ar-Rum verse panel off red and blue backgrounds", () => {
    const main = readFileSync("src/components/invite/Main.tsx", "utf8");
    const verse = main.slice(main.indexOf("function Verse()"), main.indexOf("function ArchPhoto"));
    expect(verse).toMatch(/tone="garden"/);
    expect(verse).not.toMatch(/wine|navy/);
  });
});
