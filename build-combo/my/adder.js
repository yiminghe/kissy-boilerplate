KISSY.add('my/adder',['dom'], function(S,require){
    var Dom = require('dom');
    return {
        add: function(a,b,el){
            return Dom.html(el,a + b);
        }
    };
});