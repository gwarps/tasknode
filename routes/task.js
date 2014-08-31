var express = require('express');
var router = express.Router();

router.get('/task', function(req, res) {
   res.render('task');
});


module.exports = router;

