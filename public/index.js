const menuBtn = document.querySelector('.hamburger--slider');
const body = document.querySelector('body');
const slide = document.querySelector('.glide__slides');

let menuOpen = false;
menuBtn.addEventListener('click', () => {
    if(!menuOpen) {
        menuBtn.classList.add('is-active');
        document.querySelector('.menu').style.height = "100%";
        document.querySelector('#contact-btn').style.visibility = "hidden";
        body.classList.add('overlay');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('is-active');
        document.querySelector('.menu').style.height = "0%";
        document.querySelector('#contact-btn').style.visibility = "visible";
        body.classList.remove('overlay');
        menuOpen = false;
    }
});
const menuItem = document.querySelector('.menu-list');
menuItem.addEventListener('click', () => {
    setTimeout(function(){
        menuBtn.classList.remove('is-active');
        document.querySelector('.menu').style.height = "0%";
        document.querySelector('#contact-btn').style.visibility = "visible";
        body.classList.remove('overlay');
        menuOpen = false;},575)});



(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }else {
             send();
             
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response)
    }
  
    return response.json().then(json => {
      const error = new Error(json.error || response.statusText)
      return Promise.reject(Object.assign(error, { response }))
    })
  }

function send() {

    let First_name = document.getElementById('First_name').value;
    let Last_name = document.getElementById('Last_name').value;
    let Email_address = document.getElementById('Email_address').value;
    let Telephone = document.getElementById('Telephone').value;
    let message = document.getElementById('message').value;
    
    let sent = document.getElementById('contact-card')
    const success = `<div class="success">THANK YOU... YOUR MESSAGE HAS BEEN SENT!</div>`

    
    fetch('http://localhost:3000/send/', {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ First_name, Last_name, Email_address, Telephone, message })
    })
    .then(checkStatus)
    .then(sent.innerHTML = success)
    // .catch(error => { if (error.message == '*Incorrect username') {
    //     usererror.innerHTML = error.message;
    //     } else {
    //         passworderror.innerHTML = error.message;
    //     }});
}



const renderPosts = async () => {
  let uri = 'http://localhost:3000/api/projects'

  const res = await fetch(uri);
  const projects = await res.json();

  let template = '';
  projects.forEach(project => {
    template += `<li class="glide__slide">
                  <div class="card">
                    <img src=${project.image} class="card-img">
                    <div class="card-title">${project.title}</div>
                    <div class="card-divider"></div>
                    <div class="card-description">${project.description}</div>
                    <div class="card-icons">
                      <a href=${project.link} class="card-view"><img src="assets/view.svg" id="view-btn"></a>
                      <a href=${project.github} class="card-git"><img src="assets/git-view.svg" id="git-btn"></a>
                      <a href=${project.case} class="card-case"><img src="assets/case-view.svg" id="case-btn"></a>
                    </div>
                  </div>
                </li>`
  })
  slide.innerHTML = template;

  new Glide('.glide', {
    type: 'carousel',
    startAt: 0,
    perView: 3,
    focusAt: 'center',
    gap: 0,
  }).mount()

}


window.addEventListener('DOMContentLoaded', () => renderPosts());