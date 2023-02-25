<template>
  <div>
    <el-row>
      <el-col :span="12"> <div id="map"></div></el-col>
      <el-col :span="12"> <div id="hmap"></div></el-col>
    </el-row>
  </div>
  <div style="margin: 20px">
    <el-slider :max="30" :marks="marks1" :show-tooltip="false" v-model="value1" />
  </div>
  <div style="margin: 20px">
    <el-slider :max="31" :marks="marks2" :show-tooltip="false" v-model="value2" />
  </div>
  <div style="margin: 20px">
    <el-slider :max="31" :marks="marks3" :show-tooltip="false" v-model="value3" />
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import data from "../assets/data.js";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
const value1 = ref(1);
const value2 = ref(0);
const value3 = ref(0);

const marks1 = {
  0: "无",
  1: "6/1",
  2: "6/2",
  3: "6/3",
  4: "6/4",
  5: "6/5",
  6: "6/6",
  7: "6/7",
  8: "6/8",
  9: "6/9",
  10: "6/10",
  11: "6/11",
  12: "6/12",
  13: "6/13",
  14: "6/14",
  15: "6/15",
  16: "6/16",
  17: "6/17",
  18: "6/18",
  19: "6/19",
  20: "6/20",
  21: "6/21",
  22: "6/22",
  23: "6/23",
  24: "6/24",
  25: "6/25",
  26: "6/26",
  27: "6/27",
  28: "6/28",
  29: "6/29",
  30: "6/30",
};
const marks2 = {
  0: "无",
  1: "7/1",
  2: "7/2",
  3: "7/3",
  4: "7/4",
  5: "7/5",
  6: "7/6",
  7: "7/7",
  8: "7/8",
  9: "7/9",
  10: "7/10",
  11: "7/11",
  12: "7/12",
  13: "7/13",
  14: "7/14",
  15: "7/15",
  16: "7/16",
  17: "7/17",
  18: "7/18",
  19: "7/19",
  20: "7/20",
  21: "7/21",
  22: "7/22",
  23: "7/23",
  24: "7/24",
  25: "7/25",
  26: "7/26",
  27: "7/27",
  28: "7/28",
  29: "7/29",
  30: "7/30",
  31: "7/31",
};
const marks3 = {
  0: "无",
  1: "8/1",
  2: "8/2",
  3: "8/3",
  4: "8/4",
  5: "8/5",
  6: "8/6",
  7: "8/7",
  8: "8/8",
  9: "8/9",
  10: "8/10",
  11: "8/11",
  12: "8/12",
  13: "8/13",
  14: "8/14",
  15: "8/15",
  16: "8/16",
  17: "8/17",
  18: "8/18",
  19: "8/19",
  20: "8/20",
  21: "8/21",
  22: "8/22",
  23: "8/23",
  24: "8/24",
  25: "8/25",
  26: "8/26",
  27: "8/27",
  28: "8/28",
  29: "8/29",
  30: "8/30",
  31: "8/31",
};
var inp = [];
var heatmapLayer;
onMounted(() => {
  var map = L.map("map").setView([31.33971413, 121.5655044], 10);

  L.tileLayer(
    "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    {}
  ).addTo(map);

  var hmap = L.map("hmap").setView([31.33971413, 121.5655044], 10);

  L.tileLayer(
    "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    {}
  ).addTo(hmap);
  heatmapLayer = L.heatLayer([], {
    minOpacity: 0.5,
    maxZoom: 17,
    radius: 25,
    blur: 15,
    max: 10,
    valueField: "value",
  }).addTo(hmap);

  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems); //添加绘制工具
  var drawControl = new L.Control.Draw({
    position: "topright",
    draw: {
      polygon: {
        allowIntersection: false,
        drawError: {
          color: "#b00b00",
          message: "<strong>Oh snap!<strong> you can't draw that!",
        },
        shapeOptions: {
          color: "#bada55",
        },
      },
      //可以绘制多边形，线段，矩形等
      polyline: false,
      rectangle: false,
      marker: false,
      circle: false, //圆
      circlemarker: false, //圆点
    },
  });
  map.addControl(drawControl); //绘制后，获取形状信息
  map.on("draw:created", function (e) {
    var type = e.layerType,
      layer = e.layer;
    var latlngs = layer.getLatLngs();
    console.log(latlngs);
    let arr = [];
    latlngs = latlngs[0];
    for (let i in latlngs) {
      arr.push([latlngs[i].lat, latlngs[i].lng]);
      if (i == latlngs.length - 1) {
        arr.push([latlngs[0].lat, latlngs[0].lng]);
      }
    }
    let searchWithin = turf.polygon([arr]);
    let ps = data.map((v) => {
      return [Number(v.Longitude), Number(v.Latitude)];
    });
    let points = turf.points(ps);
    var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
    console.log(ptsWithin.features);
    let f = ptsWithin.features;
    inp = [];
    for (let i in f) {
      inp.push({
        lat: f[i].geometry.coordinates[0],
        lng: f[i].geometry.coordinates[1],
        value: 100,
      });
    }
    let date = "";
    if (value1.value != 0) {
      date = marks1[value1.value];
    }
    if (value2.value != 0) {
      date = marks2[value2.value];
    }
    if (value3.value != 0) {
      date = marks3[value3.value];
    }
    date = "2017/" + date;
    console.log(date);
    for (let i in inp) {
      for (let j in data) {
        if (inp[i].lat == data[j].Longitude && inp[i].lng == data[j].Latitude) {
          inp[i].value = Number(data[j][date]);
          break;
        }
      }
    }

    console.log(inp);
    heatmapLayer.setLatLngs(inp);
    drawnItems.addLayer(layer);
  });
});
watch(value1, () => {
  if (value1.value != 0) {
    value2.value = 0;
    value3.value = 0;
    if (inp.length == 0) {
      return;
    }
    let date = "";
    if (value1.value != 0) {
      date = marks1[value1.value];
    }
    if (value2.value != 0) {
      date = marks2[value2.value];
    }
    if (value3.value != 0) {
      date = marks3[value3.value];
    }
    date = "2017/" + date;
    console.log(date);
    for (let i in inp) {
      for (let j in data) {
        if (inp[i].lat == data[j].Longitude && inp[i].lng == data[j].Latitude) {
          inp[i].value = Number(data[j][date]);
          break;
        }
      }
    }
    heatmapLayer.setLatLngs(inp);
    console.log(heatmapLayer);
  }
});
watch(value2, () => {
  if (value2.value != 0) {
    value1.value = 0;
    value3.value = 0;
    if (inp.length == 0) {
      return;
    }
    let date = "";
    if (value1.value != 0) {
      date = marks1[value1.value];
    }
    if (value2.value != 0) {
      date = marks2[value2.value];
    }
    if (value3.value != 0) {
      date = marks3[value3.value];
    }
    date = "2017/" + date;
    console.log(date);
    for (let i in inp) {
      for (let j in data) {
        if (inp[i].lat == data[j].Longitude && inp[i].lng == data[j].Latitude) {
          inp[i].value = Number(data[j][date]);
          break;
        }
      }
    }
    heatmapLayer.setLatLngs(inp);
    console.log(heatmapLayer);
  }
});
watch(value3, () => {
  if (value3.value != 0) {
    value1.value = 0;
    value2.value = 0;
    if (inp.length == 0) {
      return;
    }
    let date = "";
    if (value1.value != 0) {
      date = marks1[value1.value];
    }
    if (value2.value != 0) {
      date = marks2[value2.value];
    }
    if (value3.value != 0) {
      date = marks3[value3.value];
    }
    date = "2017/" + date;
    console.log(date);
    for (let i in inp) {
      for (let j in data) {
        if (inp[i].lat == data[j].Longitude && inp[i].lng == data[j].Latitude) {
          inp[i].value = Number(data[j][date]);
          break;
        }
      }
    }
    heatmapLayer.setLatLngs(inp);
    console.log(heatmapLayer);
  }
});
</script>
<style>
#map,
#hmap {
  height: 500px;
}
</style>
