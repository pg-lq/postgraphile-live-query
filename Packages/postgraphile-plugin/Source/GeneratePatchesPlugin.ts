import graphql_live_query_patch, {GeneratePatchFunction, ApplyPatchFunction} from "@n1ru4l/graphql-live-query-patch";
const {createLiveQueryPatchGenerator} = graphql_live_query_patch;
import jsondiffpatch from "jsondiffpatch";
import {Config} from "jsondiffpatch";
import {compare} from "fast-json-patch";

export function CreateGeneratePatchFunc_JSONDiffPatch(opts?: Config): GeneratePatchFunction {
	const patcher = jsondiffpatch.create({
		objectHash: (item, index)=>{
			// this function is used only to when objects are not equal by ref
			/*const newObj = _(obj).toPairs().sortBy(0).fromPairs().value();
			const hash = hasha(JSON.stringify(newObj), {algorithm: "sha256"})
			return hash;*/
			//return item._id ?? item.id ?? JSON.stringify(item);
			return JSON.stringify(item);
		},
		...opts,
	});
	return (previous, current)=>{
		// delta structure is different, but that's fine (both sides just need to use the same patch-lib)
		return patcher.diff(previous, current) as any;
	};
}
export function CreateGeneratePatchFunc_FastJSONPatch(): GeneratePatchFunction {
	return (previous, current)=>compare(previous, current);
}

export class GeneratePatchesPlugin {
	constructor(opts?: Partial<GeneratePatchesPlugin>) {
		Object.assign(this, opts);
	}

	generatePatchFunc: GeneratePatchFunction = CreateGeneratePatchFunc_JSONDiffPatch();

	"postgraphile:liveSubscribe:executionResult"(result, {contextValue}) {
		if (contextValue._clientID == null) {
			contextValue._clientID = global["_lastClientID"] = (global["_lastClientID"]|0) + 1;
			const patchGenerator = createLiveQueryPatchGenerator({
				generatePatch: this.generatePatchFunc,
			});
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
	}
};