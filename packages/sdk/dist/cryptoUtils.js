"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPasswordDerivedKeyHash = exports.getPasswordHash = exports.getPasswordDerivedKey = exports.extractMnemonic = exports.extractEncryptionKey = exports.getEncryptedMnemonic = exports.getEncryptedEncryptionKey = exports.generateIV = exports.generateEncryptionKey = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _crypto = _interopRequireDefault(require("crypto"));

/**
 * Generates random encryption key of size 64 bytes
 * @return `encryptionKey` Encryption key
 */
var generateEncryptionKey = function generateEncryptionKey() {
  return _crypto["default"].randomBytes(32).toString('hex');
};
/**
 * Generates random initializatin vector of size 16 bytes
 * @return `iv` Initialization vector
 */


exports.generateEncryptionKey = generateEncryptionKey;

var generateIV = function generateIV() {
  return _crypto["default"].randomBytes(16).toString('hex');
};
/**
 * Encrypts `encryptionKey` using AES-CBC algorithm with password derived key as the secret and 16 random bytes as the IV
 * @param {String} email Email
 * @param {String} password Password
 * @param {String} encryptionKey Encryption key
 * @return `{encryptedEncryptionKey, iv}`
 */


exports.generateIV = generateIV;

var getEncryptedEncryptionKey =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(email, password, encryptionKey) {
    var passwordDerivedKey, iv, cipher, encryptedEncryptionKey;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getPasswordDerivedKey(email, password);

          case 2:
            passwordDerivedKey = _context.sent;
            iv = generateIV();
            cipher = _crypto["default"].createCipheriv('aes-256-cbc', Buffer.from(passwordDerivedKey, 'hex'), Buffer.from(iv, 'hex'));
            encryptedEncryptionKey = cipher.update(encryptionKey, 'hex', 'hex') + cipher["final"]('hex');
            return _context.abrupt("return", {
              encryptedEncryptionKey: encryptedEncryptionKey,
              iv: iv
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getEncryptedEncryptionKey(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Encrypts `mnemonic` using AES-CBC algorithm with `encryptionKey` as the secret and 16 bytes IV
 * @param {String} mnemonic Mnemonic
 * @return `{encryptedMnemonic, iv}`
 */


exports.getEncryptedEncryptionKey = getEncryptedEncryptionKey;

var getEncryptedMnemonic =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(mnemonic, encryptionKey, iv) {
    var cipher, encryptedMnemonic;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cipher = _crypto["default"].createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
            encryptedMnemonic = cipher.update(mnemonic, 'utf8', 'hex') + cipher["final"]('hex');
            return _context2.abrupt("return", {
              encryptedMnemonic: encryptedMnemonic,
              iv: iv
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getEncryptedMnemonic(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Extracts decrypted encryption key using AES-CBC algorithm with 'passwordDerivedKey` as the key and 16 bytes IV
 * @param {String} encryptedEncryptionKey
 * @param {String} iv
 * @param {String} passwordDerivedKey
 * @return `encryptionKey`
 */


exports.getEncryptedMnemonic = getEncryptedMnemonic;

var extractEncryptionKey =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(encryptedEncryptionKey, iv, passwordDerivedKey) {
    var decipher;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            decipher = _crypto["default"].createDecipheriv('aes-256-cbc', Buffer.from(passwordDerivedKey, 'hex'), Buffer.from(iv, 'hex'));
            return _context3.abrupt("return", decipher.update(encryptedEncryptionKey, 'hex', 'hex') + decipher["final"]('hex'));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function extractEncryptionKey(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Extracts decrypted mnemonic using AES-CBC algorithm with 'encryptionKey` as the key and 16 bytes IV
 * @param {String} encryptedEncryptionKey
 * @param {String} iv
 * @param {String} passwordDerivedKey
 * @return `mnemonic`
 */


exports.extractEncryptionKey = extractEncryptionKey;

var extractMnemonic =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(encryptedMnemonic, iv, encryptionKey) {
    var decipher;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            decipher = _crypto["default"].createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
            return _context4.abrupt("return", decipher.update(encryptedMnemonic, 'hex', 'utf8') + decipher["final"]('utf8'));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function extractMnemonic(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Derives password derived key
 * @param {String} email Email
 * @param {String} password Password
 * @return `passwordDerivedKey` Password derived key
 */


exports.extractMnemonic = extractMnemonic;

var getPasswordDerivedKey = function getPasswordDerivedKey(email, password) {
  return new Promise(function (resolve, reject) {
    _crypto["default"].pbkdf2(password, email, 100000, 32, 'sha256', function (err, passwordDerivedKey) {
      if (err) reject(err);
      return resolve(passwordDerivedKey.toString('hex'));
    });
  });
};
/**
 * Derives password hash
 * @param {String} email Email
 * @param {String} password Password
 * @return `passwordHash` Password hash
 */


exports.getPasswordDerivedKey = getPasswordDerivedKey;

var getPasswordHash =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(email, password) {
    var passwordDerivedKey;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getPasswordDerivedKey(email, password);

          case 2:
            passwordDerivedKey = _context5.sent;
            return _context5.abrupt("return", new Promise(function (resolve, reject) {
              _crypto["default"].pbkdf2(passwordDerivedKey, password, 1, 32, 'sha256', function (err, passwordHash) {
                if (err) reject(err);
                return resolve(passwordHash.toString('hex'));
              });
            }));

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getPasswordHash(_x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Hashes password derived key
 * @param {String} email Email
 * @param {String} password Password
 * @return `passwordDerivedKeyHash` Password derived key hash
 */


exports.getPasswordHash = getPasswordHash;

var getPasswordDerivedKeyHash =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(email, password) {
    var passwordDerivedKey;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getPasswordDerivedKey(email, password);

          case 2:
            passwordDerivedKey = _context6.sent;
            return _context6.abrupt("return", _crypto["default"].createHash('sha512').update(passwordDerivedKey).digest('hex'));

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getPasswordDerivedKeyHash(_x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getPasswordDerivedKeyHash = getPasswordDerivedKeyHash;