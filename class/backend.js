const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/users', async (req, res) => {
    const user = await user.create(req.body);
        res.json(user)
});
