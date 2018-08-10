const express = require('express');
const morgan = require('morgan');

const app = express();

const blogRouter = require('./blogRouter');

app.use(morgan('cmmon'));
app.use(express.json());

app.use('blog-posts', blogRouter);

app.listen(precess.env.PORT || 8080, () => {
	console.log(`Your app is listening on port ${process.envPORT || 8080`}; )
});

