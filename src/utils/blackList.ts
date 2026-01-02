// Using In memory, Ensure To use Redis before pushing to production
import processConfig from "../config/env.js";

const timeToClear: number =
  parseInt(processConfig.JWTs.access.duration!, 10) * 60 * 1000;

const blackListedTokens = new Set();

export const addToBlackList = async (token: string): Promise<void> => {
  blackListedTokens.add(token);
};

export const checkIfBlackListed = async (token: string): Promise<boolean> => {
  const present: boolean = blackListedTokens.has(token);
  return present;
};

export const clearBlackList = async (): Promise<void> => {
  blackListedTokens.clear();
};

const Interval = setInterval(clearBlackList, timeToClear);

export const clearIntervalOnCall = async (): Promise<void> => {
  clearInterval(Interval);
};

