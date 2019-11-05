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

    }

    //Mock data
    /*
    subs = [
        { id: 1, title: "Leanne Graham", url: "www.google.com",upvote: 11 },
        { id: 2, title: "Ervin Howell", url: "a great title",upvote: 12 },
        { id: 3, title: "Clementine Bauch", url: "a great title",upvote: 13 },
        { id: 4,  title: "Patricia Lebsack", url: "a great title",upvote: 14 }
    ];
    */

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

            const url = parse_url(value, "top", 2);

            console.log("fetching : " + url);

            //call API to retrieve posts
            this.postsFetcher(url);

            //Sort the subs and modify state after.
            sort_subs(this.subs);


        });

        for (let redditNewsKey in reddit_news) {
            console.log(redditNewsKey);

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

/**compute popularity of all submissions from their subscribers of subreddit and upvotes.
 * return << 1
 * **/
function calc_pop(subs) {

    for(const sub in subs){

    }
    //return ups/subscribers
}

/**
 * Function to sort the submissions by their score. 
 * **/
function sort_subs(subs) {
    //Todo : implement sorting algorithm
    const sorted_subs = null;

    return sorted_subs
}

export default App;

