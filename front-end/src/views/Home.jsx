import { useState, useEffect, useRef, } from "react"
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom'
import { Squash as Hamburger } from 'hamburger-react'
import { Sidebar, UserProfile } from '../components'
import { Wall } from "./Wall"
import { client } from '../client'
import logo from '../assets/1.png'
import { userQuery } from "../utils/data"
import { fetchUser } from "../utils/fetchuser";

export const Home = () => {

  const [user, setUser] = useState(null)
  const [toggleSideBar, setToggleSideBar] = useState(false)
  const [reload, setReload] = useState(false)
  const scrollRef = useRef(null)
  const userInfo = fetchUser()

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const query = userQuery(userInfo?.sub)
    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })

  }, [])

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} closeToggle={setToggleSideBar} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <Hamburger className='cursor-pointer' toggled={toggleSideBar} toggle={setToggleSideBar} />
          <Link to='/'>
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </div>
      </div>
      {
        toggleSideBar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSideBar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSideBar} />
          </div>
        )
      }
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Wall user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}
