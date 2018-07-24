import { window } from 'vscode';
const runAsync = require('run-async');
const isFn = require('is-fn');

// Helper function that will show a progress bar while running a function async
export default function(func:any): Function {
	if (!isFn(func)) {
		return function() {
			return Promise.resolve(func);
		}
	}

	const fn = runAsync(func);

	return function(): Promise<any> {
		const args = Array.prototype.slice.call(arguments);

		return new Promise((resolve, reject) => {
			Promise.resolve(window.showQuickPick(new Promise((res, rej) => {
				fn.apply(fn, args)
					.then((result:any) => {
						rej();

						resolve(result);
					})
					.catch((err:any) => {
						rej();

						reject(err);
					});
			}))).catch(err => {
				// do nothing because the input is always rejected
			});
		});
	};
}
