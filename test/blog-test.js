const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServier} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('blog posts', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServier();
	});
	it ('should list items on GET', function() {
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body.length).to.be.at.least(1);
				const expectedKeys = ['id', 'title', 'content', 'author'];
				res.body.forEach(function(item) {
					expect(item).to.be.a('object');
					expect(item).to.include.keys(expectedKeys);
			});
		});
	});

	it('should add blog on POST', function() {
		const newBlog = {
			title: 'something', content: 'more stuff', author: 'somebody'
		}
		const expectedKeys = ['id', 'content'].concat(Object.keys(newBlog));
		return chai.request(app)
			.post('/blog-posts')
			.send(newBlog)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('id', 'title', 'content', 'author');
				expect(res.body.id).to.not.equal.equal(null);
				expect(res.body).to.deep.equal(
					Object.assign(newBlog, {id: res.body.id})
					);
			});
	});

	it('should update blog on PUT', function() {
		const updateBlog = {
			title: 'something',
			content: 'more stuff',
			author: 'somebody'
		};
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			updateBlog.id = res.body[0].id;

			return chai.request(app)
				.put(`/blog-posts/${updateBlog.id}`)
				.send(updateBlog)
				.then(function(res) {
					expect(res).to.have.status(204);
			});
		});
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

