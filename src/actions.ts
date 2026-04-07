import { NativeModules, NativeEventEmitter, Platform, EmitterSubscription } from 'react-native';

const RNCallKeepModule = NativeModules.RNCallKeep;
const eventEmitter = new NativeEventEmitter(RNCallKeepModule);

const RNCallKeepDidReceiveStartCallAction = 'RNCallKeepDidReceiveStartCallAction';
const RNCallKeepPerformAnswerCallAction = 'RNCallKeepPerformAnswerCallAction';
const RNCallKeepPerformEndCallAction = 'RNCallKeepPerformEndCallAction';
const RNCallKeepDidActivateAudioSession = 'RNCallKeepDidActivateAudioSession';
const RNCallKeepDidDeactivateAudioSession = 'RNCallKeepDidDeactivateAudioSession';
const RNCallKeepDidDisplayIncomingCall = 'RNCallKeepDidDisplayIncomingCall';
const RNCallKeepDidPerformSetMutedCallAction = 'RNCallKeepDidPerformSetMutedCallAction';
const RNCallKeepDidToggleHoldAction = 'RNCallKeepDidToggleHoldAction';
const RNCallKeepDidPerformDTMFAction = 'RNCallKeepDidPerformDTMFAction';
const RNCallKeepProviderReset = 'RNCallKeepProviderReset';
const RNCallKeepCheckReachability = 'RNCallKeepCheckReachability';
const RNCallKeepDidLoadWithEvents = 'RNCallKeepDidLoadWithEvents';
const RNCallKeepShowIncomingCallUi = 'RNCallKeepShowIncomingCallUi';
const RNCallKeepOnSilenceIncomingCall = 'RNCallKeepOnSilenceIncomingCall';
const RNCallKeepOnIncomingConnectionFailed = 'RNCallKeepOnIncomingConnectionFailed';
const RNCallKeepDidChangeAudioRoute = 'RNCallKeepDidChangeAudioRoute';
const RNCallKeepHasActiveCall = 'RNCallKeepHasActiveCall';
const isIOS = Platform.OS === 'ios';

type Handler = (data: any) => void;

const didReceiveStartCallAction = (handler: Handler): EmitterSubscription => {
  if (isIOS) {
    // Tell CallKeep that we are ready to receive `RNCallKeepDidReceiveStartCallAction` event and prevent delay
    RNCallKeepModule._startCallActionEventListenerAdded();
  }

  return eventEmitter.addListener(RNCallKeepDidReceiveStartCallAction, (data) => handler(data));
};

const answerCall = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepPerformAnswerCallAction, (data) => handler(data));

const endCall = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepPerformEndCallAction, (data) => handler(data));

const didChangeAudioRoute = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidChangeAudioRoute, handler);

const didActivateAudioSession = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidActivateAudioSession, handler);

const didDeactivateAudioSession = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidDeactivateAudioSession, handler);

const didDisplayIncomingCall = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidDisplayIncomingCall, (data) => {
    // On Android the payload parameter is sent a String
    // As it requires too much code on Android to convert it to WritableMap, let's do it here.
    if (data.payload && typeof data.payload === 'string') {
      try {
        data.payload = JSON.parse(data.payload);
      } catch (_) {
      }
    }
    handler(data);
  });

const didPerformSetMutedCallAction = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidPerformSetMutedCallAction, (data) => handler(data));

const onHasActiveCall = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepHasActiveCall, handler);

const didToggleHoldCallAction = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidToggleHoldAction, handler);

const didPerformDTMFAction = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidPerformDTMFAction, (data) => handler(data));

const didResetProvider = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepProviderReset, handler);

const checkReachability = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepCheckReachability, handler);

const didLoadWithEvents = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepDidLoadWithEvents, handler);

const showIncomingCallUi = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepShowIncomingCallUi, (data) => handler(data));

const silenceIncomingCall = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepOnSilenceIncomingCall, (data) => handler(data));

const createIncomingConnectionFailed = (handler: Handler): EmitterSubscription =>
  eventEmitter.addListener(RNCallKeepOnIncomingConnectionFailed, (data) => handler(data));

export const emit = (eventName: string, payload?: any): void => {
  eventEmitter.emit(eventName, payload);
};

export const listeners: Record<string, (handler: Handler) => EmitterSubscription> = {
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
  onHasActiveCall,
};
