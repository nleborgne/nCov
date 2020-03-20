<template lang="html">

<div id="app" v-cloak>

<div id="page">

  <h1 class="mb-4 d-none d-xl-block">covid-19 dashboard</h1>
  <h2 class="mb-4 d-xl-none">covid-19 dashboard</h2>

  <transition name="fade">
  <div id="main-box" class="col-md-4 col-xs-10 mx-auto p-3 shadow" v-if="show">
    <h3 class="grey">
      {{cases}} cases
    </h3>
    <h6 v-if='newCases>0'>{{newCases}}</h6>

    <h3 class="red">
      {{deaths}} deaths
    </h3>

    <h3 class="green">
      {{recovered}} recovered
    </h3>

    <h6>Last update : {{lastUpdated}}</h6>
  </div>
</transition>

<h4 class="mt-5 d-block d-lg-none d-xl-none">Open this page on your laptop to browse all the functionnalities.</h4>

<div class="d-none d-lg-block d-xl-block">
<h4 class="mt-5">Countries</h4>
<div class="row mb-5">

<div id="table" class="mx-auto col-xs-12 col-md-6 mb-5 ml-5">
  <div class="row mx-auto">
    <div class="col-6">
          <el-input v-model="filters[0].value" placeholder="Country"></el-input>
    </div>

    <div class="col-6">
          <el-input v-model="filters[1].value" placeholder="Province"></el-input>
    </div>

  </div>
  <data-tables :data="apiCountriesConfirmed" :pagination-props="{ pageSizes: [10] }" :filters="filters">
    <el-table-column prop="countryRegion" label="Country">
    </el-table-column>
    <el-table-column prop="provinceState" label="Province">
    </el-table-column>
    <el-table-column prop="confirmed" label="Confirmed">
    </el-table-column>
    <el-table-column prop="recovered" label="Recovered">
    </el-table-column>
    <el-table-column prop="deaths" label="Deaths">
    </el-table-column>
     </data-tables>
</div>

<div class="col-md-5 mx-auto">
  <div class="col-xs-10 col-md-3 mx-auto">
    <select class="custom-select" v-model="selectedCountry" v-on:change="getGraphData(selectedCountry);">
      <option selected value='world'>World</option>
      <option v-for="country in countriesList" v-bind:key="country">{{country}}</option>
    </select>
  </div>

  <graph-line
          :width="600"
          :height="300"
          :shape="'normal'"
          :labels="this.graphLabels"
          :values="this.graphData"
          :names="graphNames"
          :textRotateX="90"
          :colors="[ '#525252', '#d63200', '#42b983' ]"
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

  // TODO NEW CASES

  data () {
    return {
      myJson:'hello',
      filters: [
        {
          prop: 'countryRegion',
          value: ''
        },
        {
          prop: 'provinceState',
          value: ''
        },

      ],
      show:false,
      cases:0,
      newCases: 0,
      deaths:0,
      newDeaths:0,
      recovered:0,
      newRecovered:0,
      apiResponse: null,
      apiCountriesConfirmed: null,
      lastUpdated:null,
      graphData: [],
      graphLabels: null,
      countriesList: null,
      selectedCountry:'world',
      graphNames:['Confirmed','Deaths','Recovered']
    }
  },
  methods: {
    updateData: function() {
      axios
        .get('https://covid19.mathdro.id/api')
        .then(response => {
          this.apiResponse = response.data;
          this.newCases=0;

          if(this.apiResponse.confirmed.value > this.cases && this.cases != 0) {
            this.newCases = this.apiResponse.confirmed.value - this.cases;
          }
          gsap.to(this.$data, 3, { cases: this.apiResponse.confirmed.value,roundProps:"cases",ease: "expo.out" } );
          gsap.to(this.$data, 3, { deaths: this.apiResponse.deaths.value,roundProps:"deaths",ease: "expo.out" } );
          gsap.to(this.$data, 3, { recovered: this.apiResponse.recovered.value,roundProps:"recovered",ease: "expo.out" } );

          var now = new Date().toLocaleString("en-EN",{timeZone:"UTC"});
          this.lastUpdated = now;
        })

        axios
          .get('https://covid19.mathdro.id/api/confirmed')
          .then(response => {
            this.apiCountriesConfirmed = response.data;
          })
    },
    getGraphData: function(country){
      axios
        .get('https://pomber.github.io/covid19/timeseries.json')
        .then(response => {
          this.myJson = response.data;
          this.getCountriesList();
          var labelArray = [];
          for(var cntr2 of this.myJson['China']) {
            cntr2;
            labelArray.push('');
          }

          if(country === 'world') {

            var confirmed = [];
            var deaths = [];
            var recovered = [];

            for(var i = 0; i < Object.values(this.myJson)[0].length; i++) {
              var sumConfirmed = 0;
              var sumDeaths = 0;
              var sumRecovered = 0;
              for(var j = 0; j < Object.values(this.myJson).length; j++) {
                sumConfirmed += Object.values(this.myJson)[j][i]['confirmed'];
                sumDeaths += Object.values(this.myJson)[j][i]['deaths'];
                sumRecovered += Object.values(this.myJson)[j][i]['recovered'];
              }
              confirmed.push(sumConfirmed);
              deaths.push(sumDeaths);
              recovered.push(sumRecovered);

            }


            this.graphLabels = labelArray;
            this.graphData = [confirmed,recovered,deaths];

          } else {

          var arrayDataConfirmed = [];
          var arrayDataDeaths = [];
          var arrayDataRecovered = [];

          for (var data of this.myJson[country]){
            arrayDataConfirmed.push(data.confirmed);
            arrayDataDeaths.push(data.deaths);
            arrayDataRecovered.push(data.recovered);
          }


          this.graphLabels = labelArray;
          this.graphData = [arrayDataConfirmed,arrayDataDeaths,arrayDataRecovered];

        }
        })


    },
    getCountriesList: function() {

      var myArray = [];

      for(var country of Object.keys(this.myJson)) {
        myArray.push(country);
      }

      this.countriesList = myArray;

    },
    setVisible: function(selector, visible) {
      document.querySelector(selector).style.display = visible ? 'block' : 'none';
    }

},
  mounted () {

    this.show=true;

    this.updateData();

    this.getGraphData(this.selectedCountry);
    window.setInterval(this.updateData,60000);

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
