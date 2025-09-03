import { checkAuth } from "./requests";
import { updateUser, setCartItems } from "./redux/actionCreators";

export function checkUserAuth() {
    checkAuth()
        .then((response) => {
            const userData = {
                ...response.data,
                initialAuthChecked: true,
            };
            
            // Update user data in Redux
            updateUser(userData);
            
            // Update cart data in Redux if user is authenticated and cart exists
            if (userData.authenticated && userData.cart) {
                setCartItems(userData.cart.items || []);
            } else {
                setCartItems([]);
            }
        })
        .catch(error => {
            console.error("Authentication check failed:", error);
            updateUser({ 
                authenticated: false, 
                initialAuthChecked: true, 
            });
            setCartItems([]);
        });
};