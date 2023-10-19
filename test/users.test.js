const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Reemplaza con la ruta correcta al archivo principal de tu servidor

chai.use(chaiHttp);
const expect = chai.expect;

describe('API de Usuarios', () => {
  it('debería registrar un nuevo usuario', (done) => {
    chai.request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Usuario registrado con éxito');
        done();
      });
  });

  it('debería iniciar sesión de un usuario', (done) => {
    chai.request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Usuario ha iniciado sesión con éxito');
        done();
      });
  });
});