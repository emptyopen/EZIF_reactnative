import React from 'react';
import * as Icon from '@expo/vector-icons';

export default class CustomIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={this.props.size}
        style={{ marginTop: 2 }}
        color={this.props.color}
      />
    );
  }
}
