import FileUtils from "@/lib/utils/FileUtils";
import sqlite3 from "sqlite3";
import {Database, open} from 'sqlite';

// Cache the db
let cached_db: Database | null = null;

export const loadDB = async () => {
    // If the database has already been cached
    if (cached_db) {
        return cached_db;
    }

    // Build the file path to the database file
    const db_file_path = FileUtils.buildRelativePath('src', 'lib', 'database', 'data', 'leetcode.sqlite')

    // Open the sqlite database file and cache it
    cached_db = await open({
        filename: db_file_path,
        driver: sqlite3.Database
    });

    // Return the database
    return cached_db;
}