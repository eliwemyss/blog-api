const express = require('express');
const router = express.Router();
const morgan = required('morgan');
const bodyParser = require('body-parser');

const {blogPosts}  = require('./models');

const jsonParser = bodyParser.json();
const app = express();

function blog() {
	return (
		'a bunch of gibberish'
	);
}


blogPosts.create('blog post number 1', blog(), 'Eli');
blogPosts.create('blog post number 2', blog(), 'John')

app.get('/blog-posts', (req, res) => {
	res.json(blogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for(let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = blogPosts.create(req.body.title, req.body.content, req.body. author);
	res.status(201).json(item);
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for(let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	if (req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post \`${req.params.id}\``);
	blogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	});
	res.status(204).end();
});

app.delete('/blog-posts/:id', (req, res) => {
	blogPosts.delete(req.params.id);
	console.log(`deleted blog post \`${req.params.id}\``);
	res.status(204).end();
});















