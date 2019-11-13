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

var _computeSafeAddress = require("./computeSafeAddress");

var _computeLinkdropModuleAddress = require("./computeLinkdropModuleAddress");

var _computeRecoveryModuleAddress = require("./computeRecoveryModuleAddress");

var _ensUtils = require("./ensUtils");

var _signTx = require("./signTx");

var _GnosisSafe = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe"));

var _ProxyFactory = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/ProxyFactory"));

var _CreateAndAddModules = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules"));

var _LinkdropModule = _interopRequireDefault(require("@linkdrop-widget/contracts/build/LinkdropModule"));

var _RecoveryModule = _interopRequireDefault(require("@linkdrop-widget/contracts/build/RecoveryModule"));

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
 * @returns {Object} {success, txHash, safe, errors}
 */

var claimAndCreate =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, gnosisSafeMasterCopy, proxyFactory, privateKey, linkdropModuleMasterCopy, createAndAddModules, multiSend, apiHost, saltNonce, guardian, recoveryPeriod, recoveryModuleMasterCopy, gasPrice, ensName, ensDomain, ensAddress, jsonRpcUrl, email, ensOwner, provider, owner, gnosisSafeData, createSafeData, estimate, creationCosts, safe, linkdropModule, recoveryModule, receiverSignature, linkId, linkdropModuleSetupData, linkdropModuleCreationData, recoveryModuleSetupData, recoveryModuleCreationData, modulesCreationData, createAndAddModulesData, signature, createAndAddModulesSafeTxData, response, _response$data, success, txHash, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, linkKey = _ref.linkKey, linkdropMasterAddress = _ref.linkdropMasterAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, campaignId = _ref.campaignId, gnosisSafeMasterCopy = _ref.gnosisSafeMasterCopy, proxyFactory = _ref.proxyFactory, privateKey = _ref.privateKey, linkdropModuleMasterCopy = _ref.linkdropModuleMasterCopy, createAndAddModules = _ref.createAndAddModules, multiSend = _ref.multiSend, apiHost = _ref.apiHost, saltNonce = _ref.saltNonce, guardian = _ref.guardian, recoveryPeriod = _ref.recoveryPeriod, recoveryModuleMasterCopy = _ref.recoveryModuleMasterCopy, gasPrice = _ref.gasPrice, ensName = _ref.ensName, ensDomain = _ref.ensDomain, ensAddress = _ref.ensAddress, jsonRpcUrl = _ref.jsonRpcUrl, email = _ref.email;

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

            _assertJs["default"].string(privateKey, 'Private key is required');

            _assertJs["default"].string(apiHost, 'Api host is required');

            _assertJs["default"].string(ensName, 'Ens name is required');

            _assertJs["default"].string(saltNonce, 'Salt nonce is required');

            _assertJs["default"].string(gasPrice, 'Gas price is required');

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

            _context.next = 30;
            return (0, _ensUtils.getEnsOwner)({
              ensName: ensName,
              ensDomain: ensDomain,
              ensAddress: ensAddress,
              jsonRpcUrl: jsonRpcUrl
            });

          case 30:
            ensOwner = _context.sent;

            _assertJs["default"]["true"](ensOwner === ADDRESS_ZERO, 'Provided name already has an owner');

            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            owner = new _ethers.ethers.Wallet(privateKey).address;
            gnosisSafeData = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'setup', [[owner], // owners
            1, // threshold
            ADDRESS_ZERO, // to
            '0x', // data,
            ADDRESS_ZERO, // payment token address
            0, // payment amount
            ADDRESS_ZERO // payment receiver address
            ]);
            createSafeData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [gnosisSafeMasterCopy, gnosisSafeData, saltNonce]);
            _context.next = 38;
            return provider.estimateGas({
              to: proxyFactory,
              data: createSafeData,
              gasPrice: gasPrice
            });

          case 38:
            estimate = _context.sent.add(104000);
            creationCosts = estimate.mul(gasPrice);
            gnosisSafeData = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'setup', [[owner], // owners
            1, // threshold
            ADDRESS_ZERO, // to
            '0x', // data,
            ADDRESS_ZERO, // payment token address
            creationCosts, // payment amount
            ADDRESS_ZERO // payment receiver address
            ]);
            createSafeData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [gnosisSafeMasterCopy, gnosisSafeData, saltNonce]);
            safe = (0, _computeSafeAddress.computeSafeAddress)({
              owner: owner,
              saltNonce: saltNonce,
              gnosisSafeMasterCopy: gnosisSafeMasterCopy,
              deployer: proxyFactory,
              to: ADDRESS_ZERO,
              data: '0x',
              paymentAmount: creationCosts.toString()
            });
            linkdropModule = (0, _computeLinkdropModuleAddress.computeLinkdropModuleAddress)({
              owner: owner,
              saltNonce: saltNonce,
              linkdropModuleMasterCopy: linkdropModuleMasterCopy,
              deployer: safe
            });
            recoveryModule = (0, _computeRecoveryModuleAddress.computeRecoveryModuleAddress)({
              guardian: guardian,
              recoveryPeriod: recoveryPeriod,
              saltNonce: saltNonce,
              recoveryModuleMasterCopy: recoveryModuleMasterCopy,
              deployer: safe
            });
            _context.next = 47;
            return (0, _utils.signReceiverAddress)(linkKey, safe);

          case 47:
            receiverSignature = _context.sent;
            linkId = new _ethers.ethers.Wallet(linkKey).address;
            linkdropModuleSetupData = (0, _utils.encodeParams)(_LinkdropModule["default"].abi, 'setup', [[owner]]);
            linkdropModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]);
            recoveryModuleSetupData = (0, _utils.encodeParams)(_RecoveryModule["default"].abi, 'setup', [[guardian], recoveryPeriod]);
            recoveryModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [recoveryModuleMasterCopy, recoveryModuleSetupData, saltNonce]);
            modulesCreationData = (0, _utils.encodeDataForCreateAndAddModules)([linkdropModuleCreationData, recoveryModuleCreationData]);
            createAndAddModulesData = (0, _utils.encodeParams)(_CreateAndAddModules["default"].abi, 'createAndAddModules', [proxyFactory, modulesCreationData]);
            signature = (0, _signTx.signTx)({
              safe: safe,
              privateKey: privateKey,
              to: createAndAddModules,
              value: '0',
              data: createAndAddModulesData,
              operation: '1',
              // delegatecall
              safeTxGas: '0',
              baseGas: '0',
              gasPrice: '0',
              gasToken: ADDRESS_ZERO,
              refundReceiver: ADDRESS_ZERO,
              nonce: '0'
            });
            createAndAddModulesSafeTxData = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'execTransaction', [createAndAddModules, 0, createAndAddModulesData, 1, 0, 0, 0, ADDRESS_ZERO, ADDRESS_ZERO, signature]);
            _context.next = 59;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes/claimAndCreate"), {
              owner: owner,
              saltNonce: saltNonce,
              ensName: ensName,
              guardian: guardian,
              recoveryPeriod: recoveryPeriod,
              gasPrice: gasPrice,
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              linkId: linkId,
              linkdropMasterAddress: linkdropMasterAddress,
              campaignId: campaignId,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverSignature: receiverSignature,
              email: email,
              createAndAddModulesSafeTxData: createAndAddModulesSafeTxData
            });

          case 59:
            response = _context.sent;
            _response$data = response.data, success = _response$data.success, txHash = _response$data.txHash, errors = _response$data.errors;
            return _context.abrupt("return", {
              success: success,
              txHash: txHash,
              linkdropModule: linkdropModule,
              recoveryModule: recoveryModule,
              safe: safe,
              creationCosts: creationCosts,
              errors: errors
            });

          case 62:
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