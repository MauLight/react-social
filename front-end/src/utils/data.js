
export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`
    return query
}

export const searchQuery = (searchTerm) => {
    const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}'] {
        image {
            asset -> {
                url
            }
        },
        manuscript {
            asset -> {
                url
            }
        },
        _id,
        logline,
        genre,
        destination,
        postedBy->{
            _id,
            username,
            image
          },
          save[]{
            _key,
            postedBy->{
              _id,
              username,
              image
            }
        }
    }`
    return query
}

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    manuscript{
      asset->{
        url
      }
    },
        _id,
        logline,
        genre,
        destination,
        postedBy->{
            _id,
            username,
            image
        },
        save[]{
            _key,
            postedBy->{
              _id,
              username,
              image
          },
        },
      } `

export const pinDetailQuery = (pinId) => {
    const query = `*[_type == "pin" && _id == '${pinId}']{
          image{
            asset->{
              url
            }
          },
          manuscript{
            asset->{
                url
            }
          },
          _id,
          title, 
          logline,
          genre,
          postedBy->{
            _id,
            username,
            image
          },
         save[]{
            postedBy->{
              _id,
              username,
              image
            },
          },
          comments[]{
            comment,
            _key,
            postedBy->{
              _id,
              username,
              image
            },
          }
        }`;
    return query;
};


export const pinDetailMorePinQuery = (pin) => {
    const query = `*[_type == "pin" && genre == '${pin.genre}' && _id != '${pin._id}' ]{
            image{
                asset->{
                  url
                }
              },
              manuscript{
                asset->{
                  url
                }
              },
                  _id,
                  logline,
                  genre,
                  destination,
                  postedBy->{
                      _id,
                      username,
                      image
                  },
                  save[]{
                      _key,
                      postedBy->{
                        _id,
                        username,
                        image
                    },
                  },
                } `
    return query;
};

export const genres = [
    {
        name: 'action',
        image: 'https://i.postimg.cc/y8Qf60cd/action.jpg',
    },
    {
        name: 'adventure',
        image: 'https://i.postimg.cc/cL49NFK2/adventure.jpg',
    },
    {
        name: 'comedy',
        image: 'https://i.postimg.cc/CLrgXPJr/comedy.jpg',
    },
    {
        name: 'epic',
        image: 'https://i.postimg.cc/DyPgwHR5/epic.jpg',
    },
    {
        name: 'fantasy',
        image: 'https://i.postimg.cc/RZwgKq31/fantasy.jpg',
    },
    {
        name: 'horror',
        image: 'https://i.postimg.cc/HkJVh705/horror.jpg',
    },
    {
        name: 'romance',
        image: 'https://i.postimg.cc/N0sTP0Mw/romance.jpg',
    },
    {
        name: 'sci-fi',
        image: 'https://i.postimg.cc/7LtD8BxZ/sci-fi.jpg',
    },
    {
        name: 'thriller',
        image: 'https://i.postimg.cc/VLJKDDhF/thriller.jpg',
    },
];