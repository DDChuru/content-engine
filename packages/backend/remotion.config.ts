import { Config } from '@remotion/cli/config';

Config.setEntryPoint('./src/remotion/Root.tsx');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setPublicDir('./src/remotion/public');
