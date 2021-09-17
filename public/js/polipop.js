/*!
* Polipop v1.0.0
*
* A dependency-free JavaScript library for creating discreet pop-up notifications.
*
* Copyright (c) 2021 Yannis Maragos.
*
* Dual-licensed under the GNU General Public License (GPL) version 3 or later
* and the Polipop Commercial License.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This file is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see https://www.gnu.org/licenses/.
*
* See the Polipop Commercial License at https://www.minitek.gr/licenses/polipop.
*/(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(); else if (typeof define === 'function' && define.amd) define([], factory); else if (typeof exports === 'object') exports['Polipop'] = factory(); else root['Polipop'] = factory();
})(this, function () {
    return (() => {
        'use strict'; var __webpack_require__ = {}; (() => { __webpack_require__.d = (exports, definition) => { for (var key in definition) { if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) { Object.defineProperty(exports, key, { enumerable: true, get: definition[key], }); } } }; })(); (() => { __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop); })(); var __webpack_exports__ = {}; __webpack_require__.d(__webpack_exports__, { default: () => Polipop, }); const defaults = { appendTo: 'body', block: 'polipop', position: 'top-right', layout: 'popups', theme: 'default', icons: true, insert: 'after', spacing: 10, pool: 0, sticky: false, life: 3000, progressbar: false, pauseOnHover: true, headerText: 'Messages', closer: true, closeText: 'Close', loadMoreText: 'Load more', hideEmpty: false, interval: 250, effect: 'fade', easing: 'linear', effectDuration: 250, ready: function () { }, add: function () { }, beforeOpen: function () { }, open: function () { }, afterOpen: function () { }, beforeClose: function () { }, close: function () { }, click: function () { }, }; function _extend(destination, source) { let newDestination = destination; if (destination === null) newDestination = {};[].slice.call(Object.keys(source)).forEach((key) => { newDestination[key] = source[key]; }); return destination; }
        function _dispatch(element, name, params) {
            let newElement = element; let newName = name; let newParams = params; if (typeof element === 'string') { newParams = name; newName = element; newElement = window; }
            newParams = newParams || {}; newElement.dispatchEvent(new CustomEvent(newName, { detail: newParams, bubbles: true, cancelable: true, }));
        }
        function togglePanelHeight() { if (this._wrapper.classList.contains(this._classes.block_open)) { const headerInner = this._wrapper.querySelector('.' + this._classes['block__header-inner']); this._wrapper.style.height = headerInner.offsetHeight + 'px'; } else this._wrapper.style.height = this.wrapperHeight + 'px'; this._wrapper.classList.toggle(this._classes.block_open); }
        function startPauseOnHover() { const self = this; if (self._pauseOnHover === true) return; self._pauseOnHover = true; const pauseTime = new Date().getTime(); self._container.querySelectorAll('.' + self._classes.block__notification).forEach((element) => { element.pauseTime = pauseTime; }); }
        function endPauseOnHover() { const self = this; self._container.querySelectorAll('.' + self._classes.block__notification).forEach((element) => { element.created += new Date().getTime() - element.pauseTime; }); self._pauseOnHover = false; }
        function checkOverflow() { const self = this; if (!self._wrapper) return; clearTimeout(self._resizing); self._resizing = setTimeout(function () { self._overflow = false; overflow.call(self); }, 500); }
        function onPolipopBeforeOpen(notification, element) {
            if (notification.beforeOpen.apply(this, [notification, element]) !== false)
                _dispatch(element, 'Polipop.open');
        }
        function onPolipopOpen(notification, element) {
            const self = this; if (self.options.insert === 'after') { self._container.appendChild(element); } else if (self.options.insert === 'before') { self._container.insertBefore(element, self._container.querySelectorAll('.' + self._classes.block__notification)[0]); }
            element.style.display = 'block'; self.wrapperHeight += self.options.layout === 'popups' ? element.offsetHeight + self.options.spacing : element.offsetHeight; if (self.elements.length > 0 && self.options.position !== 'inline')
                if (checkElementOverflow.apply(self, [notification, element,]) === true)
                    return; self.elements = self._container.querySelectorAll('.' + self._classes.block__notification); if (self.options.layout === 'panel') { self._wrapper.querySelector('.' + self._classes['block__header-minimize']).style.display = 'block'; self._wrapper.classList.add(self._classes.block_open); }
            self._wrapper.style.height = self.wrapperHeight + 'px'; positionElement.call(self, element); notification.open.apply(self, [notification, element]); const animation = animateElement.apply(self, [element, 'in']); animation.finished.then(function () {
                element.created = new Date().getTime(); if (self.options.progressbar && !element.sticky)
                    startProgress.call(self, element); updateCloser.call(self); overflow.call(self); _dispatch(element, 'Polipop.afterOpen');
            });
        }
        function onPolipopAfterOpen(notification, element) { notification.afterOpen.apply(this, [notification, element]); }
        function onPolipopBeforeClose(notification, element) {
            if (!element.removing)
                if (notification.beforeClose.apply(this, [notification, element,]) !== false)
                    _dispatch(element, 'Polipop.close');
        }
        function onPolipopClose(notification, element) {
            const self = this; element.removing = true; self.wrapperHeight -= self.options.layout === 'popups' ? element.offsetHeight + self.options.spacing : element.offsetHeight; const animation = animateElement.apply(self, [element, 'out']); animation.finished.then(function () {
                repositionElements.call(self, element); self._wrapper.style.height = self.wrapperHeight + 'px'; if (notification.close.apply(self, [notification, element]) !== false)
                    element.remove(); self._overflow = false; updateCloser.call(self); self.elements = self._container.querySelectorAll('.' + self._classes.block__notification); if (self.options.layout === 'panel')
                    updateHeaderCount.call(self, -1); overflow.call(self);
            });
        }
        function onPolipopClick(event, notification, element) { notification.click.apply(this, [event, notification, element]); }
        function startProgress(element) { const self = this; let width = 0; const interval = self.options.life / 100; const progressBarInner = element.querySelector('.' + self._classes['block__notification-progress-inner']); const id = setInterval(function () { if (!self._pauseOnHover) { if (width >= 100) { clearInterval(id); } else { width++; progressBarInner.style.width = width + '%'; } } }, interval); }
        function updateHeaderCount(value) { const headerCount = this._wrapper.querySelector('.' + this._classes['block__header-count']); const count = parseInt(headerCount.textContent, 10); headerCount.textContent = count + value; }
        function updateCloser() {
            if (!this._closer) return; let poolExceeded = false; if (this.options.pool)
                poolExceeded = this.elements && this.elements.length === this.options.pool && this.queue.length > 0; const queuedNotifications = poolExceeded || this._overflow; if (queuedNotifications && this.queue.length) { this._closer.querySelector('.' + this._classes['block__closer-text']).innerHTML = this.options.loadMoreText; this._closer.querySelector('.' + this._classes['block__closer-count']).style.display = 'inline-block'; this._closer.querySelector('.' + this._classes['block__closer-count']).textContent = this.queue.length; } else if (this.queue.length === 0) { this._closer.querySelector('.' + this._classes['block__closer-count']).style.display = 'none'; this._closer.querySelector('.' + this._classes['block__closer-text']).innerHTML = this.options.closeText; }
        }
        function animateElement(element, direction) {
            const self = this; const keyframes = [{ opacity: direction === 'in' ? '0' : '1', }, { opacity: direction === 'in' ? '1' : '0', },]; if (self.options.effect === 'slide') { if (self.options.position.endsWith('-left')) { keyframes[0].left = direction === 'in' ? '-110%' : '0'; keyframes[1].left = direction === 'in' ? '0' : '-110%'; } else { keyframes[0].right = direction === 'in' ? '-110%' : '0'; keyframes[1].right = direction === 'in' ? '0' : '-110%'; } }
            const animation = element.animate(keyframes, { duration: self.options.effectDuration, easing: self.options.easing, iterations: 1, fill: 'forwards', }); return animation;
        }
        function createNotification(notification) {
            const element = document.createElement('div'); element.classList.add(this._classes.block__notification); element.sticky = notification.sticky !== undefined ? notification.sticky : this.options.sticky; if (notification.type)
                element.classList.add(this._classes.block__notification_type_ + notification.type); if (this.options.progressbar && !element.sticky) { const progressBar = document.createElement('div'); progressBar.classList.add(this._classes['block__notification-progress']); const progressBarInner = document.createElement('div'); progressBarInner.classList.add(this._classes['block__notification-progress-inner']); progressBar.appendChild(progressBarInner); element.appendChild(progressBar); }
            const outer = document.createElement('div'); outer.classList.add(this._classes['block__notification-outer']); if (this.options.icons) { const icon = document.createElement('div'); icon.classList.add(this._classes['block__notification-icon']); const iconInner = document.createElement('div'); iconInner.classList.add(this._classes['block__notification-icon-inner']); iconInner.innerHTML = getSVGIcon(notification.type); icon.appendChild(iconInner); outer.appendChild(icon); }
            const inner = document.createElement('div'); inner.classList.add(this._classes['block__notification-inner']); const button = document.createElement('button'); button.classList.add(this._classes['block__notification-close']); button.innerHTML = '&times;'; inner.appendChild(button); button.addEventListener('click', () => { _dispatch(element, 'Polipop.beforeClose'); }); if (notification.title) { const title = document.createElement('div'); title.classList.add(this._classes['block__notification-title']); title.innerHTML += notification.title; inner.appendChild(title); }
            if (notification.content) { const content = document.createElement('div'); content.classList.add(this._classes['block__notification-content']); content.innerHTML = notification.content; inner.appendChild(content); }
            outer.appendChild(inner); element.appendChild(outer); return element;
        }
        function renderNotification(notification) { const self = this; const element = createNotification.call(self, notification); const callbacks = ['beforeOpen', 'open', 'afterOpen', 'beforeClose', 'close', 'click',]; callbacks.forEach((cb) => { if (!notification[cb]) notification[cb] = self.options[cb]; }); element.addEventListener('Polipop.beforeOpen', () => onPolipopBeforeOpen.apply(this, [notification, element])); element.addEventListener('Polipop.open', () => onPolipopOpen.apply(this, [notification, element])); element.addEventListener('Polipop.afterOpen', () => onPolipopAfterOpen.apply(this, [notification, element])); element.addEventListener('Polipop.beforeClose', () => onPolipopBeforeClose.apply(this, [notification, element])); element.addEventListener('Polipop.close', () => onPolipopClose.apply(this, [notification, element])); element.addEventListener('click', (event) => onPolipopClick.apply(this, [event, notification, element])); _dispatch(element, 'Polipop.beforeOpen'); }
        function overflow() {
            this._viewportHeight = window.innerHeight || document.documentElement.clientHeight; if (this.options.position === 'inline' || this.elements.length === 1)
                return; const wrapperOverflow = this.wrapperHeight + this._wrapperDistance >= this._viewportHeight; if (wrapperOverflow) {
                    const element = this.options.insert === 'after' ? this._container.querySelectorAll('.' + this._classes.block__notification)[0] : this._container.querySelectorAll('.' +
                        this._classes.block__notification +
                        ':last-child')[0]; _dispatch(element, 'Polipop.beforeClose');
                }
        }
        function positionElement(element, insert) {
            if (insert === undefined) insert = this.options.insert; let _insert, _position, _indexDiff, _sibling, _recursivePosition; if (this.options.position.startsWith('bottom-')) { _position = 'bottom'; _indexDiff = 1; _sibling = 'previousElementSibling'; _recursivePosition = 'before'; if (insert === 'after') _insert = 'previous'; else _insert = 'next'; } else { _position = 'top'; _indexDiff = -1; _sibling = 'nextElementSibling'; _recursivePosition = 'after'; if (insert === 'before') _insert = 'previous'; else _insert = 'next'; }
            if (_insert === 'previous') { element.style[_position] = '0px'; } else if (_insert === 'next') {
                if (this.elements.length > 1) {
                    const index = Array.prototype.indexOf.call(this.elements, element); const _element = this.elements[index + _indexDiff]; const _elementPosition = parseInt(_element.style[_position], 10) +
                        _element.offsetHeight; element.style[_position] = (this.options.layout === 'popups' ? _elementPosition + this.options.spacing : _elementPosition) + 'px';
                } else element.style[_position] = '0px';
            }
            if (element[_sibling])
                positionElement.apply(this, [element[_sibling], _recursivePosition,]);
        }
        function repositionElements(element) {
            const self = this; let _position = 'top'; let _control; const index = Array.prototype.indexOf.call(self.elements, element); if (self.options.position.startsWith('bottom-')) { _position = 'bottom'; _control = (i) => { return i > index; }; } else { _control = (i) => { return i <= index; }; }
            self.elements.forEach((el, i) => {
                if (_control(i)) return; const _elementPosition = parseInt(el.style[_position], 10) -
                    (self.options.layout === 'popups' ? element.offsetHeight + self.options.spacing : element.offsetHeight); el.style[_position] = _elementPosition + 'px';
            });
        }
        function checkElementOverflow(notification, element) {
            const self = this; const elementOverflows = self.wrapperHeight + self._wrapperDistance > self._viewportHeight; if (elementOverflows) { self._overflow = true; if (self.options.pool) { self.wrapperHeight -= self.options.layout === 'popups' ? element.offsetHeight + self.options.spacing : element.offsetHeight; self.queue.push(notification); element.remove(); updateCloser.call(self); return true; } }
            return false;
        }
        function getSVGIcon(type) {
            let svg; switch (type) { case 'success': svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>'; break; case 'warning': svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>'; break; case 'error': svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg>'; break; case 'info': case 'notice': case 'default': default: svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>'; break; }
            return svg;
        }
        function _loop() {
            const self = this; if (self._pause) return; if (!self.elements)
                self.elements = self._container.querySelectorAll('.' + self._classes.block__notification); expirationControl.call(self); toggleCloser.call(self); renderNotifications.call(self);
        }
        function expirationControl() {
            const self = this; if (self._pauseOnHover) return; self.elements.forEach((element) => {
                if (!element.sticky && new Date().getTime() - element.created > parseInt(self.options.life, 10))
                    _dispatch(element, 'Polipop.beforeClose');
            });
        }
        function toggleCloser() {
            const self = this; const closerExistsAndHidden = self.options.closer !== false && self._closer && self._closer.style.display === 'none'; if (self.elements.length > 0 && closerExistsAndHidden) { self._closer.open = true; self._closer.style.display = 'block'; self.wrapperHeight += self._closerHeight; self._wrapper.style.height = self.wrapperHeight + 'px'; animateElement.apply(self, [self._closer, 'in']); } else if (self.elements.length === 0 && self.queue.length === 0 && self._closer && self._closer.open) {
                self._closer.open = false; const animation = animateElement.apply(self, [self._closer, 'out',]); animation.finished.then(function () {
                    self.wrapperHeight -= self._closerHeight; self._wrapper.style.height = self.wrapperHeight + 'px'; self._closer.style.display = 'none'; if (self.options.layout === 'panel') {
                        self._wrapper.querySelector('.' + self._classes['block__header-minimize']).style.display = 'none'; if (self.options.hideEmpty)
                            self._wrapper.style.height = 0 + 'px';
                    }
                });
            }
        }
        function renderNotifications() {
            const self = this; if ((self._overflow && self.elements.length > 1 && self.options.position !== 'inline') || self.queue.length === 0)
                return; const poolFitsMore = self.options.pool === 0 || self.elements.length < self.options.pool; if (poolFitsMore) renderNotification.call(self, self.queue.shift());
        }
        function _init() {
            const self = this; createWrapper.call(self); createContainer.call(self); if (self.options.closer) createCloser.call(self); if (self.options.layout === 'panel') createPanelHeader.call(self); if (self.options.closer) positionContainer.call(self); self._wrapper.addEventListener('Polipop.ready', () => { self.options.ready.call(self); }); if (self.options.pauseOnHover) { self._wrapper.addEventListener('mouseenter', () => startPauseOnHover.call(self)); self._wrapper.addEventListener('mouseleave', () => endPauseOnHover.call(self, event)); }
            if (self.options.position !== 'inline')
                window.addEventListener('resize', () => checkOverflow.call(self)); self._id = setInterval(function () { try { _loop.call(self); } catch (e) { self.destroy(); throw e; } }, parseInt(self.options.interval, 10));
        }
        function createWrapper() {
            this._selector = this._selector.replace(/\s/g, '_'); this._wrapper = document.querySelector(this._selector); if (!this._wrapper) { this._wrapper = document.createElement('div'); this._wrapper.id = this._selector; document.querySelector(this.options.appendTo).appendChild(this._wrapper); } else if (this._wrapper.classList.contains(this._classes.block)) {
                console.log('Selector with id "' +
                    this.options.selector +
                    '" is used by another instance of Polipop.'); return;
            }
            this._wrapper.classList.add(this._classes.block, this._classes.block_position, this._classes.block_theme, this._classes.block_layout); if (this.options.layout === 'popups')
                this._wrapper.style.height = 0 + 'px'; this._viewportHeight = window.innerHeight || document.documentElement.clientHeight; this._wrapperDistance = this.options.position.startsWith('bottom-') ? this._viewportHeight -
                    this._wrapper.getBoundingClientRect().bottom : this._wrapper.getBoundingClientRect().top;
        }
        function createContainer() { this._container = document.createElement('div'); this._container.classList.add(this._classes.block__notifications); this._wrapper.appendChild(this._container); }
        function positionContainer() {
            let offset = 0; if (this.options.layout === 'popups') offset = this._closerHeight; else if (this.options.layout === 'panel')
                offset = this._wrapper.querySelector('.' + this._classes['block__header-inner']).offsetHeight + this._closerHeight; if (this.options.position.startsWith('bottom-'))
                this._container.style.bottom = offset + 'px'; else this._container.style.top = offset + 'px'; this._container.style.height = 'calc(100% - ' + offset + 'px)';
        }
        function createCloser() {
            const self = this; self._closer = document.createElement('div'); self._closer.classList.add(self._classes.block__closer); const closerText = document.createElement('span'); closerText.classList.add(self._classes['block__closer-text']); closerText.innerHTML = self.options.closeText; self._closer.appendChild(closerText); const closerCount = document.createElement('span'); closerCount.classList.add(self._classes['block__closer-count']); closerCount.style.display = 'none'; self._closer.appendChild(closerCount); if (self.options.position.startsWith('bottom-'))
                self._wrapper.appendChild(self._closer); else self._wrapper.insertBefore(self._closer, self._container); self._closer.style.visibility = 'hidden'; self._closerHeight = self.options.layout === 'popups' ? self._closer.offsetHeight + self.options.spacing : self._closer.offsetHeight; self._closer.style.display = 'none'; self._closer.style.visibility = 'visible'; self._closer.addEventListener('click', () => self.closeAll());
        }
        function createPanelHeader() {
            const self = this; const header = document.createElement('div'); header.classList.add(self._classes.block__header); const headerInner = document.createElement('div'); headerInner.classList.add(self._classes['block__header-inner']); const headerTitle = document.createElement('span'); headerTitle.classList.add(self._classes['block__header-title']); headerTitle.innerHTML = self.options.headerText; headerInner.appendChild(headerTitle); const headerCount = document.createElement('span'); headerCount.classList.add(self._classes['block__header-count']); headerCount.textContent = '0'; headerInner.appendChild(headerCount); const headerMinimize = document.createElement('div'); headerMinimize.classList.add(self._classes['block__header-minimize']); headerMinimize.innerHTML = '&equiv;'; headerInner.appendChild(headerMinimize); header.appendChild(headerInner); if (self.options.position.startsWith('bottom-'))
                self._wrapper.appendChild(header); else self._wrapper.prepend(header); headerInner.style.height = header.offsetHeight - 1 + 'px'; self.wrapperHeight += headerInner.offsetHeight; self._wrapper.style.height = self.options.hideEmpty ? 0 + 'px' : headerInner.offsetHeight + 'px'; header.addEventListener('click', () => togglePanelHeight.call(self));
        }
        function getBemClasses(options) { const classes = { block: options.block, block_position: options.block + '_position_' + options.position, block_theme: options.block + '_theme_' + options.theme, block_layout: options.block + '_layout_' + options.layout, block_open: options.block + '_open', block__header: options.block + '__header', 'block__header-inner': options.block + '__header-inner', 'block__header-title': options.block + '__header-title', 'block__header-count': options.block + '__header-count', 'block__header-minimize': options.block + '__header-minimize', block__notifications: options.block + '__notifications', block__closer: options.block + '__closer', 'block__closer-text': options.block + '__closer-text', 'block__closer-count': options.block + '__closer-count', block__notification: options.block + '__notification', 'block__notification-progress': options.block + '__notification-progress', 'block__notification-progress-inner': options.block + '__notification-progress-inner', 'block__notification-outer': options.block + '__notification-outer', 'block__notification-icon': options.block + '__notification-icon', 'block__notification-icon-inner': options.block + '__notification-icon-inner', 'block__notification-inner': options.block + '__notification-inner', 'block__notification-title': options.block + '__notification-title', 'block__notification-close': options.block + '__notification-close', 'block__notification-content': options.block + '__notification-content', block__notification_type_: options.block + '__notification_type_', }; return classes; }
        class Polipop {
            constructor(selector, options = {}) { this.options = _extend(defaults, options); this.queue = []; this.elements = null; this.wrapperHeight = 0; this._selector = selector; this._wrapper = null; this._closer = null; this._container = null; this._wrapperDistance = 0; this._closerHeight = 0; this._id = 0; this._viewportHeight = 0; this._overflow = false; this._resizing = 0; this._pauseOnHover = false; this._pause = false; this._disable = false; this._classes = getBemClasses(this.options); _init.call(this); _dispatch(this._wrapper, 'Polipop.ready'); }
            getOption(key) { return this.options[key]; }
            setOption(key, value) { const ignore = ['appendTo', 'block', 'position', 'layout', 'spacing', 'headerText', 'closer', 'interval',]; if (ignore.includes(key)) return; const options = this.options; options[key] = value; }
            add(notification) {
                if (this._disable) return; if (!notification.add) notification.add = this.options.add; if (this.options.layout === 'panel')
                    updateHeaderCount.call(this, 1); this.queue.push(notification); updateCloser.call(this); notification.add.call(this, notification);
            }
            enable() { this._disable = false; }
            disable() { this._disable = true; }
            pause() { this._pause = true; }
            unpause() { this._pause = false; }
            closeAll() { const self = this; self._container.querySelectorAll('.' + self._classes.block__notification).forEach((element) => { _dispatch(element, 'Polipop.beforeClose'); }); }
            emptyQueue() { this.queue = []; }
            destroy() { if (!this._wrapper) return; this.elements = null; this._container = null; this._closer = null; this._wrapper.remove(); this._wrapper = null; clearInterval(this._id); }
        }
        __webpack_exports__ = __webpack_exports__.default; return __webpack_exports__;
    })();
});