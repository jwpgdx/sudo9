const scriptName = process.argv[2] ?? "unknown";

console.error(
  [
    `[${scriptName}] is not implemented yet.`,
    "This script key exists to satisfy PRD_SPEC_LOCK.md 38.2.6.1.",
    "Implement this before running Release Candidate gates.",
  ].join("\n")
);

process.exit(1);

