function ensureEnvironmentVariable(key: string) {
  if (typeof import.meta.env[key] == "undefined") {
    throw new Error(`Environment Variable not found -> ${key}`);
  }
}

export default function getEnvironmentVariable<T = string>(
  key: string,
  defaultValue: T | void
): T {
  if (defaultValue) {
    return (import.meta.env[key] as T) || defaultValue;
  }
  ensureEnvironmentVariable(key);
  return import.meta.env[key] as T;
}
