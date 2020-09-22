(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{36:function(t,e,a){t.exports=a.p+"static/media/switch.087dfc07.svg"},47:function(t,e,a){t.exports=a(58)},52:function(t,e,a){},53:function(t,e,a){},54:function(t,e,a){},58:function(t,e,a){"use strict";a.r(e);var i=a(0),n=a.n(i),r=a(7),s=a.n(r),o=a(19),c=a(20),l=a(11),h=a(22),m=a(21),p=(a(52),a(53),function(t){Object(h.a)(a,t);var e=Object(m.a)(a);function a(){return Object(o.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var t={};return this.props.rotate&&(t.transform="rotate(-45deg)"),this.props.neutral&&(t.opacity=.4),n.a.createElement("div",{className:this.props.secondary?"piece-b":"piece-a",onClick:this.props.onLookUp,style:t},n.a.createElement("p",null,this.props.secondary?"B":"A"))}}]),a}(i.Component)),u=a(41),d=(a(54),100*Math.sqrt(2)),v=50*(Math.sqrt(2)-1),f=function(t){Object(h.a)(a,t);var e=Object(m.a)(a);function a(t){var i;return Object(o.a)(this,a),(i=e.call(this,t)).state={lookingAt:{}},i.drawRow=i.drawRow.bind(Object(l.a)(i)),i.setLookingAt=i.setLookingAt.bind(Object(l.a)(i)),i.select=i.select.bind(Object(l.a)(i)),i}return Object(c.a)(a,[{key:"setLookingAt",value:function(t,e,a,i){this.setState({lookingAt:{i:t,j:e,isInnerRow:a,playerId:i}})}},{key:"select",value:function(t,e,a,i){var n=this,r=void 0!==this.state.lookingAt.i?this.state.lookingAt:{i:t,j:e,isInnerRow:a,playerId:this.props.playerId},s="".concat(r.isInnerRow?0:1).concat(r.i).concat(r.j),o=this.props.movements&&this.props.movements[s]&&this.props.movements[s].possibleMovements,c=void 0;if(Array.isArray(o)){var l,h=Object(u.a)(o);try{for(h.s();!(l=h.n()).done;){var m=l.value;if(m.i===t&&m.j===e&&a!==o.isExternalMatrix){c=Array.isArray(this.props.movements[s].removePieces)&&this.props.movements[s].removePieces[m.k];break}}}catch(p){h.e(p)}finally{h.f()}}this.props.onMovement(t,e,a,i,r,c).then((function(){return n.setState({lookingAt:{}})}))}},{key:"drawRow",value:function(t){for(var e=this,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=(a?.5*d:0)+v,r=(a?.5*d:0)+t*d+v,s=a?2:3,o=[],c=this.props.matrix&&Array.isArray(this.props.matrix.external)&&Array.isArray(this.props.matrix.internal)?a?this.props.matrix.internal:this.props.matrix.external:void 0,l=a?"diagonal-square-inner":"diagonal-square-outer",h=this.props.movements&&this.props.movements[-1]?"-1":"".concat(this.state.lookingAt.isInnerRow?0:1).concat(this.state.lookingAt.i).concat(this.state.lookingAt.j),m=this.props.movements&&this.props.movements[h]&&this.props.movements[h].possibleMovements,u=function(s){var h={transform:"translate(".concat(i+d*s,"px,").concat(r,"px) rotate(45deg)")},u="".concat(a?0:1).concat(t).concat(s);o.push(n.a.createElement("div",{className:l,key:u,style:h},c&&Array.isArray(c[t])?0!==c[t][s]?n.a.createElement(p,{onLookUp:function(){return e.setLookingAt(t,s,a,c[t][s])},secondary:c[t][s]===(e.props.switch?2:1),rotate:!0}):Array.isArray(m)&&m.some((function(e){return e.i===t&&e.j===s&&e.isExternalMatrix!==a}))&&n.a.createElement(p,{onLookUp:function(){return e.select(t,s,a,c[t][s])},secondary:e.state.lookingAt.playerId===(e.props.switch?2:1)||!e.state.lookingAt.playerId&&e.props.switch,rotate:!0,neutral:!0}):void 0))},f=0;f<s;f++)u(f);return o}},{key:"render",value:function(){return n.a.createElement("div",{className:"board",style:{height:3*d,width:3*d}},this.drawRow(0),this.drawRow(0,!0),this.drawRow(1),this.drawRow(1,!0),this.drawRow(2))}}]),a}(i.Component),y=a(90),g=a(36),b=a.n(g),w=a(91),x=function(t){Object(h.a)(a,t);var e=Object(m.a)(a);function a(t){var i;return Object(o.a)(this,a),(i=e.call(this,t)).state={pieces:{1:0,2:0},difficulty:6,switch:!1,start:!0},i.movement=i.movement.bind(Object(l.a)(i)),i.setDifficulty=i.setDifficulty.bind(Object(l.a)(i)),i.onStart=i.onStart.bind(Object(l.a)(i)),i.toggleActionButton=i.toggleActionButton.bind(Object(l.a)(i)),i}return Object(c.a)(a,[{key:"toggleActionButton",value:function(){var t={start:!this.state.start};this.state.start?this.onStart():(t.externalMatrix=void 0,t.internalMatrix=void 0,t.pieces={1:0,2:0}),this.setState(t)}},{key:"onStart",value:function(){var t=this,e=this.state.switch?"/api":"/api/initial_matrix";fetch(e).then((function(t){return t.json()})).then((function(e){return t.setState({externalMatrix:e.externalMatrix,internalMatrix:e.internalMatrix,movements:e.movements,pieces:e.pieces})}))}},{key:"setDifficulty",value:function(t){t>0&&this.setState({difficulty:t})}},{key:"movement",value:function(t,e,a,i,n,r){var s=this,o={method:"POST",mode:"cors",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},redirect:"follow",referrerPolicy:"no-referrer",body:JSON.stringify({origin:n,target:{i:t,j:e,isInnerRow:a,playerId:i},externalMatrix:this.state.externalMatrix,internalMatrix:this.state.internalMatrix,removePiece:r,activePlayer:{id:n.playerId%2+1,remainingPieces:this.state.pieces[n.playerId%2+1],externalPieces:this.state.pieces[n.playerId%2+1]<4?0:this.state.pieces[n.playerId%2+1]-4},passivePlayer:{id:n.playerId,remainingPieces:this.state.pieces[n.playerId],externalPieces:this.state.pieces[n.playerId]<4?0:this.state.pieces[n.playerId]-4},difficulty:parseInt(this.state.difficulty)})};return fetch("/api/movement",o).then((function(t){return t.json()})).then((function(t){t.error||s.setState({externalMatrix:t.externalMatrix,internalMatrix:t.internalMatrix,movements:t.movements,pieces:t.pieces})}))}},{key:"render",value:function(){var t=this,e=this.state.switch?{backgroundColor:"#f47560",transform:"rotate(270deg)"}:{};return e.opacity=this.state.start?1:.5,n.a.createElement("div",{className:"queah-body"},n.a.createElement("h1",null,"Queah"),n.a.createElement("div",{className:"content"},n.a.createElement(f,{matrix:{external:this.state.externalMatrix,internal:this.state.internalMatrix},movements:this.state.movements,onMovement:this.movement,playerId:2,switch:this.state.switch})),n.a.createElement("div",{className:"configuration"},n.a.createElement("h2",null,"Configuration"),n.a.createElement("div",{className:"players"},n.a.createElement("div",{className:"info"},n.a.createElement("h3",null,this.state.switch?"AI":"Player"),n.a.createElement(p,null),n.a.createElement(y.a,{value:this.state.pieces[2],id:"primaryInfo",type:"number",label:"Remaining Pieces",disabled:!0})),n.a.createElement("div",{className:"button",style:e,onClick:function(){return t.state.start&&t.setState({switch:!t.state.switch})}},n.a.createElement("img",{alt:"switch-player",src:b.a})),n.a.createElement("div",{className:"info"},n.a.createElement("h3",null,this.state.switch?"Player":"AI"),n.a.createElement(p,{secondary:!0}),n.a.createElement(y.a,{value:this.state.pieces[1],id:"secondaryInfo",type:"number",label:"Remaining Pieces",disabled:!0}))),n.a.createElement("div",{className:"footer"},n.a.createElement("div",{className:"difficulty-configuration"},n.a.createElement(y.a,{value:this.state.difficulty,type:"number",label:"Difficulty",id:"difficulty",onChange:function(e){return t.setDifficulty(e.target.value)}})),n.a.createElement(w.a,{onClick:this.toggleActionButton},this.state.start?"START":"GAME OVER"))))}}]),a}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(n.a.createElement(x,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[47,1,2]]]);
//# sourceMappingURL=main.cc08ebe8.chunk.js.map