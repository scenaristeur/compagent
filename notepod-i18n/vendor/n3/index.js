"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DataFactory", {
  enumerable: true,
  get: function () {
    return _N3DataFactory.default;
  }
});
Object.defineProperty(exports, "Lexer", {
  enumerable: true,
  get: function () {
    return _N3Lexer.default;
  }
});
Object.defineProperty(exports, "Parser", {
  enumerable: true,
  get: function () {
    return _N3Parser.default;
  }
});
Object.defineProperty(exports, "Writer", {
  enumerable: true,
  get: function () {
    return _N3Writer.default;
  }
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function () {
    return _N3Store.default;
  }
});
Object.defineProperty(exports, "StreamParser", {
  enumerable: true,
  get: function () {
    return _N3StreamParser.default;
  }
});
Object.defineProperty(exports, "StreamWriter", {
  enumerable: true,
  get: function () {
    return _N3StreamWriter.default;
  }
});
exports.Util = void 0;

var _N3DataFactory = _interopRequireDefault(require("./N3DataFactory"));

var _N3Lexer = _interopRequireDefault(require("./N3Lexer"));

var _N3Parser = _interopRequireDefault(require("./N3Parser"));

var _N3Writer = _interopRequireDefault(require("./N3Writer"));

var _N3Store = _interopRequireDefault(require("./N3Store"));

var _N3StreamParser = _interopRequireDefault(require("./N3StreamParser"));

var _N3StreamWriter = _interopRequireDefault(require("./N3StreamWriter"));

var Util = _interopRequireWildcard(require("./N3Util"));

exports.Util = Util;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }