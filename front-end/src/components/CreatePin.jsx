import { useState } from "react"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { MdCategory, MdDelete } from "react-icons/md"
import { useNavigate } from "react-router-dom"

import { client } from "../client"
import Spinner from "./Spinner"
import { genres } from "../utils/data"

const CreatePin = ({ user }) => {

  const [title, setTitle] = useState('')
  const [logline, setLogline] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(false)
  const [genre, setGenre] = useState('')
  const [imageAsset, setImageAsset] = useState(null)
  const [screenplay, setScreenplay] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)
  const [wrongFileType, setWrongFileType] = useState(false)

  const navigate = useNavigate()

  console.log(user)

  const uploadCover = (obj) => {
    const { type, name } = obj[0]

    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false)
      setLoading(true)

      client.assets
        .upload('image', obj[0], { contentType: type, filename: name })
        .then((document) => {
          setImageAsset(document)
          setLoading(false)

        })
        .catch((error) => {
          console.log('Image upload error', error)
        })
    }
    else {
      setWrongImageType(true)
    }
  }

  const uploadScript = (obj) => {
    const { type, name } = obj[0]

    if (type === 'application/pdf') {
      setWrongFileType(false)
      setLoading(true)

      client.assets
        .upload('file', obj[0], { filename: name })
        .then((document) => {
          setScreenplay(document)
          setLoading(false)

        })
        .catch((error) => {
          console.log('Screenplay upload error', error)
        })

    }
    else {
      setWrongFileType(true)
    }
  }

  const saveScreenplay = () => {
    if (title && logline && genre && imageAsset._id && screenplay._id) {
      const doc = {
        _type: 'pin',
        title,
        logline,
        genre,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        manuscript: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: screenplay?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        }
      }

      client.create(doc)
        .then(() => {
          navigate('/')
        })

    }
    else {
      setFields(true)
      setTimeout(() => setFields(false), 2000)
    }
  }


  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {
        fields && (
          <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in" >Please fill in all the fields.</p>
        )
      }
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0 7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {
              loading && <Spinner />
            }
            {
              wrongImageType && <p>Wrong image type.</p>
            }
            {
              !imageAsset ? (
                <label>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <AiOutlineCloudUpload />
                      </p>
                      <p className="text-lg">
                        Click to upload
                      </p>
                    </div>
                    <p className="mt-32 text-gray-400" >
                      Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20 MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-cover"
                    onChange={(e) => uploadCover(e.target.files)}
                    className="w-0 h-0"
                  />
                </label>
              )
                :
                (
                  <div className="relative h-full">
                    <img src={imageAsset?.url} alt="cover-preview" className="h-full w-full" />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => setImageAsset(null)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                )
            }
          </div>
        </div>
        <div className="bg-secondaryColor p-3 flex flex-0 7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {
              loading && <Spinner />
            }
            {
              wrongFileType && <p>Wrong file type.</p>
            }
            {
              !screenplay ? (
                <label>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <AiOutlineCloudUpload />
                      </p>
                      <p className="text-lg">
                        Click to upload
                      </p>
                    </div>
                    <p className="mt-32 text-gray-400" >
                      Use only PDF files less than 20 MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-screenplay"
                    onChange={(e) => uploadScript(e.target.files)}
                    className="w-0 h-0"
                  />
                </label>
              )
                :
                (
                  <div className="relative h-full items-center justify-center flex">
                    <p>{screenplay.originalFilename}</p>
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => setScreenplay(null)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                )
            }
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your screenplay's title"
            className="outline-none text-2xl sm:text-3xl border-b-2 border-gray-200 p-2"
          />
          {
            user && (
              <div className="flex gaap-2 my-2 items-center bg-white rounded-lg">
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-full"
                  alt="user-profile"
                />
                <p className="font-bold" >{user.username}</p>
              </div>
            )
          }
          <input
            type='text'
            value={logline}
            onChange={(e) => setLogline(e.target.value)}
            placeholder="Add your logline"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <p className="mb-2 font-semibold text-lg sm:text-xl">Choose a Genre</p>
            <select
              onChange={(e) => setGenre(e.target.value)}
              className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
            >
              <option value='other' className="bg-white">Select Genre</option>
              {
                genres.map((elem) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black" key={elem.name} value={elem.name} >{elem.name}</option>
                ))
              }
            </select>
          </div>
          <div className="flex justify-end items-end mt-5">
            <button
              type="button"
              onClick={saveScreenplay}
              className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
