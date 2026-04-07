import { EmitterSubscription } from 'react-native';

declare const emit: (eventName: string, payload?: any) => void;

type NativeEvents = {
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
type Events = keyof NativeEvents;
type EventsPayload = {
    didReceiveStartCallAction: {
        handle: string;
        callUUID?: string;
        name?: string;
    };
    answerCall: {
        callUUID: string;
    };
    endCall: {
        callUUID: string;
    };
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
    didPerformSetMutedCallAction: {
        muted: boolean;
        callUUID: string;
    };
    didToggleHoldCallAction: {
        hold: boolean;
        callUUID: string;
    };
    didChangeAudioRoute: {
        output: string;
        reason?: number;
        handle?: string;
        callUUID?: string;
    };
    didPerformDTMFAction: {
        digits: string;
        callUUID: string;
    };
    showIncomingCallUi: {
        handle: string;
        callUUID: string;
        name: string;
    };
    silenceIncomingCall: {
        handle: string;
        callUUID: string;
        name: string;
    };
    createIncomingConnectionFailed: {
        handle: string;
        callUUID: string;
        name: string;
    };
    checkReachability: undefined;
    didResetProvider: undefined;
    didLoadWithEvents: InitialEvents;
    onHasActiveCall: undefined;
};
type InitialEvents = Array<{
    [Event in Events]: {
        name: NativeEvents[Event];
        data: EventsPayload[Event];
    };
}[Events]>;
type HandleType = 'generic' | 'number' | 'email';
type AudioRoute = {
    name: string;
    type: string;
    selected?: boolean;
};
declare enum AudioSessionCategoryOption {
    mixWithOthers = 1,
    duckOthers = 2,
    interruptSpokenAudioAndMixWithOthers = 17,
    allowBluetooth = 4,
    allowBluetoothA2DP = 32,
    allowAirPlay = 64,
    defaultToSpeaker = 8,
    overrideMutedMicrophoneInterruption = 128
}
declare enum AudioSessionMode {
    default = "AVAudioSessionModeDefault",
    gameChat = "AVAudioSessionModeGameChat",
    measurement = "AVAudioSessionModeMeasurement",
    moviePlayback = "AVAudioSessionModeMoviePlayback",
    spokenAudio = "AVAudioSessionModeSpokenAudio",
    videoChat = "AVAudioSessionModeVideoChat",
    videoRecording = "AVAudioSessionModeVideoRecording",
    voiceChat = "AVAudioSessionModeVoiceChat",
    voicePrompt = "AVAudioSessionModeVoicePrompt"
}
interface IOptions {
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
declare const CONSTANTS: {
    readonly END_CALL_REASONS: {
        readonly FAILED: 1;
        readonly REMOTE_ENDED: 2;
        readonly UNANSWERED: 3;
        readonly ANSWERED_ELSEWHERE: 4;
        readonly DECLINED_ELSEWHERE: 2 | 5;
        readonly MISSED: 2 | 6;
    };
};

declare class EventListener {
    private _type;
    private _listener;
    private _callkeep;
    constructor(type: Events, listener: EmitterSubscription, callkeep: RNCallKeep);
    remove: () => void;
}
declare class RNCallKeep {
    private _callkeepEventHandlers;
    addEventListener: <Event extends Events>(type: Event, handler: (args: EventsPayload[Event]) => void) => EventListener;
    removeEventListener: (type: Events, listener?: EmitterSubscription) => void;
    setup: (options: IOptions) => Promise<boolean>;
    setSettings: (settings: IOptions) => void;
    registerPhoneAccount: (options: IOptions) => void;
    registerAndroidEvents: () => void;
    unregisterAndroidEvents: () => void;
    hasDefaultPhoneAccount: (options: IOptions["android"]) => Promise<void>;
    displayIncomingCall: (uuid: string, handle: string, localizedCallerName?: string, handleType?: HandleType, hasVideo?: boolean, options?: {
        ios?: {
            supportsHolding?: boolean;
            supportsDTMF?: boolean;
            supportsGrouping?: boolean;
            supportsUngrouping?: boolean;
        };
    } | null) => void;
    checkIsInManagedCall: () => Promise<boolean>;
    answerIncomingCall: (uuid: string) => void;
    startCall: (uuid: string, handle: string, contactIdentifier?: string, handleType?: HandleType, hasVideo?: boolean) => void;
    checkPhoneAccountEnabled: () => Promise<boolean | undefined>;
    isConnectionServiceAvailable: () => Promise<boolean>;
    reportConnectingOutgoingCallWithUUID: (uuid: string) => void;
    reportConnectedOutgoingCallWithUUID: (uuid: string) => void;
    reportEndCallWithUUID: (uuid: string, reason: number) => void;
    rejectCall: (uuid: string) => void;
    isCallActive: (uuid: string) => Promise<boolean>;
    getCalls: () => Promise<{
        callUUID: string;
        hasConnected: boolean;
        hasEnded: boolean;
        onHold: boolean;
        outgoing: boolean;
    }[] | void> | void;
    endCall: (uuid: string) => void;
    endAllCalls: () => void;
    supportConnectionService: () => boolean;
    hasPhoneAccount: () => Promise<boolean>;
    hasOutgoingCall: () => Promise<boolean | null>;
    setMutedCall: (uuid: string, shouldMute: boolean) => void;
    sendDTMF: (uuid: string, key: string) => void;
    /**
     * @description when Phone call is active, Android control the audio service via connection service. so this function help to toggle the audio to Speaker or wired/ear-piece or vice-versa
     * @param uuid
     * @param routeSpeaker
     * @returns Audio route state of audio service
     */
    toggleAudioRouteSpeaker: (uuid: string, routeSpeaker: boolean) => null | void;
    getAudioRoutes: () => Promise<void>;
    setAudioRoute: (uuid: string, inputName: string) => Promise<void>;
    checkIfBusy: () => Promise<boolean>;
    checkSpeaker: () => Promise<boolean>;
    setAvailable: (state: boolean) => void;
    setForegroundServiceSettings: (settings: NonNullable<IOptions["android"]["foregroundService"]>) => void;
    canMakeMultipleCalls: (state: boolean) => void;
    setCurrentCallActive: (callUUID: string) => void;
    updateDisplay: (uuid: string, displayName: string, handle: string, options?: {
        ios?: Record<string, unknown>;
    } | null) => void;
    setOnHold: (uuid: string, shouldHold: boolean) => void;
    setConnectionState: (uuid: string, state: number) => null | void;
    setReachable: () => void;
    reportUpdatedCall: (uuid: string, localizedCallerName: string) => Promise<void>;
    private _setupIOS;
    private _setupAndroid;
    private _hasDefaultPhoneAccount;
    private _alert;
    backToForeground(): void;
    getInitialEvents(): Promise<InitialEvents>;
    clearInitialEvents(): void;
    fulfillAction(action: string, callUUID: string): void;
}
declare const _default: RNCallKeep;

export { type AudioRoute, AudioSessionCategoryOption, AudioSessionMode, CONSTANTS, EventListener, type Events, type EventsPayload, type IOptions, type InitialEvents, type NativeEvents, _default as default, emit };
