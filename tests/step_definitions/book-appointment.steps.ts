import assert from "assert";
import { Given, When, Then } from "@cucumber/cucumber";

type Appointment = {
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  appointmentType: "Available" | "Booked";
};

const appointments: Appointment[] = [];

Given("I am in the appointments page", async function () {
  console.log("User is on the appointments page");
});

When("I click on {string}", async function (string) {
  console.log(`User clicks on ${string}`);
});

When(
  "I choose the begin date, end date, begin time, and end time",
  async function () {
    const beginDate = "2023-10-01";
    const endDate = "2023-10-02";
    const beginTime = "09:00";
    const endTime = "10:00";

    this.appointmentData = {
      beginDate,
      endDate,
      beginTime,
      endTime,
    };
  },
);

When("I select the appointment type as {string}", async function (string) {
  this.appointmentData.appointmentType = string as "Available" | "Booked";
});

When("submit the appointment with type {string}", async function (string) {
  appointments.push(this.appointmentData);
});

Then(
  "I should see the appointment in {string} appointments list",
  async function (string) {
    if (appointments.length === 0) {
      assert.fail("No appointments found");
    }
  },
);
