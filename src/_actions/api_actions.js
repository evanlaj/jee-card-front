import axios from "axios";

const URL_BACKEND = "http://localhost:8080/api/";

  /*=========================================*/
  /*                  LOGIN                  */
  /*=========================================*/

async function authenticate(mail, pw) {    
  
  let params = new URLSearchParams(); 
  params.append('mail', mail);
  params.append('password', pw);

  return await axios
  .post(URL_BACKEND + "authenticate", params, {
    headers: { 
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  .catch((error) => error)
  .then((response) => response.data);
}

async function hello() {    
  return await axios
  .get(URL_BACKEND + "users/hello")
  .catch((error) => error)
  .then((response) => response.data);
}

export {authenticate, hello}
