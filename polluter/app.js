"use strict";
var __awaiter = undefined && undefined.__awaiter || function (o, a, s, u) {
  return new (s || (s = Promise))(function (e, t) {
    function r(e) {
      try {
        i(u.next(e));
      } catch (e) {
        t(e);
      }
    }function n(e) {
      try {
        i(u.throw(e));
      } catch (e) {
        t(e);
      }
    }function i(t) {
      t.done ? e(t.value) : new s(function (e) {
        e(t.value);
      }).then(r, n);
    }i((u = u.apply(o, a || [])).next());
  });
},
    __generator = undefined && undefined.__generator || function (r, n) {
  function e(t) {
    return function (e) {
      return function (t) {
        if (i) throw new TypeError("Generator is already executing.");for (; s;) {
          try {
            if (i = 1, o && (a = o[2 & t[0] ? "return" : t[0] ? "throw" : "next"]) && !(a = a.call(o, t[1])).done) return a;switch (o = 0, a && (t = [0, a.value]), t[0]) {case 0:case 1:
                a = t;break;case 4:
                return s.label++, { value: t[1], done: !1 };case 5:
                s.label++, o = t[1], t = [0];continue;case 7:
                t = s.ops.pop(), s.trys.pop();continue;default:
                if (!(a = 0 < (a = s.trys).length && a[a.length - 1]) && (6 === t[0] || 2 === t[0])) {
                  s = 0;continue;
                }if (3 === t[0] && (!a || t[1] > a[0] && t[1] < a[3])) {
                  s.label = t[1];break;
                }if (6 === t[0] && s.label < a[1]) {
                  s.label = a[1], a = t;break;
                }if (a && s.label < a[2]) {
                  s.label = a[2], s.ops.push(t);break;
                }a[2] && s.ops.pop(), s.trys.pop();continue;}t = n.call(r, s);
          } catch (e) {
            t = [6, e], o = 0;
          } finally {
            i = a = 0;
          }
        }if (5 & t[0]) throw t[1];return { value: t[0] ? t[1] : void 0, done: !0 };
      }([t, e]);
    };
  }var i,
      o,
      a,
      t,
      s = { label: 0, sent: function sent() {
      if (1 & a[0]) throw a[1];return a[1];
    }, trys: [], ops: [] };return t = { next: e(0), throw: e(1), return: e(2) }, "function" == typeof Symbol && (t[Symbol.iterator] = function () {
    return this;
  }), t;
},
    _this = undefined;Object.defineProperty(exports, "__esModule", { value: !0 });var ethers_1 = require("ethers"),
    polluterAbi = require("./abi/polluter.json"),
    web3 = window.web3 || void 0,
    utils = ethers_1.ethers.utils,
    provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider),
    signer = provider.getSigner(),
    nonce = 0,
    transaction = { nonce: nonce++, gasLimit: 3e5, gasPrice: utils.bigNumberify("20000000000"), to: "0x6a1B0C693DD4AA99bA8E93247AA221Fb30525Cfe", value: utils.parseEther("1.0"), data: "0x", chainId: ethers_1.ethers.utils.getNetwork("rinkeby").chainId };jQuery(function (l) {
  return __awaiter(_this, void 0, void 0, function () {
    var u;return __generator(this, function (e) {
      return l(".js--connect").click(function (t) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (e) {
            switch (e.label) {case 0:
                return t.preventDefault(), u ? (alert("already enabled"), [2]) : [4, window.ethereum.enable()];case 1:
                return (u = e.sent()) && l(this).text("Wallet Connected"), [2];}
          });
        });
      }), l(".js--pollute").click(function (s) {
        return __awaiter(this, void 0, void 0, function () {
          var t, r, n, i, o, a;return __generator(this, function (e) {
            switch (e.label) {case 0:
                return s.preventDefault(), u ? (l(this).addClass("polluting"), [4, new ethers_1.ethers.Contract("0x57AaFA7eA3D66e2C9540d455BDBe093De9DB6bf4", polluterAbi, signer).iterator()]) : (alert("connect wallet"), [2]);case 1:
                return t = e.sent(), l(this).text("Polluting"), [4, t.wait(1)];case 2:
                return r = e.sent(), l(this).text("Pollute"), l(this).removeClass("polluting"), n = r.events, i = n[n.length - 1], o = i.args.totalGasOffset, a = i.args.methodFootprint, (o || a) && l("pre").append("totalGasOffset: " + o + "<br />\n                methodFootprint: " + a), [2];}
          });
        });
      }), [2];
    });
  });
});