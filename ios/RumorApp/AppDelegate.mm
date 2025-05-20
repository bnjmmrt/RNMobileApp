#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <AVFoundation/AVFoundation.h>
#import <IntercomModule.h>
#import <RNBranch/RNBranch.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [application registerForRemoteNotifications];
  // Initialize Intercom
  [IntercomModule initialize:@"ios_sdk-31760fd6c352d4170684472b33f29d286cd4a1a1" withAppId:@"ucnhg0me"];
  
  // Initialize Branch.io
  #if DEBUG
    [RNBranch useTestInstance];
  #endif
  [RNBranch enableLogging];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  
  // Prevent screenshots and recordings
  // [self preventScreenCapture];

  self.moduleName = @"RumorApp";
  self.initialProps = @{};
  bool didFinish = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  return didFinish;
}

- (void)application:(UIApplication *)application
 didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
 [FIRMessaging messaging].APNSToken = deviceToken;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Handle URL schemes
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    // Try Branch.io first
    if ([RNBranch application:app openURL:url options:options]) {
        return YES;
    }
    
    // Handle direct URL schemes
    if ([[url scheme] isEqualToString:@"therumorapp"] || [[url scheme] isEqualToString:@"rumor"]) {
        // Handle your app's URL scheme
        return YES;
    }
    
    return NO;
}

// Handle Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    // Try Branch.io first
    if ([RNBranch continueUserActivity:userActivity]) {
        return YES;
    }
    
    // Handle Universal Links
    if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
        NSURL *url = userActivity.webpageURL;
        // Handle your Universal Link
        return YES;
    }
    
    return NO;
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end


