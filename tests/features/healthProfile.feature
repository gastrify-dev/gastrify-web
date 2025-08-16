Feature: Health profile
  As a user
  I want to complete
  So that I can book appointments

  Scenario: Complete personal information form
    Given I am on the profile page
    And I am on step 1 of the health profile form
    When I fill the personal information form with valid information
    And I submit the "personal information" form
    Then I should see a confirmation message for step 1 completion
    And I should be taken to step 2 of the health profile form

  Scenario: Complete medical information form
    Given I am on the profile page
    And I am on step 2 of the health profile form
    When I fill the medical information form with valid information
    And I submit the "medical information" form
    Then I should see a confirmation message for step 2 completion
    And I should be taken to step 3 of the health profile form

  Scenario: Complete emergency contacts form
    Given I am on the profile page
    And I am on step 3 of the health profile form
    When I fill the emergency contacts information form with valid information
    And I submit the "emergency contacts" form
    Then I should see a confirmation message for step 3 completion
    And health profile form should be completed