/* global chrome */

'use strict';

export function toggleInspectHostForAllTabs(ports) {
  let forwardedCount = 0;
  for (const tabId in ports) {
    const extensionPort = ports[tabId].extension;
    if (extensionPort) {
      extensionPort.postMessage({event: 'toggleInspectHost'});
      forwardedCount++;
    }
  }
  return forwardedCount;
}

export function registerCommandHandlers(ports, chromeAPI = chrome) {
  chromeAPI.commands.onCommand.addListener(command => {
    if (command === 'toggle-inspect-element') {
      const forwardedCount = toggleInspectHostForAllTabs(ports);
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log('[react-devtools] command received: toggle-inspect-element');
        console.log(
          `[react-devtools] forwarded toggleInspectHost to ${forwardedCount} devtools port(s)`,
        );
      }
    }
  });
}
