import { Component, OnInit } from '@angular/core';
import {AfterViewInit} from '@angular/core';
import {defaults as defaultControls} from 'ol/control';

import {Apollo, gql} from 'apollo-angular';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import ZoomToExtent from "ol/control/ZoomToExtent";
import VectorSource from "ol/source/Vector";
import Vector from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import { TService } from '../t.service'
import BingMaps from 'ol/source/BingMaps'
import { HashLocationStrategy } from '@angular/common';
import { setClassMetadata } from '@angular/core/src/r3_symbols';

const zonedata =   gql`query{ 
  
  zonesActionZones(installationId:"DFBF51F8-B80F-4541-8EF9-945E64A00919")
  { 
      shape 
      actionZoneType 
      vehicles 
      workingId 
      actions 
      { 
          delaySeconds 
          durationSeconds 
      } 
      alerts 
      { 
           enabled 
           parameter 
           type 
      } 
      alertsPriority 
      association 
      direction 
  } 
}  `
const courseimage = gql`query
{
  installationContents(installationId:"378BF789-AECC-4F17-BB30-2F19B1A45DEA")
  {
    installationId
    installationContentFnvId
  }
}`
/*gql`
       { 
         zones(installationId: "378BF789-AECC-4F17-BB30-2F19B1A45DEA") 
         { 
             id 
             name 
             shape 
             enabled 
         } 
       } `*/

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  zones1: any;
  zones2: any;
  error: any;
  loading: any;  
  start:any;
  end:any;
  temp:any
  temp1:any
  temp2:any
  courseData:any;
  code2=[[[]]]
  courseData2: any;
  ngOnInit() {
  
  }
  constructor(private apollo: Apollo,private service: TService){}

  vectorLayer: any;
  map!: Map;
  level=0;
  Color="pink";
  
  ngAfterViewInit(): void {
    
   /* if(this.level==1)
      this.Color = "red";
    else if(this.level==2)
      this.Color = "green"
    else 
      this.Color = "yellow"*/
     let polygonStyle = new Style({
      fill: new Fill({
        color: this.Color
      }),
      stroke: new Stroke({
        color: "#e6f0ff",
        width: 1
      })
    });
    let vectorSource = new VectorSource({features: []});
    this.vectorLayer = new Vector({
      source: vectorSource,
      style: [polygonStyle]
    });
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          // source: new XYZ({
          //   url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // })
          source: new BingMaps({
            key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
            imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
          }),
        }),
        this.vectorLayer
      ],
      view: new View({
        center: [813079.7791264898, 5929220.284081122],
        zoom: 7
      }),
      controls: defaultControls().extend([
        new ZoomToExtent({
          extent: [
            813079.7791264898,
            5929220.284081122,
            848966.9639063801,
            5936863.986909639
          ]
        })
      ])
    });
    /*  This is for Course Image */
    this.apollo.watchQuery({
      query: courseimage,
    }).valueChanges.subscribe(data => {
      this.courseData = data;
      this.courseData2 = this.courseData.data.installationContents
      console.log(" Hash Tag " + this.courseData2[0].installationContentFnvId)
    })

    /*  This is for Zones */
    this.apollo.watchQuery({
      query: zonedata,
   }).valueChanges.subscribe(data => {
        this.zones1 = data;
        this.zones2 = this.zones1.data.zonesActionZones
        for(var i=0,p=0;i<this.zones2.length;i++)
        {
           for(;this.zones2[i].shape[0]=='G';i++);
          var h=0;
          var code1:[][]=[[]]
         for(var k=9;this.zones2[i].shape[k-2]!=')';k++)
         {
            if(this.zones2[i].shape[k-1]=='(' || this.zones2[i].shape[k-1]==',')
            {
                this.start = k+1;
                for(;this.zones2[i].shape[k]!=',' && this.zones2[i].shape[k]!=')' ;k++)
                  if(this.zones2[i].shape[k+1]==',' || this.zones2[i].shape[k+1]==')')
                    this.end = k+1;
                this.temp = this.zones2[i].shape.slice(this.start,this.end)
                for(var l=0;this.temp[l]!=' ';l++);
                var code: [][]=[[]];
                this.temp1 = this.temp.slice(l+1,this.temp.length)
                this.temp2 = this.temp.slice(0,l)
                code[0] = this.temp2;
                code[1] = this.temp1;
                this.temp2 = code
                code1[h] = this.temp2    
                console.log("  ")
                h++;
            }
           // console.log(" color " +this.zones2[i].alertsPriority)
            if(this.zones2[i].alertsPriority=="HIGH")
              this.level=1
            else if(this.zones2[i].alertsPriority=="MEDIUM")
                this.level=2
            else
                this.level=0
         }
         this.code2[p] = code1;
         p++
       }
       /* for(var i=0,p=0;i<96;i++)
        {
           for(;this.zones2[i].shape[0]=='G';i++);
          var h=0;
          var code1:[][]=[[]]
         for(var k=9;this.zones2[i].shape[k-2]!=')';k++)
         {
            if(this.zones2[i].shape[k-1]=='(' || this.zones2[i].shape[k-1]==',')
            {
                this.start = k+1;
                for(;this.zones2[i].shape[k]!=',' && this.zones2[i].shape[k]!=')' ;k++)
                  if(this.zones2[i].shape[k+1]==',' || this.zones2[i].shape[k+1]==')')
                    this.end = k+1;
                this.temp = this.zones2[i].shape.slice(this.start,this.end)
                for(var l=0;this.temp[l]!=' ';l++);
                var code: [][]=[[]];
                this.temp1 = this.temp.slice(l+1,this.temp.length)
                this.temp2 = this.temp.slice(0,l)
                code[0] = this.temp2;
                code[1] = this.temp1;
                this.temp2 = code
                code1[h] = this.temp2    
                console.log("  ")
                h++;
            }
          }
         this.code2[p] = code1;
         p++
       }*/
       this.addPolygon(this.code2);
      });
      }
     addPolygon(getco:any) {
        const geometry = new Polygon(getco).transform( "EPSG:4326", this.map.getView().getProjection());
        this.vectorLayer.getSource().addFeature(new Feature(geometry));
     }
}

      