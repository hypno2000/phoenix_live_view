var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// js/phoenix_live_view/index.js
var phoenix_live_view_exports = {};
__export(phoenix_live_view_exports, {
  LiveSocket: () => LiveSocket
});
module.exports = __toCommonJS(phoenix_live_view_exports);

// ../node_modules/@virtualstate/navigation/esnext/global-navigation.js
var globalNavigation = void 0;
if (typeof window !== "undefined" && window.navigation) {
  const navigation3 = window.navigation;
  assertNavigation(navigation3);
  globalNavigation = navigation3;
}
function assertNavigation(value) {
  if (!value) {
    throw new Error("Expected Navigation");
  }
}

// ../node_modules/@virtualstate/navigation/esnext/event-target/event.js
function isEvent(value) {
  function isLike(value2) {
    return !!value2;
  }
  return isLike(value) && (typeof value.type === "string" || typeof value.type === "symbol");
}
function assertEvent(value, type) {
  if (!isEvent(value)) {
    throw new Error("Expected event");
  }
  if (typeof type !== "undefined" && value.type !== type) {
    throw new Error(`Expected event type ${String(type)}, got ${value.type.toString()}`);
  }
}

// ../node_modules/@virtualstate/navigation/esnext/event-target/parallel-event.js
function isParallelEvent(value) {
  return isEvent(value) && value.parallel !== false;
}

// ../node_modules/@virtualstate/navigation/esnext/navigation-errors.js
var AbortError = class extends Error {
  constructor(message) {
    super(`AbortError${message ? `: ${message}` : ""}`);
    this.name = "AbortError";
  }
};
function isAbortError(error) {
  return error instanceof Error && error.name === "AbortError";
}
var InvalidStateError = class extends Error {
  constructor(message) {
    super(`InvalidStateError${message ? `: ${message}` : ""}`);
    this.name = "InvalidStateError";
  }
};
function isInvalidStateError(error) {
  return error instanceof Error && error.name === "InvalidStateError";
}

// ../node_modules/@virtualstate/navigation/esnext/event-target/signal-event.js
function isAbortSignal(value) {
  function isAbortSignalLike(value2) {
    return typeof value2 === "object";
  }
  return isAbortSignalLike(value) && typeof value.aborted === "boolean" && typeof value.addEventListener === "function";
}
function isSignalEvent(value) {
  function isSignalEventLike(value2) {
    return value2.hasOwnProperty("signal");
  }
  return isEvent(value) && isSignalEventLike(value) && isAbortSignal(value.signal);
}
function isSignalHandled(event, error) {
  if (isSignalEvent(event) && event.signal.aborted && error instanceof Error && isAbortError(error)) {
    return true;
  }
}

// ../node_modules/@virtualstate/navigation/esnext/event-target/event-target-options.js
var EventTargetListeners = Symbol.for("@opennetwork/environment/events/target/listeners");
var EventTargetListenersIgnore = Symbol.for("@opennetwork/environment/events/target/listeners/ignore");
var EventTargetListenersMatch = Symbol.for("@opennetwork/environment/events/target/listeners/match");
var EventTargetListenersThis = Symbol.for("@opennetwork/environment/events/target/listeners/this");

// ../node_modules/@virtualstate/navigation/esnext/event-target/descriptor.js
var EventDescriptorSymbol = Symbol.for("@opennetwork/environment/events/descriptor");

// ../node_modules/@virtualstate/navigation/esnext/event-target/callback.js
function matchEventCallback(type, callback, options) {
  const optionsDescriptor = isOptionsDescriptor(options) ? options : void 0;
  return (descriptor) => {
    if (optionsDescriptor) {
      return optionsDescriptor === descriptor;
    }
    return (!callback || callback === descriptor.callback) && type === descriptor.type;
  };
  function isOptionsDescriptor(options2) {
    function isLike(options3) {
      return !!options3;
    }
    return isLike(options2) && options2[EventDescriptorSymbol] === true;
  }
}

// ../node_modules/@virtualstate/navigation/esnext/event-target/event-target-listeners.js
function isFunctionEventCallback(fn) {
  return typeof fn === "function";
}
var EventTargetDescriptors = Symbol.for("@virtualstate/navigation/event-target/descriptors");
var EventTargetListeners2 = class {
  [EventTargetDescriptors] = [];
  [EventTargetListenersIgnore] = /* @__PURE__ */ new WeakSet();
  get [EventTargetListeners]() {
    return [...this[EventTargetDescriptors] ?? []];
  }
  [EventTargetListenersMatch](type) {
    const external = this[EventTargetListeners];
    const matched = [
      .../* @__PURE__ */ new Set([...external ?? [], ...this[EventTargetDescriptors] ?? []])
    ].filter((descriptor) => descriptor.type === type || descriptor.type === "*").filter((descriptor) => !this[EventTargetListenersIgnore]?.has(descriptor));
    const listener = typeof type === "string" ? this[`on${type}`] : void 0;
    if (typeof listener === "function" && isFunctionEventCallback(listener)) {
      matched.push({
        type,
        callback: listener,
        [EventDescriptorSymbol]: true
      });
    }
    return matched;
  }
  addEventListener(type, callback, options) {
    const listener = {
      ...options,
      isListening: () => !!this[EventTargetDescriptors]?.find(matchEventCallback(type, callback)),
      descriptor: {
        [EventDescriptorSymbol]: true,
        ...options,
        type,
        callback
      },
      timestamp: Date.now()
    };
    if (listener.isListening()) {
      return;
    }
    this[EventTargetDescriptors]?.push(listener.descriptor);
  }
  removeEventListener(type, callback, options) {
    if (!isFunctionEventCallback(callback)) {
      return;
    }
    const externalListeners = this[EventTargetListeners] ?? this[EventTargetDescriptors] ?? [];
    const externalIndex = externalListeners.findIndex(matchEventCallback(type, callback, options));
    if (externalIndex === -1) {
      return;
    }
    const index = this[EventTargetDescriptors]?.findIndex(matchEventCallback(type, callback, options)) ?? -1;
    if (index !== -1) {
      this[EventTargetDescriptors]?.splice(index, 1);
    }
    const descriptor = externalListeners[externalIndex];
    if (descriptor) {
      this[EventTargetListenersIgnore]?.add(descriptor);
    }
  }
  hasEventListener(type, callback) {
    if (callback && !isFunctionEventCallback(callback)) {
      return false;
    }
    const foundIndex = this[EventTargetDescriptors]?.findIndex(matchEventCallback(type, callback)) ?? -1;
    return foundIndex > -1;
  }
};

// ../node_modules/@virtualstate/navigation/esnext/event-target/async-event-target.js
var AsyncEventTarget = class extends EventTargetListeners2 {
  [EventTargetListenersThis];
  constructor(thisValue = void 0) {
    super();
    this[EventTargetListenersThis] = thisValue;
  }
  async dispatchEvent(event) {
    const listeners = this[EventTargetListenersMatch]?.(event.type) ?? [];
    if (isSignalEvent(event) && event.signal.aborted) {
      throw new AbortError();
    }
    const parallel = isParallelEvent(event);
    const promises = [];
    for (let index = 0; index < listeners.length; index += 1) {
      const descriptor = listeners[index];
      const promise = (async () => {
        if (descriptor.once) {
          this.removeEventListener(descriptor.type, descriptor.callback, descriptor);
        }
        await descriptor.callback.call(this[EventTargetListenersThis] ?? this, event);
      })();
      if (!parallel) {
        try {
          await promise;
        } catch (error) {
          if (!isSignalHandled(event, error)) {
            await Promise.reject(error);
          }
        }
        if (isSignalEvent(event) && event.signal.aborted) {
          return;
        }
      } else {
        promises.push(promise);
      }
    }
    if (promises.length) {
      const results = await Promise.allSettled(promises);
      const rejected = results.filter((result) => {
        return result.status === "rejected";
      });
      if (rejected.length) {
        let unhandled = rejected;
        if (isSignalEvent(event) && event.signal.aborted) {
          unhandled = unhandled.filter((result) => !isSignalHandled(event, result.reason));
        }
        if (unhandled.length === 1) {
          await Promise.reject(unhandled[0].reason);
          throw unhandled[0].reason;
        } else if (unhandled.length > 1) {
          throw new AggregateError(unhandled.map(({ reason }) => reason));
        }
      }
    }
  }
};

// ../node_modules/@virtualstate/navigation/esnext/event-target/event-target.js
var defaultEventTargetModule = {
  EventTarget: AsyncEventTarget,
  AsyncEventTarget,
  SyncEventTarget: AsyncEventTarget
};
var eventTargetModule = defaultEventTargetModule;
var EventTargetImplementation = eventTargetModule.EventTarget || eventTargetModule.SyncEventTarget || eventTargetModule.AsyncEventTarget;
function assertEventTarget(target) {
  if (typeof target !== "function") {
    throw new Error("Could not load EventTarget implementation");
  }
}
var EventTarget = class extends AsyncEventTarget {
  constructor(...args) {
    super();
    if (EventTargetImplementation) {
      assertEventTarget(EventTargetImplementation);
      const { dispatchEvent } = new EventTargetImplementation(...args);
      this.dispatchEvent = dispatchEvent;
    }
  }
};

// ../node_modules/@virtualstate/navigation/esnext/event-target/sync-event-target.js
var SyncEventTarget = class extends EventTargetListeners2 {
  [EventTargetListenersThis];
  constructor(thisValue = void 0) {
    super();
    this[EventTargetListenersThis] = thisValue;
  }
  dispatchEvent(event) {
    const listeners = this[EventTargetListenersMatch]?.(event.type) ?? [];
    if (isSignalEvent(event) && event.signal.aborted) {
      throw new AbortError();
    }
    for (let index = 0; index < listeners.length; index += 1) {
      const descriptor = listeners[index];
      if (descriptor.once) {
        this.removeEventListener(descriptor.type, descriptor.callback, descriptor);
      }
      try {
        descriptor.callback.call(this[EventTargetListenersThis] ?? this, event);
      } catch (error) {
        if (!isSignalHandled(event, error)) {
          throw error;
        }
      }
      if (isSignalEvent(event) && event.signal.aborted) {
        throw new AbortError();
      }
    }
  }
};

// ../node_modules/@virtualstate/navigation/esnext/navigation-event-target.js
var NavigationEventTarget = class extends EventTarget {
  addEventListener(type, listener, options) {
    assertEventCallback(listener);
    return super.addEventListener(type, listener, typeof options === "boolean" ? { once: options } : options);
    function assertEventCallback(listener2) {
      if (typeof listener2 !== "function")
        throw new Error("Please us the function variant of event listener");
    }
  }
  removeEventListener(type, listener, options) {
    assertEventCallback(listener);
    return super.removeEventListener(type, listener);
    function assertEventCallback(listener2) {
      if (typeof listener2 !== "function")
        throw new Error("Please us the function variant of event listener");
    }
  }
};

// ../node_modules/@virtualstate/navigation/esnext/util/uuid-or-random.js
var isWebCryptoSupported = "crypto" in globalThis && typeof globalThis.crypto.randomUUID === "function";
var v4 = isWebCryptoSupported ? globalThis.crypto.randomUUID.bind(globalThis.crypto) : () => Array.from({ length: 5 }, () => `${Math.random()}`.replace(/^0\./, "")).join("-").replace(".", "");

// ../node_modules/@virtualstate/navigation/esnext/navigation-entry.js
var NavigationGetState = Symbol.for("@virtualstate/navigation/getState");
var NavigationHistoryEntryNavigationType = Symbol.for("@virtualstate/navigation/entry/navigationType");
var NavigationHistoryEntryKnownAs = Symbol.for("@virtualstate/navigation/entry/knownAs");
var NavigationHistoryEntrySetState = Symbol.for("@virtualstate/navigation/entry/setState");
function isPrimitiveValue(state) {
  return typeof state === "number" || typeof state === "boolean" || typeof state === "symbol" || typeof state === "bigint" || typeof state === "string";
}
function isValue(state) {
  return !!(state || isPrimitiveValue(state));
}
var NavigationHistoryEntry = class extends NavigationEventTarget {
  #index;
  #state;
  get index() {
    return typeof this.#index === "number" ? this.#index : this.#index();
  }
  key;
  id;
  url;
  sameDocument;
  get [NavigationHistoryEntryNavigationType]() {
    return this.#options.navigationType;
  }
  get [NavigationHistoryEntryKnownAs]() {
    const set = new Set(this.#options[NavigationHistoryEntryKnownAs]);
    set.add(this.id);
    return set;
  }
  #options;
  get [EventTargetListeners]() {
    return [
      ...super[EventTargetListeners] ?? [],
      ...this.#options[EventTargetListeners] ?? []
    ];
  }
  constructor(init) {
    super();
    this.#options = init;
    this.key = init.key || v4();
    this.id = v4();
    this.url = init.url ?? void 0;
    this.#index = init.index;
    this.sameDocument = init.sameDocument ?? true;
    this.#state = init.state ?? void 0;
  }
  [NavigationGetState]() {
    return this.#options?.getState?.(this);
  }
  getState() {
    let state = this.#state;
    if (!isValue(state)) {
      const external = this[NavigationGetState]();
      if (isValue(external)) {
        state = this.#state = external;
      }
    }
    if (typeof state === "undefined" || isPrimitiveValue(state)) {
      return state;
    }
    if (typeof state === "function") {
      console.warn("State passed to Navigation.navigate was a function, this may be unintentional");
      console.warn("Unless a state value is primitive, with a standard implementation of Navigation");
      console.warn("your state value will be serialized and deserialized before this point, meaning");
      console.warn("a function would not be usable.");
    }
    return {
      ...state
    };
  }
  [NavigationHistoryEntrySetState](state) {
    this.#state = state;
  }
};

// ../node_modules/@virtualstate/navigation/esnext/util/deferred.js
function deferred(handleCatch) {
  let resolve = void 0, reject = void 0;
  const promise = new Promise((resolveFn, rejectFn) => {
    resolve = resolveFn;
    reject = rejectFn;
  });
  ok(resolve);
  ok(reject);
  return {
    resolve,
    reject,
    promise: handleCatch ? promise.catch(handleCatch) : promise
  };
}
function ok(value) {
  if (!value) {
    throw new Error("Value not provided");
  }
}

// ../node_modules/@virtualstate/navigation/esnext/global-abort-controller.js
var GlobalAbortController = typeof AbortController !== "undefined" ? AbortController : void 0;

// ../node_modules/@virtualstate/navigation/esnext/import-abort-controller.js
if (!GlobalAbortController) {
  throw new Error("AbortController expected to be available or polyfilled");
}
var AbortController2 = GlobalAbortController;

// ../node_modules/@virtualstate/navigation/esnext/is.js
function isPromise(value) {
  return like(value) && typeof value.then === "function";
}
function ok2(value, message = "Expected value") {
  if (!value) {
    throw new Error(message);
  }
}
function isPromiseRejectedResult(value) {
  return value.status === "rejected";
}
function like(value) {
  return !!value;
}

// ../node_modules/@virtualstate/navigation/esnext/navigation-transition.js
var Rollback = Symbol.for("@virtualstate/navigation/rollback");
var Unset = Symbol.for("@virtualstate/navigation/unset");
var NavigationTransitionParentEventTarget = Symbol.for("@virtualstate/navigation/transition/parentEventTarget");
var NavigationTransitionFinishedDeferred = Symbol.for("@virtualstate/navigation/transition/deferred/finished");
var NavigationTransitionCommittedDeferred = Symbol.for("@virtualstate/navigation/transition/deferred/committed");
var NavigationTransitionNavigationType = Symbol.for("@virtualstate/navigation/transition/navigationType");
var NavigationTransitionInitialEntries = Symbol.for("@virtualstate/navigation/transition/entries/initial");
var NavigationTransitionFinishedEntries = Symbol.for("@virtualstate/navigation/transition/entries/finished");
var NavigationTransitionInitialIndex = Symbol.for("@virtualstate/navigation/transition/index/initial");
var NavigationTransitionFinishedIndex = Symbol.for("@virtualstate/navigation/transition/index/finished");
var NavigationTransitionEntry = Symbol.for("@virtualstate/navigation/transition/entry");
var NavigationTransitionIsCommitted = Symbol.for("@virtualstate/navigation/transition/isCommitted");
var NavigationTransitionIsFinished = Symbol.for("@virtualstate/navigation/transition/isFinished");
var NavigationTransitionIsRejected = Symbol.for("@virtualstate/navigation/transition/isRejected");
var NavigationTransitionKnown = Symbol.for("@virtualstate/navigation/transition/known");
var NavigationTransitionPromises = Symbol.for("@virtualstate/navigation/transition/promises");
var NavigationIntercept = Symbol.for("@virtualstate/navigation/intercept");
var NavigationTransitionIsOngoing = Symbol.for("@virtualstate/navigation/transition/isOngoing");
var NavigationTransitionIsPending = Symbol.for("@virtualstate/navigation/transition/isPending");
var NavigationTransitionIsAsync = Symbol.for("@virtualstate/navigation/transition/isAsync");
var NavigationTransitionWait = Symbol.for("@virtualstate/navigation/transition/wait");
var NavigationTransitionPromiseResolved = Symbol.for("@virtualstate/navigation/transition/promise/resolved");
var NavigationTransitionRejected = Symbol.for("@virtualstate/navigation/transition/rejected");
var NavigationTransitionCommit = Symbol.for("@virtualstate/navigation/transition/commit");
var NavigationTransitionFinish = Symbol.for("@virtualstate/navigation/transition/finish");
var NavigationTransitionStart = Symbol.for("@virtualstate/navigation/transition/start");
var NavigationTransitionStartDeadline = Symbol.for("@virtualstate/navigation/transition/start/deadline");
var NavigationTransitionError = Symbol.for("@virtualstate/navigation/transition/error");
var NavigationTransitionFinally = Symbol.for("@virtualstate/navigation/transition/finally");
var NavigationTransitionAbort = Symbol.for("@virtualstate/navigation/transition/abort");
var NavigationTransitionInterceptOptionsCommit = Symbol.for("@virtualstate/navigation/transition/intercept/options/commit");
var NavigationTransitionCommitIsManual = Symbol.for("@virtualstate/navigation/transition/commit/isManual");
var NavigationTransition = class extends EventTarget {
  finished;
  /**
   * @experimental
   */
  committed;
  from;
  navigationType;
  /**
   * true if transition has an async intercept
   */
  [NavigationTransitionIsAsync] = false;
  /**
   * @experimental
   */
  [NavigationTransitionInterceptOptionsCommit];
  #options;
  [NavigationTransitionFinishedDeferred] = deferred();
  [NavigationTransitionCommittedDeferred] = deferred();
  get [NavigationTransitionIsPending]() {
    return !!this.#promises.size;
  }
  get [NavigationTransitionNavigationType]() {
    return this.#options[NavigationTransitionNavigationType];
  }
  get [NavigationTransitionInitialEntries]() {
    return this.#options[NavigationTransitionInitialEntries];
  }
  get [NavigationTransitionInitialIndex]() {
    return this.#options[NavigationTransitionInitialIndex];
  }
  get [NavigationTransitionCommitIsManual]() {
    return !!(this[NavigationTransitionInterceptOptionsCommit]?.includes("after-transition") || this[NavigationTransitionInterceptOptionsCommit]?.includes("manual"));
  }
  [NavigationTransitionFinishedEntries];
  [NavigationTransitionFinishedIndex];
  [NavigationTransitionIsCommitted] = false;
  [NavigationTransitionIsFinished] = false;
  [NavigationTransitionIsRejected] = false;
  [NavigationTransitionIsOngoing] = false;
  [NavigationTransitionKnown] = /* @__PURE__ */ new Set();
  [NavigationTransitionEntry];
  #promises = /* @__PURE__ */ new Set();
  #rolledBack = false;
  #abortController = new AbortController2();
  get signal() {
    return this.#abortController.signal;
  }
  get [NavigationTransitionPromises]() {
    return this.#promises;
  }
  constructor(init) {
    super();
    this[NavigationTransitionInterceptOptionsCommit] = [];
    this[NavigationTransitionFinishedDeferred] = init[NavigationTransitionFinishedDeferred] ?? this[NavigationTransitionFinishedDeferred];
    this[NavigationTransitionCommittedDeferred] = init[NavigationTransitionCommittedDeferred] ?? this[NavigationTransitionCommittedDeferred];
    this.#options = init;
    const finished = this.finished = this[NavigationTransitionFinishedDeferred].promise;
    const committed = this.committed = this[NavigationTransitionCommittedDeferred].promise;
    void finished.catch((error) => error);
    void committed.catch((error) => error);
    this.from = init.from;
    this.navigationType = init.navigationType;
    this[NavigationTransitionFinishedEntries] = init[NavigationTransitionFinishedEntries];
    this[NavigationTransitionFinishedIndex] = init[NavigationTransitionFinishedIndex];
    const known = init[NavigationTransitionKnown];
    if (known) {
      for (const entry of known) {
        this[NavigationTransitionKnown].add(entry);
      }
    }
    this[NavigationTransitionEntry] = init[NavigationTransitionEntry];
    {
      {
        this.addEventListener(NavigationTransitionCommit, this.#onCommitPromise, { once: true });
        this.addEventListener(NavigationTransitionFinish, this.#onFinishPromise, { once: true });
      }
      {
        this.addEventListener(NavigationTransitionCommit, this.#onCommitSetProperty, { once: true });
        this.addEventListener(NavigationTransitionFinish, this.#onFinishSetProperty, { once: true });
      }
      {
        this.addEventListener(NavigationTransitionError, this.#onError, {
          once: true
        });
        this.addEventListener(NavigationTransitionAbort, () => {
          if (!this[NavigationTransitionIsFinished]) {
            return this[NavigationTransitionRejected](new AbortError());
          }
        });
      }
      {
        this.addEventListener("*", this[NavigationTransitionEntry].dispatchEvent.bind(this[NavigationTransitionEntry]));
        this.addEventListener("*", init[NavigationTransitionParentEventTarget].dispatchEvent.bind(init[NavigationTransitionParentEventTarget]));
      }
    }
  }
  rollback = (options) => {
    if (this.#rolledBack) {
      throw new InvalidStateError("Rollback invoked multiple times: Please raise an issue at https://github.com/virtualstate/navigation with the use case where you want to use a rollback multiple times, this may have been unexpected behaviour");
    }
    this.#rolledBack = true;
    return this.#options.rollback(options);
  };
  #onCommitSetProperty = () => {
    this[NavigationTransitionIsCommitted] = true;
  };
  #onFinishSetProperty = () => {
    this[NavigationTransitionIsFinished] = true;
  };
  #onFinishPromise = () => {
    this[NavigationTransitionFinishedDeferred].resolve(this[NavigationTransitionEntry]);
  };
  #onCommitPromise = () => {
    if (this.signal.aborted) {
    } else {
      this[NavigationTransitionCommittedDeferred].resolve(this[NavigationTransitionEntry]);
    }
  };
  #onError = (event) => {
    return this[NavigationTransitionRejected](event.error);
  };
  [NavigationTransitionPromiseResolved] = (...promises) => {
    for (const promise of promises) {
      this.#promises.delete(promise);
    }
  };
  [NavigationTransitionRejected] = async (reason) => {
    if (this[NavigationTransitionIsRejected])
      return;
    this[NavigationTransitionIsRejected] = true;
    this[NavigationTransitionAbort]();
    const navigationType = this[NavigationTransitionNavigationType];
    if (typeof navigationType === "string" || navigationType === Rollback) {
      await this.dispatchEvent({
        type: "navigateerror",
        error: reason,
        get message() {
          if (reason instanceof Error) {
            return reason.message;
          }
          return `${reason}`;
        }
      });
      if (navigationType !== Rollback && !(isInvalidStateError(reason) || isAbortError(reason))) {
        try {
          await this.rollback()?.finished;
        } catch (error) {
          throw new InvalidStateError("Failed to rollback, please raise an issue at https://github.com/virtualstate/navigation/issues");
        }
      }
    }
    this[NavigationTransitionCommittedDeferred].reject(reason);
    this[NavigationTransitionFinishedDeferred].reject(reason);
  };
  [NavigationIntercept] = (options) => {
    const transition = this;
    const promise = parseOptions();
    this[NavigationTransitionIsOngoing] = true;
    if (!promise)
      return;
    this[NavigationTransitionIsAsync] = true;
    const statusPromise = promise.then(() => ({
      status: "fulfilled",
      value: void 0
    })).catch(async (reason) => {
      await this[NavigationTransitionRejected](reason);
      return {
        status: "rejected",
        reason
      };
    });
    this.#promises.add(statusPromise);
    function parseOptions() {
      if (!options)
        return void 0;
      if (isPromise(options)) {
        return options;
      }
      if (typeof options === "function") {
        return options();
      }
      const { handler, commit } = options;
      if (commit && typeof commit === "string") {
        transition[NavigationTransitionInterceptOptionsCommit].push(commit);
      }
      if (typeof handler !== "function") {
        return;
      }
      return handler();
    }
  };
  [NavigationTransitionWait] = async () => {
    if (!this.#promises.size)
      return this[NavigationTransitionEntry];
    try {
      const captured = [...this.#promises];
      const results = await Promise.all(captured);
      const rejected = results.filter((result) => result.status === "rejected");
      if (rejected.length) {
        if (rejected.length === 1) {
          throw rejected[0].reason;
        }
        if (typeof AggregateError !== "undefined") {
          throw new AggregateError(rejected.map(({ reason }) => reason));
        }
        throw new Error();
      }
      this[NavigationTransitionPromiseResolved](...captured);
      if (this[NavigationTransitionIsPending]) {
        return this[NavigationTransitionWait]();
      }
      return this[NavigationTransitionEntry];
    } catch (error) {
      await this.#onError(error);
      throw await Promise.reject(error);
    } finally {
      await this[NavigationTransitionFinish]();
    }
  };
  [NavigationTransitionAbort]() {
    if (this.#abortController.signal.aborted)
      return;
    this.#abortController.abort();
    this.dispatchEvent({
      type: NavigationTransitionAbort,
      transition: this,
      entry: this[NavigationTransitionEntry]
    });
  }
  [NavigationTransitionFinish] = async () => {
    if (this[NavigationTransitionIsFinished]) {
      return;
    }
    await this.dispatchEvent({
      type: NavigationTransitionFinish,
      transition: this,
      entry: this[NavigationTransitionEntry],
      intercept: this[NavigationIntercept]
    });
  };
};

// ../node_modules/@virtualstate/navigation/esnext/base-url.js
function getWindowBaseURL() {
  try {
    if (typeof window !== "undefined" && window.location) {
      return window.location.href;
    }
  } catch {
  }
}
function getBaseURL(url) {
  const baseURL = getWindowBaseURL() ?? "https://html.spec.whatwg.org/";
  return new URL(
    // Deno wants this to be always a string
    (url ?? "").toString(),
    baseURL
  );
}

// ../node_modules/@virtualstate/navigation/esnext/defer.js
function defer() {
  let resolve = void 0, reject = void 0, settled = false, status = "pending";
  const promise = new Promise((resolveFn, rejectFn) => {
    resolve = (value) => {
      status = "fulfilled";
      settled = true;
      resolveFn(value);
    };
    reject = (reason) => {
      status = "rejected";
      settled = true;
      rejectFn(reason);
    };
  });
  ok2(resolve);
  ok2(reject);
  return {
    get settled() {
      return settled;
    },
    get status() {
      return status;
    },
    resolve,
    reject,
    promise
  };
}

// ../node_modules/@virtualstate/navigation/esnext/events/navigation-current-entry-change-event.js
var NavigationCurrentEntryChangeEvent = class {
  type;
  from;
  navigationType;
  constructor(type, init) {
    this.type = type;
    if (!init) {
      throw new TypeError("init required");
    }
    if (!init.from) {
      throw new TypeError("from required");
    }
    this.from = init.from;
    this.navigationType = init.navigationType ?? void 0;
  }
};

// ../node_modules/@virtualstate/navigation/esnext/events/navigate-event.js
var NavigateEvent = class {
  type;
  canIntercept;
  /**
   * @deprecated
   */
  canTransition;
  destination;
  downloadRequest;
  formData;
  hashChange;
  info;
  signal;
  userInitiated;
  navigationType;
  constructor(type, init) {
    this.type = type;
    if (!init) {
      throw new TypeError("init required");
    }
    if (!init.destination) {
      throw new TypeError("destination required");
    }
    if (!init.signal) {
      throw new TypeError("signal required");
    }
    this.canIntercept = init.canIntercept ?? false;
    this.canTransition = init.canIntercept ?? false;
    this.destination = init.destination;
    this.downloadRequest = init.downloadRequest;
    this.formData = init.formData;
    this.hashChange = init.hashChange ?? false;
    this.info = init.info;
    this.signal = init.signal;
    this.userInitiated = init.userInitiated ?? false;
    this.navigationType = init.navigationType ?? "push";
  }
  commit() {
    throw new Error("Not implemented");
  }
  intercept(options) {
    throw new Error("Not implemented");
  }
  preventDefault() {
    throw new Error("Not implemented");
  }
  reportError(reason) {
    throw new Error("Not implemented");
  }
  scroll() {
    throw new Error("Not implemented");
  }
  /**
   * @deprecated
   */
  transitionWhile(options) {
    return this.intercept(options);
  }
};

// ../node_modules/@virtualstate/navigation/esnext/create-navigation-transition.js
var NavigationFormData = Symbol.for("@virtualstate/navigation/formData");
var NavigationDownloadRequest = Symbol.for("@virtualstate/navigation/downloadRequest");
var NavigationCanIntercept = Symbol.for("@virtualstate/navigation/canIntercept");
var NavigationUserInitiated = Symbol.for("@virtualstate/navigation/userInitiated");
var NavigationOriginalEvent = Symbol.for("@virtualstate/navigation/originalEvent");
var EventAbortController = Symbol.for("@virtualstate/navigation/event/abortController");
function noop() {
  return void 0;
}
function getEntryIndex(entries, entry) {
  const knownIndex = entry.index;
  if (knownIndex !== -1) {
    return knownIndex;
  }
  return -1;
}
function createNavigationTransition(context) {
  const { commit: transitionCommit, currentIndex, options, known: initialKnown, currentEntry, transition, transition: { [NavigationTransitionInitialEntries]: previousEntries, [NavigationTransitionEntry]: entry, [NavigationIntercept]: intercept }, reportError } = context;
  let { transition: { [NavigationTransitionNavigationType]: navigationType } } = context;
  let resolvedEntries = [...previousEntries];
  const known = new Set(initialKnown);
  let destinationIndex = -1, nextIndex = currentIndex;
  if (navigationType === Rollback) {
    const { index } = options ?? { index: void 0 };
    if (typeof index !== "number")
      throw new InvalidStateError("Expected index to be provided for rollback");
    destinationIndex = index;
    nextIndex = index;
  } else if (navigationType === "traverse" || navigationType === "reload") {
    destinationIndex = getEntryIndex(previousEntries, entry);
    nextIndex = destinationIndex;
  } else if (navigationType === "replace") {
    if (currentIndex === -1) {
      navigationType = "push";
      destinationIndex = currentIndex + 1;
      nextIndex = destinationIndex;
    } else {
      destinationIndex = currentIndex;
      nextIndex = currentIndex;
    }
  } else {
    destinationIndex = currentIndex + 1;
    nextIndex = destinationIndex;
  }
  if (typeof destinationIndex !== "number" || destinationIndex === -1) {
    throw new InvalidStateError("Could not resolve next index");
  }
  if (!entry.url) {
    console.trace({ navigationType, entry, options });
    throw new InvalidStateError("Expected entry url");
  }
  const destination = {
    url: entry.url,
    key: entry.key,
    index: destinationIndex,
    sameDocument: entry.sameDocument,
    getState() {
      return entry.getState();
    }
  };
  let hashChange = false;
  const currentUrlInstance = getBaseURL(currentEntry?.url);
  const destinationUrlInstance = new URL(destination.url);
  const currentHash = currentUrlInstance.hash;
  const destinationHash = destinationUrlInstance.hash;
  if (currentHash !== destinationHash) {
    const currentUrlInstanceWithoutHash = new URL(currentUrlInstance.toString());
    currentUrlInstanceWithoutHash.hash = "";
    const destinationUrlInstanceWithoutHash = new URL(destinationUrlInstance.toString());
    destinationUrlInstanceWithoutHash.hash = "";
    hashChange = currentUrlInstanceWithoutHash.toString() === destinationUrlInstanceWithoutHash.toString();
  }
  let contextToCommit;
  const { resolve: resolveCommit, promise: waitForCommit } = defer();
  function commit() {
    ok2(contextToCommit, "Expected contextToCommit");
    resolveCommit(transitionCommit(contextToCommit));
  }
  const abortController = new AbortController2();
  const event = new NavigateEvent("navigate", {
    signal: abortController.signal,
    info: void 0,
    ...options,
    canIntercept: options?.[NavigationCanIntercept] ?? true,
    formData: options?.[NavigationFormData] ?? void 0,
    downloadRequest: options?.[NavigationDownloadRequest] ?? void 0,
    hashChange,
    navigationType: options?.navigationType ?? (typeof navigationType === "string" ? navigationType : "replace"),
    userInitiated: options?.[NavigationUserInitiated] ?? false,
    destination
  });
  const originalEvent = options?.[NavigationOriginalEvent];
  const preventDefault = transition[NavigationTransitionAbort].bind(transition);
  if (originalEvent) {
    const definedEvent = originalEvent;
    event.intercept = function originalEventIntercept(options2) {
      definedEvent.preventDefault();
      return intercept(options2);
    };
    event.preventDefault = function originalEventPreventDefault() {
      definedEvent.preventDefault();
      return preventDefault();
    };
  } else {
    event.intercept = intercept;
    event.preventDefault = preventDefault;
  }
  event.transitionWhile = event.intercept;
  event.commit = commit;
  if (reportError) {
    event.reportError = reportError;
  }
  event.scroll = noop;
  if (originalEvent) {
    event.originalEvent = originalEvent;
  }
  const currentEntryChange = new NavigationCurrentEntryChangeEvent("currententrychange", {
    from: currentEntry,
    navigationType: event.navigationType
  });
  let updatedEntries = [], removedEntries = [], addedEntries = [];
  const previousKeys = previousEntries.map((entry2) => entry2.key);
  if (navigationType === Rollback) {
    const { entries } = options ?? { entries: void 0 };
    if (!entries)
      throw new InvalidStateError("Expected entries to be provided for rollback");
    resolvedEntries = entries;
    resolvedEntries.forEach((entry2) => known.add(entry2));
    const keys = resolvedEntries.map((entry2) => entry2.key);
    removedEntries = previousEntries.filter((entry2) => !keys.includes(entry2.key));
    addedEntries = resolvedEntries.filter((entry2) => !previousKeys.includes(entry2.key));
  } else if (navigationType === "replace" || navigationType === "traverse" || navigationType === "reload") {
    resolvedEntries[destination.index] = entry;
    if (navigationType !== "traverse") {
      updatedEntries.push(entry);
    }
    if (navigationType === "replace") {
      resolvedEntries = resolvedEntries.slice(0, destination.index + 1);
    }
    const keys = resolvedEntries.map((entry2) => entry2.key);
    removedEntries = previousEntries.filter((entry2) => !keys.includes(entry2.key));
    if (previousKeys.includes(entry.id)) {
      addedEntries = [entry];
    }
  } else if (navigationType === "push") {
    let removed = false;
    if (resolvedEntries[destination.index]) {
      resolvedEntries = resolvedEntries.slice(0, destination.index);
      removed = true;
    }
    resolvedEntries.push(entry);
    addedEntries = [entry];
    if (removed) {
      const keys = resolvedEntries.map((entry2) => entry2.key);
      removedEntries = previousEntries.filter((entry2) => !keys.includes(entry2.key));
    }
  }
  known.add(entry);
  let entriesChange = void 0;
  if (updatedEntries.length || addedEntries.length || removedEntries.length) {
    entriesChange = {
      updatedEntries,
      addedEntries,
      removedEntries
    };
  }
  contextToCommit = {
    entries: resolvedEntries,
    index: nextIndex,
    known,
    entriesChange
  };
  return {
    entries: resolvedEntries,
    known,
    index: nextIndex,
    currentEntryChange,
    destination,
    navigate: event,
    navigationType,
    waitForCommit,
    commit,
    abortController
  };
}

// ../node_modules/@virtualstate/navigation/esnext/event-target/create-event.js
function createEvent(event) {
  if (typeof CustomEvent !== "undefined" && typeof event.type === "string") {
    if (event instanceof CustomEvent) {
      return event;
    }
    const { type, detail, ...rest } = event;
    const customEvent = new CustomEvent(type, {
      detail: detail ?? rest
    });
    Object.assign(customEvent, rest);
    assertEvent(customEvent, event.type);
    return customEvent;
  }
  return event;
}

// ../node_modules/@virtualstate/navigation/esnext/navigation.js
var NavigationSetOptions = Symbol.for("@virtualstate/navigation/setOptions");
var NavigationSetEntries = Symbol.for("@virtualstate/navigation/setEntries");
var NavigationSetCurrentIndex = Symbol.for("@virtualstate/navigation/setCurrentIndex");
var NavigationSetCurrentKey = Symbol.for("@virtualstate/navigation/setCurrentKey");
var NavigationGetState2 = Symbol.for("@virtualstate/navigation/getState");
var NavigationSetState = Symbol.for("@virtualstate/navigation/setState");
var NavigationDisposeState = Symbol.for("@virtualstate/navigation/disposeState");
function isNavigationNavigationType(value) {
  return value === "reload" || value === "push" || value === "replace" || value === "traverse";
}
var Navigation = class extends NavigationEventTarget {
  // Should be always 0 or 1
  #transitionInProgressCount = 0;
  // #activePromise?: Promise<void> = undefined;
  #entries = [];
  #known = /* @__PURE__ */ new Set();
  #currentIndex = -1;
  #activeTransition;
  #knownTransitions = /* @__PURE__ */ new WeakSet();
  #baseURL = "";
  #initialEntry = void 0;
  #options = void 0;
  get canGoBack() {
    return !!this.#entries[this.#currentIndex - 1];
  }
  get canGoForward() {
    return !!this.#entries[this.#currentIndex + 1];
  }
  get currentEntry() {
    if (this.#currentIndex === -1) {
      if (!this.#initialEntry) {
        this.#initialEntry = new NavigationHistoryEntry({
          getState: this[NavigationGetState2],
          navigationType: "push",
          index: -1,
          sameDocument: false,
          url: this.#baseURL.toString()
        });
      }
      return this.#initialEntry;
    }
    return this.#entries[this.#currentIndex];
  }
  get transition() {
    const transition = this.#activeTransition;
    return transition?.signal.aborted ? void 0 : transition;
  }
  constructor(options = {}) {
    super();
    this[NavigationSetOptions](options);
  }
  [NavigationSetOptions](options) {
    this.#options = options;
    this.#baseURL = getBaseURL(options?.baseURL);
    this.#entries = [];
    if (options.entries) {
      this[NavigationSetEntries](options.entries);
    }
    if (options.currentKey) {
      this[NavigationSetCurrentKey](options.currentKey);
    } else if (typeof options.currentIndex === "number") {
      this[NavigationSetCurrentIndex](options.currentIndex);
    }
  }
  /**
   * Set the current entry key without any lifecycle eventing
   *
   * This would be more exact than providing an index
   * @param key
   */
  [NavigationSetCurrentKey](key) {
    const index = this.#entries.findIndex((entry) => entry.key === key);
    if (index === -1)
      return;
    this.#currentIndex = index;
  }
  /**
   * Set the current entry index without any lifecycle eventing
   * @param index
   */
  [NavigationSetCurrentIndex](index) {
    if (index <= -1)
      return;
    if (index >= this.#entries.length)
      return;
    this.#currentIndex = index;
  }
  /**
   * Set the entries available without any lifecycle eventing
   * @param entries
   */
  [NavigationSetEntries](entries) {
    this.#entries = entries.map(({ key, url, navigationType, state, sameDocument }, index) => new NavigationHistoryEntry({
      getState: this[NavigationGetState2],
      navigationType: isNavigationNavigationType(navigationType) ? navigationType : "push",
      sameDocument: sameDocument ?? true,
      index,
      url,
      key,
      state
    }));
    if (this.#currentIndex === -1 && this.#entries.length) {
      this.#currentIndex = 0;
    }
  }
  [NavigationGetState2] = (entry) => {
    return this.#options?.getState?.(entry) ?? void 0;
  };
  [NavigationSetState] = (entry) => {
    return this.#options?.setState?.(entry);
  };
  [NavigationDisposeState] = (entry) => {
    return this.#options?.disposeState?.(entry);
  };
  back(options) {
    if (!this.canGoBack)
      throw new InvalidStateError("Cannot go back");
    const entry = this.#entries[this.#currentIndex - 1];
    return this.#pushEntry("traverse", this.#cloneNavigationHistoryEntry(entry, {
      ...options,
      navigationType: "traverse"
    }));
  }
  entries() {
    return [...this.#entries];
  }
  forward(options) {
    if (!this.canGoForward)
      throw new InvalidStateError();
    const entry = this.#entries[this.#currentIndex + 1];
    return this.#pushEntry("traverse", this.#cloneNavigationHistoryEntry(entry, {
      ...options,
      navigationType: "traverse"
    }));
  }
  /**
  /**
   * @deprecated use traverseTo
   */
  goTo(key, options) {
    return this.traverseTo(key, options);
  }
  traverseTo(key, options) {
    const found = this.#entries.find((entry) => entry.key === key);
    if (found) {
      return this.#pushEntry("traverse", this.#cloneNavigationHistoryEntry(found, {
        ...options,
        navigationType: "traverse"
      }));
    }
    throw new InvalidStateError();
  }
  #isSameDocument = (url) => {
    function isSameOrigins(a, b) {
      return a.origin === b.origin;
    }
    const currentEntryUrl = this.currentEntry?.url;
    if (!currentEntryUrl)
      return true;
    return isSameOrigins(new URL(currentEntryUrl), new URL(url));
  };
  navigate(url, options) {
    let baseURL = this.#baseURL;
    if (this.currentEntry?.url) {
      baseURL = this.currentEntry?.url;
    }
    const nextUrl = new URL(url, baseURL).toString();
    let navigationType = "push";
    if (options?.history === "push" || options?.history === "replace") {
      navigationType = options?.history;
    }
    const entry = this.#createNavigationHistoryEntry({
      getState: this[NavigationGetState2],
      url: nextUrl,
      ...options,
      sameDocument: this.#isSameDocument(nextUrl),
      navigationType
    });
    return this.#pushEntry(navigationType, entry, void 0, options);
  }
  #cloneNavigationHistoryEntry = (entry, options) => {
    return this.#createNavigationHistoryEntry({
      ...entry,
      getState: this[NavigationGetState2],
      index: entry?.index ?? void 0,
      state: options?.state ?? entry?.getState(),
      navigationType: entry?.[NavigationHistoryEntryNavigationType] ?? (typeof options?.navigationType === "string" ? options.navigationType : "replace"),
      ...options,
      get [NavigationHistoryEntryKnownAs]() {
        return entry?.[NavigationHistoryEntryKnownAs];
      },
      get [EventTargetListeners]() {
        return entry?.[EventTargetListeners];
      }
    });
  };
  #createNavigationHistoryEntry = (options) => {
    const entry = new NavigationHistoryEntry({
      ...options,
      index: options.index ?? (() => {
        return this.#entries.indexOf(entry);
      })
    });
    return entry;
  };
  #pushEntry = (navigationType, entry, transition, options) => {
    if (entry === this.currentEntry)
      throw new InvalidStateError();
    const existingPosition = this.#entries.findIndex((existing) => existing.id === entry.id);
    if (existingPosition > -1) {
      throw new InvalidStateError();
    }
    return this.#commitTransition(navigationType, entry, transition, options);
  };
  #commitTransition = (givenNavigationType, entry, transition, options) => {
    const nextTransition = transition ?? new NavigationTransition({
      from: entry,
      navigationType: typeof givenNavigationType === "string" ? givenNavigationType : "replace",
      rollback: (options2) => {
        return this.#rollback(nextTransition, options2);
      },
      [NavigationTransitionNavigationType]: givenNavigationType,
      [NavigationTransitionInitialEntries]: [...this.#entries],
      [NavigationTransitionInitialIndex]: this.#currentIndex,
      [NavigationTransitionKnown]: [...this.#known],
      [NavigationTransitionEntry]: entry,
      [NavigationTransitionParentEventTarget]: this
    });
    const { finished, committed } = nextTransition;
    const handler = () => {
      return this.#immediateTransition(givenNavigationType, entry, nextTransition, options);
    };
    this.#queueTransition(nextTransition);
    void handler().catch((error) => void 0);
    return { committed, finished };
  };
  #queueTransition = (transition) => {
    this.#knownTransitions.add(transition);
  };
  #immediateTransition = (givenNavigationType, entry, transition, options) => {
    try {
      this.#transitionInProgressCount += 1;
      return this.#transition(givenNavigationType, entry, transition, options);
    } finally {
      this.#transitionInProgressCount -= 1;
    }
  };
  #rollback = (rollbackTransition, options) => {
    const previousEntries = rollbackTransition[NavigationTransitionInitialEntries];
    const previousIndex = rollbackTransition[NavigationTransitionInitialIndex];
    const previousCurrent = previousEntries[previousIndex];
    const entry = previousCurrent ? this.#cloneNavigationHistoryEntry(previousCurrent, options) : void 0;
    const nextOptions = {
      ...options,
      index: previousIndex,
      known: /* @__PURE__ */ new Set([...this.#known, ...previousEntries]),
      navigationType: entry?.[NavigationHistoryEntryNavigationType] ?? "replace",
      entries: previousEntries
    };
    const resolvedNavigationType = entry ? Rollback : Unset;
    const resolvedEntry = entry ?? this.#createNavigationHistoryEntry({
      getState: this[NavigationGetState2],
      navigationType: "replace",
      index: nextOptions.index,
      sameDocument: true,
      ...options
    });
    return this.#pushEntry(resolvedNavigationType, resolvedEntry, void 0, nextOptions);
  };
  #transition = (givenNavigationType, entry, transition, options) => {
    let navigationType = givenNavigationType;
    const performance2 = getPerformance();
    if (performance2 && entry.sameDocument && typeof navigationType === "string") {
      performance2?.mark?.(`same-document-navigation:${entry.id}`);
    }
    let currentEntryChangeEvent = false, committedCurrentEntryChange = false;
    const { currentEntry } = this;
    void this.#activeTransition?.finished?.catch((error) => error);
    void this.#activeTransition?.[NavigationTransitionFinishedDeferred]?.promise?.catch((error) => error);
    void this.#activeTransition?.[NavigationTransitionCommittedDeferred]?.promise?.catch((error) => error);
    this.#activeTransition?.[NavigationTransitionAbort]();
    this.#activeTransition = transition;
    const startEventPromise = transition.dispatchEvent({
      type: NavigationTransitionStart,
      transition,
      entry
    });
    const syncCommit = ({ entries, index, known }) => {
      if (transition.signal.aborted)
        return;
      this.#entries = entries;
      if (known) {
        this.#known = /* @__PURE__ */ new Set([...this.#known, ...known]);
      }
      this.#currentIndex = index;
      this[NavigationSetState](this.currentEntry);
    };
    const asyncCommit = async (commit) => {
      if (committedCurrentEntryChange) {
        return;
      }
      committedCurrentEntryChange = true;
      syncCommit(commit);
      const { entriesChange } = commit;
      const promises = [
        transition.dispatchEvent(createEvent({
          type: NavigationTransitionCommit,
          transition,
          entry
        }))
      ];
      if (entriesChange) {
        promises.push(this.dispatchEvent(createEvent({
          type: "entrieschange",
          ...entriesChange
        })));
      }
      await Promise.all(promises);
    };
    const unsetTransition = async () => {
      await startEventPromise;
      if (!(typeof options?.index === "number" && options.entries))
        throw new InvalidStateError();
      const previous = this.entries();
      const previousKeys = previous.map((entry2) => entry2.key);
      const keys = options.entries.map((entry2) => entry2.key);
      const removedEntries = previous.filter((entry2) => !keys.includes(entry2.key));
      const addedEntries = options.entries.filter((entry2) => !previousKeys.includes(entry2.key));
      await asyncCommit({
        entries: options.entries,
        index: options.index,
        known: options.known,
        entriesChange: removedEntries.length || addedEntries.length ? {
          removedEntries,
          addedEntries,
          updatedEntries: []
        } : void 0
      });
      await this.dispatchEvent(createEvent({
        type: "currententrychange"
      }));
      currentEntryChangeEvent = true;
      return entry;
    };
    const completeTransition = () => {
      if (givenNavigationType === Unset) {
        return unsetTransition();
      }
      const transitionResult = createNavigationTransition({
        currentEntry,
        currentIndex: this.#currentIndex,
        options,
        transition,
        known: this.#known,
        commit: asyncCommit,
        reportError: transition[NavigationTransitionRejected]
      });
      const microtask = new Promise(queueMicrotask);
      let promises = [];
      const iterator = transitionSteps(transitionResult)[Symbol.iterator]();
      const iterable = {
        [Symbol.iterator]: () => ({ next: () => iterator.next() })
      };
      async function syncTransition() {
        for (const promise of iterable) {
          if (isPromise(promise)) {
            promises.push(Promise.allSettled([
              promise
            ]).then(([result]) => result));
          }
          if (transition[NavigationTransitionCommitIsManual] || currentEntryChangeEvent && transition[NavigationTransitionIsAsync]) {
            return asyncTransition().then(syncTransition);
          }
          if (transition.signal.aborted) {
            break;
          }
        }
        if (promises.length) {
          return asyncTransition();
        }
      }
      async function asyncTransition() {
        const captured = [...promises];
        if (captured.length) {
          promises = [];
          const results = await Promise.all(captured);
          const rejected = results.filter(isPromiseRejectedResult);
          if (rejected.length === 1) {
            throw await Promise.reject(rejected[0]);
          } else if (rejected.length) {
            throw new AggregateError(rejected, rejected[0].reason?.message);
          }
        } else if (!transition[NavigationTransitionIsOngoing]) {
          await microtask;
        }
      }
      return syncTransition().then(() => transition[NavigationTransitionIsOngoing] ? void 0 : microtask).then(() => entry);
    };
    const dispose = async () => this.#dispose();
    function* transitionSteps(transitionResult) {
      const microtask = new Promise(queueMicrotask);
      const { currentEntryChange, navigate, waitForCommit, commit, abortController } = transitionResult;
      const navigateAbort = abortController.abort.bind(abortController);
      transition.signal.addEventListener("abort", navigateAbort, {
        once: true
      });
      if (typeof navigationType === "string" || navigationType === Rollback) {
        const promise = currentEntry?.dispatchEvent(createEvent({
          type: "navigatefrom",
          intercept: transition[NavigationIntercept],
          /**
           * @deprecated
           */
          transitionWhile: transition[NavigationIntercept]
        }));
        if (promise)
          yield promise;
      }
      if (typeof navigationType === "string") {
        yield transition.dispatchEvent(navigate);
      }
      if (!transition[NavigationTransitionCommitIsManual]) {
        commit();
      }
      yield waitForCommit;
      if (entry.sameDocument) {
        yield transition.dispatchEvent(currentEntryChange);
      }
      currentEntryChangeEvent = true;
      if (typeof navigationType === "string") {
        yield entry.dispatchEvent(createEvent({
          type: "navigateto",
          intercept: transition[NavigationIntercept],
          /**
           * @deprecated
           */
          transitionWhile: transition[NavigationIntercept]
        }));
      }
      yield dispose();
      if (!transition[NavigationTransitionPromises].size) {
        yield microtask;
      }
      yield transition.dispatchEvent({
        type: NavigationTransitionStartDeadline,
        transition,
        entry
      });
      yield transition[NavigationTransitionWait]();
      transition.signal.removeEventListener("abort", navigateAbort);
      yield transition[NavigationTransitionFinish]();
      if (typeof navigationType === "string") {
        yield transition.dispatchEvent(createEvent({
          type: "finish",
          intercept: transition[NavigationIntercept],
          /**
           * @deprecated
           */
          transitionWhile: transition[NavigationIntercept]
        }));
        yield transition.dispatchEvent(createEvent({
          type: "navigatesuccess",
          intercept: transition[NavigationIntercept],
          /**
           * @deprecated
           */
          transitionWhile: transition[NavigationIntercept]
        }));
      }
    }
    const maybeSyncTransition = () => {
      try {
        return completeTransition();
      } catch (error) {
        return Promise.reject(error);
      }
    };
    return Promise.allSettled([maybeSyncTransition()]).then(async ([detail]) => {
      if (detail.status === "rejected") {
        await transition.dispatchEvent({
          type: NavigationTransitionError,
          error: detail.reason,
          transition,
          entry
        });
      }
      await dispose();
      await transition.dispatchEvent({
        type: NavigationTransitionFinally,
        transition,
        entry
      });
      await transition[NavigationTransitionWait]();
      if (this.#activeTransition === transition) {
        this.#activeTransition = void 0;
      }
      if (entry.sameDocument && typeof navigationType === "string") {
        performance2.mark(`same-document-navigation-finish:${entry.id}`);
        performance2.measure(`same-document-navigation:${entry.url}`, `same-document-navigation:${entry.id}`, `same-document-navigation-finish:${entry.id}`);
      }
    }).then(() => entry);
  };
  #dispose = async () => {
    for (const known of this.#known) {
      const index = this.#entries.findIndex((entry) => entry.key === known.key);
      if (index !== -1) {
        continue;
      }
      this.#known.delete(known);
      const event = createEvent({
        type: "dispose",
        entry: known
      });
      this[NavigationDisposeState](known);
      await known.dispatchEvent(event);
      await this.dispatchEvent(event);
    }
  };
  reload(options) {
    const { currentEntry } = this;
    if (!currentEntry)
      throw new InvalidStateError();
    const entry = this.#cloneNavigationHistoryEntry(currentEntry, options);
    return this.#pushEntry("reload", entry, void 0, options);
  }
  updateCurrentEntry(options) {
    const { currentEntry } = this;
    if (!currentEntry) {
      throw new InvalidStateError("Expected current entry");
    }
    currentEntry[NavigationHistoryEntrySetState](options.state);
    this[NavigationSetState](currentEntry);
    const currentEntryChange = new NavigationCurrentEntryChangeEvent("currententrychange", {
      from: currentEntry,
      navigationType: void 0
    });
    const entriesChange = createEvent({
      type: "entrieschange",
      addedEntries: [],
      removedEntries: [],
      updatedEntries: [
        currentEntry
      ]
    });
    return Promise.all([
      this.dispatchEvent(currentEntryChange),
      this.dispatchEvent(entriesChange)
    ]);
  }
};
function getPerformance() {
  if (typeof performance !== "undefined") {
    return performance;
  }
  return {
    now() {
      return Date.now();
    },
    mark() {
    },
    measure() {
    }
  };
}

// ../node_modules/@virtualstate/navigation/esnext/get-navigation.js
var navigation;
function getNavigation() {
  if (globalNavigation) {
    return globalNavigation;
  }
  if (navigation) {
    return navigation;
  }
  return navigation = new Navigation();
}

// ../node_modules/@virtualstate/navigation/esnext/util/serialization.js
var GLOBAL_SERIALIZER = JSON;
function stringify(value) {
  return GLOBAL_SERIALIZER.stringify(value);
}
function parse(value) {
  return GLOBAL_SERIALIZER.parse(value);
}

// ../node_modules/@virtualstate/navigation/esnext/location.js
var AppLocationCheckChange = Symbol.for("@virtualstate/navigation/location/checkChange");
var AppLocationAwaitFinished = Symbol.for("@virtualstate/navigation/location/awaitFinished");
var AppLocationTransitionURL = Symbol.for("@virtualstate/navigation/location/transitionURL");
var AppLocationUrl = Symbol.for("@virtualstate/navigation/location/url");
var NAVIGATION_LOCATION_DEFAULT_URL = "https://html.spec.whatwg.org/";
var NavigationLocation = class {
  #options;
  #navigation;
  constructor(options) {
    this.#options = options;
    this.#navigation = options.navigation;
    const reset = () => {
      this.#transitioningURL = void 0;
      this.#baseURL = void 0;
    };
    this.#navigation.addEventListener("navigate", () => {
      const transition = this.#navigation.transition;
      if (transition && isCommittedAvailable(transition)) {
        transition[NavigationTransitionCommittedDeferred].promise.then(reset, reset);
      }
      function isCommittedAvailable(transition2) {
        return NavigationTransitionCommittedDeferred in transition2;
      }
    });
    this.#navigation.addEventListener("currententrychange", reset);
  }
  #urls = /* @__PURE__ */ new WeakMap();
  #transitioningURL;
  #baseURL;
  get [AppLocationUrl]() {
    if (this.#transitioningURL) {
      return this.#transitioningURL;
    }
    const { currentEntry } = this.#navigation;
    if (!currentEntry) {
      this.#baseURL = getBaseURL(this.#options.baseURL);
      return this.#baseURL;
    }
    const existing = this.#urls.get(currentEntry);
    if (existing)
      return existing;
    const next = new URL(currentEntry.url ?? NAVIGATION_LOCATION_DEFAULT_URL);
    this.#urls.set(currentEntry, next);
    return next;
  }
  get hash() {
    return this[AppLocationUrl].hash;
  }
  set hash(value) {
    this.#setUrlValue("hash", value);
  }
  get host() {
    return this[AppLocationUrl].host;
  }
  set host(value) {
    this.#setUrlValue("host", value);
  }
  get hostname() {
    return this[AppLocationUrl].hostname;
  }
  set hostname(value) {
    this.#setUrlValue("hostname", value);
  }
  get href() {
    return this[AppLocationUrl].href;
  }
  set href(value) {
    this.#setUrlValue("href", value);
  }
  get origin() {
    return this[AppLocationUrl].origin;
  }
  get pathname() {
    return this[AppLocationUrl].pathname;
  }
  set pathname(value) {
    this.#setUrlValue("pathname", value);
  }
  get port() {
    return this[AppLocationUrl].port;
  }
  set port(value) {
    this.#setUrlValue("port", value);
  }
  get protocol() {
    return this[AppLocationUrl].protocol;
  }
  set protocol(value) {
    this.#setUrlValue("protocol", value);
  }
  get search() {
    return this[AppLocationUrl].search;
  }
  set search(value) {
    this.#setUrlValue("search", value);
  }
  #setUrlValue = (key, value) => {
    const currentUrlString = this[AppLocationUrl].toString();
    let nextUrl;
    if (key === "href") {
      nextUrl = new URL(value, currentUrlString);
    } else {
      nextUrl = new URL(currentUrlString);
      nextUrl[key] = value;
    }
    const nextUrlString = nextUrl.toString();
    if (currentUrlString === nextUrlString) {
      return;
    }
    void this.#transitionURL(nextUrl, () => this.#navigation.navigate(nextUrlString));
  };
  replace(url) {
    return this.#transitionURL(url, (url2) => this.#navigation.navigate(url2.toString(), {
      history: "replace"
    }));
  }
  reload() {
    return this.#awaitFinished(this.#navigation.reload());
  }
  assign(url) {
    return this.#transitionURL(url, (url2) => this.#navigation.navigate(url2.toString()));
  }
  [AppLocationTransitionURL](url, fn) {
    return this.#transitionURL(url, fn);
  }
  #transitionURL = async (url, fn) => {
    const instance = this.#transitioningURL = typeof url === "string" ? new URL(url, this[AppLocationUrl].toString()) : url;
    try {
      await this.#awaitFinished(fn(instance));
    } finally {
      if (this.#transitioningURL === instance) {
        this.#transitioningURL = void 0;
      }
    }
  };
  [AppLocationAwaitFinished](result) {
    return this.#awaitFinished(result);
  }
  #awaitFinished = async (result) => {
    this.#baseURL = void 0;
    if (!result)
      return;
    const { committed, finished } = result;
    await Promise.all([
      committed || Promise.resolve(void 0),
      finished || Promise.resolve(void 0)
    ]);
  };
  #triggerIfUrlChanged = () => {
    const current = this[AppLocationUrl];
    const currentUrl = current.toString();
    const expectedUrl = this.#navigation.currentEntry?.url;
    if (currentUrl !== expectedUrl) {
      return this.#transitionURL(current, () => this.#navigation.navigate(currentUrl));
    }
  };
  /**
   * This is needed if you have changed searchParams using its mutating methods
   *
   * TODO replace get searchParams with an observable change to auto trigger this function
   */
  [AppLocationCheckChange]() {
    return this.#triggerIfUrlChanged();
  }
};

// ../node_modules/@virtualstate/navigation/esnext/history.js
var State = Symbol.for("@virtualstate/navigation/history/state");
var NavigationHistory = class extends NavigationLocation {
  #options;
  #navigation;
  constructor(options) {
    super(options);
    this.#options = options;
    this.#navigation = options.navigation;
  }
  get length() {
    return this.#navigation.entries().length;
  }
  scrollRestoration = "manual";
  get state() {
    const currentState = this.#navigation.currentEntry?.getState();
    if (typeof currentState === "string" || typeof currentState === "number" || typeof currentState === "boolean") {
      return currentState;
    }
    return this.#options[State] ?? void 0;
  }
  back() {
    const entries = this.#navigation.entries();
    const index = this.#navigation.currentEntry?.index ?? -1;
    const back = entries[index - 1];
    const url = back?.url;
    if (!url)
      throw new InvalidStateError("Cannot go back");
    return this[AppLocationTransitionURL](url, () => this.#navigation.back());
  }
  forward() {
    const entries = this.#navigation.entries();
    const index = this.#navigation.currentEntry?.index ?? -1;
    const forward = entries[index + 1];
    const url = forward?.url;
    if (!url)
      throw new InvalidStateError("Cannot go forward");
    return this[AppLocationTransitionURL](url, () => this.#navigation.forward());
  }
  go(delta) {
    if (typeof delta !== "number" || delta === 0 || isNaN(delta)) {
      return this[AppLocationAwaitFinished](this.#navigation.reload());
    }
    const entries = this.#navigation.entries();
    const { currentEntry } = this.#navigation;
    if (!currentEntry) {
      throw new Error(`Could not go ${delta}`);
    }
    const nextIndex = currentEntry.index + delta;
    const nextEntry = entries[nextIndex];
    if (!nextEntry) {
      throw new Error(`Could not go ${delta}`);
    }
    const nextEntryKey = nextEntry.key;
    return this[AppLocationAwaitFinished](this.#navigation.traverseTo(nextEntryKey));
  }
  replaceState(data, unused, url) {
    if (url) {
      return this[AppLocationTransitionURL](url, (url2) => this.#navigation.navigate(url2.toString(), {
        state: data,
        history: "replace"
      }));
    } else {
      return this.#navigation.updateCurrentEntry({
        state: data
      });
    }
  }
  pushState(data, unused, url) {
    if (url) {
      return this[AppLocationTransitionURL](url, (url2) => this.#navigation.navigate(url2.toString(), {
        state: data
      }));
    } else {
      return this.#navigation.updateCurrentEntry({
        state: data
      });
    }
  }
};

// ../node_modules/@virtualstate/navigation/esnext/global-window.js
var globalWindow = typeof window === "undefined" ? void 0 : window;

// ../node_modules/@virtualstate/navigation/esnext/global-self.js
var globalSelf = typeof self === "undefined" ? void 0 : self;

// ../node_modules/@virtualstate/navigation/esnext/get-polyfill.js
var NavigationKey = "__@virtualstate/navigation/key";
var NavigationMeta = "__@virtualstate/navigation/meta";
function getWindowHistory(givenWindow = globalWindow) {
  if (typeof givenWindow === "undefined")
    return void 0;
  return givenWindow.history;
}
function isStateHistoryMeta(state) {
  return like(state) && state[NavigationMeta] === true;
}
function isStateHistoryWithMeta(state) {
  return like(state) && isStateHistoryMeta(state[NavigationKey]);
}
function disposeHistoryState(entry, persist) {
  if (!persist)
    return;
  if (typeof sessionStorage === "undefined")
    return;
  sessionStorage.removeItem(entry.key);
}
function getEntries(navigation3, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
  let entries = navigation3.entries();
  if (typeof limit === "number") {
    entries = entries.slice(-limit);
  }
  return entries.map(({ id, key, url, sameDocument }) => ({
    id,
    key,
    url,
    sameDocument
  }));
}
function getNavigationEntryMeta(navigation3, entry, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
  return {
    [NavigationMeta]: true,
    currentIndex: entry.index,
    key: entry.key,
    entries: getEntries(navigation3, limit),
    state: entry.getState()
  };
}
function getNavigationEntryWithMeta(navigation3, entry, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
  return {
    [NavigationKey]: getNavigationEntryMeta(navigation3, entry, limit)
  };
}
function setHistoryState(navigation3, history2, entry, persist, limit) {
  setStateInSession();
  function getSerializableState() {
    return getNavigationEntryWithMeta(navigation3, entry, limit);
  }
  function setStateInSession() {
    if (typeof sessionStorage === "undefined")
      return;
    try {
      const raw = stringify(getSerializableState());
      sessionStorage.setItem(entry.key, raw);
    } catch {
    }
  }
}
function getHistoryState(history2, entry) {
  return getStateFromHistoryIfMatchingKey() ?? getStateFromSession();
  function getStateFromHistoryDirectly() {
    try {
      return history2.state;
    } catch {
      return void 0;
    }
  }
  function getBaseState() {
    const value = history2.originalState ?? getStateFromHistoryDirectly();
    return like(value) ? value : void 0;
  }
  function getStateFromHistoryIfMatchingKey() {
    const state = getBaseState();
    if (!isStateHistoryWithMeta(state))
      return void 0;
    if (state[NavigationKey].key !== entry.key)
      return void 0;
    return state[NavigationKey].state;
  }
  function getStateFromSession() {
    if (typeof sessionStorage === "undefined")
      return void 0;
    try {
      const raw = sessionStorage.getItem(entry.key);
      if (!raw)
        return void 0;
      const state = parse(raw);
      if (!like(state))
        return void 0;
      if (!isStateHistoryWithMeta(state))
        return void 0;
      return state[NavigationKey].state;
    } catch {
      return void 0;
    }
  }
}
var DEFAULT_POLYFILL_OPTIONS = Object.freeze({
  persist: true,
  persistState: true,
  history: true,
  limit: 50,
  patch: true,
  interceptEvents: true
});
function isNavigationPolyfill(navigation3) {
  return like(navigation3) && typeof navigation3[NavigationSetEntries] === "function" && typeof navigation3[NavigationSetCurrentKey] === "function";
}
function getNavigationOnlyPolyfill(givenNavigation) {
  const entries = [
    {
      key: v4()
    }
  ];
  const navigation3 = givenNavigation ?? new Navigation({
    entries
  });
  const history2 = new NavigationHistory({
    navigation: navigation3
  });
  return {
    navigation: navigation3,
    history: history2,
    apply() {
      if (isNavigationPolyfill(givenNavigation) && !navigation3.entries().length) {
        givenNavigation[NavigationSetEntries](entries);
      }
    }
  };
}
function interceptWindowClicks(navigation3, window2) {
  function clickCallback(ev, aEl) {
    process();
    function process() {
      if (!isAppNavigation(ev))
        return;
      ok2(ev);
      const options = {
        history: "auto",
        [NavigationUserInitiated]: true,
        [NavigationDownloadRequest]: aEl.download,
        [NavigationOriginalEvent]: ev
      };
      navigation3.navigate(aEl.href, options);
    }
  }
  function submitCallback(ev, form) {
    process();
    function process() {
      if (ev.defaultPrevented)
        return;
      const method = ev.submitter && "formMethod" in ev.submitter && ev.submitter.formMethod ? ev.submitter.formMethod : form.method;
      if (method === "dialog")
        return;
      const action = ev.submitter && "formAction" in ev.submitter && ev.submitter.formAction ? ev.submitter.formAction : form.action;
      let formData;
      try {
        formData = new FormData(form);
      } catch {
        formData = new FormData(void 0);
      }
      const params = method === "get" ? new URLSearchParams([...formData].map(([k, v]) => v instanceof File ? [k, v.name] : [k, v])) : void 0;
      const navFormData = method === "post" ? formData : void 0;
      const url = new URL(action, navigation3.currentEntry.url);
      if (params)
        url.search = params.toString();
      const unknownEvent = ev;
      ok2(unknownEvent);
      const options = {
        history: "auto",
        [NavigationUserInitiated]: true,
        [NavigationFormData]: navFormData,
        [NavigationOriginalEvent]: unknownEvent
      };
      navigation3.navigate(url.href, options);
    }
  }
  window2.addEventListener("click", (ev) => {
    if (ev.target?.ownerDocument === window2.document) {
      const aEl = getAnchorFromEvent(ev);
      if (like(aEl)) {
        clickCallback(ev, aEl);
      }
    }
  });
  window2.addEventListener("submit", (ev) => {
    if (ev.target?.ownerDocument === window2.document) {
      const form = getFormFromEvent(ev);
      if (like(form)) {
        submitCallback(ev, form);
      }
    }
  });
}
function getAnchorFromEvent(event) {
  return matchesAncestor(getComposedPathTarget(event), "a[href]:not([data-navigation-ignore])");
}
function getFormFromEvent(event) {
  return matchesAncestor(getComposedPathTarget(event), "form:not([data-navigation-ignore])");
}
function getComposedPathTarget(event) {
  if (!event.composedPath) {
    return event.target;
  }
  const targets = event.composedPath();
  return targets[0] ?? event.target;
}
function patchGlobalScope(window2, history2, navigation3) {
  patchGlobals();
  patchPopState();
  patchHistory();
  function patchWindow(window3) {
    try {
      Object.defineProperty(window3, "navigation", {
        value: navigation3
      });
    } catch (e) {
    }
    if (!window3.history) {
      try {
        Object.defineProperty(window3, "history", {
          value: history2
        });
      } catch (e) {
      }
    }
  }
  function patchGlobals() {
    patchWindow(window2);
    if (window2 !== globalWindow)
      return;
    if (globalSelf) {
      try {
        Object.defineProperty(globalSelf, "navigation", {
          value: navigation3
        });
      } catch (e) {
      }
    }
    if (typeof globalThis !== "undefined") {
      try {
        Object.defineProperty(globalThis, "navigation", {
          value: navigation3
        });
      } catch (e) {
      }
    }
  }
  function patchHistory() {
    if (history2 instanceof NavigationHistory) {
      return;
    }
    const polyfillHistory = new NavigationHistory({
      navigation: navigation3
    });
    const pushState = polyfillHistory.pushState.bind(polyfillHistory);
    const replaceState = polyfillHistory.replaceState.bind(polyfillHistory);
    const go = polyfillHistory.go.bind(polyfillHistory);
    const back = polyfillHistory.back.bind(polyfillHistory);
    const forward = polyfillHistory.forward.bind(polyfillHistory);
    const prototype = Object.getPrototypeOf(history2);
    const descriptor = {
      pushState: {
        ...Object.getOwnPropertyDescriptor(prototype, "pushState"),
        value: pushState
      },
      replaceState: {
        ...Object.getOwnPropertyDescriptor(prototype, "replaceState"),
        value: replaceState
      },
      go: {
        ...Object.getOwnPropertyDescriptor(prototype, "go"),
        value: go
      },
      back: {
        ...Object.getOwnPropertyDescriptor(prototype, "back"),
        value: back
      },
      forward: {
        ...Object.getOwnPropertyDescriptor(prototype, "forward"),
        value: forward
      }
    };
    Object.defineProperties(prototype, descriptor);
    const stateDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(history2), "state");
    Object.defineProperty(history2, "state", {
      ...stateDescriptor,
      get() {
        return polyfillHistory.state;
      }
    });
    Object.defineProperty(history2, "originalState", {
      ...stateDescriptor
    });
  }
  function patchPopState() {
    if (!window2.PopStateEvent)
      return;
    const popStateEventPrototype = window2.PopStateEvent.prototype;
    if (!popStateEventPrototype)
      return;
    const descriptor = Object.getOwnPropertyDescriptor(popStateEventPrototype, "state");
    Object.defineProperty(popStateEventPrototype, "state", {
      ...descriptor,
      get() {
        const original = descriptor.get.call(this);
        if (!isStateHistoryWithMeta(original))
          return original;
        return original[NavigationKey].state;
      }
    });
    Object.defineProperty(popStateEventPrototype, "originalState", {
      ...descriptor
    });
  }
}
function getCompletePolyfill(options = DEFAULT_POLYFILL_OPTIONS) {
  const { persist: PERSIST_ENTRIES, persistState: PERSIST_ENTRIES_STATE, history: givenHistory, limit: patchLimit, patch: PATCH_HISTORY, interceptEvents: INTERCEPT_EVENTS, window: givenWindow = globalWindow, navigation: givenNavigation } = {
    // These are super default options, if the object de
    ...DEFAULT_POLYFILL_OPTIONS,
    ...options
  };
  const IS_PERSIST = PERSIST_ENTRIES || PERSIST_ENTRIES_STATE;
  const window2 = givenWindow ?? globalWindow;
  const history2 = options.history && typeof options.history !== "boolean" ? options.history : getWindowHistory(window2);
  if (!history2) {
    return getNavigationOnlyPolyfill();
  }
  ok2(window2, "window required when using polyfill with history, this shouldn't be seen");
  const historyInitialState = history2?.state;
  let initialMeta = {
    [NavigationMeta]: true,
    currentIndex: -1,
    entries: [],
    key: "",
    state: void 0
  };
  if (isStateHistoryWithMeta(historyInitialState)) {
    initialMeta = historyInitialState[NavigationKey];
  }
  let initialEntries = initialMeta.entries;
  const HISTORY_INTEGRATION = !!((givenWindow || givenHistory) && history2);
  if (!initialEntries.length) {
    let url = void 0;
    if (window2.location?.href) {
      url = window2.location.href;
    }
    let state = void 0;
    if (!isStateHistoryWithMeta(historyInitialState) && !isStateHistoryMeta(historyInitialState)) {
      state = historyInitialState;
    }
    const key = v4();
    initialEntries = [
      {
        key,
        state,
        url
      }
    ];
    initialMeta.key = key;
    initialMeta.currentIndex = 0;
  }
  const navigationOptions = {
    entries: initialEntries,
    currentIndex: initialMeta?.currentIndex,
    currentKey: initialMeta?.key,
    getState(entry) {
      if (!HISTORY_INTEGRATION)
        return;
      return getHistoryState(history2, entry);
    },
    setState(entry) {
      if (!HISTORY_INTEGRATION)
        return;
      if (!entry.sameDocument)
        return;
      setHistoryState(navigation3, history2, entry, IS_PERSIST, patchLimit);
    },
    disposeState(entry) {
      if (!HISTORY_INTEGRATION)
        return;
      disposeHistoryState(entry, IS_PERSIST);
    }
  };
  const navigation3 = givenNavigation ?? new Navigation(navigationOptions);
  const pushState = history2?.pushState.bind(history2);
  const replaceState = history2?.replaceState.bind(history2);
  const historyGo = history2?.go.bind(history2);
  return {
    navigation: navigation3,
    history: history2,
    apply() {
      if (isNavigationPolyfill(navigation3)) {
        navigation3[NavigationSetOptions](navigationOptions);
      }
      if (HISTORY_INTEGRATION) {
        const ignorePopState = /* @__PURE__ */ new Set();
        const ignoreCurrentEntryChange = /* @__PURE__ */ new Set();
        navigation3.addEventListener("navigate", (event) => {
          if (event.destination.sameDocument) {
            return;
          }
          event.intercept({
            // Set commit after transition... and never commit!
            commit: "after-transition",
            async handler() {
              queueMicrotask(() => {
                if (event.signal.aborted)
                  return;
                submit();
              });
            }
          });
          function submit() {
            if (like(event.originalEvent)) {
              const anchor = getAnchorFromEvent(event.originalEvent);
              if (anchor) {
                return submitAnchor(anchor);
              } else {
                const form = getFormFromEvent(event.originalEvent);
                if (form) {
                  return submitForm(form);
                }
              }
            }
            location.href = event.destination.url;
          }
          function submitAnchor(element) {
            const cloned = element.cloneNode();
            cloned.setAttribute("data-navigation-ignore", "1");
            cloned.click();
          }
          function submitForm(element) {
            const cloned = element.cloneNode();
            cloned.setAttribute("data-navigation-ignore", "1");
            cloned.submit();
          }
        });
        navigation3.addEventListener("currententrychange", ({ navigationType, from }) => {
          const { currentEntry } = navigation3;
          if (!currentEntry)
            return;
          const { key, url } = currentEntry;
          if (ignoreCurrentEntryChange.delete(key) || !currentEntry?.sameDocument)
            return;
          const historyState = getNavigationEntryWithMeta(navigation3, currentEntry, patchLimit);
          switch (navigationType || "replace") {
            case "push":
              return pushState(historyState, "", url);
            case "replace":
              return replaceState(historyState, "", url);
            case "traverse":
              const delta = currentEntry.index - from.index;
              ignorePopState.add(key);
              return historyGo(delta);
            case "reload":
          }
        });
        window2.addEventListener("popstate", (event) => {
          const { state, originalState } = event;
          const foundState = originalState ?? state;
          if (!isStateHistoryWithMeta(foundState))
            return;
          const { [NavigationKey]: { key } } = foundState;
          if (ignorePopState.delete(key))
            return;
          ignoreCurrentEntryChange.add(key);
          let committed;
          try {
            committed = navigation3.traverseTo(key).committed;
          } catch (error) {
            if (error instanceof InvalidStateError && !PERSIST_ENTRIES) {
              return;
            }
            throw error;
          }
          if (PERSIST_ENTRIES || PERSIST_ENTRIES_STATE) {
            committed.then((entry) => {
              const historyState = getNavigationEntryWithMeta(navigation3, entry, patchLimit);
              replaceState(historyState, "", entry.url);
            }).catch(() => {
            });
          }
        });
      }
      if (INTERCEPT_EVENTS) {
        interceptWindowClicks(navigation3, window2);
      }
      if (PATCH_HISTORY) {
        patchGlobalScope(window2, history2, navigation3);
      }
      if (!history2.state) {
        const historyState = getNavigationEntryWithMeta(navigation3, navigation3.currentEntry, patchLimit);
        replaceState(historyState, "", navigation3.currentEntry.url);
      }
    }
  };
}
function isAppNavigation(evt) {
  return evt.button === 0 && !evt.defaultPrevented && !evt.metaKey && !evt.altKey && !evt.ctrlKey && !evt.shiftKey;
}
function matchesAncestor(givenElement, selector) {
  let element = getDefaultElement();
  while (element) {
    if (element.matches(selector)) {
      ok2(element);
      return element;
    }
    element = element.parentElement ?? element.getRootNode()?.host;
  }
  return void 0;
  function getDefaultElement() {
    if (!givenElement)
      return void 0;
    if (givenElement.matches instanceof Function)
      return givenElement;
    return givenElement.parentElement;
  }
}

// ../node_modules/@virtualstate/navigation/esnext/apply-polyfill.js
function applyPolyfill(options = DEFAULT_POLYFILL_OPTIONS) {
  const { apply, navigation: navigation3 } = getCompletePolyfill(options);
  apply();
  return navigation3;
}
function shouldApplyPolyfill(navigation3 = getNavigation()) {
  return navigation3 !== globalNavigation && !globalNavigation && typeof window !== "undefined";
}

// ../node_modules/@virtualstate/navigation/esnext/polyfill.js
var navigation2 = getNavigation();
if (shouldApplyPolyfill(navigation2)) {
  try {
    applyPolyfill({
      navigation: navigation2
    });
  } catch (error) {
    console.error("Failed to apply polyfill");
    console.error(error);
  }
}

// js/phoenix_live_view/constants.js
var CONSECUTIVE_RELOADS = "consecutive-reloads";
var MAX_RELOADS = 10;
var RELOAD_JITTER_MIN = 5e3;
var RELOAD_JITTER_MAX = 1e4;
var FAILSAFE_JITTER = 3e4;
var PHX_EVENT_CLASSES = [
  "phx-click-loading",
  "phx-change-loading",
  "phx-submit-loading",
  "phx-keydown-loading",
  "phx-keyup-loading",
  "phx-blur-loading",
  "phx-focus-loading",
  "phx-hook-loading"
];
var PHX_COMPONENT = "data-phx-component";
var PHX_LIVE_LINK = "data-phx-link";
var PHX_TRACK_STATIC = "track-static";
var PHX_LINK_STATE = "data-phx-link-state";
var PHX_REF = "data-phx-ref";
var PHX_REF_SRC = "data-phx-ref-src";
var PHX_TRACK_UPLOADS = "track-uploads";
var PHX_UPLOAD_REF = "data-phx-upload-ref";
var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
var PHX_DONE_REFS = "data-phx-done-refs";
var PHX_DROP_TARGET = "drop-target";
var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
var PHX_SKIP = "data-phx-skip";
var PHX_MAGIC_ID = "data-phx-id";
var PHX_PRUNE = "data-phx-prune";
var PHX_PAGE_LOADING = "page-loading";
var PHX_CONNECTED_CLASS = "phx-connected";
var PHX_LOADING_CLASS = "phx-loading";
var PHX_NO_FEEDBACK_CLASS = "phx-no-feedback";
var PHX_ERROR_CLASS = "phx-error";
var PHX_CLIENT_ERROR_CLASS = "phx-client-error";
var PHX_SERVER_ERROR_CLASS = "phx-server-error";
var PHX_PARENT_ID = "data-phx-parent-id";
var PHX_MAIN = "data-phx-main";
var PHX_ROOT_ID = "data-phx-root-id";
var PHX_VIEWPORT_TOP = "viewport-top";
var PHX_VIEWPORT_BOTTOM = "viewport-bottom";
var PHX_TRIGGER_ACTION = "trigger-action";
var PHX_FEEDBACK_FOR = "feedback-for";
var PHX_FEEDBACK_GROUP = "feedback-group";
var PHX_HAS_FOCUSED = "phx-has-focused";
var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
var CHECKABLE_INPUTS = ["checkbox", "radio"];
var PHX_HAS_SUBMITTED = "phx-has-submitted";
var PHX_SESSION = "data-phx-session";
var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
var PHX_STICKY = "data-phx-sticky";
var PHX_STATIC = "data-phx-static";
var PHX_READONLY = "data-phx-readonly";
var PHX_DISABLED = "data-phx-disabled";
var PHX_DISABLE_WITH = "disable-with";
var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
var PHX_HOOK = "hook";
var PHX_DEBOUNCE = "debounce";
var PHX_THROTTLE = "throttle";
var PHX_UPDATE = "update";
var PHX_STREAM = "stream";
var PHX_STREAM_REF = "data-phx-stream";
var PHX_KEY = "key";
var PHX_PRIVATE = "phxPrivate";
var PHX_AUTO_RECOVER = "auto-recover";
var PHX_LV_DEBUG = "phx:live-socket:debug";
var PHX_LV_PROFILE = "phx:live-socket:profiling";
var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
var PHX_PROGRESS = "progress";
var PHX_MOUNTED = "mounted";
var LOADER_TIMEOUT = 1;
var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
var BINDING_PREFIX = "phx-";
var PUSH_TIMEOUT = 3e4;
var DEBOUNCE_TRIGGER = "debounce-trigger";
var THROTTLED = "throttled";
var DEBOUNCE_PREV_KEY = "debounce-prev-key";
var DEFAULTS = {
  debounce: 300,
  throttle: 300
};
var DYNAMICS = "d";
var STATIC = "s";
var ROOT = "r";
var COMPONENTS = "c";
var EVENTS = "e";
var REPLY = "r";
var TITLE = "t";
var TEMPLATES = "p";
var STREAM = "stream";

// js/phoenix_live_view/entry_uploader.js
var EntryUploader = class {
  constructor(entry, chunkSize, liveSocket) {
    this.liveSocket = liveSocket;
    this.entry = entry;
    this.offset = 0;
    this.chunkSize = chunkSize;
    this.chunkTimer = null;
    this.errored = false;
    this.uploadChannel = liveSocket.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
  }
  error(reason) {
    if (this.errored) {
      return;
    }
    this.uploadChannel.leave();
    this.errored = true;
    clearTimeout(this.chunkTimer);
    this.entry.error(reason);
  }
  upload() {
    this.uploadChannel.onError((reason) => this.error(reason));
    this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
  }
  isDone() {
    return this.offset >= this.entry.file.size;
  }
  readNextChunk() {
    let reader = new window.FileReader();
    let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
    reader.onload = (e) => {
      if (e.target.error === null) {
        this.offset += e.target.result.byteLength;
        this.pushChunk(e.target.result);
      } else {
        return logError("Read error: " + e.target.error);
      }
    };
    reader.readAsArrayBuffer(blob);
  }
  pushChunk(chunk) {
    if (!this.uploadChannel.isJoined()) {
      return;
    }
    this.uploadChannel.push("chunk", chunk).receive("ok", () => {
      this.entry.progress(this.offset / this.entry.file.size * 100);
      if (!this.isDone()) {
        this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
      }
    }).receive("error", ({ reason }) => this.error(reason));
  }
};

// js/phoenix_live_view/utils.js
var logError = (msg, obj) => console.error && console.error(msg, obj);
var isCid = (cid) => {
  let type = typeof cid;
  return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
};
function detectDuplicateIds() {
  let ids = /* @__PURE__ */ new Set();
  let elems = document.querySelectorAll("*[id]");
  for (let i = 0, len = elems.length; i < len; i++) {
    if (ids.has(elems[i].id)) {
      console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
    } else {
      ids.add(elems[i].id);
    }
  }
}
var debug = (view, kind, msg, obj) => {
  if (view.liveSocket.isDebugEnabled()) {
    console.log(`${view.id} ${kind}: ${msg} - `, obj);
  }
};
var closure = (val) => typeof val === "function" ? val : function() {
  return val;
};
var clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
var closestPhxBinding = (el, binding, borderEl) => {
  do {
    if (el.matches(`[${binding}]`) && !el.disabled) {
      return el;
    }
    el = el.parentElement || el.parentNode;
  } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
  return null;
};
var isObject = (obj) => {
  return obj !== null && typeof obj === "object" && !(obj instanceof Array);
};
var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
var isEmpty = (obj) => {
  for (let x in obj) {
    return false;
  }
  return true;
};
var maybe = (el, callback) => el && callback(el);
var channelUploader = function(entries, onError, resp, liveSocket) {
  entries.forEach((entry) => {
    let entryUploader = new EntryUploader(entry, resp.config.chunk_size, liveSocket);
    entryUploader.upload();
  });
};

// js/phoenix_live_view/browser.js
var Browser = {
  canPushState() {
    return typeof history.pushState !== "undefined";
  },
  dropLocal(localStorage, namespace, subkey) {
    return localStorage.removeItem(this.localKey(namespace, subkey));
  },
  updateLocal(localStorage, namespace, subkey, initial, func) {
    let current = this.getLocal(localStorage, namespace, subkey);
    let key = this.localKey(namespace, subkey);
    let newVal = current === null ? initial : func(current);
    localStorage.setItem(key, JSON.stringify(newVal));
    return newVal;
  },
  getLocal(localStorage, namespace, subkey) {
    return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
  },
  updateCurrentState(callback) {
    if (!this.canPushState()) {
      return;
    }
    history.replaceState(callback(history.state || {}), "", window.location.href);
  },
  pushState(kind, meta, to) {
    if (this.canPushState()) {
      if (to !== window.location.href) {
        if (meta.type == "redirect" && meta.scroll) {
          let currentState = history.state || {};
          currentState.scroll = meta.scroll;
          history.replaceState(currentState, "", window.location.href);
        }
        delete meta.scroll;
        history[kind + "State"](meta, "", to || null);
        let hashEl = this.getHashTargetEl(window.location.hash);
        if (hashEl) {
          hashEl.scrollIntoView();
        } else if (meta.type === "redirect") {
          window.scroll(0, 0);
        }
      }
    } else {
      this.redirect(to);
    }
  },
  setCookie(name, value) {
    document.cookie = `${name}=${value}`;
  },
  getCookie(name) {
    return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
  },
  redirect(toURL, flash) {
    if (flash) {
      Browser.setCookie("__phoenix_flash__", flash + "; max-age=60000; path=/");
    }
    window.location = toURL;
  },
  localKey(namespace, subkey) {
    return `${namespace}-${subkey}`;
  },
  getHashTargetEl(maybeHash) {
    let hash = maybeHash.toString().substring(1);
    if (hash === "") {
      return;
    }
    return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
  }
};
var browser_default = Browser;

// js/phoenix_live_view/aria.js
var ARIA = {
  focusMain() {
    let target = document.querySelector("main h1, main, h1");
    if (target) {
      let origTabIndex = target.tabIndex;
      target.tabIndex = -1;
      target.focus();
      target.tabIndex = origTabIndex;
    }
  },
  anyOf(instance, classes) {
    return classes.find((name) => instance instanceof name);
  },
  isFocusable(el, interactiveOnly) {
    return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== void 0 || !el.disabled && this.anyOf(el, [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement]) || el instanceof HTMLIFrameElement || (el.tabIndex > 0 || !interactiveOnly && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true");
  },
  attemptFocus(el, interactiveOnly) {
    if (this.isFocusable(el, interactiveOnly)) {
      try {
        el.focus();
      } catch (e) {
      }
    }
    return !!document.activeElement && document.activeElement.isSameNode(el);
  },
  focusFirstInteractive(el) {
    let child = el.firstElementChild;
    while (child) {
      if (this.attemptFocus(child, true) || this.focusFirstInteractive(child, true)) {
        return true;
      }
      child = child.nextElementSibling;
    }
  },
  focusFirst(el) {
    let child = el.firstElementChild;
    while (child) {
      if (this.attemptFocus(child) || this.focusFirst(child)) {
        return true;
      }
      child = child.nextElementSibling;
    }
  },
  focusLast(el) {
    let child = el.lastElementChild;
    while (child) {
      if (this.attemptFocus(child) || this.focusLast(child)) {
        return true;
      }
      child = child.previousElementSibling;
    }
  }
};
var aria_default = ARIA;

// js/phoenix_live_view/js.js
var focusStack = [];
var default_transition_time = 200;
var JS = {
  exec(eventType, phxEvent, view, sourceEl, defaults) {
    let [defaultKind, defaultArgs] = defaults || [null, { callback: defaults && defaults.callback }];
    let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
    commands.forEach(([kind, args]) => {
      if (kind === defaultKind && defaultArgs.data) {
        args.data = Object.assign(args.data || {}, defaultArgs.data);
        args.callback = args.callback || defaultArgs.callback;
      }
      this.filterToEls(sourceEl, args).forEach((el) => {
        this[`exec_${kind}`](eventType, phxEvent, view, sourceEl, el, args);
      });
    });
  },
  isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
  },
  // returns true if any part of the element is inside the viewport
  isInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    return rect.right > 0 && rect.bottom > 0 && rect.left < windowWidth && rect.top < windowHeight;
  },
  // private
  // commands
  exec_exec(eventType, phxEvent, view, sourceEl, el, { attr, to }) {
    let nodes = to ? dom_default.all(document, to) : [sourceEl];
    nodes.forEach((node) => {
      let encodedJS = node.getAttribute(attr);
      if (!encodedJS) {
        throw new Error(`expected ${attr} to contain JS command on "${to}"`);
      }
      view.liveSocket.execJS(node, encodedJS, eventType);
    });
  },
  exec_dispatch(eventType, phxEvent, view, sourceEl, el, { to, event, detail, bubbles }) {
    detail = detail || {};
    detail.dispatcher = sourceEl;
    dom_default.dispatchEvent(el, event, { detail, bubbles });
  },
  exec_push(eventType, phxEvent, view, sourceEl, el, args) {
    let { event, data, target, page_loading, loading, value, dispatcher, callback } = args;
    let pushOpts = { loading, value, target, page_loading: !!page_loading };
    let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
    let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
    view.withinTargets(phxTarget, (targetView, targetCtx) => {
      if (!targetView.isConnected()) {
        return;
      }
      if (eventType === "change") {
        let { newCid, _target } = args;
        _target = _target || (dom_default.isFormInput(sourceEl) ? sourceEl.name : void 0);
        if (_target) {
          pushOpts._target = _target;
        }
        targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
      } else if (eventType === "submit") {
        let { submitter } = args;
        targetView.submitForm(sourceEl, targetCtx, event || phxEvent, submitter, pushOpts, callback);
      } else {
        targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts, callback);
      }
    });
  },
  exec_navigate(eventType, phxEvent, view, sourceEl, el, { href, replace }) {
    view.liveSocket.historyRedirect(href, replace ? "replace" : "push");
  },
  exec_patch(eventType, phxEvent, view, sourceEl, el, { href, replace }) {
    view.liveSocket.pushHistoryPatch(href, replace ? "replace" : "push", sourceEl);
  },
  exec_focus(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => aria_default.attemptFocus(el));
  },
  exec_focus_first(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el));
  },
  exec_push_focus(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => focusStack.push(el || sourceEl));
  },
  exec_pop_focus(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => {
      const el2 = focusStack.pop();
      if (el2) {
        el2.focus();
      }
    });
  },
  exec_add_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
    this.addOrRemoveClasses(el, names, [], transition, time, view);
  },
  exec_remove_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
    this.addOrRemoveClasses(el, [], names, transition, time, view);
  },
  exec_toggle_class(eventType, phxEvent, view, sourceEl, el, { to, names, transition, time }) {
    this.toggleClasses(el, names, transition, time, view);
  },
  exec_toggle_attr(eventType, phxEvent, view, sourceEl, el, { attr: [attr, val1, val2] }) {
    if (el.hasAttribute(attr)) {
      if (val2 !== void 0) {
        if (el.getAttribute(attr) === val1) {
          this.setOrRemoveAttrs(el, [[attr, val2]], []);
        } else {
          this.setOrRemoveAttrs(el, [[attr, val1]], []);
        }
      } else {
        this.setOrRemoveAttrs(el, [], [attr]);
      }
    } else {
      this.setOrRemoveAttrs(el, [[attr, val1]], []);
    }
  },
  exec_transition(eventType, phxEvent, view, sourceEl, el, { time, transition }) {
    this.addOrRemoveClasses(el, [], [], transition, time, view);
  },
  exec_toggle(eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time }) {
    this.toggle(eventType, view, el, display, ins, outs, time);
  },
  exec_show(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
    this.show(eventType, view, el, display, transition, time);
  },
  exec_hide(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
    this.hide(eventType, view, el, display, transition, time);
  },
  exec_set_attr(eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
    this.setOrRemoveAttrs(el, [[attr, val]], []);
  },
  exec_remove_attr(eventType, phxEvent, view, sourceEl, el, { attr }) {
    this.setOrRemoveAttrs(el, [], [attr]);
  },
  // utils for commands
  show(eventType, view, el, display, transition, time) {
    if (!this.isVisible(el)) {
      this.toggle(eventType, view, el, display, transition, null, time);
    }
  },
  hide(eventType, view, el, display, transition, time) {
    if (this.isVisible(el)) {
      this.toggle(eventType, view, el, display, null, transition, time);
    }
  },
  toggle(eventType, view, el, display, ins, outs, time) {
    time = time || default_transition_time;
    let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
    let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
    if (inClasses.length > 0 || outClasses.length > 0) {
      if (this.isVisible(el)) {
        let onStart = () => {
          this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, outClasses, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
          });
        };
        el.dispatchEvent(new Event("phx:hide-start"));
        view.transition(time, onStart, () => {
          this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
          el.dispatchEvent(new Event("phx:hide-end"));
        });
      } else {
        if (eventType === "remove") {
          return;
        }
        let onStart = () => {
          this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
          let stickyDisplay = display || this.defaultDisplay(el);
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, inClasses, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, inEndClasses, inStartClasses));
          });
        };
        el.dispatchEvent(new Event("phx:show-start"));
        view.transition(time, onStart, () => {
          this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
          el.dispatchEvent(new Event("phx:show-end"));
        });
      }
    } else {
      if (this.isVisible(el)) {
        window.requestAnimationFrame(() => {
          el.dispatchEvent(new Event("phx:hide-start"));
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
          el.dispatchEvent(new Event("phx:hide-end"));
        });
      } else {
        window.requestAnimationFrame(() => {
          el.dispatchEvent(new Event("phx:show-start"));
          let stickyDisplay = display || this.defaultDisplay(el);
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
          el.dispatchEvent(new Event("phx:show-end"));
        });
      }
    }
  },
  toggleClasses(el, classes, transition, time, view) {
    window.requestAnimationFrame(() => {
      let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
      let newAdds = classes.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
      let newRemoves = classes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
      this.addOrRemoveClasses(el, newAdds, newRemoves, transition, time, view);
    });
  },
  addOrRemoveClasses(el, adds, removes, transition, time, view) {
    time = time || default_transition_time;
    let [transitionRun, transitionStart, transitionEnd] = transition || [[], [], []];
    if (transitionRun.length > 0) {
      let onStart = () => {
        this.addOrRemoveClasses(el, transitionStart, [].concat(transitionRun).concat(transitionEnd));
        window.requestAnimationFrame(() => {
          this.addOrRemoveClasses(el, transitionRun, []);
          window.requestAnimationFrame(() => this.addOrRemoveClasses(el, transitionEnd, transitionStart));
        });
      };
      let onDone = () => this.addOrRemoveClasses(el, adds.concat(transitionEnd), removes.concat(transitionRun).concat(transitionStart));
      return view.transition(time, onStart, onDone);
    }
    window.requestAnimationFrame(() => {
      let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
      let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
      let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
      let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
      let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
      dom_default.putSticky(el, "classes", (currentEl) => {
        currentEl.classList.remove(...newRemoves);
        currentEl.classList.add(...newAdds);
        return [newAdds, newRemoves];
      });
    });
  },
  setOrRemoveAttrs(el, sets, removes) {
    let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
    let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
    let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
    let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
    dom_default.putSticky(el, "attrs", (currentEl) => {
      newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
      newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
      return [newSets, newRemoves];
    });
  },
  hasAllClasses(el, classes) {
    return classes.every((name) => el.classList.contains(name));
  },
  isToggledOut(el, outClasses) {
    return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
  },
  filterToEls(sourceEl, { to }) {
    return to ? dom_default.all(document, to) : [sourceEl];
  },
  defaultDisplay(el) {
    return { tr: "table-row", td: "table-cell" }[el.tagName.toLowerCase()] || "block";
  }
};
var js_default = JS;

// js/phoenix_live_view/dom.js
var DOM = {
  byId(id) {
    return document.getElementById(id) || logError(`no id found for ${id}`);
  },
  removeClass(el, className) {
    el.classList.remove(className);
    if (el.classList.length === 0) {
      el.removeAttribute("class");
    }
  },
  all(node, query, callback) {
    if (!node) {
      return [];
    }
    let array = Array.from(node.querySelectorAll(query));
    return callback ? array.forEach(callback) : array;
  },
  childNodeLength(html) {
    let template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childElementCount;
  },
  isUploadInput(el) {
    return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
  },
  isAutoUpload(inputEl) {
    return inputEl.hasAttribute("data-phx-auto-upload");
  },
  findUploadInputs(node) {
    const formId = node.id;
    const inputsOutsideForm = this.all(document, `input[type="file"][${PHX_UPLOAD_REF}][form="${formId}"]`);
    return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`).concat(inputsOutsideForm);
  },
  findComponentNodeList(node, cid) {
    return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
  },
  isPhxDestroyed(node) {
    return node.id && DOM.private(node, "destroyed") ? true : false;
  },
  wantsNewTab(e) {
    let wantsNewTab = e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button === 1;
    let isDownload = e.target instanceof HTMLAnchorElement && e.target.hasAttribute("download");
    let isTargetBlank = e.target.hasAttribute("target") && e.target.getAttribute("target").toLowerCase() === "_blank";
    let isTargetNamedTab = e.target.hasAttribute("target") && !e.target.getAttribute("target").startsWith("_");
    return wantsNewTab || isTargetBlank || isDownload || isTargetNamedTab;
  },
  isUnloadableFormSubmit(e) {
    let isDialogSubmit = e.target && e.target.getAttribute("method") === "dialog" || e.submitter && e.submitter.getAttribute("formmethod") === "dialog";
    if (isDialogSubmit) {
      return false;
    } else {
      return !e.defaultPrevented && !this.wantsNewTab(e);
    }
  },
  isNewPageClick(e, currentLocation) {
    let href = e.target instanceof HTMLAnchorElement ? e.target.getAttribute("href") : null;
    let url;
    if (e.defaultPrevented || href === null || this.wantsNewTab(e)) {
      return false;
    }
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return false;
    }
    if (e.target.isContentEditable) {
      return false;
    }
    try {
      url = new URL(href);
    } catch (e2) {
      try {
        url = new URL(href, currentLocation);
      } catch (e3) {
        return true;
      }
    }
    if (url.host === currentLocation.host && url.protocol === currentLocation.protocol) {
      if (url.pathname === currentLocation.pathname && url.search === currentLocation.search) {
        return url.hash === "" && !url.href.endsWith("#");
      }
    }
    return url.protocol.startsWith("http");
  },
  markPhxChildDestroyed(el) {
    if (this.isPhxChild(el)) {
      el.setAttribute(PHX_SESSION, "");
    }
    this.putPrivate(el, "destroyed", true);
  },
  findPhxChildrenInFragment(html, parentId) {
    let template = document.createElement("template");
    template.innerHTML = html;
    return this.findPhxChildren(template.content, parentId);
  },
  isIgnored(el, phxUpdate) {
    return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
  },
  isPhxUpdate(el, phxUpdate, updateTypes) {
    return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
  },
  findPhxSticky(el) {
    return this.all(el, `[${PHX_STICKY}]`);
  },
  findPhxChildren(el, parentId) {
    return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
  },
  findExistingParentCIDs(node, cids) {
    let parentCids = /* @__PURE__ */ new Set();
    let childrenCids = /* @__PURE__ */ new Set();
    cids.forEach((cid) => {
      this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node).forEach((parent) => {
        parentCids.add(cid);
        this.all(parent, `[${PHX_COMPONENT}]`).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => childrenCids.add(childCID));
      });
    });
    childrenCids.forEach((childCid) => parentCids.delete(childCid));
    return parentCids;
  },
  filterWithinSameLiveView(nodes, parent) {
    if (parent.querySelector(PHX_VIEW_SELECTOR)) {
      return nodes.filter((el) => this.withinSameLiveView(el, parent));
    } else {
      return nodes;
    }
  },
  withinSameLiveView(node, parent) {
    while (node = node.parentNode) {
      if (node.isSameNode(parent)) {
        return true;
      }
      if (node.getAttribute(PHX_SESSION) !== null) {
        return false;
      }
    }
  },
  private(el, key) {
    return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
  },
  deletePrivate(el, key) {
    el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
  },
  putPrivate(el, key, value) {
    if (!el[PHX_PRIVATE]) {
      el[PHX_PRIVATE] = {};
    }
    el[PHX_PRIVATE][key] = value;
  },
  updatePrivate(el, key, defaultVal, updateFunc) {
    let existing = this.private(el, key);
    if (existing === void 0) {
      this.putPrivate(el, key, updateFunc(defaultVal));
    } else {
      this.putPrivate(el, key, updateFunc(existing));
    }
  },
  copyPrivates(target, source) {
    if (source[PHX_PRIVATE]) {
      target[PHX_PRIVATE] = source[PHX_PRIVATE];
    }
  },
  putTitle(str) {
    let titleEl = document.querySelector("title");
    if (titleEl) {
      let { prefix, suffix } = titleEl.dataset;
      document.title = `${prefix || ""}${str}${suffix || ""}`;
    } else {
      document.title = str;
    }
  },
  debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
    let debounce = el.getAttribute(phxDebounce);
    let throttle = el.getAttribute(phxThrottle);
    if (debounce === "") {
      debounce = defaultDebounce;
    }
    if (throttle === "") {
      throttle = defaultThrottle;
    }
    let value = debounce || throttle;
    switch (value) {
      case null:
        return callback();
      case "blur":
        if (this.once(el, "debounce-blur")) {
          el.addEventListener("blur", () => {
            if (asyncFilter()) {
              callback();
            }
          });
        }
        return;
      default:
        let timeout = parseInt(value);
        let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
        let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
        if (isNaN(timeout)) {
          return logError(`invalid throttle/debounce value: ${value}`);
        }
        if (throttle) {
          let newKeyDown = false;
          if (event.type === "keydown") {
            let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
            this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
            newKeyDown = prevKey !== event.key;
          }
          if (!newKeyDown && this.private(el, THROTTLED)) {
            return false;
          } else {
            callback();
            const t = setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER);
              }
            }, timeout);
            this.putPrivate(el, THROTTLED, t);
          }
        } else {
          setTimeout(() => {
            if (asyncFilter()) {
              this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
            }
          }, timeout);
        }
        let form = el.form;
        if (form && this.once(form, "bind-debounce")) {
          form.addEventListener("submit", () => {
            Array.from(new FormData(form).entries(), ([name]) => {
              let input = form.querySelector(`[name="${name}"]`);
              this.incCycle(input, DEBOUNCE_TRIGGER);
              this.deletePrivate(input, THROTTLED);
            });
          });
        }
        if (this.once(el, "bind-debounce")) {
          el.addEventListener("blur", () => {
            clearTimeout(this.private(el, THROTTLED));
            this.triggerCycle(el, DEBOUNCE_TRIGGER);
          });
        }
    }
  },
  triggerCycle(el, key, currentCycle) {
    let [cycle, trigger] = this.private(el, key);
    if (!currentCycle) {
      currentCycle = cycle;
    }
    if (currentCycle === cycle) {
      this.incCycle(el, key);
      trigger();
    }
  },
  once(el, key) {
    if (this.private(el, key) === true) {
      return false;
    }
    this.putPrivate(el, key, true);
    return true;
  },
  incCycle(el, key, trigger = function() {
  }) {
    let [currentCycle] = this.private(el, key) || [0, trigger];
    currentCycle++;
    this.putPrivate(el, key, [currentCycle, trigger]);
    return currentCycle;
  },
  maybeAddPrivateHooks(el, phxViewportTop, phxViewportBottom) {
    if (el.hasAttribute && (el.hasAttribute(phxViewportTop) || el.hasAttribute(phxViewportBottom))) {
      el.setAttribute("data-phx-hook", "Phoenix.InfiniteScroll");
    }
  },
  isFeedbackContainer(el, phxFeedbackFor) {
    return el.hasAttribute && el.hasAttribute(phxFeedbackFor);
  },
  maybeHideFeedback(container, feedbackContainers, phxFeedbackFor, phxFeedbackGroup) {
    const feedbackResults = {};
    feedbackContainers.forEach((el) => {
      if (!container.contains(el))
        return;
      const feedback = el.getAttribute(phxFeedbackFor);
      if (!feedback) {
        js_default.addOrRemoveClasses(el, [], [PHX_NO_FEEDBACK_CLASS]);
        return;
      }
      if (feedbackResults[feedback] === true) {
        this.hideFeedback(el);
        return;
      }
      feedbackResults[feedback] = this.shouldHideFeedback(container, feedback, phxFeedbackGroup);
      if (feedbackResults[feedback] === true) {
        this.hideFeedback(el);
      }
    });
  },
  hideFeedback(container) {
    js_default.addOrRemoveClasses(container, [PHX_NO_FEEDBACK_CLASS], []);
  },
  shouldHideFeedback(container, nameOrGroup, phxFeedbackGroup) {
    const query = `[name="${nameOrGroup}"],
                   [name="${nameOrGroup}[]"],
                   [${phxFeedbackGroup}="${nameOrGroup}"]`;
    let focused = false;
    DOM.all(container, query, (input) => {
      if (this.private(input, PHX_HAS_FOCUSED) || this.private(input, PHX_HAS_SUBMITTED)) {
        focused = true;
      }
    });
    return !focused;
  },
  feedbackSelector(input, phxFeedbackFor, phxFeedbackGroup) {
    let query = `[${phxFeedbackFor}="${input.name}"],
                 [${phxFeedbackFor}="${input.name.replace(/\[\]$/, "")}"]`;
    if (input.getAttribute(phxFeedbackGroup)) {
      query += `,[${phxFeedbackFor}="${input.getAttribute(phxFeedbackGroup)}"]`;
    }
    return query;
  },
  resetForm(form, phxFeedbackFor, phxFeedbackGroup) {
    Array.from(form.elements).forEach((input) => {
      let query = this.feedbackSelector(input, phxFeedbackFor, phxFeedbackGroup);
      this.deletePrivate(input, PHX_HAS_FOCUSED);
      this.deletePrivate(input, PHX_HAS_SUBMITTED);
      this.all(document, query, (feedbackEl) => {
        js_default.addOrRemoveClasses(feedbackEl, [PHX_NO_FEEDBACK_CLASS], []);
      });
    });
  },
  showError(inputEl, phxFeedbackFor, phxFeedbackGroup) {
    if (inputEl.name) {
      let query = this.feedbackSelector(inputEl, phxFeedbackFor, phxFeedbackGroup);
      this.all(document, query, (el) => {
        js_default.addOrRemoveClasses(el, [], [PHX_NO_FEEDBACK_CLASS]);
      });
    }
  },
  isPhxChild(node) {
    return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
  },
  isPhxSticky(node) {
    return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
  },
  isChildOfAny(el, parents) {
    return !!parents.find((parent) => parent.contains(el));
  },
  firstPhxChild(el) {
    return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
  },
  dispatchEvent(target, name, opts = {}) {
    let defaultBubble = true;
    let isUploadTarget = target.nodeName === "INPUT" && target.type === "file";
    if (isUploadTarget && name === "click") {
      defaultBubble = false;
    }
    let bubbles = opts.bubbles === void 0 ? defaultBubble : !!opts.bubbles;
    let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
    let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
    target.dispatchEvent(event);
  },
  cloneNode(node, html) {
    if (typeof html === "undefined") {
      return node.cloneNode(true);
    } else {
      let cloned = node.cloneNode(false);
      cloned.innerHTML = html;
      return cloned;
    }
  },
  // merge attributes from source to target
  // if an element is ignored, we only merge data attributes
  // including removing data attributes that are no longer in the source
  mergeAttrs(target, source, opts = {}) {
    let exclude = new Set(opts.exclude || []);
    let isIgnored = opts.isIgnored;
    let sourceAttrs = source.attributes;
    for (let i = sourceAttrs.length - 1; i >= 0; i--) {
      let name = sourceAttrs[i].name;
      if (!exclude.has(name)) {
        const sourceValue = source.getAttribute(name);
        if (target.getAttribute(name) !== sourceValue && (!isIgnored || isIgnored && name.startsWith("data-"))) {
          target.setAttribute(name, sourceValue);
        }
      } else {
        if (name === "value" && target.value === source.value) {
          target.setAttribute("value", source.getAttribute(name));
        }
      }
    }
    let targetAttrs = target.attributes;
    for (let i = targetAttrs.length - 1; i >= 0; i--) {
      let name = targetAttrs[i].name;
      if (isIgnored) {
        if (name.startsWith("data-") && !source.hasAttribute(name) && ![PHX_REF, PHX_REF_SRC].includes(name)) {
          target.removeAttribute(name);
        }
      } else {
        if (!source.hasAttribute(name)) {
          target.removeAttribute(name);
        }
      }
    }
  },
  mergeFocusedInput(target, source) {
    if (!(target instanceof HTMLSelectElement)) {
      DOM.mergeAttrs(target, source, { exclude: ["value"] });
    }
    if (source.readOnly) {
      target.setAttribute("readonly", true);
    } else {
      target.removeAttribute("readonly");
    }
  },
  hasSelectionRange(el) {
    return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
  },
  restoreFocus(focused, selectionStart, selectionEnd) {
    if (focused instanceof HTMLSelectElement) {
      focused.focus();
    }
    if (!DOM.isTextualInput(focused)) {
      return;
    }
    let wasFocused = focused.matches(":focus");
    if (!wasFocused) {
      focused.focus();
    }
    if (this.hasSelectionRange(focused)) {
      focused.setSelectionRange(selectionStart, selectionEnd);
    }
  },
  isFormInput(el) {
    return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
  },
  syncAttrsToProps(el) {
    if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
      el.checked = el.getAttribute("checked") !== null;
    }
  },
  isTextualInput(el) {
    return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
  },
  isNowTriggerFormExternal(el, phxTriggerExternal) {
    return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null;
  },
  syncPendingRef(fromEl, toEl, disableWith) {
    let ref = fromEl.getAttribute(PHX_REF);
    if (ref === null) {
      return true;
    }
    let refSrc = fromEl.getAttribute(PHX_REF_SRC);
    if (DOM.isFormInput(fromEl) || fromEl.getAttribute(disableWith) !== null) {
      if (DOM.isUploadInput(fromEl)) {
        DOM.mergeAttrs(fromEl, toEl, { isIgnored: true });
      }
      DOM.putPrivate(fromEl, PHX_REF, toEl);
      return false;
    } else {
      PHX_EVENT_CLASSES.forEach((className) => {
        fromEl.classList.contains(className) && toEl.classList.add(className);
      });
      toEl.setAttribute(PHX_REF, ref);
      toEl.setAttribute(PHX_REF_SRC, refSrc);
      return true;
    }
  },
  cleanChildNodes(container, phxUpdate) {
    if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
      let toRemove = [];
      container.childNodes.forEach((childNode) => {
        if (!childNode.id) {
          let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
          if (!isEmptyTextNode && childNode.nodeType !== Node.COMMENT_NODE) {
            logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
          }
          toRemove.push(childNode);
        }
      });
      toRemove.forEach((childNode) => childNode.remove());
    }
  },
  replaceRootContainer(container, tagName, attrs) {
    let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
    if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
      Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
      Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
      return container;
    } else {
      let newContainer = document.createElement(tagName);
      Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
      retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
      newContainer.innerHTML = container.innerHTML;
      container.replaceWith(newContainer);
      return newContainer;
    }
  },
  getSticky(el, name, defaultVal) {
    let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
    if (op) {
      let [_name, _op, stashedResult] = op;
      return stashedResult;
    } else {
      return typeof defaultVal === "function" ? defaultVal() : defaultVal;
    }
  },
  deleteSticky(el, name) {
    this.updatePrivate(el, "sticky", [], (ops) => {
      return ops.filter(([existingName, _]) => existingName !== name);
    });
  },
  putSticky(el, name, op) {
    let stashedResult = op(el);
    this.updatePrivate(el, "sticky", [], (ops) => {
      let existingIndex = ops.findIndex(([existingName]) => name === existingName);
      if (existingIndex >= 0) {
        ops[existingIndex] = [name, op, stashedResult];
      } else {
        ops.push([name, op, stashedResult]);
      }
      return ops;
    });
  },
  applyStickyOperations(el) {
    let ops = DOM.private(el, "sticky");
    if (!ops) {
      return;
    }
    ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
  }
};
var dom_default = DOM;

// js/phoenix_live_view/upload_entry.js
var UploadEntry = class {
  static isActive(fileEl, file) {
    let isNew = file._phxRef === void 0;
    let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
    let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
    return file.size > 0 && (isNew || isActive);
  }
  static isPreflighted(fileEl, file) {
    let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
    let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
    return isPreflighted && this.isActive(fileEl, file);
  }
  static isPreflightInProgress(file) {
    return file._preflightInProgress === true;
  }
  static markPreflightInProgress(file) {
    file._preflightInProgress = true;
  }
  constructor(fileEl, file, view, autoUpload) {
    this.ref = LiveUploader.genFileRef(file);
    this.fileEl = fileEl;
    this.file = file;
    this.view = view;
    this.meta = null;
    this._isCancelled = false;
    this._isDone = false;
    this._progress = 0;
    this._lastProgressSent = -1;
    this._onDone = function() {
    };
    this._onElUpdated = this.onElUpdated.bind(this);
    this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    this.autoUpload = autoUpload;
  }
  metadata() {
    return this.meta;
  }
  progress(progress) {
    this._progress = Math.floor(progress);
    if (this._progress > this._lastProgressSent) {
      if (this._progress >= 100) {
        this._progress = 100;
        this._lastProgressSent = 100;
        this._isDone = true;
        this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
          LiveUploader.untrackFile(this.fileEl, this.file);
          this._onDone();
        });
      } else {
        this._lastProgressSent = this._progress;
        this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
      }
    }
  }
  isCancelled() {
    return this._isCancelled;
  }
  cancel() {
    this.file._preflightInProgress = false;
    this._isCancelled = true;
    this._isDone = true;
    this._onDone();
  }
  isDone() {
    return this._isDone;
  }
  error(reason = "failed") {
    this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
    if (!this.isAutoUpload()) {
      LiveUploader.clearFiles(this.fileEl);
    }
  }
  isAutoUpload() {
    return this.autoUpload;
  }
  //private
  onDone(callback) {
    this._onDone = () => {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      callback();
    };
  }
  onElUpdated() {
    let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
    if (activeRefs.indexOf(this.ref) === -1) {
      LiveUploader.untrackFile(this.fileEl, this.file);
      this.cancel();
    }
  }
  toPreflightPayload() {
    return {
      last_modified: this.file.lastModified,
      name: this.file.name,
      relative_path: this.file.webkitRelativePath,
      size: this.file.size,
      type: this.file.type,
      ref: this.ref,
      meta: typeof this.file.meta === "function" ? this.file.meta() : void 0
    };
  }
  uploader(uploaders) {
    if (this.meta.uploader) {
      let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
      return { name: this.meta.uploader, callback };
    } else {
      return { name: "channel", callback: channelUploader };
    }
  }
  zipPostFlight(resp) {
    this.meta = resp.entries[this.ref];
    if (!this.meta) {
      logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
    }
  }
};

// js/phoenix_live_view/live_uploader.js
var liveUploaderFileRef = 0;
var LiveUploader = class _LiveUploader {
  static genFileRef(file) {
    let ref = file._phxRef;
    if (ref !== void 0) {
      return ref;
    } else {
      file._phxRef = (liveUploaderFileRef++).toString();
      return file._phxRef;
    }
  }
  static getEntryDataURL(inputEl, ref, callback) {
    let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
    callback(URL.createObjectURL(file));
  }
  static hasUploadsInProgress(formEl) {
    let active = 0;
    dom_default.findUploadInputs(formEl).forEach((input) => {
      if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
        active++;
      }
    });
    return active > 0;
  }
  static serializeUploads(inputEl) {
    let files = this.activeFiles(inputEl);
    let fileData = {};
    files.forEach((file) => {
      let entry = { path: inputEl.name };
      let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
      fileData[uploadRef] = fileData[uploadRef] || [];
      entry.ref = this.genFileRef(file);
      entry.last_modified = file.lastModified;
      entry.name = file.name || entry.ref;
      entry.relative_path = file.webkitRelativePath;
      entry.type = file.type;
      entry.size = file.size;
      if (typeof file.meta === "function") {
        entry.meta = file.meta();
      }
      fileData[uploadRef].push(entry);
    });
    return fileData;
  }
  static clearFiles(inputEl) {
    inputEl.value = null;
    inputEl.removeAttribute(PHX_UPLOAD_REF);
    dom_default.putPrivate(inputEl, "files", []);
  }
  static untrackFile(inputEl, file) {
    dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
  }
  static trackFiles(inputEl, files, dataTransfer) {
    if (inputEl.getAttribute("multiple") !== null) {
      let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
      dom_default.updatePrivate(inputEl, "files", [], (existing) => existing.concat(newFiles));
      inputEl.value = null;
    } else {
      if (dataTransfer && dataTransfer.files.length > 0) {
        inputEl.files = dataTransfer.files;
      }
      dom_default.putPrivate(inputEl, "files", files);
    }
  }
  static activeFileInputs(formEl) {
    let fileInputs = dom_default.findUploadInputs(formEl);
    return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
  }
  static activeFiles(input) {
    return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
  }
  static inputsAwaitingPreflight(formEl) {
    let fileInputs = dom_default.findUploadInputs(formEl);
    return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
  }
  static filesAwaitingPreflight(input) {
    return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f) && !UploadEntry.isPreflightInProgress(f));
  }
  static markPreflightInProgress(entries) {
    entries.forEach((entry) => UploadEntry.markPreflightInProgress(entry.file));
  }
  constructor(inputEl, view, onComplete) {
    this.autoUpload = dom_default.isAutoUpload(inputEl);
    this.view = view;
    this.onComplete = onComplete;
    this._entries = Array.from(_LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view, this.autoUpload));
    _LiveUploader.markPreflightInProgress(this._entries);
    this.numEntriesInProgress = this._entries.length;
  }
  isAutoUpload() {
    return this.autoUpload;
  }
  entries() {
    return this._entries;
  }
  initAdapterUpload(resp, onError, liveSocket) {
    this._entries = this._entries.map((entry) => {
      if (entry.isCancelled()) {
        this.numEntriesInProgress--;
        if (this.numEntriesInProgress === 0) {
          this.onComplete();
        }
      } else {
        entry.zipPostFlight(resp);
        entry.onDone(() => {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        });
      }
      return entry;
    });
    let groupedEntries = this._entries.reduce((acc, entry) => {
      if (!entry.meta) {
        return acc;
      }
      let { name, callback } = entry.uploader(liveSocket.uploaders);
      acc[name] = acc[name] || { callback, entries: [] };
      acc[name].entries.push(entry);
      return acc;
    }, {});
    for (let name in groupedEntries) {
      let { callback, entries } = groupedEntries[name];
      callback(entries, onError, resp, liveSocket);
    }
  }
};

// js/phoenix_live_view/hooks.js
var Hooks = {
  LiveFileUpload: {
    activeRefs() {
      return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
    },
    preflightedRefs() {
      return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
    },
    mounted() {
      this.preflightedWas = this.preflightedRefs();
    },
    updated() {
      let newPreflights = this.preflightedRefs();
      if (this.preflightedWas !== newPreflights) {
        this.preflightedWas = newPreflights;
        if (newPreflights === "") {
          this.__view.cancelSubmit(this.el.form);
        }
      }
      if (this.activeRefs() === "") {
        this.el.value = null;
      }
      this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
    }
  },
  LiveImgPreview: {
    mounted() {
      this.ref = this.el.getAttribute("data-phx-entry-ref");
      this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
      LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
        this.url = url;
        this.el.src = url;
      });
    },
    destroyed() {
      URL.revokeObjectURL(this.url);
    }
  },
  FocusWrap: {
    mounted() {
      this.focusStart = this.el.firstElementChild;
      this.focusEnd = this.el.lastElementChild;
      this.focusStart.addEventListener("focus", () => aria_default.focusLast(this.el));
      this.focusEnd.addEventListener("focus", () => aria_default.focusFirst(this.el));
      this.el.addEventListener("phx:show-end", () => this.el.focus());
      if (window.getComputedStyle(this.el).display !== "none") {
        aria_default.focusFirst(this.el);
      }
    }
  }
};
var findScrollContainer = (el) => {
  if (["HTML", "BODY"].indexOf(el.nodeName.toUpperCase()) >= 0)
    return null;
  if (["scroll", "auto"].indexOf(getComputedStyle(el).overflowY) >= 0)
    return el;
  return findScrollContainer(el.parentElement);
};
var scrollTop = (scrollContainer) => {
  if (scrollContainer) {
    return scrollContainer.scrollTop;
  } else {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }
};
var bottom = (scrollContainer) => {
  if (scrollContainer) {
    return scrollContainer.getBoundingClientRect().bottom;
  } else {
    return window.innerHeight || document.documentElement.clientHeight;
  }
};
var top = (scrollContainer) => {
  if (scrollContainer) {
    return scrollContainer.getBoundingClientRect().top;
  } else {
    return 0;
  }
};
var isAtViewportTop = (el, scrollContainer) => {
  let rect = el.getBoundingClientRect();
  return rect.top >= top(scrollContainer) && rect.left >= 0 && rect.top <= bottom(scrollContainer);
};
var isAtViewportBottom = (el, scrollContainer) => {
  let rect = el.getBoundingClientRect();
  return rect.right >= top(scrollContainer) && rect.left >= 0 && rect.bottom <= bottom(scrollContainer);
};
var isWithinViewport = (el, scrollContainer) => {
  let rect = el.getBoundingClientRect();
  return rect.top >= top(scrollContainer) && rect.left >= 0 && rect.top <= bottom(scrollContainer);
};
Hooks.InfiniteScroll = {
  mounted() {
    this.scrollContainer = findScrollContainer(this.el);
    let scrollBefore = scrollTop(this.scrollContainer);
    let topOverran = false;
    let throttleInterval = 500;
    let pendingOp = null;
    let onTopOverrun = this.throttle(throttleInterval, (topEvent, firstChild) => {
      pendingOp = () => true;
      this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id, _overran: true }, () => {
        pendingOp = null;
      });
    });
    let onFirstChildAtTop = this.throttle(throttleInterval, (topEvent, firstChild) => {
      pendingOp = () => firstChild.scrollIntoView({ block: "start" });
      this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id }, () => {
        pendingOp = null;
        window.requestAnimationFrame(() => {
          if (!isWithinViewport(firstChild, this.scrollContainer)) {
            firstChild.scrollIntoView({ block: "start" });
          }
        });
      });
    });
    let onLastChildAtBottom = this.throttle(throttleInterval, (bottomEvent, lastChild) => {
      pendingOp = () => lastChild.scrollIntoView({ block: "end" });
      this.liveSocket.execJSHookPush(this.el, bottomEvent, { id: lastChild.id }, () => {
        pendingOp = null;
        window.requestAnimationFrame(() => {
          if (!isWithinViewport(lastChild, this.scrollContainer)) {
            lastChild.scrollIntoView({ block: "end" });
          }
        });
      });
    });
    this.onScroll = (_e) => {
      let scrollNow = scrollTop(this.scrollContainer);
      if (pendingOp) {
        scrollBefore = scrollNow;
        return pendingOp();
      }
      let rect = this.el.getBoundingClientRect();
      let topEvent = this.el.getAttribute(this.liveSocket.binding("viewport-top"));
      let bottomEvent = this.el.getAttribute(this.liveSocket.binding("viewport-bottom"));
      let lastChild = this.el.lastElementChild;
      let firstChild = this.el.firstElementChild;
      let isScrollingUp = scrollNow < scrollBefore;
      let isScrollingDown = scrollNow > scrollBefore;
      if (isScrollingUp && topEvent && !topOverran && rect.top >= 0) {
        topOverran = true;
        onTopOverrun(topEvent, firstChild);
      } else if (isScrollingDown && topOverran && rect.top <= 0) {
        topOverran = false;
      }
      if (topEvent && isScrollingUp && isAtViewportTop(firstChild, this.scrollContainer)) {
        onFirstChildAtTop(topEvent, firstChild);
      } else if (bottomEvent && isScrollingDown && isAtViewportBottom(lastChild, this.scrollContainer)) {
        onLastChildAtBottom(bottomEvent, lastChild);
      }
      scrollBefore = scrollNow;
    };
    if (this.scrollContainer) {
      this.scrollContainer.addEventListener("scroll", this.onScroll);
    } else {
      window.addEventListener("scroll", this.onScroll);
    }
  },
  destroyed() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener("scroll", this.onScroll);
    } else {
      window.removeEventListener("scroll", this.onScroll);
    }
  },
  throttle(interval, callback) {
    let lastCallAt = 0;
    let timer;
    return (...args) => {
      let now = Date.now();
      let remainingTime = interval - (now - lastCallAt);
      if (remainingTime <= 0 || remainingTime > interval) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        lastCallAt = now;
        callback(...args);
      } else if (!timer) {
        timer = setTimeout(() => {
          lastCallAt = Date.now();
          timer = null;
          callback(...args);
        }, remainingTime);
      }
    };
  }
};
var hooks_default = Hooks;

// js/phoenix_live_view/dom_post_morph_restorer.js
var DOMPostMorphRestorer = class {
  constructor(containerBefore, containerAfter, updateType) {
    let idsBefore = /* @__PURE__ */ new Set();
    let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
    let elementsToModify = [];
    Array.from(containerBefore.children).forEach((child) => {
      if (child.id) {
        idsBefore.add(child.id);
        if (idsAfter.has(child.id)) {
          let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
          elementsToModify.push({ elementId: child.id, previousElementId });
        }
      }
    });
    this.containerId = containerAfter.id;
    this.updateType = updateType;
    this.elementsToModify = elementsToModify;
    this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
  }
  // We do the following to optimize append/prepend operations:
  //   1) Track ids of modified elements & of new elements
  //   2) All the modified elements are put back in the correct position in the DOM tree
  //      by storing the id of their previous sibling
  //   3) New elements are going to be put in the right place by morphdom during append.
  //      For prepend, we move them to the first position in the container
  perform() {
    let container = dom_default.byId(this.containerId);
    this.elementsToModify.forEach((elementToModify) => {
      if (elementToModify.previousElementId) {
        maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
            if (!isInRightPlace) {
              previousElem.insertAdjacentElement("afterend", elem);
            }
          });
        });
      } else {
        maybe(document.getElementById(elementToModify.elementId), (elem) => {
          let isInRightPlace = elem.previousElementSibling == null;
          if (!isInRightPlace) {
            container.insertAdjacentElement("afterbegin", elem);
          }
        });
      }
    });
    if (this.updateType == "prepend") {
      this.elementIdsToAdd.reverse().forEach((elemId) => {
        maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
      });
    }
  }
};

// node_modules/morphdom/dist/morphdom-esm.js
var DOCUMENT_FRAGMENT_NODE = 11;
function morphAttrs(fromNode, toNode) {
  var toNodeAttrs = toNode.attributes;
  var attr;
  var attrName;
  var attrNamespaceURI;
  var attrValue;
  var fromValue;
  if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
    return;
  }
  for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
    attr = toNodeAttrs[i];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    attrValue = attr.value;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
      if (fromValue !== attrValue) {
        if (attr.prefix === "xmlns") {
          attrName = attr.name;
        }
        fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
      }
    } else {
      fromValue = fromNode.getAttribute(attrName);
      if (fromValue !== attrValue) {
        fromNode.setAttribute(attrName, attrValue);
      }
    }
  }
  var fromNodeAttrs = fromNode.attributes;
  for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
    attr = fromNodeAttrs[d];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
        fromNode.removeAttributeNS(attrNamespaceURI, attrName);
      }
    } else {
      if (!toNode.hasAttribute(attrName)) {
        fromNode.removeAttribute(attrName);
      }
    }
  }
}
var range;
var NS_XHTML = "http://www.w3.org/1999/xhtml";
var doc = typeof document === "undefined" ? void 0 : document;
var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
function createFragmentFromTemplate(str) {
  var template = doc.createElement("template");
  template.innerHTML = str;
  return template.content.childNodes[0];
}
function createFragmentFromRange(str) {
  if (!range) {
    range = doc.createRange();
    range.selectNode(doc.body);
  }
  var fragment = range.createContextualFragment(str);
  return fragment.childNodes[0];
}
function createFragmentFromWrap(str) {
  var fragment = doc.createElement("body");
  fragment.innerHTML = str;
  return fragment.childNodes[0];
}
function toElement(str) {
  str = str.trim();
  if (HAS_TEMPLATE_SUPPORT) {
    return createFragmentFromTemplate(str);
  } else if (HAS_RANGE_SUPPORT) {
    return createFragmentFromRange(str);
  }
  return createFragmentFromWrap(str);
}
function compareNodeNames(fromEl, toEl) {
  var fromNodeName = fromEl.nodeName;
  var toNodeName = toEl.nodeName;
  var fromCodeStart, toCodeStart;
  if (fromNodeName === toNodeName) {
    return true;
  }
  fromCodeStart = fromNodeName.charCodeAt(0);
  toCodeStart = toNodeName.charCodeAt(0);
  if (fromCodeStart <= 90 && toCodeStart >= 97) {
    return fromNodeName === toNodeName.toUpperCase();
  } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
    return toNodeName === fromNodeName.toUpperCase();
  } else {
    return false;
  }
}
function createElementNS(name, namespaceURI) {
  return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
}
function moveChildren(fromEl, toEl) {
  var curChild = fromEl.firstChild;
  while (curChild) {
    var nextChild = curChild.nextSibling;
    toEl.appendChild(curChild);
    curChild = nextChild;
  }
  return toEl;
}
function syncBooleanAttrProp(fromEl, toEl, name) {
  if (fromEl[name] !== toEl[name]) {
    fromEl[name] = toEl[name];
    if (fromEl[name]) {
      fromEl.setAttribute(name, "");
    } else {
      fromEl.removeAttribute(name);
    }
  }
}
var specialElHandlers = {
  OPTION: function(fromEl, toEl) {
    var parentNode = fromEl.parentNode;
    if (parentNode) {
      var parentName = parentNode.nodeName.toUpperCase();
      if (parentName === "OPTGROUP") {
        parentNode = parentNode.parentNode;
        parentName = parentNode && parentNode.nodeName.toUpperCase();
      }
      if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
        if (fromEl.hasAttribute("selected") && !toEl.selected) {
          fromEl.setAttribute("selected", "selected");
          fromEl.removeAttribute("selected");
        }
        parentNode.selectedIndex = -1;
      }
    }
    syncBooleanAttrProp(fromEl, toEl, "selected");
  },
  /**
   * The "value" attribute is special for the <input> element since it sets
   * the initial value. Changing the "value" attribute without changing the
   * "value" property will have no effect since it is only used to the set the
   * initial value.  Similar for the "checked" attribute, and "disabled".
   */
  INPUT: function(fromEl, toEl) {
    syncBooleanAttrProp(fromEl, toEl, "checked");
    syncBooleanAttrProp(fromEl, toEl, "disabled");
    if (fromEl.value !== toEl.value) {
      fromEl.value = toEl.value;
    }
    if (!toEl.hasAttribute("value")) {
      fromEl.removeAttribute("value");
    }
  },
  TEXTAREA: function(fromEl, toEl) {
    var newValue = toEl.value;
    if (fromEl.value !== newValue) {
      fromEl.value = newValue;
    }
    var firstChild = fromEl.firstChild;
    if (firstChild) {
      var oldValue = firstChild.nodeValue;
      if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
        return;
      }
      firstChild.nodeValue = newValue;
    }
  },
  SELECT: function(fromEl, toEl) {
    if (!toEl.hasAttribute("multiple")) {
      var selectedIndex = -1;
      var i = 0;
      var curChild = fromEl.firstChild;
      var optgroup;
      var nodeName;
      while (curChild) {
        nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
        if (nodeName === "OPTGROUP") {
          optgroup = curChild;
          curChild = optgroup.firstChild;
        } else {
          if (nodeName === "OPTION") {
            if (curChild.hasAttribute("selected")) {
              selectedIndex = i;
              break;
            }
            i++;
          }
          curChild = curChild.nextSibling;
          if (!curChild && optgroup) {
            curChild = optgroup.nextSibling;
            optgroup = null;
          }
        }
      }
      fromEl.selectedIndex = selectedIndex;
    }
  }
};
var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
function noop2() {
}
function defaultGetNodeKey(node) {
  if (node) {
    return node.getAttribute && node.getAttribute("id") || node.id;
  }
}
function morphdomFactory(morphAttrs2) {
  return function morphdom2(fromNode, toNode, options) {
    if (!options) {
      options = {};
    }
    if (typeof toNode === "string") {
      if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
        var toNodeHtml = toNode;
        toNode = doc.createElement("html");
        toNode.innerHTML = toNodeHtml;
      } else {
        toNode = toElement(toNode);
      }
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
      toNode = toNode.firstElementChild;
    }
    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop2;
    var onNodeAdded = options.onNodeAdded || noop2;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop2;
    var onElUpdated = options.onElUpdated || noop2;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop2;
    var onNodeDiscarded = options.onNodeDiscarded || noop2;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop2;
    var skipFromChildren = options.skipFromChildren || noop2;
    var addChild = options.addChild || function(parent, child) {
      return parent.appendChild(child);
    };
    var childrenOnly = options.childrenOnly === true;
    var fromNodesLookup = /* @__PURE__ */ Object.create(null);
    var keyedRemovalList = [];
    function addKeyedRemoval(key) {
      keyedRemovalList.push(key);
    }
    function walkDiscardedChildNodes(node, skipKeyedNodes) {
      if (node.nodeType === ELEMENT_NODE) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = void 0;
          if (skipKeyedNodes && (key = getNodeKey(curChild))) {
            addKeyedRemoval(key);
          } else {
            onNodeDiscarded(curChild);
            if (curChild.firstChild) {
              walkDiscardedChildNodes(curChild, skipKeyedNodes);
            }
          }
          curChild = curChild.nextSibling;
        }
      }
    }
    function removeNode(node, parentNode, skipKeyedNodes) {
      if (onBeforeNodeDiscarded(node) === false) {
        return;
      }
      if (parentNode) {
        parentNode.removeChild(node);
      }
      onNodeDiscarded(node);
      walkDiscardedChildNodes(node, skipKeyedNodes);
    }
    function indexTree(node) {
      if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = getNodeKey(curChild);
          if (key) {
            fromNodesLookup[key] = curChild;
          }
          indexTree(curChild);
          curChild = curChild.nextSibling;
        }
      }
    }
    indexTree(fromNode);
    function handleNodeAdded(el) {
      onNodeAdded(el);
      var curChild = el.firstChild;
      while (curChild) {
        var nextSibling = curChild.nextSibling;
        var key = getNodeKey(curChild);
        if (key) {
          var unmatchedFromEl = fromNodesLookup[key];
          if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
            morphEl(unmatchedFromEl, curChild);
          } else {
            handleNodeAdded(curChild);
          }
        } else {
          handleNodeAdded(curChild);
        }
        curChild = nextSibling;
      }
    }
    function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
      while (curFromNodeChild) {
        var fromNextSibling = curFromNodeChild.nextSibling;
        if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
          addKeyedRemoval(curFromNodeKey);
        } else {
          removeNode(
            curFromNodeChild,
            fromEl,
            true
            /* skip keyed nodes */
          );
        }
        curFromNodeChild = fromNextSibling;
      }
    }
    function morphEl(fromEl, toEl, childrenOnly2) {
      var toElKey = getNodeKey(toEl);
      if (toElKey) {
        delete fromNodesLookup[toElKey];
      }
      if (!childrenOnly2) {
        if (onBeforeElUpdated(fromEl, toEl) === false) {
          return;
        }
        morphAttrs2(fromEl, toEl);
        onElUpdated(fromEl);
        if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
          return;
        }
      }
      if (fromEl.nodeName !== "TEXTAREA") {
        morphChildren(fromEl, toEl);
      } else {
        specialElHandlers.TEXTAREA(fromEl, toEl);
      }
    }
    function morphChildren(fromEl, toEl) {
      var skipFrom = skipFromChildren(fromEl, toEl);
      var curToNodeChild = toEl.firstChild;
      var curFromNodeChild = fromEl.firstChild;
      var curToNodeKey;
      var curFromNodeKey;
      var fromNextSibling;
      var toNextSibling;
      var matchingFromEl;
      outer:
        while (curToNodeChild) {
          toNextSibling = curToNodeChild.nextSibling;
          curToNodeKey = getNodeKey(curToNodeChild);
          while (!skipFrom && curFromNodeChild) {
            fromNextSibling = curFromNodeChild.nextSibling;
            if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }
            curFromNodeKey = getNodeKey(curFromNodeChild);
            var curFromNodeType = curFromNodeChild.nodeType;
            var isCompatible = void 0;
            if (curFromNodeType === curToNodeChild.nodeType) {
              if (curFromNodeType === ELEMENT_NODE) {
                if (curToNodeKey) {
                  if (curToNodeKey !== curFromNodeKey) {
                    if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                      if (fromNextSibling === matchingFromEl) {
                        isCompatible = false;
                      } else {
                        fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                        if (curFromNodeKey) {
                          addKeyedRemoval(curFromNodeKey);
                        } else {
                          removeNode(
                            curFromNodeChild,
                            fromEl,
                            true
                            /* skip keyed nodes */
                          );
                        }
                        curFromNodeChild = matchingFromEl;
                        curFromNodeKey = getNodeKey(curFromNodeChild);
                      }
                    } else {
                      isCompatible = false;
                    }
                  }
                } else if (curFromNodeKey) {
                  isCompatible = false;
                }
                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                if (isCompatible) {
                  morphEl(curFromNodeChild, curToNodeChild);
                }
              } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                isCompatible = true;
                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                  curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                }
              }
            }
            if (isCompatible) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }
            if (curFromNodeKey) {
              addKeyedRemoval(curFromNodeKey);
            } else {
              removeNode(
                curFromNodeChild,
                fromEl,
                true
                /* skip keyed nodes */
              );
            }
            curFromNodeChild = fromNextSibling;
          }
          if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
            if (!skipFrom) {
              addChild(fromEl, matchingFromEl);
            }
            morphEl(matchingFromEl, curToNodeChild);
          } else {
            var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
            if (onBeforeNodeAddedResult !== false) {
              if (onBeforeNodeAddedResult) {
                curToNodeChild = onBeforeNodeAddedResult;
              }
              if (curToNodeChild.actualize) {
                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
              }
              addChild(fromEl, curToNodeChild);
              handleNodeAdded(curToNodeChild);
            }
          }
          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;
        }
      cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
      var specialElHandler = specialElHandlers[fromEl.nodeName];
      if (specialElHandler) {
        specialElHandler(fromEl, toEl);
      }
    }
    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;
    if (!childrenOnly) {
      if (morphedNodeType === ELEMENT_NODE) {
        if (toNodeType === ELEMENT_NODE) {
          if (!compareNodeNames(fromNode, toNode)) {
            onNodeDiscarded(fromNode);
            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
          }
        } else {
          morphedNode = toNode;
        }
      } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
        if (toNodeType === morphedNodeType) {
          if (morphedNode.nodeValue !== toNode.nodeValue) {
            morphedNode.nodeValue = toNode.nodeValue;
          }
          return morphedNode;
        } else {
          morphedNode = toNode;
        }
      }
    }
    if (morphedNode === toNode) {
      onNodeDiscarded(fromNode);
    } else {
      if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
        return;
      }
      morphEl(morphedNode, toNode, childrenOnly);
      if (keyedRemovalList) {
        for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
          var elToRemove = fromNodesLookup[keyedRemovalList[i]];
          if (elToRemove) {
            removeNode(elToRemove, elToRemove.parentNode, false);
          }
        }
      }
    }
    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
      if (morphedNode.actualize) {
        morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
      }
      fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }
    return morphedNode;
  };
}
var morphdom = morphdomFactory(morphAttrs);
var morphdom_esm_default = morphdom;

// js/phoenix_live_view/dom_patch.js
var DOMPatch = class {
  static patchEl(fromEl, toEl, activeElement) {
    morphdom_esm_default(fromEl, toEl, {
      childrenOnly: false,
      onBeforeElUpdated: (fromEl2, toEl2) => {
        if (activeElement && activeElement.isSameNode(fromEl2) && dom_default.isFormInput(fromEl2)) {
          dom_default.mergeFocusedInput(fromEl2, toEl2);
          return false;
        }
      }
    });
  }
  constructor(view, container, id, html, streams, targetCID) {
    this.view = view;
    this.liveSocket = view.liveSocket;
    this.container = container;
    this.id = id;
    this.rootID = view.root.id;
    this.html = html;
    this.streams = streams;
    this.streamInserts = {};
    this.streamComponentRestore = {};
    this.targetCID = targetCID;
    this.cidPatch = isCid(this.targetCID);
    this.pendingRemoves = [];
    this.phxRemove = this.liveSocket.binding("remove");
    this.callbacks = {
      beforeadded: [],
      beforeupdated: [],
      beforephxChildAdded: [],
      afteradded: [],
      afterupdated: [],
      afterdiscarded: [],
      afterphxChildAdded: [],
      aftertransitionsDiscarded: []
    };
  }
  before(kind, callback) {
    this.callbacks[`before${kind}`].push(callback);
  }
  after(kind, callback) {
    this.callbacks[`after${kind}`].push(callback);
  }
  trackBefore(kind, ...args) {
    this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
  }
  trackAfter(kind, ...args) {
    this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
  }
  markPrunableContentForRemoval() {
    let phxUpdate = this.liveSocket.binding(PHX_UPDATE);
    dom_default.all(this.container, `[${phxUpdate}=append] > *, [${phxUpdate}=prepend] > *`, (el) => {
      el.setAttribute(PHX_PRUNE, "");
    });
  }
  perform(isJoinPatch) {
    let { view, liveSocket, container, html } = this;
    let targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
    if (this.isCIDPatch() && !targetContainer) {
      return;
    }
    let focused = liveSocket.getActiveElement();
    let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
    let phxUpdate = liveSocket.binding(PHX_UPDATE);
    let phxFeedbackFor = liveSocket.binding(PHX_FEEDBACK_FOR);
    let phxFeedbackGroup = liveSocket.binding(PHX_FEEDBACK_GROUP);
    let disableWith = liveSocket.binding(PHX_DISABLE_WITH);
    let phxViewportTop = liveSocket.binding(PHX_VIEWPORT_TOP);
    let phxViewportBottom = liveSocket.binding(PHX_VIEWPORT_BOTTOM);
    let phxTriggerExternal = liveSocket.binding(PHX_TRIGGER_ACTION);
    let added = [];
    let feedbackContainers = [];
    let updates = [];
    let appendPrependUpdates = [];
    let externalFormTriggered = null;
    function morph(targetContainer2, source, withChildren = false) {
      morphdom_esm_default(targetContainer2, source, {
        // normally, we are running with childrenOnly, as the patch HTML for a LV
        // does not include the LV attrs (data-phx-session, etc.)
        // when we are patching a live component, we do want to patch the root element as well;
        // another case is the recursive patch of a stream item that was kept on reset (-> onBeforeNodeAdded)
        childrenOnly: targetContainer2.getAttribute(PHX_COMPONENT) === null && !withChildren,
        getNodeKey: (node) => {
          if (dom_default.isPhxDestroyed(node)) {
            return null;
          }
          if (isJoinPatch) {
            return node.id;
          }
          return node.id || node.getAttribute && node.getAttribute(PHX_MAGIC_ID);
        },
        // skip indexing from children when container is stream
        skipFromChildren: (from) => {
          return from.getAttribute(phxUpdate) === PHX_STREAM;
        },
        // tell morphdom how to add a child
        addChild: (parent, child) => {
          let { ref, streamAt } = this.getStreamInsert(child);
          if (ref === void 0) {
            return parent.appendChild(child);
          }
          this.setStreamRef(child, ref);
          if (streamAt === 0) {
            parent.insertAdjacentElement("afterbegin", child);
          } else if (streamAt === -1) {
            parent.appendChild(child);
          } else if (streamAt > 0) {
            let sibling = Array.from(parent.children)[streamAt];
            parent.insertBefore(child, sibling);
          }
        },
        onBeforeNodeAdded: (el) => {
          dom_default.maybeAddPrivateHooks(el, phxViewportTop, phxViewportBottom);
          this.trackBefore("added", el);
          let morphedEl = el;
          if (!isJoinPatch && this.streamComponentRestore[el.id]) {
            morphedEl = this.streamComponentRestore[el.id];
            delete this.streamComponentRestore[el.id];
            morph.call(this, morphedEl, el, true);
          }
          return morphedEl;
        },
        onNodeAdded: (el) => {
          if (el.getAttribute) {
            this.maybeReOrderStream(el, true);
          }
          if (dom_default.isFeedbackContainer(el, phxFeedbackFor))
            feedbackContainers.push(el);
          if (el instanceof HTMLImageElement && el.srcset) {
            el.srcset = el.srcset;
          } else if (el instanceof HTMLVideoElement && el.autoplay) {
            el.play();
          }
          if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
            externalFormTriggered = el;
          }
          if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
            this.trackAfter("phxChildAdded", el);
          }
          added.push(el);
        },
        onNodeDiscarded: (el) => this.onNodeDiscarded(el),
        onBeforeNodeDiscarded: (el) => {
          if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
            return true;
          }
          if (el.parentElement !== null && el.id && dom_default.isPhxUpdate(el.parentElement, phxUpdate, [PHX_STREAM, "append", "prepend"])) {
            return false;
          }
          if (this.maybePendingRemove(el)) {
            return false;
          }
          if (this.skipCIDSibling(el)) {
            return false;
          }
          return true;
        },
        onElUpdated: (el) => {
          if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
            externalFormTriggered = el;
          }
          updates.push(el);
          this.maybeReOrderStream(el, false);
        },
        onBeforeElUpdated: (fromEl, toEl) => {
          dom_default.maybeAddPrivateHooks(toEl, phxViewportTop, phxViewportBottom);
          if (dom_default.isFeedbackContainer(fromEl, phxFeedbackFor) || dom_default.isFeedbackContainer(toEl, phxFeedbackFor)) {
            feedbackContainers.push(fromEl);
            feedbackContainers.push(toEl);
          }
          dom_default.cleanChildNodes(toEl, phxUpdate);
          if (this.skipCIDSibling(toEl)) {
            this.maybeReOrderStream(fromEl);
            return false;
          }
          if (dom_default.isPhxSticky(fromEl)) {
            return false;
          }
          if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
            this.trackBefore("updated", fromEl, toEl);
            dom_default.mergeAttrs(fromEl, toEl, { isIgnored: dom_default.isIgnored(fromEl, phxUpdate) });
            updates.push(fromEl);
            dom_default.applyStickyOperations(fromEl);
            return false;
          }
          if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
            return false;
          }
          if (!dom_default.syncPendingRef(fromEl, toEl, disableWith)) {
            if (dom_default.isUploadInput(fromEl)) {
              this.trackBefore("updated", fromEl, toEl);
              updates.push(fromEl);
            }
            dom_default.applyStickyOperations(fromEl);
            return false;
          }
          if (dom_default.isPhxChild(toEl)) {
            let prevSession = fromEl.getAttribute(PHX_SESSION);
            dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
            if (prevSession !== "") {
              fromEl.setAttribute(PHX_SESSION, prevSession);
            }
            fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
            dom_default.applyStickyOperations(fromEl);
            return false;
          }
          dom_default.copyPrivates(toEl, fromEl);
          let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
          let focusedSelectChanged = isFocusedFormEl && this.isChangedSelect(fromEl, toEl);
          if (isFocusedFormEl && fromEl.type !== "hidden" && !focusedSelectChanged) {
            this.trackBefore("updated", fromEl, toEl);
            dom_default.mergeFocusedInput(fromEl, toEl);
            dom_default.syncAttrsToProps(fromEl);
            updates.push(fromEl);
            dom_default.applyStickyOperations(fromEl);
            return false;
          } else {
            if (focusedSelectChanged) {
              fromEl.blur();
            }
            if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
              appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
            }
            dom_default.syncAttrsToProps(toEl);
            dom_default.applyStickyOperations(toEl);
            this.trackBefore("updated", fromEl, toEl);
            return true;
          }
        }
      });
    }
    this.trackBefore("added", container);
    this.trackBefore("updated", container, container);
    liveSocket.time("morphdom", () => {
      this.streams.forEach(([ref, inserts, deleteIds, reset]) => {
        inserts.forEach(([key, streamAt, limit]) => {
          this.streamInserts[key] = { ref, streamAt, limit, reset };
        });
        if (reset !== void 0) {
          dom_default.all(container, `[${PHX_STREAM_REF}="${ref}"]`, (child) => {
            this.removeStreamChildElement(child);
          });
        }
        deleteIds.forEach((id) => {
          let child = container.querySelector(`[id="${id}"]`);
          if (child) {
            this.removeStreamChildElement(child);
          }
        });
      });
      if (isJoinPatch) {
        dom_default.all(this.container, `[${phxUpdate}=${PHX_STREAM}]`, (el) => {
          this.liveSocket.owner(el, (view2) => {
            if (view2 === this.view) {
              Array.from(el.children).forEach((child) => {
                this.removeStreamChildElement(child);
              });
            }
          });
        });
      }
      morph.call(this, targetContainer, html);
    });
    if (liveSocket.isDebugEnabled()) {
      detectDuplicateIds();
      Array.from(document.querySelectorAll("input[name=id]")).forEach((node) => {
        if (node.form) {
          console.error('Detected an input with name="id" inside a form! This will cause problems when patching the DOM.\n', node);
        }
      });
    }
    if (appendPrependUpdates.length > 0) {
      liveSocket.time("post-morph append/prepend restoration", () => {
        appendPrependUpdates.forEach((update) => update.perform());
      });
    }
    dom_default.maybeHideFeedback(targetContainer, feedbackContainers, phxFeedbackFor, phxFeedbackGroup);
    liveSocket.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
    dom_default.dispatchEvent(document, "phx:update");
    added.forEach((el) => this.trackAfter("added", el));
    updates.forEach((el) => this.trackAfter("updated", el));
    this.transitionPendingRemoves();
    if (externalFormTriggered) {
      liveSocket.unload();
      Object.getPrototypeOf(externalFormTriggered).submit.call(externalFormTriggered);
    }
    return true;
  }
  onNodeDiscarded(el) {
    if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
      this.liveSocket.destroyViewByEl(el);
    }
    this.trackAfter("discarded", el);
  }
  maybePendingRemove(node) {
    if (node.getAttribute && node.getAttribute(this.phxRemove) !== null) {
      this.pendingRemoves.push(node);
      return true;
    } else {
      return false;
    }
  }
  removeStreamChildElement(child) {
    if (this.streamInserts[child.id]) {
      this.streamComponentRestore[child.id] = child;
      child.remove();
    } else {
      if (!this.maybePendingRemove(child)) {
        child.remove();
        this.onNodeDiscarded(child);
      }
    }
  }
  getStreamInsert(el) {
    let insert = el.id ? this.streamInserts[el.id] : {};
    return insert || {};
  }
  setStreamRef(el, ref) {
    dom_default.putSticky(el, PHX_STREAM_REF, (el2) => el2.setAttribute(PHX_STREAM_REF, ref));
  }
  maybeReOrderStream(el, isNew) {
    let { ref, streamAt, reset } = this.getStreamInsert(el);
    if (streamAt === void 0) {
      return;
    }
    this.setStreamRef(el, ref);
    if (!reset && !isNew) {
      return;
    }
    if (!el.parentElement) {
      return;
    }
    if (streamAt === 0) {
      el.parentElement.insertBefore(el, el.parentElement.firstElementChild);
    } else if (streamAt > 0) {
      let children = Array.from(el.parentElement.children);
      let oldIndex = children.indexOf(el);
      if (streamAt >= children.length - 1) {
        el.parentElement.appendChild(el);
      } else {
        let sibling = children[streamAt];
        if (oldIndex > streamAt) {
          el.parentElement.insertBefore(el, sibling);
        } else {
          el.parentElement.insertBefore(el, sibling.nextElementSibling);
        }
      }
    }
    this.maybeLimitStream(el);
  }
  maybeLimitStream(el) {
    let { limit } = this.getStreamInsert(el);
    let children = limit !== null && Array.from(el.parentElement.children);
    if (limit && limit < 0 && children.length > limit * -1) {
      children.slice(0, children.length + limit).forEach((child) => this.removeStreamChildElement(child));
    } else if (limit && limit >= 0 && children.length > limit) {
      children.slice(limit).forEach((child) => this.removeStreamChildElement(child));
    }
  }
  transitionPendingRemoves() {
    let { pendingRemoves, liveSocket } = this;
    if (pendingRemoves.length > 0) {
      liveSocket.transitionRemoves(pendingRemoves);
      liveSocket.requestDOMUpdate(() => {
        pendingRemoves.forEach((el) => {
          let child = dom_default.firstPhxChild(el);
          if (child) {
            liveSocket.destroyViewByEl(child);
          }
          el.remove();
        });
        this.trackAfter("transitionsDiscarded", pendingRemoves);
      });
    }
  }
  isChangedSelect(fromEl, toEl) {
    if (!(fromEl instanceof HTMLSelectElement) || fromEl.multiple) {
      return false;
    }
    if (fromEl.options.length !== toEl.options.length) {
      return true;
    }
    let fromSelected = fromEl.selectedOptions[0];
    let toSelected = toEl.selectedOptions[0];
    if (fromSelected && fromSelected.hasAttribute("selected")) {
      toSelected.setAttribute("selected", fromSelected.getAttribute("selected"));
    }
    return !fromEl.isEqualNode(toEl);
  }
  isCIDPatch() {
    return this.cidPatch;
  }
  skipCIDSibling(el) {
    return el.nodeType === Node.ELEMENT_NODE && el.hasAttribute(PHX_SKIP);
  }
  targetCIDContainer(html) {
    if (!this.isCIDPatch()) {
      return;
    }
    let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
    if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
      return first;
    } else {
      return first && first.parentNode;
    }
  }
  indexOf(parent, child) {
    return Array.from(parent.children).indexOf(child);
  }
};

// js/phoenix_live_view/rendered.js
var VOID_TAGS = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var quoteChars = /* @__PURE__ */ new Set(["'", '"']);
var modifyRoot = (html, attrs, clearInnerHTML) => {
  let i = 0;
  let insideComment = false;
  let beforeTag, afterTag, tag, tagNameEndsAt, id, newHTML;
  let lookahead = html.match(/^(\s*(?:<!--.*?-->\s*)*)<([^\s\/>]+)/);
  if (lookahead === null) {
    throw new Error(`malformed html ${html}`);
  }
  i = lookahead[0].length;
  beforeTag = lookahead[1];
  tag = lookahead[2];
  tagNameEndsAt = i;
  for (i; i < html.length; i++) {
    if (html.charAt(i) === ">") {
      break;
    }
    if (html.charAt(i) === "=") {
      let isId = html.slice(i - 3, i) === " id";
      i++;
      let char = html.charAt(i);
      if (quoteChars.has(char)) {
        let attrStartsAt = i;
        i++;
        for (i; i < html.length; i++) {
          if (html.charAt(i) === char) {
            break;
          }
        }
        if (isId) {
          id = html.slice(attrStartsAt + 1, i);
          break;
        }
      }
    }
  }
  let closeAt = html.length - 1;
  insideComment = false;
  while (closeAt >= beforeTag.length + tag.length) {
    let char = html.charAt(closeAt);
    if (insideComment) {
      if (char === "-" && html.slice(closeAt - 3, closeAt) === "<!-") {
        insideComment = false;
        closeAt -= 4;
      } else {
        closeAt -= 1;
      }
    } else if (char === ">" && html.slice(closeAt - 2, closeAt) === "--") {
      insideComment = true;
      closeAt -= 3;
    } else if (char === ">") {
      break;
    } else {
      closeAt -= 1;
    }
  }
  afterTag = html.slice(closeAt + 1, html.length);
  let attrsStr = Object.keys(attrs).map((attr) => attrs[attr] === true ? attr : `${attr}="${attrs[attr]}"`).join(" ");
  if (clearInnerHTML) {
    let idAttrStr = id ? ` id="${id}"` : "";
    if (VOID_TAGS.has(tag)) {
      newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}/>`;
    } else {
      newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}></${tag}>`;
    }
  } else {
    let rest = html.slice(tagNameEndsAt, closeAt + 1);
    newHTML = `<${tag}${attrsStr === "" ? "" : " "}${attrsStr}${rest}`;
  }
  return [newHTML, beforeTag, afterTag];
};
var Rendered = class {
  static extract(diff) {
    let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
    delete diff[REPLY];
    delete diff[EVENTS];
    delete diff[TITLE];
    return { diff, title, reply: reply || null, events: events || [] };
  }
  constructor(viewId, rendered) {
    this.viewId = viewId;
    this.rendered = {};
    this.magicId = 0;
    this.mergeDiff(rendered);
  }
  parentViewId() {
    return this.viewId;
  }
  toString(onlyCids) {
    let [str, streams] = this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids, true, {});
    return [str, streams];
  }
  recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids, changeTracking, rootAttrs) {
    onlyCids = onlyCids ? new Set(onlyCids) : null;
    let output = { buffer: "", components, onlyCids, streams: /* @__PURE__ */ new Set() };
    this.toOutputBuffer(rendered, null, output, changeTracking, rootAttrs);
    return [output.buffer, output.streams];
  }
  componentCIDs(diff) {
    return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
  }
  isComponentOnlyDiff(diff) {
    if (!diff[COMPONENTS]) {
      return false;
    }
    return Object.keys(diff).length === 1;
  }
  getComponent(diff, cid) {
    return diff[COMPONENTS][cid];
  }
  resetRender(cid) {
    if (this.rendered[COMPONENTS][cid]) {
      this.rendered[COMPONENTS][cid].reset = true;
    }
  }
  mergeDiff(diff) {
    let newc = diff[COMPONENTS];
    let cache = {};
    delete diff[COMPONENTS];
    this.rendered = this.mutableMerge(this.rendered, diff);
    this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
    if (newc) {
      let oldc = this.rendered[COMPONENTS];
      for (let cid in newc) {
        newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
      }
      for (let cid in newc) {
        oldc[cid] = newc[cid];
      }
      diff[COMPONENTS] = newc;
    }
  }
  cachedFindComponent(cid, cdiff, oldc, newc, cache) {
    if (cache[cid]) {
      return cache[cid];
    } else {
      let ndiff, stat, scid = cdiff[STATIC];
      if (isCid(scid)) {
        let tdiff;
        if (scid > 0) {
          tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
        } else {
          tdiff = oldc[-scid];
        }
        stat = tdiff[STATIC];
        ndiff = this.cloneMerge(tdiff, cdiff, true);
        ndiff[STATIC] = stat;
      } else {
        ndiff = cdiff[STATIC] !== void 0 || oldc[cid] === void 0 ? cdiff : this.cloneMerge(oldc[cid], cdiff, false);
      }
      cache[cid] = ndiff;
      return ndiff;
    }
  }
  mutableMerge(target, source) {
    if (source[STATIC] !== void 0) {
      return source;
    } else {
      this.doMutableMerge(target, source);
      return target;
    }
  }
  doMutableMerge(target, source) {
    for (let key in source) {
      let val = source[key];
      let targetVal = target[key];
      let isObjVal = isObject(val);
      if (isObjVal && val[STATIC] === void 0 && isObject(targetVal)) {
        this.doMutableMerge(targetVal, val);
      } else {
        target[key] = val;
      }
    }
    if (target[ROOT]) {
      target.newRender = true;
    }
  }
  // Merges cid trees together, copying statics from source tree.
  //
  // The `pruneMagicId` is passed to control pruning the magicId of the
  // target. We must always prune the magicId when we are sharing statics
  // from another component. If not pruning, we replicate the logic from
  // mutableMerge, where we set newRender to true if there is a root
  // (effectively forcing the new version to be rendered instead of skipped)
  //
  cloneMerge(target, source, pruneMagicId) {
    let merged = { ...target, ...source };
    for (let key in merged) {
      let val = source[key];
      let targetVal = target[key];
      if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
        merged[key] = this.cloneMerge(targetVal, val, pruneMagicId);
      } else if (val === void 0 && isObject(targetVal)) {
        merged[key] = this.cloneMerge(targetVal, {}, pruneMagicId);
      }
    }
    if (pruneMagicId) {
      delete merged.magicId;
      delete merged.newRender;
    } else if (target[ROOT]) {
      merged.newRender = true;
    }
    return merged;
  }
  componentToString(cid) {
    let [str, streams] = this.recursiveCIDToString(this.rendered[COMPONENTS], cid, null);
    let [strippedHTML, _before, _after] = modifyRoot(str, {});
    return [strippedHTML, streams];
  }
  pruneCIDs(cids) {
    cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
  }
  // private
  get() {
    return this.rendered;
  }
  isNewFingerprint(diff = {}) {
    return !!diff[STATIC];
  }
  templateStatic(part, templates) {
    if (typeof part === "number") {
      return templates[part];
    } else {
      return part;
    }
  }
  nextMagicID() {
    this.magicId++;
    return `m${this.magicId}-${this.parentViewId()}`;
  }
  // Converts rendered tree to output buffer.
  //
  // changeTracking controls if we can apply the PHX_SKIP optimization.
  // It is disabled for comprehensions since we must re-render the entire collection
  // and no individual element is tracked inside the comprehension.
  toOutputBuffer(rendered, templates, output, changeTracking, rootAttrs = {}) {
    if (rendered[DYNAMICS]) {
      return this.comprehensionToBuffer(rendered, templates, output);
    }
    let { [STATIC]: statics } = rendered;
    statics = this.templateStatic(statics, templates);
    let isRoot = rendered[ROOT];
    let prevBuffer = output.buffer;
    if (isRoot) {
      output.buffer = "";
    }
    if (changeTracking && isRoot && !rendered.magicId) {
      rendered.newRender = true;
      rendered.magicId = this.nextMagicID();
    }
    output.buffer += statics[0];
    for (let i = 1; i < statics.length; i++) {
      this.dynamicToBuffer(rendered[i - 1], templates, output, changeTracking);
      output.buffer += statics[i];
    }
    if (isRoot) {
      let skip = false;
      let attrs;
      if (changeTracking || rendered.magicId) {
        skip = changeTracking && !rendered.newRender;
        attrs = { [PHX_MAGIC_ID]: rendered.magicId, ...rootAttrs };
      } else {
        attrs = rootAttrs;
      }
      if (skip) {
        attrs[PHX_SKIP] = true;
      }
      let [newRoot, commentBefore, commentAfter] = modifyRoot(output.buffer, attrs, skip);
      rendered.newRender = false;
      output.buffer = prevBuffer + commentBefore + newRoot + commentAfter;
    }
  }
  comprehensionToBuffer(rendered, templates, output) {
    let { [DYNAMICS]: dynamics, [STATIC]: statics, [STREAM]: stream } = rendered;
    let [_ref, _inserts, deleteIds, reset] = stream || [null, {}, [], null];
    statics = this.templateStatic(statics, templates);
    let compTemplates = templates || rendered[TEMPLATES];
    for (let d = 0; d < dynamics.length; d++) {
      let dynamic = dynamics[d];
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        let changeTracking = false;
        this.dynamicToBuffer(dynamic[i - 1], compTemplates, output, changeTracking);
        output.buffer += statics[i];
      }
    }
    if (stream !== void 0 && (rendered[DYNAMICS].length > 0 || deleteIds.length > 0 || reset)) {
      delete rendered[STREAM];
      rendered[DYNAMICS] = [];
      output.streams.add(stream);
    }
  }
  dynamicToBuffer(rendered, templates, output, changeTracking) {
    if (typeof rendered === "number") {
      let [str, streams] = this.recursiveCIDToString(output.components, rendered, output.onlyCids);
      output.buffer += str;
      output.streams = /* @__PURE__ */ new Set([...output.streams, ...streams]);
    } else if (isObject(rendered)) {
      this.toOutputBuffer(rendered, templates, output, changeTracking, {});
    } else {
      output.buffer += rendered;
    }
  }
  recursiveCIDToString(components, cid, onlyCids) {
    let component = components[cid] || logError(`no component for CID ${cid}`, components);
    let attrs = { [PHX_COMPONENT]: cid };
    let skip = onlyCids && !onlyCids.has(cid);
    component.newRender = !skip;
    component.magicId = `c${cid}-${this.parentViewId()}`;
    let changeTracking = !component.reset;
    let [html, streams] = this.recursiveToString(component, components, onlyCids, changeTracking, attrs);
    delete component.reset;
    return [html, streams];
  }
};

// js/phoenix_live_view/view_hook.js
var viewHookID = 1;
var ViewHook = class {
  static makeID() {
    return viewHookID++;
  }
  static elementID(el) {
    return el.phxHookId;
  }
  constructor(view, el, callbacks) {
    this.__view = view;
    this.liveSocket = view.liveSocket;
    this.__callbacks = callbacks;
    this.__listeners = /* @__PURE__ */ new Set();
    this.__isDisconnected = false;
    this.el = el;
    this.el.phxHookId = this.constructor.makeID();
    for (let key in this.__callbacks) {
      this[key] = this.__callbacks[key];
    }
  }
  __mounted() {
    this.mounted && this.mounted();
  }
  __updated() {
    this.updated && this.updated();
  }
  __beforeUpdate() {
    this.beforeUpdate && this.beforeUpdate();
  }
  __destroyed() {
    this.destroyed && this.destroyed();
  }
  __reconnected() {
    if (this.__isDisconnected) {
      this.__isDisconnected = false;
      this.reconnected && this.reconnected();
    }
  }
  __disconnected() {
    this.__isDisconnected = true;
    this.disconnected && this.disconnected();
  }
  pushEvent(event, payload = {}, onReply = function() {
  }) {
    return this.__view.pushHookEvent(this.el, null, event, payload, onReply);
  }
  pushEventTo(phxTarget, event, payload = {}, onReply = function() {
  }) {
    return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
      return view.pushHookEvent(this.el, targetCtx, event, payload, onReply);
    });
  }
  handleEvent(event, callback) {
    let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
    window.addEventListener(`phx:${event}`, callbackRef);
    this.__listeners.add(callbackRef);
    return callbackRef;
  }
  removeHandleEvent(callbackRef) {
    let event = callbackRef(null, true);
    window.removeEventListener(`phx:${event}`, callbackRef);
    this.__listeners.delete(callbackRef);
  }
  upload(name, files) {
    return this.__view.dispatchUploads(null, name, files);
  }
  uploadTo(phxTarget, name, files) {
    return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
      view.dispatchUploads(targetCtx, name, files);
    });
  }
  __cleanup__() {
    this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
  }
};

// js/phoenix_live_view/view.js
var serializeForm = (form, metadata, onlyNames = []) => {
  const { submitter, ...meta } = metadata;
  let injectedElement;
  if (submitter && submitter.name) {
    const input = document.createElement("input");
    input.type = "hidden";
    const formId = submitter.getAttribute("form");
    if (formId) {
      input.setAttribute("form", formId);
    }
    input.name = submitter.name;
    input.value = submitter.value;
    submitter.parentElement.insertBefore(input, submitter);
    injectedElement = input;
  }
  const formData = new FormData(form);
  const toRemove = [];
  formData.forEach((val, key, _index) => {
    if (val instanceof File) {
      toRemove.push(key);
    }
  });
  toRemove.forEach((key) => formData.delete(key));
  const params = new URLSearchParams();
  for (let [key, val] of formData.entries()) {
    if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
      params.append(key, val);
    }
  }
  if (submitter && injectedElement) {
    submitter.parentElement.removeChild(injectedElement);
  }
  for (let metaKey in meta) {
    params.append(metaKey, meta[metaKey]);
  }
  return params.toString();
};
var View = class _View {
  constructor(el, liveSocket, parentView, flash, liveReferer) {
    this.isDead = false;
    this.liveSocket = liveSocket;
    this.flash = flash;
    this.parent = parentView;
    this.root = parentView ? parentView.root : this;
    this.el = el;
    this.id = this.el.id;
    this.ref = 0;
    this.childJoins = 0;
    this.loaderTimer = null;
    this.pendingDiffs = [];
    this.pendingForms = /* @__PURE__ */ new Set();
    this.redirect = false;
    this.href = null;
    this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
    this.joinPending = true;
    this.destroyed = false;
    this.joinCallback = function(onDone) {
      onDone && onDone();
    };
    this.stopCallback = function() {
    };
    this.pendingJoinOps = this.parent ? null : [];
    this.viewHooks = {};
    this.formSubmits = [];
    this.children = this.parent ? null : {};
    this.root.children[this.id] = {};
    this.formsForRecovery = {};
    this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
      let url = this.href && this.expandURL(this.href);
      return {
        redirect: this.redirect ? url : void 0,
        url: this.redirect ? void 0 : url || void 0,
        params: this.connectParams(liveReferer),
        session: this.getSession(),
        static: this.getStatic(),
        flash: this.flash
      };
    });
  }
  setHref(href) {
    this.href = href;
  }
  setRedirect(href) {
    this.redirect = true;
    this.href = href;
  }
  isMain() {
    return this.el.hasAttribute(PHX_MAIN);
  }
  connectParams(liveReferer) {
    let params = this.liveSocket.params(this.el);
    let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
    if (manifest.length > 0) {
      params["_track_static"] = manifest;
    }
    params["_mounts"] = this.joinCount;
    params["_live_referer"] = liveReferer;
    return params;
  }
  isConnected() {
    return this.channel.canPush();
  }
  getSession() {
    return this.el.getAttribute(PHX_SESSION);
  }
  getStatic() {
    let val = this.el.getAttribute(PHX_STATIC);
    return val === "" ? null : val;
  }
  destroy(callback = function() {
  }) {
    this.destroyAllChildren();
    this.destroyed = true;
    delete this.root.children[this.id];
    if (this.parent) {
      delete this.root.children[this.parent.id][this.id];
    }
    clearTimeout(this.loaderTimer);
    let onFinished = () => {
      callback();
      for (let id in this.viewHooks) {
        this.destroyHook(this.viewHooks[id]);
      }
    };
    dom_default.markPhxChildDestroyed(this.el);
    this.log("destroyed", () => ["the child has been removed from the parent"]);
    this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
  }
  setContainerClasses(...classes) {
    this.el.classList.remove(
      PHX_CONNECTED_CLASS,
      PHX_LOADING_CLASS,
      PHX_ERROR_CLASS,
      PHX_CLIENT_ERROR_CLASS,
      PHX_SERVER_ERROR_CLASS
    );
    this.el.classList.add(...classes);
  }
  showLoader(timeout) {
    clearTimeout(this.loaderTimer);
    if (timeout) {
      this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
    } else {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__disconnected();
      }
      this.setContainerClasses(PHX_LOADING_CLASS);
    }
  }
  execAll(binding) {
    dom_default.all(this.el, `[${binding}]`, (el) => this.liveSocket.execJS(el, el.getAttribute(binding)));
  }
  hideLoader() {
    clearTimeout(this.loaderTimer);
    this.setContainerClasses(PHX_CONNECTED_CLASS);
    this.execAll(this.binding("connected"));
  }
  triggerReconnected() {
    for (let id in this.viewHooks) {
      this.viewHooks[id].__reconnected();
    }
  }
  log(kind, msgCallback) {
    this.liveSocket.log(this, kind, msgCallback);
  }
  transition(time, onStart, onDone = function() {
  }) {
    this.liveSocket.transition(time, onStart, onDone);
  }
  // calls the callback with the view and target element for the given phxTarget
  // targets can be:
  //  * an element itself, then it is simply passed to liveSocket.owner;
  //  * a CID (Component ID), then we first search the component's element in the DOM
  //  * a selector, then we search the selector in the DOM and call the callback
  //    for each element found with the corresponding owner view
  withinTargets(phxTarget, callback, dom = document, viewEl) {
    if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
      return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
    }
    if (isCid(phxTarget)) {
      let targets = dom_default.findComponentNodeList(viewEl || this.el, phxTarget);
      if (targets.length === 0) {
        logError(`no component found matching phx-target of ${phxTarget}`);
      } else {
        callback(this, parseInt(phxTarget));
      }
    } else {
      let targets = Array.from(dom.querySelectorAll(phxTarget));
      if (targets.length === 0) {
        logError(`nothing found matching the phx-target selector "${phxTarget}"`);
      }
      targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
    }
  }
  applyDiff(type, rawDiff, callback) {
    this.log(type, () => ["", clone(rawDiff)]);
    let { diff, reply, events, title } = Rendered.extract(rawDiff);
    callback({ diff, reply, events });
    if (typeof title === "string") {
      window.requestAnimationFrame(() => dom_default.putTitle(title));
    }
  }
  onJoin(resp) {
    let { rendered, container, liveview_version } = resp;
    if (container) {
      let [tag, attrs] = container;
      this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
    }
    this.childJoins = 0;
    this.joinPending = true;
    this.flash = null;
    if (this.root === this) {
      this.formsForRecovery = this.getFormsForRecovery();
    }
    if (liveview_version !== this.liveSocket.version()) {
      console.error(`LiveView asset version mismatch. JavaScript version ${this.liveSocket.version()} vs. server ${liveview_version}. To avoid issues, please ensure that your assets use the same version as the server.`);
    }
    browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
    this.applyDiff("mount", rendered, ({ diff, events }) => {
      this.rendered = new Rendered(this.id, diff);
      let [html, streams] = this.renderContainer(null, "join");
      this.dropPendingRefs();
      this.joinCount++;
      this.maybeRecoverForms(html, () => {
        this.onJoinComplete(resp, html, streams, events);
      });
    });
  }
  dropPendingRefs() {
    dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}]`, (el) => {
      el.removeAttribute(PHX_REF);
      el.removeAttribute(PHX_REF_SRC);
    });
  }
  onJoinComplete({ live_patch }, html, streams, events) {
    if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
      return this.applyJoinPatch(live_patch, html, streams, events);
    }
    let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
      let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
      let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
      if (phxStatic) {
        toEl.setAttribute(PHX_STATIC, phxStatic);
      }
      if (fromEl) {
        fromEl.setAttribute(PHX_ROOT_ID, this.root.id);
      }
      return this.joinChild(toEl);
    });
    if (newChildren.length === 0) {
      if (this.parent) {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
        this.parent.ackJoin(this);
      } else {
        this.onAllChildJoinsComplete();
        this.applyJoinPatch(live_patch, html, streams, events);
      }
    } else {
      this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
    }
  }
  attachTrueDocEl() {
    this.el = dom_default.byId(this.id);
    this.el.setAttribute(PHX_ROOT_ID, this.root.id);
  }
  // this is invoked for dead and live views, so we must filter by
  // by owner to ensure we aren't duplicating hooks across disconnect
  // and connected states. This also handles cases where hooks exist
  // in a root layout with a LV in the body
  execNewMounted() {
    let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
    let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
    dom_default.all(this.el, `[${phxViewportTop}], [${phxViewportBottom}]`, (hookEl) => {
      if (this.ownsElement(hookEl)) {
        dom_default.maybeAddPrivateHooks(hookEl, phxViewportTop, phxViewportBottom);
        this.maybeAddNewHook(hookEl);
      }
    });
    dom_default.all(this.el, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
      if (this.ownsElement(hookEl)) {
        this.maybeAddNewHook(hookEl);
      }
    });
    dom_default.all(this.el, `[${this.binding(PHX_MOUNTED)}]`, (el) => {
      if (this.ownsElement(el)) {
        this.maybeMounted(el);
      }
    });
  }
  applyJoinPatch(live_patch, html, streams, events) {
    this.attachTrueDocEl();
    let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
    patch.markPrunableContentForRemoval();
    this.performPatch(patch, false, true);
    this.joinNewChildren();
    this.execNewMounted();
    this.joinPending = false;
    this.liveSocket.dispatchEvents(events);
    this.applyPendingUpdates();
    if (live_patch) {
      let { kind, to } = live_patch;
      this.liveSocket.historyPatch(to, kind);
    }
    this.hideLoader();
    if (this.joinCount > 1) {
      this.triggerReconnected();
    }
    this.stopCallback();
  }
  triggerBeforeUpdateHook(fromEl, toEl) {
    this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
    let hook = this.getHook(fromEl);
    let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
    if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
      hook.__beforeUpdate();
      return hook;
    }
  }
  maybeMounted(el) {
    let phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
    let hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
    if (phxMounted && !hasBeenInvoked) {
      this.liveSocket.execJS(el, phxMounted);
      dom_default.putPrivate(el, "mounted", true);
    }
  }
  maybeAddNewHook(el, force) {
    let newHook = this.addHook(el);
    if (newHook) {
      newHook.__mounted();
    }
  }
  performPatch(patch, pruneCids, isJoinPatch = false) {
    let removedEls = [];
    let phxChildrenAdded = false;
    let updatedHookIds = /* @__PURE__ */ new Set();
    patch.after("added", (el) => {
      this.liveSocket.triggerDOM("onNodeAdded", [el]);
      let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
      dom_default.maybeAddPrivateHooks(el, phxViewportTop, phxViewportBottom);
      this.maybeAddNewHook(el);
      if (el.getAttribute) {
        this.maybeMounted(el);
      }
    });
    patch.after("phxChildAdded", (el) => {
      if (dom_default.isPhxSticky(el)) {
        this.liveSocket.joinRootViews();
      } else {
        phxChildrenAdded = true;
      }
    });
    patch.before("updated", (fromEl, toEl) => {
      let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
      if (hook) {
        updatedHookIds.add(fromEl.id);
      }
    });
    patch.after("updated", (el) => {
      if (updatedHookIds.has(el.id)) {
        this.getHook(el).__updated();
      }
    });
    patch.after("discarded", (el) => {
      if (el.nodeType === Node.ELEMENT_NODE) {
        removedEls.push(el);
      }
    });
    patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
    patch.perform(isJoinPatch);
    this.afterElementsRemoved(removedEls, pruneCids);
    return phxChildrenAdded;
  }
  afterElementsRemoved(elements, pruneCids) {
    let destroyedCIDs = [];
    elements.forEach((parent) => {
      let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
      let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}]`);
      components.concat(parent).forEach((el) => {
        let cid = this.componentID(el);
        if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
          destroyedCIDs.push(cid);
        }
      });
      hooks.concat(parent).forEach((hookEl) => {
        let hook = this.getHook(hookEl);
        hook && this.destroyHook(hook);
      });
    });
    if (pruneCids) {
      this.maybePushComponentsDestroyed(destroyedCIDs);
    }
  }
  joinNewChildren() {
    dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
  }
  maybeRecoverForms(html, callback) {
    const phxChange = this.binding("change");
    const oldForms = this.root.formsForRecovery;
    let template = document.createElement("template");
    template.innerHTML = html;
    const rootEl = template.content.firstElementChild;
    rootEl.id = this.id;
    rootEl.setAttribute(PHX_ROOT_ID, this.root.id);
    rootEl.setAttribute(PHX_SESSION, this.getSession());
    rootEl.setAttribute(PHX_STATIC, this.getStatic());
    rootEl.setAttribute(PHX_PARENT_ID, this.parent ? this.parent.id : null);
    const formsToRecover = (
      // we go over all forms in the new DOM; because this is only the HTML for the current
      // view, we can be sure that all forms are owned by this view:
      dom_default.all(template.content, "form").filter((newForm) => newForm.id && oldForms[newForm.id]).filter((newForm) => !this.pendingForms.has(newForm.id)).filter((newForm) => oldForms[newForm.id].getAttribute(phxChange) === newForm.getAttribute(phxChange)).map((newForm) => {
        return [oldForms[newForm.id], newForm];
      })
    );
    if (formsToRecover.length === 0) {
      return callback();
    }
    formsToRecover.forEach(([oldForm, newForm], i) => {
      this.pendingForms.add(newForm.id);
      this.pushFormRecovery(oldForm, newForm, template.content, () => {
        this.pendingForms.delete(newForm.id);
        if (i === formsToRecover.length - 1) {
          callback();
        }
      });
    });
  }
  getChildById(id) {
    return this.root.children[this.id][id];
  }
  getDescendentByEl(el) {
    if (el.id === this.id) {
      return this;
    } else {
      return this.children[el.getAttribute(PHX_PARENT_ID)][el.id];
    }
  }
  destroyDescendent(id) {
    for (let parentId in this.root.children) {
      for (let childId in this.root.children[parentId]) {
        if (childId === id) {
          return this.root.children[parentId][childId].destroy();
        }
      }
    }
  }
  joinChild(el) {
    let child = this.getChildById(el.id);
    if (!child) {
      let view = new _View(el, this.liveSocket, this);
      this.root.children[this.id][view.id] = view;
      view.join();
      this.childJoins++;
      return true;
    }
  }
  isJoinPending() {
    return this.joinPending;
  }
  ackJoin(_child) {
    this.childJoins--;
    if (this.childJoins === 0) {
      if (this.parent) {
        this.parent.ackJoin(this);
      } else {
        this.onAllChildJoinsComplete();
      }
    }
  }
  onAllChildJoinsComplete() {
    this.pendingForms.clear();
    this.formsForRecovery = {};
    this.joinCallback(() => {
      this.pendingJoinOps.forEach(([view, op]) => {
        if (!view.isDestroyed()) {
          op();
        }
      });
      this.pendingJoinOps = [];
    });
  }
  update(diff, events) {
    if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
      return this.pendingDiffs.push({ diff, events });
    }
    this.rendered.mergeDiff(diff);
    let phxChildrenAdded = false;
    if (this.rendered.isComponentOnlyDiff(diff)) {
      this.liveSocket.time("component patch complete", () => {
        let parentCids = dom_default.findExistingParentCIDs(this.el, this.rendered.componentCIDs(diff));
        parentCids.forEach((parentCID) => {
          if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
            phxChildrenAdded = true;
          }
        });
      });
    } else if (!isEmpty(diff)) {
      this.liveSocket.time("full patch complete", () => {
        let [html, streams] = this.renderContainer(diff, "update");
        let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
        phxChildrenAdded = this.performPatch(patch, true);
      });
    }
    this.liveSocket.dispatchEvents(events);
    if (phxChildrenAdded) {
      this.joinNewChildren();
    }
  }
  renderContainer(diff, kind) {
    return this.liveSocket.time(`toString diff (${kind})`, () => {
      let tag = this.el.tagName;
      let cids = diff ? this.rendered.componentCIDs(diff) : null;
      let [html, streams] = this.rendered.toString(cids);
      return [`<${tag}>${html}</${tag}>`, streams];
    });
  }
  componentPatch(diff, cid) {
    if (isEmpty(diff))
      return false;
    let [html, streams] = this.rendered.componentToString(cid);
    let patch = new DOMPatch(this, this.el, this.id, html, streams, cid);
    let childrenAdded = this.performPatch(patch, true);
    return childrenAdded;
  }
  getHook(el) {
    return this.viewHooks[ViewHook.elementID(el)];
  }
  addHook(el) {
    if (ViewHook.elementID(el) || !el.getAttribute) {
      return;
    }
    let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
    if (hookName && !this.ownsElement(el)) {
      return;
    }
    let callbacks = this.liveSocket.getHookCallbacks(hookName);
    if (callbacks) {
      if (!el.id) {
        logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
      }
      let hook = new ViewHook(this, el, callbacks);
      this.viewHooks[ViewHook.elementID(hook.el)] = hook;
      return hook;
    } else if (hookName !== null) {
      logError(`unknown hook found for "${hookName}"`, el);
    }
  }
  destroyHook(hook) {
    hook.__destroyed();
    hook.__cleanup__();
    delete this.viewHooks[ViewHook.elementID(hook.el)];
  }
  applyPendingUpdates() {
    this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
    this.pendingDiffs = [];
    this.eachChild((child) => child.applyPendingUpdates());
  }
  eachChild(callback) {
    let children = this.root.children[this.id] || {};
    for (let id in children) {
      callback(this.getChildById(id));
    }
  }
  onChannel(event, cb) {
    this.liveSocket.onChannel(this.channel, event, (resp) => {
      if (this.isJoinPending()) {
        this.root.pendingJoinOps.push([this, () => cb(resp)]);
      } else {
        this.liveSocket.requestDOMUpdate(() => cb(resp));
      }
    });
  }
  bindChannel() {
    this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
      this.liveSocket.requestDOMUpdate(() => {
        this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
      });
    });
    this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
    this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
    this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
    this.channel.onError((reason) => this.onError(reason));
    this.channel.onClose((reason) => this.onClose(reason));
  }
  destroyAllChildren() {
    this.eachChild((child) => child.destroy());
  }
  onLiveRedirect(redir) {
    let { to, kind, flash } = redir;
    let url = this.expandURL(to);
    this.liveSocket.historyRedirect(url, kind, flash);
  }
  onLivePatch(redir) {
    let { to, kind } = redir;
    this.href = this.expandURL(to);
    this.liveSocket.historyPatch(to, kind);
  }
  expandURL(to) {
    return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
  }
  onRedirect({ to, flash }) {
    this.liveSocket.redirect(to, flash);
  }
  isDestroyed() {
    return this.destroyed;
  }
  joinDead() {
    this.isDead = true;
  }
  join(callback) {
    this.showLoader(this.liveSocket.loaderTimeout);
    this.bindChannel();
    if (this.isMain()) {
      this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
    }
    this.joinCallback = (onDone) => {
      onDone = onDone || function() {
      };
      callback ? callback(this.joinCount, onDone) : onDone();
    };
    this.liveSocket.wrapPush(this, { timeout: false }, () => {
      return this.channel.join().receive("ok", (data) => {
        if (!this.isDestroyed()) {
          this.liveSocket.requestDOMUpdate(() => this.onJoin(data));
        }
      }).receive("error", (resp) => !this.isDestroyed() && this.onJoinError(resp)).receive("timeout", () => !this.isDestroyed() && this.onJoinError({ reason: "timeout" }));
    });
  }
  onJoinError(resp) {
    if (resp.reason === "reload") {
      this.log("error", () => [`failed mount with ${resp.status}. Falling back to page request`, resp]);
      if (this.isMain()) {
        this.onRedirect({ to: this.href });
      }
      return;
    } else if (resp.reason === "unauthorized" || resp.reason === "stale") {
      this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
      if (this.isMain()) {
        this.onRedirect({ to: this.href });
      }
      return;
    }
    if (resp.redirect || resp.live_redirect) {
      this.joinPending = false;
      this.channel.leave();
    }
    if (resp.redirect) {
      return this.onRedirect(resp.redirect);
    }
    if (resp.live_redirect) {
      return this.onLiveRedirect(resp.live_redirect);
    }
    this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
    this.log("error", () => ["unable to join", resp]);
    if (this.liveSocket.isConnected()) {
      this.liveSocket.reloadWithJitter(this);
    }
  }
  onClose(reason) {
    if (this.isDestroyed()) {
      return;
    }
    if (this.liveSocket.hasPendingLink() && reason !== "leave") {
      return this.liveSocket.reloadWithJitter(this);
    }
    this.destroyAllChildren();
    this.liveSocket.dropActiveElement(this);
    if (document.activeElement) {
      document.activeElement.blur();
    }
    if (this.liveSocket.isUnloaded()) {
      this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
    }
  }
  onError(reason) {
    this.onClose(reason);
    if (this.liveSocket.isConnected()) {
      this.log("error", () => ["view crashed", reason]);
    }
    if (!this.liveSocket.isUnloaded()) {
      if (this.liveSocket.isConnected()) {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
      } else {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS]);
      }
    }
  }
  displayError(classes) {
    if (this.isMain()) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
    }
    this.showLoader();
    this.setContainerClasses(...classes);
    this.execAll(this.binding("disconnected"));
  }
  pushWithReply(refGenerator, event, payload, onReply = function() {
  }) {
    if (!this.isConnected()) {
      return;
    }
    let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
    let onLoadingDone = function() {
    };
    if (opts.page_loading || el && el.getAttribute(this.binding(PHX_PAGE_LOADING)) !== null) {
      onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
    }
    if (typeof payload.cid !== "number") {
      delete payload.cid;
    }
    return this.liveSocket.wrapPush(this, { timeout: true }, () => {
      return this.channel.push(event, payload, PUSH_TIMEOUT).receive("ok", (resp) => {
        let finish = (hookReply) => {
          if (resp.redirect) {
            this.onRedirect(resp.redirect);
          }
          if (resp.live_patch) {
            this.onLivePatch(resp.live_patch);
          }
          if (resp.live_redirect) {
            this.onLiveRedirect(resp.live_redirect);
          }
          onLoadingDone();
          onReply(resp, hookReply);
        };
        if (resp.diff) {
          this.liveSocket.requestDOMUpdate(() => {
            this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
              if (ref !== null) {
                this.undoRefs(ref);
              }
              this.update(diff, events);
              finish(reply);
            });
          });
        } else {
          if (ref !== null) {
            this.undoRefs(ref);
          }
          finish(null);
        }
      });
    });
  }
  undoRefs(ref, onlyEls) {
    onlyEls = onlyEls ? new Set(onlyEls) : null;
    if (!this.isConnected()) {
      return;
    }
    dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}="${ref}"]`, (el) => {
      if (onlyEls && !onlyEls.has(el)) {
        return;
      }
      el.dispatchEvent(new CustomEvent("phx:unlock", { bubbles: true, cancelable: false }));
      let disabledVal = el.getAttribute(PHX_DISABLED);
      let readOnlyVal = el.getAttribute(PHX_READONLY);
      el.removeAttribute(PHX_REF);
      el.removeAttribute(PHX_REF_SRC);
      if (readOnlyVal !== null) {
        el.readOnly = readOnlyVal === "true" ? true : false;
        el.removeAttribute(PHX_READONLY);
      }
      if (disabledVal !== null) {
        el.disabled = disabledVal === "true" ? true : false;
        el.removeAttribute(PHX_DISABLED);
      }
      PHX_EVENT_CLASSES.forEach((className) => dom_default.removeClass(el, className));
      let disableRestore = el.getAttribute(PHX_DISABLE_WITH_RESTORE);
      if (disableRestore !== null) {
        el.innerText = disableRestore;
        el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
      }
      let toEl = dom_default.private(el, PHX_REF);
      if (toEl) {
        let hook = this.triggerBeforeUpdateHook(el, toEl);
        DOMPatch.patchEl(el, toEl, this.liveSocket.getActiveElement());
        if (hook) {
          hook.__updated();
        }
        dom_default.deletePrivate(el, PHX_REF);
      }
    });
  }
  putRef(elements, event, opts = {}) {
    let newRef = this.ref++;
    let disableWith = this.binding(PHX_DISABLE_WITH);
    if (opts.loading) {
      elements = elements.concat(dom_default.all(document, opts.loading));
    }
    for (let el of elements) {
      el.setAttribute(PHX_REF, newRef);
      el.setAttribute(PHX_REF_SRC, this.el.id);
      if (opts.submitter && !(el === opts.submitter || el === opts.form)) {
        continue;
      }
      el.classList.add(`phx-${event}-loading`);
      el.dispatchEvent(new CustomEvent(`phx:${event}-loading`, { bubbles: true, cancelable: false }));
      let disableText = el.getAttribute(disableWith);
      if (disableText !== null) {
        if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
          el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
        }
        if (disableText !== "") {
          el.innerText = disableText;
        }
        el.setAttribute(PHX_DISABLED, el.getAttribute(PHX_DISABLED) || el.disabled);
        el.setAttribute("disabled", "");
      }
    }
    return [newRef, elements, opts];
  }
  componentID(el) {
    let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
    return cid ? parseInt(cid) : null;
  }
  targetComponentID(target, targetCtx, opts = {}) {
    if (isCid(targetCtx)) {
      return targetCtx;
    }
    let cidOrSelector = opts.target || target.getAttribute(this.binding("target"));
    if (isCid(cidOrSelector)) {
      return parseInt(cidOrSelector);
    } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
      return this.closestComponentID(targetCtx);
    } else {
      return null;
    }
  }
  closestComponentID(targetCtx) {
    if (isCid(targetCtx)) {
      return targetCtx;
    } else if (targetCtx) {
      return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
    } else {
      return null;
    }
  }
  pushHookEvent(el, targetCtx, event, payload, onReply) {
    if (!this.isConnected()) {
      this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
      return false;
    }
    let [ref, els, opts] = this.putRef([el], "hook");
    this.pushWithReply(() => [ref, els, opts], "event", {
      type: "hook",
      event,
      value: payload,
      cid: this.closestComponentID(targetCtx)
    }, (resp, reply) => onReply(reply, ref));
    return ref;
  }
  extractMeta(el, meta, value) {
    let prefix = this.binding("value-");
    for (let i = 0; i < el.attributes.length; i++) {
      if (!meta) {
        meta = {};
      }
      let name = el.attributes[i].name;
      if (name.startsWith(prefix)) {
        meta[name.replace(prefix, "")] = el.getAttribute(name);
      }
    }
    if (el.value !== void 0 && !(el instanceof HTMLFormElement)) {
      if (!meta) {
        meta = {};
      }
      meta.value = el.value;
      if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
        delete meta.value;
      }
    }
    if (value) {
      if (!meta) {
        meta = {};
      }
      for (let key in value) {
        meta[key] = value[key];
      }
    }
    return meta;
  }
  pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}, onReply) {
    this.pushWithReply(() => this.putRef([el], type, opts), "event", {
      type,
      event: phxEvent,
      value: this.extractMeta(el, meta, opts.value),
      cid: this.targetComponentID(el, targetCtx, opts)
    }, (resp, reply) => onReply && onReply(reply));
  }
  pushFileProgress(fileEl, entryRef, progress, onReply = function() {
  }) {
    this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
      view.pushWithReply(null, "progress", {
        event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
        ref: fileEl.getAttribute(PHX_UPLOAD_REF),
        entry_ref: entryRef,
        progress,
        cid: view.targetComponentID(fileEl.form, targetCtx)
      }, onReply);
    });
  }
  pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
    let uploads;
    let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx, opts);
    let refGenerator = () => this.putRef([inputEl, inputEl.form], "change", opts);
    let formData;
    let meta = this.extractMeta(inputEl.form);
    if (inputEl instanceof HTMLButtonElement) {
      meta.submitter = inputEl;
    }
    if (inputEl.getAttribute(this.binding("change"))) {
      formData = serializeForm(inputEl.form, { _target: opts._target, ...meta }, [inputEl.name]);
    } else {
      formData = serializeForm(inputEl.form, { _target: opts._target, ...meta });
    }
    if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
      LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
    }
    uploads = LiveUploader.serializeUploads(inputEl);
    let event = {
      type: "form",
      event: phxEvent,
      value: formData,
      uploads,
      cid
    };
    this.pushWithReply(refGenerator, "event", event, (resp) => {
      dom_default.showError(inputEl, this.liveSocket.binding(PHX_FEEDBACK_FOR), this.liveSocket.binding(PHX_FEEDBACK_GROUP));
      if (dom_default.isUploadInput(inputEl) && dom_default.isAutoUpload(inputEl)) {
        if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
          let [ref, _els] = refGenerator();
          this.undoRefs(ref, [inputEl.form]);
          this.uploadFiles(inputEl.form, targetCtx, ref, cid, (_uploads) => {
            callback && callback(resp);
            this.triggerAwaitingSubmit(inputEl.form);
            this.undoRefs(ref);
          });
        }
      } else {
        callback && callback(resp);
      }
    });
  }
  triggerAwaitingSubmit(formEl) {
    let awaitingSubmit = this.getScheduledSubmit(formEl);
    if (awaitingSubmit) {
      let [_el, _ref, _opts, callback] = awaitingSubmit;
      this.cancelSubmit(formEl);
      callback();
    }
  }
  getScheduledSubmit(formEl) {
    return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
  }
  scheduleSubmit(formEl, ref, opts, callback) {
    if (this.getScheduledSubmit(formEl)) {
      return true;
    }
    this.formSubmits.push([formEl, ref, opts, callback]);
  }
  cancelSubmit(formEl) {
    this.formSubmits = this.formSubmits.filter(([el, ref, _callback]) => {
      if (el.isSameNode(formEl)) {
        this.undoRefs(ref);
        return false;
      } else {
        return true;
      }
    });
  }
  disableForm(formEl, opts = {}) {
    let filterIgnored = (el) => {
      let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
      return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
    };
    let filterDisables = (el) => {
      return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
    };
    let filterButton = (el) => el.tagName == "BUTTON";
    let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    let formElements = Array.from(formEl.elements);
    let disables = formElements.filter(filterDisables);
    let buttons = formElements.filter(filterButton).filter(filterIgnored);
    let inputs = formElements.filter(filterInput).filter(filterIgnored);
    buttons.forEach((button) => {
      button.setAttribute(PHX_DISABLED, button.disabled);
      button.disabled = true;
    });
    inputs.forEach((input) => {
      input.setAttribute(PHX_READONLY, input.readOnly);
      input.readOnly = true;
      if (input.files) {
        input.setAttribute(PHX_DISABLED, input.disabled);
        input.disabled = true;
      }
    });
    formEl.setAttribute(this.binding(PHX_PAGE_LOADING), "");
    return this.putRef([formEl].concat(disables).concat(buttons).concat(inputs), "submit", opts);
  }
  pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply) {
    let refGenerator = () => this.disableForm(formEl, { ...opts, form: formEl, submitter });
    let cid = this.targetComponentID(formEl, targetCtx);
    if (LiveUploader.hasUploadsInProgress(formEl)) {
      let [ref, _els] = refGenerator();
      let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply);
      return this.scheduleSubmit(formEl, ref, opts, push);
    } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
      let [ref, els] = refGenerator();
      let proxyRefGen = () => [ref, els, opts];
      this.uploadFiles(formEl, targetCtx, ref, cid, (uploads) => {
        if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
          return this.undoRefs(ref);
        }
        let meta = this.extractMeta(formEl);
        let formData = serializeForm(formEl, { submitter, ...meta });
        this.pushWithReply(proxyRefGen, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }, onReply);
      });
    } else if (!(formEl.hasAttribute(PHX_REF) && formEl.classList.contains("phx-submit-loading"))) {
      let meta = this.extractMeta(formEl);
      let formData = serializeForm(formEl, { submitter, ...meta });
      this.pushWithReply(refGenerator, "event", {
        type: "form",
        event: phxEvent,
        value: formData,
        cid
      }, onReply);
    }
  }
  uploadFiles(formEl, targetCtx, ref, cid, onComplete) {
    let joinCountAtUpload = this.joinCount;
    let inputEls = LiveUploader.activeFileInputs(formEl);
    let numFileInputsInProgress = inputEls.length;
    inputEls.forEach((inputEl) => {
      let uploader = new LiveUploader(inputEl, this, () => {
        numFileInputsInProgress--;
        if (numFileInputsInProgress === 0) {
          onComplete();
        }
      });
      let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
      if (entries.length === 0) {
        numFileInputsInProgress--;
        return;
      }
      let payload = {
        ref: inputEl.getAttribute(PHX_UPLOAD_REF),
        entries,
        cid: this.targetComponentID(inputEl.form, targetCtx)
      };
      this.log("upload", () => ["sending preflight request", payload]);
      this.pushWithReply(null, "allow_upload", payload, (resp) => {
        this.log("upload", () => ["got preflight response", resp]);
        uploader.entries().forEach((entry) => {
          if (resp.entries && !resp.entries[entry.ref]) {
            this.handleFailedEntryPreflight(entry.ref, "failed preflight", uploader);
          }
        });
        if (resp.error || Object.keys(resp.entries).length === 0) {
          this.undoRefs(ref);
          let errors = resp.error || [];
          errors.map(([entry_ref, reason]) => {
            this.handleFailedEntryPreflight(entry_ref, reason, uploader);
          });
        } else {
          let onError = (callback) => {
            this.channel.onError(() => {
              if (this.joinCount === joinCountAtUpload) {
                callback();
              }
            });
          };
          uploader.initAdapterUpload(resp, onError, this.liveSocket);
        }
      });
    });
  }
  handleFailedEntryPreflight(uploadRef, reason, uploader) {
    if (uploader.isAutoUpload()) {
      let entry = uploader.entries().find((entry2) => entry2.ref === uploadRef.toString());
      if (entry) {
        entry.cancel();
      }
    } else {
      uploader.entries().map((entry) => entry.cancel());
    }
    this.log("upload", () => [`error for entry ${uploadRef}`, reason]);
  }
  dispatchUploads(targetCtx, name, filesOrBlobs) {
    let targetElement = this.targetCtxElement(targetCtx) || this.el;
    let inputs = dom_default.findUploadInputs(targetElement).filter((el) => el.name === name);
    if (inputs.length === 0) {
      logError(`no live file inputs found matching the name "${name}"`);
    } else if (inputs.length > 1) {
      logError(`duplicate live file inputs found matching the name "${name}"`);
    } else {
      dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
    }
  }
  targetCtxElement(targetCtx) {
    if (isCid(targetCtx)) {
      let [target] = dom_default.findComponentNodeList(this.el, targetCtx);
      return target;
    } else if (targetCtx) {
      return targetCtx;
    } else {
      return null;
    }
  }
  pushFormRecovery(oldForm, newForm, templateDom, callback) {
    const phxChange = this.binding("change");
    const phxTarget = newForm.getAttribute(this.binding("target")) || newForm;
    const phxEvent = newForm.getAttribute(this.binding(PHX_AUTO_RECOVER)) || newForm.getAttribute(this.binding("change"));
    const inputs = Array.from(oldForm.elements).filter((el) => dom_default.isFormInput(el) && el.name && !el.hasAttribute(phxChange));
    if (inputs.length === 0) {
      return;
    }
    inputs.forEach((input2) => input2.hasAttribute(PHX_UPLOAD_REF) && LiveUploader.clearFiles(input2));
    let input = inputs.find((el) => el.type !== "hidden") || inputs[0];
    let pending = 0;
    this.withinTargets(phxTarget, (targetView, targetCtx) => {
      const cid = this.targetComponentID(newForm, targetCtx);
      pending++;
      targetView.pushInput(input, targetCtx, cid, phxEvent, { _target: input.name }, () => {
        pending--;
        if (pending === 0) {
          callback();
        }
      });
    }, templateDom, templateDom);
  }
  pushLinkPatch(href, targetEl, callback) {
    let linkRef = this.liveSocket.setPendingLink(href);
    let refGen = targetEl ? () => this.putRef([targetEl], "click") : null;
    let fallback = () => this.liveSocket.redirect(window.location.href);
    let url = href.startsWith("/") ? `${location.protocol}//${location.host}${href}` : href;
    let push = this.pushWithReply(refGen, "live_patch", { url }, (resp) => {
      this.liveSocket.requestDOMUpdate(() => {
        if (resp.link_redirect) {
          this.liveSocket.replaceMain(href, null, callback, linkRef);
        } else {
          if (this.liveSocket.commitPendingLink(linkRef)) {
            this.href = href;
          }
          this.applyPendingUpdates();
          callback && callback(linkRef);
        }
      });
    });
    if (push) {
      push.receive("timeout", fallback);
    } else {
      fallback();
    }
  }
  getFormsForRecovery() {
    if (this.joinCount === 0) {
      return {};
    }
    let phxChange = this.binding("change");
    return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => form.cloneNode(true)).reduce((acc, form) => {
      acc[form.id] = form;
      return acc;
    }, {});
  }
  maybePushComponentsDestroyed(destroyedCIDs) {
    let willDestroyCIDs = destroyedCIDs.filter((cid) => {
      return dom_default.findComponentNodeList(this.el, cid).length === 0;
    });
    if (willDestroyCIDs.length > 0) {
      willDestroyCIDs.forEach((cid) => this.rendered.resetRender(cid));
      this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }, () => {
        this.liveSocket.requestDOMUpdate(() => {
          let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
            return dom_default.findComponentNodeList(this.el, cid).length === 0;
          });
          if (completelyDestroyCIDs.length > 0) {
            this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }, (resp) => {
              this.rendered.pruneCIDs(resp.cids);
            });
          }
        });
      });
    }
  }
  ownsElement(el) {
    let parentViewEl = el.closest(PHX_VIEW_SELECTOR);
    return el.getAttribute(PHX_PARENT_ID) === this.id || parentViewEl && parentViewEl.id === this.id || !parentViewEl && this.isDead;
  }
  submitForm(form, targetCtx, phxEvent, submitter, opts = {}) {
    dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
    const phxFeedbackFor = this.liveSocket.binding(PHX_FEEDBACK_FOR);
    const phxFeedbackGroup = this.liveSocket.binding(PHX_FEEDBACK_GROUP);
    const inputs = Array.from(form.elements);
    inputs.forEach((input) => dom_default.putPrivate(input, PHX_HAS_SUBMITTED, true));
    this.liveSocket.blurActiveElement(this);
    this.pushFormSubmit(form, targetCtx, phxEvent, submitter, opts, () => {
      inputs.forEach((input) => dom_default.showError(input, phxFeedbackFor, phxFeedbackGroup));
      this.liveSocket.restorePreviouslyActiveFocus();
    });
  }
  binding(kind) {
    return this.liveSocket.binding(kind);
  }
};

// js/phoenix_live_view/live_socket.js
var LiveSocket = class {
  constructor(url, phxSocket, opts = {}) {
    this.unloaded = false;
    if (!phxSocket || phxSocket.constructor.name === "Object") {
      throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
    }
    this.socket = new phxSocket(url, opts);
    this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
    this.opts = opts;
    this.params = closure(opts.params || {});
    this.viewLogger = opts.viewLogger;
    this.metadataCallbacks = opts.metadata || {};
    this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
    this.activeElement = null;
    this.prevActive = null;
    this.silenced = false;
    this.main = null;
    this.outgoingMainEl = null;
    this.clickStartedAtTarget = null;
    this.linkRef = 1;
    this.roots = {};
    this.href = window.location.href;
    this.pendingLink = null;
    this.currentLocation = clone(window.location);
    this.hooks = opts.hooks || {};
    this.uploaders = opts.uploaders || {};
    this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
    this.reloadWithJitterTimer = null;
    this.maxReloads = opts.maxReloads || MAX_RELOADS;
    this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
    this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
    this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
    this.localStorage = opts.localStorage || window.localStorage;
    this.sessionStorage = opts.sessionStorage || window.sessionStorage;
    this.boundTopLevelEvents = false;
    this.serverCloseRef = null;
    this.domCallbacks = Object.assign(
      {
        onPatchStart: closure(),
        onPatchEnd: closure(),
        onNodeAdded: closure(),
        onBeforeElUpdated: closure()
      },
      opts.dom || {}
    );
    this.transitions = new TransitionSet();
    this.rootViewSelector = opts.rootViewSelector;
    window.addEventListener("pagehide", (_e) => {
      this.unloaded = true;
    });
    this.socket.onOpen(() => {
      if (this.isUnloaded()) {
        window.location.reload();
      }
    });
  }
  // public
  version() {
    return "0.20.17";
  }
  isProfileEnabled() {
    return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
  }
  isDebugEnabled() {
    return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
  }
  isDebugDisabled() {
    return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
  }
  enableDebug() {
    this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
  }
  enableProfiling() {
    this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
  }
  disableDebug() {
    this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
  }
  disableProfiling() {
    this.sessionStorage.removeItem(PHX_LV_PROFILE);
  }
  enableLatencySim(upperBoundMs) {
    this.enableDebug();
    console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
    this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
  }
  disableLatencySim() {
    this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
  }
  getLatencySim() {
    let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
    return str ? parseInt(str) : null;
  }
  getSocket() {
    return this.socket;
  }
  connect() {
    if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
      this.enableDebug();
    }
    let doConnect = () => {
      if (this.joinRootViews()) {
        this.bindTopLevelEvents();
        this.socket.connect();
      } else if (this.main) {
        this.socket.connect();
      } else {
        this.bindTopLevelEvents({ dead: true });
      }
      this.joinDeadView();
    };
    if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
      doConnect();
    } else {
      document.addEventListener("DOMContentLoaded", () => doConnect());
    }
  }
  disconnect(callback) {
    clearTimeout(this.reloadWithJitterTimer);
    if (this.serverCloseRef) {
      this.socket.off(this.serverCloseRef);
      this.serverCloseRef = null;
    }
    this.socket.disconnect(callback);
  }
  replaceTransport(transport) {
    clearTimeout(this.reloadWithJitterTimer);
    this.socket.replaceTransport(transport);
    this.connect();
  }
  execJS(el, encodedJS, eventType = null) {
    this.owner(el, (view) => js_default.exec(eventType, encodedJS, view, el));
  }
  // private
  execJSHookPush(el, phxEvent, data, callback) {
    this.withinOwners(el, (view) => {
      js_default.exec("hook", phxEvent, view, el, ["push", { data, callback }]);
    });
  }
  unload() {
    if (this.unloaded) {
      return;
    }
    if (this.main && this.isConnected()) {
      this.log(this.main, "socket", () => ["disconnect for page nav"]);
    }
    this.unloaded = true;
    this.destroyAllViews();
    this.disconnect();
  }
  triggerDOM(kind, args) {
    this.domCallbacks[kind](...args);
  }
  time(name, func) {
    if (!this.isProfileEnabled() || !console.time) {
      return func();
    }
    console.time(name);
    let result = func();
    console.timeEnd(name);
    return result;
  }
  log(view, kind, msgCallback) {
    if (this.viewLogger) {
      let [msg, obj] = msgCallback();
      this.viewLogger(view, kind, msg, obj);
    } else if (this.isDebugEnabled()) {
      let [msg, obj] = msgCallback();
      debug(view, kind, msg, obj);
    }
  }
  requestDOMUpdate(callback) {
    this.transitions.after(callback);
  }
  transition(time, onStart, onDone = function() {
  }) {
    this.transitions.addTransition(time, onStart, onDone);
  }
  onChannel(channel, event, cb) {
    channel.on(event, (data) => {
      let latency = this.getLatencySim();
      if (!latency) {
        cb(data);
      } else {
        setTimeout(() => cb(data), latency);
      }
    });
  }
  wrapPush(view, opts, push) {
    let latency = this.getLatencySim();
    let oldJoinCount = view.joinCount;
    if (!latency) {
      if (this.isConnected() && opts.timeout) {
        return push().receive("timeout", () => {
          if (view.joinCount === oldJoinCount && !view.isDestroyed()) {
            this.reloadWithJitter(view, () => {
              this.log(view, "timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
            });
          }
        });
      } else {
        return push();
      }
    }
    let fakePush = {
      receives: [],
      receive(kind, cb) {
        this.receives.push([kind, cb]);
      }
    };
    setTimeout(() => {
      if (view.isDestroyed()) {
        return;
      }
      fakePush.receives.reduce((acc, [kind, cb]) => acc.receive(kind, cb), push());
    }, latency);
    return fakePush;
  }
  reloadWithJitter(view, log) {
    clearTimeout(this.reloadWithJitterTimer);
    this.disconnect();
    let minMs = this.reloadJitterMin;
    let maxMs = this.reloadJitterMax;
    let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
    if (tries > this.maxReloads) {
      afterMs = this.failsafeJitter;
    }
    this.reloadWithJitterTimer = setTimeout(() => {
      if (view.isDestroyed() || view.isConnected()) {
        return;
      }
      view.destroy();
      log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
      if (tries > this.maxReloads) {
        this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
      }
      if (this.hasPendingLink()) {
        window.location = this.pendingLink;
      } else {
        window.location.reload();
      }
    }, afterMs);
  }
  getHookCallbacks(name) {
    return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
  }
  isUnloaded() {
    return this.unloaded;
  }
  isConnected() {
    return this.socket.isConnected();
  }
  getBindingPrefix() {
    return this.bindingPrefix;
  }
  binding(kind) {
    return `${this.getBindingPrefix()}${kind}`;
  }
  channel(topic, params) {
    return this.socket.channel(topic, params);
  }
  joinDeadView() {
    let body = document.body;
    if (body && !this.isPhxView(body) && !this.isPhxView(document.firstElementChild)) {
      let view = this.newRootView(body);
      view.setHref(this.getHref());
      view.joinDead();
      if (!this.main) {
        this.main = view;
      }
      window.requestAnimationFrame(() => view.execNewMounted());
    }
  }
  viewSelector() {
    if (this.rootViewSelector) {
      return `${this.rootViewSelector} ${PHX_VIEW_SELECTOR}`;
    } else {
      return PHX_VIEW_SELECTOR;
    }
  }
  joinRootViews() {
    let rootsFound = false;
    dom_default.all(document, `${this.viewSelector()}:not([${PHX_PARENT_ID}])`, (rootEl) => {
      if (!this.getRootById(rootEl.id)) {
        let view = this.newRootView(rootEl);
        view.setHref(this.getHref());
        view.join();
        if (rootEl.hasAttribute(PHX_MAIN)) {
          this.main = view;
        }
      }
      rootsFound = true;
    });
    return rootsFound;
  }
  redirect(to, flash) {
    this.unload();
    browser_default.redirect(to, flash);
  }
  replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
    let liveReferer = this.currentLocation.href;
    this.outgoingMainEl = this.outgoingMainEl || this.main.el;
    let newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
    this.main.showLoader(this.loaderTimeout);
    this.main.destroy();
    this.main = this.newRootView(newMainEl, flash, liveReferer);
    this.main.setRedirect(href);
    this.transitionRemoves(null, true);
    this.main.join((joinCount, onDone) => {
      if (joinCount === 1 && this.commitPendingLink(linkRef)) {
        this.requestDOMUpdate(() => {
          dom_default.findPhxSticky(document).forEach((el) => newMainEl.appendChild(el));
          this.outgoingMainEl.replaceWith(newMainEl);
          this.outgoingMainEl = null;
          callback && callback(linkRef);
          onDone();
        });
      }
    });
  }
  transitionRemoves(elements, skipSticky) {
    let removeAttr = this.binding("remove");
    elements = elements || dom_default.all(document, `[${removeAttr}]`);
    if (skipSticky) {
      const stickies = dom_default.findPhxSticky(document) || [];
      elements = elements.filter((el) => !dom_default.isChildOfAny(el, stickies));
    }
    elements.forEach((el) => {
      this.execJS(el, el.getAttribute(removeAttr), "remove");
    });
  }
  isPhxView(el) {
    return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
  }
  newRootView(el, flash, liveReferer) {
    let view = new View(el, this, null, flash, liveReferer);
    this.roots[view.id] = view;
    return view;
  }
  owner(childEl, callback) {
    let view = maybe(childEl.closest(this.viewSelector()), (el) => this.getViewByEl(el));
    if (!view && !this.rootViewSelector) {
      view = this.main;
    }
    if (view) {
      callback(view);
    }
  }
  withinOwners(childEl, callback) {
    this.owner(childEl, (view) => callback(view, childEl));
  }
  getViewByEl(el) {
    let rootId = el.getAttribute(PHX_ROOT_ID);
    return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
  }
  getRootById(id) {
    return this.roots[id];
  }
  destroyAllViews() {
    for (let id in this.roots) {
      this.roots[id].destroy();
      delete this.roots[id];
    }
    this.main = null;
  }
  destroyViewByEl(el) {
    let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
    if (root && root.id === el.id) {
      root.destroy();
      delete this.roots[root.id];
    } else if (root) {
      root.destroyDescendent(el.id);
    }
  }
  setActiveElement(target) {
    if (this.activeElement === target) {
      return;
    }
    this.activeElement = target;
    let cancel = () => {
      if (target === this.activeElement) {
        this.activeElement = null;
      }
      target.removeEventListener("mouseup", this);
      target.removeEventListener("touchend", this);
    };
    target.addEventListener("mouseup", cancel);
    target.addEventListener("touchend", cancel);
  }
  getActiveElement() {
    if (document.activeElement === document.body) {
      return this.activeElement || document.activeElement;
    } else {
      return document.activeElement || document.body;
    }
  }
  dropActiveElement(view) {
    if (this.prevActive && view.ownsElement(this.prevActive)) {
      this.prevActive = null;
    }
  }
  restorePreviouslyActiveFocus() {
    if (this.prevActive && this.prevActive !== document.body) {
      this.prevActive.focus();
    }
  }
  blurActiveElement() {
    this.prevActive = this.getActiveElement();
    if (this.prevActive !== document.body) {
      this.prevActive.blur();
    }
  }
  bindTopLevelEvents({ dead } = {}) {
    if (this.boundTopLevelEvents) {
      return;
    }
    this.boundTopLevelEvents = true;
    this.serverCloseRef = this.socket.onClose((event) => {
      if (event && event.code === 1e3 && this.main) {
        return this.reloadWithJitter(this.main);
      }
    });
    document.body.addEventListener("click", function() {
    });
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) {
        this.getSocket().disconnect();
        this.withPageLoading({ to: window.location.href, kind: "redirect" });
        window.location.reload();
      }
    }, true);
    if (!dead) {
      this.bindNav();
    }
    this.bindClicks();
    if (!dead) {
      this.bindForms();
    }
    this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, _phxTarget) => {
      let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
      let pressedKey = e.key && e.key.toLowerCase();
      if (matchKey && matchKey.toLowerCase() !== pressedKey) {
        return;
      }
      let data = { key: e.key, ...this.eventMeta(type, e, targetEl) };
      js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
    });
    this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
      if (!phxTarget) {
        let data = { key: e.key, ...this.eventMeta(type, e, targetEl) };
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      }
    });
    this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
      if (phxTarget === "window") {
        let data = this.eventMeta(type, e, targetEl);
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      }
    });
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => {
      e.preventDefault();
      let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
        return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
      });
      let dropTarget = dropTargetId && document.getElementById(dropTargetId);
      let files = Array.from(e.dataTransfer.files || []);
      if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
        return;
      }
      LiveUploader.trackFiles(dropTarget, files, e.dataTransfer);
      dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
    });
    this.on(PHX_TRACK_UPLOADS, (e) => {
      let uploadTarget = e.target;
      if (!dom_default.isUploadInput(uploadTarget)) {
        return;
      }
      let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
      LiveUploader.trackFiles(uploadTarget, files);
      uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  eventMeta(eventName, e, targetEl) {
    let callback = this.metadataCallbacks[eventName];
    return callback ? callback(e, targetEl) : {};
  }
  setPendingLink(href) {
    this.linkRef++;
    this.pendingLink = href;
    return this.linkRef;
  }
  commitPendingLink(linkRef) {
    if (this.linkRef !== linkRef) {
      return false;
    } else {
      this.href = this.pendingLink;
      this.pendingLink = null;
      return true;
    }
  }
  getHref() {
    return this.href;
  }
  hasPendingLink() {
    return !!this.pendingLink;
  }
  bind(events, callback) {
    for (let event in events) {
      let browserEventName = events[event];
      this.on(browserEventName, (e) => {
        let binding = this.binding(event);
        let windowBinding = this.binding(`window-${event}`);
        let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
        if (targetPhxEvent) {
          this.debounce(e.target, e, browserEventName, () => {
            this.withinOwners(e.target, (view) => {
              callback(e, event, view, e.target, targetPhxEvent, null);
            });
          });
        } else {
          dom_default.all(document, `[${windowBinding}]`, (el) => {
            let phxEvent = el.getAttribute(windowBinding);
            this.debounce(el, e, browserEventName, () => {
              this.withinOwners(el, (view) => {
                callback(e, event, view, el, phxEvent, "window");
              });
            });
          });
        }
      });
    }
  }
  bindClicks() {
    window.addEventListener("mousedown", (e) => this.clickStartedAtTarget = e.target);
    this.bindClick("click", "click");
  }
  bindClick(eventName, bindingName) {
    let click = this.binding(bindingName);
    window.addEventListener(eventName, (e) => {
      if (!this.isInsideRootView(e.target)) {
        return;
      }
      let target = null;
      if (e.detail === 0)
        this.clickStartedAtTarget = e.target;
      let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
      target = closestPhxBinding(clickStartedAtTarget, click);
      this.dispatchClickAway(e, clickStartedAtTarget);
      this.clickStartedAtTarget = null;
      let phxEvent = target && target.getAttribute(click);
      if (!phxEvent) {
        if (dom_default.isNewPageClick(e, window.location)) {
          this.unload();
        }
        return;
      }
      if (target.getAttribute("href") === "#") {
        e.preventDefault();
      }
      if (target.hasAttribute(PHX_REF)) {
        return;
      }
      this.debounce(target, e, "click", () => {
        this.withinOwners(target, (view) => {
          js_default.exec("click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
        });
      });
    }, false);
  }
  isInsideRootView(el) {
    return !this.rootViewSelector || el.closest(this.viewSelector());
  }
  dispatchClickAway(e, clickStartedAt) {
    let phxClickAway = this.binding("click-away");
    dom_default.all(document, `[${phxClickAway}]`, (el) => {
      if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
        this.withinOwners(el, (view) => {
          let phxEvent = el.getAttribute(phxClickAway);
          if (js_default.isVisible(el) && js_default.isInViewport(el)) {
            js_default.exec("click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
          }
        });
      }
    });
  }
  bindNav() {
    if (!browser_default.canPushState()) {
      return;
    }
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    let scrollTimer = null;
    window.addEventListener("scroll", (_e) => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
      }, 100);
    });
    window.navigation.addEventListener("navigate", (e) => {
      if (this.isInsideRootView(e.originalEvent.target)) {
        return;
      }
      const href = e.destination.url;
      if (!this.registerNewLocation(new URL(href))) {
        return;
      }
      dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: true, pop: true } });
      this.requestDOMUpdate(() => {
        if (this.main.isConnected()) {
          this.main.pushLinkPatch(href, null);
        } else {
          this.replaceMain(href, null);
        }
      });
    }, false);
    window.addEventListener("popstate", (event) => {
      if (!this.registerNewLocation(window.location)) {
        return;
      }
      let { type, id, root, scroll } = event.state || {};
      let href = window.location.href;
      dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: type === "patch", pop: true } });
      this.requestDOMUpdate(() => {
        if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
          this.main.pushLinkPatch(href, null, () => {
            this.maybeScroll(scroll);
          });
        } else {
          this.replaceMain(href, null, () => {
            if (root) {
              this.replaceRootHistory();
            }
            this.maybeScroll(scroll);
          });
        }
      });
    }, false);
    window.addEventListener("click", (e) => {
      if (!this.isInsideRootView(e.target)) {
        return;
      }
      let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
      let type = target && target.getAttribute(PHX_LIVE_LINK);
      if (!type || !this.isConnected() || !this.main || dom_default.wantsNewTab(e)) {
        return;
      }
      let href = target.href instanceof SVGAnimatedString ? target.href.baseVal : target.href;
      let linkState = target.getAttribute(PHX_LINK_STATE);
      e.preventDefault();
      e.stopImmediatePropagation();
      if (this.pendingLink === href) {
        return;
      }
      this.requestDOMUpdate(() => {
        if (type === "patch") {
          this.pushHistoryPatch(href, linkState, target);
        } else if (type === "redirect") {
          this.historyRedirect(href, linkState);
        } else {
          throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
        }
        let phxClick = target.getAttribute(this.binding("click"));
        if (phxClick) {
          this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
        }
      });
    }, false);
  }
  maybeScroll(scroll) {
    if (typeof scroll === "number") {
      requestAnimationFrame(() => {
        window.scrollTo(0, scroll);
      });
    }
  }
  dispatchEvent(event, payload = {}) {
    dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
  }
  dispatchEvents(events) {
    events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
  }
  withPageLoading(info, callback) {
    dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
    let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
    return callback ? callback(done) : done;
  }
  pushHistoryPatch(href, linkState, targetEl) {
    if (!this.isConnected() || !this.main.isMain()) {
      return browser_default.redirect(href);
    }
    this.withPageLoading({ to: href, kind: "patch" }, (done) => {
      this.main.pushLinkPatch(href, targetEl, (linkRef) => {
        this.historyPatch(href, linkState, linkRef);
        done();
      });
    });
  }
  historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
    if (!this.commitPendingLink(linkRef)) {
      return;
    }
    browser_default.pushState(linkState, { type: "patch", id: this.main.id }, href);
    dom_default.dispatchEvent(window, "phx:navigate", { detail: { patch: true, href, pop: false } });
    this.registerNewLocation(window.location);
  }
  historyRedirect(href, linkState, flash) {
    if (!this.isConnected() || !this.main.isMain()) {
      return browser_default.redirect(href, flash);
    }
    if (/^\/$|^\/[^\/]+.*$/.test(href)) {
      let { protocol, host } = window.location;
      href = `${protocol}//${host}${href}`;
    }
    let scroll = window.scrollY;
    this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
      this.replaceMain(href, flash, (linkRef) => {
        if (linkRef === this.linkRef) {
          browser_default.pushState(linkState, { type: "redirect", id: this.main.id, scroll }, href);
          dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: false, pop: false } });
          this.registerNewLocation(window.location);
        }
        done();
      });
    });
  }
  replaceRootHistory() {
    browser_default.pushState("replace", { root: true, type: "patch", id: this.main.id });
  }
  registerNewLocation(newLocation) {
    let { pathname, search } = this.currentLocation;
    if (pathname + search === newLocation.pathname + newLocation.search) {
      return false;
    } else {
      this.currentLocation = clone(newLocation);
      return true;
    }
  }
  bindForms() {
    let iterations = 0;
    let externalFormSubmitted = false;
    this.on("submit", (e) => {
      let phxSubmit = e.target.getAttribute(this.binding("submit"));
      let phxChange = e.target.getAttribute(this.binding("change"));
      if (!externalFormSubmitted && phxChange && !phxSubmit) {
        externalFormSubmitted = true;
        e.preventDefault();
        this.withinOwners(e.target, (view) => {
          view.disableForm(e.target);
          window.requestAnimationFrame(() => {
            if (dom_default.isUnloadableFormSubmit(e)) {
              this.unload();
            }
            e.target.submit();
          });
        });
      }
    }, true);
    this.on("submit", (e) => {
      let phxEvent = e.target.getAttribute(this.binding("submit"));
      if (!phxEvent) {
        if (dom_default.isUnloadableFormSubmit(e)) {
          this.unload();
        }
        return;
      }
      e.preventDefault();
      e.target.disabled = true;
      this.withinOwners(e.target, (view) => {
        js_default.exec("submit", phxEvent, view, e.target, ["push", { submitter: e.submitter }]);
      });
    }, false);
    for (let type of ["change", "input"]) {
      this.on(type, (e) => {
        let phxChange = this.binding("change");
        let input = e.target;
        let inputEvent = input.getAttribute(phxChange);
        let formEvent = input.form && input.form.getAttribute(phxChange);
        let phxEvent = inputEvent || formEvent;
        if (!phxEvent) {
          return;
        }
        if (input.type === "number" && input.validity && input.validity.badInput) {
          return;
        }
        let dispatcher = inputEvent ? input : input.form;
        let currentIterations = iterations;
        iterations++;
        let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
        if (at === currentIterations - 1 && type === "change" && lastType === "input") {
          return;
        }
        dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
        this.debounce(input, e, type, () => {
          this.withinOwners(dispatcher, (view) => {
            dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
            if (!dom_default.isTextualInput(input)) {
              this.setActiveElement(input);
            }
            js_default.exec("change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
          });
        });
      }, false);
    }
    this.on("reset", (e) => {
      let form = e.target;
      dom_default.resetForm(form, this.binding(PHX_FEEDBACK_FOR), this.binding(PHX_FEEDBACK_GROUP));
      let input = Array.from(form.elements).find((el) => el.type === "reset");
      if (input) {
        window.requestAnimationFrame(() => {
          input.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
        });
      }
    });
  }
  debounce(el, event, eventType, callback) {
    if (eventType === "blur" || eventType === "focusout") {
      return callback();
    }
    let phxDebounce = this.binding(PHX_DEBOUNCE);
    let phxThrottle = this.binding(PHX_THROTTLE);
    let defaultDebounce = this.defaults.debounce.toString();
    let defaultThrottle = this.defaults.throttle.toString();
    this.withinOwners(el, (view) => {
      let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
      dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
        callback();
      });
    });
  }
  silenceEvents(callback) {
    this.silenced = true;
    callback();
    this.silenced = false;
  }
  on(event, callback) {
    window.addEventListener(event, (e) => {
      if (!this.silenced) {
        callback(e);
      }
    });
  }
};
var TransitionSet = class {
  constructor() {
    this.transitions = /* @__PURE__ */ new Set();
    this.pendingOps = [];
  }
  reset() {
    this.transitions.forEach((timer) => {
      clearTimeout(timer);
      this.transitions.delete(timer);
    });
    this.flushPendingOps();
  }
  after(callback) {
    if (this.size() === 0) {
      callback();
    } else {
      this.pushPendingOp(callback);
    }
  }
  addTransition(time, onStart, onDone) {
    onStart();
    let timer = setTimeout(() => {
      this.transitions.delete(timer);
      onDone();
      this.flushPendingOps();
    }, time);
    this.transitions.add(timer);
  }
  pushPendingOp(op) {
    this.pendingOps.push(op);
  }
  size() {
    return this.transitions.size;
  }
  flushPendingOps() {
    if (this.size() > 0) {
      return;
    }
    let op = this.pendingOps.shift();
    if (op) {
      op();
      this.flushPendingOps();
    }
  }
};
//# sourceMappingURL=phoenix_live_view.cjs.js.map
