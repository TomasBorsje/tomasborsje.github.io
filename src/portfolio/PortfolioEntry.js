import {Component} from "react";

class PortfolioEntry extends Component {

    render() {
        return(
            <div>{this.props.entry.name + ": "+this.props.entry.description}</div>
        )
    }
}

export default PortfolioEntry;