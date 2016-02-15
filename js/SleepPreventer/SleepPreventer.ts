/*

 Copyright (C) 2015 Ivan Maeder

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 -

 Prevent computer or display sleep with HTML5/JavaScript.
 */

 interface ISleepPreventerResource {
     mp4: string;
     ogv: string;
 }

 export interface ISleepPreventer {
     prevent(): void;
     allow(): void;
 }

 export class SleepPreventer implements ISleepPreventer {
     private video: HTMLVideoElement;
     private mp4: string;
     private ogv: string;

     constructor (resources: ISleepPreventerResource) {
         this.mp4 = resources.mp4;
         this.ogv = resources.ogv;
     }

     public prevent(): void {
         if (!this.video) {
             this.init();
         }

         this.video.setAttribute("loop", "loop");
         this.video.play();
     }

     public allow(): void {
         if (!this.video) {
             this.init();
         }

         this.video.removeAttribute("loop");
         this.video.pause();
     }

     private init(): void {
         this.video = document.createElement("video");
         this.video.setAttribute("width", "10");
         this.video.setAttribute("height", "10");
         this.video.style.position = "absolute";
         this.video.style.top = "-10px";
         this.video.style.left = "-10px";

         let sourceMp4: HTMLSourceElement = document.createElement("source");
         sourceMp4.setAttribute("src", this.mp4);
         sourceMp4.setAttribute("type", "video/mp4");
         this.video.appendChild(sourceMp4);

         let sourceOgg: HTMLSourceElement = document.createElement("source");
         sourceOgg.setAttribute("src", this.ogv);
         sourceOgg.setAttribute("type", "video/ogg");
         this.video.appendChild(sourceOgg);

         document.body.appendChild(this.video);
     }
 }

 function getCorrectUrl(relativeOrAbsolute: string): string {
     "use strict";
     return relativeOrAbsolute.indexOf("http") === -1
         ? relativeOrAbsolute.indexOf("/") === 0
             ? relativeOrAbsolute
             : "/" + relativeOrAbsolute
         : relativeOrAbsolute;
 }

 const sleepPreventer: ISleepPreventer = new SleepPreventer(
     {
         mp4: getCorrectUrl(require("./muted-blank.mp4")),
         ogv: getCorrectUrl(require("./muted-blank.ogv")),
     }
 );

 export default sleepPreventer;
