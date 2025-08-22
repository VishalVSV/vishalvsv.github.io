/*
    Adel Faure Website, lightweight vernacular ASCII art composed webiste.
    Copyright (C) 2021 Adel Faure

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
function a_input(t,n,e){for(var i=0;i<n.length;i++)document.body.classList.add(n[i]);for(i=0;i<e.length;i++)document.body.classList.remove(e[i]),uncheck(input_list[e[i]]);t.getElementsByTagName("span")[0].textContent="X"}function uncheck(t){t.getElementsByTagName("span")[0].textContent=" "}function responsive_font(){let t=window.innerWidth,n=window.innerHeight;n<400||t<560?(jgs5.click(),x1.click()):n>=400&&n<560||t>=560&&t<720?(jgs7.click(),x1.click()):n>=560&&n<720||t>=720&&t<800?(jgs9.click(),x1.click()):n>=720&&n<800||t>=800&&t<1120?(jgs5.click(),x2.click()):n>=800&&n<1120||t>=1120&&t<1200?(jgs7.click(),x2.click()):n>=1120&&n<1200||t>=1200&&t<1440?(jgs5.click(),x3.click()):n>=1200&&n<1440||t>=1440&&t<1680?(jgs9.click(),x2.click()):n>=1440&&n<1680||t>=1680&&t<2160?(jgs7.click(),x3.click()):(jgs9.click(),x3.click())}function include_ascii(t){fetch("./ascii/"+t.id+".txt").then(t=>t.text()).then(n=>{t.textContent+=(t.textContent?"\n":"")+n})}const jgs5=document.getElementById("jgs5");jgs5.addEventListener("click",function(){a_input(jgs5,["jgs5"],["jgs9","jgs7"])});const jgs7=document.getElementById("jgs7");jgs7.addEventListener("click",function(){a_input(jgs7,["jgs7"],["jgs5","jgs9"])});const jgs9=document.getElementById("jgs9");jgs9.addEventListener("click",function(){a_input(jgs9,["jgs9"],["jgs5","jgs7"])});const x1=document.getElementById("x1");x1.addEventListener("click",function(){a_input(x1,["x1"],["x2","x3"])});const x2=document.getElementById("x2");x2.addEventListener("click",function(){a_input(x2,["x2"],["x1","x3"])});const x3=document.getElementById("x3");x3.addEventListener("click",function(){a_input(x3,["x3"],["x1","x2"])});const day=document.getElementById("day");day.addEventListener("click",function(){a_input(day,["day"],["night"])});const night=document.getElementById("night");night.addEventListener("click",function(){a_input(night,["night"],["day"])}),input_list={jgs5:jgs5,jgs7:jgs7,jgs9:jgs9,x1:x1,x2:x2,x3:x3,day:day,night:night},responsive_font();const hours=(new Date).getHours(),isDayTime=hours>6&&hours<20;document.body.style.display="initial",isDayTime?day.click():night.click();let ascii_holders=document.getElementsByClassName("ascii");for(var i=0;i<ascii_holders.length;i++)include_ascii(ascii_holders[i]);