import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchuser'

const Pin = ({ pin: { postedBy, image, manuscript, _id, destination, save } }) => {

    const [postHovered, setPostHovered] = useState(false)
    const navigate = useNavigate()
    const userInfo = fetchUser()


    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === userInfo.sub))?.length // !! turns expression into a boolean

    const savePin = (_id) => {
        if (!alreadySaved) {

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: userInfo.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: userInfo.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload()
                })
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload()
            })
    }

    return (
        <div className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                {image && (
                    <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />)}
                {postHovered && (
                    <div
                        className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                        style={{ height: '100%' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <a
                                    href={`${manuscript?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="bg-white w-7 h-7 p-2 rounded-full flex items-center justify-center text-dark text-base opacity-75 hover:opacity-100 hover:shadow-md duration-300 ease-in-out outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {
                                alreadySaved?.length !== 0 ?
                                    (
                                        <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white text-xs font-bold px-3 py-1 text-base rounded-3xl hover:shadow-md outline-none duration-300 ease-in-out">
                                            {save?.length}  Saved
                                        </button>
                                    )
                                    :
                                    (
                                        <button
                                            type='button'
                                            className="bg-red-500 opacity-70 hover:opacity-100 text-white text-xs font-bold px-3 py-1 text-base rounded-3xl hover:shadow-md outline-none duration-300 ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                savePin(_id)
                                            }}
                                        >
                                            Save
                                        </button>
                                    )
                            }
                        </div>
                        <div className="flex justify-between items-center gap-2 w-full">
                            <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mb-1 ml-1 items-center">
                                <img
                                    className="w-8 h-8 rounded-full object-cover"
                                    src={postedBy?.image}
                                    alt="user-profile"
                                />
                                <p className="font-semibold capitalize">{postedBy?.userName}</p>
                            </Link>
                            {
                                postedBy?._id === userInfo.sub && (
                                    <button
                                        type='button'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deletePin(_id)
                                        }}
                                        className="bg-white opacity-70 hover:opacity-100 text-xs font-bold p-2 text-dark text-base rounded-3xl hover:shadow-md outline-none duration-300 ease-in-out"
                                    >
                                        <AiTwotoneDelete />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default Pin