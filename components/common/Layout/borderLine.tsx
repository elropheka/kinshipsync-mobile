import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BorderLine = () => {
  return (
    // <View>
      <Svg width={321} height={28} viewBox="0 0 321 28" fill="none">
            <Text>BorderLine</Text>

        <Path d="M1 1L24 27L47.25 27L89.5 27L174 27L320.5 27" stroke="black" />
      </Svg>
    // </View>
  );
};

export default BorderLine;
