import { window, QuickPickOptions } from 'vscode';
import Prompt from './prompt';
import EscapeException from '../utils/EscapeException';

export default class ListPrompt extends Prompt {

	constructor(question: any) {
		super(question);
	}

	public render() {
		let choices:any;
		if (this._question.choices instanceof Array) {
			choices = this._question.choices.reduce((result:any, choice:any) => {
				result[choice] = choice;
				return result;
			}, {});
		}
		else {
			choices = this._question.choices.reduce((result:any, choice:any) => {
				result[choice.name] = choice.value;
				return result;
			}, {});
		}

		const options: QuickPickOptions = {
			placeHolder: this._question.message
		};

		return window.showQuickPick(Object.keys(choices), options)
			.then(result => {
				if (result === undefined) {
					throw new EscapeException();
				}

				return choices[result];
			});
	}
}
