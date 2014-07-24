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
KISSY.add('my/index-xtpl',function (S, require, exports, module) {
    /* Compiled By XTemplate */
    /*jshint quotmark:false, loopfunc:true, indent:false, asi:true, unused:false, boss:true, sub:true*/
    module.exports = function indexXtpl(scope, buffer, undefined) {
        var tpl = this, nativeCommands = tpl.root.nativeCommands, utils = tpl.root.utils;
        var callFnUtil = utils['callFn'], callCommandUtil = utils['callCommand'], rangeCommand = nativeCommands['range'], eachCommand = nativeCommands['each'], withCommand = nativeCommands['with'], ifCommand = nativeCommands['if'], setCommand = nativeCommands['set'], includeCommand = nativeCommands['include'], parseCommand = nativeCommands['parse'], extendCommand = nativeCommands['extend'], blockCommand = nativeCommands['block'], macroCommand = nativeCommands['macro'], debuggerCommand = nativeCommands['debugger'];
        buffer.write('   <p>', 0);
        var id0 = scope.resolve(['title'], 0);
        buffer.write(id0, true);
        buffer.write('</p>\r\n   <div class=\'adder\'>\r\n      <p>a: <input id=\'a\'/></p>\r\n      <p>b: <input id=\'b\'/></p>\r\n      <p>result: <span id=\'c\'></span></p>\r\n      <p><button id=\'add\'>add</button></p>\r\n    </div>', 0);
        return buffer;
    };
    module.exports.TPL_NAME = module.name;
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
