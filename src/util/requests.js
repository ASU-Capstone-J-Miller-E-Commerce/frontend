import $ from 'jquery';
import { toast } from 'react-toastify';


export function _ajax(settings={}) {
    settings.url = `http://localhost:5000${settings.url}`;

    return $.ajax(settings)
        .then((res) => {
            console.log(res);
            toast.success(`Operation successful: ${res}`);
            return res; 
        }).catch((err) => {
            console.log(err);
            toast.error(`Operation failed: ${err}`);
            throw err;
        });
}

// test backend call
export function test() {
    _ajax({
        url: "/products",
        method: "GET",
    });
}

/*==============================================================
# Users
==============================================================*/



/*==============================================================
# Products
==============================================================*/
