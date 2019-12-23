import React from 'react';
import './App.css';
import SubmissionList from './submissionItem/Submission'
import SubModel from "./Models/submodel";
import {cloudnewsserv, reddit_news, sections} from "./enum/urls";

class App extends React.Component {

    constructor(props) {
        // Required step: always call the parent class' constructor
        super(props);

        const NO_DATA = new SubModel("","", "No data to show", 0, 1, 0);

        // this.onNews = this.onNews.bind(this);

        this.state = {
            subs: [],
            section : sections.TECH
        };
        //Setting subs as a array of SubModels would be nicer.
    }

    onClearsubs = () => {
        this.setState({ subs: [] });
    };

    onNews = () => {
        this.onClearsubs();
        this.setState({ section: sections.NEWS });
        console.log("section = " + this.state.section);
        this.load_subs(sections.NEWS);
    };

    onTech = () => {
        this.onClearsubs();

        this.setState({ section: sections.TECH });
        console.log("section = " + this.state.section);

        this.load_subs(sections.TECH);
    };

    componentDidMount() {
        //Load the subs when the app opens.
        this.load_subs();
    }

    load_subs(section = this.state.section) {
        let promises = [];
        /** fetch urls from reddit_news **/
        Object.entries(section).map(([redditNewsKey, value]) => {
            let url = "";
            if (redditNewsKey === 'FRANCE'){
                url = parse_url(value);
            }else{
                url = parse_reddit_url(value, "top", 5);
            }

            const promise = fetch(url)
                .then(res => res.json());

            promises.push(promise)
        });

        // console.log("fetching : " + this.state.section);

        /** precess list of promises **/
        Promise.all(promises)
            .then(responses => {
                responses.map(response =>{
                    this.process(response)
                });
            })
            .then( (r) =>{
                console.log("proceed to sort.");
                const sorted_subs = sort_subs(this.state.subs);
                this.setState({subs: sorted_subs});
            })
            .catch(error => console.log(`Error in executing ${error}`));
    }

    process (response){
        //Response to SubModel
        let new_subs = parseResponseToModel(response);

        //calc popularity todo : not use this.state.subs but local var
        calc_pop(new_subs);

        /** update state (concatenate)**/
        this.setState((prevState) => ({
            subs : [...prevState.subs.concat(new_subs)]
        }));
    };


    render() {
        return(
            <div className="body">
                <div className="mainHeader">
                    Best website ever
                </div>
                <div className="buttonList">
                    <button className="button" onClick={this.onNews}>
                        news
                    </button>
                    <button className="button" onClick={this.onTech}>
                        Tech
                    </button>
                </div>
                <SubmissionList className="submissionList" data={this.state.subs}/>
            </div>
        )
    }
}

/** Function to parse the url for france api
 * url :
 * mode : string -> should be enum
 * nb_subs : int
 * return : full url as string
 * **/
function parse_url(url){
    // should be the format : "http://cloudnewsserv.appspot.com/get_reddit_news";
    return cloudnewsserv + url
}

/** Function to parse the url from reddit
 * url :
 * mode : string -> should be enum
 * nb_subs : int
 * return : full url as string
 * **/
function parse_reddit_url(url, mode = "top", nb_subs = 10){
    // should be the format : "https://www.reddit.com/r/worldnews/top.json?limit=1";
    // return url + mode + ".json?limit=" + nb_subs
    return cloudnewsserv + url
}

/** Function to parse the response
 * return : list of models*
 * **/
function parseResponseToModel(result) {
    const subs_to_push = [];

    //Should return list of models.
    result.data.children.forEach( item => subs_to_push.push(SubModel.toSubModel(item)));

    // for (const item of result.data.children){
    //     subs_to_push.push(SubModel.toSubModel(item))
    // }
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

