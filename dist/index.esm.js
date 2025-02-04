import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as React from 'react';
import { forwardRef, useContext } from 'react';

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/

function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  } // this function should always return with a value
  // TS can't understand it though so we make it stop complaining here


  return undefined;
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  // Using Node instead of HTMLElement since container may be a ShadowRoot
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? true : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    this.tags.forEach(function (tag) {
      var _tag$parentNode;

      return (_tag$parentNode = tag.parentNode) == null ? undefined : _tag$parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();

var MS = '-ms-';
var MOZ = '-moz-';
var WEBKIT = '-webkit-';

var COMMENT = 'comm';
var RULESET = 'rule';
var DECLARATION = 'decl';
var IMPORT = '@import';
var KEYFRAMES = '@keyframes';
var LAYER = '@layer';

/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs;

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode;

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign;

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @return {number}
 */
function indexof (value, search) {
	return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}

var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = '';

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: ''}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return assign(node('', null, null, '', null, null, 0), root, {length: -root.length}, props)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? charat(characters, --position) : 0;

	if (column--, character === 10)
		column = 1, line--;

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? charat(characters, position++) : 0;

	if (column++, character === 10)
		column = 1, line++;

	return character
}

/**
 * @return {number}
 */
function peek () {
	return charat(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return substr(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = strlen(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next();
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character);
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type);
				break
			// \
			case 92:
				next();
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + from(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next();

	return slice(index, position)
}

/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return dealloc(parse$1('', null, null, null, [''], value = alloc(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse$1 (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var character = 0;
	var type = '';
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;

	while (scanning)
		switch (previous = character, character = next()) {
			// (
			case 40:
				if (previous != 108 && charat(characters, length - 1) == 58) {
					if (indexof(characters += replace(delimit(character), '&', '&\f'), '&\f') != -1)
						ampersand = -1;
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += delimit(character);
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += whitespace(previous);
				break
			// \
			case 92:
				characters += escaping(caret() - 1, 7);
				continue
			// /
			case 47:
				switch (peek()) {
					case 42: case 47:
						append(comment(commenter(next(), caret()), root, parent), declarations);
						break
					default:
						characters += '/';
				}
				break
			// {
			case 123 * variable:
				points[index++] = strlen(characters) * ampersand;
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0;
					// ;
					case 59 + offset: if (ampersand == -1) characters = replace(characters, /\f/g, '');
						if (property > 0 && (strlen(characters) - length))
							append(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration(replace(characters, ' ', '') + ';', rule, parent, length - 2), declarations);
						break
					// @ ;
					case 59: characters += ';';
					// { rule/at-rule
					default:
						append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets);

						if (character === 123)
							if (offset === 0)
								parse$1(characters, root, reference, reference, props, rulesets, length, points, children);
							else
								switch (atrule === 99 && charat(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse$1(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children);
										break
									default:
										parse$1(characters, reference, reference, reference, [''], children, 0, points, children);
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo;
				break
			// :
			case 58:
				length = 1 + strlen(characters), property = previous;
			default:
				if (variable < 1)
					if (character == 123)
						--variable;
					else if (character == 125 && variable++ == 0 && prev() == 125)
						continue

				switch (characters += from(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1);
						break
					// ,
					case 44:
						points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
						break
					// @
					case 64:
						// -
						if (peek() === 45)
							characters += delimit(next());

						atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
						break
					// -
					case 45:
						if (previous === 45 && strlen(characters) == 2)
							variable = 0;
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [''];
	var size = sizeof(rule);

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
			if (z = trim(j > 0 ? rule[x] + ' ' + y : replace(y, /&\f/g, rule[x])))
				props[k++] = z;

	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment (value, root, parent) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration (value, root, parent, length) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length)
}

/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = '';
	var length = sizeof(children);

	for (var i = 0; i < length; i++)
		output += callback(children[i], i, children, callback) || '';

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break
		case IMPORT: case DECLARATION: return element.return = element.return || element.value
		case COMMENT: return ''
		case KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case RULESET: element.value = element.props.join(',');
	}

	return strlen(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}

/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = sizeof(collection);

	return function (element, index, children, callback) {
		var output = '';

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || '';

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element);
	}
}

var weakMemoize = function weakMemoize(func) {
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // Use non-null assertion because we just checked that the cache `has` it
      // This allows us to remove `undefined` from the return value
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var isBrowser$4 = typeof document !== 'undefined';

var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
  var previous = 0;
  var character = 0;

  while (true) {
    previous = character;
    character = peek(); // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1;
    }

    if (token(character)) {
      break;
    }

    next();
  }

  return slice(begin, position);
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch (token(character)) {
      case 0:
        // &\f
        if (character === 38 && peek() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += identifierWithPointTracking(position - 1, points, index);
        break;

      case 2:
        parsed[index] += delimit(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = peek() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += from(character);
    }
  } while (character = next());

  return parsed;
};

var getRules = function getRules(value, points) {
  return dealloc(toRules(alloc(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  element.length < 1) {
    return;
  }

  var value = element.value;
  var parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};

/* eslint-disable no-fallthrough */

function prefix(value, length) {
  switch (hash(value, length)) {
    // color-adjust
    case 5103:
      return WEBKIT + 'print-' + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)

    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921: // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break

    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005: // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,

    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855: // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)

    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    // flex, flex-direction

    case 6828:
    case 4268:
      return WEBKIT + value + MS + value + value;
    // order

    case 6165:
      return WEBKIT + value + MS + 'flex-' + value + value;
    // align-items

    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + 'box-$1$2' + MS + 'flex-$1$2') + value;
    // align-self

    case 5443:
      return WEBKIT + value + MS + 'flex-item-' + replace(value, /flex-|-self/, '') + value;
    // align-content

    case 4675:
      return WEBKIT + value + MS + 'flex-line-pack' + replace(value, /align-content|flex-|-self/, '') + value;
    // flex-shrink

    case 5548:
      return WEBKIT + value + MS + replace(value, 'shrink', 'negative') + value;
    // flex-basis

    case 5292:
      return WEBKIT + value + MS + replace(value, 'basis', 'preferred-size') + value;
    // flex-grow

    case 6060:
      return WEBKIT + 'box-' + replace(value, '-grow', '') + WEBKIT + value + MS + replace(value, 'grow', 'positive') + value;
    // transition

    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, '$1' + WEBKIT + '$2') + value;
    // cursor

    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + '$1'), /(image-set)/, WEBKIT + '$1'), value, '') + value;
    // background, background-image

    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + '$1' + '$`$1');
    // justify-content

    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + 'box-pack:$3' + MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + WEBKIT + value + value;
    // (margin|padding)-inline-(start|end)

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + '$1$2') + value;
    // (min|max)?(width|height|inline-size|block-size)

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      // stretch, max-content, min-content, fill-available
      if (strlen(value) - 1 - length > 6) switch (charat(value, length + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          // -
          if (charat(value, length + 4) !== 45) break;
        // (f)ill-available, (f)it-content

        case 102:
          return replace(value, /(.+:)(.+)-([^]+)/, '$1' + WEBKIT + '$2-$3' + '$1' + MOZ + (charat(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
        // (s)tretch

        case 115:
          return ~indexof(value, 'stretch') ? prefix(replace(value, 'stretch', 'fill-available'), length) + value : value;
      }
      break;
    // position: sticky

    case 4949:
      // (s)ticky?
      if (charat(value, length + 1) !== 115) break;
    // display: (flex|inline-flex)

    case 6444:
      switch (charat(value, strlen(value) - 3 - (~indexof(value, '!important') && 10))) {
        // stic(k)y
        case 107:
          return replace(value, ':', ':' + WEBKIT) + value;
        // (inline-)?fl(e)x

        case 101:
          return replace(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + WEBKIT + (charat(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + WEBKIT + '$2$3' + '$1' + MS + '$2box$3') + value;
      }

      break;
    // writing-mode

    case 5936:
      switch (charat(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
        // vertical-r(l)

        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
        // horizontal(-)tb

        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
      }

      return WEBKIT + value + MS + value + value;
  }

  return value;
}

var prefixer = function prefixer(element, index, children, callback) {
  if (element.length > -1) if (!element["return"]) switch (element.type) {
    case DECLARATION:
      element["return"] = prefix(element.value, element.length);
      break;

    case KEYFRAMES:
      return serialize([copy(element, {
        value: replace(element.value, '@', '@' + WEBKIT)
      })], callback);

    case RULESET:
      if (element.length) return combine(element.props, function (value) {
        switch (match(value, /(::plac\w+|:read-\w+)/)) {
          // :read-(only|write)
          case ':read-only':
          case ':read-write':
            return serialize([copy(element, {
              props: [replace(value, /:(read-\w+)/, ':' + MOZ + '$1')]
            })], callback);
          // :placeholder

          case '::placeholder':
            return serialize([copy(element, {
              props: [replace(value, /:(plac\w+)/, ':' + WEBKIT + 'input-$1')]
            }), copy(element, {
              props: [replace(value, /:(plac\w+)/, ':' + MOZ + '$1')]
            }), copy(element, {
              props: [replace(value, /:(plac\w+)/, MS + 'input-$1')]
            })], callback);
        }

        return '';
      });
  }
};

var getServerStylisCache = isBrowser$4 ? undefined : weakMemoize(function () {
  return memoize(function () {
    return {};
  });
});
var defaultStylisPlugins = [prefixer];

var createCache = function createCache(options) {
  var key = options.key;

  if (isBrowser$4 && key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }

      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  var inserted = {};
  var container;
  var nodesToHydrate = [];

  if (isBrowser$4) {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' ');

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  if (!getServerStylisCache) {
    var currentSheet;
    var finalizingPlugins = [stringify, rulesheet(function (rule) {
      currentSheet.insert(rule);
    })];
    var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return serialize(compile(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  } else {
    var _finalizingPlugins = [stringify];

    var _serializer = middleware(omnipresentPlugins.concat(stylisPlugins, _finalizingPlugins));

    var _stylis = function _stylis(styles) {
      return serialize(compile(styles), _serializer);
    };

    var serverStylisCache = getServerStylisCache(stylisPlugins)(key);

    var getRules = function getRules(selector, serialized) {
      var name = serialized.name;

      if (serverStylisCache[name] === undefined) {
        serverStylisCache[name] = _stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
      }

      return serverStylisCache[name];
    };

    _insert = function _insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      var rules = getRules(selector, serialized);

      if (cache.compat === undefined) {
        // in regular mode, we don't set the styles on the inserted cache
        // since we don't need to and that would be wasting memory
        // we return them so that they are rendered in a style tag
        if (shouldCache) {
          cache.inserted[name] = true;
        }

        return rules;
      } else {
        // in compat mode, we put the styles on the inserted cache so
        // that emotion-server can pull out the styles
        // except when we don't want to cache it which was in Global but now
        // is nowhere but we don't want to do a major right now
        // and just in case we're going to leave the case here
        // it's also not affecting client side bundle size
        // so it's really not a big deal
        if (shouldCache) {
          cache.inserted[name] = rules;
        } else {
          return rules;
        }
      }
    };
  }

  var cache = {
    key: key,
    sheet: new StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

var reactIs = {exports: {}};

var reactIs_production_min = {};

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_production_min;

function requireReactIs_production_min () {
	if (hasRequiredReactIs_production_min) return reactIs_production_min;
	hasRequiredReactIs_production_min = 1;
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
	Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
	function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}reactIs_production_min.AsyncMode=l;reactIs_production_min.ConcurrentMode=m;reactIs_production_min.ContextConsumer=k;reactIs_production_min.ContextProvider=h;reactIs_production_min.Element=c;reactIs_production_min.ForwardRef=n;reactIs_production_min.Fragment=e;reactIs_production_min.Lazy=t;reactIs_production_min.Memo=r;reactIs_production_min.Portal=d;
	reactIs_production_min.Profiler=g;reactIs_production_min.StrictMode=f;reactIs_production_min.Suspense=p;reactIs_production_min.isAsyncMode=function(a){return A(a)||z(a)===l};reactIs_production_min.isConcurrentMode=A;reactIs_production_min.isContextConsumer=function(a){return z(a)===k};reactIs_production_min.isContextProvider=function(a){return z(a)===h};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};reactIs_production_min.isForwardRef=function(a){return z(a)===n};reactIs_production_min.isFragment=function(a){return z(a)===e};reactIs_production_min.isLazy=function(a){return z(a)===t};
	reactIs_production_min.isMemo=function(a){return z(a)===r};reactIs_production_min.isPortal=function(a){return z(a)===d};reactIs_production_min.isProfiler=function(a){return z(a)===g};reactIs_production_min.isStrictMode=function(a){return z(a)===f};reactIs_production_min.isSuspense=function(a){return z(a)===p};
	reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};reactIs_production_min.typeOf=z;
	return reactIs_production_min;
}

var reactIs_development = {};

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_development;

function requireReactIs_development () {
	if (hasRequiredReactIs_development) return reactIs_development;
	hasRequiredReactIs_development = 1;



	if (process.env.NODE_ENV !== "production") {
	  (function() {

	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var hasSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
	var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
	var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
	var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
	var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
	var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
	var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
	// (unstable) APIs that have been removed. Can we remove the symbols?

	var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
	var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
	var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
	var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
	var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
	var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
	var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
	var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
	var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
	var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

	function isValidElementType(type) {
	  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
	}

	function typeOf(object) {
	  if (typeof object === 'object' && object !== null) {
	    var $$typeof = object.$$typeof;

	    switch ($$typeof) {
	      case REACT_ELEMENT_TYPE:
	        var type = object.type;

	        switch (type) {
	          case REACT_ASYNC_MODE_TYPE:
	          case REACT_CONCURRENT_MODE_TYPE:
	          case REACT_FRAGMENT_TYPE:
	          case REACT_PROFILER_TYPE:
	          case REACT_STRICT_MODE_TYPE:
	          case REACT_SUSPENSE_TYPE:
	            return type;

	          default:
	            var $$typeofType = type && type.$$typeof;

	            switch ($$typeofType) {
	              case REACT_CONTEXT_TYPE:
	              case REACT_FORWARD_REF_TYPE:
	              case REACT_LAZY_TYPE:
	              case REACT_MEMO_TYPE:
	              case REACT_PROVIDER_TYPE:
	                return $$typeofType;

	              default:
	                return $$typeof;
	            }

	        }

	      case REACT_PORTAL_TYPE:
	        return $$typeof;
	    }
	  }

	  return undefined;
	} // AsyncMode is deprecated along with isAsyncMode

	var AsyncMode = REACT_ASYNC_MODE_TYPE;
	var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
	var ContextConsumer = REACT_CONTEXT_TYPE;
	var ContextProvider = REACT_PROVIDER_TYPE;
	var Element = REACT_ELEMENT_TYPE;
	var ForwardRef = REACT_FORWARD_REF_TYPE;
	var Fragment = REACT_FRAGMENT_TYPE;
	var Lazy = REACT_LAZY_TYPE;
	var Memo = REACT_MEMO_TYPE;
	var Portal = REACT_PORTAL_TYPE;
	var Profiler = REACT_PROFILER_TYPE;
	var StrictMode = REACT_STRICT_MODE_TYPE;
	var Suspense = REACT_SUSPENSE_TYPE;
	var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

	function isAsyncMode(object) {
	  {
	    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

	      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
	    }
	  }

	  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
	}
	function isConcurrentMode(object) {
	  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
	}
	function isContextConsumer(object) {
	  return typeOf(object) === REACT_CONTEXT_TYPE;
	}
	function isContextProvider(object) {
	  return typeOf(object) === REACT_PROVIDER_TYPE;
	}
	function isElement(object) {
	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function isForwardRef(object) {
	  return typeOf(object) === REACT_FORWARD_REF_TYPE;
	}
	function isFragment(object) {
	  return typeOf(object) === REACT_FRAGMENT_TYPE;
	}
	function isLazy(object) {
	  return typeOf(object) === REACT_LAZY_TYPE;
	}
	function isMemo(object) {
	  return typeOf(object) === REACT_MEMO_TYPE;
	}
	function isPortal(object) {
	  return typeOf(object) === REACT_PORTAL_TYPE;
	}
	function isProfiler(object) {
	  return typeOf(object) === REACT_PROFILER_TYPE;
	}
	function isStrictMode(object) {
	  return typeOf(object) === REACT_STRICT_MODE_TYPE;
	}
	function isSuspense(object) {
	  return typeOf(object) === REACT_SUSPENSE_TYPE;
	}

	reactIs_development.AsyncMode = AsyncMode;
	reactIs_development.ConcurrentMode = ConcurrentMode;
	reactIs_development.ContextConsumer = ContextConsumer;
	reactIs_development.ContextProvider = ContextProvider;
	reactIs_development.Element = Element;
	reactIs_development.ForwardRef = ForwardRef;
	reactIs_development.Fragment = Fragment;
	reactIs_development.Lazy = Lazy;
	reactIs_development.Memo = Memo;
	reactIs_development.Portal = Portal;
	reactIs_development.Profiler = Profiler;
	reactIs_development.StrictMode = StrictMode;
	reactIs_development.Suspense = Suspense;
	reactIs_development.isAsyncMode = isAsyncMode;
	reactIs_development.isConcurrentMode = isConcurrentMode;
	reactIs_development.isContextConsumer = isContextConsumer;
	reactIs_development.isContextProvider = isContextProvider;
	reactIs_development.isElement = isElement;
	reactIs_development.isForwardRef = isForwardRef;
	reactIs_development.isFragment = isFragment;
	reactIs_development.isLazy = isLazy;
	reactIs_development.isMemo = isMemo;
	reactIs_development.isPortal = isPortal;
	reactIs_development.isProfiler = isProfiler;
	reactIs_development.isStrictMode = isStrictMode;
	reactIs_development.isSuspense = isSuspense;
	reactIs_development.isValidElementType = isValidElementType;
	reactIs_development.typeOf = typeOf;
	  })();
	}
	return reactIs_development;
}

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return reactIs.exports;
	hasRequiredReactIs = 1;

	if (process.env.NODE_ENV === 'production') {
	  reactIs.exports = requireReactIs_production_min();
	} else {
	  reactIs.exports = requireReactIs_development();
	}
	return reactIs.exports;
}

var hoistNonReactStatics_cjs;
var hasRequiredHoistNonReactStatics_cjs;

function requireHoistNonReactStatics_cjs () {
	if (hasRequiredHoistNonReactStatics_cjs) return hoistNonReactStatics_cjs;
	hasRequiredHoistNonReactStatics_cjs = 1;

	var reactIs = requireReactIs();

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	var REACT_STATICS = {
	  childContextTypes: true,
	  contextType: true,
	  contextTypes: true,
	  defaultProps: true,
	  displayName: true,
	  getDefaultProps: true,
	  getDerivedStateFromError: true,
	  getDerivedStateFromProps: true,
	  mixins: true,
	  propTypes: true,
	  type: true
	};
	var KNOWN_STATICS = {
	  name: true,
	  length: true,
	  prototype: true,
	  caller: true,
	  callee: true,
	  arguments: true,
	  arity: true
	};
	var FORWARD_REF_STATICS = {
	  '$$typeof': true,
	  render: true,
	  defaultProps: true,
	  displayName: true,
	  propTypes: true
	};
	var MEMO_STATICS = {
	  '$$typeof': true,
	  compare: true,
	  defaultProps: true,
	  displayName: true,
	  propTypes: true,
	  type: true
	};
	var TYPE_STATICS = {};
	TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
	TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

	function getStatics(component) {
	  // React v16.11 and below
	  if (reactIs.isMemo(component)) {
	    return MEMO_STATICS;
	  } // React v16.12 and above


	  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
	}

	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = Object.prototype;
	function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
	  if (typeof sourceComponent !== 'string') {
	    // don't hoist over string (html) components
	    if (objectPrototype) {
	      var inheritedComponent = getPrototypeOf(sourceComponent);

	      if (inheritedComponent && inheritedComponent !== objectPrototype) {
	        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
	      }
	    }

	    var keys = getOwnPropertyNames(sourceComponent);

	    if (getOwnPropertySymbols) {
	      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
	    }

	    var targetStatics = getStatics(targetComponent);
	    var sourceStatics = getStatics(sourceComponent);

	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i];

	      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
	        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

	        try {
	          // Avoid failures from read-only properties
	          defineProperty(targetComponent, key, descriptor);
	        } catch (e) {}
	      }
	    }
	  }

	  return targetComponent;
	}

	hoistNonReactStatics_cjs = hoistNonReactStatics;
	return hoistNonReactStatics_cjs;
}

requireHoistNonReactStatics_cjs();

var isBrowser$3 = typeof document !== 'undefined';

function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else if (className) {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser$3 === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  registerStyles(cache, serialized, isStringTag);
  var className = cache.key + "-" + serialized.name;

  if (cache.inserted[serialized.name] === undefined) {
    var stylesForSSR = '';
    var current = serialized;

    do {
      var maybeStyles = cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      if (!isBrowser$3 && maybeStyles !== undefined) {
        stylesForSSR += maybeStyles;
      }

      current = current.next;
    } while (current !== undefined);

    if (!isBrowser$3 && stylesForSSR.length !== 0) {
      return stylesForSSR;
    }
  }
};

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */memoize(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  var componentSelector = interpolation;

  if (componentSelector.__emotion_styles !== undefined) {

    return componentSelector;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        var keyframes = interpolation;

        if (keyframes.anim === 1) {
          cursor = {
            name: keyframes.name,
            styles: keyframes.styles,
            next: cursor
          };
          return keyframes.name;
        }

        var serializedStyles = interpolation;

        if (serializedStyles.styles !== undefined) {
          var next = serializedStyles.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = serializedStyles.styles + ";";
          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        }

        break;
      }
  } // finalize string values (regular strings and functions interpolated into css calls)


  var asString = interpolation;

  if (registered == null) {
    return asString;
  }

  var cached = registered[asString];
  return cached !== undefined ? cached : asString;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value !== 'object') {
        var asString = value;

        if (registered != null && registered[asString] !== undefined) {
          string += key + "{" + registered[asString] + "}";
        } else if (isProcessableValue(asString)) {
          string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
        }
      } else {

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }

            default:
              {

                string += key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g; // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list

var cursor;
function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    var asTemplateStringsArr = strings;

    styles += asTemplateStringsArr[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      var templateStringsArr = strings;

      styles += templateStringsArr[i];
    }
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + match[1];
  }

  var name = murmur2(styles) + identifierName;

  return {
    name: name,
    styles: styles,
    next: cursor
  };
}

var isBrowser$2 = typeof document !== 'undefined';

var syncFallback = function syncFallback(create) {
  return create();
};

var useInsertionEffect = React['useInsertion' + 'Effect'] ? React['useInsertion' + 'Effect'] : false;
var useInsertionEffectAlwaysWithSyncFallback = !isBrowser$2 ? syncFallback : useInsertionEffect || syncFallback;

var isBrowser$1 = typeof document !== 'undefined';

var EmotionCacheContext = /* #__PURE__ */React.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */createCache({
  key: 'css'
}) : null);

EmotionCacheContext.Provider;

var withEmotionCache = function withEmotionCache(func) {
  return /*#__PURE__*/forwardRef(function (props, ref) {
    // the cache will never be null in the browser
    var cache = useContext(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

if (!isBrowser$1) {
  withEmotionCache = function withEmotionCache(func) {
    return function (props) {
      var cache = useContext(EmotionCacheContext);

      if (cache === null) {
        // yes, we're potentially creating this on every render
        // it doesn't actually matter though since it's only on the server
        // so there will only every be a single render
        // that could change in the future because of suspense and etc. but for now,
        // this works and i don't want to optimise for a future thing that we aren't sure about
        cache = createCache({
          key: 'css'
        });
        return /*#__PURE__*/React.createElement(EmotionCacheContext.Provider, {
          value: cache
        }, func(props, cache));
      } else {
        return func(props, cache);
      }
    };
  };
}

var ThemeContext = /* #__PURE__ */React.createContext({});

var hasOwn = {}.hasOwnProperty;

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var createEmotionProps = function createEmotionProps(type, props) {

  var newProps = {};

  for (var _key in props) {
    if (hasOwn.call(props, _key)) {
      newProps[_key] = props[_key];
    }
  }

  newProps[typePropName] = type; // Runtime labeling is an opt-in feature because:

  return newProps;
};

var Insertion$1 = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  registerStyles(cache, serialized, isStringTag);
  var rules = useInsertionEffectAlwaysWithSyncFallback(function () {
    return insertStyles(cache, serialized, isStringTag);
  });

  if (!isBrowser$1 && rules !== undefined) {
    var _ref2;

    var serializedNames = serialized.name;
    var next = serialized.next;

    while (next !== undefined) {
      serializedNames += ' ' + next.name;
      next = next.next;
    }

    return /*#__PURE__*/React.createElement("style", (_ref2 = {}, _ref2["data-emotion"] = cache.key + " " + serializedNames, _ref2.dangerouslySetInnerHTML = {
      __html: rules
    }, _ref2.nonce = cache.sheet.nonce, _ref2));
  }

  return null;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var WrappedComponent = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = serializeStyles(registeredStyles, undefined, React.useContext(ThemeContext));

  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var _key2 in props) {
    if (hasOwn.call(props, _key2) && _key2 !== 'css' && _key2 !== typePropName && (true )) {
      newProps[_key2] = props[_key2];
    }
  }

  newProps.className = className;

  if (ref) {
    newProps.ref = ref;
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Insertion$1, {
    cache: cache,
    serialized: serialized,
    isStringTag: typeof WrappedComponent === 'string'
  }), /*#__PURE__*/React.createElement(WrappedComponent, newProps));
});

var Emotion$1 = Emotion;

var jsx = function jsx(type, props, key) {
  if (!hasOwn.call(props, 'css')) {
    return ReactJSXRuntime.jsx(type, props, key);
  }

  return ReactJSXRuntime.jsx(Emotion$1, createEmotionProps(type, props), key);
};
var jsxs = function jsxs(type, props, key) {
  if (!hasOwn.call(props, 'css')) {
    return ReactJSXRuntime.jsxs(type, props, key);
  }

  return ReactJSXRuntime.jsxs(Emotion$1, createEmotionProps(type, props), key);
};

// eslint-disable-next-line no-undef
var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */memoize(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

var isBrowser = typeof document !== 'undefined';

var testOmitPropsOnStringTag = isPropValid;

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme';
};

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps(tag, options, isReal) {
  var shouldForwardProp;

  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp;
    shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function (propName) {
      return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
    } : optionsShouldForwardProp;
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp;
  }

  return shouldForwardProp;
};

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  registerStyles(cache, serialized, isStringTag);
  var rules = useInsertionEffectAlwaysWithSyncFallback(function () {
    return insertStyles(cache, serialized, isStringTag);
  });

  if (!isBrowser && rules !== undefined) {
    var _ref2;

    var serializedNames = serialized.name;
    var next = serialized.next;

    while (next !== undefined) {
      serializedNames += ' ' + next.name;
      next = next.next;
    }

    return /*#__PURE__*/React.createElement("style", (_ref2 = {}, _ref2["data-emotion"] = cache.key + " " + serializedNames, _ref2.dangerouslySetInnerHTML = {
      __html: rules
    }, _ref2.nonce = cache.sheet.nonce, _ref2));
  }

  return null;
};

var createStyled = function createStyled(tag, options) {

  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  var identifierName;
  var targetClassName;

  if (options !== undefined) {
    identifierName = options.label;
    targetClassName = options.target;
  }

  var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
  var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp('as');
  return function () {
    // eslint-disable-next-line prefer-rest-params
    var args = arguments;
    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push("label:" + identifierName + ";");
    }

    if (args[0] == null || args[0].raw === undefined) {
      // eslint-disable-next-line prefer-spread
      styles.push.apply(styles, args);
    } else {
      var templateStringsArr = args[0];

      styles.push(templateStringsArr[0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {

        styles.push(args[i], templateStringsArr[i]);
      }
    }

    var Styled = withEmotionCache(function (props, cache, ref) {
      var FinalTag = shouldUseAs && props.as || baseTag;
      var className = '';
      var classInterpolations = [];
      var mergedProps = props;

      if (props.theme == null) {
        mergedProps = {};

        for (var key in props) {
          mergedProps[key] = props[key];
        }

        mergedProps.theme = React.useContext(ThemeContext);
      }

      if (typeof props.className === 'string') {
        className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }

      var serialized = serializeStyles(styles.concat(classInterpolations), cache.registered, mergedProps);
      className += cache.key + "-" + serialized.name;

      if (targetClassName !== undefined) {
        className += " " + targetClassName;
      }

      var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
      var newProps = {};

      for (var _key in props) {
        if (shouldUseAs && _key === 'as') continue;

        if (finalShouldForwardProp(_key)) {
          newProps[_key] = props[_key];
        }
      }

      newProps.className = className;

      if (ref) {
        newProps.ref = ref;
      }

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Insertion, {
        cache: cache,
        serialized: serialized,
        isStringTag: typeof FinalTag === 'string'
      }), /*#__PURE__*/React.createElement(FinalTag, newProps));
    });
    Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Styled.__emotion_forwardProp = shouldForwardProp;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {

        return "." + targetClassName;
      }
    });

    Styled.withComponent = function (nextTag, nextOptions) {
      var newStyled = createStyled(nextTag, _extends({}, options, nextOptions, {
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      }));
      return newStyled.apply(undefined, styles);
    };

    return Styled;
  };
};

var tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

// bind it to avoid mutating the original function
var newStyled = createStyled.bind(null);
tags.forEach(function (tagName) {
  newStyled[tagName] = newStyled(tagName);
});

var build = {};

var core = {};

var bit = {};

var hasRequiredBit;

function requireBit () {
	if (hasRequiredBit) return bit;
	hasRequiredBit = 1;
	// Bitwise functions
	//
	// The color representation would ideally be 32-bits unsigned, but JS bitwise
	// operators only work as 32-bits signed. The range of Smi values on V8 is also
	// 32-bits signed. Those two factors make it that it's much more efficient to just
	// use signed integers to represent the data.
	//
	// Colors with a R channel >= 0x80 will be a negative number, but that's not really
	// an issue at any point because the bits for signed and unsigned integers are always
	// the same, only their interpretation changes.
	Object.defineProperty(bit, "__esModule", { value: true });
	bit.cast = cast;
	bit.get = get;
	bit.set = set;
	const INT32_TO_UINT32_OFFSET = 2 ** 32;
	function cast(n) {
	    if (n < 0) {
	        return n + INT32_TO_UINT32_OFFSET;
	    }
	    return n;
	}
	function get(n, offset) {
	    return (n >> offset) & 0xff;
	}
	function set(n, offset, byte) {
	    return n ^ ((n ^ (byte << offset)) & (0xff << offset));
	}
	
	return bit;
}

var hasRequiredCore;

function requireCore () {
	if (hasRequiredCore) return core;
	hasRequiredCore = 1;
	(function (exports) {
		var __createBinding = (core && core.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (core && core.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (core && core.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.OFFSET_A = exports.OFFSET_B = exports.OFFSET_G = exports.OFFSET_R = undefined;
		exports.newColor = newColor;
		exports.from = from;
		exports.toNumber = toNumber;
		exports.getRed = getRed;
		exports.getGreen = getGreen;
		exports.getBlue = getBlue;
		exports.getAlpha = getAlpha;
		exports.setRed = setRed;
		exports.setGreen = setGreen;
		exports.setBlue = setBlue;
		exports.setAlpha = setAlpha;
		const bit = __importStar(/*@__PURE__*/ requireBit());
		const { cast, get, set } = bit;
		exports.OFFSET_R = 24;
		exports.OFFSET_G = 16;
		exports.OFFSET_B = 8;
		exports.OFFSET_A = 0;
		/**
		 * Creates a new color from the given RGBA components.
		 * Every component should be in the [0, 255] range.
		 */
		function newColor(r, g, b, a) {
		    return ((r << exports.OFFSET_R) +
		        (g << exports.OFFSET_G) +
		        (b << exports.OFFSET_B) +
		        (a << exports.OFFSET_A));
		}
		/**
		 * Creates a new color from the given number value, e.g. 0x599eff.
		 */
		function from(color) {
		    return newColor(get(color, exports.OFFSET_R), get(color, exports.OFFSET_G), get(color, exports.OFFSET_B), get(color, exports.OFFSET_A));
		}
		/**
		 * Turns the color into its equivalent number representation.
		 * This is essentially a cast from int32 to uint32.
		 */
		function toNumber(color) {
		    return cast(color);
		}
		function getRed(c) { return get(c, exports.OFFSET_R); }
		function getGreen(c) { return get(c, exports.OFFSET_G); }
		function getBlue(c) { return get(c, exports.OFFSET_B); }
		function getAlpha(c) { return get(c, exports.OFFSET_A); }
		function setRed(c, value) { return set(c, exports.OFFSET_R, value); }
		function setGreen(c, value) { return set(c, exports.OFFSET_G, value); }
		function setBlue(c, value) { return set(c, exports.OFFSET_B, value); }
		function setAlpha(c, value) { return set(c, exports.OFFSET_A, value); }
		
	} (core));
	return core;
}

var parse = {};

var convert = {};

var hasRequiredConvert;

function requireConvert () {
	if (hasRequiredConvert) return convert;
	hasRequiredConvert = 1;
	// Copyright 2022 The Chromium Authors. All rights reserved.
	// Use of this source code is governed by a BSD-style license that can be
	// found in the LICENSE file.
	//
	// Source: https://github.com/ChromeDevTools/devtools-frontend/blob/c51201e6ee70370f7f1ac8a1a49dca7d4561aeaa/front_end/core/common/ColorConverter.ts
	// License: https://github.com/ChromeDevTools/devtools-frontend/blob/c51201e6ee70370f7f1ac8a1a49dca7d4561aeaa/LICENSE
	Object.defineProperty(convert, "__esModule", { value: true });
	convert.labToXyzd50 = labToXyzd50;
	convert.xyzd50ToLab = xyzd50ToLab;
	convert.oklabToXyzd65 = oklabToXyzd65;
	convert.xyzd65ToOklab = xyzd65ToOklab;
	convert.lchToLab = lchToLab;
	convert.labToLch = labToLch;
	convert.displayP3ToXyzd50 = displayP3ToXyzd50;
	convert.xyzd50ToDisplayP3 = xyzd50ToDisplayP3;
	convert.proPhotoToXyzd50 = proPhotoToXyzd50;
	convert.xyzd50ToProPhoto = xyzd50ToProPhoto;
	convert.adobeRGBToXyzd50 = adobeRGBToXyzd50;
	convert.xyzd50ToAdobeRGB = xyzd50ToAdobeRGB;
	convert.rec2020ToXyzd50 = rec2020ToXyzd50;
	convert.xyzd50ToRec2020 = xyzd50ToRec2020;
	convert.xyzd50ToD65 = xyzd50ToD65;
	convert.xyzd65ToD50 = xyzd65ToD50;
	convert.xyzd65TosRGBLinear = xyzd65TosRGBLinear;
	convert.xyzd50TosRGBLinear = xyzd50TosRGBLinear;
	convert.srgbLinearToXyzd50 = srgbLinearToXyzd50;
	convert.srgbToXyzd50 = srgbToXyzd50;
	convert.xyzd50ToSrgb = xyzd50ToSrgb;
	convert.oklchToXyzd50 = oklchToXyzd50;
	convert.xyzd50ToOklch = xyzd50ToOklch;
	/**
	 * Implementation of this module and all the tests are heavily influenced by
	 * https://source.chromium.org/chromium/chromium/src/+/main:ui/gfx/color_conversions.cc
	 */
	// https://en.wikipedia.org/wiki/CIELAB_color_space#Converting_between_CIELAB_and_CIEXYZ_coordinates
	const D50_X = 0.9642;
	const D50_Y = 1.0;
	const D50_Z = 0.8251;
	function multiply(matrix, other) {
	    const dst = [0, 0, 0];
	    for (let row = 0; row < 3; ++row) {
	        dst[row] = matrix[row][0] * other[0] + matrix[row][1] * other[1] +
	            matrix[row][2] * other[2];
	    }
	    return dst;
	}
	// A transfer function mapping encoded values to linear values,
	// represented by this 7-parameter piecewise function:
	//
	//   linear = sign(encoded) *  (c*|encoded| + f)       , 0 <= |encoded| < d
	//          = sign(encoded) * ((a*|encoded| + b)^g + e), d <= |encoded|
	//
	// (A simple gamma transfer function sets g to gamma and a to 1.)
	class TransferFunction {
	    g;
	    a;
	    b;
	    c;
	    d;
	    e;
	    f;
	    constructor(g, a, b = 0, c = 0, d = 0, e = 0, f = 0) {
	        this.g = g;
	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.e = e;
	        this.f = f;
	    }
	    eval(val) {
	        const sign = val < 0 ? -1 : 1.0;
	        const abs = val * sign;
	        // 0 <= |encoded| < d path
	        if (abs < this.d) {
	            return sign * (this.c * abs + this.f);
	        }
	        // d <= |encoded| path
	        return sign * (Math.pow(this.a * abs + this.b, this.g) + this.e);
	    }
	}
	const NAMED_TRANSFER_FN = {
	    sRGB: new TransferFunction(2.4, (1 / 1.055), (0.055 / 1.055), (1 / 12.92), 0.04045, 0.0, 0.0),
	    sRGB_INVERSE: new TransferFunction(0.416667, 1.13728, -0, 12.92, 0.0031308, -0.0549698, -0),
	    proPhotoRGB: new TransferFunction(1.8, 1),
	    proPhotoRGB_INVERSE: new TransferFunction(0.555556, 1, -0, 0, 0, 0, 0),
	    k2Dot2: new TransferFunction(2.2, 1.0),
	    k2Dot2_INVERSE: new TransferFunction(0.454545, 1),
	    rec2020: new TransferFunction(2.22222, 0.909672, 0.0903276, 0.222222, 0.0812429, 0, 0),
	    rec2020_INVERSE: new TransferFunction(0.45, 1.23439, -0, 4.5, 0.018054, -0.0993195, -0),
	};
	const NAMED_GAMUTS = {
	    sRGB: [
	        [0.436065674, 0.385147095, 0.143066406],
	        [0.222488403, 0.716873169, 0.060607910],
	        [0.013916016, 0.097076416, 0.714096069],
	    ],
	    sRGB_INVERSE: [
	        [3.134112151374599, -1.6173924597114966, -0.4906334036481285],
	        [-0.9787872938826594, 1.9162795854799963, 0.0334547139520088],
	        [0.07198304248352326, -0.2289858493321844, 1.4053851325241447],
	    ],
	    displayP3: [
	        [0.515102, 0.291965, 0.157153],
	        [0.241182, 0.692236, 0.0665819],
	        [-104941e-8, 0.0418818, 0.784378],
	    ],
	    displayP3_INVERSE: [
	        [2.404045155982687, -0.9898986932663839, -0.3976317191366333],
	        [-0.8422283799266768, 1.7988505115115485, 0.016048170293157416],
	        [0.04818705979712955, -0.09737385156228891, 1.2735066448052303],
	    ],
	    adobeRGB: [
	        [0.60974, 0.20528, 0.14919],
	        [0.31111, 0.62567, 0.06322],
	        [0.01947, 0.06087, 0.74457],
	    ],
	    adobeRGB_INVERSE: [
	        [1.9625385510109137, -0.6106892546501431, -0.3413827467482388],
	        [-0.9787580455521, 1.9161624707082339, 0.03341676594241408],
	        [0.028696263137883395, -0.1406807819331586, 1.349252109991369],
	    ],
	    rec2020: [
	        [0.673459, 0.165661, 0.125100],
	        [0.279033, 0.675338, 0.0456288],
	        [-193139e-8, 0.0299794, 0.797162],
	    ],
	    rec2020_INVERSE: [
	        [1.647275201661012, -0.3936024771460771, -0.23598028884792507],
	        [-0.6826176165196962, 1.647617775014935, 0.01281626807852422],
	        [0.029662725298529837, -0.06291668721366285, 1.2533964313435522],
	    ]};
	function degToRad(deg) {
	    return deg * (Math.PI / 180);
	}
	function radToDeg(rad) {
	    return rad * (180 / Math.PI);
	}
	function applyTransferFns(fn, r, g, b) {
	    return [fn.eval(r), fn.eval(g), fn.eval(b)];
	}
	const OKLAB_TO_LMS_MATRIX = [
	    [0.99999999845051981432, 0.39633779217376785678, 0.21580375806075880339],
	    [1.0000000088817607767, -0.10556134232365635, -0.06385417477170591],
	    [1.0000000546724109177, -0.08948418209496575, -1.2914855378640917],
	];
	// Inverse of the OKLAB_TO_LMS_MATRIX
	const LMS_TO_OKLAB_MATRIX = [
	    [0.2104542553, 0.7936177849999999, -0.0040720468],
	    [1.9779984951000003, -2.4285922049999997, 0.4505937099000001],
	    [0.025904037099999982, 0.7827717662, -0.8086757660000001],
	];
	const XYZ_TO_LMS_MATRIX = [
	    [0.8190224432164319, 0.3619062562801221, -0.12887378261216414],
	    [0.0329836671980271, 0.9292868468965546, 0.03614466816999844],
	    [0.048177199566046255, 0.26423952494422764, 0.6335478258136937],
	];
	// Inverse of XYZ_TO_LMS_MATRIX
	const LMS_TO_XYZ_MATRIX = [
	    [1.226879873374156, -0.5578149965554814, 0.2813910501772159],
	    [-0.040575762624313734, 1.1122868293970596, -0.07171106666151703],
	    [-0.07637294974672144, -0.4214933239627915, 1.586924024427242],
	];
	const PRO_PHOTO_TO_XYZD50_MATRIX = [
	    [0.7976700747153241, 0.13519395152800417, 0.03135596341127167],
	    [0.28803902352472205, 0.7118744007923554, 0.00008661179538844252],
	    [2.739876695467402e-7, -14405226518969991e-22, 0.825211112593861],
	];
	// Inverse of PRO_PHOTO_TO_XYZD50_MATRIX
	const XYZD50_TO_PRO_PHOTO_MATRIX = [
	    [1.3459533710138858, -0.25561367037652133, -0.051116041522131374],
	    [-0.544600415668951, 1.5081687311475767, 0.020535163968720935],
	    [-13975622054109725e-22, 0.000002717590904589903, 1.2118111696814942],
	];
	const XYZD65_TO_XYZD50_MATRIX = [
	    [1.0478573189120088, 0.022907374491829943, -0.050162247377152525],
	    [0.029570500050499514, 0.9904755577034089, -0.017061518194840468],
	    [-0.00924047197558879, 0.015052921526981566, 0.7519708530777581],
	];
	// Inverse of XYZD65_TO_XYZD50_MATRIX
	const XYZD50_TO_XYZD65_MATRIX = [
	    [0.9555366447632887, -0.02306009252137888, 0.06321844147263304],
	    [-0.028315378228764922, 1.009951351591575, 0.021026001591792402],
	    [0.012308773293784308, -0.02050053471777469, 1.3301947294775631],
	];
	const XYZD65_TO_SRGB_MATRIX = [
	    [3.2408089365140573, -1.5375788839307314, -0.4985609572551541],
	    [-0.9692732213205414, 1.876110235238969, 0.041560501141251774],
	    [0.05567030990267439, -0.2040007921971802, 1.0571046720577026],
	];
	function labToXyzd50(l, a, b) {
	    let y = (l + 16.0) / 116.0;
	    let x = y + a / 500.0;
	    let z = y - b / 200.0;
	    function labInverseTransferFunction(t) {
	        const delta = (24.0 / 116.0);
	        if (t <= delta) {
	            return (108.0 / 841.0) * (t - (16.0 / 116.0));
	        }
	        return t * t * t;
	    }
	    x = labInverseTransferFunction(x) * D50_X;
	    y = labInverseTransferFunction(y) * D50_Y;
	    z = labInverseTransferFunction(z) * D50_Z;
	    return [x, y, z];
	}
	function xyzd50ToLab(x, y, z) {
	    function labTransferFunction(t) {
	        const deltaLimit = (24.0 / 116.0) * (24.0 / 116.0) * (24.0 / 116.0);
	        if (t <= deltaLimit) {
	            return (841.0 / 108.0) * t + (16.0 / 116.0);
	        }
	        return Math.pow(t, 1.0 / 3.0);
	    }
	    x = labTransferFunction(x / D50_X);
	    y = labTransferFunction(y / D50_Y);
	    z = labTransferFunction(z / D50_Z);
	    const l = 116.0 * y - 16.0;
	    const a = 500.0 * (x - y);
	    const b = 200.0 * (y - z);
	    return [l, a, b];
	}
	function oklabToXyzd65(l, a, b) {
	    const labInput = [l, a, b];
	    const lmsIntermediate = multiply(OKLAB_TO_LMS_MATRIX, labInput);
	    lmsIntermediate[0] = lmsIntermediate[0] * lmsIntermediate[0] * lmsIntermediate[0];
	    lmsIntermediate[1] = lmsIntermediate[1] * lmsIntermediate[1] * lmsIntermediate[1];
	    lmsIntermediate[2] = lmsIntermediate[2] * lmsIntermediate[2] * lmsIntermediate[2];
	    const xyzOutput = multiply(LMS_TO_XYZ_MATRIX, lmsIntermediate);
	    return xyzOutput;
	}
	function xyzd65ToOklab(x, y, z) {
	    const xyzInput = [x, y, z];
	    const lmsIntermediate = multiply(XYZ_TO_LMS_MATRIX, xyzInput);
	    lmsIntermediate[0] = Math.pow(lmsIntermediate[0], 1.0 / 3.0);
	    lmsIntermediate[1] = Math.pow(lmsIntermediate[1], 1.0 / 3.0);
	    lmsIntermediate[2] = Math.pow(lmsIntermediate[2], 1.0 / 3.0);
	    const labOutput = multiply(LMS_TO_OKLAB_MATRIX, lmsIntermediate);
	    return [labOutput[0], labOutput[1], labOutput[2]];
	}
	function lchToLab(l, c, h) {
	    if (h === undefined) {
	        return [l, 0, 0];
	    }
	    return [l, c * Math.cos(degToRad(h)), c * Math.sin(degToRad(h))];
	}
	function labToLch(l, a, b) {
	    return [l, Math.sqrt(a * a + b * b), radToDeg(Math.atan2(b, a))];
	}
	function displayP3ToXyzd50(r, g, b) {
	    const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.sRGB, r, g, b);
	    const rgbInput = [mappedR, mappedG, mappedB];
	    const xyzOutput = multiply(NAMED_GAMUTS.displayP3, rgbInput);
	    return xyzOutput;
	}
	function xyzd50ToDisplayP3(x, y, z) {
	    const xyzInput = [x, y, z];
	    const rgbOutput = multiply(NAMED_GAMUTS.displayP3_INVERSE, xyzInput);
	    return applyTransferFns(NAMED_TRANSFER_FN.sRGB_INVERSE, rgbOutput[0], rgbOutput[1], rgbOutput[2]);
	}
	function proPhotoToXyzd50(r, g, b) {
	    const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.proPhotoRGB, r, g, b);
	    const rgbInput = [mappedR, mappedG, mappedB];
	    const xyzOutput = multiply(PRO_PHOTO_TO_XYZD50_MATRIX, rgbInput);
	    return xyzOutput;
	}
	function xyzd50ToProPhoto(x, y, z) {
	    const xyzInput = [x, y, z];
	    const rgbOutput = multiply(XYZD50_TO_PRO_PHOTO_MATRIX, xyzInput);
	    return applyTransferFns(NAMED_TRANSFER_FN.proPhotoRGB_INVERSE, rgbOutput[0], rgbOutput[1], rgbOutput[2]);
	}
	function adobeRGBToXyzd50(r, g, b) {
	    const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.k2Dot2, r, g, b);
	    const rgbInput = [mappedR, mappedG, mappedB];
	    const xyzOutput = multiply(NAMED_GAMUTS.adobeRGB, rgbInput);
	    return xyzOutput;
	}
	function xyzd50ToAdobeRGB(x, y, z) {
	    const xyzInput = [x, y, z];
	    const rgbOutput = multiply(NAMED_GAMUTS.adobeRGB_INVERSE, xyzInput);
	    return applyTransferFns(NAMED_TRANSFER_FN.k2Dot2_INVERSE, rgbOutput[0], rgbOutput[1], rgbOutput[2]);
	}
	function rec2020ToXyzd50(r, g, b) {
	    const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.rec2020, r, g, b);
	    const rgbInput = [mappedR, mappedG, mappedB];
	    const xyzOutput = multiply(NAMED_GAMUTS.rec2020, rgbInput);
	    return xyzOutput;
	}
	function xyzd50ToRec2020(x, y, z) {
	    const xyzInput = [x, y, z];
	    const rgbOutput = multiply(NAMED_GAMUTS.rec2020_INVERSE, xyzInput);
	    return applyTransferFns(NAMED_TRANSFER_FN.rec2020_INVERSE, rgbOutput[0], rgbOutput[1], rgbOutput[2]);
	}
	function xyzd50ToD65(x, y, z) {
	    const xyzInput = [x, y, z];
	    const xyzOutput = multiply(XYZD50_TO_XYZD65_MATRIX, xyzInput);
	    return xyzOutput;
	}
	function xyzd65ToD50(x, y, z) {
	    const xyzInput = [x, y, z];
	    const xyzOutput = multiply(XYZD65_TO_XYZD50_MATRIX, xyzInput);
	    return xyzOutput;
	}
	function xyzd65TosRGBLinear(x, y, z) {
	    const xyzInput = [x, y, z];
	    const rgbResult = multiply(XYZD65_TO_SRGB_MATRIX, xyzInput);
	    return rgbResult;
	}
	function xyzd50TosRGBLinear(x, y, z) {
	    const xyzInput = [x, y, z];
	    const rgbResult = multiply(NAMED_GAMUTS.sRGB_INVERSE, xyzInput);
	    return rgbResult;
	}
	function srgbLinearToXyzd50(r, g, b) {
	    const rgbInput = [r, g, b];
	    const xyzOutput = multiply(NAMED_GAMUTS.sRGB, rgbInput);
	    return xyzOutput;
	}
	function srgbToXyzd50(r, g, b) {
	    const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.sRGB, r, g, b);
	    const rgbInput = [mappedR, mappedG, mappedB];
	    const xyzOutput = multiply(NAMED_GAMUTS.sRGB, rgbInput);
	    return xyzOutput;
	}
	function xyzd50ToSrgb(x, y, z) {
	    const xyzInput = [x, y, z];
	    const rgbOutput = multiply(NAMED_GAMUTS.sRGB_INVERSE, xyzInput);
	    return applyTransferFns(NAMED_TRANSFER_FN.sRGB_INVERSE, rgbOutput[0], rgbOutput[1], rgbOutput[2]);
	}
	function oklchToXyzd50(lInput, c, h) {
	    const [l, a, b] = lchToLab(lInput, c, h);
	    const [x65, y65, z65] = oklabToXyzd65(l, a, b);
	    return xyzd65ToD50(x65, y65, z65);
	}
	function xyzd50ToOklch(x, y, z) {
	    const [x65, y65, z65] = xyzd50ToD65(x, y, z);
	    const [l, a, b] = xyzd65ToOklab(x65, y65, z65);
	    return labToLch(l, a, b);
	}
	
	return convert;
}

var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse;
	hasRequiredParse = 1;
	var __createBinding = (parse && parse.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (parse && parse.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (parse && parse.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(parse, "__esModule", { value: true });
	parse.parse = parse$1;
	parse.parseHex = parseHex;
	parse.parseColor = parseColor;
	const core_1 = /*@__PURE__*/ requireCore();
	const convert = __importStar(/*@__PURE__*/ requireConvert());
	const HASH = '#'.charCodeAt(0);
	const PERCENT = '%'.charCodeAt(0);
	const G = 'g'.charCodeAt(0);
	const N = 'n'.charCodeAt(0);
	const D = 'd'.charCodeAt(0);
	const E = 'e'.charCodeAt(0);
	/**
	 * Approximative CSS colorspace string pattern, e.g. rgb(), color()
	 */
	const PATTERN = (() => {
	    const NAME = '(\\w+)';
	    const SEPARATOR = '[\\s,\\/]';
	    const VALUE = '([^\\s,\\/]+)';
	    const SEPARATOR_THEN_VALUE = `(?:${SEPARATOR}+${VALUE})`;
	    return new RegExp(`${NAME}\\(
      ${SEPARATOR}*
      ${VALUE}
      ${SEPARATOR_THEN_VALUE}
      ${SEPARATOR_THEN_VALUE}
      ${SEPARATOR_THEN_VALUE}?
      ${SEPARATOR_THEN_VALUE}?
      ${SEPARATOR}*
    \\)`.replace(/\s/g, ''));
	})();
	/**
	 * Parse CSS color
	 * @param color CSS color string: #xxx, #xxxxxx, #xxxxxxxx, rgb(), rgba(), hsl(), hsla(), color()
	 */
	function parse$1(color) {
	    if (color.charCodeAt(0) === HASH) {
	        return parseHex(color);
	    }
	    else {
	        return parseColor(color);
	    }
	}
	/**
	 * Parse hexadecimal CSS color
	 * @param color Hex color string: #xxx, #xxxxxx, #xxxxxxxx
	 */
	function parseHex(color) {
	    let r = 0x00;
	    let g = 0x00;
	    let b = 0x00;
	    let a = 0xff;
	    switch (color.length) {
	        // #59f
	        case 4: {
	            r = (hexValue(color.charCodeAt(1)) << 4) + hexValue(color.charCodeAt(1));
	            g = (hexValue(color.charCodeAt(2)) << 4) + hexValue(color.charCodeAt(2));
	            b = (hexValue(color.charCodeAt(3)) << 4) + hexValue(color.charCodeAt(3));
	            break;
	        }
	        // #5599ff
	        case 7: {
	            r = (hexValue(color.charCodeAt(1)) << 4) + hexValue(color.charCodeAt(2));
	            g = (hexValue(color.charCodeAt(3)) << 4) + hexValue(color.charCodeAt(4));
	            b = (hexValue(color.charCodeAt(5)) << 4) + hexValue(color.charCodeAt(6));
	            break;
	        }
	        // #5599ff88
	        case 9: {
	            r = (hexValue(color.charCodeAt(1)) << 4) + hexValue(color.charCodeAt(2));
	            g = (hexValue(color.charCodeAt(3)) << 4) + hexValue(color.charCodeAt(4));
	            b = (hexValue(color.charCodeAt(5)) << 4) + hexValue(color.charCodeAt(6));
	            a = (hexValue(color.charCodeAt(7)) << 4) + hexValue(color.charCodeAt(8));
	            break;
	        }
	    }
	    return (0, core_1.newColor)(r, g, b, a);
	}
	// https://lemire.me/blog/2019/04/17/parsing-short-hexadecimal-strings-efficiently/
	function hexValue(c) {
	    return (c & 0xF) + 9 * (c >> 6);
	}
	/**
	 * Parse CSS color
	 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
	 * @param color CSS color string: rgb(), rgba(), hsl(), hsla(), color()
	 */
	function parseColor(color) {
	    const match = PATTERN.exec(color);
	    if (match === null) {
	        throw new Error(`Color.parse(): invalid CSS color: "${color}"`);
	    }
	    const format = match[1];
	    const p1 = match[2];
	    const p2 = match[3];
	    const p3 = match[4];
	    const p4 = match[5];
	    const p5 = match[6];
	    switch (format) {
	        case 'rgb':
	        case 'rgba': {
	            const r = parseColorChannel(p1);
	            const g = parseColorChannel(p2);
	            const b = parseColorChannel(p3);
	            const a = p4 ? parseAlphaChannel(p4) : 255;
	            return (0, core_1.newColor)(r, g, b, a);
	        }
	        case 'hsl':
	        case 'hsla': {
	            const h = parseAngle(p1);
	            const s = parsePercentage(p2);
	            const l = parsePercentage(p3);
	            const a = p4 ? parseAlphaChannel(p4) : 255;
	            // https://stackoverflow.com/a/9493060/3112706
	            let r, g, b;
	            if (s === 0) {
	                r = g = b = Math.round(l * 255); // achromatic
	            }
	            else {
	                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	                const p = 2 * l - q;
	                r = Math.round(hueToRGB(p, q, h + 1 / 3) * 255);
	                g = Math.round(hueToRGB(p, q, h) * 255);
	                b = Math.round(hueToRGB(p, q, h - 1 / 3) * 255);
	            }
	            return (0, core_1.newColor)(r, g, b, a);
	        }
	        case 'hwb': {
	            const h = parseAngle(p1);
	            const w = parsePercentage(p2);
	            const bl = parsePercentage(p3);
	            const a = p4 ? parseAlphaChannel(p4) : 255;
	            /* https://drafts.csswg.org/css-color/#hwb-to-rgb */
	            const s = 1.0;
	            const l = 0.5;
	            // Same as HSL to RGB
	            const q = l + s - l * s;
	            const p = 2 * l - q;
	            let r = Math.round(hueToRGB(p, q, h + 1 / 3) * 255);
	            let g = Math.round(hueToRGB(p, q, h) * 255);
	            let b = Math.round(hueToRGB(p, q, h - 1 / 3) * 255);
	            // Then HWB
	            r = hwbApply(r, w, bl);
	            g = hwbApply(g, w, bl);
	            b = hwbApply(b, w, bl);
	            return (0, core_1.newColor)(r, g, b, a);
	        }
	        case 'lab': {
	            const l = parsePercentageFor(p1, 100);
	            const aa = parsePercentageFor(p2, 125);
	            const b = parsePercentageFor(p3, 125);
	            const a = p4 ? parseAlphaChannel(p4) : 255;
	            return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.labToXyzd50(l, aa, b)));
	        }
	        case 'lch': {
	            const l = parsePercentageFor(p1, 100);
	            const c = parsePercentageFor(p2, 150);
	            const h = parseAngle(p3) * 360;
	            const a = p4 ? parseAlphaChannel(p4) : 255;
	            return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.labToXyzd50(...convert.lchToLab(l, c, h))));
	        }
	        case 'oklab': {
	            const l = parsePercentageFor(p1, 1);
	            const aa = parsePercentageFor(p2, 0.4);
	            const b = parsePercentageFor(p3, 0.4);
	            const a = p4 ? parseAlphaChannel(p4) : 255;
	            return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.xyzd65ToD50(...convert.oklabToXyzd65(l, aa, b))));
	        }
	        case 'oklch': {
	            const l = parsePercentageOrValue(p1);
	            const c = parsePercentageOrValue(p2);
	            const h = parsePercentageOrValue(p3);
	            const a = p4 ? parseAlphaChannel(p4) : 255;
	            return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.oklchToXyzd50(l, c, h)));
	        }
	        case 'color': {
	            // https://drafts.csswg.org/css-color-4/#color-function
	            const colorspace = p1;
	            const c1 = parsePercentageOrValue(p2);
	            const c2 = parsePercentageOrValue(p3);
	            const c3 = parsePercentageOrValue(p4);
	            const a = p5 ? parseAlphaChannel(p5) : 255;
	            switch (colorspace) {
	                // RGB color spaces
	                case 'srgb': {
	                    return newColorFromArray(a, [c1, c2, c3]);
	                }
	                case 'srgb-linear': {
	                    return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.srgbLinearToXyzd50(c1, c2, c3)));
	                }
	                case 'display-p3': {
	                    return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.displayP3ToXyzd50(c1, c2, c3)));
	                }
	                case 'a98-rgb': {
	                    return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.adobeRGBToXyzd50(c1, c2, c3)));
	                }
	                case 'prophoto-rgb': {
	                    return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.proPhotoToXyzd50(c1, c2, c3)));
	                }
	                case 'rec2020': {
	                    return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.rec2020ToXyzd50(c1, c2, c3)));
	                }
	                // XYZ color spaces
	                case 'xyz':
	                case 'xyz-d65': {
	                    return newColorFromArray(a, convert.xyzd50ToSrgb(...convert.xyzd65ToD50(c1, c2, c3)));
	                }
	                case 'xyz-d50': {
	                    return newColorFromArray(a, convert.xyzd50ToSrgb(c1, c2, c3));
	                }
	            }
	        }
	    }
	    throw new Error(`Color.parse(): invalid CSS color: "${color}"`);
	}
	/**
	 * Accepts: "50%", "128"
	 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb#values
	 * @returns a value in the 0 to 255 range
	 */
	function parseColorChannel(channel) {
	    if (channel.charCodeAt(channel.length - 1) === PERCENT) {
	        return Math.round((parseFloat(channel) / 100) * 255);
	    }
	    return Math.round(parseFloat(channel));
	}
	/**
	 * Accepts: "50%", ".5", "0.5"
	 * https://developer.mozilla.org/en-US/docs/Web/CSS/alpha-value
	 * @returns a value in the [0, 255] range
	 */
	function parseAlphaChannel(channel) {
	    return Math.round(parseAlphaValue(channel) * 255);
	}
	/**
	 * Accepts: "50%", ".5", "0.5"
	 * https://developer.mozilla.org/en-US/docs/Web/CSS/alpha-value
	 * @returns a value in the [0, 1] range
	 */
	function parseAlphaValue(channel) {
	    if (channel.charCodeAt(0) === N) {
	        return 0;
	    }
	    if (channel.charCodeAt(channel.length - 1) === PERCENT) {
	        return parseFloat(channel) / 100;
	    }
	    return parseFloat(channel);
	}
	/**
	 * Accepts: "360", "360deg", "400grad", "6.28rad", "1turn", "none"
	 * https://developer.mozilla.org/en-US/docs/Web/CSS/angle
	 * @returns a value in the 0.0 to 1.0 range
	 */
	function parseAngle(angle) {
	    let factor = 1;
	    switch (angle.charCodeAt(angle.length - 1)) {
	        case E: {
	            // 'none'
	            return 0;
	        }
	        case D: {
	            // 'rad', 'grad'
	            if (angle.charCodeAt(Math.max(0, angle.length - 4)) === G) {
	                // 'grad'
	                factor = 400;
	            }
	            else {
	                // 'rad'
	                factor = 2 * Math.PI; // TAU
	            }
	            break;
	        }
	        case N: {
	            // 'turn'
	            factor = 1;
	            break;
	        }
	        // case G: // 'deg', but no need to check as it's also the default
	        default: {
	            factor = 360;
	        }
	    }
	    return parseFloat(angle) / factor;
	}
	/**
	 * Accepts: "100%", "none"
	 * @returns a value in the 0.0 to 1.0 range
	 */
	function parsePercentage(value) {
	    if (value.charCodeAt(0) === N) {
	        return 0;
	    }
	    return parseFloat(value) / 100;
	}
	/**
	 * Accepts: "1.0", "100%", "none"
	 * @returns a value in the 0.0 to 1.0 range
	 */
	function parsePercentageOrValue(value) {
	    if (value.charCodeAt(0) === N) {
	        return 0;
	    }
	    if (value.charCodeAt(value.length - 1) === PERCENT) {
	        return parseFloat(value) / 100;
	    }
	    return parseFloat(value);
	}
	/**
	 * Accepts: "100", "100%", "none"
	 * @returns a value in the -@range to @range range
	 */
	function parsePercentageFor(value, range) {
	    if (value.charCodeAt(0) === N) {
	        return 0;
	    }
	    if (value.charCodeAt(value.length - 1) === PERCENT) {
	        return parseFloat(value) / 100 * range;
	    }
	    return parseFloat(value);
	}
	// HSL functions
	function hueToRGB(p, q, t) {
	    if (t < 0) {
	        t += 1;
	    }
	    if (t > 1) {
	        t -= 1;
	    }
	    if (t < 1 / 6) {
	        return p + (q - p) * 6 * t;
	    }
	    if (t < 1 / 2) {
	        return q;
	    }
	    if (t < 2 / 3) {
	        return p + (q - p) * (2 / 3 - t) * 6;
	    }
	    {
	        return p;
	    }
	}
	// HWB functions
	function hwbApply(channel, w, b) {
	    let result = channel / 255;
	    result *= 1 - w - b;
	    result += w;
	    return Math.round(result * 255);
	}
	function clamp(value) {
	    return Math.max(0, Math.min(255, value));
	}
	function newColorFromArray(a, rgb) {
	    const r = clamp(Math.round(rgb[0] * 255));
	    const g = clamp(Math.round(rgb[1] * 255));
	    const b = clamp(Math.round(rgb[2] * 255));
	    return (0, core_1.newColor)(r, g, b, a);
	}
	
	return parse;
}

var format = {};

var hasRequiredFormat;

function requireFormat () {
	if (hasRequiredFormat) return format;
	hasRequiredFormat = 1;
	var __createBinding = (format && format.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (format && format.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (format && format.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(format, "__esModule", { value: true });
	format.format = undefined;
	format.formatHEXA = formatHEXA;
	format.formatHEX = formatHEX;
	format.formatRGBA = formatRGBA;
	format.toRGBA = toRGBA;
	format.formatHSLA = formatHSLA;
	format.toHSLA = toHSLA;
	format.formatHWBA = formatHWBA;
	format.toHWBA = toHWBA;
	const core = __importStar(/*@__PURE__*/ requireCore());
	const { getRed, getGreen, getBlue, getAlpha } = core;
	// Return buffer, avoid allocations
	const buffer = [0, 0, 0];
	/**
	 * Map 8-bits value to its hexadecimal representation
	 * ['00', '01', '02', ..., 'fe', 'ff']
	 */
	const FORMAT_HEX = Array.from({ length: 256 })
	    .map((_, byte) => byte.toString(16).padStart(2, '0'));
	/** Format to a #RRGGBBAA string */
	format.format = formatHEXA;
	/** Format to a #RRGGBBAA string */
	function formatHEXA(color) {
	    return ('#' +
	        FORMAT_HEX[getRed(color)] +
	        FORMAT_HEX[getGreen(color)] +
	        FORMAT_HEX[getBlue(color)] +
	        FORMAT_HEX[getAlpha(color)]);
	}
	function formatHEX(color) {
	    return ('#' +
	        FORMAT_HEX[getRed(color)] +
	        FORMAT_HEX[getGreen(color)] +
	        FORMAT_HEX[getBlue(color)]);
	}
	function formatRGBA(color) {
	    return `rgba(${getRed(color)} ${getGreen(color)} ${getBlue(color)} / ${getAlpha(color) / 255})`;
	}
	function toRGBA(color) {
	    return {
	        r: getRed(color),
	        g: getGreen(color),
	        b: getBlue(color),
	        a: getAlpha(color),
	    };
	}
	function formatHSLA(color) {
	    rgbToHSL(getRed(color), getGreen(color), getBlue(color));
	    const h = buffer[0];
	    const s = buffer[1];
	    const l = buffer[2];
	    const a = getAlpha(color) / 255;
	    return `hsla(${h} ${s}% ${l}% / ${a})`;
	}
	function toHSLA(color) {
	    rgbToHSL(getRed(color), getGreen(color), getBlue(color));
	    const h = buffer[0];
	    const s = buffer[1];
	    const l = buffer[2];
	    const a = getAlpha(color) / 255;
	    return { h, s, l, a };
	}
	function formatHWBA(color) {
	    rgbToHWB(getRed(color), getGreen(color), getBlue(color));
	    const h = buffer[0];
	    const w = buffer[1];
	    const b = buffer[2];
	    const a = getAlpha(color) / 255;
	    return `hsla(${h} ${w}% ${b}% / ${a})`;
	}
	function toHWBA(color) {
	    rgbToHWB(getRed(color), getGreen(color), getBlue(color));
	    const h = buffer[0];
	    const w = buffer[1];
	    const b = buffer[2];
	    const a = getAlpha(color) / 255;
	    return { h, w, b, a };
	}
	// Conversion functions
	// https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/
	function rgbToHSL(r, g, b) {
	    r /= 255;
	    g /= 255;
	    b /= 255;
	    const l = Math.max(r, g, b);
	    const s = l - Math.min(r, g, b);
	    const h = s
	        ? l === r
	            ? (g - b) / s
	            : l === g
	                ? 2 + (b - r) / s
	                : 4 + (r - g) / s
	        : 0;
	    buffer[0] = 60 * h < 0 ? 60 * h + 360 : 60 * h;
	    buffer[1] = 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0);
	    buffer[2] = (100 * (2 * l - s)) / 2;
	}
	// https://stackoverflow.com/a/29463581/3112706
	function rgbToHWB(r, g, b) {
	    r /= 255;
	    g /= 255;
	    b /= 255;
	    const w = Math.min(r, g, b);
	    const v = Math.max(r, g, b);
	    const black = 1 - v;
	    if (v === w) {
	        buffer[0] = 0;
	        buffer[1] = w;
	        buffer[2] = black;
	        return;
	    }
	    let f = r === w ? g - b : (g === w ? b - r : r - g);
	    let i = r === w ? 3 : (g === w ? 5 : 1);
	    buffer[0] = (i - f / (v - w)) / 6;
	    buffer[1] = w;
	    buffer[2] = black;
	}
	
	return format;
}

var functions = {};

var hasRequiredFunctions;

function requireFunctions () {
	if (hasRequiredFunctions) return functions;
	hasRequiredFunctions = 1;
	var __createBinding = (functions && functions.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (functions && functions.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (functions && functions.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(functions, "__esModule", { value: true });
	functions.alpha = alpha;
	functions.darken = darken;
	functions.lighten = lighten;
	functions.blend = blend;
	functions.getLuminance = getLuminance;
	const core = __importStar(/*@__PURE__*/ requireCore());
	const { getRed, getGreen, getBlue, getAlpha, setAlpha, newColor } = core;
	/**
	 * Modifies color alpha channel.
	 * @param color - Color
	 * @param value - Value in the range [0, 1]
	 */
	function alpha(color, value) {
	    return setAlpha(color, Math.round(value * 255));
	}
	/**
	 * Darkens a color.
	 * @param color - Color
	 * @param coefficient - Multiplier in the range [0, 1]
	 */
	function darken(color, coefficient) {
	    const r = getRed(color);
	    const g = getGreen(color);
	    const b = getBlue(color);
	    const a = getAlpha(color);
	    const factor = 1 - coefficient;
	    return newColor(r * factor, g * factor, b * factor, a);
	}
	/**
	 * Lighten a color.
	 * @param color - Color
	 * @param coefficient - Multiplier in the range [0, 1]
	 */
	function lighten(color, coefficient) {
	    const r = getRed(color);
	    const g = getGreen(color);
	    const b = getBlue(color);
	    const a = getAlpha(color);
	    return newColor(r + (255 - r) * coefficient, g + (255 - g) * coefficient, b + (255 - b) * coefficient, a);
	}
	/**
	 * Blend (aka mix) two colors together.
	 * @param background The background color
	 * @param overlay The overlay color that is affected by @opacity
	 * @param opacity Opacity (alpha) for @overlay
	 * @param [gamma=1.0] Gamma correction coefficient. `1.0` to match browser behavior, `2.2` for gamma-corrected blending.
	 */
	function blend(background, overlay, opacity, gamma = 1.0) {
	    const blendChannel = (b, o) => Math.round((b ** (1 / gamma) * (1 - opacity) + o ** (1 / gamma) * opacity) ** gamma);
	    const r = blendChannel(getRed(background), getRed(overlay));
	    const g = blendChannel(getGreen(background), getGreen(overlay));
	    const b = blendChannel(getBlue(background), getBlue(overlay));
	    return newColor(r, g, b, 255);
	}
	/**
	 * The relative brightness of any point in a color space, normalized to 0 for
	 * darkest black and 1 for lightest white.
	 * @returns The relative brightness of the color in the range 0 - 1, with 3 digits precision
	 */
	function getLuminance(color) {
	    const r = getRed(color) / 255;
	    const g = getGreen(color) / 255;
	    const b = getBlue(color) / 255;
	    const apply = (v) => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	    const r1 = apply(r);
	    const g1 = apply(g);
	    const b1 = apply(b);
	    return Math.round((0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1) * 1000) / 1000;
	}
	
	return functions;
}

var hasRequiredBuild;

function requireBuild () {
	if (hasRequiredBuild) return build;
	hasRequiredBuild = 1;
	(function (exports) {
		var __createBinding = (build && build.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (build && build.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(/*@__PURE__*/ requireCore(), exports);
		__exportStar(/*@__PURE__*/ requireParse(), exports);
		__exportStar(/*@__PURE__*/ requireFormat(), exports);
		__exportStar(/*@__PURE__*/ requireFunctions(), exports);
		
	} (build));
	return build;
}

var buildExports = /*@__PURE__*/ requireBuild();

const getStepStatusColour = (props) => {
    if (props.isActive) {
        return COLOURS.primary;
    }
    else if (props.isCompleted) {
        return COLOURS.success;
    }
    else {
        return COLOURS.grey;
    }
};
const COLOURS = {
    primary: '#53cbba',
    success: '#28a745',
    grey: '#6c757d',
    lightGrey: '#e0e0e0',
};
const StepContainer = newStyled("div") `
  margin-right: 16px;
  display: flex;
  position: relative;
  align-items: center;
  border-radius: 1rem;
  padding: 0.75rem 1.5rem;
  flex-direction: column;
  min-width: 200px;
  cursor: pointer;
  border: 2px solid ${COLOURS.lightGrey};
  margin-bottom: 4rem;
  transform: scale(1);
  transition: all 0.2s ease-in-out;

  border-color: ${(props) => buildExports.formatHEX(buildExports.lighten(buildExports.parse(getStepStatusColour(props)), 0.5))};

  &:hover {
    border-color: ${(props) => buildExports.formatHEX(buildExports.lighten(buildExports.parse(getStepStatusColour(props)), 0.1))};
  }

  &:not(:first-child)::before {
    content: "";
    position: absolute;
    width: 2px;
    height: 48px;
    background-color: ${props => buildExports.formatHEX(buildExports.lighten(buildExports.parse(getStepStatusColour(props)), 0.3))};
    top: -5.5rem;
    left: 50%;
    transform: translate(-50%, 0);
  }

  &:last-child {
    margin-bottom: 1rem;
  }
`;
const TitleLabel = newStyled("h3") `
  font-size: 1.5rem;
  margin: 1rem 0;
`;
const Subtitle = newStyled("p") `
  font-size: 1rem;
  margin: 0 0 1rem;
`;
const ProgressCirclePoint = newStyled("div") `
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: ${(props) => getStepStatusColour(props)};
`;
const StepComponent = (props) => {
    const { step, index, currentStepIndex, onStepClick } = props;
    const isActive = index === currentStepIndex;
    const isCompleted = step.completed || index < currentStepIndex;
    return (jsxs(StepContainer, { onClick: () => onStepClick?.(index), onStepClick: !!onStepClick, isActive: isActive, isCompleted: isCompleted, children: [jsx(TitleLabel, { children: step.label }), jsx(Subtitle, { children: step.subtitle }), jsx(ProgressCirclePoint, { isActive: isActive, isCompleted: isCompleted })] }, index));
};

const StepperContainer = newStyled("div") `
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  gap: 4rem;
  margin: 4rem 0;
`;
function ProgressFlowStepper({ steps, currentStepIndex, onStepClick, }) {
    return (jsx(StepperContainer, { children: steps.map((step, index) => jsx(StepComponent, { step: step, index: index, currentStepIndex: currentStepIndex, onStepClick: onStepClick }, index)) }));
}

export { ProgressFlowStepper };
//# sourceMappingURL=index.esm.js.map
