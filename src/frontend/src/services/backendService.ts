/**
 * Backend service for direct (unauthenticated) calls to the canister.
 * These calls use an anonymous actor created via createActorWithConfig.
 */
import { createActorWithConfig } from "../config";
import type { backendInterface, AssistanceRequest, User } from "../backend";
import { AssistanceStatus } from "../backend";

// Always create a fresh actor — never cache to avoid stale connection issues
async function getActor(): Promise<backendInterface> {
  return createActorWithConfig();
}

// Helper: retry an async operation up to maxAttempts times
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 4, delayMs = 600): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

export const backendService = {
  async loginUser(email: string, password: string): Promise<boolean> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.loginUser(email, password);
    });
  },

  async registerUser(
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string,
    countryCode: string,
    countryName: string,
    deviceType: string,
    browser: string,
    os: string,
    ipAddress: string
  ): Promise<void> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.registerUser(fullName, email, password, phoneNumber, countryCode, countryName, deviceType, browser, os, ipAddress);
    });
  },

  async adminLogin(email: string, password: string): Promise<boolean> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.adminLogin(email, password);
    });
  },

  async adminGetAllUsers(email: string, password: string): Promise<User[]> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.adminGetAllUsers(email, password);
    });
  },

  async adminGetAllRequests(email: string, password: string): Promise<AssistanceRequest[]> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.adminGetAllRequests(email, password);
    });
  },

  async adminGetTotalUserCount(email: string, password: string): Promise<bigint> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.adminGetTotalUserCount(email, password);
    });
  },

  async adminUpdateRequestStatus(
    email: string,
    password: string,
    requestId: bigint,
    status: AssistanceStatus
  ): Promise<void> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.adminUpdateRequestStatus(email, password, requestId, status);
    });
  },

  async submitAssistanceRequest(
    userEmail: string,
    fullName: string,
    country: string,
    reason: string,
    description: string,
    amountRequested: string,
    paymentMethod: string,
    accountDetails: string
  ): Promise<void> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.submitAssistanceRequest(userEmail, fullName, country, reason, description, amountRequested, paymentMethod, accountDetails);
    });
  },

  async getUserRequestsByEmail(email: string, password: string): Promise<AssistanceRequest[]> {
    return withRetry(async () => {
      const actor = await getActor();
      return actor.getUserRequestsByEmail(email, password);
    });
  },
};
