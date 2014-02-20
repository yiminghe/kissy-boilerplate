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
        return function (scope, S, undefined) {
            var buffer = "",
                config = this.config,
                engine = this,
                moduleWrap, utils = config.utils;
            if (typeof module !== "undefined" && module.kissy) {
                moduleWrap = module;
            }
            var runBlockCommandUtil = utils.runBlockCommand,
                renderOutputUtil = utils.renderOutput,
                getPropertyUtil = utils.getProperty,
                runInlineCommandUtil = utils.runInlineCommand,
                getPropertyOrRunCommandUtil = utils.getPropertyOrRunCommand;
            buffer += '   <p>';
            var id0 = getPropertyOrRunCommandUtil(engine, scope, {}, "title", 0, 1);
            buffer += renderOutputUtil(id0, true);
            buffer += '</p>\r\n   <div class=\'adder\'>\r\n      <p>a: <input id=\'a\'/></p>\r\n      <p>b: <input id=\'b\'/></p>\r\n      <p>result: <span id=\'c\'></span></p>\r\n      <p><button id=\'add\'>add</button></p>\r\n    </div>';
            return buffer;
        };
});
KISSY.add('my/index',['./index.css', 'event', './adder', 'xtemplate/runtime', './index-xtpl', 'dom'], function(S,require){
    require('./index.css');
    var Event = require('event');
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
