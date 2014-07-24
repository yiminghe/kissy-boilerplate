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