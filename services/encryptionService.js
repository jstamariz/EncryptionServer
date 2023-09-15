var crypto = require("crypto");

/**
 * Service used to encrypt stuff
 */
class EncryptionService {
	constructor() {
		this.INITIAL_VECTOR_SIZE = 16;
		this._algorithm = "aes-256-ctr";
		this._encryptedKey = crypto
			.createHash("sha256")
			.update(String(process.env.ENCRYPTION_KEY))
			.digest("base64")
			.substring(0, 32);
	}

	/**
	 * Encrypts a file
	 * @param {Buffer} fileBuffer
	 * @returns
	 */
	encrypt(fileBuffer) {
		if (!fileBuffer.length) return "";
		const initVector = crypto.randomBytes(this.INITIAL_VECTOR_SIZE);
		const cipher = crypto.createCipheriv(
			this._algorithm,
			this._encryptedKey,
			initVector
		);
		return Buffer.concat([
			initVector,
			cipher.update(fileBuffer),
			cipher.final(),
		]);
	}

	/**
	 * Decrypts a previously encrypted file
	 * @param {Buffer} encryptedFileBuffer
	 * @returns
	 */
	decrypt(encryptedFileBuffer) {
		if (!encryptedFileBuffer.length) return "";
		const initialVector = encryptedFileBuffer.slice(
			0,
			this.INITIAL_VECTOR_SIZE
		);
		const restOfTheFile = encryptedFileBuffer.slice(this.INITIAL_VECTOR_SIZE);
		const decipher = crypto.createDecipheriv(
			this._algorithm,
			this._encryptedKey,
			initialVector
		);

		return Buffer.concat([decipher.update(restOfTheFile), decipher.final()]);
	}
}

module.exports = EncryptionService;
