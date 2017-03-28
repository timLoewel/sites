/**
 * Created by tim on 23/03/17.
 */
import CryptoJS from 'crypto-js';


// from parse.js
// Returns a new random alphanumeric string of the given size.
//
// Note: to simplify implementation, the result has slight modulo bias,
// because chars length of 62 doesn't divide the number of all bytes
// (256) evenly. Such bias is acceptable for most cases when the output
// length is long enough and doesn't need to be uniform.
export function randomString(size: number): string {
	if (size === 0) {
		throw new Error('Zero-length randomString is useless.');
	}
	const chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
	'abcdefghijklmnopqrstuvwxyz' +
	'0123456789');
	let objectId = '';
	const randomWords = CryptoJS.lib.WordArray.random(size);
	for (let i = 0; i < randomWords.words.length; ++i) {
		var mask = 0x000000ff;
		// words are 32 bit, shift
		for (let byteNo = 0; byteNo < 4; byteNo ++) {
			objectId += chars[((randomWords.words[i] >>> (byteNo * 8)) & mask) % chars.length];
			if (objectId.length === size) {
				return objectId;
			}
		}
	}
	return objectId;
}

// Returns a new random alphanumeric string suitable for object ID.
export function newObjectId(): string {
	return randomString(12);
}