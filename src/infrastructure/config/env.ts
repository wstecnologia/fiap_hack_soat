export const env = {
  COGNITO_REGION: process.env.COGNITO_REGION,
  COGNITO_ISSUER: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
  COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET || '',
  COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'default_secret',
};