const express = require('express');
const app = express();
require('dotenv').config()
const path = require('path');
const articleRouter = require('./routers/articleRouter');
const categoryRouter = require('./routers/categoryRouter');
const PORT = process.env.PORT;
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const auth = require('./auth');

app.use(cors())
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send('Rota criada com sucessos!')
});

app.use('/articles/', categoryRouter);
app.use('/', articleRouter);
app.use('/', userRouter);
app.use('/', auth);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocorreu um erro no servidor' });
});

app.listen(PORT, () => {
  console.log('Servidor iniciado com sucessos', PORT)
})