import React from "react";
import { PrintNavigator } from "./PrintNavigator";
import { PrintColumns } from "./PrintColumns";

// this method helps us to manage workspace printing
export const PrintWorkspaces = ({ workspace, user, constants }) => {
    return (
        <>
        {
        (Array.isArray(workspace) && workspace.length) ? 
        workspace.map((works, index) => { 
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

        }):
        <></>
        }
        </>
    )
}