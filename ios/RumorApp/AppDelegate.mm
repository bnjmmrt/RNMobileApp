#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <AVFoundation/AVFoundation.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [application registerForRemoteNotifications];
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

- (void)preventScreenCapture {
  if (@available(iOS 13.0, *)) {
    for (UIWindow *window in [UIApplication sharedApplication].windows) {
      window.hidden = NO;
      
      // Use a secure layer to block screenshots
      UIView *secureView = [[UIView alloc] initWithFrame:window.bounds];
      secureView.backgroundColor = [UIColor blackColor];
      secureView.alpha = 0.0; // Transparent but blocks screenshots
      secureView.tag = 9999;
      [window addSubview:secureView];
      [window bringSubviewToFront:secureView];
    }
  }

  // Detect screen recording
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(screenRecordingStatusChanged)
                                               name:UIScreenCapturedDidChangeNotification
                                             object:nil];
  [self screenRecordingStatusChanged];
}

- (void)screenRecordingStatusChanged {
  if (@available(iOS 11.0, *)) {
    BOOL isRecording = [UIScreen mainScreen].isCaptured;
    NSLog(@"Screen recording detected: %@", isRecording ? @"YES" : @"NO");

    for (UIWindow *window in [UIApplication sharedApplication].windows) {
      UIView *secureOverlay = [window viewWithTag:9999];

      if (isRecording) {
        if (!secureOverlay) {
          UIView *secureView = [[UIView alloc] initWithFrame:window.bounds];
          secureView.backgroundColor = [UIColor blackColor];
          secureView.alpha = 1.0; // Make it visible when recording
          secureView.tag = 9999;
          [window addSubview:secureView];
        } else {
          secureOverlay.alpha = 1.0; // Ensure it's fully visible
        }
      } else {
        if (secureOverlay) {
          secureOverlay.alpha = 0.0; // Hide when not recording
        }
      }
    }
  }
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


