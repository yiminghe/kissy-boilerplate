/*
combined files : 

my/adder
my/index-xtpl
my/index

*/
KISSY.add('my/adder',['./adder.css'], function(S, require){
    require('./adder.css');
    return {
        add: function(a,b){
            return a + b;
        }
    };
});
/** Compiled By kissy-xtemplate */
KISSY.add('my/index-xtpl',function (S, require, exports, module) {
        /*jshint quotmark:false, loopfunc:true, indent:false, asi:true, unused:false, boss:true*/
        var t = function (scope, buffer, payload, undefined) {
            var engine = this,
                nativeCommands = engine.nativeCommands,
                utils = engine.utils;
            if ("5.0.0" !== S.version) {
                throw new Error("current xtemplate file(" + engine.name + ")(v5.0.0) need to be recompiled using current kissy(v" + S.version + ")!");
            }
            var callCommandUtil = utils.callCommand,
                eachCommand = nativeCommands.each,
                withCommand = nativeCommands["with"],
                ifCommand = nativeCommands["if"],
                setCommand = nativeCommands.set,
                includeCommand = nativeCommands.include,
                parseCommand = nativeCommands.parse,
                extendCommand = nativeCommands.extend,
                blockCommand = nativeCommands.block,
                macroCommand = nativeCommands.macro,
                debuggerCommand = nativeCommands["debugger"];
            buffer.write('   <p>');
            var id0 = scope.resolve(["title"]);
            buffer.write(id0, true);
            buffer.write('</p>\r\n   <div class=\'adder\'>\r\n      <p>a: <input id=\'a\'/></p>\r\n      <p>b: <input id=\'b\'/></p>\r\n      <p>result: <span id=\'c\'></span></p>\r\n      <p><button id=\'add\'>add</button></p>\r\n    </div>');
            return buffer;
        };
t.TPL_NAME = module.name;
return t;
});
KISSY.add('my/index',['./index.css', 'event/dom', './adder', 'xtemplate/runtime', './index-xtpl', 'dom'], function(S,require){
    require('./index.css');
    var Event = require('event/dom');
    var adder = require('./adder');
    var XTemplate = require('xtemplate/runtime');
    var tpl = require('./index-xtpl');
    var Dom = require('dom');
    return {
        init:function(){
            Dom.append(Dom.create(new XTemplate(tpl).render({
                title:'test'
            })),document.body);
            var a = Dom.get('#a');
            var b = Dom.get('#b');
            var c = Dom.get('#c');
            var add = Dom.get('#add');
            Event.on(add,'click',function(){
                c.innerHTML = adder.add(parseInt(a.value),parseInt(b.value));
            });
        }
    };
});
