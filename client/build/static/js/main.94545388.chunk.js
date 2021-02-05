(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{40:function(e,t,n){},42:function(e,t,n){},74:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n(1),c=n.n(r),o=n(33),s=n.n(o),i=(n(40),n(8)),u=n.n(i),m=n(14),d=n(2);n(42);function l(e){return Object(a.jsxs)("header",{className:"App-header",children:[Object(a.jsx)("h1",{children:"Red / Green Game"}),Object(a.jsx)("button",{onClick:function(){window.open("./about.pdf","_blank")},children:"About"})]})}function j(e){return Object(a.jsx)("div",{className:e.type,children:Object(a.jsx)(e.elem,{children:e.message})})}function b(e){return Object(a.jsx)(a.Fragment,{children:Object(a.jsxs)("div",{className:"join-game-wrapper",children:[Object(a.jsxs)("form",{onSubmit:function(t){return e.connect(t,e.roomNumber,e.teamName,e.isFacilitator,!1,null,null)},className:"join-game-form ",children:[Object(a.jsx)("input",{type:"text",required:!0,className:"text",onChange:function(t){return e.onChangeRoomNumber(t)},value:e.roomNumber,placeholder:"Enter the room number you want to join..."}),Object(a.jsx)("input",{type:"text",className:"text",required:!0,onChange:function(t){return e.onChangeTeamName(t)},value:e.teamName,placeholder:"Enter a name for your team..."}),Object(a.jsxs)("div",{children:[Object(a.jsx)("p",{className:"facilitator-check",children:"Check this box if you're the facilitator"}),Object(a.jsx)("input",{className:"check",type:"checkbox",onClick:e.handleCheck})]}),Object(a.jsx)("button",{type:"submit",className:"join",children:"Join Game"})]}),e.canReJoin?Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(j,{elem:"p",type:"message",message:"You were preivously inside another room. Would you like to join back?"}),Object(a.jsx)("button",{onClick:e.tryReJoin,className:"join",children:"Join back"})]}):null,e.anyConnectionError?Object(a.jsx)(j,{elem:"p",type:"error",message:e.message}):null]})})}function h(e){return Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(j,{type:"message",elem:"h3",message:"Welcome to room "+e.roomNumber+", "+e.teamName}),Object(a.jsx)("div",{children:e.connectedTeams.map((function(t,n){return Object(a.jsx)("p",{className:t.teamName===e.teamName?"me":"player",children:t.isFacilitator?t.teamName+" (f)":t.teamName},n)}))})]})}function O(e){return Object(a.jsx)("div",{className:"buttons-wrapper",children:e.isFacilitator?Object(a.jsx)(j,{type:"message",elem:"p",message:"As facilitator, you cannot vote. You need to wait till the end of the round to discuss with the teams."}):Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)("button",{className:"play-button red",onClick:function(){return e.play("red")},children:"Red"}),Object(a.jsx)("button",{className:"play-button green",onClick:function(){return e.play("green")},children:"Green"})]})})}function f(e){return Object(a.jsx)("div",{className:"title",children:Object(a.jsxs)("h2",{children:["Round ",e.round]})})}function g(e){var t=function(t){var n=[];return e.connectedTeams.forEach((function(e){t.forEach((function(t,r){t.teamName===e.teamName&&n.push(Object(a.jsx)("td",{className:t.choice,children:t.score},r))}))})),n};return Object(a.jsxs)("div",{className:"round-info container",children:[Object(a.jsx)(j,{type:"message",message:"Score board",elem:"h2"}),Object(a.jsxs)("table",{className:"score",children:[Object(a.jsx)("thead",{children:Object(a.jsxs)("tr",{children:[Object(a.jsx)("th",{children:"Round"}),e.connectedTeams.map((function(e,t){return!1===e.isFacilitator?Object(a.jsx)("th",{children:e.teamName},t):null}))]})}),Object(a.jsxs)("tbody",{children:[e.roundData.map((function(e,n){return e.choices.length>2?Object(a.jsxs)("tr",{children:[Object(a.jsx)("td",{children:e.round}),t(e.choices)]},n):null})),Object(a.jsxs)("tr",{children:[Object(a.jsx)("td",{children:"Final"}),e.connectedTeams.map((function(t,n){return!1===t.isFacilitator?function(e,t,n){var r=[],c=0;return e.forEach((function(e){e.choices.forEach((function(e,n){e.teamName!==t.teamName||t.isFacilitator||(c+=e.score)}))})),r.push(Object(a.jsx)("td",{children:c},n)),r}(e.roundData,t,n):null}))]})]})]})]})}function p(e){var t;return t=e.showButtons&&!e.showWaiting?Object(a.jsx)(O,{play:function(t){e.gameStarted&&e.play(e.round,e.roomNumber,e.teamName,t,e.score)},isFacilitator:e.isFacilitator}):Object(a.jsx)(j,{type:"message",elem:"p",message:"Waiting for other teams..."}),Object(a.jsxs)("div",{className:"playground",children:[e.hasGameEnded?null:Object(a.jsx)(f,{round:e.round}),e.hasGameEnded?Object(a.jsx)(j,{type:"message",elem:"p",message:"The game is over. Check the scoreboard below."}):t,e.roundData&&e.roundData.length>0?Object(a.jsx)(g,{round:e.round,roundData:e.roundData,connectedTeams:e.connectedTeams,teamName:e.teamName,hasGameEnded:e.hasGameEnded}):Object(a.jsx)(j,{type:"message",elem:"p",message:"Finish the round to see scores..."})]})}function N(e){return Object(a.jsx)("div",{className:"loader"})}var x=n(34),S=n.n(x);var y=function(){var e=Object(r.useState)(!1),t=Object(d.a)(e,2),n=t[0],c=t[1],o=Object(r.useState)([]),s=Object(d.a)(o,2),i=s[0],j=s[1],O=Object(r.useState)(!1),f=Object(d.a)(O,2),g=f[0],x=f[1],y=Object(r.useState)(!1),v=Object(d.a)(y,2),E=v[0],F=v[1],_=Object(r.useState)(1),w=Object(d.a)(_,2),T=w[0],k=w[1],C=Object(r.useState)(0),R=Object(d.a)(C,2),I=R[0],J=R[1],P=Object(r.useState)([]),D=Object(d.a)(P,2),A=D[0],G=D[1],V=Object(r.useState)([]),W=Object(d.a)(V,2),B=W[0],q=W[1],L=Object(r.useState)(""),M=Object(d.a)(L,2),Y=M[0],z=M[1],H=Object(r.useState)(""),K=Object(d.a)(H,2),Q=K[0],U=K[1],X=Object(r.useState)(!0),Z=Object(d.a)(X,2),$=Z[0],ee=Z[1],te=Object(r.useState)(!0),ne=Object(d.a)(te,2),ae=ne[0],re=ne[1],ce=Object(r.useState)(!1),oe=Object(d.a)(ce,2),se=oe[0],ie=oe[1],ue=Object(r.useState)(""),me=Object(d.a)(ue,2),de=me[0],le=me[1],je=Object(r.useState)(!!sessionStorage.getItem("PREV_STATE")&&JSON.parse(sessionStorage.getItem("PREV_STATE")).canReJoin),be=Object(d.a)(je,2),he=be[0],Oe=be[1],fe=Object(r.useState)(!1),ge=Object(d.a)(fe,2),pe=ge[0],Ne=ge[1],xe=Object(r.useState)(!1),Se=Object(d.a)(xe,2),ye=Se[0],ve=Se[1],Ee=Object(r.useRef)();Object(r.useEffect)((function(){Ee.current||(Ee.current=S()("/",{transports:["polling"]})),Ee.current.on("finish_round",(function(e){G(e.rounds),q(e.rounds),ke(),k((function(e){return e+1}))}))}),[]),Object(r.useEffect)((function(){n&&!ye&&(sessionStorage.setItem("PREV_STATE",JSON.stringify({connected:n,connectedTeams:i,gameStarted:g,anyConnectionError:E,round:T,score:I,roundData:A,roundProgress:B,roomNumber:Y,teamName:Q,showButtons:$,showWaiting:ae,isFacilitator:se,message:de,canReJoin:he,hasGameEnded:ye})),Ee.current.on("finish_game",(function(e){sessionStorage.removeItem("PREV_STATE"),Oe(!1),ve(!0),window.onbeforeunload=function(e){Ee.current.emit("room_clear",{roomNumber:parseInt(Y),teamName:Q,isFacilitator:se})}})))}));var Fe,_e=function(){var e=Object(m.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!sessionStorage.getItem("PREV_STATE")){e.next=8;break}return e.next=3,JSON.parse(sessionStorage.getItem("PREV_STATE"));case 3:t=e.sent,Ne(!0),Ee.current.emit("request_re_join",{roomNumber:parseInt(t.roomNumber),teamName:t.teamName,isFacilitator:t.isFacilitator}),Ee.current.on("cannot_re_join",(function(e){sessionStorage.removeItem("PREV_ITEM"),Oe(!1),Ne(!1),e&&Ee.current.emit("room_clear",{roomNumber:parseInt(t.roomNumber),teamName:t.teamName,isFacilitator:t.isFacilitator})})),Ee.current.on("can_re_join",Object(m.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:c(t.connected),j(t.connectedTeams),x(t.gameStarted),F(t.anyConnectionError),k(t.round),J(t.score),G(t.roundData),q(t.roundProgress),z(t.roomNumber),U(t.teamName),ee(t.showButtons),re(t.showWaiting),ie(t.isFacilitator),le(t.message),Oe(t.canReJoin),Ne(!1),we(null,t.roomNumber,t.teamName,t.isFacilitator,!0,t.roundProgress||B,t.round||T);case 17:case"end":return e.stop()}}),e)}))));case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),we=function(){var e=Object(m.a)(u.a.mark((function e(t,n,a,r,o,s,i){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Ne(!0),t&&t.preventDefault(),Ee.current.emit("join_game",{roomNumber:parseInt(n),teamName:a,isFacilitator:r,rejoin:o}),Ee.current.on("connection_error",(function(e){Ne(!1),F(!0),le(e)})),Ee.current.on("joined_teams_in_current_room",(function(e){j(e[0].activeSessions),F(!1),c(!0),Oe(!0),Ne(!1)})),Ee.current.on("can_start_game",(function(e){if(e)switch(r){case!1:e.rounds&&e.rounds[e.rounds.length-1]&&(e.rounds[e.rounds.length-1].choices.length>2&&e.rounds[e.rounds.length-1].choices.find((function(e){return e.teamName===a}))?(k(e.rounds.length+1),ke()):e.rounds[e.rounds.length-1].choices.find((function(e){return e.teamName===a}))?Te():(k(e.rounds.length),ke())),G(e.rounds),q(e.rounds);break;default:k(e.rounds[e.rounds.length-1].choices.length>2?e.rounds.length+1:e.rounds.length),G(e.rounds),q(e.rounds)}else ke();x(!0),Ne(!1)})),Ee.current.on("cannot_start_game",(function(){Te(),Ne(!1)}));case 7:case"end":return e.stop()}}),e)})));return function(t,n,a,r,c,o,s){return e.apply(this,arguments)}}(),Te=function(){ee(!1),re(!0)},ke=function(){re(!1),ee(!0)};return Fe=n?Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(h,{connectedTeams:i,roomNumber:Y,teamName:Q,message:de}),Object(a.jsx)(p,{round:T,score:I,socketRef:Ee,gameStarted:g,hasGameEnded:ye,play:function(e,t,n,a,r){Te(),Ee.current.emit("start_game",{round:e,roomNumber:parseInt(t),teamName:n,choice:a,score:r}),Ee.current.on("started_game",(function(e){q(e.rounds)}))},roomNumber:Y,roundData:A,message:de,connectedTeams:i,isFacilitator:se,teamName:Q,showButtons:$,showWaiting:ae})]}):Object(a.jsx)(b,{connect:we,roomNumber:Y,teamName:Q,anyConnectionError:E,handleCheck:function(){ie(!se)},message:de,isFacilitator:se,canReJoin:he,tryReJoin:_e,onChangeRoomNumber:function(e){z(e.target.value)},onChangeTeamName:function(e){U(e.target.value)}}),Object(a.jsxs)("div",{className:"App",children:[Object(a.jsx)(l,{}),pe?Object(a.jsx)(N,{}):Fe]})},v=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,75)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,c=t.getLCP,o=t.getTTFB;n(e),a(e),r(e),c(e),o(e)}))};s.a.render(Object(a.jsx)(c.a.StrictMode,{children:Object(a.jsx)(y,{})}),document.getElementById("root")),v()}},[[74,1,2]]]);
//# sourceMappingURL=main.94545388.chunk.js.map