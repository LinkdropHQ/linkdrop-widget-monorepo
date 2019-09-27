"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxyCreationCode = exports.computeLinkdropModuleAddress = void 0;

var _LinkdropModule = _interopRequireDefault(require("@linkdrop/safe-module-contracts/build/LinkdropModule"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _ethers = require("ethers");

var _utils = require("./utils");

_ethers.ethers.errors.setLogLevel('error');

var ADDRESS_ZERO = _ethers.ethers.constants.AddressZero;
var BYTES_ZERO = '0x';
/**
 * Function to precompute linkdrop module address
 * @param {String} owner Safe owner's address
 * @param {Number} saltNonce Random salt nonce
 * @param {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
 * @param {String} deployer Deployer address
 */

var computeLinkdropModuleAddress = function computeLinkdropModuleAddress(_ref) {
  var owner = _ref.owner,
      saltNonce = _ref.saltNonce,
      linkdropModuleMasterCopy = _ref.linkdropModuleMasterCopy,
      deployer = _ref.deployer;

  _assertJs["default"].string(owner, 'Owner address is required');

  _assertJs["default"].integer(saltNonce, 'Salt nonce is required');

  _assertJs["default"].string(linkdropModuleMasterCopy, 'Linkdrop module mastercopy address is required');

  _assertJs["default"].string(deployer, 'Deployer address is required');

  var linkdropModuleData = (0, _utils.encodeParams)(_LinkdropModule["default"].abi, 'setup', [[owner]]);

  var constructorData = _ethers.ethers.utils.defaultAbiCoder.encode(['address'], [linkdropModuleMasterCopy]);

  var encodedNonce = _ethers.ethers.utils.defaultAbiCoder.encode(['uint256'], [saltNonce]);

  var salt = _ethers.ethers.utils.keccak256(_ethers.ethers.utils.keccak256(linkdropModuleData) + encodedNonce.slice(2));

  var initcode = proxyCreationCode + constructorData.slice(2);
  return (0, _utils.buildCreate2Address)(deployer, salt, initcode);
};

exports.computeLinkdropModuleAddress = computeLinkdropModuleAddress;
var proxyCreationCode = '0x608060405234801561001057600080fd5b506040516020806101a88339810180604052602081101561003057600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806101846024913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050606e806101166000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054163660008037600080366000845af43d6000803e6000811415603d573d6000fd5b3d6000f3fea165627a7a723058201e7d648b83cfac072cbccefc2ffc62a6999d4a050ee87a721942de1da9670db80029496e76616c6964206d617374657220636f707920616464726573732070726f7669646564';
exports.proxyCreationCode = proxyCreationCode;