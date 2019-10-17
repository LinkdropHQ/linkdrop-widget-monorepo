"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDeployed = exports.extractPrivateKeyFromSession = exports.fetchSessionKey = exports.login = exports.register = void 0;

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
    var email, password, apiHost, encryptionKey, encryptedEncryptionKey, passwordHash, passwordDerivedKeyHash, wallet, mnemonic, iv, encryptedMnemonic, response, _response$data, account, sessionKey, success, error, sessionKeyStore;

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
            }, {
              withCredentials: true
            });

          case 19:
            response = _context.sent;
            _response$data = response.data, account = _response$data.account, sessionKey = _response$data.sessionKey, success = _response$data.success, error = _response$data.error;
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
    var email, password, apiHost, passwordHash, response, _response$data2, encryptedEncryptionKey, encryptedMnemonic, sessionKey, success, error, passwordDerivedKey, encryptionKey, mnemonic, wallet, sessionKeyStore;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            email = _ref3.email, password = _ref3.password, apiHost = _ref3.apiHost;
            _context2.next = 3;
            return (0, _cryptoUtils.getPasswordHash)(email, password);

          case 3:
            passwordHash = _context2.sent;
            _context2.next = 6;
            return _axios["default"].post("".concat(apiHost, "/api/v1/accounts/login"), {
              email: email,
              passwordHash: passwordHash
            }, {
              withCredentials: true
            });

          case 6:
            response = _context2.sent;
            _response$data2 = response.data, encryptedEncryptionKey = _response$data2.encryptedEncryptionKey, encryptedMnemonic = _response$data2.encryptedMnemonic, sessionKey = _response$data2.sessionKey, success = _response$data2.success, error = _response$data2.error;
            _context2.next = 10;
            return (0, _cryptoUtils.getPasswordDerivedKey)(email, password);

          case 10:
            passwordDerivedKey = _context2.sent;
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
}();

exports.login = login;

var fetchSessionKey =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(apiHost) {
    var response, _response$data3, success, sessionKey, error;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _axios["default"].get("".concat(apiHost, "/api/v1/accounts/fetch-session-key"), {
              withCredentials: true
            });

          case 2:
            response = _context3.sent;
            _response$data3 = response.data, success = _response$data3.success, sessionKey = _response$data3.sessionKey, error = _response$data3.error;
            return _context3.abrupt("return", {
              success: success,
              sessionKey: sessionKey,
              error: error
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetchSessionKey(_x3) {
    return _ref5.apply(this, arguments);
  };
}();

exports.fetchSessionKey = fetchSessionKey;

var extractPrivateKeyFromSession =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(_ref6) {
    var sessionKeyStore, apiHost, _ref8, success, sessionKey, error, wallet;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sessionKeyStore = _ref6.sessionKeyStore, apiHost = _ref6.apiHost;
            _context4.next = 3;
            return fetchSessionKey(apiHost);

          case 3:
            _ref8 = _context4.sent;
            success = _ref8.success;
            sessionKey = _ref8.sessionKey;
            error = _ref8.error;

            if (success === true) {
              wallet = _ethers.ethers.Wallet.fromEncryptedJson(sessionKeyStore, sessionKey);
            }

            return _context4.abrupt("return", {
              success: success,
              privateKey: wallet.privateKey,
              error: error
            });

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function extractPrivateKeyFromSession(_x4) {
    return _ref7.apply(this, arguments);
  };
}();

exports.extractPrivateKeyFromSession = extractPrivateKeyFromSession;

var isDeployed =
/*#__PURE__*/
function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(_ref9) {
    var email, apiHost, response;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            email = _ref9.email, apiHost = _ref9.apiHost;
            _context5.next = 3;
            return _axios["default"].get("".concat(apiHost, "/api/v1/accounts/is-deployed/").concat(email));

          case 3:
            response = _context5.sent;
            return _context5.abrupt("return", response.data);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function isDeployed(_x5) {
    return _ref10.apply(this, arguments);
  };
}();

exports.isDeployed = isDeployed;