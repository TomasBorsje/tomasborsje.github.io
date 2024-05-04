import {Component} from "react";
import "./PortfolioEntry.css";

class PortfolioEntry extends Component {
    render() {
        return(
            <div id="PortfolioEntryBody">
                <div id="PortfolioEntryTextBody">
                    <div id="PortfolioEntryTitle">{this.props.entry.name}</div>
                    <div id="PortfolioEntryDescription">{this.props.entry.description}</div>
                    <a id="PortfolioEntryLink" href={this.props.entry.link}>View Repository</a>
                </div>
                <div id="PortfolioEntryIconBody">
                    <img id="PortfolioEntryIcon" alt={this.props.entry.icon_url} src={"images/portfolio/"+this.props.entry.icon_url}/>
                </div>
            </div>
        )
    }
}

export default PortfolioEntry;