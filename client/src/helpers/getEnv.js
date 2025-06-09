export const getEnv = (key) => {
  const env = import.meta.env
  return env[key]
};