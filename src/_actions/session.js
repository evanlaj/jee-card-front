import { getDataFromToken, getNewToken } from "./api_actions";

var userSession;

class Session {

  name = "";
  mail = "";
  role = "";

  async loadSession() {
    if (localStorage.getItem("access_token") !== null) {
      let data = await getDataFromToken();

      this.name = data.username;
      this.mail = data.mail;
      this.role = data.role;
    }
  }

  isLoggedIn() {
    return this.name !== null;
  }
}

async function getSession() {

  if(!userSession) {
    let session = new Session();
    await session.loadSession();
    userSession = session;
  }

  return userSession;
}

async function refreshSession() {
  let session = await getSession();
  await session.loadSession();
}

async function logout() {
  userSession = null;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

async function validateToken() {
  let accessToken = localStorage.getItem("access_token");
  
  if(parseJwt(accessToken).exp < Date.now() / 1000) {
    console.log("INFO : access_token expired, trying to get new token");
    let refreshToken = localStorage.getItem("refresh_token");
    if(parseJwt(refreshToken).exp < Date.now() / 1000) {
      console.log("INFO : refresh_token also expired, logging out");
      logout();
      return false;
    }
    await getNewToken();
    console.log("INFO : access_token updated");
  }
  console.log("INFO : access_token is valid");
  return true;
}

export {getSession, validateToken, logout, refreshSession};
