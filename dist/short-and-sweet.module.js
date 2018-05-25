/*
 * short-and-sweet v1.0.2 - Accessible character counter for input elements
 * Copyright (c) 2018 Rik Schennink <hello@rikschennink.nl> (http://rikschennink.nl/)
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (w) {

  // no window, early exit
  if (!w) {
    return;
  }

  var h = function h(name) {
    var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var element = document.createElement(name);
    Object.keys(attr).forEach(function (key) {
      element.setAttribute(key, attr[key]);
    });
    return element;
  };

  var replaceInString = function replaceInString(string, replacements) {
    return string.replace(/(?:{([a-zA-Z]+)})/g, function (match, group) {
      return replacements[group];
    });
  };

  var toInt = function toInt(v) {
    return v != null ? parseInt(v, 10) : null;
  };

  var uid = 0;

  var createCounter = function createCounter(_ref) {
    var assistDelay = _ref.assistDelay,
        counterClassName = _ref.counterClassName;


    // create visual counter node
    var counterVisual = h('span', {
      'class': counterClassName,
      'aria-hidden': 'true'
    });

    // create assist node
    var counterAssistant = h('span', {
      'style': 'position:absolute;overflow:hidden;height:1px;width:1px;padding:0;border:0;clip:rect(1px, 1px, 1px, 1px);clip-path:inset(50%);white-space:nowrap;',
      'id': 'short-and-sweet-counter-' + uid++,
      'role': 'status',
      'aria-live': 'polite'
    });

    // we'll group the counter and assistant in a fragment so we can add both nodes in one go
    var fragment = document.createDocumentFragment();
    fragment.appendChild(counterVisual);
    fragment.appendChild(counterAssistant);

    // updates the counter
    var updateText = function updateText(text) {
      counterVisual.textContent = text;
    };

    var assistTimerId = null;
    var updateAssist = function updateAssist(text, immidiate) {
      clearTimeout(assistTimerId);
      if (immidiate) {
        counterAssistant.textContent = text;
        return;
      }
      assistTimerId = setTimeout(function () {
        counterAssistant.textContent = text;
      }, assistDelay);
    };

    var syncAssist = function syncAssist() {
      clearTimeout(assistTimerId);
      counterAssistant.textContent = counterVisual.textContent;
    };

    var resetAssist = function resetAssist() {
      clearTimeout(assistTimerId);
      counterAssistant.textContent = '';
    };

    return {
      id: counterAssistant.id,
      fragment: fragment,
      updateText: updateText,
      updateAssist: updateAssist,
      syncAssist: syncAssist,
      resetAssist: resetAssist
    };
  };

  // create our short and sweet instance
  var create = function create(element, options) {

    // if no max length defined, exit here
    if (!element.getAttribute('maxlength')) {
      return;
    }

    // get label from options or element
    var label = element.dataset.counterLabel || options.counterLabel;

    // create the counter element
    var counter = createCounter(options);

    // link the counter to the element
    element.setAttribute('aria-controls', counter.id);

    // by default is inserted as a sibling of the element
    options.append(element, counter.fragment);

    // assist timer
    var isFirstUpdate = true;

    var limit = function limit(maxlength) {
      element.value = element.value.substr(0, maxlength);
    };

    // update counter value
    var update = function update() {

      var maxlength = toInt(element.getAttribute('maxlength'));

      // have we reached the maximum amount of characters
      var overflowing = element.value.length > maxlength;

      // limit textarea value to the maxlength
      if (overflowing) {
        limit(element, maxlength);
      }

      // current length (after limiting)
      var length = element.value.length;

      // determine current label
      var dynamicLabel = replaceInString(label, {
        maxlength: maxlength,
        length: length,
        remaining: maxlength - length
      });

      // update counter value
      counter.updateText(dynamicLabel);

      // don't update the assist the first time, this makes sure it's empty when we focus the field
      if (isFirstUpdate) {
        isFirstUpdate = false;
        return;
      }

      // update assistive counter
      counter.updateAssist(dynamicLabel, overflowing);
    };

    // tell us the amount of characters left when focusing the field
    element.addEventListener('focus', counter.syncAssist);

    // reset assist when leaving field so when we refocus the field it correctly tells us again the amount of characters left
    element.addEventListener('blur', counter.resetAssist);

    // listen for user input so we can update the counter on changes
    element.addEventListener('input', update);

    // update counter so it matches current input value
    update();
  };

  // default short and sweet options
  var defaultOptions = {
    counterClassName: 'short-and-sweet-counter',
    counterLabel: '{remaining} characters left', // {maxlength}, {length}, {remaining}
    assistDelay: 2000,
    append: function append(element, counter) {
      element.parentNode.appendChild(counter);
    }
  };

  // array of elements in, short and sweet instances out
  var createAtElements = function createAtElements(elements) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return elements.map(function (element) {
      return create(element, _extends({}, defaultOptions, options));
    });
  };

  // export our short and sweet function
  return function shortAndSweet(target, options) {

    // if target is a string
    return typeof target === 'string' ?

    // treat it as a querySelector
    createAtElements([].concat(_toConsumableArray(document.querySelectorAll(target))), options) :

    // create single short and sweet counter
    createAtElements([target], options)[0];
  };
}(typeof window === 'undefined' ? null : window);