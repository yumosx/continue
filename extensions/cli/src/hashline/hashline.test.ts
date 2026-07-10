import { describe, expect, it } from "vitest";

import {
  computeLineHash,
  formatHashLine,
  formatHashLines,
} from "./hashline.js";

describe("hashline", () => {
  it("returns deterministic 2-char CID hash per line", () => {
    const content = "function hello() {";
    const hash1 = computeLineHash(1, content);
    const hash2 = computeLineHash(1, content);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[ZPMQVRWSNKTXJBYH]{2}$/);
  });

  it("produces same hashes for significant content on different lines", () => {
    const content = "function hello() {";
    expect(computeLineHash(1, content)).toBe(computeLineHash(2, content));
  });

  it("mixes line number for non-significant lines", () => {
    const punctuationOnly = "{}";
    expect(computeLineHash(1, punctuationOnly)).not.toBe(
      computeLineHash(2, punctuationOnly),
    );
  });

  it("formats lines with LINE#HASH|content", () => {
    const formatted = formatHashLine(1, "const x = 1;");
    expect(formatted).toMatch(/^1#[ZPMQVRWSNKTXJBYH]{2}\|const x = 1;$/);
  });

  it("formats full file content", () => {
    const formatted = formatHashLines("a\nb");
    const lines = formatted.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^1#[ZPMQVRWSNKTXJBYH]{2}\|a$/);
    expect(lines[1]).toMatch(/^2#[ZPMQVRWSNKTXJBYH]{2}\|b$/);
  });
});
