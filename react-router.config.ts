// react-router.config.ts
import type {Config} from '@react-router/dev/config';
import {hydrogenPreset} from '@shopify/hydrogen/react-router-preset';

export default {
  presets: [hydrogenPreset()],
  future: {
    v8_middleware: true,
  },
} satisfies Config;
