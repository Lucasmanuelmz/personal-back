const express = require('express');
const app = express();
require('dotenv').config()
const path = require('path');
const articleRouter = require('./routers/articleRouter');
const categoryRouter = require('./routers/categoryRouter');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const auth = require('./auth');
const authorRoutes = require('./routers/authorRouter');
require('./config/passport');
const protectErrorsLog = require('./middlewares/privateError')
const helmet = require('helmet');
const compression = require('compression');
const currentUser = require('./middlewares/currentUser');
const passwordRouter = require('./passwordRouter/index');

app.use(compression());
app.use(helmet());
app.use(cors(
  {
    origin: 'https://api.devlucas.icu',
    optionsSuccessStatus: 200 
  }
));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(protectErrorsLog());

app.get('/', (req, res) => {
  res.status(200).json({
    articles: {
      get: {
        description: 'Obtém todos os artigos',
        method: 'GET',
        endpoint: '/articles',
        example: 'curl -X GET https://api.devlucas.icu/articles'
      },
      post: {
        description: 'Cria um novo artigo',
        method: 'POST',
        endpoint: '/articles',
        example: 'curl -X POST https://api.devlucas.icu/articles -H "Content-Type: application/json" -d \'{"title": "Novo Artigo", "content": "Conteúdo do artigo"}\''
      },
      getId: {
        description: 'Obtém um artigo pelo ID',
        method: 'GET',
        endpoint: '/articles/:id',
        example: 'curl -X GET https://api.devlucas.icu/articles/1'
      },
      getSlug: {
        description: 'Obtém um artigo pelo slug',
        method: 'GET',
        endpoint: '/articles/slug/:slug',
        example: 'curl -X GET https://api.devlucas.icu/articles/slug/exemplo-de-slug'
      },
      put: {
        description: 'Atualiza um artigo',
        method: 'PUT',
        endpoint: '/articles/:id',
        example: 'curl -X PUT https://api.devlucas.icu/articles/1 -H "Content-Type: application/json" -d \'{"title": "Artigo Atualizado"}\''
      },
      delete: {
        description: 'Apaga um artigo',
        method: 'DELETE',
        endpoint: '/articles/:id',
        example: 'curl -X DELETE https://api.devlucas.icu/articles/1'
      }
    },
    categories: {
      get: {
        description: 'Obtém todas as categorias',
        method: 'GET',
        endpoint: '/categories',
        example: 'curl -X GET https://api.devlucas.icu/categories'
      },
      post: {
        description: 'Cria uma nova categoria',
        method: 'POST',
        endpoint: '/categories',
        example: 'curl -X POST https://api.devlucas.icu/categories -H "Content-Type: application/json" -d \'{"name": "Nova Categoria"}\''
      },
      getId: {
        description: 'Obtém uma categoria pelo ID',
        method: 'GET',
        endpoint: '/categories/:id',
        example: 'curl -X GET https://api.devlucas.icu/categories/1'
      },
      getSlug: {
        description: 'Obtém uma categoria pelo slug',
        method: 'GET',
        endpoint: '/categories/slug/:slug',
        example: 'curl -X GET https://api.devlucas.icu/categories/slug/exemplo-de-slug'
      },
      put: {
        description: 'Atualiza uma categoria',
        method: 'PUT',
        endpoint: '/categories/:id',
        example: 'curl -X PUT https://api.devlucas.icu/categories/1 -H "Content-Type: application/json" -d \'{"name": "Categoria Atualizada"}\''
      },
      delete: {
        description: 'Apaga uma categoria',
        method: 'DELETE',
        endpoint: '/categories/:id',
        example: 'curl -X DELETE https://api.devlucas.icu/categories/1'
      }
    },
    users: {
      get: {
        description: 'Obtém todos os usuários',
        method: 'GET',
        endpoint: '/users',
        example: 'curl -X GET https://api.devlucas.icu/users'
      },
      post: {
        description: 'Cria um novo usuário',
        method: 'POST',
        endpoint: '/users',
        example: 'curl -X POST https://api.devlucas.icu/users -H "Content-Type: application/json" -d \'{"firstname": "novousuario", "email": "email@exemplo.com"}\''
      },
      getId: {
        description: 'Obtém um usuário pelo ID',
        method: 'GET',
        endpoint: '/users/:id',
        example: 'curl -X GET https://api.devlucas.icu/users/1'
      },
      put: {
        description: 'Atualiza um usuário',
        method: 'PUT',
        endpoint: '/users/:id',
        example: 'curl -X PUT https://api.devlucas.icu/users/1 -H "Content-Type: application/json" -d \'{"firstname": "usuarioatualizado"}\''
      },
      delete: {
        description: 'Apaga um usuário',
        method: 'DELETE',
        endpoint: '/users/:id',
        example: 'curl -X DELETE https://api.devlucas.icu/users/1'
      }
    },
    authors: {
      get: {
        description: 'Obtém todos os autores',
        method: 'GET',
        endpoint: '/authors',
        example: 'curl -X GET https://api.devlucas.icu/authors'
      },
      post: {
        description: 'Cria um novo autor',
        method: 'POST',
        endpoint: '/authors',
        example: 'curl -X POST https://api.devlucas.icu/authors -H "Content-Type: application/json" -d \'{"firstname": "novoautor", "bio": "Resumo da biografia neste espaço"}\''
      },
      getId: {
        description: 'Obtém um autor pelo ID',
        method: 'GET',
        endpoint: '/authors/:id',
        example: 'curl -X GET https://api.devlucas.icu/authors/1'
      },
      put: {
        description: 'Atualiza um autor',
        method: 'PUT',
        endpoint: '/authors/:id',
        example: 'curl -X PUT https://api.devlucas.icu/authors/1 -H "Content-Type: application/json" -d \'{"firstname": "autoratualizado"}\''
      },
      delete: {
        description: 'Apaga um autor',
        method: 'DELETE',
        endpoint: '/authors/:id',
        example: 'curl -X DELETE https://api.devlucas.icu/authors/1'
      }
    },
    password: {
      forgetPassword: {
        description: 'Solicitar recuperação de senha',
        method: 'POST',
        endpoint: '/users/forgot-password',
        example: 'curl -X POST https://api.devlucas.icu/users/forgot-password -H "Content-Type: application/json" -d \'{"email": "seuemail@exemplo.com"}\''
      },
      resetPassword: {
        description: 'Recuperar senha com token',
        method: 'GET',
        endpoint: '/users/reset-password/:token',
        example: 'curl -X GET https://api.devlucas.icu/users/reset-password/${token}'
      },
      updatePassword: {
        description: 'Redefinir senha',
        method: 'POST',
        endpoint: '/users/reset-password/:token',
        example: 'curl -X POST https://api.devlucas.icu/users/reset-password/${token} -H "Content-Type: application/json" -d \'{"password": "nova senha"}\''
      }
    }
  });
});
app.use('/', articleRouter);
app.use('/', categoryRouter);
app.use(currentUser)

app.get('/profile', currentUser, (req, res) => {
  const user = {
    id: req.user.id,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    username: req.user.email,
    phone: req.user.telphone,
  }
  
  res.status(200).json({success: true, user})
})
app.use('/', userRouter);
app.use('/', auth);
app.use('/', authorRoutes);
app.use('/users', passwordRouter)

app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ errors: 'Erro no banco de dados' });
});

module.exports = app;