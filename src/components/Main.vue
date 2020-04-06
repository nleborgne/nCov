<template lang="html">

<div id="app" v-cloak>

  <loading :active.sync="isLoading"
  :is-full-page="fullPage"
  :opacity="0.9"></loading>

  <img src="virus.png" style="width:50px;margin-top:-50px;" class="mx-auto" alt="">

  <div id="page" class="col-10 mx-auto">

    <div class="col-xs-10 col-md-3 mx-auto">

      <el-select
        v-model="selectedCountry"
        v-on:change="updateData(selectedCountry);"
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
    <div class="row mb-4">

      <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Cases</h5>
          <span class="card-text">
            <h3 class="grey">{{cases}}</h3>
            <h5 v-if='todayCases > 0' class="grey">+ {{todayCases}} today</h5>
          </span>
        </div>
    </div>

    <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Deaths</h5>
        <span class="card-text">
          <h3 class="red">{{deaths}}</h3>
          <h5 v-if='todayDeaths > 0' class="red">+ {{todayDeaths}} today</h5>
        </span>
      </div>
  </div>

    <div class="card shadow mx-auto mt-4" v-if="show" id="main-box" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Recovered</h5>
        <span class="card-text">
          <h3 class="green">{{recovered}}</h3>
          <h5 v-if='todayCases>0||todayDeaths>0' class="green">{{cases-deaths-recovered}} remaining</h5>
        </span>
      </div>
  </div>

</div>


<h6 class="top-left d-none d-sm-block">Updated : {{updated}}</h6>

      <div class="col-xs-12 col-md-10 mt-4 mx-auto">
          <div class="hello" ref="chartdiv"></div>
      </div>
      <h5>world map</h5>
      <div class="col-12 mt-4 mx-auto">
          <div class="hello" id="mapdiv"></div>
      </div>

  </div>
</div>
</template>

<script>
import axios from "axios";
import gsap from "gsap";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';


am4core.useTheme(am4themes_animated);

export default {
  components: {
    Loading
  },
  data () {
    return {
      isLoading: false,
      fullPage: true,
      show:false,
      cases:0,
      todayCases:0,
      deaths:0,
      todayDeaths:0,
      recovered:0,
      critical:0,
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
      graphNames:['Confirmed','Deaths']
    }
  },
  methods: {
    getData: function() {
      this.isLoading = true;
      axios
        .get('https://corona.lmao.ninja/all')
        .then(response => {
          this.dataWorld = response.data;

          let day = new Date(this.dataWorld.updated).getDate();
          let month = new Date(this.dataWorld.updated).getMonth()+1;
          let hour = new Date(this.dataWorld.updated).getHours();
          let minutes = new Date(this.dataWorld.updated).getMinutes();
          let seconds = new Date(this.dataWorld.updated).getSeconds();

          (day < 10) ? (day = '0'+day) : (day);
          (month < 10) ? (month = '0'+month) : (month);
          (hour < 10) ? (hour = '0'+hour) : (hour);
          (minutes < 10) ? (minutes = '0'+minutes) : (minutes);
          (seconds < 10) ? (seconds = '0'+seconds) : (seconds);
          this.updated = day+'/'+month+'/'+new Date(this.dataWorld.updated).getFullYear()+' - '+hour+':'+minutes+':'+seconds;
        })
        axios
          .get('https://corona.lmao.ninja/countries')
          .then(response => {
            this.dataCountries = response.data;

            for(let thisData of response.data) {
              this.dataCountriesMap.push({id:thisData.countryInfo.iso2,name:thisData.country,'value':thisData.cases});
            }
            // this.dataCountries2 = response.data;
            this.updateData(this.selectedCountry);
            this.createMapChart();

          })
    },
    updateData: function(country) {
      if(country === 'World') {
        this.todayCases = 0;
        this.todayDeaths = 0;
        gsap.to(this.$data, 3, { cases: this.dataWorld.cases,roundProps:"cases",ease: "expo.out" } );
        gsap.to(this.$data, 3, { deaths: this.dataWorld.deaths,roundProps:"deaths",ease: "expo.out" } );
        gsap.to(this.$data, 3, { recovered: this.dataWorld.recovered,roundProps:"recovered",ease: "expo.out" } );
      } else {
        for (var countryInfos of this.dataCountries) {
          if(countryInfos.country == country) {
            gsap.to(this.$data, 3, { cases: countryInfos.cases,roundProps:"cases",ease: "expo.out" } );
            gsap.to(this.$data, 3, { todayCases: countryInfos.todayCases,roundProps:"todayCases",ease: "expo.out" } );
            gsap.to(this.$data, 3, { deaths: countryInfos.deaths,roundProps:"deaths",ease: "expo.out" } );
            gsap.to(this.$data, 3, { todayDeaths: countryInfos.todayDeaths,roundProps:"todayDeaths",ease: "expo.out" } );
            gsap.to(this.$data, 3, { recovered: countryInfos.recovered,roundProps:"recovered",ease: "expo.out" } );
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
            data.push({'date':date,cases:this.graphDataApi.cases[date],deaths:this.graphDataApi.deaths[date]})
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
              for(var j = 0; j < this.graphDataApi.length; j++) {
                sumCases += Object.values(this.graphDataApi[j].timeline.cases)[i];
                sumDeaths += Object.values(this.graphDataApi[j].timeline.deaths)[i];
              }

              data.push({date:'',cases:sumCases,deaths:sumDeaths})
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

      series.tooltipText = "Cases: {valueY.value}";
      series.fill = am4core.color("#21afdd");
      series.strokeWidth = 3;
      series2.tooltipText = "Deaths: {valueY.value}";
      series2.fill = am4core.color("#d63200");
      series2.strokeWidth = 3;
      chart.cursor = new am4charts.XYCursor();

      chart.legend = new am4charts.Legend();

      chart.responsive.enabled = true;


/*
      // SLIDER (WIP)
      var sliderContainer = chart.bottomAxesContainer.createChild(am4core.Container);
      sliderContainer.width = am4core.percent(100);
      sliderContainer.layout = "horizontal";

      var playButton = sliderContainer.createChild(am4core.PlayButton);
      playButton.valign = "middle";
      playButton.events.on("toggled", function(event) {
        if (event.target.isActive) {
          playSlider();
        }
        else {
          stopSlider();
        }
      })

      var slider = sliderContainer.createChild(am4core.Slider);
      slider.min = 0;
      slider.max = 100;
      slider.step = 1;
      slider.valign = "middle";
      slider.margin(0, 0, 0, 0);
      slider.marginLeft = 30;
      slider.height = 15;

      slider.startGrip.events.on("drag", stop);

      var sliderAnimation = slider.animate({ property: "start", to: 1 }, 800, am4core.ease.linear).pause();
      sliderAnimation.events.on("animationended", function() {
        playButton.isActive = false;
      })

      slider.events.on("rangechanged", function() {
        for (var i = 0; i < chart.data.length; i++) {
          var dataContext = chart.data[i];
          dataContext.date = data[i].date;
          dataContext.cases = data[i].cases;
        }

        chart.invalidateRawData();

      //  label.text = year.toString();
      })


      function playSlider() {
        if (slider) {
          if (slider.start >= 1) {
            slider.start = 0;
            sliderAnimation.start();
          }

          sliderAnimation.setProgress(slider.start);

          sliderAnimation.resume();
          playButton.isActive = true;
        }
      }

      function stopSlider() {
        sliderAnimation.pause();
        playButton.isActive = false;
      }

*/
/*
      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
*/

      this.chart = chart;

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
    },
    createMapChart: function() {
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


    }
},
  mounted () {
    this.show=true;
    this.getCountries();
    this.getData();
    window.setInterval(this.getData,5*60000);
  },

    beforeDestroy() {
      if (this.chart) {
        this.chart.dispose();
      }
    }
}

</script>

<style lang="css" scoped>
[v-cloak] {display: none}
#main-box {
  background-color:#f4f4f4;
  border:0px;
}
.green {
  color:#42b983;
}
.red {
  color:#d63200;
}
.grey {
  color: #21afdd;
}
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#page {
  display:block;
}
.hello {
  height:400px;
}
#mapdiv {
  width:100%;
  height:600px;
}
.top-left {
  position:fixed;
  top:1%;
  left:1%;
}
</style>
