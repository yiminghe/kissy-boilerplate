/*
Copyright 2013, KISSY v1.50
MIT Licensed
build time: Dec 12 22:22
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 xtemplate/compiler/parser
 xtemplate/compiler/ast
 xtemplate/compiler
*/

KISSY.add("xtemplate/compiler/parser", [], function(_, undefined) {
  var parser = {}, S = KISSY, GrammarConst = {SHIFT_TYPE:1, REDUCE_TYPE:2, ACCEPT_TYPE:0, TYPE_INDEX:0, PRODUCTION_INDEX:1, TO_INDEX:2};
  var Lexer = function(cfg) {
    var self = this;
    self.rules = [];
    S.mix(self, cfg);
    self.resetInput(self.input)
  };
  Lexer.prototype = {constructor:function(cfg) {
    var self = this;
    self.rules = [];
    S.mix(self, cfg);
    self.resetInput(self.input)
  }, resetInput:function(input) {
    S.mix(this, {input:input, matched:"", stateStack:[Lexer.STATIC.INITIAL], match:"", text:"", firstLine:1, lineNumber:1, lastLine:1, firstColumn:1, lastColumn:1})
  }, genShortId:function(field) {
    var base = 97, max = 122, interval = max - base + 1;
    field += "__gen";
    var self = this;
    if(!(field in self)) {
      self[field] = -1
    }
    var index = self[field] = self[field] + 1;
    var ret = "";
    do {
      ret = String.fromCharCode(base + index % interval) + ret;
      index = Math.floor(index / interval) - 1
    }while(index >= 0);
    return ret
  }, getCurrentRules:function() {
    var self = this, currentState = self.stateStack[self.stateStack.length - 1], rules = [];
    currentState = self.mapState(currentState);
    S.each(self.rules, function(r) {
      var state = r.state || r[3];
      if(!state) {
        if(currentState === Lexer.STATIC.INITIAL) {
          rules.push(r)
        }
      }else {
        if(S.inArray(currentState, state)) {
          rules.push(r)
        }
      }
    });
    return rules
  }, pushState:function(state) {
    this.stateStack.push(state)
  }, popState:function() {
    return this.stateStack.pop()
  }, getStateStack:function() {
    return this.stateStack
  }, showDebugInfo:function() {
    var self = this, DEBUG_CONTEXT_LIMIT = Lexer.STATIC.DEBUG_CONTEXT_LIMIT, matched = self.matched, match = self.match, input = self.input;
    matched = matched.slice(0, matched.length - match.length);
    var past = (matched.length > DEBUG_CONTEXT_LIMIT ? "..." : "") + matched.slice(-DEBUG_CONTEXT_LIMIT).replace(/\n/, " "), next = match + input;
    next = next.slice(0, DEBUG_CONTEXT_LIMIT) + (next.length > DEBUG_CONTEXT_LIMIT ? "..." : "");
    return past + next + "\n" + (new Array(past.length + 1)).join("-") + "^"
  }, mapSymbol:function(t) {
    var self = this, symbolMap = self.symbolMap;
    if(!symbolMap) {
      return t
    }
    return symbolMap[t] || (symbolMap[t] = self.genShortId("symbol"))
  }, mapReverseSymbol:function(rs) {
    var self = this, symbolMap = self.symbolMap, i, reverseSymbolMap = self.reverseSymbolMap;
    if(!reverseSymbolMap && symbolMap) {
      reverseSymbolMap = self.reverseSymbolMap = {};
      for(i in symbolMap) {
        reverseSymbolMap[symbolMap[i]] = i
      }
    }
    if(reverseSymbolMap) {
      return reverseSymbolMap[rs]
    }else {
      return rs
    }
  }, mapState:function(s) {
    var self = this, stateMap = self.stateMap;
    if(!stateMap) {
      return s
    }
    return stateMap[s] || (stateMap[s] = self.genShortId("state"))
  }, lex:function() {
    var self = this, input = self.input, i, rule, m, ret, lines, rules = self.getCurrentRules();
    self.match = self.text = "";
    if(!input) {
      return self.mapSymbol(Lexer.STATIC.END_TAG)
    }
    for(i = 0;i < rules.length;i++) {
      rule = rules[i];
      var regexp = rule.regexp || rule[1], token = rule.token || rule[0], action = rule.action || rule[2] || undefined;
      if(m = input.match(regexp)) {
        lines = m[0].match(/\n.*/g);
        if(lines) {
          self.lineNumber += lines.length
        }
        S.mix(self, {firstLine:self.lastLine, lastLine:self.lineNumber + 1, firstColumn:self.lastColumn, lastColumn:lines ? lines[lines.length - 1].length - 1 : self.lastColumn + m[0].length});
        var match;
        match = self.match = m[0];
        self.matches = m;
        self.text = match;
        self.matched += match;
        ret = action && action.call(self);
        if(ret === undefined) {
          ret = token
        }else {
          ret = self.mapSymbol(ret)
        }
        input = input.slice(match.length);
        self.input = input;
        if(ret) {
          return ret
        }else {
          return self.lex()
        }
      }
    }
    S.error("lex error at line " + self.lineNumber + ":\n" + self.showDebugInfo());
    return undefined
  }};
  Lexer.STATIC = {INITIAL:"I", DEBUG_CONTEXT_LIMIT:20, END_TAG:"$EOF"};
  var lexer = new Lexer({rules:[[0, /^[\s\S]*?(?={{)/, function() {
    var self = this, text = self.text, m, n = 0;
    if(m = text.match(/\\+$/)) {
      n = m[0].length
    }
    if(n % 2) {
      self.pushState("et");
      text = text.slice(0, -1)
    }else {
      self.pushState("t")
    }
    if(n) {
      text = text.replace(/\\+$/g, function(m) {
        return(new Array(m.length / 2 + 1)).join("\\")
      })
    }
    self.text = text;
    return"CONTENT"
  }], ["b", /^[\s\S]+/, 0], ["b", /^[\s\S]{2,}?(?:(?={{)|$)/, function popState() {
    this.popState()
  }, ["et"]], ["c", /^{{(?:#|@|\^)/, 0, ["t"]], ["d", /^{{\//, 0, ["t"]], ["e", /^{{\s*else\s*}}/, function popState() {
    this.popState()
  }, ["t"]], [0, /^{{![\s\S]*?}}/, function popState() {
    this.popState()
  }, ["t"]], ["b", /^{{%([\s\S]*?)%}}/, function() {
    this.text = this.matches[1] || "";
    this.popState()
  }, ["t"]], ["f", /^{{{?/, 0, ["t"]], ["g", /^\s+/, 0, ["t"]], ["h", /^}}}?/, function popState() {
    this.popState()
  }, ["t"]], ["i", /^\(/, 0, ["t"]], ["j", /^\)/, 0, ["t"]], ["k", /^\|\|/, 0, ["t"]], ["l", /^&&/, 0, ["t"]], ["m", /^===/, 0, ["t"]], ["n", /^!==/, 0, ["t"]], ["o", /^>=/, 0, ["t"]], ["p", /^<=/, 0, ["t"]], ["q", /^>/, 0, ["t"]], ["r", /^</, 0, ["t"]], ["s", /^\+/, 0, ["t"]], ["t", /^-/, 0, ["t"]], ["u", /^\*/, 0, ["t"]], ["v", /^\//, 0, ["t"]], ["w", /^%/, 0, ["t"]], ["x", /^!/, 0, ["t"]], ["y", /^"(\\[\s\S]|[^\\"])*"/, function() {
    this.text = this.text.slice(1, -1).replace(/\\"/g, '"')
  }, ["t"]], ["y", /^'(\\[\s\S]|[^\\'])*'/, function() {
    this.text = this.text.slice(1, -1).replace(/\\'/g, "'")
  }, ["t"]], ["z", /^true/, 0, ["t"]], ["z", /^false/, 0, ["t"]], ["aa", /^\d+(?:\.\d+)?(?:e-?\d+)?/i, 0, ["t"]], ["ab", /^=/, 0, ["t"]], ["ac", /^\.(?=})/, 0, ["t"]], ["ac", /^\.\./, function() {
    this.pushState("ws")
  }, ["t"]], ["ad", /^\//, function popState() {
    this.popState()
  }, ["ws"]], ["ad", /^\./, 0, ["t"]], ["ae", /^\[/, 0, ["t"]], ["af", /^\]/, 0, ["t"]], ["ac", /^[a-zA-Z0-9_$]+/, 0, ["t"]], ["ag", /^./, 0, ["t"]]]});
  parser.lexer = lexer;
  lexer.symbolMap = {$EOF:"a", CONTENT:"b", OPEN_BLOCK:"c", OPEN_CLOSE_BLOCK:"d", INVERSE:"e", OPEN_TPL:"f", SPACE:"g", CLOSE:"h", LPAREN:"i", RPAREN:"j", OR:"k", AND:"l", LOGIC_EQUALS:"m", LOGIC_NOT_EQUALS:"n", GE:"o", LE:"p", GT:"q", LT:"r", PLUS:"s", MINUS:"t", MULTIPLY:"u", DIVIDE:"v", MODULUS:"w", NOT:"x", STRING:"y", BOOLEAN:"z", NUMBER:"aa", EQUALS:"ab", ID:"ac", SEP:"ad", REF_START:"ae", REF_END:"af", INVALID:"ag", $START:"ah", program:"ai", statements:"aj", statement:"ak", openBlock:"al", 
  closeBlock:"am", tpl:"an", inBlockTpl:"ao", path:"ap", inTpl:"aq", Expression:"ar", params:"as", hash:"at", param:"au", ConditionalOrExpression:"av", ConditionalAndExpression:"aw", EqualityExpression:"ax", RelationalExpression:"ay", AdditiveExpression:"az", MultiplicativeExpression:"ba", UnaryExpression:"bb", PrimaryExpression:"bc", hashSegments:"bd", hashSegment:"be", pathSegments:"bf"};
  parser.productions = [["ah", ["ai"]], ["ai", ["aj", "e", "aj"], function() {
    return new this.yy.ProgramNode(this.lexer.lineNumber, this.$1, this.$3)
  }], ["ai", ["aj"], function() {
    return new this.yy.ProgramNode(this.lexer.lineNumber, this.$1)
  }], ["aj", ["ak"], function() {
    return[this.$1]
  }], ["aj", ["aj", "ak"], function() {
    this.$1.push(this.$2)
  }], ["ak", ["al", "ai", "am"], function() {
    return new this.yy.BlockNode(this.lexer.lineNumber, this.$1, this.$2, this.$3)
  }], ["ak", ["an"]], ["ak", ["b"], function() {
    return new this.yy.ContentNode(this.lexer.lineNumber, this.$1)
  }], ["ao", ["ap"], function() {
    return new this.yy.TplNode(this.lexer.lineNumber, this.$1)
  }], ["ao", ["aq"]], ["al", ["c", "ao", "h"], function() {
    if(this.$1.charAt(this.$1.length - 1) === "^") {
      this.$2.isInverted = 1
    }
    return this.$2
  }], ["am", ["d", "ap", "h"], function() {
    return this.$2
  }], ["an", ["f", "aq", "h"], function() {
    if(this.$1.length === 3) {
      this.$2.escaped = false
    }
    return this.$2
  }], ["an", ["f", "ar", "h"], function() {
    var tpl = new this.yy.TplExpressionNode(this.lexer.lineNumber, this.$2);
    if(this.$1.length === 3) {
      tpl.escaped = false
    }
    return tpl
  }], ["aq", ["ap", "g", "as", "g", "at"], function() {
    return new this.yy.TplNode(this.lexer.lineNumber, this.$1, this.$3, this.$5)
  }], ["aq", ["ap", "g", "as"], function() {
    return new this.yy.TplNode(this.lexer.lineNumber, this.$1, this.$3)
  }], ["aq", ["ap", "g", "at"], function() {
    return new this.yy.TplNode(this.lexer.lineNumber, this.$1, null, this.$3)
  }], ["as", ["as", "g", "au"], function() {
    this.$1.push(this.$3)
  }], ["as", ["au"], function() {
    return[this.$1]
  }], ["au", ["ar"]], ["ar", ["av"]], ["av", ["aw"]], ["av", ["av", "k", "aw"], function() {
    return new this.yy.ConditionalOrExpression(this.$1, this.$3)
  }], ["aw", ["ax"]], ["aw", ["aw", "l", "ax"], function() {
    return new this.yy.ConditionalAndExpression(this.$1, this.$3)
  }], ["ax", ["ay"]], ["ax", ["ax", "m", "ay"], function() {
    return new this.yy.EqualityExpression(this.$1, "===", this.$3)
  }], ["ax", ["ax", "n", "ay"], function() {
    return new this.yy.EqualityExpression(this.$1, "!==", this.$3)
  }], ["ay", ["az"]], ["ay", ["ay", "r", "az"], function() {
    return new this.yy.RelationalExpression(this.$1, "<", this.$3)
  }], ["ay", ["ay", "q", "az"], function() {
    return new this.yy.RelationalExpression(this.$1, ">", this.$3)
  }], ["ay", ["ay", "p", "az"], function() {
    return new this.yy.RelationalExpression(this.$1, "<=", this.$3)
  }], ["ay", ["ay", "o", "az"], function() {
    return new this.yy.RelationalExpression(this.$1, ">=", this.$3)
  }], ["az", ["ba"]], ["az", ["az", "s", "ba"], function() {
    return new this.yy.AdditiveExpression(this.$1, "+", this.$3)
  }], ["az", ["az", "t", "ba"], function() {
    return new this.yy.AdditiveExpression(this.$1, "-", this.$3)
  }], ["ba", ["bb"]], ["ba", ["ba", "u", "bb"], function() {
    return new this.yy.MultiplicativeExpression(this.$1, "*", this.$3)
  }], ["ba", ["ba", "v", "bb"], function() {
    return new this.yy.MultiplicativeExpression(this.$1, "/", this.$3)
  }], ["ba", ["ba", "w", "bb"], function() {
    return new this.yy.MultiplicativeExpression(this.$1, "%", this.$3)
  }], ["bb", ["x", "bb"], function() {
    return new this.yy.UnaryExpression(this.$1, this.$2)
  }], ["bb", ["t", "bb"], function() {
    return new this.yy.UnaryExpression(this.$1, this.$2)
  }], ["bb", ["bc"]], ["bc", ["y"], function() {
    return new this.yy.StringNode(this.lexer.lineNumber, this.$1)
  }], ["bc", ["aa"], function() {
    return new this.yy.NumberNode(this.lexer.lineNumber, this.$1)
  }], ["bc", ["z"], function() {
    return new this.yy.BooleanNode(this.lexer.lineNumber, this.$1)
  }], ["bc", ["ap"]], ["bc", ["i", "ar", "j"], function() {
    return this.$2
  }], ["at", ["bd"], function() {
    return new this.yy.HashNode(this.lexer.lineNumber, this.$1)
  }], ["bd", ["bd", "g", "be"], function() {
    this.$1.push(this.$3)
  }], ["bd", ["be"], function() {
    return[this.$1]
  }], ["be", ["ac", "ab", "ar"], function() {
    return[this.$1, this.$3]
  }], ["ap", ["bf"], function() {
    return new this.yy.IdNode(this.lexer.lineNumber, this.$1)
  }], ["bf", ["bf", "ad", "ac"], function() {
    this.$1.push(this.$3)
  }], ["bf", ["bf", "ae", "ar", "af"], function() {
    this.$1.push(this.$3)
  }], ["bf", ["bf", "ad", "aa"], function() {
    this.$1.push(this.$3)
  }], ["bf", ["ac"], function() {
    return[this.$1]
  }]];
  parser.table = {gotos:{"0":{ai:4, aj:5, ak:6, al:7, an:8}, "2":{ao:10, aq:11, ap:12, bf:13}, "3":{aq:20, ar:21, av:22, aw:23, ax:24, ay:25, az:26, ba:27, bb:28, bc:29, ap:30, bf:13}, "5":{ak:32, al:7, an:8}, "7":{ai:33, aj:5, ak:6, al:7, an:8}, "14":{ar:38, av:22, aw:23, ax:24, ay:25, az:26, ba:27, bb:28, bc:29, ap:39, bf:13}, "15":{bb:40, bc:29, ap:39, bf:13}, "16":{bb:41, bc:29, ap:39, bf:13}, "31":{aj:57, ak:6, al:7, an:8}, "33":{am:59}, "35":{as:61, au:62, ar:63, av:22, aw:23, ax:24, ay:25, 
  az:26, ba:27, bb:28, bc:29, at:64, bd:65, be:66, ap:39, bf:13}, "37":{ar:69, av:22, aw:23, ax:24, ay:25, az:26, ba:27, bb:28, bc:29, ap:39, bf:13}, "44":{aw:71, ax:24, ay:25, az:26, ba:27, bb:28, bc:29, ap:39, bf:13}, "45":{ax:72, ay:25, az:26, ba:27, bb:28, bc:29, ap:39, bf:13}, "46":{ay:73, az:26, ba:27, bb:28, bc:29, ap:39, bf:13}, "47":{ay:74, az:26, ba:27, bb:28, bc:29, ap:39, bf:13}, "48":{az:75, ba:27, bb:28, bc:29, ap:39, bf:13}, "49":{az:76, ba:27, bb:28, bc:29, ap:39, bf:13}, "50":{az:77, 
  ba:27, bb:28, bc:29, ap:39, bf:13}, "51":{az:78, ba:27, bb:28, bc:29, ap:39, bf:13}, "52":{ba:79, bb:28, bc:29, ap:39, bf:13}, "53":{ba:80, bb:28, bc:29, ap:39, bf:13}, "54":{bb:81, bc:29, ap:39, bf:13}, "55":{bb:82, bc:29, ap:39, bf:13}, "56":{bb:83, bc:29, ap:39, bf:13}, "57":{ak:32, al:7, an:8}, "58":{ap:84, bf:13}, "85":{ar:90, av:22, aw:23, ax:24, ay:25, az:26, ba:27, bb:28, bc:29, ap:39, bf:13}, "86":{au:91, ar:63, av:22, aw:23, ax:24, ay:25, az:26, ba:27, bb:28, bc:29, at:92, bd:65, be:66, 
  ap:39, bf:13}, "87":{be:94}}, action:{"0":{b:[1, undefined, 1], c:[1, undefined, 2], f:[1, undefined, 3]}, "1":{a:[2, 7], e:[2, 7], c:[2, 7], f:[2, 7], b:[2, 7], d:[2, 7]}, "2":{ac:[1, undefined, 9]}, "3":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "4":{a:[0]}, "5":{a:[2, 2], d:[2, 2], b:[1, undefined, 1], c:[1, undefined, 2], e:[1, undefined, 31], f:[1, undefined, 3]}, "6":{a:[2, 3], 
  e:[2, 3], c:[2, 3], f:[2, 3], b:[2, 3], d:[2, 3]}, "7":{b:[1, undefined, 1], c:[1, undefined, 2], f:[1, undefined, 3]}, "8":{a:[2, 6], e:[2, 6], c:[2, 6], f:[2, 6], b:[2, 6], d:[2, 6]}, "9":{h:[2, 56], g:[2, 56], ad:[2, 56], ae:[2, 56], k:[2, 56], l:[2, 56], m:[2, 56], n:[2, 56], o:[2, 56], p:[2, 56], q:[2, 56], r:[2, 56], s:[2, 56], t:[2, 56], u:[2, 56], v:[2, 56], w:[2, 56], j:[2, 56], af:[2, 56]}, "10":{h:[1, undefined, 34]}, "11":{h:[2, 9]}, "12":{h:[2, 8], g:[1, undefined, 35]}, "13":{h:[2, 
  52], g:[2, 52], k:[2, 52], l:[2, 52], m:[2, 52], n:[2, 52], o:[2, 52], p:[2, 52], q:[2, 52], r:[2, 52], s:[2, 52], t:[2, 52], u:[2, 52], v:[2, 52], w:[2, 52], j:[2, 52], af:[2, 52], ad:[1, undefined, 36], ae:[1, undefined, 37]}, "14":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "15":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 
  18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "16":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "17":{h:[2, 43], k:[2, 43], l:[2, 43], m:[2, 43], n:[2, 43], o:[2, 43], p:[2, 43], q:[2, 43], r:[2, 43], s:[2, 43], t:[2, 43], u:[2, 43], v:[2, 43], w:[2, 43], j:[2, 43], g:[2, 43], af:[2, 43]}, "18":{h:[2, 45], k:[2, 45], l:[2, 45], m:[2, 45], n:[2, 45], o:[2, 45], p:[2, 45], q:[2, 45], 
  r:[2, 45], s:[2, 45], t:[2, 45], u:[2, 45], v:[2, 45], w:[2, 45], j:[2, 45], g:[2, 45], af:[2, 45]}, "19":{h:[2, 44], k:[2, 44], l:[2, 44], m:[2, 44], n:[2, 44], o:[2, 44], p:[2, 44], q:[2, 44], r:[2, 44], s:[2, 44], t:[2, 44], u:[2, 44], v:[2, 44], w:[2, 44], j:[2, 44], g:[2, 44], af:[2, 44]}, "20":{h:[1, undefined, 42]}, "21":{h:[1, undefined, 43]}, "22":{h:[2, 20], j:[2, 20], g:[2, 20], af:[2, 20], k:[1, undefined, 44]}, "23":{h:[2, 21], k:[2, 21], j:[2, 21], g:[2, 21], af:[2, 21], l:[1, undefined, 
  45]}, "24":{h:[2, 23], k:[2, 23], l:[2, 23], j:[2, 23], g:[2, 23], af:[2, 23], m:[1, undefined, 46], n:[1, undefined, 47]}, "25":{h:[2, 25], k:[2, 25], l:[2, 25], m:[2, 25], n:[2, 25], j:[2, 25], g:[2, 25], af:[2, 25], o:[1, undefined, 48], p:[1, undefined, 49], q:[1, undefined, 50], r:[1, undefined, 51]}, "26":{h:[2, 28], k:[2, 28], l:[2, 28], m:[2, 28], n:[2, 28], o:[2, 28], p:[2, 28], q:[2, 28], r:[2, 28], j:[2, 28], g:[2, 28], af:[2, 28], s:[1, undefined, 52], t:[1, undefined, 53]}, "27":{h:[2, 
  33], k:[2, 33], l:[2, 33], m:[2, 33], n:[2, 33], o:[2, 33], p:[2, 33], q:[2, 33], r:[2, 33], s:[2, 33], t:[2, 33], j:[2, 33], g:[2, 33], af:[2, 33], u:[1, undefined, 54], v:[1, undefined, 55], w:[1, undefined, 56]}, "28":{h:[2, 36], k:[2, 36], l:[2, 36], m:[2, 36], n:[2, 36], o:[2, 36], p:[2, 36], q:[2, 36], r:[2, 36], s:[2, 36], t:[2, 36], u:[2, 36], v:[2, 36], w:[2, 36], j:[2, 36], g:[2, 36], af:[2, 36]}, "29":{h:[2, 42], k:[2, 42], l:[2, 42], m:[2, 42], n:[2, 42], o:[2, 42], p:[2, 42], q:[2, 
  42], r:[2, 42], s:[2, 42], t:[2, 42], u:[2, 42], v:[2, 42], w:[2, 42], j:[2, 42], g:[2, 42], af:[2, 42]}, "30":{h:[2, 46], k:[2, 46], l:[2, 46], m:[2, 46], n:[2, 46], o:[2, 46], p:[2, 46], q:[2, 46], r:[2, 46], s:[2, 46], t:[2, 46], u:[2, 46], v:[2, 46], w:[2, 46], g:[1, undefined, 35]}, "31":{b:[1, undefined, 1], c:[1, undefined, 2], f:[1, undefined, 3]}, "32":{a:[2, 4], e:[2, 4], c:[2, 4], f:[2, 4], b:[2, 4], d:[2, 4]}, "33":{d:[1, undefined, 58]}, "34":{c:[2, 10], f:[2, 10], b:[2, 10]}, "35":{i:[1, 
  undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 60]}, "36":{aa:[1, undefined, 67], ac:[1, undefined, 68]}, "37":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "38":{j:[1, undefined, 70]}, "39":{j:[2, 46], k:[2, 46], l:[2, 46], m:[2, 46], n:[2, 46], o:[2, 46], p:[2, 46], q:[2, 46], r:[2, 46], 
  s:[2, 46], t:[2, 46], u:[2, 46], v:[2, 46], w:[2, 46], h:[2, 46], g:[2, 46], af:[2, 46]}, "40":{h:[2, 41], k:[2, 41], l:[2, 41], m:[2, 41], n:[2, 41], o:[2, 41], p:[2, 41], q:[2, 41], r:[2, 41], s:[2, 41], t:[2, 41], u:[2, 41], v:[2, 41], w:[2, 41], j:[2, 41], g:[2, 41], af:[2, 41]}, "41":{h:[2, 40], k:[2, 40], l:[2, 40], m:[2, 40], n:[2, 40], o:[2, 40], p:[2, 40], q:[2, 40], r:[2, 40], s:[2, 40], t:[2, 40], u:[2, 40], v:[2, 40], w:[2, 40], j:[2, 40], g:[2, 40], af:[2, 40]}, "42":{a:[2, 12], e:[2, 
  12], c:[2, 12], f:[2, 12], b:[2, 12], d:[2, 12]}, "43":{a:[2, 13], e:[2, 13], c:[2, 13], f:[2, 13], b:[2, 13], d:[2, 13]}, "44":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "45":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "46":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, 
  undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "47":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "48":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "49":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], 
  y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "50":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "51":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "52":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 
  17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "53":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "54":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "55":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 
  18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "56":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "57":{a:[2, 1], d:[2, 1], b:[1, undefined, 1], c:[1, undefined, 2], f:[1, undefined, 3]}, "58":{ac:[1, undefined, 9]}, "59":{a:[2, 5], e:[2, 5], c:[2, 5], f:[2, 5], b:[2, 5], d:[2, 5]}, "60":{h:[2, 56], g:[2, 56], k:[2, 56], l:[2, 56], m:[2, 56], n:[2, 56], o:[2, 56], p:[2, 56], q:[2, 
  56], r:[2, 56], s:[2, 56], t:[2, 56], u:[2, 56], v:[2, 56], w:[2, 56], ad:[2, 56], ae:[2, 56], ab:[1, undefined, 85]}, "61":{h:[2, 15], g:[1, undefined, 86]}, "62":{h:[2, 18], g:[2, 18]}, "63":{h:[2, 19], g:[2, 19]}, "64":{h:[2, 16]}, "65":{h:[2, 48], g:[1, undefined, 87]}, "66":{h:[2, 50], g:[2, 50]}, "67":{h:[2, 55], g:[2, 55], ad:[2, 55], ae:[2, 55], k:[2, 55], l:[2, 55], m:[2, 55], n:[2, 55], o:[2, 55], p:[2, 55], q:[2, 55], r:[2, 55], s:[2, 55], t:[2, 55], u:[2, 55], v:[2, 55], w:[2, 55], 
  j:[2, 55], af:[2, 55]}, "68":{h:[2, 53], g:[2, 53], ad:[2, 53], ae:[2, 53], k:[2, 53], l:[2, 53], m:[2, 53], n:[2, 53], o:[2, 53], p:[2, 53], q:[2, 53], r:[2, 53], s:[2, 53], t:[2, 53], u:[2, 53], v:[2, 53], w:[2, 53], j:[2, 53], af:[2, 53]}, "69":{af:[1, undefined, 88]}, "70":{h:[2, 47], k:[2, 47], l:[2, 47], m:[2, 47], n:[2, 47], o:[2, 47], p:[2, 47], q:[2, 47], r:[2, 47], s:[2, 47], t:[2, 47], u:[2, 47], v:[2, 47], w:[2, 47], j:[2, 47], g:[2, 47], af:[2, 47]}, "71":{h:[2, 22], k:[2, 22], j:[2, 
  22], g:[2, 22], af:[2, 22], l:[1, undefined, 45]}, "72":{h:[2, 24], k:[2, 24], l:[2, 24], j:[2, 24], g:[2, 24], af:[2, 24], m:[1, undefined, 46], n:[1, undefined, 47]}, "73":{h:[2, 26], k:[2, 26], l:[2, 26], m:[2, 26], n:[2, 26], j:[2, 26], g:[2, 26], af:[2, 26], o:[1, undefined, 48], p:[1, undefined, 49], q:[1, undefined, 50], r:[1, undefined, 51]}, "74":{h:[2, 27], k:[2, 27], l:[2, 27], m:[2, 27], n:[2, 27], j:[2, 27], g:[2, 27], af:[2, 27], o:[1, undefined, 48], p:[1, undefined, 49], q:[1, undefined, 
  50], r:[1, undefined, 51]}, "75":{h:[2, 32], k:[2, 32], l:[2, 32], m:[2, 32], n:[2, 32], o:[2, 32], p:[2, 32], q:[2, 32], r:[2, 32], j:[2, 32], g:[2, 32], af:[2, 32], s:[1, undefined, 52], t:[1, undefined, 53]}, "76":{h:[2, 31], k:[2, 31], l:[2, 31], m:[2, 31], n:[2, 31], o:[2, 31], p:[2, 31], q:[2, 31], r:[2, 31], j:[2, 31], g:[2, 31], af:[2, 31], s:[1, undefined, 52], t:[1, undefined, 53]}, "77":{h:[2, 30], k:[2, 30], l:[2, 30], m:[2, 30], n:[2, 30], o:[2, 30], p:[2, 30], q:[2, 30], r:[2, 30], 
  j:[2, 30], g:[2, 30], af:[2, 30], s:[1, undefined, 52], t:[1, undefined, 53]}, "78":{h:[2, 29], k:[2, 29], l:[2, 29], m:[2, 29], n:[2, 29], o:[2, 29], p:[2, 29], q:[2, 29], r:[2, 29], j:[2, 29], g:[2, 29], af:[2, 29], s:[1, undefined, 52], t:[1, undefined, 53]}, "79":{h:[2, 34], k:[2, 34], l:[2, 34], m:[2, 34], n:[2, 34], o:[2, 34], p:[2, 34], q:[2, 34], r:[2, 34], s:[2, 34], t:[2, 34], j:[2, 34], g:[2, 34], af:[2, 34], u:[1, undefined, 54], v:[1, undefined, 55], w:[1, undefined, 56]}, "80":{h:[2, 
  35], k:[2, 35], l:[2, 35], m:[2, 35], n:[2, 35], o:[2, 35], p:[2, 35], q:[2, 35], r:[2, 35], s:[2, 35], t:[2, 35], j:[2, 35], g:[2, 35], af:[2, 35], u:[1, undefined, 54], v:[1, undefined, 55], w:[1, undefined, 56]}, "81":{h:[2, 37], k:[2, 37], l:[2, 37], m:[2, 37], n:[2, 37], o:[2, 37], p:[2, 37], q:[2, 37], r:[2, 37], s:[2, 37], t:[2, 37], u:[2, 37], v:[2, 37], w:[2, 37], j:[2, 37], g:[2, 37], af:[2, 37]}, "82":{h:[2, 38], k:[2, 38], l:[2, 38], m:[2, 38], n:[2, 38], o:[2, 38], p:[2, 38], q:[2, 
  38], r:[2, 38], s:[2, 38], t:[2, 38], u:[2, 38], v:[2, 38], w:[2, 38], j:[2, 38], g:[2, 38], af:[2, 38]}, "83":{h:[2, 39], k:[2, 39], l:[2, 39], m:[2, 39], n:[2, 39], o:[2, 39], p:[2, 39], q:[2, 39], r:[2, 39], s:[2, 39], t:[2, 39], u:[2, 39], v:[2, 39], w:[2, 39], j:[2, 39], g:[2, 39], af:[2, 39]}, "84":{h:[1, undefined, 89]}, "85":{i:[1, undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 9]}, "86":{i:[1, 
  undefined, 14], t:[1, undefined, 15], x:[1, undefined, 16], y:[1, undefined, 17], z:[1, undefined, 18], aa:[1, undefined, 19], ac:[1, undefined, 60]}, "87":{ac:[1, undefined, 93]}, "88":{h:[2, 54], g:[2, 54], ad:[2, 54], ae:[2, 54], k:[2, 54], l:[2, 54], m:[2, 54], n:[2, 54], o:[2, 54], p:[2, 54], q:[2, 54], r:[2, 54], s:[2, 54], t:[2, 54], u:[2, 54], v:[2, 54], w:[2, 54], j:[2, 54], af:[2, 54]}, "89":{a:[2, 11], e:[2, 11], c:[2, 11], f:[2, 11], b:[2, 11], d:[2, 11]}, "90":{h:[2, 51], g:[2, 51]}, 
  "91":{h:[2, 17], g:[2, 17]}, "92":{h:[2, 14]}, "93":{ab:[1, undefined, 85]}, "94":{h:[2, 49], g:[2, 49]}}};
  parser.parse = function parse(input) {
    var self = this, lexer = self.lexer, state, symbol, action, table = self.table, gotos = table.gotos, tableAction = table.action, productions = self.productions, valueStack = [null], stack = [0];
    lexer.resetInput(input);
    while(1) {
      state = stack[stack.length - 1];
      if(!symbol) {
        symbol = lexer.lex()
      }
      if(!symbol) {
        S.log("it is not a valid input: " + input, "error");
        return false
      }
      action = tableAction[state] && tableAction[state][symbol];
      if(!action) {
        var expected = [], error;
        if(tableAction[state]) {
          for(var symbolForState in tableAction[state]) {
            expected.push(self.lexer.mapReverseSymbol(symbolForState))
          }
        }
        error = "Syntax error at line " + lexer.lineNumber + ":\n" + lexer.showDebugInfo() + "\n" + "expect " + expected.join(", ");
        S.error(error);
        return false
      }
      switch(action[GrammarConst.TYPE_INDEX]) {
        case GrammarConst.SHIFT_TYPE:
          stack.push(symbol);
          valueStack.push(lexer.text);
          stack.push(action[GrammarConst.TO_INDEX]);
          symbol = null;
          break;
        case GrammarConst.REDUCE_TYPE:
          var production = productions[action[GrammarConst.PRODUCTION_INDEX]], reducedSymbol = production.symbol || production[0], reducedAction = production.action || production[2], reducedRhs = production.rhs || production[1], len = reducedRhs.length, i = 0, ret, $$ = valueStack[valueStack.length - len];
          ret = undefined;
          self.$$ = $$;
          for(;i < len;i++) {
            self["$" + (len - i)] = valueStack[valueStack.length - 1 - i]
          }
          if(reducedAction) {
            ret = reducedAction.call(self)
          }
          if(ret !== undefined) {
            $$ = ret
          }else {
            $$ = self.$$
          }
          if(len) {
            stack = stack.slice(0, -1 * len * 2);
            valueStack = valueStack.slice(0, -1 * len)
          }
          stack.push(reducedSymbol);
          valueStack.push($$);
          var newState = gotos[stack[stack.length - 2]][stack[stack.length - 1]];
          stack.push(newState);
          break;
        case GrammarConst.ACCEPT_TYPE:
          return $$
      }
    }
    return undefined
  };
  return parser
});
KISSY.add("xtemplate/compiler/ast", [], function(S) {
  var ast = {};
  ast.ProgramNode = function(lineNumber, statements, inverse) {
    var self = this;
    self.lineNumber = lineNumber;
    self.statements = statements;
    self.inverse = inverse
  };
  ast.ProgramNode.prototype.type = "program";
  ast.BlockNode = function(lineNumber, tpl, program, close) {
    var closeParts = close.parts, self = this, e;
    if(!S.equals(tpl.path.parts, closeParts)) {
      e = "Syntax error at line " + lineNumber + ":\n" + "expect {{/" + tpl.path.parts + "}} not {{/" + closeParts + "}}";
      S.error(e)
    }
    self.lineNumber = lineNumber;
    self.tpl = tpl;
    self.program = program
  };
  ast.BlockNode.prototype.type = "block";
  ast.TplNode = function(lineNumber, path, params, hash) {
    var self = this;
    self.lineNumber = lineNumber;
    self.path = path;
    self.params = params;
    self.hash = hash;
    self.escaped = true;
    self.isInverted = false
  };
  ast.TplNode.prototype.type = "tpl";
  ast.TplExpressionNode = function(lineNumber, expression) {
    var self = this;
    self.lineNumber = lineNumber;
    self.expression = expression;
    self.escaped = true
  };
  ast.TplExpressionNode.prototype.type = "tplExpression";
  ast.ContentNode = function(lineNumber, value) {
    var self = this;
    self.lineNumber = lineNumber;
    self.value = value
  };
  ast.ContentNode.prototype.type = "content";
  ast.UnaryExpression = function(unaryType, v) {
    this.value = v;
    this.unaryType = unaryType
  };
  ast.UnaryExpression.prototype.type = "unaryExpression";
  ast.MultiplicativeExpression = function(op1, opType, op2) {
    var self = this;
    self.op1 = op1;
    self.opType = opType;
    self.op2 = op2
  };
  ast.MultiplicativeExpression.prototype.type = "multiplicativeExpression";
  ast.AdditiveExpression = function(op1, opType, op2) {
    var self = this;
    self.op1 = op1;
    self.opType = opType;
    self.op2 = op2
  };
  ast.AdditiveExpression.prototype.type = "additiveExpression";
  ast.RelationalExpression = function(op1, opType, op2) {
    var self = this;
    self.op1 = op1;
    self.opType = opType;
    self.op2 = op2
  };
  ast.RelationalExpression.prototype.type = "relationalExpression";
  ast.EqualityExpression = function(op1, opType, op2) {
    var self = this;
    self.op1 = op1;
    self.opType = opType;
    self.op2 = op2
  };
  ast.EqualityExpression.prototype.type = "equalityExpression";
  ast.ConditionalAndExpression = function(op1, op2) {
    var self = this;
    self.op1 = op1;
    self.op2 = op2
  };
  ast.ConditionalAndExpression.prototype.type = "conditionalAndExpression";
  ast.ConditionalOrExpression = function(op1, op2) {
    var self = this;
    self.op1 = op1;
    self.op2 = op2
  };
  ast.ConditionalOrExpression.prototype.type = "conditionalOrExpression";
  ast.StringNode = function(lineNumber, value) {
    var self = this;
    self.lineNumber = lineNumber;
    self.value = value
  };
  ast.StringNode.prototype.type = "string";
  ast.NumberNode = function(lineNumber, value) {
    var self = this;
    self.lineNumber = lineNumber;
    self.value = value
  };
  ast.NumberNode.prototype.type = "number";
  ast.BooleanNode = function(lineNumber, value) {
    var self = this;
    self.lineNumber = lineNumber;
    self.value = value
  };
  ast.BooleanNode.prototype.type = "boolean";
  ast.HashNode = function(lineNumber, raw) {
    var self = this, value = {};
    self.lineNumber = lineNumber;
    S.each(raw, function(r) {
      value[r[0]] = r[1]
    });
    self.value = value
  };
  ast.HashNode.prototype.type = "hash";
  ast.IdNode = function(lineNumber, raw) {
    var self = this, parts = [], depth = 0;
    self.lineNumber = lineNumber;
    S.each(raw, function(p) {
      if(p === "..") {
        depth++
      }else {
        parts.push(p)
      }
    });
    self.parts = parts;
    self.string = parts.join(".");
    self.depth = depth
  };
  ast.IdNode.prototype.type = "id";
  return ast
});
KISSY.add("xtemplate/compiler", ["xtemplate/runtime", "./compiler/parser", "./compiler/ast"], function(S, require) {
  var XTemplateRuntime = require("xtemplate/runtime");
  var parser = require("./compiler/parser");
  parser.yy = require("./compiler/ast");
  var doubleReg = /\\*"/g, singleReg = /\\*'/g, arrayPush = [].push, variableId = 0, xtemplateId = 0;
  function guid(str) {
    return str + variableId++
  }
  function escapeString(str, isCode) {
    if(isCode) {
      str = escapeSingleQuoteInCodeString(str, false)
    }else {
      str = str.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
    }
    str = str.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
    return str
  }
  function escapeSingleQuoteInCodeString(str, isDouble) {
    return str.replace(isDouble ? doubleReg : singleReg, function(m) {
      if(m.length % 2) {
        m = "\\" + m
      }
      return m
    })
  }
  function pushToArray(to, from) {
    arrayPush.apply(to, from)
  }
  function lastOfArray(arr) {
    return arr[arr.length - 1]
  }
  var gen = {genFunction:function(statements, global) {
    var source = [];
    if(!global) {
      source.push("function(scope) {")
    }
    source.push('var buffer = ""' + (global ? "," : ";"));
    if(global) {
      source.push("config = this.config," + "engine = this," + "moduleWrap, " + "utils = config.utils;");
      source.push('if (typeof module !== "undefined" && module.kissy) {' + "moduleWrap = module;" + "}");
      var natives = "", c, utils = XTemplateRuntime.utils;
      for(c in utils) {
        natives += c + "Util = utils." + c + ","
      }
      if(natives) {
        source.push("var " + natives.slice(0, natives.length - 1) + ";")
      }
    }
    if(statements) {
      for(var i = 0, len = statements.length;i < len;i++) {
        pushToArray(source, this[statements[i].type](statements[i]))
      }
    }
    source.push("return buffer;");
    if(!global) {
      source.push("}");
      return source
    }else {
      return{params:["scope", "S", "undefined"], source:source}
    }
  }, genIdOrInlineCommand:function(idNode, tplNode) {
    var source = [], depth = idNode.depth, configName, idParts = idNode.parts, idName = guid("id"), self = this;
    if(depth === 0) {
      var configNameCode = tplNode && self.genConfig(tplNode);
      if(configNameCode) {
        configName = configNameCode[0];
        pushToArray(source, configNameCode[1])
      }
    }
    var idString = self.getIdStringFromIdParts(source, idParts);
    if(depth || S.startsWith(idString, "this.")) {
      source.push("var " + idName + " = getPropertyUtil(engine,scope" + ',"' + idString + '",' + depth + "," + idNode.lineNumber + ");")
    }else {
      if(configName) {
        if(idString === "include") {
          source.push("if(moduleWrap) {re" + 'quire("' + tplNode.params[0].value + '");' + configName + ".params[0] = moduleWrap.resolveByName(" + configName + ".params[0]);" + "}")
        }
        source.push("var " + idName + " = runInlineCommandUtil(engine,scope," + configName + ',"' + idString + '",' + idNode.lineNumber + ");")
      }else {
        source.push("var " + idName + " = getPropertyOrRunCommandUtil(engine,scope," + (configName || "{}") + ',"' + idString + '",' + depth + "," + idNode.lineNumber + ");")
      }
    }
    return[idName, source]
  }, genOpExpression:function(e, type) {
    var source = [], name1, name2, code1 = this[e.op1.type](e.op1), code2 = this[e.op2.type](e.op2);
    name1 = code1[0];
    name2 = code2[0];
    if(name1 && name2) {
      pushToArray(source, code1[1]);
      pushToArray(source, code2[1]);
      source.push(name1 + type + name2);
      return["", source]
    }
    if(!name1 && !name2) {
      pushToArray(source, code1[1].slice(0, -1));
      pushToArray(source, code2[1].slice(0, -1));
      source.push("(" + lastOfArray(code1[1]) + ")" + type + "(" + lastOfArray(code2[1]) + ")");
      return["", source]
    }
    if(name1 && !name2) {
      pushToArray(source, code1[1]);
      pushToArray(source, code2[1].slice(0, -1));
      source.push(name1 + type + "(" + lastOfArray(code2[1]) + ")");
      return["", source]
    }
    if(!name1 && name2) {
      pushToArray(source, code1[1].slice(0, -1));
      pushToArray(source, code2[1]);
      source.push("(" + lastOfArray(code1[1]) + ")" + type + name2);
      return["", source]
    }
    return undefined
  }, genConfig:function(tplNode) {
    var source = [], configName, params, hash, self = this;
    if(tplNode) {
      params = tplNode.params;
      hash = tplNode.hash;
      if(params || hash) {
        configName = guid("config");
        source.push("var " + configName + " = {};")
      }
      if(params) {
        var paramsName = guid("params");
        source.push("var " + paramsName + " = [];");
        S.each(params, function(param) {
          var nextIdNameCode = self[param.type](param);
          if(nextIdNameCode[0]) {
            pushToArray(source, nextIdNameCode[1]);
            source.push(paramsName + ".push(" + nextIdNameCode[0] + ");")
          }else {
            pushToArray(source, nextIdNameCode[1].slice(0, -1));
            source.push(paramsName + ".push(" + lastOfArray(nextIdNameCode[1]) + ");")
          }
        });
        source.push(configName + ".params=" + paramsName + ";")
      }
      if(hash) {
        var hashName = guid("hash");
        source.push("var " + hashName + " = {};");
        S.each(hash.value, function(v, key) {
          var nextIdNameCode = self[v.type](v);
          if(nextIdNameCode[0]) {
            pushToArray(source, nextIdNameCode[1]);
            source.push(hashName + '["' + key + '"] = ' + nextIdNameCode[0] + ";")
          }else {
            pushToArray(source, nextIdNameCode[1].slice(0, -1));
            source.push(hashName + '["' + key + '"] = ' + lastOfArray(nextIdNameCode[1]) + ";")
          }
        });
        source.push(configName + ".hash=" + hashName + ";")
      }
    }
    return[configName, source]
  }, conditionalOrExpression:function(e) {
    return this.genOpExpression(e, "||")
  }, conditionalAndExpression:function(e) {
    return this.genOpExpression(e, "&&")
  }, relationalExpression:function(e) {
    return this.genOpExpression(e, e.opType)
  }, equalityExpression:function(e) {
    return this.genOpExpression(e, e.opType)
  }, additiveExpression:function(e) {
    return this.genOpExpression(e, e.opType)
  }, multiplicativeExpression:function(e) {
    return this.genOpExpression(e, e.opType)
  }, unaryExpression:function(e) {
    var source = [], name, unaryType = e.unaryType, code = this[e.value.type](e.value);
    arrayPush.apply(source, code[1]);
    if(name = code[0]) {
      source.push(name + "=" + unaryType + name + ";")
    }else {
      source[source.length - 1] = "" + unaryType + lastOfArray(source)
    }
    return[name, source]
  }, string:function(e) {
    return["", ["'" + escapeString(e.value, true) + "'"]]
  }, number:function(e) {
    return["", [e.value]]
  }, "boolean":function(e) {
    return["", [e.value]]
  }, id:function(idNode) {
    var source = [], depth = idNode.depth, idParts = idNode.parts, idName = guid("id"), self = this;
    var idString = self.getIdStringFromIdParts(source, idParts);
    source.push("var " + idName + " = getPropertyUtil(engine,scope" + ',"' + idString + '",' + depth + "," + idNode.lineNumber + ");");
    return[idName, source]
  }, block:function(block) {
    var programNode = block.program, source = [], self = this, tplNode = block.tpl, configNameCode = self.genConfig(tplNode), configName = configNameCode[0], tplPath = tplNode.path, pathString = tplPath.string, inverseFn;
    pushToArray(source, configNameCode[1]);
    if(!configName) {
      configName = S.guid("config");
      source.push("var " + configName + " = {};")
    }
    source.push(configName + ".fn=" + self.genFunction(programNode.statements).join("\n") + ";");
    if(programNode.inverse) {
      inverseFn = self.genFunction(programNode.inverse).join("\n");
      source.push(configName + ".inverse=" + inverseFn + ";")
    }
    if(tplNode.isInverted) {
      var tmp = guid("inverse");
      source.push("var " + tmp + "=" + configName + ".fn;");
      source.push(configName + ".fn = " + configName + ".inverse;");
      source.push(configName + ".inverse = " + tmp + ";")
    }
    if(!tplNode.hash && !tplNode.params) {
      var parts = tplPath.parts;
      for(var i = 0;i < parts.length;i++) {
        if(typeof parts[i] !== "string") {
          pathString = self.getIdStringFromIdParts(source, parts);
          break
        }
      }
    }
    source.push("buffer += runBlockCommandUtil(engine, scope, " + configName + ", " + '"' + pathString + '", ' + tplPath.lineNumber + ");");
    return source
  }, content:function(contentNode) {
    return["buffer += '" + escapeString(contentNode.value, false) + "';"]
  }, tpl:function(tplNode) {
    var source = [], genIdOrInlineCommandCode = this.genIdOrInlineCommand(tplNode.path, tplNode);
    pushToArray(source, genIdOrInlineCommandCode[1]);
    source.push("buffer += renderOutputUtil(" + genIdOrInlineCommandCode[0] + "," + tplNode.escaped + ");");
    return source
  }, tplExpression:function(e) {
    var source = [], escaped = e.escaped, code, expression = e.expression, type = e.expression.type, expressionOrVariable;
    if(type === "id") {
      code = this.genIdOrInlineCommand(expression)
    }else {
      code = this[type](expression)
    }
    if(code[0]) {
      pushToArray(source, code[1]);
      expressionOrVariable = code[0]
    }else {
      pushToArray(source, code[1].slice(0, -1));
      expressionOrVariable = lastOfArray(code[1])
    }
    source.push("buffer += renderOutputUtil(" + expressionOrVariable + "," + escaped + ");");
    return source
  }, getIdStringFromIdParts:function(source, idParts) {
    var idString = "", self = this, i, idPart, idPartType, nextIdNameCode, first = true;
    for(i = 0;i < idParts.length;i++) {
      idPart = idParts[i];
      idPartType = idPart.type;
      if(!first) {
        idString += "."
      }
      if(idPartType) {
        nextIdNameCode = self[idPartType](idPart);
        if(nextIdNameCode[0]) {
          pushToArray(source, nextIdNameCode[1]);
          idString += '"+' + nextIdNameCode[0] + '+"';
          first = true
        }
      }else {
        idString += idPart;
        first = false
      }
    }
    return idString
  }};
  var compiler;
  compiler = {parse:function(tpl) {
    return parser.parse(tpl)
  }, compileToStr:function(tpl) {
    var func = this.compile(tpl);
    return"function(" + func.params.join(",") + "){\n" + func.source.join("\n") + "}"
  }, compile:function(tpl) {
    var root = this.parse(tpl);
    variableId = 0;
    return gen.genFunction(root.statements, true)
  }, compileToFn:function(tpl, config) {
    var code = compiler.compile(tpl);
    config = config || {};
    var sourceURL = "sourceURL=" + (config.name ? config.name : "xtemplate" + xtemplateId++) + ".js";
    return Function.apply(null, [].concat(code.params).concat(code.source.join("\n") + "\n//@ " + sourceURL + "\n//# " + sourceURL))
  }};
  return compiler
});

