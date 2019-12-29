import React from "react";

class SubModel extends React.Component {

    constructor(url, subreddit, title, score, subreddit_subscribers, popularity) {
        super();

        this.subreddit = subreddit;
        this.url = url;
        this.title = title;
        this.score = score;
        this.subreddit_subscribers = subreddit_subscribers;
        this.popularity = popularity
    }

    /* Method to convert reddit object into local model*/
    static toSubModel(item) {
        return new SubModel(item.url, item.subreddit, item.title, item.score, item.subreddit_subscribers);
    }
}

export default SubModel