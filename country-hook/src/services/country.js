import axios from "axios"

const getSingle = (country) => {
    console.log(`Haetaan tieto maasta: ${country}`)
    const request = axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .catch(error => {
            console.log(`Problems fetching country... ${error.message}`)
        })
    return request.then(response => response.data)
}

export default getSingle