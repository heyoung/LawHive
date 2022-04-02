import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AppBar, Button, Container, Toolbar } from '@mui/material'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import Jobs from './views/Jobs'
import AddJob from './views/AddJob'

const theme = createTheme()

function App() {
  const navigate = useNavigate()
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Button color="secondary" onClick={() => navigate('/jobs')}>
            View Jobs
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/add-job" element={<AddJob />} />
        </Routes>
      </Container>
    </ThemeProvider>
  )
}

export default App
