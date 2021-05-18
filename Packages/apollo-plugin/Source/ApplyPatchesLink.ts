import {ApolloLink, FetchResult, Observable, Operation} from "@apollo/client";
import {createApplyLiveQueryPatch} from "@n1ru4l/graphql-live-query-patch";

export class ApplyPatchesLink extends ApolloLink {
	constructor(public baseLink: ApolloLink) {
		super();
	}

	public request(operation: Operation): Observable<FetchResult> | null {
		const applyLiveQueryPatch = createApplyLiveQueryPatch();
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