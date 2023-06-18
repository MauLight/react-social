import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from './Masonry'
import Spinner from './Spinner'

const Feed = () => {

  const [loading, setLoading] = useState(true)

  if (loading) return <Spinner message="We're adding new ideas to your feed!" />

  return (
    <div>Feed</div>
  )
}

export default Feed
