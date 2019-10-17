"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claimAndCreateERC721 = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _computeSafeAddress = require("./computeSafeAddress");

var _ethers = require("ethers");

var _utils = require("./utils");

var _GnosisSafe = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe"));

var _ProxyFactory = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/ProxyFactory"));

var _MultiSend = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/MultiSend"));

var _CreateAndAddModules = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules"));

var _LinkdropModule = _interopRequireDefault(require("../../contracts/build/LinkdropModule"));

var _RecoveryModule = _interopRequireDefault(require("../../contracts/build/RecoveryModule.json"));

var _LinkdropFactory = _interopRequireDefault(require("@linkdrop/contracts/build/LinkdropFactory"));

var _computeLinkdropModuleAddress = require("./computeLinkdropModuleAddress");

var _computeRecoveryModuleAddress = require("./computeRecoveryModuleAddress");

var _ensUtils = require("./ensUtils");

var _ens = require("@ensdomains/ens");

var CALL_OP = 0;
var DELEGATECALL_OP = 1;
var ADDRESS_ZERO = _ethers.ethers.constants.AddressZero;
/**
 * Function to create new safe and claim linkdrop
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
 * @returns {Object} {success, txHash, safe, errors}
 */

var claimAndCreateERC721 =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, gnosisSafeMasterCopy, proxyFactory, owner, linkdropModuleMasterCopy, createAndAddModules, multiSend, apiHost, saltNonce, guardian, recoveryPeriod, recoveryModuleMasterCopy, gasPrice, ensName, ensDomain, ensAddress, jsonRpcUrl, linkdropFactory, email, ensOwner, provider, linkdropModuleSetupData, linkdropModuleCreationData, recoveryModuleSetupData, recoveryModuleCreationData, modulesCreationData, createAndAddModulesData, createAndAddModulesMultiSendData, nestedTxData, multiSendData, gnosisSafeData, createSafeData, estimate, creationCosts, createSafeMultiSendData, safe, registerEnsData, registrar, registerEnsMultiSendData, receiverSignature, linkId, claimData, claimMultiSendData, linkdropModule, recoveryModule, response, _response$data, success, txHash, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            weiAmount = _ref.weiAmount, nftAddress = _ref.nftAddress, tokenId = _ref.tokenId, expirationTime = _ref.expirationTime, linkKey = _ref.linkKey, linkdropMasterAddress = _ref.linkdropMasterAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, campaignId = _ref.campaignId, gnosisSafeMasterCopy = _ref.gnosisSafeMasterCopy, proxyFactory = _ref.proxyFactory, owner = _ref.owner, linkdropModuleMasterCopy = _ref.linkdropModuleMasterCopy, createAndAddModules = _ref.createAndAddModules, multiSend = _ref.multiSend, apiHost = _ref.apiHost, saltNonce = _ref.saltNonce, guardian = _ref.guardian, recoveryPeriod = _ref.recoveryPeriod, recoveryModuleMasterCopy = _ref.recoveryModuleMasterCopy, gasPrice = _ref.gasPrice, ensName = _ref.ensName, ensDomain = _ref.ensDomain, ensAddress = _ref.ensAddress, jsonRpcUrl = _ref.jsonRpcUrl, linkdropFactory = _ref.linkdropFactory, email = _ref.email;

            _assertJs["default"].string(weiAmount, 'Wei amount is required');

            _assertJs["default"].string(nftAddress, 'Nft address is required');

            _assertJs["default"].string(tokenId, 'Token id is required');

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

            _assertJs["default"].string(linkdropFactory, 'Linkdrop factory address is required');

            _assertJs["default"].string(email, 'Email is required');

            _context.next = 31;
            return (0, _ensUtils.getEnsOwner)({
              ensName: ensName,
              ensDomain: ensDomain,
              ensAddress: ensAddress,
              jsonRpcUrl: jsonRpcUrl
            });

          case 31:
            ensOwner = _context.sent;

            _assertJs["default"]["true"](ensOwner === ADDRESS_ZERO, 'Provided name already has an owner');

            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            linkdropModuleSetupData = (0, _utils.encodeParams)(_LinkdropModule["default"].abi, 'setup', [[owner]]);
            linkdropModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]);
            recoveryModuleSetupData = (0, _utils.encodeParams)(_RecoveryModule["default"].abi, 'setup', [[guardian], recoveryPeriod]);
            recoveryModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [recoveryModuleMasterCopy, recoveryModuleSetupData, saltNonce]);
            modulesCreationData = (0, _utils.encodeDataForCreateAndAddModules)([linkdropModuleCreationData, recoveryModuleCreationData]);
            createAndAddModulesData = (0, _utils.encodeParams)(_CreateAndAddModules["default"].abi, 'createAndAddModules', [proxyFactory, modulesCreationData]);
            createAndAddModulesMultiSendData = (0, _utils.encodeDataForMultiSend)(DELEGATECALL_OP, createAndAddModules, 0, createAndAddModulesData);
            nestedTxData = '0x' + createAndAddModulesMultiSendData;
            multiSendData = (0, _utils.encodeParams)(_MultiSend["default"].abi, 'multiSend', [nestedTxData]);
            gnosisSafeData = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'setup', [[owner], // owners
            1, // threshold
            multiSend, // to
            multiSendData, // data,
            ADDRESS_ZERO, // payment token address
            0, // payment amount
            ADDRESS_ZERO // payment receiver address
            ]);
            createSafeData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [gnosisSafeMasterCopy, gnosisSafeData, saltNonce]);
            _context.t0 = gasPrice;

            if (_context.t0) {
              _context.next = 50;
              break;
            }

            _context.next = 49;
            return provider.getGasPrice();

          case 49:
            _context.t0 = _context.sent.toNumber();

          case 50:
            gasPrice = _context.t0;
            _context.next = 53;
            return provider.estimateGas({
              to: proxyFactory,
              data: createSafeData,
              gasPrice: gasPrice
            });

          case 53:
            estimate = _context.sent.add(104000);
            creationCosts = estimate.mul(gasPrice);
            gnosisSafeData = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'setup', [[owner], // owners
            1, // threshold
            multiSend, // to
            multiSendData, // data,
            ADDRESS_ZERO, // payment token address
            creationCosts, // payment amount
            ADDRESS_ZERO // payment receiver address
            ]);
            createSafeData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [gnosisSafeMasterCopy, gnosisSafeData, saltNonce]);
            createSafeMultiSendData = (0, _utils.encodeDataForMultiSend)(CALL_OP, proxyFactory, 0, createSafeData);
            safe = (0, _computeSafeAddress.computeSafeAddress)({
              owner: owner,
              saltNonce: saltNonce,
              gnosisSafeMasterCopy: gnosisSafeMasterCopy,
              deployer: proxyFactory,
              to: multiSend,
              data: multiSendData,
              paymentAmount: creationCosts.toString()
            });
            registerEnsData = (0, _utils.encodeParams)(_ens.FIFSRegistrar.abi, 'register', [_ethers.ethers.utils.keccak256(_ethers.ethers.utils.toUtf8Bytes(ensName)), safe]);
            _context.next = 62;
            return (0, _ensUtils.getEnsOwner)({
              ensAddress: ensAddress,
              ensDomain: ensDomain,
              jsonRpcUrl: jsonRpcUrl
            });

          case 62:
            registrar = _context.sent;
            registerEnsMultiSendData = (0, _utils.encodeDataForMultiSend)(CALL_OP, registrar, 0, registerEnsData);
            _context.next = 66;
            return (0, _utils.signReceiverAddress)(linkKey, safe);

          case 66:
            receiverSignature = _context.sent;
            linkId = new _ethers.ethers.Wallet(linkKey).address;
            claimData = (0, _utils.encodeParams)(_LinkdropFactory["default"].abi, 'claimERC721', [weiAmount, nftAddress, tokenId, expirationTime, linkId, linkdropMasterAddress, campaignId, linkdropSignerSignature, safe, receiverSignature]);
            claimMultiSendData = (0, _utils.encodeDataForMultiSend)(CALL_OP, linkdropFactory, 0, claimData);
            nestedTxData = '0x' + claimMultiSendData + createSafeMultiSendData + registerEnsMultiSendData;
            multiSendData = (0, _utils.encodeParams)(_MultiSend["default"].abi, 'multiSend', [nestedTxData]);
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
            _context.next = 76;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes/claimAndCreateERC721"), {
              owner: owner,
              saltNonce: saltNonce,
              ensName: ensName,
              guardian: guardian,
              recoveryPeriod: recoveryPeriod,
              gasPrice: gasPrice,
              weiAmount: weiAmount,
              nftAddress: nftAddress,
              tokenId: tokenId,
              expirationTime: expirationTime,
              linkId: linkId,
              linkdropMasterAddress: linkdropMasterAddress,
              campaignId: campaignId,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverSignature: receiverSignature,
              email: email
            });

          case 76:
            response = _context.sent;
            _response$data = response.data, success = _response$data.success, txHash = _response$data.txHash, errors = _response$data.errors;
            return _context.abrupt("return", {
              success: success,
              txHash: txHash,
              linkdropModule: linkdropModule,
              recoveryModule: recoveryModule,
              safe: safe,
              creationCosts: creationCosts.toString(),
              errors: errors
            });

          case 79:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function claimAndCreateERC721(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.claimAndCreateERC721 = claimAndCreateERC721;