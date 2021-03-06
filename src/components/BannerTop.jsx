import React from 'react';
import  infoIcon from '../assets/img/info-icon.png';
import  closeIcon from '../assets/img/close-icon.png';

class BannerTop extends React.Component {
    constructor(props) {
        super(props);
        
        this.onInfo = this.onInfo.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
    
    }

    onInfo() {
        this.props.handleSwap("contact", "open");
    }

    onClose() {
        this.props.handleSwap(this.props.swapElement, "close");
    }

    render() {
        return (
            <nav id="banner-top" className="navbar navbar-expand-lg">
              <a id="banner-title" className="navbar-nav mr-auto navbar-brand" href="/">DONATS</a>
              <div id="banner-info" className="navbar-nav ml-auto" onClick={this.onInfo}><img src={infoIcon} alt="info icon" /></div>
              <div id="banner-close" className="navbar-nav ml-auto" onClick={this.onClose}><img src={closeIcon} alt="close icon" /></div>
            </nav>
        )
    }
}

export default BannerTop;
