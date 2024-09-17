function login() {
    const userName = document.getElementById("userName").value;
    const emailId = document.getElementById("emailId").value;
    const Address = document.getElementById("Address").value;
    const passWord = document.getElementById("passWord").value;
    
    const excepUser = ExcepHandUserName(userName);
    const excepMail = ExcepHandMail(emailId);
    const excepAddr = ExcepHandAddress(Address);
    const excepPass = ExcepHandPassWord(passWord);

    if (excepUser === 1 && excepPass === 1 && excepAddr === 1 && excepMail === 1) {
        const x = passWord.length;
        let stars = "";
        for (let i = 0; i < x - 2; i++) {
            stars += '*';
        }
        alert(userName + "\n" + passWord[0] + stars + passWord[x - 1]);

        // Send data to the server
        fetch('http://localhost:3000/SignUpAdpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName,    
                emailId: emailId,      
                Address: Address,      
                passWord: passWord     
            })
        })
        
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));

        return false; // Prevent form submission
    } else {
        alert('Validation failed');
        return false; // Prevent form submission
    }
}
