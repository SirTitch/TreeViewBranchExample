import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ObjectId} from 'bson';
import EStyleSheet from 'react-native-extended-stylesheet';
import DeviceInfo from 'react-native-device-info';
import TreeView from 'react-native-final-tree-view';
import GeneralListItemWrapper from './GeneralListItemWrapper';
import Svg, {Line, Path} from 'react-native-svg';

const isTablet = DeviceInfo.isTablet();
const blueColor = '#333aff';
const deviceContainerColour = '#141414';

class TreeViewComponent extends Component {
  state = {
    tree: [],
    branches: this.props.branches,
    levels: this.props.levels,
  };

  componentDidMount() {
    if (this.props.tree != undefined) {
      let tree = this.props.tree;
      this.setState({
        tree: tree,
      });
    }
    if (this.props.branches != undefined) {
      let branches = this.props.branches;
      this.setState({
        branches: branches,
      });
    }
    if (this.props.levels != undefined) {
      let levels = this.props.levels;
      this.setState({
        levels: levels,
      });
    }
  }

  componentDidUpdate() {
    if (this.props.tree != undefined && this.props.tree != this.state.tree) {
      let tree = this.props.tree;
      this.setState({
        tree: tree,
      });
    }
    if (
      this.props.branches != undefined &&
      this.props.branches != this.state.branches
    ) {
      let branches = this.props.branches;
      this.setState({
        branches: branches,
      });
    }
    if (
      this.props.levels != undefined &&
      this.props.levels != this.state.levels
    ) {
      let levels = this.props.levels;
      this.setState({
        levels: levels,
      });
    }
  }

  sortTreeAlphabetically = array => {
    array.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return array;
  };

  isFirstChild = (parent, child) => {
    // this takes in the node and the parent level above and checks to see if the id matches the first id in the array to tell if its the first child in the tree
    let isFirstChild = false;
    let actualParent = this.state.branches.filter(
      branch => branch._id.toString() == new ObjectId(child.id).toString(),
    )[0];
    if (actualParent != undefined) {
      if (actualParent.branches[0] != undefined) {
        if (actualParent.branches[0] == parent.id) {
          isFirstChild = true;
        }
      } else {
        isFirstChild = true;
      }
    }
    return isFirstChild;
  };

  isLastChild = (parent, child) => {
    // Same as first, but it takes the parent and child node and figures out if the child node is the last node in the tree
    let isFirstChild = false;
    let actualParent = this.state.branches.filter(
      branch => branch._id.toString() == new ObjectId(parent.id).toString(),
    )[0];
    if (actualParent != undefined) {
      if (
        actualParent.branches[actualParent.branches.length - 1] != undefined
      ) {
        if (
          actualParent.branches[actualParent.branches.length - 1].toString() ==
          child.id.toString()
        ) {
          isFirstChild = true;
        }
      }
    }
    return isFirstChild;
  };

  getParentOfParent = parent => {
    for (let branch of this.state.branches) {
      let counter = 1;
      for (let ascBranches of branch.branches) {
        if (ascBranches == parent.id) {
          if (counter == branch.branches.length) {
            return {
              id: branch._id.toString(),
              name: branch.name,
              isLastChild: true,
            };
          } else {
            return {
              id: branch._id.toString(),
              name: branch.name,
              isLastChild: false,
            };
          }
        }
        counter++;
      }
    }
  };

  getParentNode = (node, thisLevel) => {
    // A recursive function which will loop through all the children in a node and check it against the node sent through,
    // and once it finds the node in amongst the children of a node, it will send back the node which will be the parent node of the node sent through
    if (thisLevel.children.length > 0) {
      for (let child of thisLevel.children) {
        if (child.id == node.id) {
          return thisLevel;
        } else {
          this.getParentNode(node, child);
        }
      }
    } else {
      return undefined;
    }
  };

  getIndicator = (isExpanded, hasChildrenNodes) => {
    if (!hasChildrenNodes) {
      return '- ';
    } else if (isExpanded) {
      return '- ';
    } else {
      return '+ ';
    }
  };

  renderNode = ({node, level, isExpanded, hasChildrenNodes}) => {
    const [actualHeight, setHeight] = useState(100);
    const [originalHeight, setOriginalHeight] = useState(0);

    const returnZones = height => {
      let zones = [];
      let isFirstChild = false;
      let prevLevel;
      let isLastParent = false;
      let isLastChild = false;

      //Filter through all the branches and find the parent branch if it exists and store it in a temporary variable
      let tempPrevLevel = this.state.branches.filter(
        branch =>
          branch._id.toString() == new ObjectId(node.parentLevel).toString(),
      )[0];

      if (tempPrevLevel != undefined) {
        //If the parent branch exists, transform it into a more readable format for the renderNode function.
        let data = {
          id: tempPrevLevel._id.toString(),
          name: tempPrevLevel.name,
          isLastChild: false,
        };
        prevLevel = data;
        prevLevel.isLastChild = this.isLastChild(prevLevel, node); //Run this function to define if the parent branch is a last branch, so it knows to draw a connecting line or not
      }

      if (prevLevel != undefined) {
        //Figure out where in the tree the current node falls, so it knows which connecting lines to draw
        isLastChild = this.isLastChild(prevLevel, node);
        isFirstChild = this.isFirstChild(node, prevLevel);

        //Recursively go up the tree and figure out how many parents there are
        let listOfParents = [prevLevel];
        if (this.props.isSingleLevel != true) {
          for (let i = 0; i < level; i++) {
            let pop = this.getParentOfParent(listOfParents[i]);
            if (pop != undefined) {
              listOfParents.push(pop);
            }
          }
        }

        //Loop through the list of parents and draw the connecting lines defined by the variables
        let lop = listOfParents;
        for (let i = 0; i < lop.length; i++) {
          if (lop[i] != undefined) {
            let bool = false;
            let showTopLine = false;
            let isAllLast = true;
            for (let k = 0; k < lop.length; k++) {
              if (!lop[k].isLastChild) {
                isAllLast = false;
              }
            }
            if (lop[i + 1] != undefined && lop[i].isLastChild == true) {
              showTopLine = true;
            }
            if (i == level - 1) {
              bool = true;
            }

            zones.push(
              <View style={{width: 20}} key={i.toString()}>
                <View style={{alignSelf: 'center'}}>
                  <Svg height={`${height / 2}`} width="20">
                    {!showTopLine && (
                      <Line
                        x1="10"
                        y1="0"
                        x2="10"
                        y2={`${height / 2}`}
                        stroke={blueColor}
                        strokeWidth="2"
                      />
                    )}

                    {i == level - 1 && (
                      <Line
                        x1="10"
                        y1={`${height / 2}`}
                        x2="20"
                        y2={`${height / 2}`}
                        stroke={blueColor}
                        strokeWidth="2"
                      />
                    )}
                  </Svg>

                  <Svg height={`${height / 2}`} width="20">
                    {/* branch line */}
                    {/* Tree Trunk */}
                    {(!lop[i].isLastChild || (bool && !isLastChild)) && (
                      <Line
                        x1="10"
                        y1="0"
                        x2="10"
                        y2={`${height / 2}`}
                        stroke={blueColor}
                        strokeWidth="2"
                      />
                    )}
                  </Svg>
                </View>
              </View>,
            );
          }
        }
      }
      return <>{zones}</>;
    };

    const renderButton = height => {
      let svgHeight = `${(height / 5) * 2}`;
      return (
        <>
          <View style={{alignSelf: 'center'}}>
            {/* Line above to keep it in line */}
            <Svg height={svgHeight} width="20">
              <Line
                x1="10"
                y1="0"
                x2="10"
                y2={svgHeight}
                stroke={blueColor}
                strokeWidth="0"
              />
            </Svg>
            {/* THe Plus/Minus Icon */}
            <View
              style={{
                borderWidth: 2,
                backgroundColor:
                  isExpanded || !hasChildrenNodes
                    ? deviceContainerColour
                    : blueColor,
                borderColor: blueColor,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              {isExpanded || !hasChildrenNodes ? (
                <Svg height="10" width="10">
                  <Path
                    d="M 1 4 L 9 4 C 10 4 10 5 9 5 L 1 5 C 0 5 0 4 1 4"
                    fill="none"
                    stroke="white"
                  />
                </Svg>
              ) : (
                // <ChangewayIcon name={'close-minus'} size={10} />
                <Svg height="10" width="10">
                  <Path
                    d="M 5 1 C 5 0 6 0 6 1 V 5 L 10 5 C 11 5 11 6 10 6 L 6 6 L 6 10 C 6 11 5 11 5 10 L 5 6 L 1 6 C 0 6 0 5 1 5 L 5 5 L 5 1"
                    fill="none"
                    stroke="white"
                  />
                </Svg>
              )}
            </View>

            {/* Line to connect to any children nodes */}
            {hasChildrenNodes && isExpanded ? (
              <Svg height={svgHeight} width="20">
                <Line
                  x1="10"
                  y1="0"
                  x2="10"
                  y2={svgHeight}
                  stroke={blueColor}
                  strokeWidth="2"
                />
              </Svg>
            ) : (
              <Svg height={svgHeight} width="20">
                <Line
                  x1="10"
                  y1="0"
                  x2="10"
                  y2={svgHeight}
                  stroke={blueColor}
                  strokeWidth="0"
                />
              </Svg>
            )}
          </View>
          {/* Connect the plus minus to the board component */}
          <Svg height={`${height}`} width="10">
            <Line
              x1="0"
              y1={`${height / 2}`}
              x2="10"
              y2={`${height / 2}`}
              stroke={blueColor}
              strokeWidth="1"
            />
          </Svg>
        </>
      );
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: '2%',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          setHeight(height);
        }}>
        {/* Zones is the indent for each branch */}
        {returnZones(actualHeight)}
        {/* this is the plus/minus button and the item display */}
        <View style={{flex: 1, flexDirection: 'row'}}>
          {renderButton(actualHeight)}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <GeneralListItemWrapper
              title={node.name}
              size={'small'}
              height={actualHeight}
              isTextTouchable={false}
              titlePressFunc={() => {}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
                onLayout={event => {
                  const {height} = event.nativeEvent.layout;
                  if (height < originalHeight) {
                    setHeight(100);
                  }
                  setOriginalHeight(height);
                }}>
                {((this.props.nodeButtons != undefined &&
                  this.props.isSingleLevel &&
                  level != 0) ||
                  this.props.hasButtons) && (
                  <View
                    style={{
                      flexDirection: isTablet ? 'row' : 'column',
                      width: '100%',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    {this.props.nodeButtons.map((value, index) => (
                      <View style={{paddingHorizontal: 5}}>
                        <TouchableOpacity
                          style={[
                            styles.xMatrixActionButton2,
                            {
                              borderWidth: StyleSheet.hairlineWidth,
                              borderColor: '#000000',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor:
                                value.colour != undefined
                                  ? value.colour
                                  : '#00000000',
                            },
                          ]}
                          onPress={() => {
                            value.function(node);
                          }}
                          disabled={this.state.openingScreen}>
                          <Text
                            style={{
                              color:
                                value.colour != undefined
                                  ? 'white'
                                  : deviceTextColour,
                              textAlign: 'center',
                              paddingHorizontal: '2%',
                            }}>
                            {value.text}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </GeneralListItemWrapper>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{flexDirection: 'column', minHeight: 75}}>
        {this.state.tree != undefined && (
          <TreeView
            data={this.state.tree} // defined above
            getCollapsedNodeHeight={() => 'auto'}
            onNodePress={({node, level}) => {
              if (this.props.nodePressHandler != undefined)
                this.props.nodePressHandler(node, level);
            }}
            renderNode={this.renderNode}
            initialExpanded={this.props.initialExpanded}
          />
        )}
      </View>
    );
  }
}

export default TreeViewComponent;
