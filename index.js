/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-get-random-values';
import App from './App';
import {name as appName} from './app.json';

import { v4 as uuidv4 } from 'uuid';

const uniqueId = uuidv4();
console.log('Generated UUID:', uniqueId);


AppRegistry.registerComponent(appName, () => App);
