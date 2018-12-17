<template>
  <div>
    <h2 v-for="(item, index) in topTen" :key="index">{{item}}</h2>
    <button @click="scrapeTwo(mainurl)">top 10</button>
    <button @click="scrapweb(altUrl)">scrap the web</button>
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
      isScraping: false,
      mainurl: "https://www.digitaltrends.com/mobile/best-ipad-cases/",
      altUrl:
        "https://phoenix.craigslist.org/search/ggg?query=web+design&is_paid=all",
      listings: [],
      listingsSorted: [],
      imags: [],
      links: [],
      topTen: null
    };
  },
  methods: {
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
    },
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
  watch: {
    listingsSorted: function() {
      this.listingsSorted.forEach(listing => {
        const dupes = [];
        let i = 0;
        while (i < this.listingsSorted.length) {
          if (listing.title === this.listingsSorted[i].title) {
            dupes.push(i);
            console.log(this.listingsSorted[i].title);
          }
          console.log(dupes);
        }
      });
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
