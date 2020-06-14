// Route: ~/api/users

const express = require('express');
const router = express.Router();

const UserService = require('./../services/Users/UserService');
const User = new UserService();

// Note:
// req.params is for imbedded in URL, ex /users/:userId
// req.query is for after path; /users?name1=value1&name2=value2...
// req.body is for JSON & x-www-form-urlencoded
// req.cookies is where cookies are stored

/**
 * @route POST /api/users/register
 * ~~~> Creates a new User
 * Requires objects inside body object (Parsed with middleware from JSON/form-urlencoded):
 * 	@param {string} req.body.email Email of user (Checks for uniqueness)
 * 	@param {string} req.body.password Password (at least 6 )
 * 	@param {string} req.body.name (optional for now)
 * 
 * Returns:
 * 	@returns {number} status - 201 if created, 400 if error
 * 	@returns {object} data - New User's data 
 *  @returns {string} error - Error message 
 */
router.post('/register', async (req, res) => {
	let { status, data, error } = await User.createUser(req.body);
	return status === 201 ?
		res.status(201).json(data) :
		res.status(status).json(error);
	// TODO:
	// If 201, 
	// - Send Verification E-Mail
	// - Redirect to login page
	// Else, display message
});

/**
 * @route GET /api/users/login
 * ~~~> Logs into the User
 * @param {string} req.body.email 
 * @param {string} req.body.password
 * 
 * @returns {number} status - 200 Successful Login; 401 Unsuccessful; 404 Not Found
 * @returns {object} data - User Data, Error message (WIP)
 * @returns {object} error - Error message
 */
router.get('/login', async (req, res) => {
	// Check for valid token, if present then redirect to user page
	let { status, data, error } = await User.login(req.query);
	// If 200,
	// Create tokens & save Refresh Token to database
	// Redirect to user page
	// Else, 
	// Send status & error
	return status === 200 ?
		res.status(200).json(data) :
		res.status(status).json(error);
});

/**
 * @route PUT /api/users/name
 * ~~~> Updates User's display name
 * TODO: Add Authentication
 * @param {string} req.body.email
 * @param {string} req.body.name New name for the user
 * 
 * @returns {status} 200 if 400 if no email/name too short, 404 if user not found
 * @returns {object} 
 */
router.put('/name', async (req, res) => {
	// Check for authorization, if not, redirect to login page
	let { status, ...data } = await User.updateName(req.body);
	res.status(status).json(data);
});

/**
 * @route DELETE /api/users/delete
 * ~~~> Deletes user
 * TODO: Add Authentication
 * 
 * @param {string} req.body.email
 * 
 * @returns {status} 
 * @returns {object} 
 */
router.delete('/delete', async (req, res) => {
	// Check for authorization, if not, redirect  to login
	let { status, ...data } = await User.deleteUser(req.body);
	res.status(status).json(data);
});

module.exports = router;
