import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from './Masonry'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'

const Feed = () => {

  const [loading, setLoading] = useState(true)
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams()

  useEffect(() => {
    if (categoryId) {
      const query = searchQuery(categoryId)
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })

    } else {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }
  }, [categoryId])

  if (loading) return <Spinner message="We're adding new ideas to your feed!" />
  if (pins?.length === 0) return <Spinner message="We're adding new screenplays to your feed!" />

  return (
    <div>
      {
        pins && <MasonryLayout pins={pins} />
      }
    </div>
  )
}

export default Feed
