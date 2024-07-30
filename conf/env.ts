type EnvConfig = {
  local: { guiBaseUrl: string };
  prod: { guiBaseUrl: string };
  [key: string]: { guiBaseUrl: string };
};

export const envConfig: EnvConfig = {
  local: {
    guiBaseUrl: "http://localhost:3000",
  },
  prod: {
    guiBaseUrl: "https://rafaljab.github.io",
  },
};
