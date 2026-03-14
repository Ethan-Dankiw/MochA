import { promises as fs } from "node:fs";
import path from 'node:path';

export default class FileUtils {
    public static buildRelativePath(...dirs: string[]): string {
        return path.join(process.cwd(), ...dirs)
    }

    public static async readFile(filepath: string): Promise<string | null> {
        // If there is no file path to read a file from
        if (!filepath) {
            console.warn("Provided file path does not contain any data");
            return null;
        }

        try {
            // Attempt to load a file from disk
            return await fs.readFile(filepath, 'utf8');
        } catch (error) {
            console.error(`Failed to read ${filepath}:`, error);
            return null;
        }
    }
}