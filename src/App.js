import React from 'react';
import './App.css';
import SubmissionList from './submissionItem/Submission'
import SubModel from "./Models/submodel";
import {reddit_news} from "./enum/urls";

class App extends React.Component {
    constructor(props) {
        // Required step: always call the parent class' constructor
        super(props);

        this.state = {
            subs: []
        };
        //Setting subs as a array of SubModels would be nicer.
    }

    componentDidMount() {
        /*
        const sub = new SubModel("www.google.com", "Leanne Graham", 11);
        this.setState({subs: [sub]});
        */
        //this.state.subs.push(sub);
        /*
        const subs_fetched = this.postsfetcher();
        this.setState({subs: subs_fetched});
        */

        Object.entries(reddit_news).map(([redditNewsKey, value]) => {

            const url = parse_url(value, "top", 5);

            console.log("fetching : " + url);

            //call API to retrieve posts
            this.postsFetcher(url);



        });
    }

    componentDidUpdate() {

        console.log("updated!");
        //todo : Little problem here, update each time we have a fetch.
        calc_pop(this.state.subs);

        //Sort the subs and modify state after.
        sort_subs(this.state.subs);

        for (let i = 0; i < this.state.subs.length; i++) {
            console.log(this.state.subs[i].popularity)
        }
    }

    postsFetcher(url) {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    const new_subs = [];
                    //Should return list of models.
                    for (const item of result.data.children){
                        new_subs.push(SubModel.toSubModel(item))
                    }

                    // TODO : not set state here but add ubs to larger list.
                    //Add new subs to previous one in the state
                    this.setState(prevState => ({
                        subs: [...prevState.subs.concat(new_subs)]
                    }))

                    //TODO : call functions to sort the sub here?

                    // this.setState({subs: new_subs})
                },
                // Error handler
                (error) => {
                    console.log("could not connect to : " + url);
                    //TODO : error handling
                    return null
                }
            )
    }

    render() {
        return(
            <div className="body">
                <div className="mainHeader">
                    Best website ever
                </div>
                <SubmissionList data={this.state.subs}/>
            </div>

        )
    }
}

/** Function to parse the url
 * mode : string -> should be enum
 * nb_subs : int
 * **/
function parse_url(url, mode = "top", nb_subs = 10){
    // "https://www.reddit.com/r/worldnews/top.json?count=1";
    return url + mode + ".json?limit=" + nb_subs
}

/** Function to parse the response**/
function parseResponse(result) {
    const subs = [];
    //Should return list of models.
    for (const item of result.data.children){
        subs.push(SubModel.toSubModel(item))
    }
    return subs
}

/**
 * Compute popularity of all submissions from their subscribers of subreddit and upvotes.
 * void return
 * **/
function calc_pop(subs) {
    subs.forEach(function(sub) {
        sub.popularity = sub.score / sub.subreddit_subscribers
    });
}

/**
 * Function to sort the submissions by their popularity.
 * Bubble sort
 * **/
function sort_subs(subs) {

    const len = subs.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {

            if(subs[j].popularity < subs[i].popularity){
                const tmp_sub =  subs[i];
                subs[i] = subs[j];
                subs[j] = tmp_sub;
            }
        }
    }

    //Todo: remove
    for (let i = 0; i < len; i++) {
        console.log("in sort : " + subs[i].popularity)
    }
}

export default App;

