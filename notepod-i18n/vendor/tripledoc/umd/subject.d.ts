import { BlankNode, Quad } from 'n3';
import { Reference, LiteralTypes } from './index';
import { TripleDocument } from './document';
export interface TripleSubject {
    /**
     * @returns The [[TripleDocument]] that contains this Subject.
     */
    getDocument: () => TripleDocument;
    /**
     * @deprecated
     * @ignore This is mostly a convenience function to make it easy to work with n3 and tripledoc
     *         simultaneously. If you rely on this, it's probably best to either file an issue
     *         describing what you want to do that Tripledoc can't do directly, or to just use n3
     *         directly.
     * @returns The Triples pertaining to this Subject that are stored on the user's Pod. Note that
     *          this does not return Triples that have not been saved yet - see
     *          [[getPendingTriples]] for those.
     */
    getTriples: () => Quad[];
    /**
     * Find a literal string value for `predicate` on this Subject.
     *
     * This retrieves _one_ string literal, or `null` if none is found. If you want to find _all_
     * string literals for a predicate, see [[getAllStrings]].
     *
     * @param getString.predicate Which property of this Subject you want the value of.
     * @returns The first literal string value satisfying `predicate`, if any, and `null` otherwise.
     */
    getString: (predicate: Reference) => string | null;
    /**
     * Find a literal integer value for `predicate` on this Subject.
     *
     * This retrieves _one_ integer literal, or `null` if none is found. If you want to find _all_
     * integer literals for a predicate, see [[getAllIntegers]].
     *
     * @param getInteger.predicate Which property of this Subject you want the value of.
     * @returns The first literal integer value satisfying `predicate`, if any, and `null` otherwise.
     */
    getInteger: (predicate: Reference) => number | null;
    /**
     * Find a literal decimal value for `predicate` on this Subject.
     *
     * This retrieves _one_ decimal literal, or `null` if none is found. If you want to find _all_
     * decimal literals for a predicate, see [[getAllDecimals]].
     *
     * @param getDecimal.predicate Which property of this Subject you want the value of.
     * @returns The first literal decimal value satisfying `predicate`, if any, and `null` otherwise.
     */
    getDecimal: (predicate: Reference) => number | null;
    /**
     * Find a literal date+time value for `predicate` on this Subject.
     *
     * This retrieves _one_ date+time literal, or `null` if none is found. If you want to find _all_
     * date+time literals for a predicate, see [[getAllDateTimes]].
     *
     * @param getDateTime.predicate Which property of this Subject you want the value of.
     * @returns The first literal Date value satisfying `predicate`, if any, and `null` otherwise.
     */
    getDateTime: (predicate: Reference) => Date | null;
    /**
     * @param getLiteral.predicate Which property of this Subject you want the value of.
     * @returns The first literal value satisfying `predicate`, if any, and `null` otherwise.
     * @deprecated This method has been superseded by the type-specific methods [[getString]],
     *             [[getNumber]] and [[getDateTime]].
     */
    getLiteral: (predicate: Reference) => LiteralTypes | null;
    /**
     * @param getAllStrings.predicate Which property of this Subject you want the values of.
     * @returns All literal string values satisfying `predicate`.
     */
    getAllStrings: (predicate: Reference) => string[];
    /**
     * @param getAllIntegers.predicate Which property of this Subject you want the values of.
     * @returns All literal integer values satisfying `predicate`.
     */
    getAllIntegers: (predicate: Reference) => number[];
    /**
     * @param getAllDecimals.predicate Which property of this Subject you want the values of.
     * @returns All literal decimal values satisfying `predicate`.
     */
    getAllDecimals: (predicate: Reference) => number[];
    /**
     * @param getAllDateTimes.predicate Which property of this Subject you want the values of.
     * @returns All literal DateTime values satisfying `predicate`.
     */
    getAllDateTimes: (predicate: Reference) => Date[];
    /**
     * @param getAllLiterals.predicate Which property of this Subject you want the values of.
     * @returns All literal values satisfying `predicate`.
     * @deprecated This method has been superseded by the type-specific methods [[getAllStrings]],
     *             [[getAllNumbers]] and [[getAllDates]].
     */
    getAllLiterals: (predicate: Reference) => LiteralTypes[];
    /**
     * Find a local Subject (i.e. without its own URL) referenced by this Subject with `predicate`.
     *
     * This retrieves _one_ [[TripleSubject]], or `null` if none is found. If you want to find _all_
     * local Subjects for a predicate, see [[getAllLocalSubjects]].
     *
     * @param getRef.predicate Which property of this Subject you want the value of.
     * @returns The first referenced local Subject satisfying `predicate`, if any, and `null` otherwise.
     * @ignore Experimental API; could change in minor or patch releases.
     */
    getLocalSubject: (predicate: Reference) => TripleSubject | null;
    /**
     * Find local Subject (i.e. without their own URLs) referenced by this Subject with `predicate`.
     *
     * @param getRef.predicate Which property of this Subject you want the values of.
     * @returns All referenced local Subjects satisfying `predicate`.
     * @ignore Experimental API; could change in minor or patch releases.
     */
    getAllLocalSubjects: (predicate: Reference) => Array<TripleSubject>;
    /**
     * Find a reference attached to this Subject with `predicate`.
     *
     * This retrieves _one_ reference, or `null` if none is found. If you want to find _all_
     * references for a predicate, see [[getAllRefs]].
     *
     * @param getRef.predicate Which property of this Subject you want the value of.
     * @returns The first referenced IRI satisfying `predicate`, if any, and `null` otherwise.
     */
    getRef: (predicate: Reference) => Reference | null;
    /**
     * @ignore Deprecated method.
     * @deprecated Replaced by [[getRef]].
     */
    getNodeRef: (predicate: Reference) => Reference | null;
    /**
     * @returns The type of this Subject, if known.
     */
    getType: () => Reference | null;
    /**
     * @param getAllRefs.predicate Which property of this Subject you want the values of.
     * @returns All references satisfying `predicate`.
     */
    getAllRefs: (predicate: Reference) => Array<Reference>;
    /**
     * @ignore Deprecated method.
     * @deprecated Replaced by [[getAllRefs]].
     */
    getAllNodeRefs: (predicate: Reference) => Array<Reference>;
    /**
     * Set a property of this Subject to a Literal value (i.e. not a URL).
     *
     * Note that this value is not saved to the user's Pod until you save the containing Document.
     *
     * @param addLiteral.predicate The property you want to add another value of.
     * @param addLiteral.object The Literal value you want to add, the type of which is one of [[LiteralTypes]].
     */
    addLiteral: (predicate: Reference, object: LiteralTypes) => void;
    /**
     * Set a property of this Subject to a [[Reference]].
     *
     * Note that this value is not saved to the user's Pod until you save the containing Document.
     *
     * @param addRef.predicate The property you want to add another value of.
     * @param addRef.object The IRI you want to add a reference to.
     */
    addRef: (predicate: Reference, object: Reference) => void;
    /**
     * @ignore Deprecated method.
     * @deprecated Replaced by [[addRef]].
     */
    addNodeRef: (predicate: Reference, object: Reference) => void;
    /**
     * Remove a Literal value for a property of this Subject.
     *
     * Note that this value is not removed from the user's Pod until you save the containing Document.
     *
     * @param removeLiteral.predicate The property you want to remove a value of.
     * @param removeLiteral.object The Literal value you want to remove, the type of which is one of [[LiteralTypes]].
     */
    removeLiteral: (predicate: Reference, object: LiteralTypes) => void;
    /**
     * Remove a [[Reference]] value for a property of this Subject.
     *
     * Note that this pointer is not removed from the user's Pod until you save the containing Document.
     *
     * @param removeRef.predicate The property you want to remove a reference for.
     * @param removeRef.object The reference you want to remove.
     */
    removeRef: (predicate: Reference, object: Reference) => void;
    /**
     * @ignore Deprecated.
     * @deprecated Replaced by [[removeRef]].
     */
    removeNodeRef: (predicate: Reference, object: Reference) => void;
    /**
     * Remove all values for a property of this Subject.
     *
     * Note that these values are not removed from the user's Pod until you save the containing
     * Document.
     *
     * @param removeAll.predicate The property you want to remove the values of.
     */
    removeAll: (predicate: Reference) => void;
    /**
     * Set a property of this Subject to a Literal value, clearing all existing values.
     *
     * Note that this change is not saved to the user's Pod until you save the containing Document.
     *
     * @param setLiteral.predicate The property you want to set the value of.
     * @param setLiteral.object The Literal value you want to set, the type of which is one of [[LiteralTypes]].
     */
    setLiteral: (predicate: Reference, object: LiteralTypes) => void;
    /**
     * Set a property of this Subject to a [[Reference]], clearing all existing values.
     *
     * Note that this change is not saved to the user's Pod until you save the containing Document.
     *
     * @param setRef.predicate The property you want to set the value of.
     * @param setRef.object The reference you want to add.
     */
    setRef: (predicate: Reference, object: Reference) => void;
    /**
     * @ignore Deprecated.
     * @deprecated Replaced by [[setRef]].
     */
    setNodeRef: (predicate: Reference, object: Reference) => void;
    /**
     * Unset all values for all Predicates of this Subject.
     *
     * @ignore Currently an internal API for use by [[TripleDocument]].
     */
    clear: () => void;
    /**
     * @ignore Pending Triples are only provided so the Document can access them in order to save
     *         them - this is not part of the public API and can thus break in a minor release.
     * @returns A tuple with the first element being a list of Triples that should be deleted from
     *          the store, and the second element a list of Triples that should be added to it.
     */
    getPendingTriples: () => [Quad[], Quad[]];
    /**
     * Get the IRI of the [[Reference]] representing this specific Subject.
     *
     * @returns The IRI of this specific Subject.
     */
    asRef: () => Reference;
    /**
     * @ignore Deprecated.
     * @deprecated Replaced by [[asRef]].
     */
    asNodeRef: () => Reference;
}
/**
 * @ignore Only to be called by the Document containing this subject; not a public API.
 * @param document The Document this Subject is defined in.
 * @param subjectRef The URL that identifies this subject.
 */
export declare function initialiseSubject(document: TripleDocument, subjectRef: Reference | BlankNode): TripleSubject;
