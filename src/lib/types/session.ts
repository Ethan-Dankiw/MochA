import {JWTPayload} from "jose";

declare module 'jose' {
    export interface JoseSession extends ISessionPayload {}
}


/**
 * Interface for a session
 */
export interface ISessionPayload extends JWTPayload {
    authenticated: boolean;
    user_id: string;
}


/**
 * Type alias for session
 */
export type SessionPayload = ISessionPayload;