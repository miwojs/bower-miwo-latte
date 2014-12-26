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
    if ((matches = content.match(/([\S]+)\s+in\s+([\S]+)/))) {
      name = matches[1];
      property = matches[2];
      return "for(var _i=0,_l=" + property + ".length; _i<_l; _i++) { var " + name + " = " + property + "[_i];";
    } else if ((matches = content.match(/([\S]+),\s*([\S]+)\s+in\s+([\S]+)/))) {
      name = matches[1];
      index = matches[2];
      property = matches[3];
      return "for(var " + index + "=0," + index + "_l=" + property + ".length; " + index + "<" + index + "_l; " + index + "++) { var " + name + " = " + property + "[" + index + "];";
    } else if ((matches = content.match(/([\S]+),\s*([\S]+)\s+of\s+([\S]+)/))) {
      name = matches[1];
      value = matches[2];
      property = matches[3];
      return "for(var " + name + " in " + property + ") { var " + value + " = " + property + "[" + name + "];";
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
      return eval(string) || _tpl;
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
// Generated by CoffeeScript 1.7.1
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