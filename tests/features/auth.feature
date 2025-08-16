Feature: Authentication
  As a user
  I want to authenticate with the application
  So that I can access protected features

  Scenario: Sign up with valid credentials
    Given I am on the sign-up page
    When I fill in the sign-up form with valid details
    And I submit the sign-up form
    Then I should see a confirmation message

  Scenario: Sign up with invalid credentials
    Given I am on the sign-up page
    When I fill in the sign-up form with invalid credentials
    And I submit the sign-up form
    Then I should see an error message

  @auth @sign-in @happy
  Scenario: sign-in with valid credentials
    Given I am on the sign-in page
    When I fill in the sign-in form with valid credentials
    And I submit sign-in the form
    Then I should see a sign-in success message

  @auth @sign-in @unhappy
  Scenario: sign-in with invalid credentials
    Given I am on the sign-in page
    When I fill in the sign-in form with invalid credentials
    And I submit sign-in the form
    Then I should see a sign-in error message
