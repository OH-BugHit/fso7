describe('Blog app', () => {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    beforeEach(function () {
      const user = {
        username: 'tester',
        name: 'Olli Testaa',
        password: 'ofrew49rfzoke4'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    })

    it('succeeds with correct credentials', function () {
      cy.get('input[name="Username"').type('tester')
      cy.get('input[name="Password"').type('ofrew49rfzoke4')
      cy.contains('login').click()
      cy.contains('Olli Testaa logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input[name="Username"').type('tester')
      cy.get('input[name="Password"').type('en tiiä')
      cy.contains('login').click()
      cy.get('.error').contains('invalid username or password')

      cy.contains('Olli Testaa logged in').should('not.exist')
    })
    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'tester', password: 'ofrew49rfzoke4' })
      })

      it('a new blog can be created', function () {
        cy.contains('new blog').click()
        cy.get('input[name="title"]').type('Blogin title')
        cy.get('input[name="author"').type('Blogin author')
        cy.get('input[name="url"').type('Blogin URL')
        cy.get('.createButton').click()
        cy.get('.success').contains(
          'a new blog "Blogin title" by Blogin author, added'
        )
        cy.contains('Blogin title Blogin author')
      })

      describe('When blog created', function () {
        beforeEach(function () {
          cy.postBlog({
            title: 'TitleTest',
            author: 'AuthorTest',
            url: 'BlogTest'
          })
        })

        it('blog can be liked', function () {
          cy.get('.blogItem').contains('view').click()
          cy.get('.blogItem').contains('likes: 0')
          cy.get('.blogItem').contains('like').click()
          cy.get('.blogItem').contains('likes: 1')
        })

        it('blog can be removed', function () {
          cy.get('.blogItem').contains('view').click()
          cy.get('.removeBlog').click()
          cy.get('.success').contains("'TitleTest' removed")
          cy.get('html').should('not.contain', '.blogItem')
        })

        it('remove button cannot be seen by another user', function () {
          cy.get('.logoutButton').click()
          const user = {
            username: 'tester2',
            name: 'Olli Testaa2',
            password: 'SADFr323w4'
          }
          cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
          cy.get('input[name="Username"').type('tester2')
          cy.get('input[name="Password"').type('SADFr323w4')
          cy.contains('login').click()
          cy.get('.blogItem').contains('view').click()
          cy.get('.blogItem').should('not.contain', '.removeBlog')
        })
      })

      describe('When several blogs created', function () {
        beforeEach(function () {
          cy.postBlog({
            title: 'Title1',
            author: 'Olli Hilke',
            url: 'https://www.linkedin.com/in/ollihi/'
          })
          cy.postBlog({
            title: 'Title2',
            author: 'Olli Hilke',
            url: 'https://www.linkedin.com/in/ollihi/'
          })
          cy.postBlog({
            title: 'Title3',
            author: 'Olli Hilke',
            url: 'https://www.linkedin.com/in/ollihi/'
          })
          cy.postBlog({
            title: 'Title4',
            author: 'Olli Hilke',
            url: 'https://www.linkedin.com/in/ollihi/'
          })
          cy.postBlog({
            title: 'Title5',
            author: 'Olli Hilke',
            url: 'https://www.linkedin.com/in/ollihi/'
          })
        })

        it('the blogs are sorted by likes (most likes at top)', function () {
          cy.get('.blogItem').contains('view').click()
          cy.get('.blogItem').contains('view').click()
          cy.get('.blogItem').contains('view').click()
          cy.get('.blogItem').contains('view').click()
          cy.get('.blogItem').contains('view').click()
          cy.get('li').eq(3).should('contain', 'Title4')
          cy.get('li').eq(3).contains('like').click()
          cy.get('li').eq(0).should('contain', 'Title4')
          cy.get('li').eq(0).contains('like').click()
          cy.get('li').eq(4).should('contain', 'Title5')
          cy.get('li').eq(4).contains('like').click()
          cy.get('li').eq(1).should('contain', 'Title5')
          cy.get('li').eq(4).should('contain', 'Title3')
          cy.get('li').eq(4).contains('like').click()
          cy.get('li').eq(2).should('contain', 'Title3')
          cy.get('li').eq(2).contains('like').click()
          cy.get('li').eq(1).should('contain', 'Title3')
          cy.get('li').eq(1).contains('like').click()
          cy.get('li').eq(0).should('contain', 'Title3')
          cy.get('li').eq(1).should('contain', 'Title4')
          cy.get('li').eq(2).should('contain', 'Title5')
          cy.get('li').eq(3).should('contain', 'Title1')
          cy.get('li').eq(4).should('contain', 'Title2')
        })
      })
    })
  })
})
