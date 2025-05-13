import {jwtDecode} from 'jwt-decode'


 export const isTokenvalid=(token)=>{

    if(!token)return false;

    try {
        const decodeToken= jwtDecode(token)
        const currentTime= Date.now()/1000

        if(decodeToken.exp && decodeToken.exp < currentTime)return false;

        return true;
    } catch (error) {
        return false;
    }

}
