var express = require('express');
var app = express();
var path = require('path');
var walk    = require('walk');
var files   = [];

app.use('/public', express.static('public'));
app.use('/images', express.static('public/images'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){

	// Walker options
	var walker  = walk.walk('./public/images', { followLinks: false });

	walker.on('file', function(root, stat, next) {
	    // Add this file to the list of files
	    files.push(root + '/' + stat.name);
	    next();
	});

	walker.on('end', function() {

		if (files.length > 0) {
			var item = files[Math.floor(Math.random()*files.length)];
			var item = item.slice(1,item.length);

			res.render('index', {
		       item: item
		    });
		} else {
			res.render('error');
		}
	});

});

app.get('/api/images', function(req, res) {
	// Walker options
	var walker  = walk.walk('/public/images', { followLinks: false });

	walker.on('file', function(root, stat, next) {
	    // Add this file to the list of files
	    files.push(root + '/' + stat.name);
	    next();
	});

	walker.on('end', function() {

		if (files.length > 0) {
			shuffle(files);
			var items = files.slice(0, 10);

			var data = {
				'data' : items
			};

			res.send(JSON.stringify(data));
		}
	});
});

app.get('/api/videos', function(req, res) {
	var walker  = walk.walk('/videos', { followLinks: false });

	walker.on('file', function(root, stat, next) {
		// Add this file to the list of files
		files.push(root + '/' + stat.name);
		next();
	});

	walker.on('end', function() {

		if (files.length > 0) {
			shuffle(files);
			var items = files.slice(0, 10);

			var data = {
				'data' : items
			};

			res.send(JSON.stringify(data));
		}
	});
});

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

var port = 3000;
app.listen(port);