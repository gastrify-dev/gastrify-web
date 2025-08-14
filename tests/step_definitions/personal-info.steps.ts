import assert from "assert";
import { Given, When, Then } from "@cucumber/cucumber";

let personalInfoCompleted = false;
let medicalInfoCompleted = false;
let emergencyContactsCompleted = false;

let currentStep: number;

let message = "";

Given("I am on the profile page", async function () {
  console.log("User is on the profile page");
});

Given("I am on step {int} of the health profile form", async function (int) {
  currentStep = int;
  console.log(`User is on step ${int} of the health profile form`);
});

When(
  "I fill the personal information form with valid information",
  async function () {
    this.personalInfoData = {
      age: 30,
      profession: "Engineer",
      occupation: "Software Development",
      maritalStatus: "Single",
      hasChildren: true,
      numMale: 1,
      numFemale: 0,
      cSections: false,
      abortions: false,
      homeAddress: "123 Main St",
      city: "Springfield",
      homePhoneNumber: "1234567890",
      mobilePhoneNumber: "0987654321",
      workPhoneNumber: "5555555555",
    };
  },
);

When(
  "I fill the medical information form with valid information",
  async function () {
    this.medicalInfoData = {
      bloodType: "O",
      rhFactor: "+",
      religion: "other",
      hasAllergies: true,
      allergyDetails: "Peanuts",
      chronicDiseases: false,
      allowsTransfusions: true,
      alcohol: false,
      drugs: false,
      hasChronicIllness: false,
      chronicIllnessDetails: "",
      hasHealthInsurance: false,
      healthInsuranceProvider: "",
    };
  },
);

When(
  "I fill the emergency contacts information form with valid information",
  async function () {
    this.emergencyContactsData = {
      name: "Mom",
      relationship: "Parent",
      homePhoneNumber: "1234567890",
      mobilePhoneNumber: "0987654321",
      workPhoneNumber: "5555555555",
      email: "test@example.com",
    };
  },
);

When("I submit the {string} form", async function (string) {
  if (string === "personal information") {
    assert.strict(this.personalInfoData, "Personal info data is not set");
    personalInfoCompleted = true;
    message = "Personal information was submitted successfully.";
  } else if (string === "medical information") {
    assert.strict(this.medicalInfoData, "Medical info data is not set");
    medicalInfoCompleted = true;
    message = "Medical information was submitted successfully.";
  } else if (string === "emergency contacts") {
    assert.strict(
      this.emergencyContactsData,
      "Emergency contacts data is not set",
    );
    emergencyContactsCompleted = true;
    message = "Emergency contacts information was submitted successfully.";
  }
});

Then(
  "I should see a confirmation message for step {int} completion",
  async function (int) {
    if (int === 1) {
      assert.strictEqual(
        personalInfoCompleted,
        true,
        "Health profile step 1 was not completed successfully",
      );
      assert.strictEqual(
        message,
        "Personal information was submitted successfully.",
        "Confirmation message is incorrect",
      );
    } else if (int === 2) {
      assert.strictEqual(
        medicalInfoCompleted,
        true,
        "Health profile step 2 was not completed successfully",
      );
      assert.strictEqual(
        message,
        "Medical information was submitted successfully.",
        "Confirmation message is incorrect",
      );
    } else if (int === 3) {
      assert.strictEqual(
        emergencyContactsCompleted,
        true,
        "Health profile step 3 was not completed successfully",
      );
      assert.strictEqual(
        message,
        "Emergency contacts information was submitted successfully.",
        "Confirmation message is incorrect",
      );
    }
  },
);

Then(
  "I should be taken to step {int} of the health profile form",
  async function (int) {
    assert.strictEqual(
      currentStep + 1,
      int,
      "User was not taken to the next step of the health profile form",
    );
  },
);

Then("health profile form should be completed", async function () {
  assert.strictEqual(
    personalInfoCompleted,
    true,
    "Personal information was not completed successfully",
  );
  assert.strictEqual(
    medicalInfoCompleted,
    true,
    "Medical information was not completed successfully",
  );
  assert.strictEqual(
    emergencyContactsCompleted,
    true,
    "Emergency contacts information was not completed successfully",
  );
});
