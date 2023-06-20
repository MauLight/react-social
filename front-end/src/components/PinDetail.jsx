import { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Tilt from 'react-parallax-tilt';

import { client, urlFor } from '../client'
import MasonryLayout from './Masonry'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({ user }) => {

  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0])

          if (data[0]) {
            const query2 = pinDetailMorePinQuery(data[0])
            client.fetch(query2)
              .then((res) => setPins(res))
          }
        })
    }
  }

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
          location.reload()
        });
    }
  };

  const ImageHolder = ({ title, logline, genre, img, position }) => {
    return (
      <div className='mx-auto w-[40vh] h-[60vh] object-cover object-center rounded-3xl group relative overflow-hidden'>

        <img className={`mx-auto w-[40vh] h-[60vh] object-cover ${position} rounded-[30px] group-hover:scale-125 transition-all duration-500`} src={img} alt='' />
      </div>
    )
  }

  /*
  const ImageHolder = ({ title, logline, genre, img, position }) => {
    return (
      <div className='mx-auto w-[40vh] h-[60vh] object-cover object-center rounded-[30px] group relative overflow-hidden'>

        <div className='group-hover:bg-black/60 w-full h-full absolute z-40 transition-all duration-300'></div>

        <img className={`mx-auto w-[40vh] h-[60vh] object-cover ${position} rounded-[30px] group-hover:scale-125 transition-all duration-500`} src={img} alt='' />

        <div className="flex">
          <div className='absolute -bottom-full left-12 text-white font-secondary group-hover:bottom-6 transition-all duration-500 z-50'>{`${title} - ${genre}`}</div>

        </div>
        <div className='absolute -bottom-full font-tertiary left-2 px-10 group-hover:bottom-14 transition-all duration-700 z-50'><span className='text-lg text-white'>{logline}</span></div>
      </div>
    )
  }
*/

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])

  if (!pinDetail) return <Spinner message="Loading..." />

  return (
    <>
      <div className="flex xl-flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className="flex justify-center items-center items-center md:items-start flex-initial">
          <div className="flex flex-wrap">
            <Tilt className='mx-5 mx-auto my-10' tiltMaxAngleX={2.5} tiltMaxAngleY={2.5} glareEnable={true} glareMaxOpacity={0.15} glareColor={"black"} glareBorderRadius='30px' >
              <ImageHolder title={pinDetail.title} genre={pinDetail.genre} logline={pinDetail.logline} img={pinDetail?.image && urlFor(pinDetail.image).url()} />
            </Tilt>
          </div>
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div>
            <div className="flex justify-between">
              <h1 className='text-4xl font-bold break-words mt-3'>
                {pinDetail.title}
              </h1>
              <p className='mt-3 font-bold'>#{pinDetail.genre}</p>
            </div>
            <Link to={`/user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mb-1 ml-1 items-center">
              <p>By </p>
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={pinDetail.postedBy?.image}
                alt="user-profile"
              />
              <p className="font-semibold capitalize">{pinDetail.postedBy?.username}</p>
            </Link>
            <div className="flex justify-between items-center">
              <p className='mt-3'>{pinDetail.logline}</p>
            </div>
          </div>
          <div className="flex items-center justify-between my-8">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.manuscript?.asset?.url}?dl=`}
                download
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="bg-white w-12 h-12 p-2 rounded-full flex items-center justify-center text-dark text-3xl opacity-75 hover:opacity-100 hover:shadow-md duration-300 ease-in-out outline-none"
              >
                <MdDownloadForOffline />
              </a>
              <a
                href={`${pinDetail.manuscript?.asset?.url}?dl=`}
                download
                onClick={(e) => {
                  e.stopPropagation();
                }}

              >
                <p>Download</p>
              </a>
            </div>
          </div>


          <h2 className='mt-5 text-2xl'>
            Comments
          </h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail.comments?.map((comment, i) => (
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i} >
                <img
                  src={comment.postedBy.image}
                  alt='user-profile'
                  className='w-10 h-10 rounded-full cursor-pointer'
                />
                <div className="flex flex-col">
                  <p className='font-bold'>
                    {comment.postedBy.username}
                  </p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-warp mt-6 gap-3">
            <Link to={`/user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mb-1 ml-1 items-center">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={pinDetail.postedBy?.image}
                alt="user-profile"
              />
            </Link>
            <input
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              type='text'
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {
        pins ? (
          <>
            <h2 className='text-center font-bold text-2x mt-8 mb-4'>
              More like this
            </h2>
            <MasonryLayout pins={pins} />
          </>
        )
          :
          (
            <Spinner message="Loading more Screenplays..." />
          )
      }
    </>
  )
}

export default PinDetail