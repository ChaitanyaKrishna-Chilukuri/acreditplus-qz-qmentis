export const ENV = {
  BASE_URL: process.env.BASE_URL!,
  TEST_ENV: process.env.TEST_ENV!,
  ACREDITPLUS_USERNAME: process.env.ACREDITPLUS_USERNAME!,
  ACREDITPLUS_PASSWORD: process.env.ACREDITPLUS_PASSWORD!,
  BROWSER: process.env.BROWSER!,
  OS: process.env.OS!, 
  APP_URL: process.env.APP_URL!,

  baseUrl: 'https://acreditplus-cloud-dev-two.acr.org/ACReditPlusAuthService/Account/Login',
  auth: {
    facility_username: 'acreditplusfacilityuser@yahoo.com',
    admin_username: 'acreditplusadmnstr@yahoo.com'
  },
  facility: {
    dashboard: 'https://acreditplus-cloud-dev-two.acr.org/ACReditPlus/Facility/Dashboard'
  }
};