import pino, { stdTimeFunctions } from "pino";

// set config for logger here
export const logger = pino({
  name: `relay`,
  base: undefined,
  timestamp: stdTimeFunctions.isoTime,
});
