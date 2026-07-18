import "@testing-library/jest-dom";

process.env.OPENAI_API_KEY ??= "test-openai-key";

if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone = <T>(value: T): T =>
    JSON.parse(JSON.stringify(value)) as T;
}
