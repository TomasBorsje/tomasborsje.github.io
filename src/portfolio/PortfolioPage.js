import React, { Component } from "react";
import { changeFavicon } from "../Utils.js"

class PortfolioPage extends Component {
    componentDidMount() {
        // Change title to 'Tomas Borsje's Site'
        document.title = "Tomas Borsje's Site";
        // Change favicon to the default one
        changeFavicon("favicon.ico");
    }

    render() {
        return (
            <div>This is a WIP portfolio page. If you're seeing this, the router is working correctly.</div>
        );
    }
}

export default PortfolioPage;
