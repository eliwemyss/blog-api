const express = require('express');
const router = express.Router

const {blogPosts}  = require('./models');

function blog() {
	return (
		'a bunch of gibberish'
		);
}


blogPosts.create('blog post number 1', blog(), 'Eli');
blogPosts.create('blog post number 2', blog(), 'John')