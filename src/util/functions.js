import { checkAuth } from "./requests";
import { updateUser } from "./redux/actionCreators";

export function checkUserAuth() {
    checkAuth()
        .then((response) => {
            updateUser({
                ...response.data,
            });
        })
        .catch(error => {
            console.error("Authentication check failed:", error);
            updateUser({ authenticated: false });
        });
};