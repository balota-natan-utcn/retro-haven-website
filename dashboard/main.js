function login() {
    let usernameValue = document.getElementById('username').value;
    let passwordValue = document.getElementById('password').value;

    if (usernameValue === 'admin' && passwordValue === 'nimda') {
        document.getElementById('title').innerHTML = 'Succesfully connected';
        document.getElementById('userImage').src = user.image;
        document.getElementById('name').innerHTML = user.firstName + ' ' + user.lastName;

        let friendsList = '';
        for (let i = 0; i < user.friends.length - 1; i++) {
            friendsList += user.friends[i].firstName + ' ' + user.friends[i].lastName + ', ';
        }

        friendsList += user.friends[user.friends.length - 1].firstName + ' ' + user.friends[user.friends.length - 1].lastName
        document.getElementById('friends').innerHTML = 'Friends: ' + friendsList;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('logged-in-user').style.display = 'block';
    } else {
        document.getElementById('title').innerHTML = 'Access denied';
    }
}
