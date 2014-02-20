var express = require('express');
var app = express();
var path = require('path');
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('./lib/xtpl-engine').renderFile);

var statics='statics';
var staticsPrefix = '/' + statics;
var staticsDir = path.join(__dirname, statics);

var flexCombo = require('flex-combo');

app.use(express.favicon());
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(staticsPrefix,express['static'](staticsDir));

var comboConfig = {};
comboConfig[staticsPrefix] = statics;
var comboInst = flexCombo(__dirname, comboConfig);
app.use(comboInst);


app.use(staticsPrefix,express.directory(staticsDir));
app.use(app.router);
app.use(express.errorHandler());


app.get('/',function(req,res){
    res.send('wow');
});

app.listen(8111);