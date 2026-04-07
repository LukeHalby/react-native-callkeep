"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AudioSessionCategoryOption: () => AudioSessionCategoryOption,
  AudioSessionMode: () => AudioSessionMode,
  CONSTANTS: () => CONSTANTS,
  EventListener: () => EventListener,
  default: () => index_default,
  emit: () => emit
});
module.exports = __toCommonJS(index_exports);
var import_react_native2 = require("react-native");

// src/actions.ts
var import_react_native = require("react-native");
var RNCallKeepModule = import_react_native.NativeModules.RNCallKeep;
var eventEmitter = new import_react_native.NativeEventEmitter(RNCallKeepModule);
var RNCallKeepDidReceiveStartCallAction = "RNCallKeepDidReceiveStartCallAction";
var RNCallKeepPerformAnswerCallAction = "RNCallKeepPerformAnswerCallAction";
var RNCallKeepPerformEndCallAction = "RNCallKeepPerformEndCallAction";
var RNCallKeepDidActivateAudioSession = "RNCallKeepDidActivateAudioSession";
var RNCallKeepDidDeactivateAudioSession = "RNCallKeepDidDeactivateAudioSession";
var RNCallKeepDidDisplayIncomingCall = "RNCallKeepDidDisplayIncomingCall";
var RNCallKeepDidPerformSetMutedCallAction = "RNCallKeepDidPerformSetMutedCallAction";
var RNCallKeepDidToggleHoldAction = "RNCallKeepDidToggleHoldAction";
var RNCallKeepDidPerformDTMFAction = "RNCallKeepDidPerformDTMFAction";
var RNCallKeepProviderReset = "RNCallKeepProviderReset";
var RNCallKeepCheckReachability = "RNCallKeepCheckReachability";
var RNCallKeepDidLoadWithEvents = "RNCallKeepDidLoadWithEvents";
var RNCallKeepShowIncomingCallUi = "RNCallKeepShowIncomingCallUi";
var RNCallKeepOnSilenceIncomingCall = "RNCallKeepOnSilenceIncomingCall";
var RNCallKeepOnIncomingConnectionFailed = "RNCallKeepOnIncomingConnectionFailed";
var RNCallKeepDidChangeAudioRoute = "RNCallKeepDidChangeAudioRoute";
var RNCallKeepHasActiveCall = "RNCallKeepHasActiveCall";
var isIOS = import_react_native.Platform.OS === "ios";
var didReceiveStartCallAction = (handler) => {
  if (isIOS) {
    RNCallKeepModule._startCallActionEventListenerAdded();
  }
  return eventEmitter.addListener(RNCallKeepDidReceiveStartCallAction, (data) => handler(data));
};
var answerCall = (handler) => eventEmitter.addListener(RNCallKeepPerformAnswerCallAction, (data) => handler(data));
var endCall = (handler) => eventEmitter.addListener(RNCallKeepPerformEndCallAction, (data) => handler(data));
var didChangeAudioRoute = (handler) => eventEmitter.addListener(RNCallKeepDidChangeAudioRoute, handler);
var didActivateAudioSession = (handler) => eventEmitter.addListener(RNCallKeepDidActivateAudioSession, handler);
var didDeactivateAudioSession = (handler) => eventEmitter.addListener(RNCallKeepDidDeactivateAudioSession, handler);
var didDisplayIncomingCall = (handler) => eventEmitter.addListener(RNCallKeepDidDisplayIncomingCall, (data) => {
  if (data.payload && typeof data.payload === "string") {
    try {
      data.payload = JSON.parse(data.payload);
    } catch (_) {
    }
  }
  handler(data);
});
var didPerformSetMutedCallAction = (handler) => eventEmitter.addListener(RNCallKeepDidPerformSetMutedCallAction, (data) => handler(data));
var onHasActiveCall = (handler) => eventEmitter.addListener(RNCallKeepHasActiveCall, handler);
var didToggleHoldCallAction = (handler) => eventEmitter.addListener(RNCallKeepDidToggleHoldAction, handler);
var didPerformDTMFAction = (handler) => eventEmitter.addListener(RNCallKeepDidPerformDTMFAction, (data) => handler(data));
var didResetProvider = (handler) => eventEmitter.addListener(RNCallKeepProviderReset, handler);
var checkReachability = (handler) => eventEmitter.addListener(RNCallKeepCheckReachability, handler);
var didLoadWithEvents = (handler) => eventEmitter.addListener(RNCallKeepDidLoadWithEvents, handler);
var showIncomingCallUi = (handler) => eventEmitter.addListener(RNCallKeepShowIncomingCallUi, (data) => handler(data));
var silenceIncomingCall = (handler) => eventEmitter.addListener(RNCallKeepOnSilenceIncomingCall, (data) => handler(data));
var createIncomingConnectionFailed = (handler) => eventEmitter.addListener(RNCallKeepOnIncomingConnectionFailed, (data) => handler(data));
var emit = (eventName, payload) => {
  eventEmitter.emit(eventName, payload);
};
var listeners = {
  didReceiveStartCallAction,
  answerCall,
  endCall,
  didActivateAudioSession,
  didDeactivateAudioSession,
  didDisplayIncomingCall,
  didPerformSetMutedCallAction,
  didToggleHoldCallAction,
  didPerformDTMFAction,
  didResetProvider,
  checkReachability,
  didLoadWithEvents,
  showIncomingCallUi,
  silenceIncomingCall,
  createIncomingConnectionFailed,
  didChangeAudioRoute,
  onHasActiveCall
};

// src/index.ts
var RNCallKeepModule2 = import_react_native2.NativeModules.RNCallKeep;
var isIOS2 = import_react_native2.Platform.OS === "ios";
var supportConnectionService = !isIOS2 && import_react_native2.Platform.Version >= 23;
var AudioSessionCategoryOption = /* @__PURE__ */ ((AudioSessionCategoryOption2) => {
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["mixWithOthers"] = 1] = "mixWithOthers";
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["duckOthers"] = 2] = "duckOthers";
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["interruptSpokenAudioAndMixWithOthers"] = 17] = "interruptSpokenAudioAndMixWithOthers";
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["allowBluetooth"] = 4] = "allowBluetooth";
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["allowBluetoothA2DP"] = 32] = "allowBluetoothA2DP";
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["allowAirPlay"] = 64] = "allowAirPlay";
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["defaultToSpeaker"] = 8] = "defaultToSpeaker";
  AudioSessionCategoryOption2[AudioSessionCategoryOption2["overrideMutedMicrophoneInterruption"] = 128] = "overrideMutedMicrophoneInterruption";
  return AudioSessionCategoryOption2;
})(AudioSessionCategoryOption || {});
var AudioSessionMode = /* @__PURE__ */ ((AudioSessionMode2) => {
  AudioSessionMode2["default"] = "AVAudioSessionModeDefault";
  AudioSessionMode2["gameChat"] = "AVAudioSessionModeGameChat";
  AudioSessionMode2["measurement"] = "AVAudioSessionModeMeasurement";
  AudioSessionMode2["moviePlayback"] = "AVAudioSessionModeMoviePlayback";
  AudioSessionMode2["spokenAudio"] = "AVAudioSessionModeSpokenAudio";
  AudioSessionMode2["videoChat"] = "AVAudioSessionModeVideoChat";
  AudioSessionMode2["videoRecording"] = "AVAudioSessionModeVideoRecording";
  AudioSessionMode2["voiceChat"] = "AVAudioSessionModeVoiceChat";
  AudioSessionMode2["voicePrompt"] = "AVAudioSessionModeVoicePrompt";
  return AudioSessionMode2;
})(AudioSessionMode || {});
var CONSTANTS = {
  END_CALL_REASONS: {
    FAILED: 1,
    REMOTE_ENDED: 2,
    UNANSWERED: 3,
    ANSWERED_ELSEWHERE: 4,
    DECLINED_ELSEWHERE: isIOS2 ? 5 : 2,
    // make declined elsewhere link to "Remote ended" on android because that's kinda true
    MISSED: isIOS2 ? 2 : 6
  }
};
var EventListener = class {
  constructor(type, listener, callkeep) {
    this.remove = () => {
      this._callkeep.removeEventListener(this._type, this._listener);
    };
    this._type = type;
    this._listener = listener;
    this._callkeep = callkeep;
  }
};
var RNCallKeep = class {
  constructor() {
    this._callkeepEventHandlers = /* @__PURE__ */ new Map();
    this.addEventListener = (type, handler) => {
      var _a;
      const listener = listeners[type](handler);
      const listenerSet = (_a = this._callkeepEventHandlers.get(type)) != null ? _a : /* @__PURE__ */ new Set();
      listenerSet.add(listener);
      this._callkeepEventHandlers.set(type, listenerSet);
      return new EventListener(type, listener, this);
    };
    this.removeEventListener = (type, listener) => {
      const listenerSet = this._callkeepEventHandlers.get(type);
      if (!listenerSet) {
        return;
      }
      if (listener) {
        listenerSet.delete(listener);
        listener.remove();
        if (listenerSet.size <= 0) {
          this._callkeepEventHandlers.delete(type);
        }
      } else {
        listenerSet.forEach((l) => {
          l.remove();
        });
        this._callkeepEventHandlers.delete(type);
      }
    };
    this.setup = async (options) => {
      if (!isIOS2) {
        return this._setupAndroid(options.android);
      }
      return this._setupIOS(options.ios);
    };
    this.setSettings = (settings) => RNCallKeepModule2.setSettings(settings[isIOS2 ? "ios" : "android"]);
    this.registerPhoneAccount = (options) => {
      if (isIOS2) {
        return;
      }
      RNCallKeepModule2.registerPhoneAccount(options.android);
    };
    this.registerAndroidEvents = () => {
      if (isIOS2) {
        return;
      }
      RNCallKeepModule2.registerEvents();
    };
    this.unregisterAndroidEvents = () => {
      if (isIOS2) {
        return;
      }
      RNCallKeepModule2.unregisterEvents();
    };
    this.hasDefaultPhoneAccount = async (options) => {
      if (!isIOS2) {
        return this._hasDefaultPhoneAccount(options);
      }
      return;
    };
    this.displayIncomingCall = (uuid, handle, localizedCallerName = "", handleType = "number", hasVideo = false, options = null) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (!isIOS2) {
        RNCallKeepModule2.displayIncomingCall(uuid, handle, localizedCallerName, hasVideo);
        return;
      }
      const supportsHolding = !!((_b = (_a = options == null ? void 0 : options.ios) == null ? void 0 : _a.supportsHolding) != null ? _b : true);
      const supportsDTMF = !!((_d = (_c = options == null ? void 0 : options.ios) == null ? void 0 : _c.supportsDTMF) != null ? _d : true);
      const supportsGrouping = !!((_f = (_e = options == null ? void 0 : options.ios) == null ? void 0 : _e.supportsGrouping) != null ? _f : true);
      const supportsUngrouping = !!((_h = (_g = options == null ? void 0 : options.ios) == null ? void 0 : _g.supportsUngrouping) != null ? _h : true);
      RNCallKeepModule2.displayIncomingCall(
        uuid,
        handle,
        handleType,
        hasVideo,
        localizedCallerName,
        supportsHolding,
        supportsDTMF,
        supportsGrouping,
        supportsUngrouping
      );
    };
    this.checkIsInManagedCall = async () => isIOS2 ? false : RNCallKeepModule2.checkIsInManagedCall();
    this.answerIncomingCall = (uuid) => {
      RNCallKeepModule2.answerIncomingCall(uuid);
    };
    this.startCall = (uuid, handle, contactIdentifier, handleType = "number", hasVideo = false) => {
      if (!isIOS2) {
        RNCallKeepModule2.startCall(uuid, handle, contactIdentifier, hasVideo);
        return;
      }
      RNCallKeepModule2.startCall(uuid, handle, contactIdentifier, handleType, hasVideo);
    };
    this.checkPhoneAccountEnabled = async () => {
      if (isIOS2) {
        return;
      }
      return RNCallKeepModule2.checkPhoneAccountEnabled();
    };
    this.isConnectionServiceAvailable = async () => {
      if (isIOS2) {
        return true;
      }
      return RNCallKeepModule2.isConnectionServiceAvailable();
    };
    this.reportConnectingOutgoingCallWithUUID = (uuid) => {
      if (isIOS2) {
        RNCallKeepModule2.reportConnectingOutgoingCallWithUUID(uuid);
      }
    };
    this.reportConnectedOutgoingCallWithUUID = (uuid) => {
      if (isIOS2) {
        RNCallKeepModule2.reportConnectedOutgoingCallWithUUID(uuid);
      }
    };
    this.reportEndCallWithUUID = (uuid, reason) => RNCallKeepModule2.reportEndCallWithUUID(uuid, reason);
    /*
     * Android explicitly states we reject a call
     * On iOS we just notify of an endCall
     */
    this.rejectCall = (uuid) => {
      if (!isIOS2) {
        RNCallKeepModule2.rejectCall(uuid);
      } else {
        RNCallKeepModule2.endCall(uuid);
      }
    };
    this.isCallActive = async (uuid) => await RNCallKeepModule2.isCallActive(uuid);
    this.getCalls = () => {
      if (isIOS2) {
        return RNCallKeepModule2.getCalls();
      }
    };
    this.endCall = (uuid) => RNCallKeepModule2.endCall(uuid);
    this.endAllCalls = () => RNCallKeepModule2.endAllCalls();
    this.supportConnectionService = () => supportConnectionService;
    this.hasPhoneAccount = async () => isIOS2 ? true : await RNCallKeepModule2.hasPhoneAccount();
    this.hasOutgoingCall = async () => isIOS2 ? null : await RNCallKeepModule2.hasOutgoingCall();
    this.setMutedCall = (uuid, shouldMute) => {
      RNCallKeepModule2.setMutedCall(uuid, shouldMute);
    };
    this.sendDTMF = (uuid, key) => RNCallKeepModule2.sendDTMF(uuid, key);
    /**
     * @description when Phone call is active, Android control the audio service via connection service. so this function help to toggle the audio to Speaker or wired/ear-piece or vice-versa
     * @param uuid
     * @param routeSpeaker
     * @returns Audio route state of audio service
     */
    this.toggleAudioRouteSpeaker = (uuid, routeSpeaker) => isIOS2 ? null : RNCallKeepModule2.toggleAudioRouteSpeaker(uuid, routeSpeaker);
    this.getAudioRoutes = () => RNCallKeepModule2.getAudioRoutes();
    this.setAudioRoute = (uuid, inputName) => RNCallKeepModule2.setAudioRoute(uuid, inputName);
    this.checkIfBusy = () => isIOS2 ? RNCallKeepModule2.checkIfBusy() : Promise.reject("RNCallKeep.checkIfBusy was called from unsupported OS");
    this.checkSpeaker = () => isIOS2 ? RNCallKeepModule2.checkSpeaker() : Promise.reject("RNCallKeep.checkSpeaker was called from unsupported OS");
    this.setAvailable = (state) => {
      if (isIOS2) {
        return;
      }
      RNCallKeepModule2.setAvailable(state);
    };
    this.setForegroundServiceSettings = (settings) => {
      if (isIOS2) {
        return;
      }
      RNCallKeepModule2.setForegroundServiceSettings(settings);
    };
    this.canMakeMultipleCalls = (state) => {
      if (isIOS2) {
        return;
      }
      RNCallKeepModule2.canMakeMultipleCalls(state);
    };
    this.setCurrentCallActive = (callUUID) => {
      if (isIOS2) {
        return;
      }
      RNCallKeepModule2.setCurrentCallActive(callUUID);
    };
    this.updateDisplay = (uuid, displayName, handle, options = null) => {
      if (!isIOS2) {
        RNCallKeepModule2.updateDisplay(uuid, displayName, handle);
        return;
      }
      let iosOptions = {};
      if (options && options.ios) {
        iosOptions = __spreadValues({}, options.ios);
      }
      RNCallKeepModule2.updateDisplay(uuid, displayName, handle, iosOptions);
    };
    this.setOnHold = (uuid, shouldHold) => RNCallKeepModule2.setOnHold(uuid, shouldHold);
    this.setConnectionState = (uuid, state) => isIOS2 ? null : RNCallKeepModule2.setConnectionState(uuid, state);
    this.setReachable = () => RNCallKeepModule2.setReachable();
    // @deprecated
    this.reportUpdatedCall = (uuid, localizedCallerName) => {
      console.warn("RNCallKeep.reportUpdatedCall is deprecated, use RNCallKeep.updateDisplay instead");
      return isIOS2 ? RNCallKeepModule2.reportUpdatedCall(uuid, localizedCallerName) : Promise.reject("RNCallKeep.reportUpdatedCall was called from unsupported OS");
    };
    this._setupIOS = async (options) => new Promise((resolve, reject) => {
      if (!options.appName) {
        reject('RNCallKeep.setup: option "appName" is required');
      }
      if (typeof options.appName !== "string") {
        reject('RNCallKeep.setup: option "appName" should be of type "string"');
      }
      resolve(RNCallKeepModule2.setup(options));
    });
    this._setupAndroid = async (options) => {
      RNCallKeepModule2.setup(options);
      if (options.selfManaged) {
        return false;
      }
      const showAccountAlert = await RNCallKeepModule2.checkPhoneAccountPermission(options.additionalPermissions || []);
      const shouldOpenAccounts = await this._alert(options, showAccountAlert);
      if (shouldOpenAccounts) {
        RNCallKeepModule2.openPhoneAccounts();
        return true;
      }
      return false;
    };
    this._hasDefaultPhoneAccount = async (options) => {
      const hasDefault = await RNCallKeepModule2.checkDefaultPhoneAccount();
      const shouldOpenAccounts = await this._alert(options, hasDefault);
      if (shouldOpenAccounts) {
        RNCallKeepModule2.openPhoneAccountSettings();
      }
    };
    this._alert = async (options, condition) => new Promise((resolve, reject) => {
      if (!condition) {
        return resolve(false);
      }
      import_react_native2.Alert.alert(
        options.alertTitle,
        options.alertDescription,
        [
          {
            text: options.cancelButton,
            onPress: reject,
            style: "cancel"
          },
          { text: options.okButton, onPress: () => resolve(true) }
        ],
        { cancelable: true }
      );
    });
  }
  backToForeground() {
    if (isIOS2) {
      return;
    }
    import_react_native2.NativeModules.RNCallKeep.backToForeground();
  }
  getInitialEvents() {
    return RNCallKeepModule2.getInitialEvents();
  }
  clearInitialEvents() {
    return RNCallKeepModule2.clearInitialEvents();
  }
};
var index_default = new RNCallKeep();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AudioSessionCategoryOption,
  AudioSessionMode,
  CONSTANTS,
  EventListener,
  emit
});
