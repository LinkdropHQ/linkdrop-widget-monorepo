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

var _signTx2 = require("./signTx");

var _executeTx3 = require("./executeTx");

var _ensUtils = require("./ensUtils");

var _generateLink3 = require("./generateLink");

var _claim3 = require("./claim");

var _auth = require("./auth");

var cryptoUtils = _interopRequireWildcard(require("./cryptoUtils"));

var _crypto = _interopRequireDefault(require("crypto"));

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
        multiSend = _ref$multiSend === void 0 ? '0x0CE1BBc1BbbF65C3953A3f1f80344b42C084FA0c' : _ref$multiSend,
        _ref$recoveryModuleMa = _ref.recoveryModuleMasterCopy,
        recoveryModuleMasterCopy = _ref$recoveryModuleMa === void 0 ? '0xfE7bCFd529eB16e0793a7c4ee9cb157F2501d474' : _ref$recoveryModuleMa,
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
    this.jsonRpcUrl = jsonRpcUrl || "https://".concat(chain, ".infura.io");
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
     * @param {String | Number} saltNonce Random salt nonce
     * @param {String} deployer Deployer address (optional)
     * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address (optional)
     * @param {String} owner Safe owner address
     * @param {String} to To (optional)
     * @param {String} data Data (optional)
     * @param {String} paymentToken Payment token (0x0 for ether) (optional)
     * @param {String} paymentAmount Payment amount (optional)
     * @param {String} paymentReceiver Payment receiver (optional)
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
          data = _ref2$data === void 0 ? BYTES_ZERO : _ref2$data,
          _ref2$paymentToken = _ref2.paymentToken,
          paymentToken = _ref2$paymentToken === void 0 ? ADDRESS_ZERO : _ref2$paymentToken,
          _ref2$paymentAmount = _ref2.paymentAmount,
          paymentAmount = _ref2$paymentAmount === void 0 ? 0 : _ref2$paymentAmount,
          _ref2$paymentReceiver = _ref2.paymentReceiver,
          paymentReceiver = _ref2$paymentReceiver === void 0 ? ADDRESS_ZERO : _ref2$paymentReceiver;
      return (0, _computeSafeAddress2.computeSafeAddress)({
        owner: owner,
        saltNonce: saltNonce,
        gnosisSafeMasterCopy: gnosisSafeMasterCopy,
        deployer: deployer,
        to: to,
        data: data,
        paymentToken: paymentToken,
        paymentAmount: paymentAmount,
        paymentReceiver: paymentReceiver
      });
    }
    /**
     * @param  {String} owner Owner address
     * @param  {String} ensName Ens name
     * @param  {Number} saltNonce Random salt nonce
     * @param  {Number} recoveryPeriod Recovery period in atomic units (seconds) (optional)
     * @param  {Number} gasPrice Gas price in wei (optional)
     * @param  {String} guardian Guardian address
     * @param  {String} ensAddress Ens address
     * @param  {String} ensDomain Ens domain (e.g. 'my-domain.eth)
     * @param  {String} jsonRpcUrl JSON RPC URL
     * @param  {String} apiHost API host
     * @param  {String} gnosisSafeMasterCopy Deployed Gnosis Safe mastercopy address
     * @param  {String} proxyFactory Deployed proxy factory address
     * @param  {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
     * @param  {String} recoveryModuleMasterCopy Deployed recovery module mastercopy address
     * @param  {String} multiSend Deployed MultiSend library address
     * @param  {String} createAndAddModules Deployed CreateAndAddModules library address
     */

  }, {
    key: "create",
    value: function () {
      var _create2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref3) {
        var owner, ensName, saltNonce, gasPrice, email, passwordHash, passwordDerivedKeyHash, encryptedEncryptionKey, encryptedMnemonicPhrase, _ref3$recoveryPeriod, recoveryPeriod, _ref3$guardian, guardian, _ref3$ensAddress, ensAddress, _ref3$ensDomain, ensDomain, _ref3$gnosisSafeMaste, gnosisSafeMasterCopy, _ref3$proxyFactory, proxyFactory, _ref3$linkdropModuleM, linkdropModuleMasterCopy, _ref3$recoveryModuleM, recoveryModuleMasterCopy, _ref3$multiSend, multiSend, _ref3$createAndAddMod, createAndAddModules, _ref3$jsonRpcUrl, jsonRpcUrl, _ref3$apiHost, apiHost;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                owner = _ref3.owner, ensName = _ref3.ensName, saltNonce = _ref3.saltNonce, gasPrice = _ref3.gasPrice, email = _ref3.email, passwordHash = _ref3.passwordHash, passwordDerivedKeyHash = _ref3.passwordDerivedKeyHash, encryptedEncryptionKey = _ref3.encryptedEncryptionKey, encryptedMnemonicPhrase = _ref3.encryptedMnemonicPhrase, _ref3$recoveryPeriod = _ref3.recoveryPeriod, recoveryPeriod = _ref3$recoveryPeriod === void 0 ? this.recoveryPeriod : _ref3$recoveryPeriod, _ref3$guardian = _ref3.guardian, guardian = _ref3$guardian === void 0 ? this.guardian : _ref3$guardian, _ref3$ensAddress = _ref3.ensAddress, ensAddress = _ref3$ensAddress === void 0 ? this.ensAddress : _ref3$ensAddress, _ref3$ensDomain = _ref3.ensDomain, ensDomain = _ref3$ensDomain === void 0 ? this.ensDomain : _ref3$ensDomain, _ref3$gnosisSafeMaste = _ref3.gnosisSafeMasterCopy, gnosisSafeMasterCopy = _ref3$gnosisSafeMaste === void 0 ? this.gnosisSafeMasterCopy : _ref3$gnosisSafeMaste, _ref3$proxyFactory = _ref3.proxyFactory, proxyFactory = _ref3$proxyFactory === void 0 ? this.proxyFactory : _ref3$proxyFactory, _ref3$linkdropModuleM = _ref3.linkdropModuleMasterCopy, linkdropModuleMasterCopy = _ref3$linkdropModuleM === void 0 ? this.linkdropModuleMasterCopy : _ref3$linkdropModuleM, _ref3$recoveryModuleM = _ref3.recoveryModuleMasterCopy, recoveryModuleMasterCopy = _ref3$recoveryModuleM === void 0 ? this.recoveryModuleMasterCopy : _ref3$recoveryModuleM, _ref3$multiSend = _ref3.multiSend, multiSend = _ref3$multiSend === void 0 ? this.multiSend : _ref3$multiSend, _ref3$createAndAddMod = _ref3.createAndAddModules, createAndAddModules = _ref3$createAndAddMod === void 0 ? this.createAndAddModules : _ref3$createAndAddMod, _ref3$jsonRpcUrl = _ref3.jsonRpcUrl, jsonRpcUrl = _ref3$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref3$jsonRpcUrl, _ref3$apiHost = _ref3.apiHost, apiHost = _ref3$apiHost === void 0 ? this.apiHost : _ref3$apiHost;
                return _context2.abrupt("return", (0, _create3.create)({
                  owner: owner,
                  ensName: ensName,
                  saltNonce: saltNonce,
                  gasPrice: gasPrice,
                  recoveryPeriod: recoveryPeriod,
                  guardian: guardian,
                  ensAddress: ensAddress,
                  ensDomain: ensDomain,
                  gnosisSafeMasterCopy: gnosisSafeMasterCopy,
                  proxyFactory: proxyFactory,
                  linkdropModuleMasterCopy: linkdropModuleMasterCopy,
                  recoveryModuleMasterCopy: recoveryModuleMasterCopy,
                  multiSend: multiSend,
                  createAndAddModules: createAndAddModules,
                  jsonRpcUrl: jsonRpcUrl,
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
      _regenerator["default"].mark(function _callee4(_ref6) {
        var ensName, _ref6$ensDomain, ensDomain, _ref6$ensAddress, ensAddress, _ref6$jsonRpcUrl, jsonRpcUrl;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                ensName = _ref6.ensName, _ref6$ensDomain = _ref6.ensDomain, ensDomain = _ref6$ensDomain === void 0 ? this.ensDomain : _ref6$ensDomain, _ref6$ensAddress = _ref6.ensAddress, ensAddress = _ref6$ensAddress === void 0 ? this.ensAddress : _ref6$ensAddress, _ref6$jsonRpcUrl = _ref6.jsonRpcUrl, jsonRpcUrl = _ref6$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref6$jsonRpcUrl;
                return _context4.abrupt("return", (0, _ensUtils.getEnsOwner)({
                  ensName: ensName,
                  ensDomain: ensDomain,
                  ensAddress: ensAddress,
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
     * Function to create new safe and claim linkdrop
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {String} tokenAmount Token amount
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key assigned to link
     * @param {String} linkdropMasterAddress Linkdrop master address
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} campaignId Campaign id
     * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
     * @param {String} proxyFactory Deployed proxy factory address
     * @param {String} owner Safe owner address
     * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address
     * @param {String} createAndAddModules Deployed createAndAddModules library address
     * @param {String} multiSend Deployed multiSend library address
     * @param {String} apiHost API host
     * @param {String} saltNonce Random salt nonce
     * @param {String} guardian Guardian address
     * @param {String} recoveryPeriod Recovery period
     * @param {String} recoveryModuleMasterCopy Deployed recovery moduel mastercopy address
     * @param {String} gasPrice Gas price in wei
     * @param {String} ensName ENS name (e.g. 'alice')
     * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth)
     * @param {String} ensAddress ENS address
     * @param {String} jsonRpcUrl JSON RPC URL
     * @param {String} linkdropFactory Deployed linkdrop factory address
     * @param {String} email Email
     * @returns {Object} {success, txHash,safe, linkdropModule, recoveryModule, errors}
     */

  }, {
    key: "claimAndCreate",
    value: function () {
      var _claimAndCreate2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref7) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, owner, ensName, saltNonce, gasPrice, _ref7$gnosisSafeMaste, gnosisSafeMasterCopy, _ref7$proxyFactory, proxyFactory, _ref7$linkdropModuleM, linkdropModuleMasterCopy, _ref7$createAndAddMod, createAndAddModules, _ref7$multiSend, multiSend, _ref7$apiHost, apiHost, _ref7$guardian, guardian, _ref7$recoveryPeriod, recoveryPeriod, _ref7$recoveryModuleM, recoveryModuleMasterCopy, _ref7$ensDomain, ensDomain, _ref7$ensAddress, ensAddress, _ref7$jsonRpcUrl, jsonRpcUrl, _ref7$linkdropFactory, linkdropFactory, email;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                weiAmount = _ref7.weiAmount, tokenAddress = _ref7.tokenAddress, tokenAmount = _ref7.tokenAmount, expirationTime = _ref7.expirationTime, linkKey = _ref7.linkKey, linkdropMasterAddress = _ref7.linkdropMasterAddress, linkdropSignerSignature = _ref7.linkdropSignerSignature, campaignId = _ref7.campaignId, owner = _ref7.owner, ensName = _ref7.ensName, saltNonce = _ref7.saltNonce, gasPrice = _ref7.gasPrice, _ref7$gnosisSafeMaste = _ref7.gnosisSafeMasterCopy, gnosisSafeMasterCopy = _ref7$gnosisSafeMaste === void 0 ? this.gnosisSafeMasterCopy : _ref7$gnosisSafeMaste, _ref7$proxyFactory = _ref7.proxyFactory, proxyFactory = _ref7$proxyFactory === void 0 ? this.proxyFactory : _ref7$proxyFactory, _ref7$linkdropModuleM = _ref7.linkdropModuleMasterCopy, linkdropModuleMasterCopy = _ref7$linkdropModuleM === void 0 ? this.linkdropModuleMasterCopy : _ref7$linkdropModuleM, _ref7$createAndAddMod = _ref7.createAndAddModules, createAndAddModules = _ref7$createAndAddMod === void 0 ? this.createAndAddModules : _ref7$createAndAddMod, _ref7$multiSend = _ref7.multiSend, multiSend = _ref7$multiSend === void 0 ? this.multiSend : _ref7$multiSend, _ref7$apiHost = _ref7.apiHost, apiHost = _ref7$apiHost === void 0 ? this.apiHost : _ref7$apiHost, _ref7$guardian = _ref7.guardian, guardian = _ref7$guardian === void 0 ? this.guardian : _ref7$guardian, _ref7$recoveryPeriod = _ref7.recoveryPeriod, recoveryPeriod = _ref7$recoveryPeriod === void 0 ? this.recoveryPeriod : _ref7$recoveryPeriod, _ref7$recoveryModuleM = _ref7.recoveryModuleMasterCopy, recoveryModuleMasterCopy = _ref7$recoveryModuleM === void 0 ? this.recoveryModuleMasterCopy : _ref7$recoveryModuleM, _ref7$ensDomain = _ref7.ensDomain, ensDomain = _ref7$ensDomain === void 0 ? this.ensDomain : _ref7$ensDomain, _ref7$ensAddress = _ref7.ensAddress, ensAddress = _ref7$ensAddress === void 0 ? this.ensAddress : _ref7$ensAddress, _ref7$jsonRpcUrl = _ref7.jsonRpcUrl, jsonRpcUrl = _ref7$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref7$jsonRpcUrl, _ref7$linkdropFactory = _ref7.linkdropFactory, linkdropFactory = _ref7$linkdropFactory === void 0 ? this.linkdropFactory : _ref7$linkdropFactory, email = _ref7.email;
                return _context5.abrupt("return", (0, _claimAndCreate3.claimAndCreate)({
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
                  linkdropModuleMasterCopy: linkdropModuleMasterCopy,
                  createAndAddModules: createAndAddModules,
                  multiSend: multiSend,
                  apiHost: apiHost,
                  saltNonce: saltNonce,
                  guardian: guardian,
                  recoveryPeriod: recoveryPeriod,
                  recoveryModuleMasterCopy: recoveryModuleMasterCopy,
                  gasPrice: gasPrice,
                  ensName: ensName,
                  ensDomain: ensDomain,
                  ensAddress: ensAddress,
                  jsonRpcUrl: jsonRpcUrl,
                  linkdropFactory: linkdropFactory,
                  email: email
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
     * @param {String} saltNonce Random salt nonce
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
     * Function to calculate the recovery module address based on given params
     * @param {String} guardians Guardian address
     * @param {String} recoveryPeriod Recovery period duration in atomic value (seconds)
     * @param {String} saltNonce Random salt nonce
     * @param {String} recoveryModuleMasterCopy Deployed recovery module mastercopy address
     * @param {String} deployer Deployer address
     */

  }, {
    key: "computeRecoveryModuleAddress",
    value: function computeRecoveryModuleAddress(_ref9) {
      var guardian = _ref9.guardian,
          _ref9$recoveryPeriod = _ref9.recoveryPeriod,
          recoveryPeriod = _ref9$recoveryPeriod === void 0 ? this.recoveryPeriod : _ref9$recoveryPeriod,
          saltNonce = _ref9.saltNonce,
          _ref9$recoveryModuleM = _ref9.recoveryModuleMasterCopy,
          recoveryModuleMasterCopy = _ref9$recoveryModuleM === void 0 ? this.recoveryModuleMasterCopy : _ref9$recoveryModuleM,
          _ref9$deployer = _ref9.deployer,
          deployer = _ref9$deployer === void 0 ? this.proxyFactory : _ref9$deployer;
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
      _regenerator["default"].mark(function _callee6(_ref10) {
        var signingKeyOrWallet, linkdropModuleAddress, weiAmount, tokenAddress, tokenAmount, expirationTime;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                signingKeyOrWallet = _ref10.signingKeyOrWallet, linkdropModuleAddress = _ref10.linkdropModuleAddress, weiAmount = _ref10.weiAmount, tokenAddress = _ref10.tokenAddress, tokenAmount = _ref10.tokenAmount, expirationTime = _ref10.expirationTime;
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
     * @param {String} tokenId Token id
     * @param {String} expirationTime Link expiration timestamp
     */

  }, {
    key: "generateLinkERC721",
    value: function () {
      var _generateLinkERC2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(_ref11) {
        var signingKeyOrWallet, linkdropModuleAddress, weiAmount, nftAddress, tokenId, expirationTime;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                signingKeyOrWallet = _ref11.signingKeyOrWallet, linkdropModuleAddress = _ref11.linkdropModuleAddress, weiAmount = _ref11.weiAmount, nftAddress = _ref11.nftAddress, tokenId = _ref11.tokenId, expirationTime = _ref11.expirationTime;
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
      _regenerator["default"].mark(function _callee8(_ref12) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                weiAmount = _ref12.weiAmount, tokenAddress = _ref12.tokenAddress, tokenAmount = _ref12.tokenAmount, expirationTime = _ref12.expirationTime, linkKey = _ref12.linkKey, linkdropModuleAddress = _ref12.linkdropModuleAddress, linkdropSignerSignature = _ref12.linkdropSignerSignature, receiverAddress = _ref12.receiverAddress;
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
      _regenerator["default"].mark(function _callee9(_ref13) {
        var weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature, receiverAddress;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                weiAmount = _ref13.weiAmount, nftAddress = _ref13.nftAddress, tokenId = _ref13.tokenId, expirationTime = _ref13.expirationTime, linkKey = _ref13.linkKey, linkdropModuleAddress = _ref13.linkdropModuleAddress, linkdropSignerSignature = _ref13.linkdropSignerSignature, receiverAddress = _ref13.receiverAddress;
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
      _regenerator["default"].mark(function _callee10(email, password) {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", (0, _auth.register)({
                  email: email,
                  password: password,
                  apiHost: this.apiHost
                }));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function register(_x13, _x14) {
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
      _regenerator["default"].mark(function _callee11(email, password) {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", (0, _auth.login)({
                  email: email,
                  password: password,
                  apiHost: this.apiHost
                }));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function login(_x15, _x16) {
        return _login2.apply(this, arguments);
      }

      return login;
    }()
  }]);
  return WalletSDK;
}();

var _default = WalletSDK;
exports["default"] = _default;