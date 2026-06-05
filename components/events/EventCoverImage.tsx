import React from 'react';
import { Image, ImageProps, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Event } from '@/types/eventTypes';
import { getEventCoverImageSource, getEventCoverImageSourceFromUrl } from '@/utils/eventCoverUtils';

export const EVENT_COVER_ASPECT_RATIO = 16 / 9;

interface EventCoverImageProps extends Omit<ImageProps, 'source'> {
  event?: Pick<Event, 'coverImageUrl' | 'website'>;
  imageUrl?: string;
  source?: ImageSourcePropType;
  /** Fit image inside a fixed 16:9 frame without stretching the card layout. */
  contained?: boolean;
}

export class EventCoverImage extends React.Component<EventCoverImageProps> {
  public render(): React.ReactNode {
    return <EventCoverImageInner {...this.props} />;
  }
}

const EventCoverImageInner: React.FC<EventCoverImageProps> = ({
  event,
  imageUrl,
  source,
  contained = false,
  style,
  resizeMode,
  ...rest
}) => {
  const resolvedSource =
    source ??
    (event ? getEventCoverImageSource(event) : getEventCoverImageSourceFromUrl(imageUrl));

  const resolvedResizeMode = resizeMode ?? (contained ? 'contain' : 'cover');

  if (contained) {
    return (
      <View style={[styles.containedFrame, style]}>
        <Image
          source={resolvedSource}
          style={styles.containedImage}
          resizeMode={resolvedResizeMode}
          {...rest}
        />
      </View>
    );
  }

  return (
    <Image source={resolvedSource} style={style} resizeMode={resolvedResizeMode} {...rest} />
  );
};

const styles = StyleSheet.create({
  containedFrame: {
    width: '100%',
    aspectRatio: EVENT_COVER_ASPECT_RATIO,
    overflow: 'hidden',
  },
  containedImage: {
    width: '100%',
    height: '100%',
  },
});

export default EventCoverImage;
