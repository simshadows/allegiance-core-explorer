/*
 * types.ts
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 */

export type GroupID = "construction"
                    | "garrison"
                    | "supremacy"
                    | "tactical"
                    | "expansion"
                    | "shipyard";

export function groupIdIntToEnum(n: number): GroupID {
    switch (n) {
        case 0: return "construction";
        case 1: return "garrison";
        case 2: return "supremacy";
        case 3: return "tactical";
        case 4: return "expansion";
        case 5: return "shipyard";
        default:
    }
    throw new Error(`Unexpected group ID: ${n}`);
}

