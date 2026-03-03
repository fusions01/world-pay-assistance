import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AssistanceRequest {
    id: bigint;
    status: AssistanceStatus;
    paymentMethod: string;
    userEmail: string;
    country: string;
    fullName: string;
    description: string;
    submissionDate: Time;
    amountRequested: string;
    accountDetails: string;
    reason: string;
}
export type Time = bigint;
export interface UserProfile {
    fullName: string;
    email: string;
    countryCode: string;
    countryName: string;
    phoneNumber: string;
}
export interface User {
    id: Principal;
    os: string;
    password: string;
    fullName: string;
    email: string;
    countryCode: string;
    countryName: string;
    deviceType: string;
    browser: string;
    registrationDate: Time;
    phoneNumber: string;
    ipAddress: string;
}
export enum AssistanceStatus {
    pending = "pending",
    underReview = "underReview",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminGetAllRequests(email: string, password: string): Promise<Array<AssistanceRequest>>;
    adminGetAllUsers(email: string, password: string): Promise<Array<User>>;
    adminGetTotalUserCount(email: string, password: string): Promise<bigint>;
    adminLogin(email: string, password: string): Promise<boolean>;
    adminUpdateRequestStatus(email: string, password: string, requestId: bigint, status: AssistanceStatus): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRequestsByEmail(email: string, password: string): Promise<Array<AssistanceRequest>>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(email: string, password: string): Promise<boolean>;
    registerUser(fullName: string, email: string, password: string, phoneNumber: string, countryCode: string, countryName: string, deviceType: string, browser: string, os: string, ipAddress: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAssistanceRequest(userEmail: string, fullName: string, country: string, reason: string, description: string, amountRequested: string, paymentMethod: string, accountDetails: string): Promise<void>;
}
