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