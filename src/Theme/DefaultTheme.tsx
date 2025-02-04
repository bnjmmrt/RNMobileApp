// // Default Theme

// const DefaultTheme = {
//     dark: false,
//     colors: {
//         primary: 'rgb(0, 122, 255)',
//         background: '#F9F4EC',
//         text: 'rgb(28, 28, 30)',
//         btnbackgroundcolor:'rgb(78 78 180)',
//         appBackground:'#F9F4EC',
//         emailBtnColor:'#FFFFFF',
//         blackWhite:'#000000',
//         blackColor:'#000000',
//         whiteColor:'#FFFFFF'
//     }
// };
 
// export default DefaultTheme;

type Theme = any;
const DefaultTheme: Theme = {
    dark: false,
    colors: {
        primary: 'rgb(0, 122, 255)',
        background: '#F9F4EC',
        text: 'rgb(28, 28, 30)',
        btnbackgroundcolor: 'rgb(78 78 180)',
        appBackground: '#F9F4EC',
        emailBtnColor: '#FFFFFF',
        blackWhite: '#000000',
        blackColor: '#000000',
        whiteColor: '#FFFFFF',
        appBlueColor:'#4E4EB4'
    },
    fonts: {
        regular: 'System',
        medium: 'System-Medium',
        bold: 'System-Bold',
    },
};

export default DefaultTheme;
