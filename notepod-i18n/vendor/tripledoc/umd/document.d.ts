import { Quad, N3Store } from 'n3';
import { TripleSubject } from './subject';
import { Reference } from '.';
/**
 * @ignore This is documented on use.
 */
export interface NewSubjectOptions {
    identifier?: string;
    identifierPrefix?: string;
}
export interface TripleDocument {
    /**
     * Add a Subject — note that it is not written to the Pod until you call [[save]].
     *
     * @param addSubject.options By default, Tripledoc will automatically generate an identifier with
     *                           which this Subject can be identified within the Document, and which
     *                           is likely to be unique. The `options` parameter has a number of
     *                           optional properties. The first, `identifier`, takes a string. If set,
     *                           Tripledoc will not automatically generate an identifier. Instead, the
     *                           value of this parameter will be used as the Subject's identifier.
     *                           The second optional parameter, `identifierPrefix`, is also a string.
     *                           If set, it will be prepended before this Subject's identifier,
     *                           whether that's autogenerated or not.
     * @returns A [[TripleSubject]] instance that can be used to define its properties.
     */
    addSubject: (options?: NewSubjectOptions) => TripleSubject;
    /**
     * Remove a Subject - note that it is not removed from the Pod until you call [[save]].
     *
     * @param removeSubject.subject The IRI of the Subject to remove.
     */
    removeSubject: (subject: Reference) => void;
    /**
     * Find a Subject which has the value of `objectRef` for the Predicate `predicateRef`.
     *
     * @param findSubject.predicateRef The Predicate that must match for the desired Subject.
     * @param findSubject.objectRef The Object that must match for the desired Subject.
     * @returns `null` if no Subject matching `predicateRef` and `objectRef` is found,
     *          a random one of the matching Subjects otherwise.
     */
    findSubject: (predicateRef: Reference, objectRef: Reference) => TripleSubject | null;
    /**
     * Find Subjects which have the value of `objectRef` for the Predicate `predicateRef`.
     *
     * @param findSubjects.predicateRef - The Predicate that must match for the desired Subjects.
     * @param findSubjects.objectRef - The Object that must match for the desired Subjects.
     * @returns An array with every matching Subject, and an empty array if none match.
     */
    findSubjects: (predicateRef: Reference, objectRef: Reference) => TripleSubject[];
    /**
     * Given the IRI of a Subject, return an instantiated [[TripleSubject]] representing its values.
     *
     * @param getSubject.subjectRef IRI of the Subject to inspect.
     * @returns Instantiation of the Subject at `subjectRef`, ready for inspection.
     */
    getSubject: (subjectRef: Reference) => TripleSubject;
    /**
     * Get all Subjects in this Document of a given type.
     *
     * @param getSubjectsOfType.typeRef IRI of the type the desired Subjects should be of.
     * @returns All Subjects in this Document that are of the given type.
     */
    getSubjectsOfType: (typeRef: Reference) => TripleSubject[];
    /**
     * @ignore Experimental API, might change in the future to return an instantiated Document
     * @deprecated Replaced by [[getAclRef]]
     */
    getAcl: () => Reference | null;
    /**
     * @ignore Experimental API, might change in the future to return an instantiated Document
     */
    getAclRef: () => Reference | null;
    /**
     * @ignore Experimental API, will probably change as the Solid specification changes to no longer support WebSockets
     */
    getWebSocketRef: () => Reference | null;
    /**
     * @returns The IRI of this Document.
     */
    asRef: () => Reference;
    /**
     * @ignore Deprecated.
     * @deprecated Replaced by [[asRef]].
     */
    asNodeRef: () => Reference;
    /**
     * Persist Subjects in this Document to the Pod.
     *
     * @param save.subjects Optional array of specific Subjects within this Document that should be
     *                      written to the Pod, i.e. excluding Subjects not in this array.
     * @return The updated Document with persisted Subjects.
     */
    save: (subjects?: TripleSubject[]) => Promise<TripleDocument>;
    /**
     * @deprecated
     * @ignore This is mostly a convenience function to make it easy to work with n3 and tripledoc
     *         simultaneously. If you rely on this, it's probably best to either file an issue
     *         describing what you want to do that Tripledoc can't do directly, or to just use n3
     *         directly.
     * @returns An N3 Store containing the Triples pertaining to this Document that are stored on the
     *          user's Pod. Note that this does not contain Triples that have not been saved yet -
     *          those can be retrieved from the respective [[TripleSubject]]s.
     */
    getStore: () => N3Store;
    /**
     * @deprecated
     * @ignore This is mostly a convenience function to make it easy to work with n3 and tripledoc
     *         simultaneously. If you rely on this, it's probably best to either file an issue
     *         describing what you want to do that Tripledoc can't do directly, or to just use n3
     *         directly.
     * @returns The Triples pertaining to this Document that are stored on the user's Pod. Note that
     *          this does not return Triples that have not been saved yet - those can be retrieved
     *          from the respective [[TripleSubject]]s.
     */
    getTriples: () => Quad[];
    /**
     * @deprecated Replaced by [[getTriples]]
     */
    getStatements: () => Quad[];
}
/**
 * Initialise a new Turtle document
 *
 * Note that this Document will not be created on the Pod until you call [[save]] on it.
 *
 * @param ref URL where this document should live
 */
export declare function createDocument(ref: Reference): TripleDocument;
/**
 * Retrieve a document containing RDF triples
 *
 * @param documentRef Where the document lives.
 * @returns Representation of triples in the document at `uri`.
 */
export declare function fetchDocument(uri: Reference): Promise<TripleDocument>;
