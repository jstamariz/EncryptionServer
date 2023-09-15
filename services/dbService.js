const fs = require("fs");
const path = require("path");
const EncryptionService = require("./encryptionService");

/**
 * Service used to interact with the mock db of the project
 */
class DbService {
	constructor() {
		this._dbPath = path.join(__dirname, "../db/db.txt");
		this._encryption = new EncryptionService();
	}

	/**
	 * Gets all the data stored into the encrypted database
	 * @returns {Array<unknown>}
	 */
	getAll() {
		const fileData = fs.readFileSync(this._dbPath);
		const encryptedData = this._encryption.decrypt(fileData);
		if (!encryptedData) return [];
		return JSON.parse(encryptedData);
	}

	/**
	 * Saves a record into the database
	 * @param {Object} data
	 */
	save(data = {}) {
		const savedData = this.getAll();
		savedData.push(data);
		fs.writeFile(
			this._dbPath,
			this._encryption.encrypt(JSON.stringify(savedData)),
			(error) => {
				if (error) console.log("something happened", error);
				else console.log("saved!");
			}
		);
	}
}

module.exports = DbService;
