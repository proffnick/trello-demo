import React from 'react';
import { TrelloContext } from '../context/Context';
import { InfoBox } from '../components/InfoBox';
import { PrintNavigator } from './PrintNavigator';
import { PrintColumns } from './PrintColumns';
import { PrintWorkspaces } from './PrintWorkSpaces';
import { Video } from './Video';

export  const Workspaces = () => {
    // state management controller
    const { user, 
            modal,
            workspace,
            storage,
            dispatch,
            showInfoBox,
            constants  } = React.useContext(TrelloContext);
    
    // check for existing work spaces
    const manageWorkSpaceChange = React.useCallback(() => {
        // get workspace from storate
        const savedWorkspace = storage.getItem('workspace');
        // for a small project where teh size of the data is negligible, we can stringify objects to compare
        if((savedWorkspace !== JSON.stringify(workspace)) && savedWorkspace){
            dispatch({type: 'update.workspace', payload: JSON.parse(savedWorkspace)});
        }
    }, [workspace])

    
    // control content before layout
    React.useLayoutEffect(() => {
        manageWorkSpaceChange();
    }, [manageWorkSpaceChange]);

    // set current details when ever there are changes
    const updateCurrentWorkingStructure = React.useCallback(() => {
        if(Array.isArray(workspace) && workspace.length){
            return workspace.forEach((workspace, index) => { 
                // structure of workspace 
                /*
                [
                    {title: "My Work Space"},
                    {board: [
                            {title: "My Board"}, 
                            
                            // assuming there were columns
                            
                            {columns: 
                                [   
                                    [
                                        {title: "Title"},
                                        {cards: 
                                            [
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            ]
                                        }
                                    ],
                                    
                                    [
                                        {title: "Title"},
                                        {cards: 
                                            [
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            ]
                                        }
                                    ]
                                ]
                            }
                    }
                ] 
                */

               /* set the current board. Again this could have been selected from a list of boards assuming it was a bigger project */
                dispatch({type: 'set.currentworkspace', payload: {workspace, index}});

                const board = workspace[1];
                /* set the current board. Again this could have been selected from a list of boards assuming it was a bigger project */
                if(board){
                    // set the board with work space both of which are arrays
                    dispatch({type: 'set.currentboard', payload: {board: board.board, workspace}});  
                }

                });
        }
    }, [workspace]);

    // update current working details using effect
    React.useEffect(() => {
        updateCurrentWorkingStructure();
    }, [updateCurrentWorkingStructure]);


    // workspace input reference
    const workspaceInputreference = React.useRef();

    // print work spaces
    /* 
    assuming it was a larger project, users would be able to select or click on a particular workspace through a list printed by this method, the list could have also created all the boards under the workspace for user's selection
    to keep things simple, we are just going to assume working with one workspace and one board 
    */
    const printWorkspaces = React.useMemo(() => {

        if(Array.isArray(workspace) && workspace.length){
            return workspace.map((works, index) => { 
                // structure of workspace 
                /*
                [
                    {title: "My Work Space"},
                    {board: [
                            {title: "My Board"}, 
                            
                            // assuming there were columns
                            
                            {columns: 
                                [   
                                    [
                                        {title: "Title"},
                                        {cards: 
                                            [
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            ]
                                        }
                                    ],
                                    
                                    [
                                        {title: "Title"},
                                        {cards: 
                                            [
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            {title: 'my cards', content: {title: '', conetnt: ''}, time: ''}
                                            ]
                                        }
                                    ]
                                ]
                            }
                    }
                ] 
                */

                let title = works[0];
                let board = works[1];
                const list = [title.title];
                let hasBoard = false;
               if(undefined !== board && typeof board === 'object'){
                    let boardObject = board?.board;
                    list.push(boardObject[0].title);
                    hasBoard = true;
                } 

                return (
                    <div key={index} className={`${hasBoard ? 'board-bg px-5': 'bg-light px-5'} workspace`}>
                        <PrintNavigator list={list} board={hasBoard} />
                        {
                        !hasBoard? 
                        <div className='col-8 mx-auto p-5'>
                            <p className='text-muted'>Hi, <strong>{user.name}</strong>, <br />{constants.noBoard}</p>
                        </div>: 
                        <PrintColumns workspace={works} board={board?.board} />
                        }
                    </div>
                );

                });
        }
        return <></>;

    }, [workspace])


    // method that helps in adding workspace
    const createAndSaveWorkspace = async () => {
        const content = workspaceInputreference.current.value.trim();
        if(content.length && content.length <= 50){
           // go ahead and create workspace and hide the modal
           dispatch({type: 'create.workspace', payload: content, save: {itemName: 'workspace'}});
           const Content = () => <div className="text-center">No content</div>;
           dispatch({type: 'hide.modal', payload: {content: Content, title: '', action: 'hide'}});
        }else{
            alert('your content is too long!');
        }
    }

    const createWorkspaceAction = (e) => {
        const Content = () => (
            <div className='input-group'>
                <span className="input-group-text" id="group-input"><i className='bi bi-collection'></i></span>
                <input className='form-control' placeholder='Enter Workspace Title' name="workspace" ref={workspaceInputreference} />
                <span onClick={createAndSaveWorkspace} className="input-group-text btn btn-primary" id="group-input"><i className='bi bi-download'> Save</i></span>
            </div>
        )
        const title = constants.createNewWorkspace;
        //console.log(showInfoBox);
        showInfoBox(Content, title);
    }
    
    return (
        <div className="container-fluid w-100 px-0">
            {
                workspace.length ?
                <PrintWorkspaces 
                    workspace={workspace}
                    constants={constants} 
                    user={user} />:
                <div className='col-8 mx-auto p-5'>
                    <h5 className='text-muted text-center mb-3'>{constants.noWorkspace}</h5>
                    <div className='text-center'>
                        <button onClick={createWorkspaceAction} className='btn btn-primary'>
                        <i className="bi bi-plus-circle"></i> {constants.createWorkspace}
                        </button>
                    </div>
                </div>
            }
            <Video />
            <InfoBox
                Content={modal.content} 
                title={modal.title}
                action={modal.action}
             />
        </div>
    )
}