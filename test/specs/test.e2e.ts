import { expect } from "@wdio/globals";
import MainPage from "../pageobjects/main.page";

describe("Greeting", () => {
	it("works", async () => {
		await MainPage.textField.setValue("TestName");
		await MainPage.button.click();
		await expect(MainPage.greetDiv).toHaveText(
			"Hello, TestName! You've been greeted from Rust!",
		);
	});
});
