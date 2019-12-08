import { BlankNode, Literal, N3Store } from 'n3';
import { Reference } from './index';
/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export declare type FindEntityInStore = (store: N3Store, knownEntity1: Reference, knownEntity2: Reference, document: Reference) => Reference | Literal | BlankNode | null;
/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export declare type FindEntitiesInStore = (store: N3Store, knownEntity1: Reference | BlankNode, knownEntity2: Reference | BlankNode, document: Reference) => Array<Reference | Literal | BlankNode>;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare const findSubjectInStore: FindEntityInStore;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare const findSubjectsInStore: FindEntitiesInStore;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare const findPredicateInStore: FindEntityInStore;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare const findPredicatesInStore: FindEntitiesInStore;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare const findObjectInStore: FindEntityInStore;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare const findObjectsInStore: FindEntitiesInStore;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare function findEntityInStore(store: N3Store, type: 'subject' | 'predicate' | 'object', subjectRef: null | Reference | BlankNode, predicateRef: null | Reference | BlankNode, objectRef: null | Reference | BlankNode, documentRef: Reference | BlankNode): Reference | Literal | BlankNode | null;
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export declare function findEntitiesInStore(store: N3Store, type: 'subject' | 'predicate' | 'object', subjectRef: null | Reference | BlankNode, predicateRef: null | Reference | BlankNode, objectRef: null | Reference | BlankNode, documentRef: Reference): Array<Reference | Literal | BlankNode>;
