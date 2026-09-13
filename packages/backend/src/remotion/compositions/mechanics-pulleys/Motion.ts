/** Story-only pixel motion. Its time scale is set by the narrated release, landing and apex. */
type Timing={cues:Record<string,number>;holds:{start:number;end:number}[]};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function pulleyStoryState(s:Timing,t:number){
 const active=(v:number)=>v-s.holds.reduce((n,h)=>n+Math.max(0,Math.min(v,h.end)-h.start),0);
 const release=active(s.cues.release),impact=active(s.cues.impact),end=active(s.cues.peak),d1=impact-release,d2=end-impact;
 const q1=clamp((active(t)-release)/d1),q2=clamp((active(t)-impact)/d2);
 const fall=100*q1*q1,extra=50*(2*q2-q2*q2);
 return {fall,extra,q1,q2,pY:405+fall,qY:380-fall-extra,landingVelocity:200/d1,coastInitialVelocity:100/d2,tautAcceleration:200/(d1*d1),freeAcceleration:100/(d2*d2)};
}
