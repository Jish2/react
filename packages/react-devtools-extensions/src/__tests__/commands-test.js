/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {
  registerCommandHandlers,
  toggleInspectHostForAllTabs,
} from '../background/commands';

describe('extension commands', () => {
  it('dispatches toggleInspectHost to all extension ports', () => {
    const postMessage = jest.fn();
    const ports = {
      1: {extension: {postMessage}},
      2: {extension: null},
      3: {},
    };

    toggleInspectHostForAllTabs(ports);

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith({event: 'toggleInspectHost'});
  });

  it('wires the toggle-inspect-element command', () => {
    const postMessage = jest.fn();
    const ports = {
      1: {extension: {postMessage}},
    };
    const listeners = [];
    const chromeAPI = {
      commands: {
        onCommand: {
          addListener: listener => listeners.push(listener),
        },
      },
    };

    registerCommandHandlers(ports, chromeAPI);
    expect(listeners).toHaveLength(1);

    listeners[0]('toggle-inspect-element');
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith({event: 'toggleInspectHost'});
  });

  it('ignores unrelated commands', () => {
    const postMessage = jest.fn();
    const ports = {
      1: {extension: {postMessage}},
    };
    const listeners = [];
    const chromeAPI = {
      commands: {
        onCommand: {
          addListener: listener => listeners.push(listener),
        },
      },
    };

    registerCommandHandlers(ports, chromeAPI);
    listeners[0]('some-other-command');

    expect(postMessage).not.toHaveBeenCalled();
  });
});
