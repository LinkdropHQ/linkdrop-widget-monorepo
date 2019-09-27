"use strict";

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

var _createSafe = require("./createSafe");

var _signTx2 = require("./signTx");

var _executeTx3 = require("./executeTx");

var _ensUtils = require("./ensUtils");

var _generateLink3 = require("./generateLink");

var _claim3 = require("./claim");

var ADDRESS_ZERO = _ethers.ethers.constants.AddressZero;
var BYTES_ZERO = '0x';

var WalletSDK =
/*#__PURE__*/
function () {
  function WalletSDK(_ref) {
    var _ref$chain = _ref.chain,
        chain = _ref$chain === void 0 ? 'rinkeby' : _ref$chain,
        _ref$apiHost = _ref.apiHost,
        apiHost = _ref$apiHost === void 0 ? 'http://localhost:5050' : _ref$apiHost,
        _ref$claimHost = _ref.claimHost,
        claimHost = _ref$claimHost === void 0 ? 'https://claim.linkdrop.io' : _ref$claimHost,
        jsonRpcUrl = _ref.jsonRpcUrl,
        _ref$gnosisSafeMaster = _ref.gnosisSafeMasterCopy,
        gnosisSafeMasterCopy = _ref$gnosisSafeMaster === void 0 ? '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A' : _ref$gnosisSafeMaster,
        _ref$proxyFactory = _ref.proxyFactory,
        proxyFactory = _ref$proxyFactory === void 0 ? '0x12302fE9c02ff50939BaAaaf415fc226C078613C' : _ref$proxyFactory,
        _ref$linkdropModuleMa = _ref.linkdropModuleMasterCopy,
        linkdropModuleMasterCopy = _ref$linkdropModuleMa === void 0 ? '0x19Ff4Cb4eFD0b9E04433Dde6507ADC68225757f2' : _ref$linkdropModuleMa,
        _ref$createAndAddModu = _ref.createAndAddModules,
        createAndAddModules = _ref$createAndAddModu === void 0 ? '0x40Ba7DF971BBdE476517B7d6B908113f71583183' : _ref$createAndAddModu,
        _ref$multiSend = _ref.multiSend,
        multiSend = _ref$multiSend === void 0 ? '0x0CE1BBc1BbbF65C3953A3f1f80344b42C084FA0c' : _ref$multiSend;
    (0, _classCallCheck2["default"])(this, WalletSDK);
    this.chain = chain;
    this.jsonRpcUrl = jsonRpcUrl || "https://".concat(chain, ".infura.io");
    this.apiHost = apiHost;
    this.claimHost = claimHost;
    this.gnosisSafeMasterCopy = gnosisSafeMasterCopy;
    this.proxyFactory = proxyFactory;
    this.linkdropModuleMasterCopy = linkdropModuleMasterCopy;
    this.createAndAddModules = createAndAddModules;
    this.multiSend = multiSend;
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
     * @param {String | Number} saltNonce Random salt nonce
     * @param {String} deployer Deployer address (optional)
     * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address (optional)
     * @param {String} owner Safe owner address
     * @param {String} to To (optional)
     * @param {String} data Data (optional)
     */

  }, {
    key: "computeSafeAddress",
    value: function computeSafeAddress(_ref2) {
      var saltNonce = _ref2.saltNonce,
          _ref2$deployer = _ref2.deployer,
          deployer = _ref2$deployer === void 0 ? this.proxyFactory : _ref2$deployer,
          _ref2$gnosisSafeMaste = _ref2.gnosisSafeMasterCopy,
          gnosisSafeMasterCopy = _ref2$gnosisSafeMaste === void 0 ? this.gnosisSafeMasterCopy : _ref2$gnosisSafeMaste,
          owner = _ref2.owner,
          _ref2$to = _ref2.to,
          to = _ref2$to === void 0 ? ADDRESS_ZERO : _ref2$to,
          _ref2$data = _ref2.data,
          data = _ref2$data === void 0 ? BYTES_ZERO : _ref2$data;
      return (0, _computeSafeAddress2.computeSafeAddress)({
        owner: owner,
        saltNonce: saltNonce,
        gnosisSafeMasterCopy: gnosisSafeMasterCopy,
        deployer: deployer,
        to: to,
        data: data
      });
    }
    /**
     * Function to create new safe
     * @param {String} owner Safe owner's address
     * @param {String} name ENS name to register for safe
     * @param {String} apiHost API host (optional)
     * @returns {Object} {success, txHash, safe, errors}
     */

  }, {
    key: "create",
    value: function () {
      var _create2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref3) {
        var owner, name, _ref3$apiHost, apiHost;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                owner = _ref3.owner, name = _ref3.name, _ref3$apiHost = _ref3.apiHost, apiHost = _ref3$apiHost === void 0 ? this.apiHost : _ref3$apiHost;
                return _context2.abrupt("return", (0, _createSafe.create)({
                  owner: owner,
                  name: name,
                  apiHost: apiHost
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function create(_x5) {
        return _create2.apply(this, arguments);
      }

      return create;
    }()
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
      _regenerator["default"].mark(function _callee3(_ref4) {
        var safe, privateKey, to, value, _ref4$data, data, _ref4$operation, operation, _ref4$gasToken, gasToken, _ref4$refundReceiver, refundReceiver, _ref4$apiHost, apiHost, _ref4$jsonRpcUrl, jsonRpcUrl;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                safe = _ref4.safe, privateKey = _ref4.privateKey, to = _ref4.to, value = _ref4.value, _ref4$data = _ref4.data, data = _ref4$data === void 0 ? '0x' : _ref4$data, _ref4$operation = _ref4.operation, operation = _ref4$operation === void 0 ? 0 : _ref4$operation, _ref4$gasToken = _ref4.gasToken, gasToken = _ref4$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref4$gasToken, _ref4$refundReceiver = _ref4.refundReceiver, refundReceiver = _ref4$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref4$refundReceiver, _ref4$apiHost = _ref4.apiHost, apiHost = _ref4$apiHost === void 0 ? this.apiHost : _ref4$apiHost, _ref4$jsonRpcUrl = _ref4.jsonRpcUrl, jsonRpcUrl = _ref4$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref4$jsonRpcUrl;
                return _context3.abrupt("return", (0, _executeTx3.executeTx)({
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
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function executeTx(_x6) {
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
    value: function signTx(_ref5) {
      var safe = _ref5.safe,
          privateKey = _ref5.privateKey,
          to = _ref5.to,
          value = _ref5.value,
          _ref5$data = _ref5.data,
          data = _ref5$data === void 0 ? '0x' : _ref5$data,
          _ref5$operation = _ref5.operation,
          operation = _ref5$operation === void 0 ? 0 : _ref5$operation,
          _ref5$safeTxGas = _ref5.safeTxGas,
          safeTxGas = _ref5$safeTxGas === void 0 ? 0 : _ref5$safeTxGas,
          _ref5$baseGas = _ref5.baseGas,
          baseGas = _ref5$baseGas === void 0 ? 0 : _ref5$baseGas,
          _ref5$gasPrice = _ref5.gasPrice,
          gasPrice = _ref5$gasPrice === void 0 ? 0 : _ref5$gasPrice,
          _ref5$gasToken = _ref5.gasToken,
          gasToken = _ref5$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref5$gasToken,
          _ref5$refundReceiver = _ref5.refundReceiver,
          refundReceiver = _ref5$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref5$refundReceiver,
          nonce = _ref5.nonce;
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
     * @param {String} name ENS identifier (e.g 'alice.eth')
     * @param {String} chain Chain identifier (optional)
     * @param {String} jsonRpcUrl JSON RPC URL (optional)
     * @return {String} ENS identifier owner's address
     */

  }, {
    key: "getEnsOwner",
    value: function () {
      var _getEnsOwner2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref6) {
        var name, _ref6$chain, chain, _ref6$jsonRpcUrl, jsonRpcUrl;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                name = _ref6.name, _ref6$chain = _ref6.chain, chain = _ref6$chain === void 0 ? this.chain : _ref6$chain, _ref6$jsonRpcUrl = _ref6.jsonRpcUrl, jsonRpcUrl = _ref6$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref6$jsonRpcUrl;
                return _context4.abrupt("return", (0, _ensUtils.getEnsOwner)({
                  name: name,
                  chain: chain,
                  jsonRpcUrl: jsonRpcUrl
                }));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getEnsOwner(_x7) {
        return _getEnsOwner2.apply(this, arguments);
      }

      return getEnsOwner;
    }()
    /**
     *
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {String} tokenAmount Token amount
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key assigned to link
     * @param {String} linkdropMasterAddress Linkdrop master address
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} campaignId Campaign id
     * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address (optional)
     * @param {String} proxyFactory Deployed proxy factory address (optional)
     * @param {String} owner Safe owner address
     * @param {String} name ENS name to register for safe
     * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address (optional)
     * @param {String} createAndAddModules Deployed createAndAddModules library address (optional)
     * @param {String} multiSend Deployed multiSend library address (optional)
     * @param {String} apiHost API host (optional)
     * @returns {Object} {success, txHash, safe, errors}
     */

  }, {
    key: "claimAndCreate",
    value: function () {
      var _claimAndCreate2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref7) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, _ref7$gnosisSafeMaste, gnosisSafeMasterCopy, owner, name, _ref7$proxyFactory, proxyFactory, _ref7$linkdropModuleM, linkdropModuleMasterCopy, _ref7$createAndAddMod, createAndAddModules, _ref7$multiSend, multiSend, _ref7$apiHost, apiHost;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                weiAmount = _ref7.weiAmount, tokenAddress = _ref7.tokenAddress, tokenAmount = _ref7.tokenAmount, expirationTime = _ref7.expirationTime, linkKey = _ref7.linkKey, linkdropMasterAddress = _ref7.linkdropMasterAddress, linkdropSignerSignature = _ref7.linkdropSignerSignature, campaignId = _ref7.campaignId, _ref7$gnosisSafeMaste = _ref7.gnosisSafeMasterCopy, gnosisSafeMasterCopy = _ref7$gnosisSafeMaste === void 0 ? this.gnosisSafeMasterCopy : _ref7$gnosisSafeMaste, owner = _ref7.owner, name = _ref7.name, _ref7$proxyFactory = _ref7.proxyFactory, proxyFactory = _ref7$proxyFactory === void 0 ? this.proxyFactory : _ref7$proxyFactory, _ref7$linkdropModuleM = _ref7.linkdropModuleMasterCopy, linkdropModuleMasterCopy = _ref7$linkdropModuleM === void 0 ? this.linkdropModuleMasterCopy : _ref7$linkdropModuleM, _ref7$createAndAddMod = _ref7.createAndAddModules, createAndAddModules = _ref7$createAndAddMod === void 0 ? this.createAndAddModules : _ref7$createAndAddMod, _ref7$multiSend = _ref7.multiSend, multiSend = _ref7$multiSend === void 0 ? this.multiSend : _ref7$multiSend, _ref7$apiHost = _ref7.apiHost, apiHost = _ref7$apiHost === void 0 ? this.apiHost : _ref7$apiHost;
                return _context5.abrupt("return", (0, _createSafe.claimAndCreate)({
                  weiAmount: weiAmount,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropMasterAddress: linkdropMasterAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  campaignId: campaignId,
                  gnosisSafeMasterCopy: gnosisSafeMasterCopy,
                  proxyFactory: proxyFactory,
                  owner: owner,
                  name: name,
                  linkdropModuleMasterCopy: linkdropModuleMasterCopy,
                  createAndAddModules: createAndAddModules,
                  multiSend: multiSend,
                  apiHost: apiHost
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
     * Function to calculate the linkdrop module address based on given params
     * @param {String} owner Safe owner address
     * @param {String | Number} saltNonce Random salt nonce
     * @param {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
     * @param {String} deployer Deployer address
     */

  }, {
    key: "computeLinkdropModuleAddress",
    value: function computeLinkdropModuleAddress(_ref8) {
      var owner = _ref8.owner,
          saltNonce = _ref8.saltNonce,
          _ref8$linkdropModuleM = _ref8.linkdropModuleMasterCopy,
          linkdropModuleMasterCopy = _ref8$linkdropModuleM === void 0 ? this.linkdropModuleMasterCopy : _ref8$linkdropModuleM,
          _ref8$deployer = _ref8.deployer,
          deployer = _ref8$deployer === void 0 ? this.proxyFactory : _ref8$deployer;
      return (0, _computeLinkdropModuleAddress2.computeLinkdropModuleAddress)({
        owner: owner,
        saltNonce: saltNonce,
        linkdropModuleMasterCopy: linkdropModuleMasterCopy,
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
     * @param {Number} tokenAmount Amount of tokens
     * @param {Number} expirationTime Link expiration timestamp
     */

  }, {
    key: "generateLink",
    value: function () {
      var _generateLink2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(_ref9) {
        var signingKeyOrWallet, linkdropModuleAddress, weiAmount, tokenAddress, tokenAmount, expirationTime;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                signingKeyOrWallet = _ref9.signingKeyOrWallet, linkdropModuleAddress = _ref9.linkdropModuleAddress, weiAmount = _ref9.weiAmount, tokenAddress = _ref9.tokenAddress, tokenAmount = _ref9.tokenAmount, expirationTime = _ref9.expirationTime;
                return _context6.abrupt("return", (0, _generateLink3.generateLink)({
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
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function generateLink(_x9) {
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
     * @param {Number} tokenId Token id
     * @param {Number} expirationTime Link expiration timestamp
     */

  }, {
    key: "generateLinkERC721",
    value: function () {
      var _generateLinkERC2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(_ref10) {
        var signingKeyOrWallet, linkdropModuleAddress, weiAmount, nftAddress, tokenId, expirationTime;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                signingKeyOrWallet = _ref10.signingKeyOrWallet, linkdropModuleAddress = _ref10.linkdropModuleAddress, weiAmount = _ref10.weiAmount, nftAddress = _ref10.nftAddress, tokenId = _ref10.tokenId, expirationTime = _ref10.expirationTime;
                return _context7.abrupt("return", (0, _generateLink3.generateLinkERC721)({
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
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function generateLinkERC721(_x10) {
        return _generateLinkERC2.apply(this, arguments);
      }

      return generateLinkERC721;
    }()
    /**
     * @description Function to claim ETH and/or ERC20 tokens
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {Number} tokenAmount Amount of tokens
     * @param {Number} expirationTime Link expiration timestamp
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
      _regenerator["default"].mark(function _callee8(_ref11) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                weiAmount = _ref11.weiAmount, tokenAddress = _ref11.tokenAddress, tokenAmount = _ref11.tokenAmount, expirationTime = _ref11.expirationTime, linkKey = _ref11.linkKey, linkdropModuleAddress = _ref11.linkdropModuleAddress, linkdropSignerSignature = _ref11.linkdropSignerSignature, receiverAddress = _ref11.receiverAddress;
                return _context8.abrupt("return", (0, _claim3.claim)({
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
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function claim(_x11) {
        return _claim2.apply(this, arguments);
      }

      return claim;
    }()
    /**
     * @description Function to claim ETH and/or ERC721 tokens
     * @param {String} weiAmount Wei amount
     * @param {String} nftAddress NFT address
     * @param {Number} tokenId Token id
     * @param {Number} expirationTime Link expiration timestamp
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
      _regenerator["default"].mark(function _callee9(_ref12) {
        var weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                weiAmount = _ref12.weiAmount, nftAddress = _ref12.nftAddress, tokenId = _ref12.tokenId, expirationTime = _ref12.expirationTime, linkKey = _ref12.linkKey, linkdropModuleAddress = _ref12.linkdropModuleAddress, linkdropSignerSignature = _ref12.linkdropSignerSignature, receiverAddress = _ref12.receiverAddress;
                return _context9.abrupt("return", (0, _claim3.claimERC721)({
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
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function claimERC721(_x12) {
        return _claimERC2.apply(this, arguments);
      }

      return claimERC721;
    }()
  }]);
  return WalletSDK;
}();

var _default = WalletSDK;
exports["default"] = _default;