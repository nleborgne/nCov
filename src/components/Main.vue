<template lang="html">

<div id="app" v-cloak>

  <div id="page">

    <h1 class="mb-4 d-none d-xl-block">covid-19 dashboard</h1>
    <h2 class="mb-4 d-xl-none">covid-19 dashboard</h2>

    <div class="col-xs-10 col-md-3 mx-auto mb-2">

      <el-select v-model="selectedCountry" v-on:change="updateData(selectedCountry);">
        <el-option value="World">World</el-option>
        <el-option
          v-for="country in countriesList"
          :key="country"
          :label="country"
          :value="country">
        </el-option>
      </el-select>
    </div>

    <h4 class="mx-auto">{{selectedCountry}} <img v-if="selectedCountry != 'World'" :src="countryImg" alt="" style="max-width:50px;height:auto;"> </h4>

    <transition name="fade">
    <div id="main-box" class="col-md-4 col-xs-10 mx-auto p-3 shadow" v-if="show">
      <h3 class="grey">
        {{cases}} cases
      </h3>

      <h3 class="red">
        {{deaths}} deaths
      </h3>

      <h3 class="green">
        {{recovered}} recovered
      </h3>

      <h6>Updated : {{updated}}</h6>
    </div>
  </transition>

  <h4 class="mt-5 d-block d-lg-none d-xl-none">Open this page on your laptop to browse all the functionnalities.</h4>

    <div class="d-none d-lg-block d-xl-block">
      <div class="row mb-5">
        <div class="col-md-5 mx-auto">

          <graph-line
                  :width="600"
                  :height="300"
                  :shape="'normal'"
                  :labels="this.graphLabels"
                  :values="this.graphData"
                  :names="graphNames"
                  :textRotateX="90"
                  :colors="[ '#525252', '#d63200']"
                  class="mx-auto">
              <note :text="'Covid-19 - cases in '+selectedCountry"></note>
              <legends :names="graphNames"></legends>
              <guideline :tooltip-y="true"></guideline>

          </graph-line>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";
import gsap from "gsap";

export default {

  data () {
    return {
      show:false,
      cases:0,
      deaths:0,
      recovered:0,
      updated:null,

      dataWorld: null,
      dataCountries:null,

      graphDataApi: null,
      graphData: [],
      graphLabels: null,

      countriesList: null,
      selectedCountry:'World',
      countryImg: null,
      graphNames:['Confirmed','Deaths']
    }
  },
  methods: {
    getData: function() {
      axios
        .get('https://corona.lmao.ninja/all')
        .then(response => {
          this.dataWorld = response.data;
          this.updated = new Date(this.dataWorld.updated);
        })
        axios
          .get('https://corona.lmao.ninja/countries')
          .then(response => {
            this.dataCountries = response.data;
            this.updateData(this.selectedCountry);
          })
    },
    updateData: function(country) {
      if(country === 'World') {
        gsap.to(this.$data, 3, { cases: this.dataWorld.cases,roundProps:"cases",ease: "expo.out" } );
        gsap.to(this.$data, 3, { deaths: this.dataWorld.deaths,roundProps:"deaths",ease: "expo.out" } );
        gsap.to(this.$data, 3, { recovered: this.dataWorld.recovered,roundProps:"recovered",ease: "expo.out" } );
      } else {
        for (var countryInfos of this.dataCountries) {
          if(countryInfos.country == country) {
            gsap.to(this.$data, 3, { cases: countryInfos.cases,roundProps:"cases",ease: "expo.out" } );
            gsap.to(this.$data, 3, { deaths: countryInfos.deaths,roundProps:"deaths",ease: "expo.out" } );
            gsap.to(this.$data, 3, { recovered: countryInfos.recovered,roundProps:"recovered",ease: "expo.out" } );
            this.countryImg = countryInfos.countryInfo.flag;
            break;
          }
        }
      }
      this.getGraphData();
    },
    getGraphData: function(){

      if(this.selectedCountry != 'World') {
      axios
        .get('https://corona.lmao.ninja/v2/historical/'+this.selectedCountry)
        .then(response => {
          this.graphDataApi = response.data.timeline;

          var arrayCases = [];
          var arrayDeaths = [];
          var arrayLabels = [];

          for(var date of Object.keys(this.graphDataApi.cases)) {
            arrayCases.push(this.graphDataApi.cases[date]);
            arrayDeaths.push(this.graphDataApi.deaths[date]);
            // We're not pushing the actual dates for display purpose
            arrayLabels.push('');
          }
          this.graphData = [arrayCases,arrayDeaths];
          this.graphLabels = arrayLabels;
        })
      } else {

        axios
          .get('https://corona.lmao.ninja/v2/historical/')
          .then(response => {
            this.graphDataApi = response.data;

            var arrayCases = [];
            var arrayDeaths = [];
            var arrayLabels = [];

            for(var i = 0; i < Object.values(this.graphDataApi[0].timeline.cases).length; i++) {
              var sumCases = 0;
              var sumDeaths = 0;
              for(var j = 0; j < this.graphDataApi.length; j++) {
                sumCases += Object.values(this.graphDataApi[j].timeline.cases)[i];
                sumDeaths += Object.values(this.graphDataApi[j].timeline.deaths)[i];
              }
              arrayCases.push(sumCases);
              arrayDeaths.push(sumDeaths);
            }

            for(var i = 0; i < Object.values(this.graphDataApi[0].timeline.cases).length; i++) {
              console.log(i);
              // We're not pushing the actual dates for display purpose
              arrayLabels.push('');
            }

            this.graphData = [arrayCases,arrayDeaths];
            this.graphLabels = arrayLabels;
          })
      }
    },
    getCountries: function() {

      var arrayCountries = [];

      axios
        .get('https://corona.lmao.ninja/countries')
        .then(response => {
          this.apiResponse = response.data;
          for(var countryInfos of this.apiResponse) arrayCountries.push(countryInfos['country'])
          this.countriesList = arrayCountries;
        })
    }
},
  mounted () {

    this.show=true;
    this.getCountries();
    this.getData();
    window.setInterval(this.getData,60000);
  }


}

</script>

<style lang="css" scoped>
[v-cloak] {display: none}
#main-box {
  background-color:#f4f4f4;
}
.green {
  color:#42b983;
}
.red {
  color:#d63200;
}
.grey {
  color: #525252;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#page {
  display:block;
}
</style>
