import { render, screen } from '@testing-library/react'
import React from 'react'
import App from './App'

test('renders hello world', () => {
  render(<App />)
  const spanElement = screen.getByText(/Hello world/i)
  expect(spanElement).toBeInTheDocument()
})
