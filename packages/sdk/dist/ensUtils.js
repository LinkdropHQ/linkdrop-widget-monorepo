"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnsAddress = exports.getEnsOwner = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ens = require("@ensdomains/ens");

var _ethers = require("ethers");

var _assertJs = _interopRequireDefault(require("assert-js"));

/**
 * Function to get owner of ENS identifier
 * @param {String} ensName ENS name (e.g 'alice')
 * @param {String} ensDomain ENS domain (e.g. 'domain.eth')
 * @param {String} ensAddress ENS address
 * @param {String} jsonRpcUrl JSON RPC URL
 * @return {String} ENS identifier owner's address
 */
var getEnsOwner =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var ensName, ensDomain, ensAddress, jsonRpcUrl, provider, ens, node;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ensName = _ref.ensName, ensDomain = _ref.ensDomain, ensAddress = _ref.ensAddress, jsonRpcUrl = _ref.jsonRpcUrl;

            _assertJs["default"].string(ensDomain, 'Ens domain is required');

            _assertJs["default"].url(jsonRpcUrl, 'Json rpc url is required');

            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (ensAddress) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return provider.getNetwork();

          case 7:
            ensAddress = _context.sent.ensAddress;

          case 8:
            _assertJs["default"].string(ensAddress, 'Ens address is required');

            ens = new _ethers.ethers.Contract(ensAddress, _ens.ENS.abi, provider);
            node = _ethers.ethers.utils.namehash("".concat(ensName).concat(ensDomain));
            return _context.abrupt("return", ens.owner(node));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getEnsOwner(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getEnsOwner = getEnsOwner;

var getEnsAddress = function getEnsAddress(chain) {
  _assertJs["default"].string(chain, 'Chain is required');

  switch (chain) {
    case 'mainnet':
      return '0x314159265dd8dbb310642f98f50c066173c1259b';

    case 'rinkeby':
      return '0xe7410170f87102df0055eb195163a03b7f2bff4a';

    case 'ropsten':
      return '0x112234455c3a32fd11230c42e7bccd4a84e02010';

    case 'goerli':
      return '0x112234455c3a32fd11230c42e7bccd4a84e02010';

    default:
      throw new Error('Unsupported chain');
  }
};

exports.getEnsAddress = getEnsAddress;