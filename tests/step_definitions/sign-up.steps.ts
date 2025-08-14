import assert from "assert";
import { Given, When, Then } from "@cucumber/cucumber";
import { z } from "zod/v4";

let confirmationMessage = "";
let formSubmitted = false;

Given("I am on the sign-up page", async function () {
  confirmationMessage = "";
  formSubmitted = false;
});

When("I fill in the sign-up form with valid details", async function () {
  this.formData = {
    name: "John Doe",
    identificationNumber: "0123456789",
    email: "text@example.com",
    password: "Password123!",
  };
});

When("I fill in the sign-up form with invalid credentials", async function () {
  this.formData = {
    name: "A",
    identificationNumber: "123",
    email: "notanemail",
    password: "weak",
  };
});

When("I submit the sign-up form", async function () {
  if (this.formData) {
    if (z.email().safeParse(this.formData.email).success) {
      confirmationMessage = "Your account has been created successfully.";
      formSubmitted = true;
    } else {
      confirmationMessage = "Sign-up failed.";
      formSubmitted = false;
    }
  }
});

Then("I should see a confirmation message", async function () {
  assert.strictEqual(
    formSubmitted,
    true,
    "Form was not submitted successfully",
  );
  assert.strictEqual(
    confirmationMessage,
    "Your account has been created successfully.",
    "Confirmation message is incorrect",
  );
});

Then("I should see an error message", async function () {
  assert.strictEqual(
    formSubmitted,
    false,
    "Form was submitted successfully, but should have failed",
  );
  assert.strictEqual(
    confirmationMessage,
    "Sign-up failed.",
    "Error message is incorrect",
  );
});
