export function createHttpConnector() {
  return {
    "fetch": async (url) => {
      // console.time("fetch");
      const result = await fetch(url);
      // console.timeEnd("fetch");
      return result;
    },
  };
}
