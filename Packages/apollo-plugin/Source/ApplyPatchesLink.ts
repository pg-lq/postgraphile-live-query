import {ApolloLink, FetchResult, Observable, Operation} from "@apollo/client";
import {ApplyPatchFunction, createApplyLiveQueryPatch} from "@n1ru4l/graphql-live-query-patch";
import fastJSONPatch from "fast-json-patch";
//import jsondiffpatch from "jsondiffpatch";
import * as jsonDiffPatch from "jsondiffpatch"; // needed for demos repo atm, fsr
import type {Config} from "jsondiffpatch";

// patch-func helpers
export function CreateApplyPatchFunc_JSONDiffPatch(opts?: Config): ApplyPatchFunction {
	const patcher = jsonDiffPatch.create({
		// we don't need to supply an objectHash func here, because it's only used during patch *generation*
		...opts,
	});
	return (previous, patch)=>{
		// delta structure is different, but that's fine (both sides just need to use the same patch-lib)
		return patcher.patch(previous, patch);
	};
}
export function CreateApplyPatchFunc_FastJSONPatch(): ApplyPatchFunction {
	return (previous, patch)=>{
		const result = fastJSONPatch.applyPatch(previous, patch, true, false);
		return result.newDocument;
	};
}

export class ApplyPatchesLink extends ApolloLink {
	constructor(opts?: Partial<ApplyPatchesLink>) {
		super();
		Object.assign(this, opts);
	}

	baseLink: ApolloLink;
	applyPatchFunc: ApplyPatchFunction = CreateApplyPatchFunc_JSONDiffPatch();

	public request(operation: Operation): Observable<FetchResult> | null {
		const applyLiveQueryPatch = createApplyLiveQueryPatch({
			applyPatch: this.applyPatchFunc,
		});
		const queue = [];
		const iter: AsyncIterableIterator<Record<string, unknown>> = {
			async* [Symbol.asyncIterator]() {
				while (true) {
					yield queue[0];
				}
		 	},
			next() { return queue[0]; }
		};
		const applyIter = applyLiveQueryPatch(iter);
		
		return new Observable<FetchResult>(sink=>{
			const baseObservable = this.baseLink.request(operation);
			let subresultsReceived = 0;
			baseObservable.subscribe(async subresult=>{
				subresultsReceived++;

				queue.length = 0;
				queue[0] = subresult;
				const nextSubresultOut = (await applyIter.next()).value;
				sink.next(nextSubresultOut);

				console.log(`Subresult(${subresultsReceived}):`, subresult, "SubresultOut:", nextSubresultOut);
			});
		});
	}
}