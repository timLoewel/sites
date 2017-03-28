import * as env from '../../env';
import Auth0Lock from 'react-native-lock';
const {Platform} = require('react-native');

const clientId = env.AUTH0_CLIENT_ID;
const domain = env.AUTH0_DOMAIN;

const authenticationEnabled = clientId && domain;

let lock = null;
if (authenticationEnabled) {
  lock = new Auth0Lock({
    clientId,
    domain
  });
} else {
  console.warn('Authentication not enabled: Auth0 configuration not provided');
  console.warn('auth0 clientId: ' + clientId);
  console.warn('auth0 domain: ' + clientId);
}


export default function showLogin(language, onUserLoginSuccess, onUserLoginError) {
  if (!authenticationEnabled) {
    return;
  }

  const options = {
    closable: true,
		language: language,
		autofocus: true,
    connections:['email']
  };

  lock.show(options, (err, profile, token) => {
    if (err) {
      onUserLoginError(err);
      return;
    }
    // Authentication worked!
    onUserLoginSuccess(profile, token);
  });
}
