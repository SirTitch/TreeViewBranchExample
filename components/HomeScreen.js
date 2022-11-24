import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ObjectId} from 'bson';
import EStyleSheet from 'react-native-extended-stylesheet';
import DeviceInfo from 'react-native-device-info';
import TreeViewComponent from './TreeViewComponent';
const entireScreenWidth = Dimensions.get('window').width;
const entireScreenHeight = Dimensions.get('window').height;
const rem =
  entireScreenWidth > entireScreenHeight
    ? entireScreenHeight / 380
    : entireScreenWidth / 380;

EStyleSheet.build({$rem: rem});
const isTablet = DeviceInfo.isTablet();

// Tree Level Object
//{
//  _id: objectId
//  name: string
//  branches: []
//}

// Branch Object
//{
//    _id: ObjectId
//    name: string
//    level: int
//    branches: []
//}

const level1_id = new ObjectId();
const level2_id = new ObjectId();
const level3_id = new ObjectId();
let branch1_id = new ObjectId();
let branch2_id = new ObjectId();
let allBranches = [
  {
    _id: branch1_id,
    name: 'Branch A',
    level: 1,
    branches: [],
  },
  {
    _id: branch2_id,
    name: 'Branch B',
    level: 2,
    branches: [branch1_id],
  },
  {
    _id: new ObjectId(),
    name: 'Branch C',
    level: 3,
    branches: [branch2_id],
  },
  {
    _id: new ObjectId(),
    name: 'Branch D',
    level: 0,
    branches: [],
  },
  {
    _id: new ObjectId(),
    name: 'Branch E',
    level: 0,
    branches: [],
  },
  {
    _id: new ObjectId(),
    name: 'Branch F',
    level: 0,
    branches: [],
  },
  {
    _id: new ObjectId(),
    name: 'Branch G',
    level: 0,
    branches: [],
  },
  {
    _id: new ObjectId(),
    name: 'Branch G#',
    level: 0,
    branches: [],
  },
  {
    _id: new ObjectId(),
    name: 'Branch A#',
    level: 0,
    branches: [],
  },
];
let allLevels = [
  {
    _id: level1_id,
    name: 'Level 1',
    level: 1,
    branches: [allBranches[0]],
  },
  {
    _id: level2_id,
    name: 'Level 2',
    level: 2,
    branches: [allBranches[1]],
  },
  {
    _id: level3_id,
    name: 'Level 3',
    level: 3,
    branches: [allBranches[2]],
  },
];
class HomeScreen extends Component {
  state = {
    arrayOfUsedBranches: [],
    tree: [],
    leftBranches: [],
  };

  componentDidMount() {
    this.buildTree();
  }

  buildTree = () => {
    let allLevelsLinks = allLevels;
    let branchesArr = [];
    let maxLevel = 0;
    let parentLevel = '';
    for (let i = 0; i < allLevelsLinks.length; i += 1) {
      if (
        allLevelsLinks[i].level > maxLevel &&
        allLevelsLinks[i].branches &&
        allLevelsLinks[i].branches.length > 0
      ) {
        parentLevel = allLevelsLinks[i]._id;
        maxLevel = allLevelsLinks[i].level;

        branchesArr = [];
        for (let branch of allLevelsLinks[i].branches) {
          branchesArr.push(branch._id);
        }
      }
    }

    if (branchesArr.length > 0) {
      let branches = allBranches.filter(branch => branch.level <= maxLevel);
      let tree = this.createMapToDisplay(branchesArr, parentLevel, branches);
      let leftBranches = [];
      for (let branch of allBranches) {
        if (!this.state.arrayOfUsedBranches.includes(`${branch._id}`)) {
          const data = {
            id: branch._id,
            name: branch.name,
            children: [],
          };
          leftBranches.push(data);
          let arr = this.state.arrayOfUsedBranches;
          arr.push(`${branch._id}`);
          this.setState({arrayOfUsedBranches: arr});
        }
      }

      this.setState({
        tree: tree,
        leftBranches,
      });
    }
  };

  createMapToDisplay = (ids, level, branches) => {
    const treeLevel = [];
    const arrayOfUsedID = [];
    ids.forEach(id => {
      if (arrayOfUsedID.includes(`${id}`)) {
        return;
      }
      arrayOfUsedID.push(`${id}`);
      let children = [];
      branches.forEach(branch => {
        if (branch._id.toString() === id.toString()) {
          if (branch.branches.length > 0 && branch.level !== 0) {
            let newBranches = branches.filter(
              newBranch => newBranch.level <= branch.level,
            );
            children = this.createMapToDisplay(
              branch.branches,
              branch._id,
              newBranches,
            );
          }

          const data = {
            id: branch._id,
            name: branch.name,
            children,
            parentLevel: level,
          };
          treeLevel.push(data);

          let arr = this.state.arrayOfUsedBranches;
          arr.push(branch._id.toString());
          this.setState({arrayOfUsedBranches: arr});
        }
      });
    });
    return treeLevel;
  };

  render() {
    return (
      <View style={{flexDirection: 'column', minHeight: 75}}>
        {this.state.tree !== [] && (
          <>
            <TreeViewComponent
              tree={this.state.tree} // defined above
              nodeButtons={[]}
              initialExpanded={true}
              hasButtons={false}
              isConsolidation={true}
              branches={allBranches}
              levels={allLevels}
            />
          </>
        )}
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({});
