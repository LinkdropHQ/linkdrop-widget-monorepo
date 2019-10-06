"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signReceiverAddress = exports.createLinkERC721 = exports.createLink = exports.buildCreate2Address = exports.getParamFromTxEvent = exports.encodeDataForMultiSend = exports.encodeParams = exports.encodeDataForCreateAndAddModules = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _ethers = require("ethers");

var util = _interopRequireWildcard(require("ethereumjs-util"));

var abi = _interopRequireWildcard(require("ethereumjs-abi"));

/**
 * Function to get encoded data to use in CreateAndAddModules library
 * @param {String} dataArray Data array concatenated
 */
var encodeDataForCreateAndAddModules = function encodeDataForCreateAndAddModules(dataArray) {
  var moduleDataWrapper = new _ethers.ethers.utils.Interface(['function setup(bytes data)']); // Remove method id (10) and position of data in payload (64)

  return dataArray.reduce(function (acc, data) {
    return acc + moduleDataWrapper.functions.setup.encode([data]).substr(74);
  }, '0x');
};
/**
 * @dev Function to get encoded params data from contract abi
 * @param {Object} abi Contract abi
 * @param {String} method Function name
 * @param {Array<T>} params Array of function params to be encoded
 * @return Encoded params data
 */


exports.encodeDataForCreateAndAddModules = encodeDataForCreateAndAddModules;

var encodeParams = function encodeParams(abi, method, params) {
  return new _ethers.ethers.utils.Interface(abi).functions[method].encode((0, _toConsumableArray2["default"])(params));
}; // export const encodeDataForMultiSend = (operation, to, value, data) => {
//   const dataBuffer = Buffer.from(util.stripHexPrefix(data), 'hex')
//   const encoded = abi.solidityPack(
//     ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
//     [operation, to, value, dataBuffer.length, dataBuffer]
//   )
//   return encoded.toString('hex')
// }

/**
 * Function to get encoded data to use in MultiSend library
 * @param {String} operation
 * @param {String} to
 * @param {String} value
 * @param {String} data
 */


exports.encodeParams = encodeParams;

var encodeDataForMultiSend = function encodeDataForMultiSend(operation, to, value, data) {
  var transactionWrapper = new _ethers.ethers.utils.Interface(['function send(uint8 operation, address to, uint256 value, bytes data)']);
  return transactionWrapper.functions.send.encode([operation, to, value, data]).substr(10);
};
/**
 * Function to get specific param from transaction event
 * @param {Object} tx Transaction object compatible with ethers.js library
 * @param {String} eventName Event name to parse param from
 * @param {String} paramName Parameter to be retrieved from event log
 * @param {Object} contract Contract instance compatible with ethers.js library
 * @return {String} Parameter parsed from transaction event
 */


exports.encodeDataForMultiSend = encodeDataForMultiSend;

var getParamFromTxEvent =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tx, eventName, paramName, contract) {
    var provider, txReceipt, topic, logs, param;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            provider = contract.provider;
            _context.next = 3;
            return provider.getTransactionReceipt(tx.hash);

          case 3:
            txReceipt = _context.sent;
            topic = contract["interface"].events[eventName].topic;
            logs = txReceipt.logs;
            logs = logs.filter(function (l) {
              return l.address === contract.address && l.topics[0] === topic;
            });
            param = contract["interface"].events[eventName].decode(logs[0].data)[paramName];
            return _context.abrupt("return", param);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getParamFromTxEvent(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.getParamFromTxEvent = getParamFromTxEvent;

var buildCreate2Address = function buildCreate2Address(creatorAddress, saltHex, byteCode) {
  var byteCodeHash = _ethers.ethers.utils.keccak256(byteCode);

  return "0x".concat(_ethers.ethers.utils.keccak256("0x".concat(['ff', creatorAddress, saltHex, byteCodeHash].map(function (x) {
    return x.replace(/0x/, '');
  }).join(''))).slice(-40)).toLowerCase();
};
/**
 * @description Function to create link for ETH and/or ERC20
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {String} tokenAmount Amount of tokens
 * @param {String} expirationTime Link expiration timestamp
 * @return {Object}
 */


exports.buildCreate2Address = buildCreate2Address;

var createLink =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref2) {
    var signingKeyOrWallet, linkdropModuleAddress, weiAmount, tokenAddress, tokenAmount, expirationTime, linkWallet, linkKey, linkId, linkdropSignerSignature;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            signingKeyOrWallet = _ref2.signingKeyOrWallet, linkdropModuleAddress = _ref2.linkdropModuleAddress, weiAmount = _ref2.weiAmount, tokenAddress = _ref2.tokenAddress, tokenAmount = _ref2.tokenAmount, expirationTime = _ref2.expirationTime;
            linkWallet = _ethers.ethers.Wallet.createRandom();
            linkKey = linkWallet.privateKey;
            linkId = linkWallet.address;
            _context2.next = 6;
            return signLink({
              signingKeyOrWallet: signingKeyOrWallet,
              linkdropModuleAddress: linkdropModuleAddress,
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              linkId: linkId
            });

          case 6:
            linkdropSignerSignature = _context2.sent;
            return _context2.abrupt("return", {
              linkKey: linkKey,
              // link's ephemeral private key
              linkId: linkId,
              // address corresponding to link key
              linkdropSignerSignature: linkdropSignerSignature // signed by linkdrop signer

            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createLink(_x5) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @description Function to sign link
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Amount of wei
 * @param {String} tokenAddress Address of token contract
 * @param {String} tokenAmount Amount of tokens
 * @param {String} expirationTime Link expiration timestamp
 * @param {String} linkId Link id
 * @return {String} signature
 */


exports.createLink = createLink;

var signLink =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(_ref4) {
    var signingKeyOrWallet, linkdropModuleAddress, weiAmount, tokenAddress, tokenAmount, expirationTime, linkId, messageHash, messageHashToSign;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            signingKeyOrWallet = _ref4.signingKeyOrWallet, linkdropModuleAddress = _ref4.linkdropModuleAddress, weiAmount = _ref4.weiAmount, tokenAddress = _ref4.tokenAddress, tokenAmount = _ref4.tokenAmount, expirationTime = _ref4.expirationTime, linkId = _ref4.linkId;

            if (typeof signingKeyOrWallet === 'string') {
              signingKeyOrWallet = new _ethers.ethers.Wallet(signingKeyOrWallet);
            }

            messageHash = _ethers.ethers.utils.solidityKeccak256(['address', 'uint', 'address', 'uint', 'uint', 'address'], [linkdropModuleAddress, weiAmount, tokenAddress, tokenAmount, expirationTime, linkId]);
            messageHashToSign = _ethers.ethers.utils.arrayify(messageHash);
            return _context3.abrupt("return", signingKeyOrWallet.signMessage(messageHashToSign));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function signLink(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @description Function to create link for ETH and/or ERC721
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress NFT address
 * @param {String} tokenId Token id
 * @param {String} expirationTime Link expiration timestamp
 * @return {Object}
 */


var createLinkERC721 =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(_ref6) {
    var signingKeyOrWallet, linkdropModuleAddress, weiAmount, nftAddress, tokenId, expirationTime, linkWallet, linkKey, linkId, linkdropSignerSignature;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            signingKeyOrWallet = _ref6.signingKeyOrWallet, linkdropModuleAddress = _ref6.linkdropModuleAddress, weiAmount = _ref6.weiAmount, nftAddress = _ref6.nftAddress, tokenId = _ref6.tokenId, expirationTime = _ref6.expirationTime;
            linkWallet = _ethers.ethers.Wallet.createRandom();
            linkKey = linkWallet.privateKey;
            linkId = linkWallet.address;
            _context4.next = 6;
            return signLinkERC721({
              signingKeyOrWallet: signingKeyOrWallet,
              linkdropModuleAddress: linkdropModuleAddress,
              weiAmount: weiAmount,
              nftAddress: nftAddress,
              tokenId: tokenId,
              expirationTime: expirationTime,
              linkId: linkId
            });

          case 6:
            linkdropSignerSignature = _context4.sent;
            return _context4.abrupt("return", {
              linkKey: linkKey,
              // link's ephemeral private key
              linkId: linkId,
              // address corresponding to link key
              linkdropSignerSignature: linkdropSignerSignature // signed by linkdrop signer

            });

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createLinkERC721(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @description Function to sign link for ERC721
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Amount of wei
 * @param {String} nftAddresss Address of NFT
 * @param {String} tokenId Token id
 * @param {String} expirationTime Link expiration timestamp
 * @param {String} linkId Link id
 * @return {String} signature
 */


exports.createLinkERC721 = createLinkERC721;

var signLinkERC721 =
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(_ref8) {
    var signingKeyOrWallet, linkdropModuleAddress, weiAmount, nftAddress, tokenId, expirationTime, linkId, messageHash, messageHashToSign;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            signingKeyOrWallet = _ref8.signingKeyOrWallet, linkdropModuleAddress = _ref8.linkdropModuleAddress, weiAmount = _ref8.weiAmount, nftAddress = _ref8.nftAddress, tokenId = _ref8.tokenId, expirationTime = _ref8.expirationTime, linkId = _ref8.linkId;

            if (typeof signingKeyOrWallet === 'string') {
              signingKeyOrWallet = new _ethers.ethers.Wallet(signingKeyOrWallet);
            }

            messageHash = _ethers.ethers.utils.solidityKeccak256(['address', 'uint', 'address', 'uint', 'uint', 'address'], [linkdropModuleAddress, weiAmount, nftAddress, tokenId, expirationTime, linkId]);
            messageHashToSign = _ethers.ethers.utils.arrayify(messageHash);
            return _context5.abrupt("return", signingKeyOrWallet.signMessage(messageHashToSign));

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function signLinkERC721(_x8) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @description Function to sign receiver address
 * @param {String} linkKey Ephemeral key attached to link
 * @param {String} receiverAddress Receiver address
 */


var signReceiverAddress =
/*#__PURE__*/
function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(linkKey, receiverAddress) {
    var wallet, messageHash, messageHashToSign;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            wallet = new _ethers.ethers.Wallet(linkKey);
            messageHash = _ethers.ethers.utils.solidityKeccak256(['address'], [receiverAddress]);
            messageHashToSign = _ethers.ethers.utils.arrayify(messageHash);
            return _context6.abrupt("return", wallet.signMessage(messageHashToSign));

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function signReceiverAddress(_x9, _x10) {
    return _ref10.apply(this, arguments);
  };
}();

exports.signReceiverAddress = signReceiverAddress;