const UserModel = require('../models/UserModel');
const PreferenceModel = require('../models/PreferenceModel');

class NewsService {
	async createNewPreference({ type='', subtypes=[] } = {}) {
		try {
			let data = await PreferenceModel.create({ type, subtypes });
			return { 'status': 201, data };
		} catch (err) {
			console.log(`Error '${err.name}' while Creating Preference:\n`, err);
			if (err.name === 'MongoError') {
				return { 'status': 400, 'Error': 'Preference is already registered' };
			} else if (err.name === 'ValidationError') {
				return { 'status': 400, 'Error': 'Empty Type/Subtypes' };
			} else {
				console.log('WARNING: UNKNOWN ERROR');
				return { 'status': 500, 'Error': 'Unknown Error' };
			}
		}
	}

	async getPreferenceOptions() {
		let preferenceList = await PreferenceModel.find({});
		if (!preferenceList) return { 'status': 200 };
		return { 'status': 200, preferenceList };
	}

	async getUserPreferences({ email='' } = {}) {
		let user = await UserModel.findOne({ email }).select({ preferences: true });
		if (!user) return { 'status' : 404 };
		return { 'status': 200, 'preferences': user.preferences };
	}

	async updateUserPreferences({ email='', preferences=[] } = {}) {
		let user = await UserModel.findOne({ email });
		if (!user) return { 'status': 404 };
		user.preferences = preferences;
		let modifiedUser = await user.save();
		console.log(modifiedUser);
		return { 'status': 200, 'message': modifiedUser };
	}
}

module.exports = NewsService;