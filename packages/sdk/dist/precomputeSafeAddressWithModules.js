"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.precomputeSafeAddressWithModules = void 0;

var _assertJs = _interopRequireDefault(require("assert-js"));

var _computeSafeAddress = require("./computeSafeAddress");

var _utils = require("./utils");

var _ProxyFactory = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/ProxyFactory"));

var _MultiSend = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/MultiSend"));

var _CreateAndAddModules = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules"));

var _LinkdropModule = _interopRequireDefault(require("../../contracts/build/LinkdropModule"));

var _RecoveryModule = _interopRequireDefault(require("../../contracts/build/RecoveryModule.json"));

var DELEGATECALL_OP = 1;
/**
 * Function to precompute Safe address with specific params and gas price 0
 * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
 * @param {String} proxyFactory Deployed proxy factory address
 * @param {String} owner Safe owner address
 * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address
 * @param {String} createAndAddModules Deployed createAndAddModules library address
 * @param {String} multiSend Deployed multiSend library address
 * @param {String} saltNonce Random salt nonce
 * @param {String} guardian Guardian address
 * @param {String} recoveryPeriod Recovery period
 * @param {String} recoveryModuleMasterCopy Deployed recovery moduel mastercopy address
 * @returns {String} safeAddress
 */

var precomputeSafeAddressWithModules = function precomputeSafeAddressWithModules(_ref) {
  var gnosisSafeMasterCopy = _ref.gnosisSafeMasterCopy,
      proxyFactory = _ref.proxyFactory,
      owner = _ref.owner,
      linkdropModuleMasterCopy = _ref.linkdropModuleMasterCopy,
      createAndAddModules = _ref.createAndAddModules,
      multiSend = _ref.multiSend,
      saltNonce = _ref.saltNonce,
      guardian = _ref.guardian,
      recoveryPeriod = _ref.recoveryPeriod,
      recoveryModuleMasterCopy = _ref.recoveryModuleMasterCopy;

  _assertJs["default"].string(gnosisSafeMasterCopy, 'Gnosis safe mastercopy address is required');

  _assertJs["default"].string(proxyFactory, 'Proxy factory address is required');

  _assertJs["default"].string(owner, 'Owner is required');

  _assertJs["default"].string(saltNonce, 'Salt nonce is required');

  _assertJs["default"].string(guardian, 'Guardian address is required');

  _assertJs["default"].string(recoveryPeriod, 'Recovery period is required');

  _assertJs["default"].string(gnosisSafeMasterCopy, 'Gnosis safe mastercopy address is required');

  _assertJs["default"].string(linkdropModuleMasterCopy, 'Linkdrop module mastercopy address is required');

  _assertJs["default"].string(recoveryModuleMasterCopy, 'Recovery module mastercopy address is required');

  _assertJs["default"].string(multiSend, 'MultiSend library address is required');

  _assertJs["default"].string(createAndAddModules, 'CreateAndAddModules library address is required');

  var linkdropModuleSetupData = (0, _utils.encodeParams)(_LinkdropModule["default"].abi, 'setup', [[owner]]);
  var linkdropModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]);
  var recoveryModuleSetupData = (0, _utils.encodeParams)(_RecoveryModule["default"].abi, 'setup', [[guardian], recoveryPeriod]);
  var recoveryModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [recoveryModuleMasterCopy, recoveryModuleSetupData, saltNonce]);
  var modulesCreationData = (0, _utils.encodeDataForCreateAndAddModules)([linkdropModuleCreationData, recoveryModuleCreationData]);
  var createAndAddModulesData = (0, _utils.encodeParams)(_CreateAndAddModules["default"].abi, 'createAndAddModules', [proxyFactory, modulesCreationData]);
  var createAndAddModulesMultiSendData = (0, _utils.encodeDataForMultiSend)(DELEGATECALL_OP, createAndAddModules, 0, createAndAddModulesData);
  var nestedTxData = '0x' + createAndAddModulesMultiSendData;
  var multiSendData = (0, _utils.encodeParams)(_MultiSend["default"].abi, 'multiSend', [nestedTxData]);
  var safe = (0, _computeSafeAddress.computeSafeAddress)({
    owner: owner,
    saltNonce: saltNonce,
    gnosisSafeMasterCopy: gnosisSafeMasterCopy,
    deployer: proxyFactory,
    to: multiSend,
    data: multiSendData,
    paymentAmount: '0'
  });
  return safe;
};

exports.precomputeSafeAddressWithModules = precomputeSafeAddressWithModules;