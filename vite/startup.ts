const startupLog = (envInfo: Record<string, string>) => {
  for (const key in envInfo) {
    console.log("\x1b[32m", `◉ ${key}: ${envInfo[key]}`);
  }
};
export default startupLog;
