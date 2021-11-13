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

const zonedata = gql`
       { 
         zones(installationId: "378BF789-AECC-4F17-BB30-2F19B1A45DEA") 
         { 
             id 
             name 
             shape 
             enabled 
         } 
       } `

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  rates: any;
  rates1: any;
  error: any;
  loading: any;  
  start:any;
  end:any;
  a!:Array<any>
  temp:any
  temp1:any
  temp2:any
  temp3:any
  temp4:any
  code: [][]=[[]]
  code1: [][]=[[]]
  code2=[[[]]]
  code3=[[[]]]
  ngOnInit() {
  
  }
  constructor(private apollo: Apollo,private service: TService){}

  vectorLayer: any;
  map!: Map;
  getco=[
    [
    [-122.98202672682237,49.31676772909123],
    [ -122.98159757337999,49.317404167697546],
    [ -122.98158684454394,49.317655943363214],
    [ -122.98209109983871,49.31775385575019],
    [ -122.98234859190416,49.317208341322825],
    [ -122.98260608396959,49.31686564325354],
    [ -122.98202672682237,49.31676772909123]
    ]
  ];
  ngAfterViewInit(): void {
    let polygonStyle = new Style({
      fill: new Fill({
        color: "#66a3ff"
      }),
      stroke: new Stroke({
        color: "#e6f0ff",
        width: 4
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
   
  console.log("  "+ JSON.stringify(this.getco))
    
  // this.addPolygon(this.code2);
  
  
  
    this.apollo.watchQuery({
      query: zonedata,
   }).valueChanges.subscribe(data => {
        this.rates = data;
        this.rates1 = this.rates.data.zones
        for(var i=0,p=-1;i<96;i++)
        {
           for(;this.rates1[i].shape[0]=='G';i++);
              
           console.log("  ")
          var h=0;
          p++;
         for(var k=10;this.rates1[i].shape[k-2]!=')';k++)
         {
            if(this.rates1[i].shape[k-1]=='(' || this.rates1[i].shape[k-1]==',')
            {
               this.start = k+1;
              for(;this.rates1[i].shape[k]!=',' && this.rates1[i].shape[k]!=')' ;k++)
                  if(this.rates1[i].shape[k+1]==',' || this.rates1[i].shape[k+1]==')')
                    this.end = k+1;
               this.temp = this.rates1[i].shape.slice(this.start,this.end)
              for(var l=0;this.temp[l]!=' ';l++);
                
              this.temp1 = this.temp.slice(l,this.temp.length)
              this.temp2 = this.temp.slice(0,l)
              this.temp3 = parseFloat(this.temp2)
             this.temp4 = parseFloat(this.temp1)
             this.code[0] = this.temp3;
             this.code[1] = this.temp4;
             this.temp2 = this.code
             this.code1[h] = this.temp2
            // console.log("h individual zones: "+this.code1[h]+" h: "+h)
             h++;            
            }
                                   
         }
         for(var t=0;t<h;t++)
         this.code2[0][t]=this.code1[t] 
         console.log("i individual zones: "+ JSON.stringify(this.code2)+"  i: "+i );
        // if(i==0)
        this.addPolygon(this.code2)
       }
        // console.log("i individual zones: "+ JSON.stringify(this.code2)+"  i: "+i );
      });
      //this.addPolygon();
      }  
     addPolygon(getco:any) {
        console.log(getco)
        const geometry = new Polygon(getco).transform( "EPSG:4326", this.map.getView().getProjection());
        this.vectorLayer.getSource().addFeature(new Feature(geometry));
     }
     

}
