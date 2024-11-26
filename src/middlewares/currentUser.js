const jwt = require('jsonwebtoken');

const currentUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Necessita de autenticação' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xH%9z@Tp+7$3Yp%QtN1z&u6w#bFdH!8WkA4eVZk+LmM1');
    req.user = decoded; 
    next(); 
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    const errorMessages = {
      TokenExpiredError: 'Token está expirado',
      JsonWebTokenError: 'Token inválido'
    };
    const message = errorMessages[err.name] || 'Erro interno no servidor';
    return res.status(401).json({ error: message });
  }
};

module.exports = currentUser;

