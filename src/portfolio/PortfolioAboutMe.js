import {Component} from "react";
import "./PortfolioAboutMe.css";

class PortfolioAboutMe extends Component {
    render() {
        return (
            <div id={"PortfolioAboutMe"}>
                <div id="PortfolioEntryTextBody">
                    <div id="PortfolioEntryTitle">About Me</div>
                    <div id="PortfolioAboutMeDescription">Hey, I'm Tomas! I'm a 22 year old software engineer with a passion for coding. I enjoy working on various personal projects spanning across games in my spare time.</div>
                    <div id="PortfolioAboutMeDescription">In 2024, I graduated from VUW with a Bachelors of Engineering (Honours) with first class honours. I've also been working as an RPA developer since 2021.</div>
                    <div id="PortfolioAboutMeDescription">Below is a list of my personal projects. I recommend checking out Duskfall's showcase video if you'd like to see my Java/Spigot work. Thanks!</div>
                </div>
            </div>
        )
    }
}

export default PortfolioAboutMe;