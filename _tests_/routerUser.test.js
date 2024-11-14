const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');

describe('Get/ retornar dados', () => { 

  test('Retornar dados da rota iniciar com status 200 ', () => {
   return request(app)
   .get('/')
    .then(response => {
     expect(response.statusCode).toBe(200)
    })
  })
})

describe('POST /users - criar usuário e fazer login na conta', () => {
  beforeAll(() => {
    return User.destroy({ where: { email: 'anamaria2@gmail.com' } });
  });

  test('Deve criar usuário e retornar status 201', () => {
    return User.findOne({ where: { email: 'anamaria2@gmail.com' } })
      .then((user) => {
        if (user) {
          throw new Error('Usuário já existe no banco de dados');
        }

        return request(app)
          .post('/users')
          .send({
            firstname: 'Anamaria',
            lastname: 'Miquissene',
            email: 'anamaria2@gmail.com',
            telphone: '845632657',
            password: 'Pe#21#4h67',
            repeatPassword: 'Pe#21#4h67',
            role: 'admin'
          });
      })
      .then((response) => {
        expect(response.statusCode).toBe(201);

        return User.findOne({ where: { email: 'anamaria2@gmail.com' } });
      })
      .then((createdUser) => {
        expect(createdUser).not.toBeNull();
        expect(createdUser.firstname).toBe('Anamaria');
      });
  });
  
  describe('POST /login - entrar na conta do usuário e gerar um token', () => {
    test('Deve entrar na conta do usuário, gerar um token e retornar status 200', () => {
      return request(app)
        .post('/login')
        .send({
          email: 'anamaria2@gmail.com',
          password: 'Pe#21#4h67'
        })
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tokenRegex = /^[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+$/;
          expect(response.body.token).toMatch(tokenRegex);
        });
    });
  });  
});

let token; 

describe('Autenticação e Acesso à Rota de Usuários', () => {

  beforeAll(() => {
    return request(app)
      .post('/login')
      .send({
        email: 'anamaria2@gmail.com',
        password: 'Pe#21#4h67'
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        token = response.body.token; 
        expect(token).toBeDefined();
      });
  });

  describe('GET /users - Retornar dados de usuário', () => {
    test('Deve retornar usuários e status 200', () => {
      return request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`) 
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBeDefined(); 
        });
    });
  });

  describe('GET /users/1 - Retornar usuario com id 1', () => {
    test('Deve retornar o primeiro usuario do banco de dados e status 200', () => {
      return request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
      })
    })
  })
});

