import React from 'react'
import "./SubmissionStyle.css";


function SubmissionItem(props){
    return(
        <div className="submissionItem">
            {props.key}
            <div className="subreddit">
                {"r/" + props.subreddit}
            </div>
            <div className="sub_title">
                {props.title}
            </div>
            <a href={props.url} className='url'>
                {props.url}
            </a>
            <div className="score">
                {props.score}
            </div>
            <div className="pop">
                {props.popularity}
            </div>
        </div>

    )
}

function SubmissionList(props) {
    return(
        <div className="submissionList">
            {
                props.data.map(c => <SubmissionItem key={c.id} subreddit={c.subreddit} title={c.title} url={c.url} score={c.score} popularity={c.popularity}/>)
            }
        </div>
    )
}

export default SubmissionList