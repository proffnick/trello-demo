import React from "react";
import { TrelloContext } from "../context/Context";

export const PrintNavigator = ({ list, board }) => {
    const { 
        showInfoBox,
        dispatch,
        user,
        constants 
        } = React.useContext(TrelloContext);
    const newBoardInputReference = React.useRef();

    // loop over list and create a breadcrumb
    const mylist = React.useMemo(() => {
        if(Array.isArray(list)){
            return list.map((item, index) => {
                // list structure [ 'name', 'name' ]
                const isLast = (item === (list[list.length - 1])) ? true: false;
                return (<li 
                    key={index} 
                    aria-current={`${isLast ? 'page': ''}`} 
                    className={`breadcrumb-item ${isLast ? 'active': ''} `}>
                    {isLast ? `${item}`: 
                        <a 
                        className="text-decoration-none fw-bold" 
                        href="/#">{item}</a>
                    }
                    </li>
                    )
            })
        }
        return <></>;
    }, [list]);

    const createBoardAction = (e) => {
        e.preventDefault();
        const Content = () => (
            <div className='input-group'>
                <span 
                    className="input-group-text" 
                    id="group-input">
                        <i className='bi bi-clipboard'></i>
                </span>
                <input 
                    className='form-control' 
                    placeholder='Enter Board Title' 
                    name="board" ref={newBoardInputReference} />
                <span 
                    onClick={createNewWorkingBoard} 
                    className="input-group-text btn btn-primary" 
                    id="group-input">
                        <i className='bi bi-download'> Save</i>
                </span>
            </div>
        )
        const title = constants.createNewBoard+ ` ${user.name}`;
        //console.log(showInfoBox);
        showInfoBox(Content, title);
    }

    const createNewWorkingBoard = async () => {
        const content = newBoardInputReference.current.value.trim();
        if(content.length && content.length <= 50){
           // go ahead and create workspace and hide the modal
           // create workboard
           dispatch({type: 'create.board', payload: content, save: {itemName: 'workspace'}});
           // close the modal
           const Content = () => <div className="text-center">No content</div>;
           dispatch({type: 'hide.modal', payload: {content: Content, title: '', action: 'hide'}});
        }else{
            alert('your content is too long!');
        }
    }

    return (
        <div className="w-50 mx-auto flex justify-content-center align-items-center">
            <nav 
                className="mx-auto mb-4 py-4" 
                style={{"--bs-breadcrumb-divider": "url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"}} 
                aria-label="breadcrumb">
                <ol className="breadcrumb">
                {mylist}
                {!board ? <li  
                            className={`breadcrumb-item`}>
                                <a onClick={(e) => createBoardAction(e)} className="text-decoration-none fw-bold btn btn-primary btn-sm" href="/#"><i className="bi bi-plus-circle"></i> {constants.createBoard}</a>
                            </li>: <></>}
                </ol>
            </nav>
        </div>
        
    )
}
// 