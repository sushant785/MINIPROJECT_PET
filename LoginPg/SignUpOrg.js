function login() {
    const inputFields = document.querySelectorAll(".input-box input");

    const orgName = inputFields[0].value;
    const orgType = inputFields[1].value;
    const contNo = inputFields[2].value;
    const emailId = inputFields[3].value;
    const Address = inputFields[4].value;
    const passWord = inputFields[5].value;

    const excepUser = ExcepHandUserName(orgName);
    const excepMail = ExcepHandEmail(emailId);
    const excepAddr = ExcepHandAddress(Address);
    const excepPass = ExcepHandPassWord(passWord);

    if (excepUser === 1 && excepMail === 1 && excepAddr === 1 && excepPass === 1) {
        // Send data to the server if all validations pass
        fetch('http://localhost:3006/SignUpOrg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orgName: orgName,
                orgType: orgType,
                contNo: contNo,
                emailid: emailId,
                address: Address,
                password: passWord
            })
        })
        
            .then(response => response.json())
            .then(data => {
              if (data.message) {
                // Assuming you want to insert the link in an HTML element
                const messageElement = document.getElementById('message');
                messageElement.innerHTML = `${data.message} <a href='${data.link}'>Click here</a>`;
              }
            })
            .catch(error => console.error('Error:', error));
          

        return false; // Prevent the form from submitting through the browser
    } else {
        return false; // Prevent the form from submitting if validation fails
    }
}






