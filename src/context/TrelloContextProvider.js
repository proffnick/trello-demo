import React from "react";
import { TrelloContext } from "./Context";
import { Store, reducer } from './store';

export const TrelloContextProvider = (props) => {
    // decare state with react reducer  
    const [state, dispatch] = React.useReducer(reducer, Store);

    // this shows the infobox
    const showInfoBox = (content, title) => {
        if(content && title){
            dispatch({
                type: 'show.modal',
                payload: {
                    content,
                    title
                }
            });
        }
    }
    // this shows the infobox
    const hideInfoBox = (content, title, hide) => {
        if(content && title){
            dispatch({
                type: 'hide.modal',
                payload: {
                    content,
                    title,
                    action: hide ? hide: ''
                }
            });
        }
    }

    return (
        <TrelloContext.Provider 
            value={{
                ...state,
                dispatch,
                showInfoBox,
                hideInfoBox
            }}
        >
            {props.children}
        </TrelloContext.Provider>
    )

}