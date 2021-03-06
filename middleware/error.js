module.exports.error = (err, req, res, next) => {
    res.send(500).send('Something is happened in the server');
}