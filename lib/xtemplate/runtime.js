/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Feb 19 15:49
*/
/*
 Combined modules by KISSY Module Compiler: 

 xtemplate/runtime/scope
 xtemplate/runtime/commands
 xtemplate/runtime
*/

KISSY.add("xtemplate/runtime/scope", [], function(S) {
  function Scope(data, affix) {
    this.data = data || {};
    this.affix = affix;
    this.root = this
  }
  Scope.prototype = {isScope:1, setParent:function(parentScope) {
    this.parent = parentScope;
    this.root = parentScope.root
  }, getParent:function() {
    return this.parent
  }, getRoot:function() {
    return this.root
  }, set:function(name, value) {
    if(!this.affix) {
      this.affix = {}
    }
    this.affix[name] = value
  }, setData:function(data) {
    this.data = data
  }, getData:function() {
    return this.data
  }, mix:function(v) {
    if(!this.affix) {
      this.affix = {}
    }
    S.mix(this.affix, v)
  }, has:function(name) {
    var data = this.data;
    var affix = this.affix;
    if(affix && name in affix) {
      return true
    }
    return typeof data === "object" && name in data
  }, get:function(name) {
    var data = this.data;
    var affix = this.affix;
    if(affix && name in affix) {
      return affix[name]
    }
    if(typeof data === "object" && name in data) {
      return data[name]
    }
    return undefined
  }, resolve:function(name, depth) {
    if(name === ".") {
      name = "this"
    }
    var parts = name.split(".");
    var scope = this, len, i, v, p, valid;
    if(parts[0] === "root") {
      parts.shift();
      scope = scope.root
    }else {
      if(depth) {
        while(scope && depth--) {
          scope = scope.parent
        }
      }
    }
    var endScopeFind = 0;
    len = parts.length;
    while(scope) {
      valid = 1;
      v = scope;
      for(i = 0;i < len;i++) {
        p = parts[i];
        if(p === "this") {
          endScopeFind = 1;
          continue
        }
        if(v === scope) {
          if(!scope.has(p)) {
            valid = 0;
            break
          }
          v = scope.get(p)
        }else {
          if(typeof v !== "object" || !(p in v)) {
            valid = 0;
            break
          }
          v = v[p]
        }
      }
      if(valid) {
        if(v && v.isScope) {
          v = v.data
        }
        if(typeof v === "function") {
          v = v.call(this.data)
        }
        return[v]
      }
      if(endScopeFind) {
        break
      }
      scope = scope.parent
    }
    return false
  }};
  return Scope
});
KISSY.add("xtemplate/runtime/commands", ["./scope"], function(S, require) {
  var commands;
  var Scope = require("./scope");
  function getSubNameFromParentName(parentName, subName) {
    var parts = parentName.split("/");
    var subParts = subName.split("/");
    parts.pop();
    for(var i = 0;i < subParts.length;i++) {
      var subPart = subParts[i];
      if(subPart === ".") {
      }else {
        if(subPart === "..") {
          parts.pop()
        }else {
          parts.push(subPart)
        }
      }
    }
    return parts.join("/")
  }
  commands = {each:function(scope, config) {
    var params = config.params;
    var param0 = params[0];
    var xindexName = params[2] || "xindex";
    var valueName = params[1];
    var buffer = "";
    var xcount;
    var opScope;
    var affix;
    if(param0) {
      opScope = new Scope;
      if(S.isArray(param0)) {
        xcount = param0.length;
        for(var xindex = 0;xindex < xcount;xindex++) {
          opScope.data = param0[xindex];
          affix = opScope.affix = {xcount:xcount};
          affix[xindexName] = xindex;
          if(valueName) {
            affix[valueName] = param0[xindex]
          }
          opScope.setParent(scope);
          buffer += config.fn(opScope)
        }
      }else {
        for(var name in param0) {
          opScope.data = param0[name];
          affix = opScope.affix = {};
          affix[xindexName] = name;
          if(valueName) {
            affix[valueName] = param0[name]
          }
          opScope.setParent(scope);
          buffer += config.fn(opScope)
        }
      }
    }else {
      if(config.inverse) {
        buffer = config.inverse(scope)
      }
    }
    return buffer
  }, "with":function(scope, config) {
    var params = config.params;
    var param0 = params[0];
    var buffer = "";
    if(param0) {
      var opScope = new Scope(param0);
      opScope.setParent(scope);
      buffer = config.fn(opScope)
    }else {
      if(config.inverse) {
        buffer = config.inverse(scope)
      }
    }
    return buffer
  }, "if":function(scope, config) {
    var params = config.params;
    var param0 = params[0];
    var buffer = "";
    if(param0) {
      if(config.fn) {
        buffer = config.fn(scope)
      }
    }else {
      if(config.inverse) {
        buffer = config.inverse(scope)
      }
    }
    return buffer
  }, set:function(scope, config) {
    scope.mix(config.hash);
    return""
  }, include:function(scope, config) {
    var params = config.params;
    var self = this;
    var selfConfig = self.config;
    if(config.hash) {
      var newScope = new Scope(config.hash);
      newScope.setParent(scope);
      scope = newScope
    }
    var myName = selfConfig.name;
    var subTplName = params[0];
    if(subTplName.charAt(0) === ".") {
      if(myName === "unspecified") {
        S.error("parent template does not have name" + " for relative sub tpl name: " + subTplName);
        return""
      }
      subTplName = getSubNameFromParentName(myName, subTplName)
    }
    var tpl = selfConfig.loader.call(this, subTplName);
    var subConfig = S.merge(selfConfig);
    subConfig.name = subTplName;
    return self.invokeEngine(tpl, scope, subConfig)
  }, parse:function(scope, config) {
    return commands.include.call(this, new Scope, config)
  }, extend:function(scope, config) {
    this._extendTplName = config.params[0]
  }, block:function(scope, config) {
    var self = this;
    var params = config.params;
    var blockName = params[0];
    var type;
    if(params.length === 2) {
      type = params[0];
      blockName = params[1]
    }
    var blocks = self.config.blocks;
    var head = blocks[blockName], cursor;
    var current = {fn:config.fn, type:type};
    if(!head) {
      blocks[blockName] = current
    }else {
      if(head.type) {
        if(head.type === "append") {
          current.next = head;
          blocks[blockName] = current
        }else {
          if(head.type === "prepend") {
            var prev;
            cursor = head;
            while(cursor && cursor.type === "prepend") {
              prev = cursor;
              cursor = cursor.next
            }
            current.next = cursor;
            prev.next = current
          }
        }
      }
    }
    var ret = "";
    if(!self._extendTplName) {
      cursor = blocks[blockName];
      while(cursor) {
        if(cursor.fn) {
          ret += cursor.fn.call(self, scope)
        }
        cursor = cursor.next
      }
    }
    return ret
  }, macro:function(scope, config) {
    var params = config.params;
    var macroName = params[0];
    var params1 = params.slice(1);
    var self = this;
    var macros = self.config.macros;
    if(config.fn) {
      macros[macroName] = {paramNames:params1, fn:config.fn}
    }else {
      var paramValues = {};
      var macro = macros[macroName];
      if(macro) {
        S.each(macro.paramNames, function(p, i) {
          paramValues[p] = params1[i]
        });
        var newScope = new Scope(paramValues);
        return macro.fn.call(self, newScope)
      }else {
        S.error("can not find macro:" + name)
      }
    }
    return""
  }};
  return commands
});
KISSY.add("xtemplate/runtime", ["./runtime/commands", "./runtime/scope"], function(S, require) {
  var commands = require("./runtime/commands");
  var Scope = require("./runtime/scope");
  var escapeHtml = S.escapeHtml;
  var logger = S.getLogger("s/xtemplate");
  function info(s) {
    logger.info(s)
  }
  function findCommand(commands, name) {
    var parts = name.split(".");
    var cmd = commands;
    var len = parts.length;
    for(var i = 0;i < len;i++) {
      cmd = cmd[parts[i]];
      if(!cmd) {
        break
      }
    }
    return cmd
  }
  function runInlineCommand(engine, scope, options, name, line, onlyCommand) {
    var id0;
    var config = engine.config;
    var commands = config.commands;
    var command1 = findCommand(commands, name);
    if(command1) {
      try {
        id0 = command1.call(engine, scope, options)
      }catch(e) {
        S.error(e.message + ': "' + name + '" at line ' + line)
      }
      return{find:true, value:id0}
    }else {
      if(onlyCommand) {
        S.error("can not find command: " + name + '" at line ' + line)
      }
    }
    return{find:false}
  }
  function getProperty(engine, scope, name, depth, line) {
    var id0;
    var config = engine.config;
    var logFn = config.silent ? info : S.error;
    var tmp2 = scope.resolve(name, depth);
    if(tmp2 === false) {
      logFn('can not find property: "' + name + '" at line ' + line, "warn")
    }else {
      id0 = tmp2[0]
    }
    return id0
  }
  var utils = {runBlockCommand:function(engine, scope, options, name, line) {
    var config = engine.config;
    var logFn = config.silent ? info : S.error;
    var commands = config.commands;
    var command = findCommand(commands, name);
    if(!command) {
      if(!options.params && !options.hash) {
        var property = scope.resolve(name);
        if(property === false) {
          logFn('can not find property: "' + name + '" at line ' + line);
          property = ""
        }else {
          property = property[0]
        }
        command = commands["if"];
        if(S.isArray(property)) {
          command = commands.each
        }else {
          if(typeof property === "object") {
            command = commands["with"]
          }
        }
        options.params = [property]
      }else {
        S.error("can not find command: " + name + '" at line ' + line);
        return""
      }
    }
    var ret;
    try {
      ret = command.call(engine, scope, options)
    }catch(e) {
      S.error(e.message + ': "' + name + '" at line ' + line)
    }
    return ret
  }, renderOutput:function(exp, escaped) {
    if(exp === undefined) {
      exp = ""
    }
    return escaped && exp ? escapeHtml(exp) : exp
  }, getProperty:function(engine, scope, name, depth, line) {
    return getProperty(engine, scope, name, depth, line)
  }, runInlineCommand:function(engine, scope, options, name, line) {
    var id0 = "", ret;
    ret = runInlineCommand(engine, scope, options, name, line);
    if(ret.find) {
      id0 = ret.value
    }
    return id0
  }, getPropertyOrRunCommand:function(engine, scope, options, name, depth, line) {
    var id0, ret;
    var onlyCommand = options.hash || options.params;
    ret = runInlineCommand(engine, scope, options, name, line, onlyCommand);
    if(ret.find) {
      id0 = ret.value
    }else {
      if(!onlyCommand) {
        id0 = getProperty(engine, scope, name, depth, line)
      }
    }
    return id0
  }}, defaultConfig = {silent:true, name:"unspecified", loader:function(subTplName) {
    var tpl = S.require(subTplName);
    if(!tpl) {
      S.error('template "' + subTplName + '" does not exist, ' + "need to be required or used first!")
    }
    return tpl
  }};
  function XTemplateRuntime(tpl, config) {
    var self = this;
    self.tpl = tpl;
    config = S.merge(defaultConfig, config);
    config.commands = S.merge(config.commands, commands);
    config.utils = utils;
    config.macros = config.macros || {};
    config.blocks = config.blocks || {};
    this.config = config
  }
  S.mix(XTemplateRuntime, {commands:commands, utils:utils, addCommand:function(commandName, fn) {
    commands[commandName] = fn
  }, removeCommand:function(commandName) {
    delete commands[commandName]
  }});
  XTemplateRuntime.prototype = {constructor:XTemplateRuntime, invokeEngine:function(tpl, scope, config) {
    return(new this.constructor(tpl, config)).render(scope, true)
  }, removeCommand:function(commandName) {
    delete this.config.commands[commandName]
  }, addCommand:function(commandName, fn) {
    this.config.commands[commandName] = fn
  }, render:function(data) {
    var root = data;
    var self = this;
    if(!(root && root.isScope)) {
      root = new Scope(data)
    }
    var html = self.tpl(root, S);
    var extendTplName = self._extendTplName;
    if(extendTplName) {
      return commands.include.call(self, root, {params:[extendTplName]})
    }else {
      return html
    }
  }};
  XTemplateRuntime.Scope = Scope;
  return XTemplateRuntime
});

