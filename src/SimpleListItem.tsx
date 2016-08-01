import * as React from 'react';
import { ListItem } from 'material-ui/List';

const SimpleListItemInnerDivStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    position: 'relative'
}

export default class SimpleListItem extends React.Component<void, void> {
    public render(): JSX.Element {
        return (
            <ListItem innerDivStyle={SimpleListItemInnerDivStyle} disabled>
                {this.props.children}
            </ListItem>
        );
    }
}