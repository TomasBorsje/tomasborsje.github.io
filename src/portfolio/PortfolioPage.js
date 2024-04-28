import React, { Component } from "react";
import { changeFavicon } from "../Utils.js"
import PortfolioHeaderBar from "./PortfolioHeaderBar";
import PortfolioBody from "./PortfolioBody";

class PortfolioPage extends Component {
    componentDidMount() {
        // Change title to 'Tomas Borsje's Site'
        document.title = "Tomas Borsje's Site";
        // Change favicon to the default one
        changeFavicon("favicon.ico");
    }

    render() {
        return (
            <div>
                <PortfolioHeaderBar/>
                <PortfolioBody/>
            </div>
        );
    }
}

export default PortfolioPage;
