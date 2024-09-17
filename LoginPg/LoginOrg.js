document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const inputFields = document.querySelectorAll(".input-box input");
    const orgName = inputFields[0].value;
    const orgType = inputFields[1].value;
    const passWord = inputFields[2].value;

    fetch('http://localhost:3008/LoginOrg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orgName: orgName,
            orgType: orgType,
            passWord: passWord
        })
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('message');
        if (data.message) {
            messageElement.textContent = data.message;

            // Redirect if login is successful
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        }
    })
    .catch(error => console.error('Error:', error));
});
