import React from 'react';
import './App.css';
import SubmissionList from './submissionItem/Submission'
import SubModel from "./Models/submodel";
import {reddit_news} from "./enum/urls";

class App extends React.Component {
    constructor(props) {
        // Required step: always call the parent class' constructor
        super(props);

        this.postsFetcher = this.postsFetcher.bind(this);

        this.state = {
            subs: []
        };
        //Setting subs as a array of SubModels would be nicer.
    }

    onClearsubs = () => {
        this.setState({ subs: [] });
    };


    componentDidMount() {

        //fetch urls from reddit_news
        Object.entries(reddit_news).map(([redditNewsKey, value]) => {

            const url = parse_url(value, "top", 5);

            console.log("fetching : " + url);

            //call API to retrieve posts
            this.postsFetcher(url);
        });


        console.log("updated!");
        //todo : Little problem here, update each time we have a fetch.
        calc_pop(this.state.subs);

        for (let i = 0; i < this.state.subs.length; i++) {
            console.log(this.state.subs[i].popularity)
        }

        //Sort the subs and modify state after.
        const new_subs = sort_subs(this.state.subs);

        for (let i = 0; i < this.state.subs.length; i++) {
            console.log(this.state.subs[i].popularity)
        }

        //Todo : view does not take change into account.
        this.setState({subs: new_subs})

    }

    componentDidUpdate() {




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

                    // TODO : not set state here but add ubs to larger list?
                    //Add new subs to previous one in the state
                    // this.setState(prevState => ({
                    //     subs: [...prevState.subs.concat(new_subs)]
                    // }))
                    this.setState(prevState => {
                        const subs = [...prevState.subs.concat(new_subs)];
                        return {
                            subs,
                        };
                    });
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
                <button type="button"  onClick={this.onClearsubs} />
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
    const new_subs = subs;

    const len = new_subs.length;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {

            if(new_subs[j].popularity < new_subs[i].popularity){
                const tmp_sub =  new_subs[i];
                new_subs[i] = new_subs[j];
                new_subs[j] = tmp_sub;
            }
        }
    }
    subs.push(new SubModel("test","test", "test", "test", 3, 3))
    //Todo: remove
    // for (let i = 0; i < len; i++) {
    //     console.log("after sort : " + subs[i].popularity)
    // }
    return new_subs
}

export default App;

