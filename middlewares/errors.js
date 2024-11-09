const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: 'Erro no upload do arquivo.' });
  }
  next();
};

module.exports = handleMulterErrors;