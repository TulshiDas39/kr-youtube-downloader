import React from 'react';
import { Route, Routes  } from 'react-router-dom';
import './layout.scss'
import { UiRoutes } from '../../lib/UiRoutes';
import { Main } from '..';

function LayoutComponent() {
    return (
        <div id="layout" className="d-flex flex-column h-100">            
            <div className="" style={{height:`${100}%`}}>
                <Routes >
                    <Route path={UiRoutes.Root} element={<Main />} />
                </Routes >
            </div>
            
        </div>
    )

}

export const Layout = React.memo(LayoutComponent);