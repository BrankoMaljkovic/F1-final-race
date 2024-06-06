import { Redirect } from 'react-router-dom';


export default function Home() {

    let audio = new Audio("/sound/soundloader.mp3")

    const start = () => {
        audio.play()
    }

    const handleStart = () => {
        start();
        setTimeout(() => {
            window.location.href = '/drivers'
        }, 3000);
        
    };
    

    

    return (
        <div className="home-container">
            <video autoPlay loop muted className="background-video">
                <source src="/sound/Run_this_town.mp4" type="video/mp4" />
            </video>


            <div className="sound-btn">
                <img src="/img/buttonstart-cropped.jpg" onClick={handleStart} className="ignition-button"/>
            </div>
        </div>
    );
}