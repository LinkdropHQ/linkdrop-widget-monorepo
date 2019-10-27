"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _connectToChild = _interopRequireDefault(require("penpal/lib/connectToChild"));

var _styles = require("./styles");

var ProviderEngine = require('web3-provider-engine');

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

var CacheSubprovider = require('web3-provider-engine/subproviders/cache.js');

var FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

var HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js');

var SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions.js');

var Provider =
/*#__PURE__*/
function () {
  function Provider(opts) {
    (0, _classCallCheck2["default"])(this, Provider);
    this.network = opts.network || 'mainnet';
    this.rpcUrl = opts.rpcUrl || "https://".concat(this.network, ".infura.io/v3/d4d1a2b933e048e28fb6fe1abe3e813a");
    this.widgetUrl = opts.widgetUrl || "https://".concat(this.network, "-widget.linkdrop.io");

    if (!opts.network) {
      throw new Error('network should be provided');
    }

    if (opts.network !== 'mainnet' && opts.network !== 'rinkeby') {
      throw new Error("Wrong network \"".concat(opts.network, "\" provided. Should one of: \"mainnet\", \"rinkeby\""));
    }

    this.provider = this._initProvider();
  }

  (0, _createClass2["default"])(Provider, [{
    key: "_addWidgetIcon",
    value: function _addWidgetIcon() {
      var _this = this;

      this.iconEl = document.createElement('div');
      this.iconEl.className = 'ld-widget-icon';
      document.body.appendChild(this.iconEl);
      this.iconEl.addEventListener('click', function (event) {
        // Log the clicked element in the console
        // hide or show widget window
        _this._toggleWidget();
      }, false);
    }
  }, {
    key: "_toggleWidget",
    value: function () {
      var _toggleWidget2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var currentIsBlock;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                currentIsBlock = this.widget.iframe.style.display === 'block';
                this.widget.iframe.style.display = currentIsBlock ? 'none' : 'block';
                this.toggleOpenIconClass(!currentIsBlock);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _toggleWidget() {
        return _toggleWidget2.apply(this, arguments);
      }

      return _toggleWidget;
    }()
  }, {
    key: "toggleOpenIconClass",
    value: function toggleOpenIconClass(widgetOpened) {
      //const container = this.widget.iframe.closest('body').querySelector('.ld-widget-icon')
      if (widgetOpened) {
        return this.iconEl.classList.add('ld-widget-icon-opened');
      }

      return this.iconEl.classList.remove('ld-widget-icon-opened');
    }
  }, {
    key: "_initWidget",
    value: function _initWidget(opts) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var onload =
        /*#__PURE__*/
        function () {
          var _ref = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee2() {
            var container, style, iframe, iframeSrc, connection, communication;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    container = document.createElement('div');
                    container.className = 'ld-widget-container';
                    style = document.createElement('style');
                    style.innerHTML = _styles.styles;
                    iframe = document.createElement('iframe');
                    iframeSrc = _this2.widgetUrl; // propagate claim params to iframe window

                    if (window.location.hash.indexOf('#/receive') > -1) {
                      iframeSrc += window.location.hash;
                    }

                    iframe.src = iframeSrc;
                    iframe.className = 'ld-widget-iframe';
                    container.appendChild(iframe);
                    document.body.appendChild(container);
                    document.head.appendChild(style);
                    connection = (0, _connectToChild["default"])({
                      // The iframe to which a connection should be made
                      iframe: iframe,
                      // Methods the parent is exposing to the child
                      methods: {
                        showWidget: _this2.showWidget.bind(_this2),
                        hideWidget: _this2.hideWidget.bind(_this2)
                      }
                    });
                    _context2.next = 15;
                    return connection.promise;

                  case 15:
                    communication = _context2.sent;
                    resolve({
                      iframe: iframe,
                      communication: communication
                    });

                  case 17:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          return function onload() {
            return _ref.apply(this, arguments);
          };
        }();

        if (['loaded', 'interactive', 'complete'].indexOf(document.readyState) > -1) {
          onload();
        } else {
          window.addEventListener('load', onload.bind(_this2), false);
        }
      });
    }
  }, {
    key: "showWidget",
    value: function showWidget() {
      if (this.widget) {
        this.widget.iframe.style.display = 'block';
        this.toggleOpenIconClass(true);
      }
    }
  }, {
    key: "hideWidget",
    value: function hideWidget() {
      if (this.widget) {
        this.widget.iframe.style.display = 'none';
        this.toggleOpenIconClass(false);
      }
    }
  }, {
    key: "_initWidgetFrame",
    value: function () {
      var _initWidgetFrame2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(opts) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._initWidget(opts);

              case 2:
                this.widget = _context3.sent;

                this._addWidgetIcon();

                if (opts.openWidget) {
                  this.showWidget();
                }

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _initWidgetFrame(_x) {
        return _initWidgetFrame2.apply(this, arguments);
      }

      return _initWidgetFrame;
    }()
  }, {
    key: "_initProvider",
    value: function _initProvider() {
      var _this3 = this;

      var engine = new ProviderEngine();
      var address;
      engine.enable =
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        var opts,
            openWidget,
            _args4 = arguments;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                opts = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : null;
                openWidget = opts && opts.open;
                _context4.next = 4;
                return _this3._initWidgetFrame({
                  openWidget: openWidget
                });

              case 4:
                _context4.prev = 4;
                _context4.next = 7;
                return _this3.widget.communication.connect();

              case 7:
                _context4.next = 12;
                break;

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](4);
                throw _context4.t0;

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[4, 9]]);
      }));

      function _handleRequest2(_x2) {
        return _handleRequest.apply(this, arguments);
      }

      function _handleRequest() {
        _handleRequest = (0, _asyncToGenerator2["default"])(
        /*#__PURE__*/
        _regenerator["default"].mark(function _callee9(payload) {
          var result, message;
          return _regenerator["default"].wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  result = null;
                  _context9.prev = 1;
                  _context9.t0 = payload.method;
                  _context9.next = _context9.t0 === 'eth_accounts' ? 5 : _context9.t0 === 'eth_coinbase' ? 7 : _context9.t0 === 'eth_chainId' ? 9 : _context9.t0 === 'net_version' ? 10 : _context9.t0 === 'eth_uninstallFilter' ? 11 : 14;
                  break;

                case 5:
                  result = [address];
                  return _context9.abrupt("break", 16);

                case 7:
                  result = address;
                  return _context9.abrupt("break", 16);

                case 9:
                  throw new Error('eth_chainId call not implemented');

                case 10:
                  throw new Error('net_version call not implemented');

                case 11:
                  engine.Async(payload, function (_) {
                    return _;
                  });
                  result = true;
                  return _context9.abrupt("break", 16);

                case 14:
                  message = "Linkdrop Widget Web3 object does not support synchronous methods like ".concat(payload.method, " without a callback parameter.");
                  throw new Error(message);

                case 16:
                  _context9.next = 21;
                  break;

                case 18:
                  _context9.prev = 18;
                  _context9.t1 = _context9["catch"](1);
                  throw _context9.t1;

                case 21:
                  return _context9.abrupt("return", {
                    id: payload.id,
                    jsonrpc: payload.jsonrpc,
                    result: result
                  });

                case 22:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, null, [[1, 18]]);
        }));
        return _handleRequest.apply(this, arguments);
      }

      engine.send =
      /*#__PURE__*/
      function () {
        var _ref3 = (0, _asyncToGenerator2["default"])(
        /*#__PURE__*/
        _regenerator["default"].mark(function _callee5(payload, callback) {
          var res;
          return _regenerator["default"].wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (!(typeof payload === 'string')) {
                    _context5.next = 2;
                    break;
                  }

                  return _context5.abrupt("return", new Promise(function (resolve, reject) {
                    engine.sendAsync({
                      jsonrpc: '2.0',
                      id: 42,
                      method: payload,
                      params: callback || []
                    }, function (error, response) {
                      if (error) {
                        reject(error);
                      } else {
                        resolve(response.result);
                      }
                    });
                  }));

                case 2:
                  if (!callback) {
                    _context5.next = 5;
                    break;
                  }

                  engine.sendAsync(payload, callback);
                  return _context5.abrupt("return");

                case 5:
                  _context5.next = 7;
                  return _handleRequest2(payload, callback);

                case 7:
                  res = _context5.sent;
                  return _context5.abrupt("return", res);

                case 9:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      }();

      var VERSION = 0.1; // #TODO move to auto

      var fixtureSubprovider = new FixtureSubprovider({
        web3_clientVersion: "LW/v".concat(VERSION, "/javascript"),
        net_listening: true,
        eth_hashrate: '0x00',
        eth_mining: false,
        eth_syncing: true
      }); // const nonceSubprovider = new NonceSubprovider()

      var cacheSubprovider = new CacheSubprovider(); // hack to deal with multiple received messages via PostMessage

      var walletSubprovider = new HookedWalletSubprovider({
        getAccounts: function () {
          var _getAccounts = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee6(cb) {
            var result, error;
            return _regenerator["default"].wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.prev = 0;
                    _context6.next = 3;
                    return _this3.widget.communication.getAccounts();

                  case 3:
                    result = _context6.sent;
                    address = result[0];
                    _context6.next = 10;
                    break;

                  case 7:
                    _context6.prev = 7;
                    _context6.t0 = _context6["catch"](0);
                    error = _context6.t0;

                  case 10:
                    cb(error, result);

                  case 11:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, null, [[0, 7]]);
          }));

          function getAccounts(_x5) {
            return _getAccounts.apply(this, arguments);
          }

          return getAccounts;
        }(),
        processTransaction: function () {
          var _processTransaction = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee7(txParams, cb) {
            var result, error, _ref4, txHash, success, errors;

            return _regenerator["default"].wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.prev = 0;
                    _context7.next = 3;
                    return _this3.widget.communication.sendTransaction(txParams);

                  case 3:
                    _ref4 = _context7.sent;
                    txHash = _ref4.txHash;
                    success = _ref4.success;
                    errors = _ref4.errors;

                    if (success) {
                      result = txHash;
                    } else {
                      error = errors[0] || 'Error while sending transaction';
                    }

                    _context7.next = 13;
                    break;

                  case 10:
                    _context7.prev = 10;
                    _context7.t0 = _context7["catch"](0);
                    error = _context7.t0;

                  case 13:
                    cb(error, result);

                  case 14:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, null, [[0, 10]]);
          }));

          function processTransaction(_x6, _x7) {
            return _processTransaction.apply(this, arguments);
          }

          return processTransaction;
        }()
      });
      /* ADD MIDDELWARE (PRESERVE ORDER) */

      engine.addProvider(fixtureSubprovider);
      engine.addProvider(cacheSubprovider);
      engine.addProvider(walletSubprovider);
      engine.addProvider(new RpcSubprovider({
        rpcUrl: this.rpcUrl
      }));
      engine.addProvider(new SubscriptionsSubprovider());
      engine.addProvider(new FilterSubprovider());
      /* END OF MIDDLEWARE */

      engine.addProvider({
        handleRequest: function () {
          var _handleRequest3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee8(payload, next, end) {
            var _ref5, result;

            return _regenerator["default"].wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.prev = 0;
                    _context8.next = 3;
                    return _handleRequest2(payload);

                  case 3:
                    _ref5 = _context8.sent;
                    result = _ref5.result;
                    end(null, result);
                    _context8.next = 11;
                    break;

                  case 8:
                    _context8.prev = 8;
                    _context8.t0 = _context8["catch"](0);
                    end(_context8.t0);

                  case 11:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, null, [[0, 8]]);
          }));

          function handleRequest(_x8, _x9, _x10) {
            return _handleRequest3.apply(this, arguments);
          }

          return handleRequest;
        }(),
        setEngine: function setEngine(_) {
          return _;
        }
      });

      engine.isConnected = function () {
        return true;
      };

      engine.isEnsLogin = true;
      engine.on = false;
      engine.start();
      return engine;
    }
  }]);
  return Provider;
}();

var _default = Provider;
exports["default"] = _default;