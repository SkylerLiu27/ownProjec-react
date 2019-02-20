var express = require('express');
var rpc_client = require('../rpc-client/rpc_client');
var router = express.Router();

/* GET news page. */
router.get('/userId/:userId/pageNum/:pageNum', function(req, res, next) {
  console.log("Fetching news...");
  user_id = req.params['userId'];
  page_num = req.params['pageNum'];

  rpc_client.getNewsSummariesForUser(user_id, page_num, function(response) {
    res.json(response);
  })
});

// handle POST request from user click, send to Backend Server using rpc Request
router.post('/userId/:userId/newsId/:newsId', function(req, res, next){
  user_id = req.params['userId'];
  news_id = req.params['newsId'];
  console.log('user_id: ' + user_id);
  console.log('news_id: ' + news_id);
  rpc_client.logNewsClickForUser(user_id, news_id);
  res.status(200);
});

module.exports = router;