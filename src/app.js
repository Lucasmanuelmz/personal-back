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
        description: 'Obtem todos os artigos',
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
        description: 'Obtem um artigo pelo ID',
        method: 'GET',
        endpoint: '/articles/:id',
        example: 'curl -X GET https://api.devlucas.icu/articles/1'
      },
      getSlug: {
        description: 'Obtem um artigo pelo slug',
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
        description: 'Obtem todas as categorias',
        method: 'GET',
        endpoint: '/categories',
        example: 'curl -X GET https://api.devlucas.icu/articles/categories'
      },
      post: {
        description: 'Cria uma nova categoria',
        method: 'POST',
        endpoint: '/categories',
        example: 'curl -X POST https://api.devlucas.icu/articles/categories -H "Content-Type: application/json" -d \'{"name": "Nova Categoria"}\''
      },
      getId: {
        description: 'Obtem uma categoria pelo ID',
        method: 'GET',
        endpoint: '/categories/:id',
        example: 'curl -X GET https://api.devlucas.icu/articles/categories/1'
      },
      getSlug: {
        description: 'Obtem uma categoria pelo slug',
        method: 'GET',
        endpoint: '/categories/slug/:slug',
        example: 'curl -X GET https://api.devlucas.icu/articles/categories/slug/exemplo-de-slug'
      },
      put: {
        description: 'Atualiza uma categoria',
        method: 'PUT',
        endpoint: '/categories/:id',
        example: 'curl -X PUT https://api.devlucas.icu/articles/categories/1 -H "Content-Type: application/json" -d \'{"name": "Categoria Atualizada"}\''
      },
      delete: {
        description: 'Apaga uma categoria',
        method: 'DELETE',
        endpoint: '/categories/:id',
        example: 'curl -X DELETE https://api.devlucas.icu/articles/categories/1'
      }
    },
    users: {
      get: {
        description: 'Obtem todos os usuários',
        method: 'GET',
        endpoint: '/users',
        example: 'curl -X GET hhttps://api.devlucas.icu/users'
      },
      post: {
        description: 'Cria um novo usuário',
        method: 'POST',
        endpoint: '/users',
        example: 'curl -X POST https://api.devlucas.icu/users -H "Content-Type: application/json" -d \'{"firstname": "novousuario", "email": "email@exemplo.com"}\''
      },
      getId: {
        description: 'Obtem um usuário pelo ID',
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
        description: 'Obtem todos os autores',
        method: 'GET',
        endpoint: '/authors',
        example: 'curl -X GET https://api.devlucas.icu/authors'
      },
      post: {
        description: 'Cria um novo autor',
        method: 'POST',
        endpoint: '/authors',
        example: 'curl -X POST https://api.devlucas.icu/authors -H "Content-Type: application/json" -d \'{"firstname": "novoautor", "bio": "Resumo da biografia neste espaco"}\''
      },
      getId: {
        description: 'Obtem um autor pelo ID',
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
        description: 'Apaga um author',
        method: 'DELETE',
        endpoint: '/users/:id',
        example: 'curl -X DELETE https://api.devlucas.icu/authors/1',
      }
    }
  });
});

app.use('/articles/', categoryRouter);
app.use('/', articleRouter);
app.use('/', userRouter);
app.use('/', auth);
app.use('/', authorRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ errors: 'Erro no banco de dados' });
});

module.exports = app;