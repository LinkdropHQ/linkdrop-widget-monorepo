"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ethers = require("ethers");

var _utils = require("./utils");

var _computeSafeAddress2 = require("./computeSafeAddress");

var _computeLinkdropModuleAddress2 = require("./computeLinkdropModuleAddress");

var _computeRecoveryModuleAddress2 = require("./computeRecoveryModuleAddress");

var _create3 = require("./create");

var _claimAndCreate3 = require("./claimAndCreate");

var _claimAndCreateERC3 = require("./claimAndCreateERC721");

var _claimAndCreateP2P3 = require("./claimAndCreateP2P");

var _claimAndCreateERC721P2P3 = require("./claimAndCreateERC721P2P");

var _signTx2 = require("./signTx");

var _executeTx3 = require("./executeTx");

var _ensUtils = require("./ensUtils");

var _generateLink3 = require("./generateLink");

var _claim3 = require("./claim");

var _linkdropModuleUtils = require("./linkdropModuleUtils");

var _accounts = require("./accounts");

var cryptoUtils = _interopRequireWildcard(require("./cryptoUtils"));

var ADDRESS_ZERO = _ethers.ethers.constants.AddressZero;
var BYTES_ZERO = '0x';

var WalletSDK =
/*#__PURE__*/
function () {
  function WalletSDK(_ref) {
    var _ref$chain = _ref.chain,
        chain = _ref$chain === void 0 ? 'rinkeby' : _ref$chain,
        _ref$apiHost = _ref.apiHost,
        apiHost = _ref$apiHost === void 0 ? "https://".concat(chain, "-wallet-api.linkdrop.io") : _ref$apiHost,
        _ref$claimHost = _ref.claimHost,
        claimHost = _ref$claimHost === void 0 ? 'https://claim.linkdrop.io' : _ref$claimHost,
        jsonRpcUrl = _ref.jsonRpcUrl,
        _ref$gnosisSafeMaster = _ref.gnosisSafeMasterCopy,
        gnosisSafeMasterCopy = _ref$gnosisSafeMaster === void 0 ? '0xB945Bd4b447aF21C5B55eF859242829FBDc0bF0A' : _ref$gnosisSafeMaster,
        _ref$proxyFactory = _ref.proxyFactory,
        proxyFactory = _ref$proxyFactory === void 0 ? '0x12302fE9c02ff50939BaAaaf415fc226C078613C' : _ref$proxyFactory,
        _ref$linkdropModuleMa = _ref.linkdropModuleMasterCopy,
        linkdropModuleMasterCopy = _ref$linkdropModuleMa === void 0 ? '0xFBaD822d2E2710EEe31DC3298a8866ebaaBd9328' : _ref$linkdropModuleMa,
        _ref$createAndAddModu = _ref.createAndAddModules,
        createAndAddModules = _ref$createAndAddModu === void 0 ? '0x1a56aE690ab0818aF5cA349b7D21f1d7e76a3d36' : _ref$createAndAddModu,
        _ref$multiSend = _ref.multiSend,
        multiSend = _ref$multiSend === void 0 ? '0xD4B7B161E4779629C2717385114Bf78D612aEa72' : _ref$multiSend,
        _ref$recoveryModuleMa = _ref.recoveryModuleMasterCopy,
        recoveryModuleMasterCopy = _ref$recoveryModuleMa === void 0 ? '0xD3FaECC16097E96986F868220185F6470A3F1eA9' : _ref$recoveryModuleMa,
        _ref$recoveryPeriod = _ref.recoveryPeriod,
        recoveryPeriod = _ref$recoveryPeriod === void 0 ? '259200' : _ref$recoveryPeriod,
        _ref$ensAddress = _ref.ensAddress,
        ensAddress = _ref$ensAddress === void 0 ? (0, _ensUtils.getEnsAddress)(chain) : _ref$ensAddress,
        _ref$ensDomain = _ref.ensDomain,
        ensDomain = _ref$ensDomain === void 0 ? 'linkdrop.test' : _ref$ensDomain,
        _ref$guardian = _ref.guardian,
        guardian = _ref$guardian === void 0 ? '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A' : _ref$guardian,
        _ref$linkdropFactory = _ref.linkdropFactory,
        linkdropFactory = _ref$linkdropFactory === void 0 ? '0xBa051891B752ecE3670671812486fe8dd34CC1c8' : _ref$linkdropFactory;
    (0, _classCallCheck2["default"])(this, WalletSDK);
    this.chain = chain;
    this.jsonRpcUrl = jsonRpcUrl || "https://".concat(chain, ".infura.io/v3/ecd43c9cd96e45ceb9131fba9b100b07");
    this.apiHost = apiHost;
    this.claimHost = claimHost;
    this.gnosisSafeMasterCopy = gnosisSafeMasterCopy;
    this.proxyFactory = proxyFactory;
    this.linkdropModuleMasterCopy = linkdropModuleMasterCopy;
    this.createAndAddModules = createAndAddModules;
    this.multiSend = multiSend;
    this.recoveryModuleMasterCopy = recoveryModuleMasterCopy;
    this.recoveryPeriod = recoveryPeriod;
    this.ensAddress = ensAddress;
    this.ensDomain = ensDomain;
    this.guardian = guardian;
    this.linkdropFactory = linkdropFactory;
    this.cryptoUtils = cryptoUtils;
  }
  /**
   * @dev Function to get encoded params data from contract abi
   * @param {Object} abi Contract abi
   * @param {String} method Function name
   * @param {Array<T>} params Array of function params to be encoded
   * @return Encoded params data
   */


  (0, _createClass2["default"])(WalletSDK, [{
    key: "encodeParams",
    value: function encodeParams(abi, method, params) {
      return (0, _utils.encodeParams)(abi, method, params);
    }
    /**
     * Function to get encoded data to use in MultiSend library
     * @param {Number} operation
     * @param {String} to
     * @param {Number} value
     * @param {String} data
     */

  }, {
    key: "encodeDataForMultiSend",
    value: function encodeDataForMultiSend(operation, to, value, data) {
      return (0, _utils.encodeDataForMultiSend)(operation, to, value, data);
    }
    /**
     * Function to get specific param from transaction event
     * @param {Object} tx Transaction object compatible with ethers.js library
     * @param {String} eventName Event name to parse param from
     * @param {String} paramName Parameter to be retrieved from event log
     * @param {Object} contract Contract instance compatible with ethers.js library
     * @return {String} Parameter parsed from transaction event
     */

  }, {
    key: "getParamFromTxEvent",
    value: function () {
      var _getParamFromTxEvent2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(tx, eventName, paramName, contract) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", (0, _utils.getParamFromTxEvent)(tx, eventName, paramName, contract));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getParamFromTxEvent(_x, _x2, _x3, _x4) {
        return _getParamFromTxEvent2.apply(this, arguments);
      }

      return getParamFromTxEvent;
    }()
    /**
     * Function to calculate the safe address based on given params
     * @param {String} owner Safe's owner
     * @param {String} to To (optional)
     * @param {String} data Data (optional)
     * @param {String} paymentToken Payment token (0x0 for ether) (optional)
     * @param {String} paymentAmount Payment amount (optional)
     * @param {String} paymentReceiver Payment receiver (optional)
     */

  }, {
    key: "computeSafeAddress",
    value: function computeSafeAddress(_ref2) {
      var owner = _ref2.owner,
          _ref2$to = _ref2.to,
          to = _ref2$to === void 0 ? ADDRESS_ZERO : _ref2$to,
          _ref2$data = _ref2.data,
          data = _ref2$data === void 0 ? BYTES_ZERO : _ref2$data,
          _ref2$paymentToken = _ref2.paymentToken,
          paymentToken = _ref2$paymentToken === void 0 ? ADDRESS_ZERO : _ref2$paymentToken,
          _ref2$paymentAmount = _ref2.paymentAmount,
          paymentAmount = _ref2$paymentAmount === void 0 ? 0 : _ref2$paymentAmount,
          _ref2$paymentReceiver = _ref2.paymentReceiver,
          paymentReceiver = _ref2$paymentReceiver === void 0 ? ADDRESS_ZERO : _ref2$paymentReceiver;
      return (0, _computeSafeAddress2.computeSafeAddress)({
        owner: owner,
        saltNonce: owner,
        deployer: this.proxyFactory,
        gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
        to: to,
        data: data,
        paymentToken: paymentToken,
        paymentAmount: paymentAmount,
        paymentReceiver: paymentReceiver
      });
    }
    /**
     * Function to execute safe transaction
     * @param {String} safe Safe address
     * @param {String} privateKey Safe owner's private key
     * @param {String} to To
     * @param {Number} value Value
     * @param {String} data Data (optional)
     * @param {Number} operation Operation (optional)
     * @param {Number} safeTxGas Safe tx gas (optional)
     * @param {Number} baseGas Base gas (optional)
     * @param {Number} gasPrice Gas price (optional)
     * @param {String} gasToken Gas token (optional)
     * @param {String} refundReceiver Refund receiver (optional)
     * @param {String} apiHost API host (optional)
     * @param {String} jsonRpcUrl JSON RPC URL (optional)
     * @returns {Object} {success, txHash, errors}
     */

  }, {
    key: "executeTx",
    value: function () {
      var _executeTx2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref3) {
        var safe, privateKey, to, value, _ref3$data, data, _ref3$operation, operation, _ref3$gasToken, gasToken, _ref3$refundReceiver, refundReceiver, _ref3$apiHost, apiHost, _ref3$jsonRpcUrl, jsonRpcUrl;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                safe = _ref3.safe, privateKey = _ref3.privateKey, to = _ref3.to, value = _ref3.value, _ref3$data = _ref3.data, data = _ref3$data === void 0 ? '0x' : _ref3$data, _ref3$operation = _ref3.operation, operation = _ref3$operation === void 0 ? 0 : _ref3$operation, _ref3$gasToken = _ref3.gasToken, gasToken = _ref3$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref3$gasToken, _ref3$refundReceiver = _ref3.refundReceiver, refundReceiver = _ref3$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref3$refundReceiver, _ref3$apiHost = _ref3.apiHost, apiHost = _ref3$apiHost === void 0 ? this.apiHost : _ref3$apiHost, _ref3$jsonRpcUrl = _ref3.jsonRpcUrl, jsonRpcUrl = _ref3$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref3$jsonRpcUrl;
                return _context2.abrupt("return", (0, _executeTx3.executeTx)({
                  apiHost: apiHost,
                  jsonRpcUrl: jsonRpcUrl,
                  safe: safe,
                  privateKey: privateKey,
                  to: to,
                  value: value,
                  data: data,
                  operation: operation,
                  gasToken: gasToken,
                  refundReceiver: refundReceiver
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function executeTx(_x5) {
        return _executeTx2.apply(this, arguments);
      }

      return executeTx;
    }()
    /**
     * Function to sign safe transaction
     * @param {String} safe Safe address
     * @param {String} privateKey Safe owner's private key
     * @param {String} to To
     * @param {Number} value Value
     * @param {String} data Data (optional)
     * @param {Number} operation Operation (optional)
     * @param {Number} safeTxGas Safe tx gas (optional)
     * @param {Number} baseGas Base gas (optional)
     * @param {Number} gasPrice Gas price (optional)
     * @param {String} gasToken Gas token (optional)
     * @param {String} refundReceiver Refund receiver (optional)
     * @param {Number} nonce Safe's nonce
     * @returns {String} Signature
     */

  }, {
    key: "signTx",
    value: function signTx(_ref4) {
      var safe = _ref4.safe,
          privateKey = _ref4.privateKey,
          to = _ref4.to,
          value = _ref4.value,
          _ref4$data = _ref4.data,
          data = _ref4$data === void 0 ? '0x' : _ref4$data,
          _ref4$operation = _ref4.operation,
          operation = _ref4$operation === void 0 ? 0 : _ref4$operation,
          _ref4$safeTxGas = _ref4.safeTxGas,
          safeTxGas = _ref4$safeTxGas === void 0 ? 0 : _ref4$safeTxGas,
          _ref4$baseGas = _ref4.baseGas,
          baseGas = _ref4$baseGas === void 0 ? 0 : _ref4$baseGas,
          _ref4$gasPrice = _ref4.gasPrice,
          gasPrice = _ref4$gasPrice === void 0 ? 0 : _ref4$gasPrice,
          _ref4$gasToken = _ref4.gasToken,
          gasToken = _ref4$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref4$gasToken,
          _ref4$refundReceiver = _ref4.refundReceiver,
          refundReceiver = _ref4$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref4$refundReceiver,
          nonce = _ref4.nonce;
      return (0, _signTx2.signTx)({
        safe: safe,
        privateKey: privateKey,
        to: to,
        value: value,
        data: data,
        operation: operation,
        safeTxGas: safeTxGas,
        baseGas: baseGas,
        gasPrice: gasPrice,
        gasToken: gasToken,
        refundReceiver: refundReceiver,
        nonce: nonce
      });
    }
    /**
     * Function to get owner of ENS identifier
     * @param {String} ensName ENS name (e.g 'alice')
     * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth') (optional)
     * @param {String} ensAddress ENS address (optional)
     * @param {String} jsonRpcUrl JSON RPC URL (optional)
     * @return {String} ENS identifier owner's address
     */

  }, {
    key: "getEnsOwner",
    value: function () {
      var _getEnsOwner2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref5) {
        var ensName, _ref5$ensDomain, ensDomain, _ref5$ensAddress, ensAddress, _ref5$jsonRpcUrl, jsonRpcUrl;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                ensName = _ref5.ensName, _ref5$ensDomain = _ref5.ensDomain, ensDomain = _ref5$ensDomain === void 0 ? this.ensDomain : _ref5$ensDomain, _ref5$ensAddress = _ref5.ensAddress, ensAddress = _ref5$ensAddress === void 0 ? this.ensAddress : _ref5$ensAddress, _ref5$jsonRpcUrl = _ref5.jsonRpcUrl, jsonRpcUrl = _ref5$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref5$jsonRpcUrl;
                return _context3.abrupt("return", (0, _ensUtils.getEnsOwner)({
                  ensName: ensName,
                  ensDomain: ensDomain,
                  ensAddress: ensAddress,
                  jsonRpcUrl: jsonRpcUrl
                }));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getEnsOwner(_x6) {
        return _getEnsOwner2.apply(this, arguments);
      }

      return getEnsOwner;
    }()
    /**
     * @param {String} privateKey Owner's private key
     * @param {String} ensName Ens name
      * @param {String} gasPrice Gas price in wei
     * @param {String} email Email
      */

  }, {
    key: "create",
    value: function () {
      var _create2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref6) {
        var privateKey, gasPrice, email, ensName;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                privateKey = _ref6.privateKey, gasPrice = _ref6.gasPrice, email = _ref6.email, ensName = _ref6.ensName;
                return _context4.abrupt("return", (0, _create3.create)({
                  privateKey: privateKey,
                  ensName: ensName,
                  gasPrice: gasPrice,
                  email: email,
                  saltNonce: new _ethers.ethers.Wallet(privateKey).address,
                  recoveryPeriod: this.recoveryPeriod,
                  guardian: this.guardian,
                  ensAddress: this.ensAddress,
                  ensDomain: this.ensDomain,
                  gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
                  proxyFactory: this.proxyFactory,
                  linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
                  recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
                  multiSend: this.multiSend,
                  createAndAddModules: this.createAndAddModules,
                  jsonRpcUrl: this.jsonRpcUrl,
                  apiHost: this.apiHost
                }));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function create(_x7) {
        return _create2.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Function to create new safe and claim linkdrop
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {String} tokenAmount Token amount
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key assigned to link
     * @param {String} linkdropMasterAddress Linkdrop master address
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} campaignId Campaign id
     * @param {String} privateKey Safe owner's private key
     * @param {String} gasPrice Gas price in wei
     * @param {String} ensName ENS name (e.g. 'alice')
     * @param {String} email Email
     * @returns {Object} {success, txHash,safe, linkdropModule, recoveryModule, errors}
     */

  }, {
    key: "claimAndCreate",
    value: function () {
      var _claimAndCreate2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref7) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, ensName, email, privateKey, gasPrice;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                weiAmount = _ref7.weiAmount, tokenAddress = _ref7.tokenAddress, tokenAmount = _ref7.tokenAmount, expirationTime = _ref7.expirationTime, linkKey = _ref7.linkKey, linkdropMasterAddress = _ref7.linkdropMasterAddress, linkdropSignerSignature = _ref7.linkdropSignerSignature, campaignId = _ref7.campaignId, ensName = _ref7.ensName, email = _ref7.email, privateKey = _ref7.privateKey, gasPrice = _ref7.gasPrice;
                return _context5.abrupt("return", (0, _claimAndCreate3.claimAndCreate)({
                  weiAmount: weiAmount,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropMasterAddress: linkdropMasterAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  campaignId: campaignId,
                  saltNonce: new _ethers.ethers.Wallet(privateKey).address,
                  ensName: ensName,
                  gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
                  proxyFactory: this.proxyFactory,
                  linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
                  createAndAddModules: this.createAndAddModules,
                  multiSend: this.multiSend,
                  apiHost: this.apiHost,
                  guardian: this.guardian,
                  recoveryPeriod: this.recoveryPeriod,
                  recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
                  ensDomain: this.ensDomain,
                  ensAddress: this.ensAddress,
                  jsonRpcUrl: this.jsonRpcUrl,
                  email: email,
                  privateKey: privateKey,
                  gasPrice: gasPrice
                }));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function claimAndCreate(_x8) {
        return _claimAndCreate2.apply(this, arguments);
      }

      return claimAndCreate;
    }()
    /**
     * Function to create new safe and claim ERC721 linkdrop
     * @param {String} weiAmount Wei amount
     * @param {String} nftAddress Nft address
     * @param {String} tokenId Token id
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key assigned to link
     * @param {String} linkdropMasterAddress Linkdrop master address
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} campaignId Campaign id
     * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
     * @param {String} proxyFactory Deployed proxy factory address
     * @param {String} privateKey Safe owner's private key
     * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address
     * @param {String} createAndAddModules Deployed createAndAddModules library address
     * @param {String} multiSend Deployed multiSend library address
     * @param {String} apiHost API host
     * @param {String} saltNonce Random salt nonce
     * @param {String} guardian Guardian address
     * @param {String} recoveryPeriod Recovery period
     * @param {String} recoveryModuleMasterCopy Deployed recovery moduel mastercopy address
     * @param {String} ensName ENS name (e.g. 'alice')
     * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth)
     * @param {String} ensAddress ENS address
     * @param {String} jsonRpcUrl JSON RPC URL
     * @param {String} linkdropFactory Deployed linkdrop factory address
     * @param {String} email Email
     * @param {String} gasPrice Gas price in wei
     * @returns {Object} {success, txHash,safe, linkdropModule, recoveryModule, errors}
     */

  }, {
    key: "claimAndCreateERC721",
    value: function () {
      var _claimAndCreateERC2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(_ref8) {
        var weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, privateKey, ensName, email, gasPrice;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                weiAmount = _ref8.weiAmount, nftAddress = _ref8.nftAddress, tokenId = _ref8.tokenId, expirationTime = _ref8.expirationTime, linkKey = _ref8.linkKey, linkdropMasterAddress = _ref8.linkdropMasterAddress, linkdropSignerSignature = _ref8.linkdropSignerSignature, campaignId = _ref8.campaignId, privateKey = _ref8.privateKey, ensName = _ref8.ensName, email = _ref8.email, gasPrice = _ref8.gasPrice;
                return _context6.abrupt("return", (0, _claimAndCreateERC3.claimAndCreateERC721)({
                  weiAmount: weiAmount,
                  nftAddress: nftAddress,
                  tokenId: tokenId,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropMasterAddress: linkdropMasterAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  campaignId: campaignId,
                  saltNonce: new _ethers.ethers.Wallet(privateKey).address,
                  ensName: ensName,
                  gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
                  proxyFactory: this.proxyFactory,
                  linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
                  createAndAddModules: this.createAndAddModules,
                  multiSend: this.multiSend,
                  apiHost: this.apiHost,
                  guardian: this.guardian,
                  recoveryPeriod: this.recoveryPeriod,
                  recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
                  ensDomain: this.ensDomain,
                  ensAddress: this.ensAddress,
                  jsonRpcUrl: this.jsonRpcUrl,
                  linkdropFactory: this.linkdropFactory,
                  email: email,
                  privateKey: privateKey,
                  gasPrice: gasPrice
                }));

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function claimAndCreateERC721(_x9) {
        return _claimAndCreateERC2.apply(this, arguments);
      }

      return claimAndCreateERC721;
    }()
    /**
     * Function to create new safe and claim linkdrop
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {String} tokenAmount Token amount
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key assigned to link
     * @param {String} linkdropModuleAddress Linkdrop module address
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} privateKey Safe owner's private key
     * @param {String} gasPrice Gas price in wei
     * @param {String} ensName ENS name (e.g. 'alice')
     * @param {String} email Email
     * @returns {Object} {success, txHash,safe, linkdropModule, recoveryModule, errors}
     */

  }, {
    key: "claimAndCreateP2P",
    value: function () {
      var _claimAndCreateP2P2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(_ref9) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, ensName, email, privateKey, gasPrice;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                weiAmount = _ref9.weiAmount, tokenAddress = _ref9.tokenAddress, tokenAmount = _ref9.tokenAmount, expirationTime = _ref9.expirationTime, linkKey = _ref9.linkKey, linkdropModuleAddress = _ref9.linkdropModuleAddress, linkdropSignerSignature = _ref9.linkdropSignerSignature, ensName = _ref9.ensName, email = _ref9.email, privateKey = _ref9.privateKey, gasPrice = _ref9.gasPrice;
                return _context7.abrupt("return", (0, _claimAndCreateP2P3.claimAndCreateP2P)({
                  weiAmount: weiAmount,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropModuleAddress: linkdropModuleAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  saltNonce: new _ethers.ethers.Wallet(privateKey).address,
                  ensName: ensName,
                  gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
                  proxyFactory: this.proxyFactory,
                  linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
                  createAndAddModules: this.createAndAddModules,
                  multiSend: this.multiSend,
                  apiHost: this.apiHost,
                  guardian: this.guardian,
                  recoveryPeriod: this.recoveryPeriod,
                  recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
                  ensDomain: this.ensDomain,
                  ensAddress: this.ensAddress,
                  jsonRpcUrl: this.jsonRpcUrl,
                  email: email,
                  privateKey: privateKey,
                  gasPrice: gasPrice
                }));

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function claimAndCreateP2P(_x10) {
        return _claimAndCreateP2P2.apply(this, arguments);
      }

      return claimAndCreateP2P;
    }()
    /**
     * Function to create new safe and claim linkdrop
     * @param {String} weiAmount Wei amount
     * @param {String} nftAddress Nft address
     * @param {String} tokenId Token id
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key assigned to link
     * @param {String} linkdropModuleAddress Linkdrop module address
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} privateKey Safe owner's private key
     * @param {String} gasPrice Gas price in wei
     * @param {String} ensName ENS name (e.g. 'alice')
     * @param {String} email Email
     * @returns {Object} {success, txHash,safe, linkdropModule, recoveryModule, errors}
     */

  }, {
    key: "claimAndCreateERC721P2P",
    value: function () {
      var _claimAndCreateERC721P2P2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(_ref10) {
        var weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, ensName, email, privateKey, gasPrice;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                weiAmount = _ref10.weiAmount, nftAddress = _ref10.nftAddress, tokenId = _ref10.tokenId, expirationTime = _ref10.expirationTime, linkKey = _ref10.linkKey, linkdropModuleAddress = _ref10.linkdropModuleAddress, linkdropSignerSignature = _ref10.linkdropSignerSignature, ensName = _ref10.ensName, email = _ref10.email, privateKey = _ref10.privateKey, gasPrice = _ref10.gasPrice;
                return _context8.abrupt("return", (0, _claimAndCreateERC721P2P3.claimAndCreateERC721P2P)({
                  weiAmount: weiAmount,
                  nftAddress: nftAddress,
                  tokenId: tokenId,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropModuleAddress: linkdropModuleAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  saltNonce: new _ethers.ethers.Wallet(privateKey).address,
                  ensName: ensName,
                  gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
                  proxyFactory: this.proxyFactory,
                  linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
                  createAndAddModules: this.createAndAddModules,
                  multiSend: this.multiSend,
                  apiHost: this.apiHost,
                  guardian: this.guardian,
                  recoveryPeriod: this.recoveryPeriod,
                  recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
                  ensDomain: this.ensDomain,
                  ensAddress: this.ensAddress,
                  jsonRpcUrl: this.jsonRpcUrl,
                  email: email,
                  privateKey: privateKey,
                  gasPrice: gasPrice
                }));

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function claimAndCreateERC721P2P(_x11) {
        return _claimAndCreateERC721P2P2.apply(this, arguments);
      }

      return claimAndCreateERC721P2P;
    }()
    /**
     * Function to precompute Safe address with specific params and gas price 0
     * @param {String} owner Safe owner address
     * @returns {String} safeAddress
     */

  }, {
    key: "precomputeAddress",
    value: function precomputeAddress(_ref11) {
      var owner = _ref11.owner;
      return (0, _computeSafeAddress2.computeSafeAddress)({
        owner: owner,
        saltNonce: owner,
        gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
        deployer: this.proxyFactory,
        to: ADDRESS_ZERO,
        data: '0x',
        paymentAmount: '0'
      });
    }
    /**
     * Precomputes linkdrop module address
     * @param {String} owner Safe owner's address
     * @param {String} safe  Safe wallet address
     */

  }, {
    key: "precomputeLinkdropModuleAddress",
    value: function precomputeLinkdropModuleAddress(owner, safe) {
      return (0, _computeLinkdropModuleAddress2.computeLinkdropModuleAddress)({
        owner: owner,
        saltNonce: owner,
        linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
        deployer: safe
      });
    }
    /**
     * Precomputes recovery module address
     * @param {String} owner Safe owner's address
     * @param {String} safe  Safe wallet address
     */

  }, {
    key: "precomputeRecoveryModuleAddress",
    value: function precomputeRecoveryModuleAddress(owner, safe) {
      return (0, _computeRecoveryModuleAddress2.computeRecoveryModuleAddress)({
        owner: owner,
        saltNonce: owner,
        guardian: this.guardian,
        recoveryPeriod: this.recoveryPeriod,
        recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
        deployer: safe
      });
    }
    /**
     * Function to calculate the linkdrop module address based on given params
     * @param {String} owner Safe owner address
     * @param {String} saltNonce Random salt nonce
     * @param {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
     * @param {String} deployer Deployer address
     */

  }, {
    key: "computeLinkdropModuleAddress",
    value: function computeLinkdropModuleAddress(_ref12) {
      var owner = _ref12.owner,
          saltNonce = _ref12.saltNonce,
          _ref12$linkdropModule = _ref12.linkdropModuleMasterCopy,
          linkdropModuleMasterCopy = _ref12$linkdropModule === void 0 ? this.linkdropModuleMasterCopy : _ref12$linkdropModule,
          _ref12$deployer = _ref12.deployer,
          deployer = _ref12$deployer === void 0 ? this.proxyFactory : _ref12$deployer;
      return (0, _computeLinkdropModuleAddress2.computeLinkdropModuleAddress)({
        owner: owner,
        saltNonce: saltNonce,
        linkdropModuleMasterCopy: linkdropModuleMasterCopy,
        deployer: deployer
      });
    }
    /**
     * Function to calculate the recovery module address based on given params
     * @param {String} guardians Guardian address
     * @param {String} recoveryPeriod Recovery period duration in atomic value (seconds)
     * @param {String} saltNonce Random salt nonce
     * @param {String} recoveryModuleMasterCopy Deployed recovery module mastercopy address
     * @param {String} deployer Deployer address
     */

  }, {
    key: "computeRecoveryModuleAddress",
    value: function computeRecoveryModuleAddress(_ref13) {
      var guardian = _ref13.guardian,
          _ref13$recoveryPeriod = _ref13.recoveryPeriod,
          recoveryPeriod = _ref13$recoveryPeriod === void 0 ? this.recoveryPeriod : _ref13$recoveryPeriod,
          saltNonce = _ref13.saltNonce,
          _ref13$recoveryModule = _ref13.recoveryModuleMasterCopy,
          recoveryModuleMasterCopy = _ref13$recoveryModule === void 0 ? this.recoveryModuleMasterCopy : _ref13$recoveryModule,
          _ref13$deployer = _ref13.deployer,
          deployer = _ref13$deployer === void 0 ? this.proxyFactory : _ref13$deployer;
      return (0, _computeRecoveryModuleAddress2.computeRecoveryModuleAddress)({
        guardian: guardian,
        recoveryPeriod: recoveryPeriod,
        saltNonce: saltNonce,
        recoveryModuleMasterCopy: recoveryModuleMasterCopy,
        deployer: deployer
      });
    }
    /**
     * Function to get encoded data to use in CreateAndAddModules library
     * @param {String} dataArray Data array concatenated
     */

  }, {
    key: "encodeDataForCreateAndAddModules",
    value: function encodeDataForCreateAndAddModules(dataArray) {
      return (0, _utils.encodeDataForCreateAndAddModules)(dataArray);
    }
    /**
     * @description Function to generate link for ETH and/or ERC20
     * @param {String | Object} signingKeyOrWallet Signing key or wallet instances
     * @param {String} linkdropModuleAddress Address of linkdrop module
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {String} tokenAmount Amount of tokens
     * @param {String} expirationTime Link expiration timestamp
     */

  }, {
    key: "generateLink",
    value: function () {
      var _generateLink2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9(_ref14) {
        var signingKeyOrWallet, linkdropModuleAddress, weiAmount, tokenAddress, tokenAmount, expirationTime;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                signingKeyOrWallet = _ref14.signingKeyOrWallet, linkdropModuleAddress = _ref14.linkdropModuleAddress, weiAmount = _ref14.weiAmount, tokenAddress = _ref14.tokenAddress, tokenAmount = _ref14.tokenAmount, expirationTime = _ref14.expirationTime;
                return _context9.abrupt("return", (0, _generateLink3.generateLink)({
                  claimHost: this.claimHost,
                  linkdropModuleAddress: linkdropModuleAddress,
                  signingKeyOrWallet: signingKeyOrWallet,
                  weiAmount: weiAmount,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount,
                  expirationTime: expirationTime
                }));

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function generateLink(_x12) {
        return _generateLink2.apply(this, arguments);
      }

      return generateLink;
    }()
    /**
     * @description Function to generate link for ETH and/or ERC721
     * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
     * @param {String} linkdropModuleAddress Address of linkdrop module
     * @param {String} weiAmount Wei amount
     * @param {String} nftAddress NFT address
     * @param {String} tokenId Token id
     * @param {String} expirationTime Link expiration timestamp
     */

  }, {
    key: "generateLinkERC721",
    value: function () {
      var _generateLinkERC2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10(_ref15) {
        var signingKeyOrWallet, linkdropModuleAddress, weiAmount, nftAddress, tokenId, expirationTime;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                signingKeyOrWallet = _ref15.signingKeyOrWallet, linkdropModuleAddress = _ref15.linkdropModuleAddress, weiAmount = _ref15.weiAmount, nftAddress = _ref15.nftAddress, tokenId = _ref15.tokenId, expirationTime = _ref15.expirationTime;
                return _context10.abrupt("return", (0, _generateLink3.generateLinkERC721)({
                  claimHost: this.claimHost,
                  signingKeyOrWallet: signingKeyOrWallet,
                  linkdropModuleAddress: linkdropModuleAddress,
                  weiAmount: weiAmount,
                  nftAddress: nftAddress,
                  tokenId: tokenId,
                  expirationTime: expirationTime
                }));

              case 2:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function generateLinkERC721(_x13) {
        return _generateLinkERC2.apply(this, arguments);
      }

      return generateLinkERC721;
    }()
    /**
     * @description Function to claim ETH and/or ERC20 tokens
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {String} tokenAmount Amount of tokens
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key attached to link
     * @param {String} linkdropModuleAddress Address of linkdrop module
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} receiverAddress Receiver address
     */

  }, {
    key: "claim",
    value: function () {
      var _claim2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee11(_ref16) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                weiAmount = _ref16.weiAmount, tokenAddress = _ref16.tokenAddress, tokenAmount = _ref16.tokenAmount, expirationTime = _ref16.expirationTime, linkKey = _ref16.linkKey, linkdropModuleAddress = _ref16.linkdropModuleAddress, linkdropSignerSignature = _ref16.linkdropSignerSignature, receiverAddress = _ref16.receiverAddress;
                return _context11.abrupt("return", (0, _claim3.claim)({
                  apiHost: this.apiHost,
                  weiAmount: weiAmount,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropModuleAddress: linkdropModuleAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  receiverAddress: receiverAddress
                }));

              case 2:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function claim(_x14) {
        return _claim2.apply(this, arguments);
      }

      return claim;
    }()
    /**
     * @description Function to claim ETH and/or ERC721 tokens
     * @param {String} weiAmount Wei amount
     * @param {String} nftAddress NFT address
     * @param {String} tokenId Token id
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key attached to link
     * @param {String} linkdropModuleAddress Address of linkdrop module
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} receiverAddress Receiver address
     */

  }, {
    key: "claimERC721",
    value: function () {
      var _claimERC2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee12(_ref17) {
        var weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                weiAmount = _ref17.weiAmount, nftAddress = _ref17.nftAddress, tokenId = _ref17.tokenId, expirationTime = _ref17.expirationTime, linkKey = _ref17.linkKey, linkdropModuleAddress = _ref17.linkdropModuleAddress, linkdropSignerSignature = _ref17.linkdropSignerSignature, receiverAddress = _ref17.receiverAddress;
                return _context12.abrupt("return", (0, _claim3.claimERC721)({
                  apiHost: this.apiHost,
                  weiAmount: weiAmount,
                  nftAddress: nftAddress,
                  tokenId: tokenId,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropModuleAddress: linkdropModuleAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  receiverAddress: receiverAddress
                }));

              case 2:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function claimERC721(_x15) {
        return _claimERC2.apply(this, arguments);
      }

      return claimERC721;
    }()
    /**
     * Registers new account in database
     * @param {String} email Email
     * @param {String} password Password
     */

  }, {
    key: "register",
    value: function () {
      var _register2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee13(email, password) {
        var ownerWallet, walletAddress;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                ownerWallet = _ethers.ethers.Wallet.createRandom();
                walletAddress = this.precomputeAddress({
                  owner: ownerWallet.address
                });
                return _context13.abrupt("return", (0, _accounts.register)({
                  email: email,
                  password: password,
                  apiHost: this.apiHost,
                  ownerWallet: ownerWallet,
                  walletAddress: walletAddress
                }));

              case 3:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function register(_x16, _x17) {
        return _register2.apply(this, arguments);
      }

      return register;
    }()
    /**
     * Logs existing account into system
     * @param {String} email Email
     * @param {String} password Password
     */

  }, {
    key: "login",
    value: function () {
      var _login2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee14(email, password) {
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                return _context14.abrupt("return", (0, _accounts.login)({
                  email: email,
                  password: password,
                  apiHost: this.apiHost
                }));

              case 1:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function login(_x18, _x19) {
        return _login2.apply(this, arguments);
      }

      return login;
    }()
    /**
     * Fetches session key from server, decrypts session keystore and returns private key
     * @param {Object} sessionKeyStore Encrypted session key store
     * @return `{success, privateKey, error}`
     */

  }, {
    key: "extractPrivateKeyFromSession",
    value: function () {
      var _extractPrivateKeyFromSession2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee15(sessionKeyStore) {
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", (0, _accounts.extractPrivateKeyFromSession)({
                  sessionKeyStore: sessionKeyStore,
                  apiHost: this.apiHost
                }));

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function extractPrivateKeyFromSession(_x20) {
        return _extractPrivateKeyFromSession2.apply(this, arguments);
      }

      return extractPrivateKeyFromSession;
    }()
    /**
     * Returns whether a wallet for the given account is deployed and safe address if exists
     * @param {String} email Email
     * @return `{isDeployed, safe}`
     */

  }, {
    key: "isDeployed",
    value: function () {
      var _isDeployed2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee16(email) {
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                return _context16.abrupt("return", (0, _accounts.isDeployed)({
                  email: email,
                  apiHost: this.apiHost
                }));

              case 1:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function isDeployed(_x21) {
        return _isDeployed2.apply(this, arguments);
      }

      return isDeployed;
    }()
    /**
     * Return whether a link has already been claimed or not
     * @param {String} linkdropModule Linkdrop module address
     * @param {String} linkId Link id
     */

  }, {
    key: "isClaimedLink",
    value: function () {
      var _isClaimedLink2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee17(_ref18) {
        var linkdropModule, linkId;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                linkdropModule = _ref18.linkdropModule, linkId = _ref18.linkId;
                return _context17.abrupt("return", (0, _linkdropModuleUtils.isClaimedLink)({
                  linkdropModule: linkdropModule,
                  linkId: linkId,
                  jsonRpcUrl: this.jsonRpcUrl
                }));

              case 2:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function isClaimedLink(_x22) {
        return _isClaimedLink2.apply(this, arguments);
      }

      return isClaimedLink;
    }()
  }]);
  return WalletSDK;
}();

var _default = WalletSDK;
exports["default"] = _default;