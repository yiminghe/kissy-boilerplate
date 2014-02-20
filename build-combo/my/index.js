KISSY.add('my/index',['./index.css', 'event', './adder', 'xtemplate/runtime', './index-xtpl', 'dom'], function(S,require){
    require('./index.css');
    var Event = require('event');
    var adder = require('./adder');
    var XTemplate = require('xtemplate/runtime');
    var tpl = require('./index-xtpl');
    var Dom = require('dom');
    return {
        init:function(a,b,el,btn){
            Dom.append(Dom.create(new XTemplate(tpl).render({
                title:'test'
            })),document.body);
            Event.on(btn,'click',function(){
                adder.add(parseInt(a.value),parseInt(b.value),el);
            });
        }
    };
});