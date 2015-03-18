var spawn = require('child_process').spawn;
var mainApp = require('../../app.js');
var fs = require('fs');

var APIKeys = {
  twitter: {
    consumerKey: 'XZY3ZAyRzem613wcfFsCWqnA3',
    consumerSecret: '03CGds3Q0GCMSSLp3BjVo1zGEe0BS3zoabmh1NFTm3MCRlPvve',
    owner: 'jjnewman10',
    ownerID: 207420538,
    accessLevel: 'Read-only'
  },
  stripe: {
    sk_live: 'sk_live_FgV3tzZsHXbpDHn1tXeNxxxx',
    p_live: 'pk_live_IDwbcPLP8Ike8ieTYrmpxxxx'
  }, 
  google: {
    GOOGLEKEY : 'AIzaSyDRhpkQmqUbkJQpW73P_JkZK5kqNOYqjps',
    G_PLACES_KEY: 'AIzaSyDRhpkQmqUbkJQpW73P_JkZK5kqNOYqjps'
  },
  ebay: {
    username: 'krich_api1.ebay.com',
    password: ''
  },
  paypal: {
    username: 'schandrasekaran-us_api1.paypal.com',
    password: '44K8KBKHSKUQE6JK8'
  },
  azure: {
    mongoDB: 'AfKnZYWmF4q.r.Qj2YUl2OFgCfgab0wCfwV2VggD6e0-@ds050077.mongolab.com:50077/deploy-shortlyDB'
  }
};

var APIRegexes = {
  twitter: /a/,
  yelp: /a/,
  stripe: /(pk|sk)_live_\w{24}/,
  google: /AIza.{35}/,
  ebay: /api1.ebay.com/,
  paypal: /us_api1.paypal.com'/
};

var removeFile = function(path, callback) {
  fs.unlink(path, function (err) {
    if (err) {
      throw err;
    }
    else {
      console.log('successfully deleted ', path);
      callback();
    }
  });
};

var removeDirectory = function(path, callback) {
  fs.readdir(path, function(err, files) {
    if(err) {
      callback(err, []);
      return;
    }
    var wait = files.length;
    var count = 0;

    var folderDone = function(err) {
      count++;
      if( count >= wait || err) {
        fs.rmdir(path, callback);
      }
    };

    // Empty directory to bail early
    if( !wait ) {
      folderDone();
      return;
    }
    
    // Remove one or more trailing slash to keep from doubling up
    path = path.replace(/\/+$/,"");
    files.forEach(function(file) {
      var curPath = path + "/" + file;
      fs.lstat(curPath, function(err, stats) {
        if( err ) {
          callback(err, []);
          return;
        }
        if( stats.isDirectory() ) {
          removeDirectory(curPath, folderDone);
        } else {
          fs.unlink(curPath, folderDone);
        }
      });
    });
  });
};

var processFile = function(text) {
  console.log("processFile:" + text);
    var stripeRegex = APIRegexes['stripe'];
    var googleRegex = APIRegexes['google'];

    var stripeHit = stripeRegex.exec(text); //note exec method returns the whole input string
    var googleHit = googleRegex.exec(text);


    if ( googleHit ) {
      var googleAPIData = {};
      organizeHitData(googleAPIData); //store regex used, service name, matched text, index
      storeHitData(googleAPIData);
    }

  else { //remove file from DB
    removeFile('/Users/marcbalaban/Desktop/Code/GitSecure/concatenatedDirectory.txt', function() {
       console.log('successfully deleted file');
    });
    //delete directory
  }
};

var getTextFile = function(path, callback) {
  var content;
  fs.readFile(path, function (err, data) {
      if (err) {
          throw err;
      }
      content = data;
      console.log(content);   
      callback(content);        
  });
};

var getFile = function() {
  //read in concatenatedDirectoriest.txt file
  getTextFile('./concatenatedDirectory.txt', function(text) { //async file read
    processFile(text);
  });
};

var concatDirectory = function(pathName) {
  console.log("pathName:" + pathName);
  var bash = spawn('sh', [ '/Users/marcbalaban/Desktop/Code/GitSecure/services/parsing/concatDirectories.sh' ], {
    cwd: '/Users/marcbalaban/Desktop/Code/GitSecure/git_data/' + pathName,
    env: './'
  });

  bash.on('close', function(code){
    console.log(code); 
    getFile();
  });
  
};

 exports.parseFile = parseFile = function(parseQueue) {
  var path = mainApp.parseQueue.shift();
  concatDirectory(path);
};

var organizeHitData = function(obj, regex, index, match) { //decorator function for regex results
  obj.regex = regex;
  obj.index = index;
  obj.match = match;
  return obj;
};



var storeHitData = function(data) {
  //store back in MongoDB
};

var findAPIKey = function(text, regex) {

};



