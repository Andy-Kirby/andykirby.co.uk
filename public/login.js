document.getElementById('submit').addEventListener('click', post);

function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response)
    }
  
    return response.json().then(json => {
      const error = new Error(json.error || response.statusText)
      return Promise.reject(Object.assign(error, { response }))
    })
  }

function post() {
    document.getElementById('usererror').innerHTML = '';
    document.getElementById('passworderror').innerHTML = '';

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    let usererror = document.getElementById('usererror')
    let passworderror = document.getElementById('passworderror')
    
    fetch('http://localhost:3000/login/', {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(checkStatus)
    .then(res => res.json())
    .then(data => window.location.replace(data.redirect))
    .catch(error => { if (error.message == '*Incorrect username') {
        usererror.innerHTML = error.message;
        } else {
            passworderror.innerHTML = error.message;
        }});
}