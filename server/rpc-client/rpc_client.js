var jayson = require('jayson');

// creat a RPC client
var client = jayson.client.http({
    port: 4040,
    hostname: 'localhost'
});

// test rpc methdod. wrap the original method
function add(a, b, callback){
    client.request('add', [a, b], function (err, error, response){
        if(err) {
            throw err;
        }
        console.log('response: ' + response);
        callback(response);
    });
}

// Get news summaries for a user
function getNewsSummariesForUser(user_id, page_num, callback) {
    client.request('getNewsSummariesForUser', [user_id, page_num], function(err, response) {
      if (err) throw err;
      console.log(response);
      callback(response.result);
    });
  }

// send user_id and news_id to Backend Server
function logNewsClickForUser(user_id, news_id, callback) {
    client.request('logNewsClickForUser', [user_id, news_id], function(err, response){
        if(err) throw err;
        console.log(response); 
    });
}



module.exports = {
    add : add,
    getNewsSummariesForUser : getNewsSummariesForUser,
    logNewsClickForUser: logNewsClickForUser
}