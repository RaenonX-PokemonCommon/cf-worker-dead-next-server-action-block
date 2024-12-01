export interface Env {}

const deadNextServerActionHashes = new Set();

const generateBadNextServerActionResponse = () => new Response(
	JSON.stringify({
		error: [
			'Please try refreshing the page or Ctrl+Shift+R for force refresh on desktop.',
			'If this problem persists, please contact raenonx0710@gmail.com or @raenonx on Discord.'
		].join('\n'),
	}),
	{
		status: 400,
		headers: {'Content-Type': 'application/json'},
	}
);

export default {
	fetch: async (request: Request, _: Env, __: ExecutionContext): Promise<Response> => {
		const nextServerActionHeader = request.headers.get('Next-Action');

		if (deadNextServerActionHashes.has(nextServerActionHeader)) {
			console.log({
				message: 'Dead next server action blocked',
				deadNextServerActionHashes,
				host: new URL(request.url).host,
				url: request.url,
			});
			return generateBadNextServerActionResponse();
		}

		// If the header is not present, proceed with the request
		if (!nextServerActionHeader) {
			return fetch(request);
		}

		// Fetch the response from the origin or another upstream
		const response = await fetch(request);

		// Check the 'Content-Type' header of the response to determine if it's HTML
		const contentType = response.headers.get('Content-Type');
		if (!contentType || !contentType.includes('text/html')) {
			return response;
		}

		// Record the dead server action header
		deadNextServerActionHashes.add(nextServerActionHeader);
		console.log({
			message: 'New dead next server action found and added',
			deadNextServerActionHashes,
			host: new URL(request.url).host,
			url: request.url,
		});

		// Return an error response if the response is HTML
		return generateBadNextServerActionResponse();
	}
};
