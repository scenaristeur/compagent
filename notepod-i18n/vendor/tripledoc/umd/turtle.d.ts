import { Quad } from 'n3';
import { Reference } from '.';
/**
 * @param quads Triples that should be serialised to Turtle
 * @ignore Utility method for internal use by Tripledoc; not part of the public API.
 */
export declare function triplesToTurtle(quads: Quad[]): Promise<string>;
/**
 * @param raw Turtle that should be parsed into Triples
 * @ignore Utility method for internal use by Tripledoc; not part of the public API.
 */
export declare function turtleToTriples(raw: string, documentRef: Reference): Promise<Quad[]>;
