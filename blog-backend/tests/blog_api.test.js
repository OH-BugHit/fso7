const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { getBlogsInDB, getUsersInDB } = require('../utils/helper')
require('../utils/helper')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const Blog = require('../models/blog')
const api = supertest(app)
//tietokannassa tulee olla vähintään kaksi blogia testejä varten
var originalList = []
var loggedTester = null


beforeAll(async () => {
    //Nollataan tietokannan käyttäjät ja blogit
    await Blog.deleteMany({})
    await User.deleteMany({})

    //Luodaan käyttäjä
    const passwordHash = await bcrypt.hash('testaaja', 10)
    const user = new User({ username: 'Testi', name: 'testi', passwordHash: passwordHash })
    await user.save()
    loggedTester = await api
        .post('/api/login')
        .send({
            "username": "Testi",
            "password": "testaaja"
        })

    //Luodaan blogi
    const newBlog = {
        title: "Testiblogi1",
        author: "Olli Hilke",
        url: "testi.testi",
        likes: 1
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loggedTester.body.token}`)
        .send(newBlog)

    originalList = await getBlogsInDB(api)
})

describe('HTTP GET tests', () => {
    test('blogs are returned as json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there is correct amount of blogs', async () => {
        const response = await getBlogsInDB(api)
        expect(response.body).toHaveLength(originalList.body.length)
    })

    test('blog has field \'id\'', async () => {
        const response = await getBlogsInDB(api)
        expect(response.body[0].id).toBeDefined()
    })
})

describe('HTTP POST tests', () => {
    test('blog gets added and response contains right url', async () => {
        const newBlog = {
            title: "Testiblogi",
            author: "Olli Hilke",
            url: "testi.testi",
            likes: 1
        }

        const added = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loggedTester.body.token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await getBlogsInDB(api)

        const url = response.body.map(b => b.url)

        expect(response.body).toHaveLength(originalList.body.length + 1)
        expect(url).toContain('testi.testi')

        await api.delete(`/api/blogs/${added.body.id}`)
    })

    test('if likes is undefined or "", it sets to 0', async () => {
        const newBlog = {
            title: "LikeUnDefTesti",
            author: "Olli Hilke",
            url: "like.un.def.testi"
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loggedTester.body.token}`)
            .send(newBlog)

        expect(response.body.likes).toBe(0)

        await api.delete(`/api/blogs/${response.body.id}`)
    })

    test('if title is undefined, returns 400', async () => {
        const newBlog = {
            author: "Olli Hilke",
            url: "title.undef.test",
            likes: 1
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loggedTester.body.token}`)
            .send(newBlog)
            .expect(400)
    })

    test('if url is undefined, returns 400', async () => {
        const newBlog = {
            title: "Url undef",
            author: "Olli Hilke",
            likes: 99
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loggedTester.body.token}`)
            .send(newBlog)
            .expect(400)
    })

    test('cannot add blog if token not provided, returns 401', async () => {
        const newBlog = {
            title: "TokenNotProvided",
            author: "Olli Hilke",
            url: "testi.testi1",
            likes: 99
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('HTTP PUT test', () => {
    test('UPDATE updates blog [0] to 12 likes', async () => {
        const toUpdate = await originalList.body[0]
        toUpdate.likes = 12

        await api
            .put(`/api/blogs/${toUpdate.id}`)
            .send(toUpdate)

        const updatedBlogs = await getBlogsInDB(api)
        const updatedBlog = await updatedBlogs.body.filter(blog => blog.id === toUpdate.id)
        expect(updatedBlog[0].likes).toBe(12)
    })
})

describe('HTTP DELETE tests', () => {
    test('delete returns 204 and there is one blog less', async () => {
        const blogsBeforeDelete = await getBlogsInDB(api)
        const blogToDelete = blogsBeforeDelete.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${loggedTester.body.token}`)
            .expect(204)

        const blogsAfterDelete = await getBlogsInDB(api)

        expect(blogsAfterDelete.body).toHaveLength(blogsBeforeDelete.body.length - 1)
    })
})

describe('User Tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('salasaa', 10)
        const user = new User({ username: 'root', name: 'testi', passwordHash: passwordHash })

        await user.save()
    })

    test('create user and no dublicate allowed', async () => {
        const usersAtStart = await getUsersInDB()

        const newUser = {
            username: 'OH-BugHit',
            name: 'Olli Hilke',
            password: 'salasanas'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const usersAtEnd = await getUsersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('doesn\'t allow to create without username', async () => {
        const usersAtStart = await getUsersInDB()

        const newUser = {
            username: '',
            name: 'Joku toine',
            password: 'sssaaa'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.text).toContain("`username` is required")
    })

    test('doesn\'t allow to create without password', async () => {
        const usersAtStart = await getUsersInDB()

        const newUser = {
            username: 'Testitapaus',
            name: 'Joku toine',
            password: ''
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.text).toContain("Invalid password")
    })

    test('doesn\'t allow to create with password.length 2', async () => {
        const usersAtStart = await getUsersInDB()

        const newUser = {
            username: 'Testitapaus',
            name: 'Joku toine',
            password: 'sa'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        expect(response.text).toContain("Invalid password")
    })
})

afterAll(async () => {
    //Nollataan tietokanta ja lopetetaan
    await Blog.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
})