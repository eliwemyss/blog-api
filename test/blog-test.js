const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('blog posts', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});
	it ('should list items on GET', function() {
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body.length).to.be.at.least(1);
				const expectedKeys = [
				 'id',
				 'title',
				 'content',
				 'author',
				 'publishDate'];
				res.body.forEach(function(item) {
					expect(item).to.be.a('object');
					expect(item).to.include.keys(expectedKeys);
			});
		});
	});

	it('should add blog on POST', function() {
		const newBlog = {
			title: 'something', 
			content: 'more stuff', 
			author: 'somebody'
		};
		const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newBlog));
		return chai.request(app)
			.post('/blog-posts')
			.send(newBlog)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys(expectedKeys);
				expect(res.body.title).to.equal(newBlog.title);
				expect(res.body.content).to.equal(newBlog.content);
				expect(res.body.author).to.equal(newBlog.author);
			});
	});

	it('should error if POST missing expected values', function() {
		const badData = {};
		return chai
			.request(app)
			.post('/blog-posts')
			.send(badData)
			.then(function(res) {
				expect(res).to.have.status(400);
			});
	});

	it("should update blog posts on PUT", function() {
    	return (
      		chai
       		.request(app)
        	.get("/blog-posts")
        	.then(function(res) {
         		 const updatedPost = Object.assign(res.body[0], {
           			 title: "connect the dots",
           			 content: "la la la la la"
          		});
        return chai
            .request(app)
            .put(`/blog-posts/${res.body[0].id}`)
            .send(updatedPost)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });


	it("should delete posts on DELETE", function() {
    	return (
    	chai
        .request(app)
        .get("/blog-posts")
        .then(function(res) {
          return chai
            .request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });
});

