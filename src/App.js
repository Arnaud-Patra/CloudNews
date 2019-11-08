import React from 'react';
import './App.css';
import SubmissionList from './submissionItem/Submission'
import SubModel from "./Models/submodel";
import {reddit_news} from "./enum/urls";

class App extends React.Component {


    constructor(props) {
        // Required step: always call the parent class' constructor
        super(props);

        const NO_DATA = new SubModel("","", "No data to show", "", 3, 3);


        this.postsFetcher = this.postsFetcher.bind(this);

        this.state = {
            subs: [NO_DATA]
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

        //todo : use enum an maping instead of this
        const response1 = fetch('https://www.reddit.com/r/worldnews/top.json?limit=2');
        const response2 = fetch('https://www.reddit.com/r/news/top.json?limit=2');



        //todo : setstate here?
        /** Process array of Promises**/
        Promise.all([response1, response2])
            .then(files =>{
                files.forEach(file=>{
                    process(file.json());
                })
            })
            .catch();

        /** Process one Promises and send to parse **/
        const process = (prom) =>{
            prom.then(data =>{
                console.log(data);

                const subs = parseResponse(data);

                this.setState((prevState) => ({
                    subs : [...prevState.subs.concat(subs)]
                }));

            });

            //this.setState({subs: subs});
        };



        /** update state (concatenate)**/
        // this.setState(prevState => {
        //     const subs = [...prevState.subs.concat(new_subs)];
        //     return {
        //         subs,
        //     };
        // });

        // const response = await fetch(`https://www.reddit.com/r/worldnews/top.json?count=2`);
        // const json = await response.json();


        //todo : Little problem here, update each time we have a fetch.
        calc_pop(this.state.subs);

        for (let i = 0; i < this.state.subs.length; i++) {
            console.log(this.state.subs[i].popularity)
        }

        //Sort the subs and modify state after.
        sort_subs(this.state.subs);

        for (let i = 0; i < this.state.subs.length; i++) {
            console.log(this.state.subs[i].popularity)
        }

        //Todo : view does not take change into account.
        //this.setState({subs: new_subs})

    }


    async postsFetcher(url) {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {

                    //todo : do that after we have all the data?

                    // const new_subs = [];
                    // //Should return list of models.
                    // for (const item of result.data.children){
                    //     new_subs.push(SubModel.toSubModel(item))
                    // }
                    // return new_subs;
                    return result

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
    // should be the format : "https://www.reddit.com/r/worldnews/top.json?limit=1";
    return url + mode + ".json?limit=" + nb_subs
}

/** Function to parse the response**/
function parseResponse(result) {

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
}

export default App;

