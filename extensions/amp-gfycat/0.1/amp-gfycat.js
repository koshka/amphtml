/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {isLayoutSizeDefined} from '../../../src/layout';
import {loadPromise} from '../../../src/event-helper';
import {user} from '../../../src/log';

class AmpGfycat extends AMP.BaseElement {

  /** @override */
  preconnectCallback(onLayout) {
    // Gfycat iframe
    this.preconnect.url('https://gfycat.com', onLayout);

    // Iframe video and poster urls
    this.preconnect.url('https://giant.gfycat.com', onLayout);
    this.preconnect.url('https://thumbs.gfycat.com', onLayout);
  }

  /** @override */
  isLayoutSupported(layout) {
    return isLayoutSizeDefined(layout);
  }

  /** @override */
  layoutCallback() {
    const gfyid = user().assert(
      (this.element.getAttribute('data-gfyid') ||
      this.element.getAttribute('gfyid')),
      'The data-gfyid attribute is required for <amp-gfycat> %s',
      this.element);
    const width = this.element.getAttribute('width');
    const height = this.element.getAttribute('height');
    const layoutType = this.element.getAttribute('layout');
    const autoplay = parseInt(this.element.getAttribute('data-autoplay') ||
        this.element.getAttribute('autoplay'), 10);

    const iframe = this.element.ownerDocument.createElement('iframe');
    iframe.setAttribute('frameborder', '0');

    let src = 'https://gfycat.com/ifr/' + encodeURIComponent(gfyid);
    if (autoplay === 0) {
      src += '?autoplay=0';
    }

    iframe.src = src;

    this.applyFillContent(iframe);

    if (layoutType !== 'responsive') {
      iframe.width = width;
      iframe.height = height;
    }
    this.element.appendChild(iframe);

    /**
     * @private {?Element}
     */
    this.iframe_ = null;

    return loadPromise(iframe);
  }

  /** @override */
  pauseCallback() {
    if (this.iframe_ && this.iframe_.contentWindow) {
      this.iframe_.contentWindow./*OK*/postMessage('pause', '*');
    }
  }
}

AMP.registerElement('amp-gfycat', AmpGfycat);
