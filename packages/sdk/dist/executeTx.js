"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTx = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _ethers = require("ethers");

var _signTx = require("./signTx");

var _GnosisSafe = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe"));

var _estimateTxGas = require("./estimateTxGas");

var _utils = require("./utils");

var getGasSpectrum =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, safe, privateKey, to, value, data, operation, gasToken, refundReceiver, provider, gnosisSafe, nonce, gasSpectrum, i, estimateData, tx, estimate;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, safe = _ref.safe, privateKey = _ref.privateKey, to = _ref.to, value = _ref.value, data = _ref.data, operation = _ref.operation, gasToken = _ref.gasToken, refundReceiver = _ref.refundReceiver;
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            gnosisSafe = new _ethers.ethers.Contract(safe, _GnosisSafe["default"].abi, provider);
            _context.next = 5;
            return gnosisSafe.nonce();

          case 5:
            nonce = _context.sent.toString();
            _context.next = 8;
            return (0, _estimateTxGas.estimateGasCosts)({
              jsonRpcUrl: jsonRpcUrl,
              safe: safe,
              to: to,
              value: value,
              data: data,
              operation: operation,
              gasToken: gasToken,
              refundReceiver: refundReceiver,
              signatureCount: 1
            });

          case 8:
            gasSpectrum = _context.sent;
            i = 0;

          case 10:
            if (!(i < gasSpectrum.length)) {
              _context.next = 23;
              break;
            }

            _context.next = 13;
            return (0, _signTx.signTx)({
              safe: safe,
              privateKey: privateKey,
              to: to,
              value: value,
              data: data,
              operation: operation,
              safeTxGas: gasSpectrum[i].safeTxGas.toString(),
              baseGas: gasSpectrum[i].baseGas.toString(),
              gasPrice: gasSpectrum[i].gasPrice.toString(),
              gasToken: gasToken,
              refundReceiver: refundReceiver,
              nonce: nonce
            });

          case 13:
            gasSpectrum[i].signature = _context.sent;
            estimateData = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'execTransaction', [to, value, data, operation, gasSpectrum[i].safeTxGas, gasSpectrum[i].baseGas, gasSpectrum[i].gasPrice, gasToken, refundReceiver, gasSpectrum[i].signature]);
            tx = {
              from: new _ethers.ethers.Wallet(privateKey).address,
              to: safe,
              data: estimateData,
              gasPrice: gasSpectrum[i].gasPrice
            };
            _context.next = 18;
            return provider.estimateGas(tx);

          case 18:
            estimate = _context.sent;
            // Add the txGasEstimate and an additional 10k to the estimate to ensure that there is enough gas for the safe transaction
            gasSpectrum[i].gasLimit = +estimate + gasSpectrum[i].safeTxGas + 100000;

          case 20:
            i++;
            _context.next = 10;
            break;

          case 23:
            return _context.abrupt("return", gasSpectrum);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getGasSpectrum(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Function to execute safe transaction
 * @param {String} apiHost API host
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} safe Safe address
 * @param {String} privateKey Safe owner's private key
 * @param {String} to To
 * @param {String} value Value
 * @param {String} data Data
 * @param {String} operation Operation
 * @param {String} safeTxGas Safe tx gas
 * @param {String} baseGas Base gas
 * @param {String} gasPrice Gas price
 * @param {String} gasToken Gas token
 * @param {String} refundReceiver Refund receiver
 * @returns {Object} {success, txHash, errors}
 */


var executeTx =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var apiHost, jsonRpcUrl, safe, privateKey, to, value, data, operation, gasToken, refundReceiver, gasSpectrum, response, _response$data, success, txHash, errors;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            apiHost = _ref3.apiHost, jsonRpcUrl = _ref3.jsonRpcUrl, safe = _ref3.safe, privateKey = _ref3.privateKey, to = _ref3.to, value = _ref3.value, data = _ref3.data, operation = _ref3.operation, gasToken = _ref3.gasToken, refundReceiver = _ref3.refundReceiver;

            _assertJs["default"].url(apiHost, 'Api host is required');

            _assertJs["default"].url(jsonRpcUrl, 'Json rpc url is required');

            _assertJs["default"].string(safe, 'Safe address is required');

            _assertJs["default"].string(privateKey, 'Private key is required');

            _assertJs["default"].string(to, 'To is required');

            _assertJs["default"].string(value, 'Value is required');

            _assertJs["default"].string(data, 'Data is required');

            _assertJs["default"].string(gasToken, 'Gas token is required');

            _assertJs["default"].string(refundReceiver, 'Refund receiver address is required');

            _context2.next = 12;
            return getGasSpectrum({
              jsonRpcUrl: jsonRpcUrl,
              safe: safe,
              privateKey: privateKey,
              to: to,
              value: value,
              data: data,
              operation: operation,
              gasToken: gasToken,
              refundReceiver: refundReceiver
            });

          case 12:
            gasSpectrum = _context2.sent;
            _context2.next = 15;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes/execute"), {
              safe: safe,
              to: to,
              value: value,
              data: data,
              operation: operation,
              gasToken: gasToken,
              refundReceiver: refundReceiver,
              gasSpectrum: gasSpectrum
            });

          case 15:
            response = _context2.sent;
            _response$data = response.data, success = _response$data.success, txHash = _response$data.txHash, errors = _response$data.errors;
            return _context2.abrupt("return", {
              success: success,
              txHash: txHash,
              errors: errors
            });

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function executeTx(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.executeTx = executeTx;