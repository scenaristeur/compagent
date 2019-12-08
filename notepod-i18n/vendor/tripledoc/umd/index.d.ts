import { Literal, BlankNode, NamedNode } from 'n3';
export * from './document';
export * from './subject';
export * from './store';
/**
 * Literal values, i.e. values that do not point to other nodes in the Linked Data graph.
 */
export declare type LiteralTypes = string | number | Date;
/**
 * A URL that points to a node in the Linked Data graph.
 */
export declare type Reference = string;
/**
 * @ignore Deprecated.
 * @deprecated Replaced by [[Reference]].
 */
export declare type NodeRef = Reference;
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a Literal, so
 *         this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 Literal.
 * @returns Whether `param` is an N3 Literal.
 */
export declare function isLiteral<T>(param: T | Literal): param is Literal;
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface StringLiteral extends Literal {
    datatype: NamedNode & {
        id: 'http://www.w3.org/2001/XMLSchema#string';
    };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 string Literal.
 * @returns Whether `param` is an N3 string Literal.
 */
export declare function isStringLiteral<T>(param: T | Literal): param is StringLiteral;
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface IntegerLiteral extends Literal {
    datatype: NamedNode & {
        id: 'http://www.w3.org/2001/XMLSchema#integer';
    };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 integer Literal.
 * @returns Whether `param` is an N3 integer Literal.
 */
export declare function isIntegerLiteral<T>(param: T | Literal): param is IntegerLiteral;
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface DecimalLiteral extends Literal {
    datatype: NamedNode & {
        id: 'http://www.w3.org/2001/XMLSchema#decimal';
    };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 decimal Literal.
 * @returns Whether `param` is an N3 decimal Literal.
 */
export declare function isDecimalLiteral<T>(param: T | Literal): param is DecimalLiteral;
/**
 * @ignore This is an internal TripleDoc data type that should not be exposed to library consumers.
 */
export interface DateTimeLiteral extends Literal {
    datatype: NamedNode & {
        id: 'http://www.w3.org/2001/XMLSchema#dateTime';
    };
}
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
 *         type, so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be an N3 DateTime Literal.
 * @returns Whether `param` is an N3 DateTime Literal.
 */
export declare function isDateTimeLiteral<T>(param: T | Literal): param is DateTimeLiteral;
/**
 * @ignore Deprecated function.
 * @deprecated Replaced by [[isReference]].
 */
export declare const isNodeRef: typeof isReference;
/**
 * @ignore Tripledoc's methods should be explicit about whether they return or accept a [[Reference]],
 *         so this is merely an internal utility function, rather than a public API.
 * @param param A value that might or might not be a reference to a node in the Linked Data graph.
 * @returns Whether `param` is a reference to a node in the Linked Data graph.
 */
export declare function isReference(value: Reference | BlankNode | Literal): value is Reference;
/**
 * @ignore Blank Nodes themselves should not be exposed to library consumers, so this is merely an
 *         internal utility function, rather than a public API.
 * @param param A value that might or might not be a blank node in the Linked Data graph.
 * @returns Whether `param` is a blank node in the Linked Data graph.
 */
export declare function isBlankNode(param: Reference | Literal | BlankNode): param is BlankNode;
