const User = require('../models/userModel');
const {getUsers, getUser, createUser} = require('../controllers/userController');

jest.mock('../models/userModel');

describe('getUsers', ()=> {
let req, res;

beforeEach(() => {
  req={},
  res={
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  },
  jest.clearAllMocks()
})

test('Return status 200 and users list', async() => {
  const mockUsers = [
    { 
      id: 1, 
      firstname: 'Manuel'
    },
    {
      id: 2,
      firstname: 'Lucas'
    },
    {
      id:3,
      firstname: 'Joaquim'
    }
  ];

  User.findAll = jest.fn().mockResolvedValue(mockUsers);

  await getUsers(req, res);

  expect(User.findAll).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({users: mockUsers})
})

test('Return status 404 where database is empty', async()=> {
  User.findAll.mockResolvedValue({});

  await getUsers(req, res);

  expect(User.findAll).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({message: 'Usuarios nao encontrados'})
})

})

describe('getUser', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 1 } }; 
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('Return status 200 and user', async () => {
    const mockUser = [
      {
        id: 1,
        firstname: 'Manuel'
      }
    ];

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    await getUser(req, res); 

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: mockUser });
  });

  test('Return status 404 when user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    await getUser(req, res);

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario nao encontrado' });
  });
});
