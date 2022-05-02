import React from "react";
import { TrelloContext } from "../context/Context";

export const NewColumn = () => {
    const { currentBoard, 
            constants, 
            dispatch,
            currentWorkspace }  = React.useContext(TrelloContext);
    const newColumInputRef      = React.useRef();
    const actionButtonRef       = React.useRef();
    const [createColumControl, setCreateColumControl]    = React.useState();
    // set resource using effect
    React.useEffect(() => {
        //console.log(currentWorkspace);
        if(!createColumControl){
            setCreateColumControl(new window.bootstrap.Collapse(document.getElementById('collapseNewcolumn'), {toggle: false}));
        }

    }, [createColumControl]);

    /*
    STRUCTURE OF BOARD
    {
        board: [
                    {title: "My Board"}, 
                    {columns: 
                    [
                        [{title: 'my Column'}, {cards: [{title: '', content: ''}, {}]} ], 
                        [{title: 'my column'}, {cards: [{title: '', content: ''}, {}]}],
                        [{title: 'my column'}, {cards: [{}, {}]}],
                    ]}
    }
    
    */

    const createNewColumnOnBoard = () => {
        const content = newColumInputRef.current.value.trim();
        if(content.length && content.length <= 100){
           // go ahead and create workspace and hide the modal
           dispatch({type: 'create.newcolumn', payload: {title: content}, save: {itemName: 'workspace'}});
           // remove current value
           newColumInputRef.current.value = '';
           // close the panel
           if(createColumControl){
            createColumControl.hide();
           }
        }else{
            alert('your title is too long!');
        }
    }

    return (
        <div className='col'>
            <div className='card border-0 rounded-3 bg-white rounded-3 shadow-sm'>
                <button
                    ref={actionButtonRef} 
                    className="btn btn-light fw-bold text-muted" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapseNewcolumn" 
                    role="button" 
                    aria-expanded="false" 
                    aria-controls="collapseNewcolumn">
                    <i className="bi bi-plus-lg"></i> { constants.startTask }
                </button>

                <div className="collapse" id="collapseNewcolumn">
                    <div className="card card-body border-0 rounded-0 py-4 ">
                        <div className="input-group">
                            <span 
                                data-bs-toggle="collapse" 
                                data-bs-target="#collapseNewcolumn"
                                aria-expanded="false" 
                                aria-controls="collapseNewcolumn"
                                className="input-group-text btn btn-outline-danger d-inline border-0">
                                <i className="bi bi-x-lg"></i>
                            </span>
                            <input 
                                ref={newColumInputRef}
                                placeholder="Enter task title"
                                type="text"
                                name='newcolumn' 
                                className="form-control fw-bold" 
                                aria-label="Sizing example input" 
                                aria-describedby="inputGroup-sizing-sm" /> 
                            <span
                                onClick={createNewColumnOnBoard} 
                                className="input-group-text btn btn-primary">Save
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}