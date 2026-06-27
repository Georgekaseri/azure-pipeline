Feature: Bahmni Login - Standard Demo
  As a user
  I want to access the Bahmni login page
  So that I can sign in to the Standard demo environment

  @smoke
  Scenario Outline: Open login page and verify Standard environment
    Given I open the application url "<urlKey>"
    Then the "<usernameField>" input should be visible
    And the "<passwordField>" input should be visible
    And the "<loginButton>" button should be visible
    And the page url should contain "<expectedDomainKey>"

    Examples:
      | urlKey   | usernameField | passwordField | loginButton | expectedDomainKey |
      | BASE_URL | username      | password      | login       | BASE_DOMAIN       |
      | QA_URL   | username      | password      | login       | QA_DOMAIN         |
      | SIT_URL  | username      | password      | login       | SIT_DOMAIN        |

  @auth @regression
  Scenario Outline: Login with valid credentials
    Given I open the application url "<urlKey>"
    When I enter credential "<usernameEnvKey>" into "<usernameField>"
    And I enter credential "<passwordEnvKey>" into "<passwordField>"
    And I click the "<loginButton>" button
    Then login should succeed away from "<loginPath>"
    And login should reach path "<locationPath>"
    When I select option "<locationValue>" from "<locationField>"
    And I click the "<continueButton>" button
    Then login should succeed away from "<locationPath>"
    And the page url should contain "<expectedDomainKey>"

    Examples:
      | urlKey   | usernameEnvKey  | passwordEnvKey  | usernameField | passwordField | loginButton | loginPath | locationPath    | locationField | locationValue | continueButton | expectedDomainKey |
      | BASE_URL | BAHMNI_USERNAME | BAHMNI_PASSWORD | username      | password      | login       | #/login   | #/loginLocation | location      | OPD-1         | continue       | BASE_DOMAIN       |
