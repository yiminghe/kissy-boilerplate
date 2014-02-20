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