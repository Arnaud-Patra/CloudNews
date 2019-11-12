import React from 'react';
import './App.css';
import SubmissionList from './submissionItem/Submission'
import SubModel from "./Models/submodel";
import {reddit_news} from "./enum/urls";

class App extends React.Component {


    constructor(props) {
        // Required step: always call the parent class' constructor
        super(props);

        const NO_DATA = new SubModel("","", "No data to show", 0, 1, 0);
        const Data_test = new SubModel("","", "Test0", 0, 1, 1);
        const Data_test_10 = new SubModel("","", "Test10", 0, 1, 10);


        this.postsFetcher = this.postsFetcher.bind(this);

        this.state = {
            subs: [NO_DATA, Data_test_10, Data_test]
        };
        //Setting subs as a array of SubModels would be nicer.
    }

    onClearsubs = () => {
        this.setState({ subs: [] });
    };


    async componentDidMount() {
        /** fetch urls from reddit_news **/
        /*
        Object.entries(reddit_news).map(async ([redditNewsKey, value]) => {

            const url = parse_url(value, "top", 5);

            console.log("fetching : " + url);

            //call API to retrieve posts
            const response = this.postsFetcher(url); //call fetcher
            console.log(response);

            subs.concat(response) //Add subs to array
        });
        */

        const promise_worldnews = fetch('https://www.reddit.com/r/worldnews/top.json?limit=3')
            .then(res => res.json());
        const promise_news = fetch('https://www.reddit.com/r/news/top.json?limit=3')
            .then(res => res.json());

        Promise.all([promise_news, promise_worldnews])
            .then(responses => {
                    console.log("responses : "); //called when values arrive
                    console.log(responses); //called when values arrive
                    responses.map(response =>{
                        process(response)
                    });

                    console.log("state = " + this.state.subs); //called when values arrive
                })
            .then( () =>{
                console.log("proceed to sort.");
                const sorted_subs = sort_subs(this.state.subs);
                this.setState({subs: sorted_subs})
            })
            .catch(error => console.log(`Error in executing ${error}`));

        /** Process one Promise **/
        const process = (response) =>{
            console.log("starting process, data = ");
            console.log(response);
            //Response to SubModel
            let new_subs = parseResponseToModel(response);

            //calc popularity todo : not use this.state.subs but local var
            calc_pop(new_subs);

            /** update state (concatenate)**/
            this.setState((prevState) => ({
                subs : [...prevState.subs.concat(new_subs)]
            }));
        };

        // //todo : use enum an maping instead of this
        // const response1 = this.postsFetcher('https://www.reddit.com/r/worldnews/top.json?limit=2');
        // const response2 = this.postsFetcher('https://www.reddit.com/r/news/top.json?limit=2');
        //
        // //todo : setstate here?
        // /** Process array of Promises into one **/
        // Promise.all([response1, response2])
        //     .then(responses =>{
        //         responses.forEach(response=>{
        //             let tmp;
        //             tmp = process(response);
        //             return tmp
        //         }).then(a =>{
        //             console.log("coucou, a=" + a)
        //         });
        //     })
        //     .catch(error => console.log(`Error in executing ${error}`));

    }

    async postsFetcher(url) {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // const new_subs = parseResponseToModel(result.data.children);
                    // console.log("posts " + url + " loaded !");
                    return result;
                },
                // Error handler
                (error) => {
                    console.log("error : " + error);
                    //todo : error handling
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
 * return : full url as string
 * **/
function parse_url(url, mode = "top", nb_subs = 10){
    // should be the format : "https://www.reddit.com/r/worldnews/top.json?limit=1";
    return url + mode + ".json?limit=" + nb_subs
}

/** Function to parse the response
 * return : list of models*
 * **/
function parseResponseToModel(result) {

    const subs_to_push = [];

    //Should return list of models.
    for (const item of result.data.children){
        subs_to_push.push(SubModel.toSubModel(item))
    }
    return subs_to_push
}

/**
 * Compute popularity of all submissions from their subscribers of subreddit and upvotes.
 * void return
 * **/
function calc_pop(subs) {
    subs.forEach(function(sub) {
        sub.popularity = 1000 * sub.score / sub.subreddit_subscribers
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
    return new_subs;
}

export default App;

