import { find } from 'lodash-es';

import mitt from '@utils/mitt';

/**
 * DOM: #mount_0_0_{\w\w} > #app > .app-wrapper-web >.x78zum5.xdt5ytf.x5yr21d > div.two._aigs
 */

/**
 * @description The stage of the WhatsApp UI
 * @enum {string}
 */
export enum WhatsAppUIStage {
  /**
   * @description WhatsApp Web is initializing, no UI is loaded, observing the body element
   */
  INITIALIZING = 'initializing',
  /**
   * @description WhatsApp Web is mounted, but the WebUI is not ready which may be waiting for authentication.
   *              Observing the #app element.
   */
  MOUNTED = 'mounted',
  /**
   * @description WhatsApp Web is mounted, but the WebUI is not ready which may be waiting for authentication.
   *              Observing the #app element.
   */
  HOLDING = 'holding',
  /**
   * @description WhatsApp Web is ready, observing the #app element
   */
  READY = 'ready',
}

type WhatsAppUIEvent = {
  'ui:change': WhatsAppUIStage;
  'ui:initializing': void;
  'ui:uninitializing': void;
  'ui:mounted': void;
  'ui:unmounted': void;
  'ui:holding': void;
  'ui:unholding': void;
  'ui:ready': HTMLDivElement;
  'ui:unready': void;
};

const queryMounted = () => document.querySelector<HTMLDivElement>('div[id^="mount_0_0"]');

const isMountedNode = (node: Node) => {
  return !!(node instanceof HTMLElement && node.id?.startsWith('mount_0_0'));
};

const queryContainerNode = () =>
  document.querySelector<HTMLDivElement>('.app-wrapper-web > div.x78zum5.xdt5ytf.x5yr21d');

const queryMainNode = () => document.querySelector<HTMLDivElement>('div.two._aigs[tabindex="-1"]');

const isWrapperNode = (node: Node) => {
  return !!(node instanceof HTMLElement && node.tagName === 'DIV' && node.classList.contains('app-wrapper-web'));
};

const isMainNode = (node: Node) => {
  return !!(node instanceof HTMLElement && node.classList.contains('_aigs'));
};

const findNodeFromList = <T extends Element>(
  nodes: NodeList,
  predicate: (node: Node) => boolean,
  callback: (node: T) => void,
) => {
  const node = find(nodes, predicate);

  if (node) {
    callback(node as T);
  }
};

export type HostDomObserverListener = (stage: WhatsAppUIStage) => void;

export class HostDomObserver {
  constructor() {
    const eventEmitter = mitt<WhatsAppUIEvent>();
    this.addListener = eventEmitter.on.bind(eventEmitter);
    this.removeListener = eventEmitter.off.bind(eventEmitter);
    this.#emit = eventEmitter.emit.bind(eventEmitter);
  }

  addListener: <eventName extends keyof WhatsAppUIEvent>(
    type: eventName,
    handler: (event: WhatsAppUIEvent[eventName]) => void,
  ) => void;

  removeListener: <eventName extends keyof WhatsAppUIEvent>(
    event: eventName,
    handler: (event: WhatsAppUIEvent[eventName]) => void,
  ) => void;

  #emit: <eventName extends keyof WhatsAppUIEvent>(type: eventName, event?: WhatsAppUIEvent[eventName]) => void;

  #multipleObserver: MutationObserver | undefined;

  removeAllListeners() {}

  #observeDOM() {
    this.#emit('ui:change', WhatsAppUIStage.INITIALIZING);
    this.#emit('ui:uninitializing');

    const $mounted = queryMounted();
    const $container = queryContainerNode();
    const $main = queryMainNode();

    if ($mounted) {
      this.#emit('ui:change', WhatsAppUIStage.MOUNTED);
      this.#emit('ui:mounted');

      if ($container) {
        console.debug('ui:holding', $container);

        this.#emit('ui:change', WhatsAppUIStage.HOLDING);
        this.#emit('ui:holding');
      }

      if ($main) {
        this.#emit('ui:change', WhatsAppUIStage.READY);
        this.#emit('ui:ready', $main);

        return;
      }
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        findNodeFromList<HTMLDivElement>(mutation.addedNodes, isMountedNode, () => {
          this.#emit('ui:change', WhatsAppUIStage.MOUNTED);
          this.#emit('ui:mounted');

          const $wrapper = $mounted?.querySelector<HTMLDivElement>('.app-wrapper-web');

          if ($wrapper) {
            this.#emit('ui:change', WhatsAppUIStage.HOLDING);
            this.#emit('ui:holding');

            const $main = $wrapper.querySelector<HTMLDivElement>('._aigs');

            if ($main) {
              console.debug('ui:mounted', $mounted, $wrapper, $main);

              this.#emit('ui:change', WhatsAppUIStage.READY);
              this.#emit('ui:ready', $main);
            }
          }
        });

        findNodeFromList<HTMLDivElement>(mutation.addedNodes, isWrapperNode, (node) => {
          this.#emit('ui:change', WhatsAppUIStage.HOLDING);
          this.#emit('ui:holding');

          const $main = node.querySelector<HTMLDivElement>('._aigs');

          if ($main) {
            console.debug('ui:holding', node, $main);

            this.#emit('ui:change', WhatsAppUIStage.READY);
            this.#emit('ui:ready', $main);
          }
        });

        findNodeFromList<HTMLDivElement>(mutation.addedNodes, isMainNode, (node) => {
          console.log('main node, ui:ready', node);

          console.debug('ui:ready', $main);
          this.#emit('ui:change', WhatsAppUIStage.READY);
          this.#emit('ui:ready', node);
        });

        findNodeFromList<HTMLDivElement>(mutation.removedNodes, isMountedNode, () => {
          this.#emit('ui:change', WhatsAppUIStage.INITIALIZING);
          this.#emit('ui:unmounted');
        });

        findNodeFromList<HTMLDivElement>(mutation.removedNodes, isWrapperNode, () => {
          this.#emit('ui:change', WhatsAppUIStage.MOUNTED);
          this.#emit('ui:unholding');
        });

        findNodeFromList<HTMLDivElement>(mutation.removedNodes, isMainNode, () => {
          this.#emit('ui:change', WhatsAppUIStage.HOLDING);
          this.#emit('ui:unready');
        });
      }
    });

    if (this.#multipleObserver) {
      this.#multipleObserver.disconnect();
    }

    if ($container) {
      observer.observe($container, { childList: true });
    } else if ($mounted) {
      observer.observe($mounted, { childList: true, subtree: true });
    } else {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    this.#multipleObserver = observer;
  }

  start() {
    this.#observeDOM();
  }
}
