(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rdflib'), require('http-link-header'), require('rdf-namespaces')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rdflib', 'http-link-header', 'rdf-namespaces'], factory) :
    (global = global || self, factory(global.Tripledoc = {}, global.rdflib, global.LinkHeader, global.rdfNamespaces));
}(this, function (exports, rdflib, LinkHeader, rdfNamespaces) { 'use strict';

    LinkHeader = LinkHeader && LinkHeader.hasOwnProperty('default') ? LinkHeader['default'] : LinkHeader;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var store = rdflib.graph();
    var fetcher = new rdflib.Fetcher(store, undefined);
    var updater = new rdflib.UpdateManager(store);
    /**
     * Single instance of an rdflib store, caches all fetched data
     *
     * @ignore Can be used as an escape hatch for people who want to use rdflib directly, but if that
     *         is necessary, please consider submitting a feature request describing your use case
     *         on Tripledoc first.
     */
    function getStore() {
        return store;
    }
    /**
     * Single instance of an rdflib fetcher
     *
     * @ignore Can be used as an escape hatch for people who want to use rdflib directly, but if that
     *         is necessary, please consider submitting a feature request describing your use case
     *         on Tripledoc first.
     */
    function getFetcher() {
        return fetcher;
    }
    /**
     * Single instance of an rdflib updater
     *
     * @ignore Can be used as an escape hatch for people who want to use rdflib directly, but if that
     *         is necessary, please consider submitting a feature request describing your use case
     *         on Tripledoc first.
     */
    function getUpdater() {
        return updater;
    }
    /**
     * Utility function that properly promisifies the RDFLib UpdateManager's update function
     *
     * @param statementsToDelete Statements currently present on the Pod that should be deleted.
     * @param statementsToAdd Statements not currently present on the Pod that should be added.
     * @returns Promise that resolves when the update was executed successfully, and rejects if not.
     * @ignore Should not be used by library consumers directly.
     */
    /* istanbul ignore next Just a thin wrapper around rdflib, yet cumbersome to test due to side effects */
    function update(statementsToDelete, statementsToAdd) {
        var promise = new Promise(function (resolve, reject) {
            var updater = getUpdater();
            updater.update(statementsToDelete, statementsToAdd, function (_uri, success, errorBody) {
                if (success) {
                    return resolve();
                }
                return reject(new Error(errorBody));
            });
        });
        return promise;
    }
    /**
     * Utility function that properly promisifies the RDFLib UpdateManager's `put` function
     *
     * @param url URL of the Document that should be created.
     * @param statementsToAdd Statements that should be added to the Document.
     * @returns Promise that resolves with the response when the Document was created successfully, and rejects if not.
     * @ignore Should not be used by library consumers directly.
     */
    /* istanbul ignore next Just a thin wrapper around rdflib, yet cumbersome to test due to side effects */
    function create(url, statementsToAdd) {
        var promise = new Promise(function (resolve, reject) {
            var store = getStore();
            var updater = getUpdater();
            var doc = store.sym(url);
            updater.put(doc, statementsToAdd, 'text/turtle', function (_uri, ok, errorMessage, response) {
                if (!ok) {
                    return reject(new Error(errorMessage));
                }
                return resolve(response);
            });
        });
        return promise;
    }

    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    var findSubjectInStatements = function (statements, predicateRef, objectRef, documentRef) {
        return findEntityInStatements(statements, 'subject', null, predicateRef, objectRef, documentRef);
    };
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    var findSubjectsInStatements = function (statements, predicateRef, objectRef, documentRef) {
        return findEntitiesInStatements(statements, 'subject', null, predicateRef, objectRef, documentRef);
    };
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    var findObjectsInStatements = function (statements, subjectRef, predicateRef, documentRef) {
        return findEntitiesInStatements(statements, 'object', subjectRef, predicateRef, null, documentRef);
    };
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    function findEntityInStatements(statements, type, subjectRef, predicateRef, objectRef, documentRef) {
        var foundStatement = statements.find(function (statement) {
            return (typeof statement[type] !== 'undefined' &&
                statementMatches(statement, subjectRef, predicateRef, objectRef, documentRef));
        });
        return (typeof foundStatement !== 'undefined') ? normaliseEntity(foundStatement[type]) : null;
    }
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    function findEntitiesInStatements(statements, type, subjectRef, predicateRef, objectRef, documentRef) {
        var foundStatements = statements.filter(function (statement) {
            return (typeof statement[type] !== 'undefined' &&
                statementMatches(statement, subjectRef, predicateRef, objectRef, documentRef));
        });
        return foundStatements.map(function (statement) { return normaliseEntity(statement[type]); }).filter(isEntity);
    }
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    function findMatchingStatements(statements, subjectRef, predicateRef, objectRef, documentRef) {
        var foundStatements = statements.filter(function (statement) {
            return statementMatches(statement, subjectRef, predicateRef, objectRef, documentRef);
        });
        return foundStatements;
    }
    function statementMatches(statement, subjectRef, predicateRef, objectRef, documentRef) {
        var targetSubject = subjectRef ? toNode(subjectRef) : null;
        var targetPredicate = predicateRef ? toNode(predicateRef) : null;
        var targetObject = objectRef ? toNode(objectRef) : null;
        var targetDocument = rdflib.sym(documentRef);
        return ((targetSubject === null || statement.subject.sameTerm(targetSubject)) &&
            (targetPredicate === null || statement.predicate.sameTerm(targetPredicate)) &&
            (targetObject === null || statement.object.sameTerm(targetObject)) &&
            (targetDocument === null || (typeof statement.why !== 'undefined' &&
                isNamedNode(statement.why) &&
                statement.why.sameTerm(targetDocument))));
    }
    function toNode(referenceOrBlankNode) {
        return (typeof referenceOrBlankNode === 'string') ? rdflib.sym(referenceOrBlankNode) : referenceOrBlankNode;
    }
    function normaliseEntity(entity) {
        if (isBlankNode(entity)) {
            return entity;
        }
        if (isNamedNode(entity)) {
            return entity.uri;
        }
        /* istanbul ignore else: All code paths to here result in either a Node or a Literal, so we can't test it */
        if (isLiteral(entity)) {
            return entity;
        }
        /* istanbul ignore next: All code paths to here result in either a Node or a Literal, so we can't test it */
        return null;
    }
    function isEntity(node) {
        return (node !== null);
    }
    /**
     * @ignore Utility function for working with rdflib, which the library consumer should not need to
     *         be exposed to.
     */
    function isNamedNode(node) {
        return node.termType === 'NamedNode';
    }
    /**
     * @ignore Utility function for working with rdflib, which the library consumer should not need to
     *         be exposed to.
     */
    function isBlankNode(node) {
        return node.termType === 'BlankNode';
    }

    /**
     * @ignore Only to be called by the Document containing this subject; not a public API.
     * @param document The Document this Subject is defined in.
     * @param subjectRef The URL that identifies this subject.
     */
    function initialiseSubject(document, subjectRef) {
        var subjectNode = isBlankNode$1(subjectRef) ? subjectRef : rdflib.sym(subjectRef);
        var statements = findMatchingStatements(document.getStatements(), subjectRef, null, null, document.asRef());
        var pendingAdditions = [];
        var pendingDeletions = [];
        var get = function (predicateRef) { return findObjectsInStatements(statements, subjectRef, predicateRef, document.asRef()); };
        var getString = function (predicateRef) {
            var objects = get(predicateRef);
            var firstStringLiteral = objects.find(isStringLiteral);
            if (typeof firstStringLiteral === 'undefined') {
                return null;
            }
            return firstStringLiteral.value;
        };
        var getInteger = function (predicateRef) {
            var objects = get(predicateRef);
            var firstIntegerLiteral = objects.find(isIntegerLiteral);
            if (typeof firstIntegerLiteral === 'undefined') {
                return null;
            }
            return fromIntegerLiteral(firstIntegerLiteral);
        };
        var getDecimal = function (predicateRef) {
            var objects = get(predicateRef);
            var firstDecimalLiteral = objects.find(isDecimalLiteral);
            if (typeof firstDecimalLiteral === 'undefined') {
                return null;
            }
            return fromDecimalLiteral(firstDecimalLiteral);
        };
        var getDateTime = function (predicateRef) {
            var objects = get(predicateRef);
            var firstDateTimeLiteral = objects.find(isDateTimeLiteral);
            if (typeof firstDateTimeLiteral === 'undefined') {
                return null;
            }
            return fromDateTimeLiteral(firstDateTimeLiteral);
        };
        var getLiteral = function (predicateRef) {
            var objects = get(predicateRef);
            var firstLiteral = objects.find(isLiteral);
            if (typeof firstLiteral === 'undefined') {
                return null;
            }
            return fromLiteral(firstLiteral);
        };
        var getAllStrings = function (predicateRef) {
            var objects = get(predicateRef);
            var literals = objects.filter(isStringLiteral);
            return literals.map(fromStringLiteral);
        };
        var getAllIntegers = function (predicateRef) {
            var objects = get(predicateRef);
            var literals = objects.filter(isIntegerLiteral);
            return literals.map(fromIntegerLiteral);
        };
        var getAllDecimals = function (predicateRef) {
            var objects = get(predicateRef);
            var literals = objects.filter(isDecimalLiteral);
            return literals.map(fromDecimalLiteral);
        };
        var getAllDateTimes = function (predicateRef) {
            var objects = get(predicateRef);
            var literals = objects.filter(isDateTimeLiteral);
            return literals.map(fromDateTimeLiteral);
        };
        var getAllLiterals = function (predicateRef) {
            var objects = get(predicateRef);
            var literals = objects.filter(isLiteral);
            return literals.map(fromLiteral);
        };
        var getLocalSubject = function (predicateRef) {
            var objects = get(predicateRef);
            var firstRef = objects.find(isBlankNode$1);
            if (typeof firstRef === 'undefined') {
                return null;
            }
            return initialiseSubject(document, firstRef);
        };
        var getAllLocalSubjects = function (predicateRef) {
            var objects = get(predicateRef);
            var nodeRefs = objects.filter(isBlankNode$1);
            return nodeRefs.map(function (localSubject) { return initialiseSubject(document, localSubject); });
        };
        var getRef = function (predicateRef) {
            var objects = get(predicateRef);
            var firstRef = objects.find(isReference);
            if (typeof firstRef === 'undefined') {
                return null;
            }
            return firstRef;
        };
        var getAllRefs = function (predicateRef) {
            var objects = get(predicateRef);
            var nodeRefs = objects.filter(isReference);
            return nodeRefs;
        };
        var getType = function () {
            return getRef(rdfNamespaces.rdf.type);
        };
        var addLiteral = function (predicateRef, literal) {
            pendingAdditions.push(rdflib.st(subjectNode, rdflib.sym(predicateRef), asLiteral(literal), rdflib.sym(document.asRef())));
        };
        var addRef = function (predicateRef, ref) {
            pendingAdditions.push(rdflib.st(subjectNode, rdflib.sym(predicateRef), rdflib.sym(ref), rdflib.sym(document.asRef())));
        };
        var removeRef = function (predicateRef, nodeRef) {
            pendingDeletions.push(rdflib.st(subjectNode, rdflib.sym(predicateRef), rdflib.sym(nodeRef), rdflib.sym(document.asRef())));
        };
        var removeAll = function (predicateRef) {
            pendingDeletions.push.apply(pendingDeletions, findMatchingStatements(statements, subjectRef, predicateRef, null, document.asRef()));
        };
        var clear = function () {
            pendingDeletions.push.apply(pendingDeletions, statements);
        };
        var setRef = function (predicateRef, nodeRef) {
            removeAll(predicateRef);
            addRef(predicateRef, nodeRef);
        };
        var asRef = function () { return isBlankNode$1(subjectRef) ? subjectRef.id : subjectRef; };
        var subject = {
            getDocument: function () { return document; },
            getStatements: function () { return statements; },
            getString: getString,
            getInteger: getInteger,
            getDecimal: getDecimal,
            getDateTime: getDateTime,
            getLiteral: getLiteral,
            getAllStrings: getAllStrings,
            getAllIntegers: getAllIntegers,
            getAllDecimals: getAllDecimals,
            getAllDateTimes: getAllDateTimes,
            getAllLiterals: getAllLiterals,
            getLocalSubject: getLocalSubject,
            getAllLocalSubjects: getAllLocalSubjects,
            getRef: getRef,
            getAllRefs: getAllRefs,
            getType: getType,
            addLiteral: addLiteral,
            addRef: addRef,
            removeAll: removeAll,
            removeLiteral: function (predicateRef, literal) {
                pendingDeletions.push(rdflib.st(subjectNode, rdflib.sym(predicateRef), asLiteral(literal), rdflib.sym(document.asRef())));
            },
            removeRef: removeRef,
            setLiteral: function (predicateRef, literal) {
                removeAll(predicateRef);
                addLiteral(predicateRef, literal);
            },
            setRef: setRef,
            clear: clear,
            getPendingStatements: function () { return [pendingDeletions, pendingAdditions]; },
            asRef: asRef,
            // Deprecated aliases, included for backwards compatibility:
            getNodeRef: getRef,
            getAllNodeRefs: getAllRefs,
            addNodeRef: addRef,
            removeNodeRef: removeRef,
            setNodeRef: setRef,
            asNodeRef: asRef,
        };
        return subject;
    }
    function fromDateTimeLiteral(literal) {
        // See https://github.com/linkeddata/rdflib.js/blob/d84af88f367b8b5f617c753d8241c5a2035458e8/src/literal.js#L87
        var utcFullYear = parseInt(literal.value.substring(0, 4), 10);
        var utcMonth = parseInt(literal.value.substring(5, 7), 10) - 1;
        var utcDate = parseInt(literal.value.substring(8, 10), 10);
        var utcHours = parseInt(literal.value.substring(11, 13), 10);
        var utcMinutes = parseInt(literal.value.substring(14, 16), 10);
        var utcSeconds = parseInt(literal.value.substring(17, literal.value.indexOf('Z')), 10);
        var date = new Date(0);
        date.setUTCFullYear(utcFullYear);
        date.setUTCMonth(utcMonth);
        date.setUTCDate(utcDate);
        date.setUTCHours(utcHours);
        date.setUTCMinutes(utcMinutes);
        date.setUTCSeconds(utcSeconds);
        return date;
    }
    function fromIntegerLiteral(literal) {
        return parseInt(literal.value, 10);
    }
    function fromDecimalLiteral(literal) {
        return parseFloat(literal.value);
    }
    function fromStringLiteral(literal) {
        return literal.value;
    }
    function fromLiteral(literal) {
        if (isDateTimeLiteral(literal)) {
            return fromDateTimeLiteral(literal);
        }
        if (isIntegerLiteral(literal)) {
            return fromIntegerLiteral(literal);
        }
        if (isDecimalLiteral(literal)) {
            return fromDecimalLiteral(literal);
        }
        return literal.value;
    }
    function asLiteral(literal) {
        if (literal instanceof Date) {
            return rdflib.Literal.fromDate(literal);
        }
        if (typeof literal === 'number') {
            return rdflib.Literal.fromNumber(literal);
        }
        return new rdflib.Literal(literal, undefined, undefined);
    }

    /**
     * Initialise a new Turtle document
     *
     * Note that this Document will not be created on the Pod until you call [[save]] on it.
     *
     * @param ref URL where this document should live
     * @param statements Initial statements to be included in this document
     */
    function createDocument(ref) {
        return instantiateDocument(ref, { existsOnPod: false });
    }
    /**
     * Retrieve a document containing RDF triples
     *
     * Note that if you fetch the same document twice, it will be cached; only one
     * network request will be performed.
     *
     * @param documentRef Where the document lives.
     * @returns Representation of triples in the document at `uri`.
     */
    function fetchDocument(documentRef) {
        return __awaiter(this, void 0, void 0, function () {
            var fetcher, response, aclRef, webSocketRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetcher = getFetcher();
                        return [4 /*yield*/, fetcher.load(documentRef)];
                    case 1:
                        response = _a.sent();
                        aclRef = extractAclRef(response, documentRef);
                        webSocketRef = response.headers.get('Updates-Via');
                        return [2 /*return*/, instantiateDocument(documentRef, {
                                aclRef: aclRef,
                                webSocketRef: webSocketRef || undefined,
                                existsOnPod: true,
                            })];
                }
            });
        });
    }
    function extractAclRef(response, documentRef) {
        var aclRef;
        var linkHeader = response.headers.get('Link');
        // `LinkHeader` might not be present when using the UMD build in the browser,
        // in which case we just don't parse the ACL header. It is recommended to use a non-UMD build
        // that supports code splitting anyway.
        if (linkHeader && LinkHeader) {
            var parsedLinks = LinkHeader.parse(linkHeader);
            var aclLinks = parsedLinks.get('rel', 'acl');
            if (aclLinks.length === 1) {
                aclRef = new URL(aclLinks[0].uri, documentRef).href;
            }
        }
        return aclRef;
    }
    function instantiateDocument(uri, metadata) {
        var _this = this;
        var docUrl = new URL(uri);
        // Remove fragment identifiers (e.g. `#me`) from the URI:
        var documentRef = docUrl.origin + docUrl.pathname + docUrl.search;
        var statements = getStore().statementsMatching(null, null, null, rdflib.sym(documentRef));
        var asRef = function () { return documentRef; };
        var getAclRef = function () {
            return metadata.aclRef || null;
        };
        var getWebSocketRef = function () {
            return metadata.webSocketRef || null;
        };
        var accessedSubjects = {};
        var getSubject = function (subjectRef) {
            if (!accessedSubjects[subjectRef]) {
                accessedSubjects[subjectRef] = initialiseSubject(tripleDocument, subjectRef);
            }
            return accessedSubjects[subjectRef];
        };
        var findSubject = function (predicateRef, objectRef) {
            var findSubjectRef = withDocumentSingular(findSubjectInStatements, documentRef, statements);
            var subjectRef = findSubjectRef(predicateRef, objectRef);
            if (!subjectRef || !isReference(subjectRef)) {
                return null;
            }
            return getSubject(subjectRef);
        };
        var findSubjects = function (predicateRef, objectRef) {
            var findSubjectRefs = withDocumentPlural(findSubjectsInStatements, documentRef, statements);
            var subjectRefs = findSubjectRefs(predicateRef, objectRef);
            return subjectRefs.filter(isReference).map(getSubject);
        };
        var getSubjectsOfType = function (typeRef) {
            return findSubjects(rdfNamespaces.rdf.type, typeRef);
        };
        var addSubject = function (_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.identifier, identifier = _c === void 0 ? generateIdentifier() : _c, _d = _b.identifierPrefix, identifierPrefix = _d === void 0 ? '' : _d;
            var subjectRef = documentRef + '#' + identifierPrefix + identifier;
            return getSubject(subjectRef);
        };
        var removeSubject = function (subjectRef) {
            var subject = getSubject(subjectRef);
            return subject.clear();
        };
        var save = function (subjects) {
            if (subjects === void 0) { subjects = Object.values(accessedSubjects); }
            return __awaiter(_this, void 0, void 0, function () {
                var relevantSubjects, _a, allDeletions, allAdditions, response, aclRef, webSocketRef;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            relevantSubjects = subjects.filter(function (subject) { return subject.getDocument().asRef() === documentRef; });
                            _a = relevantSubjects.reduce(function (_a, subject) {
                                var deletionsSoFar = _a[0], additionsSoFar = _a[1];
                                var _b = subject.getPendingStatements(), deletions = _b[0], additions = _b[1];
                                return [deletionsSoFar.concat(deletions), additionsSoFar.concat(additions)];
                            }, [[], []]), allDeletions = _a[0], allAdditions = _a[1];
                            if (!!metadata.existsOnPod) return [3 /*break*/, 2];
                            return [4 /*yield*/, create(documentRef, allAdditions)];
                        case 1:
                            response = _b.sent();
                            aclRef = extractAclRef(response, documentRef);
                            if (aclRef) {
                                metadata.aclRef = aclRef;
                            }
                            webSocketRef = response.headers.get('Updates-Via');
                            if (webSocketRef) {
                                metadata.webSocketRef = webSocketRef;
                            }
                            metadata.existsOnPod = true;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, update(allDeletions, allAdditions)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: 
                        // Instantiate a new TripleDocument that includes the updated Statements:
                        return [2 /*return*/, instantiateDocument(documentRef, metadata)];
                    }
                });
            });
        };
        var getStatements = function () { return statements; };
        var tripleDocument = {
            addSubject: addSubject,
            removeSubject: removeSubject,
            getSubject: getSubject,
            getSubjectsOfType: getSubjectsOfType,
            findSubject: findSubject,
            findSubjects: findSubjects,
            getAclRef: getAclRef,
            getWebSocketRef: getWebSocketRef,
            asRef: asRef,
            save: save,
            getStatements: getStatements,
            // Deprecated aliases, included for backwards compatibility:
            asNodeRef: asRef,
            getAcl: getAclRef,
        };
        return tripleDocument;
    }
    var withDocumentSingular = function (getEntityFromStatements, document, statements) {
        return function (knownEntity1, knownEntity2) {
            return getEntityFromStatements(statements, knownEntity1, knownEntity2, document);
        };
    };
    var withDocumentPlural = function (getEntitiesFromStatements, document, statements) {
        return function (knownEntity1, knownEntity2) {
            return getEntitiesFromStatements(statements, knownEntity1, knownEntity2, document);
        };
    };
    /**
     * Generate a string that can be used as the unique identifier for a Subject
     *
     * This function works by starting with a date string (so that Subjects can be
     * sorted chronologically), followed by a random number generated by taking a
     * random number between 0 and 1, and cutting off the `0.`.
     *
     * @ignore
     * @returns An string that's likely to be unique
     */
    var generateIdentifier = function () {
        return Date.now().toString() + Math.random().toString().substring('0.'.length);
    };

    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a Literal, so
     *         this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an RDFlib Literal.
     * @returns Whether `param` is an RDFlib Literal.
     */
    function isLiteral(param) {
        return (typeof param === 'object') &&
            (param !== null) &&
            (typeof param.termType === 'string') &&
            param.termType === 'Literal';
    }
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
     *         type, so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an RDFlib string Literal.
     * @returns Whether `param` is an RDFlib string Literal.
     */
    function isStringLiteral(param) {
        return isLiteral(param) && param.datatype.uri === 'http://www.w3.org/2001/XMLSchema#string';
    }
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
     *         type, so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an RDFlib integer Literal.
     * @returns Whether `param` is an RDFlib integer Literal.
     */
    function isIntegerLiteral(param) {
        return isLiteral(param) && param.datatype.uri === 'http://www.w3.org/2001/XMLSchema#integer';
    }
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
     *         type, so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an RDFlib decimal Literal.
     * @returns Whether `param` is an RDFlib decimal Literal.
     */
    function isDecimalLiteral(param) {
        return isLiteral(param) && param.datatype.uri === 'http://www.w3.org/2001/XMLSchema#decimal';
    }
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
     *         type, so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an RDFlib DateTime Literal.
     * @returns Whether `param` is an RDFlib DateTime Literal.
     */
    function isDateTimeLiteral(param) {
        return isLiteral(param) && param.datatype.uri === 'http://www.w3.org/2001/XMLSchema#dateTime';
    }
    /**
     * @ignore Deprecated function.
     * @deprecated Replaced by [[isReference]].
     */
    var isNodeRef = isReference;
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a [[Reference]],
     *         so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be a reference to a node in the Linked Data graph.
     * @returns Whether `param` is a reference to a node in the Linked Data graph.
     */
    function isReference(value) {
        return typeof value === 'string' && !isLiteral(value);
    }
    /**
     * @ignore Blank Nodes themselves should not be exposed to library consumers, so this is merely an
     *         internal utility function, rather than a public API.
     * @param param A value that might or might not be a blank node in the Linked Data graph.
     * @returns Whether `param` is a blank node in the Linked Data graph.
     */
    function isBlankNode$1(param) {
        return (typeof param === 'object') &&
            (param !== null) &&
            (typeof param.termType === 'string') &&
            param.termType === 'BlankNode';
    }

    exports.create = create;
    exports.createDocument = createDocument;
    exports.fetchDocument = fetchDocument;
    exports.getFetcher = getFetcher;
    exports.getStore = getStore;
    exports.getUpdater = getUpdater;
    exports.initialiseSubject = initialiseSubject;
    exports.isBlankNode = isBlankNode$1;
    exports.isDateTimeLiteral = isDateTimeLiteral;
    exports.isDecimalLiteral = isDecimalLiteral;
    exports.isIntegerLiteral = isIntegerLiteral;
    exports.isLiteral = isLiteral;
    exports.isNodeRef = isNodeRef;
    exports.isReference = isReference;
    exports.isStringLiteral = isStringLiteral;
    exports.update = update;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
