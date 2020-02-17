"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateLinkERC721 = exports.generateLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils");

var _ethers = require("ethers");

var _assertJs = _interopRequireDefault(require("assert-js"));

/**
 * @description Function to generate link for ETH and/or ERC20
 * @param {String} claimHost Claim page host
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expirationTime Link expiration timestamp
 */
var generateLink =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var claimHost, signingKeyOrWallet, linkdropModuleAddress, weiAmount, tokenAddress, tokenAmount, expirationTime, _ref3, linkKey, linkId, linkdropSignerSignature, url;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            claimHost = _ref.claimHost, signingKeyOrWallet = _ref.signingKeyOrWallet, linkdropModuleAddress = _ref.linkdropModuleAddress, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime;

            if (!(claimHost == null || claimHost === '')) {
              _context.next = 3;
              break;
            }

            throw new Error('claimHost param is required');

          case 3:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context.next = 5;
              break;
            }

            throw new Error('signingKeyOrWallet param is required');

          case 5:
            if (!(linkdropModuleAddress == null || linkdropModuleAddress === '')) {
              _context.next = 7;
              break;
            }

            throw new Error('linkdropModuleAddress param is required');

          case 7:
            if (!(weiAmount == null || weiAmount === '')) {
              _context.next = 9;
              break;
            }

            throw new Error('weiAmount param is required');

          case 9:
            if (!(tokenAddress == null || tokenAddress === '')) {
              _context.next = 11;
              break;
            }

            throw new Error('tokenAddress param is required');

          case 11:
            if (!(tokenAmount == null || tokenAmount === '')) {
              _context.next = 13;
              break;
            }

            throw new Error('tokenAmount param is required');

          case 13:
            if (!(expirationTime == null || expirationTime === '')) {
              _context.next = 15;
              break;
            }

            throw new Error('expirationTime param is required');

          case 15:
            _context.next = 17;
            return (0, _utils.createLink)({
              signingKeyOrWallet: signingKeyOrWallet,
              linkdropModuleAddress: linkdropModuleAddress,
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime
            });

          case 17:
            _ref3 = _context.sent;
            linkKey = _ref3.linkKey;
            linkId = _ref3.linkId;
            linkdropSignerSignature = _ref3.linkdropSignerSignature;
            // Construct url
            url = "".concat(claimHost, "/#/receive?linkdropModuleAddress=").concat(linkdropModuleAddress, "&weiAmount=").concat(weiAmount, "&tokenAddress=").concat(tokenAddress, "&tokenAmount=").concat(tokenAmount, "&expirationTime=").concat(expirationTime, "&linkKey=").concat(linkKey, "&linkdropSignerSignature=").concat(linkdropSignerSignature);
            return _context.abrupt("return", {
              url: url,
              linkId: linkId,
              linkKey: linkKey,
              linkdropSignerSignature: linkdropSignerSignature
            });

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function generateLink(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description Function to generate link for ETH and/or ERC721
 * @param {String} claimHost Claim page host
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress NFT address
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 */


exports.generateLink = generateLink;

var generateLinkERC721 =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref4) {
    var claimHost, signingKeyOrWallet, linkdropModuleAddress, weiAmount, nftAddress, tokenId, expirationTime, _ref6, linkKey, linkId, linkdropSignerSignature, url;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            claimHost = _ref4.claimHost, signingKeyOrWallet = _ref4.signingKeyOrWallet, linkdropModuleAddress = _ref4.linkdropModuleAddress, weiAmount = _ref4.weiAmount, nftAddress = _ref4.nftAddress, tokenId = _ref4.tokenId, expirationTime = _ref4.expirationTime;

            if (!(claimHost == null || claimHost === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error('claimHost param is required');

          case 3:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error('signingKeyOrWallet param is required');

          case 5:
            if (!(linkdropModuleAddress == null || linkdropModuleAddress === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error('linkdropModuleAddress param is required');

          case 7:
            if (!(weiAmount == null || weiAmount === '')) {
              _context2.next = 9;
              break;
            }

            throw new Error('weiAmount param is required');

          case 9:
            if (!(nftAddress == null || nftAddress === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error('nftAddress param is required');

          case 11:
            if (!(tokenId == null || tokenId === '')) {
              _context2.next = 13;
              break;
            }

            throw new Error('tokenId param is required');

          case 13:
            if (!(expirationTime == null || expirationTime === '')) {
              _context2.next = 15;
              break;
            }

            throw new Error('expirationTime param is required');

          case 15:
            _context2.next = 17;
            return (0, _utils.createLinkERC721)({
              signingKeyOrWallet: signingKeyOrWallet,
              linkdropModuleAddress: linkdropModuleAddress,
              weiAmount: weiAmount,
              nftAddress: nftAddress,
              tokenId: tokenId,
              expirationTime: expirationTime
            });

          case 17:
            _ref6 = _context2.sent;
            linkKey = _ref6.linkKey;
            linkId = _ref6.linkId;
            linkdropSignerSignature = _ref6.linkdropSignerSignature;
            // Construct url
            url = "".concat(claimHost, "/#/receive?linkdropModuleAddress=").concat(linkdropModuleAddress, "&weiAmount=").concat(weiAmount, "&nftAddress=").concat(nftAddress, "&tokenId=").concat(tokenId, "&expirationTime=").concat(expirationTime, "&linkKey=").concat(linkKey, "&linkdropSignerSignature=").concat(linkdropSignerSignature);
            return _context2.abrupt("return", {
              url: url,
              linkId: linkId,
              linkKey: linkKey,
              linkdropSignerSignature: linkdropSignerSignature
            });

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function generateLinkERC721(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.generateLinkERC721 = generateLinkERC721;