import { NavLink, Link } from 'react-router-dom'
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/1.png'
import { genres } from '../utils/data';

const Sidebar = ({ user, closeToggle }) => {

  const isActiveStyle = "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black hover:text-black transition-all duration-200 ease-in-out capitalize"
  const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize"

  const handleCloseSideBar = () => {
    if (closeToggle) closeToggle(false)
  }

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scrikk min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSideBar}
        >
          <img src={logo} alt='logo' className='w-full' />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to='/'
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={handleCloseSideBar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover genres</h3>
          {genres.map((category) => (
            <NavLink
              to={`/genre/${category.name}`}
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleCloseSideBar}
              key={category.name}
            >
              <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar


