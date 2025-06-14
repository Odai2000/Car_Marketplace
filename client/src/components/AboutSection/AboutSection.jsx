import "./AboutSection.css"
import world from './assets/world.svg';
import handshake from './assets/handshake.svg';
import ai from './assets/artifical-inteligence.svg';

function AboutSection(){

    return(
        <>
        <section className="AboutSection">
            <h2>About Car Marketplace</h2>
            <div className="AboutSection-container">
                <div className="item"><img src={world}/><p>Active particpation from more than <b>150 countries</b> around the globe contributing <b>800+ post daily</b></p></div>
                <div className="item"><img src={handshake}/><p>Leading the way, alongside with <b>4.8/5 user statafisication</b></p></div>
                <div className="item"><img src={ai}/><p>Only leading platform powered by <b>Expert AI</b> to aid decision-making proccess</p></div>
            </div>
        </section>
        </>
    )
}

export default AboutSection