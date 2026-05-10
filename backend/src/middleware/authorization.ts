import { NextFunction, Request, Response } from "express";
import { ApiKey } from "../api.key/api.key.entity";
import logger from "../common/logger";
import { unauthorized } from "../common/response";
import { base64ToString } from "../common/string";
import { Database } from "../database";

const ApiKeyRepository = Database.getRepository(ApiKey)

export default async function (req: Request, res: Response, next: NextFunction) {
	logger.debug('authorization')
	const { authorization } = req.headers

	// FIX: Check if authorization header exists before splitting
	if (!authorization || typeof authorization !== 'string') {
		logger.debug('no auth header found')
		return unauthorized(res)
	}

	const parts = authorization.split(' ')
	if (parts.length < 2) {
		logger.debug('invalid auth header format')
		return unauthorized(res)
	}

	const string = parts[1]
	
	try {
		const decoded = JSON.parse(base64ToString(string))
		const { "api-key": apiKey, "api-key-user": apiKeyUser, username, token } = decoded
		
		if (!apiKey) {
			logger.debug('no apiKey found')
			return unauthorized(res)
		}

		const apiKeys = await ApiKeyRepository.findOneBy({ usedBy: apiKeyUser })
		// FIX: Use optional chaining or check if apiKeys exists before calling compareTokenSync
		if (!apiKeys || !apiKeys.compareTokenSync(apiKey)) {
			logger.debug('no api key match found')
			return unauthorized(res) // Added return to prevent double response
		}

		res.locals.username = username
		res.locals.token = token
		next()
	} catch (error) {
		logger.error('authorization parsing failed')
		return unauthorized(res)
	}
}

