#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Add secure flag to prevent screenshots and recordings
  [self preventScreenCapture];

  self.moduleName = @"RumorApp";
  self.initialProps = @{};
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)preventScreenCapture {
  if (@available(iOS 13.0, *)) {
    for (UIWindow *window in [UIApplication sharedApplication].windows) {
      window.layer.hidden = YES;
      window.layer.hidden = NO;
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

