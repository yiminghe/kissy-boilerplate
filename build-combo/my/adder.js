KISSY.add('my/adder',['./adder.css'], function(S, require){
    require('./adder.css');
    return {
        add: function(a,b){
            return a + b;
        }
    };
});