import { Dimensions, PixelRatio } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

// Retrieve initial screen's width
let screenWidth: number = Dimensions.get('window').width;

// Retrieve initial screen's height
let screenHeight: number = Dimensions.get('window').height;

// Base dimensions (reference screen size, e.g., iPhone 11 Pro Max)
const guidelineBaseWidth = 393;
const guidelineBaseHeight = 852;

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string | number} widthPercent The percentage of screen's width that UI element should cover
 *                                      along with the percentage symbol (%).
 * @return {number} The calculated dp depending on current device's screen width.
 */
const Wp = (widthPercent: string | number): number => {
  // Parse string percentage input and convert it to number.
  const elemWidth: number =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that corresponds to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string | number} heightPercent The percentage of screen's height that UI element should cover
 *                                      along with the percentage symbol (%).
 * @return {number} The calculated dp depending on current device's screen height.
 */
const Hp = (heightPercent: string | number): number => {
  // Parse string percentage input and convert it to number.
  const elemHeight: number =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that corresponds to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

/**
 * Event listener function that detects orientation change (every time it occurs) and triggers
 * screen rerendering. It does that, by changing the state of the screen where the function is
 * called. State changing occurs for a new state variable with the name 'orientation' that will
 * always hold the current value of the orientation after the 1st orientation change.
 * Invoke it inside the screen's constructor or in componentDidMount lifecycle method.
 * @param {React.Component} that Screen's class component this variable. The function needs it to
 *                                invoke setState method and trigger screen rerender (this.setState()).
 */
const listenOrientationChange = (that: React.Component): void => {
  Dimensions.addEventListener(
    'change',
    (newDimensions: { window: { width: number; height: number } }) => {
      // Retrieve and save new dimensions
      screenWidth = newDimensions.window.width;
      screenHeight = newDimensions.window.height;

      // Trigger screen's rerender with a state update of the orientation variable
      that.setState({
        orientation: screenWidth < screenHeight ? 'portrait' : 'landscape',
      });
    },
  );
};

/**
 * Wrapper function that removes orientation change listener and should be invoked in
 * componentWillUnmount lifecycle method of every class component (UI screen) that
 * listenOrientationChange function has been invoked. This should be done in order to
 * avoid adding new listeners every time the same component is re-mounted.
 */
const removeOrientationListener = (): void => {
  Dimensions.removeEventListener('change', () => { });
};

// Scale width based on screen size
const horizontalScale = (size: number) =>
  (screenWidth / guidelineBaseWidth) * size;

// Scale height based on screen size
const verticalScale = (size: number) =>
  (screenHeight / guidelineBaseHeight) * size;

// Scale radius with moderate scaling (default factor = 0.5)
const radiusScale = (size: number, factor: number = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

// Scale margin and padding (horizontal)
const horizontalMarginScale = (size: number, factor: number = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

// Scale margin and padding (vertical)
const verticalMarginScale = (size: number, factor: number = 0.5) =>
  size + (verticalScale(size) - size) * factor;

// For Font Size
const fontScale = (percent: number) => {
  return RFValue(percent, guidelineBaseHeight);
};

export {
  Wp,
  Hp,
  listenOrientationChange,
  removeOrientationListener,
  screenHeight,
  screenWidth,
  horizontalScale,
  verticalScale,
  radiusScale,
  horizontalMarginScale,
  verticalMarginScale,
  fontScale,
};
