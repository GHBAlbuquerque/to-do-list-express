const express = require('express')

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('pages/index'); //nao é o caminho relativo a pasta que estou, e sim ao path dado la no app
});

module.exports = router;