module.exports.error = (err, req, res, next) => {
    res.send(500).send('Someting is happend in the server');
}