"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.precomputeSafeAddressWithModules = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _computeSafeAddress = require("./computeSafeAddress");

var _ethers = require("ethers");

var _utils = require("./utils");

var _ProxyFactory = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/ProxyFactory"));

var _MultiSend = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/MultiSend"));

var _CreateAndAddModules = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules"));

var _LinkdropModule = _interopRequireDefault(require("../../contracts/build/LinkdropModule"));

var _RecoveryModule = _interopRequireDefault(require("../../contracts/build/RecoveryModule.json"));

var DELEGATECALL_OP = 1;

var precomputeSafeAddressWithModules =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var gnosisSafeMasterCopy, proxyFactory, owner, linkdropModuleMasterCopy, createAndAddModules, multiSend, saltNonce, guardian, recoveryPeriod, recoveryModuleMasterCopy, linkdropModuleSetupData, linkdropModuleCreationData, recoveryModuleSetupData, recoveryModuleCreationData, modulesCreationData, createAndAddModulesData, createAndAddModulesMultiSendData, nestedTxData, multiSendData, safe;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gnosisSafeMasterCopy = _ref.gnosisSafeMasterCopy, proxyFactory = _ref.proxyFactory, owner = _ref.owner, linkdropModuleMasterCopy = _ref.linkdropModuleMasterCopy, createAndAddModules = _ref.createAndAddModules, multiSend = _ref.multiSend, saltNonce = _ref.saltNonce, guardian = _ref.guardian, recoveryPeriod = _ref.recoveryPeriod, recoveryModuleMasterCopy = _ref.recoveryModuleMasterCopy;

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

            linkdropModuleSetupData = (0, _utils.encodeParams)(_LinkdropModule["default"].abi, 'setup', [[owner]]);
            linkdropModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]);
            recoveryModuleSetupData = (0, _utils.encodeParams)(_RecoveryModule["default"].abi, 'setup', [[guardian], recoveryPeriod]);
            recoveryModuleCreationData = (0, _utils.encodeParams)(_ProxyFactory["default"].abi, 'createProxyWithNonce', [recoveryModuleMasterCopy, recoveryModuleSetupData, saltNonce]);
            modulesCreationData = (0, _utils.encodeDataForCreateAndAddModules)([linkdropModuleCreationData, recoveryModuleCreationData]);
            createAndAddModulesData = (0, _utils.encodeParams)(_CreateAndAddModules["default"].abi, 'createAndAddModules', [proxyFactory, modulesCreationData]);
            createAndAddModulesMultiSendData = (0, _utils.encodeDataForMultiSend)(DELEGATECALL_OP, createAndAddModules, 0, createAndAddModulesData);
            nestedTxData = '0x' + createAndAddModulesMultiSendData;
            multiSendData = (0, _utils.encodeParams)(_MultiSend["default"].abi, 'multiSend', [nestedTxData]);
            safe = (0, _computeSafeAddress.computeSafeAddress)({
              owner: owner,
              saltNonce: saltNonce,
              gnosisSafeMasterCopy: gnosisSafeMasterCopy,
              deployer: proxyFactory,
              to: multiSend,
              data: multiSendData,
              paymentAmount: '0'
            });
            return _context.abrupt("return", safe);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function precomputeSafeAddressWithModules(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.precomputeSafeAddressWithModules = precomputeSafeAddressWithModules;