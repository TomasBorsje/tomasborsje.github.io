import { Component } from "react";
import portfolio_data from "./portfolio_data.json";
import PortfolioEntry from "./PortfolioEntry";
import "./PortfolioBody.css";
import PortfolioAboutMe from "./PortfolioAboutMe";

/**
 * Body of the portfolio page. Renders a list of PortfolioEntry objects from portfolio_data.json.
 */
class PortfolioBody extends Component {
    render() {
        const portfolioEntries = [];
        let key = 0;

        portfolio_data.forEach((entry) => {
            portfolioEntries.push(<PortfolioEntry entry={entry} key={key++}/>);
        });

        return(
            <div>
                <PortfolioAboutMe/>
                <div id="PortfolioBody">
                    {portfolioEntries}
                </div>
            </div>
        )
    }
}

export default PortfolioBody;