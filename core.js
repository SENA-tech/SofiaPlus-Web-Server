const express = require('express');
const app = express();
const cors = require('cors')

app.use(cors());

app.use(express.json())

//routes
app.use('/', require('./routes/Main'))
app.use('/users', require('./routes/Users.route'));
app.use('/data', require('./routes/Courses.route'))

app.listen(3000, () => console.log('listen & server running'))
