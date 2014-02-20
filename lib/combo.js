var S = require('./seed.js');
var fs = require('fs');

module.exports = function(cwd){
    return function (req, res, next) {
            var query = req.query, k,
                combo = '';
        
            for (k in query) {
                if (S.startsWith(k, '?')) {
                    combo = k;
                    break;
                }
            }
            
            if(!combo){
                next();
                return;
            }
        
            var codes = [],
                path = cwd + req.path;
            
            var nextQ = combo.slice(1).indexOf('?');
            if (nextQ === -1) {
                nextQ = combo.length;
            } else {
                nextQ++;
            }
            combo = combo.slice(1, nextQ);
            var files = combo.split(',');
            var f = files[0];
            S.each(files, function (f) {
                codes.push(fs.readFileSync(path + f));
            });
            if (S.endsWith(f, '.js')) {
                res.setHeader('Content-Type', 'application/x-javascript');
            } else {
                res.setHeader('Content-Type', 'text/css');
            }
            res.send(codes.join('\n'));
           
        };
};