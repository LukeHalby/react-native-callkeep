import { NativeModules, Platform, Alert, EmitterSubscription } from 'react-native';

import { listeners, emit } from './actions';

const RNCallKeepModule = NativeModules.RNCallKeep;
const isIOS = Platform.OS === 'ios';
const supportConnectionService = !isIOS && (Platform.Version as number) >= 23;

// ---- Types ----

export type NativeEvents = {
  didReceiveStartCallAction: 'RNCallKeepDidReceiveStartCallAction';
  answerCall: 'RNCallKeepPerformAnswerCallAction';
  endCall: 'RNCallKeepPerformEndCallAction';
  didActivateAudioSession: 'RNCallKeepDidActivateAudioSession';
  didDeactivateAudioSession: 'RNCallKeepDidDeactivateAudioSession';
  didDisplayIncomingCall: 'RNCallKeepDidDisplayIncomingCall';
  didPerformSetMutedCallAction: 'RNCallKeepDidPerformSetMutedCallAction';
  didToggleHoldCallAction: 'RNCallKeepDidToggleHoldAction';
  didChangeAudioRoute: 'RNCallKeepDidChangeAudioRoute';
  didPerformDTMFAction: 'RNCallKeepDidPerformDTMFAction';
  showIncomingCallUi: 'RNCallKeepShowIncomingCallUi';
  silenceIncomingCall: 'RNCallKeepOnSilenceIncomingCall';
  createIncomingConnectionFailed: 'RNCallKeepOnIncomingConnectionFailed';
  checkReachability: 'RNCallKeepCheckReachability';
  didResetProvider: 'RNCallKeepProviderReset';
  didLoadWithEvents: 'RNCallKeepDidLoadWithEvents';
  onHasActiveCall: 'onHasActiveCall';
};

export type Events = keyof NativeEvents;

export type EventsPayload = {
  didReceiveStartCallAction: { handle: string; callUUID?: string; name?: string };
  answerCall: { callUUID: string };
  endCall: { callUUID: string };
  didActivateAudioSession: undefined;
  didDeactivateAudioSession: undefined;
  didDisplayIncomingCall: {
    error?: string;
    errorCode?: 'Unentitled' | 'CallUUIDAlreadyExists' | 'FilteredByDoNotDisturb' | 'FilteredByBlockList' | 'Unknown';
    callUUID: string;
    handle: string;
    localizedCallerName: string;
    hasVideo: '1' | '0';
    fromPushKit: '1' | '0';
    payload: object;
  };
  didPerformSetMutedCallAction: { muted: boolean; callUUID: string };
  didToggleHoldCallAction: { hold: boolean; callUUID: string };
  didChangeAudioRoute: {
    output: string;
    reason?: number;
    handle?: string;
    callUUID?: string;
  };
  didPerformDTMFAction: { digits: string; callUUID: string };
  showIncomingCallUi: { handle: string; callUUID: string; name: string };
  silenceIncomingCall: { handle: string; callUUID: string; name: string };
  createIncomingConnectionFailed: { handle: string; callUUID: string; name: string };
  checkReachability: undefined;
  didResetProvider: undefined;
  didLoadWithEvents: InitialEvents;
  onHasActiveCall: undefined;
};

export type InitialEvents = Array<{
  [Event in Events]: { name: NativeEvents[Event]; data: EventsPayload[Event] };
}[Events]>;

type HandleType = 'generic' | 'number' | 'email';

export type AudioRoute = {
  name: string;
  type: string;
  selected?: boolean;
};

export enum AudioSessionCategoryOption {
  mixWithOthers = 0x1,
  duckOthers = 0x2,
  interruptSpokenAudioAndMixWithOthers = 0x11,
  allowBluetooth = 0x4,
  allowBluetoothA2DP = 0x20,
  allowAirPlay = 0x40,
  defaultToSpeaker = 0x8,
  overrideMutedMicrophoneInterruption = 0x80,
}

export enum AudioSessionMode {
  default = 'AVAudioSessionModeDefault',
  gameChat = 'AVAudioSessionModeGameChat',
  measurement = 'AVAudioSessionModeMeasurement',
  moviePlayback = 'AVAudioSessionModeMoviePlayback',
  spokenAudio = 'AVAudioSessionModeSpokenAudio',
  videoChat = 'AVAudioSessionModeVideoChat',
  videoRecording = 'AVAudioSessionModeVideoRecording',
  voiceChat = 'AVAudioSessionModeVoiceChat',
  voicePrompt = 'AVAudioSessionModeVoicePrompt',
}

export interface IOptions {
  ios: {
    appName: string;
    imageName?: string;
    supportsVideo?: boolean;
    maximumCallGroups?: string;
    maximumCallsPerCallGroup?: string;
    ringtoneSound?: string;
    includesCallsInRecents?: boolean;
    audioSession?: {
      categoryOptions?: AudioSessionCategoryOption | number;
      mode?: AudioSessionMode | string;
    };
  };
  android: {
    alertTitle: string;
    alertDescription: string;
    cancelButton: string;
    okButton: string;
    imageName?: string;
    additionalPermissions: string[];
    selfManaged?: boolean;
    foregroundService?: {
      channelId: string;
      channelName: string;
      notificationTitle: string;
      notificationIcon?: string;
    };
  };
}

export const CONSTANTS = {
  END_CALL_REASONS: {
    FAILED: 1,
    REMOTE_ENDED: 2,
    UNANSWERED: 3,
    ANSWERED_ELSEWHERE: 4,
    DECLINED_ELSEWHERE: isIOS ? 5 : 2, // make declined elsewhere link to "Remote ended" on android because that's kinda true
    MISSED: isIOS ? 2 : 6,
  },
} as const;

export { emit };

// ---- EventListener ----

export class EventListener {
  private _type: Events;
  private _listener: EmitterSubscription;
  private _callkeep: RNCallKeep;

  constructor(type: Events, listener: EmitterSubscription, callkeep: RNCallKeep) {
    this._type = type;
    this._listener = listener;
    this._callkeep = callkeep;
  }

  remove = (): void => {
    this._callkeep.removeEventListener(this._type, this._listener);
  };
}

// ---- RNCallKeep ----

class RNCallKeep {
  private _callkeepEventHandlers = new Map<Events, Set<EmitterSubscription>>();

  addEventListener = <Event extends Events>(
    type: Event,
    handler: (args: EventsPayload[Event]) => void,
  ): EventListener => {
    const listener = listeners[type](handler as (data: any) => void);

    const listenerSet = this._callkeepEventHandlers.get(type) ?? new Set<EmitterSubscription>();
    listenerSet.add(listener);

    this._callkeepEventHandlers.set(type, listenerSet);

    return new EventListener(type, listener, this);
  };

  removeEventListener = (type: Events, listener?: EmitterSubscription): void => {
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

  setup = async (options: IOptions): Promise<boolean> => {
    if (!isIOS) {
      return this._setupAndroid(options.android);
    }

    return this._setupIOS(options.ios);
  };

  setSettings = (settings: IOptions): void =>
    RNCallKeepModule.setSettings(settings[isIOS ? 'ios' : 'android']);

  registerPhoneAccount = (options: IOptions): void => {
    if (isIOS) {
      return;
    }
    RNCallKeepModule.registerPhoneAccount(options.android);
  };

  registerAndroidEvents = (): void => {
    if (isIOS) {
      return;
    }
    RNCallKeepModule.registerEvents();
  };

  unregisterAndroidEvents = (): void => {
    if (isIOS) {
      return;
    }
    RNCallKeepModule.unregisterEvents();
  };

  hasDefaultPhoneAccount = async (options: IOptions['android']): Promise<void> => {
    if (!isIOS) {
      return this._hasDefaultPhoneAccount(options);
    }

    return;
  };

  displayIncomingCall = (
    uuid: string,
    handle: string,
    localizedCallerName = '',
    handleType: HandleType = 'number',
    hasVideo = false,
    options: { ios?: { supportsHolding?: boolean; supportsDTMF?: boolean; supportsGrouping?: boolean; supportsUngrouping?: boolean } } | null = null,
  ): void => {
    if (!isIOS) {
      RNCallKeepModule.displayIncomingCall(uuid, handle, localizedCallerName, hasVideo);
      return;
    }

    // should be boolean type value
    const supportsHolding = !!(options?.ios?.supportsHolding ?? true);
    const supportsDTMF = !!(options?.ios?.supportsDTMF ?? true);
    const supportsGrouping = !!(options?.ios?.supportsGrouping ?? true);
    const supportsUngrouping = !!(options?.ios?.supportsUngrouping ?? true);

    RNCallKeepModule.displayIncomingCall(
      uuid,
      handle,
      handleType,
      hasVideo,
      localizedCallerName,
      supportsHolding,
      supportsDTMF,
      supportsGrouping,
      supportsUngrouping,
    );
  };

  checkIsInManagedCall = async (): Promise<boolean> =>
    isIOS ? false : RNCallKeepModule.checkIsInManagedCall();

  answerIncomingCall = (uuid: string): void => {
    RNCallKeepModule.answerIncomingCall(uuid);
  };

  startCall = (
    uuid: string,
    handle: string,
    contactIdentifier?: string,
    handleType: HandleType = 'number',
    hasVideo = false,
  ): void => {
    if (!isIOS) {
      RNCallKeepModule.startCall(uuid, handle, contactIdentifier, hasVideo);
      return;
    }

    RNCallKeepModule.startCall(uuid, handle, contactIdentifier, handleType, hasVideo);
  };

  checkPhoneAccountEnabled = async (): Promise<boolean | undefined> => {
    if (isIOS) {
      return;
    }

    return RNCallKeepModule.checkPhoneAccountEnabled();
  };

  isConnectionServiceAvailable = async (): Promise<boolean> => {
    if (isIOS) {
      return true;
    }

    return RNCallKeepModule.isConnectionServiceAvailable();
  };

  reportConnectingOutgoingCallWithUUID = (uuid: string): void => {
    //only available on iOS
    if (isIOS) {
      RNCallKeepModule.reportConnectingOutgoingCallWithUUID(uuid);
    }
  };

  reportConnectedOutgoingCallWithUUID = (uuid: string): void => {
    //only available on iOS
    if (isIOS) {
      RNCallKeepModule.reportConnectedOutgoingCallWithUUID(uuid);
    }
  };

  reportEndCallWithUUID = (uuid: string, reason: number): void =>
    RNCallKeepModule.reportEndCallWithUUID(uuid, reason);

  /*
   * Android explicitly states we reject a call
   * On iOS we just notify of an endCall
   */
  rejectCall = (uuid: string): void => {
    if (!isIOS) {
      RNCallKeepModule.rejectCall(uuid);
    } else {
      RNCallKeepModule.endCall(uuid);
    }
  };

  isCallActive = async (uuid: string): Promise<boolean> =>
    await RNCallKeepModule.isCallActive(uuid);

  getCalls = (): Promise<{ callUUID: string; hasConnected: boolean; hasEnded: boolean; onHold: boolean; outgoing: boolean }[] | void> | void => {
    if (isIOS) {
      return RNCallKeepModule.getCalls();
    }
  };

  endCall = (uuid: string): void => RNCallKeepModule.endCall(uuid);

  endAllCalls = (): void => RNCallKeepModule.endAllCalls();

  supportConnectionService = (): boolean => supportConnectionService;

  hasPhoneAccount = async (): Promise<boolean> =>
    isIOS ? true : await RNCallKeepModule.hasPhoneAccount();

  hasOutgoingCall = async (): Promise<boolean | null> =>
    isIOS ? null : await RNCallKeepModule.hasOutgoingCall();

  setMutedCall = (uuid: string, shouldMute: boolean): void => {
    RNCallKeepModule.setMutedCall(uuid, shouldMute);
  };

  sendDTMF = (uuid: string, key: string): void => RNCallKeepModule.sendDTMF(uuid, key);

  /**
   * @description when Phone call is active, Android control the audio service via connection service. so this function help to toggle the audio to Speaker or wired/ear-piece or vice-versa
   * @param uuid
   * @param routeSpeaker
   * @returns Audio route state of audio service
   */
  toggleAudioRouteSpeaker = (uuid: string, routeSpeaker: boolean): null | void =>
    isIOS ? null : RNCallKeepModule.toggleAudioRouteSpeaker(uuid, routeSpeaker);

  getAudioRoutes = (): Promise<void> => RNCallKeepModule.getAudioRoutes();

  setAudioRoute = (uuid: string, inputName: string): Promise<void> =>
    RNCallKeepModule.setAudioRoute(uuid, inputName);

  checkIfBusy = (): Promise<boolean> =>
    isIOS
      ? RNCallKeepModule.checkIfBusy()
      : Promise.reject('RNCallKeep.checkIfBusy was called from unsupported OS');

  checkSpeaker = (): Promise<boolean> =>
    isIOS
      ? RNCallKeepModule.checkSpeaker()
      : Promise.reject('RNCallKeep.checkSpeaker was called from unsupported OS');

  setAvailable = (state: boolean): void => {
    if (isIOS) {
      return;
    }

    // Tell android that we are able to make outgoing calls
    RNCallKeepModule.setAvailable(state);
  };

  setForegroundServiceSettings = (settings: NonNullable<IOptions['android']['foregroundService']>): void => {
    if (isIOS) {
      return;
    }

    RNCallKeepModule.setForegroundServiceSettings(settings);
  };

  canMakeMultipleCalls = (state: boolean): void => {
    if (isIOS) {
      return;
    }

    RNCallKeepModule.canMakeMultipleCalls(state);
  };

  setCurrentCallActive = (callUUID: string): void => {
    if (isIOS) {
      return;
    }

    RNCallKeepModule.setCurrentCallActive(callUUID);
  };

  updateDisplay = (
    uuid: string,
    displayName: string,
    handle: string,
    options: { ios?: Record<string, unknown> } | null = null,
  ): void => {
    if (!isIOS) {
      RNCallKeepModule.updateDisplay(uuid, displayName, handle);
      return;
    }

    let iosOptions: Record<string, unknown> = {};
    if (options && options.ios) {
      iosOptions = {
        ...options.ios,
      };
    }
    RNCallKeepModule.updateDisplay(uuid, displayName, handle, iosOptions);
  };

  setOnHold = (uuid: string, shouldHold: boolean): void =>
    RNCallKeepModule.setOnHold(uuid, shouldHold);

  setConnectionState = (uuid: string, state: number): null | void =>
    isIOS ? null : RNCallKeepModule.setConnectionState(uuid, state);

  setReachable = (): void => RNCallKeepModule.setReachable();

  // @deprecated
  reportUpdatedCall = (uuid: string, localizedCallerName: string): Promise<void> => {
    console.warn('RNCallKeep.reportUpdatedCall is deprecated, use RNCallKeep.updateDisplay instead');

    return isIOS
      ? RNCallKeepModule.reportUpdatedCall(uuid, localizedCallerName)
      : Promise.reject('RNCallKeep.reportUpdatedCall was called from unsupported OS');
  };

  private _setupIOS = async (options: IOptions['ios']): Promise<boolean> =>
    new Promise((resolve, reject) => {
      if (!options.appName) {
        reject('RNCallKeep.setup: option "appName" is required');
      }
      if (typeof options.appName !== 'string') {
        reject('RNCallKeep.setup: option "appName" should be of type "string"');
      }

      resolve(RNCallKeepModule.setup(options));
    });

  private _setupAndroid = async (options: IOptions['android']): Promise<boolean> => {
    RNCallKeepModule.setup(options);

    if (options.selfManaged) {
      return false;
    }

    const showAccountAlert = await RNCallKeepModule.checkPhoneAccountPermission(options.additionalPermissions || []);
    const shouldOpenAccounts = await this._alert(options, showAccountAlert);

    if (shouldOpenAccounts) {
      RNCallKeepModule.openPhoneAccounts();
      return true;
    }

    return false;
  };

  private _hasDefaultPhoneAccount = async (options: IOptions['android']): Promise<void> => {
    const hasDefault = await RNCallKeepModule.checkDefaultPhoneAccount();
    const shouldOpenAccounts = await this._alert(options, hasDefault);

    if (shouldOpenAccounts) {
      RNCallKeepModule.openPhoneAccountSettings();
    }
  };

  private _alert = async (options: IOptions['android'], condition: boolean): Promise<boolean> =>
    new Promise((resolve, reject) => {
      if (!condition) {
        return resolve(false);
      }

      Alert.alert(
        options.alertTitle,
        options.alertDescription,
        [
          {
            text: options.cancelButton,
            onPress: reject,
            style: 'cancel',
          },
          { text: options.okButton, onPress: () => resolve(true) },
        ],
        { cancelable: true },
      );
    });

  backToForeground(): void {
    if (isIOS) {
      return;
    }

    NativeModules.RNCallKeep.backToForeground();
  }

  getInitialEvents(): Promise<InitialEvents> {
    return RNCallKeepModule.getInitialEvents();
  }

  clearInitialEvents(): void {
    return RNCallKeepModule.clearInitialEvents();
  }
}

export default new RNCallKeep();
