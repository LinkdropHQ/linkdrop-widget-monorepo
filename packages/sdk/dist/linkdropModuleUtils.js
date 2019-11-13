"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClaimedLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _LinkdropModule = _interopRequireDefault(require("../../contracts/build/LinkdropModule.json"));

var _ethers = require("ethers");

var isClaimedLink =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var linkdropModule, linkId, jsonRpcUrl, provider, linkdropModuleContract;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            linkdropModule = _ref.linkdropModule, linkId = _ref.linkId, jsonRpcUrl = _ref.jsonRpcUrl;
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            linkdropModuleContract = new _ethers.ethers.Contract(linkdropModule, _LinkdropModule["default"].abi, provider);
            return _context.abrupt("return", linkdropModuleContract.isClaimedLink(linkId));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isClaimedLink(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.isClaimedLink = isClaimedLink;