const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/userModel');

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

  describe('GET /users/2 - Retornar usuário com id 2', () => {
    test('Deve retornar o primeiro usuário do banco de dados e status 200', () => {
      return request(app)
      .get('/users/2')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
      })
    })
  })
});

describe('PUT /users/38 - Atualizar usuário', () => {
  test('Deve atualizar usuário e retornar status 200', () => {
    return request(app)
      .put('/users/38')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: 'Lucas',
        lastname: 'Jofrisse',
        email: 'jofrisse2@gmail.com',
        telphone: '875397902',
        id: 38
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('firstname', 'Lucas');
        expect(response.body).toHaveProperty('lastname', 'Jofrisse');
        expect(response.body).toHaveProperty('email', 'jofrisse2@gmail.com');
        expect(response.body).toHaveProperty('telphone', '875397902');
      });
  });
});

describe('DELETE /users/40 - Apagar usuário do bancode dados', ()=> {
  test('Deve apagar o usuário do banco de dados, retornar status 200 e uma mensagem de sucesso', () => {
    return request(app)
    .delete('/users/40')
    .send({id: 40})
    .set('Authorization', `Bearer ${token}`)
    .then(response => {
      expect(response.statusCode).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body).toHaveProperty('message', 'Usuário apagado com sucesso');
    })
  })
})
