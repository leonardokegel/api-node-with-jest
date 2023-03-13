const app = require('./app');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe("API User", () => {

    let repository;
    const container = app.get('container');

    beforeAll(async () => {
        repository = await container.getUserRepository();
    });

    beforeEach(async () => {
        await repository.clear();
    });

    afterAll(async () => {
        const client = container.getClient();
        await client.close();
    });

    // GET /users/:id
    describe("/users/:id", () => {
        describe("GET", () => {
            test("Obter detalhes de um usuário existente", async () => {
                const user = await repository.insert({
                    name: "Leonardo Kegel",
                    email: 'leo@gmail.com',
                    password: '12345'
                });

                const response = await requestWithSupertest
                    .get(`/users/${user._id}`)
                    .expect('Content-Type', /application\/json/);

                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expect.objectContaining({
                    name: 'Leonardo Kegel',
                    email: 'leo@gmail.com',
                    password: '12345'
                }));
            });

            test("Obter detalhes de um usuário não existente", async () => {
                const response = await requestWithSupertest
                    .get(`/users/640e696414665d9d44168a24`)
                    .expect('Content-Type', /application\/json/);

                expect(response.statusCode).toBe(404);
                expect(response.body).toStrictEqual(expect.objectContaining({
                    error: 'User not found',
                    statusCode: 404
                }));
            });
        });

        // DELETE /users/:id
        describe("DELETE", () => {
            test("remover um usuário existente", async () => {

                const user = await repository.insert({
                    name: "Leonardo Kegel",
                    email: 'leo@gmail.com',
                    password: '12345'
                });

                const response = await requestWithSupertest.delete(`/users/${user._id}`);
                expect(response.statusCode).toBe(204);
            });
            test("remover um usuário não existete", async () => {

                const response = await requestWithSupertest
                    .delete(`/users/640e696414665d9d44168a24`)
                    .expect('Content-Type', /application\/json/);

                expect(response.statusCode).toBe(404);
                expect(response.body).toStrictEqual(expect.objectContaining({
                    error: 'User not found',
                    statusCode: 404
                }));
            });
        });

        // PUT /users/:id
        describe("PUT", () => {  
            test("Alterar um usuário existete", async () => {

                const user = await repository.insert({
                    name: "Leozin",
                    email: 'leozin@gmail.com',
                    password: '12'
                });

                const response = await requestWithSupertest
                        .put(`/users/${user._id}`).send({
                            name: 'Leonardo Kegel',
                            email: 'leo@gmail.com',
                            password: '12345'
                        })
                        .expect('Content-Type', /application\/json/);

                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expect.objectContaining({
                    name: 'Leonardo Kegel',
                    email: 'leo@gmail.com',
                    password: '12345'
                }));
            });
            
            test("Alterar um usuário não existete", async () => {
                const response = await requestWithSupertest
                        .put(`/users/640e696414665d9d44168a24`).send({
                            name: 'Leonardo Kegel',
                            email: 'leo@gmail.com',
                            password: '12345'
                        })
                        .expect('Content-Type', /application\/json/);

                expect(response.statusCode).toBe(404);
                expect(response.body).toStrictEqual(expect.objectContaining({
                    error: 'User not found',
                    statusCode: 404
                }));
            });
        });

        describe("/users", () => {

            // GET /users
            describe("GET", () => {
                test("listar todos os usuarios", async () => {

                    await repository.insert({
                        name: "Leonardo Kegel",
                        email: 'leo@gmail.com',
                        password: '12345'
                    });

                    const response = await requestWithSupertest
                        .get('/users')
                        .expect('Content-Type', /application\/json/);

                    expect(response.statusCode).toBe(200);
                    expect(response.body.length).toBe(1);
                    expect(response.body[0]).toStrictEqual(expect.objectContaining({
                        name: 'Leonardo Kegel',
                        email: 'leo@gmail.com',
                        password: '12345'
                    }));
                });
            });

            // POST /users
            describe("POST", () => {
                test("Cadastrar um usuário", async () => {

                    const user = {
                        name: 'Leozin',
                        email: 'leozin@gmail.com',
                        password: '12'
                    }

                    const response = await requestWithSupertest
                        .post('/users').send(user)
                        .expect('Content-Type', /application\/json/);
                       
                    expect(response.statusCode).toBe(201);
                    expect(response.body).toStrictEqual(expect.objectContaining({
                        name: 'Leozin',
                        email: 'leozin@gmail.com',
                        password: '12'
                    }));

                });
            });

        });

    });

});