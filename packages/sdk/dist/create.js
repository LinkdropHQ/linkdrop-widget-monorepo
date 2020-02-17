"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _computeSafeAddress = require("./computeSafeAddress");

var _ethers = require("ethers");

var _utils = require("./utils");

var _signTx = require("./signTx");

var _GnosisSafe = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe"));

var _ProxyFactory = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/ProxyFactory"));

var _CreateAndAddModules = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules"));

var _LinkdropModule = _interopRequireDefault(require("@linkdrop-widget/contracts/build/LinkdropModule"));

var _RecoveryModule = _interopRequireDefault(require("@linkdrop-widget/contracts/build/RecoveryModule.json"));

var _computeLinkdropModuleAddress = require("./computeLinkdropModuleAddress");

var _computeRecoveryModuleAddress = require("./computeRecoveryModuleAddress");

var _ensUtils = require("./ensUtils");

var ADDRESS_ZERO = _ethers.ethers.constants.AddressZero;
/**
 * @param  {String} privateKey Owner's private key
 * @param  {String} ensName Ens name
 * @param  {String} saltNonce Random salt nonce
 * @param  {String} recoveryPeriod Recovery period in atomic units (seconds)
 * @param  {String} gasPrice Gas price in wei
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
 * @param {String} gasPrice Gas price in wei
 * @param {String} email Email
 */

var create =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(_ref) {
    var privateKey, ensName, ensAddress, ensDomain, saltNonce, guardian, recoveryPeriod, jsonRpcUrl, apiHost, gnosisSafeMasterCopy, proxyFactory, linkdropModuleMasterCopy, recoveryModuleMasterCopy, multiSend, createAndAddModules, gasPrice, email, provider, owner, gnosisSafeData, createSafeData, estimate, creationCosts, safe, linkdropModule, recoveryModule, linkdropModuleSetupData, linkdropModuleCreationData, recoveryModuleSetupData, recoveryModuleCreationData, modulesCreationData, createAndAddModulesData, signature, createAndAddModulesSafeTxData, waitForBalance, deploy;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            privateKey = _ref.privateKey, ensName = _ref.ensName, ensAddress = _ref.ensAddress, ensDomain = _ref.ensDomain, saltNonce = _ref.saltNonce, guardian = _ref.guardian, recoveryPeriod = _ref.recoveryPeriod, jsonRpcUrl = _ref.jsonRpcUrl, apiHost = _ref.apiHost, gnosisSafeMasterCopy = _ref.gnosisSafeMasterCopy, proxyFactory = _ref.proxyFactory, linkdropModuleMasterCopy = _ref.linkdropModuleMasterCopy, recoveryModuleMasterCopy = _ref.recoveryModuleMasterCopy, multiSend = _ref.multiSend, createAndAddModules = _ref.createAndAddModules, gasPrice = _ref.gasPrice, email = _ref.email;

            _assertJs["default"].string(privateKey, 'Private key is required');

            _assertJs["default"].string(ensName, 'Ens name is required');

            _assertJs["default"].string(saltNonce, 'Salt nonce is required');

            _assertJs["default"].string(gasPrice, 'Gas price is required');

            _assertJs["default"].string(guardian, 'Guardian address is required');

            _assertJs["default"].string(recoveryPeriod, 'Recovery period is required');

            _assertJs["default"].string(ensAddress, 'Ens address is required');

            _assertJs["default"].string(ensDomain, 'Ens domain is required');

            _assertJs["default"].string(gnosisSafeMasterCopy, 'Gnosis safe mastercopy address is required');

            _assertJs["default"].string(proxyFactory, 'Proxy factory address is required');

            _assertJs["default"].string(linkdropModuleMasterCopy, 'Linkdrop module mastercopy address is required');

            _assertJs["default"].string(recoveryModuleMasterCopy, 'Recovery module mastercopy address is required');

            _assertJs["default"].string(multiSend, 'MultiSend library address is required');

            _assertJs["default"].string(createAndAddModules, 'CreateAndAddModules library address is required');

            _assertJs["default"].string(jsonRpcUrl, 'Json rpc url is required');

            _assertJs["default"].string(apiHost, 'Api host is required');

            _assertJs["default"].string(gasPrice, 'Gas price is required');

            _assertJs["default"].string(email, 'Email is required');

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
            _context3.next = 25;
            return provider.estimateGas({
              to: proxyFactory,
              data: createSafeData,
              gasPrice: gasPrice
            });

          case 25:
            estimate = _context3.sent.add(9000);
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

            waitForBalance =
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee() {
                var balance;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return provider.getBalance(safe);

                      case 2:
                        balance = _context.sent;
                        return _context.abrupt("return", new Promise(function (resolve) {
                          if (balance.gte(creationCosts)) {
                            resolve();
                          }

                          provider.on(safe, function (balance) {
                            if (balance.gte(creationCosts)) {
                              resolve();
                            }
                          });
                        }));

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function waitForBalance() {
                return _ref3.apply(this, arguments);
              };
            }();

            deploy =
            /*#__PURE__*/
            function () {
              var _ref4 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee2() {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.abrupt("return", deployWallet({
                          owner: owner,
                          saltNonce: saltNonce,
                          ensName: ensName,
                          guardian: guardian,
                          recoveryPeriod: recoveryPeriod,
                          gasPrice: gasPrice,
                          ensDomain: ensDomain,
                          ensAddress: ensAddress,
                          apiHost: apiHost,
                          jsonRpcUrl: jsonRpcUrl,
                          email: email,
                          createAndAddModulesSafeTxData: createAndAddModulesSafeTxData
                        }));

                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function deploy() {
                return _ref4.apply(this, arguments);
              };
            }();

            return _context3.abrupt("return", {
              safe: safe,
              linkdropModule: linkdropModule,
              recoveryModule: recoveryModule,
              creationCosts: creationCosts.toString(),
              waitForBalance: waitForBalance,
              deploy: deploy
            });

          case 43:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function create(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Function to deploy new safe
 * @param {String} owner Safe owner address
 * @param {String} ensName ENS name to register
 * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth')
 * @param {String} ensAddress ENS address
 * @param {String} data Creation data
 * @param {String} gasPrice Gas price in wei
 * @param {String} apiHost API host
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} email Email
 * @param {String} createAndAddModulesSafeTxData Data to be sent via Safe tx to CreateAndAddModules library
 * @returns {Object} {success, txHash, errors}
 */


exports.create = create;

var deployWallet =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(_ref5) {
    var owner, saltNonce, ensName, guardian, recoveryPeriod, gasPrice, ensDomain, ensAddress, apiHost, jsonRpcUrl, email, createAndAddModulesSafeTxData, ensOwner, response, _response$data, success, txHash, safe, linkdropModule, recoveryModule, errors;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            owner = _ref5.owner, saltNonce = _ref5.saltNonce, ensName = _ref5.ensName, guardian = _ref5.guardian, recoveryPeriod = _ref5.recoveryPeriod, gasPrice = _ref5.gasPrice, ensDomain = _ref5.ensDomain, ensAddress = _ref5.ensAddress, apiHost = _ref5.apiHost, jsonRpcUrl = _ref5.jsonRpcUrl, email = _ref5.email, createAndAddModulesSafeTxData = _ref5.createAndAddModulesSafeTxData;
            _context4.prev = 1;
            _context4.next = 4;
            return (0, _ensUtils.getEnsOwner)({
              ensName: ensName,
              ensDomain: ensDomain,
              ensAddress: ensAddress,
              jsonRpcUrl: jsonRpcUrl
            });

          case 4:
            ensOwner = _context4.sent;

            _assertJs["default"]["true"](ensOwner === ADDRESS_ZERO, 'Provided name already has an owner');

            _context4.next = 8;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes"), {
              owner: owner,
              saltNonce: saltNonce,
              ensName: ensName,
              guardian: guardian,
              recoveryPeriod: recoveryPeriod,
              gasPrice: gasPrice,
              createAndAddModulesSafeTxData: createAndAddModulesSafeTxData,
              email: email
            });

          case 8:
            response = _context4.sent;
            _response$data = response.data, success = _response$data.success, txHash = _response$data.txHash, safe = _response$data.safe, linkdropModule = _response$data.linkdropModule, recoveryModule = _response$data.recoveryModule, errors = _response$data.errors;
            return _context4.abrupt("return", {
              success: success,
              txHash: txHash,
              safe: safe,
              linkdropModule: linkdropModule,
              recoveryModule: recoveryModule,
              errors: errors
            });

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](1);
            return _context4.abrupt("return", {
              success: false,
              errors: _context4.t0.message || _context4.t0
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 13]]);
  }));

  return function deployWallet(_x2) {
    return _ref6.apply(this, arguments);
  };
}();