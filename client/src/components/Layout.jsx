//For test only
import NavBar from "./nav/NavBar"
import Hero from "./Hero/Hero"
import Post from "./Post/Post"

function Layout (){
    return(
        <>
        <header>
            <NavBar/>
        <Hero/>
        </header>
        
        <Post/>
        </>
    )
}

export default Layout
