import "./AboutSection.css"
function AboutSection(){

    return(
        <>
        <section className="AboutSection">
            <h2>About Car Marketplace</h2>
            <div className="AboutSection-container">
                <div className="item"><img src="src\components\AboutSection\assets\world.svg"/><p>Active particpation from more than <b>150 countries</b> around the globe contributing <b>800+ post daily</b></p></div>
                <div className="item"><img src="src\components\AboutSection\assets\handshake.svg"/><p>Leading the way, alongside with <b>4.8/5 user statafisication</b></p></div>
                <div className="item"><img src="src\components\AboutSection\assets\artifical-inteligence.svg"/><p>Only leading platform powered by <b>Expert AI</b> to aid decision-making proccess</p></div>
            </div>
        </section>
        </>
    )
}

export default AboutSection