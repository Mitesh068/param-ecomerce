import React from 'react'
import AppRoutes from './AppRoutes/Index'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#BC0507', dark: '#8F0002', contrastText: '#FFFFFF' },
    secondary: { main: '#151515', contrastText: '#FFFFFF' },
    background: { default: '#F7F7F7', paper: '#FFFFFF' },
    text: { primary: '#000000', secondary: '#555555' },
    divider: '#C0C0C0',
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: '"Figtree", sans-serif',
    h1: { fontFamily: '"Slabo 13px", serif' },
    h2: { fontFamily: '"Slabo 13px", serif' },
    h3: { fontFamily: '"Slabo 13px", serif' },
    h4: { fontFamily: '"Slabo 13px", serif' },
    h5: { fontFamily: '"Slabo 13px", serif' },
    h6: { fontFamily: '"Slabo 13px", serif' },
    button: { fontFamily: '"Roboto", sans-serif', fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: { styleOverrides: { containedPrimary: { '&:hover': { backgroundColor: '#8F0002' } } } },
    MuiLink: { styleOverrides: { root: { color: '#BC0507' } } },
    MuiOutlinedInput: { styleOverrides: { notchedOutline: { borderColor: '#C0C0C0' } } },
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  )
}