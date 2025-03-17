#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <AVFoundation/AVFoundation.h>
#import <IntercomModule.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [application registerForRemoteNotifications];
  // Initialize Intercom
  [IntercomModule initialize:@"ios_sdk-31760fd6c352d4170684472b33f29d286cd4a1a1" withAppId:@"ucnhg0me"];
  
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

@end


