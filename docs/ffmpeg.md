ffmpeg -i https://encrypt-k-vod.xet.tech/529d8d60vodtransbj1252524126/7097fa70243791576388304122/drm/v.f421220.m3u8\?start\=0\&end\=106799\&type\=mpegts\&sign\=363977de6c245400fcf5242382168275\&t\=63c2e000\&us\=ZTBUKGtfua /Users/liyunfu/Downloads/01.mp4







### 转码

```text
ffmpeg -i 1.mp4 -c:v copy -c:a copy -y 1.1.mp4
```
