import './ThemeChangeAnime.css'
import { useContext } from 'react'
import { themesContext } from '../Context/UserCredsContext'

export default function ThemeChangeAnime() {
    const {theme} = useContext(themesContext)
    return (
        <div 
            style={{...theme === 'dark' && {backgroundColor: 'white'}}}
            className='themeChanger'
        ></div>  
    )
}
