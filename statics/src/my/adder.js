KISSY.add(function(S, require){
    require('./adder.css');
    return {
        add: function(a,b){
            return a + b;
        }
    };
});