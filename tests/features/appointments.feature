Feature: Appointments
  As a doctor or administrator
  I want to create a new appointment
  So that I can schedule appointments for patients

  Scenario: Create new appointment with available status
    Given I am in the appointments page
    When I click on "Create new appointment"
    And I choose the begin date, end date, begin time, and end time
    And I select the appointment type as "Available"
    And submit the appointment with type "Available"
    Then I should see the appointment in "Available" appointments list