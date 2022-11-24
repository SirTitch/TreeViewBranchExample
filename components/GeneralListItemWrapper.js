import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Shadow} from 'react-native-shadow-2';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();
const colorScheme = 'dark';
const entireScreenWidth = Dimensions.get('window').width;
const entireScreenHeight = Dimensions.get('window').height;
const rem =
  entireScreenWidth > entireScreenHeight
    ? entireScreenHeight / 380
    : entireScreenWidth / 380;

EStyleSheet.build({$rem: rem});
class GeneralListItemWrapper extends Component {
  render() {
    return (
      <Shadow
        distance={5}
        startColor={'#565D5E4D'}
        endColor={'#565D5E00'}
        viewStyle={{width: '100%'}}
        radius={1}
        sides={['top', 'right', 'bottom']}
        corners={['topRight', 'bottomRight']}>
        <View
          style={[
            styles.ItemContainer,
            {
              minHeight:
                this.props.size == 'small'
                  ? isTablet
                    ? 60
                    : 60
                  : isTablet
                  ? 80
                  : 100,
            },
          ]}>
          <View style={styles.ListIndicator} />
          <TouchableHighlight
            underlayColor={'#00a3b455'}
            style={[styles.TitleContainer, {justifyContent: 'center'}]}
            onPress={this.props.titlePressFunc}
            disabled={!this.props.isTextTouchable}>
            <Text
              style={styles.TitleText}
              adjustsFontSizeToFit={true}
              numberOfLines={2}
              minimumFontScale={0.7}>
              {this.props.title}
            </Text>
          </TouchableHighlight>
          <View style={styles.ChildrenWrapper}>{this.props.children}</View>
        </View>
      </Shadow>
    );
  }
}

export default GeneralListItemWrapper;

const styles = StyleSheet.create({
  ItemContainer: {
    flexDirection: 'row',
    borderColor: '#565D5E80',
    paddingHorizontal: isTablet ? 20 : 10,
    minHeight: isTablet ? 80 : 100,
    position: 'relative',
  },
  ListIndicator: {
    position: 'absolute',
    height: '100%',
    width: 5,
    left: 0,
    top: 0,
    backgroundColor: '#00A0B0',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  TitleContainer: {
    flex: 1,
  },
  TitleText: {
    color: colorScheme == 'dark' ? 'white' : '#222',
    fontSize: EStyleSheet.value('8rem'),
  },
  ChildrenWrapper: {
    width: '65%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
