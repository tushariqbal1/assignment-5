document.getElementById('login-btn').addEventListener('click', function () {
    const inputUser = document.getElementById('input-username');
    const userName = inputUser.value;
    
    const inputPassword = document.getElementById('input-password');
    const userPassword = inputPassword.value;

    if(userName == 'admin' && userPassword == 'admin123'){
        alert('Login successful')

        window.location.assign('home.html')
    }
    else{
        alert('Login failed');
        return
    }
})