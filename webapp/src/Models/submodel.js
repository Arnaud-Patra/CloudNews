import React from "react";

class SubModel extends React.Component {

    constructor(url, subreddit, title, score, popularity) {
        super();

        this.subreddit = subreddit;
        this.url = url;
        this.title = title;
        this.score = score;
        this.popularity = popularity
    }

    /* Method to convert reddit object into local model*/
    static toSubModel(item) {
        return new SubModel(item.data.url, item.data.subreddit, item.data.title, item.data.score);
    }
}

export default SubModel