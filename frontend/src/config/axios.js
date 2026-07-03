import axios from 'axios';
const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
})

axiosInstance.interceptors.response.use(

    response => response,

    error => {

        // no internet
        if (!error.response) {
            return Promise.reject(
                new Error(
                    "Please check your internet connection."
                )
            );
        }

        else if(error.response?.status===401){

    localStorage.clear();

    window.location="/login";
}
else if(status>=500){
throw new Error(
    "Our servers are having trouble."
);
}
        const message =
            error.response.data?.message ||
            "Something went wrong.";

        return Promise.reject(
            new Error(message)
        );
    }
);

export default axiosInstance;