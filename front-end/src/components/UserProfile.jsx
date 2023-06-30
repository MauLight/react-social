import { useState, useEffect } from "react"
import { AiOutlineLogout } from "react-icons/ai"
import { useParams, useNavigate } from "react-router-dom"
import { googleLogout } from '@react-oauth/google'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from "../client"
import MasonryLayout from './Masonry'
import Spinner from "./Spinner"
import { Button } from "@nextui-org/react"

const UserProfile = () => {

  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Written')
  const [actBtn, setActBtn] = useState('created')
  const navigate = useNavigate()
  const { userId } = useParams()

  const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
  const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'

  useEffect(() => {
    const query = userQuery(userId)
    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })
  }, [userId])

  useEffect(() => {
    if (text === 'Written') {
      const createdPinsQuery = userCreatedPinsQuery(userId)
      client.fetch(createdPinsQuery)
        .then((data) => {
          setPins(data)
        })
    }
    else {
      const savedPinsQuery = userSavedPinsQuery(userId)
      client.fetch(savedPinsQuery)
        .then((data) => {
          setPins(data)
        })
    }
  }, [text, userId])

  if (!user) {
    return <Spinner message='Loading profile...' />
  }

  return (
    <div className="relative pb-2 h-full justify-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-[500px] 2xl:h-510 shadow-lg object-cover"
              src="https://i.postimg.cc/SQ7KkBd9/11.jpg"
              alt="user-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.username}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {
                userId === user._id && (
                  <div className="flex items-center">
                    <p className="text-white mr-2">Log Out</p>
                    <button
                      type='button'
                      className=' border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'
                      onClick={() => {
                        googleLogout();
                        localStorage.clear()
                        navigate('/login')
                      }}
                    >
                      <AiOutlineLogout color='red' fontSize={21} />
                    </button>
                  </div>
                )
              }
            </div>
          </div>
          <div className="flex justify-center text-center mb-7">

            <Button onPress={(e) => {
              setText(e.target.textContent)
              setActBtn('created')
            }} auto color="gradient" rounded bordered>
              <p className="px-2">Written</p>
            </Button>
            <Button onPress={(e) => {
              setText(e.target.textContent)
              setActBtn('saved')
            }} auto color="gradient" rounded bordered>
              <p className="px-3">Saved</p>
            </Button>
          </div>

          {
            pins?.length ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            )
              :
              (
                <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                  <p>No screenplays found!</p>
                </div>
              )
          }

        </div>
      </div>
    </div >
  )
}

export default UserProfile
