import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { BookToc } from './pages/BookToc'
import { BooksIndex } from './pages/BooksIndex'
import { ControlRoom } from './pages/ControlRoom'
import { Lab } from './pages/Lab'
import { Reader } from './pages/Reader'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<ControlRoom />} />
          <Route path="books" element={<BooksIndex />} />
          <Route path="books/:bookId" element={<BookToc />} />
          <Route path="lab" element={<Lab />} />
          <Route path="read" element={<Reader />} />
          <Route path="library" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
