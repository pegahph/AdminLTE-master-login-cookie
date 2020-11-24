// "use strict";
// login and saving cookie
$(function(){
    if(checkCookie("path") && window.location.pathname != getCookie("path") && !sessionStorage.getItem("path")){
        window.location.replace(getCookie("path"));   
        sessionStorage.setItem("path" , "first open")     
    }
    checkCookie("username");
    setCookie("path" , window.location.pathname);
})

function Login(){
    const form = document.querySelector('form');
    form.addEventListener('submit', event => {  
        let Email = $('#email').val();
        let password = $('#password').val();   
        checkLogin(Email , password);       
        event.preventDefault()
    })
}

function checkLogin(email , password){
    let response = new XMLHttpRequest();
    response.open("POST", "https://reqres.in/api/login", true);
    response.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    response.onload = function(){
        if(response.status == 200){           
            setCookie("token" , JSON.parse(response.response).token);
            setCookie("username" , email);            
            if(!sessionStorage.getItem("path")){   
                //  if opening from local file
                if(window.location.pathname.includes("AdminLTE-master")){
                    let path = window.location.pathname.substring(0,34) + "/index.html";                    
                    window.location.replace(path);
                    
                } else{
                    window.location.replace("/index.html");
                }
            }else {
                window.location.replace(sessionStorage.getItem("path"));
            }
        }
        else {
            alert("inputs not correct!");
        }
    };
    response.send("email="+email+"&password="+password);
}


// Cookie
function setCookie(name , value){
    let date = new Date();
    date.setDate(date.getDate() + 1);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(CookieName) {
    let name = CookieName + "=";
    let cookie = document.cookie.split(';');
    for(let i = 0; i < cookie.length; i++) {
      let c = cookie[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function checkCookie(cookieName) {
    let value = getCookie(cookieName);
    if(cookieName == "username"){
        if (value != "") {
            $('.info > a').text(value);
        } else {       
            if(!window.location.pathname.includes("/pages/examples/login.html")){
                sessionStorage.setItem("path" , window.location.pathname);
                // if opening from local file
                if(window.location.pathname.includes("AdminLTE-master")){
                    let path = window.location.pathname.substring(0,34) + "/pages/examples/login.html";
                    window.location.replace(path);
                }  
                else{                         
                    window.location.replace("/pages/examples/login.html");   
                }        
            }
            Login();   
        }
    }
    else if (cookieName == "path"){
        if(value == ""){
            return false;
        }
        else {
            return true;
        }
    }

  }



/* contacts page */
if (window.location.pathname.includes('/pages/examples/contacts.html')) {
    let pages = document.getElementsByClassName('page-item');
    let currentPageNumber = 1;
    let pageNumber = 1;
    let pageActive = 0;
    readData(currentPageNumber);

    // check which page is clicked
    for (let page of pages){
        page.addEventListener('click', (event)=>{
            pages[pageActive].classList.remove("active");
            page.classList.add("active");
            pageActive = parseInt(event.target.innerHTML)-1;   
            pageNumber = event.target.innerHTML;
            readData(pageNumber);  
        })
    }

    // fetching the data
    async function readData(pageNum) {
        try {
            const response = await fetch(`https://reqres.in/api/users?page=${pageNum}`);
            const data = await response.json();
            if(data.data){
                setData(data.data);
            }
        }
        catch(e){
            console.log("there was a problem while fetching.");
        }
    }

    // set the data
    function setData(data) {
    let container = document.getElementById('card-container');
    if(pageNumber != currentPageNumber){
        container.innerHTML = "";
        pageItem = 0;  
        currentPageNumber = pageNumber;    
    }
    for (let i=0 ; i<data.length ; i++){
            let card = ` <div class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
            <div class="card bg-light">
                <div class="card-header text-muted border-bottom-0">
                id: ${data[i].id}
                </div>
                <div class="card-body pt-0">
                <div class="row">
                    <div class="col-7">
                    <h2 class="lead"><b>${data[i].first_name + " " + data[i].last_name}</b></h2>
                    <p class="text-muted text-sm"><b>About: </b> some description </p>
                    <ul class="ml-4 mb-0 fa-ul text-muted">
                        <li class="small"><span class="fa-li"><i class="fas fa-lg fa-envelope"></i></span> ${data[i].email}</li>
                    </ul>
                    </div>
                    <div class="col-5 text-center">
                    <img src="${data[i].avatar}" alt="user-avatar" class="img-circle img-fluid">
                    </div>
                </div>
                </div>
                <div class="card-footer">
                <div class="text-right">
                    <a href="#" class="btn btn-sm bg-teal">
                    <i class="fas fa-comments"></i>
                    </a>
                    <a href="#" class="btn btn-sm btn-primary">
                    <i class="fas fa-user"></i> View Profile
                    </a>
                </div>
                </div>
            </div>
            </div>`
            container.insertAdjacentHTML("beforeend" , card);    
       }
    }
}



