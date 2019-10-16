"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractPrivateKeyFromSession = exports.login = exports.register = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _cryptoUtils = require("./cryptoUtils");

var _ethers = require("ethers");

var register =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var email, password, apiHost, encryptionKey, encryptedEncryptionKey, passwordHash, passwordDerivedKeyHash, wallet, mnemonic, iv, encryptedMnemonic, response, _response$data, account, jwt, sessionKey, success, error, sessionKeyStore;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = _ref.email, password = _ref.password, apiHost = _ref.apiHost;
            encryptionKey = (0, _cryptoUtils.generateEncryptionKey)();
            _context.next = 4;
            return (0, _cryptoUtils.getEncryptedEncryptionKey)(email, password, encryptionKey);

          case 4:
            encryptedEncryptionKey = _context.sent;
            _context.next = 7;
            return (0, _cryptoUtils.getPasswordHash)(email, password);

          case 7:
            passwordHash = _context.sent;
            _context.next = 10;
            return (0, _cryptoUtils.getPasswordDerivedKeyHash)(email, password);

          case 10:
            passwordDerivedKeyHash = _context.sent;
            wallet = _ethers.ethers.Wallet.createRandom();
            mnemonic = wallet.mnemonic;
            iv = (0, _cryptoUtils.generateIV)();
            _context.next = 16;
            return (0, _cryptoUtils.getEncryptedMnemonic)(mnemonic, encryptionKey, iv);

          case 16:
            encryptedMnemonic = _context.sent;
            _context.next = 19;
            return _axios["default"].post("".concat(apiHost, "/api/v1/accounts/register"), {
              email: email,
              passwordHash: passwordHash,
              passwordDerivedKeyHash: passwordDerivedKeyHash,
              encryptedEncryptionKey: encryptedEncryptionKey,
              encryptedMnemonic: encryptedMnemonic
            });

          case 19:
            response = _context.sent;
            _response$data = response.data, account = _response$data.account, jwt = _response$data.jwt, sessionKey = _response$data.sessionKey, success = _response$data.success, error = _response$data.error;
            _context.next = 23;
            return wallet.encrypt(sessionKey);

          case 23:
            sessionKeyStore = _context.sent;
            return _context.abrupt("return", {
              success: success,
              data: {
                privateKey: wallet.privateKey,
                sessionKeyStore: sessionKeyStore
              },
              error: error
            });

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function register(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.register = register;

var login =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var email, password, apiHost, passwordDerivedKey, passwordHash, response, _response$data2, encryptedEncryptionKey, encryptedMnemonic, jwt, sessionKey, success, error, encryptionKey, mnemonic, wallet, sessionKeyStore;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            email = _ref3.email, password = _ref3.password, apiHost = _ref3.apiHost;
            _context2.next = 3;
            return (0, _cryptoUtils.getPasswordDerivedKey)(email, password);

          case 3:
            passwordDerivedKey = _context2.sent;
            _context2.next = 6;
            return (0, _cryptoUtils.getPasswordHash)(email, password);

          case 6:
            passwordHash = _context2.sent;
            _context2.next = 9;
            return _axios["default"].post("".concat(apiHost, "/api/v1/accounts/login"), {
              email: email,
              passwordHash: passwordHash
            });

          case 9:
            response = _context2.sent;
            _response$data2 = response.data, encryptedEncryptionKey = _response$data2.encryptedEncryptionKey, encryptedMnemonic = _response$data2.encryptedMnemonic, jwt = _response$data2.jwt, sessionKey = _response$data2.sessionKey, success = _response$data2.success, error = _response$data2.error;
            _context2.next = 13;
            return (0, _cryptoUtils.extractEncryptionKey)(encryptedEncryptionKey.encryptedEncryptionKey, encryptedEncryptionKey.iv, passwordDerivedKey);

          case 13:
            encryptionKey = _context2.sent;
            _context2.next = 16;
            return (0, _cryptoUtils.extractMnemonic)(encryptedMnemonic.encryptedMnemonic, encryptedMnemonic.iv, encryptionKey);

          case 16:
            mnemonic = _context2.sent;
            wallet = _ethers.ethers.Wallet.fromMnemonic(mnemonic);
            _context2.next = 20;
            return wallet.encrypt(sessionKey);

          case 20:
            sessionKeyStore = _context2.sent;
            return _context2.abrupt("return", {
              success: success,
              data: {
                privateKey: wallet.privateKey,
                sessionKeyStore: sessionKeyStore
              },
              error: error
            });

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function login(_x2) {
    return _ref4.apply(this, arguments);
  };
}(); // @TODO Change path to the endpoint


exports.login = login;

var extractPrivateKeyFromSession =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(_ref5) {
    var email, sessionKeyStore, apiHost, sessionKey, wallet;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            email = _ref5.email, sessionKeyStore = _ref5.sessionKeyStore, apiHost = _ref5.apiHost;
            _context3.next = 3;
            return _axios["default"].get("".concat(apiHost, "/api/v1/session/").concat(email));

          case 3:
            sessionKey = _context3.sent;
            wallet = _ethers.ethers.Wallet.fromEncryptedJson(sessionKeyStore, sessionKey);
            return _context3.abrupt("return", wallet.privateKey);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function extractPrivateKeyFromSession(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.extractPrivateKeyFromSession = extractPrivateKeyFromSession;