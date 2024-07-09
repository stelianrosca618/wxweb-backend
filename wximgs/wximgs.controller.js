const express = require('express');
const router = express.Router();
const wxImgsService = require('./wximgs.service');

router.post('/readImgfile', readImgfile);
router.post('/readCam1Img', cam1LatestImg);
router.post('/readWeatherData', readWeatherData);
router.post('/readWeadtheTrends', readWeadtheTrends);

module.exports = router;

function readImgfile(req, res, next) {
    wxImgsService.getYearList(req.body)
        .then(wxImg => wxImg ? res.json(wxImg) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
    // wxImgsService.readWXImgFile(req.body)
    //     .then(wxImg => wxImg ? res.json(wxImg) : res.status(400).json({ message: 'Username or password is incorrect' }))
    //     .catch(err => next(err));
}

function cam1LatestImg (req, res, next) {
    wxImgsService.latestCam1file(req.body)
        .then(wxImg => wxImg ? res.json(wxImg) : res.status(400).json({ message: 'There is not data' }))
        .catch(err => next(err));
}

function readWeatherData(req, res, next) {
    wxImgsService.readWeatherData(req.body)
    .then(wxImg => wxImg ? res.json(wxImg) : res.status(400).json({ message: 'There is not data' }))
    .catch(err => next(err));
}

function readWeadtheTrends(req, res, next) {
    wxImgsService.getWeatherTrends(req.body)
    .then(wxImg => wxImg ? res.json(wxImg) : res.status(400).json({ message: "There is not data" }))
    .catch(err => next(err));
}
