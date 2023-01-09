const errorHandler = () => (error, req, res, next) => {
  console.log('path: ', req.path);
  console.log('error: ', error);
  if (error.type === 'Redirect') {
    res.redirect('error.html');
  } else if (error.type === 'Not found') {
    res.status(404).send(error);
  } else {
    res.status(500).send(error);
  }
  next();
};

module.exports = errorHandler;
