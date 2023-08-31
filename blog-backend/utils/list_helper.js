/**
 * Funktio listaamaan .author kentät
 * @param {*} blogs ottaa parametrikseen blogit
 * @returns palauttaa blogien kirjoittajien nimet taulukossa (ei dublikaatteja)
 */
const listOfAuthors = (blogs) => {
    return [...new Set(blogs.map(blog => blog = blog.author))]
}

/**
 * Funktio selvittämään authorien kokonaistykkäysmäärät
 * @param {*} blogs ottaa parametrikseen blogit
 * @returns palauttaa oliona kokonaistykkäysmäärät authoreittain (author: ,likes:)
 */
const listLikes = (blogs) => {
    const resultList = []
    listOfAuthors(blogs).forEach(author => {
        resultList.push({
            author: `${author}`,
            likes: totalLikes(blogs.filter((blog) => blog.author === author))
        })
    })

    return resultList
}

/**
 * Testi funktio
 * @param {*} blogs ei käytä saamaansa parametriä mihinkään
 * @returns palauttaa aina 1
 */
const dummy = (blogs) => {
    return 1
}

/**
 * Laskee saamistaan blogeista yhteenlasketut tykkäykset
 * @param {*} blogs ottaa parametrikseen taulukon blogeja
 * @returns palauttaa yhteenlasketun tykkäysmäärän saamistaan blogeista
 */
const totalLikes = (blogs) => {
    return Object.values(blogs).reduce((a, b) => a + b.likes, 0)
}

/**
 * funktio tarkastaa millä blogilla on eniten tykkäyksiä ja palauttaa sen
 * @param {*} blogs ottaa parametrikseen taulukon blogeja
 * @returns palauttaa blogin jolla eniten tykkäyksiä
 */
const favoriteBlog = (blogs) => {
    return blogs.reduce((a, b) => (a.likes > b.likes) ? a : b)
}

/*
    Okei ei varmaan kauheen tehokas, mutta toimi ja tein commit tälle idealle.
    Ajatus oli käyttää map, mutta tein filtterillä vahingossa. Jätetään tänne itselle talteen muistoksi. 
    Ei vaadittu tehokkuutta onneksi tehtävänannossa 8)
    Kokeillaas parempaa tohon mostLikes...
*/
const mostBlogs = (blogs) => {
    const results = []
    blogs.forEach(author => {
        results.push(blogs.filter((blog) => blog.author === author.author))
    })
    const findWinner = results.reduce((findWinner, nextAuthor) => {
        return (Object.keys(findWinner).length >= Object.keys(nextAuthor).length) ? findWinner : nextAuthor
    })
    const winner = {
        author: findWinner[0].author,
        blogs: Object.keys(findWinner).length
    }
    return winner
}

/**
 * Funktio etsimään eniten tykkäyksiä saanut kirjoittaja
 * @param {*} blogs ottaa parametrikseen blogit
 * @returns palauttaa eniten tykkäyksiä keränneen kirjoittajan (author: ,likes:) 
 */
const mostLikes = (blogs) => {
    topList = listLikes(blogs).sort((a, b) => {
        return a.likes - b.likes
    })
    return topList[topList.length - 1]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
