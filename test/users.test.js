const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('API de Usuarios', () => {
  it('debería registrar un nuevo usuario', async () => {
    const response = await chai
      .request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Usuario registrado con éxito');
  });

  it('debería iniciar sesión de un usuario', async () => {
    const response = await chai
      .request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Usuario ha iniciado sesión con éxito');
  });
});