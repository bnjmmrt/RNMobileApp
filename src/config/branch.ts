import branch from 'react-native-branch';

interface BranchLinkParams {
  title?: string;
  description?: string;
  screen?: 'profile' | 'event';
  id?: string;
  type?: 'user' | 'event';
  metadata?: Record<string, string>;
}

interface BranchLinkOptions {
  feature?: 'share' | 'referral' | 'invite' | 'promotion';
  channel?: 'app' | 'email' | 'sms' | 'facebook' | 'twitter';
}

export const createBranchLink = async (
  params: BranchLinkParams,
  options: BranchLinkOptions = { feature: 'share', channel: 'app' },
) => {
  try {
    const branchUniversalObject = await branch.createBranchUniversalObject(
      'canonicalIdentifier',
      {
        locallyIndex: true,
        title: params.title || 'Rumor App',
        contentDescription: params.description || 'Join me on Rumor',
        contentMetadata: {
          customMetadata: {
            title: params.title || '',
            description: params.description || '',
            screen: params.screen || '',
            id: params.id || '',
            type: params.type || '',
          },
        },
      },
    );

    const { url } = await branchUniversalObject.generateShortUrl({
      feature: options.feature,
      channel: options.channel,
    });
    return url;
  } catch (error) {
    console.error('Error creating Branch link:', error);
    return null;
  }
};
