import {Component} from "react";
import "./PortfolioEntry.css";

class PortfolioEntry extends Component {
    render() {
        return(
            <div id="PortfolioEntryBody">
                <div id="PortfolioEntryTextBody">
                    <div id="PortfolioTitleContainer">
                        <div id="PortfolioEntryTitle">{this.props.entry.name}</div>
                        <div id="PortfolioEntryTitleTag">{this.props.entry.tag}</div>
                    </div>

                    <div id="PortfolioEntryDescription">{this.props.entry.description}</div>
                    <a id="PortfolioEntryLink" href={this.props.entry.link}>View Repository</a>
                    {this.props.entry.video && (
                        <a id="PortfolioEntryLink" href={this.props.entry.video}>Watch Showcase Video</a>
                    )}
                </div>
                <div id="PortfolioEntryIconBody">
                    <img id="PortfolioEntryIcon" alt={this.props.entry.icon_url} src={"images/portfolio/"+this.props.entry.icon_url}/>
                </div>
            </div>
        )
    }
}

export default PortfolioEntry;