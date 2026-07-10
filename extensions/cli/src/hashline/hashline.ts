import XXH from "xxhashjs";

import { HASHLINE_DICT } from "./constants.js";

const RE_SIGNIFICANT = /[\p{L}\p{N}]/u;

function hashXxh32(input: string, seed: number): number {
  return XXH.h32(input, seed >>> 0).toNumber() >>> 0;
}

function computeNormalizedLineHash(
  lineNumber: number,
  normalizedContent: string,
): string {
  const seed = RE_SIGNIFICANT.test(normalizedContent) ? 0 : lineNumber;
  const hash = hashXxh32(normalizedContent, seed);
  const index = hash % 256;
  return HASHLINE_DICT[index]!;
}

export function computeLineHash(lineNumber: number, content: string): string {
  return computeNormalizedLineHash(
    lineNumber,
    content.replace(/\r/g, "").trimEnd(),
  );
}

export function formatHashLine(lineNumber: number, content: string): string {
  const hash = computeLineHash(lineNumber, content);
  return `${lineNumber}#${hash}|${content}`;
}

export function formatHashLines(content: string): string {
  if (!content) {
    return "";
  }

  const lines = content.split("\n");
  return lines.map((line, index) => formatHashLine(index + 1, line)).join("\n");
}

export function validateLineReferences() {}
