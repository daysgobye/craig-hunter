<template>
  <div>
    <h2 v-for="(item, index) in topTen" :key="index">{{item}}</h2>
    <!-- <button @click="scrapeTwo(mainurl)">top 10</button>
    <button @click="scrapweb(altUrl)">scrap the web</button>-->
    <slector v-on:picked="buildurl"></slector>
    <div class="imgwrap">
      <div v-for="(item, index) in imags" :key="index">
        <img :src="item" alt>
      </div>
      <ul>
        <li style="width:100%" v-for="(link, index) in listingsSorted" :key="index">
          date posted: {{ link.datePosted }}
          <br>link to listing:
          <a :href="link.linkto">{{ link.title }}</a>
          <br>
        </li>
      </ul>
    </div>

    <!-- <div v-for="(item, index) in links" :key="`link${index}`">
      <p>{{links}}</p>
    </div>-->
  </div>
</template>

<script>
import $ from "jquery";
import slector from "./Slector.vue";

export default {
  data() {
    return {
      scrapedData: null,
      mainurl: "https://www.digitaltrends.com/mobile/best-ipad-cases/",
      altUrl:
        "https://albuquerque.craigslist.org/d/web-html-info-design/search/web",
      listings: [],
      listingsSorted: [],
      imags: [],
      links: [],
      topTen: null
    };
  },
  methods: {
    buildurl(statecl) {
      const url = `${statecl}d/web-html-info-design/search/web`;
      this.scrapweb(url);
    },
    scrapweb(url) {
      $.get(
        `https://api.allorigins.ml/get?method=raw&url=${encodeURIComponent(
          url
        )}&callback=?`,
        response => {
          // console.log(response);
          this.findListing(response);
          // this.getLinks(response);
        }
      );
    },
    scrapeTwo(url) {
      $.get(
        `https://api.allorigins.ml/get?method=raw&url=${encodeURIComponent(
          url
        )}&callback=?`,
        response => {
          this.scrapedData = response.match(/<h2>[\s|\S]*?<\/h2>/g);
          this.sortTags(this.scrapedData);
        }
      );
    },
    sortTags(data) {
      const links = [];
      const values = [];
      const titles = [];
      data.forEach(link => {
        links.push(link.match(/<a \b[^>]*>[\s|\S]*?<\/a>/g));
      });
      links.flat().forEach(title => {
        values.push(title.match(/>[\s|\S]*?</g));
      });
      values.flat().forEach(title => {
        titles.push(title.slice(1, -1));
      });
      this.topTen = titles;
    },

    // pushes links from scrape into links array
    getLinks(data) {
      this.links.push(
        data.match(/\s*href\s*=\s*(\"([^"]*\")|'[^']*'|([^'">\s]+))/g)
      );
      // this.links.flat(1);
      this.flatten(this.links, "links");
      const tempLinks = [];
      this.links.forEach(element => {
        let link = element;
        // link = link.trim();
        //cut last character
        link = link.slice(0, -1);
        //cut first character "href="
        link = link.substring(7);
        tempLinks.push(link);
      });

      this.links = tempLinks;
      // setTimeout(() => {
      //   this.newScrape();
      // }, 1000);
      setInterval(() => {
        this.newScrape();
      }, 10000);
    },
    // finds all of the listings in there and pushes them into an array
    findListing(data) {
      this.listings.push(data.match(/<p class="result-info">[\s\S]*?<\/p>/gi));
      this.flatten(this.listings, "listings");
      this.sortListings(this.listings);
    },
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

      this.listingsSorted = tempArr;
    },
    // takes one of the links found from one sites and sends it to the scraper

    newScrape() {
      let randomLink = this.links[
        Math.floor(Math.random() * (this.links.length - 2 + 1)) + 2
      ];

      if (randomLink.slice(0, 3) === "/r/") {
        const fullLink = `https://www.reddit.com${randomLink}`;
        randomLink = fullLink;
      }
      console.log("random link", randomLink);
      this.scrapweb(randomLink);
    },
    flatten(arr, dataEl) {
      const temp = arr;
      if (dataEl === "imags") {
        this.imags = temp.flat();
      } else if (dataEl === "links") {
        this.links = temp.flat();
      } else if (dataEl === "listings") {
        this.listings = temp.flat();
      }
      // arr = temp[0];
    }
  },
  components: {
    slector
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.imgwrap {
  display: flex;
  flex-wrap: wrap;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
