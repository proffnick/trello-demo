import React from 'react';
import { PrintColumnCards } from './PrintColumnCards';
import { NewColumn } from './NewColumn';
import { TrelloContext } from '../context/Context';

export const PrintColumns = ({ workspace, board }) => {
    const columnsRef    = React.useRef();
    const { dispatch, 
            isEditing,
            constants } = React.useContext(TrelloContext);
    const [BoardColumns, setBoardColumns]   = React.useState([]);
    //const [currentCard, setCurrentCard]     = React.useState([]);
    const [dragging, setDragging]           = React.useState(false);
    const [enteringTarget, setEnteringTarget]     = React.useState(false);
    const draggedItem                       = React.useRef();
    const enteredItem                       = React.useRef();
    const draggedChildCard                  = React.useRef();
    const [isReceiving, setIsReceiving]     = React.useState(false);
    const trackedId                         = React.useRef();

    // Action methods
    // using normal function here because, I need the 'this' keyword to work with
    const removeColumn = function(){
        const confirmed = window.confirm('Are you sure you want to remove this important column?');
        if(confirmed){
            const index     = this.dataset.columnindex;
            const isLast    = BoardColumns.indexOf(BoardColumns[(BoardColumns.length - 1)]);
                console.log(isLast, index);
            if(index >= 0 && parseInt(isLast) === parseInt(index)){
                // take the columns
                dispatch({type: 'remove.column', payload: {index: index}, save: {itemName: 'workspace'}});
            }else if(parseInt(isLast) !== parseInt(index)){
                alert('You have got to delete the first item first');
            }
        }

        dispatch({type: 'update.editingmode', payload: 'off'});
    }
    const removeColumnCard = function(){
        if(!isEditing){dispatch({type: 'update.editingmode', payload: 'on'});}
        const confirmed = window.confirm('Are you sure you want to remove this important card?');
        // to remove elements we add data attribute related to it and we update database too acordingly
        if(confirmed){
            const index         = this.dataset.cardindex;
            const columnIndex   = this.dataset.columnindex;
            if(index >= 0){
                const newList = JSON.parse(this.dataset.cards);
                if(newList[index]){
                    newList.splice(index, 1);
                    dispatch({type: 'update.removecard', payload: {index: columnIndex, cards: newList, cardIndex: index}, save: {itemName: 'workspace'}});
                    // set current cards
                    // hide the element from view before update removes it
                    this.parentNode.parentNode.parentNode.style.display = 'none';
                }
            }
        }
        
        if(isEditing){
            if(isEditing){dispatch({type: 'update.editingmode', payload: 'off'});}
        }
    }

    // edit column
    const editColumn = function(){
            enableEditingColumn(this);
        }
    // edit column
    const addNewcard = function(){
        enableAddingNewcard(this.dataset.column, this.dataset.columnindex, 'create', {}, this.dataset.cardslist);
    }

    const editExistingCard = function(){
        enableAddingNewcard(this.dataset.cardindex, 
                            this.dataset.columnindex, 
                            'edit', 
                            JSON.parse(this.dataset.carddata), 
                            this.dataset.cards);
    }

    // actions events
    const actionEvents = React.useCallback(() => {
        // events clean up
        const allCloseButtons = columnsRef.current.querySelectorAll('.close-column');
        if(allCloseButtons.length){
            allCloseButtons.forEach(element => {
                element.addEventListener('click', removeColumn);
            });
        }

        // edit column actions
        const editColumnsButtons = columnsRef.current.querySelectorAll('.save-edit-action');
        if(editColumnsButtons.length){
            editColumnsButtons.forEach(element => {
                element.addEventListener('click', editColumn);
            });
        }

        // edit column actions
        const addNewcardsButton = columnsRef.current.querySelectorAll('.add-card-button');
        if(addNewcardsButton.length){
            addNewcardsButton.forEach(element => {
                element.addEventListener('click', addNewcard);
            });
        }

        // edit column card actions
        const editCardsButton = columnsRef.current.querySelectorAll('.edit-column-card');
        if(editCardsButton.length){
            editCardsButton.forEach(element => {
                element.addEventListener('click', editExistingCard);
            });
        }
        // remove a card delete-column-card
        const deleteCardsButton = columnsRef.current.querySelectorAll('.delete-column-card');
        if(deleteCardsButton.length){
            deleteCardsButton.forEach(element => {
                element.addEventListener('click', removeColumnCard);
            });
        }

    }, [workspace, columnsRef])

    const eventCleanUps = React.useCallback(() => {
        // do cleanups
        // do cancel events
        const allCloseButtons = columnsRef.current.querySelectorAll('.close-column');
        if(allCloseButtons.length){
            allCloseButtons.forEach(element => {
                element.removeEventListener('click', removeColumn);
            });
        }
        // cancel edit action evets
        // edit column actions
        const editColumnsButtons = columnsRef.current.querySelectorAll('.save-edit-action');
        if(editColumnsButtons.length){
            editColumnsButtons.forEach(element => {
                element.removeEventListener('click', editColumn);
            });
        }

        // clean adding column
        // edit column actions
        const addNewcardsButton = columnsRef.current.querySelectorAll('.add-card-button');
        if(addNewcardsButton.length){
            addNewcardsButton.forEach(element => {
                element.removeEventListener('click', addNewcard);
            });
        }

        // edit column card actions cleanups
        const editCardsButton = columnsRef.current.querySelectorAll('.edit-column-card');
        if(editCardsButton.length){
            editCardsButton.forEach(element => {
                element.removeEventListener('click', editExistingCard);
            });
        }

        // cleanup card deliting
        // remove a card delete-column-card
        const deleteCardsButton = columnsRef.current.querySelectorAll('.delete-column-card');
        if(deleteCardsButton.length){
            deleteCardsButton.forEach(element => {
                element.removeEventListener('click', removeColumnCard);
            });
        }

    });

    const enableEditingColumn = (columnElement) => {
        // enable editing
        dispatch({type: "update.editingmode", payload: 'on'});
        const   doc                 = window.document;
        const   thisColumn          = doc.getElementById(`${columnElement.dataset.columnmainid}`);
        const   thisColumnTitle     = doc.getElementsByClassName(`${columnElement.dataset.titleheaderclass}`);

        const   editColumnDiv       = doc.createElement('div');
                editColumnDiv.classList.add(...("card rounded-3 pt-0 shadow-lg edit-column-widget card-body border-0 rounded-0 py-4 position-absolute top-0 left-0, w-100".split(' ')));
                editColumnDiv.style.zIndex = 1030;
        
        const   editColumnHeader    = doc.createElement('div');
                editColumnHeader.classList.add(...('card-header border-bottom-0 bg-white mb-4 pt-3 fw-bolder text-muted').split(' '));
        const   editColumnHeaderTitle = doc.createElement('div');
                editColumnHeaderTitle.classList.add('text-muted');
                editColumnHeaderTitle.innerText = "Edit your task title";
        const   editColumnHeaderClose = doc.createElement('button');
                editColumnHeaderClose.classList.add(...(('btn btn-sm btn-outline-danger rounded-circle float-end border-0').split(' ')));
                editColumnHeaderClose.innerHTML = "<i class=\"bi bi-x\"></i>";
                // remove if asked to do so
                editColumnHeaderClose.onclick = function(e){
                    console.log(e.target.parentNode.parentNode.parentNode);
                    editColumnDiv.remove();
                    dispatch({type: "update.editingmode", payload: 'off'}); 
                }

                editColumnHeaderTitle.append(editColumnHeaderClose);
                editColumnHeader.append(editColumnHeaderTitle);


        const   editColumnInputGroup = doc.createElement('div');
                editColumnInputGroup.classList.add('input-group');

        const   editColumnInputInput = doc.createElement('input');
                editColumnInputInput.classList.add(...('form-control fw-bold'.split(' ')));
                editColumnInputInput.placeholder = "Edit title";
                editColumnInputInput.type = "text";
                editColumnInputInput.name = 'edit-column';
                editColumnInputInput.dataset.ariaLabel = "Sizing example input text-muted";
                editColumnInputInput.dataset.ariaDescribedby = "inputGroup-sizing-sm";
                editColumnInputInput.value = columnElement.dataset.title;

        const   editInputActionButton = doc.createElement('span');
                editInputActionButton.classList.add(...('input-group-text btn btn-primary').split(' '));
                editInputActionButton.innerText = "save";

                editColumnInputGroup.append(editColumnInputInput, editInputActionButton);

        // Put it all together
        editColumnDiv.append(editColumnHeader, editColumnInputGroup);


        // take the parent colum and append this inside
        const alreadyExists = columnsRef.current.querySelector(`${columnElement.dataset.columnmainid} .edit-column-widget `);

        if(alreadyExists){
            columnsRef.current.removeChild(alreadyExists);
        }

        // append the edit widget into it
        // get the parent column and append this
        thisColumn.append(editColumnDiv);
          
        // register action 
        editInputActionButton.onclick = (e) => {
            // prevnt default behaviour if any
           const currentValue = e.target.previousSibling.value;
           const theWidget = doc.getElementsByClassName('edit-column-widget')[0];

            if(currentValue && currentValue.length < 100 && currentValue !== columnElement.dataset.title){
            // check the value
            console.log(thisColumnTitle, ' the title');
            // update the value via diapatch
            
            dispatch({
                    type: 'update.columntitle', 
                    payload: 
                        {
                            title: currentValue, 
                            index: columnElement.dataset.columnindex
                        },
                    save: {itemName: 'workspace'}});
            }
            // close the editor
            theWidget.parentNode.removeChild(theWidget);
            // update the title just in case
            if(thisColumnTitle){
                thisColumnTitle[0].innerText = currentValue
            }

            // turn off editing
            dispatch({type: "update.editingmode", payload: 'off'});

        }
        
    }

    // enable adding new Card
    const enableAddingNewcard = (cardindex, columnid, action = 'create', data = {}, cardList) => {
        // sete diting mode
        dispatch({type: "update.editingmode", payload: 'on'});
        // action could be 
        // edit
        // create
        console.log(typeof cardList, cardList);

        const CardsList = Array.isArray(JSON.parse(cardList)) ? JSON.parse(cardList): [];

        const   thisColumnId = '#_'+columnid; // columnID
        const   doc         = window.document; // codument objacet
        const   thisColumn  = doc.getElementById(`${ action === 'create' ? thisColumnId : '#_column_'+cardindex+'_'+columnid}`);

        const   offset = (action === 'edit') ? thisColumn.offsetTop: (thisColumn.offsetHeight - (thisColumn.offsetHeight / 2));
        const placeButton = (action === 'create' && thisColumn.offsetHeight > 200 ) ? 'bottom-0': 'no-bottom';  

        const   editColumnDiv = doc.createElement('div');
                editColumnDiv.classList.add(...(`card rounded-3 pt-0 shadow-lg edit-column-widget card-body border-0 rounded-0 py-4 position-absolute top-${offset} left-0 right-0 ${placeButton}`.split(' ')));
                editColumnDiv.style.zIndex = 1030;
                editColumnDiv.style.minWidth = '90%';
        
        const   editColumnHeader = doc.createElement('div');
                editColumnHeader.classList.add(...('card-header border-bottom-0 bg-white mb-4 pt-3 fw-bolder text-muted').split(' '));
        const   editColumnHeaderTitle = doc.createElement('div');
                editColumnHeaderTitle.classList.add('text-muted');
                editColumnHeaderTitle.innerText = action === "create" ? "Create New Card": "Editing Card";
        const   editColumnHeaderClose = doc.createElement('button');
                editColumnHeaderClose.classList.add(...(('btn btn-sm btn-outline-danger rounded-circle float-end border-0').split(' ')));
                editColumnHeaderClose.innerHTML = "<i class=\"bi bi-x\"></i>";
                // remove if asked to do so
                editColumnHeaderClose.onclick = function(e){
                    console.log(e.target.parentNode.parentNode.parentNode);
                    editColumnDiv.remove();
                    dispatch({type: "update.editingmode", payload: 'off'});
                }

                editColumnHeaderTitle.append(editColumnHeaderClose);
                editColumnHeader.append(editColumnHeaderTitle);


        const   editColumnInputGroup = doc.createElement('div');
                editColumnInputGroup.classList.add('input-group', 'mb-2');

        const   editColumnTextAreaGroup = doc.createElement('div');
                editColumnTextAreaGroup.classList.add('input-group', 'mb-2');

        const   editColumnActionGroup = doc.createElement('div');
                editColumnActionGroup.classList.add('w-100');

        const   editColumnInputInput = doc.createElement('input');
                editColumnInputInput.classList.add(...('form-control fw-bold'.split(' ')));
                editColumnInputInput.placeholder = action === 'edit'? "Edit Card": " New card title ";
                editColumnInputInput.type = "text";
                editColumnInputInput.name = 'edit-column';
                editColumnInputInput.dataset.ariaLabel = "Sizing example input text-muted";
                editColumnInputInput.dataset.ariaDescribedby = "inputGroup-sizing-sm";
                editColumnInputInput.value = action === 'edit'? data.title: '';

        const   editCardContentInput = doc.createElement('textarea');
                editCardContentInput.classList.add(...('form-control mb-3 fw-bold'.split(' ')));
                editCardContentInput.placeholder = action === 'edit'? "Edit Card": " New card content ";
                editCardContentInput.name = 'edit-card';
                editCardContentInput.style.height = '70px';
                editCardContentInput.value = action === 'edit'? data.content: '';

        const   editInputActionButton = doc.createElement('button');
                editInputActionButton.classList.add(...('btn btn-primary btn-sm float-end px-4').split(' '));
                editInputActionButton.innerText = "save";

                editColumnInputGroup.append(editColumnInputInput);
                editColumnTextAreaGroup.append(editCardContentInput);
                editColumnActionGroup.append(editInputActionButton);

        // Put it all together
        editColumnDiv.append(editColumnHeader, editColumnInputGroup, editColumnTextAreaGroup, editColumnActionGroup);

        // check if this node already exists by querying from the column
        const alreadyExists = thisColumn.querySelector(`.edit-column-widget`);
        if(alreadyExists){
            alreadyExists.parentNode.removeChild(alreadyExists);
        }

        // append the edit widget into it
        // get the parent column and append this
        thisColumn.append(editColumnDiv);
          
        // register action 
        editInputActionButton.onclick = (e) => {
           const theWidget = doc.getElementsByClassName('edit-column-widget')[0];// for removing the widget asfter work
           // get values
           const title      = editColumnInputInput.value.trim();
           const content    = editCardContentInput.value.trim();
            
           if(
               title.length && 
               content.length &&  
               (content.length <= constants.cardContentLength) &&
               (title.length <= constants.cardTitleLength)
               ){
            const date       = (new Date()).toISOString();

            console.log(title, content, date);
 
 
             switch(action){
                 case 'create':
                    // push to cards list
                    CardsList.push({title, content, date}) 
                    // create column card
                    dispatch({
                        type: 'create.columncard', 
                        payload: 
                            {
                                title: title,
                                content: content,
                                index: columnid,
                                date: date,
                                cards: CardsList
                            },
                        save: {itemName: 'workspace'}
                    });
                     break;
                 case 'edit':
                     // find card inside index
                     const myCard = data;
                     myCard.title = title;
                     myCard.content = content;
                     CardsList[cardindex] = myCard;

                     dispatch({
                        type: 'update.columncard', 
                        payload: 
                            {
                                title: title,
                                content: content,
                                index: columnid,
                                cardIndex: cardindex,
                                cards: CardsList
                            },
                        save: {itemName: 'workspace'}
                    });

                    // update title
                    thisColumn.querySelector('h6.card-header span').innerText = title;
                    // update content
                    thisColumn.querySelector('div.card-body .card-text').innerText = content;
 
                     break;
             }
             // close the editor
             theWidget.parentNode.removeChild(theWidget);
             //update editing
             dispatch({type: "update.editingmode", payload: 'off'});
           }else{
               // for larger pro
               alert('Please check your contents and title maybe empty or too long');
           }

        }
                
        
    }


    // convert board to state
    const setTheBoardColumns = React.useCallback(() => {
        if((board[1]?.columns?.length) !== (BoardColumns?.length) && (board[1]?.columns?.length)){
            setBoardColumns(board[1]?.columns);
        }
    }, [board, board[1]?.columns?.length, isEditing]);

    // use effect to handle events
    React.useEffect(() => {
        // handle events
        actionEvents();
        // set Board columsn
        setTheBoardColumns();
        //console.log(isEditing, 'my editing mode');
        return eventCleanUps()
    }, [
        actionEvents, 
        eventCleanUps, 
        isEditing,
        setTheBoardColumns, 
        isReceiving, 
        dragging]);



    // begin Drag events
    const handleDragStart = (e, columnId) => {
        console.log('started', e.target);
        if(e.target.classList.contains('isColumn')){
            e.stopPropagation();
            e.cancelBubbles = true;
            draggedItem.current = e.target;
            draggedItem.current.addEventListener('dragend', handleDragEnd);
            draggedItem.current.columnIndex = columnId;
        }

        setTimeout(() => {
            setDragging(true);
        }, 0);
    }

    const handleDragEnter = (e, enteredColumnId) => {
        console.log('Drag has entered');
        if(e.target.classList.contains('isColumn')){
            e.stopPropagation();
            e.preventDefault();

            if(e.target !== draggedItem.current){
                const draggedIndex =  draggedItem.current.columnIndex;
                const droppedIndex =  enteredColumnId;

                const swapped = swapArrayElements(BoardColumns, draggedIndex, droppedIndex);

                console.log(swapped);

                dispatch({
                    type: 'replace.shuffledcolumns', 
                    payload: [...swapped],
                    save: {itemName: 'workspace'}
                });

            }
        }

        if(!enteringTarget){
            setEnteringTarget(true);
            enteredItem.current = enteredColumnId;
        } 
    }

    const handleDragEnd = () => {
        setDragging(false);
        setEnteringTarget(false);
        draggedItem.current.removeEventListener('dragend', handleDragEnd);
        draggedItem.current = null;
    }


     // do swap 
     const swapArrayElements = (a, x, y) => {
        if (a.length === 1) return a;
        a.splice(y, 1, a.splice(x, 1, a[y])[0]);
        return a;
    };

    const onHandleDragLeave = (e) => {
        if(enteringTarget){
            setEnteringTarget(false);
        }

        console.log('has left');
    }

    // helps in copying stuff from one column to another
    // track for the last drop area
    const setTrackId = (id) => {
        trackedId.current = id;
    }

    const handleDragOver = (e, columnId) => {
        // the the global context for teh dragged details
        setTrackId(columnId);
        //console.log(draggedChildCard.current);

        if(!draggedItem?.current?.columnIndex && draggedChildCard.current){

            setTimeout(() => {
                if((draggedChildCard?.current?.column) !== columnId && trackedId.current === columnId){
                    try {
                        //const targeted = e.target;
                        //console.log(targeted, 'targeted');
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubbles = true;
        
                        const CardDraggedOver = {...draggedChildCard.current};
        
                        //console.log(BoardColumns);
                        //console.log(CardDraggedOver);
                        const currentColumnIndex = columnId;
                        const draggedColunIndex  = CardDraggedOver.column;
        
                        const fromColumn = BoardColumns[draggedColunIndex];
                        const toColumn   = BoardColumns[currentColumnIndex];
                        
                        // remove from fromArray
                        fromColumn[1]?.cards?.splice(CardDraggedOver.index, 1);
                        //console.log(fromColumn);
                        let found = toColumn[1]?.cards?.find(ca => ca.title === CardDraggedOver.card.title);
        
                        if(!found){
                            toColumn[1]?.cards?.unshift(CardDraggedOver.card);
                        }
        
                        BoardColumns[draggedColunIndex] = [...fromColumn];
                        BoardColumns[currentColumnIndex] = [...toColumn];
        
                        // save this arrayment in 
                        // save this arrayment in state management
                        dispatch({
                            type: 'replace.shuffledcolumns', 
                            payload: [...BoardColumns],
                            save: {itemName: 'workspace'}
                        });
                        // show it
                        setBoardColumns([...BoardColumns]);
                        // clean up
                        setDragOverElement(null);
                        if(isReceiving){toggleReceiving();}
                    } catch (error) {
                            
                    }
                }
            }, 1000);

        }
    }  
    
    // set the dragged element
    const setDragOverElement = (element) => {
        draggedChildCard.current = element;
    }

    
    const toggleReceiving = () => {
        setIsReceiving(!isReceiving);
        setTimeout(() => {
            if(isReceiving){
                setIsReceiving(false);   
            }
        }, 3000)
    }




    const getStyles = (item) => {
        if(item.columnIndex === draggedItem.current.columnIndex){
            return "bg-white isDragging";
        }else if(item.columnIndex !== draggedItem.current.columnIndex){
            return "bg-white indicateEntering";
        }
        return 'bg-light';
    }
    // end drag events

    const printColumns = React.useMemo(() => {
            /*
            Structure of board
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
            if(BoardColumns.length){

                const cls =  BoardColumns.map((column, columnIndex) => {
                    const thiscolumnTitle = column[0].title;
                    const thisColumnCards = (column[1]) ? column[1].cards: [];
                    return (
                        <div 
                            id={`#_${columnIndex}`}
                            key={columnIndex} 
                            className='col trello-column position-relative isColumn' 
                            data-column={`${JSON.stringify(column)}`}  
                            data-columnindex={columnIndex} 
                            draggable={isEditing?false:true}
                            onDragStart={(e) => handleDragStart(e, columnIndex)}
                            onDragEnter={dragging?(e) => handleDragEnter(e, columnIndex):null}
                            onDragLeave={(e) => onHandleDragLeave(e)}
                            onDragOverCapture={(e) => handleDragOver(e, columnIndex)}
                            >
                            <div className={`card rounded-3 border-0 shadow-sm`}>
                                <div 
                                    title='Movable'
                                    className='draggable position-absolute p-2 bg-light float-end rounded-3 border-0 text-muted'><i className="bi bi-grip-horizontal "></i>
                                </div>
                                <div className="card-header border-bottom-0">
                                    <div
                                        data-columnindex={columnIndex} 
                                        className={`d-inline editable-content fw-bold _${columnIndex}`} 
                                        > {thiscolumnTitle}
                                    </div>
                                    <div className='d-inline float-end'>
                                        <button 
                                            data-columnindex={columnIndex}
                                            data-titleheaderclass={`_${columnIndex}`}
                                            data-columnmainid={`#_${columnIndex}`}
                                            data-title={thiscolumnTitle} 
                                            className='save-edit-action btn btn-sm btn-outline-primary border-0 ms-4 edit-column me-2 rounded-circle'>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button 
                                            data-columnindex={columnIndex}
                                            className='float-end btn btn-sm btn-outline-danger fw-bolder border-0 rounded-circle close-column me-4'>
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>  
                                </div>
                                <div className={`card-body ${dragging?getStyles({columnIndex}):"bg-white"} ${enteringTarget?getStyles({columnIndex}):"bg-white"} ${isReceiving ? 'isreceiving': ''}`}>
                                    <PrintColumnCards
                                        toggleReceiving={toggleReceiving}
                                        setDraggedOver={setDragOverElement}
                                        editing={isEditing} 
                                        cards={JSON.stringify([...thisColumnCards])} 
                                        column={columnIndex} />
                                </div>
                                <div className="card-footer border-top-0 bg-white">
                                    <button
                                    data-column={`${JSON.stringify( column )}`}
                                    data-columnindex={columnIndex}
                                    data-cardslist={JSON.stringify(thisColumnCards)} 
                                    className='btn btn-sm btn-outline-primary d-inline-block border-0 add-card-button'>
                                        <i className="bi bi-plus"></i> {constants.addNewCard}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                });
                // some random key because we are puching to an array list or react elements
                cls.push(<NewColumn key={101927263}/>);

                return cls; 


            } 
            return <NewColumn/>
    }, [board, board[1]?.columns?.length, isEditing, BoardColumns, dragging, isReceiving]);


    return(
        <div ref={columnsRef} data-workspace={`${JSON.stringify(workspace)}`} className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-5 align-items-start'>
            { printColumns }
        </div>
    );
} 