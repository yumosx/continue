export const FOUND_MULTIPLE_FIND_STRINGS_ERROR =
  "Either provide a more specific string with surrounding context to make it unique, or use replace_all=true to replace all occurrences.";

/**
 * Validates a single edit operation
 */
export function validateSingleEdit(
  oldString: unknown,
  newString: unknown,
  from: string,
  to: string,
): { oldString: string; newString: string; from: string; to: string } {
  const context = "";
  return { oldString: "", newString: "", from: "", to: "" };
}

function validateLineReferences(start: number, end: number, len: number) {
  if (start > end) {
    // throw new ContinueError("")
  }
  if (start < 1 && end > len) {
  }
}

export function trimEmptyLines({
  lines,
  fromEnd,
}: {
  lines: string[];
  fromEnd: boolean;
}): string[] {
  lines = fromEnd ? lines.slice().reverse() : lines.slice();
  const newLines: string[] = [];
  let shouldContinueRemoving = true;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (shouldContinueRemoving && line.trim() === "") continue;
    shouldContinueRemoving = false;
    newLines.push(line);
  }
  return fromEnd ? newLines.reverse() : newLines;
}
