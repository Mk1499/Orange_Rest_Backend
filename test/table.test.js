const app = require('../app'); 
const request = require('supertest')(app); 
const should = require('should');


var lastTableID;

describe('View All Table (Only Admin can View all Tables)', () => {
    it("should require authentication",(done)=>{
        request
        .get('/tables')
        .expect(401)
        .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('error','Un Authenticated Request');
            done();
        });
    })
    
    let authClient = {};
    before(loginClient(authClient));

    it('Client cannot show Tables', function(done) {
        request
            .get('/tables')
            .set('Authorization', 'bearer ' + authClient.token)
            .expect(401)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('error','Un Authorized Request');
                done();
            });
    });
   
    let authAdmin = {};
    before(loginAdmin(authAdmin));
    it('Admin can view all Tables', function(done) {
        request
            .get('/tables')
            .set('Authorization', 'bearer ' + authAdmin.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                lastTableID = res.body[res.body.length - 1 ].id; 
                done();
            });
    });
     
})

describe('Add Table (only admin can add table)', () => {
    it("should require authentication",(done)=>{
        request
        .post('/tables')
        .expect(401)
        .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('error','Un Authenticated Request');
            done();
        });
    })
    
    let authClient = {};
    before(loginClient(authClient));

    it("Client cannot show Tables",(done)=>{
        request
        .post('/tables')
        .set('Authorization', 'bearer ' + authClient.token)
        .expect(401)
        .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('error','Un Authorized Request');
            done();
        });
    })

    let authAdmin = {};
    before(loginAdmin(authAdmin));

    it('Admin cannot add Table without attributes (body) ', function(done) {
        request
            .post('/tables')
            .set('Authorization', 'bearer ' + authAdmin.token)
            .expect(500)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Admin can add Table', function(done) {
        request
            .post('/tables')
            .set('Authorization', 'bearer ' + authAdmin.token)
            .send({
                "label": "large 1" ,
                "max_persons": 10
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    
   
})


describe('Delete Table (only admin can delete table)', () => {
    it("should require authentication",(done)=>{
        request
        .delete('/tables/16')
        .expect(401)
        .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('error','Un Authenticated Request');
            done();
        });
    })
    
    let authClient = {};
    before(loginClient(authClient));

    it("Client cannot delete Tables",(done)=>{
        request
        .delete('/tables/16')
        .set('Authorization', 'bearer ' + authClient.token)
        .expect(401)
        .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('error','Un Authorized Request');
            done();
        });
    })

    let authAdmin = {};
    before(loginAdmin(authAdmin));

    it('Admin can delete Table', function(done) {
        request
            .delete('/tables/'+lastTableID)
            .set('Authorization', 'bearer ' + authAdmin.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Admin try to delete Table with invalid ID', function(done) {
        request
            .delete('/tables/16')
            .set('Authorization', 'bearer ' + authAdmin.token)
            .expect(404)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('message','Not found Table with id 16.');
                done();
            });
    });
    
   
})

describe('View all the currently available tables (client and admin can use it ) ', () => {
    it("should require authentication",(done)=>{
        request
        .get('/tables/available')
        .expect(401)
        .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('error','Un Authenticated Request');
            done();
        });
    })
    
    let authClient = {};
    before(loginClient(authClient));

    it('Client can show current availbale Tables', function(done) {
        request
            .get('/tables/available')
            .set('Authorization', 'bearer ' + authClient.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });
   
    let authAdmin = {};
    before(loginAdmin(authAdmin));
    it('Admin can show current availble Tables', function(done) {
        request
            .get('/tables/available')
            .set('Authorization', 'bearer ' + authAdmin.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });
       
})






function loginAdmin(auth) {
    return function(done) {
        request
            .post('/users/login')
            .send({
                email: 'admin@mail.com',
                password: 'admin123'
            })
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
            auth.token = res.body.token;
            return done();
        }
    };
}

function loginClient(auth) {
    return function(done) {
        request
            .post('/users/login')
            .send({
                email: 'Khaled@mail.com',
                password: 'Khaled123'
            })
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
            auth.token = res.body.token;
            return done();
        }
    };
}