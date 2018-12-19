import { Link, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import citydata from '../data/citys.json'
let selected = "Please select one"
let query = ""

function selectHandler(e) {
    selected = e.target.value
}
function queryHandler(e) {
    query = e.target.value
}

class slector extends React.Component {
    constructor(props) {
        super(props);

        this.sendState = this.sendState.bind(this);
        this.sendSavedState = this.sendSavedState.bind(this);

    };
    sendState() {
        if (query === "") {
            query = "web design"
        }
        const search = query.split(" ").join("+");
        const data = {
            state: selected,
            search
        };
        this.props.build(data)
    }
    saveSearch() {
        const search = {
            savedQuery: query,
            selectedState: selected
        }
        localStorage.setItem("savedSearch", JSON.stringify(search));
    }
    sendSavedState() {
        const savedSearch = JSON.parse(localStorage.getItem("savedSearch"))
        selected = savedSearch.selectedState
        query = savedSearch.savedQuery
        this.sendState()
    }
    render() {
        return (
            <div>
                <label>search</label>
                <input type="text" id="query" onChange={queryHandler} />
                <select onChange={selectHandler}>
                    <option disabled value>Please select one</option>
                    {citydata.map((link, index) => (

                        <option
                            value={link.link} key={index}>
                            {link.state}

                        </option>
                    ))}

                </select>
                <button onClick={this.sendState}>search</button>
                <button onClick={this.saveSearch}>save this search</button>
                <button onClick={this.sendSavedState}>run saved search</button>
            </div >
        )

    }
}
export default slector
