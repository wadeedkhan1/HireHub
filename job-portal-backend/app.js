const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const usersRouter = require('./routes/users');
const recruitersRouter = require('./routes/recruiters');
const applicantsRouter = require('./routes/applicants');
const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const ratingsRouter = require('./routes/ratings');

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to HireHub API',
        endpoints: {
            users: '/users',
            recruiters: '/recruiters',
            applicants: '/applicants',
            jobs: '/jobs',
            applications: '/applications',
            ratings: '/ratings'
        }
    });
});

// Routes
app.use('/users', usersRouter);
app.use('/recruiters', recruitersRouter);
app.use('/applicants', applicantsRouter);
app.use('/jobs', jobsRouter);
app.use('/applications', applicationsRouter);
app.use('/ratings', ratingsRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
