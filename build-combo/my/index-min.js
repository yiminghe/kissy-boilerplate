KISSY.add("my/index",["./index.css","event","./adder"],function(a,b){b("./index.css");var c=b("event"),d=b("./adder");return{init:function(a,b,e,f){c.on(f,"click",function(){d.add(parseInt(a.value),parseInt(b.value),e)})}}});