import graphql_live_query_patch from "@n1ru4l/graphql-live-query-patch";
const {createLiveQueryPatchGenerator} = graphql_live_query_patch;

export const GeneratePatchesPlugin = {
	["postgraphile:liveSubscribe:executionResult"](result, {contextValue}) {
		if (contextValue._clientID == null) {
			contextValue._clientID = global["_lastClientID"] = (global["_lastClientID"]|0) + 1;
			const patchGenerator = createLiveQueryPatchGenerator();
			contextValue._patchGenerator_queue = [];
			contextValue._patchGenerator_queue[Symbol.asyncIterator] = function*() {
				while (true) {
					const nextEntry = contextValue._patchGenerator_queue[0];
					yield {...nextEntry, isLive: true};
				}
			};
			contextValue._patchGenerator_call = patchGenerator(contextValue._patchGenerator_queue)
		}
		//console.log("Client ID:", contextValue._clientID);

		return new Promise(async resolve=>{
			let result_awaited = await result;

			contextValue._patchGenerator_queue[0] = result_awaited;
			const resultAsPatch = (await contextValue._patchGenerator_call.next()).value;

			resolve(resultAsPatch);
		});
	},
};