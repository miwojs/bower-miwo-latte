(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ComponentMacroSet, MacroSet,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MacroSet = require('./MacroSet');

ComponentMacroSet = (function(_super) {
  __extends(ComponentMacroSet, _super);

  function ComponentMacroSet() {
    return ComponentMacroSet.__super__.constructor.apply(this, arguments);
  }

  ComponentMacroSet.prototype.install = function(compiler) {
    ComponentMacroSet.__super__.install.call(this, compiler);
    this.addMacro("reference", this.macroReference);
    this.addMacro("events", this.macroEvents);
    this.addMacro("component", this.macroComponent);
    this.addMacro("baseCls", this.macroBaseCls);
  };

  ComponentMacroSet.prototype.macroReference = function(content) {
    return "html:miwo-reference=\"" + content + "\"";
  };

  ComponentMacroSet.prototype.macroEvents = function(content) {
    content = content.replace(/([a-zA-Z0-9]+):'?([a-zA-Z0-9]+)'?/g, "$1:\\'$2\\'");
    return "html:miwo-events=\"{" + content + "}\"";
  };

  ComponentMacroSet.prototype.macroComponent = function(content) {
    return "html:<div miwo-component=\"'+ (typeof " + content + "!=\"undefined\" && Type.isObject(" + content + ") ? " + content + ".name : \"" + content + "\") +'\"></div>";
  };

  ComponentMacroSet.prototype.macroBaseCls = function(content) {
    return "string:me.getBaseCls(\"" + content + "\")";
  };

  return ComponentMacroSet;

})(MacroSet);

module.exports = ComponentMacroSet;


},{"./MacroSet":7}],2:[function(require,module,exports){
var CoreMacroSet, MacroSet,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MacroSet = require('./MacroSet');

CoreMacroSet = (function(_super) {
  __extends(CoreMacroSet, _super);

  function CoreMacroSet() {
    return CoreMacroSet.__super__.constructor.apply(this, arguments);
  }

  CoreMacroSet.prototype.install = function(compiler) {
    CoreMacroSet.__super__.install.call(this, compiler);
    this.addMacro("if", this.macroIf, this.macroEnd);
    this.addMacro("elseif", this.macroElseIf);
    this.addMacro("else", this.macroElse);
    this.addMacro("ifset", this.macroIfSet);
    this.addMacro("elseifset", this.macroElseIfSet);
    this.addMacro("for", this.macroFor, this.macroEnd);
    this.addMacro("js", this.macroJs);
    this.addMacro("log", this.macroLog);
    this.addMacro("=", this.macroWrite);
    this.addMacro("_", this.macroTranslate);
  };

  CoreMacroSet.prototype.macroEnd = function(content) {
    return "}";
  };

  CoreMacroSet.prototype.macroIf = function(content) {
    return "if(" + content + ") {";
  };

  CoreMacroSet.prototype.macroElseIf = function(content) {
    return "} else if(" + content + ") {";
  };

  CoreMacroSet.prototype.macroElse = function(content) {
    return "} else {";
  };

  CoreMacroSet.prototype.macroIfSet = function(content) {
    return this.macroIf("(" + content + ") !== undefined && (" + content + ") !== null)");
  };

  CoreMacroSet.prototype.macroElseIfSet = function(content) {
    return this.macroElseIf("(" + content + ") !== undefined && (" + content + ") !== null)");
  };

  CoreMacroSet.prototype.macroFor = function(content) {
    var index, matches, name, property, value;
    if ((matches = content.match(/([\S]+),\s*([\S]+)\s+in\s+([\S]+)/))) {
      name = matches[1];
      index = matches[2];
      property = matches[3];
      return "_items = " + property + "; for(var " + index + "=0," + index + "_l=_items.length; " + index + "<" + index + "_l; " + index + "++) { var " + name + " = _items[" + index + "];";
    } else if ((matches = content.match(/([\S]+)\s+in\s+([\S]+)/))) {
      name = matches[1];
      property = matches[2];
      return "_items = " + property + "; for(var _i=0,_l=_items.length; _i<_l; _i++) { var " + name + " = _items[_i];";
    } else if ((matches = content.match(/([\S]+),\s*([\S]+)\s+of\s+([\S]+)/))) {
      name = matches[1];
      value = matches[2];
      property = matches[3];
      return "_items = " + property + "; for(var " + name + " in _items) { var " + value + " = _items[" + name + "];";
    } else if ((matches = content.match(/([\S]+)\s+of\s+([\S]+)/))) {
      name = matches[1];
      property = matches[2];
      return "_items = " + property + "; for(var " + name + " in _items) {";
    } else {
      return "for(" + content + ") {";
    }
  };

  CoreMacroSet.prototype.macroWrite = function(content) {
    return "string:" + content;
  };

  CoreMacroSet.prototype.macroJs = function(content) {
    return content + ";";
  };

  CoreMacroSet.prototype.macroLog = function(content) {
    return 'console.log(' + content + ');';
  };

  CoreMacroSet.prototype.macroTranslate = function(content) {
    var matches, out;
    matches = content.match(/([\S]+)(\s+(.*))?/);
    out = "";
    if (!matches) {
      return out;
    }
    if (matches[1].charAt(0) === "\"") {
      out = "string:miwo.tr(" + matches[1] + ")";
    } else {
      out = "string:miwo.tr(\"" + matches[1] + "\")";
    }
    if (matches[3]) {
      out += ".substitute({" + matches[3].replace("\\", "").replace("\\", "") + "})";
    }
    return out;
  };

  return CoreMacroSet;

})(MacroSet);

module.exports = CoreMacroSet;


},{"./MacroSet":7}],3:[function(require,module,exports){
var LatteCompiler, LatteExtension, LatteFactory,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LatteFactory = require('./LatteFactory');

LatteCompiler = require('./LatteCompiler');

LatteExtension = (function(_super) {
  __extends(LatteExtension, _super);

  function LatteExtension() {
    return LatteExtension.__super__.constructor.apply(this, arguments);
  }

  LatteExtension.prototype.init = function() {
    this.setConfig({
      macros: {
        core: require('./CoreMacroSet'),
        component: require('./ComponentMacroSet')
      }
    });
  };

  LatteExtension.prototype.build = function(injector) {
    injector.define('latteFactory', LatteFactory, (function(_this) {
      return function(service) {};
    })(this));
    injector.define('latteCompiler', LatteCompiler, (function(_this) {
      return function(service) {
        var macroSet, macroSetClass, name, _ref;
        _ref = _this.config.macros;
        for (name in _ref) {
          macroSetClass = _ref[name];
          macroSet = new macroSetClass();
          macroSet.install(service);
        }
      };
    })(this));
    injector.define('templateRendererFactory', LatteFactory).setFactory((function(_this) {
      return function() {
        return injector.get('latteFactory');
      };
    })(this));
  };

  return LatteExtension;

})(Miwo.di.InjectorExtension);

module.exports = LatteExtension;


},{"./ComponentMacroSet":1,"./CoreMacroSet":2,"./LatteCompiler":5,"./LatteFactory":6}],4:[function(require,module,exports){
var Latte;

Latte = (function() {
  Latte.prototype.source = null;

  Latte.prototype.compiled = null;

  Latte.prototype.filters = null;

  Latte.prototype.compiler = null;

  function Latte(compiler) {
    this.compiler = compiler;
    this.filters = {};
  }

  Latte.prototype.setFilter = function(name, filter) {
    this.filters[name] = filter;
  };

  Latte.prototype.setSource = function(source) {
    this.source = source;
  };

  Latte.prototype.render = function(params) {
    var e;
    if (!this.compiled) {
      try {
        this.compiled = this.compiler.compile(this, this.source);
      } catch (_error) {
        e = _error;
        console.error("Latte compile error:", e.stack, " in compiling template:\n\n", this.source);
        this.compiled = null;
      }
    }
    if (this.compiled) {
      return this.evaluate(this.compiled, params);
    } else {
      return 'LATTE_ERROR';
    }
  };

  Latte.prototype.evaluate = function(string, params) {
    var e, filters, name, template, _tpl;
    try {
      _tpl = '';
      filters = this.filters;
      template = this;
      for (name in params) {
        eval('var ' + name + ' = params["' + name + '"];');
      }
      eval(string);
      return _tpl;
    } catch (_error) {
      e = _error;
      console.error("Latte render error:", e.stack, " in template:\n\n", string);
      return '';
    }
  };

  return Latte;

})();

module.exports = Latte;


},{}],5:[function(require,module,exports){
var LatteCompiler;

LatteCompiler = (function() {
  function LatteCompiler() {}

  LatteCompiler.prototype.macros = {};

  LatteCompiler.prototype.addMacro = function(name, macro) {
    this.macros[name] = macro;
    return this;
  };

  LatteCompiler.prototype.addMacros = function(macros) {
    var macro, name;
    for (name in macros) {
      macro = macros[name];
      this.addMacro(name, macro);
    }
    return this;
  };

  LatteCompiler.prototype.compile = function(latte, source) {
    var result, string;
    result = "";
    string = this.beforeCompile(source);
    result += this.start();
    result += string.replace(/\{([^\}]+)\}/g, (function(_this) {
      return function(match, content) {
        result = _this.compileCode(content);
        return (result !== false ? result : content);
      };
    })(this));
    result += this.end();
    result = this.afterCompile(result);
    return result;
  };

  LatteCompiler.prototype.start = function() {
    return "var _tpl = '";
  };

  LatteCompiler.prototype.end = function() {
    return "';";
  };

  LatteCompiler.prototype.compileCode = function(string) {
    var content, isClosing, matches, name;
    matches = string.match(/^(\/)?(\S+)\s?(.*)$/);
    isClosing = matches[1];
    name = matches[2];
    content = matches[3];
    content = content.replace("&gt;", ">");
    content = content.replace("&lt;", ">");
    content = content.replace("@", "me.");
    if (content) {
      content = content.replace(/([^\|]+)\|(.+)/g, (function(_this) {
        return function(match, data, filtersString) {
          var compiled, filter, _i, _len, _ref;
          compiled = data;
          _ref = filtersString.split("|");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            filter = _ref[_i];
            matches = filter.match(/([^:]+)(:(.*))?/);
            compiled = "filters." + matches[1] + "(" + compiled + (matches[3] ? "," + matches[3] : "") + ")";
          }
          return compiled;
        };
      })(this));
    }
    return this.writeMacro(name, content, isClosing);
  };

  LatteCompiler.prototype.beforeCompile = function(source) {
    source = source.replace(/'/g, "\\'");
    source = source.replace(/\n/g, "");
    source = source.replace(/\r/g, "");
    source = source.replace(/\{\*.*\*\}/g, "");
    return source;
  };

  LatteCompiler.prototype.afterCompile = function(result) {
    result = result.replace(/>\s+</g, "> <");
    result = result.replace(/>\s+\';/g, ">';");
    result = result.replace(/(_tpl\+?=')\s+/g, "$1");
    result = result.replace(/_tpl\+=\'\s*\';/g, "");
    return result;
  };

  LatteCompiler.prototype.writeMacro = function(name, content, isClosing) {
    var code, macro;
    if (!this.macros[name]) {
      throw new Error("Undefined macro " + name);
    }
    macro = this.macros[name];
    code = "";
    if (isClosing) {
      code = macro.nodeClosed(name, content);
    } else {
      code = macro.nodeOpened(name, content);
    }
    return this.writeCode(code);
  };

  LatteCompiler.prototype.writeCode = function(code) {
    var content, matches, type;
    if ((matches = code.match(/(string|js|html):(.*)/))) {
      type = matches[1];
      content = matches[2];
    } else {
      type = "js";
      content = code;
    }
    return this.write(type, content);
  };

  LatteCompiler.prototype.write = function(type, content) {
    var code;
    if (!content) {
      return "";
    }
    switch (type) {
      case "string":
        code = "'+" + content + "+'";
        break;
      case "js":
        code = "'; " + content + " _tpl+='";
        break;
      case "html":
        code = content;
    }
    return code;
  };

  return LatteCompiler;

})();

module.exports = LatteCompiler;


},{}],6:[function(require,module,exports){
var Latte, LatteFactory,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Latte = require('./Latte');

LatteFactory = (function(_super) {
  __extends(LatteFactory, _super);

  function LatteFactory() {
    return LatteFactory.__super__.constructor.apply(this, arguments);
  }

  LatteFactory.prototype.latteCompiler = LatteFactory.inject('latteCompiler');

  LatteFactory.prototype.create = function() {
    return new Latte(this.latteCompiler);
  };

  return LatteFactory;

})(Miwo.Object);

module.exports = LatteFactory;


},{"./Latte":4}],7:[function(require,module,exports){
var MacroSet;

MacroSet = (function() {
  function MacroSet() {}

  MacroSet.prototype.macros = {};

  MacroSet.prototype.compiler = null;

  MacroSet.prototype.install = function(compiler) {
    this.compiler = compiler;
  };

  MacroSet.prototype.addMacro = function(name, begin, end) {
    this.macros[name] = [begin, end];
    this.compiler.addMacro(name, this);
  };

  MacroSet.prototype.start = function() {};

  MacroSet.prototype.end = function() {};

  MacroSet.prototype.nodeOpened = function(name, content) {
    return this.macros[name][0](content);
  };

  MacroSet.prototype.nodeClosed = function(name, content) {
    return this.macros[name][1](content);
  };

  return MacroSet;

})();

module.exports = MacroSet;


},{}],8:[function(require,module,exports){
Miwo.latte = {
  MacroSet: require('./MacroSet'),
  LatteCompiler: require('./LatteCompiler'),
  LatteFactory: require('./LatteFactory')
};

miwo.registerExtension('miwo-latte', require('./DiExtension'));


},{"./DiExtension":3,"./LatteCompiler":5,"./LatteFactory":6,"./MacroSet":7}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi93d3cvdmhvc3RzL21pd29qcy9taXdvLWxhdHRlL3NyYy9Db21wb25lbnRNYWNyb1NldC5jb2ZmZWUiLCIvd3d3L3Zob3N0cy9taXdvanMvbWl3by1sYXR0ZS9zcmMvQ29yZU1hY3JvU2V0LmNvZmZlZSIsIi93d3cvdmhvc3RzL21pd29qcy9taXdvLWxhdHRlL3NyYy9EaUV4dGVuc2lvbi5jb2ZmZWUiLCIvd3d3L3Zob3N0cy9taXdvanMvbWl3by1sYXR0ZS9zcmMvTGF0dGUuY29mZmVlIiwiL3d3dy92aG9zdHMvbWl3b2pzL21pd28tbGF0dGUvc3JjL0xhdHRlQ29tcGlsZXIuY29mZmVlIiwiL3d3dy92aG9zdHMvbWl3b2pzL21pd28tbGF0dGUvc3JjL0xhdHRlRmFjdG9yeS5jb2ZmZWUiLCIvd3d3L3Zob3N0cy9taXdvanMvbWl3by1sYXR0ZS9zcmMvTWFjcm9TZXQuY29mZmVlIiwiL3d3dy92aG9zdHMvbWl3b2pzL21pd28tbGF0dGUvc3JjL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsMkJBQUE7RUFBQTtpU0FBQTs7QUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FBWCxDQUFBOztBQUFBO0FBTUMsc0NBQUEsQ0FBQTs7OztHQUFBOztBQUFBLDhCQUFBLE9BQUEsR0FBUyxTQUFDLFFBQUQsR0FBQTtBQUNSLElBQUEsK0NBQU0sUUFBTixDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsV0FBVixFQUF1QixJQUFDLENBQUEsY0FBeEIsQ0FEQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFBb0IsSUFBQyxDQUFBLFdBQXJCLENBRkEsQ0FBQTtBQUFB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RUFBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZjtBQUFBLEVBRUEsWUFBQSxFQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUZkO0NBREQsQ0FBQTs7QUFBQSxJQU1JLENBQUMsaUJBQUwsQ0FBdUIsWUFBdkIsRUFBcUMsT0FBQSxDQUFRLGVBQVIsQ0FBckMsQ0FOQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIk1hY3JvU2V0ID0gcmVxdWlyZSAnLi9NYWNyb1NldCdcblxuXG5jbGFzcyBDb21wb25lbnRNYWNyb1NldCBleHRlbmRzIE1hY3JvU2V0XG5cblxuXHRpbnN0YWxsOiAoY29tcGlsZXIpIC0+XG5cdFx0c3VwZXIoY29tcGlsZXIpXG5cdFx0QGFkZE1hY3JvKFwicmVmZXJlbmNlXCIsIEBtYWNyb1JlZmVyZW5jZSlcblx0XHRAYWRkTWFjcm8oXCJldmVudHNcIiwgQG1hY3JvRXZlbnRzKVxuXHRcdEBhZGRNYWNybyhcImNvbXBvbmVudFwiLCBAbWFjcm9Db21wb25lbnQpXG5cdFx0QGFkZE1hY3JvKFwiYmFzZUNsc1wiLCBAbWFjcm9CYXNlQ2xzKVxuXHRcdHJldHVyblxuXG5cblx0bWFjcm9SZWZlcmVuY2U6IChjb250ZW50KSAtPlxuXHRcdHJldHVybiBcImh0bWw6bWl3by1yZWZlcmVuY2U9XFxcIlwiICsgY29udGVudCArIFwiXFxcIlwiXG5cblxuXHRtYWNyb0V2ZW50czogKGNvbnRlbnQpIC0+XG5cdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvKFthLXpBLVowLTldKyk6Jz8oW2EtekEtWjAtOV0rKSc/L2csIFwiJDE6XFxcXCckMlxcXFwnXCIpXG5cdFx0cmV0dXJuIFwiaHRtbDptaXdvLWV2ZW50cz1cXFwie1wiICsgY29udGVudCArIFwifVxcXCJcIlxuXG5cblx0bWFjcm9Db21wb25lbnQ6IChjb250ZW50KSAtPlxuXHRcdHJldHVybiBcImh0bWw6PGRpdiBtaXdvLWNvbXBvbmVudD1cXFwiJysgKHR5cGVvZiBcIiArIGNvbnRlbnQgKyBcIiE9XFxcInVuZGVmaW5lZFxcXCIgJiYgVHlwZS5pc09iamVjdChcIiArIGNvbnRlbnQgKyBcIikgPyBcIiArIGNvbnRlbnQgKyBcIi5uYW1lIDogXFxcIlwiICsgY29udGVudCArIFwiXFxcIikgKydcXFwiPjwvZGl2PlwiXG5cblxuXHRtYWNyb0Jhc2VDbHM6IChjb250ZW50KSAtPlxuXHRcdHJldHVybiBcInN0cmluZzptZS5nZXRCYXNlQ2xzKFxcXCJcIiArIGNvbnRlbnQgKyBcIlxcXCIpXCJcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudE1hY3JvU2V0IiwiTWFjcm9TZXQgPSByZXF1aXJlICcuL01hY3JvU2V0J1xuXG5cbmNsYXNzIENvcmVNYWNyb1NldCBleHRlbmRzIE1hY3JvU2V0XG5cblxuXHRpbnN0YWxsOiAoY29tcGlsZXIpIC0+XG5cdFx0c3VwZXIoY29tcGlsZXIpXG5cdFx0QGFkZE1hY3JvKFwiaWZcIiwgQG1hY3JvSWYsIEBtYWNyb0VuZClcblx0XHRAYWRkTWFjcm8oXCJlbHNlaWZcIiwgQG1hY3JvRWxzZUlmKVxuXHRcdEBhZGRNYWNybyhcImVsc2VcIiwgQG1hY3JvRWxzZSlcblx0XHRAYWRkTWFjcm8oXCJpZnNldFwiLCBAbWFjcm9JZlNldClcblx0XHRAYWRkTWFjcm8oXCJlbHNlaWZzZXRcIiwgQG1hY3JvRWxzZUlmU2V0KVxuXHRcdEBhZGRNYWNybyhcImZvclwiLCBAbWFjcm9Gb3IsIEBtYWNyb0VuZClcblx0XHRAYWRkTWFjcm8oXCJqc1wiLCBAbWFjcm9Kcylcblx0XHRAYWRkTWFjcm8oXCJsb2dcIiwgQG1hY3JvTG9nKVxuXHRcdEBhZGRNYWNybyhcIj1cIiwgQG1hY3JvV3JpdGUpXG5cdFx0QGFkZE1hY3JvKFwiX1wiLCBAbWFjcm9UcmFuc2xhdGUpXG5cdFx0cmV0dXJuXG5cblxuXHRtYWNyb0VuZDogKGNvbnRlbnQpIC0+XG5cdFx0cmV0dXJuIFwifVwiXG5cblxuXHRtYWNyb0lmOiAoY29udGVudCkgLT5cblx0XHRyZXR1cm4gXCJpZihcIiArIGNvbnRlbnQgKyBcIikge1wiXG5cblxuXHRtYWNyb0Vsc2VJZjogKGNvbnRlbnQpIC0+XG5cdFx0cmV0dXJuIFwifSBlbHNlIGlmKFwiICsgY29udGVudCArIFwiKSB7XCJcblxuXG5cdG1hY3JvRWxzZTogKGNvbnRlbnQpIC0+XG5cdFx0cmV0dXJuIFwifSBlbHNlIHtcIlxuXG5cblx0bWFjcm9JZlNldDogKGNvbnRlbnQpIC0+XG5cdFx0cmV0dXJuIEBtYWNyb0lmIFwiKFwiICsgY29udGVudCArIFwiKSAhPT0gdW5kZWZpbmVkICYmIChcIiArIGNvbnRlbnQgKyBcIikgIT09IG51bGwpXCJcblxuXG5cdG1hY3JvRWxzZUlmU2V0OiAoY29udGVudCkgLT5cblx0XHRyZXR1cm4gQG1hY3JvRWxzZUlmIFwiKFwiICsgY29udGVudCArIFwiKSAhPT0gdW5kZWZpbmVkICYmIChcIiArIGNvbnRlbnQgKyBcIikgIT09IG51bGwpXCJcblxuXG5cdG1hY3JvRm9yOiAoY29udGVudCkgLT5cblx0XHQjIGZvciBpdGVtLGluZGV4IGluIGFycmF5XG5cdFx0aWYgKG1hdGNoZXMgPSBjb250ZW50Lm1hdGNoKC8oW1xcU10rKSxcXHMqKFtcXFNdKylcXHMraW5cXHMrKFtcXFNdKykvKSlcblx0XHRcdG5hbWUgPSBtYXRjaGVzWzFdXG5cdFx0XHRpbmRleCA9IG1hdGNoZXNbMl1cblx0XHRcdHByb3BlcnR5ID0gbWF0Y2hlc1szXVxuXHRcdFx0cmV0dXJuIFwiX2l0ZW1zID0gXCIgKyBwcm9wZXJ0eSArIFwiOyBmb3IodmFyIFwiK2luZGV4K1wiPTAsXCIraW5kZXgrXCJfbD1faXRlbXMubGVuZ3RoOyBcIitpbmRleCtcIjxcIitpbmRleCtcIl9sOyBcIitpbmRleCtcIisrKSB7IHZhciBcIiArIG5hbWUgKyBcIiA9IF9pdGVtc1tcIitpbmRleCtcIl07XCJcblxuXHRcdCMgZm9yIGl0ZW0gaW4gYXJyYXlcblx0XHRlbHNlIGlmIChtYXRjaGVzID0gY29udGVudC5tYXRjaCgvKFtcXFNdKylcXHMraW5cXHMrKFtcXFNdKykvKSlcblx0XHRcdG5hbWUgPSBtYXRjaGVzWzFdXG5cdFx0XHRwcm9wZXJ0eSA9IG1hdGNoZXNbMl1cblx0XHRcdHJldHVybiBcIl9pdGVtcyA9IFwiICsgcHJvcGVydHkgKyBcIjsgZm9yKHZhciBfaT0wLF9sPV9pdGVtcy5sZW5ndGg7IF9pPF9sOyBfaSsrKSB7IHZhciBcIiArIG5hbWUgKyBcIiA9IF9pdGVtc1tfaV07XCJcblxuXHRcdCMgZm9yIG5hbWUsdmFsdWUgb2Ygb2JqZWN0XG5cdFx0ZWxzZSBpZiAobWF0Y2hlcyA9IGNvbnRlbnQubWF0Y2goLyhbXFxTXSspLFxccyooW1xcU10rKVxccytvZlxccysoW1xcU10rKS8pKVxuXHRcdFx0bmFtZSA9IG1hdGNoZXNbMV1cblx0XHRcdHZhbHVlID0gbWF0Y2hlc1syXVxuXHRcdFx0cHJvcGVydHkgPSBtYXRjaGVzWzNdXG5cdFx0XHRyZXR1cm4gXCJfaXRlbXMgPSBcIiArIHByb3BlcnR5ICsgXCI7IGZvcih2YXIgXCIgKyBuYW1lICsgXCIgaW4gX2l0ZW1zKSB7IHZhciBcIiArIHZhbHVlICsgXCIgPSBfaXRlbXNbXCIgKyBuYW1lICsgXCJdO1wiXG5cblx0XHQjIGZvciBuYW1lIG9mIG9iamVjdFxuXHRcdGVsc2UgaWYgKG1hdGNoZXMgPSBjb250ZW50Lm1hdGNoKC8oW1xcU10rKVxccytvZlxccysoW1xcU10rKS8pKVxuXHRcdFx0bmFtZSA9IG1hdGNoZXNbMV1cblx0XHRcdHByb3BlcnR5ID0gbWF0Y2hlc1syXVxuXHRcdFx0cmV0dXJuIFwiX2l0ZW1zID0gXCIgKyBwcm9wZXJ0eSArIFwiOyBmb3IodmFyIFwiICsgbmFtZSArIFwiIGluIF9pdGVtcykge1wiXG5cblx0XHQjIHNvbWV0aW5nIGVsc2UuLi5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCJmb3IoXCIgKyBjb250ZW50ICsgXCIpIHtcIlxuXG5cblx0bWFjcm9Xcml0ZTogKGNvbnRlbnQpIC0+XG5cdFx0cmV0dXJuIFwic3RyaW5nOlwiICsgY29udGVudFxuXG5cblx0bWFjcm9KczogKGNvbnRlbnQpIC0+XG5cdFx0cmV0dXJuIGNvbnRlbnQgKyBcIjtcIlxuXG5cblx0bWFjcm9Mb2c6IChjb250ZW50KSAtPlxuXHRcdHJldHVybiAnY29uc29sZS5sb2coJytjb250ZW50KycpOyc7XG5cblxuXHRtYWNyb1RyYW5zbGF0ZTogKGNvbnRlbnQpIC0+XG5cdFx0bWF0Y2hlcyA9IGNvbnRlbnQubWF0Y2goLyhbXFxTXSspKFxccysoLiopKT8vKVxuXHRcdG91dCA9IFwiXCJcblx0XHRyZXR1cm4gb3V0ICB1bmxlc3MgbWF0Y2hlc1xuXHRcdGlmIG1hdGNoZXNbMV0uY2hhckF0KDApIGlzIFwiXFxcIlwiXG5cdFx0XHRvdXQgPSBcInN0cmluZzptaXdvLnRyKFwiICsgbWF0Y2hlc1sxXSArIFwiKVwiXG5cdFx0ZWxzZVxuXHRcdFx0b3V0ID0gXCJzdHJpbmc6bWl3by50cihcXFwiXCIgKyBtYXRjaGVzWzFdICsgXCJcXFwiKVwiXG5cdFx0b3V0ICs9IFwiLnN1YnN0aXR1dGUoe1wiICsgbWF0Y2hlc1szXS5yZXBsYWNlKFwiXFxcXFwiLCBcIlwiKS5yZXBsYWNlKFwiXFxcXFwiLCBcIlwiKSArIFwifSlcIiAgaWYgbWF0Y2hlc1szXVxuXHRcdHJldHVybiBvdXRcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29yZU1hY3JvU2V0IiwiTGF0dGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9MYXR0ZUZhY3RvcnknXG5MYXR0ZUNvbXBpbGVyID0gcmVxdWlyZSAnLi9MYXR0ZUNvbXBpbGVyJ1xuXG5cbmNsYXNzIExhdHRlRXh0ZW5zaW9uIGV4dGVuZHMgTWl3by5kaS5JbmplY3RvckV4dGVuc2lvblxuXG5cblx0aW5pdDogLT5cblx0XHRAc2V0Q29uZmlnXG5cdFx0XHRtYWNyb3M6XG5cdFx0XHRcdGNvcmU6IHJlcXVpcmUgJy4vQ29yZU1hY3JvU2V0J1xuXHRcdFx0XHRjb21wb25lbnQ6IHJlcXVpcmUgJy4vQ29tcG9uZW50TWFjcm9TZXQnXG5cdFx0cmV0dXJuXG5cblxuXHRidWlsZDogKGluamVjdG9yKSAtPlxuXHRcdGluamVjdG9yLmRlZmluZSAnbGF0dGVGYWN0b3J5JywgTGF0dGVGYWN0b3J5LCAoc2VydmljZSk9PlxuXHRcdFx0cmV0dXJuXG5cblx0XHRpbmplY3Rvci5kZWZpbmUgJ2xhdHRlQ29tcGlsZXInLCBMYXR0ZUNvbXBpbGVyLCAoc2VydmljZSk9PlxuXHRcdFx0Zm9yIG5hbWUsbWFjcm9TZXRDbGFzcyBvZiBAY29uZmlnLm1hY3Jvc1xuXHRcdFx0XHRtYWNyb1NldCA9IG5ldyBtYWNyb1NldENsYXNzKClcblx0XHRcdFx0bWFjcm9TZXQuaW5zdGFsbChzZXJ2aWNlKVxuXHRcdFx0cmV0dXJuXG5cblx0XHQjIHNlcnZpY2UgaXMgbmVlZCBmb3IgbW9kdWxlIHRlbXBsYXRlc1xuXHRcdGluamVjdG9yLmRlZmluZSAndGVtcGxhdGVSZW5kZXJlckZhY3RvcnknLCBMYXR0ZUZhY3Rvcnlcblx0XHRcdC5zZXRGYWN0b3J5ID0+IGluamVjdG9yLmdldCgnbGF0dGVGYWN0b3J5Jylcblx0XHRyZXR1cm5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTGF0dGVFeHRlbnNpb24iLCJjbGFzcyBMYXR0ZVxuXG5cdHNvdXJjZTogbnVsbFxuXHRjb21waWxlZDogbnVsbFxuXHRmaWx0ZXJzOiBudWxsXG5cdGNvbXBpbGVyOiBudWxsXG5cblxuXHRjb25zdHJ1Y3RvcjogKEBjb21waWxlcikgLT5cblx0XHRAZmlsdGVycyA9IHt9XG5cblxuXHRzZXRGaWx0ZXI6IChuYW1lLCBmaWx0ZXIpIC0+XG5cdFx0QGZpbHRlcnNbbmFtZV0gPSBmaWx0ZXJcblx0XHRyZXR1cm5cblxuXG5cdHNldFNvdXJjZTogKEBzb3VyY2UpIC0+XG5cdFx0cmV0dXJuXG5cblxuXHRyZW5kZXI6IChwYXJhbXMpIC0+XG5cdFx0aWYgIUBjb21waWxlZFxuXHRcdFx0dHJ5XG5cdFx0XHRcdEBjb21waWxlZCA9IEBjb21waWxlci5jb21waWxlKHRoaXMsIEBzb3VyY2UpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJMYXR0ZSBjb21waWxlIGVycm9yOlwiLCBlLnN0YWNrLCBcIiBpbiBjb21waWxpbmcgdGVtcGxhdGU6XFxuXFxuXCIsIEBzb3VyY2UpXG5cdFx0XHRcdEBjb21waWxlZCA9IG51bGxcblxuXHRcdGlmIEBjb21waWxlZFxuXHRcdFx0cmV0dXJuIEBldmFsdWF0ZShAY29tcGlsZWQsIHBhcmFtcylcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gJ0xBVFRFX0VSUk9SJ1xuXG5cblx0ZXZhbHVhdGU6IChzdHJpbmcsIHBhcmFtcykgLT5cblx0XHR0cnlcblx0XHRcdF90cGwgPSAnJ1xuXHRcdFx0ZmlsdGVycyA9IEBmaWx0ZXJzXG5cdFx0XHR0ZW1wbGF0ZSA9IHRoaXNcblx0XHRcdCMgZXZhbCBwYXJhbXNcblx0XHRcdGV2YWwoJ3ZhciAnK25hbWUrJyA9IHBhcmFtc1tcIicrbmFtZSsnXCJdOycpICBmb3IgbmFtZSBvZiBwYXJhbXNcblx0XHRcdCMgZXZhbCBjb2RlXG5cdFx0XHRldmFsKHN0cmluZylcblx0XHRcdCMgcmV0dXJuIGNvbXBpbGVkIHN0cmluZ1xuXHRcdFx0cmV0dXJuIF90cGxcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiTGF0dGUgcmVuZGVyIGVycm9yOlwiLCBlLnN0YWNrLCBcIiBpbiB0ZW1wbGF0ZTpcXG5cXG5cIiwgc3RyaW5nKVxuXHRcdFx0cmV0dXJuICcnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBMYXR0ZSIsImNsYXNzIExhdHRlQ29tcGlsZXJcblxuXHRtYWNyb3M6IHt9XG5cblxuXHRhZGRNYWNybzogKG5hbWUsIG1hY3JvKSAtPlxuXHRcdEBtYWNyb3NbbmFtZV0gPSBtYWNyb1xuXHRcdHJldHVybiB0aGlzXG5cblxuXHRhZGRNYWNyb3M6IChtYWNyb3MpIC0+XG5cdFx0Zm9yIG5hbWUsbWFjcm8gb2YgbWFjcm9zXG5cdFx0XHRAYWRkTWFjcm8obmFtZSwgbWFjcm8pXG5cdFx0cmV0dXJuIHRoaXNcblxuXG5cdGNvbXBpbGU6IChsYXR0ZSwgc291cmNlKSAtPlxuXHRcdHJlc3VsdCA9IFwiXCJcblxuXHRcdCMgYmVmb3JlIGNvbXBpbGUgbW9kaWZpY2F0aW9uc1xuXHRcdHN0cmluZyA9IEBiZWZvcmVDb21waWxlKHNvdXJjZSlcblxuXHRcdCMgcHJvbG9nXG5cdFx0cmVzdWx0ICs9IEBzdGFydCgpXG5cblx0XHQjIHJlcGxhY2UgZXZlcnkgbWFjcm9cblx0XHRyZXN1bHQgKz0gc3RyaW5nLnJlcGxhY2UgL1xceyhbXlxcfV0rKVxcfS9nLCAobWF0Y2gsIGNvbnRlbnQpID0+XG5cdFx0XHRyZXN1bHQgPSBAY29tcGlsZUNvZGUoY29udGVudClcblx0XHRcdHJldHVybiAoaWYgcmVzdWx0IGlzbnQgZmFsc2UgdGhlbiByZXN1bHQgZWxzZSBjb250ZW50KVxuXG5cdFx0IyBlcGlsb2dcblx0XHRyZXN1bHQgKz0gQGVuZCgpXG5cblx0XHQjIGFmdGVyIG9tcGlsZSBtb2RpZmljYXRpb25zXG5cdFx0cmVzdWx0ID0gQGFmdGVyQ29tcGlsZShyZXN1bHQpXG5cdFx0cmV0dXJuIHJlc3VsdFxuXG5cblx0c3RhcnQ6IC0+XG5cdFx0cmV0dXJuIFwidmFyIF90cGwgPSAnXCJcblxuXG5cdGVuZDogLT5cblx0XHRyZXR1cm4gXCInO1wiXG5cblxuXHRjb21waWxlQ29kZTogKHN0cmluZykgLT5cblx0XHRtYXRjaGVzID0gc3RyaW5nLm1hdGNoKC9eKFxcLyk/KFxcUyspXFxzPyguKikkLylcblx0XHRpc0Nsb3NpbmcgPSBtYXRjaGVzWzFdXG5cdFx0bmFtZSA9IG1hdGNoZXNbMl1cblx0XHRjb250ZW50ID0gbWF0Y2hlc1szXVxuXG5cdFx0IyBmaXggc3RyaW5nXG5cdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZShcIiZndDtcIiwgXCI+XCIpXG5cdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZShcIiZsdDtcIiwgXCI+XCIpXG5cdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZShcIkBcIiwgXCJtZS5cIilcblxuXHRcdCMgYXBwbHkgbW9kaWZpZXJzXG5cdFx0aWYgY29udGVudFxuXHRcdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZSAvKFteXFx8XSspXFx8KC4rKS9nLCAobWF0Y2gsIGRhdGEsIGZpbHRlcnNTdHJpbmcpID0+XG5cdFx0XHRcdGNvbXBpbGVkID0gZGF0YVxuXHRcdFx0XHRmb3IgZmlsdGVyIGluIGZpbHRlcnNTdHJpbmcuc3BsaXQoXCJ8XCIpXG5cdFx0XHRcdFx0bWF0Y2hlcyA9IGZpbHRlci5tYXRjaCgvKFteOl0rKSg6KC4qKSk/Lylcblx0XHRcdFx0XHRjb21waWxlZCA9IFwiZmlsdGVycy5cIiArIG1hdGNoZXNbMV0gKyBcIihcIiArIGNvbXBpbGVkICsgKChpZiBtYXRjaGVzWzNdIHRoZW4gXCIsXCIgKyBtYXRjaGVzWzNdIGVsc2UgXCJcIikpICsgXCIpXCJcblx0XHRcdFx0cmV0dXJuIGNvbXBpbGVkXG5cblx0XHQjIGFwcGx5IG1hY3JvXG5cdFx0cmV0dXJuIEB3cml0ZU1hY3JvKG5hbWUsIGNvbnRlbnQsIGlzQ2xvc2luZylcblxuXG5cdGJlZm9yZUNvbXBpbGU6IChzb3VyY2UpIC0+XG5cdFx0c291cmNlID0gc291cmNlLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuXHRcdHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKC9cXG4vZywgXCJcIilcblx0XHRzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgvXFxyL2csIFwiXCIpXG5cdFx0c291cmNlID0gc291cmNlLnJlcGxhY2UoL1xce1xcKi4qXFwqXFx9L2csIFwiXCIpICMgeyogLi4uICp9ID0+IFwiXCJcblx0XHRyZXR1cm4gc291cmNlXG5cblxuXHRhZnRlckNvbXBpbGU6IChyZXN1bHQpIC0+XG5cdFx0cmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoLz5cXHMrPC9nLCBcIj4gPFwiKVxuXHRcdHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8+XFxzK1xcJzsvZywgXCI+JztcIilcblx0XHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvKF90cGxcXCs/PScpXFxzKy9nLCBcIiQxXCIpXG5cdFx0cmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL190cGxcXCs9XFwnXFxzKlxcJzsvZywgXCJcIilcblx0XHRyZXR1cm4gcmVzdWx0XG5cblxuXHR3cml0ZU1hY3JvOiAobmFtZSwgY29udGVudCwgaXNDbG9zaW5nKSAtPlxuXHRcdGlmICFAbWFjcm9zW25hbWVdXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmRlZmluZWQgbWFjcm8gI3tuYW1lfVwiKVxuXG5cdFx0bWFjcm8gPSBAbWFjcm9zW25hbWVdXG5cdFx0Y29kZSA9IFwiXCJcblx0XHRpZiBpc0Nsb3Npbmdcblx0XHRcdGNvZGUgPSBtYWNyby5ub2RlQ2xvc2VkKG5hbWUsIGNvbnRlbnQpXG5cdFx0ZWxzZVxuXHRcdFx0Y29kZSA9IG1hY3JvLm5vZGVPcGVuZWQobmFtZSwgY29udGVudClcblx0XHRyZXR1cm4gQHdyaXRlQ29kZShjb2RlKVxuXG5cblx0d3JpdGVDb2RlOiAoY29kZSkgLT5cblx0XHRpZiAobWF0Y2hlcyA9IGNvZGUubWF0Y2goLyhzdHJpbmd8anN8aHRtbCk6KC4qKS8pKVxuXHRcdFx0dHlwZSA9IG1hdGNoZXNbMV1cblx0XHRcdGNvbnRlbnQgPSBtYXRjaGVzWzJdXG5cdFx0ZWxzZVxuXHRcdFx0dHlwZSA9IFwianNcIlxuXHRcdFx0Y29udGVudCA9IGNvZGVcblx0XHRyZXR1cm4gQHdyaXRlKHR5cGUsIGNvbnRlbnQpXG5cblxuXHR3cml0ZTogKHR5cGUsIGNvbnRlbnQpIC0+XG5cdFx0aWYgIWNvbnRlbnRcblx0XHRcdHJldHVybiBcIlwiXG5cblx0XHRzd2l0Y2ggdHlwZVxuXHRcdFx0d2hlbiBcInN0cmluZ1wiXG5cdFx0XHRcdGNvZGUgPSBcIicrXCIgKyBjb250ZW50ICsgXCIrJ1wiXG5cdFx0XHR3aGVuIFwianNcIlxuXHRcdFx0XHRjb2RlID0gXCInOyBcIiArIGNvbnRlbnQgKyBcIiBfdHBsKz0nXCJcblx0XHRcdHdoZW4gXCJodG1sXCJcblx0XHRcdFx0Y29kZSA9IGNvbnRlbnRcblxuXHRcdHJldHVybiBjb2RlXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IExhdHRlQ29tcGlsZXIiLCJMYXR0ZSA9IHJlcXVpcmUgJy4vTGF0dGUnXG5cblxuY2xhc3MgTGF0dGVGYWN0b3J5IGV4dGVuZHMgTWl3by5PYmplY3RcblxuXHRsYXR0ZUNvbXBpbGVyOiBAaW5qZWN0KCdsYXR0ZUNvbXBpbGVyJylcblxuXG5cdGNyZWF0ZTogLT5cblx0XHRyZXR1cm4gbmV3IExhdHRlKEBsYXR0ZUNvbXBpbGVyKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTGF0dGVGYWN0b3J5IiwiY2xhc3MgTWFjcm9TZXRcblxuXHRtYWNyb3M6IHt9XG5cdGNvbXBpbGVyOiBudWxsXG5cblxuXHRpbnN0YWxsOiAoQGNvbXBpbGVyKSAtPlxuXHRcdHJldHVyblxuXG5cblx0YWRkTWFjcm86IChuYW1lLCBiZWdpbiwgZW5kKSAtPlxuXHRcdEBtYWNyb3NbbmFtZV0gPSBbYmVnaW4sIGVuZF1cblx0XHRAY29tcGlsZXIuYWRkTWFjcm8obmFtZSwgdGhpcylcblx0XHRyZXR1cm5cblxuXG5cdCMgSW5pdGlhbGl6ZXMgYmVmb3JlIHRlbXBsYXRlIHBhcnNpbmcuXG5cdCMgQHJldHVybiB2b2lkXG5cdHN0YXJ0OiAtPlxuXG5cblx0XHQjIEZpbmlzaGVzIHRlbXBsYXRlIHBhcnNpbmcuXG5cdFx0IyBAcmV0dXJuIGFycmF5KHByb2xvZywgZXBpbG9nKVxuXHRlbmQ6IC0+XG5cblxuXHRcdCMgTmV3IG5vZGUgaXMgZm91bmQuXG5cdFx0IyBAcmV0dXJuIHN0cmluZ1xuXHRub2RlT3BlbmVkOiAobmFtZSwgY29udGVudCkgLT5cblx0XHRAbWFjcm9zW25hbWVdWzBdKGNvbnRlbnQpXG5cblxuXHQjIE5vZGUgaXMgY2xvc2VkLlxuXHQjIEByZXR1cm4gc3RyaW5nXG5cdG5vZGVDbG9zZWQ6IChuYW1lLCBjb250ZW50KSAtPlxuXHRcdEBtYWNyb3NbbmFtZV1bMV0oY29udGVudClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hY3JvU2V0IiwiTWl3by5sYXR0ZSA9XG5cdE1hY3JvU2V0OiByZXF1aXJlICcuL01hY3JvU2V0J1xuXHRMYXR0ZUNvbXBpbGVyOiByZXF1aXJlICcuL0xhdHRlQ29tcGlsZXInXG5cdExhdHRlRmFjdG9yeTogcmVxdWlyZSAnLi9MYXR0ZUZhY3RvcnknXG5cblxubWl3by5yZWdpc3RlckV4dGVuc2lvbignbWl3by1sYXR0ZScsIHJlcXVpcmUgJy4vRGlFeHRlbnNpb24nKSJdfQ==
