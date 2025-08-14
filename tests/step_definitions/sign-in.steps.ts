import assert from "assert";
import { Given, When, Then } from "@cucumber/cucumber";
import { z } from "zod/v4";

let confirmationMessage: string = "";
let formSubmitted: boolean = false;

Given("I am on the sign-in page", async function () {
  this.submitForm = false;
  this.message = "";
});

When("I fill in the sign-in form with valid credentials", async function () {
  this.formData = {
    email: "test@example.com",
    password: "Password123!",
  };
});

When("I fill in the sign-in form with invalid credentials", async function () {
  this.formData = {
    email: "wrongemail",
    password: "Password123!",
  };
});

When("I submit sign-in the form", async function () {
  if (z.email().safeParse(this.formData.email).success) {
    confirmationMessage = "Sign-in successful.";
    formSubmitted = true;
  } else {
    confirmationMessage = "Sign-in failed.";
    formSubmitted = false;
  }
});

Then("I should see a sign-in success message", async function () {
  assert.strictEqual(
    formSubmitted,
    true,
    "Form was not submitted successfully",
  );
  assert.strictEqual(
    confirmationMessage,
    "Sign-in successful.",
    "Success message is incorrect",
  );
});

Then("I should see a sign-in error message", async function () {
  assert.strictEqual(
    formSubmitted,
    false,
    "Form was submitted successfully, but should have failed",
  );
  assert.strictEqual(
    confirmationMessage,
    "Sign-in failed.",
    "Error message is incorrect",
  );
});
