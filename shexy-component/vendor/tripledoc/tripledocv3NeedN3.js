(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('http-link-header'), require('rdf-namespaces'), require('n3'), require('solid-auth-client')) :
    typeof define === 'function' && define.amd ? define(['exports', 'http-link-header', 'rdf-namespaces', 'n3', 'solid-auth-client'], factory) :
    (global = global || self, factory(global.Tripledoc = {}, global.LinkHeader, global.rdfNamespaces, global.n3, global.SolidAuthClient));
}(this, function (exports, LinkHeader, rdfNamespaces, n3, SolidAuthClient) { 'use strict';

    LinkHeader = LinkHeader && LinkHeader.hasOwnProperty('default') ? LinkHeader['default'] : LinkHeader;
    SolidAuthClient = SolidAuthClient && SolidAuthClient.hasOwnProperty('default') ? SolidAuthClient['default'] : SolidAuthClient;

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

    /**
     * @param quads Triples that should be serialised to Turtle
     * @ignore Utility method for internal use by Tripledoc; not part of the public API.
     */
    function triplesToTurtle(quads) {
        return __awaiter(this, void 0, void 0, function () {
            var format, writer, triples, writePromise, rawTurtle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        format = 'text/turtle';
                        writer = new n3.Writer({ format: format });
                        triples = quads.map(function (quad) { return n3.DataFactory.quad(quad.subject, quad.predicate, quad.object); });
                        writer.addQuads(triples);
                        writePromise = new Promise(function (resolve, reject) {
                            writer.end(function (error, result) {
                                /* istanbul ignore if [n3.js doesn't actually pass an error nor a result, apparently: https://github.com/rdfjs/N3.js/blob/62682e48c02d8965b4d728cb5f2cbec6b5d1b1b8/src/N3Writer.js#L290] */
                                if (error) {
                                    return reject(error);
                                }
                                resolve(result);
                            });
                        });
                        return [4 /*yield*/, writePromise];
                    case 1:
                        rawTurtle = _a.sent();
                        return [2 /*return*/, rawTurtle];
                }
            });
        });
    }
    /**
     * @param raw Turtle that should be parsed into Triples
     * @ignore Utility method for internal use by Tripledoc; not part of the public API.
     */
    function turtleToTriples(raw, documentRef) {
        return __awaiter(this, void 0, void 0, function () {
            var format, parser, parsingPromise;
            return __generator(this, function (_a) {
                format = 'text/turtle';
                parser = new n3.Parser({ format: format, baseIRI: documentRef });
                parsingPromise = new Promise(function (resolve, reject) {
                    var parsedTriples = [];
                    parser.parse(raw, function (error, quad, _prefixes) {
                        if (error) {
                            return reject(error);
                        }
                        if (quad) {
                            quad.graph = n3.DataFactory.namedNode(documentRef);
                            parsedTriples.push(quad);
                        }
                        else {
                            resolve(parsedTriples);
                        }
                    });
                });
                return [2 /*return*/, parsingPromise];
            });
        });
    }

    /**
     * Utility function that gets Triples located at a URL
     *
     * @param url Location of the Document contains the Triples.
     * @returns Promise that resolves with the Triples
     * @ignore Should not be used by library consumers directly.
     */
    /* istanbul ignore next Just a thin wrapper around solid-auth-client, yet cumbersome to test due to side effects */
    function get(url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SolidAuthClient.fetch(url, {
                            headers: {
                                Accept: 'text/turtle',
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    }
    /**
     * Utility function that sends a PATCH request to the Pod to update a Document
     *
     * @param url Location of the Document that contains the Triples to delete, and should have the Triples to add.
     * @param triplesToDelete Triples currently present on the Pod that should be deleted.
     * @param triplesToAdd Triples not currently present on the Pod that should be added.
     * @returns Promise that resolves when the update was executed successfully, and rejects if not.
     * @ignore Should not be used by library consumers directly.
     */
    /* istanbul ignore next Just a thin wrapper around solid-auth-client, yet cumbersome to test due to side effects */
    function update(url, triplesToDelete, triplesToAdd) {
        return __awaiter(this, void 0, void 0, function () {
            var rawTriplesToDelete, rawTriplesToAdd, deleteStatement, insertStatement, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, triplesToTurtle(triplesToDelete)];
                    case 1:
                        rawTriplesToDelete = _a.sent();
                        return [4 /*yield*/, triplesToTurtle(triplesToAdd)];
                    case 2:
                        rawTriplesToAdd = _a.sent();
                        deleteStatement = (triplesToDelete.length > 0)
                            ? "DELETE DATA {" + rawTriplesToDelete + "}"
                            : '';
                        insertStatement = (triplesToAdd.length > 0)
                            ? "INSERT DATA {" + rawTriplesToAdd + "}"
                            : '';
                        return [4 /*yield*/, SolidAuthClient.fetch(url, {
                                method: 'PATCH',
                                body: deleteStatement + " " + insertStatement,
                                headers: {
                                    'Content-Type': 'application/sparql-update',
                                },
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    }
    /**
     * Utility function that sends a PUT request to the Pod to create a new Document
     *
     * @param url URL of the Document that should be created.
     * @param triplesToAdd Triples that should be added to the Document.
     * @returns Promise that resolves with the response when the Document was created successfully, and rejects if not.
     * @ignore Should not be used by library consumers directly.
     */
    /* istanbul ignore next Just a thin wrapper around solid-auth-client, yet cumbersome to test due to side effects */
    function create(url, triplesToAdd) {
        return __awaiter(this, void 0, void 0, function () {
            var rawTurtle, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, triplesToTurtle(triplesToAdd)];
                    case 1:
                        rawTurtle = _a.sent();
                        return [4 /*yield*/, SolidAuthClient.fetch(url, {
                                method: 'PUT',
                                body: rawTurtle,
                                headers: {
                                    'Content-Type': 'text/turtle',
                                    'If-None-Match': '*',
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    }

    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    var findSubjectInStore = function (store, predicateRef, objectRef, documentRef) {
        return findEntityInStore(store, 'subject', null, predicateRef, objectRef, documentRef);
    };
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    var findSubjectsInStore = function (store, predicateRef, objectRef, documentRef) {
        return findEntitiesInStore(store, 'subject', null, predicateRef, objectRef, documentRef);
    };
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    var findObjectsInStore = function (store, subjectRef, predicateRef, documentRef) {
        return findEntitiesInStore(store, 'object', subjectRef, predicateRef, null, documentRef);
    };
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    function findEntityInStore(store, type, subjectRef, predicateRef, objectRef, documentRef) {
        var targetSubject = subjectRef ? toNode(subjectRef) : null;
        var targetPredicate = predicateRef ? toNode(predicateRef) : null;
        var targetObject = objectRef ? toNode(objectRef) : null;
        var targetDocument = objectRef ? toNode(documentRef) : null;
        var matchingTriples = store.getQuads(targetSubject, targetPredicate, targetObject, targetDocument);
        var foundTriple = matchingTriples.find(function (triple) { return (typeof triple[type] !== 'undefined'); });
        return (typeof foundTriple !== 'undefined') ? normaliseEntity(foundTriple[type]) : null;
    }
    /**
     * @ignore This is a utility method for other parts of the code, and not part of the public API.
     */
    function findEntitiesInStore(store, type, subjectRef, predicateRef, objectRef, documentRef) {
        var targetSubject = subjectRef ? toNode(subjectRef) : null;
        var targetPredicate = predicateRef ? toNode(predicateRef) : null;
        var targetObject = objectRef ? toNode(objectRef) : null;
        var targetDocument = objectRef ? toNode(documentRef) : null;
        var matchingTriples = store.getQuads(targetSubject, targetPredicate, targetObject, targetDocument);
        var foundTriples = matchingTriples.filter(function (triple) { return (typeof triple[type] !== 'undefined'); });
        return foundTriples.map(function (triple) { return normaliseEntity(triple[type]); }).filter(isEntity);
    }
    function toNode(referenceOrBlankNode) {
        return (typeof referenceOrBlankNode === 'string') ? n3.DataFactory.namedNode(referenceOrBlankNode) : referenceOrBlankNode;
    }
    function normaliseEntity(entity) {
        if (isBlankNode(entity)) {
            return entity;
        }
        if (isNamedNode(entity)) {
            return entity.value;
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
     * @ignore Utility function for working with N3, which the library consumer should not need to
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
        var subjectNode = isBlankNode$1(subjectRef) ? subjectRef : n3.DataFactory.namedNode(subjectRef);
        var triples = document.getStore()
            .getQuads(subjectNode, null, null, n3.DataFactory.namedNode(document.asNodeRef()));
        var store = new n3.Store();
        store.addQuads(triples);
        var pendingAdditions = [];
        var pendingDeletions = [];
        var get = function (predicateNode) { return findObjectsInStore(store, subjectRef, predicateNode, document.asRef()); };
        var getString = function (predicateNode) {
            var objects = get(predicateNode);
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
            pendingAdditions.push(n3.DataFactory.quad(subjectNode, n3.DataFactory.namedNode(predicateRef), asLiteral(literal), n3.DataFactory.namedNode(document.asRef())));
        };
        var addRef = function (predicateRef, nodeRef) {
            pendingAdditions.push(n3.DataFactory.quad(subjectNode, n3.DataFactory.namedNode(predicateRef), n3.DataFactory.namedNode(nodeRef), n3.DataFactory.namedNode(document.asRef())));
        };
        var removeRef = function (predicateRef, nodeRef) {
            pendingDeletions.push(n3.DataFactory.quad(subjectNode, n3.DataFactory.namedNode(predicateRef), n3.DataFactory.namedNode(nodeRef), n3.DataFactory.namedNode(document.asRef())));
        };
        var removeAll = function (predicateRef) {
            pendingDeletions.push.apply(pendingDeletions, store.getQuads(subjectNode, predicateRef, null, n3.DataFactory.namedNode(document.asRef())));
        };
        var clear = function () {
            pendingDeletions.push.apply(pendingDeletions, getTriples());
        };
        var setRef = function (predicateRef, nodeRef) {
            removeAll(predicateRef);
            addRef(predicateRef, nodeRef);
        };
        var getTriples = function () { return store.getQuads(subjectNode, null, null, n3.DataFactory.namedNode(document.asRef())); };
        var asRef = function () { return isBlankNode$1(subjectRef) ? subjectRef.id : subjectRef; };
        var subject = {
            getDocument: function () { return document; },
            getTriples: getTriples,
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
                pendingDeletions.push(n3.DataFactory.quad(subjectNode, n3.DataFactory.namedNode(predicateRef), asLiteral(literal), n3.DataFactory.namedNode(document.asRef())));
            },
            removeRef: removeRef,
            setLiteral: function (predicateRef, literal) {
                removeAll(predicateRef);
                addLiteral(predicateRef, literal);
            },
            setRef: setRef,
            clear: clear,
            getPendingTriples: function () { return [pendingDeletions, pendingAdditions]; },
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
            // To align with rdflib, we ignore miliseconds:
            // https://github.com/linkeddata/rdflib.js/blob/d84af88f367b8b5f617c753d8241c5a2035458e8/src/literal.js#L74
            var roundedDate = new Date(Date.UTC(literal.getUTCFullYear(), literal.getUTCMonth(), literal.getUTCDate(), literal.getUTCHours(), literal.getUTCMinutes(), literal.getUTCSeconds(), 0));
            // Truncate the `.000Z` at the end (i.e. the miliseconds), to plain `Z`:
            var rdflibStyleString = roundedDate.toISOString().replace(/\.000Z$/, 'Z');
            return n3.DataFactory.literal(rdflibStyleString, n3.DataFactory.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'));
        }
        if (typeof literal === 'number' && Number.isInteger(literal)) {
            return n3.DataFactory.literal(literal, n3.DataFactory.namedNode('http://www.w3.org/2001/XMLSchema#integer'));
        }
        if (typeof literal === 'number' && !Number.isInteger(literal)) {
            return n3.DataFactory.literal(literal, n3.DataFactory.namedNode('http://www.w3.org/2001/XMLSchema#decimal'));
        }
        return n3.DataFactory.literal(literal);
    }

    /**
     * Initialise a new Turtle document
     *
     * Note that this Document will not be created on the Pod until you call [[save]] on it.
     *
     * @param ref URL where this document should live
     */
    function createDocument(ref) {
        return instantiateDocument(ref, [], { existsOnPod: false });
    }
    /**
     * Retrieve a document containing RDF triples
     *
     * @param documentRef Where the document lives.
     * @returns Representation of triples in the document at `uri`.
     */
    function fetchDocument(uri) {
        return __awaiter(this, void 0, void 0, function () {
            var docUrl, documentRef, response, rawDocument, triples, aclRef, webSocketRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        docUrl = new URL(uri);
                        documentRef = docUrl.origin + docUrl.pathname + docUrl.search;
                        return [4 /*yield*/, get(documentRef)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        rawDocument = _a.sent();
                        return [4 /*yield*/, turtleToTriples(rawDocument, documentRef)];
                    case 3:
                        triples = _a.sent();
                        aclRef = extractAclRef(response, documentRef);
                        webSocketRef = response.headers.get('Updates-Via');
                        return [2 /*return*/, instantiateDocument(documentRef, triples, {
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
    function instantiateDocument(documentRef, triples, metadata) {
        var _this = this;
        var asRef = function () { return documentRef; };
        var store = new n3.Store();
        store.addQuads(triples);
        var getAclRef = function () {
            return metadata.aclRef || null;
        };
        var getWebSocketRef = function () {
            return metadata.webSocketRef || null;
        };
        var accessedSubjects = {};
        var getSubject = function (subjectRef) {
            // Allow relative URLs to access Subjects in this Document:
            subjectRef = new URL(subjectRef, documentRef).href;
            if (!accessedSubjects[subjectRef]) {
                accessedSubjects[subjectRef] = initialiseSubject(tripleDocument, subjectRef);
            }
            return accessedSubjects[subjectRef];
        };
        var findSubject = function (predicateRef, objectRef) {
            var findSubjectRef = withDocumentSingular(findSubjectInStore, documentRef, store);
            var subjectRef = findSubjectRef(predicateRef, objectRef);
            if (!subjectRef || !isReference(subjectRef)) {
                return null;
            }
            return getSubject(subjectRef);
        };
        var findSubjects = function (predicateRef, objectRef) {
            var findSubjectRefs = withDocumentPlural(findSubjectsInStore, documentRef, store);
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
                var relevantSubjects, _a, allDeletions, allAdditions, newTriples, response, aclRef, webSocketRef;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            relevantSubjects = subjects.filter(function (subject) { return subject.getDocument().asRef() === documentRef; });
                            _a = relevantSubjects.reduce(function (_a, subject) {
                                var deletionsSoFar = _a[0], additionsSoFar = _a[1];
                                var _b = subject.getPendingTriples(), deletions = _b[0], additions = _b[1];
                                return [deletionsSoFar.concat(deletions), additionsSoFar.concat(additions)];
                            }, [[], []]), allDeletions = _a[0], allAdditions = _a[1];
                            newTriples = getTriples()
                                .concat(allAdditions)
                                .filter(function (tripleToDelete) { return allDeletions.findIndex(function (triple) { return triple.equals(tripleToDelete); }) === -1; });
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
                        case 2: return [4 /*yield*/, update(documentRef, allDeletions, allAdditions)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: 
                        // Instantiate a new TripleDocument that includes the updated Triples:
                        return [2 /*return*/, instantiateDocument(documentRef, newTriples, metadata)];
                    }
                });
            });
        };
        var getStore = function () { return store; };
        var getTriples = function () { return store.getQuads(null, null, null, n3.DataFactory.namedNode(documentRef)); };
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
            getStore: getStore,
            getTriples: getTriples,
            // Deprecated aliases, included for backwards compatibility:
            asNodeRef: asRef,
            getAcl: getAclRef,
            getStatements: getTriples,
        };
        return tripleDocument;
    }
    var withDocumentSingular = function (getEntityFromTriples, document, store) {
        return function (knownEntity1, knownEntity2) {
            return getEntityFromTriples(store, knownEntity1, knownEntity2, document);
        };
    };
    var withDocumentPlural = function (getEntitiesFromTriples, document, store) {
        return function (knownEntity1, knownEntity2) {
            return getEntitiesFromTriples(store, knownEntity1, knownEntity2, document);
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
     * @param param A value that might or might not be an N3 Literal.
     * @returns Whether `param` is an N3 Literal.
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
     * @param param A value that might or might not be an N3 string Literal.
     * @returns Whether `param` is an N3 string Literal.
     */
    function isStringLiteral(param) {
        return isLiteral(param) && param.datatype.id === 'http://www.w3.org/2001/XMLSchema#string';
    }
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
     *         type, so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an N3 integer Literal.
     * @returns Whether `param` is an N3 integer Literal.
     */
    function isIntegerLiteral(param) {
        return isLiteral(param) && param.datatype.id === 'http://www.w3.org/2001/XMLSchema#integer';
    }
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
     *         type, so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an N3 decimal Literal.
     * @returns Whether `param` is an N3 decimal Literal.
     */
    function isDecimalLiteral(param) {
        return isLiteral(param) && param.datatype.id === 'http://www.w3.org/2001/XMLSchema#decimal';
    }
    /**
     * @ignore Tripledoc's methods should be explicit about whether they return or accept a specific
     *         type, so this is merely an internal utility function, rather than a public API.
     * @param param A value that might or might not be an N3 DateTime Literal.
     * @returns Whether `param` is an N3 DateTime Literal.
     */
    function isDateTimeLiteral(param) {
        return isLiteral(param) && param.datatype.id === 'http://www.w3.org/2001/XMLSchema#dateTime';
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
    exports.get = get;
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
