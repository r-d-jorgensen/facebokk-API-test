import React, { useEffect } from 'react';
import axios from 'axios';
import { facebookAPICall } from '_helpers';

function Home() {
    useEffect(() => {
        loginUserWithFacebook();

        // TODO: Move this function to a helper file
        // If not a user make guest user account from fb account info and hold it in session storage
        async function loginUserWithFacebook() {
            const fbAccount = await facebookAPICall('/me', {"fields":"id,name,email,picture"})
                .then(fbAccount => fbAccount)
                .catch(error => console.log(error));
            const existingUser = await axios.get(`https://localhost:8080/user/facebook/${fbAccount.id}`);
            if (existingUser.data.length === 0) {
                const newUser = await axios.post(`https://localhost:8080/user/facebook`, {
                    data: {
                        user_type_ENUM_id: 3,
                        facebook_id: fbAccount.id,
                        username: fbAccount.name,
                        user_password: fbAccount.id,
                        email: fbAccount.email,
                    }
                });
                window.sessionStorage.setItem("user", JSON.stringify(newUser.data));
            } else {
                window.sessionStorage.setItem("user", JSON.stringify(existingUser.data[0]));
            }
        }
    }, [])
    return (
        <div>
            This is the Home Page
        </div>
    );
}

export { Home };