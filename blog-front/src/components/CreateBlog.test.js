import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

describe('Create blog tests', () => {
  test('creating blog calls onSubmit with correct data', async () => {
    const mockCreateBlog = jest.fn()

    render(<CreateBlog createBlog={mockCreateBlog} />)
    const sendButton = screen.getByText('create')
    const inputTitle = screen.getByPlaceholderText('type title here')
    const inputAuthor = screen.getByPlaceholderText('type author here')
    const inputUrl = screen.getByPlaceholderText('type url here')

    await userEvent.type(inputTitle, 'Title test')
    await userEvent.type(inputAuthor, 'Author test')
    await userEvent.type(inputUrl, 'Url test')
    await userEvent.click(sendButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe('Title test')
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('Author test')
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('Url test')
  })
})