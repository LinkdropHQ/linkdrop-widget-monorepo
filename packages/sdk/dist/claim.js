"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claimERC721 = exports.claim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils");

var _axios = _interopRequireDefault(require("axios"));

var _ethers = require("ethers");

var claim =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var apiHost, weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress, receiverSignature, linkId, claimParams, response, _response$data, error, success, txHash;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            apiHost = _ref.apiHost, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, linkKey = _ref.linkKey, linkdropModuleAddress = _ref.linkdropModuleAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, receiverAddress = _ref.receiverAddress;

            if (!(apiHost == null || apiHost === '')) {
              _context.next = 3;
              break;
            }

            throw new Error('apiHost param is required');

          case 3:
            if (!(weiAmount == null || weiAmount === '')) {
              _context.next = 5;
              break;
            }

            throw new Error('weiAmount param is required');

          case 5:
            if (!(tokenAddress == null || tokenAddress === '')) {
              _context.next = 7;
              break;
            }

            throw new Error('tokenAddress param is required');

          case 7:
            if (!(tokenAmount == null || tokenAmount === '')) {
              _context.next = 9;
              break;
            }

            throw new Error('tokenAmount param is required');

          case 9:
            if (!(expirationTime == null || expirationTime === '')) {
              _context.next = 11;
              break;
            }

            throw new Error('expirationTime param is required');

          case 11:
            if (!(linkKey == null || linkKey === '')) {
              _context.next = 13;
              break;
            }

            throw new Error('linkKey param is required');

          case 13:
            if (!(linkdropModuleAddress == null || linkdropModuleAddress === '')) {
              _context.next = 15;
              break;
            }

            throw new Error('linkdropModuleAddress param is required');

          case 15:
            if (!(linkdropSignerSignature == null || linkdropSignerSignature === '')) {
              _context.next = 17;
              break;
            }

            throw new Error('linkdropSignerSignature param is required');

          case 17:
            if (!(receiverAddress == null || receiverAddress === '')) {
              _context.next = 19;
              break;
            }

            throw new Error('receiverAddress param is required');

          case 19:
            _context.next = 21;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 21:
            receiverSignature = _context.sent;
            linkId = new _ethers.ethers.Wallet(linkKey).address;
            claimParams = {
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              linkId: linkId,
              linkdropModuleAddress: linkdropModuleAddress,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverAddress: receiverAddress,
              receiverSignature: receiverSignature
            };
            _context.next = 26;
            return _axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/claim"), claimParams);

          case 26:
            response = _context.sent;
            _response$data = response.data, error = _response$data.error, success = _response$data.success, txHash = _response$data.txHash;
            return _context.abrupt("return", {
              error: error,
              success: success,
              txHash: txHash
            });

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function claim(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description Function to claim ETH and/or ERC721 tokens
 * @param {String} apiHost API host
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress NFT address
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 * @param {String} linkKey Ephemeral key attached to link
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} linkdropSignerSignature Linkdrop signer signature
 * @param {String} receiverAddress Receiver address
 */


exports.claim = claim;

var claimERC721 =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var apiHost, weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress, receiverSignature, linkId, claimParams, response, _response$data2, error, success, txHash;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            apiHost = _ref3.apiHost, weiAmount = _ref3.weiAmount, nftAddress = _ref3.nftAddress, tokenId = _ref3.tokenId, expirationTime = _ref3.expirationTime, linkKey = _ref3.linkKey, linkdropModuleAddress = _ref3.linkdropModuleAddress, linkdropSignerSignature = _ref3.linkdropSignerSignature, receiverAddress = _ref3.receiverAddress;

            if (!(apiHost == null || apiHost === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error('apiHost param is required');

          case 3:
            if (!(weiAmount == null || weiAmount === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error('weiAmount param is required');

          case 5:
            if (!(nftAddress == null || nftAddress === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error('nftAddress param is required');

          case 7:
            if (!(tokenId == null || tokenId === '')) {
              _context2.next = 9;
              break;
            }

            throw new Error('tokenId param is required');

          case 9:
            if (!(expirationTime == null || expirationTime === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error('expirationTime param is required');

          case 11:
            if (!(linkKey == null || linkKey === '')) {
              _context2.next = 13;
              break;
            }

            throw new Error('linkKey param is required');

          case 13:
            if (!(linkdropModuleAddress == null || linkdropModuleAddress === '')) {
              _context2.next = 15;
              break;
            }

            throw new Error('linkdropModuleAddress param is required');

          case 15:
            if (!(linkdropSignerSignature == null || linkdropSignerSignature === '')) {
              _context2.next = 17;
              break;
            }

            throw new Error('linkdropSignerSignature param is required');

          case 17:
            if (!(receiverAddress == null || receiverAddress === '')) {
              _context2.next = 19;
              break;
            }

            throw new Error('receiverAddress param is required');

          case 19:
            _context2.next = 21;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 21:
            receiverSignature = _context2.sent;
            linkId = new _ethers.ethers.Wallet(linkKey).address;
            claimParams = {
              weiAmount: weiAmount,
              nftAddress: nftAddress,
              tokenId: tokenId,
              expirationTime: expirationTime,
              linkId: linkId,
              linkdropModuleAddress: linkdropModuleAddress,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverAddress: receiverAddress,
              receiverSignature: receiverSignature
            };
            _context2.next = 26;
            return _axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/claim-erc721"), claimParams);

          case 26:
            response = _context2.sent;
            _response$data2 = response.data, error = _response$data2.error, success = _response$data2.success, txHash = _response$data2.txHash;
            return _context2.abrupt("return", {
              error: error,
              success: success,
              txHash: txHash
            });

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function claimERC721(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.claimERC721 = claimERC721;