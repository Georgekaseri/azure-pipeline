const DEFAULT_BASE_URL = "https://demo.standard.mybahmni.in/bahmni/home/index.html#/login";
const DEFAULT_BASE_DOMAIN = "demo.standard.mybahmni.in";

export function resolveUrl(urlKeyOrValue: string): string {
  if (!urlKeyOrValue) {
    return DEFAULT_BASE_URL;
  }

  if (urlKeyOrValue.startsWith("http://") || urlKeyOrValue.startsWith("https://")) {
    return urlKeyOrValue;
  }

  if (urlKeyOrValue === "BASE_URL") {
    return process.env.BASE_URL || DEFAULT_BASE_URL;
  }

  if (urlKeyOrValue.endsWith("_URL")) {
    return process.env[urlKeyOrValue] || process.env.BASE_URL || DEFAULT_BASE_URL;
  }

  return process.env[urlKeyOrValue] || urlKeyOrValue;
}

export function getRequiredEnv(envKey: string): string {
  const value = process.env[envKey];

  if (!value) {
    throw new Error(`Missing required environment variable: ${envKey}`);
  }

  return value;
}

export function resolveConfigValue(keyOrValue: string): string {
  if (keyOrValue.endsWith("_DOMAIN")) {
    return process.env[keyOrValue] || process.env.BASE_DOMAIN || DEFAULT_BASE_DOMAIN;
  }

  return process.env[keyOrValue] || keyOrValue;
}
