const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Not Found Route
router.get('*', (req, res) => {
  res.status(404).send('404 Not Found')
})

module.exports = router;
