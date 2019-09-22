import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';

import Config from './config.jsx'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import moment from "moment"
moment().format();

const schema = {
    query: gql`
        {
            links {
                URL,
                Description,
                Added
            }
        }
    `,
}

function formatTime(str)
{
    return moment.utc(str).fromNow();
}

class List extends React.Component {
    render() {
        return (
            <div>
                <h1>Links</h1>
                <Query query={schema.query}>
                    {({ loading, error, data }) => {
                        if (loading || error) return <div></div>;

                        const rows = [];

                        data.links.forEach((link) => {
                            rows.push(
                                <li key={link.URL}>
                                    <a href={link.URL}>{link.Description}</a><br/>
                                    <span className="date">{formatTime(link.Added)}</span>
                                </li>
                            );
                        });

                        return (
                            <ul className="links">{rows}</ul>
                        );
                    }}
                </Query>
            </div>
        )
    }
}

const httpLink = createHttpLink({
    uri: Config().uri
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <List />
    </ApolloProvider>,
    document.getElementById('app')
);
