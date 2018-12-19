import React from 'react'
import { Link } from 'gatsby'
import $ from "jquery";

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'
import Slector from '../components/slector'

import style from '../styles/index.module.sass'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.buildurl = this.buildurl.bind(this);
    this.scrapweb = this.scrapweb.bind(this);
    this.findListing = this.findListing.bind(this);
    this.sortListings = this.sortListings.bind(this);
    this.flatten = this.flatten.bind(this);


  };
  state = {
    listings: [],
    listingsSorted: []
  }
  buildurl(statecl) {
    const urlInfo = `${statecl.state}d/web-html-info-design/search/web`;
    const urlGig = `${statecl.state}search/ggg?query=${
      statecl.search
      }&is_paid=all`;
    console.log(urlGig);

    this.scrapweb(urlInfo);
    setTimeout(() => {
      this.scrapweb(urlGig);
    }, 1000);
  }
  scrapweb(url) {
    this.isScraping = true;
    $.get(
      `https://api.allorigins.ml/get?method=raw&url=${encodeURIComponent(
        url
      )}&callback=?`,
      response => {
        this.isScraping = false;
        // console.log(response);
        this.findListing(response);
        // this.getLinks(response);
      }
    );
  }

  // finds all of the listings in there and pushes them into an array
  findListing(data) {
    const tempListings = this.state.listings.concat(data.match(/<p class="result-info">[\s\S]*?<\/p>/gi))
    this.setState({ listings: tempListings })
    this.flatten(this.state.listings, "listings");
    this.sortListings(this.state.listings);
  }
  // takes out all of the parts of the listing I neeed
  sortListings(data) {
    const tempArr = [];
    data.forEach(listing => {
      const tempObj = {
        datePosted: listing
          .match(/title="(.*?)"/gi)[0]
          .slice(0, -1)
          .substring(7),
        linkto: listing.match(
          /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
        )[0],
        title: listing
          .match(/">(.*?)<\/a>/gi)[0]
          .slice(0, -4)
          .substring(2)
      };
      tempArr.push(tempObj);

    });


    this.setState({ listingsSorted: tempArr })
  }
  // takes one of the links found from one sites and sends it to the scraper

  flatten(arr, dataEl) {
    const temp = arr;
    if (dataEl === "listings") {
      this.setState({ listings: temp.flat() })
      // this.state.listings = temp.flat();
    }

  }

  render() {
    return (

      <Layout>
        <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
        <div className={style.wraper}>
          <Slector build={this.buildurl}>

          </Slector>
          <ul className={style.list}>
            {this.state.listingsSorted.map((link, index) => (
              <li key={index} className={style.list__listing}>
                <span className="list__listing__date">date posted: {link.datePosted}</span>
                <span className="list__listing__link">
                  link to listing:
          <a href={link.linkto}>{link.title}</a>
                </span>


              </li>
            ))}

          </ul>
        </div>
      </Layout>
    )
  }
}
export default IndexPage
