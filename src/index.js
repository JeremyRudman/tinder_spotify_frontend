import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {MdClose, MdMenu} from 'react-icons/md';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profilesList: [],
            matched: [],
            rejected: [],
            modes: "profiles",
            hideSide: true
        };
    }

    componentDidMount() {
        fetch("https://concert-companion.appspot.com/api/userprofile")
            .then(data => data.json())
            .then(responce => console.log(responce))
            .catch(error => console.log(error));
        var fakedata = [{
            name: 'Jeremy', email: "jeremyrudman@gmail.com", genre: 'Pop',
            artists: ['Taylor Swift', 'Kanye West']
        },
            {name: 'Vicky', email: "vicky@gmail.com", genre: 'Pop', artists: ['Ariana Grande', 'Rihanna']},
            {name: 'Patrick', email: "fatrick1999@gmail.com", genre: 'Rock', artists: ['AC/DC', 'Guns N\' Roses']},
            {name: 'Apurav', email: "apurav.khare@gmail.com", genre: 'Pop', artists: ['Beyoncé', 'Katy Perry']},];
        this.setState({
            profilesList: fakedata
        })
    }

    dislikeUser(user) {
        const tempR = this.state.rejected;
        const tempP = this.state.profilesList;
        tempR.push(user);
        tempP.splice(tempP.indexOf(user), 1);
        this.setState({
            profilesList: tempP,
            rejected: tempR
        })
    }

    matchedUser(user) {
        const tempM = this.state.matched;
        const tempP = this.state.profilesList;
        tempM.push(user);
        tempP.splice(tempP.indexOf(user), 1);
        this.setState({
            profilesList: tempP,
            matched: tempM
        })
    }

    formatArtist(data) {
        for (let i = 1; i < data.length; i++) {
            data[i] = ' ' + data[i]
        }
        return data.toString()
    }

    removeMatched(user) {
        const tempM = this.state.matched;
        const tempP = this.state.profilesList;
        tempP.push(user);
        tempM.splice(tempM.indexOf(user), 1);
        this.setState({
            profilesList: tempP,
            matched: tempM
        })
    }

    removeRejected(user) {
        const tempR = this.state.rejected;
        const tempP = this.state.profilesList;
        tempP.push(user);
        tempR.splice(tempR.indexOf(user), 1);
        this.setState({
            profilesList: tempP,
            rejected: tempR
        })
    }

    formatMatched(data) {
        return data.map((item) =>
            <div className="userListing">
                <div className="username">&nbsp;{item.name}</div>
                <div className="genre">{item.email}</div>
                <div className="artist">{this.formatArtist(item.artists)}</div>
                <button className="reject" onClick={this.removeMatched.bind(this, item)}><MdClose
                    className="reject_icon"/></button>
            </div>
        )
    }

    formatRejected(data) {
        return data.map((item) =>
            <div className="userListing">
                <div className="username">&nbsp;{item.name}</div>
                {/*<div className="genre">{item.genre}</div>*/}
                <div className="artist">{this.formatArtist(item.artists)}</div>
                <button className="reject" onClick={this.removeRejected.bind(this, item)}><MdClose
                    className="reject_icon"/></button>
            </div>
        )
    }

    formatData(data) {
        return data.map((item) =>
            <div className="userListing">
                <div className="username">&nbsp;{item.name}</div>
                {/*<div className="genre">{item.genre}</div>*/}
                <div className="artist">{this.formatArtist(item.artists)}</div>
                <button className="reject" onClick={this.dislikeUser.bind(this, item)}><MdClose
                    className="reject_icon"/></button>
                <button className="accept" onClick={this.matchedUser.bind(this, item)}>Match</button>
            </div>
        )
    }

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    setMode(mode) {
        this.setState({
            modes: mode
        })
    }

    sidebarHide(){
        if(!this.state.hideSide){
            document.getElementById("sidebar").style.display = "none"
        }else{
            document.getElementById("sidebar").style.display = "block"
        }
        this.setState({
            hideSide: !this.state.hideSide
        })
    }

    render() {
        var displayProfiles;
        var label;
        if (this.state.modes === 'profiles') {
            displayProfiles = this.formatData(this.state.profilesList);
        } else if (this.state.modes === 'matched') {
            displayProfiles = this.formatMatched(this.state.matched);
            label = "Email";
        } else {
            displayProfiles = this.formatRejected(this.state.rejected)
        }
        return (
            <div>
                <div className="header">
                    <button className="menuB"
                    onClick={
                        this.sidebarHide.bind(this)
                    }><MdMenu style={{height:"25px", width:"25px"}}/></button>
                    <span>Concert Companion</span></div>
                <div id="sidebar" className="sidebar">
                    <div className="sideEntry" onClick={this.setMode.bind(this, "profiles")}>Find</div>
                    <div className="sideEntry" onClick={this.setMode.bind(this, "matched")}>Matched</div>
                    <div className="sideEntry" onClick={this.setMode.bind(this, "rejected")}>Rejected</div>
                </div>
                <div className="profiles">
                    <div className="userListing">
                        <span>&nbsp; Name</span>
                        <span style={{position: "sticky", left: "20%"}}>{label}</span>
                        <span style={{position: "sticky", left: "50%"}}>Favorite Artists</span>
                    </div>
                    {displayProfiles}
                </div>
            </div>
        );

    }
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
