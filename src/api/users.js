const express = require("express");
let router = express.Router();

// Compare form data to db for login
router.get('/test', async (req, res) => {
    // req.params is for imbedded in URL, ex /users/:userId
    // req.query is for after path; /users?name1=value1&name2=value2...
    if (req.query) {
        console.log(req.query);
        return res.status(200).json(req.query);
    }
    console.log(req.cookies);
    res.status(400).json({ "error": "Invalid query" });
});

// Creates new User
router.post('/test', async (req, res) => {
    // Checks if body is present, if not, send error
    if (req.body) {
        // re-sends processed form data as a json
        console.log(req.body);
        return res.status(202).json(req.body);
    }
    res.status(400).json({ "error": "Invalid query" });
});

// Updates User information
router.put('/:userId', async (req, res) => {
    res.send(
        `PUT HTTP method on user/${req.params.userId} resource`,
    );
});

// Deletes user information
// It's better to set a field "deleted:" instead of actually deleting the record,
// This way you can trace errors etc.
router.delete('/:userId', async (req, res) => {
    res.send(
        `DELETE HTTP method on user/${req.params.userId} resource`,
    );
});

module.exports = router;