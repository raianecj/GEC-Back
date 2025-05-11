const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token)
    return res.status(401).json({ mensagem: 'Token não fornecido' });

  const tokenLimpo = token.startsWith('Bearer ')
    ? token.slice(7)
    : token;

  jwt.verify(tokenLimpo, process.env.JWT_SECRET || 'seu_segredo', (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }

    if (decoded.tipo !== 'usuario') {
      return res.status(403).json({ mensagem: 'Acesso negado para tipo de usuário' });
    }

    req.usuario = decoded;
    next();
  });
};

const verificarTokenAdmin = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token)
    return res.status(401).json({ mensagem: 'Token não fornecido' });

  const tokenLimpo = token.startsWith('Bearer ')
    ? token.slice(7)
    : token;

  jwt.verify(tokenLimpo, process.env.JWT_SECRET || 'seu_segredo_admin', (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }

    if (decoded.tipo !== 'admin') {
      return res.status(403).json({ mensagem: 'Acesso permitido apenas para administradores' });
    }

    req.usuario = decoded;
    next();
  });
};

module.exports = { verificarToken, verificarTokenAdmin };
