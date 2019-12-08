import { Quad } from 'n3';
/**
 * Utility function that gets Triples located at a URL
 *
 * @param url Location of the Document contains the Triples.
 * @returns Promise that resolves with the Triples
 * @ignore Should not be used by library consumers directly.
 */
export declare function get(url: string): Promise<Response>;
/**
 * Utility function that sends a PATCH request to the Pod to update a Document
 *
 * @param url Location of the Document that contains the Triples to delete, and should have the Triples to add.
 * @param triplesToDelete Triples currently present on the Pod that should be deleted.
 * @param triplesToAdd Triples not currently present on the Pod that should be added.
 * @returns Promise that resolves when the update was executed successfully, and rejects if not.
 * @ignore Should not be used by library consumers directly.
 */
export declare function update(url: string, triplesToDelete: Quad[], triplesToAdd: Quad[]): Promise<Response>;
/**
 * Utility function that sends a PUT request to the Pod to create a new Document
 *
 * @param url URL of the Document that should be created.
 * @param triplesToAdd Triples that should be added to the Document.
 * @returns Promise that resolves with the response when the Document was created successfully, and rejects if not.
 * @ignore Should not be used by library consumers directly.
 */
export declare function create(url: string, triplesToAdd: Quad[]): Promise<Response>;
