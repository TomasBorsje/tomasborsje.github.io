import {Component} from "react";
import "./PortfolioHeaderBar.css";

class PortfolioHeaderBar extends Component {

    render() {
        return(
                <div id="PortfolioHeaderBar">
                    <div id="PortfolioHeaderContent">
                        <a href={"https://tomasborsje.github.io"}><img id="PortfolioHeaderIcon" src="/images/portfolio/paper-plane.png" alt={"Pixel art paper plane"}/></a>
                        <div>Tomas Borsje's Site</div>
                    </div>
                    <div className="background-images">
                        <img src="/images/portfolio/pixel-clouds.png" alt={"Pixel clouds floating in the sky"}/>
                        <img src="/images/portfolio/pixel-clouds.png" alt={"Pixel clouds floating in the sky"}/>
                    </div>
                </div>
        )
    }
}

export default PortfolioHeaderBar;