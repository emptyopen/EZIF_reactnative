import * as React from 'react';
import { Text } from 'react-native';


export default (props) => {
  const defaultStyle = { fontFamily: 'raj-reg', color: 'black' };
  const incomingStyle = Array.isArray(props.style) ? props.style : [props.style];
  return <Text {...props} style={[defaultStyle, ...incomingStyle]} />;
};
