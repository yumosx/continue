declare module "xxhashjs" {
  interface XXHash {
    toNumber(): number;
  }

  interface XXHashStatic {
    h32(input: string, seed: number): XXHash;
  }

  const XXH: XXHashStatic;
  export default XXH;
}
