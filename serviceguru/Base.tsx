import React, { ReactElement } from 'react';

import { Dimensions } from 'react-native';
import HTML from 'react-native-render-html';
import iframe from '@native-html/iframe-plugin';
import { WebView } from 'react-native-webview';

import { black } from 'theme/themeConfig';

const renderers = { iframe };
export const RenderHTML = (
  { text, fontSize = 14, trigger }: { text: string | undefined, fontSize?: number, trigger: boolean }
): ReactElement => {
  const computeEmbeddedMaxWidth = (availableWidth: number) => Math.min(availableWidth, 10);
  const textSmall = `${text?.slice(0, 170)}...`;
  return (
    <HTML source={{ html: trigger ? textSmall : text || '<p></p>' }}
          renderers={renderers}
          WebView={WebView}
          computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
          baseStyle={{ fontSize, lineHeight: 17, maxHeight: trigger ? 100 : '100%' }}
          renderersProps={{ iframe: { scalesPageToFit: true } }}
          contentWidth={Dimensions.get('window').width} />
  );
};
