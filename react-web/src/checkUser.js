export function checkUser() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const discriminator = localStorage.getItem("discriminator");
    
    if (token) {
        if (username === 'dickey' && discriminator === '6969') {
            return true;
        } else {        
            return false;
        }
    }
}