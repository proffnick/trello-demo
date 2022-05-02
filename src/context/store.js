import React from "react";

const DefaultContent = () => (<div className="text-center">No content</div>);
 // create initial state of the app
/* structure of workspace 
    [{title: "My Work Space"},
    {board: [{title: "My Board"}, columns: [{title: 'my cards', content: null}]}, ]}]
*/
export const Store = {
    user: {name: 'Baloch', email: 'baloch@instapro.com'},
    workspace: [],
    constants: {
        welcome: 'Hi Mr. ',
        noWorkspace: 'Looks like you do not have a workspace, please create one below',
        createWorkspace: 'Create workspace',
        noBoard: 'Your workspace is ready but you do not have any board to work with. Please create one above',
        createNewWorkspace: 'Create New Workspace',
        createNewBoard: 'Create New Board',
        createBoard: "Create Board",
        startTask: "Start new task",
        addNewCard: "Add New Card",
        cardContentLength: 100,
        cardTitleLength: 50
    },
    storage: window.localStorage,
    modal: {
        action: '',
        content: DefaultContent,
        title: "Some modal"
    },
    currentWorkspace: null,
    currentBoard: null,
    isEditing: false,
    draggedOverCard: null
}

export const reducer = (state, action) => {
    switch(action.type){
        case 'create.workspace':
            // goes ahead to create and save workspace
           const newworkspace   =  [[{title: action.payload}]];
           const converted      = JSON.stringify(newworkspace);
           
           if(action.save){
                Store.storage.setItem(action.save.itemName, converted);
            }

           return {
                ...state,
                workspace: newworkspace
            }
        case 'set.currentworkspace':
            return {
                ...state,
                currentWorkspace: {...action.payload}
            }
        case 'create.board':
            // goes ahead to create and save workspace
            const currentWorkSpace = state.currentWorkspace; 
            
            if(currentWorkSpace){
                const workspaces = state.workspace; // list of work spaces
                // get the current workspace by index
                const current = workspaces[currentWorkSpace.index];
                /* struture of current workspace
                [
                    {title: ""},
                ]
                */
                const newboard = { board: [{title: action.payload }] };
                console.log(current);
                if(current.indexOf(newboard) === -1){
                    current[1] = newboard;
                }
                // add it back to the array of work spaces by it's index
                //console.log('How many times ? ');
                workspaces[currentWorkSpace.index] = current;

                /*work space becomes
                    [
                        {title: ''},
                        {board: [
                            {title: "board Title"}
                        ]},

                    ]
                */

                const converted = JSON.stringify(workspaces);
                
                if(action.save){
                    Store.storage.setItem(action.save.itemName, converted);   
                }

                console.log(workspaces);

                return {
                    ...state,
                    workspace: [...workspaces]
                }
            }else{
                return state;
            }
        case 'create.newcolumn':
            // take the current workspace
                /*
                    {
                        workspcae: {},
                        index: 0,
                    }
                */
            // take the current board
                /*
                    
                    [
                        {title: ""} // no colums
                        {columns: [
                            [
                                {title: ''},
                                cards: [
                                    {title: '', content: '', time}
                                ]
                            ]
                        ]}
                    ]
                    
                */
            let columnWorkSpace = state.currentWorkspace; // object
            let stateWorkspaces  = state.workspace;
            let columnBoard     = state.currentBoard?.board; // array

            // check to see if current board contains columns
            /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
            */
            const previous  = columnBoard[1]?.columns;
            const workaspaceWorkspace = stateWorkspaces[columnWorkSpace?.index];

            //console.log(columnWorkSpace);
            if((previous) && Array.isArray(previous) && Array.isArray(workaspaceWorkspace)){
                // add new column
                const addColumn = [{title: action.payload.title}, {cards: []}];
                const lastIndexOfPrevious = (previous.length > 0) ? (previous.length + 1): 0; 
                // add the newly created column but no repetition
                const filtered = previous.filter(column => ((column[0]?.title) === addColumn[0].title));

                console.log(filtered, 'filtered', previous);

                if(!filtered.length){
                    console.log('you got in many times not filtered');
                    previous.push(addColumn);
                }

                // insert this previous back into the board
                columnBoard[1]['columns'] = previous;
                

                // insert this pack to the current workspace
                if((workaspaceWorkspace[1]['board']) !== columnBoard){
                    workaspaceWorkspace[1]['board'] = columnBoard;
                }
                

            }else{
                // create new columns
                const firstArray = new Array(
                    {title: action.payload.title},
                    {cards: []}
                )
                const mainArray = new Array();

                if(mainArray.indexOf(firstArray) === -1){
                    const firstColumn = {columns: new Array(firstArray)}
                    // since board has no columns we can now add columns to board
                    // again we can hardcode the value because the array is just of length 2
                    columnBoard[1] = firstColumn;
                }

                // add it to work space

                if(workaspaceWorkspace[1]['board'] !== columnBoard){
                    workaspaceWorkspace[1]['board'] = columnBoard;
                }

            }

            stateWorkspaces[columnWorkSpace.index] = workaspaceWorkspace;


            console.log(stateWorkspaces);
            

            if(action.save){

                const converted = JSON.stringify(stateWorkspaces);
                //console.log(converted);

                Store.storage.setItem(action.save.itemName, converted);
            }

            //console.log([...stateWorkspaces]);

            return {
                ...state,
                workspace: [...stateWorkspaces]
            }
        case 'remove.column':
                // take the current workspace
                    /*
                        {
                            workspcae: {},
                            index: 0,
                        }
                    */
                // take the current board
                    /*
                        
                        [
                            {title: ""} // no colums
                            {columns: [
                                [
                                    {title: ''},
                                    cards: [
                                        {title: '', content: '', time}
                                    ]
                                ]
                            ]}
                        ]
                        
                    */
                let removeColumnWorkSpace   = state.currentWorkspace; // object
                let removeStateWorkspaces   = state.workspace;
                let removeColumnBoard       = state.currentBoard?.board; // array
    
                // check to see if current board contains columns
                /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
                */
                const removePrevious  = removeColumnBoard[1]?.columns;
                const removeWorkaspaceWorkspace = removeStateWorkspaces[removeColumnWorkSpace?.index];
    
                //console.log(columnWorkSpace);
                if((removePrevious) && Array.isArray(removePrevious) && Array.isArray(removeWorkaspaceWorkspace)){
                    // add new column
                    removePrevious.splice(action.payload.index, 1);
    
                    // insert this previous back into the board
                    removeColumnBoard[1]['columns'] = removePrevious;
                    
    
                    // insert this pack to the current workspace
                    if((removeWorkaspaceWorkspace[1]['board']) !== removeColumnBoard){
                        removeWorkaspaceWorkspace[1]['board'] = removeColumnBoard;
                    }
                    
    
                }
    
                removeStateWorkspaces[removeColumnWorkSpace.index] = removeWorkaspaceWorkspace;
    
    
                console.log(removeStateWorkspaces);
                
    
                if(action.save){
    
                    const converted = JSON.stringify(removeStateWorkspaces);
                    //console.log(converted);
    
                    Store.storage.setItem(action.save.itemName, converted);
                }
    
                //console.log([...stateWorkspaces]);
    
                return {
                    ...state,
                    workspace: [...removeStateWorkspaces]
                }
        // start colum update
        case 'update.columntitle':
            // take the current workspace
                /*
                    {
                        workspcae: {},
                        index: 0,
                    }
                */
            // take the current board
                /*
                    
                    [
                        {title: ""} // no colums
                        {columns: [
                            [
                                {title: ''},
                                cards: [
                                    {title: '', content: '', time}
                                ]
                            ]
                        ]}
                    ]
                    
                */
            let updateColumnColumnWorkSpace   = state.currentWorkspace; // object
            let updateColumnStateWorkspaces   = state.workspace;
            let updateColumnColumnBoard       = state.currentBoard?.board; // array

            // check to see if current board contains columns
            /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
            */
            const updateColumnPrevious  = updateColumnColumnBoard[1]?.columns;
            const updateColumnWorkaspaceWorkspace = updateColumnStateWorkspaces[updateColumnColumnWorkSpace?.index];

            //console.log(columnWorkSpace);
            if((updateColumnPrevious) && Array.isArray(updateColumnPrevious) && Array.isArray(updateColumnWorkaspaceWorkspace)){
                // add new column
                const toEdit = updateColumnPrevious[action.payload.index];

                if(toEdit){
                    toEdit[0]['title'] = action.payload.title;
                    updateColumnPrevious[action.payload.index] = toEdit;

                    // insert this previous back into the board
                    updateColumnColumnBoard[1]['columns'] = updateColumnPrevious;
                    
    
                    // insert this pack to the current workspace
                    if((updateColumnWorkaspaceWorkspace[1]['board']) !== updateColumnColumnBoard){
                        updateColumnWorkaspaceWorkspace[1]['board'] = updateColumnColumnBoard;
                    }
                }
               
                

            }

            updateColumnStateWorkspaces[updateColumnColumnWorkSpace.index] = updateColumnWorkaspaceWorkspace;


            console.log(updateColumnStateWorkspaces);
            

            if(action.save){

                const converted = JSON.stringify(updateColumnStateWorkspaces);
                //console.log(converted);

                Store.storage.setItem(action.save.itemName, converted);
            }

            //console.log([...stateWorkspaces]);

            return {
                ...state,
                workspace: [...updateColumnStateWorkspaces]
            }
        // create column card
        case 'create.columncard':
                // take the current workspace
                    /*
                        {
                            workspcae: {},
                            index: 0,
                        }
                    */
                // take the current board
                    /*
                        
                        [
                            {title: ""} // no colums
                            {columns: [
                                [
                                    {title: ''},
                                    {cards: [
                                        {title: '', content: '', time}
                                    ]}
                                ]
                            ]}
                        ]
                        
                    */
                let createColumnCardColumnWorkSpace   = state.currentWorkspace; // object
                let createColumnCardStateWorkspaces   = state.workspace;
                let createColumnCardColumnBoard       = state.currentBoard?.board; // array
    
                // check to see if current board contains columns
                /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
                */
                const createColumnCardPrevious  = createColumnCardColumnBoard[1]?.columns;
                const createColumnCardWorkaspaceWorkspace = createColumnCardStateWorkspaces[createColumnCardColumnWorkSpace?.index];
    
                //console.log(columnWorkSpace);
                if((createColumnCardPrevious) && Array.isArray(createColumnCardPrevious) && Array.isArray(createColumnCardWorkaspaceWorkspace)){
                    // add new column
                    const toEdit = createColumnCardPrevious[action.payload.index];

                    if(toEdit){
                        console.log(toEdit, action.payload.cards);
                        toEdit[1]['cards'] = action.payload.cards;


                        createColumnCardPrevious[action.payload.index] = toEdit;
    
                        // insert this previous back into the board
                        createColumnCardColumnBoard[1]['columns'] = createColumnCardPrevious;
                        
        
                        // insert this pack to the current workspace
                        if((createColumnCardWorkaspaceWorkspace[1]['board']) !== createColumnCardColumnBoard){
                            createColumnCardWorkaspaceWorkspace[1]['board'] = createColumnCardColumnBoard;
                        }
                    }
                   
                    
    
                }
    
                createColumnCardStateWorkspaces[createColumnCardColumnWorkSpace.index] = createColumnCardWorkaspaceWorkspace;
    
    
                console.log(createColumnCardStateWorkspaces);
                
    
                if(action.save){
    
                    const converted = JSON.stringify(createColumnCardStateWorkspaces);
                    //console.log(converted);
    
                    Store.storage.setItem(action.save.itemName, converted);
                }
    
                //console.log([...stateWorkspaces]);
    
                return {
                    ...state,
                    workspace: [...createColumnCardStateWorkspaces]
                }
        case 'update.columncard':
            // take the current workspace
                /*
                    {
                        workspcae: {},
                        index: 0,
                    }
                */
            // take the current board
                /*
                    
                    [
                        {title: ""} // no colums
                        {columns: [
                            [
                                {title: ''},
                                {cards: [
                                    {title: '', content: '', time}
                                ]}
                            ]
                        ]}
                    ]
                    
                */
            let updateCardColumnWorkSpace   = state.currentWorkspace; // object
            let updateCardStateWorkspaces   = state.workspace;
            let updateCardColumnBoard       = state.currentBoard?.board; // array
        
            // check to see if current board contains columns
            /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
            */
            const updateCardPrevious  = updateCardColumnBoard[1]?.columns;
            const updateCardWorkaspaceWorkspace = updateCardStateWorkspaces[updateCardColumnWorkSpace?.index];
        
            //console.log(columnWorkSpace);
            if((updateCardPrevious) && Array.isArray(updateCardPrevious) && Array.isArray(updateCardWorkaspaceWorkspace)){
                // add new column
                const toEdit = updateCardPrevious[action.payload.index];
        
                if(toEdit){
                    console.log(toEdit, action.payload.cards);
                    toEdit[1]['cards'] = action.payload.cards;
        
        
                    updateCardPrevious[action.payload.index] = toEdit;
        
                    // insert this previous back into the board
                    updateCardColumnBoard[1]['columns'] = updateCardPrevious;
                    
        
                    // insert this pack to the current workspace
                    if((updateCardWorkaspaceWorkspace[1]['board']) !== updateCardColumnBoard){
                        updateCardWorkaspaceWorkspace[1]['board'] = updateCardColumnBoard;
                    }
                }
                
                
        
            }
        
            updateCardStateWorkspaces[updateCardColumnWorkSpace.index] = updateCardWorkaspaceWorkspace;
        
        
            console.log(updateCardStateWorkspaces);
            
        
            if(action.save){
        
                const converted = JSON.stringify(updateCardStateWorkspaces);
                //console.log(converted);
        
                Store.storage.setItem(action.save.itemName, converted);
            }
        
            //console.log([...stateWorkspaces]);
        
            return {
                ...state,
                workspace: [...updateCardStateWorkspaces]
            }
        case 'update.removecard':
            // take the current workspace
                /*
                    {
                        workspcae: {},
                        index: 0,
                    }
                */
            // take the current board
                /*
                    
                    [
                        {title: ""} // no colums
                        {columns: [
                            [
                                {title: ''},
                                {cards: [
                                    {title: '', content: '', time}
                                ]}
                            ]
                        ]}
                    ]
                    
                */
            let removeCardColumnWorkSpace   = state.currentWorkspace; // object
            let removeCardStateWorkspaces   = state.workspace;
            let removeCardColumnBoard       = state.currentBoard?.board; // array
        
            // check to see if current board contains columns
            /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
            */
            const removeCardPrevious  = removeCardColumnBoard[1]?.columns;
            const removeCardWorkaspaceWorkspace = removeCardStateWorkspaces[removeCardColumnWorkSpace?.index];
        
            //console.log(columnWorkSpace);
            if((removeCardPrevious) && Array.isArray(removeCardPrevious) && Array.isArray(removeCardWorkaspaceWorkspace)){
                // add new column
                const toEdit = removeCardPrevious[action.payload.index];
        
                if(toEdit){
                    console.log(toEdit, action.payload.cards);
                    toEdit[1]['cards'] = action.payload.cards;
        
        
                    removeCardPrevious[action.payload.index] = toEdit;
        
                    // insert this previous back into the board
                    removeCardColumnBoard[1]['columns'] = removeCardPrevious;
                    
        
                    // insert this pack to the current workspace
                    if((removeCardWorkaspaceWorkspace[1]['board']) !== removeCardColumnBoard){
                        removeCardWorkaspaceWorkspace[1]['board'] = removeCardColumnBoard;
                    }
                }
                
                
        
            }
        
            removeCardStateWorkspaces[removeCardColumnWorkSpace.index] = removeCardWorkaspaceWorkspace;
        
        
            console.log(removeCardStateWorkspaces);
            
        
            if(action.save){
        
                const converted = JSON.stringify(removeCardStateWorkspaces);
                //console.log(converted);
        
                Store.storage.setItem(action.save.itemName, converted);
            }
        
            //console.log([...stateWorkspaces]);
        
            return {
                ...state,
                workspace: [...removeCardStateWorkspaces]
            }
        case 'update.columncardreset':
            let sameCardColumnWorkSpace   = state.currentWorkspace; // object
            let sameCardStateWorkspaces   = state.workspace;
            let sameCardColumnBoard       = state.currentBoard?.board; // array
        
            // check to see if current board contains columns
            /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
            */
            const sameCardPrevious  = sameCardColumnBoard[1]?.columns;
            const sameCardWorkaspaceWorkspace = sameCardStateWorkspaces[sameCardColumnWorkSpace?.index];
        
            //console.log(columnWorkSpace);
            if((sameCardPrevious) && Array.isArray(sameCardPrevious) && Array.isArray(sameCardWorkaspaceWorkspace)){
                // add new column
                const toEdit = sameCardPrevious[action.payload.index];
        
                if(toEdit){
                    console.log(toEdit, action.payload.cards);
                    toEdit[1]['cards'] = action.payload.cards;
        
        
                    sameCardPrevious[action.payload.index] = toEdit;
        
                    // insert this previous back into the board
                    sameCardColumnBoard[1]['columns'] = sameCardPrevious;
                    
        
                    // insert this pack to the current workspace
                    if((sameCardWorkaspaceWorkspace[1]['board']) !== sameCardColumnBoard){
                        sameCardWorkaspaceWorkspace[1]['board'] = sameCardColumnBoard;
                    }
                }
                
                
        
            }
        
            sameCardStateWorkspaces[sameCardColumnWorkSpace.index] = sameCardWorkaspaceWorkspace;
        
        
            console.log(sameCardStateWorkspaces);
            
        
            if(action.save){
        
                const converted = JSON.stringify(sameCardStateWorkspaces);
                //console.log(converted);
        
                Store.storage.setItem(action.save.itemName, converted);
            }
        
            //console.log([...stateWorkspaces]);
        
            return {
                ...state,
                workspace: [...sameCardStateWorkspaces]
            }
        case 'replace.shuffledcolumns':
            // take the current workspace
                /*
                    {
                        workspcae: {},
                        index: 0,
                    }
                */
            // take the current board
                /*
                    
                    [
                        {title: ""} // no colums
                        {columns: [
                            [
                                {title: ''},
                                {cards: [
                                    {title: '', content: '', time}
                                ]}
                            ]
                        ]}
                    ]
                    
                */
            let replaceCardColumnWorkSpace   = state.currentWorkspace; // object
            let replaceCardStateWorkspaces   = state.workspace;
            let replaceCardColumnBoard       = state.currentBoard?.board; // array

            // check to see if current board contains columns
            /* we are using hard corded values because for every board there are only two elements in the array a title and the columns
            */
            let replaceCardPrevious  = replaceCardColumnBoard[1]?.columns;
            const replaceCardWorkaspaceWorkspace = replaceCardStateWorkspaces[replaceCardColumnWorkSpace?.index];

            //console.log(columnWorkSpace);
            if((replaceCardPrevious) && Array.isArray(replaceCardPrevious) && Array.isArray(replaceCardWorkaspaceWorkspace)){
                // add new column
                console.log('we got here?');

                replaceCardPrevious = action.payload;
                // insert this previous back into the board
                replaceCardColumnBoard[1]['columns'] = replaceCardPrevious;
                

                // insert this pack to the current workspace
                if((replaceCardWorkaspaceWorkspace[1]['board']) !== replaceCardColumnBoard){
                    replaceCardWorkaspaceWorkspace[1]['board'] = replaceCardColumnBoard;
                }  

            }

            replaceCardStateWorkspaces[replaceCardColumnWorkSpace.index] = replaceCardWorkaspaceWorkspace;


            console.log(replaceCardStateWorkspaces);
            

            if(action.save){

                const converted = JSON.stringify(replaceCardStateWorkspaces);
                //console.log(converted);

                Store.storage.setItem(action.save.itemName, converted);
            }

            //console.log([...stateWorkspaces]);

            return {
                ...state,
                workspace: [...replaceCardStateWorkspaces]
            }
        // end column Updates
        
        case 'set.currentboard':
            return {
                ...state,
                currentBoard: {...action.payload}
            }
        case 'update.workspace':
            // goes ahead to create and save workspace
            //console.log()
            return {
                ...state,
                workspace: [...action.payload]
            }
        case 'show.modal':
            // goes ahead to create and save workspace
            //console.log(action.payload.content);
            return {
                ...state,
                modal: {...state.modal, 
                        content: action.payload.content, 
                        title: action.payload.title, 
                        action: 'show'}
            }
        case 'set.draggedcard':
            return {
                ...state,
                draggedOverCard: action.payload
            }
        case 'hide.modal':
            // goes ahead to create and save workspace
            return {
                ...state,
                modal: {...state.modal, 
                        content: action.payload.content, 
                        title: action.payload.title, 
                        action: action.payload.action}
            }
        case 'update.editingmode':
            switch(action.payload){
                case 'on':
                return {
                    ...state,
                    isEditing: true
                }
                case 'off':
                return {
                    ...state,
                    isEditing: false
                }
            }
        
        default:
            //console.log('there was a case');
            return state;
    }
}