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

        //todo : use enum an maping instead of this
        const response1 = this.postsFetcher('https://www.reddit.com/r/worldnews/top.json?limit=2');
        const response2 = this.postsFetcher('https://www.reddit.com/r/news/top.json?limit=2');

        //todo : setstate here?
        /** Process array of Promises into one **/
        Promise.all([response1, response2])
            .then(responses =>{
                responses.forEach(response=>{
                    let tmp;
                    tmp = process(response.json());
                    return tmp
                }).then(a =>{
                    console.log("coucou, a=" + a)
                });
            })
            .catch(error => console.log(`Error in executing ${error}`));

        /** Process one Promises **/
        const process = (response_json) =>{
            response_json.then(data =>{

                //Response to SubModel
                const parsed_subs = parseResponseToModel(data);

                //calc popularity todo : not use this.state.subs but local var
                calc_pop(data);

                return data;

                /** update state (concatenate)**/
                // this.setState((prevState) => ({
                //     subs : [...prevState.subs.concat(parsed_subs)]
                // }));
            });
        };

        //Other method
        // let p  = await Promise.all([response1, response2]);
        /** Process parsing when p resolved **/
        // this.process_responses(p)
        //     .then(subs =>{
        //         const sorted_subs = sort_subs(subs);
        //         this.setState({subs:sorted_subs})
        //     });
    }

    async process_responses(p) {
        let subs_to_sort = [];
        for (const response of p) {
            response.json().then(data =>{
                subs_to_sort = process_response(data);
            });
        }
        return subs_to_sort
    }


    async postsFetcher(url) {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // const new_subs = parseResponseToModel(result.data.children);
                    console.log("posts " + url + "loaded !");
                    return result;
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

function process_response(data) {
    console.log("response_data = " + data);

    //Response to SubModel
    const parsed_subs = parseResponseToModel(data);

    //calc popularity todo : not use this.state.subs but local var
    calc_pop(parsed_subs);

    return parsed_subs;
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

