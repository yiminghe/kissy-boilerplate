var express = require('express');
var app = express();
var path = require('path');
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('./lib/xtpl-engine').renderFile);


var flexCombo = require('flex-combo');

app.use(express.favicon());
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use('/statics',express['static'](__dirname+'/statics'));


var comboInst = flexCombo(__dirname+'/statics');
app.use('/statics',comboInst);


app.use('/statics',express.directory(__dirname + '/statics'));
app.use(app.router);
app.use(express.errorHandler());


app.get('/',function(req,res){
    res.send('wow');
});

app.listen(8111);