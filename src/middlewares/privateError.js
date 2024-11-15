function protectErrorsLog() {
  return (err, req, res, next) => {
    res.status(err.status || 500).json({
      error: "Algo deu errado. Por favor, tente novamente mais tarde.",
    });
  };
}


module.exports=protectErrorsLog;
