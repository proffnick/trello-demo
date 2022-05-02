import React from 'react';
import moment from 'moment';
import { TrelloContext } from '../context/Context';

export const PrintColumnCards = ({ cards, column, editing, setDraggedOver, toggleReceiving, toggleDroping  }) => {
    const { user, dispatch }                = React.useContext(TrelloContext);
    const [cardsChanges, setCardChanges]    = React.useState(0);
    const [Cards, setCards]                 = React.useState([]);
    const [dragging, setDragging]           = React.useState(false);
    const [enteringTarget, setEnteringTarget]           = React.useState(false);
    const draggedCardNode                   = React.useRef();
    const draggedItem                       = React.useRef();
    const enteredItem                       = React.useRef();
    const theDreaggedItem                   = React.useRef();


    const setCardsList = React.useCallback(() => {
        //console.log(Cards);
        if(cards.length !== JSON.stringify(Cards).length){
            setCards(JSON.parse(cards))
        }
    }, [cards, Cards]);

    React.useEffect(() => {
        // doing this to force comparion and update if necessary
        if(cards.length !== cardsChanges ){
            setCardChanges(cards.length);
        }
        
        setCardsList();


    }, [cards, cardsChanges, setCardsList, editing, dragging]);

    
    const handletDragStart = (e, item) => {
        e.stopPropagation();
        e.cancelBubbles = true;
        if(e.target.classList.contains('isCard')){
            draggedCardNode.current = e.target;
            draggedCardNode.current.addEventListener('dragend', handleDragEnd)
            draggedItem.current = {...item};
            // item contains card, index, column, {cards} list
            //dispatch({type: 'set.draggedcard', payload: {...item, target: e.target}})
            // this takes the dragged over element ans send it up to teh parent, also add a function taht when fired reports back to this component how to shuffle between the dragged
            setDraggedOver({...item, target: e.target});
            toggleReceiving();
            setTimeout(() => {
                setDragging(true); 
            }, 0);
            
        }
    }

    // do swap 
    const swapArrayElements = (a, x, y) => {
        if (a.length === 1) return a;
        a.splice(y, 1, a.splice(x, 1, a[y])[0]);
        return a;
    };
    
    const handleDragEnter = (e, targetItem) => {
        // set entering target
        if(e.target.classList.contains('isCard')){
            e.stopPropagation();
            e.preventDefault();
        }

        if(!enteringTarget){
            setEnteringTarget(true);
            enteredItem.current = targetItem.index;
        } 
        // set it that not same element in same place
        if(
            targetItem.index !== draggedItem.current.index && 
            draggedItem.current.column === targetItem.column &&
            theDreaggedItem.current !== draggedItem.current.index
            ){
            theDreaggedItem.current = draggedItem.current.index;
            const swapped = swapArrayElements(Cards, targetItem.index, draggedItem.current.index);
            setCards([...swapped]);

            dispatch({
                type: 'update.columncardreset', 
                payload: 
                    {
                        index: targetItem.column,
                        cardIndex: targetItem.index,
                        cards: swapped
                    },
                save: {itemName: 'workspace'}
            });
                // is between columns 
        }else if(draggedItem.current.column !== targetItem.column){
            console.log(draggedItem.current.column, targetItem.column);
        } 
        
    }

    const onHandleDragLeave = (e) => {
        if(enteringTarget){
            setEnteringTarget(false);
        }
    }

    const handleDragEnd = (e) => {
        //console.log(dragging);
        setDragging(false);
        setEnteringTarget(false);

        draggedCardNode.current.removeEventListener('dragend', handleDragEnd);
        draggedCardNode.current = null;
        draggedItem.current = null;

        console.log('drag ended');
    }
    
    const getStyles = (item) => {
        
        if (draggedItem.current.column === item.column && draggedItem.current.index === item.index) {
            return "bg-light isDragging"
        }else if(draggedItem.current.index !== item.index && item.index === enteredItem.current){
            return "bg-light indicateEntering"
        }
        return "bg-light"
    }

    
    
    /*
        structure of cards
        [{title: '', content: ''}, {}]

        // structure of columns
        [{title: 'my Column'}, {cards: [{title: '', content: ''}, {}]} ]
    */

    if(Cards.length && cardsChanges){
        return Cards.map((card, index) => {
            return (
                <div 
                    id={`#_column_${index}_${column}`}
                    draggable={editing?false:true} 
                    data-cardcolumnindex={column} 
                    data-cardcard={`${JSON.stringify(card)}`}
                    card-cardindex={index}
                    onDragStart={(e) => handletDragStart(e, {card, index, Cards, column})}
                    onDragEnter={dragging ? (e) => handleDragEnter(e, {card, index, Cards, column}): null}
                    onDragLeave={(e) => onHandleDragLeave(e)}
                    className={`card draggable-card rounded-3 position-relative isCard ${dragging?getStyles({column, index}):"bg-light"} ${enteringTarget?getStyles({column, index}):"bg-light"}`} 
                    key={index}>
                    <h6 className="card-header border-bottom-0 bg-transparent"><span>{card.title}</span><div className='d-inline edit-or-save-card'>
                        <div 
                            title='Movable'
                            className='draggable position-absolute p-2 bg-light float-end rounded-3 border-0 text-muted'><i className="bi bi-grip-horizontal "></i>
                        </div>
                        <button 
                            data-cardindex={index}
                            data-cards={JSON.stringify(Cards)}
                            data-carddata={JSON.stringify(card)}
                            data-columnindex={column}
                            className='btn btn-sm btn-outline-danger delete-column-card float-end rounded-circle border-0 me-4'><i className="bi bi-x"></i>
                        </button>
                        <button 
                            data-cardindex={index}
                            data-cards={JSON.stringify(Cards)}
                            data-carddata={JSON.stringify(card)}
                            data-columnindex={column}
                            className='btn btn-sm btn-outline-primary edit-column-card float-end rounded-circle border-0 me-2'><i className="bi bi-pencil-square"></i>
                        </button>
                        
                     </div></h6>
                    <div className="card-body">
                        <p className="card-text">{card?.content ? card?.content: '' }</p>
                    </div>
                    <div className='card-footer border-top-0 bg-transparent'>
                        <div className='d-inline float-start'>
                            <img src='https://i.pravatar.cc/20' className='rounded-circle img-thumbnail' />
                            <strong className='text-muted'> {user.name}</strong>
                        </div>
                        <div className='d-inline float-end text-muted'><small>{moment((new Date(card.date))).fromNow()}</small></div>
                    </div>
                </div>
            )
        });
    }else{
     return (<></>);
    }
}