const initialState={

    totalTicket:100,
    filledTicket:90,
    blockTicket:3,
    unfilledTickets:7

}

function ticketReducer(state=initialState,action){
switch(action.type){
case "BUY_TICKET"
return{...state,filledTicket:state.filledTicket+1,state.unfilledTickets-1}


}


}
