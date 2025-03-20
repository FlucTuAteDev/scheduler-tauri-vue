import Page from "./page";

class MainPage extends Page {
	get textField() {
		return $("#text-field");
	}
	get button() {
		return $("#button");
	}
	get greetDiv() {
		return $("#greet");
	}
}

export default new MainPage();
