import { useState } from "react"
import { Route, Routes } from 'react-router-dom'
import { Feed, PinDetail, CreatePin, Search, Navbar } from '../components'

export const Wall = ({ user }) => {

  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar searchTerm={searchTerm} />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/category/:category-id" element={<Feed />} />
          <Route path="/pin-detail/:pin-id" element={<PinDetail user={user} />} />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
    </div>
  )
}
