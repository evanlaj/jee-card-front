import axios from "axios";

import { validateToken, refreshSession } from './session';

const URL_BACKEND = "http://localhost:8080/api/";

  /*=========================================*/
  /*                  LOGIN                  */
  /*=========================================*/

async function authenticate(mail, pw) {
  
  let params = new URLSearchParams();
  params.append('mail', mail);
  params.append('password', pw);

  let success = false;

  let error = false;

  await axios
  .post(URL_BACKEND + "authenticate", params, {
    headers: { 
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  .catch((e) => {
    error = true;
  })
  .then(async (response) => {
    if(error) success = false;
    else {
      let accessToken = response.data.access_token;
      let refreshToken = response.data.refresh_token;
  
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
  
      await refreshSession();
  
      success = true;
    }
  });
  return success;
}

/*============================================*/
/*                  REGISTER                  */
/*============================================*/

// Called when creating a new User
async function saveUser(pseudo, mail, pw) {

  let newUserDTO = {
    username : pseudo,
    mail : mail,
    password : pw
  };

  let success = false;

  let error = false;

  await axios
  .post(URL_BACKEND + "users/save", newUserDTO)
  .catch((e) => {
    error = true;
  })
  .then(async (response) => {
    success = !error && (response.status === 201);
  });
  return success;
}

async function deleteUser(mail) {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  return await axios
  .delete(URL_BACKEND + "users", {
    params: { 
      mail: mail 
    },
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function getDataFromToken() {

  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  return await axios
  .get(URL_BACKEND + "users/info", {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function getNewToken() {
  let refreshToken = localStorage.getItem('refresh_token');

  return await axios
  .get(URL_BACKEND + "users/refreshtoken", {
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  })
  .catch((error) => error)
  .then((response) => {
    let accessToken = response.data.access_token;

    localStorage.setItem('access_token', accessToken);
  });
}

async function checkAvailability(gameName) {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  let success = false;

  await axios
  .get(URL_BACKEND + "games/availability", {
    params: { 
      name: gameName 
    },
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then(async (response) => {
    success = response.data;
  });
  return success;
}

async function getUserList() {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  return await axios
  .get(URL_BACKEND + "users", {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function getGameList() {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  return await axios
  .get(URL_BACKEND + "games", {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function setGameAvailability(gameId, available) {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  let gameAvailabilityDTO = {
    gameId : gameId,
    available : available,
  };

  return await axios
  .post(URL_BACKEND + "games/availability", gameAvailabilityDTO, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function sendGameSummary(game, victory) {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  let gameSummaryDTO = {
    game : game,
    victory : victory,
  };

  return await axios
  .post(URL_BACKEND + "users/newgame", gameSummaryDTO, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function getGameHistory() {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  return await axios
  .get(URL_BACKEND + "users/history", {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function changeUserName(newName) {
  let tokenIsValid = await validateToken();

  if(!tokenIsValid) return false;

  let accessToken = localStorage.getItem('access_token');

  let newUsernameDTO = {
    username : newName,
  };

  return await axios
  .put(URL_BACKEND + "users/username", newUsernameDTO, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

export {
  authenticate, 
  getDataFromToken, 
  getNewToken, 
  saveUser, 
  checkAvailability, 
  getUserList, 
  getGameList, 
  setGameAvailability, 
  sendGameSummary, 
  getGameHistory, 
  deleteUser, 
  changeUserName
}
