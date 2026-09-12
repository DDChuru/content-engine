type Hold={start:number;end:number};

export function movingSeconds(t:number,start:number,end:number,holds:Hold[]){
 const until=Math.max(start,Math.min(t,end));
 return until-start-holds.reduce((sum,h)=>sum+Math.max(0,Math.min(until,h.end)-Math.max(start,h.start)),0);
}

export function storyPositions(t:number,start:number,pass:number,snapshot:number,holds:Hold[]){
 const elapsed=movingSeconds(t,start,snapshot,holds);
 const duration=movingSeconds(snapshot,start,snapshot,holds);
 const crossing=movingSeconds(pass,start,snapshot,holds);
 // One spatial scale for both tracks, chosen to fit the entire demonstration.
 // No trajectory clamp or loop: only the explicitly narrated snapshot freezes it.
 const pixelsPerMetre=Math.min(2,280/(6*Math.max(duration,0.01)));
 return {xA:450+6*pixelsPerMetre*(elapsed-crossing),xB:450-4*pixelsPerMetre*(elapsed-crossing)};
}
