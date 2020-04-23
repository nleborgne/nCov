<template lang="html">

<div id="app" v-cloak>

  <modal v-if="showModal1">
    <h3 slot="header">Stay safe</h3>

    <div slot="body">
      <p>In order to stop the spread of Covid-19, it is important that every one of us take measures, in order to protect ourselves and the others.</p>
      <p>Here are a few tips from <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019" target="_blank">WHO</a> about basic protective measures against the virus.</p>
      <img src="coronavirus.png" alt="" style="width:100px; display:block;margin-left:auto;margin-right:auto;">
    </div>

    <div slot="footer">
      <button class="btn btn-secondary mr-4" type="button" name="button" @click="showModal1 = false;">
        Skip
      </button>
      <button class="btn btn-dark" @click="showModal1 = false; showModal2 = true;">
        Next&nbsp;<i class="fas fa-long-arrow-alt-right"></i>
      </button>
    </div>
  </modal>

  <modal v-if="showModal2" @close="showModal2 = false; showModal3 = true;">
    <h3 slot="header">Wash your hands frequently</h3>

    <div slot="body">
      <p>Regularly and thoroughly clean your hands with an alcohol-based hand rub or wash them with soap and water.</p>
      <p><strong>Why?</strong> Washing your hands with soap and water or using alcohol-based hand rub kills viruses that may be on your hands.</p>
      <img src="hand-wash.png" alt="" style="width:100px; display:block;margin-left:auto;margin-right:auto;">
    </div>

    <div slot="footer">
      <button class="btn btn-secondary mr-4" type="button" name="button" @click="showModal2 = false;">
        Skip
      </button>
      <button class="btn btn-dark" @click="showModal2 = false; showModal3 = true;">
        Next&nbsp;<i class="fas fa-long-arrow-alt-right"></i>
      </button>
    </div>
  </modal>

  <modal v-if="showModal3" @close="showModal3 = false; showModal4 = true;">
    <h3 slot="header">Maintain social distancing</h3>

    <div slot="body">
      <p>Maintain at least 1 metre (3 feet) distance between yourself and anyone who is coughing or sneezing.</p>
      <p><strong>Why?</strong> When someone coughs or sneezes they spray small liquid droplets from their nose or mouth which may contain virus. If you are too close, you can breathe in the droplets, including the COVID-19 virus if the person coughing has the disease.</p>
      <img src="distance.png" alt="" style="width:100px; display:block;margin-left:auto;margin-right:auto;">
    </div>

    <div slot="footer">
      <button class="btn btn-secondary mr-4" type="button" name="button" @click="showModal3 = false;">
        Skip
      </button>
      <button class="btn btn-dark" @click="showModal3 = false; showModal4 = true;">
        Next&nbsp;<i class="fas fa-long-arrow-alt-right"></i>
      </button>
    </div>
  </modal>

  <modal v-if="showModal4" @close="showModal4 = false;">
    <h3 slot="header">If you have fever, cough and difficulty breathing, seek medical care early</h3>

    <div slot="body">
      <p>Stay home if you feel unwell. If you have a fever, cough and difficulty breathing, seek medical attention and call in advance. Follow the directions of your local health authority.</p>
      <p><strong>Why?</strong> National and local authorities will have the most up to date information on the situation in your area. Calling in advance will allow your health care provider to quickly direct you to the right health facility. This will also protect you and help prevent spread of viruses and other infections.</p>
      <img src="sneezing.png" alt="" style="width:100px; display:block;margin-left:auto;margin-right:auto;">
    </div>

    <div slot="footer">
      <button class="btn btn-success" type="button" name="button" @click="showModal4 = false;">
        I'll stay safe!
      </button>
    </div>
  </modal>

  <loading :active.sync="isLoading"
  :is-full-page="fullPage"
  :opacity="0.9"></loading>

  <img src="virus.png" style="width:50px;margin-top:-50px;" class="mx-auto" alt="">

  <div id="page" class="col-10 mx-auto">

    <a id="switch" @click="darkThemeSwitch"><i class="far fa-moon fa-2x"></i></a>

    <div class="col-xs-10 col-md-6 mx-auto">

      <el-select
        v-model="selectedCountry"
        v-on:change="updateData(selectedCountry);"
        class="col-12"
        filterable
      >
        <el-option value="World">World</el-option>
        <el-option
          v-for="country in countriesList"
          :key="country"
          :label="country"
          :value="country"
          >
        </el-option>
      </el-select>

    </div>

    <h4 class="mx-auto mt-4">{{selectedCountry}} <img v-if="selectedCountry != 'World'" :src="countryImg" alt="" style="max-width:50px;height:auto;"> </h4>
    <div class="row">

      <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Cases</h5>
          <span class="card-text">
            <h3 class="lightblue">{{cases.toLocaleString()}}</h3>
            <h5 v-if='todayCases > 0' class="lightblue">+ {{todayCases.toLocaleString()}} today</h5>
          </span>
        </div>
    </div>

    <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Deaths</h5>
        <span class="card-text">
          <h3 class="red">{{deaths.toLocaleString()}}</h3>
          <h5 v-if='todayDeaths > 0' class="red">+ {{todayDeaths.toLocaleString()}} today</h5>
        </span>
      </div>
  </div>

    <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Recovered</h5>
        <span class="card-text">
          <h3 class="green">{{recovered.toLocaleString()}}</h3>
          <h5 v-if='todayCases>0||todayDeaths>0' class="green">{{(cases-deaths-recovered).toLocaleString()}} remaining</h5>
        </span>
      </div>
  </div>
</div>
<div class="row mb-2">

    <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Active</h5>
        <span class="card-text">
          <h3 class="darkblue">{{active.toLocaleString()}}</h3>
        </span>
      </div>
    </div>

  <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Critical</h5>
      <span class="card-text">
        <h3 class="orange">{{critical.toLocaleString()}}</h3>
      </span>
    </div>
  </div>

  <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Tests</h5>
      <span class="card-text">
        <h3 class="purple">{{tests.toLocaleString()}}</h3>
      </span>
    </div>
  </div>


  <div id="main-box" class="col-11 mx-auto text-center shadow-sm rounded my-4 py-2">
    <span>
      Last update: {{updated}}
    </span>
  </div>


</div>

<button class="btn btn-sm btn-primary mx-auto" @click="showModal1 = true">Advices from WHO</button>


      <div class="col-xs-12 col-md-10 my-5 mx-auto">
          <div class="hello" ref="chartdiv"></div>
      </div>
      <div class="col-12 mt-5 mx-auto row">
        <div class="col">
          <div class="col-xs-12 mb-2">
            <h5>Countries with most cases (global)</h5>
            <div id="barchart" ref="bar2div"></div>
          </div>
          <div class="col-xs-12">
            <h5>Countries with most cases per million inhabitants</h5>
            <div id="barchart" ref="bardiv"></div>
          </div>
        </div>

        <div class=" col-xs-12 col-md-7">
          <h5>world map</h5>
          <div id="mapdiv"></div>
        </div>

      </div>

  </div>
  <footer class="footer">
    <div class="container">
      <span id="madeby" class="text-muted">made by <a href="https://builtbynlb.com/" target="_blank">nlb</a></span>
      <span>&nbsp;|&nbsp;</span>
      <span>Stay safe <i class="fas fa-heart"></i></span>

    </div>
</footer>
</div>
</template>

<script>
import axios from "axios";
import gsap from "gsap";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

am4core.useTheme(am4themes_animated);

import Modal from './Modal.vue';

export default {
  components: {
    Loading,
    Modal
  },
  data () {
    return {
      showModal1:false,
      showModal2:false,
      showModal3:false,
      showModal4:false,
      isLoading: false,
      fullPage: true,
      show:false,
      cases:0,
      todayCases:0,
      deaths:0,
      todayDeaths:0,
      recovered:0,
      active:0,
      critical:0,
      tests:0,
      updated:null,

      dataWorld: null,
      dataCountries:null,
      dataCountriesMap:[],

      graphDataApi: null,
      graphData: [],
      graphLabels: null,

      countriesList: null,
      selectedCountry:'World',
      countryImg: null,
      graphNames:['Confirmed','Deaths'],
      theme:'light'
    }
  },
  methods: {
    getData: function() {
      this.isLoading = true;
      axios
        .get('https://corona.lmao.ninja/v2/all')
        .then(response => {
          this.dataWorld = response.data;

          let day = new Date(this.dataWorld.updated).getDate();
          let month = new Date(this.dataWorld.updated).getMonth()+1;
          let hour = new Date(this.dataWorld.updated).getHours();
          let minutes = new Date(this.dataWorld.updated).getMinutes();
          let seconds = new Date(this.dataWorld.updated).getSeconds();

          if (day < 10) day = '0'+day;
          if (month < 10) month = '0'+month;
          if (hour < 10) hour = '0'+hour;
          if (minutes < 10) minutes = '0'+minutes;
          if (seconds < 10) seconds = '0'+seconds;
          this.updated = day+'/'+month+'/'+new Date(this.dataWorld.updated).getFullYear()+' - '+hour+':'+minutes+':'+seconds;
        })
        axios
          .get('https://corona.lmao.ninja/v2/countries')
          .then(response => {
            this.dataCountries = response.data;

            for(let thisData of response.data) {
              this.dataCountriesMap.push({id:thisData.countryInfo.iso2,name:thisData.country,'value':thisData.cases});
            }
            // this.dataCountries2 = response.data;
            this.updateData(this.selectedCountry);
            this.createMapChart();
            this.createBarGraph();
            this.createBarGraph2();

          })
    },
    updateData: function(country) {
      if(country === 'World') {
        gsap.to(this.$data, 3, { cases: this.dataWorld.cases,roundProps:"cases",ease: "expo.out" } );
        gsap.to(this.$data, 3, { todayCases: this.dataWorld.todayCases,roundProps:"todayCases",ease: "expo.out" } );
        gsap.to(this.$data, 3, { deaths: this.dataWorld.deaths,roundProps:"deaths",ease: "expo.out" } );
        gsap.to(this.$data, 3, { todayDeaths: this.dataWorld.todayDeaths,roundProps:"todayDeaths",ease: "expo.out" } );
        gsap.to(this.$data, 3, { recovered: this.dataWorld.recovered,roundProps:"recovered",ease: "expo.out" } );
        gsap.to(this.$data, 3, { active: this.dataWorld.active,roundProps:"active",ease: "expo.out" } );
        gsap.to(this.$data, 3, { critical: this.dataWorld.critical,roundProps:"critical",ease: "expo.out" } );
        gsap.to(this.$data, 3, { tests: this.dataWorld.tests,roundProps:"tests",ease: "expo.out" } );
      } else {
        for (var countryInfos of this.dataCountries) {
          if(countryInfos.country == country) {
            gsap.to(this.$data, 3, { cases: countryInfos.cases,roundProps:"cases",ease: "expo.out" } );
            gsap.to(this.$data, 3, { todayCases: countryInfos.todayCases,roundProps:"todayCases",ease: "expo.out" } );
            gsap.to(this.$data, 3, { deaths: countryInfos.deaths,roundProps:"deaths",ease: "expo.out" } );
            gsap.to(this.$data, 3, { todayDeaths: countryInfos.todayDeaths,roundProps:"todayDeaths",ease: "expo.out" } );
            gsap.to(this.$data, 3, { recovered: countryInfos.recovered,roundProps:"recovered",ease: "expo.out" } );
            gsap.to(this.$data, 3, { active: countryInfos.active,roundProps:"active",ease: "expo.out" } );
            gsap.to(this.$data, 3, { critical: countryInfos.critical,roundProps:"critical",ease: "expo.out" } );
            gsap.to(this.$data, 3, { tests: countryInfos.tests,roundProps:"tests",ease: "expo.out" } );
            this.countryImg = countryInfos.countryInfo.flag;
            break;
          }
        }
      }
      this.getGraphData();
    },
    getGraphData: function(){
      var data = [];

      if(this.selectedCountry != 'World') {
      axios
        .get('https://corona.lmao.ninja/v2/historical/'+this.selectedCountry+'?lastdays=all')
        .then(response => {
          this.graphDataApi = response.data.timeline;

          for(var date of Object.keys(this.graphDataApi.cases)) {
            data.push({'date':date,cases:this.graphDataApi.cases[date],deaths:this.graphDataApi.deaths[date],recovered:this.graphDataApi.recovered[date]})
          }

          this.createGraph(data);

          this.isLoading = false;
        })
      } else {

        axios
          .get('https://corona.lmao.ninja/v2/historical?lastdays=all')
          .then(response => {
            this.graphDataApi = response.data;

            var arrayLabels = [];

            for(var i = 0; i < Object.values(this.graphDataApi[0].timeline.cases).length; i++) {
              var sumCases = 0;
              var sumDeaths = 0;
              var sumRecovered = 0;
              for(var j = 0; j < this.graphDataApi.length; j++) {
                sumCases += Object.values(this.graphDataApi[j].timeline.cases)[i];
                sumDeaths += Object.values(this.graphDataApi[j].timeline.deaths)[i];
                sumRecovered += Object.values(this.graphDataApi[j].timeline.recovered)[i];
              }

              data.push({date:'',cases:sumCases,deaths:sumDeaths,recovered:sumRecovered})
            }

            for(var k = 0; k < Object.values(this.graphDataApi[0].timeline.cases).length; k++) {
              // We're not pushing the actual dates for display purpose
              data[k].date = Object.keys(this.graphDataApi[0].timeline.cases)[k];
              arrayLabels.push('');
            }

            this.graphLabels = arrayLabels;

            this.createGraph(data);

            this.isLoading = false;


          })
      }
    },
    createBarGraph: function() {

      var arrayCases = {};

      // Removed islands/small countries/principalties because too population is too small to be representative
      var blacklist = ["San Marino","Andorra","Holy See (Vatican City State)","Luxembourg","Gibraltar","Faroe Islands","Isle of Man","Falkland Islands (Malvinas)","Channel Islands","Monaco","Montserrat","Liechtenstein","Iceland"];

      for(var i = 0; i < this.dataCountries.length; i++) {
        var datum = this.dataCountries[i];
        if(!blacklist.includes(datum.country)) {
          arrayCases[datum.country] = {casesPerOneMillion: datum.casesPerOneMillion,flag: datum.flag};
        }
      }


      var arrayBiggest = [];

      for(var k = 0; k < 5; k++) {
        var biggest = 0;
        var keyCountry = "";
        let flag = ""

        for (var j = 0; j < Object.keys(arrayCases).length; j++) {
          var cases = arrayCases[Object.keys(arrayCases)[j]].casesPerOneMillion;
            if(cases > biggest) {
              biggest = cases;
              keyCountry = Object.keys(arrayCases)[j];
              flag = arrayCases[Object.keys(arrayCases)[j]].flag;
          }
        }
        delete arrayCases[keyCountry];
        arrayBiggest.push({
          country:keyCountry,
          casesPerOneMillion: biggest,
          img:flag
        });
      }

      let barChart = am4core.create(this.$refs.bardiv, am4charts.XYChart);
      barChart.data = arrayBiggest;

      // Create axes
      var categoryAxis = barChart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.location = 0;

      var valueAxis = barChart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.opposite = true;

      let series = barChart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "country";
      series.dataFields.valueX = "casesPerOneMillion";

      series.columns.template.adapter.add("fill", function(fill, target) {
        return barChart.colors.getIndex(target.dataItem.index);
      });

      var image = new am4core.Image();
      image.horizontalCenter = "middle";
      image.width = 20;
      image.height = 20;
      image.verticalCenter = "middle";
      image.adapter.add("href", (href, target)=>{
        let category = target.dataItem.category;
        if(category){
          return "https://www.amcharts.com/wp-content/uploads/flags/" + category.split(" ").join("-").toLowerCase() + ".svg";
        }
        return href;
      })
      categoryAxis.dataItems.template.bullet = image;

      barChart.cursor = new am4charts.XYCursor();
      barChart.cursor.behavior = "zoomY";

      barChart.responsive.enabled = true;


      this.chart = barChart;

    },
    createBarGraph2: function() {

      var arrayCases = {};

      // Removed islands/small countries/principalties because too population is too small to be representative
      var blacklist = ["San Marino","Andorra","Holy See (Vatican City State)","Luxembourg","Gibraltar","Faroe Islands","Isle of Man","Falkland Islands (Malvinas)","Channel Islands","Monaco","Montserrat","Liechtenstein","Iceland"];

      for(var i = 0; i < this.dataCountries.length; i++) {
        var datum = this.dataCountries[i];
        if(!blacklist.includes(datum.country)) {
          arrayCases[datum.country] = {cases: datum.cases,flag: datum.flag};
        }
      }


      var arrayBiggest = [];

      for(var k = 0; k < 5; k++) {
        var biggest = 0;
        var keyCountry = "";
        let flag = ""

        for (var j = 0; j < Object.keys(arrayCases).length; j++) {
          var cases = arrayCases[Object.keys(arrayCases)[j]].cases;
            if(cases > biggest) {
              biggest = cases;
              keyCountry = Object.keys(arrayCases)[j];
              flag = arrayCases[Object.keys(arrayCases)[j]].flag;
          }
        }
        delete arrayCases[keyCountry];
        arrayBiggest.push({
          country:keyCountry,
          cases: biggest,
          img:flag
        });
      }

      let barChart = am4core.create(this.$refs.bar2div, am4charts.XYChart);
      barChart.data = arrayBiggest;

      // Create axes
      var categoryAxis = barChart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.location = 0;

      var valueAxis = barChart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.opposite = true;

      let series = barChart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "country";
      series.dataFields.valueX = "cases";

      series.columns.template.adapter.add("fill", function(fill, target) {
        return barChart.colors.getIndex(target.dataItem.index);
      });

      var image = new am4core.Image();
      image.horizontalCenter = "middle";
      image.width = 20;
      image.height = 20;
      image.verticalCenter = "middle";
      image.adapter.add("href", (href, target)=>{
        let category = target.dataItem.category;
        if(category){
          if(category == "USA") {
            return "https://www.amcharts.com/wp-content/uploads/flags/united-states.svg";
          } else {
            return "https://www.amcharts.com/wp-content/uploads/flags/" + category.split(" ").join("-").toLowerCase() + ".svg";
          }
        }
        return href;
      })
      categoryAxis.dataItems.template.bullet = image;

      barChart.cursor = new am4charts.XYCursor();
      barChart.cursor.behavior = "zoomY";

      barChart.responsive.enabled = true;


      this.chart = barChart;

    },
    createGraph: function(data) {

      // Creation of the chart
      let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

      chart.paddingRight = 20;

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.name="Cases"
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "cases";
      series.stroke = am4core.color("#21afdd");
      series.tensionX = 1;
      series.tensionY = 1;
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 2;

      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.name = "Deaths"
      series2.dataFields.dateX = "date";
      series2.dataFields.valueY = "deaths";
      series2.stroke = am4core.color("#d63200");
      series2.tensionX = 1;
      series2.tensionY = 1;
      var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.radius = 2;

      let series3 = chart.series.push(new am4charts.LineSeries());
      series3.name = "Recovered"
      series3.dataFields.dateX = "date";
      series3.dataFields.valueY = "recovered";
      series3.stroke = am4core.color("#42b983");
      series3.tensionX = 1;
      series3.tensionY = 1;
      var bullet3 = series3.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 2;

      series.tooltipText = "Cases: {valueY.value}";
      series.fill = am4core.color("#21afdd");
      series.strokeWidth = 3;
      series2.tooltipText = "Deaths: {valueY.value}";
      series2.fill = am4core.color("#d63200");
      series2.strokeWidth = 3;
      series3.tooltipText = "Recovered: {valueY.value}";
      series3.fill = am4core.color("#42b983");
      series3.strokeWidth = 3;
      chart.cursor = new am4charts.XYCursor();

      chart.legend = new am4charts.Legend();

      chart.responsive.enabled = true;

      this.chart = chart;

    },
    getCountries: function() {

      var arrayCountries = [];

      axios
        .get('https://corona.lmao.ninja/v2/countries')
        .then(response => {
          this.apiResponse = response.data;
          for(var countryInfos of this.apiResponse) arrayCountries.push(countryInfos['country'])
          this.countriesList = arrayCountries;
        })
    },
    createMapChart: function() {

      if(this.theme === "dark") {
        am4core.useTheme(am4themes_dark);
      } else if (this.theme === "light") {
        am4core.useTheme(am4themes_animated);
      }

      let map = am4core.create("mapdiv", am4maps.MapChart);
      map.geodata = am4geodata_worldLow;
      map.projection = new am4maps.projections.Miller();
      map.responsive.enabled = true;

      // Create map polygon series
      var polygonSeries = map.series.push(new am4maps.MapPolygonSeries());

      // Make map load polygon (like country names) data from GeoJSON
      polygonSeries.useGeodata = true;
      polygonSeries.exclude = ["AQ"];

      polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: map.colors.getIndex(1).brighten(1),
        max: map.colors.getIndex(1).brighten(-0.3)
      });

      polygonSeries.data = this.dataCountriesMap;

      // Set up heat legend
      var heatLegend = map.createChild(am4maps.HeatLegend);
      heatLegend.id = "heatLegend";
      heatLegend.series = polygonSeries;
      heatLegend.align = "right";
      heatLegend.valign = "bottom";
      heatLegend.width = am4core.percent(35);
      heatLegend.marginRight = am4core.percent(4);
      heatLegend.background.fill = am4core.color("#000");
      heatLegend.background.fillOpacity = 0.05;
      heatLegend.padding(5, 5, 5, 5);

      // Set up custom heat map legend labels using axis ranges
      var minRange = heatLegend.valueAxis.axisRanges.create();
      minRange.label.horizontalCenter = "left";

      var maxRange = heatLegend.valueAxis.axisRanges.create();
      maxRange.label.horizontalCenter = "right";

      // Blank out internal heat legend value axis labels
      heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function() {
        return "";
      });

      // Update heat legend value labels
      polygonSeries.events.on("datavalidated", function(ev) {
        var heatLegend = ev.target.map.getKey("heatLegend");
        var min = heatLegend.series.dataItem.values.value.low;
        var minRange = heatLegend.valueAxis.axisRanges.getIndex(0);
        minRange.value = min;
        minRange.label.text = "" + heatLegend.numberFormatter.format(min);

        var max = heatLegend.series.dataItem.values.value.high;
        var maxRange = heatLegend.valueAxis.axisRanges.getIndex(1);
        maxRange.value = max;
        maxRange.label.text = "" + heatLegend.numberFormatter.format(max);
      });

      // Configure series tooltip
      var polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}: {value}";
      polygonTemplate.nonScalingStroke = true;
      polygonTemplate.strokeWidth = 0.5;

      // Create hover state and set alternative fill color
      var hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#3c5bdc");

    },
    _addDarkTheme: function() {
      this.theme = "dark";
      am4core.unuseTheme(am4themes_animated);
      am4core.useTheme(am4themes_dark);
      this.getGraphData();
      this.createBarGraph();
      this.createBarGraph2();
      this.createMapChart();

      let darkThemeLinkEl = document.createElement("link");
      darkThemeLinkEl.setAttribute("rel", "stylesheet");
      darkThemeLinkEl.setAttribute("href", "/nCov/css/darktheme.css");
      darkThemeLinkEl.setAttribute("id", "dark-theme-style");

      let docHead = document.querySelector("head");
      docHead.append(darkThemeLinkEl);

      document.getElementById("switch").innerHTML = '<i class="far fa-sun fa-2x"></i>';
      document.getElementById("switch").style.color = "#dedede";

    },
    _removeDarkTheme: function() {
      this.theme = "light";
      am4core.unuseTheme(am4themes_dark);
      am4core.useTheme(am4themes_animated);
      this.getGraphData();
      this.createBarGraph();
      this.createBarGraph2();
      this.createMapChart();

      let darkThemeLinkEl = document.querySelector("#dark-theme-style");
      let parentNode = darkThemeLinkEl.parentNode;
      parentNode.removeChild(darkThemeLinkEl);

      document.getElementById("switch").innerHTML = '<i class="far fa-moon fa-2x"></i>';
      document.getElementById("switch").style.color = "#111111";

    },
    darkThemeSwitch: function() {
      let darkThemeLinkEl = document.querySelector("#dark-theme-style");
      if (!darkThemeLinkEl) {
        this._addDarkTheme()
      } else {
        this._removeDarkTheme()
    }
  }
},
  mounted () {
    this.show=true;
    this.getCountries();
    this.getData();
    this.t = window.setInterval(this.getData,5*60000);
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    window.clearInterval(this.t);
  }
}

</script>

<style lang="css" scoped>
[v-cloak] {display: none}
#switch {
  cursor:pointer;

  position:fixed;
  top:2%;
  left:1%;
}
</style>
