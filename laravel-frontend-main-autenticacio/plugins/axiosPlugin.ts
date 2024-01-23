import axios from "axios";

export default defineNuxtPlugin(async (nuxtApp) => {
    //l'URL base
    axios.defaults.baseURL = "http://localhost";
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["Accept"] = "application/json";
    
    // cookies 
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;


    //Endpoint configurat per Laravel sanctum per obtenir la cookie CRSF inicial
    await axios.get("/sanctum/csrf-cookie");

    //Interceptors
    axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if ([401, 419].includes(error.response.status)) {
          const { logout } = useAuth();
          logout();
        } else {
          return Promise.reject(error);
        }
      }
    );
})
