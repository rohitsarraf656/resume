var Yg = Object.defineProperty,
  Kg = Object.defineProperties;
var Xg = Object.getOwnPropertyDescriptors;
var jd = Object.getOwnPropertySymbols;
var Jg = Object.prototype.hasOwnProperty,
  eb = Object.prototype.propertyIsEnumerable;
var Bd = (t, e, r) =>
    e in t
      ? Yg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  g = (t, e) => {
    for (var r in (e ||= {})) Jg.call(e, r) && Bd(t, r, e[r]);
    if (jd) for (var r of jd(e)) eb.call(e, r) && Bd(t, r, e[r]);
    return t;
  },
  oe = (t, e) => Kg(t, Xg(e));
var Vd = null;
var Hs = 1,
  Ud = Symbol("SIGNAL");
function ke(t) {
  let e = Vd;
  return (Vd = t), e;
}
var $d = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function tb(t) {
  if (!(Gs(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Hs)) {
    if (!t.producerMustRecompute(t) && !zs(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Hs);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Hs);
  }
}
function Hd(t) {
  return t && (t.nextProducerIndex = 0), ke(t);
}
function zd(t, e) {
  if (
    (ke(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Gs(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        Ws(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function zs(t) {
  Oi(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (tb(r), n !== r.version)) return !0;
  }
  return !1;
}
function Wd(t) {
  if ((Oi(t), Gs(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Ws(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Ws(t, e) {
  if ((nb(t), Oi(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      Ws(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    Oi(i), (i.producerIndexOfThis[n] = e);
  }
}
function Gs(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Oi(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function nb(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function rb() {
  throw new Error();
}
var ib = rb;
function Gd(t) {
  ib = t;
}
function I(t) {
  return typeof t == "function";
}
function Bn(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var Fi = Bn(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function fn(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var Z = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (I(n))
        try {
          n();
        } catch (o) {
          e = o instanceof Fi ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            qd(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof Fi ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new Fi(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) qd(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && fn(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && fn(r, e), e instanceof t && e._removeParent(this);
  }
};
Z.EMPTY = (() => {
  let t = new Z();
  return (t.closed = !0), t;
})();
var qs = Z.EMPTY;
function Pi(t) {
  return (
    t instanceof Z ||
    (t && "closed" in t && I(t.remove) && I(t.add) && I(t.unsubscribe))
  );
}
function qd(t) {
  I(t) ? t() : t.unsubscribe();
}
var Ke = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Vn = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = Vn;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = Vn;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Li(t) {
  Vn.setTimeout(() => {
    let { onUnhandledError: e } = Ke;
    if (e) e(t);
    else throw t;
  });
}
function Mr() {}
var Zd = Zs("C", void 0, void 0);
function Qd(t) {
  return Zs("E", void 0, t);
}
function Yd(t) {
  return Zs("N", t, void 0);
}
function Zs(t, e, r) {
  return { kind: t, value: e, error: r };
}
var hn = null;
function Un(t) {
  if (Ke.useDeprecatedSynchronousErrorHandling) {
    let e = !hn;
    if ((e && (hn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = hn;
      if (((hn = null), r)) throw n;
    }
  } else t();
}
function Kd(t) {
  Ke.useDeprecatedSynchronousErrorHandling &&
    hn &&
    ((hn.errorThrown = !0), (hn.error = t));
}
var pn = class extends Z {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Pi(e) && e.add(this))
          : (this.destination = ab);
    }
    static create(e, r, n) {
      return new _t(e, r, n);
    }
    next(e) {
      this.isStopped ? Ys(Yd(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Ys(Qd(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Ys(Zd, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  ob = Function.prototype.bind;
function Qs(t, e) {
  return ob.call(t, e);
}
var Ks = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          ji(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          ji(n);
        }
      else ji(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          ji(r);
        }
    }
  },
  _t = class extends pn {
    constructor(e, r, n) {
      super();
      let i;
      if (I(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && Ke.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Qs(e.next, o),
              error: e.error && Qs(e.error, o),
              complete: e.complete && Qs(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Ks(i);
    }
  };
function ji(t) {
  Ke.useDeprecatedSynchronousErrorHandling ? Kd(t) : Li(t);
}
function sb(t) {
  throw t;
}
function Ys(t, e) {
  let { onStoppedNotification: r } = Ke;
  r && Vn.setTimeout(() => r(t, e));
}
var ab = { closed: !0, next: Mr, error: sb, complete: Mr };
var $n = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Ie(t) {
  return t;
}
function Xs(...t) {
  return Js(t);
}
function Js(t) {
  return t.length === 0
    ? Ie
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var M = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = lb(r) ? r : new _t(r, n, i);
      return (
        Un(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = Xd(n)),
        new n((i, o) => {
          let s = new _t({
            next: (a) => {
              try {
                r(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [$n]() {
      return this;
    }
    pipe(...r) {
      return Js(r)(this);
    }
    toPromise(r) {
      return (
        (r = Xd(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Xd(t) {
  var e;
  return (e = t ?? Ke.Promise) !== null && e !== void 0 ? e : Promise;
}
function cb(t) {
  return t && I(t.next) && I(t.error) && I(t.complete);
}
function lb(t) {
  return (t && t instanceof pn) || (cb(t) && Pi(t));
}
function ea(t) {
  return I(t?.lift);
}
function A(t) {
  return (e) => {
    if (ea(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function S(t, e, r, n, i) {
  return new ta(t, e, r, n, i);
}
var ta = class extends pn {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Hn() {
  return A((t, e) => {
    let r = null;
    t._refCount++;
    let n = S(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var zn = class extends M {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ea(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new Z();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          S(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = Z.EMPTY));
    }
    return e;
  }
  refCount() {
    return Hn()(this);
  }
};
var Jd = Bn(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var B = (() => {
    class t extends M {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new Bi(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new Jd();
      }
      next(r) {
        Un(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        Un(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        Un(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? qs
          : ((this.currentObservers = null),
            o.push(r),
            new Z(() => {
              (this.currentObservers = null), fn(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new M();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new Bi(e, r)), t;
  })(),
  Bi = class extends B {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : qs;
    }
  };
var se = class extends B {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var na = {
  now() {
    return (na.delegate || Date).now();
  },
  delegate: void 0,
};
var Vi = class extends Z {
  constructor(e, r) {
    super();
  }
  schedule(e, r = 0) {
    return this;
  }
};
var Sr = {
  setInterval(t, e, ...r) {
    let { delegate: n } = Sr;
    return n?.setInterval ? n.setInterval(t, e, ...r) : setInterval(t, e, ...r);
  },
  clearInterval(t) {
    let { delegate: e } = Sr;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Ui = class extends Vi {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r), (this.pending = !1);
  }
  schedule(e, r = 0) {
    var n;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, r)),
      (this.pending = !0),
      (this.delay = r),
      (this.id =
        (n = this.id) !== null && n !== void 0
          ? n
          : this.requestAsyncId(o, this.id, r)),
      this
    );
  }
  requestAsyncId(e, r, n = 0) {
    return Sr.setInterval(e.flush.bind(e, this), n);
  }
  recycleAsyncId(e, r, n = 0) {
    if (n != null && this.delay === n && this.pending === !1) return r;
    r != null && Sr.clearInterval(r);
  }
  execute(e, r) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let n = this._execute(e, r);
    if (n) return n;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, r) {
    let n = !1,
      i;
    try {
      this.work(e);
    } catch (o) {
      (n = !0), (i = o || new Error("Scheduled action threw falsy error"));
    }
    if (n) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: r } = this,
        { actions: n } = r;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        fn(n, this),
        e != null && (this.id = this.recycleAsyncId(r, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var Wn = class t {
  constructor(e, r = t.now) {
    (this.schedulerActionCtor = e), (this.now = r);
  }
  schedule(e, r = 0, n) {
    return new this.schedulerActionCtor(this, e).schedule(n, r);
  }
};
Wn.now = na.now;
var $i = class extends Wn {
  constructor(e, r = Wn.now) {
    super(e, r), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: r } = this;
    if (this._active) {
      r.push(e);
      return;
    }
    let n;
    this._active = !0;
    do if ((n = e.execute(e.state, e.delay))) break;
    while ((e = r.shift()));
    if (((this._active = !1), n)) {
      for (; (e = r.shift()); ) e.unsubscribe();
      throw n;
    }
  }
};
var Ar = new $i(Ui),
  eu = Ar;
var ve = new M((t) => t.complete());
function Hi(t) {
  return t && I(t.schedule);
}
function ra(t) {
  return t[t.length - 1];
}
function zi(t) {
  return I(ra(t)) ? t.pop() : void 0;
}
function st(t) {
  return Hi(ra(t)) ? t.pop() : void 0;
}
function tu(t, e) {
  return typeof ra(t) == "number" ? t.pop() : e;
}
function ru(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(d) {
      try {
        l(n.next(d));
      } catch (u) {
        s(u);
      }
    }
    function c(d) {
      try {
        l(n.throw(d));
      } catch (u) {
        s(u);
      }
    }
    function l(d) {
      d.done ? o(d.value) : i(d.value).then(a, c);
    }
    l((n = n.apply(t, e || [])).next());
  });
}
function nu(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function mn(t) {
  return this instanceof mn ? ((this.v = t), this) : new mn(t);
}
function iu(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    n[f] &&
      (i[f] = function (m) {
        return new Promise(function (w, E) {
          o.push([f, m, w, E]) > 1 || a(f, m);
        });
      });
  }
  function a(f, m) {
    try {
      c(n[f](m));
    } catch (w) {
      u(o[0][3], w);
    }
  }
  function c(f) {
    f.value instanceof mn
      ? Promise.resolve(f.value.v).then(l, d)
      : u(o[0][2], f);
  }
  function l(f) {
    a("next", f);
  }
  function d(f) {
    a("throw", f);
  }
  function u(f, m) {
    f(m), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function ou(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof nu == "function" ? nu(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[o](s)), i(a, c, s.done, s.value);
        });
      };
  }
  function i(o, s, a, c) {
    Promise.resolve(c).then(function (l) {
      o({ value: l, done: a });
    }, s);
  }
}
var Gn = (t) => t && typeof t.length == "number" && typeof t != "function";
function Wi(t) {
  return I(t?.then);
}
function Gi(t) {
  return I(t[$n]);
}
function qi(t) {
  return Symbol.asyncIterator && I(t?.[Symbol.asyncIterator]);
}
function Zi(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function db() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Qi = db();
function Yi(t) {
  return I(t?.[Qi]);
}
function Ki(t) {
  return iu(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield mn(r.read());
        if (i) return yield mn(void 0);
        yield yield mn(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function Xi(t) {
  return I(t?.getReader);
}
function W(t) {
  if (t instanceof M) return t;
  if (t != null) {
    if (Gi(t)) return ub(t);
    if (Gn(t)) return fb(t);
    if (Wi(t)) return hb(t);
    if (qi(t)) return su(t);
    if (Yi(t)) return pb(t);
    if (Xi(t)) return mb(t);
  }
  throw Zi(t);
}
function ub(t) {
  return new M((e) => {
    let r = t[$n]();
    if (I(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function fb(t) {
  return new M((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function hb(t) {
  return new M((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, Li);
  });
}
function pb(t) {
  return new M((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function su(t) {
  return new M((e) => {
    gb(t, e).catch((r) => e.error(r));
  });
}
function mb(t) {
  return su(Ki(t));
}
function gb(t, e) {
  var r, n, i, o;
  return ru(this, void 0, void 0, function* () {
    try {
      for (r = ou(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Ee(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function Ji(t, e = 0) {
  return A((r, n) => {
    r.subscribe(
      S(
        n,
        (i) => Ee(n, t, () => n.next(i), e),
        () => Ee(n, t, () => n.complete(), e),
        (i) => Ee(n, t, () => n.error(i), e)
      )
    );
  });
}
function eo(t, e = 0) {
  return A((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function au(t, e) {
  return W(t).pipe(eo(e), Ji(e));
}
function cu(t, e) {
  return W(t).pipe(eo(e), Ji(e));
}
function lu(t, e) {
  return new M((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function du(t, e) {
  return new M((r) => {
    let n;
    return (
      Ee(r, e, () => {
        (n = t[Qi]()),
          Ee(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => I(n?.return) && n.return()
    );
  });
}
function to(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new M((r) => {
    Ee(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      Ee(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function uu(t, e) {
  return to(Ki(t), e);
}
function fu(t, e) {
  if (t != null) {
    if (Gi(t)) return au(t, e);
    if (Gn(t)) return lu(t, e);
    if (Wi(t)) return cu(t, e);
    if (qi(t)) return to(t, e);
    if (Yi(t)) return du(t, e);
    if (Xi(t)) return uu(t, e);
  }
  throw Zi(t);
}
function X(t, e) {
  return e ? fu(t, e) : W(t);
}
function y(...t) {
  let e = st(t);
  return X(t, e);
}
function Vt(t, e) {
  let r = I(t) ? t : () => t,
    n = (i) => i.error(r());
  return new M(e ? (i) => e.schedule(n, 0, i) : n);
}
function no(t) {
  return !!t && (t instanceof M || (I(t.lift) && I(t.subscribe)));
}
var wt = Bn(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function hu(t) {
  return t instanceof Date && !isNaN(t);
}
function C(t, e) {
  return A((r, n) => {
    let i = 0;
    r.subscribe(
      S(n, (o) => {
        n.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: bb } = Array;
function vb(t, e) {
  return bb(e) ? t(...e) : t(e);
}
function qn(t) {
  return C((e) => vb(t, e));
}
var { isArray: yb } = Array,
  { getPrototypeOf: _b, prototype: wb, keys: Db } = Object;
function ro(t) {
  if (t.length === 1) {
    let e = t[0];
    if (yb(e)) return { args: e, keys: null };
    if (Ib(e)) {
      let r = Db(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Ib(t) {
  return t && typeof t == "object" && _b(t) === wb;
}
function io(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function gn(...t) {
  let e = st(t),
    r = zi(t),
    { args: n, keys: i } = ro(t);
  if (n.length === 0) return X([], e);
  let o = new M(Cb(n, e, i ? (s) => io(i, s) : Ie));
  return r ? o.pipe(qn(r)) : o;
}
function Cb(t, e, r = Ie) {
  return (n) => {
    pu(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          pu(
            e,
            () => {
              let l = X(t[c], e),
                d = !1;
              l.subscribe(
                S(
                  n,
                  (u) => {
                    (o[c] = u), d || ((d = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function pu(t, e, r) {
  t ? Ee(r, t, e) : e();
}
function mu(t, e, r, n, i, o, s, a) {
  let c = [],
    l = 0,
    d = 0,
    u = !1,
    f = () => {
      u && !c.length && !l && e.complete();
    },
    m = (E) => (l < n ? w(E) : c.push(E)),
    w = (E) => {
      o && e.next(E), l++;
      let ne = !1;
      W(r(E, d++)).subscribe(
        S(
          e,
          (j) => {
            i?.(j), o ? m(j) : e.next(j);
          },
          () => {
            ne = !0;
          },
          void 0,
          () => {
            if (ne)
              try {
                for (l--; c.length && l < n; ) {
                  let j = c.shift();
                  s ? Ee(e, s, () => w(j)) : w(j);
                }
                f();
              } catch (j) {
                e.error(j);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      S(e, m, () => {
        (u = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function re(t, e, r = 1 / 0) {
  return I(e)
    ? re((n, i) => C((o, s) => e(n, o, i, s))(W(t(n, i))), r)
    : (typeof e == "number" && (r = e), A((n, i) => mu(n, i, t, r)));
}
function at(t = 1 / 0) {
  return re(Ie, t);
}
function gu() {
  return at(1);
}
function Ut(...t) {
  return gu()(X(t, st(t)));
}
function oo(t) {
  return new M((e) => {
    W(t()).subscribe(e);
  });
}
function ia(...t) {
  let e = zi(t),
    { args: r, keys: n } = ro(t),
    i = new M((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        l = s;
      for (let d = 0; d < s; d++) {
        let u = !1;
        W(r[d]).subscribe(
          S(
            o,
            (f) => {
              u || ((u = !0), l--), (a[d] = f);
            },
            () => c--,
            void 0,
            () => {
              (!c || !u) && (l || o.next(n ? io(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(qn(e)) : i;
}
var Eb = ["addListener", "removeListener"],
  xb = ["addEventListener", "removeEventListener"],
  Tb = ["on", "off"];
function $t(t, e, r, n) {
  if ((I(r) && ((n = r), (r = void 0)), n)) return $t(t, e, r).pipe(qn(n));
  let [i, o] = Ab(t)
    ? xb.map((s) => (a) => t[s](e, a, r))
    : Mb(t)
    ? Eb.map(bu(t, e))
    : Sb(t)
    ? Tb.map(bu(t, e))
    : [];
  if (!i && Gn(t)) return re((s) => $t(s, e, r))(W(t));
  if (!i) throw new TypeError("Invalid event target");
  return new M((s) => {
    let a = (...c) => s.next(1 < c.length ? c : c[0]);
    return i(a), () => o(a);
  });
}
function bu(t, e) {
  return (r) => (n) => t[r](e, n);
}
function Mb(t) {
  return I(t.addListener) && I(t.removeListener);
}
function Sb(t) {
  return I(t.on) && I(t.off);
}
function Ab(t) {
  return I(t.addEventListener) && I(t.removeEventListener);
}
function Rr(t = 0, e, r = eu) {
  let n = -1;
  return (
    e != null && (Hi(e) ? (r = e) : (n = e)),
    new M((i) => {
      let o = hu(t) ? +t - r.now() : t;
      o < 0 && (o = 0);
      let s = 0;
      return r.schedule(function () {
        i.closed ||
          (i.next(s++), 0 <= n ? this.schedule(void 0, n) : i.complete());
      }, o);
    })
  );
}
function so(...t) {
  let e = st(t),
    r = tu(t, 1 / 0),
    n = t;
  return n.length ? (n.length === 1 ? W(n[0]) : at(r)(X(n, e))) : ve;
}
function ae(t, e) {
  return A((r, n) => {
    let i = 0;
    r.subscribe(S(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function vu(t) {
  return A((e, r) => {
    let n = !1,
      i = null,
      o = null,
      s = !1,
      a = () => {
        if ((o?.unsubscribe(), (o = null), n)) {
          n = !1;
          let l = i;
          (i = null), r.next(l);
        }
        s && r.complete();
      },
      c = () => {
        (o = null), s && r.complete();
      };
    e.subscribe(
      S(
        r,
        (l) => {
          (n = !0), (i = l), o || W(t(l)).subscribe((o = S(r, a, c)));
        },
        () => {
          (s = !0), (!n || !o || o.closed) && r.complete();
        }
      )
    );
  });
}
function oa(t, e = Ar) {
  return vu(() => Rr(t, e));
}
function ct(t) {
  return A((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      S(r, void 0, void 0, (s) => {
        (o = W(t(s, ct(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function yu(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      c = e,
      l = 0;
    o.subscribe(
      S(
        s,
        (d) => {
          let u = l++;
          (c = a ? t(c, d, u) : ((a = !0), d)), n && s.next(c);
        },
        i &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function Dt(t, e) {
  return I(e) ? re(t, e, 1) : re(t, 1);
}
function bn(t, e = Ar) {
  return A((r, n) => {
    let i = null,
      o = null,
      s = null,
      a = () => {
        if (i) {
          i.unsubscribe(), (i = null);
          let l = o;
          (o = null), n.next(l);
        }
      };
    function c() {
      let l = s + t,
        d = e.now();
      if (d < l) {
        (i = this.schedule(void 0, l - d)), n.add(i);
        return;
      }
      a();
    }
    r.subscribe(
      S(
        n,
        (l) => {
          (o = l), (s = e.now()), i || ((i = e.schedule(c, t)), n.add(i));
        },
        () => {
          a(), n.complete();
        },
        void 0,
        () => {
          o = i = null;
        }
      )
    );
  });
}
function Ht(t) {
  return A((e, r) => {
    let n = !1;
    e.subscribe(
      S(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function ye(t) {
  return t <= 0
    ? () => ve
    : A((e, r) => {
        let n = 0;
        e.subscribe(
          S(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function sa(t) {
  return C(() => t);
}
function Nr(t, e = Ie) {
  return (
    (t = t ?? Rb),
    A((r, n) => {
      let i,
        o = !0;
      r.subscribe(
        S(n, (s) => {
          let a = e(s);
          (o || !t(i, a)) && ((o = !1), (i = a), n.next(s));
        })
      );
    })
  );
}
function Rb(t, e) {
  return t === e;
}
function ao(t = Nb) {
  return A((e, r) => {
    let n = !1;
    e.subscribe(
      S(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function Nb() {
  return new wt();
}
function zt(t) {
  return A((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function lt(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ae((i, o) => t(i, o, n)) : Ie,
      ye(1),
      r ? Ht(e) : ao(() => new wt())
    );
}
function Zn(t) {
  return t <= 0
    ? () => ve
    : A((e, r) => {
        let n = [];
        e.subscribe(
          S(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function aa(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ae((i, o) => t(i, o, n)) : Ie,
      Zn(1),
      r ? Ht(e) : ao(() => new wt())
    );
}
function ca(t, e) {
  return A(yu(t, e, arguments.length >= 2, !0));
}
function da(t = {}) {
  let {
    connector: e = () => new B(),
    resetOnError: r = !0,
    resetOnComplete: n = !0,
    resetOnRefCountZero: i = !0,
  } = t;
  return (o) => {
    let s,
      a,
      c,
      l = 0,
      d = !1,
      u = !1,
      f = () => {
        a?.unsubscribe(), (a = void 0);
      },
      m = () => {
        f(), (s = c = void 0), (d = u = !1);
      },
      w = () => {
        let E = s;
        m(), E?.unsubscribe();
      };
    return A((E, ne) => {
      l++, !u && !d && f();
      let j = (c = c ?? e());
      ne.add(() => {
        l--, l === 0 && !u && !d && (a = la(w, i));
      }),
        j.subscribe(ne),
        !s &&
          l > 0 &&
          ((s = new _t({
            next: (ie) => j.next(ie),
            error: (ie) => {
              (u = !0), f(), (a = la(m, r, ie)), j.error(ie);
            },
            complete: () => {
              (d = !0), f(), (a = la(m, n)), j.complete();
            },
          })),
          W(E).subscribe(s));
    })(o);
  };
}
function la(t, e, ...r) {
  if (e === !0) {
    t();
    return;
  }
  if (e === !1) return;
  let n = new _t({
    next: () => {
      n.unsubscribe(), t();
    },
  });
  return W(e(...r)).subscribe(n);
}
function vn(t) {
  return ae((e, r) => t <= r);
}
function It(...t) {
  let e = st(t);
  return A((r, n) => {
    (e ? Ut(t, r, e) : Ut(t, r)).subscribe(n);
  });
}
function _e(t, e) {
  return A((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      S(
        n,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            d = o++;
          W(t(c, d)).subscribe(
            (i = S(
              n,
              (u) => n.next(e ? e(c, u, d, l++) : u),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function we(t) {
  return A((e, r) => {
    W(t).subscribe(S(r, () => r.complete(), Mr)), !r.closed && e.subscribe(r);
  });
}
function J(t, e, r) {
  let n = I(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? A((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          S(
            o,
            (c) => {
              var l;
              (l = n.next) === null || l === void 0 || l.call(n, c), o.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = n.complete) === null || c === void 0 || c.call(n),
                o.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = n.error) === null || l === void 0 || l.call(n, c),
                o.error(c);
            },
            () => {
              var c, l;
              a && ((c = n.unsubscribe) === null || c === void 0 || c.call(n)),
                (l = n.finalize) === null || l === void 0 || l.call(n);
            }
          )
        );
      })
    : Ie;
}
var sf = "https://g.co/ng/security#xss",
  D = class extends Error {
    constructor(e, r) {
      super(_c(e, r)), (this.code = e);
    }
  };
function _c(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var Ca = class extends B {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (o = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((o = ua(o)), i && (i = ua(i)), s && (s = ua(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof Z && e.add(a), a;
  }
};
function ua(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var K = Ca;
var O = (function (t) {
  return (
    (t[(t.Default = 0)] = "Default"),
    (t[(t.Host = 1)] = "Host"),
    (t[(t.Self = 2)] = "Self"),
    (t[(t.SkipSelf = 4)] = "SkipSelf"),
    (t[(t.Optional = 8)] = "Optional"),
    t
  );
})(O || {});
function Te(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(Te).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function Ea(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var af = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(af || {}),
  ft = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(ft || {});
function qr(t) {
  return { toString: t }.toString();
}
var pe = globalThis;
var tr = {},
  xe = [];
function Q(t) {
  for (let e in t) if (t[e] === Q) return e;
  throw Error("Could not find renamed property on target object.");
}
function Ob(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
var Fb = Q({ ɵcmp: Q }),
  Pb = Q({ ɵdir: Q }),
  Lb = Q({ ɵpipe: Q }),
  jb = Q({ ɵmod: Q }),
  Do = Q({ ɵfac: Q }),
  kr = Q({ __NG_ELEMENT_ID__: Q }),
  _u = Q({ __NG_ENV_ID__: Q }),
  N = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(N || {});
function cf(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function xa(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      Bb(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function lf(t) {
  return t === 3 || t === 4 || t === 6;
}
function Bb(t) {
  return t.charCodeAt(0) === 64;
}
function Fr(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? wu(t, r, i, null, e[++n])
              : wu(t, r, i, null, null));
      }
    }
  return t;
}
function wu(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var df = "ng-template";
function Vb(t, e, r) {
  let n = 0,
    i = !0;
  for (; n < t.length; ) {
    let o = t[n++];
    if (typeof o == "string" && i) {
      let s = t[n++];
      if (r && o === "class" && cf(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; n < t.length && typeof (o = t[n++]) == "string"; )
        if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == "number" && (i = !1);
  }
  return !1;
}
function uf(t) {
  return t.type === 4 && t.value !== df;
}
function Ub(t, e, r) {
  let n = t.type === 4 && !r ? df : t.value;
  return e === n;
}
function $b(t, e, r) {
  let n = 4,
    i = t.attrs || [],
    o = Wb(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !Xe(n) && !Xe(c)) return !1;
      if (s && Xe(c)) continue;
      (s = !1), (n = c | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (c !== "" && !Ub(t, c, r)) || (c === "" && e.length === 1))
        ) {
          if (Xe(n)) return !1;
          s = !0;
        }
      } else {
        let l = n & 8 ? c : e[++a];
        if (n & 8 && t.attrs !== null) {
          if (!Vb(t.attrs, l, r)) {
            if (Xe(n)) return !1;
            s = !0;
          }
          continue;
        }
        let d = n & 8 ? "class" : c,
          u = Hb(d, i, uf(t), r);
        if (u === -1) {
          if (Xe(n)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let f;
          u > o ? (f = "") : (f = i[u + 1].toLowerCase());
          let m = n & 8 ? f : null;
          if ((m && cf(m, l, 0) !== -1) || (n & 2 && l !== f)) {
            if (Xe(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return Xe(n) || s;
}
function Xe(t) {
  return (t & 1) === 0;
}
function Hb(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return Gb(e, t);
}
function ff(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if ($b(t, e[n], r)) return !0;
  return !1;
}
function zb(t) {
  let e = t.attrs;
  if (e != null) {
    let r = e.indexOf(5);
    if (!(r & 1)) return e[r + 1];
  }
  return null;
}
function Wb(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (lf(r)) return e;
  }
  return t.length;
}
function Gb(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function qb(t, e) {
  e: for (let r = 0; r < e.length; r++) {
    let n = e[r];
    if (t.length === n.length) {
      for (let i = 0; i < t.length; i++) if (t[i] !== n[i]) continue e;
      return !0;
    }
  }
  return !1;
}
function Du(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function Zb(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !Xe(s) && ((e += Du(o, i)), (i = "")),
        (n = s),
        (o = o || !Xe(n));
    r++;
  }
  return i !== "" && (e += Du(o, i)), e;
}
function Qb(t) {
  return t.map(Zb).join(",");
}
function Yb(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!Xe(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function Y(t) {
  return qr(() => {
    let e = bf(t),
      r = oe(g({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === af.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || ft.Emulated,
        styles: t.styles || xe,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    vf(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = Cu(n, !1)), (r.pipeDefs = Cu(n, !0)), (r.id = Jb(r)), r
    );
  });
}
function Kb(t) {
  return qt(t) || hf(t);
}
function Xb(t) {
  return t !== null;
}
function V(t) {
  return qr(() => ({
    type: t.type,
    bootstrap: t.bootstrap || xe,
    declarations: t.declarations || xe,
    imports: t.imports || xe,
    exports: t.exports || xe,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function Iu(t, e) {
  if (t == null) return tr;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o,
        s,
        a = N.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((r[o] = a !== N.None ? [n, a] : n), (e[o] = s)) : (r[o] = n);
    }
  return r;
}
function le(t) {
  return qr(() => {
    let e = bf(t);
    return vf(e), e;
  });
}
function qt(t) {
  return t[Fb] || null;
}
function hf(t) {
  return t[Pb] || null;
}
function pf(t) {
  return t[Lb] || null;
}
function mf(t) {
  let e = qt(t) || hf(t) || pf(t);
  return e !== null ? e.standalone : !1;
}
function gf(t, e) {
  let r = t[jb] || null;
  if (!r && e === !0)
    throw new Error(`Type ${Te(t)} does not have '\u0275mod' property.`);
  return r;
}
function bf(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || tr,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || xe,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Iu(t.inputs, e),
    outputs: Iu(t.outputs),
    debugInfo: null,
  };
}
function vf(t) {
  t.features?.forEach((e) => e(t));
}
function Cu(t, e) {
  if (!t) return null;
  let r = e ? pf : Kb;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(Xb);
}
function Jb(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
var St = 0,
  F = 1,
  x = 2,
  me = 3,
  et = 4,
  Fe = 5,
  Pr = 6,
  Lr = 7,
  Ct = 8,
  nr = 9,
  Et = 10,
  ue = 11,
  jr = 12,
  Eu = 13,
  Zr = 14,
  tt = 15,
  Qr = 16,
  Qn = 17,
  xt = 18,
  Bo = 19,
  yf = 20,
  Gt = 21,
  fa = 22,
  wn = 23,
  Zt = 25,
  _f = 1;
var Dn = 7,
  Io = 8,
  rr = 9,
  Oe = 10,
  wc = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(wc || {});
function yn(t) {
  return Array.isArray(t) && typeof t[_f] == "object";
}
function At(t) {
  return Array.isArray(t) && t[_f] === !0;
}
function wf(t) {
  return (t.flags & 4) !== 0;
}
function Vo(t) {
  return t.componentOffset > -1;
}
function Df(t) {
  return (t.flags & 1) === 1;
}
function In(t) {
  return !!t.template;
}
function ev(t) {
  return (t[x] & 512) !== 0;
}
var tv = "svg",
  nv = "math",
  rv = !1;
function iv() {
  return rv;
}
function ht(t) {
  for (; Array.isArray(t); ) t = t[St];
  return t;
}
function If(t, e) {
  return ht(e[t]);
}
function ze(t, e) {
  return ht(e[t.index]);
}
function Cf(t, e) {
  return t.data[e];
}
function Kt(t, e) {
  let r = e[t];
  return yn(r) ? r : r[St];
}
function ov(t) {
  return (t[x] & 4) === 4;
}
function Dc(t) {
  return (t[x] & 128) === 128;
}
function sv(t) {
  return At(t[me]);
}
function xu(t, e) {
  return e == null ? null : t[e];
}
function Ef(t) {
  t[Qn] = 0;
}
function av(t) {
  t[x] & 1024 || ((t[x] |= 1024), Dc(t) && Br(t));
}
function Ic(t) {
  return !!(t[x] & 9216 || t[wn]?.dirty);
}
function Ta(t) {
  Ic(t)
    ? Br(t)
    : t[x] & 64 &&
      (iv()
        ? ((t[x] |= 1024), Br(t))
        : t[Et].changeDetectionScheduler?.notify());
}
function Br(t) {
  t[Et].changeDetectionScheduler?.notify();
  let e = Vr(t);
  for (; e !== null && !(e[x] & 8192 || ((e[x] |= 8192), !Dc(e))); ) e = Vr(e);
}
function xf(t, e) {
  if ((t[x] & 256) === 256) throw new D(911, !1);
  t[Gt] === null && (t[Gt] = []), t[Gt].push(e);
}
function cv(t, e) {
  if (t[Gt] === null) return;
  let r = t[Gt].indexOf(e);
  r !== -1 && t[Gt].splice(r, 1);
}
function Vr(t) {
  let e = t[me];
  return At(e) ? e[me] : e;
}
var L = { lFrame: Pf(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function lv() {
  return L.lFrame.elementDepthCount;
}
function dv() {
  L.lFrame.elementDepthCount++;
}
function uv() {
  L.lFrame.elementDepthCount--;
}
function Tf() {
  return L.bindingsEnabled;
}
function Mf() {
  return L.skipHydrationRootTNode !== null;
}
function fv(t) {
  return L.skipHydrationRootTNode === t;
}
function hv() {
  L.skipHydrationRootTNode = null;
}
function q() {
  return L.lFrame.lView;
}
function Pe() {
  return L.lFrame.tView;
}
function Le() {
  let t = Sf();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function Sf() {
  return L.lFrame.currentTNode;
}
function pv() {
  let t = L.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Uo(t, e) {
  let r = L.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function Af() {
  return L.lFrame.isParent;
}
function Rf() {
  L.lFrame.isParent = !1;
}
function mv() {
  let t = L.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function gv(t) {
  return (L.lFrame.bindingIndex = t);
}
function Cc() {
  return L.lFrame.bindingIndex++;
}
function Nf(t) {
  let e = L.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function bv() {
  return L.lFrame.inI18n;
}
function vv(t, e) {
  let r = L.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), Ma(e);
}
function yv() {
  return L.lFrame.currentDirectiveIndex;
}
function Ma(t) {
  L.lFrame.currentDirectiveIndex = t;
}
function _v(t) {
  let e = L.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function kf() {
  return L.lFrame.currentQueryIndex;
}
function Ec(t) {
  L.lFrame.currentQueryIndex = t;
}
function wv(t) {
  let e = t[F];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Fe] : null;
}
function Of(t, e, r) {
  if (r & O.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & O.Host); )
      if (((i = wv(o)), i === null || ((o = o[Zr]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (L.lFrame = Ff());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function xc(t) {
  let e = Ff(),
    r = t[F];
  (L.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function Ff() {
  let t = L.lFrame,
    e = t === null ? null : t.child;
  return e === null ? Pf(t) : e;
}
function Pf(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Lf() {
  let t = L.lFrame;
  return (L.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var jf = Lf;
function Tc() {
  let t = Lf();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function Mn() {
  return L.lFrame.selectedIndex;
}
function Cn(t) {
  L.lFrame.selectedIndex = t;
}
function Bf() {
  let t = L.lFrame;
  return Cf(t.tView, t.selectedIndex);
}
function Dv() {
  return L.lFrame.currentNamespace;
}
var Vf = !0;
function Uf() {
  return Vf;
}
function $f(t) {
  Vf = t;
}
function Iv() {
  return dr(Le(), q());
}
function dr(t, e) {
  return new U(ze(t, e));
}
var U = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = Iv;
  let t = e;
  return t;
})();
function Cv(t) {
  return t instanceof U ? t.nativeElement : t;
}
function Ev(t, e, r) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; n++) {
    let i = t[n],
      o = e[n];
    if ((r && ((i = r(i)), (o = r(o))), o !== i)) return !1;
  }
  return !0;
}
function xv(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function Mc(t, e) {
  t.forEach((r) => (Array.isArray(r) ? Mc(r, e) : e(r)));
}
function Hf(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function Co(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function Tv(t, e) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(e);
  return r;
}
function Mv(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function Sc(t, e, r) {
  let n = Yr(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), Mv(t, n, e, r)), n;
}
function ha(t, e) {
  let r = Yr(t, e);
  if (r >= 0) return t[r | 1];
}
function Yr(t, e) {
  return Sv(t, e, 1);
}
function Sv(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
function Av() {
  return this._results[Symbol.iterator]();
}
var En = class t {
  get changes() {
    return (this._changes ??= new K());
  }
  constructor(e = !1) {
    (this._emitDistinctChangesOnly = e),
      (this.dirty = !0),
      (this._onDirty = void 0),
      (this._results = []),
      (this._changesDetected = !1),
      (this._changes = void 0),
      (this.length = 0),
      (this.first = void 0),
      (this.last = void 0);
    let r = t.prototype;
    r[Symbol.iterator] || (r[Symbol.iterator] = Av);
  }
  get(e) {
    return this._results[e];
  }
  map(e) {
    return this._results.map(e);
  }
  filter(e) {
    return this._results.filter(e);
  }
  find(e) {
    return this._results.find(e);
  }
  reduce(e, r) {
    return this._results.reduce(e, r);
  }
  forEach(e) {
    this._results.forEach(e);
  }
  some(e) {
    return this._results.some(e);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(e, r) {
    this.dirty = !1;
    let n = xv(e);
    (this._changesDetected = !Ev(this._results, n, r)) &&
      ((this._results = n),
      (this.length = n.length),
      (this.last = n[this.length - 1]),
      (this.first = n[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.emit(this);
  }
  onDirty(e) {
    this._onDirty = e;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
};
function zf(t) {
  return (t.flags & 128) === 128;
}
var Sa;
function Wf(t) {
  Sa = t;
}
function Rv() {
  if (Sa !== void 0) return Sa;
  if (typeof document < "u") return document;
  throw new D(210, !1);
}
function b(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function $(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function $o(t) {
  return Tu(t, qf) || Tu(t, Zf);
}
function Gf(t) {
  return $o(t) !== null;
}
function Tu(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function Nv(t) {
  let e = t && (t[qf] || t[Zf]);
  return e || null;
}
function Mu(t) {
  return t && (t.hasOwnProperty(Su) || t.hasOwnProperty(kv)) ? t[Su] : null;
}
var qf = Q({ ɵprov: Q }),
  Su = Q({ ɵinj: Q }),
  Zf = Q({ ngInjectableDef: Q }),
  kv = Q({ ngInjectorDef: Q }),
  _ = class {
    constructor(e, r) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = b({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  },
  Kr = new _("", { providedIn: "root", factory: () => Ov }),
  Ov = "ng",
  Ac = new _(""),
  pt = new _("", { providedIn: "platform", factory: () => "unknown" });
var Rt = new _(""),
  Xr = new _("", {
    providedIn: "root",
    factory: () =>
      Rv().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
var Fv = Q({ __forward_ref__: Q });
function Rc(t) {
  return (
    (t.__forward_ref__ = Rc),
    (t.toString = function () {
      return Te(this());
    }),
    t
  );
}
function He(t) {
  return Qf(t) ? t() : t;
}
function Qf(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(Fv) && t.__forward_ref__ === Rc
  );
}
function Yf(t) {
  return t && !!t.ɵproviders;
}
function Ho(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function Pv(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : Ho(t);
}
function Lv(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new D(-200, t);
}
function Nc(t, e) {
  throw new D(-201, !1);
}
var Aa;
function Kf() {
  return Aa;
}
function $e(t) {
  let e = Aa;
  return (Aa = t), e;
}
function Xf(t, e, r) {
  let n = $o(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & O.Optional) return null;
  if (e !== void 0) return e;
  Nc(t, "Injector");
}
var jv = {},
  Ur = jv,
  Ra = "__NG_DI_FLAG__",
  Eo = "ngTempTokenPath",
  Bv = "ngTokenPath",
  Vv = /\n/gm,
  Uv = "\u0275",
  Au = "__source",
  Jn;
function $v() {
  return Jn;
}
function Wt(t) {
  let e = Jn;
  return (Jn = t), e;
}
function Hv(t, e = O.Default) {
  if (Jn === void 0) throw new D(-203, !1);
  return Jn === null
    ? Xf(t, void 0, e)
    : Jn.get(t, e & O.Optional ? null : void 0, e);
}
function h(t, e = O.Default) {
  return (Kf() || Hv)(He(t), e);
}
function p(t, e = O.Default) {
  return h(t, zo(e));
}
function zo(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Na(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = He(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new D(900, !1);
      let i,
        o = O.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          c = zv(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(h(i, o));
    } else e.push(h(n));
  }
  return e;
}
function Jf(t, e) {
  return (t[Ra] = e), (t.prototype[Ra] = e), t;
}
function zv(t) {
  return t[Ra];
}
function Wv(t, e, r, n) {
  let i = t[Eo];
  throw (
    (e[Au] && i.unshift(e[Au]),
    (t.message = Gv(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[Bv] = i),
    (t[Eo] = null),
    t)
  );
}
function Gv(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == Uv
      ? t.slice(2)
      : t;
  let i = Te(e);
  if (Array.isArray(e)) i = e.map(Te).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : Te(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    Vv,
    `
  `
  )}`;
}
var qv = "h",
  Zv = "b";
var Qv = () => null;
function kc(t, e, r = !1) {
  return Qv(t, e, r);
}
var co = "__parameters__";
function Yv(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function eh(t, e, r) {
  return qr(() => {
    let n = Yv(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(c, l, d) {
        let u = c.hasOwnProperty(co)
          ? c[co]
          : Object.defineProperty(c, co, { value: [] })[co];
        for (; u.length <= d; ) u.push(null);
        return (u[d] = u[d] || []).push(s), c;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var Wo = Jf(eh("Optional"), 8);
var Oc = Jf(eh("SkipSelf"), 4);
function ir(t, e) {
  let r = t.hasOwnProperty(Do);
  return r ? t[Do] : null;
}
var or = new _(""),
  th = new _("", -1),
  nh = new _(""),
  xo = class {
    get(e, r = Ur) {
      if (r === Ur) {
        let n = new Error(`NullInjectorError: No provider for ${Te(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  };
function Kv(...t) {
  return { ɵproviders: rh(!0, t), ɵfromNgModule: !0 };
}
function rh(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    Mc(e, (s) => {
      let a = s;
      ka(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && ih(i, o),
    r
  );
}
function ih(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    Fc(i, (o) => {
      e(o, n);
    });
  }
}
function ka(t, e, r, n) {
  if (((t = He(t)), !t)) return !1;
  let i = null,
    o = Mu(t),
    s = !o && qt(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = Mu(c)), o)) i = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) ka(l, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let l;
      try {
        Mc(o.imports, (d) => {
          ka(d, e, r, n) && ((l ||= []), l.push(d));
        });
      } finally {
      }
      l !== void 0 && ih(l, e);
    }
    if (!a) {
      let l = ir(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: xe }, i),
        e({ provide: nh, useValue: i, multi: !0 }, i),
        e({ provide: or, useValue: () => h(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let l = t;
      Fc(c, (d) => {
        e(d, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Fc(t, e) {
  for (let r of t)
    Yf(r) && (r = r.ɵproviders), Array.isArray(r) ? Fc(r, e) : e(r);
}
var Xv = Q({ provide: String, useValue: Q });
function oh(t) {
  return t !== null && typeof t == "object" && Xv in t;
}
function Jv(t) {
  return !!(t && t.useExisting);
}
function ey(t) {
  return !!(t && t.useFactory);
}
function Oa(t) {
  return typeof t == "function";
}
var Go = new _(""),
  go = {},
  ty = {},
  pa;
function Pc() {
  return pa === void 0 && (pa = new xo()), pa;
}
var Me = class {},
  $r = class extends Me {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Pa(e, (s) => this.processProvider(s)),
        this.records.set(th, Yn(void 0, this)),
        i.has("environment") && this.records.set(Me, Yn(void 0, this));
      let o = this.records.get(Go);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(nh, xe, O.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of e) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = Wt(this),
        n = $e(void 0),
        i;
      try {
        return e();
      } finally {
        Wt(r), $e(n);
      }
    }
    get(e, r = Ur, n = O.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(_u))) return e[_u](this);
      n = zo(n);
      let i,
        o = Wt(this),
        s = $e(void 0);
      try {
        if (!(n & O.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = ay(e) && $o(e);
            l && this.injectableDefInScope(l)
              ? (c = Yn(Fa(e), go))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = n & O.Self ? Pc() : this.parent;
        return (r = n & O.Optional && r === Ur ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Eo] = a[Eo] || []).unshift(Te(e)), o)) throw a;
          return Wv(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        $e(s), Wt(o);
      }
    }
    resolveInjectorInitializers() {
      let e = Wt(this),
        r = $e(void 0),
        n;
      try {
        let i = this.get(or, xe, O.Self);
        for (let o of i) o();
      } finally {
        Wt(e), $e(r);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(Te(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new D(205, !1);
    }
    processProvider(e) {
      e = He(e);
      let r = Oa(e) ? e : He(e && e.provide),
        n = ry(e);
      if (!Oa(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = Yn(void 0, go, !0)),
          (i.factory = () => Na(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      return (
        r.value === go && ((r.value = ty), (r.value = r.factory())),
        typeof r.value == "object" &&
          r.value &&
          sy(r.value) &&
          this._ngOnDestroyHooks.add(r.value),
        r.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = He(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function Fa(t) {
  let e = $o(t),
    r = e !== null ? e.factory : ir(t);
  if (r !== null) return r;
  if (t instanceof _) throw new D(204, !1);
  if (t instanceof Function) return ny(t);
  throw new D(204, !1);
}
function ny(t) {
  if (t.length > 0) throw new D(204, !1);
  let r = Nv(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function ry(t) {
  if (oh(t)) return Yn(void 0, t.useValue);
  {
    let e = iy(t);
    return Yn(e, go);
  }
}
function iy(t, e, r) {
  let n;
  if (Oa(t)) {
    let i = He(t);
    return ir(i) || Fa(i);
  } else if (oh(t)) n = () => He(t.useValue);
  else if (ey(t)) n = () => t.useFactory(...Na(t.deps || []));
  else if (Jv(t)) n = () => h(He(t.useExisting));
  else {
    let i = He(t && (t.useClass || t.provide));
    if (oy(t)) n = () => new i(...Na(t.deps));
    else return ir(i) || Fa(i);
  }
  return n;
}
function Yn(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function oy(t) {
  return !!t.deps;
}
function sy(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function ay(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof _);
}
function Pa(t, e) {
  for (let r of t)
    Array.isArray(r) ? Pa(r, e) : r && Yf(r) ? Pa(r.ɵproviders, e) : e(r);
}
function Xt(t, e) {
  t instanceof $r && t.assertNotDestroyed();
  let r,
    n = Wt(t),
    i = $e(void 0);
  try {
    return e();
  } finally {
    Wt(n), $e(i);
  }
}
function cy(t) {
  if (!Kf() && !$v()) throw new D(-203, !1);
}
function ly(t) {
  let e = pe.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function dy(t) {
  return typeof t == "function";
}
var La = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function sh(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function Nt() {
  return ah;
}
function ah(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = fy), uy;
}
Nt.ngInherit = !0;
function uy() {
  let t = lh(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === tr) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function fy(t, e, r, n, i) {
  let o = this.declaredInputs[n],
    s = lh(t) || hy(t, { previous: tr, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[o];
  (a[o] = new La(l && l.currentValue, r, c === tr)), sh(t, e, i, r);
}
var ch = "__ngSimpleChanges__";
function lh(t) {
  return t[ch] || null;
}
function hy(t, e) {
  return (t[ch] = e);
}
var Ru = null;
var dt = function (t, e, r) {
  Ru?.(t, e, r);
};
function py(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = ah(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function dh(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: d,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      c && (t.viewHooks ??= []).push(-r, c),
      l &&
        ((t.viewHooks ??= []).push(r, l), (t.viewCheckHooks ??= []).push(r, l)),
      d != null && (t.destroyHooks ??= []).push(r, d);
  }
}
function bo(t, e, r) {
  uh(t, e, 3, r);
}
function vo(t, e, r, n) {
  (t[x] & 3) === r && uh(t, e, r, n);
}
function ma(t, e) {
  let r = t[x];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[x] = r));
}
function uh(t, e, r, n) {
  let i = n !== void 0 ? t[Qn] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), n != null && a >= n)) break;
    } else
      e[c] < 0 && (t[Qn] += 65536),
        (a < o || o == -1) &&
          (my(t, r, e, c), (t[Qn] = (t[Qn] & 4294901760) + c + 2)),
        c++;
}
function Nu(t, e) {
  dt(4, t, e);
  let r = ke(null);
  try {
    e.call(t);
  } finally {
    ke(r), dt(5, t, e);
  }
}
function my(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[x] >> 14 < t[Qn] >> 16 &&
      (t[x] & 3) === e &&
      ((t[x] += 16384), Nu(a, o))
    : Nu(a, o);
}
var er = -1,
  Hr = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function gy(t) {
  return t instanceof Hr;
}
function by(t) {
  return (t.flags & 8) !== 0;
}
function vy(t) {
  return (t.flags & 16) !== 0;
}
function fh(t) {
  return t !== er;
}
function To(t) {
  return t & 32767;
}
function yy(t) {
  return t >> 16;
}
function Mo(t, e) {
  let r = yy(t),
    n = e;
  for (; r > 0; ) (n = n[Zr]), r--;
  return n;
}
var ja = !0;
function ku(t) {
  let e = ja;
  return (ja = t), e;
}
var _y = 256,
  hh = _y - 1,
  ph = 5,
  wy = 0,
  ut = {};
function Dy(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(kr) && (n = r[kr]),
    n == null && (n = r[kr] = wy++);
  let i = n & hh,
    o = 1 << i;
  e.data[t + (i >> ph)] |= o;
}
function mh(t, e) {
  let r = gh(t, e);
  if (r !== -1) return r;
  let n = e[F];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    ga(n.data, t),
    ga(e, null),
    ga(n.blueprint, null));
  let i = Lc(t, e),
    o = t.injectorIndex;
  if (fh(i)) {
    let s = To(i),
      a = Mo(i, e),
      c = a[F].data;
    for (let l = 0; l < 8; l++) e[o + l] = a[s + l] | c[s + l];
  }
  return (e[o + 8] = i), o;
}
function ga(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function gh(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Lc(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = wh(i)), n === null)) return er;
    if ((r++, (i = i[Zr]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return er;
}
function Iy(t, e, r) {
  Dy(t, e, r);
}
function Cy(t, e) {
  if (e === "class") return t.classes;
  if (e === "style") return t.styles;
  let r = t.attrs;
  if (r) {
    let n = r.length,
      i = 0;
    for (; i < n; ) {
      let o = r[i];
      if (lf(o)) break;
      if (o === 0) i = i + 2;
      else if (typeof o == "number")
        for (i++; i < n && typeof r[i] == "string"; ) i++;
      else {
        if (o === e) return r[i + 1];
        i = i + 2;
      }
    }
  }
  return null;
}
function bh(t, e, r) {
  if (r & O.Optional || t !== void 0) return t;
  Nc(e, "NodeInjector");
}
function vh(t, e, r, n) {
  if (
    (r & O.Optional && n === void 0 && (n = null), !(r & (O.Self | O.Host)))
  ) {
    let i = t[nr],
      o = $e(void 0);
    try {
      return i ? i.get(e, n, r & O.Optional) : Xf(e, n, r & O.Optional);
    } finally {
      $e(o);
    }
  }
  return bh(n, e, r);
}
function yh(t, e, r, n = O.Default, i) {
  if (t !== null) {
    if (e[x] & 2048 && !(n & O.Self)) {
      let s = My(t, e, r, n, ut);
      if (s !== ut) return s;
    }
    let o = _h(t, e, r, n, ut);
    if (o !== ut) return o;
  }
  return vh(e, r, n, i);
}
function _h(t, e, r, n, i) {
  let o = xy(r);
  if (typeof o == "function") {
    if (!Of(e, t, n)) return n & O.Host ? bh(i, r, n) : vh(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & O.Optional))) Nc(r);
      else return s;
    } finally {
      jf();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = gh(t, e),
      c = er,
      l = n & O.Host ? e[tt][Fe] : null;
    for (
      (a === -1 || n & O.SkipSelf) &&
      ((c = a === -1 ? Lc(t, e) : e[a + 8]),
      c === er || !Fu(n, !1)
        ? (a = -1)
        : ((s = e[F]), (a = To(c)), (e = Mo(c, e))));
      a !== -1;

    ) {
      let d = e[F];
      if (Ou(o, a, d.data)) {
        let u = Ey(a, e, r, s, n, l);
        if (u !== ut) return u;
      }
      (c = e[a + 8]),
        c !== er && Fu(n, e[F].data[a + 8] === l) && Ou(o, a, e)
          ? ((s = d), (a = To(c)), (e = Mo(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function Ey(t, e, r, n, i, o) {
  let s = e[F],
    a = s.data[t + 8],
    c = n == null ? Vo(a) && ja : n != s && (a.type & 3) !== 0,
    l = i & O.Host && o === a,
    d = yo(a, s, r, c, l);
  return d !== null ? sr(e, s, d, a) : ut;
}
function yo(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    d = o >> 20,
    u = n ? a : a + d,
    f = i ? a + d : l;
  for (let m = u; m < f; m++) {
    let w = s[m];
    if ((m < c && r === w) || (m >= c && w.type === r)) return m;
  }
  if (i) {
    let m = s[c];
    if (m && In(m) && m.type === r) return c;
  }
  return null;
}
function sr(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (gy(i)) {
    let s = i;
    s.resolving && Lv(Pv(o[r]));
    let a = ku(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? $e(s.injectImpl) : null,
      d = Of(t, n, O.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && py(r, o[r], e);
    } finally {
      l !== null && $e(l), ku(a), (s.resolving = !1), jf();
    }
  }
  return i;
}
function xy(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(kr) ? t[kr] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & hh : Ty) : e;
}
function Ou(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> ph)] & n);
}
function Fu(t, e) {
  return !(t & O.Self) && !(t & O.Host && e);
}
var _n = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return yh(this._tNode, this._lView, e, zo(n), r);
  }
};
function Ty() {
  return new _n(Le(), q());
}
function jc(t) {
  return qr(() => {
    let e = t.prototype.constructor,
      r = e[Do] || Ba(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[Do] || Ba(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Ba(t) {
  return Qf(t)
    ? () => {
        let e = Ba(He(t));
        return e && e();
      }
    : ir(t);
}
function My(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[x] & 2048 && !(s[x] & 512); ) {
    let a = _h(o, s, r, n | O.Self, ut);
    if (a !== ut) return a;
    let c = o.parent;
    if (!c) {
      let l = s[yf];
      if (l) {
        let d = l.get(r, ut, n);
        if (d !== ut) return d;
      }
      (c = wh(s)), (s = s[Zr]);
    }
    o = c;
  }
  return i;
}
function wh(t) {
  let e = t[F],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Fe] : null;
}
function Sn(t) {
  return Cy(Le(), t);
}
function Pu(t, e = null, r = null, n) {
  let i = Dh(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function Dh(t, e = null, r = null, n, i = new Set()) {
  let o = [r || xe, Kv(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : Te(t))),
    new $r(o, e || Pc(), n || null, i)
  );
}
var mt = (() => {
    let e = class e {
      static create(n, i) {
        if (Array.isArray(n)) return Pu({ name: "" }, i, n, "");
        {
          let o = n.name ?? "";
          return Pu({ name: o }, n.parent, n.providers, o);
        }
      }
    };
    (e.THROW_IF_NOT_FOUND = Ur),
      (e.NULL = new xo()),
      (e.ɵprov = b({ token: e, providedIn: "any", factory: () => h(th) })),
      (e.__NG_ELEMENT_ID__ = -1);
    let t = e;
    return t;
  })(),
  Sy = "ngOriginalError";
function ba(t) {
  return t[Sy];
}
var Se = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && ba(e);
      for (; r && ba(r); ) r = ba(r);
      return r || null;
    }
  },
  Ih = new _("", {
    providedIn: "root",
    factory: () => p(Se).handleError.bind(void 0),
  });
var Ch = !1,
  Ay = new _("", { providedIn: "root", factory: () => Ch }),
  lo;
function Ry() {
  if (lo === void 0 && ((lo = null), pe.trustedTypes))
    try {
      lo = pe.trustedTypes.createPolicy("angular", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return lo;
}
function qo(t) {
  return Ry()?.createHTML(t) || t;
}
var uo;
function Ny() {
  if (uo === void 0 && ((uo = null), pe.trustedTypes))
    try {
      uo = pe.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return uo;
}
function Lu(t) {
  return Ny()?.createScriptURL(t) || t;
}
var Tt = class {
    constructor(e) {
      this.changingThisBreaksApplicationSecurity = e;
    }
    toString() {
      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${sf})`;
    }
  },
  Va = class extends Tt {
    getTypeName() {
      return "HTML";
    }
  },
  Ua = class extends Tt {
    getTypeName() {
      return "Style";
    }
  },
  $a = class extends Tt {
    getTypeName() {
      return "Script";
    }
  },
  Ha = class extends Tt {
    getTypeName() {
      return "URL";
    }
  },
  za = class extends Tt {
    getTypeName() {
      return "ResourceURL";
    }
  };
function nt(t) {
  return t instanceof Tt ? t.changingThisBreaksApplicationSecurity : t;
}
function Jt(t, e) {
  let r = ky(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${sf})`);
  }
  return r === e;
}
function ky(t) {
  return (t instanceof Tt && t.getTypeName()) || null;
}
function Eh(t) {
  return new Va(t);
}
function xh(t) {
  return new Ua(t);
}
function Th(t) {
  return new $a(t);
}
function Mh(t) {
  return new Ha(t);
}
function Sh(t) {
  return new za(t);
}
function Oy(t) {
  let e = new Ga(t);
  return Fy() ? new Wa(e) : e;
}
var Wa = class {
    constructor(e) {
      this.inertDocumentHelper = e;
    }
    getInertBodyElement(e) {
      e = "<body><remove></remove>" + e;
      try {
        let r = new window.DOMParser().parseFromString(qo(e), "text/html").body;
        return r === null
          ? this.inertDocumentHelper.getInertBodyElement(e)
          : (r.removeChild(r.firstChild), r);
      } catch {
        return null;
      }
    }
  },
  Ga = class {
    constructor(e) {
      (this.defaultDoc = e),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument(
            "sanitization-inert"
          ));
    }
    getInertBodyElement(e) {
      let r = this.inertDocument.createElement("template");
      return (r.innerHTML = qo(e)), r;
    }
  };
function Fy() {
  try {
    return !!new window.DOMParser().parseFromString(qo(""), "text/html");
  } catch {
    return !1;
  }
}
var Py = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Zo(t) {
  return (t = String(t)), t.match(Py) ? t : "unsafe:" + t;
}
function kt(t) {
  let e = {};
  for (let r of t.split(",")) e[r] = !0;
  return e;
}
function Jr(...t) {
  let e = {};
  for (let r of t) for (let n in r) r.hasOwnProperty(n) && (e[n] = !0);
  return e;
}
var Ah = kt("area,br,col,hr,img,wbr"),
  Rh = kt("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
  Nh = kt("rp,rt"),
  Ly = Jr(Nh, Rh),
  jy = Jr(
    Rh,
    kt(
      "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
    )
  ),
  By = Jr(
    Nh,
    kt(
      "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
    )
  ),
  ju = Jr(Ah, jy, By, Ly),
  kh = kt("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
  Vy = kt(
    "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
  ),
  Uy = kt(
    "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
  ),
  $y = Jr(kh, Vy, Uy),
  Hy = kt("script,style,template"),
  qa = class {
    constructor() {
      (this.sanitizedSomething = !1), (this.buf = []);
    }
    sanitizeChildren(e) {
      let r = e.firstChild,
        n = !0;
      for (; r; ) {
        if (
          (r.nodeType === Node.ELEMENT_NODE
            ? (n = this.startElement(r))
            : r.nodeType === Node.TEXT_NODE
            ? this.chars(r.nodeValue)
            : (this.sanitizedSomething = !0),
          n && r.firstChild)
        ) {
          r = r.firstChild;
          continue;
        }
        for (; r; ) {
          r.nodeType === Node.ELEMENT_NODE && this.endElement(r);
          let i = this.checkClobberedElement(r, r.nextSibling);
          if (i) {
            r = i;
            break;
          }
          r = this.checkClobberedElement(r, r.parentNode);
        }
      }
      return this.buf.join("");
    }
    startElement(e) {
      let r = e.nodeName.toLowerCase();
      if (!ju.hasOwnProperty(r))
        return (this.sanitizedSomething = !0), !Hy.hasOwnProperty(r);
      this.buf.push("<"), this.buf.push(r);
      let n = e.attributes;
      for (let i = 0; i < n.length; i++) {
        let o = n.item(i),
          s = o.name,
          a = s.toLowerCase();
        if (!$y.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let c = o.value;
        kh[a] && (c = Zo(c)), this.buf.push(" ", s, '="', Bu(c), '"');
      }
      return this.buf.push(">"), !0;
    }
    endElement(e) {
      let r = e.nodeName.toLowerCase();
      ju.hasOwnProperty(r) &&
        !Ah.hasOwnProperty(r) &&
        (this.buf.push("</"), this.buf.push(r), this.buf.push(">"));
    }
    chars(e) {
      this.buf.push(Bu(e));
    }
    checkClobberedElement(e, r) {
      if (
        r &&
        (e.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_CONTAINED_BY) ===
          Node.DOCUMENT_POSITION_CONTAINED_BY
      )
        throw new Error(
          `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
        );
      return r;
    }
  },
  zy = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  Wy = /([^\#-~ |!])/g;
function Bu(t) {
  return t
    .replace(/&/g, "&amp;")
    .replace(zy, function (e) {
      let r = e.charCodeAt(0),
        n = e.charCodeAt(1);
      return "&#" + ((r - 55296) * 1024 + (n - 56320) + 65536) + ";";
    })
    .replace(Wy, function (e) {
      return "&#" + e.charCodeAt(0) + ";";
    })
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
var fo;
function Oh(t, e) {
  let r = null;
  try {
    fo = fo || Oy(t);
    let n = e ? String(e) : "";
    r = fo.getInertBodyElement(n);
    let i = 5,
      o = n;
    do {
      if (i === 0)
        throw new Error(
          "Failed to sanitize html because the input is unstable"
        );
      i--, (n = o), (o = r.innerHTML), (r = fo.getInertBodyElement(n));
    } while (n !== o);
    let a = new qa().sanitizeChildren(Vu(r) || r);
    return qo(a);
  } finally {
    if (r) {
      let n = Vu(r) || r;
      for (; n.firstChild; ) n.removeChild(n.firstChild);
    }
  }
}
function Vu(t) {
  return "content" in t && Gy(t) ? t.content : null;
}
function Gy(t) {
  return t.nodeType === Node.ELEMENT_NODE && t.nodeName === "TEMPLATE";
}
var De = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(De || {});
function qy(t) {
  let e = Ph();
  return e ? e.sanitize(De.URL, t) || "" : Jt(t, "URL") ? nt(t) : Zo(Ho(t));
}
function Zy(t) {
  let e = Ph();
  if (e) return Lu(e.sanitize(De.RESOURCE_URL, t) || "");
  if (Jt(t, "ResourceURL")) return Lu(nt(t));
  throw new D(904, !1);
}
function Qy(t, e) {
  return (e === "src" &&
    (t === "embed" ||
      t === "frame" ||
      t === "iframe" ||
      t === "media" ||
      t === "script")) ||
    (e === "href" && (t === "base" || t === "link"))
    ? Zy
    : qy;
}
function Fh(t, e, r) {
  return Qy(e, r)(t);
}
function Ph() {
  let t = q();
  return t && t[Et].sanitizer;
}
var Lh = new Map(),
  Yy = 0;
function Ky() {
  return Yy++;
}
function Xy(t) {
  Lh.set(t[Bo], t);
}
function Jy(t) {
  Lh.delete(t[Bo]);
}
var Uu = "__ngContext__";
function ar(t, e) {
  yn(e) ? ((t[Uu] = e[Bo]), Xy(e)) : (t[Uu] = e);
}
function jh(t) {
  return t instanceof Function ? t() : t;
}
function e_(t) {
  return (t ?? p(mt)).get(pt) === "browser";
}
var Mt = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(Mt || {}),
  t_;
function Bc(t, e) {
  return t_(t, e);
}
function Kn(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    At(n) ? (o = n) : yn(n) && ((s = !0), (n = n[St]));
    let a = ht(n);
    t === 0 && r !== null
      ? i == null
        ? zh(e, r, a)
        : So(e, r, a, i || null, !0)
      : t === 1 && r !== null
      ? So(e, r, a, i || null, !0)
      : t === 2
      ? g_(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && v_(e, t, o, r, i);
  }
}
function n_(t, e) {
  return t.createText(e);
}
function r_(t, e, r) {
  t.setValue(e, r);
}
function Bh(t, e, r) {
  return t.createElement(e, r);
}
function i_(t, e) {
  Vh(t, e), (e[St] = null), (e[Fe] = null);
}
function o_(t, e, r, n, i, o) {
  (n[St] = i), (n[Fe] = e), Qo(t, n, r, 1, i, o);
}
function Vh(t, e) {
  Qo(t, e, e[ue], 2, null, null);
}
function s_(t) {
  let e = t[jr];
  if (!e) return va(t[F], t);
  for (; e; ) {
    let r = null;
    if (yn(e)) r = e[jr];
    else {
      let n = e[Oe];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[et] && e !== t; ) yn(e) && va(e[F], e), (e = e[me]);
      e === null && (e = t), yn(e) && va(e[F], e), (r = e && e[et]);
    }
    e = r;
  }
}
function a_(t, e, r, n) {
  let i = Oe + n,
    o = r.length;
  n > 0 && (r[i - 1][et] = e),
    n < o - Oe
      ? ((e[et] = r[i]), Hf(r, Oe + n, e))
      : (r.push(e), (e[et] = null)),
    (e[me] = r);
  let s = e[Qr];
  s !== null && r !== s && c_(s, e);
  let a = e[xt];
  a !== null && a.insertView(t), Ta(e), (e[x] |= 128);
}
function c_(t, e) {
  let r = t[rr],
    i = e[me][me][tt];
  e[tt] !== i && (t[x] |= wc.HasTransplantedViews),
    r === null ? (t[rr] = [e]) : r.push(e);
}
function Uh(t, e) {
  let r = t[rr],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function Za(t, e) {
  if (t.length <= Oe) return;
  let r = Oe + e,
    n = t[r];
  if (n) {
    let i = n[Qr];
    i !== null && i !== t && Uh(i, n), e > 0 && (t[r - 1][et] = n[et]);
    let o = Co(t, Oe + e);
    i_(n[F], n);
    let s = o[xt];
    s !== null && s.detachView(o[F]),
      (n[me] = null),
      (n[et] = null),
      (n[x] &= -129);
  }
  return n;
}
function $h(t, e) {
  if (!(e[x] & 256)) {
    let r = e[ue];
    r.destroyNode && Qo(t, e, r, 3, null, null), s_(e);
  }
}
function va(t, e) {
  if (!(e[x] & 256)) {
    (e[x] &= -129),
      (e[x] |= 256),
      e[wn] && Wd(e[wn]),
      d_(t, e),
      l_(t, e),
      e[F].type === 1 && e[ue].destroy();
    let r = e[Qr];
    if (r !== null && At(e[me])) {
      r !== e[me] && Uh(r, e);
      let n = e[xt];
      n !== null && n.detachView(t);
    }
    Jy(e);
  }
}
function l_(t, e) {
  let r = t.cleanup,
    n = e[Lr];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[Lr] = null);
  let i = e[Gt];
  if (i !== null) {
    e[Gt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function d_(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Hr)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            dt(4, a, c);
            try {
              c.call(a);
            } finally {
              dt(5, a, c);
            }
          }
        else {
          dt(4, i, o);
          try {
            o.call(i);
          } finally {
            dt(5, i, o);
          }
        }
      }
    }
}
function Hh(t, e, r) {
  return u_(t, e.parent, r);
}
function u_(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[St];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === ft.None || o === ft.Emulated) return null;
    }
    return ze(n, r);
  }
}
function So(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function zh(t, e, r) {
  t.appendChild(e, r);
}
function $u(t, e, r, n, i) {
  n !== null ? So(t, e, r, n, i) : zh(t, e, r);
}
function f_(t, e, r, n) {
  t.removeChild(e, r, n);
}
function Vc(t, e) {
  return t.parentNode(e);
}
function h_(t, e) {
  return t.nextSibling(e);
}
function Wh(t, e, r) {
  return m_(t, e, r);
}
function p_(t, e, r) {
  return t.type & 40 ? ze(t, r) : null;
}
var m_ = p_,
  Hu;
function Gh(t, e, r, n) {
  let i = Hh(t, n, e),
    o = e[ue],
    s = n.parent || e[Fe],
    a = Wh(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let c = 0; c < r.length; c++) $u(o, i, r[c], a, !1);
    else $u(o, i, r, a, !1);
  Hu !== void 0 && Hu(o, n, e, r, i);
}
function _o(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return ze(e, t);
    if (r & 4) return Qa(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return _o(t, n);
      {
        let i = t[e.index];
        return At(i) ? Qa(-1, i) : ht(i);
      }
    } else {
      if (r & 32) return Bc(e, t)() || ht(t[e.index]);
      {
        let n = qh(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = Vr(t[tt]);
          return _o(i, n);
        } else return _o(t, e.next);
      }
    }
  }
  return null;
}
function qh(t, e) {
  if (e !== null) {
    let n = t[tt][Fe],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function Qa(t, e) {
  let r = Oe + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[F].firstChild;
    if (i !== null) return _o(n, i);
  }
  return e[Dn];
}
function g_(t, e, r) {
  let n = Vc(t, e);
  n && f_(t, n, e, r);
}
function Uc(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      c = r.type;
    if (
      (s && e === 0 && (a && ar(ht(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (c & 8) Uc(t, e, r.child, n, i, o, !1), Kn(e, t, i, a, o);
      else if (c & 32) {
        let l = Bc(r, n),
          d;
        for (; (d = l()); ) Kn(e, t, i, d, o);
        Kn(e, t, i, a, o);
      } else c & 16 ? Zh(t, e, n, r, i, o) : Kn(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function Qo(t, e, r, n, i, o) {
  Uc(r, n, t.firstChild, e, i, o, !1);
}
function b_(t, e, r) {
  let n = e[ue],
    i = Hh(t, r, e),
    o = r.parent || e[Fe],
    s = Wh(o, r, e);
  Zh(n, 0, e, r, i, s);
}
function Zh(t, e, r, n, i, o) {
  let s = r[tt],
    c = s[Fe].projection[n.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let d = c[l];
      Kn(e, t, i, d, o);
    }
  else {
    let l = c,
      d = s[me];
    zf(n) && (l.flags |= 128), Uc(t, e, l, d, i, o, !0);
  }
}
function v_(t, e, r, n, i) {
  let o = r[Dn],
    s = ht(r);
  o !== s && Kn(e, t, n, o, i);
  for (let a = Oe; a < r.length; a++) {
    let c = r[a];
    Qo(c[F], c, t, e, n, o);
  }
}
function y_(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : Mt.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= Mt.Important)),
        t.setStyle(r, n, i, o));
  }
}
function __(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Qh(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function Yh(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && xa(t, e, n),
    i !== null && Qh(t, e, i),
    o !== null && __(t, e, o);
}
var Ot = {};
function fe(t = 1) {
  Kh(Pe(), q(), Mn() + t, !1);
}
function Kh(t, e, r, n) {
  if (!n)
    if ((e[x] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && bo(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && vo(e, o, 0, r);
    }
  Cn(r);
}
function v(t, e = O.Default) {
  let r = q();
  if (r === null) return h(t, e);
  let n = Le();
  return yh(n, r, He(t), e);
}
function Yo() {
  let t = "invalid";
  throw new Error(t);
}
function Xh(t, e, r, n, i, o) {
  let s = ke(null);
  try {
    let a = null;
    i & N.SignalBased && (a = e[n][Ud]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & N.HasDecoratorInputTransform && (o = t.inputTransforms[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, r, n) : sh(e, a, n, o);
  } finally {
    ke(s);
  }
}
function w_(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Cn(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          vv(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      Cn(-1);
    }
}
function Ko(t, e, r, n, i, o, s, a, c, l, d) {
  let u = e.blueprint.slice();
  return (
    (u[St] = i),
    (u[x] = n | 4 | 128 | 8 | 64),
    (l !== null || (t && t[x] & 2048)) && (u[x] |= 2048),
    Ef(u),
    (u[me] = u[Zr] = t),
    (u[Ct] = r),
    (u[Et] = s || (t && t[Et])),
    (u[ue] = a || (t && t[ue])),
    (u[nr] = c || (t && t[nr]) || null),
    (u[Fe] = o),
    (u[Bo] = Ky()),
    (u[Pr] = d),
    (u[yf] = l),
    (u[tt] = e.type == 2 ? t[tt] : u),
    u
  );
}
function Xo(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = D_(t, e, r, n, i)), bv() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = pv();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Uo(o, !0), o;
}
function D_(t, e, r, n, i) {
  let o = Sf(),
    s = Af(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = A_(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function Jh(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function ep(t, e, r, n, i) {
  let o = Mn(),
    s = n & 2;
  try {
    Cn(-1), s && e.length > Zt && Kh(t, e, Zt, !1), dt(s ? 2 : 0, i), r(n, i);
  } finally {
    Cn(o), dt(s ? 3 : 1, i);
  }
}
function tp(t, e, r) {
  if (wf(e)) {
    let n = ke(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let c = r[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      ke(n);
    }
  }
}
function I_(t, e, r) {
  Tf() && (j_(t, e, r, ze(r, e)), (r.flags & 64) === 64 && op(t, e, r));
}
function C_(t, e, r = ze) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function np(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = rp(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function rp(t, e, r, n, i, o, s, a, c, l, d) {
  let u = Zt + n,
    f = u + i,
    m = E_(u, f),
    w = typeof l == "function" ? l() : l;
  return (m[F] = {
    type: t,
    blueprint: m,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: m.slice().fill(null, u),
    bindingStartIndex: u,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: w,
    incompleteFirstPass: !1,
    ssrId: d,
  });
}
function E_(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : Ot);
  return r;
}
function x_(t, e, r, n) {
  let o = n.get(Ay, Ch) || r === ft.ShadowDom,
    s = t.selectRootElement(e, o);
  return T_(s), s;
}
function T_(t) {
  M_(t);
}
var M_ = () => null;
function S_(t, e, r, n) {
  let i = ap(e);
  i.push(r), t.firstCreatePass && cp(t).push(n, i.length - 1);
}
function A_(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    Mf() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function zu(t, e, r, n, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      c = N.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let l = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      l = i[o];
    }
    t === 0 ? Wu(n, r, l, a, c) : Wu(n, r, l, a);
  }
  return n;
}
function Wu(t, e, r, n, i) {
  let o;
  t.hasOwnProperty(r) ? (o = t[r]).push(e, n) : (o = t[r] = [e, n]),
    i !== void 0 && o.push(i);
}
function R_(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let d = n; d < i; d++) {
    let u = o[d],
      f = r ? r.get(u) : null,
      m = f ? f.inputs : null,
      w = f ? f.outputs : null;
    (c = zu(0, u.inputs, d, c, m)), (l = zu(1, u.outputs, d, l, w));
    let E = c !== null && s !== null && !uf(e) ? Q_(c, d, s) : null;
    a.push(E);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function N_(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function k_(t, e, r, n, i, o, s, a) {
  let c = ze(e, r),
    l = e.inputs,
    d;
  !a && l != null && (d = l[n])
    ? (Hc(t, r, d, n, i), Vo(e) && O_(r, e.index))
    : e.type & 3
    ? ((n = N_(n)),
      (i = s != null ? s(i, e.value || "", n) : i),
      o.setProperty(c, n, i))
    : e.type & 12;
}
function O_(t, e) {
  let r = Kt(e, t);
  r[x] & 16 || (r[x] |= 64);
}
function F_(t, e, r, n) {
  if (Tf()) {
    let i = n === null ? null : { "": -1 },
      o = V_(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && ip(t, e, r, s, i, a),
      i && U_(r, n, i);
  }
  r.mergedAttrs = Fr(r.mergedAttrs, r.attrs);
}
function ip(t, e, r, n, i, o) {
  for (let l = 0; l < n.length; l++) Iy(mh(r, e), t, n[l].type);
  H_(r, t.data.length, n.length);
  for (let l = 0; l < n.length; l++) {
    let d = n[l];
    d.providersResolver && d.providersResolver(d);
  }
  let s = !1,
    a = !1,
    c = Jh(t, e, n.length, null);
  for (let l = 0; l < n.length; l++) {
    let d = n[l];
    (r.mergedAttrs = Fr(r.mergedAttrs, d.hostAttrs)),
      z_(t, r, e, c, d),
      $_(c, d, i),
      d.contentQueries !== null && (r.flags |= 4),
      (d.hostBindings !== null || d.hostAttrs !== null || d.hostVars !== 0) &&
        (r.flags |= 64);
    let u = d.type.prototype;
    !s &&
      (u.ngOnChanges || u.ngOnInit || u.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (u.ngOnChanges || u.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      c++;
  }
  R_(t, r, o);
}
function P_(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    L_(s) != a && s.push(a), s.push(r, n, o);
  }
}
function L_(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function j_(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  Vo(r) && W_(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || mh(r, e),
    ar(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      l = sr(e, t, a, r);
    if ((ar(l, e), s !== null && Z_(e, a - i, l, c, r, s), In(c))) {
      let d = Kt(r.index, e);
      d[Ct] = sr(e, t, a, r);
    }
  }
}
function op(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = yv();
  try {
    Cn(o);
    for (let a = n; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      Ma(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          B_(c, l);
    }
  } finally {
    Cn(-1), Ma(s);
  }
}
function B_(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function V_(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (ff(e, s.selectors, !1))
        if ((n || (n = []), In(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let c = a.length;
            Ya(t, e, c);
          } else n.unshift(s), Ya(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function Ya(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function U_(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new D(-301, !1);
      n.push(e[i], o);
    }
  }
}
function $_(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    In(e) && (r[""] = t);
  }
}
function H_(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function z_(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = ir(i.type, !0)),
    s = new Hr(o, In(i), v);
  (t.blueprint[n] = s), (r[n] = s), P_(t, e, n, Jh(t, r, i.hostVars, Ot), i);
}
function W_(t, e, r) {
  let n = ze(e, t),
    i = np(r),
    o = t[Et].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = $c(
    t,
    Ko(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function G_(t, e, r, n, i, o) {
  let s = ze(t, e);
  q_(e[ue], s, o, t.value, r, n, i);
}
function q_(t, e, r, n, i, o, s) {
  if (o == null) t.removeAttribute(e, i, r);
  else {
    let a = s == null ? Ho(o) : s(o, n || "", i);
    t.setAttribute(e, i, a, r);
  }
}
function Z_(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        l = s[a++],
        d = s[a++],
        u = s[a++];
      Xh(n, r, c, l, d, u);
    }
}
function Q_(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function Y_(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function sp(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = ke(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          Ec(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      ke(n);
    }
  }
}
function $c(t, e) {
  return t[jr] ? (t[Eu][et] = e) : (t[jr] = e), (t[Eu] = e), e;
}
function Ka(t, e, r) {
  Ec(0);
  let n = ke(null);
  try {
    e(t, r);
  } finally {
    ke(n);
  }
}
function ap(t) {
  return t[Lr] || (t[Lr] = []);
}
function cp(t) {
  return t.cleanup || (t.cleanup = []);
}
function lp(t, e) {
  let r = t[nr],
    n = r ? r.get(Se, null) : null;
  n && n.handleError(e);
}
function Hc(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      c = r[o++],
      l = e[s],
      d = t.data[s];
    Xh(d, l, n, a, c, i);
  }
}
function K_(t, e, r) {
  let n = If(e, t);
  r_(t[ue], n, r);
}
function X_(t, e) {
  let r = Kt(e, t),
    n = r[F];
  J_(n, r);
  let i = r[St];
  i !== null && r[Pr] === null && (r[Pr] = kc(i, r[nr])), zc(n, r, r[Ct]);
}
function J_(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function zc(t, e, r) {
  xc(e);
  try {
    let n = t.viewQuery;
    n !== null && Ka(1, n, r);
    let i = t.template;
    i !== null && ep(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[xt]?.finishViewCreation(t),
      t.staticContentQueries && sp(t, e),
      t.staticViewQueries && Ka(2, t.viewQuery, r);
    let o = t.components;
    o !== null && e0(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[x] &= -5), Tc();
  }
}
function e0(t, e) {
  for (let r = 0; r < e.length; r++) X_(t, e[r]);
}
function t0(t, e, r, n) {
  let i = e.tView,
    s = t[x] & 4096 ? 4096 : 16,
    a = Ko(
      t,
      i,
      r,
      s,
      null,
      e,
      null,
      null,
      null,
      n?.injector ?? null,
      n?.dehydratedView ?? null
    ),
    c = t[e.index];
  a[Qr] = c;
  let l = t[xt];
  return l !== null && (a[xt] = l.createEmbeddedView(i)), zc(i, a, r), a;
}
function Gu(t, e) {
  return !e || e.firstChild === null || zf(t);
}
function n0(t, e, r, n = !0) {
  let i = e[F];
  if ((a_(i, e, t, r), n)) {
    let s = Qa(r, t),
      a = e[ue],
      c = Vc(a, t[Dn]);
    c !== null && o_(i, t[Fe], a, e, c, s);
  }
  let o = e[Pr];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Ao(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(ht(o)), At(o) && r0(o, n);
    let s = r.type;
    if (s & 8) Ao(t, e, r.child, n);
    else if (s & 32) {
      let a = Bc(r, e),
        c;
      for (; (c = a()); ) n.push(c);
    } else if (s & 16) {
      let a = qh(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let c = Vr(e[tt]);
        Ao(c[F], c, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function r0(t, e) {
  for (let r = Oe; r < t.length; r++) {
    let n = t[r],
      i = n[F].firstChild;
    i !== null && Ao(n[F], n, i, e);
  }
  t[Dn] !== t[St] && e.push(t[Dn]);
}
var dp = [];
function i0(t) {
  return t[wn] ?? o0(t);
}
function o0(t) {
  let e = dp.pop() ?? Object.create(a0);
  return (e.lView = t), e;
}
function s0(t) {
  t.lView[wn] !== t && ((t.lView = null), dp.push(t));
}
var a0 = oe(g({}, $d), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    Br(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[wn] = this;
  },
});
function up(t) {
  return hp(t[jr]);
}
function fp(t) {
  return hp(t[et]);
}
function hp(t) {
  for (; t !== null && !At(t); ) t = t[et];
  return t;
}
var pp = 100;
function mp(t, e = !0, r = 0) {
  let n = t[Et],
    i = n.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    c0(t, r);
  } catch (s) {
    throw (e && lp(t, s), s);
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function c0(t, e) {
  Xa(t, e);
  let r = 0;
  for (; Ic(t); ) {
    if (r === pp) throw new D(103, !1);
    r++, Xa(t, 1);
  }
}
function l0(t, e, r, n) {
  let i = e[x];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[Et].inlineEffectRunner?.flush(), xc(e);
  let s = null,
    a = null;
  !o && d0(t) && ((a = i0(e)), (s = Hd(a)));
  try {
    Ef(e), gv(t.bindingStartIndex), r !== null && ep(t, e, r, 2, n);
    let c = (i & 3) === 3;
    if (!o)
      if (c) {
        let u = t.preOrderCheckHooks;
        u !== null && bo(e, u, null);
      } else {
        let u = t.preOrderHooks;
        u !== null && vo(e, u, 0, null), ma(e, 0);
      }
    if ((u0(e), gp(e, 0), t.contentQueries !== null && sp(t, e), !o))
      if (c) {
        let u = t.contentCheckHooks;
        u !== null && bo(e, u);
      } else {
        let u = t.contentHooks;
        u !== null && vo(e, u, 1), ma(e, 1);
      }
    w_(t, e);
    let l = t.components;
    l !== null && vp(e, l, 0);
    let d = t.viewQuery;
    if ((d !== null && Ka(2, d, n), !o))
      if (c) {
        let u = t.viewCheckHooks;
        u !== null && bo(e, u);
      } else {
        let u = t.viewHooks;
        u !== null && vo(e, u, 2), ma(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[fa])) {
      for (let u of e[fa]) u();
      e[fa] = null;
    }
    o || (e[x] &= -73);
  } catch (c) {
    throw (Br(e), c);
  } finally {
    a !== null && (zd(a, s), s0(a)), Tc();
  }
}
function d0(t) {
  return t.type !== 2;
}
function gp(t, e) {
  for (let r = up(t); r !== null; r = fp(r))
    for (let n = Oe; n < r.length; n++) {
      let i = r[n];
      bp(i, e);
    }
}
function u0(t) {
  for (let e = up(t); e !== null; e = fp(e)) {
    if (!(e[x] & wc.HasTransplantedViews)) continue;
    let r = e[rr];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[me];
      av(i);
    }
  }
}
function f0(t, e, r) {
  let n = Kt(e, t);
  bp(n, r);
}
function bp(t, e) {
  Dc(t) && Xa(t, e);
}
function Xa(t, e) {
  let n = t[F],
    i = t[x],
    o = t[wn],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && zs(o))),
    o && (o.dirty = !1),
    (t[x] &= -9217),
    s)
  )
    l0(n, t, n.template, t[Ct]);
  else if (i & 8192) {
    gp(t, 1);
    let a = n.components;
    a !== null && vp(t, a, 1);
  }
}
function vp(t, e, r) {
  for (let n = 0; n < e.length; n++) f0(t, e[n], r);
}
function Wc(t) {
  for (t[Et].changeDetectionScheduler?.notify(); t; ) {
    t[x] |= 64;
    let e = Vr(t);
    if (ev(t) && !e) return t;
    t = e;
  }
  return null;
}
var xn = class {
    get rootNodes() {
      let e = this._lView,
        r = e[F];
      return Ao(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[Ct];
    }
    set context(e) {
      this._lView[Ct] = e;
    }
    get destroyed() {
      return (this._lView[x] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[me];
        if (At(e)) {
          let r = e[Io],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (Za(e, n), Co(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      $h(this._lView[F], this._lView);
    }
    onDestroy(e) {
      xf(this._lView, e);
    }
    markForCheck() {
      Wc(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[x] &= -129;
    }
    reattach() {
      Ta(this._lView), (this._lView[x] |= 128);
    }
    detectChanges() {
      (this._lView[x] |= 1024), mp(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new D(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Vh(this._lView[F], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new D(902, !1);
      (this._appRef = e), Ta(this._lView);
    }
  },
  Qt = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = m0;
    let t = e;
    return t;
  })(),
  h0 = Qt,
  p0 = class extends h0 {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = t0(this._declarationLView, this._declarationTContainer, e, {
        injector: r,
        dehydratedView: n,
      });
      return new xn(i);
    }
  };
function m0() {
  return Gc(Le(), q());
}
function Gc(t, e) {
  return t.type & 4 ? new p0(e, t, dr(t, e)) : null;
}
var kk = new RegExp(`^(\\d+)*(${Zv}|${qv})*(.*)`);
var g0 = () => null;
function qu(t, e) {
  return g0(t, e);
}
var Ja = class {},
  ec = class {},
  Ro = class {};
function b0(t) {
  let e = Error(`No component factory found for ${Te(t)}.`);
  return (e[v0] = t), e;
}
var v0 = "ngComponent";
var tc = class {
    resolveComponentFactory(e) {
      throw b0(e);
    }
  },
  ei = (() => {
    let e = class e {};
    e.NULL = new tc();
    let t = e;
    return t;
  })(),
  zr = class {},
  ti = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => y0();
    let t = e;
    return t;
  })();
function y0() {
  let t = q(),
    e = Le(),
    r = Kt(e.index, t);
  return (yn(r) ? r : t)[ue];
}
var _0 = (() => {
    let e = class e {};
    e.ɵprov = b({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  ya = {};
var Zu = new Set();
function qc(t) {
  Zu.has(t) ||
    (Zu.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var rt = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = w0;
  let t = e;
  return t;
})();
function w0(t) {
  return D0(Le(), q(), (t & 16) === 16);
}
function D0(t, e, r) {
  if (Vo(t) && !r) {
    let n = Kt(t.index, e);
    return new xn(n, n);
  } else if (t.type & 47) {
    let n = e[tt];
    return new xn(n, e);
  }
  return null;
}
var yp = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = I0), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  nc = class extends yp {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return xf(this._lView, e), () => cv(this._lView, e);
    }
  };
function I0() {
  return new nc(q());
}
function Qu(...t) {}
function C0() {
  let t = typeof pe.requestAnimationFrame == "function",
    e = pe[t ? "requestAnimationFrame" : "setTimeout"],
    r = pe[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")];
    n && (e = n);
    let i = r[Zone.__symbol__("OriginalDelegate")];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var T = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new K(!1)),
        (this.onMicrotaskEmpty = new K(!1)),
        (this.onStable = new K(!1)),
        (this.onError = new K(!1)),
        typeof Zone > "u")
      )
        throw new D(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = C0().nativeRequestAnimationFrame),
        T0(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new D(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new D(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, E0, Qu, Qu);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  E0 = {};
function Zc(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function x0(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      pe,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                rc(t),
                (t.isCheckStableRunning = !0),
                Zc(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    rc(t));
}
function T0(t) {
  let e = () => {
    x0(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (M0(a)) return r.invokeTask(i, o, s, a);
      try {
        return Yu(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Ku(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, c) => {
      try {
        return Yu(t), r.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Ku(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), rc(t), Zc(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function rc(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function Yu(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function Ku(t) {
  t._nesting--, Zc(t);
}
var ic = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new K()),
      (this.onMicrotaskEmpty = new K()),
      (this.onStable = new K()),
      (this.onError = new K());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, i) {
    return e.apply(r, n);
  }
};
function M0(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function S0(t = "zone.js", e) {
  return t === "noop" ? new ic() : t === "zone.js" ? new T(e) : t;
}
var Xn = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Xn || {}),
  A0 = { destroy() {} };
function Qc(t, e) {
  !e && cy(Qc);
  let r = e?.injector ?? p(mt);
  if (!e_(r)) return A0;
  qc("NgAfterNextRender");
  let n = r.get(Yc),
    i = (n.handler ??= new sc()),
    o = e?.phase ?? Xn.MixedReadWrite,
    s = () => {
      i.unregister(c), a();
    },
    a = r.get(yp).onDestroy(s),
    c = new oc(r, o, () => {
      s(), t();
    });
  return i.register(c), { destroy: s };
}
var oc = class {
    constructor(e, r, n) {
      (this.phase = r),
        (this.callbackFn = n),
        (this.zone = e.get(T)),
        (this.errorHandler = e.get(Se, null, { optional: !0 }));
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  sc = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Xn.EarlyRead]: new Set(),
          [Xn.Write]: new Set(),
          [Xn.MixedReadWrite]: new Set(),
          [Xn.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Yc = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of n) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = b({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function ac(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = Ea(i, a);
      else if (o == 2) {
        let c = a,
          l = e[++s];
        n = Ea(n, c + ": " + l + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var No = class extends ei {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = qt(e);
    return new cr(r, this.ngModule);
  }
};
function Xu(t) {
  let e = [];
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue;
    let n = t[r];
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return e;
}
function R0(t) {
  let e = t.toLowerCase();
  return e === "svg" ? tv : e === "math" ? nv : null;
}
var cc = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = zo(n);
      let i = this.injector.get(e, ya, n);
      return i !== ya || r === ya ? i : this.parentInjector.get(e, r, n);
    }
  },
  cr = class extends Ro {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = Xu(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return Xu(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = Qb(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      i = i || this.ngModule;
      let o = i instanceof Me ? i : i?.injector;
      o &&
        this.componentDef.getStandaloneInjector !== null &&
        (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new cc(e, o) : e,
        a = s.get(zr, null);
      if (a === null) throw new D(407, !1);
      let c = s.get(_0, null),
        l = s.get(Yc, null),
        d = s.get(Ja, null),
        u = {
          rendererFactory: a,
          sanitizer: c,
          inlineEffectRunner: null,
          afterRenderEventManager: l,
          changeDetectionScheduler: d,
        },
        f = a.createRenderer(null, this.componentDef),
        m = this.componentDef.selectors[0][0] || "div",
        w = n ? x_(f, n, this.componentDef.encapsulation, s) : Bh(f, m, R0(m)),
        E = 512;
      this.componentDef.signals
        ? (E |= 4096)
        : this.componentDef.onPush || (E |= 16);
      let ne = null;
      w !== null && (ne = kc(w, s, !0));
      let j = rp(0, null, null, 1, 0, null, null, null, null, null, null),
        ie = Ko(null, j, null, E, null, null, u, f, s, null, ne);
      xc(ie);
      let yt, Qe;
      try {
        let Ye = this.componentDef,
          ot,
          Tr = null;
        Ye.findHostDirectiveDefs
          ? ((ot = []),
            (Tr = new Map()),
            Ye.findHostDirectiveDefs(Ye, ot, Tr),
            ot.push(Ye))
          : (ot = [Ye]);
        let Zg = N0(ie, w),
          Qg = k0(Zg, w, Ye, ot, ie, u, f);
        (Qe = Cf(j, Zt)),
          w && P0(f, Ye, w, n),
          r !== void 0 && L0(Qe, this.ngContentSelectors, r),
          (yt = F0(Qg, Ye, ot, Tr, ie, [j0])),
          zc(j, ie, null);
      } finally {
        Tc();
      }
      return new lc(this.componentType, yt, dr(Qe, ie), ie, Qe);
    }
  },
  lc = class extends ec {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new xn(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        Hc(o[F], o, i, e, r), this.previousInputValues.set(e, r);
        let s = Kt(this._tNode.index, o);
        Wc(s);
      }
    }
    get injector() {
      return new _n(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function N0(t, e) {
  let r = t[F],
    n = Zt;
  return (t[n] = e), Xo(r, n, 2, "#host", null);
}
function k0(t, e, r, n, i, o, s) {
  let a = i[F];
  O0(n, t, e, s);
  let c = null;
  e !== null && (c = kc(e, i[nr]));
  let l = o.rendererFactory.createRenderer(e, r),
    d = 16;
  r.signals ? (d = 4096) : r.onPush && (d = 64);
  let u = Ko(i, np(r), null, d, i[t.index], t, o, l, null, null, c);
  return (
    a.firstCreatePass && Ya(a, t, n.length - 1), $c(i, u), (i[t.index] = u)
  );
}
function O0(t, e, r, n) {
  for (let i of t) e.mergedAttrs = Fr(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (ac(e, e.mergedAttrs, !0), r !== null && Yh(n, r, e));
}
function F0(t, e, r, n, i, o) {
  let s = Le(),
    a = i[F],
    c = ze(s, i);
  ip(a, i, s, r, null, n);
  for (let d = 0; d < r.length; d++) {
    let u = s.directiveStart + d,
      f = sr(i, a, u, s);
    ar(f, i);
  }
  op(a, i, s), c && ar(c, i);
  let l = sr(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[Ct] = i[Ct] = l), o !== null)) for (let d of o) d(l, e);
  return tp(a, s, i), l;
}
function P0(t, e, r, n) {
  if (n) xa(t, r, ["ng-version", "17.2.3"]);
  else {
    let { attrs: i, classes: o } = Yb(e.selectors[0]);
    i && xa(t, r, i), o && o.length > 0 && Qh(t, r, o.join(" "));
  }
}
function L0(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function j0() {
  let t = Le();
  dh(q()[F], t);
}
var en = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = B0;
  let t = e;
  return t;
})();
function B0() {
  let t = Le();
  return wp(t, q());
}
var V0 = en,
  _p = class extends V0 {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return dr(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new _n(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Lc(this._hostTNode, this._hostLView);
      if (fh(e)) {
        let r = Mo(e, this._hostLView),
          n = To(e),
          i = r[F].data[n + 8];
        return new _n(i, r);
      } else return new _n(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = Ju(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - Oe;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = qu(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, Gu(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !dy(e),
        a;
      if (s) a = r;
      else {
        let w = r || {};
        (a = w.index),
          (n = w.injector),
          (i = w.projectableNodes),
          (o = w.environmentInjector || w.ngModuleRef);
      }
      let c = s ? e : new cr(qt(e)),
        l = n || this.parentInjector;
      if (!o && c.ngModule == null) {
        let E = (s ? l : this.parentInjector).get(Me, null);
        E && (o = E);
      }
      let d = qt(c.componentType ?? {}),
        u = qu(this._lContainer, d?.id ?? null),
        f = u?.firstChild ?? null,
        m = c.create(l, i, f, o);
      return this.insertImpl(m.hostView, a, Gu(this._hostTNode, u)), m;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (sv(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[me],
            l = new _p(c, c[Fe], c[me]);
          l.detach(l.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return n0(s, i, o, n), e.attachToViewContainerRef(), Hf(_a(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = Ju(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = Za(this._lContainer, r);
      n && (Co(_a(this._lContainer), r), $h(n[F], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = Za(this._lContainer, r);
      return n && Co(_a(this._lContainer), r) != null ? new xn(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function Ju(t) {
  return t[Io];
}
function _a(t) {
  return t[Io] || (t[Io] = []);
}
function wp(t, e) {
  let r,
    n = e[t.index];
  return (
    At(n) ? (r = n) : ((r = Y_(n, e, null, t)), (e[t.index] = r), $c(e, r)),
    $0(r, e, t, n),
    new _p(r, t, e)
  );
}
function U0(t, e) {
  let r = t[ue],
    n = r.createComment(""),
    i = ze(e, t),
    o = Vc(r, i);
  return So(r, o, n, h_(r, i), !1), n;
}
var $0 = H0;
function H0(t, e, r, n) {
  if (t[Dn]) return;
  let i;
  r.type & 8 ? (i = ht(n)) : (i = U0(e, r)), (t[Dn] = i);
}
var dc = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  uc = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let r = e.queries;
      if (r !== null) {
        let n = e.contentQueries !== null ? e.contentQueries[0] : r.length,
          i = [];
        for (let o = 0; o < n; o++) {
          let s = r.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    finishViewCreation(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let r = 0; r < this.queries.length; r++)
        Kc(e, r).matches !== null && this.queries[r].setDirty();
    }
  },
  ko = class {
    constructor(e, r, n = null) {
      (this.flags = r),
        (this.read = n),
        typeof e == "string" ? (this.predicate = K0(e)) : (this.predicate = e);
    }
  },
  fc = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementStart(e, r);
    }
    elementEnd(e) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementEnd(e);
    }
    embeddedTView(e) {
      let r = null;
      for (let n = 0; n < this.length; n++) {
        let i = r !== null ? r.length : 0,
          o = this.getByIndex(n).embeddedTView(e, i);
        o &&
          ((o.indexInDeclarationView = n), r !== null ? r.push(o) : (r = [o]));
      }
      return r !== null ? new t(r) : null;
    }
    template(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].template(e, r);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  hc = class t {
    constructor(e, r = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = r);
    }
    elementStart(e, r) {
      this.isApplyingToNode(r) && this.matchTNode(e, r);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, r) {
      this.elementStart(e, r);
    }
    embeddedTView(e, r) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, r),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let r = this._declarationNodeIndex,
          n = e.parent;
        for (; n !== null && n.type & 8 && n.index !== r; ) n = n.parent;
        return r === (n !== null ? n.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, r) {
      let n = this.metadata.predicate;
      if (Array.isArray(n))
        for (let i = 0; i < n.length; i++) {
          let o = n[i];
          this.matchTNodeWithReadOption(e, r, z0(r, o)),
            this.matchTNodeWithReadOption(e, r, yo(r, e, o, !1, !1));
        }
      else
        n === Qt
          ? r.type & 4 && this.matchTNodeWithReadOption(e, r, -1)
          : this.matchTNodeWithReadOption(e, r, yo(r, e, n, !1, !1));
    }
    matchTNodeWithReadOption(e, r, n) {
      if (n !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === U || i === en || (i === Qt && r.type & 4))
            this.addMatch(r.index, -2);
          else {
            let o = yo(r, e, i, !1, !1);
            o !== null && this.addMatch(r.index, o);
          }
        else this.addMatch(r.index, n);
      }
    }
    addMatch(e, r) {
      this.matches === null ? (this.matches = [e, r]) : this.matches.push(e, r);
    }
  };
function z0(t, e) {
  let r = t.localNames;
  if (r !== null) {
    for (let n = 0; n < r.length; n += 2) if (r[n] === e) return r[n + 1];
  }
  return null;
}
function W0(t, e) {
  return t.type & 11 ? dr(t, e) : t.type & 4 ? Gc(t, e) : null;
}
function G0(t, e, r, n) {
  return r === -1 ? W0(e, t) : r === -2 ? q0(t, e, n) : sr(t, t[F], r, e);
}
function q0(t, e, r) {
  if (r === U) return dr(e, t);
  if (r === Qt) return Gc(e, t);
  if (r === en) return wp(e, t);
}
function Dp(t, e, r, n) {
  let i = e[xt].queries[n];
  if (i.matches === null) {
    let o = t.data,
      s = r.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let d = o[l];
        a.push(G0(e, d, s[c + 1], r.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function pc(t, e, r, n) {
  let i = t.queries.getByIndex(r),
    o = i.matches;
  if (o !== null) {
    let s = Dp(t, e, i, r);
    for (let a = 0; a < o.length; a += 2) {
      let c = o[a];
      if (c > 0) n.push(s[a / 2]);
      else {
        let l = o[a + 1],
          d = e[-c];
        for (let u = Oe; u < d.length; u++) {
          let f = d[u];
          f[Qr] === f[me] && pc(f[F], f, l, n);
        }
        if (d[rr] !== null) {
          let u = d[rr];
          for (let f = 0; f < u.length; f++) {
            let m = u[f];
            pc(m[F], m, l, n);
          }
        }
      }
    }
  }
  return n;
}
function Z0(t, e) {
  return t[xt].queries[e].queryList;
}
function Ip(t, e, r) {
  let n = new En((r & 4) === 4);
  return (
    S_(t, e, n, n.destroy), (e[xt] ??= new uc()).queries.push(new dc(n)) - 1
  );
}
function Q0(t, e, r) {
  let n = Pe();
  return (
    n.firstCreatePass &&
      (Cp(n, new ko(t, e, r), -1), (e & 2) === 2 && (n.staticViewQueries = !0)),
    Ip(n, q(), e)
  );
}
function Y0(t, e, r, n) {
  let i = Pe();
  if (i.firstCreatePass) {
    let o = Le();
    Cp(i, new ko(e, r, n), o.index),
      X0(i, t),
      (r & 2) === 2 && (i.staticContentQueries = !0);
  }
  return Ip(i, q(), r);
}
function K0(t) {
  return t.split(",").map((e) => e.trim());
}
function Cp(t, e, r) {
  t.queries === null && (t.queries = new fc()), t.queries.track(new hc(e, r));
}
function X0(t, e) {
  let r = t.contentQueries || (t.contentQueries = []),
    n = r.length ? r[r.length - 1] : -1;
  e !== n && r.push(t.queries.length - 1, e);
}
function Kc(t, e) {
  return t.queries.getByIndex(e);
}
function J0(t, e) {
  let r = t[F],
    n = Kc(r, e);
  return n.crossesNgTemplate ? pc(r, t, e, []) : Dp(r, t, n, e);
}
function ew(t) {
  let e = [],
    r = new Map();
  function n(i) {
    let o = r.get(i);
    if (!o) {
      let s = t(i);
      r.set(i, (o = s.then(iw)));
    }
    return o;
  }
  return (
    Oo.forEach((i, o) => {
      let s = [];
      i.templateUrl &&
        s.push(
          n(i.templateUrl).then((l) => {
            i.template = l;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          d = i.styleUrls;
        i.styleUrls.forEach((u, f) => {
          a.push(""),
            s.push(
              n(u).then((m) => {
                (a[l + f] = m),
                  d.splice(d.indexOf(u), 1),
                  d.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          s.push(
            n(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            })
          );
      let c = Promise.all(s).then(() => ow(o));
      e.push(c);
    }),
    nw(),
    Promise.all(e).then(() => {})
  );
}
var Oo = new Map(),
  tw = new Set();
function nw() {
  let t = Oo;
  return (Oo = new Map()), t;
}
function rw() {
  return Oo.size === 0;
}
function iw(t) {
  return typeof t == "string" ? t : t.text();
}
function ow(t) {
  tw.delete(t);
}
function sw(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function An(t) {
  let e = sw(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (In(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new D(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = ho(t.inputs)),
          (s.inputTransforms = ho(t.inputTransforms)),
          (s.declaredInputs = ho(t.declaredInputs)),
          (s.outputs = ho(t.outputs));
        let a = i.hostBindings;
        a && uw(t, a);
        let c = i.viewQuery,
          l = i.contentQueries;
        if (
          (c && lw(t, c),
          l && dw(t, l),
          aw(t, i),
          Ob(t.outputs, i.outputs),
          In(i) && i.data.animation)
        ) {
          let d = t.data;
          d.animation = (d.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === An && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  cw(n);
}
function aw(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function cw(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = Fr(i.hostAttrs, (r = Fr(r, i.hostAttrs))));
  }
}
function ho(t) {
  return t === tr ? {} : t === xe ? [] : t;
}
function lw(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function dw(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function uw(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function ge(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n];
      Array.isArray(i) && i[3] && (r[n] = i[3]);
    }
  t.inputTransforms = r;
}
var Yt = class {},
  Wr = class {};
var Fo = class extends Yt {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new No(this));
      let i = gf(e);
      (this._bootstrapComponents = jh(i.bootstrap)),
        (this._r3Injector = Dh(
          e,
          r,
          [
            { provide: Yt, useValue: this },
            { provide: ei, useValue: this.componentFactoryResolver },
            ...n,
          ],
          Te(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  Po = class extends Wr {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new Fo(this.moduleType, e, []);
    }
  };
function fw(t, e, r) {
  return new Fo(t, e, r);
}
var mc = class extends Yt {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new No(this)),
      (this.instance = null);
    let r = new $r(
      [
        ...e.providers,
        { provide: Yt, useValue: this },
        { provide: ei, useValue: this.componentFactoryResolver },
      ],
      e.parent || Pc(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function Jo(t, e, r = null) {
  return new mc({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var es = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new se(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function hw(t, e, r) {
  return (t[e] = r);
}
function pw(t, e) {
  return t[e];
}
function ni(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function We(t, e, r, n) {
  let i = q(),
    o = Cc();
  if (ni(i, o, e)) {
    let s = Pe(),
      a = Bf();
    G_(a, i, t, e, r, n);
  }
  return We;
}
function mw(t, e, r, n) {
  return ni(t, Cc(), r) ? e + Ho(r) + n : Ot;
}
function po(t, e) {
  return (t << 17) | (e << 2);
}
function Tn(t) {
  return (t >> 17) & 32767;
}
function gw(t) {
  return (t & 2) == 2;
}
function bw(t, e) {
  return (t & 131071) | (e << 17);
}
function gc(t) {
  return t | 2;
}
function lr(t) {
  return (t & 131068) >> 2;
}
function wa(t, e) {
  return (t & -131069) | (e << 2);
}
function vw(t) {
  return (t & 1) === 1;
}
function bc(t) {
  return t | 1;
}
function yw(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = Tn(s),
    c = lr(s);
  t[n] = r;
  let l = !1,
    d;
  if (Array.isArray(r)) {
    let u = r;
    (d = u[1]), (d === null || Yr(u, d) > 0) && (l = !0);
  } else d = r;
  if (i)
    if (c !== 0) {
      let f = Tn(t[a + 1]);
      (t[n + 1] = po(f, a)),
        f !== 0 && (t[f + 1] = wa(t[f + 1], n)),
        (t[a + 1] = bw(t[a + 1], n));
    } else
      (t[n + 1] = po(a, 0)), a !== 0 && (t[a + 1] = wa(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = po(c, 0)),
      a === 0 ? (a = n) : (t[c + 1] = wa(t[c + 1], n)),
      (c = n);
  l && (t[n + 1] = gc(t[n + 1])),
    ef(t, d, n, !0),
    ef(t, d, n, !1),
    _w(e, d, t, n, o),
    (s = po(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function _w(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Yr(o, e) >= 0 &&
    (r[n + 1] = bc(r[n + 1]));
}
function ef(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? Tn(i) : lr(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let c = t[s],
      l = t[s + 1];
    ww(c, e) && ((a = !0), (t[s + 1] = n ? bc(l) : gc(l))),
      (s = n ? Tn(l) : lr(l));
  }
  a && (t[r + 1] = n ? gc(i) : bc(i));
}
function ww(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Yr(t, e) >= 0
    : !1;
}
var Je = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function Dw(t) {
  return t.substring(Je.key, Je.keyEnd);
}
function Iw(t) {
  return Cw(t), Ep(t, xp(t, 0, Je.textEnd));
}
function Ep(t, e) {
  let r = Je.textEnd;
  return r === e ? -1 : ((e = Je.keyEnd = Ew(t, (Je.key = e), r)), xp(t, e, r));
}
function Cw(t) {
  (Je.key = 0),
    (Je.keyEnd = 0),
    (Je.value = 0),
    (Je.valueEnd = 0),
    (Je.textEnd = t.length);
}
function xp(t, e, r) {
  for (; e < r && t.charCodeAt(e) <= 32; ) e++;
  return e;
}
function Ew(t, e, r) {
  for (; e < r && t.charCodeAt(e) > 32; ) e++;
  return e;
}
function Ae(t, e, r) {
  let n = q(),
    i = Cc();
  if (ni(n, i, e)) {
    let o = Pe(),
      s = Bf();
    k_(o, s, n, t, e, n[ue], r, !1);
  }
  return Ae;
}
function vc(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  Hc(t, r, o[s], s, n);
}
function ri(t, e, r) {
  return Tp(t, e, r, !1), ri;
}
function be(t, e) {
  return Tp(t, e, null, !0), be;
}
function Rn(t) {
  Tw(kw, xw, t, !0);
}
function xw(t, e) {
  for (let r = Iw(e); r >= 0; r = Ep(e, r)) Sc(t, Dw(e), !0);
}
function Tp(t, e, r, n) {
  let i = q(),
    o = Pe(),
    s = Nf(2);
  if ((o.firstUpdatePass && Sp(o, t, s, n), e !== Ot && ni(i, s, e))) {
    let a = o.data[Mn()];
    Ap(o, a, i, i[ue], t, (i[s + 1] = Fw(e, r)), n, s);
  }
}
function Tw(t, e, r, n) {
  let i = Pe(),
    o = Nf(2);
  i.firstUpdatePass && Sp(i, null, o, n);
  let s = q();
  if (r !== Ot && ni(s, o, r)) {
    let a = i.data[Mn()];
    if (Rp(a, n) && !Mp(i, o)) {
      let c = n ? a.classesWithoutHost : a.stylesWithoutHost;
      c !== null && (r = Ea(c, r || "")), vc(i, a, s, r, n);
    } else Ow(i, a, s, s[ue], s[o + 1], (s[o + 1] = Nw(t, e, r)), n, o);
  }
}
function Mp(t, e) {
  return e >= t.expandoStartIndex;
}
function Sp(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[Mn()],
      s = Mp(t, r);
    Rp(o, n) && e === null && !s && (e = !1),
      (e = Mw(i, o, e, n)),
      yw(i, o, e, r, s, n);
  }
}
function Mw(t, e, r, n) {
  let i = _v(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = Da(null, t, e, r, n)), (r = Gr(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = Da(i, t, e, r, n)), o === null)) {
        let c = Sw(t, e, n);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Da(null, t, e, c[1], n)),
          (c = Gr(c, e.attrs, n)),
          Aw(t, e, n, c));
      } else o = Rw(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function Sw(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (lr(n) !== 0) return t[Tn(n)];
}
function Aw(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[Tn(i)] = n;
}
function Rw(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = Gr(n, s, r);
  }
  return Gr(n, e.attrs, r);
}
function Da(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = Gr(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function Gr(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          Sc(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function Nw(t, e, r) {
  if (r == null || r === "") return xe;
  let n = [],
    i = nt(r);
  if (Array.isArray(i)) for (let o = 0; o < i.length; o++) t(n, i[o], !0);
  else if (typeof i == "object")
    for (let o in i) i.hasOwnProperty(o) && t(n, o, i[o]);
  else typeof i == "string" && e(n, i);
  return n;
}
function kw(t, e, r) {
  let n = String(e);
  n !== "" && !n.includes(" ") && Sc(t, n, r);
}
function Ow(t, e, r, n, i, o, s, a) {
  i === Ot && (i = xe);
  let c = 0,
    l = 0,
    d = 0 < i.length ? i[0] : null,
    u = 0 < o.length ? o[0] : null;
  for (; d !== null || u !== null; ) {
    let f = c < i.length ? i[c + 1] : void 0,
      m = l < o.length ? o[l + 1] : void 0,
      w = null,
      E;
    d === u
      ? ((c += 2), (l += 2), f !== m && ((w = u), (E = m)))
      : u === null || (d !== null && d < u)
      ? ((c += 2), (w = d))
      : ((l += 2), (w = u), (E = m)),
      w !== null && Ap(t, e, r, n, w, E, s, a),
      (d = c < i.length ? i[c] : null),
      (u = l < o.length ? o[l] : null);
  }
}
function Ap(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    d = vw(l) ? tf(c, e, r, i, lr(l), s) : void 0;
  if (!Lo(d)) {
    Lo(o) || (gw(l) && (o = tf(c, null, r, i, a, s)));
    let u = If(Mn(), r);
    y_(n, s, u, i, o);
  }
}
function tf(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      d = l ? c[1] : c,
      u = d === null,
      f = r[i + 1];
    f === Ot && (f = u ? xe : void 0);
    let m = u ? ha(f, n) : d === n ? f : void 0;
    if ((l && !Lo(m) && (m = ha(c, n)), Lo(m) && ((a = m), s))) return a;
    let w = t[i + 1];
    i = s ? Tn(w) : lr(w);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = ha(c, n));
  }
  return a;
}
function Lo(t) {
  return t !== void 0;
}
function Fw(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = Te(nt(t)))),
    t
  );
}
function Rp(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function Pw(t, e, r, n, i, o) {
  let s = e.consts,
    a = xu(s, i),
    c = Xo(e, t, 2, n, a);
  return (
    F_(e, r, c, xu(s, o)),
    c.attrs !== null && ac(c, c.attrs, !1),
    c.mergedAttrs !== null && ac(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function R(t, e, r, n) {
  let i = q(),
    o = Pe(),
    s = Zt + t,
    a = i[ue],
    c = o.firstCreatePass ? Pw(s, o, i, e, r, n) : o.data[s],
    l = Lw(o, i, c, a, e, t);
  i[s] = l;
  let d = Df(c);
  return (
    Uo(c, !0),
    Yh(a, l, c),
    (c.flags & 32) !== 32 && Uf() && Gh(o, i, l, c),
    lv() === 0 && ar(l, i),
    dv(),
    d && (I_(o, i, c), tp(o, c, i)),
    n !== null && C_(i, c),
    R
  );
}
function P() {
  let t = Le();
  Af() ? Rf() : ((t = t.parent), Uo(t, !1));
  let e = t;
  fv(e) && hv(), uv();
  let r = Pe();
  return (
    r.firstCreatePass && (dh(r, t), wf(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      by(e) &&
      vc(r, e, q(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      vy(e) &&
      vc(r, e, q(), e.stylesWithoutHost, !1),
    P
  );
}
function de(t, e, r, n) {
  return R(t, e, r, n), P(), de;
}
var Lw = (t, e, r, n, i, o) => ($f(!0), Bh(n, i, Dv()));
var jo = "en-US";
var jw = jo;
function Bw(t) {
  typeof t == "string" && (jw = t.toLowerCase().replace(/_/g, "-"));
}
function gt(t, e, r, n) {
  let i = q(),
    o = Pe(),
    s = Le();
  return Uw(o, i, i[ue], s, t, e, n), gt;
}
function Vw(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[Lr],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function Uw(t, e, r, n, i, o, s) {
  let a = Df(n),
    l = t.firstCreatePass && cp(t),
    d = e[Ct],
    u = ap(e),
    f = !0;
  if (n.type & 3 || s) {
    let E = ze(n, e),
      ne = s ? s(E) : E,
      j = u.length,
      ie = s ? (Qe) => s(ht(Qe[n.index])) : n.index,
      yt = null;
    if ((!s && a && (yt = Vw(t, e, i, n.index)), yt !== null)) {
      let Qe = yt.__ngLastListenerFn__ || yt;
      (Qe.__ngNextListenerFn__ = o), (yt.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = rf(n, e, d, o, !1);
      let Qe = r.listen(ne, i, o);
      u.push(o, Qe), l && l.push(i, ie, j, j + 1);
    }
  } else o = rf(n, e, d, o, !1);
  let m = n.outputs,
    w;
  if (f && m !== null && (w = m[i])) {
    let E = w.length;
    if (E)
      for (let ne = 0; ne < E; ne += 2) {
        let j = w[ne],
          ie = w[ne + 1],
          Ye = e[j][ie].subscribe(o),
          ot = u.length;
        if ((u.push(o, Ye), l)) {
          let Tr = typeof Ye == "function" ? ot + 1 : -(ot + 1);
          l.push(i, n.index, ot, Tr);
        }
      }
  }
}
function nf(t, e, r, n) {
  try {
    return dt(6, e, r), r(n) !== !1;
  } catch (i) {
    return lp(t, i), !1;
  } finally {
    dt(7, e, r);
  }
}
function rf(t, e, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? Kt(t.index, e) : e;
    Wc(a);
    let c = nf(e, r, n, s),
      l = o.__ngNextListenerFn__;
    for (; l; ) (c = nf(e, r, l, s) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && s.preventDefault(), c;
  };
}
function $w(t, e) {
  let r = null,
    n = zb(t);
  for (let i = 0; i < e.length; i++) {
    let o = e[i];
    if (o === "*") {
      r = i;
      continue;
    }
    if (n === null ? ff(t, o, !0) : qb(n, o)) return i;
  }
  return r;
}
function je(t) {
  let e = q()[tt][Fe];
  if (!e.projection) {
    let r = t ? t.length : 1,
      n = (e.projection = Tv(r, null)),
      i = n.slice(),
      o = e.child;
    for (; o !== null; ) {
      let s = t ? $w(o, t) : 0;
      s !== null && (i[s] ? (i[s].projectionNext = o) : (n[s] = o), (i[s] = o)),
        (o = o.next);
    }
  }
}
function Re(t, e = 0, r) {
  let n = q(),
    i = Pe(),
    o = Xo(i, Zt + t, 16, null, r || null);
  o.projection === null && (o.projection = e),
    Rf(),
    (!n[Pr] || Mf()) && (o.flags & 32) !== 32 && b_(i, n, o);
}
function ur(t, e, r, n) {
  Y0(t, e, r, n);
}
function tn(t, e, r) {
  Q0(t, e, r);
}
function Be(t) {
  let e = q(),
    r = Pe(),
    n = kf();
  Ec(n + 1);
  let i = Kc(r, n);
  if (t.dirty && ov(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = J0(e, n);
      t.reset(o, Cv), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function Ve() {
  return Z0(q(), kf());
}
function G(t, e = "") {
  let r = q(),
    n = Pe(),
    i = t + Zt,
    o = n.firstCreatePass ? Xo(n, i, 1, e, null) : n.data[i],
    s = Hw(n, r, o, e, t);
  (r[i] = s), Uf() && Gh(n, r, s, o), Uo(o, !1);
}
var Hw = (t, e, r, n, i) => ($f(!0), n_(e[ue], n));
function nn(t) {
  return Xc("", t, ""), nn;
}
function Xc(t, e, r) {
  let n = q(),
    i = mw(n, t, e, r);
  return i !== Ot && K_(n, Mn(), i), Xc;
}
var zw = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = rh(!1, n.type),
          o =
            i.length > 0
              ? Jo([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = b({
    token: e,
    providedIn: "environment",
    factory: () => new e(h(Me)),
  });
  let t = e;
  return t;
})();
function Ce(t) {
  qc("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(zw).getOrCreateStandaloneInjector(t));
}
function rn(t, e, r) {
  let n = mv() + t,
    i = q();
  return i[n] === Ot ? hw(i, n, r ? e.call(r) : e()) : pw(i, n);
}
var mo = null;
function Ww(t) {
  (mo !== null &&
    (t.defaultEncapsulation !== mo.defaultEncapsulation ||
      t.preserveWhitespaces !== mo.preserveWhitespaces)) ||
    (mo = t);
}
var ts = (() => {
  let e = class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var Jc = new _(""),
  ii = new _(""),
  ns = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngZone = n),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          el || (Gw(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                T.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb();
            }
          });
        else {
          let n = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(n) ? (clearTimeout(i.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              n();
          }, i)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: o });
      }
      whenStable(n, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, i, o), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(T), h(rs), h(ii));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  rs = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, i) {
        this._applications.set(n, i);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, i = !0) {
        return el?.findTestabilityInTree(this, n, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function Gw(t) {
  el = t;
}
var el;
function oi(t) {
  return !!t && typeof t.then == "function";
}
function Np(t) {
  return !!t && typeof t.subscribe == "function";
}
var is = new _(""),
  kp = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = p(is, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (oi(s)) n.push(s);
          else if (Np(s)) {
            let a = new Promise((c, l) => {
              s.subscribe({ complete: c, error: l });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  tl = new _("");
function qw() {
  Gd(() => {
    throw new D(600, !1);
  });
}
function Zw(t) {
  return t.isBoundToModule;
}
function Qw(t, e, r) {
  try {
    let n = r();
    return oi(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
function Op(t, e) {
  return Array.isArray(e) ? e.reduce(Op, t) : g(g({}, t), e);
}
var fr = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(Ih)),
        (this.afterRenderEffectManager = p(Yc)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(es).hasPendingTasks.pipe(C((n) => !n))),
        (this._injector = p(Me));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof Ro;
      if (!this._injector.get(kp).done) {
        let m = !o && mf(n),
          w = !1;
        throw new D(405, w);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(ei).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = Zw(a) ? void 0 : this._injector.get(Yt),
        l = i || a.selector,
        d = a.create(mt.NULL, [], l, c),
        u = d.location.nativeElement,
        f = d.injector.get(Jc, null);
      return (
        f?.registerApplication(u),
        d.onDestroy(() => {
          this.detachView(d.hostView),
            wo(this.components, d),
            f?.unregisterApplication(u);
        }),
        this._loadComponent(d),
        d
      );
    }
    tick() {
      if (this._runningTick) throw new D(101, !1);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews();
      } catch (n) {
        this.internalErrorHandler(n);
      } finally {
        this._runningTick = !1;
      }
    }
    detectChangesInAttachedViews() {
      let n = 0,
        i = this.afterRenderEffectManager;
      for (;;) {
        if (n === pp) throw new D(103, !1);
        let o = n === 0;
        for (let { _lView: s, notifyErrorHandler: a } of this._views)
          (!o && !Ia(s)) || this.detectChangesInView(s, a, o);
        if (
          (n++,
          i.executeInternalCallbacks(),
          !this._views.some(({ _lView: s }) => Ia(s)) &&
            (i.execute(), !this._views.some(({ _lView: s }) => Ia(s))))
        )
          break;
      }
    }
    detectChangesInView(n, i, o) {
      let s;
      o ? ((s = 0), (n[x] |= 1024)) : n[x] & 64 ? (s = 0) : (s = 1),
        mp(n, i, s);
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      wo(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(tl, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => wo(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new D(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function wo(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Ia(t) {
  return Ic(t);
}
var yc = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  os = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new Po(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = gf(n),
          s = jh(o.declarations).reduce((a, c) => {
            let l = qt(c);
            return l && a.push(new cr(l)), a;
          }, []);
        return new yc(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Yw = new _("");
function Kw(t, e, r) {
  let n = new Po(r);
  return Promise.resolve(n);
}
function of(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var Xw = (() => {
  let e = class e {
    constructor() {
      (this.zone = p(T)), (this.applicationRef = p(fr));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Jw(t) {
  return [
    { provide: T, useFactory: t },
    {
      provide: or,
      multi: !0,
      useFactory: () => {
        let e = p(Xw, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: or,
      multi: !0,
      useFactory: () => {
        let e = p(nD);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Ih, useFactory: eD },
  ];
}
function eD() {
  let t = p(T),
    e = p(Se);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function tD(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var nD = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new Z()),
        (this.initialized = !1),
        (this.zone = p(T)),
        (this.pendingTasks = p(es));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              T.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            T.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function rD() {
  return (typeof $localize < "u" && $localize.locale) || jo;
}
var ss = new _("", {
  providedIn: "root",
  factory: () => p(ss, O.Optional | O.SkipSelf) || rD(),
});
var Fp = new _(""),
  Pp = (() => {
    let e = class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, i) {
        let o = S0(
          i?.ngZone,
          tD({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = fw(
              n.moduleType,
              this.injector,
              Jw(() => o)
            ),
            a = s.injector.get(Se, null);
          return (
            o.runOutsideAngular(() => {
              let c = o.onError.subscribe({
                next: (l) => {
                  a.handleError(l);
                },
              });
              s.onDestroy(() => {
                wo(this._modules, s), c.unsubscribe();
              });
            }),
            Qw(a, o, () => {
              let c = s.injector.get(kp);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let l = s.injector.get(ss, jo);
                  return Bw(l || jo), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(n, i = []) {
        let o = Op({}, i);
        return Kw(this.injector, o, n).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(n) {
        let i = n.injector.get(fr);
        if (n._bootstrapComponents.length > 0)
          n._bootstrapComponents.forEach((o) => i.bootstrap(o));
        else if (n.instance.ngDoBootstrap) n.instance.ngDoBootstrap(i);
        else throw new D(-403, !1);
        this._modules.push(n);
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new D(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let n = this._injector.get(Fp, null);
        n && (n.forEach((i) => i()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(mt));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Or = null,
  Lp = new _("");
function iD(t) {
  if (Or && !Or.get(Lp, !1)) throw new D(400, !1);
  qw(), (Or = t);
  let e = t.get(Pp);
  return aD(t), e;
}
function nl(t, e, r = []) {
  let n = `Platform: ${e}`,
    i = new _(n);
  return (o = []) => {
    let s = jp();
    if (!s || s.injector.get(Lp, !1)) {
      let a = [...r, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : iD(oD(a, n));
    }
    return sD(i);
  };
}
function oD(t = [], e) {
  return mt.create({
    name: e,
    providers: [
      { provide: Go, useValue: "platform" },
      { provide: Fp, useValue: new Set([() => (Or = null)]) },
      ...t,
    ],
  });
}
function sD(t) {
  let e = jp();
  if (!e) throw new D(401, !1);
  return e;
}
function jp() {
  return Or?.get(Pp) ?? null;
}
function aD(t) {
  t.get(Ac, null)?.forEach((r) => r());
}
var Bp = nl(null, "core", []),
  Vp = (() => {
    let e = class e {
      constructor(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(fr));
    }),
      (e.ɵmod = V({ type: e })),
      (e.ɵinj = $({}));
    let t = e;
    return t;
  })();
function ee(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function hr(t, e = NaN) {
  return !isNaN(parseFloat(t)) && !isNaN(Number(t)) ? Number(t) : e;
}
function Up(t) {
  let e = qt(t);
  if (!e) return null;
  let r = new cr(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var zp = null;
function Nn() {
  return zp;
}
function Wp(t) {
  zp ??= t;
}
var as = class {};
var H = new _(""),
  sl = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => p(lD), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Gp = new _(""),
  lD = (() => {
    let e = class e extends sl {
      constructor() {
        super(),
          (this._doc = p(H)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return Nn().getBaseHref(this._doc);
      }
      onPopState(n) {
        let i = Nn().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", n, !1),
          () => i.removeEventListener("popstate", n)
        );
      }
      onHashChange(n) {
        let i = Nn().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", n, !1),
          () => i.removeEventListener("hashchange", n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, i, o) {
        this._history.pushState(n, i, o);
      }
      replaceState(n, i, o) {
        this._history.replaceState(n, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function al(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function $p(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function Ft(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var Pt = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => p(cl), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  qp = new _(""),
  cl = (() => {
    let e = class e extends Pt {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(H).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return al(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + Ft(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Ft(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Ft(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(sl), h(qp, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Zp = (() => {
    let e = class e extends Pt {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let i = this._platformLocation.hash ?? "#";
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(n) {
        let i = al(this._baseHref, n);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Ft(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Ft(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(sl), h(qp, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  pr = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new K()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = fD($p(Hp(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, i = "") {
        return this.path() == this.normalize(n + Ft(i));
      }
      normalize(n) {
        return e.stripTrailingSlash(uD(this._basePath, Hp(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, i = "", o = null) {
        this._locationStrategy.pushState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Ft(i)), o);
      }
      replaceState(n, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Ft(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", i) {
        this._urlChangeListeners.forEach((o) => o(n, i));
      }
      subscribe(n, i, o) {
        return this._subject.subscribe({ next: n, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = Ft),
      (e.joinWithSlash = al),
      (e.stripTrailingSlash = $p),
      (e.ɵfac = function (i) {
        return new (i || e)(h(Pt));
      }),
      (e.ɵprov = b({ token: e, factory: () => dD(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function dD() {
  return new pr(h(Pt));
}
function uD(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function Hp(t) {
  return t.replace(/\/index.html$/, "");
}
function fD(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
function Qp(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var ls = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = V({ type: e })),
      (e.ɵinj = $({}));
    let t = e;
    return t;
  })(),
  ll = "browser",
  hD = "server";
function dl(t) {
  return t === ll;
}
function ul(t) {
  return t === hD;
}
var Yp = (() => {
    let e = class e {};
    e.ɵprov = b({
      token: e,
      providedIn: "root",
      factory: () => (dl(p(pt)) ? new rl(p(H), window) : new il()),
    });
    let t = e;
    return t;
  })(),
  rl = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let r = pD(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        i = r.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(n - o[0], i - o[1]);
    }
  };
function pD(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = n.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = n.nextNode();
    }
  }
  return null;
}
var il = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  cs = class {};
var hl = class {};
var mr = class t {
  constructor(e) {
    (this.normalizedNames = new Map()),
      (this.lazyUpdate = null),
      e
        ? typeof e == "string"
          ? (this.lazyInit = () => {
              (this.headers = new Map()),
                e
                  .split(
                    `
`
                  )
                  .forEach((r) => {
                    let n = r.indexOf(":");
                    if (n > 0) {
                      let i = r.slice(0, n),
                        o = i.toLowerCase(),
                        s = r.slice(n + 1).trim();
                      this.maybeSetNormalizedName(i, o),
                        this.headers.has(o)
                          ? this.headers.get(o).push(s)
                          : this.headers.set(o, [s]);
                    }
                  });
            })
          : typeof Headers < "u" && e instanceof Headers
          ? ((this.headers = new Map()),
            e.forEach((r, n) => {
              this.setHeaderEntries(n, r);
            }))
          : (this.lazyInit = () => {
              (this.headers = new Map()),
                Object.entries(e).forEach(([r, n]) => {
                  this.setHeaderEntries(r, n);
                });
            })
        : (this.headers = new Map());
  }
  has(e) {
    return this.init(), this.headers.has(e.toLowerCase());
  }
  get(e) {
    this.init();
    let r = this.headers.get(e.toLowerCase());
    return r && r.length > 0 ? r[0] : null;
  }
  keys() {
    return this.init(), Array.from(this.normalizedNames.values());
  }
  getAll(e) {
    return this.init(), this.headers.get(e.toLowerCase()) || null;
  }
  append(e, r) {
    return this.clone({ name: e, value: r, op: "a" });
  }
  set(e, r) {
    return this.clone({ name: e, value: r, op: "s" });
  }
  delete(e, r) {
    return this.clone({ name: e, value: r, op: "d" });
  }
  maybeSetNormalizedName(e, r) {
    this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
  }
  init() {
    this.lazyInit &&
      (this.lazyInit instanceof t
        ? this.copyFrom(this.lazyInit)
        : this.lazyInit(),
      (this.lazyInit = null),
      this.lazyUpdate &&
        (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
        (this.lazyUpdate = null)));
  }
  copyFrom(e) {
    e.init(),
      Array.from(e.headers.keys()).forEach((r) => {
        this.headers.set(r, e.headers.get(r)),
          this.normalizedNames.set(r, e.normalizedNames.get(r));
      });
  }
  clone(e) {
    let r = new t();
    return (
      (r.lazyInit =
        this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
      (r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
      r
    );
  }
  applyUpdate(e) {
    let r = e.name.toLowerCase();
    switch (e.op) {
      case "a":
      case "s":
        let n = e.value;
        if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
        this.maybeSetNormalizedName(e.name, r);
        let i = (e.op === "a" ? this.headers.get(r) : void 0) || [];
        i.push(...n), this.headers.set(r, i);
        break;
      case "d":
        let o = e.value;
        if (!o) this.headers.delete(r), this.normalizedNames.delete(r);
        else {
          let s = this.headers.get(r);
          if (!s) return;
          (s = s.filter((a) => o.indexOf(a) === -1)),
            s.length === 0
              ? (this.headers.delete(r), this.normalizedNames.delete(r))
              : this.headers.set(r, s);
        }
        break;
    }
  }
  setHeaderEntries(e, r) {
    let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
      i = e.toLowerCase();
    this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
  }
  forEach(e) {
    this.init(),
      Array.from(this.normalizedNames.keys()).forEach((r) =>
        e(this.normalizedNames.get(r), this.headers.get(r))
      );
  }
};
var pl = class {
  encodeKey(e) {
    return Kp(e);
  }
  encodeValue(e) {
    return Kp(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function gD(t, e) {
  let r = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let o = i.indexOf("="),
            [s, a] =
              o == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, o)), e.decodeValue(i.slice(o + 1))],
            c = r.get(s) || [];
          c.push(a), r.set(s, c);
        }),
    r
  );
}
var bD = /%(\d[a-f0-9])/gi,
  vD = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function Kp(t) {
  return encodeURIComponent(t).replace(bD, (e, r) => vD[r] ?? e);
}
function ds(t) {
  return `${t}`;
}
var on = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new pl()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = gD(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((r) => {
            let n = e.fromObject[r],
              i = Array.isArray(n) ? n.map(ds) : [ds(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let r = this.map.get(e);
    return r ? r[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, r) {
    return this.clone({ param: e, value: r, op: "a" });
  }
  appendAll(e) {
    let r = [];
    return (
      Object.keys(e).forEach((n) => {
        let i = e[n];
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: "a" });
            })
          : r.push({ param: n, value: i, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(e, r) {
    return this.clone({ param: e, value: r, op: "s" });
  }
  delete(e, r) {
    return this.clone({ param: e, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let r = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let r = new t({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(e)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let r = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              r.push(ds(e.value)), this.map.set(e.param, r);
              break;
            case "d":
              if (e.value !== void 0) {
                let n = this.map.get(e.param) || [],
                  i = n.indexOf(ds(e.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(e.param, n)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var ml = class {
  constructor() {
    this.map = new Map();
  }
  set(e, r) {
    return this.map.set(e, r), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function yD(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function Xp(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function Jp(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function em(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function _D(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var si = class t {
    constructor(e, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let o;
      if (
        (yD(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new mr()),
        (this.context ??= new ml()),
        !this.params)
      )
        (this.params = new on()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            c = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : Xp(this.body) ||
          Jp(this.body) ||
          em(this.body) ||
          _D(this.body) ||
          typeof this.body == "string"
        ? this.body
        : this.body instanceof on
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || em(this.body)
        ? null
        : Jp(this.body)
        ? this.body.type || null
        : Xp(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof on
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(e = {}) {
      let r = e.method || this.method,
        n = e.url || this.url,
        i = e.responseType || this.responseType,
        o = e.body !== void 0 ? e.body : this.body,
        s =
          e.withCredentials !== void 0
            ? e.withCredentials
            : this.withCredentials,
        a =
          e.reportProgress !== void 0 ? e.reportProgress : this.reportProgress,
        c = e.headers || this.headers,
        l = e.params || this.params,
        d = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (c = Object.keys(e.setHeaders).reduce(
            (u, f) => u.set(f, e.setHeaders[f]),
            c
          )),
        e.setParams &&
          (l = Object.keys(e.setParams).reduce(
            (u, f) => u.set(f, e.setParams[f]),
            l
          )),
        new t(r, n, o, {
          params: l,
          headers: c,
          context: d,
          reportProgress: a,
          responseType: i,
          withCredentials: s,
        })
      );
    }
  },
  tm = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(tm || {}),
  gl = class {
    constructor(e, r = nm.Ok, n = "OK") {
      (this.headers = e.headers || new mr()),
        (this.status = e.status !== void 0 ? e.status : r),
        (this.statusText = e.statusText || n),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  };
var bl = class t extends gl {
  constructor(e = {}) {
    super(e),
      (this.type = tm.Response),
      (this.body = e.body !== void 0 ? e.body : null);
  }
  clone(e = {}) {
    return new t({
      body: e.body !== void 0 ? e.body : this.body,
      headers: e.headers || this.headers,
      status: e.status !== void 0 ? e.status : this.status,
      statusText: e.statusText || this.statusText,
      url: e.url || this.url || void 0,
    });
  }
};
var nm = (function (t) {
  return (
    (t[(t.Continue = 100)] = "Continue"),
    (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
    (t[(t.Processing = 102)] = "Processing"),
    (t[(t.EarlyHints = 103)] = "EarlyHints"),
    (t[(t.Ok = 200)] = "Ok"),
    (t[(t.Created = 201)] = "Created"),
    (t[(t.Accepted = 202)] = "Accepted"),
    (t[(t.NonAuthoritativeInformation = 203)] = "NonAuthoritativeInformation"),
    (t[(t.NoContent = 204)] = "NoContent"),
    (t[(t.ResetContent = 205)] = "ResetContent"),
    (t[(t.PartialContent = 206)] = "PartialContent"),
    (t[(t.MultiStatus = 207)] = "MultiStatus"),
    (t[(t.AlreadyReported = 208)] = "AlreadyReported"),
    (t[(t.ImUsed = 226)] = "ImUsed"),
    (t[(t.MultipleChoices = 300)] = "MultipleChoices"),
    (t[(t.MovedPermanently = 301)] = "MovedPermanently"),
    (t[(t.Found = 302)] = "Found"),
    (t[(t.SeeOther = 303)] = "SeeOther"),
    (t[(t.NotModified = 304)] = "NotModified"),
    (t[(t.UseProxy = 305)] = "UseProxy"),
    (t[(t.Unused = 306)] = "Unused"),
    (t[(t.TemporaryRedirect = 307)] = "TemporaryRedirect"),
    (t[(t.PermanentRedirect = 308)] = "PermanentRedirect"),
    (t[(t.BadRequest = 400)] = "BadRequest"),
    (t[(t.Unauthorized = 401)] = "Unauthorized"),
    (t[(t.PaymentRequired = 402)] = "PaymentRequired"),
    (t[(t.Forbidden = 403)] = "Forbidden"),
    (t[(t.NotFound = 404)] = "NotFound"),
    (t[(t.MethodNotAllowed = 405)] = "MethodNotAllowed"),
    (t[(t.NotAcceptable = 406)] = "NotAcceptable"),
    (t[(t.ProxyAuthenticationRequired = 407)] = "ProxyAuthenticationRequired"),
    (t[(t.RequestTimeout = 408)] = "RequestTimeout"),
    (t[(t.Conflict = 409)] = "Conflict"),
    (t[(t.Gone = 410)] = "Gone"),
    (t[(t.LengthRequired = 411)] = "LengthRequired"),
    (t[(t.PreconditionFailed = 412)] = "PreconditionFailed"),
    (t[(t.PayloadTooLarge = 413)] = "PayloadTooLarge"),
    (t[(t.UriTooLong = 414)] = "UriTooLong"),
    (t[(t.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
    (t[(t.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
    (t[(t.ExpectationFailed = 417)] = "ExpectationFailed"),
    (t[(t.ImATeapot = 418)] = "ImATeapot"),
    (t[(t.MisdirectedRequest = 421)] = "MisdirectedRequest"),
    (t[(t.UnprocessableEntity = 422)] = "UnprocessableEntity"),
    (t[(t.Locked = 423)] = "Locked"),
    (t[(t.FailedDependency = 424)] = "FailedDependency"),
    (t[(t.TooEarly = 425)] = "TooEarly"),
    (t[(t.UpgradeRequired = 426)] = "UpgradeRequired"),
    (t[(t.PreconditionRequired = 428)] = "PreconditionRequired"),
    (t[(t.TooManyRequests = 429)] = "TooManyRequests"),
    (t[(t.RequestHeaderFieldsTooLarge = 431)] = "RequestHeaderFieldsTooLarge"),
    (t[(t.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
    (t[(t.InternalServerError = 500)] = "InternalServerError"),
    (t[(t.NotImplemented = 501)] = "NotImplemented"),
    (t[(t.BadGateway = 502)] = "BadGateway"),
    (t[(t.ServiceUnavailable = 503)] = "ServiceUnavailable"),
    (t[(t.GatewayTimeout = 504)] = "GatewayTimeout"),
    (t[(t.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
    (t[(t.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
    (t[(t.InsufficientStorage = 507)] = "InsufficientStorage"),
    (t[(t.LoopDetected = 508)] = "LoopDetected"),
    (t[(t.NotExtended = 510)] = "NotExtended"),
    (t[(t.NetworkAuthenticationRequired = 511)] =
      "NetworkAuthenticationRequired"),
    t
  );
})(nm || {});
function fl(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var rm = (() => {
  let e = class e {
    constructor(n) {
      this.handler = n;
    }
    request(n, i, o = {}) {
      let s;
      if (n instanceof si) s = n;
      else {
        let l;
        o.headers instanceof mr ? (l = o.headers) : (l = new mr(o.headers));
        let d;
        o.params &&
          (o.params instanceof on
            ? (d = o.params)
            : (d = new on({ fromObject: o.params }))),
          (s = new si(n, i, o.body !== void 0 ? o.body : null, {
            headers: l,
            context: o.context,
            params: d,
            reportProgress: o.reportProgress,
            responseType: o.responseType || "json",
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
          }));
      }
      let a = y(s).pipe(Dt((l) => this.handler.handle(l)));
      if (n instanceof si || o.observe === "events") return a;
      let c = a.pipe(ae((l) => l instanceof bl));
      switch (o.observe || "body") {
        case "body":
          switch (s.responseType) {
            case "arraybuffer":
              return c.pipe(
                C((l) => {
                  if (l.body !== null && !(l.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return l.body;
                })
              );
            case "blob":
              return c.pipe(
                C((l) => {
                  if (l.body !== null && !(l.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return l.body;
                })
              );
            case "text":
              return c.pipe(
                C((l) => {
                  if (l.body !== null && typeof l.body != "string")
                    throw new Error("Response is not a string.");
                  return l.body;
                })
              );
            case "json":
            default:
              return c.pipe(C((l) => l.body));
          }
        case "response":
          return c;
        default:
          throw new Error(`Unreachable: unhandled observe type ${o.observe}}`);
      }
    }
    delete(n, i = {}) {
      return this.request("DELETE", n, i);
    }
    get(n, i = {}) {
      return this.request("GET", n, i);
    }
    head(n, i = {}) {
      return this.request("HEAD", n, i);
    }
    jsonp(n, i) {
      return this.request("JSONP", n, {
        params: new on().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(n, i = {}) {
      return this.request("OPTIONS", n, i);
    }
    patch(n, i, o = {}) {
      return this.request("PATCH", n, fl(o, i));
    }
    post(n, i, o = {}) {
      return this.request("POST", n, fl(o, i));
    }
    put(n, i, o = {}) {
      return this.request("PUT", n, fl(o, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(h(hl));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var _l = class extends as {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  wl = class t extends _l {
    static makeCurrent() {
      Wp(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = ID();
      return r == null ? null : CD(r);
    }
    resetBaseElement() {
      ai = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Qp(document.cookie, e);
    }
  },
  ai = null;
function ID() {
  return (
    (ai = ai || document.querySelector("base")),
    ai ? ai.getAttribute("href") : null
  );
}
function CD(t) {
  return new URL(t, document.baseURI).pathname;
}
var Dl = class {
    addToWindow(e) {
      (pe.getAngularTestability = (n, i = !0) => {
        let o = e.findTestabilityInTree(n, i);
        if (o == null) throw new D(5103, !1);
        return o;
      }),
        (pe.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (pe.getAllAngularRootElements = () => e.getAllRootElements());
      let r = (n) => {
        let i = pe.getAllAngularTestabilities(),
          o = i.length,
          s = function () {
            o--, o == 0 && n();
          };
        i.forEach((a) => {
          a.whenStable(s);
        });
      };
      pe.frameworkStabilizers || (pe.frameworkStabilizers = []),
        pe.frameworkStabilizers.push(r);
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null;
      let i = e.getTestability(r);
      return (
        i ??
        (n
          ? Nn().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      );
    }
  },
  ED = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Il = new _(""),
  am = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new D(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(Il), h(T));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  us = class {
    constructor(e) {
      this._doc = e;
    }
  },
  vl = "ng-app-id",
  cm = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ul(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${vl}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(vl), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(vl, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(H), h(Kr), h(Xr, 8), h(pt));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  yl = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  El = /%COMP%/g,
  lm = "%COMP%",
  xD = `_nghost-${lm}`,
  TD = `_ngcontent-${lm}`,
  MD = !0,
  SD = new _("", { providedIn: "root", factory: () => MD });
function AD(t) {
  return TD.replace(El, t);
}
function RD(t) {
  return xD.replace(El, t);
}
function dm(t, e) {
  return e.map((r) => r.replace(El, t));
}
var im = (() => {
    let e = class e {
      constructor(n, i, o, s, a, c, l, d = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = d),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ul(c)),
          (this.defaultRenderer = new ci(n, a, l, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === ft.ShadowDom &&
          (i = oe(g({}, i), { encapsulation: ft.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof fs
            ? o.applyToHost(n)
            : o instanceof li && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            d = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case ft.Emulated:
              s = new fs(l, d, i, this.appId, u, a, c, f);
              break;
            case ft.ShadowDom:
              return new Cl(l, d, n, i, a, c, this.nonce, f);
            default:
              s = new li(l, d, i, u, a, c, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(am), h(cm), h(Kr), h(SD), h(H), h(pt), h(T), h(Xr));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ci = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(yl[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (om(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (om(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new D(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = yl[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = yl[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (Mt.DashCase | Mt.Important)
        ? e.style.setProperty(r, n, i & Mt.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & Mt.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = Nn().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function om(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Cl = class extends ci {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = dm(i.id, i.styles);
      for (let d of l) {
        let u = document.createElement("style");
        a && u.setAttribute("nonce", a),
          (u.textContent = d),
          this.shadowRoot.appendChild(u);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  li = class extends ci {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? dm(c, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  fs = class extends li {
    constructor(e, r, n, i, o, s, a, c) {
      let l = i + "-" + n.id;
      super(e, r, n, o, s, a, c, l),
        (this.contentAttr = AD(l)),
        (this.hostAttr = RD(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  ND = (() => {
    let e = class e extends us {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(H));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  sm = ["alt", "control", "meta", "shift"],
  kD = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  OD = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  FD = (() => {
    let e = class e extends us {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Nn().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          sm.forEach((d) => {
            let u = i.indexOf(d);
            u > -1 && (i.splice(u, 1), (a += d + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = o), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(n, i) {
        let o = kD[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              sm.forEach((a) => {
                if (a !== o) {
                  let c = OD[a];
                  c(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(H));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function PD() {
  wl.makeCurrent();
}
function LD() {
  return new Se();
}
function jD() {
  return Wf(document), document;
}
var BD = [
    { provide: pt, useValue: ll },
    { provide: Ac, useValue: PD, multi: !0 },
    { provide: H, useFactory: jD, deps: [] },
  ],
  um = nl(Bp, "browser", BD),
  VD = new _(""),
  UD = [
    { provide: ii, useClass: Dl, deps: [] },
    { provide: Jc, useClass: ns, deps: [T, rs, ii] },
    { provide: ns, useClass: ns, deps: [T, rs, ii] },
  ],
  $D = [
    { provide: Go, useValue: "root" },
    { provide: Se, useFactory: LD, deps: [] },
    { provide: Il, useClass: ND, multi: !0, deps: [H, T, pt] },
    { provide: Il, useClass: FD, multi: !0, deps: [H] },
    im,
    cm,
    am,
    { provide: zr, useExisting: im },
    { provide: cs, useClass: ED, deps: [] },
    [],
  ],
  fm = (() => {
    let e = class e {
      constructor(n) {}
      static withServerTransition(n) {
        return { ngModule: e, providers: [{ provide: Kr, useValue: n.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(VD, 12));
    }),
      (e.ɵmod = V({ type: e })),
      (e.ɵinj = $({ providers: [...$D, ...UD], imports: [ls, Vp] }));
    let t = e;
    return t;
  })();
var hm = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(h(H));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var xl = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: function (i) {
          let o = null;
          return i ? (o = new (i || e)()) : (o = h(HD)), o;
        },
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  HD = (() => {
    let e = class e extends xl {
      constructor(n) {
        super(), (this._doc = n);
      }
      sanitize(n, i) {
        if (i == null) return null;
        switch (n) {
          case De.NONE:
            return i;
          case De.HTML:
            return Jt(i, "HTML") ? nt(i) : Oh(this._doc, String(i)).toString();
          case De.STYLE:
            return Jt(i, "Style") ? nt(i) : i;
          case De.SCRIPT:
            if (Jt(i, "Script")) return nt(i);
            throw new D(5200, !1);
          case De.URL:
            return Jt(i, "URL") ? nt(i) : Zo(String(i));
          case De.RESOURCE_URL:
            if (Jt(i, "ResourceURL")) return nt(i);
            throw new D(5201, !1);
          default:
            throw new D(5202, !1);
        }
      }
      bypassSecurityTrustHtml(n) {
        return Eh(n);
      }
      bypassSecurityTrustStyle(n) {
        return xh(n);
      }
      bypassSecurityTrustScript(n) {
        return Th(n);
      }
      bypassSecurityTrustUrl(n) {
        return Mh(n);
      }
      bypassSecurityTrustResourceUrl(n) {
        return Sh(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(H));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var k = "primary",
  Ci = Symbol("RouteTitle"),
  Nl = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function _r(t) {
  return new Nl(t);
}
function zD(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function WD(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!bt(t[r], e[r])) return !1;
  return !0;
}
function bt(t, e) {
  let r = t ? kl(t) : void 0,
    n = e ? kl(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !Dm(t[i], e[i]))) return !1;
  return !0;
}
function kl(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function Dm(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function Im(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function ln(t) {
  return no(t) ? t : oi(t) ? X(Promise.resolve(t)) : y(t);
}
var GD = { exact: Em, subset: xm },
  Cm = { exact: qD, subset: ZD, ignored: () => !0 };
function pm(t, e, r) {
  return (
    GD[r.paths](t.root, e.root, r.matrixParams) &&
    Cm[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function qD(t, e) {
  return bt(t, e);
}
function Em(t, e, r) {
  if (
    !On(t.segments, e.segments) ||
    !ms(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !Em(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function ZD(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => Dm(t[r], e[r]))
  );
}
function xm(t, e, r) {
  return Tm(t, e, e.segments, r);
}
function Tm(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!On(i, r) || e.hasChildren() || !ms(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!On(t.segments, r) || !ms(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !xm(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !On(t.segments, i) || !ms(t.segments, i, n) || !t.children[k]
      ? !1
      : Tm(t.children[k], e, o, n);
  }
}
function ms(t, e, r) {
  return e.every((n, i) => Cm[r](t[i].parameters, n.parameters));
}
var sn = class {
    constructor(e = new z([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= _r(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return KD.serialize(this);
    }
  },
  z = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return gs(this);
    }
  },
  kn = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= _r(this.parameters)), this._parameterMap;
    }
    toString() {
      return Sm(this);
    }
  };
function QD(t, e) {
  return On(t, e) && t.every((r, n) => bt(r.parameters, e[n].parameters));
}
function On(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function YD(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === k && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== k && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var Ei = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => new gi(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  gi = class {
    parse(e) {
      let r = new Fl(e);
      return new sn(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${di(e.root, !0)}`,
        n = eI(e.queryParams),
        i = typeof e.fragment == "string" ? `#${XD(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  KD = new gi();
function gs(t) {
  return t.segments.map((e) => Sm(e)).join("/");
}
function di(t, e) {
  if (!t.hasChildren()) return gs(t);
  if (e) {
    let r = t.children[k] ? di(t.children[k], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== k && n.push(`${i}:${di(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = YD(t, (n, i) =>
      i === k ? [di(t.children[k], !1)] : [`${i}:${di(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[k] != null
      ? `${gs(t)}/${r[0]}`
      : `${gs(t)}/(${r.join("//")})`;
  }
}
function Mm(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function hs(t) {
  return Mm(t).replace(/%3B/gi, ";");
}
function XD(t) {
  return encodeURI(t);
}
function Ol(t) {
  return Mm(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function bs(t) {
  return decodeURIComponent(t);
}
function mm(t) {
  return bs(t.replace(/\+/g, "%20"));
}
function Sm(t) {
  return `${Ol(t.path)}${JD(t.parameters)}`;
}
function JD(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${Ol(e)}=${Ol(r)}`)
    .join("");
}
function eI(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${hs(r)}=${hs(i)}`).join("&")
        : `${hs(r)}=${hs(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var tI = /^[^\/()?;#]+/;
function Ml(t) {
  let e = t.match(tI);
  return e ? e[0] : "";
}
var nI = /^[^\/()?;=#]+/;
function rI(t) {
  let e = t.match(nI);
  return e ? e[0] : "";
}
var iI = /^[^=?&#]+/;
function oI(t) {
  let e = t.match(iI);
  return e ? e[0] : "";
}
var sI = /^[^&#]+/;
function aI(t) {
  let e = t.match(sI);
  return e ? e[0] : "";
}
var Fl = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new z([], {})
        : new z([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[k] = new z(e, r)),
      n
    );
  }
  parseSegment() {
    let e = Ml(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new D(4009, !1);
    return this.capture(e), new kn(bs(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = rI(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = Ml(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[bs(r)] = bs(n);
  }
  parseQueryParam(e) {
    let r = oI(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = aI(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = mm(r),
      o = mm(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = Ml(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new D(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = k);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[k] : new z([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new D(4011, !1);
  }
};
function Am(t) {
  return t.segments.length > 0 ? new z([], { [k]: t }) : t;
}
function Rm(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = Rm(i);
    if (n === k && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new z(t.segments, e);
  return cI(r);
}
function cI(t) {
  if (t.numberOfChildren === 1 && t.children[k]) {
    let e = t.children[k];
    return new z(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function wr(t) {
  return t instanceof sn;
}
function lI(t, e, r = null, n = null) {
  let i = Nm(t);
  return km(i, e, r, n);
}
function Nm(t) {
  let e;
  function r(o) {
    let s = {};
    for (let c of o.children) {
      let l = r(c);
      s[c.outlet] = l;
    }
    let a = new z(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = Am(n);
  return e ?? i;
}
function km(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return Sl(i, i, i, r, n);
  let o = dI(e);
  if (o.toRoot()) return Sl(i, i, new z([], {}), r, n);
  let s = uI(o, i, t),
    a = s.processChildren
      ? hi(s.segmentGroup, s.index, o.commands)
      : Fm(s.segmentGroup, s.index, o.commands);
  return Sl(i, s.segmentGroup, a, r, n);
}
function vs(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function bi(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Sl(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([c, l]) => {
      o[c] = Array.isArray(l) ? l.map((d) => `${d}`) : `${l}`;
    });
  let s;
  t === e ? (s = r) : (s = Om(t, e, r));
  let a = Am(Rm(s));
  return new sn(a, o, i);
}
function Om(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Om(o, e, r));
    }),
    new z(t.segments, n)
  );
}
var ys = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && vs(n[0]))
    )
      throw new D(4003, !1);
    let i = n.find(bi);
    if (i && i !== Im(n)) throw new D(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function dI(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new ys(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new ys(r, e, n);
}
var vr = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function uI(t, e, r) {
  if (t.isAbsolute) return new vr(e, !0, 0);
  if (!r) return new vr(e, !1, NaN);
  if (r.parent === null) return new vr(r, !0, 0);
  let n = vs(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return fI(r, i, t.numberOfDoubleDots);
}
function fI(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new D(4005, !1);
    i = n.segments.length;
  }
  return new vr(n, !1, i - o);
}
function hI(t) {
  return bi(t[0]) ? t[0].outlets : { [k]: t };
}
function Fm(t, e, r) {
  if (((t ??= new z([], {})), t.segments.length === 0 && t.hasChildren()))
    return hi(t, e, r);
  let n = pI(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new z(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[k] = new z(t.segments.slice(n.pathIndex), t.children)),
      hi(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new z(t.segments, {})
      : n.match && !t.hasChildren()
      ? Pl(t, e, r)
      : n.match
      ? hi(t, 0, i)
      : Pl(t, e, r);
}
function hi(t, e, r) {
  if (r.length === 0) return new z(t.segments, {});
  {
    let n = hI(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== k) &&
      t.children[k] &&
      t.numberOfChildren === 1 &&
      t.children[k].segments.length === 0
    ) {
      let o = hi(t.children[k], e, r);
      return new z(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Fm(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new z(t.segments, i)
    );
  }
}
function pI(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (bi(a)) break;
    let c = `${a}`,
      l = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!bm(c, l, s)) return o;
      n += 2;
    } else {
      if (!bm(c, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function Pl(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (bi(o)) {
      let c = mI(o.outlets);
      return new z(n, c);
    }
    if (i === 0 && vs(r[0])) {
      let c = t.segments[e];
      n.push(new kn(c.path, gm(r[0]))), i++;
      continue;
    }
    let s = bi(o) ? o.outlets[k] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && vs(a)
      ? (n.push(new kn(s, gm(a))), (i += 2))
      : (n.push(new kn(s, {})), i++);
  }
  return new z(n, {});
}
function mI(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = Pl(new z([], {}), 0, n));
    }),
    e
  );
}
function gm(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function bm(t, e, r) {
  return t == r.path && bt(e, r.parameters);
}
var pi = "imperative",
  he = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(he || {}),
  qe = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  Dr = class extends qe {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = he.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  it = class extends qe {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = he.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Ge = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Ge || {}),
  _s = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(_s || {}),
  an = class extends qe {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = he.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  cn = class extends qe {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = he.NavigationSkipped);
    }
  },
  vi = class extends qe {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = he.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  ws = class extends qe {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = he.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ll = class extends qe {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = he.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  jl = class extends qe {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = he.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Bl = class extends qe {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = he.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Vl = class extends qe {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = he.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ul = class {
    constructor(e) {
      (this.route = e), (this.type = he.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  $l = class {
    constructor(e) {
      (this.route = e), (this.type = he.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Hl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = he.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  zl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = he.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Wl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = he.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Gl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = he.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ds = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = he.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  yi = class {},
  _i = class {
    constructor(e) {
      this.url = e;
    }
  };
var ql = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new xi()),
        (this.attachRef = null);
    }
  },
  xi = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new ql()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Is = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = Zl(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = Zl(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = Ql(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Ql(e, this._root).map((r) => r.value);
    }
  };
function Zl(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = Zl(t, r);
    if (n) return n;
  }
  return null;
}
function Ql(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = Ql(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var Ue = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function br(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var Cs = class extends Is {
  constructor(e, r) {
    super(e), (this.snapshot = r), od(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Pm(t) {
  let e = gI(t),
    r = new se([new kn("", {})]),
    n = new se({}),
    i = new se({}),
    o = new se({}),
    s = new se(""),
    a = new Fn(r, n, o, s, i, k, t, e.root);
  return (a.snapshot = e.root), new Cs(new Ue(a, []), e);
}
function gI(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new wi([], e, n, i, r, k, t, null, {});
  return new Es("", new Ue(o, []));
}
var Fn = class {
  constructor(e, r, n, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(C((l) => l[Ci])) ?? y(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(C((e) => _r(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(C((e) => _r(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function id(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: g(g({}, e.params), t.params),
          data: g(g({}, e.data), t.data),
          resolve: g(g(g(g({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: g({}, t.params),
          data: g({}, t.data),
          resolve: g(g({}, t.data), t._resolvedData ?? {}),
        }),
    i && jm(i) && (n.resolve[Ci] = i.title),
    n
  );
}
var wi = class {
    get title() {
      return this.data?.[Ci];
    }
    constructor(e, r, n, i, o, s, a, c, l) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= _r(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= _r(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  Es = class extends Is {
    constructor(e, r) {
      super(r), (this.url = e), od(this, r);
    }
    toString() {
      return Lm(this._root);
    }
  };
function od(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => od(t, r));
}
function Lm(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Lm).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function Al(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      bt(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      bt(e.params, r.params) || t.paramsSubject.next(r.params),
      WD(e.url, r.url) || t.urlSubject.next(r.url),
      bt(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Yl(t, e) {
  let r = bt(t.params, e.params) && QD(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || Yl(t.parent, e.parent));
}
function jm(t) {
  return typeof t.title == "string" || t.title === null;
}
var sd = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = k),
          (this.activateEvents = new K()),
          (this.deactivateEvents = new K()),
          (this.attachEvents = new K()),
          (this.detachEvents = new K()),
          (this.parentContexts = p(xi)),
          (this.location = p(en)),
          (this.changeDetector = p(rt)),
          (this.environmentInjector = p(Me)),
          (this.inputBinder = p(As, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new D(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new D(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new D(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new D(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new Kl(n, c, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: l,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Nt],
      }));
    let t = e;
    return t;
  })(),
  Kl = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === Fn
        ? this.route
        : e === xi
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  As = new _(""),
  vm = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: i } = n,
          o = gn([i.queryParams, i.params, i.data])
            .pipe(
              _e(
                ([s, a, c], l) => (
                  (c = g(g(g({}, s), a), c)),
                  l === 0 ? y(c) : Promise.resolve(c)
                )
              )
            )
            .subscribe((s) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let a = Up(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: c } of a.inputs)
                n.activatedComponentRef.setInput(c, s[c]);
            });
        this.outletDataSubscriptions.set(n, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function bI(t, e, r) {
  let n = Di(t, e._root, r ? r._root : void 0);
  return new Cs(n, e);
}
function Di(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = vI(t, e, r);
    return new Ue(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => Di(t, a))),
          s
        );
      }
    }
    let n = yI(e.value),
      i = e.children.map((o) => Di(t, o));
    return new Ue(n, i);
  }
}
function vI(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return Di(t, n, i);
    return Di(t, n);
  });
}
function yI(t) {
  return new Fn(
    new se(t.url),
    new se(t.params),
    new se(t.queryParams),
    new se(t.fragment),
    new se(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Bm = "ngNavigationCancelingError";
function Vm(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = wr(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Um(!1, Ge.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function Um(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ""}`);
  return (r[Bm] = !0), (r.cancellationCode = e), r;
}
function _I(t) {
  return $m(t) && wr(t.url);
}
function $m(t) {
  return !!t && t[Bm];
}
var wI = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Y({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [Ce],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && de(0, "router-outlet");
      },
      dependencies: [sd],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function DI(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = Jo(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function ad(t) {
  let e = t.children && t.children.map(ad),
    r = e ? oe(g({}, t), { children: e }) : g({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== k &&
      (r.component = wI),
    r
  );
}
function vt(t) {
  return t.outlet || k;
}
function II(t, e) {
  let r = t.filter((n) => vt(n) === e);
  return r.push(...t.filter((n) => vt(n) !== e)), r;
}
function Ti(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var CI = (t, e, r, n) =>
    C(
      (i) => (
        new Xl(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  Xl = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        Al(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = br(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = br(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = br(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = br(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new Gl(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new zl(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((Al(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Al(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = Ti(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  xs = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  yr = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function EI(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return ui(n, i, r, [n.value]);
}
function xI(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function Er(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !Gf(t) ? t : e.get(t)) : n;
}
function ui(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = br(e);
  return (
    t.children.forEach((s) => {
      TI(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => mi(a, r.getContext(s), i)),
    i
  );
}
function TI(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = MI(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new xs(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? ui(t, e, a ? a.children : null, n, i) : ui(t, e, r, n, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new yr(a.outlet.component, s));
  } else
    s && mi(e, a, i),
      i.canActivateChecks.push(new xs(n)),
      o.component
        ? ui(t, null, a ? a.children : null, n, i)
        : ui(t, null, r, n, i);
  return i;
}
function MI(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !On(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !On(t.url, e.url) || !bt(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Yl(t, e) || !bt(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !Yl(t, e);
  }
}
function mi(t, e, r) {
  let n = br(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? mi(s, e.children.getContext(o), r)
        : mi(s, null, r)
      : mi(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new yr(e.outlet.component, i))
        : r.canDeactivateChecks.push(new yr(null, i))
      : r.canDeactivateChecks.push(new yr(null, i));
}
function Mi(t) {
  return typeof t == "function";
}
function SI(t) {
  return typeof t == "boolean";
}
function AI(t) {
  return t && Mi(t.canLoad);
}
function RI(t) {
  return t && Mi(t.canActivate);
}
function NI(t) {
  return t && Mi(t.canActivateChild);
}
function kI(t) {
  return t && Mi(t.canDeactivate);
}
function OI(t) {
  return t && Mi(t.canMatch);
}
function Hm(t) {
  return t instanceof wt || t?.name === "EmptyError";
}
var ps = Symbol("INITIAL_VALUE");
function Ir() {
  return _e((t) =>
    gn(t.map((e) => e.pipe(ye(1), It(ps)))).pipe(
      C((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === ps) return ps;
            if (r === !1 || r instanceof sn) return r;
          }
        return !0;
      }),
      ae((e) => e !== ps),
      ye(1)
    )
  );
}
function FI(t, e) {
  return re((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? y(oe(g({}, r), { guardsResult: !0 }))
      : PI(s, n, i, t).pipe(
          re((a) => (a && SI(a) ? LI(n, o, t, e) : y(a))),
          C((a) => oe(g({}, r), { guardsResult: a }))
        );
  });
}
function PI(t, e, r, n) {
  return X(t).pipe(
    re((i) => $I(i.component, i.route, r, e, n)),
    lt((i) => i !== !0, !0)
  );
}
function LI(t, e, r, n) {
  return X(e).pipe(
    Dt((i) =>
      Ut(
        BI(i.route.parent, n),
        jI(i.route, n),
        UI(t, i.path, r),
        VI(t, i.route, r)
      )
    ),
    lt((i) => i !== !0, !0)
  );
}
function jI(t, e) {
  return t !== null && e && e(new Wl(t)), y(!0);
}
function BI(t, e) {
  return t !== null && e && e(new Hl(t)), y(!0);
}
function VI(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return y(!0);
  let i = n.map((o) =>
    oo(() => {
      let s = Ti(e) ?? r,
        a = Er(o, s),
        c = RI(a) ? a.canActivate(e, t) : Xt(s, () => a(e, t));
      return ln(c).pipe(lt());
    })
  );
  return y(i).pipe(Ir());
}
function UI(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => xI(s))
      .filter((s) => s !== null)
      .map((s) =>
        oo(() => {
          let a = s.guards.map((c) => {
            let l = Ti(s.node) ?? r,
              d = Er(c, l),
              u = NI(d) ? d.canActivateChild(n, t) : Xt(l, () => d(n, t));
            return ln(u).pipe(lt());
          });
          return y(a).pipe(Ir());
        })
      );
  return y(o).pipe(Ir());
}
function $I(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return y(!0);
  let s = o.map((a) => {
    let c = Ti(e) ?? i,
      l = Er(a, c),
      d = kI(l) ? l.canDeactivate(t, e, r, n) : Xt(c, () => l(t, e, r, n));
    return ln(d).pipe(lt());
  });
  return y(s).pipe(Ir());
}
function HI(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return y(!0);
  let o = i.map((s) => {
    let a = Er(s, t),
      c = AI(a) ? a.canLoad(e, r) : Xt(t, () => a(e, r));
    return ln(c);
  });
  return y(o).pipe(Ir(), zm(n));
}
function zm(t) {
  return Xs(
    J((e) => {
      if (wr(e)) throw Vm(t, e);
    }),
    C((e) => e === !0)
  );
}
function zI(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return y(!0);
  let o = i.map((s) => {
    let a = Er(s, t),
      c = OI(a) ? a.canMatch(e, r) : Xt(t, () => a(e, r));
    return ln(c);
  });
  return y(o).pipe(Ir(), zm(n));
}
var Ii = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Ts = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function gr(t) {
  return Vt(new Ii(t));
}
function WI(t) {
  return Vt(new D(4e3, !1));
}
function GI(t) {
  return Vt(Um(!1, Ge.GuardRejected));
}
var Jl = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return y(n);
        if (i.numberOfChildren > 1 || !i.children[k]) return WI(e.redirectTo);
        i = i.children[k];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith("/")) throw new Ts(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new sn(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, n, i);
        }),
        new z(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new D(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  ed = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function qI(t, e, r, n, i) {
  let o = cd(t, e, r);
  return o.matched
    ? ((n = DI(e, n)),
      zI(n, e, r, i).pipe(C((s) => (s === !0 ? o : g({}, ed)))))
    : y(o);
}
function cd(t, e, r) {
  if (e.path === "**") return ZI(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? g({}, ed)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || zD)(r, t, e);
  if (!i) return g({}, ed);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s =
    i.consumed.length > 0
      ? g(g({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function ZI(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Im(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function ym(t, e, r, n) {
  return r.length > 0 && KI(t, r, n)
    ? {
        segmentGroup: new z(e, YI(n, new z(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && XI(t, r, n)
    ? {
        segmentGroup: new z(t.segments, QI(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new z(t.segments, t.children), slicedSegments: r };
}
function QI(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (Rs(t, e, o) && !n[vt(o)]) {
      let s = new z([], {});
      i[vt(o)] = s;
    }
  return g(g({}, n), i);
}
function YI(t, e) {
  let r = {};
  r[k] = e;
  for (let n of t)
    if (n.path === "" && vt(n) !== k) {
      let i = new z([], {});
      r[vt(n)] = i;
    }
  return r;
}
function KI(t, e, r) {
  return r.some((n) => Rs(t, e, n) && vt(n) !== k);
}
function XI(t, e, r) {
  return r.some((n) => Rs(t, e, n));
}
function Rs(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function JI(t, e, r, n) {
  return vt(t) !== n && (n === k || !Rs(e, r, t)) ? !1 : cd(e, t, r).matched;
}
function eC(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var td = class {};
function tC(t, e, r, n, i, o, s = "emptyOnly") {
  return new nd(t, e, r, n, i, s, o).recognize();
}
var nC = 31,
  nd = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Jl(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new D(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = ym(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        C((r) => {
          let n = new wi(
              [],
              Object.freeze({}),
              Object.freeze(g({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              k,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Ue(n, r),
            o = new Es("", i),
            s = lI(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, k).pipe(
        ct((n) => {
          if (n instanceof Ts)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof Ii ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = id(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(
            C((o) => (o instanceof Ue ? [o] : []))
          );
    }
    processChildren(e, r, n) {
      let i = [];
      for (let o of Object.keys(n.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return X(i).pipe(
        Dt((o) => {
          let s = n.children[o],
            a = II(r, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        ca((o, s) => (o.push(...s), o)),
        Ht(null),
        aa(),
        re((o) => {
          if (o === null) return gr(n);
          let s = Wm(o);
          return rC(s), y(s);
        })
      );
    }
    processSegment(e, r, n, i, o, s) {
      return X(r).pipe(
        Dt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            i,
            o,
            s
          ).pipe(
            ct((c) => {
              if (c instanceof Ii) return y(null);
              throw c;
            })
          )
        ),
        lt((a) => !!a),
        ct((a) => {
          if (Hm(a)) return eC(n, i, o) ? y(new td()) : gr(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a) {
      return JI(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s)
          : gr(i)
        : gr(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: l,
        remainingSegments: d,
      } = cd(r, i, o);
      if (!a) return gr(r);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > nC && (this.allowRedirects = !1));
      let u = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, u)
        .pipe(re((f) => this.processSegment(e, n, r, f.concat(d), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o) {
      let s = qI(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          _e((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  _e(({ routes: c }) => {
                    let l = n._loadedInjector ?? e,
                      {
                        consumedSegments: d,
                        remainingSegments: u,
                        parameters: f,
                      } = a,
                      m = new wi(
                        d,
                        f,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        oC(n),
                        vt(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        sC(n)
                      ),
                      { segmentGroup: w, slicedSegments: E } = ym(r, d, u, c);
                    if (E.length === 0 && w.hasChildren())
                      return this.processChildren(l, c, w).pipe(
                        C((j) => (j === null ? null : new Ue(m, j)))
                      );
                    if (c.length === 0 && E.length === 0)
                      return y(new Ue(m, []));
                    let ne = vt(n) === o;
                    return this.processSegment(l, c, w, E, ne ? k : o, !0).pipe(
                      C((j) => new Ue(m, j instanceof Ue ? [j] : []))
                    );
                  })
                ))
              : gr(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? y({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? y({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : HI(e, r, n, this.urlSerializer).pipe(
              re((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      J((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : GI(r)
              )
            )
        : y({ routes: [], injector: e });
    }
  };
function rC(t) {
  t.sort((e, r) =>
    e.value.outlet === k
      ? -1
      : r.value.outlet === k
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function iC(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function Wm(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!iC(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = Wm(n.children);
    e.push(new Ue(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function oC(t) {
  return t.data || {};
}
function sC(t) {
  return t.resolve || {};
}
function aC(t, e, r, n, i, o) {
  return re((s) =>
    tC(t, e, r, n, s.extractedUrl, i, o).pipe(
      C(({ state: a, tree: c }) =>
        oe(g({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function cC(t, e) {
  return re((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return y(r);
    let o = new Set(i.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let l of Gm(c)) s.add(l);
    let a = 0;
    return X(s).pipe(
      Dt((c) =>
        o.has(c)
          ? lC(c, n, t, e)
          : ((c.data = id(c, c.parent, t).resolve), y(void 0))
      ),
      J(() => a++),
      Zn(1),
      re((c) => (a === s.size ? y(r) : ve))
    );
  });
}
function Gm(t) {
  let e = t.children.map((r) => Gm(r)).flat();
  return [t, ...e];
}
function lC(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !jm(i) && (o[Ci] = i.title),
    dC(o, t, e, n).pipe(
      C(
        (s) => (
          (t._resolvedData = s), (t.data = id(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function dC(t, e, r, n) {
  let i = kl(t);
  if (i.length === 0) return y({});
  let o = {};
  return X(i).pipe(
    re((s) =>
      uC(t[s], e, r, n).pipe(
        lt(),
        J((a) => {
          o[s] = a;
        })
      )
    ),
    Zn(1),
    sa(o),
    ct((s) => (Hm(s) ? ve : Vt(s)))
  );
}
function uC(t, e, r, n) {
  let i = Ti(e) ?? n,
    o = Er(t, i),
    s = o.resolve ? o.resolve(e, r) : Xt(i, () => o(e, r));
  return ln(s);
}
function Rl(t) {
  return _e((e) => {
    let r = t(e);
    return r ? X(r).pipe(C(() => e)) : y(e);
  });
}
var qm = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === k));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[Ci];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => p(fC), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  fC = (() => {
    let e = class e extends qm {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(hm));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Si = new _("", { providedIn: "root", factory: () => ({}) }),
  Ms = new _(""),
  ld = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(os));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return y(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = ln(n.loadComponent()).pipe(
            C(Zm),
            J((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            zt(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new zn(i, () => new B()).pipe(Hn());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return y({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = hC(i, this.compiler, n, this.onLoadEndListener).pipe(
            zt(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new zn(s, () => new B()).pipe(Hn());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function hC(t, e, r, n) {
  return ln(t.loadChildren()).pipe(
    C(Zm),
    re((i) =>
      i instanceof Wr || Array.isArray(i) ? y(i) : X(e.compileModuleAsync(i))
    ),
    C((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(Ms, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(ad), injector: o }
      );
    })
  );
}
function pC(t) {
  return t && typeof t == "object" && "default" in t;
}
function Zm(t) {
  return pC(t) ? t.default : t;
}
var dd = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => p(mC), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  mC = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Qm = new _(""),
  Ym = new _("");
function gC(t, e, r) {
  let n = t.get(Ym),
    i = t.get(H);
  return t.get(T).runOutsideAngular(() => {
    if (!i.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), Promise.resolve();
    let o,
      s = new Promise((l) => {
        o = l;
      }),
      a = i.startViewTransition(() => (o(), bC(t))),
      { onViewTransitionCreated: c } = n;
    return c && Xt(t, () => c({ transition: a, from: e, to: r })), s;
  });
}
function bC(t) {
  return new Promise((e) => {
    Qc(e, { injector: t });
  });
}
var ud = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new B()),
        (this.transitionAbortSubject = new B()),
        (this.configLoader = p(ld)),
        (this.environmentInjector = p(Me)),
        (this.urlSerializer = p(Ei)),
        (this.rootContexts = p(xi)),
        (this.location = p(pr)),
        (this.inputBindingEnabled = p(As, { optional: !0 }) !== null),
        (this.titleStrategy = p(qm)),
        (this.options = p(Si, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = p(dd)),
        (this.createViewTransition = p(Qm, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => y(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new Ul(o)),
        i = (o) => this.events.next(new $l(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(
        oe(g(g({}, this.transitions.value), n), { id: i })
      );
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new se({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: pi,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          ae((s) => s.id !== 0),
          C((s) =>
            oe(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          _e((s) => {
            this.currentTransition = s;
            let a = !1,
              c = !1;
            return y(s).pipe(
              J((l) => {
                this.currentNavigation = {
                  id: l.id,
                  initialUrl: l.rawUrl,
                  extractedUrl: l.extractedUrl,
                  trigger: l.source,
                  extras: l.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? oe(g({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              _e((l) => {
                let d =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  u = l.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!d && u !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new cn(
                        l.id,
                        this.urlSerializer.serialize(l.rawUrl),
                        f,
                        _s.IgnoredSameUrlNavigation
                      )
                    ),
                    l.resolve(null),
                    ve
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return y(l).pipe(
                    _e((f) => {
                      let m = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Dr(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        m !== this.transitions?.getValue()
                          ? ve
                          : Promise.resolve(f)
                      );
                    }),
                    aC(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    J((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = oe(
                          g({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let m = new ws(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(m);
                    })
                  );
                if (
                  d &&
                  this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: m,
                      source: w,
                      restoredState: E,
                      extras: ne,
                    } = l,
                    j = new Dr(f, this.urlSerializer.serialize(m), w, E);
                  this.events.next(j);
                  let ie = Pm(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      oe(g({}, l), {
                        targetSnapshot: ie,
                        urlAfterRedirects: m,
                        extras: oe(g({}, ne), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = m),
                    y(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new cn(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        f,
                        _s.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    l.resolve(null),
                    ve
                  );
                }
              }),
              J((l) => {
                let d = new Ll(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot
                );
                this.events.next(d);
              }),
              C(
                (l) => (
                  (this.currentTransition = s =
                    oe(g({}, l), {
                      guards: EI(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              FI(this.environmentInjector, (l) => this.events.next(l)),
              J((l) => {
                if (((s.guardsResult = l.guardsResult), wr(l.guardsResult)))
                  throw Vm(this.urlSerializer, l.guardsResult);
                let d = new jl(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult
                );
                this.events.next(d);
              }),
              ae((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, "", Ge.GuardRejected),
                    !1)
              ),
              Rl((l) => {
                if (l.guards.canActivateChecks.length)
                  return y(l).pipe(
                    J((d) => {
                      let u = new Bl(
                        d.id,
                        this.urlSerializer.serialize(d.extractedUrl),
                        this.urlSerializer.serialize(d.urlAfterRedirects),
                        d.targetSnapshot
                      );
                      this.events.next(u);
                    }),
                    _e((d) => {
                      let u = !1;
                      return y(d).pipe(
                        cC(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        J({
                          next: () => (u = !0),
                          complete: () => {
                            u ||
                              this.cancelNavigationTransition(
                                d,
                                "",
                                Ge.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    J((d) => {
                      let u = new Vl(
                        d.id,
                        this.urlSerializer.serialize(d.extractedUrl),
                        this.urlSerializer.serialize(d.urlAfterRedirects),
                        d.targetSnapshot
                      );
                      this.events.next(u);
                    })
                  );
              }),
              Rl((l) => {
                let d = (u) => {
                  let f = [];
                  u.routeConfig?.loadComponent &&
                    !u.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(u.routeConfig).pipe(
                        J((m) => {
                          u.component = m;
                        }),
                        C(() => {})
                      )
                    );
                  for (let m of u.children) f.push(...d(m));
                  return f;
                };
                return gn(d(l.targetSnapshot.root)).pipe(Ht(null), ye(1));
              }),
              Rl(() => this.afterPreactivation()),
              _e(() => {
                let { currentSnapshot: l, targetSnapshot: d } = s,
                  u = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    d.root
                  );
                return u ? X(u).pipe(C(() => s)) : y(s);
              }),
              C((l) => {
                let d = bI(
                  n.routeReuseStrategy,
                  l.targetSnapshot,
                  l.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    oe(g({}, l), { targetRouterState: d })),
                  (this.currentNavigation.targetRouterState = d),
                  s
                );
              }),
              J(() => {
                this.events.next(new yi());
              }),
              CI(
                this.rootContexts,
                n.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled
              ),
              ye(1),
              J({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new it(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      l.targetRouterState.snapshot
                    ),
                    l.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              we(
                this.transitionAbortSubject.pipe(
                  J((l) => {
                    throw l;
                  })
                )
              ),
              zt(() => {
                !a &&
                  !c &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    Ge.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              ct((l) => {
                if (((c = !0), $m(l)))
                  this.events.next(
                    new an(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l.message,
                      l.cancellationCode
                    )
                  ),
                    _I(l) ? this.events.next(new _i(l.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new vi(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(l));
                  } catch (d) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(d);
                  }
                }
                return ve;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new an(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function vC(t) {
  return t !== pi;
}
var yC = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => p(_C), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  rd = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  _C = (() => {
    let e = class e extends rd {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = jc(e)))(o || e);
      };
    })()),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Km = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => p(wC), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  wC = (() => {
    let e = class e extends Km {
      constructor() {
        super(...arguments),
          (this.location = p(pr)),
          (this.urlSerializer = p(Ei)),
          (this.options = p(Si, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(dd)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new sn()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Pm(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof Dr) this.stateMemento = this.createStateMemento();
        else if (n instanceof cn) this.rawUrlTree = i.initialUrl;
        else if (n instanceof ws) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof yi
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof an &&
              (n.code === Ge.GuardRejected || n.code === Ge.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof vi
            ? this.restoreHistory(i, !0)
            : n instanceof it &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = g(
            g({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = jc(e)))(o || e);
      };
    })()),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  fi = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(fi || {});
function Xm(t, e) {
  t.events
    .pipe(
      ae(
        (r) =>
          r instanceof it ||
          r instanceof an ||
          r instanceof vi ||
          r instanceof cn
      ),
      C((r) =>
        r instanceof it || r instanceof cn
          ? fi.COMPLETE
          : (
              r instanceof an
                ? r.code === Ge.Redirect ||
                  r.code === Ge.SupersededByNewNavigation
                : !1
            )
          ? fi.REDIRECTING
          : fi.FAILED
      ),
      ae((r) => r !== fi.REDIRECTING),
      ye(1)
    )
    .subscribe(() => {
      e();
    });
}
function DC(t) {
  throw t;
}
var IC = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  CC = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Lt = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = p(ts)),
          (this.stateManager = p(Km)),
          (this.options = p(Si, { optional: !0 }) || {}),
          (this.pendingTasks = p(es)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(ud)),
          (this.urlSerializer = p(Ei)),
          (this.location = p(pr)),
          (this.urlHandlingStrategy = p(dd)),
          (this._events = new B()),
          (this.errorHandler = this.options.errorHandler || DC),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(yC)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(Ms, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(As, { optional: !0 })),
          (this.eventsSubscription = new Z()),
          (this.isNgZoneEnabled = p(T) instanceof T && T.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof an &&
                  i.code !== Ge.Redirect &&
                  i.code !== Ge.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof it) this.navigated = !0;
              else if (i instanceof _i) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  c = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || vC(o.source),
                  };
                this.scheduleNavigation(a, pi, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            xC(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              pi,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let l = g({}, o);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (s.state = l);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(ad)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: l,
          } = i,
          d = l ? this.currentUrlTree.fragment : a,
          u = null;
        switch (c) {
          case "merge":
            u = g(g({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = s || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let f;
        try {
          let m = o ? o.snapshot : this.routerState.snapshot.root;
          f = Nm(m);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (f = this.currentUrlTree.root);
        }
        return km(f, n, u, d ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = wr(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, pi, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return EC(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = g({}, IC)) : i === !1 ? (o = g({}, CC)) : (o = i),
          wr(n))
        )
          return pm(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return pm(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, d;
        a
          ? ((c = a.resolve), (l = a.reject), (d = a.promise))
          : (d = new Promise((f, m) => {
              (c = f), (l = m);
            }));
        let u = this.pendingTasks.add();
        return (
          Xm(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: c,
            reject: l,
            promise: d,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          d.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function EC(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new D(4008, !1);
}
function xC(t) {
  return !(t instanceof yi) && !(t instanceof _i);
}
var Cr = (() => {
    let e = class e {
      constructor(n, i, o, s, a, c) {
        (this.router = n),
          (this.route = i),
          (this.tabIndexAttribute = o),
          (this.renderer = s),
          (this.el = a),
          (this.locationStrategy = c),
          (this.href = null),
          (this.commands = null),
          (this.onChanges = new B()),
          (this.preserveFragment = !1),
          (this.skipLocationChange = !1),
          (this.replaceUrl = !1);
        let l = a.nativeElement.tagName?.toLowerCase();
        (this.isAnchorElement = l === "a" || l === "area"),
          this.isAnchorElement
            ? (this.subscription = n.events.subscribe((d) => {
                d instanceof it && this.updateHref();
              }))
            : this.setTabIndexIfNotOnNativeEl("0");
      }
      setTabIndexIfNotOnNativeEl(n) {
        this.tabIndexAttribute != null ||
          this.isAnchorElement ||
          this.applyAttributeValue("tabindex", n);
      }
      ngOnChanges(n) {
        this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
      }
      set routerLink(n) {
        n != null
          ? ((this.commands = Array.isArray(n) ? n : [n]),
            this.setTabIndexIfNotOnNativeEl("0"))
          : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
      }
      onClick(n, i, o, s, a) {
        let c = this.urlTree;
        if (
          c === null ||
          (this.isAnchorElement &&
            (n !== 0 ||
              i ||
              o ||
              s ||
              a ||
              (typeof this.target == "string" && this.target != "_self")))
        )
          return !0;
        let l = {
          skipLocationChange: this.skipLocationChange,
          replaceUrl: this.replaceUrl,
          state: this.state,
          info: this.info,
        };
        return this.router.navigateByUrl(c, l), !this.isAnchorElement;
      }
      ngOnDestroy() {
        this.subscription?.unsubscribe();
      }
      updateHref() {
        let n = this.urlTree;
        this.href =
          n !== null && this.locationStrategy
            ? this.locationStrategy?.prepareExternalUrl(
                this.router.serializeUrl(n)
              )
            : null;
        let i =
          this.href === null
            ? null
            : Fh(
                this.href,
                this.el.nativeElement.tagName.toLowerCase(),
                "href"
              );
        this.applyAttributeValue("href", i);
      }
      applyAttributeValue(n, i) {
        let o = this.renderer,
          s = this.el.nativeElement;
        i !== null ? o.setAttribute(s, n, i) : o.removeAttribute(s, n);
      }
      get urlTree() {
        return this.commands === null
          ? null
          : this.router.createUrlTree(this.commands, {
              relativeTo:
                this.relativeTo !== void 0 ? this.relativeTo : this.route,
              queryParams: this.queryParams,
              fragment: this.fragment,
              queryParamsHandling: this.queryParamsHandling,
              preserveFragment: this.preserveFragment,
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(Lt), v(Fn), Sn("tabindex"), v(ti), v(U), v(Pt));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["", "routerLink", ""]],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 1 &&
            gt("click", function (a) {
              return o.onClick(
                a.button,
                a.ctrlKey,
                a.shiftKey,
                a.altKey,
                a.metaKey
              );
            }),
            i & 2 && We("target", o.target);
        },
        inputs: {
          target: "target",
          queryParams: "queryParams",
          fragment: "fragment",
          queryParamsHandling: "queryParamsHandling",
          state: "state",
          info: "info",
          relativeTo: "relativeTo",
          preserveFragment: [
            N.HasDecoratorInputTransform,
            "preserveFragment",
            "preserveFragment",
            ee,
          ],
          skipLocationChange: [
            N.HasDecoratorInputTransform,
            "skipLocationChange",
            "skipLocationChange",
            ee,
          ],
          replaceUrl: [
            N.HasDecoratorInputTransform,
            "replaceUrl",
            "replaceUrl",
            ee,
          ],
          routerLink: "routerLink",
        },
        standalone: !0,
        features: [ge, Nt],
      }));
    let t = e;
    return t;
  })(),
  Jm = (() => {
    let e = class e {
      get isActive() {
        return this._isActive;
      }
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.element = i),
          (this.renderer = o),
          (this.cdr = s),
          (this.link = a),
          (this.classes = []),
          (this._isActive = !1),
          (this.routerLinkActiveOptions = { exact: !1 }),
          (this.isActiveChange = new K()),
          (this.routerEventsSubscription = n.events.subscribe((c) => {
            c instanceof it && this.update();
          }));
      }
      ngAfterContentInit() {
        y(this.links.changes, y(null))
          .pipe(at())
          .subscribe((n) => {
            this.update(), this.subscribeToEachLinkOnChanges();
          });
      }
      subscribeToEachLinkOnChanges() {
        this.linkInputChangesSubscription?.unsubscribe();
        let n = [...this.links.toArray(), this.link]
          .filter((i) => !!i)
          .map((i) => i.onChanges);
        this.linkInputChangesSubscription = X(n)
          .pipe(at())
          .subscribe((i) => {
            this._isActive !== this.isLinkActive(this.router)(i) &&
              this.update();
          });
      }
      set routerLinkActive(n) {
        let i = Array.isArray(n) ? n : n.split(" ");
        this.classes = i.filter((o) => !!o);
      }
      ngOnChanges(n) {
        this.update();
      }
      ngOnDestroy() {
        this.routerEventsSubscription.unsubscribe(),
          this.linkInputChangesSubscription?.unsubscribe();
      }
      update() {
        !this.links ||
          !this.router.navigated ||
          queueMicrotask(() => {
            let n = this.hasActiveLinks();
            this._isActive !== n &&
              ((this._isActive = n),
              this.cdr.markForCheck(),
              this.classes.forEach((i) => {
                n
                  ? this.renderer.addClass(this.element.nativeElement, i)
                  : this.renderer.removeClass(this.element.nativeElement, i);
              }),
              n && this.ariaCurrentWhenActive !== void 0
                ? this.renderer.setAttribute(
                    this.element.nativeElement,
                    "aria-current",
                    this.ariaCurrentWhenActive.toString()
                  )
                : this.renderer.removeAttribute(
                    this.element.nativeElement,
                    "aria-current"
                  ),
              this.isActiveChange.emit(n));
          });
      }
      isLinkActive(n) {
        let i = TC(this.routerLinkActiveOptions)
          ? this.routerLinkActiveOptions
          : this.routerLinkActiveOptions.exact || !1;
        return (o) => {
          let s = o.urlTree;
          return s ? n.isActive(s, i) : !1;
        };
      }
      hasActiveLinks() {
        let n = this.isLinkActive(this.router);
        return (this.link && n(this.link)) || this.links.some(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(Lt), v(U), v(ti), v(rt), v(Cr, 8));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["", "routerLinkActive", ""]],
        contentQueries: function (i, o, s) {
          if ((i & 1 && ur(s, Cr, 5), i & 2)) {
            let a;
            Be((a = Ve())) && (o.links = a);
          }
        },
        inputs: {
          routerLinkActiveOptions: "routerLinkActiveOptions",
          ariaCurrentWhenActive: "ariaCurrentWhenActive",
          routerLinkActive: "routerLinkActive",
        },
        outputs: { isActiveChange: "isActiveChange" },
        exportAs: ["routerLinkActive"],
        standalone: !0,
        features: [Nt],
      }));
    let t = e;
    return t;
  })();
function TC(t) {
  return !!t.paths;
}
var Ss = class {};
var MC = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            ae((n) => n instanceof it),
            Dt(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = Jo(s.providers, n, `Route: ${s.path}`));
          let a = s._injector ?? n,
            c = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(c, s.children ?? s._loadedRoutes));
        }
        return X(o).pipe(at());
      }
      preloadConfig(n, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(n, i))
            : (o = y(null));
          let s = o.pipe(
            re((a) =>
              a === null
                ? y(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return X([s, a]).pipe(at());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(Lt), h(os), h(Me), h(Ss), h(ld));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  eg = new _(""),
  SC = (() => {
    let e = class e {
      constructor(n, i, o, s, a = {}) {
        (this.urlSerializer = n),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (a.scrollPositionRestoration ||= "disabled"),
          (a.anchorScrolling ||= "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Dr
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof it
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof cn &&
              n.code === _s.IgnoredSameUrlNavigation &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Ds &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, i) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new Ds(
                  n,
                  this.lastSource === "popstate"
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      Yo();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function AC(t) {
  return t.routerState.root;
}
function Ai(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function RC() {
  let t = p(mt);
  return (e) => {
    let r = t.get(fr);
    if (e !== r.components[0]) return;
    let n = t.get(Lt),
      i = t.get(tg);
    t.get(fd) === 1 && n.initialNavigation(),
      t.get(ng, null, O.Optional)?.setUpPreloading(),
      t.get(eg, null, O.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var tg = new _("", { factory: () => new B() }),
  fd = new _("", { providedIn: "root", factory: () => 1 });
function NC() {
  return Ai(2, [
    { provide: fd, useValue: 0 },
    {
      provide: is,
      multi: !0,
      deps: [mt],
      useFactory: (e) => {
        let r = e.get(Gp, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let i = e.get(Lt),
                  o = e.get(tg);
                Xm(i, () => {
                  n(!0);
                }),
                  (e.get(ud).afterPreactivation = () => (
                    n(!0), o.closed ? y(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function kC() {
  return Ai(3, [
    {
      provide: is,
      multi: !0,
      useFactory: () => {
        let e = p(Lt);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: fd, useValue: 2 },
  ]);
}
var ng = new _("");
function OC(t) {
  return Ai(0, [
    { provide: ng, useExisting: MC },
    { provide: Ss, useExisting: t },
  ]);
}
function FC() {
  return Ai(8, [vm, { provide: As, useExisting: vm }]);
}
function PC(t) {
  let e = [
    { provide: Qm, useValue: gC },
    {
      provide: Ym,
      useValue: g({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return Ai(9, e);
}
var _m = new _("ROUTER_FORROOT_GUARD"),
  LC = [
    pr,
    { provide: Ei, useClass: gi },
    Lt,
    xi,
    { provide: Fn, useFactory: AC, deps: [Lt] },
    ld,
    [],
  ],
  hd = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, i) {
        return {
          ngModule: e,
          providers: [
            LC,
            [],
            { provide: Ms, multi: !0, useValue: n },
            { provide: _m, useFactory: UC, deps: [[Lt, new Wo(), new Oc()]] },
            { provide: Si, useValue: i || {} },
            i?.useHash ? BC() : VC(),
            jC(),
            i?.preloadingStrategy ? OC(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? $C(i) : [],
            i?.bindToComponentInputs ? FC().ɵproviders : [],
            i?.enableViewTransitions ? PC().ɵproviders : [],
            HC(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: Ms, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(_m, 8));
    }),
      (e.ɵmod = V({ type: e })),
      (e.ɵinj = $({}));
    let t = e;
    return t;
  })();
function jC() {
  return {
    provide: eg,
    useFactory: () => {
      let t = p(Yp),
        e = p(T),
        r = p(Si),
        n = p(ud),
        i = p(Ei);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new SC(i, n, t, e, r)
      );
    },
  };
}
function BC() {
  return { provide: Pt, useClass: Zp };
}
function VC() {
  return { provide: Pt, useClass: cl };
}
function UC(t) {
  return "guarded";
}
function $C(t) {
  return [
    t.initialNavigation === "disabled" ? kC().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? NC().ɵproviders : [],
  ];
}
var wm = new _("");
function HC() {
  return [
    { provide: wm, useFactory: RC },
    { provide: tl, multi: !0, useExisting: wm },
  ];
}
var md = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Y({
      type: e,
      selectors: [["app-home"]],
      decls: 15,
      vars: 0,
      consts: [
        ["id", "home-contents", 1, "main-container"],
        ["id", "img-contents", 1, "image-with-contents"],
        ["src", "../assets/home.jpg", 1, "image-container"],
        [1, "text-inside-image"],
        [2, "margin", "0"],
        [2, "margin", "0", "font-size", "2rem"],
        ["id", "section1"],
        ["id", "section2"],
      ],
      template: function (i, o) {
        i & 1 &&
          (R(0, "div", 0)(1, "div", 1),
          de(2, "img", 2),
          R(3, "div", 3)(4, "p", 4),
          G(5, "Hello, I am Rohit"),
          P(),
          R(6, "p", 5),
          G(7, "A fitness streak."),
          P()()(),
          R(8, "div", 6)(9, "h1"),
          G(10, "Welcome"),
          P(),
          R(11, "h3"),
          G(12, "A whole new experience!"),
          P()(),
          R(13, "div", 7),
          G(14, "Copyright 2024 Website.com. All Rights Reserved."),
          P()());
      },
      styles: [
        ".image-with-contents[_ngcontent-%COMP%]{text-align:center}.text-inside-image[_ngcontent-%COMP%]{position:absolute;top:50%;left:38%;font-size:3rem;color:#fff;font-style:oblique}#section1[_ngcontent-%COMP%]{background-color:#5977a8;text-align:center;padding-top:1rem;position:relative;color:#fff;top:-1rem}#section2[_ngcontent-%COMP%]{background-color:#000;color:#fff;text-align:center;position:relative;top:-1rem}",
      ],
    }));
  let t = e;
  return t;
})();
var bd;
try {
  bd = typeof Intl < "u" && Intl.v8BreakIterator;
} catch {
  bd = !1;
}
var ce = (() => {
  let e = class e {
    constructor(n) {
      (this._platformId = n),
        (this.isBrowser = this._platformId
          ? dl(this._platformId)
          : typeof document == "object" && !!document),
        (this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent)),
        (this.TRIDENT =
          this.isBrowser && /(msie|trident)/i.test(navigator.userAgent)),
        (this.BLINK =
          this.isBrowser &&
          !!(window.chrome || bd) &&
          typeof CSS < "u" &&
          !this.EDGE &&
          !this.TRIDENT),
        (this.WEBKIT =
          this.isBrowser &&
          /AppleWebKit/i.test(navigator.userAgent) &&
          !this.BLINK &&
          !this.EDGE &&
          !this.TRIDENT),
        (this.IOS =
          this.isBrowser &&
          /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          !("MSStream" in window)),
        (this.FIREFOX =
          this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent)),
        (this.ANDROID =
          this.isBrowser &&
          /android/i.test(navigator.userAgent) &&
          !this.TRIDENT),
        (this.SAFARI =
          this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(h(pt));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Ri;
function zC() {
  if (Ri == null && typeof window < "u")
    try {
      window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", { get: () => (Ri = !0) })
      );
    } finally {
      Ri = Ri || !1;
    }
  return Ri;
}
function dn(t) {
  return zC() ? t : !!t.capture;
}
var gd;
function WC() {
  if (gd == null) {
    let t = typeof document < "u" ? document.head : null;
    gd = !!(t && (t.createShadowRoot || t.attachShadow));
  }
  return gd;
}
function rg(t) {
  if (WC()) {
    let e = t.getRootNode ? t.getRootNode() : null;
    if (typeof ShadowRoot < "u" && ShadowRoot && e instanceof ShadowRoot)
      return e;
  }
  return null;
}
function un(t) {
  return t.composedPath ? t.composedPath()[0] : t.target;
}
function ig() {
  return (
    (typeof __karma__ < "u" && !!__karma__) ||
    (typeof jasmine < "u" && !!jasmine) ||
    (typeof jest < "u" && !!jest) ||
    (typeof Mocha < "u" && !!Mocha)
  );
}
function Ns(t, ...e) {
  return e.length
    ? e.some((r) => t[r])
    : t.altKey || t.shiftKey || t.ctrlKey || t.metaKey;
}
function vd(t, e = 0) {
  return GC(t) ? Number(t) : e;
}
function GC(t) {
  return !isNaN(parseFloat(t)) && !isNaN(Number(t));
}
function yd(t) {
  return Array.isArray(t) ? t : [t];
}
function jt(t) {
  return t instanceof U ? t.nativeElement : t;
}
var qC = (() => {
    let e = class e {
      create(n) {
        return typeof MutationObserver > "u" ? null : new MutationObserver(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ZC = (() => {
    let e = class e {
      constructor(n) {
        (this._mutationObserverFactory = n),
          (this._observedElements = new Map());
      }
      ngOnDestroy() {
        this._observedElements.forEach((n, i) => this._cleanupObserver(i));
      }
      observe(n) {
        let i = jt(n);
        return new M((o) => {
          let a = this._observeElement(i).subscribe(o);
          return () => {
            a.unsubscribe(), this._unobserveElement(i);
          };
        });
      }
      _observeElement(n) {
        if (this._observedElements.has(n))
          this._observedElements.get(n).count++;
        else {
          let i = new B(),
            o = this._mutationObserverFactory.create((s) => i.next(s));
          o && o.observe(n, { characterData: !0, childList: !0, subtree: !0 }),
            this._observedElements.set(n, { observer: o, stream: i, count: 1 });
        }
        return this._observedElements.get(n).stream;
      }
      _unobserveElement(n) {
        this._observedElements.has(n) &&
          (this._observedElements.get(n).count--,
          this._observedElements.get(n).count || this._cleanupObserver(n));
      }
      _cleanupObserver(n) {
        if (this._observedElements.has(n)) {
          let { observer: i, stream: o } = this._observedElements.get(n);
          i && i.disconnect(), o.complete(), this._observedElements.delete(n);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(qC));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  og = (() => {
    let e = class e {
      get disabled() {
        return this._disabled;
      }
      set disabled(n) {
        (this._disabled = n),
          this._disabled ? this._unsubscribe() : this._subscribe();
      }
      get debounce() {
        return this._debounce;
      }
      set debounce(n) {
        (this._debounce = vd(n)), this._subscribe();
      }
      constructor(n, i, o) {
        (this._contentObserver = n),
          (this._elementRef = i),
          (this._ngZone = o),
          (this.event = new K()),
          (this._disabled = !1),
          (this._currentSubscription = null);
      }
      ngAfterContentInit() {
        !this._currentSubscription && !this.disabled && this._subscribe();
      }
      ngOnDestroy() {
        this._unsubscribe();
      }
      _subscribe() {
        this._unsubscribe();
        let n = this._contentObserver.observe(this._elementRef);
        this._ngZone.runOutsideAngular(() => {
          this._currentSubscription = (
            this.debounce ? n.pipe(bn(this.debounce)) : n
          ).subscribe(this.event);
        });
      }
      _unsubscribe() {
        this._currentSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(ZC), v(U), v(T));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["", "cdkObserveContent", ""]],
        inputs: {
          disabled: [
            N.HasDecoratorInputTransform,
            "cdkObserveContentDisabled",
            "disabled",
            ee,
          ],
          debounce: "debounce",
        },
        outputs: { event: "cdkObserveContent" },
        exportAs: ["cdkObserveContent"],
        standalone: !0,
        features: [ge],
      }));
    let t = e;
    return t;
  })();
var sg = new Set(),
  Ln,
  QC = (() => {
    let e = class e {
      constructor(n, i) {
        (this._platform = n),
          (this._nonce = i),
          (this._matchMedia =
            this._platform.isBrowser && window.matchMedia
              ? window.matchMedia.bind(window)
              : KC);
      }
      matchMedia(n) {
        return (
          (this._platform.WEBKIT || this._platform.BLINK) && YC(n, this._nonce),
          this._matchMedia(n)
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(ce), h(Xr, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function YC(t, e) {
  if (!sg.has(t))
    try {
      Ln ||
        ((Ln = document.createElement("style")),
        e && (Ln.nonce = e),
        Ln.setAttribute("type", "text/css"),
        document.head.appendChild(Ln)),
        Ln.sheet &&
          (Ln.sheet.insertRule(`@media ${t} {body{ }}`, 0), sg.add(t));
    } catch (r) {
      console.error(r);
    }
}
function KC(t) {
  return {
    matches: t === "all" || t === "",
    media: t,
    addListener: () => {},
    removeListener: () => {},
  };
}
var cg = (() => {
  let e = class e {
    constructor(n, i) {
      (this._mediaMatcher = n),
        (this._zone = i),
        (this._queries = new Map()),
        (this._destroySubject = new B());
    }
    ngOnDestroy() {
      this._destroySubject.next(), this._destroySubject.complete();
    }
    isMatched(n) {
      return ag(yd(n)).some((o) => this._registerQuery(o).mql.matches);
    }
    observe(n) {
      let o = ag(yd(n)).map((a) => this._registerQuery(a).observable),
        s = gn(o);
      return (
        (s = Ut(s.pipe(ye(1)), s.pipe(vn(1), bn(0)))),
        s.pipe(
          C((a) => {
            let c = { matches: !1, breakpoints: {} };
            return (
              a.forEach(({ matches: l, query: d }) => {
                (c.matches = c.matches || l), (c.breakpoints[d] = l);
              }),
              c
            );
          })
        )
      );
    }
    _registerQuery(n) {
      if (this._queries.has(n)) return this._queries.get(n);
      let i = this._mediaMatcher.matchMedia(n),
        s = {
          observable: new M((a) => {
            let c = (l) => this._zone.run(() => a.next(l));
            return (
              i.addListener(c),
              () => {
                i.removeListener(c);
              }
            );
          }).pipe(
            It(i),
            C(({ matches: a }) => ({ query: n, matches: a })),
            we(this._destroySubject)
          ),
          mql: i,
        };
      return this._queries.set(n, s), s;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(h(QC), h(T));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function ag(t) {
  return t
    .map((e) => e.split(","))
    .reduce((e, r) => e.concat(r))
    .map((e) => e.trim());
}
var wd = class {
  constructor(e) {
    (this._items = e),
      (this._activeItemIndex = -1),
      (this._activeItem = null),
      (this._wrap = !1),
      (this._letterKeyStream = new B()),
      (this._typeaheadSubscription = Z.EMPTY),
      (this._vertical = !0),
      (this._allowedModifierKeys = []),
      (this._homeAndEnd = !1),
      (this._pageUpAndDown = { enabled: !1, delta: 10 }),
      (this._skipPredicateFn = (r) => r.disabled),
      (this._pressedLetters = []),
      (this.tabOut = new B()),
      (this.change = new B()),
      e instanceof En &&
        (this._itemChangesSubscription = e.changes.subscribe((r) => {
          if (this._activeItem) {
            let i = r.toArray().indexOf(this._activeItem);
            i > -1 &&
              i !== this._activeItemIndex &&
              (this._activeItemIndex = i);
          }
        }));
  }
  skipPredicate(e) {
    return (this._skipPredicateFn = e), this;
  }
  withWrap(e = !0) {
    return (this._wrap = e), this;
  }
  withVerticalOrientation(e = !0) {
    return (this._vertical = e), this;
  }
  withHorizontalOrientation(e) {
    return (this._horizontal = e), this;
  }
  withAllowedModifierKeys(e) {
    return (this._allowedModifierKeys = e), this;
  }
  withTypeAhead(e = 200) {
    return (
      this._typeaheadSubscription.unsubscribe(),
      (this._typeaheadSubscription = this._letterKeyStream
        .pipe(
          J((r) => this._pressedLetters.push(r)),
          bn(e),
          ae(() => this._pressedLetters.length > 0),
          C(() => this._pressedLetters.join(""))
        )
        .subscribe((r) => {
          let n = this._getItemsArray();
          for (let i = 1; i < n.length + 1; i++) {
            let o = (this._activeItemIndex + i) % n.length,
              s = n[o];
            if (
              !this._skipPredicateFn(s) &&
              s.getLabel().toUpperCase().trim().indexOf(r) === 0
            ) {
              this.setActiveItem(o);
              break;
            }
          }
          this._pressedLetters = [];
        })),
      this
    );
  }
  cancelTypeahead() {
    return (this._pressedLetters = []), this;
  }
  withHomeAndEnd(e = !0) {
    return (this._homeAndEnd = e), this;
  }
  withPageUpDown(e = !0, r = 10) {
    return (this._pageUpAndDown = { enabled: e, delta: r }), this;
  }
  setActiveItem(e) {
    let r = this._activeItem;
    this.updateActiveItem(e),
      this._activeItem !== r && this.change.next(this._activeItemIndex);
  }
  onKeydown(e) {
    let r = e.keyCode,
      i = ["altKey", "ctrlKey", "metaKey", "shiftKey"].every(
        (o) => !e[o] || this._allowedModifierKeys.indexOf(o) > -1
      );
    switch (r) {
      case 9:
        this.tabOut.next();
        return;
      case 40:
        if (this._vertical && i) {
          this.setNextItemActive();
          break;
        } else return;
      case 38:
        if (this._vertical && i) {
          this.setPreviousItemActive();
          break;
        } else return;
      case 39:
        if (this._horizontal && i) {
          this._horizontal === "rtl"
            ? this.setPreviousItemActive()
            : this.setNextItemActive();
          break;
        } else return;
      case 37:
        if (this._horizontal && i) {
          this._horizontal === "rtl"
            ? this.setNextItemActive()
            : this.setPreviousItemActive();
          break;
        } else return;
      case 36:
        if (this._homeAndEnd && i) {
          this.setFirstItemActive();
          break;
        } else return;
      case 35:
        if (this._homeAndEnd && i) {
          this.setLastItemActive();
          break;
        } else return;
      case 33:
        if (this._pageUpAndDown.enabled && i) {
          let o = this._activeItemIndex - this._pageUpAndDown.delta;
          this._setActiveItemByIndex(o > 0 ? o : 0, 1);
          break;
        } else return;
      case 34:
        if (this._pageUpAndDown.enabled && i) {
          let o = this._activeItemIndex + this._pageUpAndDown.delta,
            s = this._getItemsArray().length;
          this._setActiveItemByIndex(o < s ? o : s - 1, -1);
          break;
        } else return;
      default:
        (i || Ns(e, "shiftKey")) &&
          (e.key && e.key.length === 1
            ? this._letterKeyStream.next(e.key.toLocaleUpperCase())
            : ((r >= 65 && r <= 90) || (r >= 48 && r <= 57)) &&
              this._letterKeyStream.next(String.fromCharCode(r)));
        return;
    }
    (this._pressedLetters = []), e.preventDefault();
  }
  get activeItemIndex() {
    return this._activeItemIndex;
  }
  get activeItem() {
    return this._activeItem;
  }
  isTyping() {
    return this._pressedLetters.length > 0;
  }
  setFirstItemActive() {
    this._setActiveItemByIndex(0, 1);
  }
  setLastItemActive() {
    this._setActiveItemByIndex(this._items.length - 1, -1);
  }
  setNextItemActive() {
    this._activeItemIndex < 0
      ? this.setFirstItemActive()
      : this._setActiveItemByDelta(1);
  }
  setPreviousItemActive() {
    this._activeItemIndex < 0 && this._wrap
      ? this.setLastItemActive()
      : this._setActiveItemByDelta(-1);
  }
  updateActiveItem(e) {
    let r = this._getItemsArray(),
      n = typeof e == "number" ? e : r.indexOf(e),
      i = r[n];
    (this._activeItem = i ?? null), (this._activeItemIndex = n);
  }
  destroy() {
    this._typeaheadSubscription.unsubscribe(),
      this._itemChangesSubscription?.unsubscribe(),
      this._letterKeyStream.complete(),
      this.tabOut.complete(),
      this.change.complete(),
      (this._pressedLetters = []);
  }
  _setActiveItemByDelta(e) {
    this._wrap ? this._setActiveInWrapMode(e) : this._setActiveInDefaultMode(e);
  }
  _setActiveInWrapMode(e) {
    let r = this._getItemsArray();
    for (let n = 1; n <= r.length; n++) {
      let i = (this._activeItemIndex + e * n + r.length) % r.length,
        o = r[i];
      if (!this._skipPredicateFn(o)) {
        this.setActiveItem(i);
        return;
      }
    }
  }
  _setActiveInDefaultMode(e) {
    this._setActiveItemByIndex(this._activeItemIndex + e, e);
  }
  _setActiveItemByIndex(e, r) {
    let n = this._getItemsArray();
    if (n[e]) {
      for (; this._skipPredicateFn(n[e]); ) if (((e += r), !n[e])) return;
      this.setActiveItem(e);
    }
  }
  _getItemsArray() {
    return this._items instanceof En ? this._items.toArray() : this._items;
  }
};
var Fs = class extends wd {
  constructor() {
    super(...arguments), (this._origin = "program");
  }
  setFocusOrigin(e) {
    return (this._origin = e), this;
  }
  setActiveItem(e) {
    super.setActiveItem(e),
      this.activeItem && this.activeItem.focus(this._origin);
  }
};
function Dd(t) {
  return t.buttons === 0 || t.detail === 0;
}
function Id(t) {
  let e =
    (t.touches && t.touches[0]) || (t.changedTouches && t.changedTouches[0]);
  return (
    !!e &&
    e.identifier === -1 &&
    (e.radiusX == null || e.radiusX === 1) &&
    (e.radiusY == null || e.radiusY === 1)
  );
}
var gE = new _("cdk-input-modality-detector-options"),
  bE = { ignoreKeys: [18, 17, 224, 91, 16] },
  ug = 650,
  xr = dn({ passive: !0, capture: !0 }),
  vE = (() => {
    let e = class e {
      get mostRecentModality() {
        return this._modality.value;
      }
      constructor(n, i, o, s) {
        (this._platform = n),
          (this._mostRecentTarget = null),
          (this._modality = new se(null)),
          (this._lastTouchMs = 0),
          (this._onKeydown = (a) => {
            this._options?.ignoreKeys?.some((c) => c === a.keyCode) ||
              (this._modality.next("keyboard"),
              (this._mostRecentTarget = un(a)));
          }),
          (this._onMousedown = (a) => {
            Date.now() - this._lastTouchMs < ug ||
              (this._modality.next(Dd(a) ? "keyboard" : "mouse"),
              (this._mostRecentTarget = un(a)));
          }),
          (this._onTouchstart = (a) => {
            if (Id(a)) {
              this._modality.next("keyboard");
              return;
            }
            (this._lastTouchMs = Date.now()),
              this._modality.next("touch"),
              (this._mostRecentTarget = un(a));
          }),
          (this._options = g(g({}, bE), s)),
          (this.modalityDetected = this._modality.pipe(vn(1))),
          (this.modalityChanged = this.modalityDetected.pipe(Nr())),
          n.isBrowser &&
            i.runOutsideAngular(() => {
              o.addEventListener("keydown", this._onKeydown, xr),
                o.addEventListener("mousedown", this._onMousedown, xr),
                o.addEventListener("touchstart", this._onTouchstart, xr);
            });
      }
      ngOnDestroy() {
        this._modality.complete(),
          this._platform.isBrowser &&
            (document.removeEventListener("keydown", this._onKeydown, xr),
            document.removeEventListener("mousedown", this._onMousedown, xr),
            document.removeEventListener("touchstart", this._onTouchstart, xr));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(ce), h(T), h(H), h(gE, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var Os = (function (t) {
    return (
      (t[(t.IMMEDIATE = 0)] = "IMMEDIATE"),
      (t[(t.EVENTUAL = 1)] = "EVENTUAL"),
      t
    );
  })(Os || {}),
  yE = new _("cdk-focus-monitor-default-options"),
  ks = dn({ passive: !0, capture: !0 }),
  Ps = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this._ngZone = n),
          (this._platform = i),
          (this._inputModalityDetector = o),
          (this._origin = null),
          (this._windowFocused = !1),
          (this._originFromTouchInteraction = !1),
          (this._elementInfo = new Map()),
          (this._monitoredElementCount = 0),
          (this._rootNodeFocusListenerCount = new Map()),
          (this._windowFocusListener = () => {
            (this._windowFocused = !0),
              (this._windowFocusTimeoutId = window.setTimeout(
                () => (this._windowFocused = !1)
              ));
          }),
          (this._stopInputModalityDetector = new B()),
          (this._rootNodeFocusAndBlurListener = (c) => {
            let l = un(c);
            for (let d = l; d; d = d.parentElement)
              c.type === "focus" ? this._onFocus(c, d) : this._onBlur(c, d);
          }),
          (this._document = s),
          (this._detectionMode = a?.detectionMode || Os.IMMEDIATE);
      }
      monitor(n, i = !1) {
        let o = jt(n);
        if (!this._platform.isBrowser || o.nodeType !== 1) return y();
        let s = rg(o) || this._getDocument(),
          a = this._elementInfo.get(o);
        if (a) return i && (a.checkChildren = !0), a.subject;
        let c = { checkChildren: i, subject: new B(), rootNode: s };
        return (
          this._elementInfo.set(o, c),
          this._registerGlobalListeners(c),
          c.subject
        );
      }
      stopMonitoring(n) {
        let i = jt(n),
          o = this._elementInfo.get(i);
        o &&
          (o.subject.complete(),
          this._setClasses(i),
          this._elementInfo.delete(i),
          this._removeGlobalListeners(o));
      }
      focusVia(n, i, o) {
        let s = jt(n),
          a = this._getDocument().activeElement;
        s === a
          ? this._getClosestElementsInfo(s).forEach(([c, l]) =>
              this._originChanged(c, i, l)
            )
          : (this._setOrigin(i), typeof s.focus == "function" && s.focus(o));
      }
      ngOnDestroy() {
        this._elementInfo.forEach((n, i) => this.stopMonitoring(i));
      }
      _getDocument() {
        return this._document || document;
      }
      _getWindow() {
        return this._getDocument().defaultView || window;
      }
      _getFocusOrigin(n) {
        return this._origin
          ? this._originFromTouchInteraction
            ? this._shouldBeAttributedToTouch(n)
              ? "touch"
              : "program"
            : this._origin
          : this._windowFocused && this._lastFocusOrigin
          ? this._lastFocusOrigin
          : n && this._isLastInteractionFromInputLabel(n)
          ? "mouse"
          : "program";
      }
      _shouldBeAttributedToTouch(n) {
        return (
          this._detectionMode === Os.EVENTUAL ||
          !!n?.contains(this._inputModalityDetector._mostRecentTarget)
        );
      }
      _setClasses(n, i) {
        n.classList.toggle("cdk-focused", !!i),
          n.classList.toggle("cdk-touch-focused", i === "touch"),
          n.classList.toggle("cdk-keyboard-focused", i === "keyboard"),
          n.classList.toggle("cdk-mouse-focused", i === "mouse"),
          n.classList.toggle("cdk-program-focused", i === "program");
      }
      _setOrigin(n, i = !1) {
        this._ngZone.runOutsideAngular(() => {
          if (
            ((this._origin = n),
            (this._originFromTouchInteraction = n === "touch" && i),
            this._detectionMode === Os.IMMEDIATE)
          ) {
            clearTimeout(this._originTimeoutId);
            let o = this._originFromTouchInteraction ? ug : 1;
            this._originTimeoutId = setTimeout(() => (this._origin = null), o);
          }
        });
      }
      _onFocus(n, i) {
        let o = this._elementInfo.get(i),
          s = un(n);
        !o ||
          (!o.checkChildren && i !== s) ||
          this._originChanged(i, this._getFocusOrigin(s), o);
      }
      _onBlur(n, i) {
        let o = this._elementInfo.get(i);
        !o ||
          (o.checkChildren &&
            n.relatedTarget instanceof Node &&
            i.contains(n.relatedTarget)) ||
          (this._setClasses(i), this._emitOrigin(o, null));
      }
      _emitOrigin(n, i) {
        n.subject.observers.length && this._ngZone.run(() => n.subject.next(i));
      }
      _registerGlobalListeners(n) {
        if (!this._platform.isBrowser) return;
        let i = n.rootNode,
          o = this._rootNodeFocusListenerCount.get(i) || 0;
        o ||
          this._ngZone.runOutsideAngular(() => {
            i.addEventListener("focus", this._rootNodeFocusAndBlurListener, ks),
              i.addEventListener(
                "blur",
                this._rootNodeFocusAndBlurListener,
                ks
              );
          }),
          this._rootNodeFocusListenerCount.set(i, o + 1),
          ++this._monitoredElementCount === 1 &&
            (this._ngZone.runOutsideAngular(() => {
              this._getWindow().addEventListener(
                "focus",
                this._windowFocusListener
              );
            }),
            this._inputModalityDetector.modalityDetected
              .pipe(we(this._stopInputModalityDetector))
              .subscribe((s) => {
                this._setOrigin(s, !0);
              }));
      }
      _removeGlobalListeners(n) {
        let i = n.rootNode;
        if (this._rootNodeFocusListenerCount.has(i)) {
          let o = this._rootNodeFocusListenerCount.get(i);
          o > 1
            ? this._rootNodeFocusListenerCount.set(i, o - 1)
            : (i.removeEventListener(
                "focus",
                this._rootNodeFocusAndBlurListener,
                ks
              ),
              i.removeEventListener(
                "blur",
                this._rootNodeFocusAndBlurListener,
                ks
              ),
              this._rootNodeFocusListenerCount.delete(i));
        }
        --this._monitoredElementCount ||
          (this._getWindow().removeEventListener(
            "focus",
            this._windowFocusListener
          ),
          this._stopInputModalityDetector.next(),
          clearTimeout(this._windowFocusTimeoutId),
          clearTimeout(this._originTimeoutId));
      }
      _originChanged(n, i, o) {
        this._setClasses(n, i),
          this._emitOrigin(o, i),
          (this._lastFocusOrigin = i);
      }
      _getClosestElementsInfo(n) {
        let i = [];
        return (
          this._elementInfo.forEach((o, s) => {
            (s === n || (o.checkChildren && s.contains(n))) && i.push([s, o]);
          }),
          i
        );
      }
      _isLastInteractionFromInputLabel(n) {
        let { _mostRecentTarget: i, mostRecentModality: o } =
          this._inputModalityDetector;
        if (
          o !== "mouse" ||
          !i ||
          i === n ||
          (n.nodeName !== "INPUT" && n.nodeName !== "TEXTAREA") ||
          n.disabled
        )
          return !1;
        let s = n.labels;
        if (s) {
          for (let a = 0; a < s.length; a++) if (s[a].contains(i)) return !0;
        }
        return !1;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(T), h(ce), h(vE), h(H, 8), h(yE, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var jn = (function (t) {
    return (
      (t[(t.NONE = 0)] = "NONE"),
      (t[(t.BLACK_ON_WHITE = 1)] = "BLACK_ON_WHITE"),
      (t[(t.WHITE_ON_BLACK = 2)] = "WHITE_ON_BLACK"),
      t
    );
  })(jn || {}),
  lg = "cdk-high-contrast-black-on-white",
  dg = "cdk-high-contrast-white-on-black",
  _d = "cdk-high-contrast-active",
  fg = (() => {
    let e = class e {
      constructor(n, i) {
        (this._platform = n),
          (this._document = i),
          (this._breakpointSubscription = p(cg)
            .observe("(forced-colors: active)")
            .subscribe(() => {
              this._hasCheckedHighContrastMode &&
                ((this._hasCheckedHighContrastMode = !1),
                this._applyBodyHighContrastModeCssClasses());
            }));
      }
      getHighContrastMode() {
        if (!this._platform.isBrowser) return jn.NONE;
        let n = this._document.createElement("div");
        (n.style.backgroundColor = "rgb(1,2,3)"),
          (n.style.position = "absolute"),
          this._document.body.appendChild(n);
        let i = this._document.defaultView || window,
          o = i && i.getComputedStyle ? i.getComputedStyle(n) : null,
          s = ((o && o.backgroundColor) || "").replace(/ /g, "");
        switch ((n.remove(), s)) {
          case "rgb(0,0,0)":
          case "rgb(45,50,54)":
          case "rgb(32,32,32)":
            return jn.WHITE_ON_BLACK;
          case "rgb(255,255,255)":
          case "rgb(255,250,239)":
            return jn.BLACK_ON_WHITE;
        }
        return jn.NONE;
      }
      ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
      }
      _applyBodyHighContrastModeCssClasses() {
        if (
          !this._hasCheckedHighContrastMode &&
          this._platform.isBrowser &&
          this._document.body
        ) {
          let n = this._document.body.classList;
          n.remove(_d, lg, dg), (this._hasCheckedHighContrastMode = !0);
          let i = this.getHighContrastMode();
          i === jn.BLACK_ON_WHITE
            ? n.add(_d, lg)
            : i === jn.WHITE_ON_BLACK && n.add(_d, dg);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(ce), h(H));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var _E = new _("cdk-dir-doc", { providedIn: "root", factory: wE });
function wE() {
  return p(H);
}
var DE =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function IE(t) {
  let e = t?.toLowerCase() || "";
  return e === "auto" && typeof navigator < "u" && navigator?.language
    ? DE.test(navigator.language)
      ? "rtl"
      : "ltr"
    : e === "rtl"
    ? "rtl"
    : "ltr";
}
var Ed = (() => {
  let e = class e {
    constructor(n) {
      if (((this.value = "ltr"), (this.change = new K()), n)) {
        let i = n.body ? n.body.dir : null,
          o = n.documentElement ? n.documentElement.dir : null;
        this.value = IE(i || o || "ltr");
      }
    }
    ngOnDestroy() {
      this.change.complete();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(h(_E, 8));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var xd = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = V({ type: e })),
    (e.ɵinj = $({}));
  let t = e;
  return t;
})();
function ME() {
  return !0;
}
var SE = new _("mat-sanity-checks", { providedIn: "root", factory: ME }),
  Ne = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._sanityChecks = i),
          (this._document = o),
          (this._hasDoneGlobalChecks = !1),
          n._applyBodyHighContrastModeCssClasses(),
          this._hasDoneGlobalChecks || (this._hasDoneGlobalChecks = !0);
      }
      _checkIsEnabled(n) {
        return ig()
          ? !1
          : typeof this._sanityChecks == "boolean"
          ? this._sanityChecks
          : !!this._sanityChecks[n];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(fg), h(SE, 8), h(H));
    }),
      (e.ɵmod = V({ type: e })),
      (e.ɵinj = $({ imports: [xd, xd] }));
    let t = e;
    return t;
  })();
var Ze = (function (t) {
    return (
      (t[(t.FADING_IN = 0)] = "FADING_IN"),
      (t[(t.VISIBLE = 1)] = "VISIBLE"),
      (t[(t.FADING_OUT = 2)] = "FADING_OUT"),
      (t[(t.HIDDEN = 3)] = "HIDDEN"),
      t
    );
  })(Ze || {}),
  Sd = class {
    constructor(e, r, n, i = !1) {
      (this._renderer = e),
        (this.element = r),
        (this.config = n),
        (this._animationForciblyDisabledThroughCss = i),
        (this.state = Ze.HIDDEN);
    }
    fadeOut() {
      this._renderer.fadeOutRipple(this);
    }
  },
  pg = dn({ passive: !0, capture: !0 }),
  Ad = class {
    constructor() {
      (this._events = new Map()),
        (this._delegateEventHandler = (e) => {
          let r = un(e);
          r &&
            this._events.get(e.type)?.forEach((n, i) => {
              (i === r || i.contains(r)) && n.forEach((o) => o.handleEvent(e));
            });
        });
    }
    addHandler(e, r, n, i) {
      let o = this._events.get(r);
      if (o) {
        let s = o.get(n);
        s ? s.add(i) : o.set(n, new Set([i]));
      } else
        this._events.set(r, new Map([[n, new Set([i])]])),
          e.runOutsideAngular(() => {
            document.addEventListener(r, this._delegateEventHandler, pg);
          });
    }
    removeHandler(e, r, n) {
      let i = this._events.get(e);
      if (!i) return;
      let o = i.get(r);
      o &&
        (o.delete(n),
        o.size === 0 && i.delete(r),
        i.size === 0 &&
          (this._events.delete(e),
          document.removeEventListener(e, this._delegateEventHandler, pg)));
    }
  },
  mg = { enterDuration: 225, exitDuration: 150 },
  AE = 800,
  gg = dn({ passive: !0, capture: !0 }),
  bg = ["mousedown", "touchstart"],
  vg = ["mouseup", "mouseleave", "touchend", "touchcancel"],
  Ni = class Ni {
    constructor(e, r, n, i) {
      (this._target = e),
        (this._ngZone = r),
        (this._platform = i),
        (this._isPointerDown = !1),
        (this._activeRipples = new Map()),
        (this._pointerUpEventsRegistered = !1),
        i.isBrowser && (this._containerElement = jt(n));
    }
    fadeInRipple(e, r, n = {}) {
      let i = (this._containerRect =
          this._containerRect ||
          this._containerElement.getBoundingClientRect()),
        o = g(g({}, mg), n.animation);
      n.centered && ((e = i.left + i.width / 2), (r = i.top + i.height / 2));
      let s = n.radius || RE(e, r, i),
        a = e - i.left,
        c = r - i.top,
        l = o.enterDuration,
        d = document.createElement("div");
      d.classList.add("mat-ripple-element"),
        (d.style.left = `${a - s}px`),
        (d.style.top = `${c - s}px`),
        (d.style.height = `${s * 2}px`),
        (d.style.width = `${s * 2}px`),
        n.color != null && (d.style.backgroundColor = n.color),
        (d.style.transitionDuration = `${l}ms`),
        this._containerElement.appendChild(d);
      let u = window.getComputedStyle(d),
        f = u.transitionProperty,
        m = u.transitionDuration,
        w =
          f === "none" ||
          m === "0s" ||
          m === "0s, 0s" ||
          (i.width === 0 && i.height === 0),
        E = new Sd(this, d, n, w);
      (d.style.transform = "scale3d(1, 1, 1)"),
        (E.state = Ze.FADING_IN),
        n.persistent || (this._mostRecentTransientRipple = E);
      let ne = null;
      return (
        !w &&
          (l || o.exitDuration) &&
          this._ngZone.runOutsideAngular(() => {
            let j = () => this._finishRippleTransition(E),
              ie = () => this._destroyRipple(E);
            d.addEventListener("transitionend", j),
              d.addEventListener("transitioncancel", ie),
              (ne = { onTransitionEnd: j, onTransitionCancel: ie });
          }),
        this._activeRipples.set(E, ne),
        (w || !l) && this._finishRippleTransition(E),
        E
      );
    }
    fadeOutRipple(e) {
      if (e.state === Ze.FADING_OUT || e.state === Ze.HIDDEN) return;
      let r = e.element,
        n = g(g({}, mg), e.config.animation);
      (r.style.transitionDuration = `${n.exitDuration}ms`),
        (r.style.opacity = "0"),
        (e.state = Ze.FADING_OUT),
        (e._animationForciblyDisabledThroughCss || !n.exitDuration) &&
          this._finishRippleTransition(e);
    }
    fadeOutAll() {
      this._getActiveRipples().forEach((e) => e.fadeOut());
    }
    fadeOutAllNonPersistent() {
      this._getActiveRipples().forEach((e) => {
        e.config.persistent || e.fadeOut();
      });
    }
    setupTriggerEvents(e) {
      let r = jt(e);
      !this._platform.isBrowser ||
        !r ||
        r === this._triggerElement ||
        (this._removeTriggerEvents(),
        (this._triggerElement = r),
        bg.forEach((n) => {
          Ni._eventManager.addHandler(this._ngZone, n, r, this);
        }));
    }
    handleEvent(e) {
      e.type === "mousedown"
        ? this._onMousedown(e)
        : e.type === "touchstart"
        ? this._onTouchStart(e)
        : this._onPointerUp(),
        this._pointerUpEventsRegistered ||
          (this._ngZone.runOutsideAngular(() => {
            vg.forEach((r) => {
              this._triggerElement.addEventListener(r, this, gg);
            });
          }),
          (this._pointerUpEventsRegistered = !0));
    }
    _finishRippleTransition(e) {
      e.state === Ze.FADING_IN
        ? this._startFadeOutTransition(e)
        : e.state === Ze.FADING_OUT && this._destroyRipple(e);
    }
    _startFadeOutTransition(e) {
      let r = e === this._mostRecentTransientRipple,
        { persistent: n } = e.config;
      (e.state = Ze.VISIBLE), !n && (!r || !this._isPointerDown) && e.fadeOut();
    }
    _destroyRipple(e) {
      let r = this._activeRipples.get(e) ?? null;
      this._activeRipples.delete(e),
        this._activeRipples.size || (this._containerRect = null),
        e === this._mostRecentTransientRipple &&
          (this._mostRecentTransientRipple = null),
        (e.state = Ze.HIDDEN),
        r !== null &&
          (e.element.removeEventListener("transitionend", r.onTransitionEnd),
          e.element.removeEventListener(
            "transitioncancel",
            r.onTransitionCancel
          )),
        e.element.remove();
    }
    _onMousedown(e) {
      let r = Dd(e),
        n =
          this._lastTouchStartEvent &&
          Date.now() < this._lastTouchStartEvent + AE;
      !this._target.rippleDisabled &&
        !r &&
        !n &&
        ((this._isPointerDown = !0),
        this.fadeInRipple(e.clientX, e.clientY, this._target.rippleConfig));
    }
    _onTouchStart(e) {
      if (!this._target.rippleDisabled && !Id(e)) {
        (this._lastTouchStartEvent = Date.now()), (this._isPointerDown = !0);
        let r = e.changedTouches;
        if (r)
          for (let n = 0; n < r.length; n++)
            this.fadeInRipple(
              r[n].clientX,
              r[n].clientY,
              this._target.rippleConfig
            );
      }
    }
    _onPointerUp() {
      this._isPointerDown &&
        ((this._isPointerDown = !1),
        this._getActiveRipples().forEach((e) => {
          let r =
            e.state === Ze.VISIBLE ||
            (e.config.terminateOnPointerUp && e.state === Ze.FADING_IN);
          !e.config.persistent && r && e.fadeOut();
        }));
    }
    _getActiveRipples() {
      return Array.from(this._activeRipples.keys());
    }
    _removeTriggerEvents() {
      let e = this._triggerElement;
      e &&
        (bg.forEach((r) => Ni._eventManager.removeHandler(r, e, this)),
        this._pointerUpEventsRegistered &&
          vg.forEach((r) => e.removeEventListener(r, this, gg)));
    }
  };
Ni._eventManager = new Ad();
var Rd = Ni;
function RE(t, e, r) {
  let n = Math.max(Math.abs(t - r.left), Math.abs(t - r.right)),
    i = Math.max(Math.abs(e - r.top), Math.abs(e - r.bottom));
  return Math.sqrt(n * n + i * i);
}
var js = new _("mat-ripple-global-options"),
  Bs = (() => {
    let e = class e {
      get disabled() {
        return this._disabled;
      }
      set disabled(n) {
        n && this.fadeOutAllNonPersistent(),
          (this._disabled = n),
          this._setupTriggerEventsIfEnabled();
      }
      get trigger() {
        return this._trigger || this._elementRef.nativeElement;
      }
      set trigger(n) {
        (this._trigger = n), this._setupTriggerEventsIfEnabled();
      }
      constructor(n, i, o, s, a) {
        (this._elementRef = n),
          (this._animationMode = a),
          (this.radius = 0),
          (this._disabled = !1),
          (this._isInitialized = !1),
          (this._globalOptions = s || {}),
          (this._rippleRenderer = new Rd(this, i, n, o));
      }
      ngOnInit() {
        (this._isInitialized = !0), this._setupTriggerEventsIfEnabled();
      }
      ngOnDestroy() {
        this._rippleRenderer._removeTriggerEvents();
      }
      fadeOutAll() {
        this._rippleRenderer.fadeOutAll();
      }
      fadeOutAllNonPersistent() {
        this._rippleRenderer.fadeOutAllNonPersistent();
      }
      get rippleConfig() {
        return {
          centered: this.centered,
          radius: this.radius,
          color: this.color,
          animation: g(
            g(
              g({}, this._globalOptions.animation),
              this._animationMode === "NoopAnimations"
                ? { enterDuration: 0, exitDuration: 0 }
                : {}
            ),
            this.animation
          ),
          terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
        };
      }
      get rippleDisabled() {
        return this.disabled || !!this._globalOptions.disabled;
      }
      _setupTriggerEventsIfEnabled() {
        !this.disabled &&
          this._isInitialized &&
          this._rippleRenderer.setupTriggerEvents(this.trigger);
      }
      launch(n, i = 0, o) {
        return typeof n == "number"
          ? this._rippleRenderer.fadeInRipple(
              n,
              i,
              g(g({}, this.rippleConfig), o)
            )
          : this._rippleRenderer.fadeInRipple(
              0,
              0,
              g(g({}, this.rippleConfig), n)
            );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(U), v(T), v(ce), v(js, 8), v(Rt, 8));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [
          ["", "mat-ripple", ""],
          ["", "matRipple", ""],
        ],
        hostAttrs: [1, "mat-ripple"],
        hostVars: 2,
        hostBindings: function (i, o) {
          i & 2 && be("mat-ripple-unbounded", o.unbounded);
        },
        inputs: {
          color: [N.None, "matRippleColor", "color"],
          unbounded: [N.None, "matRippleUnbounded", "unbounded"],
          centered: [N.None, "matRippleCentered", "centered"],
          radius: [N.None, "matRippleRadius", "radius"],
          animation: [N.None, "matRippleAnimation", "animation"],
          disabled: [N.None, "matRippleDisabled", "disabled"],
          trigger: [N.None, "matRippleTrigger", "trigger"],
        },
        exportAs: ["matRipple"],
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Dg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = V({ type: e })),
      (e.ɵinj = $({ imports: [Ne, Ne] }));
    let t = e;
    return t;
  })();
var yg = { capture: !0 },
  _g = ["focus", "click", "mouseenter", "touchstart"],
  Td = "mat-ripple-loader-uninitialized",
  Md = "mat-ripple-loader-class-name",
  wg = "mat-ripple-loader-centered",
  Ls = "mat-ripple-loader-disabled",
  Ig = (() => {
    let e = class e {
      constructor() {
        (this._document = p(H, { optional: !0 })),
          (this._animationMode = p(Rt, { optional: !0 })),
          (this._globalRippleOptions = p(js, { optional: !0 })),
          (this._platform = p(ce)),
          (this._ngZone = p(T)),
          (this._hosts = new Map()),
          (this._onInteraction = (n) => {
            if (!(n.target instanceof HTMLElement)) return;
            let o = n.target.closest(`[${Td}]`);
            o && this._createRipple(o);
          }),
          this._ngZone.runOutsideAngular(() => {
            for (let n of _g)
              this._document?.addEventListener(n, this._onInteraction, yg);
          });
      }
      ngOnDestroy() {
        let n = this._hosts.keys();
        for (let i of n) this.destroyRipple(i);
        for (let i of _g)
          this._document?.removeEventListener(i, this._onInteraction, yg);
      }
      configureRipple(n, i) {
        n.setAttribute(Td, ""),
          (i.className || !n.hasAttribute(Md)) &&
            n.setAttribute(Md, i.className || ""),
          i.centered && n.setAttribute(wg, ""),
          i.disabled && n.setAttribute(Ls, "");
      }
      getRipple(n) {
        return this._hosts.get(n) || this._createRipple(n);
      }
      setDisabled(n, i) {
        let o = this._hosts.get(n);
        if (o) {
          o.disabled = i;
          return;
        }
        i ? n.setAttribute(Ls, "") : n.removeAttribute(Ls);
      }
      _createRipple(n) {
        if (!this._document) return;
        let i = this._hosts.get(n);
        if (i) return i;
        n.querySelector(".mat-ripple")?.remove();
        let o = this._document.createElement("span");
        o.classList.add("mat-ripple", n.getAttribute(Md)), n.append(o);
        let s = new Bs(
          new U(o),
          this._ngZone,
          this._platform,
          this._globalRippleOptions ? this._globalRippleOptions : void 0,
          this._animationMode ? this._animationMode : void 0
        );
        return (
          (s._isInitialized = !0),
          (s.trigger = n),
          (s.centered = n.hasAttribute(wg)),
          (s.disabled = n.hasAttribute(Ls)),
          this.attachRipple(n, s),
          s
        );
      }
      attachRipple(n, i) {
        n.removeAttribute(Td), this._hosts.set(n, i);
      }
      destroyRipple(n) {
        let i = this._hosts.get(n);
        i && (i.ngOnDestroy(), this._hosts.delete(n));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var NE = ["*"];
var kE = new _("MAT_CARD_CONFIG"),
  Cg = (() => {
    let e = class e {
      constructor(n) {
        this.appearance = n?.appearance || "raised";
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(kE, 8));
    }),
      (e.ɵcmp = Y({
        type: e,
        selectors: [["mat-card"]],
        hostAttrs: [1, "mat-mdc-card", "mdc-card"],
        hostVars: 4,
        hostBindings: function (i, o) {
          i & 2 &&
            be("mat-mdc-card-outlined", o.appearance === "outlined")(
              "mdc-card--outlined",
              o.appearance === "outlined"
            );
        },
        inputs: { appearance: "appearance" },
        exportAs: ["matCard"],
        standalone: !0,
        features: [Ce],
        ngContentSelectors: NE,
        decls: 1,
        vars: 0,
        template: function (i, o) {
          i & 1 && (je(), Re(0));
        },
        styles: [
          '.mdc-card{display:flex;flex-direction:column;box-sizing:border-box}.mdc-card::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none;pointer-events:none}@media screen and (forced-colors: active){.mdc-card::after{border-color:CanvasText}}.mdc-card--outlined::after{border:none}.mdc-card__content{border-radius:inherit;height:100%}.mdc-card__media{position:relative;box-sizing:border-box;background-repeat:no-repeat;background-position:center;background-size:cover}.mdc-card__media::before{display:block;content:""}.mdc-card__media:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.mdc-card__media:last-child{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.mdc-card__media--square::before{margin-top:100%}.mdc-card__media--16-9::before{margin-top:56.25%}.mdc-card__media-content{position:absolute;top:0;right:0;bottom:0;left:0;box-sizing:border-box}.mdc-card__primary-action{display:flex;flex-direction:column;box-sizing:border-box;position:relative;outline:none;color:inherit;text-decoration:none;cursor:pointer;overflow:hidden}.mdc-card__primary-action:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.mdc-card__primary-action:last-child{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.mdc-card__actions{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;min-height:52px;padding:8px}.mdc-card__actions--full-bleed{padding:0}.mdc-card__action-buttons,.mdc-card__action-icons{display:flex;flex-direction:row;align-items:center;box-sizing:border-box}.mdc-card__action-icons{color:rgba(0, 0, 0, 0.6);flex-grow:1;justify-content:flex-end}.mdc-card__action-buttons+.mdc-card__action-icons{margin-left:16px;margin-right:0}[dir=rtl] .mdc-card__action-buttons+.mdc-card__action-icons,.mdc-card__action-buttons+.mdc-card__action-icons[dir=rtl]{margin-left:0;margin-right:16px}.mdc-card__action{display:inline-flex;flex-direction:row;align-items:center;box-sizing:border-box;justify-content:center;cursor:pointer;user-select:none}.mdc-card__action:focus{outline:none}.mdc-card__action--button{margin-left:0;margin-right:8px;padding:0 8px}[dir=rtl] .mdc-card__action--button,.mdc-card__action--button[dir=rtl]{margin-left:8px;margin-right:0}.mdc-card__action--button:last-child{margin-left:0;margin-right:0}[dir=rtl] .mdc-card__action--button:last-child,.mdc-card__action--button:last-child[dir=rtl]{margin-left:0;margin-right:0}.mdc-card__actions--full-bleed .mdc-card__action--button{justify-content:space-between;width:100%;height:auto;max-height:none;margin:0;padding:8px 16px;text-align:left}[dir=rtl] .mdc-card__actions--full-bleed .mdc-card__action--button,.mdc-card__actions--full-bleed .mdc-card__action--button[dir=rtl]{text-align:right}.mdc-card__action--icon{margin:-6px 0;padding:12px}.mdc-card__action--icon:not(:disabled){color:rgba(0, 0, 0, 0.6)}.mat-mdc-card{border-radius:var(--mdc-elevated-card-container-shape);background-color:var(--mdc-elevated-card-container-color);border-width:0;border-style:solid;border-color:var(--mdc-elevated-card-container-color);box-shadow:var(--mdc-elevated-card-container-elevation)}.mat-mdc-card .mdc-card::after{border-radius:var(--mdc-elevated-card-container-shape)}.mat-mdc-card-outlined{border-width:var(--mdc-outlined-card-outline-width);border-style:solid;border-color:var(--mdc-outlined-card-outline-color);border-radius:var(--mdc-outlined-card-container-shape);background-color:var(--mdc-outlined-card-container-color);box-shadow:var(--mdc-outlined-card-container-elevation)}.mat-mdc-card-outlined .mdc-card::after{border-radius:var(--mdc-outlined-card-container-shape)}.mat-mdc-card-title{font-family:var(--mat-card-title-text-font);line-height:var(--mat-card-title-text-line-height);font-size:var(--mat-card-title-text-size);letter-spacing:var(--mat-card-title-text-tracking);font-weight:var(--mat-card-title-text-weight)}.mat-mdc-card-subtitle{color:var(--mat-card-subtitle-text-color);font-family:var(--mat-card-subtitle-text-font);line-height:var(--mat-card-subtitle-text-line-height);font-size:var(--mat-card-subtitle-text-size);letter-spacing:var(--mat-card-subtitle-text-tracking);font-weight:var(--mat-card-subtitle-text-weight)}.mat-mdc-card{position:relative}.mat-mdc-card-title,.mat-mdc-card-subtitle{display:block;margin:0}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle{padding:16px 16px 0}.mat-mdc-card-header{display:flex;padding:16px 16px 0}.mat-mdc-card-content{display:block;padding:0 16px}.mat-mdc-card-content:first-child{padding-top:16px}.mat-mdc-card-content:last-child{padding-bottom:16px}.mat-mdc-card-title-group{display:flex;justify-content:space-between;width:100%}.mat-mdc-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;margin-bottom:16px;object-fit:cover}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title{line-height:normal}.mat-mdc-card-sm-image{width:80px;height:80px}.mat-mdc-card-md-image{width:112px;height:112px}.mat-mdc-card-lg-image{width:152px;height:152px}.mat-mdc-card-xl-image{width:240px;height:240px}.mat-mdc-card-subtitle~.mat-mdc-card-title,.mat-mdc-card-title~.mat-mdc-card-subtitle,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-title-group .mat-mdc-card-title,.mat-mdc-card-title-group .mat-mdc-card-subtitle{padding-top:0}.mat-mdc-card-content>:last-child:not(.mat-mdc-card-footer){margin-bottom:0}.mat-mdc-card-actions-align-end{justify-content:flex-end}',
        ],
        encapsulation: 2,
        changeDetection: 0,
      }));
    let t = e;
    return t;
  })();
var Eg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = V({ type: e })),
    (e.ɵinj = $({ imports: [Ne, ls, Ne] }));
  let t = e;
  return t;
})();
var FE = () => ["/projects"],
  xg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵcmp = Y({
        type: e,
        selectors: [["app-about"]],
        decls: 23,
        vars: 2,
        consts: [
          [1, "main-container"],
          ["src", "../assets/about.jpg", 1, "image-container"],
          [1, "card-position"],
          [1, "card-container"],
          [2, "text-align", "center"],
          [1, "button-style", 3, "routerLink"],
          [2, "color", "rgb(89, 119, 168)"],
        ],
        template: function (i, o) {
          i & 1 &&
            (R(0, "div", 0),
            de(1, "img", 1),
            R(2, "div", 2)(3, "mat-card", 3)(4, "div", 4)(5, "h2"),
            G(6, "My Story"),
            P(),
            R(7, "p"),
            G(8, "Engineer by profession, Runner by heart.\u2764\uFE0F"),
            P(),
            R(9, "h3"),
            G(10, "Technologies"),
            P()(),
            R(11, "ul")(12, "li"),
            G(13, "Angular | React"),
            P(),
            R(14, "li"),
            G(15, "Java | Spring Boot | Microservices"),
            P(),
            R(16, "li"),
            G(17, "Jasmine/Karma | jest | Mockito | Junit"),
            P(),
            R(18, "li"),
            G(19, "Kafka, Camunda, Gitlab, Jenkins"),
            P()(),
            R(20, "button", 5)(21, "span", 6),
            G(22, "Know More"),
            P()()()()()),
            i & 2 && (fe(20), Ae("routerLink", rn(1, FE)));
        },
        dependencies: [Cr, Cg],
        styles: [
          ".card-position[_ngcontent-%COMP%]{position:absolute;top:30%;left:10%}.card-container[_ngcontent-%COMP%]{width:45rem;height:30rem;padding:2rem}.button-style[_ngcontent-%COMP%]{border-radius:2rem;width:10rem;height:3rem;border:1px solid rgb(89,119,168);margin-left:15rem;margin-top:2rem;cursor:pointer}",
        ],
      }));
    let t = e;
    return t;
  })();
var Tg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Y({
      type: e,
      selectors: [["app-projects"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (R(0, "p"), G(1, "projects works!"), P());
      },
    }));
  let t = e;
  return t;
})();
var Mg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Y({
      type: e,
      selectors: [["app-contact"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (R(0, "p"), G(1, "contact works!"), P());
      },
    }));
  let t = e;
  return t;
})();
var PE = [
    { path: "", component: md },
    { path: "home", component: md },
    { path: "about", component: xg },
    { path: "projects", component: Tg },
    { path: "contact", component: Mg },
  ],
  Sg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = V({ type: e })),
      (e.ɵinj = $({ imports: [hd.forRoot(PE), hd] }));
    let t = e;
    return t;
  })();
var LE = 20,
  Nd = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._platform = n),
          (this._change = new B()),
          (this._changeListener = (s) => {
            this._change.next(s);
          }),
          (this._document = o),
          i.runOutsideAngular(() => {
            if (n.isBrowser) {
              let s = this._getWindow();
              s.addEventListener("resize", this._changeListener),
                s.addEventListener("orientationchange", this._changeListener);
            }
            this.change().subscribe(() => (this._viewportSize = null));
          });
      }
      ngOnDestroy() {
        if (this._platform.isBrowser) {
          let n = this._getWindow();
          n.removeEventListener("resize", this._changeListener),
            n.removeEventListener("orientationchange", this._changeListener);
        }
        this._change.complete();
      }
      getViewportSize() {
        this._viewportSize || this._updateViewportSize();
        let n = {
          width: this._viewportSize.width,
          height: this._viewportSize.height,
        };
        return this._platform.isBrowser || (this._viewportSize = null), n;
      }
      getViewportRect() {
        let n = this.getViewportScrollPosition(),
          { width: i, height: o } = this.getViewportSize();
        return {
          top: n.top,
          left: n.left,
          bottom: n.top + o,
          right: n.left + i,
          height: o,
          width: i,
        };
      }
      getViewportScrollPosition() {
        if (!this._platform.isBrowser) return { top: 0, left: 0 };
        let n = this._document,
          i = this._getWindow(),
          o = n.documentElement,
          s = o.getBoundingClientRect(),
          a = -s.top || n.body.scrollTop || i.scrollY || o.scrollTop || 0,
          c = -s.left || n.body.scrollLeft || i.scrollX || o.scrollLeft || 0;
        return { top: a, left: c };
      }
      change(n = LE) {
        return n > 0 ? this._change.pipe(oa(n)) : this._change;
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _updateViewportSize() {
        let n = this._getWindow();
        this._viewportSize = this._platform.isBrowser
          ? { width: n.innerWidth, height: n.innerHeight }
          : { width: 0, height: 0 };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(ce), h(T), h(H, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var kg = ["*"],
  BE = ["tabListContainer"],
  VE = ["tabList"],
  UE = ["tabListInner"],
  $E = ["nextPaginator"],
  HE = ["previousPaginator"];
var zE = ["mat-tab-nav-bar", ""],
  WE = ["mat-tab-link", ""];
var kd = "mdc-tab-indicator--active",
  Ag = "mdc-tab-indicator--no-transition",
  Fd = class {
    constructor(e) {
      this._items = e;
    }
    hide() {
      this._items.forEach((e) => e.deactivateInkBar());
    }
    alignToElement(e) {
      let r = this._items.find((i) => i.elementRef.nativeElement === e),
        n = this._currentItem;
      if (r !== n && (n?.deactivateInkBar(), r)) {
        let i = n?.elementRef.nativeElement.getBoundingClientRect?.();
        r.activateInkBar(i), (this._currentItem = r);
      }
    }
  },
  GE = (() => {
    let e = class e {
      constructor() {
        (this._elementRef = p(U)), (this._fitToContent = !1);
      }
      get fitInkBarToContent() {
        return this._fitToContent;
      }
      set fitInkBarToContent(n) {
        this._fitToContent !== n &&
          ((this._fitToContent = n),
          this._inkBarElement && this._appendInkBarElement());
      }
      activateInkBar(n) {
        let i = this._elementRef.nativeElement;
        if (!n || !i.getBoundingClientRect || !this._inkBarContentElement) {
          i.classList.add(kd);
          return;
        }
        let o = i.getBoundingClientRect(),
          s = n.width / o.width,
          a = n.left - o.left;
        i.classList.add(Ag),
          this._inkBarContentElement.style.setProperty(
            "transform",
            `translateX(${a}px) scaleX(${s})`
          ),
          i.getBoundingClientRect(),
          i.classList.remove(Ag),
          i.classList.add(kd),
          this._inkBarContentElement.style.setProperty("transform", "");
      }
      deactivateInkBar() {
        this._elementRef.nativeElement.classList.remove(kd);
      }
      ngOnInit() {
        this._createInkBarElement();
      }
      ngOnDestroy() {
        this._inkBarElement?.remove(),
          (this._inkBarElement = this._inkBarContentElement = null);
      }
      _createInkBarElement() {
        let n = this._elementRef.nativeElement.ownerDocument || document,
          i = (this._inkBarElement = n.createElement("span")),
          o = (this._inkBarContentElement = n.createElement("span"));
        (i.className = "mdc-tab-indicator"),
          (o.className =
            "mdc-tab-indicator__content mdc-tab-indicator__content--underline"),
          i.appendChild(this._inkBarContentElement),
          this._appendInkBarElement();
      }
      _appendInkBarElement() {
        this._inkBarElement;
        let n = this._fitToContent
          ? this._elementRef.nativeElement.querySelector(".mdc-tab__content")
          : this._elementRef.nativeElement;
        n.appendChild(this._inkBarElement);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = le({
        type: e,
        inputs: {
          fitInkBarToContent: [
            N.HasDecoratorInputTransform,
            "fitInkBarToContent",
            "fitInkBarToContent",
            hr,
          ],
        },
        features: [ge],
      }));
    let t = e;
    return t;
  })();
var Rg = dn({ passive: !0 }),
  qE = 650,
  ZE = 100,
  QE = (() => {
    let e = class e {
      get selectedIndex() {
        return this._selectedIndex;
      }
      set selectedIndex(n) {
        let i = isNaN(n) ? 0 : n;
        this._selectedIndex != i &&
          ((this._selectedIndexChanged = !0),
          (this._selectedIndex = i),
          this._keyManager && this._keyManager.updateActiveItem(i));
      }
      constructor(n, i, o, s, a, c, l) {
        (this._elementRef = n),
          (this._changeDetectorRef = i),
          (this._viewportRuler = o),
          (this._dir = s),
          (this._ngZone = a),
          (this._platform = c),
          (this._animationMode = l),
          (this._scrollDistance = 0),
          (this._selectedIndexChanged = !1),
          (this._destroyed = new B()),
          (this._showPaginationControls = !1),
          (this._disableScrollAfter = !0),
          (this._disableScrollBefore = !0),
          (this._stopScrolling = new B()),
          (this.disablePagination = !1),
          (this._selectedIndex = 0),
          (this.selectFocusedIndex = new K()),
          (this.indexFocused = new K()),
          a.runOutsideAngular(() => {
            $t(n.nativeElement, "mouseleave")
              .pipe(we(this._destroyed))
              .subscribe(() => {
                this._stopInterval();
              });
          });
      }
      ngAfterViewInit() {
        $t(this._previousPaginator.nativeElement, "touchstart", Rg)
          .pipe(we(this._destroyed))
          .subscribe(() => {
            this._handlePaginatorPress("before");
          }),
          $t(this._nextPaginator.nativeElement, "touchstart", Rg)
            .pipe(we(this._destroyed))
            .subscribe(() => {
              this._handlePaginatorPress("after");
            });
      }
      ngAfterContentInit() {
        let n = this._dir ? this._dir.change : y("ltr"),
          i = this._viewportRuler.change(150),
          o = () => {
            this.updatePagination(), this._alignInkBarToSelectedTab();
          };
        (this._keyManager = new Fs(this._items)
          .withHorizontalOrientation(this._getLayoutDirection())
          .withHomeAndEnd()
          .withWrap()
          .skipPredicate(() => !1)),
          this._keyManager.updateActiveItem(this._selectedIndex),
          this._ngZone.onStable.pipe(ye(1)).subscribe(o),
          so(n, i, this._items.changes, this._itemsResized())
            .pipe(we(this._destroyed))
            .subscribe(() => {
              this._ngZone.run(() => {
                Promise.resolve().then(() => {
                  (this._scrollDistance = Math.max(
                    0,
                    Math.min(this._getMaxScrollDistance(), this._scrollDistance)
                  )),
                    o();
                });
              }),
                this._keyManager.withHorizontalOrientation(
                  this._getLayoutDirection()
                );
            }),
          this._keyManager.change.subscribe((s) => {
            this.indexFocused.emit(s), this._setTabFocus(s);
          });
      }
      _itemsResized() {
        return typeof ResizeObserver != "function"
          ? ve
          : this._items.changes.pipe(
              It(this._items),
              _e(
                (n) =>
                  new M((i) =>
                    this._ngZone.runOutsideAngular(() => {
                      let o = new ResizeObserver((s) => i.next(s));
                      return (
                        n.forEach((s) => o.observe(s.elementRef.nativeElement)),
                        () => {
                          o.disconnect();
                        }
                      );
                    })
                  )
              ),
              vn(1),
              ae((n) =>
                n.some(
                  (i) => i.contentRect.width > 0 && i.contentRect.height > 0
                )
              )
            );
      }
      ngAfterContentChecked() {
        this._tabLabelCount != this._items.length &&
          (this.updatePagination(),
          (this._tabLabelCount = this._items.length),
          this._changeDetectorRef.markForCheck()),
          this._selectedIndexChanged &&
            (this._scrollToLabel(this._selectedIndex),
            this._checkScrollingControls(),
            this._alignInkBarToSelectedTab(),
            (this._selectedIndexChanged = !1),
            this._changeDetectorRef.markForCheck()),
          this._scrollDistanceChanged &&
            (this._updateTabScrollPosition(),
            (this._scrollDistanceChanged = !1),
            this._changeDetectorRef.markForCheck());
      }
      ngOnDestroy() {
        this._keyManager?.destroy(),
          this._destroyed.next(),
          this._destroyed.complete(),
          this._stopScrolling.complete();
      }
      _handleKeydown(n) {
        if (!Ns(n))
          switch (n.keyCode) {
            case 13:
            case 32:
              if (this.focusIndex !== this.selectedIndex) {
                let i = this._items.get(this.focusIndex);
                i &&
                  !i.disabled &&
                  (this.selectFocusedIndex.emit(this.focusIndex),
                  this._itemSelected(n));
              }
              break;
            default:
              this._keyManager.onKeydown(n);
          }
      }
      _onContentChanges() {
        let n = this._elementRef.nativeElement.textContent;
        n !== this._currentTextContent &&
          ((this._currentTextContent = n || ""),
          this._ngZone.run(() => {
            this.updatePagination(),
              this._alignInkBarToSelectedTab(),
              this._changeDetectorRef.markForCheck();
          }));
      }
      updatePagination() {
        this._checkPaginationEnabled(),
          this._checkScrollingControls(),
          this._updateTabScrollPosition();
      }
      get focusIndex() {
        return this._keyManager ? this._keyManager.activeItemIndex : 0;
      }
      set focusIndex(n) {
        !this._isValidIndex(n) ||
          this.focusIndex === n ||
          !this._keyManager ||
          this._keyManager.setActiveItem(n);
      }
      _isValidIndex(n) {
        return this._items ? !!this._items.toArray()[n] : !0;
      }
      _setTabFocus(n) {
        if (
          (this._showPaginationControls && this._scrollToLabel(n),
          this._items && this._items.length)
        ) {
          this._items.toArray()[n].focus();
          let i = this._tabListContainer.nativeElement;
          this._getLayoutDirection() == "ltr"
            ? (i.scrollLeft = 0)
            : (i.scrollLeft = i.scrollWidth - i.offsetWidth);
        }
      }
      _getLayoutDirection() {
        return this._dir && this._dir.value === "rtl" ? "rtl" : "ltr";
      }
      _updateTabScrollPosition() {
        if (this.disablePagination) return;
        let n = this.scrollDistance,
          i = this._getLayoutDirection() === "ltr" ? -n : n;
        (this._tabList.nativeElement.style.transform = `translateX(${Math.round(
          i
        )}px)`),
          (this._platform.TRIDENT || this._platform.EDGE) &&
            (this._tabListContainer.nativeElement.scrollLeft = 0);
      }
      get scrollDistance() {
        return this._scrollDistance;
      }
      set scrollDistance(n) {
        this._scrollTo(n);
      }
      _scrollHeader(n) {
        let i = this._tabListContainer.nativeElement.offsetWidth,
          o = ((n == "before" ? -1 : 1) * i) / 3;
        return this._scrollTo(this._scrollDistance + o);
      }
      _handlePaginatorClick(n) {
        this._stopInterval(), this._scrollHeader(n);
      }
      _scrollToLabel(n) {
        if (this.disablePagination) return;
        let i = this._items ? this._items.toArray()[n] : null;
        if (!i) return;
        let o = this._tabListContainer.nativeElement.offsetWidth,
          { offsetLeft: s, offsetWidth: a } = i.elementRef.nativeElement,
          c,
          l;
        this._getLayoutDirection() == "ltr"
          ? ((c = s), (l = c + a))
          : ((l = this._tabListInner.nativeElement.offsetWidth - s),
            (c = l - a));
        let d = this.scrollDistance,
          u = this.scrollDistance + o;
        c < d
          ? (this.scrollDistance -= d - c)
          : l > u && (this.scrollDistance += Math.min(l - u, c - d));
      }
      _checkPaginationEnabled() {
        if (this.disablePagination) this._showPaginationControls = !1;
        else {
          let n =
            this._tabListInner.nativeElement.scrollWidth >
            this._elementRef.nativeElement.offsetWidth;
          n || (this.scrollDistance = 0),
            n !== this._showPaginationControls &&
              this._changeDetectorRef.markForCheck(),
            (this._showPaginationControls = n);
        }
      }
      _checkScrollingControls() {
        this.disablePagination
          ? (this._disableScrollAfter = this._disableScrollBefore = !0)
          : ((this._disableScrollBefore = this.scrollDistance == 0),
            (this._disableScrollAfter =
              this.scrollDistance == this._getMaxScrollDistance()),
            this._changeDetectorRef.markForCheck());
      }
      _getMaxScrollDistance() {
        let n = this._tabListInner.nativeElement.scrollWidth,
          i = this._tabListContainer.nativeElement.offsetWidth;
        return n - i || 0;
      }
      _alignInkBarToSelectedTab() {
        let n =
            this._items && this._items.length
              ? this._items.toArray()[this.selectedIndex]
              : null,
          i = n ? n.elementRef.nativeElement : null;
        i ? this._inkBar.alignToElement(i) : this._inkBar.hide();
      }
      _stopInterval() {
        this._stopScrolling.next();
      }
      _handlePaginatorPress(n, i) {
        (i && i.button != null && i.button !== 0) ||
          (this._stopInterval(),
          Rr(qE, ZE)
            .pipe(we(so(this._stopScrolling, this._destroyed)))
            .subscribe(() => {
              let { maxScrollDistance: o, distance: s } = this._scrollHeader(n);
              (s === 0 || s >= o) && this._stopInterval();
            }));
      }
      _scrollTo(n) {
        if (this.disablePagination)
          return { maxScrollDistance: 0, distance: 0 };
        let i = this._getMaxScrollDistance();
        return (
          (this._scrollDistance = Math.max(0, Math.min(i, n))),
          (this._scrollDistanceChanged = !0),
          this._checkScrollingControls(),
          { maxScrollDistance: i, distance: this._scrollDistance }
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(U), v(rt), v(Nd), v(Ed, 8), v(T), v(ce), v(Rt, 8));
    }),
      (e.ɵdir = le({
        type: e,
        inputs: {
          disablePagination: [
            N.HasDecoratorInputTransform,
            "disablePagination",
            "disablePagination",
            ee,
          ],
          selectedIndex: [
            N.HasDecoratorInputTransform,
            "selectedIndex",
            "selectedIndex",
            hr,
          ],
        },
        outputs: {
          selectFocusedIndex: "selectFocusedIndex",
          indexFocused: "indexFocused",
        },
        features: [ge],
      }));
    let t = e;
    return t;
  })();
var YE = new _("MAT_TABS_CONFIG");
var KE = 0,
  Pd = (() => {
    let e = class e extends QE {
      get fitInkBarToContent() {
        return this._fitInkBarToContent.value;
      }
      set fitInkBarToContent(n) {
        this._fitInkBarToContent.next(n),
          this._changeDetectorRef.markForCheck();
      }
      get animationDuration() {
        return this._animationDuration;
      }
      set animationDuration(n) {
        let i = n + "";
        this._animationDuration = /^\d+$/.test(i) ? n + "ms" : i;
      }
      get backgroundColor() {
        return this._backgroundColor;
      }
      set backgroundColor(n) {
        let i = this._elementRef.nativeElement.classList;
        i.remove(
          "mat-tabs-with-background",
          `mat-background-${this.backgroundColor}`
        ),
          n && i.add("mat-tabs-with-background", `mat-background-${n}`),
          (this._backgroundColor = n);
      }
      constructor(n, i, o, s, a, c, l, d) {
        super(n, s, a, i, o, c, l),
          (this._fitInkBarToContent = new se(!1)),
          (this.stretchTabs = !0),
          (this.disableRipple = !1),
          (this.color = "primary"),
          (this.disablePagination =
            d && d.disablePagination != null ? d.disablePagination : !1),
          (this.fitInkBarToContent =
            d && d.fitInkBarToContent != null ? d.fitInkBarToContent : !1),
          (this.stretchTabs = d && d.stretchTabs != null ? d.stretchTabs : !0);
      }
      _itemSelected() {}
      ngAfterContentInit() {
        (this._inkBar = new Fd(this._items)),
          this._items.changes
            .pipe(It(null), we(this._destroyed))
            .subscribe(() => {
              this.updateActiveLink();
            }),
          super.ngAfterContentInit();
      }
      ngAfterViewInit() {
        this.tabPanel, super.ngAfterViewInit();
      }
      updateActiveLink() {
        if (!this._items) return;
        let n = this._items.toArray();
        for (let i = 0; i < n.length; i++)
          if (n[i].active) {
            (this.selectedIndex = i),
              this._changeDetectorRef.markForCheck(),
              this.tabPanel && (this.tabPanel._activeTabId = n[i].id);
            return;
          }
        (this.selectedIndex = -1), this._inkBar.hide();
      }
      _getRole() {
        return this.tabPanel
          ? "tablist"
          : this._elementRef.nativeElement.getAttribute("role");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        v(U),
        v(Ed, 8),
        v(T),
        v(rt),
        v(Nd),
        v(ce),
        v(Rt, 8),
        v(YE, 8)
      );
    }),
      (e.ɵcmp = Y({
        type: e,
        selectors: [["", "mat-tab-nav-bar", ""]],
        contentQueries: function (i, o, s) {
          if ((i & 1 && ur(s, Ld, 5), i & 2)) {
            let a;
            Be((a = Ve())) && (o._items = a);
          }
        },
        viewQuery: function (i, o) {
          if (
            (i & 1 && (tn(BE, 7), tn(VE, 7), tn(UE, 7), tn($E, 5), tn(HE, 5)),
            i & 2)
          ) {
            let s;
            Be((s = Ve())) && (o._tabListContainer = s.first),
              Be((s = Ve())) && (o._tabList = s.first),
              Be((s = Ve())) && (o._tabListInner = s.first),
              Be((s = Ve())) && (o._nextPaginator = s.first),
              Be((s = Ve())) && (o._previousPaginator = s.first);
          }
        },
        hostAttrs: [1, "mat-mdc-tab-nav-bar", "mat-mdc-tab-header"],
        hostVars: 17,
        hostBindings: function (i, o) {
          i & 2 &&
            (We("role", o._getRole()),
            ri("--mat-tab-animation-duration", o.animationDuration),
            be(
              "mat-mdc-tab-header-pagination-controls-enabled",
              o._showPaginationControls
            )("mat-mdc-tab-header-rtl", o._getLayoutDirection() == "rtl")(
              "mat-mdc-tab-nav-bar-stretch-tabs",
              o.stretchTabs
            )("mat-primary", o.color !== "warn" && o.color !== "accent")(
              "mat-accent",
              o.color === "accent"
            )("mat-warn", o.color === "warn")(
              "_mat-animation-noopable",
              o._animationMode === "NoopAnimations"
            ));
        },
        inputs: {
          fitInkBarToContent: [
            N.HasDecoratorInputTransform,
            "fitInkBarToContent",
            "fitInkBarToContent",
            ee,
          ],
          stretchTabs: [
            N.HasDecoratorInputTransform,
            "mat-stretch-tabs",
            "stretchTabs",
            ee,
          ],
          animationDuration: "animationDuration",
          backgroundColor: "backgroundColor",
          disableRipple: [
            N.HasDecoratorInputTransform,
            "disableRipple",
            "disableRipple",
            ee,
          ],
          color: "color",
          tabPanel: "tabPanel",
        },
        exportAs: ["matTabNavBar", "matTabNav"],
        standalone: !0,
        features: [ge, An, Ce],
        attrs: zE,
        ngContentSelectors: kg,
        decls: 13,
        vars: 8,
        consts: [
          [
            "aria-hidden",
            "true",
            "type",
            "button",
            "mat-ripple",
            "",
            "tabindex",
            "-1",
            1,
            "mat-mdc-tab-header-pagination",
            "mat-mdc-tab-header-pagination-before",
            3,
            "matRippleDisabled",
            "disabled",
            "click",
            "mousedown",
            "touchend",
          ],
          ["previousPaginator", ""],
          [1, "mat-mdc-tab-header-pagination-chevron"],
          [1, "mat-mdc-tab-link-container", 3, "keydown"],
          ["tabListContainer", ""],
          [1, "mat-mdc-tab-list", 3, "cdkObserveContent"],
          ["tabList", ""],
          [1, "mat-mdc-tab-links"],
          ["tabListInner", ""],
          [
            "aria-hidden",
            "true",
            "type",
            "button",
            "mat-ripple",
            "",
            "tabindex",
            "-1",
            1,
            "mat-mdc-tab-header-pagination",
            "mat-mdc-tab-header-pagination-after",
            3,
            "matRippleDisabled",
            "disabled",
            "mousedown",
            "click",
            "touchend",
          ],
          ["nextPaginator", ""],
        ],
        template: function (i, o) {
          i & 1 &&
            (je(),
            R(0, "button", 0, 1),
            gt("click", function () {
              return o._handlePaginatorClick("before");
            })("mousedown", function (a) {
              return o._handlePaginatorPress("before", a);
            })("touchend", function () {
              return o._stopInterval();
            }),
            de(2, "div", 2),
            P(),
            R(3, "div", 3, 4),
            gt("keydown", function (a) {
              return o._handleKeydown(a);
            }),
            R(5, "div", 5, 6),
            gt("cdkObserveContent", function () {
              return o._onContentChanges();
            }),
            R(7, "div", 7, 8),
            Re(9),
            P()()(),
            R(10, "button", 9, 10),
            gt("mousedown", function (a) {
              return o._handlePaginatorPress("after", a);
            })("click", function () {
              return o._handlePaginatorClick("after");
            })("touchend", function () {
              return o._stopInterval();
            }),
            de(12, "div", 2),
            P()),
            i & 2 &&
              (be(
                "mat-mdc-tab-header-pagination-disabled",
                o._disableScrollBefore
              ),
              Ae(
                "matRippleDisabled",
                o._disableScrollBefore || o.disableRipple
              )("disabled", o._disableScrollBefore || null),
              fe(10),
              be(
                "mat-mdc-tab-header-pagination-disabled",
                o._disableScrollAfter
              ),
              Ae("matRippleDisabled", o._disableScrollAfter || o.disableRipple)(
                "disabled",
                o._disableScrollAfter || null
              ));
        },
        dependencies: [Bs, og],
        styles: [
          ".mdc-tab{min-width:90px;padding-right:24px;padding-left:24px;display:flex;flex:1 0 auto;justify-content:center;box-sizing:border-box;margin:0;padding-top:0;padding-bottom:0;border:none;outline:none;text-align:center;white-space:nowrap;cursor:pointer;-webkit-appearance:none;z-index:1}.mdc-tab::-moz-focus-inner{padding:0;border:0}.mdc-tab[hidden]{display:none}.mdc-tab--min-width{flex:0 1 auto}.mdc-tab__content{display:flex;align-items:center;justify-content:center;height:inherit;pointer-events:none}.mdc-tab__text-label{transition:150ms color linear;display:inline-block;line-height:1;z-index:2}.mdc-tab__icon{transition:150ms color linear;z-index:2}.mdc-tab--stacked .mdc-tab__content{flex-direction:column;align-items:center;justify-content:center}.mdc-tab--stacked .mdc-tab__text-label{padding-top:6px;padding-bottom:4px}.mdc-tab--active .mdc-tab__text-label,.mdc-tab--active .mdc-tab__icon{transition-delay:100ms}.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label{padding-left:8px;padding-right:0}[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label,.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl]{padding-left:0;padding-right:8px}.mdc-tab-indicator{display:flex;position:absolute;top:0;left:0;justify-content:center;width:100%;height:100%;pointer-events:none;z-index:1}.mdc-tab-indicator__content{transform-origin:left;opacity:0}.mdc-tab-indicator__content--underline{align-self:flex-end;box-sizing:border-box;width:100%;border-top-style:solid}.mdc-tab-indicator__content--icon{align-self:center;margin:0 auto}.mdc-tab-indicator--active .mdc-tab-indicator__content{opacity:1}.mdc-tab-indicator .mdc-tab-indicator__content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-indicator--no-transition .mdc-tab-indicator__content{transition:none}.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition:150ms opacity linear}.mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition-delay:100ms}.mat-mdc-tab-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}.mat-mdc-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mdc-tab-indicator .mdc-tab-indicator__content{transition-duration:var(--mat-tab-animation-duration, 250ms)}.mat-mdc-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-mdc-tab-header-pagination::-moz-focus-inner{border:0}.mat-mdc-tab-header-pagination .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination{display:flex}.mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after{padding-left:4px}.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-pagination-after{padding-right:4px}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-mdc-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px;border-color:var(--mat-tab-header-pagination-icon-color)}.mat-mdc-tab-header-pagination-disabled{box-shadow:none;cursor:default;pointer-events:none}.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron{opacity:.4}.mat-mdc-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-mdc-tab-list{transition:none}._mat-animation-noopable span.mdc-tab-indicator__content,._mat-animation-noopable span.mdc-tab__text-label{transition:none}.mat-mdc-tab-links{display:flex;flex:1 0 auto}[mat-align-tabs=center]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:flex-end}.mat-mdc-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1;border-bottom-style:solid;border-bottom-width:var(--mat-tab-header-divider-height);border-bottom-color:var(--mat-tab-header-divider-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination{background-color:var(--mat-tab-header-with-background-background-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background.mat-primary>.mat-mdc-tab-link-container .mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background.mat-primary>.mat-mdc-tab-link-container .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background:not(.mat-primary)>.mat-mdc-tab-link-container .mat-mdc-tab-link:not(.mdc-tab--active) .mdc-tab__text-label{color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background:not(.mat-primary)>.mat-mdc-tab-link-container .mat-mdc-tab-link:not(.mdc-tab--active) .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-focus-indicator::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-focus-indicator::before{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mdc-tab__ripple::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mdc-tab__ripple::before{background-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron{color:var(--mat-tab-header-with-background-foreground-color)}",
        ],
        encapsulation: 2,
      }));
    let t = e;
    return t;
  })(),
  Ld = (() => {
    let e = class e extends GE {
      get active() {
        return this._isActive;
      }
      set active(n) {
        n !== this._isActive &&
          ((this._isActive = n), this._tabNavBar.updateActiveLink());
      }
      get rippleDisabled() {
        return (
          this.disabled ||
          this.disableRipple ||
          this._tabNavBar.disableRipple ||
          !!this.rippleConfig.disabled
        );
      }
      constructor(n, i, o, s, a, c) {
        super(),
          (this._tabNavBar = n),
          (this.elementRef = i),
          (this._focusMonitor = a),
          (this._destroyed = new B()),
          (this._isActive = !1),
          (this.disabled = !1),
          (this.disableRipple = !1),
          (this.tabIndex = 0),
          (this.id = `mat-tab-link-${KE++}`),
          (this.rippleConfig = o || {}),
          (this.tabIndex = parseInt(s) || 0),
          c === "NoopAnimations" &&
            (this.rippleConfig.animation = {
              enterDuration: 0,
              exitDuration: 0,
            }),
          n._fitInkBarToContent.pipe(we(this._destroyed)).subscribe((l) => {
            this.fitInkBarToContent = l;
          });
      }
      focus() {
        this.elementRef.nativeElement.focus();
      }
      ngAfterViewInit() {
        this._focusMonitor.monitor(this.elementRef);
      }
      ngOnDestroy() {
        this._destroyed.next(),
          this._destroyed.complete(),
          super.ngOnDestroy(),
          this._focusMonitor.stopMonitoring(this.elementRef);
      }
      _handleFocus() {
        this._tabNavBar.focusIndex = this._tabNavBar._items
          .toArray()
          .indexOf(this);
      }
      _handleKeydown(n) {
        (n.keyCode === 32 || n.keyCode === 13) &&
          (this.disabled
            ? n.preventDefault()
            : this._tabNavBar.tabPanel &&
              (n.keyCode === 32 && n.preventDefault(),
              this.elementRef.nativeElement.click()));
      }
      _getAriaControls() {
        return this._tabNavBar.tabPanel
          ? this._tabNavBar.tabPanel?.id
          : this.elementRef.nativeElement.getAttribute("aria-controls");
      }
      _getAriaSelected() {
        return this._tabNavBar.tabPanel
          ? this.active
            ? "true"
            : "false"
          : this.elementRef.nativeElement.getAttribute("aria-selected");
      }
      _getAriaCurrent() {
        return this.active && !this._tabNavBar.tabPanel ? "page" : null;
      }
      _getRole() {
        return this._tabNavBar.tabPanel
          ? "tab"
          : this.elementRef.nativeElement.getAttribute("role");
      }
      _getTabIndex() {
        return this._tabNavBar.tabPanel
          ? this._isActive && !this.disabled
            ? 0
            : -1
          : this.disabled
          ? -1
          : this.tabIndex;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        v(Pd),
        v(U),
        v(js, 8),
        Sn("tabindex"),
        v(Ps),
        v(Rt, 8)
      );
    }),
      (e.ɵcmp = Y({
        type: e,
        selectors: [
          ["", "mat-tab-link", ""],
          ["", "matTabLink", ""],
        ],
        hostAttrs: [
          1,
          "mdc-tab",
          "mat-mdc-tab-link",
          "mat-mdc-focus-indicator",
        ],
        hostVars: 11,
        hostBindings: function (i, o) {
          i & 1 &&
            gt("focus", function () {
              return o._handleFocus();
            })("keydown", function (a) {
              return o._handleKeydown(a);
            }),
            i & 2 &&
              (We("aria-controls", o._getAriaControls())(
                "aria-current",
                o._getAriaCurrent()
              )("aria-disabled", o.disabled)(
                "aria-selected",
                o._getAriaSelected()
              )("id", o.id)("tabIndex", o._getTabIndex())("role", o._getRole()),
              be("mat-mdc-tab-disabled", o.disabled)(
                "mdc-tab--active",
                o.active
              ));
        },
        inputs: {
          active: [N.HasDecoratorInputTransform, "active", "active", ee],
          disabled: [N.HasDecoratorInputTransform, "disabled", "disabled", ee],
          disableRipple: [
            N.HasDecoratorInputTransform,
            "disableRipple",
            "disableRipple",
            ee,
          ],
          tabIndex: [
            N.HasDecoratorInputTransform,
            "tabIndex",
            "tabIndex",
            (n) => (n == null ? 0 : hr(n)),
          ],
          id: "id",
        },
        exportAs: ["matTabLink"],
        standalone: !0,
        features: [ge, An, Ce],
        attrs: WE,
        ngContentSelectors: kg,
        decls: 5,
        vars: 2,
        consts: [
          [1, "mdc-tab__ripple"],
          [
            "mat-ripple",
            "",
            1,
            "mat-mdc-tab-ripple",
            3,
            "matRippleTrigger",
            "matRippleDisabled",
          ],
          [1, "mdc-tab__content"],
          [1, "mdc-tab__text-label"],
        ],
        template: function (i, o) {
          i & 1 &&
            (je(),
            de(0, "span", 0)(1, "div", 1),
            R(2, "span", 2)(3, "span", 3),
            Re(4),
            P()()),
            i & 2 &&
              (fe(),
              Ae("matRippleTrigger", o.elementRef.nativeElement)(
                "matRippleDisabled",
                o.rippleDisabled
              ));
        },
        dependencies: [Bs],
        styles: [
          '.mat-mdc-tab-link{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-decoration:none;background:none;font-family:var(--mat-tab-header-label-text-font);font-size:var(--mat-tab-header-label-text-size);letter-spacing:var(--mat-tab-header-label-text-tracking);line-height:var(--mat-tab-header-label-text-line-height);font-weight:var(--mat-tab-header-label-text-weight)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-color:var(--mdc-tab-indicator-active-indicator-color)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-top-width:var(--mdc-tab-indicator-active-indicator-height)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-radius:var(--mdc-tab-indicator-active-indicator-shape)}.mat-mdc-tab-link:not(.mdc-tab--stacked){height:var(--mdc-secondary-navigation-tab-container-height)}.mat-mdc-tab-link:not(:disabled).mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):hover.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):focus.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):active.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:disabled.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):hover:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):focus:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):active:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:disabled:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link.mdc-tab{flex-grow:0}.mat-mdc-tab-link:hover .mdc-tab__text-label{color:var(--mat-tab-header-inactive-hover-label-text-color)}.mat-mdc-tab-link:focus .mdc-tab__text-label{color:var(--mat-tab-header-inactive-focus-label-text-color)}.mat-mdc-tab-link.mdc-tab--active .mdc-tab__text-label{color:var(--mat-tab-header-active-label-text-color)}.mat-mdc-tab-link.mdc-tab--active .mdc-tab__ripple::before,.mat-mdc-tab-link.mdc-tab--active .mat-ripple-element{background-color:var(--mat-tab-header-active-ripple-color)}.mat-mdc-tab-link.mdc-tab--active:hover .mdc-tab__text-label{color:var(--mat-tab-header-active-hover-label-text-color)}.mat-mdc-tab-link.mdc-tab--active:hover .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-active-hover-indicator-color)}.mat-mdc-tab-link.mdc-tab--active:focus .mdc-tab__text-label{color:var(--mat-tab-header-active-focus-label-text-color)}.mat-mdc-tab-link.mdc-tab--active:focus .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-active-focus-indicator-color)}.mat-mdc-tab-link.mat-mdc-tab-disabled{opacity:.4;pointer-events:none}.mat-mdc-tab-link.mat-mdc-tab-disabled .mdc-tab__content{pointer-events:none}.mat-mdc-tab-link.mat-mdc-tab-disabled .mdc-tab__ripple::before,.mat-mdc-tab-link.mat-mdc-tab-disabled .mat-ripple-element{background-color:var(--mat-tab-header-disabled-ripple-color)}.mat-mdc-tab-link .mdc-tab__ripple::before{content:"";display:block;position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;pointer-events:none;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-tab-header-inactive-label-text-color);display:inline-flex;align-items:center}.mat-mdc-tab-link .mdc-tab__content{position:relative;pointer-events:auto}.mat-mdc-tab-link:hover .mdc-tab__ripple::before{opacity:.04}.mat-mdc-tab-link.cdk-program-focused .mdc-tab__ripple::before,.mat-mdc-tab-link.cdk-keyboard-focused .mdc-tab__ripple::before{opacity:.12}.mat-mdc-tab-link .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header.mat-mdc-tab-nav-bar-stretch-tabs .mat-mdc-tab-link{flex-grow:1}.mat-mdc-tab-link::before{margin:5px}@media(max-width: 599px){.mat-mdc-tab-link{min-width:72px}}',
        ],
        encapsulation: 2,
        changeDetection: 0,
      }));
    let t = e;
    return t;
  })();
var Og = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = V({ type: e })),
    (e.ɵinj = $({ imports: [Ne, Ne] }));
  let t = e;
  return t;
})();
var JE = ["*", [["mat-toolbar-row"]]],
  ex = ["*", "mat-toolbar-row"],
  tx = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["mat-toolbar-row"]],
        hostAttrs: [1, "mat-toolbar-row"],
        exportAs: ["matToolbarRow"],
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Fg = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._elementRef = n), (this._platform = i), (this._document = o);
      }
      ngAfterViewInit() {
        this._platform.isBrowser &&
          (this._checkToolbarMixedModes(),
          this._toolbarRows.changes.subscribe(() =>
            this._checkToolbarMixedModes()
          ));
      }
      _checkToolbarMixedModes() {
        this._toolbarRows.length;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(U), v(ce), v(H));
    }),
      (e.ɵcmp = Y({
        type: e,
        selectors: [["mat-toolbar"]],
        contentQueries: function (i, o, s) {
          if ((i & 1 && ur(s, tx, 5), i & 2)) {
            let a;
            Be((a = Ve())) && (o._toolbarRows = a);
          }
        },
        hostAttrs: [1, "mat-toolbar"],
        hostVars: 6,
        hostBindings: function (i, o) {
          i & 2 &&
            (Rn(o.color ? "mat-" + o.color : ""),
            be("mat-toolbar-multiple-rows", o._toolbarRows.length > 0)(
              "mat-toolbar-single-row",
              o._toolbarRows.length === 0
            ));
        },
        inputs: { color: "color" },
        exportAs: ["matToolbar"],
        standalone: !0,
        features: [Ce],
        ngContentSelectors: ex,
        decls: 2,
        vars: 0,
        template: function (i, o) {
          i & 1 && (je(JE), Re(0), Re(1, 1));
        },
        styles: [
          ".mat-toolbar{background:var(--mat-toolbar-container-background-color);color:var(--mat-toolbar-container-text-color)}.mat-toolbar,.mat-toolbar h1,.mat-toolbar h2,.mat-toolbar h3,.mat-toolbar h4,.mat-toolbar h5,.mat-toolbar h6{font-family:var(--mat-toolbar-title-text-font);font-size:var(--mat-toolbar-title-text-size);line-height:var(--mat-toolbar-title-text-line-height);font-weight:var(--mat-toolbar-title-text-weight);letter-spacing:var(--mat-toolbar-title-text-tracking);margin:0}.cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar .mat-form-field-underline,.mat-toolbar .mat-form-field-ripple,.mat-toolbar .mat-focused .mat-form-field-ripple{background-color:currentColor}.mat-toolbar .mat-form-field-label,.mat-toolbar .mat-focused .mat-form-field-label,.mat-toolbar .mat-select-value,.mat-toolbar .mat-select-arrow,.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow{color:inherit}.mat-toolbar .mat-input-element{caret-color:currentColor}.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed{--mdc-text-button-label-text-color:var(--mat-toolbar-container-text-color);--mdc-outlined-button-label-text-color:var(--mat-toolbar-container-text-color)}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-row,.mat-toolbar-single-row{height:var(--mat-toolbar-mobile-height)}}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%;min-height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:var(--mat-toolbar-mobile-height)}}",
        ],
        encapsulation: 2,
        changeDetection: 0,
      }));
    let t = e;
    return t;
  })();
var Pg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = V({ type: e })),
    (e.ɵinj = $({ imports: [Ne, Ne] }));
  let t = e;
  return t;
})();
var rx = ["*"],
  Vs;
function ix() {
  if (Vs === void 0 && ((Vs = null), typeof window < "u")) {
    let t = window;
    t.trustedTypes !== void 0 &&
      (Vs = t.trustedTypes.createPolicy("angular#components", {
        createHTML: (e) => e,
      }));
  }
  return Vs;
}
function ki(t) {
  return ix()?.createHTML(t) || t;
}
function Lg(t) {
  return Error(`Unable to find icon with the name "${t}"`);
}
function ox() {
  return Error(
    "Could not find HttpClient provider for use with Angular Material icons. Please include the HttpClientModule from @angular/common/http in your app imports."
  );
}
function jg(t) {
  return Error(
    `The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${t}".`
  );
}
function Bg(t) {
  return Error(
    `The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${t}".`
  );
}
var Bt = class {
    constructor(e, r, n) {
      (this.url = e), (this.svgText = r), (this.options = n);
    }
  },
  sx = (() => {
    let e = class e {
      constructor(n, i, o, s) {
        (this._httpClient = n),
          (this._sanitizer = i),
          (this._errorHandler = s),
          (this._svgIconConfigs = new Map()),
          (this._iconSetConfigs = new Map()),
          (this._cachedIconsByUrl = new Map()),
          (this._inProgressUrlFetches = new Map()),
          (this._fontCssClassesByAlias = new Map()),
          (this._resolvers = []),
          (this._defaultFontSetClass = ["material-icons", "mat-ligature-font"]),
          (this._document = o);
      }
      addSvgIcon(n, i, o) {
        return this.addSvgIconInNamespace("", n, i, o);
      }
      addSvgIconLiteral(n, i, o) {
        return this.addSvgIconLiteralInNamespace("", n, i, o);
      }
      addSvgIconInNamespace(n, i, o, s) {
        return this._addSvgIconConfig(n, i, new Bt(o, null, s));
      }
      addSvgIconResolver(n) {
        return this._resolvers.push(n), this;
      }
      addSvgIconLiteralInNamespace(n, i, o, s) {
        let a = this._sanitizer.sanitize(De.HTML, o);
        if (!a) throw Bg(o);
        let c = ki(a);
        return this._addSvgIconConfig(n, i, new Bt("", c, s));
      }
      addSvgIconSet(n, i) {
        return this.addSvgIconSetInNamespace("", n, i);
      }
      addSvgIconSetLiteral(n, i) {
        return this.addSvgIconSetLiteralInNamespace("", n, i);
      }
      addSvgIconSetInNamespace(n, i, o) {
        return this._addSvgIconSetConfig(n, new Bt(i, null, o));
      }
      addSvgIconSetLiteralInNamespace(n, i, o) {
        let s = this._sanitizer.sanitize(De.HTML, i);
        if (!s) throw Bg(i);
        let a = ki(s);
        return this._addSvgIconSetConfig(n, new Bt("", a, o));
      }
      registerFontClassAlias(n, i = n) {
        return this._fontCssClassesByAlias.set(n, i), this;
      }
      classNameForFontAlias(n) {
        return this._fontCssClassesByAlias.get(n) || n;
      }
      setDefaultFontSetClass(...n) {
        return (this._defaultFontSetClass = n), this;
      }
      getDefaultFontSetClass() {
        return this._defaultFontSetClass;
      }
      getSvgIconFromUrl(n) {
        let i = this._sanitizer.sanitize(De.RESOURCE_URL, n);
        if (!i) throw jg(n);
        let o = this._cachedIconsByUrl.get(i);
        return o
          ? y(Us(o))
          : this._loadSvgIconFromConfig(new Bt(n, null)).pipe(
              J((s) => this._cachedIconsByUrl.set(i, s)),
              C((s) => Us(s))
            );
      }
      getNamedSvgIcon(n, i = "") {
        let o = Vg(i, n),
          s = this._svgIconConfigs.get(o);
        if (s) return this._getSvgFromConfig(s);
        if (((s = this._getIconConfigFromResolvers(i, n)), s))
          return this._svgIconConfigs.set(o, s), this._getSvgFromConfig(s);
        let a = this._iconSetConfigs.get(i);
        return a ? this._getSvgFromIconSetConfigs(n, a) : Vt(Lg(o));
      }
      ngOnDestroy() {
        (this._resolvers = []),
          this._svgIconConfigs.clear(),
          this._iconSetConfigs.clear(),
          this._cachedIconsByUrl.clear();
      }
      _getSvgFromConfig(n) {
        return n.svgText
          ? y(Us(this._svgElementFromConfig(n)))
          : this._loadSvgIconFromConfig(n).pipe(C((i) => Us(i)));
      }
      _getSvgFromIconSetConfigs(n, i) {
        let o = this._extractIconWithNameFromAnySet(n, i);
        if (o) return y(o);
        let s = i
          .filter((a) => !a.svgText)
          .map((a) =>
            this._loadSvgIconSetFromConfig(a).pipe(
              ct((c) => {
                let d = `Loading icon set URL: ${this._sanitizer.sanitize(
                  De.RESOURCE_URL,
                  a.url
                )} failed: ${c.message}`;
                return this._errorHandler.handleError(new Error(d)), y(null);
              })
            )
          );
        return ia(s).pipe(
          C(() => {
            let a = this._extractIconWithNameFromAnySet(n, i);
            if (!a) throw Lg(n);
            return a;
          })
        );
      }
      _extractIconWithNameFromAnySet(n, i) {
        for (let o = i.length - 1; o >= 0; o--) {
          let s = i[o];
          if (s.svgText && s.svgText.toString().indexOf(n) > -1) {
            let a = this._svgElementFromConfig(s),
              c = this._extractSvgIconFromSet(a, n, s.options);
            if (c) return c;
          }
        }
        return null;
      }
      _loadSvgIconFromConfig(n) {
        return this._fetchIcon(n).pipe(
          J((i) => (n.svgText = i)),
          C(() => this._svgElementFromConfig(n))
        );
      }
      _loadSvgIconSetFromConfig(n) {
        return n.svgText
          ? y(null)
          : this._fetchIcon(n).pipe(J((i) => (n.svgText = i)));
      }
      _extractSvgIconFromSet(n, i, o) {
        let s = n.querySelector(`[id="${i}"]`);
        if (!s) return null;
        let a = s.cloneNode(!0);
        if ((a.removeAttribute("id"), a.nodeName.toLowerCase() === "svg"))
          return this._setSvgAttributes(a, o);
        if (a.nodeName.toLowerCase() === "symbol")
          return this._setSvgAttributes(this._toSvgElement(a), o);
        let c = this._svgElementFromString(ki("<svg></svg>"));
        return c.appendChild(a), this._setSvgAttributes(c, o);
      }
      _svgElementFromString(n) {
        let i = this._document.createElement("DIV");
        i.innerHTML = n;
        let o = i.querySelector("svg");
        if (!o) throw Error("<svg> tag not found");
        return o;
      }
      _toSvgElement(n) {
        let i = this._svgElementFromString(ki("<svg></svg>")),
          o = n.attributes;
        for (let s = 0; s < o.length; s++) {
          let { name: a, value: c } = o[s];
          a !== "id" && i.setAttribute(a, c);
        }
        for (let s = 0; s < n.childNodes.length; s++)
          n.childNodes[s].nodeType === this._document.ELEMENT_NODE &&
            i.appendChild(n.childNodes[s].cloneNode(!0));
        return i;
      }
      _setSvgAttributes(n, i) {
        return (
          n.setAttribute("fit", ""),
          n.setAttribute("height", "100%"),
          n.setAttribute("width", "100%"),
          n.setAttribute("preserveAspectRatio", "xMidYMid meet"),
          n.setAttribute("focusable", "false"),
          i && i.viewBox && n.setAttribute("viewBox", i.viewBox),
          n
        );
      }
      _fetchIcon(n) {
        let { url: i, options: o } = n,
          s = o?.withCredentials ?? !1;
        if (!this._httpClient) throw ox();
        if (i == null) throw Error(`Cannot fetch icon from URL "${i}".`);
        let a = this._sanitizer.sanitize(De.RESOURCE_URL, i);
        if (!a) throw jg(i);
        let c = this._inProgressUrlFetches.get(a);
        if (c) return c;
        let l = this._httpClient
          .get(a, { responseType: "text", withCredentials: s })
          .pipe(
            C((d) => ki(d)),
            zt(() => this._inProgressUrlFetches.delete(a)),
            da()
          );
        return this._inProgressUrlFetches.set(a, l), l;
      }
      _addSvgIconConfig(n, i, o) {
        return this._svgIconConfigs.set(Vg(n, i), o), this;
      }
      _addSvgIconSetConfig(n, i) {
        let o = this._iconSetConfigs.get(n);
        return o ? o.push(i) : this._iconSetConfigs.set(n, [i]), this;
      }
      _svgElementFromConfig(n) {
        if (!n.svgElement) {
          let i = this._svgElementFromString(n.svgText);
          this._setSvgAttributes(i, n.options), (n.svgElement = i);
        }
        return n.svgElement;
      }
      _getIconConfigFromResolvers(n, i) {
        for (let o = 0; o < this._resolvers.length; o++) {
          let s = this._resolvers[o](i, n);
          if (s)
            return ax(s) ? new Bt(s.url, null, s.options) : new Bt(s, null);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(h(rm, 8), h(xl), h(H, 8), h(Se));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Us(t) {
  return t.cloneNode(!0);
}
function Vg(t, e) {
  return t + ":" + e;
}
function ax(t) {
  return !!(t.url && t.options);
}
var cx = new _("MAT_ICON_DEFAULT_OPTIONS"),
  lx = new _("mat-icon-location", { providedIn: "root", factory: dx });
function dx() {
  let t = p(H),
    e = t ? t.location : null;
  return { getPathname: () => (e ? e.pathname + e.search : "") };
}
var Ug = [
    "clip-path",
    "color-profile",
    "src",
    "cursor",
    "fill",
    "filter",
    "marker",
    "marker-start",
    "marker-mid",
    "marker-end",
    "mask",
    "stroke",
  ],
  ux = Ug.map((t) => `[${t}]`).join(", "),
  fx = /^url\(['"]?#(.*?)['"]?\)$/,
  $s = (() => {
    let e = class e {
      get color() {
        return this._color || this._defaultColor;
      }
      set color(n) {
        this._color = n;
      }
      get svgIcon() {
        return this._svgIcon;
      }
      set svgIcon(n) {
        n !== this._svgIcon &&
          (n
            ? this._updateSvgIcon(n)
            : this._svgIcon && this._clearSvgElement(),
          (this._svgIcon = n));
      }
      get fontSet() {
        return this._fontSet;
      }
      set fontSet(n) {
        let i = this._cleanupFontValue(n);
        i !== this._fontSet &&
          ((this._fontSet = i), this._updateFontIconClasses());
      }
      get fontIcon() {
        return this._fontIcon;
      }
      set fontIcon(n) {
        let i = this._cleanupFontValue(n);
        i !== this._fontIcon &&
          ((this._fontIcon = i), this._updateFontIconClasses());
      }
      constructor(n, i, o, s, a, c) {
        (this._elementRef = n),
          (this._iconRegistry = i),
          (this._location = s),
          (this._errorHandler = a),
          (this.inline = !1),
          (this._previousFontSetClass = []),
          (this._currentIconFetch = Z.EMPTY),
          c &&
            (c.color && (this.color = this._defaultColor = c.color),
            c.fontSet && (this.fontSet = c.fontSet)),
          o || n.nativeElement.setAttribute("aria-hidden", "true");
      }
      _splitIconName(n) {
        if (!n) return ["", ""];
        let i = n.split(":");
        switch (i.length) {
          case 1:
            return ["", i[0]];
          case 2:
            return i;
          default:
            throw Error(`Invalid icon name: "${n}"`);
        }
      }
      ngOnInit() {
        this._updateFontIconClasses();
      }
      ngAfterViewChecked() {
        let n = this._elementsWithExternalReferences;
        if (n && n.size) {
          let i = this._location.getPathname();
          i !== this._previousPath &&
            ((this._previousPath = i), this._prependPathToReferences(i));
        }
      }
      ngOnDestroy() {
        this._currentIconFetch.unsubscribe(),
          this._elementsWithExternalReferences &&
            this._elementsWithExternalReferences.clear();
      }
      _usingFontIcon() {
        return !this.svgIcon;
      }
      _setSvgElement(n) {
        this._clearSvgElement();
        let i = this._location.getPathname();
        (this._previousPath = i),
          this._cacheChildrenWithExternalReferences(n),
          this._prependPathToReferences(i),
          this._elementRef.nativeElement.appendChild(n);
      }
      _clearSvgElement() {
        let n = this._elementRef.nativeElement,
          i = n.childNodes.length;
        for (
          this._elementsWithExternalReferences &&
          this._elementsWithExternalReferences.clear();
          i--;

        ) {
          let o = n.childNodes[i];
          (o.nodeType !== 1 || o.nodeName.toLowerCase() === "svg") &&
            o.remove();
        }
      }
      _updateFontIconClasses() {
        if (!this._usingFontIcon()) return;
        let n = this._elementRef.nativeElement,
          i = (
            this.fontSet
              ? this._iconRegistry
                  .classNameForFontAlias(this.fontSet)
                  .split(/ +/)
              : this._iconRegistry.getDefaultFontSetClass()
          ).filter((o) => o.length > 0);
        this._previousFontSetClass.forEach((o) => n.classList.remove(o)),
          i.forEach((o) => n.classList.add(o)),
          (this._previousFontSetClass = i),
          this.fontIcon !== this._previousFontIconClass &&
            !i.includes("mat-ligature-font") &&
            (this._previousFontIconClass &&
              n.classList.remove(this._previousFontIconClass),
            this.fontIcon && n.classList.add(this.fontIcon),
            (this._previousFontIconClass = this.fontIcon));
      }
      _cleanupFontValue(n) {
        return typeof n == "string" ? n.trim().split(" ")[0] : n;
      }
      _prependPathToReferences(n) {
        let i = this._elementsWithExternalReferences;
        i &&
          i.forEach((o, s) => {
            o.forEach((a) => {
              s.setAttribute(a.name, `url('${n}#${a.value}')`);
            });
          });
      }
      _cacheChildrenWithExternalReferences(n) {
        let i = n.querySelectorAll(ux),
          o = (this._elementsWithExternalReferences =
            this._elementsWithExternalReferences || new Map());
        for (let s = 0; s < i.length; s++)
          Ug.forEach((a) => {
            let c = i[s],
              l = c.getAttribute(a),
              d = l ? l.match(fx) : null;
            if (d) {
              let u = o.get(c);
              u || ((u = []), o.set(c, u)), u.push({ name: a, value: d[1] });
            }
          });
      }
      _updateSvgIcon(n) {
        if (
          ((this._svgNamespace = null),
          (this._svgName = null),
          this._currentIconFetch.unsubscribe(),
          n)
        ) {
          let [i, o] = this._splitIconName(n);
          i && (this._svgNamespace = i),
            o && (this._svgName = o),
            (this._currentIconFetch = this._iconRegistry
              .getNamedSvgIcon(o, i)
              .pipe(ye(1))
              .subscribe(
                (s) => this._setSvgElement(s),
                (s) => {
                  let a = `Error retrieving icon ${i}:${o}! ${s.message}`;
                  this._errorHandler.handleError(new Error(a));
                }
              ));
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        v(U),
        v(sx),
        Sn("aria-hidden"),
        v(lx),
        v(Se),
        v(cx, 8)
      );
    }),
      (e.ɵcmp = Y({
        type: e,
        selectors: [["mat-icon"]],
        hostAttrs: ["role", "img", 1, "mat-icon", "notranslate"],
        hostVars: 10,
        hostBindings: function (i, o) {
          i & 2 &&
            (We("data-mat-icon-type", o._usingFontIcon() ? "font" : "svg")(
              "data-mat-icon-name",
              o._svgName || o.fontIcon
            )("data-mat-icon-namespace", o._svgNamespace || o.fontSet)(
              "fontIcon",
              o._usingFontIcon() ? o.fontIcon : null
            ),
            Rn(o.color ? "mat-" + o.color : ""),
            be("mat-icon-inline", o.inline)(
              "mat-icon-no-color",
              o.color !== "primary" &&
                o.color !== "accent" &&
                o.color !== "warn"
            ));
        },
        inputs: {
          color: "color",
          inline: [N.HasDecoratorInputTransform, "inline", "inline", ee],
          svgIcon: "svgIcon",
          fontSet: "fontSet",
          fontIcon: "fontIcon",
        },
        exportAs: ["matIcon"],
        standalone: !0,
        features: [ge, Ce],
        ngContentSelectors: rx,
        decls: 1,
        vars: 0,
        template: function (i, o) {
          i & 1 && (je(), Re(0));
        },
        styles: [
          "mat-icon,mat-icon.mat-primary,mat-icon.mat-accent,mat-icon.mat-warn{color:var(--mat-icon-color)}.mat-icon{-webkit-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px;overflow:hidden}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}.mat-icon.mat-ligature-font[fontIcon]::before{content:attr(fontIcon)}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}",
        ],
        encapsulation: 2,
        changeDetection: 0,
      }));
    let t = e;
    return t;
  })();
var px =
  ".cdk-high-contrast-active .mat-mdc-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-unelevated-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-raised-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-outlined-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-icon-button{outline:solid 1px}";
var mx = ["mat-icon-button", ""],
  gx = ["*"];
var bx = new _("MAT_BUTTON_CONFIG");
var vx = [
    { attribute: "mat-button", mdcClasses: ["mdc-button", "mat-mdc-button"] },
    {
      attribute: "mat-flat-button",
      mdcClasses: [
        "mdc-button",
        "mdc-button--unelevated",
        "mat-mdc-unelevated-button",
      ],
    },
    {
      attribute: "mat-raised-button",
      mdcClasses: ["mdc-button", "mdc-button--raised", "mat-mdc-raised-button"],
    },
    {
      attribute: "mat-stroked-button",
      mdcClasses: [
        "mdc-button",
        "mdc-button--outlined",
        "mat-mdc-outlined-button",
      ],
    },
    { attribute: "mat-fab", mdcClasses: ["mdc-fab", "mat-mdc-fab"] },
    {
      attribute: "mat-mini-fab",
      mdcClasses: ["mdc-fab", "mdc-fab--mini", "mat-mdc-mini-fab"],
    },
    {
      attribute: "mat-icon-button",
      mdcClasses: ["mdc-icon-button", "mat-mdc-icon-button"],
    },
  ],
  yx = (() => {
    let e = class e {
      get ripple() {
        return this._rippleLoader?.getRipple(this._elementRef.nativeElement);
      }
      set ripple(n) {
        this._rippleLoader?.attachRipple(this._elementRef.nativeElement, n);
      }
      get disableRipple() {
        return this._disableRipple;
      }
      set disableRipple(n) {
        (this._disableRipple = n), this._updateRippleDisabled();
      }
      get disabled() {
        return this._disabled;
      }
      set disabled(n) {
        (this._disabled = n), this._updateRippleDisabled();
      }
      constructor(n, i, o, s) {
        (this._elementRef = n),
          (this._platform = i),
          (this._ngZone = o),
          (this._animationMode = s),
          (this._focusMonitor = p(Ps)),
          (this._rippleLoader = p(Ig)),
          (this._isFab = !1),
          (this._disableRipple = !1),
          (this._disabled = !1);
        let a = p(bx, { optional: !0 }),
          c = n.nativeElement,
          l = c.classList;
        (this.disabledInteractive = a?.disabledInteractive ?? !1),
          this._rippleLoader?.configureRipple(c, {
            className: "mat-mdc-button-ripple",
          });
        for (let { attribute: d, mdcClasses: u } of vx)
          c.hasAttribute(d) && l.add(...u);
      }
      ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, !0);
      }
      ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef),
          this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
      }
      focus(n = "program", i) {
        n
          ? this._focusMonitor.focusVia(this._elementRef.nativeElement, n, i)
          : this._elementRef.nativeElement.focus(i);
      }
      _getAriaDisabled() {
        return this.ariaDisabled != null
          ? this.ariaDisabled
          : this.disabled && this.disabledInteractive
          ? !0
          : null;
      }
      _getDisabledAttribute() {
        return this.disabledInteractive || !this.disabled ? null : !0;
      }
      _updateRippleDisabled() {
        this._rippleLoader?.setDisabled(
          this._elementRef.nativeElement,
          this.disableRipple || this.disabled
        );
      }
    };
    (e.ɵfac = function (i) {
      Yo();
    }),
      (e.ɵdir = le({
        type: e,
        inputs: {
          color: "color",
          disableRipple: [
            N.HasDecoratorInputTransform,
            "disableRipple",
            "disableRipple",
            ee,
          ],
          disabled: [N.HasDecoratorInputTransform, "disabled", "disabled", ee],
          ariaDisabled: [
            N.HasDecoratorInputTransform,
            "aria-disabled",
            "ariaDisabled",
            ee,
          ],
          disabledInteractive: [
            N.HasDecoratorInputTransform,
            "disabledInteractive",
            "disabledInteractive",
            ee,
          ],
        },
        features: [ge],
      }));
    let t = e;
    return t;
  })();
var $g = (() => {
  let e = class e extends yx {
    constructor(n, i, o, s) {
      super(n, i, o, s),
        this._rippleLoader.configureRipple(this._elementRef.nativeElement, {
          centered: !0,
        });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(U), v(ce), v(T), v(Rt, 8));
  }),
    (e.ɵcmp = Y({
      type: e,
      selectors: [["button", "mat-icon-button", ""]],
      hostVars: 14,
      hostBindings: function (i, o) {
        i & 2 &&
          (We("disabled", o._getDisabledAttribute())(
            "aria-disabled",
            o._getAriaDisabled()
          ),
          Rn(o.color ? "mat-" + o.color : ""),
          be("mat-mdc-button-disabled", o.disabled)(
            "mat-mdc-button-disabled-interactive",
            o.disabledInteractive
          )("_mat-animation-noopable", o._animationMode === "NoopAnimations")(
            "mat-unthemed",
            !o.color
          )("mat-mdc-button-base", !0));
      },
      exportAs: ["matButton"],
      standalone: !0,
      features: [An, Ce],
      attrs: mx,
      ngContentSelectors: gx,
      decls: 4,
      vars: 0,
      consts: [
        [1, "mat-mdc-button-persistent-ripple", "mdc-icon-button__ripple"],
        [1, "mat-mdc-focus-indicator"],
        [1, "mat-mdc-button-touch-target"],
      ],
      template: function (i, o) {
        i & 1 &&
          (je(), de(0, "span", 0), Re(1), de(2, "span", 1)(3, "span", 2));
      },
      styles: [
        '.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block}}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button[hidden]{display:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__focus-ring{pointer-events:none;border:2px solid rgba(0,0,0,0);border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%;display:none}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring{border-color:CanvasText}}.mdc-icon-button__focus-ring::after{content:"";border:2px solid rgba(0,0,0,0);border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}.mat-mdc-icon-button{color:var(--mdc-icon-button-icon-color)}.mat-mdc-icon-button .mdc-button__icon{font-size:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button svg,.mat-mdc-icon-button img{width:var(--mdc-icon-button-icon-size);height:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button:disabled{color:var(--mdc-icon-button-disabled-icon-color)}.mat-mdc-icon-button{border-radius:50%;flex-shrink:0;text-align:center;width:var(--mdc-icon-button-state-layer-size, 48px);height:var(--mdc-icon-button-state-layer-size, 48px);padding:calc(calc(var(--mdc-icon-button-state-layer-size, 48px) - var(--mdc-icon-button-icon-size, 24px)) / 2);font-size:var(--mdc-icon-button-icon-size);-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button svg{vertical-align:baseline}.mat-mdc-icon-button[disabled],.mat-mdc-icon-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mdc-icon-button-disabled-icon-color)}.mat-mdc-icon-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-icon-button .mdc-button__label{z-index:1}.mat-mdc-icon-button .mat-mdc-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-icon-button:focus .mat-mdc-focus-indicator::before{content:""}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-icon-button-ripple-color)}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-state-layer-color)}.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-disabled-state-layer-color)}.mat-mdc-icon-button:hover .mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-hover-state-layer-opacity)}.mat-mdc-icon-button.cdk-program-focused .mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.cdk-keyboard-focused .mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus .mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-focus-state-layer-opacity)}.mat-mdc-icon-button:active .mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-pressed-state-layer-opacity)}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%);display:var(--mat-icon-button-touch-target-display)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:50%}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}',
        px,
      ],
      encapsulation: 2,
      changeDetection: 0,
    }));
  let t = e;
  return t;
})();
var Hg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = V({ type: e })),
    (e.ɵinj = $({ imports: [Ne, Dg, Ne] }));
  let t = e;
  return t;
})();
var zg = () => ["home"],
  wx = () => ["about"],
  Dx = () => ["projects"],
  Ix = () => ["contact"],
  Wg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵcmp = Y({
        type: e,
        selectors: [["app-header"]],
        decls: 24,
        vars: 15,
        consts: [
          [1, "header-container"],
          ["mat-tab-nav-bar", ""],
          ["mat-tab-link", "", 3, "routerLink"],
          [1, "main-header"],
          ["routerLinkActive", "active-underline", 1, "nav-items"],
          [1, "example-spacer"],
          [
            "mat-icon-button",
            "",
            "aria-label",
            "Example icon-button with heart icon",
          ],
          [
            "mat-icon-button",
            "",
            "aria-label",
            "Example icon-button with share icon",
          ],
        ],
        template: function (i, o) {
          i & 1 &&
            (R(0, "mat-toolbar", 0)(1, "nav", 1)(2, "a", 2)(3, "span", 3),
            G(4),
            P()(),
            R(5, "a", 2)(6, "span", 4),
            G(7),
            P()(),
            R(8, "a", 2)(9, "span", 4),
            G(10),
            P()(),
            R(11, "a", 2)(12, "span", 4),
            G(13),
            P()(),
            R(14, "a", 2)(15, "span", 4),
            G(16),
            P()()(),
            de(17, "span", 5),
            R(18, "button", 6)(19, "mat-icon"),
            G(20, "favorite"),
            P()(),
            R(21, "button", 7)(22, "mat-icon"),
            G(23, "share"),
            P()()()),
            i & 2 &&
              (fe(2),
              Ae("routerLink", rn(10, zg)),
              fe(2),
              nn("Rohit Kumar"),
              fe(),
              Ae("routerLink", rn(11, zg)),
              fe(2),
              nn("Home"),
              fe(),
              Ae("routerLink", rn(12, wx)),
              fe(2),
              nn("About"),
              fe(),
              Ae("routerLink", rn(13, Dx)),
              fe(2),
              nn("Projects"),
              fe(),
              Ae("routerLink", rn(14, Ix)),
              fe(2),
              nn("Contact"));
        },
        dependencies: [Cr, Jm, Pd, Ld, Fg, $s, $g],
        styles: [
          ".header-container[_ngcontent-%COMP%]{background-color:#284c79;color:#fff;height:15vh;position:fixed;top:0;left:0;padding-left:2rem;z-index:1}.main-header[_ngcontent-%COMP%]{font-weight:700;font-size:1.5rem;color:#fff;cursor:pointer}.nav-items[_ngcontent-%COMP%]{color:#fff;font-weight:400;cursor:pointer}.example-spacer[_ngcontent-%COMP%]{flex:1 1 auto}nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{position:relative}.active-underline[_ngcontent-%COMP%]{position:absolute;bottom:0;left:0;height:15px;border-bottom:1px solid;transition:all 1s}.active-underline[_ngcontent-%COMP%]:hover{background-color:#8a2be2}",
        ],
      }));
    let t = e;
    return t;
  })();
var Gg = (() => {
  let e = class e {
    constructor() {
      this.title = "application";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Y({
      type: e,
      selectors: [["app-root"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && de(0, "app-header")(1, "router-outlet");
      },
      dependencies: [sd, Wg],
    }));
  let t = e;
  return t;
})();
var qg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = V({ type: e, bootstrap: [Gg] })),
    (e.ɵinj = $({ imports: [fm, Sg, Og, Pg, $s, Hg, Eg] }));
  let t = e;
  return t;
})();
um()
  .bootstrapModule(qg)
  .catch((t) => console.error(t));
