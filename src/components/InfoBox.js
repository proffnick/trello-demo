import React from 'react';
import reactDOM from 'react-dom';
import { TrelloContext } from '../context/Context';

// in the absence of typestcript, we expect Content props to be a react component

export const InfoBox = ({ Content = React.FC, title = '', action = '' }) => {
    // handle close actions
    const modalRef = React.useRef();
    const [infoBoxModel, setInfoBoxModel] = React.useState(null);

    // use these to clean up when info box opens or close
    const { hideInfoBox } = React.useContext(TrelloContext);

    const handleAction = React.useCallback(() => {
        
        if(action){
            switch(action){
                case 'hide':
                    modalRef.current.current.hide();


                break;
                case 'show':
                    modalRef.current.current.show();
                    handleWhenInfoBoxCloses();
                break;     
            }
        }

    }, [action]);

    const handleWhenInfoBoxCloses = React.useCallback(() => {
        if(infoBoxModel){
            infoBoxModel.addEventListener('hide.bs.modal', () => {
                hideInfoBox(Content, title, '');
            });
        }
    }, [infoBoxModel]);



    React.useEffect(() => {
        handleAction();
        if(!infoBoxModel){
           setInfoBoxModel(document.getElementById('trelloModal')); 
        }
        if(!modalRef.current && infoBoxModel){
            modalRef.current = {current: new window.bootstrap.Modal(infoBoxModel, {keyboard: false})};
        }
        

    }, [handleAction, infoBoxModel ]);





    return(
        reactDOM.createPortal(
            <div className="modal fade border-0" id="trelloModal" tabIndex="-1" aria-labelledby="trelloModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content pb-4 border-0">
                        <div className="modal-header border-bottom-0">
                            <h5 className="modal-title text-muted">{title}</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                data-bs-dismiss="modal" 
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Content />
                        </div>
                    </div>
                </div>
            </div>, 
            document.getElementById('modals')
            )
    );
}