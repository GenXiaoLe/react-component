import React from 'react';
import { RouterContext } from '../../plugins/component/routerContext';

export function useParams(props) {
    return React.useContext(RouterContext).match.params;
}