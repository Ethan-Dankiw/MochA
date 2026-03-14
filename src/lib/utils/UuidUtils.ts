import {parse, v4, validate} from "uuid";


export class UuidUtils {

    public static generate(): string {
        return v4();
    }

    public static validate(uuid: string): boolean {
        // If the string is empty
        if (uuid.length === 0) {
            return false;
        }

        // Validate the string
        return validate(uuid);
    }

    public static parse(uuid: string): Uint8Array | null {
        // Check if it's an invalid UUID
        if (!this.validate(uuid)) {
            return null
        }

        // Parse the UUID into a byte array
        return parse(uuid);
    }
}