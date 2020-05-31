// Route: ~/api/users

const express = require('express');

const router = express.Router();

const UserService = require('./../services/UserService');
const User = new UserService();

// Note:
// req.params is for imbedded in URL, ex /users/:userId
// req.query is for after path; /users?name1=value1&name2=value2...
// req.body is for JSON & x-www-form-urlencoded
// req.cookies is where cookies are stored

/**
 * ~~~> Creates a new User
 * Requires objects inside body object (Parsed with middleware from JSON/form-urlencoded):
 * 	@param {string} req.body.email Email of user (Checks for uniqueness)
 * 	@param {string} req.body.password Password (at least 6 )
 * 	@param {string} req.body.name (optional for now)
 * 
 * Returns:
 * 	@returns {number} status - 201 if created, 400 if error
 * 	@returns {object} data - Created User's record data or Error information (WIP)
 */
router.post('/register', async (req, res) => {
	let {status, ...data} = await User.createUser(req.body);
	return res.status(status).json(data);
});

/**
 * ~~~> Logs into the User
 * @param {string} req.body.email 
 * @param {string} req.body.password
 * 
 * @returns {number} status - 200 Successful Login; 401 Unsuccessful; 404 Not Found
 * @returns {object} data - User Data, Error message (WIP)
 */
router.get('/login', async (req, res) => {
	let {status, ...data} = await User.login(req.query);
	return res.status(status).json(data);
});

/**
 * ~~~> Updates User's display name
 * TODO: Add Authentication
 * @param {string} req.body.email
 * @param {string} req.body.name New name for the user
 * 
 * @returns {status} 
 * @returns {object} 
 */
router.put('/name', async (req, res) => {
	console.log(req.body);

	let {status, ...data} = await User.updateName(req.body);
	res.status(status).json(data);
});

/**
 * ~~~> Deletes user
 * TODO: Add Authentication
 * @param {string} req.body.email
 * 
 * @returns {status} 
 * @returns {object} 
 */
router.delete('/delete', async (req, res) => {
	let {status, ...data} = await User.deleteUser(req.body);
	res.status(status).json(data);
});

module.exports = router;
