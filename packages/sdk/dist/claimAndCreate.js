"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claimAndCreate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _ethers = require("ethers");

var _utils = require("./utils");

var _computeLinkdropModuleAddress = require("./computeLinkdropModuleAddress");

var _computeRecoveryModuleAddress = require("./computeRecoveryModuleAddress");

var _precomputeSafeAddressWithModules = require("./precomputeSafeAddressWithModules");

var _ensUtils = require("./ensUtils");

var ADDRESS_ZERO = _ethers.ethers.constants.AddressZero;
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
 * @param {String} ensName ENS name (e.g. 'alice')
 * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth)
 * @param {String} ensAddress ENS address
 * @param {String} jsonRpcUrl JSON RPC URL
 * @returns {Object} {success, txHash, safe, errors}
 */

var claimAndCreate =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, gnosisSafeMasterCopy, proxyFactory, owner, linkdropModuleMasterCopy, createAndAddModules, multiSend, apiHost, saltNonce, guardian, recoveryPeriod, recoveryModuleMasterCopy, ensName, ensDomain, ensAddress, jsonRpcUrl, email, ensOwner, safeAddress, receiverSignature, linkId, linkdropModule, recoveryModule, response, _response$data, success, txHash, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, linkKey = _ref.linkKey, linkdropMasterAddress = _ref.linkdropMasterAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, campaignId = _ref.campaignId, gnosisSafeMasterCopy = _ref.gnosisSafeMasterCopy, proxyFactory = _ref.proxyFactory, owner = _ref.owner, linkdropModuleMasterCopy = _ref.linkdropModuleMasterCopy, createAndAddModules = _ref.createAndAddModules, multiSend = _ref.multiSend, apiHost = _ref.apiHost, saltNonce = _ref.saltNonce, guardian = _ref.guardian, recoveryPeriod = _ref.recoveryPeriod, recoveryModuleMasterCopy = _ref.recoveryModuleMasterCopy, ensName = _ref.ensName, ensDomain = _ref.ensDomain, ensAddress = _ref.ensAddress, jsonRpcUrl = _ref.jsonRpcUrl, email = _ref.email;

            _assertJs["default"].string(weiAmount, 'Wei amount is required');

            _assertJs["default"].string(tokenAddress, 'Token address is required');

            _assertJs["default"].string(tokenAmount, 'Token amount is required');

            _assertJs["default"].string(expirationTime, 'Expiration time is required');

            _assertJs["default"].string(linkKey, 'Link key is required');

            _assertJs["default"].string(linkdropMasterAddress, 'Linkdrop master address is requred');

            _assertJs["default"].string(linkdropSignerSignature, 'Linkdrop signer signature is required');

            _assertJs["default"].string(campaignId, 'Campaign id is required');

            _assertJs["default"].string(gnosisSafeMasterCopy, 'Gnosis safe mastercopy address is required');

            _assertJs["default"].string(proxyFactory, 'Proxy factory address is required');

            _assertJs["default"].string(owner, 'Owner is required');

            _assertJs["default"].string(apiHost, 'Api host is required');

            _assertJs["default"].string(ensName, 'Ens name is required');

            _assertJs["default"].string(saltNonce, 'Salt nonce is required');

            _assertJs["default"].string(guardian, 'Guardian address is required');

            _assertJs["default"].string(recoveryPeriod, 'Recovery period is required');

            _assertJs["default"].string(ensAddress, 'Ens address is required');

            _assertJs["default"].string(ensDomain, 'Ens domain is required');

            _assertJs["default"].string(gnosisSafeMasterCopy, 'Gnosis safe mastercopy address is required');

            _assertJs["default"].string(linkdropModuleMasterCopy, 'Linkdrop module mastercopy address is required');

            _assertJs["default"].string(recoveryModuleMasterCopy, 'Recovery module mastercopy address is required');

            _assertJs["default"].string(multiSend, 'MultiSend library address is required');

            _assertJs["default"].string(createAndAddModules, 'CreateAndAddModules library address is required');

            _assertJs["default"].string(jsonRpcUrl, 'Json rpc url is required');

            _assertJs["default"].string(apiHost, 'Api host is required');

            _assertJs["default"].string(email, 'Email is required');

            _context.next = 29;
            return (0, _ensUtils.getEnsOwner)({
              ensName: ensName,
              ensDomain: ensDomain,
              ensAddress: ensAddress,
              jsonRpcUrl: jsonRpcUrl
            });

          case 29:
            ensOwner = _context.sent;

            _assertJs["default"]["true"](ensOwner === ADDRESS_ZERO, 'Provided name already has an owner');

            safeAddress = (0, _precomputeSafeAddressWithModules.precomputeSafeAddressWithModules)({
              gnosisSafeMasterCopy: gnosisSafeMasterCopy,
              proxyFactory: proxyFactory,
              owner: owner,
              linkdropModuleMasterCopy: linkdropModuleMasterCopy,
              createAndAddModules: createAndAddModules,
              multiSend: multiSend,
              saltNonce: saltNonce,
              guardian: guardian,
              recoveryPeriod: recoveryPeriod,
              recoveryModuleMasterCopy: recoveryModuleMasterCopy
            });
            _context.next = 34;
            return (0, _utils.signReceiverAddress)(linkKey, safeAddress);

          case 34:
            receiverSignature = _context.sent;
            linkId = new _ethers.ethers.Wallet(linkKey).address;
            linkdropModule = (0, _computeLinkdropModuleAddress.computeLinkdropModuleAddress)({
              owner: owner,
              saltNonce: saltNonce,
              linkdropModuleMasterCopy: linkdropModuleMasterCopy,
              deployer: safeAddress
            });
            recoveryModule = (0, _computeRecoveryModuleAddress.computeRecoveryModuleAddress)({
              guardian: guardian,
              recoveryPeriod: recoveryPeriod,
              saltNonce: saltNonce,
              recoveryModuleMasterCopy: recoveryModuleMasterCopy,
              deployer: safeAddress
            });
            _context.next = 40;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes/claimAndCreate"), {
              owner: owner,
              saltNonce: saltNonce,
              ensName: ensName,
              guardian: guardian,
              recoveryPeriod: recoveryPeriod,
              gasPrice: '0',
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              linkId: linkId,
              linkdropMasterAddress: linkdropMasterAddress,
              campaignId: campaignId,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverSignature: receiverSignature,
              email: email
            });

          case 40:
            response = _context.sent;
            _response$data = response.data, success = _response$data.success, txHash = _response$data.txHash, errors = _response$data.errors;
            return _context.abrupt("return", {
              success: success,
              txHash: txHash,
              linkdropModule: linkdropModule,
              recoveryModule: recoveryModule,
              safe: safeAddress,
              creationCosts: '0',
              errors: errors
            });

          case 43:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function claimAndCreate(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.claimAndCreate = claimAndCreate;